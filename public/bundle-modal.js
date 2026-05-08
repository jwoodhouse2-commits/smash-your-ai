// Shared Starter Bundle sales modal. Triggered from anywhere via openBundleModal().
// Deliberately self-contained so it works on /course, in lesson pages, and elsewhere.
(function () {
  function injectModal() {
    if (document.getElementById('bundle-sales-modal')) return;
    const el = document.createElement('div');
    el.id = 'bundle-sales-modal';
    el.style.cssText = 'position:fixed; inset:0; z-index:9999; background:rgba(17,24,39,0.55); backdrop-filter:blur(4px); display:none; align-items:center; justify-content:center; padding:1rem; overflow-y:auto;';
    el.innerHTML = `
      <div style="background:#fff; border-radius:20px; max-width:560px; width:100%; max-height:calc(100vh - 2rem); overflow-y:auto; box-shadow:0 30px 60px rgba(0,0,0,.25);">
        <div style="padding:1.75rem 1.75rem 0;">
          <div style="display:flex; justify-content:space-between; align-items:start; gap:1rem;">
            <div>
              <p style="font-size:.72rem; font-weight:800; text-transform:uppercase; letter-spacing:.08em; color:#7c3aed; margin:0 0 .4rem;">AI Starter Bundle · £14.99</p>
              <h2 style="font-size:1.5rem; font-weight:800; margin:0 0 .4rem; color:#111827;">Everything you need to actually use AI.</h2>
              <p style="font-size:.95rem; color:#6b7280; margin:0 0 1rem; line-height:1.5;">200+ ready-to-copy prompts and tools, two workbooks, six content calendars, and a week 1 action plan. Bought once, yours forever.</p>
            </div>
            <button onclick="closeBundleModal()" aria-label="Close" style="border:none; background:#f3f4f6; width:32px; height:32px; border-radius:50%; cursor:pointer; font-size:1.2rem; line-height:1; color:#6b7280; flex-shrink:0;">×</button>
          </div>
        </div>
        <div style="padding:.5rem 1.75rem 0;">
          <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:.65rem;">
            ${bundleFeature('📝', '200+ expert-written prompts and tools', 'ChatGPT, Claude, Midjourney, custom GPTs')}
            ${bundleFeature('📘', 'AI in a Day workbook', 'Beginner-friendly, hands-on')}
            ${bundleFeature('🚀', 'AI in a Day: Advanced', 'Techniques, automations, workflows')}
            ${bundleFeature('📅', '6 content calendars', 'Salons, accountants, PTs, restaurants, estate agents, universal')}
            ${bundleFeature('✅', 'Week 1 action plan', 'One action a day, seven real wins')}
            ${bundleFeature('♾️', 'Lifetime free updates', 'New resources added for free')}
          </div>
        </div>
        <div style="padding:1.25rem 1.75rem 0;">
          <div style="background:linear-gradient(135deg,#f5f3ff,#eef2ff); border:1px solid #c4b5fd; border-radius:14px; padding:.9rem 1rem; display:flex; gap:.8rem; align-items:start;">
            <div style="font-size:1.5rem; line-height:1;">💡</div>
            <div>
              <p style="font-size:.85rem; font-weight:700; color:#4c1d95; margin:0 0 .2rem;">Also getting the course?</p>
              <p style="font-size:.8rem; color:#5b21b6; margin:0; line-height:1.4;">The <strong>Course + Bundle combo</strong> is £59.99 and saves you about £5. <a href="/course#pricing" style="color:#6d28d9; text-decoration:underline; font-weight:600;">See it on the pricing page</a>.</p>
            </div>
          </div>
        </div>
        <div style="padding:1.25rem 1.75rem 1.75rem;">
          <button id="bundle-buy-btn" style="width:100%; background:linear-gradient(135deg,#8b5cf6,#6366f1); color:#fff; font-weight:700; padding:.85rem; border:none; border-radius:12px; font-size:1rem; cursor:pointer; transition:all .15s;">Get the Starter Bundle for £14.99</button>
          <p style="text-align:center; font-size:.72rem; color:#9ca3af; margin:.7rem 0 0;">Non-refundable (UK Consumer Contracts Regulations 2013). Secure checkout via Stripe.</p>
        </div>
      </div>`;
    document.body.appendChild(el);
    el.addEventListener('click', function (e) { if (e.target === el) closeBundleModal(); });
    document.getElementById('bundle-buy-btn').addEventListener('click', function () {
      buyBundle();
    });
  }

  function bundleFeature(icon, title, sub) {
    return `<div style="display:flex; gap:.55rem; align-items:start; padding:.55rem .65rem; background:#fafafa; border:1px solid #f3f4f6; border-radius:10px;">
      <div style="font-size:1.05rem; line-height:1;">${icon}</div>
      <div>
        <p style="font-size:.8rem; font-weight:700; color:#111827; margin:0 0 .1rem; line-height:1.3;">${title}</p>
        <p style="font-size:.7rem; color:#6b7280; margin:0; line-height:1.35;">${sub}</p>
      </div>
    </div>`;
  }

  async function buyBundle() {
    try {
      const me = await fetch('/prompts/auth/me').then(r => r.json());
      if (!me.user) {
        const next = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = '/prompts?login=1&next=' + next;
        return;
      }
      const btn = document.getElementById('bundle-buy-btn');
      btn.disabled = true;
      btn.textContent = 'Opening checkout…';
      const res = await fetch('/prompts/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: 'bundle' })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else if (data.redirect) window.location.href = data.redirect;
      else {
        btn.disabled = false;
        btn.textContent = 'Get the Starter Bundle for £14.99';
        if (data.error) alert(data.error);
      }
    } catch (e) {
      alert('Something went wrong. Please try again.');
    }
  }

  window.openBundleModal = function () {
    injectModal();
    const el = document.getElementById('bundle-sales-modal');
    el.style.display = 'flex';
  };

  window.closeBundleModal = function () {
    const el = document.getElementById('bundle-sales-modal');
    if (el) el.style.display = 'none';
  };
})();
