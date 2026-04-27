// Interactive extras for course lesson pages.
// 1. Quiz (one-at-a-time slider, immediate feedback, persistent last score)
// 2. Copy-to-clipboard on <pre> code blocks
// 3. Small celebration when marking a lesson complete
(function () {
  // --- Quiz ---
  function quizStorageKey(quiz, quizIdx) {
    return `quizScore:${location.pathname}#${quizIdx}`;
  }

  function readLastScore(quiz, quizIdx) {
    try {
      const raw = localStorage.getItem(quizStorageKey(quiz, quizIdx));
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function writeLastScore(quiz, quizIdx, score, total) {
    try {
      localStorage.setItem(quizStorageKey(quiz, quizIdx), JSON.stringify({ score, total, at: Date.now() }));
    } catch (e) {}
  }

  function hydrateQuizzes() {
    const quizzes = document.querySelectorAll('.quiz:not([data-hydrated])');
    quizzes.forEach(function (quiz, quizIdx) {
      quiz.dataset.hydrated = '1';
      const title = quiz.getAttribute('data-quiz-title') || 'Quick check';
      const questions = Array.from(quiz.querySelectorAll('.quiz-q'));
      const total = questions.length;
      if (total === 0) return;

      // Extract the question data before we nuke the DOM
      const questionData = questions.map(function (q) {
        return {
          answerIdx: parseInt(q.getAttribute('data-answer'), 10),
          promptHtml: (q.querySelector('.quiz-prompt') || {}).innerHTML || '',
          options: Array.from(q.querySelectorAll('.quiz-option')).map(o => o.innerHTML),
          explainHtml: (q.querySelector('.quiz-explain') || {}).innerHTML || ''
        };
      });

      // Build fresh markup
      quiz.innerHTML = `
        <div class="quiz-header">
          <p class="quiz-title">Quick check</p>
          <h3 class="quiz-heading">${escapeHtml(title)}</h3>
          <div class="quiz-progress-bar"><div class="quiz-progress-fill"></div></div>
          <div class="quiz-meta">
            <span class="quiz-counter">Question 1 of ${total}</span>
            <span class="quiz-last-score hidden"></span>
          </div>
        </div>
        <div class="quiz-viewport">
          <div class="quiz-track">
            ${questionData.map(function (qd, i) {
              return `<div class="quiz-slide" data-slide="${i}" data-answer="${qd.answerIdx}">
                <p class="quiz-prompt">${qd.promptHtml}</p>
                ${qd.options.map((opt, idx) => `<button type="button" class="quiz-option" data-idx="${idx}">${opt}</button>`).join('')}
                <div class="quiz-explain">${qd.explainHtml}</div>
                <button type="button" class="quiz-next">Next →</button>
              </div>`;
            }).join('')}
          </div>
        </div>
        <div class="quiz-finish">
          <div class="quiz-finish-emoji">🎉</div>
          <h4 class="quiz-finish-title">All done</h4>
          <div class="quiz-finish-score"></div>
          <p class="quiz-finish-msg"></p>
          <button type="button" class="quiz-retry">Try again</button>
        </div>
      `;

      const track = quiz.querySelector('.quiz-track');
      const progressFill = quiz.querySelector('.quiz-progress-fill');
      const counter = quiz.querySelector('.quiz-counter');
      const lastScoreEl = quiz.querySelector('.quiz-last-score');
      const viewport = quiz.querySelector('.quiz-viewport');
      const finish = quiz.querySelector('.quiz-finish');
      const slides = Array.from(quiz.querySelectorAll('.quiz-slide'));
      let current = 0;
      let correctCount = 0;

      function goToSlide(idx) {
        current = idx;
        track.style.transform = `translateX(${-idx * 100}%)`;
        counter.textContent = `Question ${idx + 1} of ${total}`;
        progressFill.style.width = `${((idx + 1) / total) * 100}%`;
      }

      function updateLastScoreBadge() {
        const saved = readLastScore(quiz, quizIdx);
        if (saved) {
          lastScoreEl.textContent = `Last score: ${saved.score}/${saved.total}`;
          lastScoreEl.classList.remove('hidden');
        } else {
          lastScoreEl.classList.add('hidden');
        }
      }

      function renderFinish() {
        const score = correctCount;
        writeLastScore(quiz, quizIdx, score, total);
        viewport.style.display = 'none';
        finish.querySelector('.quiz-finish-score').textContent = `${score} / ${total}`;
        finish.querySelector('.quiz-finish-emoji').textContent =
          score === total ? '🏆' :
          score >= total - 1 ? '🎉' :
          score >= Math.ceil(total / 2) ? '👍' :
          '💪';
        finish.querySelector('.quiz-finish-title').textContent =
          score === total ? 'Perfect score.' :
          score >= total - 1 ? 'Great work.' :
          score >= Math.ceil(total / 2) ? 'Not bad.' :
          'Give it another go.';
        finish.querySelector('.quiz-finish-msg').textContent =
          score === total ? 'You smashed it. Ready for the next lesson.' :
          score >= total - 1 ? 'Almost clean sweep. One to revisit.' :
          score >= Math.ceil(total / 2) ? 'Worth a second pass over the lesson, then try the quiz again.' :
          'Give the lesson another read. You\'ll feel these click the second time.';
        finish.classList.add('shown');
        progressFill.style.width = '100%';
        counter.textContent = `${total} of ${total} complete`;
        updateLastScoreBadge();
      }

      function resetQuiz() {
        correctCount = 0;
        slides.forEach(function (slide) {
          slide.removeAttribute('data-done');
          const opts = slide.querySelectorAll('.quiz-option');
          opts.forEach(function (o) {
            o.disabled = false;
            o.classList.remove('correct', 'incorrect');
            const mark = o.querySelector('.quiz-option-mark');
            if (mark) mark.remove();
          });
          const ex = slide.querySelector('.quiz-explain');
          if (ex) ex.classList.remove('shown');
          const next = slide.querySelector('.quiz-next');
          if (next) next.classList.remove('shown');
        });
        finish.classList.remove('shown');
        viewport.style.display = '';
        goToSlide(0);
      }

      slides.forEach(function (slide) {
        const answerIdx = parseInt(slide.getAttribute('data-answer'), 10);
        const options = slide.querySelectorAll('.quiz-option');
        const explain = slide.querySelector('.quiz-explain');
        const next = slide.querySelector('.quiz-next');

        options.forEach(function (opt, idx) {
          opt.addEventListener('click', function () {
            if (slide.dataset.done) return;
            slide.dataset.done = '1';
            const isCorrect = idx === answerIdx;
            if (isCorrect) correctCount++;
            options.forEach(function (o, oIdx) {
              o.disabled = true;
              if (oIdx === answerIdx) {
                o.classList.add('correct');
                o.insertAdjacentHTML('beforeend', '<span class="quiz-option-mark">✓</span>');
              } else if (oIdx === idx) {
                o.classList.add('incorrect');
                o.insertAdjacentHTML('beforeend', '<span class="quiz-option-mark">✗</span>');
              }
            });
            if (explain) explain.classList.add('shown');
            if (next) {
              // Last question's Next becomes "See results"
              if (parseInt(slide.getAttribute('data-slide'), 10) === total - 1) {
                next.textContent = 'See results →';
              }
              next.classList.add('shown');
              // Focus the next button for keyboard users
              setTimeout(function () { next.focus(); }, 200);
            }
          });
        });

        if (next) {
          next.addEventListener('click', function () {
            const slideIdx = parseInt(slide.getAttribute('data-slide'), 10);
            if (slideIdx === total - 1) {
              renderFinish();
            } else {
              goToSlide(slideIdx + 1);
            }
          });
        }
      });

      const retryBtn = quiz.querySelector('.quiz-retry');
      if (retryBtn) retryBtn.addEventListener('click', resetQuiz);

      // Initial state
      goToSlide(0);
      updateLastScoreBadge();
    });
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // --- Copy-to-clipboard buttons on code blocks ---
  function hydrateCodeCopy() {
    document.querySelectorAll('.prose-lesson pre').forEach(function (pre) {
      if (pre.parentElement && pre.parentElement.classList.contains('code-wrap')) return;
      const wrap = document.createElement('div');
      wrap.className = 'code-wrap';
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'copy-btn';
      btn.textContent = 'Copy';
      btn.addEventListener('click', async function () {
        const code = pre.innerText;
        try {
          await navigator.clipboard.writeText(code);
          btn.classList.add('copied');
          btn.textContent = 'Copied';
          setTimeout(function () {
            btn.classList.remove('copied');
            btn.textContent = 'Copy';
          }, 1600);
        } catch (e) {
          btn.textContent = 'Press Cmd+C';
        }
      });
      wrap.appendChild(btn);
    });
  }

  // --- Progress celebration (small flash on complete) ---
  function hydrateCompleteFlash() {
    const cb = document.getElementById('lesson-complete-toggle');
    if (!cb) return;
    cb.addEventListener('change', function () {
      if (!cb.checked) return;
      const wrap = cb.closest('.mt-10');
      if (!wrap) return;
      wrap.style.transition = 'box-shadow .25s, transform .25s';
      wrap.style.boxShadow = '0 0 0 4px rgba(139,92,246,0.25)';
      wrap.style.transform = 'scale(1.01)';
      setTimeout(function () {
        wrap.style.boxShadow = '';
        wrap.style.transform = '';
      }, 600);
    });
  }

  function init() {
    hydrateQuizzes();
    hydrateCodeCopy();
    hydrateCompleteFlash();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
