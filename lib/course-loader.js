const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.error(`Invalid JSON in ${filePath}:`, err.message);
    return null;
  }
}

function slugFromFilename(filename) {
  // "01-what-is-ai.md" → { order: 1, slug: "what-is-ai" }
  // "welcome.md" → { order: 999, slug: "welcome" }
  const base = filename.replace(/\.md$/i, '');
  const match = base.match(/^(\d+)[-_](.+)$/);
  if (match) return { order: parseInt(match[1], 10), slug: match[2] };
  return { order: 999, slug: base };
}

function dirOrder(dirname) {
  const match = dirname.match(/^(\d+)[-_](.+)$/);
  if (match) return { order: parseInt(match[1], 10), slug: match[2] };
  return { order: 999, slug: dirname };
}

function decodeEntities(s) {
  return String(s == null ? '' : s)
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}

function extractToc(html) {
  // Find h2/h3 tags and their text; auto-inject id attributes if missing.
  // Decode HTML entities so TOC reads "AI" not &quot;AI&quot;.
  const items = [];
  const rewritten = html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (full, level, attrs, inner) => {
    const rawText = inner.replace(/<[^>]+>/g, '').trim();
    const text = decodeEntities(rawText);
    const idMatch = attrs.match(/\bid=["']([^"']+)["']/);
    let id;
    if (idMatch) {
      id = idMatch[1];
    } else {
      id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || `section-${items.length + 1}`;
      attrs = `${attrs} id="${id}"`;
    }
    items.push({ level: parseInt(level, 10), text, id });
    return `<h${level}${attrs}>${inner}</h${level}>`;
  });
  return { items, html: rewritten };
}

function loadLesson(lessonPath, tierSlug, moduleSlug) {
  const raw = fs.readFileSync(lessonPath, 'utf8');
  const parsed = matter(raw);
  const { order, slug } = slugFromFilename(path.basename(lessonPath));

  const rawHtml = marked.parse(parsed.content || '');
  const { items: toc, html } = extractToc(rawHtml);

  return {
    order,
    slug,
    title: parsed.data.title || slug,
    duration: parsed.data.duration || null,
    summary: parsed.data.summary || null,
    graderTask: parsed.data.graderTask || null,
    graderRubric: parsed.data.graderRubric || null,
    key: `${tierSlug}/${moduleSlug}/${slug}`,
    html,
    toc,
  };
}

function loadModule(moduleDir, tierSlug) {
  const { order, slug } = dirOrder(path.basename(moduleDir));
  const meta = readJsonIfExists(path.join(moduleDir, 'module.json')) || {};

  const lessons = fs.readdirSync(moduleDir)
    .filter(f => f.endsWith('.md'))
    .map(f => loadLesson(path.join(moduleDir, f), tierSlug, slug))
    .sort((a, b) => a.order - b.order);

  return {
    order: meta.order != null ? meta.order : order,
    slug,
    title: meta.title || slug,
    isFreeModule: meta.isFreeModule === true,
    lessons,
  };
}

function loadTier(tierDir) {
  const { slug } = dirOrder(path.basename(tierDir));
  const meta = readJsonIfExists(path.join(tierDir, 'tier.json')) || {};
  const effectiveSlug = meta.slug || slug;

  const modules = fs.readdirSync(tierDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => loadModule(path.join(tierDir, d.name), effectiveSlug))
    .sort((a, b) => a.order - b.order);

  return {
    slug: effectiveSlug,
    order: meta.order || 0,
    title: meta.title || effectiveSlug,
    blurb: meta.blurb || '',
    earlyAccess: !!meta.earlyAccess,
    earlyAccessNote: meta.earlyAccessNote || '',
    modules,
  };
}

function loadCourse(rootDir) {
  if (!fs.existsSync(rootDir)) {
    console.warn(`Course content dir not found: ${rootDir}`);
    return { title: 'Course', blurb: '', tiers: [], lessonsByKey: new Map() };
  }

  const courseMeta = readJsonIfExists(path.join(rootDir, 'course.json')) || {};

  const tierSlugs = ['beginner', 'intermediate', 'advanced'];
  const tiers = tierSlugs
    .map(tierSlug => {
      const tierDir = path.join(rootDir, tierSlug);
      if (!fs.existsSync(tierDir)) return null;
      return loadTier(tierDir);
    })
    .filter(Boolean);

  // Build flat lesson list for prev/next + lookup; assign continuous numbering
  // (module N across the whole course, lesson N across the whole course).
  const flat = [];
  const lessonsByKey = new Map();
  let globalModuleNumber = 0;
  let globalLessonNumber = 0;
  for (const tier of tiers) {
    for (const mod of tier.modules) {
      globalModuleNumber++;
      mod.globalNumber = globalModuleNumber;
      for (const lesson of mod.lessons) {
        globalLessonNumber++;
        lesson.globalNumber = globalLessonNumber;
        const enriched = {
          ...lesson,
          tierSlug: tier.slug,
          tierTitle: tier.title,
          moduleSlug: mod.slug,
          moduleTitle: mod.title,
          isFreeModule: mod.isFreeModule,
        };
        flat.push(enriched);
        lessonsByKey.set(enriched.key, enriched);
      }
    }
  }
  // Wire prev/next
  flat.forEach((lesson, i) => {
    lesson.prev = flat[i - 1] ? { key: flat[i - 1].key, title: flat[i - 1].title } : null;
    lesson.next = flat[i + 1] ? { key: flat[i + 1].key, title: flat[i + 1].title } : null;
  });

  const totals = {
    lessons: flat.length,
    freeLessons: flat.filter(l => l.isFreeModule).length,
    minutes: flat.reduce((sum, l) => sum + (l.duration || 0), 0),
  };

  console.log(`Course loaded: ${tiers.length} tiers, ${totals.lessons} lessons (${totals.freeLessons} free, ~${totals.minutes} min)`);

  return {
    title: courseMeta.title || 'Smash Your AI Course',
    blurb: courseMeta.blurb || '',
    hero: courseMeta.hero || '',
    tiers,
    lessonsByKey,
    totals,
  };
}

module.exports = { loadCourse };
