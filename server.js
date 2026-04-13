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

const db = initDatabase();

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
  if (path.startsWith('/prompts/auth') || path.startsWith('/prompts/admin') || path.startsWith('/prompts/api') || path.startsWith('/prompts/checkout') || path === '/dashboard' || path === '/reset-password' || path === '/checkout/success') {
    return next();
  }
  // Set public cache headers for all public pages
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
  res.removeHeader('Expires');
  next();
});

// --- Stripe webhook (MUST be before express.json — needs raw body) ---
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
      db.prepare(
        "UPDATE users SET has_paid = 1, stripe_customer_id = ?, stripe_session_id = ?, updated_at = datetime('now') WHERE id = ?"
      ).run(stripeSession.customer, stripeSession.id, userId);

      if (req.session.user && req.session.user.id === userId) {
        req.session.user.has_paid = 1;
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

// Content calendars — index page stays public, individual calendars are gated
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
