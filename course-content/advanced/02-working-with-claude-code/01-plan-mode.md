---
title: Plan mode, and when to use it
duration: 8
summary: Plan mode turns Claude Code from "ready to act" into "ready to think". The single biggest productivity win once you are past day one.
---

By default, Claude Code wants to be useful. You ask it to tidy a folder, it starts tidying. That is fine for small jobs. For anything bigger, you want a moment of thinking before any doing.

That is what **plan mode** is for.

## What plan mode does

In plan mode, Claude Code can read, explore, and think, but it **cannot write files, edit files, or run shell commands**. Anything that would change your system is off the table until you leave plan mode and approve a plan.

The flow looks like this:

1. You turn plan mode on.
2. You describe what you want.
3. Claude Code reads whatever it needs, thinks, and presents a step-by-step plan.
4. You read the plan. Tweak it if you want. Approve it.
5. Claude Code leaves plan mode and executes the approved plan.

It turns one big leap of trust into a reviewed set of small steps.

<div class="callout callout-tip">
  <span class="callout-icon">💡</span>
  <div>
    <strong>How to toggle it.</strong> In Claude Code, press <code>Shift + Tab</code> to cycle between modes. You will see the mode indicator at the bottom of the terminal change between "ready", "plan mode", and "auto" (if your version includes auto). You can also ask: <em>"switch to plan mode first"</em>.
  </div>
</div>

## When plan mode earns its keep

Reach for plan mode any time one of these is true:

- **The task is non-trivial.** More than a few files, or any work where Claude Code will need to make a handful of decisions on your behalf.
- **You do not fully know what you want yet.** Planning out loud forces a specification. Half your prompt becomes the plan's first draft.
- **The work touches something you care about.** Anything customer-facing, anything in a live system, anything you could not rebuild quickly.
- **You are exploring a codebase or data set for the first time.** Plan mode lets Claude Code read a lot without you worrying it will edit something by mistake.

Rule of thumb: **if you would want to see the plan before the action, use plan mode**.

## When you do not need it

Plan mode adds a step. For genuinely small jobs that is friction rather than safety.

Skip it when:

- You just want one small file edit and you can see the change on screen.
- You are running a read-only query ("what is in this folder?"), which can never break anything anyway.
- You are iterating quickly on something low-stakes in a test folder.

## A worked example

<div class="callout callout-scenario">
  <span class="callout-icon">🎬</span>
  <div>
    <strong>A folder of invoices.</strong>
    <p>You have 140 PDF invoices across three subfolders. You want them renamed using the date and client name, and sorted by year.</p>
    <p><strong>Without plan mode:</strong> Claude Code starts renaming immediately, and if its convention is wrong you have a tidying job of your own.</p>
    <p><strong>With plan mode:</strong> it reads 3 or 4 sample invoices, proposes a naming convention, asks you to confirm, then lists every rename it is about to do. You catch the one file that does not parse and handle it manually. Done in two minutes.</p>
  </div>
</div>

## The "plan, then execute" prompt template

Even without flipping the mode switch, you can ask for planning in plain English. Copy this:

```
Before you make any changes, read through the relevant files and tell
me what you would do, step by step. List anything you are unsure about.
Do not start until I say "go".
```

Paste that at the start of any big request and you will get a reviewed plan every time.

<div class="callout callout-example">
  <span class="callout-icon">🎯</span>
  <div>
    <strong>Real prompt, real outcome.</strong>
    <p><em>"I want to switch all the blog post dates in /posts from DD-MM-YYYY to YYYY-MM-DD in the filenames. In plan mode, walk through the posts folder, show me 3 example renames, and list any files whose dates you cannot parse. Do not rename anything yet."</em></p>
    <p>You get a plan, a sample, and a list of outliers. You approve. It runs. You went from "scared of touching it" to "done" in a single exchange.</p>
  </div>
</div>

## Plan mode and the safety model

Plan mode is a layer on top of the permission system from lesson 1.4, not a replacement.

- The permission tiers still apply once you approve a plan.
- Plan mode mainly saves you from the "oh no, it just did the wrong thing" situation.
- You can stay in plan mode for an entire conversation if you want. Many experienced users do.

<div class="callout callout-try">
  <span class="callout-icon">⚡</span>
  <div>
    <strong>Try this now.</strong> Open Claude Code, press <code>Shift + Tab</code> until you see plan mode active. Then ask:
    <p><em>"Read this folder and write a one-paragraph description of what it is for, plus three things I could automate with your help. Do not make any changes."</em></p>
    <p>Notice the mode indicator stays in plan mode the whole way. You have just run your first plan-mode session.</p>
  </div>
</div>

## The habit to build

Treat plan mode as your **default for anything multi-step**. Most power users work in plan mode 70 to 80 per cent of the time and drop out for quick edits once a plan is agreed.

Planning also makes you a better prompter. You notice, reading the plan back, that you forgot to say "keep the originals" or "only touch files from this quarter". Every iteration improves the plan. The final approved plan often ends up as a template you paste into future sessions.

<div class="quiz" data-quiz-title="Quick check">
  <div class="quiz-q" data-answer="1">
    <p class="quiz-prompt">What does plan mode prevent Claude Code from doing?</p>
    <button class="quiz-option">Reading your files</button>
    <button class="quiz-option">Writing or editing files, or running shell commands</button>
    <button class="quiz-option">Thinking out loud</button>
    <button class="quiz-option">Using the internet</button>
    <p class="quiz-explain">Plan mode is read-and-think only. It cannot write, edit, or run anything until you leave the mode and approve a plan.</p>
  </div>
  <div class="quiz-q" data-answer="2">
    <p class="quiz-prompt">Which job is plan mode best for?</p>
    <button class="quiz-option">Running <code>ls</code> to see a folder listing</button>
    <button class="quiz-option">Asking what year the euro launched</button>
    <button class="quiz-option">Renaming 140 invoices across three folders</button>
    <button class="quiz-option">Changing a single typo in a text file you have open</button>
    <p class="quiz-explain">Plan mode shines on multi-file, non-trivial tasks. For one-line edits or read-only questions, the overhead outweighs the benefit.</p>
  </div>
  <div class="quiz-q" data-answer="0">
    <p class="quiz-prompt">How do you toggle plan mode in Claude Code?</p>
    <button class="quiz-option">Press Shift + Tab</button>
    <button class="quiz-option">Restart Claude Code with a flag</button>
    <button class="quiz-option">Edit a config file</button>
    <button class="quiz-option">Run <code>claude --plan</code></button>
    <p class="quiz-explain">Shift+Tab cycles modes inside Claude Code. The current mode is shown at the bottom of the terminal.</p>
  </div>
</div>

Next: [the slash commands you will actually use](/course/advanced/working-with-claude-code/slash-commands).
