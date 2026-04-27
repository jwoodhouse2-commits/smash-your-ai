---
title: Running agents in the background
duration: 8
summary: Fire off long jobs and let them run while you do something else. A practical guide to background agents, and how to avoid the common traps.
---

Some agent tasks take a while. Reading 200 PDFs. Converting a library of files. Searching a large codebase. You do not want to sit and watch them.

Claude Code can run agents in the **background**. You kick it off, go and make a cup of tea, and come back when it is done. This lesson covers when that is worth doing, how to set it up safely, and what to do when things go sideways.

## When background agents help

Reach for a background agent when **all three** of these are true.

1. **The task takes longer than you want to sit there.** Five minutes or more.
2. **You do not need to make decisions during the job.** The agent has enough to finish without checking in.
3. **You are happy to review the result when it comes back.** You will check the output, not watch it being made.

If any of those is false, stay in the foreground where you can steer.

<div class="callout callout-tip">
  <span class="callout-icon">💡</span>
  <div>
    <strong>A useful analogy.</strong> Background agents are like asking a capable assistant to "sort this in the meeting room, then come and find me when it is done". If the task is small or needs your input, you would do it together at your desk. If it is a big contained job, you let them crack on.
  </div>
</div>

## What you can kick off in the background

Tasks that fit cleanly.

- **Bulk conversions.** "Convert these 400 MP3s to M4A."
- **Research across many files.** "Read every PDF in /reports and produce a single summary table."
- **Code migrations.** "Update the import syntax in every .py file in /src to the new style."
- **Data cleaning.** "Normalise the date format in every row of customers.csv."
- **Bulk rewrites.** "In every file under /drafts, change 'we' to 'you' and save."

What all of these share: the shape of the work is clear, the volume justifies the handoff, and you can verify the output in one or two spot checks.

## How to brief a background job properly

A background agent should not need to ask you anything once it is running. Your brief should include:

- **The goal**, stated so "done" is obvious.
- **The scope.** Which files, which folder, which 400 items.
- **The output location.** Exactly where the results go. A new folder, a CSV, a summary.
- **The boundaries.** What it must not touch. What happens if something unusual appears.
- **A cap.** Maximum steps, maximum time, or maximum number of items to process before it should stop and report.
- **A "stuck" rule.** What to do if it hits a case it cannot handle ("skip and log in skipped.txt", not "make something up").

<div class="callout callout-example">
  <span class="callout-icon">🎯</span>
  <div>
    <strong>A complete background brief.</strong>
    <pre><code>Task: Convert every .mp3 in ~/podcast/ to .m4a.
Scope: Only files directly in ~/podcast/, not subfolders.
Output: Save converted files to ~/podcast-m4a/, keep filenames the same.
Boundaries: Do not delete the originals. Do not touch anything in
~/podcast/archive.
Cap: Stop after 100 files and report progress. I will restart
it if I want more.
Stuck rule: If a file fails to convert, skip it and add its filename
to ~/podcast-m4a/failed.txt. Do not stop the whole job.
Run this in the background. I will check it in an hour.</code></pre>
    <p>There is nothing to clarify, no judgement calls to make, and a sensible fallback for errors. Perfect for a background agent.</p>
  </div>
</div>

## The three common mistakes

### 1. No cap

Without an explicit cap, a background agent can quietly chew through your plan usage. Always put a ceiling on time, steps, or items.

### 2. No "stuck" rule

When the agent meets a case outside its brief, what should it do? Stop the whole job? Guess? Skip and log? Pick one and say so. Without a rule, it will probably guess.

### 3. No reporting

A background agent that does not tell you what happened leaves you with the job of reconstructing it. Ask for a short report: "When done, save a summary at /done.txt with: total files processed, skipped (and why), total time."

<div class="callout callout-warning">
  <span class="callout-icon">⚠️</span>
  <div>
    <strong>Do not run destructive jobs in the background.</strong> Anything involving deletion, overwriting, sending emails, or posting to the internet should run in the foreground where you can react if something looks wrong. The convenience is not worth the risk.
  </div>
</div>

## Checking in

When the agent is running, you have two jobs.

**Be contactable.** Some jobs will hit a situation that your "stuck" rule did not cover. Claude Code should ping you. Stay near your machine.

**Spot-check on return.** When the job is done, open the output. Check 3 to 5 items at random. If they look right, accept the job. If not, read the full log and decide whether to re-run with a fixed brief.

<div class="callout callout-scenario">
  <span class="callout-icon">🎬</span>
  <div>
    <strong>A real morning.</strong>
    <p>9:00. Brief: "Read every blog post in /posts, rewrite titles to be under 70 characters, save as title-old and title-new per post in titles.csv. Max 80 posts, skip anything that cannot be shortened, log it."</p>
    <p>9:02. Agent starts. You go into a meeting.</p>
    <p>10:15. Agent says "done, 80 posts processed, 3 skipped, report in titles.csv".</p>
    <p>10:18. You open titles.csv. Sample five rows. Looks sensible. Accept.</p>
    <p>Total: 3 minutes of your actual time. The agent worked for an hour and 13 minutes while you ran a different meeting.</p>
  </div>
</div>

<div class="callout callout-try">
  <span class="callout-icon">⚡</span>
  <div>
    <strong>Try this now.</strong> Find a small but genuinely repetitive job in a folder you own. Maybe renaming a batch of files, or summarising a set of PDFs.
    <p>Write a full brief using the template above. Include cap, boundaries, output, stuck rule, and reporting. Run it in the background. Come back 15 minutes later and review.</p>
    <p>The first time you do this, it feels like cheating. That is the right feeling.</p>
  </div>
</div>

<div class="quiz" data-quiz-title="Quick check">
  <div class="quiz-q" data-answer="1">
    <p class="quiz-prompt">Which is NOT a good background-agent task?</p>
    <button class="quiz-option">Converting 400 audio files</button>
    <button class="quiz-option">Responding to customer complaints</button>
    <button class="quiz-option">Reading PDFs and producing a summary table</button>
    <button class="quiz-option">Renaming a folder of photos</button>
    <p class="quiz-explain">Responding to customers needs human judgement and the stakes are high. The others are well-specified, contained batch jobs.</p>
  </div>
  <div class="quiz-q" data-answer="0">
    <p class="quiz-prompt">What should every background brief include to stop runaway usage?</p>
    <button class="quiz-option">A cap on time, steps, or item count</button>
    <button class="quiz-option">A poem</button>
    <button class="quiz-option">Your full work history</button>
    <button class="quiz-option">A live microphone feed</button>
    <p class="quiz-explain">Unbounded jobs burn through plan usage quietly. Always cap time, steps, or volume, and ask the agent to stop and report.</p>
  </div>
  <div class="quiz-q" data-answer="2">
    <p class="quiz-prompt">The agent hits a file it does not know how to handle. What should its "stuck" rule be?</p>
    <button class="quiz-option">Guess and keep going</button>
    <button class="quiz-option">Shut down the whole job</button>
    <button class="quiz-option">Skip, log the filename in a file, and carry on</button>
    <button class="quiz-option">Email you immediately</button>
    <p class="quiz-explain">Skipping and logging lets the job complete. You can then deal with the skipped items separately. Guessing is the behaviour we most want to avoid.</p>
  </div>
</div>

Next: [using multiple agents, and when it is the right move](/course/advanced/agents/multiple-agents).
