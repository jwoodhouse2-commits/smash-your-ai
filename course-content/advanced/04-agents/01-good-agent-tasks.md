---
title: What makes a task a good "agent" task
duration: 8
summary: Not every job is a good fit for autonomous AI. Here are the five signals of tasks where agents save you time, and the five where they will cost you more than they save.
---

"Agent" has become a loose word in 2026. In this course we mean something specific: **Claude Code running a multi-step job on your behalf, checking in with you only at key moments, rather than one prompt at a time.**

Some tasks are brilliant for this. Some are a disaster. This lesson helps you tell them apart before you burn an evening finding out.

## The five signals of a good agent task

The more of these a task has, the better suited it is to being handed off.

### 1. The goal is clear

You can state, in one sentence, what "done" looks like. If you cannot, neither can the agent.

**Good goal:** "Rename every photo in /holiday-2025 to start with the date the photo was taken."

**Bad goal:** "Make my photo folder nicer."

### 2. The steps are knowable

You do not need to write them down yourself, but you know *in principle* what the path from A to B looks like. An agent can plan steps when the shape of the work is understood. It cannot plan steps for a task nobody understands yet.

**Good:** "Convert each .docx in /drafts to Markdown, then lint for British spellings."

**Bad:** "Turn my random Google Drive into something useful somehow."

### 3. Errors are recoverable

If the agent gets it wrong, you can get back to the starting state without losing anything irreplaceable. That usually means: you have a backup, the task is in a copy, or you are using version control (git).

**Good:** Working inside a folder you duplicated first.

**Bad:** Working on your only copy of a 15-year archive. If the agent slips, you have no undo.

### 4. The work is boring or repetitive

Agents shine at repetitive work that a human finds tedious. If every step is a judgement call, a human judgement is cheaper per-unit than agent judgement.

**Good:** 300 file renames with a predictable pattern.

**Bad:** Editing the tone of 300 marketing emails (each needs a judgement call).

### 5. You can check the result fast

A task is a good agent task if you can verify the output in a few minutes. If checking takes as long as doing, you have saved nothing.

**Good:** A summary table. A list of renamed files. A single CSV.

**Bad:** 40 detailed paragraphs you now have to read word-for-word.

## The five signals of a bad agent task

Flip sides. Any one of these is enough to reach for a normal Claude Code conversation or do the work yourself.

1. **You cannot state "done" in a sentence.**
2. **The stakes are high and errors are permanent.** Anything live, customer-facing, or hard to restore.
3. **The task is small.** Under five minutes, typing it yourself is faster than briefing an agent.
4. **It needs your judgement at every step.** Editorial decisions. Strategy. Sales conversations.
5. **You cannot check the output.** If the whole point is "I don't know what good looks like", you need to learn first, not automate.

<div class="callout callout-warning">
  <span class="callout-icon">⚠️</span>
  <div>
    <strong>The "dangerous middle".</strong> The tasks that cost people the most time are the ones that feel like they should be agent-able but are actually on the edge. Drafting 20 emails (judgement-heavy). "Cleaning up" a codebase (goal unclear). Responding to customer complaints (relationship stakes).
    <p>Before you hand something off, run it through the 10 signals above honestly. If it fails even one of the badness tests, do not automate that task today.</p>
  </div>
</div>

## A scoring exercise

<div class="callout callout-example">
  <span class="callout-icon">🎯</span>
  <div>
    <strong>Three candidate tasks. Which is the best agent task?</strong>
    <p><strong>A.</strong> "Read my 2024 tax documents and tell me if anything is missing."</p>
    <p><strong>B.</strong> "Convert the 400 MP3 podcast episodes in /podcast to M4A format and move them to /podcast-converted."</p>
    <p><strong>C.</strong> "Write a pricing strategy for my new product."</p>
    <p><strong>Answer: B.</strong> Clear goal. Knowable steps. Recoverable errors (you still have the MP3s). Boring, repetitive, big volume. You can check in two minutes by opening one file. Perfect agent task.</p>
    <p>A is close but stakes are high and "missing" needs judgement. C is not an agent task at all; it is a thinking task.</p>
  </div>
</div>

## How to set up a good agent task

Three prompt patterns work for most agent briefs.

### The research pattern

```
Spend up to 15 minutes on this. Read [sources]. Produce a single
summary file at [path] that answers [question]. Include your
sources by filename and line. Do not change anything else.
```

### The batch pattern

```
For every [thing] in [location]:
  1. [step]
  2. [step]
  3. [step]
Save results to [location]. Skip anything that looks odd
and report them in a file called skipped.txt.
```

### The "keep going" pattern

```
Start on [goal]. Work in steps. After every 5 steps, stop and
tell me where you are. Do not exceed 25 steps total. Use plan
mode first to show me the shape of the work.
```

<div class="callout callout-tip">
  <span class="callout-icon">💡</span>
  <div>
    <strong>Always cap the agent's budget.</strong> In any of the patterns, put a ceiling on time, steps, or volume. An agent that keeps going forever is a cost, not a benefit. "Up to 15 minutes", "max 25 steps", "stop every 5 steps and report".
  </div>
</div>

## What is next

The next lesson looks at **running agents in the background**, so you can fire off long jobs and come back to them later. After that, when it is worth running multiple agents at once, and when it is not.

<div class="quiz" data-quiz-title="Quick check">
  <div class="quiz-q" data-answer="2">
    <p class="quiz-prompt">Which of these is the best candidate for an agent task?</p>
    <button class="quiz-option">"Write a thoughtful eulogy for my grandad."</button>
    <button class="quiz-option">"Come up with a brand name for my new business."</button>
    <button class="quiz-option">"Rename 300 holiday photos so the filename starts with the date taken."</button>
    <button class="quiz-option">"Decide whether I should take the job offer."</button>
    <p class="quiz-explain">Clear goal, repetitive, knowable steps, recoverable, easy to verify. The others all need judgement and are not the right fit for handing off.</p>
  </div>
  <div class="quiz-q" data-answer="0">
    <p class="quiz-prompt">Which is NOT one of the five signals of a good agent task?</p>
    <button class="quiz-option">The AI picks the goal for you</button>
    <button class="quiz-option">Errors are recoverable</button>
    <button class="quiz-option">You can check the result fast</button>
    <button class="quiz-option">The work is boring or repetitive</button>
    <p class="quiz-explain">You set the goal. An agent that has to invent its own goal is a recipe for scope creep.</p>
  </div>
  <div class="quiz-q" data-answer="1">
    <p class="quiz-prompt">What should every agent brief include to stop it running away?</p>
    <button class="quiz-option">A list of every file on your computer</button>
    <button class="quiz-option">A ceiling on time, steps, or volume</button>
    <button class="quiz-option">A poem about patience</button>
    <button class="quiz-option">The full transcript of your previous conversations</button>
    <p class="quiz-explain">"Up to 15 minutes", "max 25 steps", or "stop every 5 steps and report". Pick one. It prevents the agent from spending more time than the task is worth.</p>
  </div>
</div>

Next: [running agents in the background](/course/advanced/agents/background-agents).
