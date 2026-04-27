// Live model-comparison sandbox widget.
// Hydrates any <div class="model-sandbox"> on the page.
//
// Optional data-attributes:
//   data-default-prompt  Placeholder + starter text in the input
//   data-models          Comma-separated model slugs (e.g. "gpt-4o-mini,claude-haiku")
//   data-headline        Headline shown above the widget
//   data-compact         "true" for a denser layout (sales page)

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

  // Escape HTML before any markdown transforms run, so model output can't
  // inject tags. Order inside renderMarkdown is deliberate: escape, then
  // inline code (so * and _ inside code don't get parsed), then bold before
  // italic, then block-level (paragraphs + lists).
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderInline(s) {
    return s
      .replace(/`([^`\n]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*\n]+?)\*\*/g, '<strong>$1</strong>')
      .replace(/__([^_\n]+?)__/g, '<strong>$1</strong>')
      .replace(/(^|[^\*])\*([^*\n]+?)\*(?!\*)/g, '$1<em>$2</em>')
      .replace(/(^|[^_])_([^_\n]+?)_(?!_)/g, '$1<em>$2</em>');
  }

  function renderMarkdown(raw) {
    if (!raw) return '';
    const escaped = escapeHtml(raw);
    const blocks = escaped.split(/\n{2,}/);
    return blocks.map(block => {
      const lines = block.split('\n');
      const bulletLines = lines.filter(l => /^\s*[-*]\s+/.test(l));
      const numberedLines = lines.filter(l => /^\s*\d+\.\s+/.test(l));

      if (bulletLines.length && bulletLines.length === lines.filter(l => l.trim()).length) {
        const items = lines.filter(l => l.trim()).map(l => {
          const content = l.replace(/^\s*[-*]\s+/, '');
          return '<li>' + renderInline(content) + '</li>';
        }).join('');
        return '<ul>' + items + '</ul>';
      }

      if (numberedLines.length && numberedLines.length === lines.filter(l => l.trim()).length) {
        const items = lines.filter(l => l.trim()).map(l => {
          const content = l.replace(/^\s*\d+\.\s+/, '');
          return '<li>' + renderInline(content) + '</li>';
        }).join('');
        return '<ol>' + items + '</ol>';
      }

      const headingMatch = block.match(/^(#{1,3})\s+(.+)$/);
      if (headingMatch && lines.length === 1) {
        const level = headingMatch[1].length + 2;
        return '<h' + level + '>' + renderInline(headingMatch[2]) + '</h' + level + '>';
      }

      return '<p>' + renderInline(block.replace(/\n/g, '<br>')) + '</p>';
    }).join('');
  }

  async function fetchCatalog() {
    try {
      const res = await fetch('/api/sandbox/models', { credentials: 'same-origin' });
      if (!res.ok) return null;
      return await res.json();
    } catch (_) { return null; }
  }

  function modelBadgeColor(vendor) {
    if (vendor === 'OpenAI') return '#10a37f';
    if (vendor === 'Anthropic') return '#c96442';
    return '#6366f1';
  }

  function formatMs(ms) {
    if (!ms && ms !== 0) return '';
    if (ms < 1000) return `${ms} ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  }

  function renderPanel(slug, def) {
    const panel = el('div', { class: 'ms-panel', 'data-panel': slug });
    const header = el('div', { class: 'ms-panel-head' }, [
      el('div', { class: 'ms-panel-title' }, [
        el('span', { class: 'ms-dot', style: `background:${modelBadgeColor(def.vendor)}` }),
        el('strong', { text: def.label }),
      ]),
      el('span', { class: 'ms-vendor', text: def.vendor }),
    ]);
    panel.appendChild(header);

    const meta = el('div', { class: 'ms-meta' }, [
      el('span', { class: 'ms-status', text: 'Ready' }),
      el('span', { class: 'ms-timing' }),
    ]);
    panel.appendChild(meta);

    const body = el('div', { class: 'ms-body', text: 'Waiting to run...' });
    panel.appendChild(body);
    return panel;
  }

  function hydrate(widget, catalog) {
    if (widget.__msHydrated) return;
    widget.__msHydrated = true;

    const defaultPrompt = widget.getAttribute('data-default-prompt') || '';
    const preset = (widget.getAttribute('data-models') || '').split(',').map(s => s.trim()).filter(Boolean);
    const headlineText = widget.getAttribute('data-headline') || 'Try it: the same prompt, two AI models, side by side';
    const compact = widget.getAttribute('data-compact') === 'true';
    if (compact) widget.classList.add('ms-compact');

    const available = catalog && catalog.models ? catalog.models : [];
    const defaults = catalog && catalog.defaults ? catalog.defaults : ['gpt-4o-mini', 'claude-haiku'];
    const startingModels = (preset.length ? preset : defaults).slice(0, 3);

    widget.innerHTML = '';

    const headline = el('div', { class: 'ms-headline' }, [
      el('span', { class: 'ms-badge', text: 'Live sandbox' }),
      el('h3', { class: 'ms-title', text: headlineText }),
    ]);
    widget.appendChild(headline);

    // Model picker row
    const picker = el('div', { class: 'ms-picker' });
    picker.appendChild(el('span', { class: 'ms-picker-label', text: 'Comparing:' }));
    const pickerWrap = el('div', { class: 'ms-picker-chips' });
    available.forEach(m => {
      const id = `ms-${widget.__msId || (widget.__msId = Math.random().toString(36).slice(2, 8))}-${m.slug}`;
      const checked = startingModels.includes(m.slug);
      const chip = el('label', { class: 'ms-chip' + (checked ? ' selected' : ''), for: id }, [
        el('input', { type: 'checkbox', id, value: m.slug, class: 'ms-chip-input', ...(checked ? { checked: 'checked' } : {}) }),
        el('span', { class: 'ms-chip-dot', style: `background:${modelBadgeColor(m.vendor)}` }),
        el('span', { class: 'ms-chip-label', text: m.label }),
        el('span', { class: 'ms-chip-speed', text: m.speed }),
      ]);
      pickerWrap.appendChild(chip);
    });
    picker.appendChild(pickerWrap);
    widget.appendChild(picker);

    // Prompt input
    const textarea = el('textarea', {
      class: 'ms-textarea',
      placeholder: defaultPrompt || 'Type any prompt. E.g. "Write a 40-word LinkedIn post announcing a free AI workshop in Newcastle."',
      rows: compact ? '3' : '4',
      maxlength: '2000',
    });
    if (defaultPrompt) textarea.value = defaultPrompt;
    widget.appendChild(textarea);

    // Actions
    const actions = el('div', { class: 'ms-actions' });
    const runButton = el('button', { class: 'ms-run', type: 'button', text: 'Run comparison' });
    const hint = el('span', { class: 'ms-hint', text: 'Free to try. Streams responses live.' });
    actions.appendChild(runButton);
    actions.appendChild(hint);
    widget.appendChild(actions);

    // Error banner
    const errorBar = el('div', { class: 'ms-error' });
    errorBar.style.display = 'none';
    widget.appendChild(errorBar);

    // Panels grid (empty until first run)
    const grid = el('div', { class: 'ms-grid' });
    widget.appendChild(grid);

    // Chip click toggles class for styling
    widget.addEventListener('change', (e) => {
      if (!e.target.classList.contains('ms-chip-input')) return;
      const chip = e.target.closest('.ms-chip');
      if (chip) chip.classList.toggle('selected', e.target.checked);
    });

    function currentModels() {
      return Array.from(widget.querySelectorAll('.ms-chip-input:checked')).map(c => c.value);
    }

    function showError(msg) {
      errorBar.textContent = msg;
      errorBar.style.display = 'block';
    }
    function clearError() {
      errorBar.textContent = '';
      errorBar.style.display = 'none';
    }

    function buildPanels(models) {
      grid.innerHTML = '';
      grid.className = 'ms-grid ms-grid-' + models.length;
      const defMap = new Map(available.map(m => [m.slug, m]));
      models.forEach(slug => {
        const def = defMap.get(slug) || { label: slug, vendor: '' };
        grid.appendChild(renderPanel(slug, def));
      });
    }

    function updatePanel(slug, partial) {
      const panel = grid.querySelector(`[data-panel="${slug}"]`);
      if (!panel) return;
      if (partial.status !== undefined) panel.querySelector('.ms-status').textContent = partial.status;
      if (partial.timing !== undefined) panel.querySelector('.ms-timing').textContent = partial.timing;
      if (partial.body !== undefined) panel.querySelector('.ms-body').textContent = partial.body;
      if (partial.state) panel.setAttribute('data-state', partial.state);
    }

    function appendDelta(slug, text) {
      const panel = grid.querySelector(`[data-panel="${slug}"]`);
      if (!panel) return;
      const body = panel.querySelector('.ms-body');
      if (body.getAttribute('data-streaming') !== '1') {
        body.__msRaw = '';
        body.innerHTML = '';
        body.setAttribute('data-streaming', '1');
      }
      body.__msRaw = (body.__msRaw || '') + text;
      body.innerHTML = renderMarkdown(body.__msRaw);
    }

    function finalizeBody(slug) {
      const panel = grid.querySelector(`[data-panel="${slug}"]`);
      if (!panel) return;
      const body = panel.querySelector('.ms-body');
      const raw = body.__msRaw || '';
      if (!raw) {
        body.textContent = '(no response)';
      } else {
        body.innerHTML = renderMarkdown(raw);
      }
    }

    async function run() {
      const models = currentModels();
      if (models.length === 0) { showError('Pick at least one model to compare.'); return; }
      if (models.length > 3) { showError('You can compare up to 3 models at a time.'); return; }
      const prompt = textarea.value.trim();
      if (prompt.length < 3) { showError('Type a prompt first.'); return; }
      clearError();

      runButton.disabled = true;
      runButton.textContent = 'Running...';
      buildPanels(models);
      models.forEach(slug => updatePanel(slug, { state: 'pending', status: 'Queued' }));

      let res;
      try {
        res = await fetch('/api/sandbox/run', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ prompt, models }),
        });
      } catch (err) {
        showError('Could not reach the sandbox. Check your connection.');
        runButton.disabled = false;
        runButton.textContent = 'Run comparison';
        return;
      }

      if (!res.ok) {
        let msg = 'Something went wrong.';
        try {
          const data = await res.json();
          msg = data.message || msg;
        } catch (_) {}
        showError(msg);
        runButton.disabled = false;
        runButton.textContent = 'Run comparison';
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split('\n\n');
          buffer = parts.pop() || '';
          for (const part of parts) {
            const line = part.trim();
            if (!line.startsWith('data:')) continue;
            const json = line.slice(5).trim();
            if (!json) continue;
            let event;
            try { event = JSON.parse(json); } catch (_) { continue; }
            handleEvent(event);
          }
        }
      } catch (err) {
        showError('The stream dropped. Results shown are partial.');
      } finally {
        runButton.disabled = false;
        runButton.textContent = 'Run again';
      }
    }

    function handleEvent(event) {
      if (event.type === 'start') {
        updatePanel(event.model, { state: 'streaming', status: 'Thinking...', body: '' });
        const body = grid.querySelector(`[data-panel="${event.model}"] .ms-body`);
        if (body) body.setAttribute('data-streaming', '0');
      } else if (event.type === 'delta') {
        appendDelta(event.model, event.text || '');
      } else if (event.type === 'done') {
        finalizeBody(event.model);
        const tokens = (event.outputTokens || 0) + (event.inputTokens || 0);
        const timing = `${formatMs(event.elapsedMs)} - ${tokens} tokens`;
        updatePanel(event.model, { state: 'done', status: 'Done', timing });
      } else if (event.type === 'error') {
        if (event.model && event.model !== 'all') {
          updatePanel(event.model, { state: 'error', status: 'Error', body: event.message || 'Something went wrong.' });
        } else {
          showError(event.message || 'Something went wrong.');
        }
      }
    }

    runButton.addEventListener('click', run);
    textarea.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') run();
    });
  }

  async function init() {
    const widgets = document.querySelectorAll('.model-sandbox');
    if (!widgets.length) return;
    const catalog = await fetchCatalog();
    widgets.forEach(w => hydrate(w, catalog));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
