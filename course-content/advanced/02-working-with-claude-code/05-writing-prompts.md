---
title: Writing prompts that get Claude Code to do the right thing
duration: 10
summary: Claude Code prompts are different from chatbot prompts. Here is what changes, and how to write prompts that land first time.
graderTask: >-
  Write a prompt for Claude Code that asks it to reorganise your Downloads
  folder by file type (for example, PDFs into a Documents folder, images into
  an Images folder), without deleting anything. Use plan mode first.
graderRubric:
  - Names the exact starting folder and what success looks like. Nothing is left vague.
  - Explicitly asks for a plan before any action, or uses the phrase "do not make changes yet".
  - Lists things the AI must NOT do (deletions, overwrites, moving outside the target folder).
  - Covers edge cases (folders inside the starting folder, unknown file types, duplicates).
  - Specifies how the learner wants to see the plan (list of moves, confirmation before running).
  - Tone is plain English, concise, not a wall of text.
---

A good chatbot prompt and a good Claude Code prompt are not the same thing. Claude Code is going to **act** on what you say, so the stakes are higher. This lesson covers the five things that make a Claude Code prompt land.

## The five ingredients

You already know the four ingredients of a good prompt from the Beginner tier (role, task, context, format). For Claude Code, add a fifth: **boundaries**.

### 1. Role

Usually unneeded. Claude Code already knows it is Claude Code. Only set a role when the task is opinionated ("you are a careful data engineer who double-checks before writing"). For normal work, skip it.

### 2. Task

The headline of what you want done. Claude Code is best with **one task per conversation**. Bundled tasks ("do A then B then C, and while you are at it D") dilute the context and multiply mistakes.

### 3. Context

What it needs to know before it can act well.

- Which files or folders matter.
- Which files or folders are off-limits.
- What the expected output looks like.
- Any quirks ("the first row of the CSV has a typo, ignore it").

### 4. Format

How Claude Code should deliver. "Give me a summary before editing." "Show me the diff before saving." "Write one CSV, not many."

### 5. Boundaries

The new one for Claude Code specifically. Name the things it must **not** do.

- "Do not delete anything."
- "Only touch files in /drafts, never in /sent."
- "Do not change any filenames that already end in -final."
- "Do not run any command starting with `sudo`."

Boundaries are how you let Claude Code move fast without losing sleep.

## A before-and-after

<div class="callout callout-example">
  <span class="callout-icon">🎯</span>
  <div>
    <strong>Weak prompt.</strong>
    <p><em>"tidy up my Downloads folder"</em></p>
    <p>Claude Code will interpret freely. It might delete things it thinks are duplicates, rename things aggressively, or move files in ways you have to unpick.</p>
    <p><strong>Strong prompt.</strong></p>
    <p><em>"Reorganise ~/Downloads by file type. PDFs into ~/Downloads/Documents, images into ~/Downloads/Images, videos into ~/Downloads/Videos. Do not delete or rename anything. Do not touch the existing Archive folder. Before making any moves, show me a numbered list of what you would do, grouped by destination, and wait for me to say 'go'."</em></p>
    <p>One task. Named files. Named exceptions. Explicit format. Explicit boundaries. A plan request. The result is predictable and easy to review.</p>
  </div>
</div>

## Five templates to steal

You do not need to write every prompt from scratch. These five cover most real work.

### "Read and explain"

```
Read [path]. In two paragraphs, tell me what this is for,
what state it is in, and anything that looks off.
Do not make any changes.
```

### "Plan, then execute"

```
In plan mode, draft a step-by-step plan for [goal].
List anything you would need to do, including anything you
are unsure about. Do not start until I say "go".
```

### "Bulk with boundaries"

```
For every [file type] in [folder]:
- [what to do]
- [what to leave alone]

Before running, show me 3 example changes and the total
count. Do not touch anything outside [folder].
```

### "Fresh eyes review"

```
Read [file/folder]. Give me:
1. Three things that are working.
2. Three things I should fix.
3. Anything that looks risky or wrong.
Do not edit anything. I just want the review.
```

### "Research with sources"

```
Read [folder of documents] and answer [question]. For every
claim in your answer, quote the exact sentence from the
source and name the file. If you cannot find a source,
say "no source" rather than guessing.
```

## Three things that ruin a Claude Code prompt

### 1. Vague pronouns

"Fix this" and "update that" assume Claude Code knows what "this" and "that" mean. Name the file. Name the folder. Name the line number if you have it.

### 2. Not saying what NOT to do

The single biggest source of "I didn't want that" moments. If there is anything Claude Code should leave alone, say so in the prompt. Do not rely on it guessing.

### 3. Asking for too much in one breath

"Read the project, refactor the API, update the docs, and write a release note" is four tasks. It will be done worse than any of them alone. Break it up and `/clear` between.

<div class="callout callout-tip">
  <span class="callout-icon">💡</span>
  <div>
    <strong>A short test.</strong> Read your prompt back to yourself as if you were a junior assistant on their first day. Could they do the task without asking you any follow-up questions? If yes, it is a good prompt. If no, the gaps are exactly where Claude Code will guess.
  </div>
</div>

## Grade a real prompt now

Use the widget below to try your own. Write a prompt that asks Claude Code to reorganise your Downloads folder by file type, without deleting anything, using plan mode first. The grader will give you a score, name what is missing, and suggest a stronger version.

<div class="prompt-grader" data-lesson-key="advanced/working-with-claude-code/writing-prompts" data-task="Write a prompt for Claude Code that reorganises your Downloads folder by file type (PDFs, images, videos into their own folders) without deleting anything. Use plan mode first. We will grade it and suggest improvements."></div>

<div class="quiz" data-quiz-title="Quick check">
  <div class="quiz-q" data-answer="1">
    <p class="quiz-prompt">What is the new fifth ingredient that Claude Code prompts need that chatbot prompts do not?</p>
    <button class="quiz-option">Role</button>
    <button class="quiz-option">Boundaries (things NOT to do)</button>
    <button class="quiz-option">Examples</button>
    <button class="quiz-option">Persona</button>
    <p class="quiz-explain">Claude Code acts on what you say. Naming what it must not do prevents the most common "I didn't want that" moments.</p>
  </div>
  <div class="quiz-q" data-answer="2">
    <p class="quiz-prompt">How many main tasks should one Claude Code conversation handle?</p>
    <button class="quiz-option">As many as you can think of</button>
    <button class="quiz-option">Four, with a summary at the end</button>
    <button class="quiz-option">One</button>
    <button class="quiz-option">Three small tasks or one big one</button>
    <p class="quiz-explain">One task per conversation produces cleaner context, better answers, and easier review. Use <code>/clear</code> between unrelated tasks.</p>
  </div>
  <div class="quiz-q" data-answer="0">
    <p class="quiz-prompt">Which of these is the single biggest cause of bad Claude Code outcomes?</p>
    <button class="quiz-option">Vague prompts that do not say what NOT to do</button>
    <button class="quiz-option">Typing too slowly</button>
    <button class="quiz-option">Using Haiku when you should use Opus</button>
    <button class="quiz-option">Keeping Claude Code open for more than an hour</button>
    <p class="quiz-explain">Most "that's not what I wanted" moments trace back to an unnamed boundary or an ambiguous pronoun. Fix the prompt, and the problem does not come back.</p>
  </div>
</div>

That is the end of Module 2. Next up, Module 3 covers **MCP servers** and how to plug Claude Code into your wider stack.

Next: [what MCP is and why it matters](/course/advanced/mcp/what-is-mcp).
