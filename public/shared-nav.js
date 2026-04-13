// Shared navigation and auth state across all pages
(function() {
  let currentUser = null;

  // Check auth state
  async function checkAuth() {
    try {
      const res = await fetch('/prompts/auth/me');
      const data = await res.json();
      currentUser = data.user;
      updateNavAuth();
    } catch (e) {
      currentUser = null;
    }
  }

  function updateNavAuth() {
    const authArea = document.getElementById('shared-auth-area');
    const mobileAuthArea = document.getElementById('shared-auth-area-mobile');
    if (!authArea) return;

    if (currentUser) {
      const initial = currentUser.email.charAt(0).toUpperCase();
      authArea.innerHTML = `
        <div class="relative group">
          <button class="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors">
            <span class="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">${initial}</span>
            <svg class="w-3.5 h-3.5 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
          </button>
          <div class="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
            <div class="px-4 py-2 border-b border-gray-100">
              <p class="text-xs text-gray-400">Signed in as</p>
              <p class="text-sm font-medium text-gray-900 truncate">${currentUser.email}</p>
            </div>
            <a href="/dashboard" class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-violet-600 hover:bg-violet-50 transition-colors">
              <svg class="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
              My dashboard
            </a>
            <a href="/prompts" class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-violet-600 hover:bg-violet-50 transition-colors">
              <svg class="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
              Prompt library
            </a>
            <div class="border-t border-gray-100 my-1"></div>
            <button onclick="showChangePasswordModal()" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-violet-600 hover:bg-violet-50 transition-colors">
              <svg class="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
              Change password
            </button>
            <button onclick="sharedLogout()" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
              Log out
            </button>
          </div>
        </div>
      `;
      if (mobileAuthArea) {
        mobileAuthArea.innerHTML = `
          <div class="border-t border-gray-100 pt-2 mt-1">
            <span class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Account</span>
            <a href="/dashboard" class="block text-sm font-medium text-gray-600 hover:text-violet-600 py-2 pl-2">My dashboard</a>
            <button onclick="showChangePasswordModal()" class="block w-full text-left text-sm font-medium text-gray-600 hover:text-violet-600 py-2 pl-2">Change password</button>
            <button onclick="sharedLogout()" class="block w-full text-left text-sm font-medium text-gray-600 hover:text-red-600 py-2 pl-2">Log out</button>
          </div>
        `;
      }
    } else {
      authArea.innerHTML = `
        <a href="/prompts?login=1" class="text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors">Log in</a>
      `;
      if (mobileAuthArea) {
        mobileAuthArea.innerHTML = `
          <a href="/prompts?login=1" class="block text-sm font-medium text-violet-600 py-2">Log in / Create account</a>
        `;
      }
    }
  }

  window.sharedLogout = async function() {
    await fetch('/prompts/auth/logout', { method: 'POST' });
    window.location.reload();
  };

  window.showChangePasswordModal = function() {
    // Remove existing modal if any
    const existing = document.getElementById('change-password-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'change-password-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.5);';
    modal.innerHTML = `
      <div style="background:white;border-radius:16px;padding:32px;max-width:400px;width:90%;box-shadow:0 25px 50px rgba(0,0,0,0.15);">
        <h3 style="font-size:18px;font-weight:700;margin:0 0 4px;">Change password</h3>
        <p style="font-size:13px;color:#6b7280;margin:0 0 20px;">Enter your current password and choose a new one.</p>
        <form id="change-password-form" style="display:flex;flex-direction:column;gap:12px;">
          <input type="password" id="cp-current" placeholder="Current password" required style="width:100%;padding:10px 14px;border:1px solid #e5e7eb;border-radius:10px;font-size:14px;outline:none;">
          <input type="password" id="cp-new" placeholder="New password (min 6 characters)" required minlength="6" style="width:100%;padding:10px 14px;border:1px solid #e5e7eb;border-radius:10px;font-size:14px;outline:none;">
          <div id="cp-error" style="font-size:13px;color:#dc2626;display:none;"></div>
          <div id="cp-success" style="font-size:13px;color:#059669;display:none;"></div>
          <div style="display:flex;gap:8px;margin-top:4px;">
            <button type="button" onclick="document.getElementById('change-password-modal').remove()" style="flex:1;padding:10px;border:1px solid #e5e7eb;border-radius:10px;font-size:14px;font-weight:600;background:white;cursor:pointer;">Cancel</button>
            <button type="submit" id="cp-submit" style="flex:1;padding:10px;border:none;border-radius:10px;font-size:14px;font-weight:600;color:white;background:linear-gradient(135deg,#8b5cf6,#6366f1);cursor:pointer;">Update</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    // Close on backdrop click
    modal.addEventListener('click', function(e) {
      if (e.target === modal) modal.remove();
    });

    document.getElementById('change-password-form').addEventListener('submit', async function(e) {
      e.preventDefault();
      const errorEl = document.getElementById('cp-error');
      const successEl = document.getElementById('cp-success');
      const submitBtn = document.getElementById('cp-submit');
      errorEl.style.display = 'none';
      successEl.style.display = 'none';
      submitBtn.textContent = 'Updating...';
      submitBtn.disabled = true;

      try {
        const res = await fetch('/prompts/auth/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentPassword: document.getElementById('cp-current').value,
            newPassword: document.getElementById('cp-new').value
          })
        });
        const data = await res.json();
        if (!res.ok) {
          errorEl.textContent = data.error;
          errorEl.style.display = 'block';
          submitBtn.textContent = 'Update';
          submitBtn.disabled = false;
        } else {
          successEl.textContent = 'Password changed successfully.';
          successEl.style.display = 'block';
          submitBtn.textContent = 'Done';
          setTimeout(function() { modal.remove(); }, 1500);
        }
      } catch (err) {
        errorEl.textContent = 'Something went wrong. Please try again.';
        errorEl.style.display = 'block';
        submitBtn.textContent = 'Update';
        submitBtn.disabled = false;
      }
    });
  };

  // Run on page load
  document.addEventListener('DOMContentLoaded', checkAuth);
})();
