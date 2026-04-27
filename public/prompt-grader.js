(function () {
  'use strict';

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        if (k === 'class') node.className = attrs[k];
        else if (k === 'text') node.textContent = attrs[k];
        else if (k === 'html') node.innerHTML = attrs[k];
        else node.setAttribute(k, attrs[k]);
      }
    }
    (children || []).forEach(c => { if (c) node.appendChild(c); });
    return node;
  }

  function scoreColor(score) {
    if (score >= 8) return '#059669';
    if (score >= 5) return '#d97706';
    return '#dc2626';
  }

  function scoreEmoji(score) {
    if (score >= 9) return '🏆';
    if (score >= 7) return '✅';
    if (score >= 5) return '🛠️';
    return '📝';
  }

  function renderResult(container, result) {
    container.innerHTML = '';
    if (!result.ok) {
      const err = el('div', { class: 'pg-error', text: result.message || 'Something went wrong.' });
      container.appendChild(err);
      return;
    }

    const headerRow = el('div', { class: 'pg-result-header' }, [
      el('div', { class: 'pg-score', html: `<span class="pg-score-emoji">${scoreEmoji(result.score)}</span><span class="pg-score-num" style="color:${scoreColor(result.score)}">${result.score}</span><span class="pg-score-out">/ ${result.scoreOutOf}</span>` }),
      el('div', { class: 'pg-headline', text: result.headline || '' }),
    ]);
    container.appendChild(headerRow);

    if (result.strengths && result.strengths.length) {
      const s = el('div', { class: 'pg-section' });
      s.appendChild(el('h4', { class: 'pg-section-title pg-strengths-title', text: "What's working" }));
      const ul = el('ul', { class: 'pg-list' });
      result.strengths.forEach(item => ul.appendChild(el('li', { text: item })));
      s.appendChild(ul);
      container.appendChild(s);
    }

    if (result.fixes && result.fixes.length) {
      const f = el('div', { class: 'pg-section' });
      f.appendChild(el('h4', { class: 'pg-section-title pg-fixes-title', text: 'Try this next' }));
      const ul = el('ul', { class: 'pg-list' });
      result.fixes.forEach(item => ul.appendChild(el('li', { text: item })));
      f.appendChild(ul);
      container.appendChild(f);
    }

    if (result.rewrite) {
      const r = el('div', { class: 'pg-section' });
      const titleRow = el('div', { class: 'pg-rewrite-head' }, [
        el('h4', { class: 'pg-section-title', text: 'A stronger version' }),
        el('button', { class: 'pg-copy', type: 'button', 'data-copy': result.rewrite, text: 'Copy' }),
      ]);
      r.appendChild(titleRow);
      r.appendChild(el('pre', { class: 'pg-rewrite', text: result.rewrite }));
      container.appendChild(r);
    }
  }

  async function submitGrade(widget, textarea, resultEl, button) {
    const lessonKey = widget.getAttribute('data-lesson-key');
    const userPrompt = textarea.value.trim();
    if (userPrompt.length < 10) {
      renderResult(resultEl, { ok: false, message: 'Write a bit more before asking for a grade. Aim for at least a sentence or two.' });
      return;
    }

    button.disabled = true;
    button.textContent = 'Grading...';
    resultEl.innerHTML = '<div class="pg-loading">Thinking about your prompt...</div>';

    try {
      const res = await fetch('/api/grade-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ lessonKey, userPrompt }),
      });

      if (res.status === 401) {
        renderResult(resultEl, { ok: false, message: 'Log in to use the grader. It is free with any account.' });
        return;
      }
      if (res.status === 402) {
        renderResult(resultEl, { ok: false, message: 'Unlock the course to use the grader on this lesson.' });
        return;
      }

      const data = await res.json().catch(() => null);
      if (!data) {
        renderResult(resultEl, { ok: false, message: 'The grader returned an unexpected response. Try again.' });
        return;
      }
      renderResult(resultEl, data);
    } catch (err) {
      renderResult(resultEl, { ok: false, message: 'Could not reach the grader. Check your connection and try again.' });
    } finally {
      button.disabled = false;
      button.textContent = 'Grade my prompt';
    }
  }

  function hydrate(widget) {
    if (widget.__pgHydrated) return;
    widget.__pgHydrated = true;

    const task = widget.getAttribute('data-task') || '';
    widget.innerHTML = '';

    const header = el('div', { class: 'pg-header' }, [
      el('span', { class: 'pg-badge', text: 'Try it' }),
      el('h3', { class: 'pg-title', text: 'Grade my prompt' }),
    ]);
    widget.appendChild(header);

    if (task) {
      widget.appendChild(el('p', { class: 'pg-task', text: task }));
    }

    const textarea = el('textarea', {
      class: 'pg-textarea',
      placeholder: 'Paste or type your prompt here...',
      rows: '6',
      maxlength: '4000',
    });
    widget.appendChild(textarea);

    const actions = el('div', { class: 'pg-actions' });
    const button = el('button', { class: 'pg-submit', type: 'button', text: 'Grade my prompt' });
    const hint = el('span', { class: 'pg-hint', text: 'Uses AI. Takes a few seconds. Costs you nothing.' });
    actions.appendChild(button);
    actions.appendChild(hint);
    widget.appendChild(actions);

    const result = el('div', { class: 'pg-result' });
    widget.appendChild(result);

    button.addEventListener('click', () => submitGrade(widget, textarea, result, button));

    // Copy-to-clipboard on rewrite (event delegation because rewrite is re-rendered).
    widget.addEventListener('click', (e) => {
      const btn = e.target.closest('.pg-copy');
      if (!btn) return;
      const text = btn.getAttribute('data-copy') || '';
      navigator.clipboard.writeText(text).then(() => {
        const original = btn.textContent;
        btn.textContent = 'Copied';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = original; btn.classList.remove('copied'); }, 1500);
      }).catch(() => {});
    });
  }

  function init() {
    document.querySelectorAll('.prompt-grader').forEach(hydrate);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
