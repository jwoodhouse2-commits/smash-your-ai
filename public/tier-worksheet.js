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

  function renderForm(widget, schema, onSubmit) {
    widget.innerHTML = '';

    const header = el('div', { class: 'tw-header' }, [
      el('span', { class: 'tw-badge', text: 'Apply to your work' }),
      el('h3', { class: 'tw-title', text: schema.title }),
    ]);
    widget.appendChild(header);
    if (schema.intro) widget.appendChild(el('p', { class: 'tw-intro', text: schema.intro }));

    const form = el('form', { class: 'tw-form' });

    schema.questions.forEach((q) => {
      const field = el('div', { class: 'tw-field' });
      const label = el('label', { class: 'tw-label', for: `tw-${q.id}`, text: q.label + (q.required ? ' *' : '') });
      field.appendChild(label);

      if (q.type === 'radio') {
        const optionsWrap = el('div', { class: 'tw-options' });
        q.options.forEach((opt, i) => {
          const id = `tw-${q.id}-${i}`;
          const wrap = el('label', { class: 'tw-option', for: id });
          const input = el('input', { type: 'radio', name: `tw-${q.id}`, id, value: opt });
          if (q.required) input.required = true;
          wrap.appendChild(input);
          wrap.appendChild(el('span', { text: opt }));
          optionsWrap.appendChild(wrap);
        });
        field.appendChild(optionsWrap);
      } else {
        const input = el('input', {
          type: 'text',
          id: `tw-${q.id}`,
          name: q.id,
          class: 'tw-input',
          placeholder: q.placeholder || '',
          maxlength: q.maxLength || 500,
        });
        if (q.required) input.required = true;
        field.appendChild(input);
      }

      form.appendChild(field);
    });

    const actions = el('div', { class: 'tw-actions' });
    const button = el('button', { class: 'tw-submit', type: 'submit', text: 'Generate my starter pack' });
    const hint = el('span', { class: 'tw-hint', text: 'Takes a few seconds. Costs you nothing.' });
    actions.appendChild(button);
    actions.appendChild(hint);
    form.appendChild(actions);

    const errorBox = el('div', { class: 'tw-error', style: 'display:none' });
    form.appendChild(errorBox);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const answers = {};
      schema.questions.forEach((q) => {
        if (q.type === 'radio') {
          const picked = form.querySelector(`input[name="tw-${q.id}"]:checked`);
          answers[q.id] = picked ? picked.value : '';
        } else {
          const input = form.querySelector(`#tw-${q.id}`);
          answers[q.id] = input ? input.value.trim() : '';
        }
      });
      errorBox.style.display = 'none';
      button.disabled = true;
      button.textContent = 'Generating...';
      onSubmit(answers, {
        fail: (msg) => {
          errorBox.textContent = msg;
          errorBox.style.display = 'block';
          button.disabled = false;
          button.textContent = 'Generate my starter pack';
        },
      });
    });

    widget.appendChild(form);
  }

  function renderResult(widget, schema, result, onRegenerate) {
    widget.innerHTML = '';

    const header = el('div', { class: 'tw-header' }, [
      el('span', { class: 'tw-badge', text: 'Your starter pack' }),
      el('h3', { class: 'tw-title', text: result.title }),
    ]);
    widget.appendChild(header);

    if (result.intro) widget.appendChild(el('p', { class: 'tw-intro', text: result.intro }));

    result.sections.forEach((s, i) => {
      const card = el('div', { class: `tw-card tw-card-${s.type}` });
      const top = el('div', { class: 'tw-card-head' }, [
        el('h4', { class: 'tw-card-title', text: s.heading }),
        el('button', { class: 'tw-card-copy', type: 'button', 'data-copy': s.body, text: 'Copy' }),
      ]);
      card.appendChild(top);
      card.appendChild(el('pre', { class: 'tw-card-body', text: s.body }));
      widget.appendChild(card);
    });

    if (result.nextStep) {
      const next = el('div', { class: 'tw-next' });
      next.appendChild(el('p', { class: 'tw-next-label', text: 'Your next step' }));
      next.appendChild(el('p', { class: 'tw-next-body', text: result.nextStep }));
      widget.appendChild(next);
    }

    const toolbar = el('div', { class: 'tw-toolbar' });
    const emailBtn = el('button', { class: 'tw-tool-btn', type: 'button', text: '📧 Email me this pack' });
    const dlBtn = el('button', { class: 'tw-tool-btn', type: 'button', text: '⬇︎ Download Markdown' });
    const regenBtn = el('button', { class: 'tw-tool-btn tw-tool-secondary', type: 'button', text: 'Start over' });
    toolbar.appendChild(emailBtn);
    toolbar.appendChild(dlBtn);
    toolbar.appendChild(regenBtn);
    widget.appendChild(toolbar);

    const status = el('div', { class: 'tw-status' });
    widget.appendChild(status);

    // Copy per card
    widget.addEventListener('click', (e) => {
      const btn = e.target.closest('.tw-card-copy');
      if (!btn) return;
      const text = btn.getAttribute('data-copy') || '';
      navigator.clipboard.writeText(text).then(() => {
        const o = btn.textContent;
        btn.textContent = 'Copied';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = o; btn.classList.remove('copied'); }, 1500);
      }).catch(() => {});
    });

    emailBtn.addEventListener('click', async () => {
      emailBtn.disabled = true;
      emailBtn.textContent = 'Sending...';
      status.textContent = '';
      try {
        const res = await fetch('/api/worksheet/email', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin', body: JSON.stringify({ result }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.ok) {
          status.textContent = '✓ Sent to your email address.';
          status.className = 'tw-status tw-status-ok';
          emailBtn.textContent = 'Sent';
        } else {
          status.textContent = data.message || 'Could not send. Try again.';
          status.className = 'tw-status tw-status-err';
          emailBtn.disabled = false; emailBtn.textContent = '📧 Email me this pack';
        }
      } catch (err) {
        status.textContent = 'Network error. Try again.';
        status.className = 'tw-status tw-status-err';
        emailBtn.disabled = false; emailBtn.textContent = '📧 Email me this pack';
      }
    });

    dlBtn.addEventListener('click', async () => {
      const res = await fetch('/api/worksheet/markdown', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin', body: JSON.stringify({ result }),
      });
      if (!res.ok) { status.textContent = 'Could not generate Markdown.'; status.className = 'tw-status tw-status-err'; return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `${result.tier || 'smash-your-ai'}-starter-pack.md`;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    });

    regenBtn.addEventListener('click', onRegenerate);
  }

  async function hydrate(widget) {
    if (widget.__twHydrated) return;
    widget.__twHydrated = true;
    const tier = widget.getAttribute('data-tier');
    if (!tier) return;

    widget.innerHTML = '<div class="tw-loading">Loading your worksheet...</div>';
    let schema;
    try {
      const r = await fetch(`/api/worksheet/${tier}/schema`);
      schema = await r.json();
      if (!schema.ok) throw new Error(schema.message || 'Could not load worksheet.');
    } catch (err) {
      widget.innerHTML = `<div class="tw-error" style="display:block">Could not load worksheet.</div>`;
      return;
    }

    const start = () => {
      renderForm(widget, schema, async (answers, { fail }) => {
        try {
          const res = await fetch('/api/worksheet/generate', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin', body: JSON.stringify({ tier, answers }),
          });
          if (res.status === 401) return fail('Log in to generate your starter pack.');
          if (res.status === 402) return fail('Unlock the course to generate this worksheet.');
          const data = await res.json().catch(() => null);
          if (!data || !data.ok) return fail((data && data.message) || 'Something went wrong.');
          renderResult(widget, schema, data, start);
          widget.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (err) {
          fail('Network error. Try again.');
        }
      });
    };
    start();
  }

  function init() {
    document.querySelectorAll('.tier-worksheet').forEach(hydrate);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
