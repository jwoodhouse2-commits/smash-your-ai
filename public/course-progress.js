(function () {
  const STORAGE_KEY = 'courseProgress';
  const ctx = window.__COURSE__ || {};
  let completed = new Set();
  let loggedIn = false;

  function readLocal() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  function writeLocal() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(completed))); } catch (e) {}
  }

  async function loadFromServer() {
    try {
      const res = await fetch('/api/course/progress');
      if (!res.ok) return null;
      const data = await res.json();
      return new Set(data.completed || []);
    } catch (e) { return null; }
  }

  function paintSidebar() {
    document.querySelectorAll('[data-lesson-key]').forEach(el => {
      const key = el.getAttribute('data-lesson-key');
      const tick = el.querySelector('.tick');
      if (!tick) return;
      if (completed.has(key)) {
        tick.outerHTML = '<svg class="tick text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>';
      }
    });
    const checkbox = document.getElementById('lesson-complete-toggle');
    const label = document.getElementById('lesson-complete-label');
    if (checkbox) {
      const key = checkbox.getAttribute('data-lesson-key');
      checkbox.checked = completed.has(key);
      if (label) label.textContent = checkbox.checked ? 'Completed' : 'Mark as complete';
    }
  }

  async function toggle(lessonKey, shouldComplete) {
    if (shouldComplete) completed.add(lessonKey); else completed.delete(lessonKey);
    writeLocal();
    paintSidebar();
    if (loggedIn) {
      try {
        await fetch('/api/course/progress', {
          method: shouldComplete ? 'POST' : 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lessonKey })
        });
      } catch (e) { /* stays in localStorage; will sync next visit */ }
    }
    document.dispatchEvent(new CustomEvent('course-progress-changed', { detail: { lessonKey, completed: shouldComplete } }));
  }

  async function init() {
    // Detect login state from shared-nav's /me endpoint
    try {
      const me = await fetch('/prompts/auth/me').then(r => r.json());
      loggedIn = !!me.user;
    } catch (e) { loggedIn = false; }

    const local = new Set(readLocal());

    if (loggedIn) {
      const server = await loadFromServer();
      if (server) {
        // Merge: union local + server, push anything local-only to server
        const serverOnly = new Set([...server].filter(k => !local.has(k)));
        const localOnly = [...local].filter(k => !server.has(k));
        if (localOnly.length > 0) {
          try {
            await fetch('/api/course/progress/merge', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ lessonKeys: localOnly })
            });
          } catch (e) {}
        }
        completed = new Set([...local, ...server]);
      } else {
        completed = local;
      }
    } else {
      completed = local;
    }
    writeLocal();
    paintSidebar();

    const checkbox = document.getElementById('lesson-complete-toggle');
    if (checkbox) {
      checkbox.addEventListener('change', () => {
        const key = checkbox.getAttribute('data-lesson-key');
        toggle(key, checkbox.checked);
      });
    }
  }

  window.buyCourse = async function () {
    try {
      const me = await fetch('/prompts/auth/me').then(r => r.json());
      if (!me.user) {
        const next = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = '/prompts?login=1&next=' + next;
        return;
      }
      const res = await fetch('/prompts/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: 'course' })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else if (data.redirect) window.location.href = data.redirect;
      else if (data.error) alert(data.error);
    } catch (e) { alert('Something went wrong. Please try again.'); }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
