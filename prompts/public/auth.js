// Auth state
let currentUser = null;

async function checkAuth() {
  try {
    const res = await fetch('/prompts/auth/me');
    const data = await res.json();
    currentUser = data.user;
    updateAuthUI();
  } catch (e) {
    currentUser = null;
  }
}

function updateAuthUI() {
  const sidebarCta = document.getElementById('sidebar-cta');

  if (currentUser) {
    // Hide CTA if user has paid
    if (sidebarCta && currentUser.has_paid) sidebarCta.classList.add('hidden');
    else if (sidebarCta) sidebarCta.classList.remove('hidden');
  } else {
    // Always show CTA for non-logged-in users
    if (sidebarCta) sidebarCta.classList.remove('hidden');
  }
}

function showAuthModal() {
  const modal = document.getElementById('auth-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  // Clear errors
  document.getElementById('login-error').classList.add('hidden');
  document.getElementById('register-error').classList.add('hidden');
  // Hide forgot password success if showing
  const forgotSuccess = document.getElementById('forgot-success');
  if (forgotSuccess) forgotSuccess.classList.add('hidden');
}

function showLogin() {
  document.getElementById('login-form').classList.remove('hidden');
  document.getElementById('register-form').classList.add('hidden');
  const forgotForm = document.getElementById('forgot-form');
  if (forgotForm) forgotForm.classList.add('hidden');
  document.getElementById('tab-login').classList.add('text-gray-900', 'border-violet-500');
  document.getElementById('tab-login').classList.remove('text-gray-400', 'border-transparent');
  document.getElementById('tab-register').classList.remove('text-gray-900', 'border-violet-500');
  document.getElementById('tab-register').classList.add('text-gray-400', 'border-transparent');
}

function showRegister() {
  document.getElementById('login-form').classList.add('hidden');
  document.getElementById('register-form').classList.remove('hidden');
  const forgotForm = document.getElementById('forgot-form');
  if (forgotForm) forgotForm.classList.add('hidden');
  document.getElementById('tab-register').classList.add('text-gray-900', 'border-violet-500');
  document.getElementById('tab-register').classList.remove('text-gray-400', 'border-transparent');
  document.getElementById('tab-login').classList.remove('text-gray-900', 'border-violet-500');
  document.getElementById('tab-login').classList.add('text-gray-400', 'border-transparent');
}

function showForgotPassword() {
  document.getElementById('login-form').classList.add('hidden');
  document.getElementById('register-form').classList.add('hidden');
  const forgotForm = document.getElementById('forgot-form');
  if (forgotForm) forgotForm.classList.remove('hidden');
  // Dim both tabs
  document.getElementById('tab-login').classList.remove('text-gray-900', 'border-violet-500');
  document.getElementById('tab-login').classList.add('text-gray-400', 'border-transparent');
  document.getElementById('tab-register').classList.remove('text-gray-900', 'border-violet-500');
  document.getElementById('tab-register').classList.add('text-gray-400', 'border-transparent');
}

// Login form
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const email = form.email.value;
  const password = form.password.value;
  const errorEl = document.getElementById('login-error');

  try {
    const res = await fetch('/prompts/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.error;
      errorEl.classList.remove('hidden');
      return;
    }

    currentUser = data.user;
    updateAuthUI();
    closeAuthModal();
    form.reset();
    // Refresh content to unlock items
    if (typeof loadContent === 'function') loadContent();

    // If there was a pending checkout, start it
    if (window._pendingCheckout) {
      window._pendingCheckout = false;
      startCheckout();
    }
  } catch (err) {
    errorEl.textContent = 'Something went wrong. Please try again.';
    errorEl.classList.remove('hidden');
  }
});

// Register form
document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const email = form.email.value;
  const password = form.password.value;
  const errorEl = document.getElementById('register-error');

  try {
    const res = await fetch('/prompts/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (!res.ok) {
      errorEl.textContent = data.error;
      errorEl.classList.remove('hidden');
      return;
    }

    currentUser = data.user;
    updateAuthUI();
    closeAuthModal();
    form.reset();
    if (typeof loadContent === 'function') loadContent();

    // If there was a pending checkout, start it
    if (window._pendingCheckout) {
      window._pendingCheckout = false;
      startCheckout();
    }
  } catch (err) {
    errorEl.textContent = 'Something went wrong. Please try again.';
    errorEl.classList.remove('hidden');
  }
});

// Forgot password form
document.addEventListener('DOMContentLoaded', () => {
  const forgotForm = document.getElementById('forgot-form');
  if (forgotForm) {
    forgotForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = forgotForm.querySelector('input[name="email"]').value;
      const errorEl = document.getElementById('forgot-error');
      const successEl = document.getElementById('forgot-success');
      const submitBtn = forgotForm.querySelector('button[type="submit"]');

      if (errorEl) errorEl.classList.add('hidden');
      if (successEl) successEl.classList.add('hidden');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      try {
        const res = await fetch('/prompts/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();

        if (successEl) {
          successEl.textContent = data.message;
          successEl.classList.remove('hidden');
        }
        forgotForm.querySelector('input[name="email"]').value = '';
      } catch (err) {
        if (errorEl) {
          errorEl.textContent = 'Something went wrong. Please try again.';
          errorEl.classList.remove('hidden');
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send reset link';
      }
    });
  }
});

function showUnlockModal() {
  // If user is already paid, go to dashboard
  if (currentUser && currentUser.has_paid) {
    window.location.href = '/dashboard';
    return;
  }
  const modal = document.getElementById('unlock-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeUnlockModal() {
  const modal = document.getElementById('unlock-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

// Stripe checkout
async function startCheckout() {
  if (!currentUser) {
    // Need to log in first, then redirect to checkout
    window._pendingCheckout = true;
    showAuthModal();
    return;
  }

  if (currentUser.has_paid) {
    window.location.href = '/dashboard';
    return;
  }

  try {
    const res = await fetch('/prompts/checkout/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else if (data.redirect) {
      window.location.href = data.redirect;
    } else if (data.error) {
      alert(data.error);
    }
  } catch (err) {
    alert('Something went wrong. Please try again.');
  }
}

// Handle query params on page load (?login=1, ?unlock=1)
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);

  if (params.get('login') === '1') {
    showAuthModal();
    // Clean URL
    window.history.replaceState({}, '', window.location.pathname);
  }

  if (params.get('unlock') === '1') {
    if (currentUser && currentUser.has_paid) {
      window.location.href = '/dashboard';
    } else {
      showUnlockModal();
    }
    window.history.replaceState({}, '', window.location.pathname);
  }
});
