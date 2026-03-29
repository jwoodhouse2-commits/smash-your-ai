// State
let activeType = 'llm-prompt';
let categories = {};
let searchTimeout = null;

// On load
document.addEventListener('DOMContentLoaded', async () => {
  await checkAuth();
  await loadCategories();
  await loadContent();
  setupSidebar();
  setupFilters();
});

// Load filter options
async function loadCategories() {
  try {
    const res = await fetch('/prompts/api/categories');
    categories = await res.json();

    // Populate filter dropdowns
    const catSelect = document.getElementById('filter-category');
    categories.categories.forEach(c => {
      catSelect.appendChild(new Option(c, c));
    });

    const indSelect = document.getElementById('filter-industry');
    categories.industries.forEach(i => {
      indSelect.appendChild(new Option(i, i));
    });

    const diffSelect = document.getElementById('filter-difficulty');
    categories.difficulties.forEach(d => {
      const label = d.charAt(0).toUpperCase() + d.slice(1);
      diffSelect.appendChild(new Option(label, d));
    });

    // Update sidebar counts
    updateCounts(categories.typeCounts);
  } catch (e) {
    console.error('Failed to load categories:', e);
  }
}

function updateCounts(typeCounts) {
  // Desktop sidebar
  document.querySelectorAll('#sidebar-nav .sidebar-count').forEach(el => {
    const type = el.closest('[data-type]').dataset.type;
    el.textContent = typeCounts[type] || 0;
  });
  // Mobile tabs
  document.querySelectorAll('#mobile-tabs .tab-count').forEach(el => {
    const type = el.closest('[data-type]').dataset.type;
    const count = typeCounts[type] || 0;
    el.textContent = count ? `(${count})` : '';
  });
}

// Load content
async function loadContent() {
  const params = new URLSearchParams();
  params.set('type', activeType);

  const category = document.getElementById('filter-category').value;
  const industry = document.getElementById('filter-industry').value;
  const difficulty = document.getElementById('filter-difficulty').value;
  const search = document.getElementById('search-input').value.trim();

  if (category) params.set('category', category);
  if (industry) params.set('industry', industry);
  if (difficulty) params.set('difficulty', difficulty);
  if (search) params.set('search', search);

  try {
    const res = await fetch(`/prompts/api?${params}`);
    const data = await res.json();
    renderCards(data.items);
    document.getElementById('results-count').textContent =
      `${data.total} ${data.total === 1 ? 'prompt' : 'prompts'} found`;
  } catch (e) {
    console.error('Failed to load content:', e);
  }
}

// Render cards
function renderCards(items) {
  const grid = document.getElementById('card-grid');
  const empty = document.getElementById('empty-state');

  if (items.length === 0) {
    grid.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }

  empty.classList.add('hidden');

  grid.innerHTML = items.map(item => {
    const difficultyColors = {
      beginner: 'bg-green-50 text-green-700',
      intermediate: 'bg-amber-50 text-amber-700',
      advanced: 'bg-red-50 text-red-700'
    };
    const diffClass = difficultyColors[item.difficulty] || 'bg-gray-50 text-gray-700';
    const diffLabel = item.difficulty ? item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1) : '';

    return `
      <div class="card-hover bg-white border border-gray-200 rounded-2xl p-5 cursor-pointer relative group"
           onclick="${item.locked ? 'showUnlockModal()' : `openDetail('${item.id}')`}">
        ${item.locked ? `
          <div class="absolute top-3 right-3 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
        ` : `
          <div class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg class="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        `}
        <div class="mb-3">
          <span class="inline-block px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 text-xs font-medium">${item.category}</span>
          ${item.isFree ? '<span class="inline-block px-2.5 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-medium ml-1.5">Free</span>' : ''}
        </div>
        <h3 class="font-bold text-gray-900 mb-1.5 pr-8 ${item.locked ? '' : ''}">${item.title}</h3>
        <p class="text-sm text-gray-500 line-clamp-2 mb-4">${item.description}</p>
        <div class="flex items-center justify-between">
          <span class="text-xs text-gray-400 flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            ${item.toolRecommendation || ''}
          </span>
          <span class="text-xs px-2 py-0.5 rounded-full ${diffClass}">${diffLabel}</span>
        </div>
      </div>
    `;
  }).join('');
}

// Open detail panel
async function openDetail(id) {
  try {
    const res = await fetch(`/prompts/api/${id}`);
    const data = await res.json();
    const item = data.item;

    if (item.locked) {
      showUnlockModal();
      return;
    }

    const isGpt = item.type === 'custom-gpt';

    let html = `
      <button class="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors" onclick="closeDetail()">
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>

      <div class="mb-4 flex flex-wrap gap-2">
        <span class="px-3 py-1 rounded-lg bg-violet-50 text-violet-700 text-xs font-medium">${item.category}</span>
        ${item.isFree ? '<span class="px-3 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-medium">Free</span>' : ''}
        <span class="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium">${item.difficulty ? item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1) : ''}</span>
      </div>

      <h2 class="text-2xl font-extrabold text-gray-900 mb-2">${item.title}</h2>
      <p class="text-gray-600 mb-6">${item.description}</p>

      <!-- Tool recommendation -->
      <div class="flex items-center gap-2 mb-6 text-sm">
        <span class="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 font-medium flex items-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          ${item.toolRecommendation}
        </span>
      </div>

      ${item.toolTips ? `<p class="text-sm text-gray-500 mb-6 italic">${item.toolTips}</p>` : ''}
    `;

    // How to use
    if (item.howToUse && item.howToUse.length > 0) {
      html += `
        <div class="bg-gray-50 rounded-xl p-5 mb-6">
          <h3 class="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
            <svg class="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            How to use this prompt
          </h3>
          <ol class="space-y-2">
            ${item.howToUse.map((step, i) => `
              <li class="flex gap-3 text-sm text-gray-700">
                <span class="flex-shrink-0 w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold">${i + 1}</span>
                <span>${step}</span>
              </li>
            `).join('')}
          </ol>
        </div>
      `;
    }

    // The prompt content
    if (item.content) {
      if (isGpt) {
        // Custom GPT - show as system prompt with sections
        html += `
          <div class="mb-6">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-bold text-gray-900 text-sm">System prompt</h3>
              <button class="copy-btn px-3 py-1.5 rounded-lg text-xs font-medium text-violet-600 border border-violet-200 hover:bg-violet-50 flex items-center gap-1.5" onclick="copyText(this)">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                Copy
              </button>
            </div>
            <div class="bg-gray-900 text-gray-100 rounded-xl p-5 text-sm font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap" id="prompt-text">${escapeHtml(item.content)}</div>
          </div>
        `;
      } else {
        // Regular prompt - violet left border
        html += `
          <div class="mb-6">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-bold text-gray-900 text-sm">The prompt</h3>
              <button class="copy-btn px-3 py-1.5 rounded-lg text-xs font-medium text-violet-600 border border-violet-200 hover:bg-violet-50 flex items-center gap-1.5" onclick="copyText(this)">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                Copy
              </button>
            </div>
            <div class="bg-white border border-gray-200 border-l-4 border-l-violet-500 rounded-xl p-5 text-sm leading-relaxed whitespace-pre-wrap" id="prompt-text">${escapeHtml(item.content)}</div>
          </div>
        `;
      }
    }

    // Why it works
    if (item.whyItWorks) {
      html += `
        <div class="bg-violet-50 border border-violet-100 rounded-xl p-5 mb-6">
          <h3 class="font-bold text-violet-900 text-sm mb-2 flex items-center gap-2">
            <svg class="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
            Why it works
          </h3>
          <p class="text-sm text-violet-800 leading-relaxed">${item.whyItWorks}</p>
        </div>
      `;
    }

    // Make it your own
    if (item.makeItYourOwn) {
      html += `
        <div class="bg-amber-50 border border-amber-100 rounded-xl p-5 mb-6">
          <h3 class="font-bold text-amber-900 text-sm mb-2 flex items-center gap-2">
            <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            Make it your own
          </h3>
          <p class="text-sm text-amber-800 leading-relaxed">${item.makeItYourOwn}</p>
        </div>
      `;
    }

    // Industry tags
    if (item.industryTags && item.industryTags.length > 0) {
      html += `
        <div class="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
          ${item.industryTags.map(tag => `<span class="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs">${tag}</span>`).join('')}
        </div>
      `;
    }

    document.getElementById('detail-content').innerHTML = html;
    document.getElementById('detail-overlay').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  } catch (e) {
    console.error('Failed to load detail:', e);
  }
}

function closeDetail() {
  document.getElementById('detail-overlay').classList.add('hidden');
  document.body.style.overflow = '';
}

// Copy prompt text
function copyText(btn) {
  const text = document.getElementById('prompt-text').textContent;
  navigator.clipboard.writeText(text).then(() => {
    const originalHTML = btn.innerHTML;
    btn.innerHTML = `
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
      Copied!
    `;
    btn.classList.add('text-green-600', 'border-green-200');
    btn.classList.remove('text-violet-600', 'border-violet-200');
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.classList.remove('text-green-600', 'border-green-200');
      btn.classList.add('text-violet-600', 'border-violet-200');
    }, 2000);
  });
}

// Escape HTML
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Sidebar setup
function setupSidebar() {
  // Desktop sidebar
  document.querySelectorAll('#sidebar-nav .sidebar-item').forEach(btn => {
    btn.addEventListener('click', () => {
      activeType = btn.dataset.type;
      // Update active state
      document.querySelectorAll('#sidebar-nav .sidebar-item').forEach(b => {
        b.classList.remove('sidebar-active');
        b.classList.add('text-gray-600');
      });
      btn.classList.add('sidebar-active');
      btn.classList.remove('text-gray-600');

      // Also update mobile tabs
      document.querySelectorAll('#mobile-tabs .sidebar-tab').forEach(t => {
        t.classList.remove('sidebar-active');
      });
      const mobileTab = document.querySelector(`#mobile-tabs [data-type="${activeType}"]`);
      if (mobileTab) mobileTab.classList.add('sidebar-active');

      loadContent();
    });
  });

  // Mobile tabs
  document.querySelectorAll('#mobile-tabs .sidebar-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      activeType = btn.dataset.type;
      document.querySelectorAll('#mobile-tabs .sidebar-tab').forEach(t => {
        t.classList.remove('sidebar-active');
      });
      btn.classList.add('sidebar-active');

      // Also update desktop sidebar
      document.querySelectorAll('#sidebar-nav .sidebar-item').forEach(b => {
        b.classList.remove('sidebar-active');
        b.classList.add('text-gray-600');
      });
      const desktopBtn = document.querySelector(`#sidebar-nav [data-type="${activeType}"]`);
      if (desktopBtn) {
        desktopBtn.classList.add('sidebar-active');
        desktopBtn.classList.remove('text-gray-600');
      }

      loadContent();
    });
  });
}

// Filter setup
function setupFilters() {
  const searchInput = document.getElementById('search-input');
  const catFilter = document.getElementById('filter-category');
  const indFilter = document.getElementById('filter-industry');
  const diffFilter = document.getElementById('filter-difficulty');

  // Debounced search
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(loadContent, 300);
  });

  // Instant filter on dropdown change
  catFilter.addEventListener('change', loadContent);
  indFilter.addEventListener('change', loadContent);
  diffFilter.addEventListener('change', loadContent);
}

// Close detail on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDetail();
    closeAuthModal();
    closeUnlockModal();
  }
});
