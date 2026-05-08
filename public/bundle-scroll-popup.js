// Scroll-triggered AI Starter Bundle popup. Slides in from bottom-right (or bottom on mobile)
// once the user scrolls past the free-tools / lead-magnet sections. Self-contained: drop the
// <script> tag onto any page that has the homepage's section IDs and it works.
//
// Behaviour:
//  - Fires when #ai-training-services enters viewport (i.e. user scrolled past the free bits).
//  - Hides when #ai-starter-bundle enters viewport (no point yelling about a card they can see).
//  - X close + sessionStorage flag: dismissed popup stays gone for the rest of the session.
//  - URL flag ?previewPopup=1 forces it to show immediately for local preview.
//  - GA4 events: bundle_popup_impression, bundle_popup_click, bundle_popup_dismiss.

(function () {
  const DISMISS_KEY = 'sya_bundle_scroll_popup_dismissed';
  const FIRED_KEY = 'sya_bundle_scroll_popup_fired';
  const TRIGGER_SELECTOR = '#ai-training-services';
  const HIDE_SELECTOR = '#ai-starter-bundle';
  const PREVIEW = new URLSearchParams(window.location.search).get('previewPopup') === '1';

  function track(event, params) {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', event, params || {});
      }
    } catch (e) { /* swallow */ }
  }

  function injectStyles() {
    if (document.getElementById('sya-bundle-popup-style')) return;
    const style = document.createElement('style');
    style.id = 'sya-bundle-popup-style';
    style.textContent = `
      #sya-bundle-popup {
        position: fixed;
        z-index: 60;
        right: 24px;
        bottom: 24px;
        width: 380px;
        max-width: calc(100vw - 32px);
        background: #ffffff;
        border-radius: 20px;
        box-shadow: 0 25px 60px -15px rgba(76, 29, 149, 0.35), 0 10px 25px -5px rgba(99, 102, 241, 0.25);
        border: 1px solid rgba(139, 92, 246, 0.18);
        overflow: hidden;
        transform: translateY(24px) scale(0.96);
        opacity: 0;
        pointer-events: none;
        transition: transform 380ms cubic-bezier(0.22, 1, 0.36, 1), opacity 280ms ease-out;
        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      }
      #sya-bundle-popup.sya-show {
        transform: translateY(0) scale(1);
        opacity: 1;
        pointer-events: auto;
      }
      #sya-bundle-popup .sya-accent {
        height: 4px;
        background: linear-gradient(90deg, #8b5cf6, #6366f1, #4f46e5);
      }
      #sya-bundle-popup .sya-body {
        padding: 18px 20px 20px 20px;
        position: relative;
      }
      #sya-bundle-popup .sya-eyebrow {
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #7c3aed;
        margin: 0 0 6px 0;
      }
      #sya-bundle-popup h3.sya-title {
        font-size: 18px;
        font-weight: 800;
        margin: 0 0 6px 0;
        color: #111827;
        line-height: 1.25;
        letter-spacing: -0.01em;
      }
      #sya-bundle-popup .sya-sub {
        font-size: 13px;
        color: #6b7280;
        margin: 0 0 14px 0;
        line-height: 1.45;
      }
      #sya-bundle-popup .sya-price-row {
        display: flex;
        align-items: baseline;
        gap: 8px;
        margin-bottom: 14px;
      }
      #sya-bundle-popup .sya-price-old {
        font-size: 13px;
        color: #9ca3af;
        text-decoration: line-through;
        font-weight: 600;
      }
      #sya-bundle-popup .sya-price-new {
        font-size: 26px;
        font-weight: 800;
        color: #111827;
        letter-spacing: -0.02em;
      }
      #sya-bundle-popup .sya-price-once {
        font-size: 11px;
        color: #9ca3af;
        font-weight: 500;
      }
      #sya-bundle-popup .sya-badge {
        display: inline-block;
        padding: 3px 8px;
        background: linear-gradient(135deg, #ecfdf5, #d1fae5);
        color: #047857;
        font-size: 10px;
        font-weight: 800;
        border-radius: 999px;
        letter-spacing: 0.04em;
      }
      #sya-bundle-popup ul.sya-bullets {
        list-style: none;
        padding: 0;
        margin: 0 0 16px 0;
        display: flex;
        flex-direction: column;
        gap: 7px;
      }
      #sya-bundle-popup ul.sya-bullets li {
        font-size: 12.5px;
        color: #4b5563;
        display: flex;
        align-items: flex-start;
        gap: 8px;
        line-height: 1.4;
      }
      #sya-bundle-popup ul.sya-bullets li svg {
        flex-shrink: 0;
        margin-top: 1px;
        color: #8b5cf6;
      }
      #sya-bundle-popup a.sya-cta {
        display: block;
        text-align: center;
        background: linear-gradient(135deg, #8b5cf6, #6366f1);
        color: #ffffff;
        font-size: 14px;
        font-weight: 700;
        padding: 11px 20px;
        border-radius: 12px;
        text-decoration: none;
        transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
      }
      #sya-bundle-popup a.sya-cta:hover {
        background: linear-gradient(135deg, #7c3aed, #4f46e5);
        transform: translateY(-1px);
        box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.45);
      }
      #sya-bundle-popup button.sya-close {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: #f3f4f6;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #6b7280;
        transition: background 0.15s ease, color 0.15s ease;
      }
      #sya-bundle-popup button.sya-close:hover {
        background: #e5e7eb;
        color: #111827;
      }
      #sya-bundle-popup .sya-glow {
        position: absolute;
        top: -40px;
        right: -40px;
        width: 140px;
        height: 140px;
        background: radial-gradient(circle, rgba(139, 92, 246, 0.18), transparent 70%);
        pointer-events: none;
        border-radius: 50%;
      }
      @media (max-width: 540px) {
        #sya-bundle-popup {
          right: 12px;
          left: 12px;
          bottom: 12px;
          width: auto;
          max-width: none;
          border-radius: 16px;
        }
        #sya-bundle-popup .sya-body { padding: 16px 16px 18px 16px; }
        #sya-bundle-popup h3.sya-title { font-size: 17px; }
      }
      @media (prefers-reduced-motion: reduce) {
        #sya-bundle-popup { transition: opacity 200ms ease-out; transform: none; }
      }
    `;
    document.head.appendChild(style);
  }

  function buildPopup() {
    const wrap = document.createElement('div');
    wrap.id = 'sya-bundle-popup';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-label', 'AI Starter Bundle offer');
    wrap.innerHTML = `
      <div class="sya-accent"></div>
      <div class="sya-body">
        <div class="sya-glow" aria-hidden="true"></div>
        <button class="sya-close" type="button" aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <p class="sya-eyebrow">AI Starter Bundle</p>
        <h3 class="sya-title">200+ AI prompts and tools, ready to use today</h3>
        <p class="sya-sub">Stop staring at a blank prompt box. Copy, paste, customise, get results. One small payment, lifetime access.</p>
        <div class="sya-price-row">
          <span class="sya-price-old">£29.99</span>
          <span class="sya-price-new">£14.99</span>
          <span class="sya-price-once">one-off</span>
          <span class="sya-badge" style="margin-left:auto;">50% OFF</span>
        </div>
        <ul class="sya-bullets">
          <li>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>200+ ready-made prompts, Claude Skills, custom GPTs and image prompts</span>
          </li>
          <li>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>2 hands-on workbooks plus 6 industry content calendars</span>
          </li>
          <li>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Lifetime access and free updates as we add more</span>
          </li>
        </ul>
        <a class="sya-cta" href="/prompts?unlock=1">Get the bundle for £14.99</a>
      </div>
    `;
    document.body.appendChild(wrap);

    wrap.querySelector('.sya-close').addEventListener('click', function (e) {
      e.preventDefault();
      hide(true);
      try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch (e) { /* ignore */ }
      track('bundle_popup_dismiss', { source: 'scroll-popup' });
    });

    wrap.querySelector('.sya-cta').addEventListener('click', function () {
      track('bundle_popup_click', { source: 'scroll-popup' });
    });

    return wrap;
  }

  let popupEl = null;
  let shown = false;

  function show() {
    if (shown) return;
    if (!popupEl) popupEl = buildPopup();
    requestAnimationFrame(function () {
      popupEl.classList.add('sya-show');
    });
    shown = true;
    try { sessionStorage.setItem(FIRED_KEY, '1'); } catch (e) { /* ignore */ }
    track('bundle_popup_impression', { source: 'scroll-popup' });
  }

  function hide(/* dismissed */) {
    if (!popupEl || !shown) return;
    popupEl.classList.remove('sya-show');
    shown = false;
  }

  function init() {
    // Skip if already dismissed in this session.
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === '1' && !PREVIEW) return;
    } catch (e) { /* ignore */ }

    injectStyles();

    if (PREVIEW) {
      // Preview mode: show instantly so we can review styling.
      show();
      return;
    }

    const triggerEl = document.querySelector(TRIGGER_SELECTOR);
    const hideEl = document.querySelector(HIDE_SELECTOR);
    if (!triggerEl) return; // not on a page with our anchors; nothing to do

    if (!('IntersectionObserver' in window)) return; // very old browser; just don't show

    // Only arm the trigger after the user has actually scrolled by a meaningful
    // amount. Stops the popup firing on landing for tall viewports / short
    // pages where the trigger element is already in view at scrollY=0.
    const SCROLL_THRESHOLD_PX = 80;
    let armed = false;
    let triggerObserver = null;
    let hideObserver = null;

    function arm() {
      if (armed) return;
      armed = true;

      triggerObserver = new IntersectionObserver(function (entries) {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            show();
            triggerObserver.disconnect();
            break;
          }
        }
      }, { rootMargin: '0px 0px -30% 0px' });
      triggerObserver.observe(triggerEl);

      if (hideEl) {
        hideObserver = new IntersectionObserver(function (entries) {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              hide(false);
              hideObserver.disconnect();
              break;
            }
          }
        }, { rootMargin: '0px 0px -10% 0px' });
        hideObserver.observe(hideEl);
      }
    }

    function onScroll() {
      if (window.scrollY >= SCROLL_THRESHOLD_PX) {
        window.removeEventListener('scroll', onScroll);
        arm();
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // In case the page restored scroll position above the threshold (back nav),
    // arm immediately on the next tick so we don't permanently miss the trigger.
    requestAnimationFrame(function () {
      if (window.scrollY >= SCROLL_THRESHOLD_PX) {
        window.removeEventListener('scroll', onScroll);
        arm();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
