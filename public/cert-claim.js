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

  function renderLoggedOut(widget, tierTitle) {
    widget.innerHTML = '';
    widget.appendChild(el('div', { class: 'cc-head' }, [
      el('span', { class: 'cc-badge', text: 'Certificate' }),
      el('h3', { class: 'cc-title', text: 'Tier completion certificate' }),
    ]));
    widget.appendChild(el('p', { class: 'cc-body', text: 'Log in to track your progress and claim a shareable certificate when you finish the tier.' }));
  }

  function renderLocked(widget, tierTitle) {
    widget.innerHTML = '';
    widget.appendChild(el('div', { class: 'cc-head' }, [
      el('span', { class: 'cc-badge', text: 'Certificate' }),
      el('h3', { class: 'cc-title', text: 'Tier completion certificate' }),
    ]));
    widget.appendChild(el('p', { class: 'cc-body', text: 'Unlock the course to earn a shareable completion certificate for each tier.' }));
  }

  function renderIncomplete(widget, tierTitle, status) {
    widget.innerHTML = '';
    widget.appendChild(el('div', { class: 'cc-head' }, [
      el('span', { class: 'cc-badge', text: 'Almost there' }),
      el('h3', { class: 'cc-title', text: 'Tier completion certificate' }),
    ]));
    const pct = status.total ? Math.round((status.completed / status.total) * 100) : 0;
    widget.appendChild(el('p', { class: 'cc-body', text: `You've ticked ${status.completed} of ${status.total} lessons in ${tierTitle}. Finish the last ${status.total - status.completed} and you can claim your certificate.` }));
    const barWrap = el('div', { class: 'cc-bar' });
    barWrap.appendChild(el('div', { class: 'cc-bar-fill', style: `width: ${pct}%` }));
    widget.appendChild(barWrap);
  }

  function renderEarned(widget, tierTitle, cert) {
    widget.innerHTML = '';
    widget.appendChild(el('div', { class: 'cc-head' }, [
      el('span', { class: 'cc-badge cc-badge-done', text: '✓ Certificate earned' }),
      el('h3', { class: 'cc-title', text: 'Your certificate is ready' }),
    ]));
    widget.appendChild(el('p', { class: 'cc-body', text: `Issued to "${cert.display_name}" for completing ${tierTitle}.` }));
    const actions = el('div', { class: 'cc-actions' });
    const viewBtn = el('a', { class: 'cc-btn cc-btn-primary', href: `/course/certificate/${cert.code}`, target: '_blank', rel: 'noopener', text: 'View and share →' });
    actions.appendChild(viewBtn);
    widget.appendChild(actions);
  }

  function renderClaimForm(widget, tierTitle, tier) {
    widget.innerHTML = '';
    widget.appendChild(el('div', { class: 'cc-head' }, [
      el('span', { class: 'cc-badge cc-badge-ready', text: '🎓 Tier complete' }),
      el('h3', { class: 'cc-title', text: `Claim your ${tierTitle} certificate` }),
    ]));
    widget.appendChild(el('p', { class: 'cc-body', text: "You've ticked off every lesson in this tier. Enter the name you'd like on your certificate (first + last, or however you'd like to be shown)." }));

    const form = el('form', { class: 'cc-form' });
    const input = el('input', { class: 'cc-input', type: 'text', placeholder: 'Your name', maxlength: '60', required: true });
    form.appendChild(input);
    const btn = el('button', { class: 'cc-btn cc-btn-primary', type: 'submit', text: 'Issue my certificate' });
    form.appendChild(btn);
    widget.appendChild(form);

    const err = el('div', { class: 'cc-error', style: 'display:none' });
    widget.appendChild(err);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = input.value.trim();
      if (name.length < 2) { err.textContent = 'Please enter a name of at least 2 characters.'; err.style.display = 'block'; return; }
      err.style.display = 'none';
      btn.disabled = true;
      btn.textContent = 'Issuing...';
      try {
        const res = await fetch('/api/course/certificate/claim', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ tier, displayName: name }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.ok) {
          window.location.href = `/course/certificate/${data.code}`;
        } else {
          err.textContent = data.message || 'Could not issue certificate. Try again.';
          err.style.display = 'block';
          btn.disabled = false; btn.textContent = 'Issue my certificate';
        }
      } catch (_) {
        err.textContent = 'Network error. Try again.';
        err.style.display = 'block';
        btn.disabled = false; btn.textContent = 'Issue my certificate';
      }
    });
  }

  async function hydrate(widget) {
    if (widget.__ccHydrated) return;
    widget.__ccHydrated = true;
    const tier = widget.getAttribute('data-tier');
    if (!tier) return;

    let res, data;
    try {
      res = await fetch(`/api/course/tier-status/${tier}`, { credentials: 'same-origin' });
    } catch (_) { return; }

    if (res.status === 401) { renderLoggedOut(widget); return; }
    try { data = await res.json(); } catch (_) { return; }
    if (!data || !data.ok) { return; }

    if (data.certificate) { renderEarned(widget, data.tierTitle, data.certificate); return; }
    if (data.complete) { renderClaimForm(widget, data.tierTitle, tier); return; }
    renderIncomplete(widget, data.tierTitle, data);
  }

  function init() {
    document.querySelectorAll('.cert-claim').forEach(hydrate);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-hydrate after a lesson is ticked, because ticking the last one changes state.
  document.addEventListener('course-progress-changed', () => {
    document.querySelectorAll('.cert-claim').forEach(w => { w.__ccHydrated = false; hydrate(w); });
  });
})();
