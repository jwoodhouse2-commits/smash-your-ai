require('dotenv').config();

const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const path = require('path');
const fs = require('fs');

// --- Prompt library setup ---

const { initDatabase } = require('./prompts/database/init');
const { createAuthRouter } = require('./prompts/routes/auth');
const { createContentRouter } = require('./prompts/routes/content');
const { createAdminRouter } = require('./prompts/routes/admin');
const { createCheckoutRouter } = require('./prompts/routes/checkout');
const { createWebhookHandler } = require('./prompts/routes/webhook');
const { requirePaidPage } = require('./prompts/middleware/requirePaidPage');
const { requireAuth, userHasEntitlement, getUser } = require('./prompts/middleware/auth');
const { loadCourse } = require('./lib/course-loader');
const { renderTierPage, renderLessonPage } = require('./lib/course-render');
const { gradePrompt } = require('./lib/prompt-grader');
const { loadWorksheet, generateWorksheet, renderMarkdown, renderHtmlEmail } = require('./lib/worksheet');
const { runSandbox, validateRequest: validateSandboxRequest, AVAILABLE_MODELS: SANDBOX_MODELS, DEFAULT_MODELS: SANDBOX_DEFAULTS, isConfigured: sandboxConfigured } = require('./lib/model-sandbox');

const db = initDatabase();
const course = loadCourse(path.join(__dirname, 'course-content'));

function loadContent() {
  const contentDir = path.join(__dirname, 'prompts', 'content');
  const byId = new Map();
  const allItems = [];

  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const items = Array.isArray(data) ? data : data.items || [];

    for (const item of items) {
      byId.set(item.id, item);
      allItems.push(item);
    }
  }

  console.log(`Loaded ${allItems.length} content items from ${files.length} files`);
  return { byId, allItems };
}

const contentStore = loadContent();

// --- Express app ---

const app = express();

// Disable x-powered-by header
app.disable('x-powered-by');

// --- SEO: Override Replit's cache-control: private headers ---
// Replit sets "cache-control: private, max-age=0" on all responses,
// which tells Google the content is user-specific. This middleware
// sets public caching headers for HTML pages so Google will crawl them.
app.use((req, res, next) => {
  // Skip non-GET requests and API/auth/admin routes
  if (req.method !== 'GET') return next();
  const path = req.path;
  if (path.startsWith('/prompts/auth') || path.startsWith('/prompts/admin') || path.startsWith('/prompts/api') || path.startsWith('/prompts/checkout') || path.startsWith('/api/course') || (path.startsWith('/course/') && path.split('/').length >= 4) || path === '/dashboard' || path === '/reset-password' || path === '/checkout/success') {
    return next();
  }
  // JS / CSS: short cache + revalidate, so site updates go live without stale caches.
  if (/\.(js|css)$/.test(path)) {
    res.setHeader('Cache-Control', 'public, max-age=60, must-revalidate');
    res.removeHeader('Expires');
    return next();
  }
  // Set public cache headers for all public pages
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
  res.removeHeader('Expires');
  next();
});

// --- Stripe webhook (MUST be before express.json: needs raw body) ---
app.post('/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  createWebhookHandler(db)
);

// --- Body parsers ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session (shared across site)
app.use(session({
  store: new SQLiteStore({
    db: 'sessions.db',
    dir: path.join(__dirname, 'prompts', 'database')
  }),
  secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// --- Prompt library routes (mounted at /prompts) ---

app.use('/prompts/static', express.static(path.join(__dirname, 'prompts', 'public')));
app.use('/prompts/auth', createAuthRouter(db));
app.use('/prompts/api', createContentRouter(contentStore));
app.use('/prompts/admin', createAdminRouter(db, contentStore));
app.use('/prompts/checkout', createCheckoutRouter(db));

app.get('/prompts', (req, res) => {
  res.sendFile(path.join(__dirname, 'prompts', 'views', 'library.html'));
});

// --- Checkout success (clean URL without /prompts prefix) ---
app.get('/checkout/success', async (req, res) => {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  try {
    const sessionId = req.query.session_id;
    if (!sessionId) return res.redirect('/prompts');

    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

    if (stripeSession.payment_status === 'paid' && stripeSession.client_reference_id) {
      const userId = parseInt(stripeSession.client_reference_id, 10);
      const productSlug = (stripeSession.metadata && stripeSession.metadata.product_slug) || 'bundle';
      const slugsToGrant = productSlug === 'course-plus-bundle'
        ? ['course-plus-bundle', 'course', 'bundle']
        : [productSlug];

      const insert = db.prepare(`
        INSERT OR IGNORE INTO user_entitlements (user_id, product_slug, stripe_session_id)
        VALUES (?, ?, ?)
      `);
      for (const slug of slugsToGrant) insert.run(userId, slug, stripeSession.id);

      if (slugsToGrant.includes('bundle')) {
        db.prepare(
          "UPDATE users SET has_paid = 1, stripe_customer_id = ?, stripe_session_id = ?, updated_at = datetime('now') WHERE id = ?"
        ).run(stripeSession.customer, stripeSession.id, userId);

        if (req.session.user && req.session.user.id === userId) {
          req.session.user.has_paid = 1;
        }
      }
    }

    res.sendFile(path.join(__dirname, 'prompts', 'views', 'success.html'));
  } catch (err) {
    console.error('Success page error:', err);
    res.sendFile(path.join(__dirname, 'prompts', 'views', 'success.html'));
  }
});

// --- Dashboard ---
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'prompts', 'views', 'dashboard.html'));
});

// --- Password reset page ---
app.get('/reset-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'prompts', 'views', 'reset-password.html'));
});

// --- Static site routes ---

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// SEO and root-level files
app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml').sendFile(path.join(__dirname, 'sitemap.xml'));
});
app.get('/robots.txt', (req, res) => {
  res.type('text/plain').sendFile(path.join(__dirname, 'robots.txt'));
});
// Favicons, icons, and manifest
const rootFiles = ['favicon.ico', 'favicon-16x16.png', 'favicon-32x32.png', 'apple-touch-icon.png', 'android-chrome-192x192.png', 'android-chrome-512x512.png', 'site.webmanifest'];
rootFiles.forEach(file => {
  app.get('/' + file, (req, res) => {
    res.sendFile(path.join(__dirname, file));
  });
});

// Homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Blog listing
app.get('/blog', (req, res) => {
  res.sendFile(path.join(__dirname, 'blog.html'));
});

// Blog articles
app.get('/blog/:slug', (req, res) => {
  const filePath = path.join(__dirname, 'blog', `${req.params.slug}.html`);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Page not found');
  }
});

// Content calendars. Index page stays public, individual calendars are gated.
app.get('/content-calendars', (req, res) => {
  res.sendFile(path.join(__dirname, 'content-calendars', 'index.html'));
});

app.get('/content-calendars/:slug', requirePaidPage, (req, res) => {
  const filePath = path.join(__dirname, 'content-calendars', `${req.params.slug}.html`);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Page not found');
  }
});

// Quiz
app.get('/quiz', (req, res) => {
  res.sendFile(path.join(__dirname, 'quiz.html'));
});

// AI in a Day workbooks (gated)
app.get('/ai-in-a-day', requirePaidPage, (req, res) => {
  res.sendFile(path.join(__dirname, 'ai-in-a-day.html'));
});

app.get('/ai-in-a-day-advanced', requirePaidPage, (req, res) => {
  res.sendFile(path.join(__dirname, 'ai-in-a-day-advanced.html'));
});

// Which AI quiz
app.get('/which-ai-quiz', (req, res) => {
  res.sendFile(path.join(__dirname, 'which-ai-quiz.html'));
});

// Savings calculator
app.get('/savings-calculator', (req, res) => {
  res.sendFile(path.join(__dirname, 'savings-calculator.html'));
});

// AI fact-checking checklist
app.get('/ai-fact-checking-checklist', (req, res) => {
  res.sendFile(path.join(__dirname, 'ai-fact-checking-checklist.html'));
});

// AI Model Recommendations (which AI to use for which task — authoritative, opinionated)
app.get('/ai-model-recommendations', (req, res) => {
  res.sendFile(path.join(__dirname, 'ai-model-recommendations.html'));
});

// AI prompting cheat sheet
app.get('/ai-prompting-cheat-sheet', (req, res) => {
  res.sendFile(path.join(__dirname, 'ai-prompting-cheat-sheet.html'));
});

// Lead magnet
app.get('/lead-magnet', (req, res) => {
  res.sendFile(path.join(__dirname, 'lead-magnet.html'));
});

// Legal
app.get('/privacy', (req, res) => {
  res.sendFile(path.join(__dirname, 'privacy.html'));
});

app.get('/terms', (req, res) => {
  res.sendFile(path.join(__dirname, 'terms.html'));
});

// About / profile pages
app.get('/about/james-woodhouse', (req, res) => {
  res.sendFile(path.join(__dirname, 'about', 'james-woodhouse.html'));
});

app.get('/about/paul-robson', (req, res) => {
  res.sendFile(path.join(__dirname, 'about', 'paul-robson.html'));
});

// --- Online course ---

function getCompletedKeys(userId) {
  if (!userId) return new Set();
  const rows = db.prepare('SELECT lesson_key FROM lesson_progress WHERE user_id = ?').all(userId);
  return new Set(rows.map(r => r.lesson_key));
}

app.get('/course', (req, res) => {
  res.sendFile(path.join(__dirname, 'course.html'));
});

app.get('/course/:tier', (req, res) => {
  const tier = course.tiers.find(t => t.slug === req.params.tier);
  if (!tier) return res.status(404).send('Tier not found');
  const user = getUser(req);
  const hasEntitlement = user && (user.is_admin || userHasEntitlement(db, user.id, 'course'));
  const completedKeys = user ? getCompletedKeys(user.id) : new Set();
  res.send(renderTierPage({ course, tier, completedKeys, hasEntitlement: !!hasEntitlement }));
});

app.get('/course/:tier/:moduleSlug/:lessonSlug', (req, res) => {
  const tier = course.tiers.find(t => t.slug === req.params.tier);
  if (!tier) return res.status(404).send('Lesson not found');
  const mod = tier.modules.find(m => m.slug === req.params.moduleSlug);
  if (!mod) return res.status(404).send('Lesson not found');
  const lesson = mod.lessons.find(l => l.slug === req.params.lessonSlug);
  if (!lesson) return res.status(404).send('Lesson not found');

  const user = getUser(req);
  const hasEntitlement = !!(user && (user.is_admin || userHasEntitlement(db, user.id, 'course')));
  const paywallOn = process.env.PAYWALL_ENABLED === 'true';
  const locked = paywallOn && !mod.isFreeModule && !hasEntitlement;
  const completedKeys = user ? getCompletedKeys(user.id) : new Set();

  res.send(renderLessonPage({ course, tier, mod, lesson, completedKeys, hasEntitlement, locked }));
});

// GET /api/course/outline — public, returns the full module + lesson tree for the sales page
app.get('/api/course/outline', (req, res) => {
  const tiers = course.tiers.map(tier => ({
    slug: tier.slug,
    title: tier.title,
    blurb: tier.blurb,
    earlyAccess: !!tier.earlyAccess,
    earlyAccessNote: tier.earlyAccessNote || '',
    modules: tier.modules.map(mod => ({
      globalNumber: mod.globalNumber,
      slug: mod.slug,
      title: mod.title,
      isFreeModule: !!mod.isFreeModule,
      lessonCount: mod.lessons.length,
      minutes: mod.lessons.reduce((s, l) => s + (l.duration || 0), 0),
      lessons: mod.lessons.map(l => ({
        globalNumber: l.globalNumber,
        slug: l.slug,
        title: l.title,
        duration: l.duration || null,
        summary: l.summary || null,
      })),
    })),
    totalLessons: tier.modules.reduce((s, m) => s + m.lessons.length, 0),
    totalMinutes: tier.modules.reduce((s, m) => s + m.lessons.reduce((sm, l) => sm + (l.duration || 0), 0), 0),
  }));
  res.json({
    title: course.title,
    blurb: course.blurb,
    hero: course.hero,
    totals: course.totals,
    tiers,
  });
});

// GET /api/course/status — used by the sales page to render the right CTA
app.get('/api/course/status', (req, res) => {
  const user = getUser(req);
  const loggedIn = !!user;
  const hasEntitlement = loggedIn && (user.is_admin || userHasEntitlement(db, user.id, 'course'));
  const completed = loggedIn
    ? new Set(db.prepare('SELECT lesson_key FROM lesson_progress WHERE user_id = ?').all(user.id).map(r => r.lesson_key))
    : new Set();

  const flatLessons = [];
  for (const tier of course.tiers) {
    for (const mod of tier.modules) {
      for (const lesson of mod.lessons) {
        flatLessons.push({ key: lesson.key, isFreeModule: !!mod.isFreeModule });
      }
    }
  }

  const firstLessonKey = flatLessons[0] ? flatLessons[0].key : null;
  const firstIncomplete = flatLessons.find(l => !completed.has(l.key));
  // Only suggest paid lessons if user actually has access.
  const nextLesson = firstIncomplete && (firstIncomplete.isFreeModule || hasEntitlement)
    ? firstIncomplete
    : flatLessons.find(l => l.isFreeModule && !completed.has(l.key)) || flatLessons.find(l => l.isFreeModule) || flatLessons[0];

  res.json({
    loggedIn,
    hasEntitlement: !!hasEntitlement,
    totalLessons: flatLessons.length,
    completedCount: completed.size,
    firstLessonKey,
    nextLessonKey: nextLesson ? nextLesson.key : firstLessonKey,
  });
});

// --- Tier worksheet API ---
// Rate-limit worksheet generation: max 5 per hour per user (slightly more permissive than grader
// because users usually only run it once per tier).
const worksheetCalls = new Map();
function worksheetRateLimit(userId) {
  const now = Date.now();
  const recent = (worksheetCalls.get(userId) || []).filter(t => now - t < 60 * 60 * 1000);
  if (recent.length >= 5) return false;
  recent.push(now);
  worksheetCalls.set(userId, recent);
  return true;
}

// Public: fetch worksheet schema (questions only, no system prompt) so the client can render the form.
app.get('/api/worksheet/:tier/schema', (req, res) => {
  const ws = loadWorksheet(req.params.tier);
  if (!ws) return res.status(404).json({ ok: false, message: 'Worksheet not found.' });
  res.json({
    ok: true,
    tier: ws.tier,
    title: ws.title,
    intro: ws.intro,
    questions: ws.questions,
  });
});

app.post('/api/worksheet/generate', requireAuth, async (req, res) => {
  const { tier, answers } = req.body || {};
  if (!tier || !['beginner', 'intermediate', 'advanced'].includes(tier)) {
    return res.status(400).json({ ok: false, message: 'Invalid tier.' });
  }
  // Worksheets are behind the course entitlement. Beginner tier's worksheet is
  // allowed for anyone logged in (it lives at the end of the free-module tier
  // arc, but also caps the whole tier including paid modules). Keep it simple:
  // beginner is free, intermediate and advanced require entitlement.
  const hasEntitlement = req.user.is_admin || userHasEntitlement(db, req.user.id, 'course');
  if (tier !== 'beginner' && !hasEntitlement) {
    return res.status(402).json({ ok: false, message: 'Unlock the course to generate this worksheet.' });
  }
  if (!worksheetRateLimit(req.user.id)) {
    return res.status(429).json({ ok: false, message: 'You have generated worksheets a lot recently. Try again in an hour.' });
  }

  const result = await generateWorksheet({ tier, answers });
  if (!result.ok) return res.status(400).json(result);

  try {
    db.prepare('INSERT INTO tier_worksheets (user_id, tier, answers_json, output_json) VALUES (?, ?, ?, ?)')
      .run(req.user.id, tier, JSON.stringify(result.answers), JSON.stringify(result));
  } catch (err) {
    console.error('Worksheet save failed:', err.message);
  }
  res.json(result);
});

app.post('/api/worksheet/email', requireAuth, async (req, res) => {
  const { result } = req.body || {};
  if (!result || !result.ok || !Array.isArray(result.sections)) {
    return res.status(400).json({ ok: false, message: 'Generate a worksheet first.' });
  }
  try {
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Smash Your AI <onboarding@resend.dev>',
      to: req.user.email,
      subject: result.title || 'Your Smash Your AI starter pack',
      html: renderHtmlEmail(result),
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('Worksheet email failed:', err.message);
    res.status(500).json({ ok: false, message: 'Could not send the email. Try again in a moment.' });
  }
});

app.post('/api/worksheet/markdown', requireAuth, (req, res) => {
  const { result } = req.body || {};
  if (!result || !result.ok) return res.status(400).json({ ok: false, message: 'Generate a worksheet first.' });
  const md = renderMarkdown(result);
  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${(result.tier || 'smash-your-ai')}-starter-pack.md"`);
  res.send(md);
});

// --- Prompt grader API ---
// Per-user in-memory rate limit. Keyed by user id, holds timestamps of recent requests.
const graderCalls = new Map();
const GRADER_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const GRADER_LIMIT = 15; // requests per hour

function rateLimit(userId) {
  const now = Date.now();
  const recent = (graderCalls.get(userId) || []).filter(t => now - t < GRADER_WINDOW_MS);
  if (recent.length >= GRADER_LIMIT) return false;
  recent.push(now);
  graderCalls.set(userId, recent);
  return true;
}

app.post('/api/grade-prompt', requireAuth, async (req, res) => {
  const { lessonKey, userPrompt } = req.body || {};
  if (!lessonKey || typeof lessonKey !== 'string') return res.status(400).json({ ok: false, error: 'bad-request', message: 'Missing lessonKey.' });

  const lesson = course.lessonsByKey.get(lessonKey);
  if (!lesson) return res.status(404).json({ ok: false, error: 'lesson-not-found', message: 'Lesson not found.' });
  if (!lesson.graderTask || !lesson.graderRubric) {
    return res.status(400).json({ ok: false, error: 'no-rubric', message: 'This lesson does not have a prompt grader yet.' });
  }

  // Paid-content gate: only free-module lessons OR entitled users can use the grader.
  const hasEntitlement = req.user.is_admin || userHasEntitlement(db, req.user.id, 'course');
  if (!lesson.isFreeModule && !hasEntitlement) {
    return res.status(402).json({ ok: false, error: 'locked', message: 'Unlock the course to use the prompt grader on this lesson.' });
  }

  if (!rateLimit(req.user.id)) {
    return res.status(429).json({ ok: false, error: 'rate-limited', message: 'You have used the grader a lot recently. Try again in an hour.' });
  }

  const result = await gradePrompt({
    userPrompt,
    lessonTitle: lesson.title,
    task: lesson.graderTask,
    rubric: lesson.graderRubric,
  });
  res.json(result);
});

// --- Model-comparison sandbox API ---
// Streams responses from 2-3 models in parallel via SSE.
// Anonymous: 5 runs per IP per hour. Logged-in: 20 per user per hour.
// Origin check to keep casual abuse down.

const sandboxCallsByKey = new Map();
const SANDBOX_WINDOW_MS = 60 * 60 * 1000;
const SANDBOX_LIMIT_ANON = 5;
const SANDBOX_LIMIT_USER = 20;

function sandboxRateLimit(key, limit) {
  const now = Date.now();
  const recent = (sandboxCallsByKey.get(key) || []).filter(t => now - t < SANDBOX_WINDOW_MS);
  if (recent.length >= limit) return { ok: false, remaining: 0 };
  recent.push(now);
  sandboxCallsByKey.set(key, recent);
  return { ok: true, remaining: limit - recent.length };
}

function getClientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string') return fwd.split(',')[0].trim();
  return req.ip || req.connection?.remoteAddress || 'unknown';
}

app.get('/api/sandbox/models', (req, res) => {
  const models = Object.entries(SANDBOX_MODELS).map(([slug, def]) => ({
    slug,
    label: def.label,
    vendor: def.vendor,
    speed: def.speed,
    note: def.note,
  }));
  const configured = sandboxConfigured();
  res.json({ ok: true, models, defaults: SANDBOX_DEFAULTS, configured });
});

app.post('/api/sandbox/run', async (req, res) => {
  const user = getUser(req);

  const origin = req.headers.origin || req.headers.referer || '';
  const host = req.headers.host || '';
  if (origin && host && !origin.includes(host)) {
    return res.status(403).json({ ok: false, error: 'bad-origin', message: 'Bad origin.' });
  }

  const { prompt, models } = req.body || {};
  const validation = validateSandboxRequest({ prompt, models });
  if (!validation.ok) return res.status(400).json({ ok: false, error: validation.error, message: validation.message });

  const rateKey = user ? `u:${user.id}` : `ip:${getClientIp(req)}`;
  const limit = user ? SANDBOX_LIMIT_USER : SANDBOX_LIMIT_ANON;
  const rate = sandboxRateLimit(rateKey, limit);
  if (!rate.ok) {
    const msg = user
      ? 'You have used the sandbox a lot recently. Try again in an hour.'
      : 'Free trial limit reached. Sign up for a free account for 20 runs an hour.';
    return res.status(429).json({ ok: false, error: 'rate-limited', message: msg });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();
  // Disable Nagle's algorithm so each write hits the wire immediately.
  // Without this, small SSE events get batched and streaming looks broken.
  req.socket?.setNoDelay?.(true);

  const send = (obj) => {
    try { res.write(`data: ${JSON.stringify(obj)}\n\n`); } catch (_) { /* client gone */ }
  };

  let clientClosed = false;
  // Use res.on('close'), not req.on('close'): on POST, req emits 'close' as
  // soon as the request body is fully read, which is long before the client
  // has disconnected.
  res.on('close', () => { clientClosed = true; });

  send({ type: 'hello', rateRemaining: rate.remaining });

  try {
    await runSandbox({ prompt: validation.prompt, models: validation.models }, (event) => {
      if (clientClosed) return;
      send(event);
    });
  } catch (err) {
    console.error('Sandbox run error:', err);
    send({ type: 'error', model: 'all', message: 'Something broke during the comparison.' });
  }

  try { res.end(); } catch (_) {}
});

// --- Tier certificates API ---

const TIER_TITLES = {
  beginner: 'Beginner: AI Fundamentals',
  intermediate: 'Intermediate: Get Serious with AI',
  advanced: 'Advanced: Claude Code and Agentic AI',
};

function generateCertCode() {
  // Short shareable code. 8 chars from a safe alphabet.
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function tierLessonKeys(tierSlug) {
  const tier = course.tiers.find(t => t.slug === tierSlug);
  if (!tier) return null;
  const keys = [];
  for (const mod of tier.modules) for (const l of mod.lessons) keys.push(l.key);
  return keys;
}

// Logged-in: per-tier completion status. Used by the claim widget on the final lesson.
app.get('/api/course/tier-status/:tier', requireAuth, (req, res) => {
  const tierSlug = req.params.tier;
  const keys = tierLessonKeys(tierSlug);
  if (!keys) return res.status(404).json({ ok: false, message: 'Tier not found.' });
  const completed = new Set(
    db.prepare('SELECT lesson_key FROM lesson_progress WHERE user_id = ?').all(req.user.id).map(r => r.lesson_key)
  );
  const completedCount = keys.filter(k => completed.has(k)).length;
  const existing = db.prepare('SELECT code, display_name, issued_at FROM tier_certificates WHERE user_id = ? AND tier = ?')
    .get(req.user.id, tierSlug);
  res.json({
    ok: true,
    tier: tierSlug,
    tierTitle: TIER_TITLES[tierSlug] || tierSlug,
    total: keys.length,
    completed: completedCount,
    complete: completedCount === keys.length,
    certificate: existing || null,
  });
});

app.post('/api/course/certificate/claim', requireAuth, (req, res) => {
  const { tier, displayName } = req.body || {};
  const tierSlug = String(tier || '');
  const keys = tierLessonKeys(tierSlug);
  if (!keys) return res.status(400).json({ ok: false, message: 'Invalid tier.' });
  const name = String(displayName || '').trim().slice(0, 60);
  if (name.length < 2) return res.status(400).json({ ok: false, message: 'Please add a name of at least 2 characters.' });

  const completed = new Set(
    db.prepare('SELECT lesson_key FROM lesson_progress WHERE user_id = ?').all(req.user.id).map(r => r.lesson_key)
  );
  const allDone = keys.every(k => completed.has(k));
  if (!allDone) {
    return res.status(400).json({ ok: false, message: 'Complete every lesson in this tier first.' });
  }

  // If a cert already exists for this user+tier, update the display name and return the same code.
  const existing = db.prepare('SELECT code FROM tier_certificates WHERE user_id = ? AND tier = ?')
    .get(req.user.id, tierSlug);
  if (existing) {
    db.prepare('UPDATE tier_certificates SET display_name = ? WHERE code = ?').run(name, existing.code);
    return res.json({ ok: true, code: existing.code });
  }

  // Try a few times on the off-chance of a code collision.
  for (let i = 0; i < 5; i++) {
    const code = generateCertCode();
    try {
      db.prepare('INSERT INTO tier_certificates (user_id, tier, code, display_name) VALUES (?, ?, ?, ?)')
        .run(req.user.id, tierSlug, code, name);
      return res.json({ ok: true, code });
    } catch (err) {
      if (!/UNIQUE/i.test(err.message)) {
        console.error('Cert claim error:', err.message);
        return res.status(500).json({ ok: false, message: 'Could not issue certificate.' });
      }
    }
  }
  res.status(500).json({ ok: false, message: 'Could not issue certificate. Try again.' });
});

// Public cert JSON (for in-page data + OG meta tags).
app.get('/api/course/certificate/:code', (req, res) => {
  const code = String(req.params.code || '').toUpperCase();
  const row = db.prepare('SELECT code, tier, display_name, issued_at FROM tier_certificates WHERE code = ?').get(code);
  if (!row) return res.status(404).json({ ok: false, message: 'Certificate not found.' });
  res.json({
    ok: true,
    code: row.code,
    tier: row.tier,
    tierTitle: TIER_TITLES[row.tier] || row.tier,
    displayName: row.display_name,
    issuedAt: row.issued_at,
  });
});

// Public certificate page.
app.get('/course/certificate/:code', (req, res) => {
  const code = String(req.params.code || '').toUpperCase();
  const row = db.prepare('SELECT code, tier, display_name, issued_at FROM tier_certificates WHERE code = ?').get(code);
  if (!row) return res.status(404).send('<html><body style="font-family:system-ui;padding:40px;text-align:center;"><h1>Certificate not found</h1><p>That link does not match any certificate.</p><p><a href="/course">Back to the course</a></p></body></html>');

  const tierTitle = TIER_TITLES[row.tier] || row.tier;
  const issuedDate = new Date(row.issued_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const shareUrl = `${req.protocol}://${req.get('host')}/course/certificate/${encodeURIComponent(row.code)}`;
  const title = `${row.display_name} completed ${tierTitle} at Smash Your AI`;
  const desc = `Issued on ${issuedDate}. Verify certificate ${row.code} at smashyourai.com.`;
  const escape = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escape(title)}</title>
<meta name="description" content="${escape(desc)}">
<meta property="og:type" content="article">
<meta property="og:title" content="${escape(title)}">
<meta property="og:description" content="${escape(desc)}">
<meta property="og:url" content="${escape(shareUrl)}">
<meta property="og:image" content="${escape(req.protocol + '://' + req.get('host') + '/images/logo.png')}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${escape(title)}">
<meta name="twitter:description" content="${escape(desc)}">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; }
  body { margin: 0; font-family: 'Plus Jakarta Sans', system-ui, sans-serif; background: linear-gradient(135deg, #faf5ff 0%, #eef2ff 60%, #f0fdfa 100%); color: #1f2937; min-height: 100vh; padding: 40px 20px; }
  .wrap { max-width: 820px; margin: 0 auto; }
  .nav { text-align: center; margin-bottom: 24px; }
  .nav a { color: #6d28d9; text-decoration: none; font-size: 13px; font-weight: 600; }
  .cert { background: #fff; border-radius: 20px; padding: 48px 56px; box-shadow: 0 20px 50px -20px rgba(99,102,241,0.25); position: relative; overflow: hidden; }
  .cert::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); height: 8px; top: 0; bottom: auto; }
  .cert-label { text-transform: uppercase; letter-spacing: 0.15em; font-size: 11px; font-weight: 800; color: #7c3aed; text-align: center; margin: 8px 0 16px; }
  .cert-brand { text-align: center; font-size: 13px; font-weight: 700; color: #6366f1; letter-spacing: 0.06em; margin-bottom: 40px; }
  .cert-intro { text-align: center; color: #6b7280; font-size: 14px; margin: 0 0 14px; }
  .cert-name { text-align: center; font-size: 36px; font-weight: 800; color: #111827; margin: 0 0 28px; letter-spacing: -0.02em; line-height: 1.2; word-break: break-word; }
  .cert-body { text-align: center; color: #4b5563; font-size: 15px; line-height: 1.6; margin: 0 0 14px; }
  .cert-tier { text-align: center; font-size: 22px; font-weight: 700; color: #1f2937; margin: 0 0 28px; }
  .cert-footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 48px; padding-top: 24px; border-top: 1px solid #e5e7eb; flex-wrap: wrap; gap: 16px; }
  .cert-meta { font-size: 12px; color: #9ca3af; line-height: 1.5; }
  .cert-meta strong { color: #4b5563; font-weight: 700; }
  .cert-seal { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; font-size: 22px; letter-spacing: 0.05em; box-shadow: 0 8px 20px -6px rgba(99,102,241,0.5); }

  .share { max-width: 820px; margin: 24px auto 0; background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 18px 22px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .share-label { font-size: 13px; font-weight: 600; color: #4b5563; margin-right: 4px; }
  .share-btn { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 8px; font-size: 13px; font-weight: 600; text-decoration: none; border: 1.5px solid transparent; cursor: pointer; font-family: inherit; transition: all .15s; }
  .share-li { background: #0a66c2; color: #fff; }
  .share-li:hover { background: #004b8a; }
  .share-x { background: #111827; color: #fff; }
  .share-x:hover { background: #000; }
  .share-copy { background: #fff; color: #6d28d9; border-color: #ddd6fe; }
  .share-copy:hover { background: #f5f3ff; }
  .share-copy.copied { background: #10b981; color: #fff; border-color: #10b981; }

  .back { text-align: center; margin-top: 32px; font-size: 13px; color: #6b7280; }
  .back a { color: #6d28d9; text-decoration: none; font-weight: 600; }

  @media (max-width: 600px) {
    .cert { padding: 36px 24px; }
    .cert-name { font-size: 28px; }
    .cert-tier { font-size: 18px; }
  }

  @media print {
    body { background: #fff !important; }
    .nav, .share, .back { display: none !important; }
    .cert { box-shadow: none !important; }
  }
</style>
</head>
<body>
<div class="wrap">
  <div class="nav"><a href="/course">← Smash Your AI Course</a></div>

  <div class="cert">
    <p class="cert-label">Certificate of Completion</p>
    <p class="cert-brand">Smash Your AI</p>
    <p class="cert-intro">This is to certify that</p>
    <h1 class="cert-name">${escape(row.display_name)}</h1>
    <p class="cert-body">has completed</p>
    <p class="cert-tier">${escape(tierTitle)}</p>
    <div class="cert-footer">
      <div class="cert-meta">
        <strong>Issued:</strong> ${escape(issuedDate)}<br>
        <strong>Verify code:</strong> ${escape(row.code)}<br>
        <strong>Verify at:</strong> smashyourai.com/course/certificate/${escape(row.code)}
      </div>
      <div class="cert-seal">SYA</div>
    </div>
  </div>

  <div class="share">
    <span class="share-label">Share:</span>
    <a class="share-btn share-li" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}" target="_blank" rel="noopener">LinkedIn</a>
    <a class="share-btn share-x" href="https://twitter.com/intent/tweet?text=${encodeURIComponent('I just completed ' + tierTitle + ' at Smash Your AI.')}&url=${encodeURIComponent(shareUrl)}" target="_blank" rel="noopener">X / Twitter</a>
    <button class="share-btn share-copy" type="button" id="copy-link">Copy link</button>
    <button class="share-btn share-copy" type="button" onclick="window.print()">Print / Save PDF</button>
  </div>

  <p class="back"><a href="/course">← Back to the course</a></p>
</div>
<script>
  document.getElementById('copy-link').addEventListener('click', function() {
    const btn = this;
    navigator.clipboard.writeText(${JSON.stringify(shareUrl)}).then(function() {
      const o = btn.textContent;
      btn.textContent = 'Copied';
      btn.classList.add('copied');
      setTimeout(function(){ btn.textContent = o; btn.classList.remove('copied'); }, 1500);
    });
  });
</script>
</body>
</html>`);
});

// --- Course progress API ---

app.get('/api/course/progress', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT lesson_key, completed_at FROM lesson_progress WHERE user_id = ?').all(req.user.id);
  res.json({ completed: rows.map(r => r.lesson_key), details: rows });
});

app.post('/api/course/progress', requireAuth, (req, res) => {
  const lessonKey = req.body && req.body.lessonKey;
  if (!lessonKey || typeof lessonKey !== 'string' || lessonKey.length > 200) {
    return res.status(400).json({ error: 'Invalid lessonKey' });
  }
  db.prepare(`INSERT OR IGNORE INTO lesson_progress (user_id, lesson_key) VALUES (?, ?)`)
    .run(req.user.id, lessonKey);
  res.json({ ok: true });
});

app.delete('/api/course/progress', requireAuth, (req, res) => {
  const lessonKey = req.body && req.body.lessonKey;
  if (!lessonKey) return res.status(400).json({ error: 'Invalid lessonKey' });
  db.prepare('DELETE FROM lesson_progress WHERE user_id = ? AND lesson_key = ?')
    .run(req.user.id, lessonKey);
  res.json({ ok: true });
});

app.post('/api/course/progress/merge', requireAuth, (req, res) => {
  const keys = req.body && req.body.lessonKeys;
  if (!Array.isArray(keys)) return res.status(400).json({ error: 'lessonKeys must be an array' });
  const insert = db.prepare('INSERT OR IGNORE INTO lesson_progress (user_id, lesson_key) VALUES (?, ?)');
  const tx = db.transaction((items) => {
    for (const k of items) {
      if (typeof k === 'string' && k.length <= 200) insert.run(req.user.id, k);
    }
  });
  tx(keys);
  res.json({ ok: true, merged: keys.length });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html><head><title>Page not found - Smash Your AI</title>
    <style>body{font-family:'Plus Jakarta Sans',sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f9fafb;color:#1f2937;text-align:center}
    .box{max-width:400px;padding:2rem}h1{font-size:4rem;background:linear-gradient(135deg,#8b5cf6,#6366f1);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin:0}
    p{margin:1rem 0}a{color:#6366f1;text-decoration:none;font-weight:600}</style></head>
    <body><div class="box"><h1>404</h1><p>This page doesn't exist.</p><p><a href="/">Back to homepage</a></p></div></body></html>
  `);
});

// --- Start ---

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Smash Your AI running at http://localhost:${PORT}`);
});
