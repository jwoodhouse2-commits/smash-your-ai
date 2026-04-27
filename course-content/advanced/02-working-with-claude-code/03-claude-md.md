---
title: CLAUDE.md, teaching Claude about your project
duration: 8
summary: A small Markdown file in your project that Claude Code reads on every session. The single cheapest upgrade to every prompt you will ever write.
---

Every time you start Claude Code in a folder, you could spend the first two minutes explaining what the project is, what tech you use, what conventions you follow, and what you do not want Claude Code to touch.

Or you could write it down once, in a file called `CLAUDE.md`, and Claude Code will read it every time.

This lesson shows you how to do that, and what to put in it.

## What CLAUDE.md is

`CLAUDE.md` is a plain Markdown file placed in the root of a project folder. Claude Code reads it on every session, the same way you would skim the README before a meeting.

Anything you put in there is context Claude Code has **for free**, forever, with no extra prompting from you.

<div class="callout callout-tip">
  <span class="callout-icon">💡</span>
  <div>
    <strong>Fastest way to create one.</strong> Run <code>/init</code> inside Claude Code from your project folder. It will look through the project, then write an opinionated first-draft <code>CLAUDE.md</code> for you. You then edit it to match reality.
  </div>
</div>

## What to put in yours

Good `CLAUDE.md` files are short. Under 50 lines is ideal. Anything longer and Claude will skim.

Five sections cover most projects.

### 1. What this project is

Two or three sentences. What the project does, who it is for, the state it is in.

```
# Project: Bean House Marketing
A folder of marketing assets, email templates, and draft blog posts
for The Bean House, an independent cafe in Alnwick. Active project.
Content gets reviewed weekly and pushed to Mailchimp + the website.
```

### 2. How we work here

Conventions and preferences Claude should always honour.

```
## How we work here
- Tone: friendly, warm, down-to-earth. Never corporate.
- British English spellings.
- Keep emails under 150 words.
- Always include a clear call to action and a direct link to book.
```

### 3. What is in the folders

If the structure is non-obvious, explain it once.

```
## Folder structure
- /emails/         Drafts being prepared for send
- /sent/           Archive of what's gone out (never edit)
- /website-copy/   Copy being staged for the site
- /assets/         Photos, logos (do not rename)
```

### 4. Things to never touch

This is the single most valuable section.

```
## Do not touch
- /sent/           Archive, read-only.
- /assets/         Original media, keep filenames.
- website-live.md  Always a copy. Edit website-draft.md instead.
```

### 5. Shortcuts

Optional, but a huge time-saver. Recurring prompts you want Claude to recognise.

```
## Shortcuts
- "weekly email" → draft a weekly marketing email in our house tone,
  using the current month's events in /events.md as the starting point.
- "fix copy" → review a draft for tone, length, and call to action,
  then rewrite to match our house style.
```

## What NOT to put in CLAUDE.md

- Project-specific secrets (API keys, passwords). Those go in `.env`, not here.
- Personal memory or preferences that apply to all your projects. Those go in `/memory` at the user level (via `/memory` in Claude Code).
- Giant manuals. If the content is longer than a sidebar, link to a separate file and tell Claude Code to read it when needed.

<div class="callout callout-warning">
  <span class="callout-icon">⚠️</span>
  <div>
    <strong>Check CLAUDE.md into git (if you use it).</strong> If this is a team project, you want the whole team to share the same context. If it is private, still keep it in the folder, just not in a public repo. Treat it the same way you would a team onboarding document.
  </div>
</div>

## Nested CLAUDE.md files

You can have more than one. Claude Code reads every `CLAUDE.md` in the folder tree up to the project root.

- The one in your **project root** sets project-wide rules.
- A `CLAUDE.md` inside a **sub-folder** can add rules that only apply to that folder.
- A `CLAUDE.md` in your **home directory** sets personal defaults that apply everywhere you use Claude Code.

Nested files are additive. Subfolder rules add to the project rules, not replace them.

<div class="callout callout-example">
  <span class="callout-icon">🎯</span>
  <div>
    <strong>A nested example.</strong> The root <code>CLAUDE.md</code> says "British English, warm tone." A <code>/legal/CLAUDE.md</code> sub-folder file adds "In this folder, formal tone only, full legal disclaimers included, never paraphrase." Claude combines them automatically when working in /legal.
  </div>
</div>

## How to tell it is working

Three quick signs your `CLAUDE.md` is landing:

1. **Claude stops asking the same clarifying questions.** If you used to get "what tone do you want?" every session and now you never do, it is reading CLAUDE.md.
2. **Your prompts get shorter.** You can say "draft the weekly email" instead of spelling out the audience, tone, and format each time.
3. **It respects your "do not touch" rules.** Claude tells you "the file is in /sent which is read-only, do you want me to draft a new one instead?" before it tries to edit.

If none of those happen, open your CLAUDE.md and check it is actually in the folder you started Claude Code in.

<div class="callout callout-try">
  <span class="callout-icon">⚡</span>
  <div>
    <strong>Try this now.</strong> Pick a folder you use often. Run <code>/init</code>. Read the generated CLAUDE.md and edit it until it feels like a one-page brief a new assistant could read on day one.
    <p>Time it properly. Most people go from "AI is so-so" to "AI is genuinely useful" the day they write their first CLAUDE.md.</p>
  </div>
</div>

<div class="quiz" data-quiz-title="Quick check">
  <div class="quiz-q" data-answer="1">
    <p class="quiz-prompt">Where does CLAUDE.md live?</p>
    <button class="quiz-option">On Anthropic's servers</button>
    <button class="quiz-option">In the root of your project folder</button>
    <button class="quiz-option">Inside Claude Code's install directory</button>
    <button class="quiz-option">You cannot edit it, it is auto-generated each session</button>
    <p class="quiz-explain">CLAUDE.md is a plain Markdown file you keep in the project's root folder. Claude Code reads it on every session.</p>
  </div>
  <div class="quiz-q" data-answer="0">
    <p class="quiz-prompt">Which command creates a first-draft CLAUDE.md for you?</p>
    <button class="quiz-option">/init</button>
    <button class="quiz-option">/clear</button>
    <button class="quiz-option">/model</button>
    <button class="quiz-option">/doctor</button>
    <p class="quiz-explain"><code>/init</code> walks your project and drafts a CLAUDE.md you can edit.</p>
  </div>
  <div class="quiz-q" data-answer="2">
    <p class="quiz-prompt">Which section of CLAUDE.md arguably returns the most value?</p>
    <button class="quiz-option">A full company history</button>
    <button class="quiz-option">A list of every file in the project</button>
    <button class="quiz-option">"Things to never touch"</button>
    <button class="quiz-option">A copy of your API keys</button>
    <p class="quiz-explain">"Things to never touch" prevents the highest-cost mistakes. API keys should never go in CLAUDE.md; those belong in <code>.env</code>.</p>
  </div>
</div>

Next: [tokens, context, and not burning through your plan](/course/advanced/working-with-claude-code/tokens-and-context).
