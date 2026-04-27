const escape = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// Set at boot. Used as a cache-buster on script/style URLs so browsers
// refetch the latest JS when the server restarts.
const BOOT_STAMP = Date.now();

function layout({ title, description, body, activeLessonKey = null, hasEntitlement = false }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-GMMV8EBM39"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-GMMV8EBM39');</script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escape(title)} · Smash Your AI Course</title>
<meta name="description" content="${escape(description)}">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<script>tailwind.config={theme:{extend:{fontFamily:{sans:['Plus Jakarta Sans','system-ui','sans-serif']}}}}</script>
<style>
  * { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
  .gradient-text { background: linear-gradient(135deg,#8b5cf6,#6366f1,#4f46e5); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .gradient-btn { background: linear-gradient(135deg,#8b5cf6,#6366f1); transition: all 0.2s ease; }
  .gradient-btn:hover { background: linear-gradient(135deg,#7c3aed,#4f46e5); transform: translateY(-1px); box-shadow: 0 10px 25px -5px rgba(99,102,241,0.4); }

  /* Lesson prose */
  .prose-lesson { color:#1f2937; line-height:1.75; font-size: 1.05rem; }
  .prose-lesson h2 { font-size:1.6rem; font-weight:800; margin-top:2.75rem; margin-bottom:1rem; color:#111827; letter-spacing:-0.01em; }
  .prose-lesson h3 { font-size:1.2rem; font-weight:700; margin-top:2.25rem; margin-bottom:.5rem; color:#111827; }
  .prose-lesson p { margin: 1.05rem 0; }
  .prose-lesson ul, .prose-lesson ol { margin: 1.05rem 0; padding-left: 1.5rem; }
  .prose-lesson ul { list-style: disc; }
  .prose-lesson ol { list-style: decimal; }
  .prose-lesson li { margin: .35rem 0; }
  .prose-lesson a { color:#6366f1; text-decoration: underline; }
  .prose-lesson a:hover { color:#4f46e5; }
  .prose-lesson code { background:#f3f4f6; padding:2px 6px; border-radius:4px; font-size:.9em; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
  .prose-lesson pre { background:#0f172a; color:#e5e7eb; padding:1rem 1.25rem; border-radius:10px; overflow-x:auto; margin:1.25rem 0; }
  .prose-lesson pre code { background:transparent; padding:0; color:inherit; }
  .prose-lesson blockquote { border-left:4px solid #a78bfa; background:#f5f3ff; padding:.75rem 1rem; margin:1.25rem 0; border-radius:0 8px 8px 0; color:#4c1d95; }
  .prose-lesson strong { color:#111827; font-weight: 700; }

  /* Course page shell: three-column layout on wide screens */
  :root { --course-nav-h: 73px; }
  .course-shell { display: flex; min-height: 100vh; padding-top: var(--course-nav-h); }
  .course-sidebar {
    width: 320px; flex-shrink: 0;
    background: #fafafa; border-right: 1px solid #e5e7eb;
    overflow-y: auto; position: sticky; top: var(--course-nav-h);
    height: calc(100vh - var(--course-nav-h)); padding: 1.25rem 1rem;
  }
  .course-main { flex: 1; min-width: 0; padding: 2.5rem 3rem; max-width: 780px; }
  .course-toc {
    width: 240px; flex-shrink: 0; padding: 2.5rem 1.5rem 2rem 2rem;
    position: sticky; top: var(--course-nav-h); height: calc(100vh - var(--course-nav-h)); overflow-y: auto;
    border-left: 1px solid #f3f4f6;
  }
  @media (max-width: 1280px) { .course-toc { display: none; } }
  @media (max-width: 900px) {
    .course-sidebar { display: none; position: fixed; inset: var(--course-nav-h) 0 0 0; width: 100%; height: calc(100vh - var(--course-nav-h)); z-index: 40; }
    .course-sidebar.open { display: block; }
    .course-main { padding: 1.5rem 1.25rem; }
  }

  /* Mobile "Lessons" pill beneath the main nav */
  .course-mobile-lessons {
    display: none; position: sticky; top: var(--course-nav-h); z-index: 30;
    background: #fff; border-bottom: 1px solid #f3f4f6;
    padding: .5rem 1rem;
  }
  .course-mobile-lessons button {
    background: #f5f3ff; color: #6d28d9; border: 1px solid #ddd6fe;
    padding: .5rem .9rem; border-radius: 8px; font-size: .85rem; font-weight: 600;
    display: inline-flex; align-items: center; gap: .45rem; cursor: pointer;
  }
  @media (max-width: 900px) { .course-mobile-lessons { display: block; } }

  /* Sidebar */
  .sidebar-tier { margin-bottom: .5rem; }
  .sidebar-tier-header {
    width: 100%; display: flex; align-items: center; justify-content: space-between;
    padding: .5rem .5rem; border-radius: 6px; cursor: pointer;
    font-size: .75rem; font-weight: 800; letter-spacing: .04em; text-transform: uppercase;
    color: #6d28d9; background: transparent; border: none; text-align: left;
  }
  .sidebar-tier-header:hover { background: #f5f3ff; }
  .sidebar-tier-chev { width: 14px; height: 14px; transition: transform .18s ease; color: #a78bfa; }
  .sidebar-tier.collapsed .sidebar-tier-chev { transform: rotate(-90deg); }
  .sidebar-tier.collapsed .sidebar-tier-body { display: none; }

  .sidebar-module { margin: .5rem 0 1.1rem; }
  .sidebar-module-title {
    display: flex; align-items: center; gap: .45rem;
    padding: .4rem .5rem .5rem .5rem;
    font-size: .82rem; font-weight: 700; color: #374151; letter-spacing: .01em;
  }
  .sidebar-module-title .module-num { color: #7c3aed; font-weight: 800; flex-shrink: 0; }
  .sidebar-module-title .module-label { flex: 1; min-width: 0; }
  .sidebar-module-title .lock { font-size: .9rem; line-height: 1; margin-left: auto; }
  .sidebar-module-title .lock.open { color: #059669; }
  .sidebar-module-title .lock.closed { color: #9ca3af; }

  .sidebar-link {
    display: flex; align-items: flex-start; gap: .7rem;
    padding: .7rem .6rem .7rem 1rem; border-radius: 8px;
    font-size: .95rem; color: #374151; line-height: 1.35;
    transition: background-color .12s, color .12s;
    text-decoration: none;
    margin-bottom: .2rem;
  }
  .sidebar-link:hover { background: #f5f3ff; color: #6d28d9; }
  .sidebar-link.active { background: #ede9fe; color: #6d28d9; font-weight: 600; }
  .sidebar-link .tick { width: 1.1rem; height: 1.1rem; flex-shrink: 0; display: inline-block; margin-top: 1px; }
  .sidebar-link .tick-ring { width: 1.1rem; height: 1.1rem; border-radius: 50%; border: 1.5px solid #d1d5db; display: inline-block; margin-top: 1px; flex-shrink: 0; }
  .sidebar-link .lesson-label { flex: 1; min-width: 0; }
  .sidebar-link .lesson-number { font-size: .7rem; font-weight: 700; color: #9ca3af; letter-spacing: .04em; text-transform: uppercase; display: block; margin-bottom: .15rem; }
  .sidebar-link.active .lesson-number { color: #7c3aed; }

  /* TOC */
  .toc-title { font-size: .7rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: #9ca3af; margin-bottom: .85rem; }
  .toc-list { list-style: none; padding: 0; margin: 0; }
  .toc-list li { margin: .45rem 0; }
  .toc-list li.level-3 { padding-left: .75rem; }
  .toc-list a { font-size: .85rem; color: #6b7280; text-decoration: none; line-height: 1.4; display: block; }
  .toc-list a:hover { color: #6d28d9; }

  /* Callouts inside lesson prose */
  .callout { display: flex; gap: .9rem; padding: 1rem 1.15rem; border-radius: 12px; margin: 1.5rem 0; border: 1px solid transparent; font-size: .98rem; line-height: 1.6; }
  .callout .callout-icon { font-size: 1.35rem; line-height: 1.2; flex-shrink: 0; }
  .callout strong { display: inline; }
  .callout p { margin: .4rem 0 0; }
  .callout p:first-child { margin-top: 0; }
  .callout ul, .callout ol { margin: .5rem 0 0; padding-left: 1.25rem; }
  .callout > div { flex: 1; }
  .callout-tip { background: #fef3c7; border-color: #fcd34d; color: #78350f; }
  .callout-example { background: #ecfdf5; border-color: #6ee7b7; color: #064e3b; }
  .callout-scenario { background: #eff6ff; border-color: #93c5fd; color: #1e3a8a; }
  .callout-warning { background: #fef2f2; border-color: #fca5a5; color: #7f1d1d; }
  .callout-try { background: linear-gradient(135deg, #f5f3ff, #eef2ff); border-color: #c4b5fd; color: #4c1d95; }

  /* Copy-to-clipboard on code blocks */
  .code-wrap { position: relative; }
  .code-wrap .copy-btn {
    position: absolute; top: .55rem; right: .6rem;
    background: rgba(255,255,255,0.08); color: #d1d5db;
    border: 1px solid rgba(255,255,255,0.15); border-radius: 6px;
    font-size: .72rem; font-weight: 600; padding: .3rem .55rem; cursor: pointer;
    transition: all .15s;
  }
  .code-wrap .copy-btn:hover { background: rgba(255,255,255,0.18); color: #fff; }
  .code-wrap .copy-btn.copied { background: #10b981; color: #fff; border-color: #10b981; }

  /* Quiz */
  .quiz { background: #fafafa; border: 1px solid #e5e7eb; border-radius: 14px; padding: 1.4rem 1.5rem; margin: 2rem 0; }
  .quiz-header { margin-bottom: 1.1rem; }
  .quiz-title { font-size: .72rem; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: #7c3aed; margin: 0 0 .4rem; }
  .quiz-heading { font-size: 1.15rem; font-weight: 700; margin: 0 0 .9rem; color: #111827; }
  .quiz-progress-bar { height: 6px; background: #ede9fe; border-radius: 4px; overflow: hidden; margin: .1rem 0 .5rem; }
  .quiz-progress-fill { height: 100%; background: linear-gradient(135deg,#8b5cf6,#6366f1); border-radius: 4px; transition: width .35s ease; width: 0%; }
  .quiz-meta { display: flex; justify-content: space-between; align-items: center; font-size: .8rem; color: #6b7280; }
  .quiz-counter { font-weight: 600; color: #4b5563; }
  .quiz-last-score { font-weight: 600; color: #6d28d9; }
  .quiz-last-score.hidden { display: none; }

  /* Slider */
  .quiz-viewport { overflow: hidden; position: relative; }
  .quiz-track { display: flex; transition: transform .35s cubic-bezier(.25,.8,.3,1); will-change: transform; }
  .quiz-slide { flex: 0 0 100%; box-sizing: border-box; padding: .1rem .15rem .2rem; }
  .quiz-prompt { font-weight: 600; color: #111827; margin: 0 0 .85rem; font-size: 1rem; line-height: 1.5; }

  .quiz-option {
    display: block; width: 100%; text-align: left;
    padding: .75rem 1rem; margin: .5rem 0; border-radius: 10px;
    background: #fff; border: 1.5px solid #e5e7eb; color: #374151;
    font-size: .95rem; cursor: pointer; transition: all .15s;
    font-family: inherit; line-height: 1.4;
  }
  .quiz-option:hover:not(:disabled) { border-color: #a78bfa; background: #f5f3ff; transform: translateX(2px); }
  .quiz-option.correct { background: #d1fae5; border-color: #10b981; color: #065f46; font-weight: 600; }
  .quiz-option.incorrect { background: #fee2e2; border-color: #ef4444; color: #991b1b; }
  .quiz-option:disabled { cursor: default; transform: none; }
  .quiz-option .quiz-option-mark { float: right; font-weight: 700; }

  .quiz-explain {
    display: none; margin: .9rem 0 0; padding: .85rem 1rem;
    background: #eef2ff; border-radius: 10px; font-size: .9rem; color: #3730a3;
    line-height: 1.55; border-left: 3px solid #6366f1;
  }
  .quiz-explain.shown { display: block; animation: quizFadeIn .3s ease; }
  @keyframes quizFadeIn { from { opacity: 0; transform: translateY(4px);} to { opacity:1; transform: translateY(0);} }

  .quiz-next {
    display: none; margin-top: 1rem; padding: .65rem 1.2rem;
    background: linear-gradient(135deg,#8b5cf6,#6366f1); color: #fff;
    border: none; border-radius: 10px; font-weight: 600; cursor: pointer;
    font-size: .92rem; font-family: inherit; transition: all .15s;
  }
  .quiz-next:hover { background: linear-gradient(135deg,#7c3aed,#4f46e5); transform: translateY(-1px); }
  .quiz-next.shown { display: inline-block; animation: quizFadeIn .3s ease .1s both; }

  /* Finish screen */
  .quiz-finish { display: none; text-align: center; padding: 1.5rem .5rem .5rem; }
  .quiz-finish.shown { display: block; animation: quizFadeIn .4s ease; }
  .quiz-finish-emoji { font-size: 3rem; margin: 0 0 .75rem; line-height: 1; }
  .quiz-finish-title { font-size: 1.35rem; font-weight: 800; margin: 0 0 .35rem; color: #111827; }
  .quiz-finish-score { font-size: 2.5rem; font-weight: 800; background: linear-gradient(135deg,#8b5cf6,#6366f1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: .5rem 0; line-height: 1; }
  .quiz-finish-msg { color: #6b7280; font-size: .95rem; margin: 0 0 1.2rem; }
  .quiz-retry {
    padding: .65rem 1.5rem;
    background: #fff; color: #6d28d9; border: 1.5px solid #c4b5fd;
    border-radius: 10px; font-weight: 600; cursor: pointer;
    font-size: .92rem; font-family: inherit; transition: all .15s;
  }
  .quiz-retry:hover { background: #f5f3ff; border-color: #a78bfa; }

  /* Prompt grader widget */
  .prompt-grader { margin: 2rem 0; padding: 1.5rem 1.6rem 1.6rem; border-radius: 16px;
    background: linear-gradient(135deg, #faf5ff 0%, #eef2ff 100%);
    border: 1px solid #c4b5fd; color: #1f2937; }
  .pg-header { display: flex; align-items: center; gap: .75rem; margin-bottom: .5rem; }
  .pg-badge { display: inline-block; font-size: .7rem; font-weight: 800; letter-spacing: .08em;
    text-transform: uppercase; color: #7c3aed; background: #ede9fe; padding: .22rem .55rem; border-radius: 999px; }
  .pg-title { font-size: 1.3rem; font-weight: 800; color: #111827; margin: 0; letter-spacing: -0.01em; }
  .pg-task { font-size: .95rem; color: #4b5563; margin: .2rem 0 1rem; line-height: 1.55; }
  .pg-textarea { width: 100%; min-height: 130px; padding: .9rem 1rem; border-radius: 10px;
    border: 1.5px solid #ddd6fe; font-family: inherit; font-size: .95rem; line-height: 1.55;
    background: #fff; color: #111827; resize: vertical; transition: border-color .15s, box-shadow .15s; }
  .pg-textarea:focus { outline: none; border-color: #8b5cf6; box-shadow: 0 0 0 3px rgba(139,92,246,0.15); }
  .pg-actions { display: flex; align-items: center; gap: 1rem; margin-top: .9rem; flex-wrap: wrap; }
  .pg-submit { padding: .7rem 1.3rem; font-size: .95rem; font-weight: 700; color: #fff;
    background: linear-gradient(135deg,#8b5cf6,#6366f1); border: none; border-radius: 10px;
    cursor: pointer; font-family: inherit; transition: transform .15s, box-shadow .15s, opacity .15s; }
  .pg-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 20px -5px rgba(99,102,241,.4); }
  .pg-submit:disabled { opacity: .7; cursor: wait; }
  .pg-hint { font-size: .8rem; color: #6b7280; }
  .pg-result { margin-top: 1.2rem; }
  .pg-result:empty { margin-top: 0; }
  .pg-loading { font-size: .95rem; color: #6d28d9; padding: .85rem 1rem; background: #fff;
    border: 1px solid #ddd6fe; border-radius: 10px; text-align: center; }
  .pg-error { font-size: .92rem; color: #991b1b; padding: .85rem 1rem;
    background: #fef2f2; border: 1px solid #fca5a5; border-radius: 10px; }
  .pg-result-header { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.1rem;
    background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; margin-bottom: 1rem; }
  .pg-score { display: flex; align-items: baseline; gap: .35rem; flex-shrink: 0; }
  .pg-score-emoji { font-size: 1.35rem; }
  .pg-score-num { font-size: 2rem; font-weight: 800; letter-spacing: -0.02em; }
  .pg-score-out { font-size: .95rem; color: #9ca3af; font-weight: 600; }
  .pg-headline { font-size: 1rem; font-weight: 600; color: #111827; line-height: 1.45; }
  .pg-section { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px;
    padding: .9rem 1.1rem; margin-bottom: .85rem; }
  .pg-section-title { font-size: .75rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: .06em; margin: 0 0 .55rem; }
  .pg-strengths-title { color: #047857; }
  .pg-fixes-title { color: #b45309; }
  .pg-list { margin: 0; padding-left: 1.15rem; font-size: .93rem; line-height: 1.55; color: #1f2937; }
  .pg-list li { margin: .3rem 0; }
  .pg-rewrite-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: .5rem; }
  .pg-rewrite { background: #f9fafb; color: #111827; padding: .85rem 1rem; border-radius: 8px;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .85rem;
    line-height: 1.5; white-space: pre-wrap; word-break: break-word; margin: 0; overflow-x: auto; }
  .pg-copy { font-size: .72rem; font-weight: 700; padding: .3rem .65rem; border-radius: 6px;
    background: #ede9fe; color: #6d28d9; border: 1px solid #ddd6fe; cursor: pointer;
    font-family: inherit; transition: all .15s; }
  .pg-copy:hover { background: #ddd6fe; }
  .pg-copy.copied { background: #10b981; color: #fff; border-color: #10b981; }

  /* Model-comparison sandbox */
  .model-sandbox { margin: 2rem 0; padding: 1.5rem 1.6rem 1.6rem; border-radius: 18px;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    border: 1px solid #334155; color: #e2e8f0; }
  .model-sandbox.ms-compact { padding: 1.2rem 1.3rem; }
  .ms-headline { display: flex; align-items: center; gap: .75rem; margin-bottom: .9rem; flex-wrap: wrap; }
  .ms-badge { display: inline-block; font-size: .68rem; font-weight: 800; letter-spacing: .08em;
    text-transform: uppercase; color: #c4b5fd; background: rgba(139,92,246,.18);
    padding: .24rem .6rem; border-radius: 999px; border: 1px solid rgba(139,92,246,.35); }
  .ms-title { font-size: 1.25rem; font-weight: 800; color: #f8fafc; margin: 0; letter-spacing: -0.01em; line-height: 1.25; }
  .ms-compact .ms-title { font-size: 1.1rem; }
  .ms-picker { display: flex; align-items: center; gap: .75rem; flex-wrap: wrap; margin-bottom: .85rem; }
  .ms-picker-label { font-size: .78rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: .06em; }
  .ms-picker-chips { display: flex; flex-wrap: wrap; gap: .5rem; }
  .ms-chip { display: inline-flex; align-items: center; gap: .5rem; padding: .45rem .75rem;
    background: rgba(255,255,255,0.04); border: 1px solid #334155; border-radius: 999px;
    cursor: pointer; transition: all .15s; font-size: .82rem; color: #cbd5e1; }
  .ms-chip:hover { background: rgba(255,255,255,0.08); border-color: #475569; }
  .ms-chip.selected { background: rgba(139,92,246,.18); border-color: #8b5cf6; color: #f8fafc; }
  .ms-chip-input { position: absolute; opacity: 0; pointer-events: none; }
  .ms-chip-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; }
  .ms-chip-label { font-weight: 600; }
  .ms-chip-speed { font-size: .7rem; color: #94a3b8; background: rgba(255,255,255,0.06);
    padding: .1rem .4rem; border-radius: 4px; }
  .ms-textarea { width: 100%; min-height: 80px; padding: .85rem 1rem; border-radius: 12px;
    border: 1.5px solid #334155; font-family: inherit; font-size: .95rem; line-height: 1.5;
    background: rgba(255,255,255,0.04); color: #f1f5f9; resize: vertical; transition: border-color .15s, box-shadow .15s; }
  .ms-textarea::placeholder { color: #64748b; }
  .ms-textarea:focus { outline: none; border-color: #8b5cf6; box-shadow: 0 0 0 3px rgba(139,92,246,0.2); }
  .ms-actions { display: flex; align-items: center; gap: 1rem; margin-top: .85rem; flex-wrap: wrap; }
  .ms-run { padding: .72rem 1.4rem; font-size: .95rem; font-weight: 700; color: #fff;
    background: linear-gradient(135deg,#8b5cf6,#6366f1); border: none; border-radius: 10px;
    cursor: pointer; font-family: inherit; transition: transform .15s, box-shadow .15s, opacity .15s; }
  .ms-run:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 10px 25px -5px rgba(99,102,241,.5); }
  .ms-run:disabled { opacity: .7; cursor: wait; }
  .ms-hint { font-size: .78rem; color: #94a3b8; }
  .ms-error { margin-top: .75rem; padding: .7rem .9rem; background: rgba(239,68,68,.12);
    border: 1px solid rgba(239,68,68,.35); border-radius: 8px; color: #fecaca; font-size: .88rem; }
  .ms-grid { display: grid; gap: .85rem; margin-top: 1.1rem; }
  .ms-grid:empty { margin-top: 0; }
  .ms-grid-1 { grid-template-columns: 1fr; }
  .ms-grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .ms-grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  @media (max-width: 720px) { .ms-grid-2, .ms-grid-3 { grid-template-columns: 1fr; } }
  .ms-panel { background: rgba(255,255,255,0.04); border: 1px solid #334155; border-radius: 12px;
    padding: .9rem 1rem 1rem; display: flex; flex-direction: column; min-height: 200px; }
  .ms-panel[data-state="streaming"] { border-color: #8b5cf6; box-shadow: 0 0 0 2px rgba(139,92,246,.15); }
  .ms-panel[data-state="done"] { border-color: #10b981; }
  .ms-panel[data-state="error"] { border-color: #ef4444; }
  .ms-panel-head { display: flex; align-items: center; justify-content: space-between; gap: .5rem;
    padding-bottom: .45rem; margin-bottom: .5rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
  .ms-panel-title { display: flex; align-items: center; gap: .5rem; font-size: .92rem; color: #f1f5f9; }
  .ms-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; }
  .ms-vendor { font-size: .7rem; color: #94a3b8; text-transform: uppercase; letter-spacing: .06em; font-weight: 700; }
  .ms-meta { display: flex; justify-content: space-between; gap: .5rem; font-size: .75rem;
    color: #94a3b8; margin-bottom: .55rem; }
  .ms-panel[data-state="streaming"] .ms-status::before {
    content: ''; display: inline-block; width: 6px; height: 6px; border-radius: 50%;
    background: #8b5cf6; margin-right: .4rem; animation: msPulse 1s ease-in-out infinite;
  }
  @keyframes msPulse { 0%, 100% { opacity: 1; } 50% { opacity: .3; } }
  .ms-body { font-size: .89rem; line-height: 1.55; color: #e2e8f0;
    word-break: break-word; flex-grow: 1; overflow-y: auto; max-height: 400px; }
  .ms-body p { margin: 0 0 .65em; }
  .ms-body p:last-child { margin-bottom: 0; }
  .ms-body ul, .ms-body ol { margin: 0 0 .65em; padding-left: 1.25em; }
  .ms-body ul:last-child, .ms-body ol:last-child { margin-bottom: 0; }
  .ms-body li { margin: .15em 0; }
  .ms-body strong { font-weight: 700; color: #f8fafc; }
  .ms-body em { font-style: italic; }
  .ms-body code { background: rgba(255,255,255,0.1); padding: .08em .35em;
    border-radius: 4px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: .85em; color: #f8fafc; }
  .ms-body h3, .ms-body h4, .ms-body h5 { margin: .5em 0 .3em; color: #f8fafc; font-weight: 700; }

  /* Tier worksheet widget (end-of-tier starter pack generator) */
  .tier-worksheet { margin: 2.5rem 0; padding: 1.6rem 1.8rem 1.8rem; border-radius: 18px;
    background: linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%);
    border: 1px solid #fcd34d; color: #1f2937; }
  .tw-loading { padding: 1rem; text-align: center; color: #78350f; }
  .tw-header { display: flex; align-items: center; gap: .75rem; margin-bottom: .5rem; flex-wrap: wrap; }
  .tw-badge { display: inline-block; font-size: .7rem; font-weight: 800; letter-spacing: .08em;
    text-transform: uppercase; color: #b45309; background: #fde68a; padding: .22rem .55rem; border-radius: 999px; }
  .tw-title { font-size: 1.45rem; font-weight: 800; color: #111827; margin: 0; letter-spacing: -0.01em; }
  .tw-intro { font-size: .95rem; color: #4b5563; margin: .2rem 0 1.1rem; line-height: 1.55; }
  .tw-form { display: flex; flex-direction: column; gap: 1rem; }
  .tw-field { display: flex; flex-direction: column; gap: .35rem; }
  .tw-label { font-size: .88rem; font-weight: 600; color: #374151; }
  .tw-input { padding: .7rem .85rem; border-radius: 8px; border: 1.5px solid #fde68a;
    font-family: inherit; font-size: .95rem; background: #fff; color: #111827; transition: border-color .15s, box-shadow .15s; }
  .tw-input:focus { outline: none; border-color: #f59e0b; box-shadow: 0 0 0 3px rgba(245,158,11,.15); }
  .tw-options { display: flex; flex-wrap: wrap; gap: .45rem; }
  .tw-option { display: inline-flex; align-items: center; gap: .45rem; padding: .55rem .85rem;
    background: #fff; border: 1.5px solid #fde68a; border-radius: 8px; font-size: .9rem; cursor: pointer;
    color: #374151; transition: all .12s; }
  .tw-option:has(input:checked) { background: #fef3c7; border-color: #f59e0b; color: #78350f; font-weight: 600; }
  .tw-option input { accent-color: #f59e0b; }
  .tw-actions { display: flex; align-items: center; gap: 1rem; margin-top: .6rem; flex-wrap: wrap; }
  .tw-submit { padding: .75rem 1.3rem; font-size: .95rem; font-weight: 700; color: #fff;
    background: linear-gradient(135deg, #f59e0b, #d97706); border: none; border-radius: 10px;
    cursor: pointer; font-family: inherit; transition: transform .15s, box-shadow .15s, opacity .15s; }
  .tw-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 18px -5px rgba(217,119,6,.4); }
  .tw-submit:disabled { opacity: .7; cursor: wait; }
  .tw-hint { font-size: .8rem; color: #78350f; }
  .tw-error { padding: .7rem .9rem; background: #fef2f2; border: 1px solid #fca5a5;
    border-radius: 8px; color: #991b1b; font-size: .9rem; }

  .tw-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px;
    padding: 1rem 1.15rem; margin: 0 0 .85rem; }
  .tw-card-head { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: .55rem; }
  .tw-card-title { font-size: 1rem; font-weight: 700; color: #111827; margin: 0; letter-spacing: -0.005em; }
  .tw-card-copy { font-size: .72rem; font-weight: 700; padding: .3rem .65rem; border-radius: 6px;
    background: #fef3c7; color: #92400e; border: 1px solid #fde68a; cursor: pointer;
    font-family: inherit; transition: all .15s; flex-shrink: 0; }
  .tw-card-copy:hover { background: #fde68a; }
  .tw-card-copy.copied { background: #10b981; color: #fff; border-color: #10b981; }
  .tw-card-body { background: #f9fafb; padding: .85rem 1rem; border-radius: 8px; margin: 0;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: .85rem; line-height: 1.55;
    color: #111827; white-space: pre-wrap; word-break: break-word; overflow-x: auto; }
  .tw-card-claude-md .tw-card-body { background: #1e293b; color: #e2e8f0; }

  .tw-next { margin-top: 1rem; padding: 1rem 1.15rem; border-radius: 12px;
    background: linear-gradient(135deg, #f5f3ff, #eef2ff); border: 1px solid #c4b5fd; }
  .tw-next-label { font-size: .7rem; font-weight: 800; text-transform: uppercase; letter-spacing: .08em;
    color: #6d28d9; margin: 0 0 .3rem; }
  .tw-next-body { font-size: .95rem; color: #1f2937; line-height: 1.55; margin: 0; }

  .tw-toolbar { display: flex; flex-wrap: wrap; gap: .5rem; margin-top: 1.1rem; }
  .tw-tool-btn { padding: .55rem .95rem; border-radius: 8px; font-size: .88rem; font-weight: 600;
    background: #fff; color: #b45309; border: 1.5px solid #fde68a; cursor: pointer; font-family: inherit;
    transition: all .15s; }
  .tw-tool-btn:hover:not(:disabled) { background: #fef3c7; border-color: #f59e0b; }
  .tw-tool-btn:disabled { opacity: .65; cursor: default; }
  .tw-tool-secondary { color: #6b7280; border-color: #e5e7eb; }
  .tw-status { margin-top: .7rem; font-size: .88rem; }
  .tw-status-ok { color: #065f46; }
  .tw-status-err { color: #991b1b; }

  /* Certificate claim widget */
  .cert-claim { margin: 2.5rem 0; padding: 1.6rem 1.8rem; border-radius: 18px;
    background: linear-gradient(135deg, #ecfdf5 0%, #eef2ff 100%);
    border: 1px solid #86efac; }
  .cc-head { display: flex; align-items: center; gap: .75rem; margin-bottom: .6rem; flex-wrap: wrap; }
  .cc-badge { display: inline-block; font-size: .7rem; font-weight: 800; letter-spacing: .08em;
    text-transform: uppercase; color: #065f46; background: #d1fae5; padding: .22rem .55rem; border-radius: 999px; }
  .cc-badge-ready { color: #7c3aed; background: #ede9fe; }
  .cc-badge-done { color: #065f46; background: #a7f3d0; }
  .cc-title { font-size: 1.3rem; font-weight: 800; color: #111827; margin: 0; letter-spacing: -0.01em; }
  .cc-body { font-size: .95rem; color: #374151; margin: 0 0 .9rem; line-height: 1.55; }
  .cc-bar { height: 10px; background: #d1fae5; border-radius: 999px; overflow: hidden; }
  .cc-bar-fill { height: 100%; background: linear-gradient(135deg, #10b981, #059669); border-radius: 999px; transition: width .35s ease; }
  .cc-form { display: flex; gap: .6rem; flex-wrap: wrap; }
  .cc-input { flex: 1; min-width: 200px; padding: .7rem .9rem; border-radius: 8px; border: 1.5px solid #86efac;
    font-family: inherit; font-size: .95rem; background: #fff; color: #111827; transition: border-color .15s, box-shadow .15s; }
  .cc-input:focus { outline: none; border-color: #059669; box-shadow: 0 0 0 3px rgba(16,185,129,.15); }
  .cc-actions { display: flex; gap: .6rem; flex-wrap: wrap; }
  .cc-btn { padding: .7rem 1.2rem; font-size: .9rem; font-weight: 700; border-radius: 10px;
    cursor: pointer; font-family: inherit; transition: transform .15s, box-shadow .15s, opacity .15s; text-decoration: none; display: inline-block; }
  .cc-btn-primary { color: #fff; background: linear-gradient(135deg, #10b981, #059669); border: none; }
  .cc-btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 18px -5px rgba(5,150,105,.4); }
  .cc-btn-primary:disabled { opacity: .7; cursor: wait; }
  .cc-error { padding: .6rem .85rem; margin-top: .7rem; background: #fef2f2; border: 1px solid #fca5a5;
    border-radius: 8px; color: #991b1b; font-size: .88rem; }
</style>
</head>
<body class="bg-white text-gray-900 antialiased">
<nav class="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100 z-50">
  <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
    <a href="/" class="flex items-center gap-2.5">
      <img src="/images/logo.png" alt="Smash Your AI" class="h-9 w-auto">
    </a>
    <div class="hidden md:flex items-center gap-5">
      <a href="/" class="text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors">Home</a>
      <a href="/#ai-training-services" class="text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors">Services</a>
      <a href="/course" class="text-sm font-medium text-violet-600 transition-colors">Online course</a>
      <a href="/#about-us" class="text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors">About us</a>
      <div class="relative group">
        <button class="text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors inline-flex items-center gap-1">
          Resources
          <svg class="w-3.5 h-3.5 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </button>
        <div class="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
          <a href="/prompts/" class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-violet-600 hover:bg-violet-50 transition-colors">
            <svg class="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            Prompt library
          </a>
          <a href="/content-calendars/" class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-violet-600 hover:bg-violet-50 transition-colors">
            <svg class="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            Content calendars
          </a>
          <a href="/ai-in-a-day" class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-violet-600 hover:bg-violet-50 transition-colors">
            <svg class="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
            AI in a day workbook
          </a>
          <a href="/ai-in-a-day-advanced" class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-violet-600 hover:bg-violet-50 transition-colors">
            <svg class="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
            AI in a day advanced
          </a>
          <a href="/quiz" class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-violet-600 hover:bg-violet-50 transition-colors">
            <svg class="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            AI readiness quiz
          </a>
          <a href="/savings-calculator" class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-violet-600 hover:bg-violet-50 transition-colors">
            <svg class="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            AI savings calculator
          </a>
          <div class="border-t border-gray-100 my-1"></div>
          <a href="/blog" class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-violet-600 hover:bg-violet-50 transition-colors">
            <svg class="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
            Blog
          </a>
        </div>
      </div>
      <a href="/#contact" class="gradient-btn text-white text-sm font-semibold px-5 py-2.5 rounded-xl">Get in touch</a>
      <div id="shared-auth-area"></div>
    </div>
    <button class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" onclick="document.getElementById('mobile-menu').classList.toggle('hidden')">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    </button>
  </div>
  <div id="mobile-menu" class="hidden md:hidden px-6 pb-4 space-y-3">
    <a href="/" class="block text-sm font-medium text-gray-600 hover:text-violet-600 py-2">Home</a>
    <a href="/#ai-training-services" class="block text-sm font-medium text-gray-600 hover:text-violet-600 py-2">Services</a>
    <a href="/course" class="block text-sm font-medium text-violet-600 py-2">Online course</a>
    <a href="/#about-us" class="block text-sm font-medium text-gray-600 hover:text-violet-600 py-2">About us</a>
    <div class="border-t border-gray-100 pt-2 mt-1">
      <span class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Resources</span>
      <a href="/prompts/" class="block text-sm font-medium text-gray-600 hover:text-violet-600 py-2 pl-2">Prompt library</a>
      <a href="/content-calendars/" class="block text-sm font-medium text-gray-600 hover:text-violet-600 py-2 pl-2">Content calendars</a>
      <a href="/ai-in-a-day" class="block text-sm font-medium text-gray-600 hover:text-violet-600 py-2 pl-2">AI in a day workbook</a>
      <a href="/ai-in-a-day-advanced" class="block text-sm font-medium text-gray-600 hover:text-violet-600 py-2 pl-2">AI in a day advanced</a>
      <a href="/quiz" class="block text-sm font-medium text-gray-600 hover:text-violet-600 py-2 pl-2">AI readiness quiz</a>
      <a href="/savings-calculator" class="block text-sm font-medium text-gray-600 hover:text-violet-600 py-2 pl-2">AI savings calculator</a>
      <a href="/blog" class="block text-sm font-medium text-gray-600 hover:text-violet-600 py-2 pl-2">Blog</a>
    </div>
    <a href="/#contact" class="block gradient-btn text-white text-sm font-semibold px-5 py-2.5 rounded-xl text-center">Get in touch</a>
    <div id="shared-auth-area-mobile"></div>
  </div>
</nav>
<div class="course-mobile-lessons">
  <button type="button" onclick="document.querySelector('.course-sidebar').classList.toggle('open')">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
    Lessons
  </button>
</div>
${body}
<script>window.__COURSE__ = ${JSON.stringify({ hasEntitlement, activeLessonKey })};</script>
<script src="/shared-nav.js?v=${BOOT_STAMP}"></script>
<script src="/course-progress.js?v=${BOOT_STAMP}"></script>
<script src="/bundle-modal.js?v=${BOOT_STAMP}"></script>
<script src="/course-extras.js?v=${BOOT_STAMP}"></script>
<script src="/prompt-grader.js?v=${BOOT_STAMP}"></script>
<script src="/tier-worksheet.js?v=${BOOT_STAMP}"></script>
<script src="/cert-claim.js?v=${BOOT_STAMP}"></script>
<script src="/model-sandbox.js?v=${BOOT_STAMP}"></script>
<script>
  // Accordion sidebar: exactly one tier open at a time.
  // Clicking a collapsed tier opens it and closes all others.
  // Clicking the open tier collapses it (allowing zero-open state).
  (function () {
    const tiers = document.querySelectorAll('.sidebar-tier');
    tiers.forEach(function (tier) {
      const btn = tier.querySelector('.sidebar-tier-header');
      if (!btn) return;
      btn.addEventListener('click', function () {
        const wasCollapsed = tier.classList.contains('collapsed');
        tiers.forEach(function (t) { t.classList.add('collapsed'); });
        if (wasCollapsed) tier.classList.remove('collapsed');
      });
    });
    // Keep the active lesson visible in the sidebar so the user doesn't lose their place.
    const active = document.querySelector('.sidebar-link.active');
    if (active) {
      active.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      const sidebar = document.querySelector('.course-sidebar');
      if (sidebar) {
        const rect = active.getBoundingClientRect();
        const sbRect = sidebar.getBoundingClientRect();
        if (rect.top - sbRect.top < 80) sidebar.scrollTop -= 80;
      }
    }
  })();
</script>
</body>
</html>`;
}

function renderSidebar(course, activeLessonKey, completedKeys, hasEntitlement = false) {
  const activeTierSlug = activeLessonKey ? activeLessonKey.split('/')[0] : 'beginner';

  const parts = [`<aside class="course-sidebar">`];
  parts.push(`<a href="/course" class="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-violet-600 mb-4 px-2"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>Course overview</a>`);

  for (const tier of course.tiers) {
    const isActive = tier.slug === activeTierSlug;
    const collapsedClass = isActive ? '' : ' collapsed';
    parts.push(`<div class="sidebar-tier${collapsedClass}">`);
    parts.push(`<button type="button" class="sidebar-tier-header"><span>${escape(tier.title)}</span><svg class="sidebar-tier-chev" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg></button>`);
    parts.push(`<div class="sidebar-tier-body">`);

    for (const mod of tier.modules) {
      parts.push(`<div class="sidebar-module">`);
      parts.push(`<div class="sidebar-module-title"><span class="module-num">${mod.globalNumber}.</span><span class="module-label">${escape(mod.title)}</span>`);
      // Padlock state: free modules have no padlock; paid modules show open if user has access, closed otherwise.
      if (!mod.isFreeModule) {
        if (hasEntitlement) parts.push(`<span class="lock open" title="Unlocked">🔓</span>`);
        else parts.push(`<span class="lock closed" title="Paid lessons">🔐</span>`);
      }
      parts.push(`</div>`);

      mod.lessons.forEach((lesson) => {
        const done = completedKeys.has(lesson.key);
        const activeClass = lesson.key === activeLessonKey ? ' active' : '';
        const tick = done
          ? `<svg class="tick text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>`
          : `<span class="tick-ring"></span>`;
        parts.push(`<a href="/course/${escape(tier.slug)}/${escape(mod.slug)}/${escape(lesson.slug)}" class="sidebar-link${activeClass}" data-lesson-key="${escape(lesson.key)}">${tick}<span class="lesson-label"><span class="lesson-number">Lesson ${lesson.globalNumber}</span>${escape(lesson.title)}</span></a>`);
      });

      parts.push(`</div>`);
    }
    parts.push(`</div></div>`); // body, tier
  }

  parts.push(`</aside>`);
  return parts.join('');
}

function renderTierPage({ course, tier, completedKeys = new Set(), hasEntitlement }) {
  const totalLessons = tier.modules.reduce((s, m) => s + m.lessons.length, 0);
  const completedInTier = tier.modules.reduce((s, m) => s + m.lessons.filter(l => completedKeys.has(l.key)).length, 0);
  const pct = totalLessons ? Math.round((completedInTier / totalLessons) * 100) : 0;

  // Synthesise an "active tier" so the sidebar opens this one by default.
  const firstLessonKey = tier.modules[0] && tier.modules[0].lessons[0] ? tier.modules[0].lessons[0].key : null;
  const sidebar = renderSidebar(course, firstLessonKey, completedKeys, hasEntitlement);

  const modulesHtml = tier.modules.map((mod) => {
    const lessonsHtml = mod.lessons.map((lesson) => {
      const done = completedKeys.has(lesson.key);
      const locked = !mod.isFreeModule && !hasEntitlement;
      const icon = done
        ? `<svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>`
        : locked
          ? `<span class="w-5 h-5 flex-shrink-0 flex items-center justify-center text-gray-400 text-sm">🔐</span>`
          : `<span class="w-5 h-5 rounded-full border-2 border-gray-200 flex-shrink-0"></span>`;
      return `<a href="/course/${escape(tier.slug)}/${escape(mod.slug)}/${escape(lesson.slug)}" class="flex items-center gap-4 px-5 py-4 hover:bg-violet-50 transition-colors group" data-lesson-key="${escape(lesson.key)}">
        <span class="text-xs font-semibold text-violet-600 w-10 flex-shrink-0">${String(lesson.globalNumber).padStart(2, '0')}</span>
        ${icon}
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-gray-900 group-hover:text-violet-700">${escape(lesson.title)}</p>
          ${(lesson.summary || lesson.duration) ? `<p class="text-xs text-gray-500 mt-0.5">${lesson.duration ? escape(lesson.duration) + ' min' : ''}${lesson.duration && lesson.summary ? ' · ' : ''}${lesson.summary ? escape(lesson.summary) : ''}</p>` : ''}
        </div>
        <svg class="w-4 h-4 text-gray-300 group-hover:text-violet-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>`;
    }).join('');

    return `<section class="mb-6 bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <header class="px-5 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="w-8 h-8 rounded-full bg-violet-100 text-violet-700 text-sm font-bold flex items-center justify-center">${mod.globalNumber}</span>
          <h3 class="font-bold text-gray-900">${escape(mod.title)}</h3>
        </div>
        ${mod.isFreeModule
          ? `<span class="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">Free</span>`
          : hasEntitlement
            ? `<span class="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">🔓 Unlocked</span>`
            : `<span class="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">🔐 Paid</span>`
        }
      </header>
      <div class="divide-y divide-gray-100">${lessonsHtml}</div>
    </section>`;
  }).join('');

  const body = `<div class="course-shell">
    ${sidebar}
    <main class="course-main">
      <nav class="text-sm text-gray-500 mb-4"><a href="/course" class="hover:text-violet-600">Course</a> <span class="mx-1.5">›</span> <span class="text-gray-700">${escape(tier.title)}</span></nav>
      <h1 class="text-3xl md:text-4xl font-extrabold mb-3">${escape(tier.title)}</h1>
      ${tier.earlyAccess ? `<div class="mb-6 p-4 rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50 flex items-start gap-3">
        <span class="text-xl">🚧</span>
        <div class="text-sm text-violet-900">
          <p class="font-semibold mb-1">Early access, Chapter 1</p>
          <p class="text-violet-800/90">${escape(tier.earlyAccessNote || 'This tier is still being written. You get full access to what is published today, plus every new lesson as it lands, at no extra cost.')}</p>
        </div>
      </div>` : ''}
      <p class="text-gray-600 mb-6 text-lg">${escape(tier.blurb)}</p>
      <div class="mb-10">
        <div class="flex justify-between text-sm text-gray-500 mb-1.5"><span>${completedInTier} of ${totalLessons} lessons complete</span><span>${pct}%</span></div>
        <div class="w-full bg-gray-200 rounded-full h-2"><div class="gradient-btn rounded-full h-2 transition-all" style="width: ${pct}%"></div></div>
      </div>
      ${modulesHtml}
    </main>
  </div>`;

  return layout({ title: tier.title, description: tier.blurb, body, hasEntitlement });
}

function renderLessonPage({ course, tier, mod, lesson, completedKeys = new Set(), hasEntitlement, locked }) {
  const sidebar = renderSidebar(course, lesson.key, completedKeys, hasEntitlement);

  const tocHtml = lesson.toc && lesson.toc.length
    ? `<aside class="course-toc">
        <p class="toc-title">On this page</p>
        <ul class="toc-list">
          ${lesson.toc.map(item => `<li class="level-${item.level}"><a href="#${escape(item.id)}">${escape(item.text)}</a></li>`).join('')}
        </ul>
      </aside>`
    : `<aside class="course-toc"></aside>`;

  let mainContent;
  if (locked) {
    const teaser = lesson.html.split('</p>')[0] + '</p>';
    mainContent = `
      <article class="prose-lesson">${teaser}</article>
      <div class="mt-10 p-8 bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 rounded-2xl text-center">
        <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">🔐</div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Unlock the full course to continue</h3>
        <p class="text-gray-600 mb-6 max-w-md mx-auto">One payment, all three tiers, lifetime access. Module 1 of the Beginner tier stays free forever.</p>
        <button onclick="buyCourse()" class="gradient-btn text-white font-semibold px-6 py-3 rounded-xl">Unlock for £49</button>
        <p class="text-xs text-gray-500 mt-3">No subscription. Lifetime updates.</p>
      </div>`;
  } else {
    const prevNext = `<div class="flex items-center justify-between mt-12 pt-6 border-t border-gray-100">
      ${lesson.prev ? `<a href="/course/${escape(lesson.prev.key)}" class="text-sm text-gray-600 hover:text-violet-600">← ${escape(lesson.prev.title)}</a>` : '<span></span>'}
      ${lesson.next ? `<a href="/course/${escape(lesson.next.key)}" class="text-sm font-semibold text-violet-600 hover:text-violet-800">${escape(lesson.next.title)} →</a>` : '<span></span>'}
    </div>`;

    mainContent = `
      <article class="prose-lesson">${lesson.html}</article>
      <div class="mt-10 p-5 bg-violet-50 border border-violet-200 rounded-xl flex items-center gap-3">
        <label class="inline-flex items-center gap-3 cursor-pointer">
          <input type="checkbox" id="lesson-complete-toggle" data-lesson-key="${escape(lesson.key)}" class="w-5 h-5 accent-violet-600">
          <span class="font-semibold text-violet-900" id="lesson-complete-label">Mark as complete</span>
        </label>
      </div>
      ${prevNext}`;
  }

  const body = `<div class="course-shell">
    ${sidebar}
    <main class="course-main">
      <nav class="text-sm text-gray-500 mb-4">
        <a href="/course" class="hover:text-violet-600">Course</a>
        <span class="mx-1.5">›</span>
        <a href="/course/${escape(tier.slug)}" class="hover:text-violet-600">${escape(tier.title)}</a>
        <span class="mx-1.5">›</span>
        <span class="text-gray-700">Module ${mod.globalNumber}: ${escape(mod.title)}</span>
      </nav>
      <p class="text-xs font-bold uppercase tracking-wider text-violet-600 mb-2">Lesson ${lesson.globalNumber} of ${course.totals.lessons}</p>
      <h1 class="text-3xl md:text-4xl font-extrabold mb-3" style="letter-spacing:-0.015em;">${escape(lesson.title)}</h1>
      ${lesson.duration ? `<p class="text-sm text-gray-500 mb-8">⏱ ${escape(lesson.duration)} min${lesson.summary ? ' · ' + escape(lesson.summary) : ''}</p>` : (lesson.summary ? `<p class="text-sm text-gray-500 mb-8">${escape(lesson.summary)}</p>` : '')}
      ${mainContent}
    </main>
    ${tocHtml}
  </div>`;

  return layout({ title: lesson.title, description: lesson.summary || tier.title, body, activeLessonKey: lesson.key, hasEntitlement });
}

module.exports = {
  renderTierPage,
  renderLessonPage,
};
