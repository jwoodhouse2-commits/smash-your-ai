---
title: The safety model, and why it asks permission
duration: 8
summary: Claude Code lets you go faster once you know when to trust it. Here is the mental model and a practical settings recipe.
---

Claude Code is powerful because it can edit files and run commands. That power is only safe when you understand when to say yes quickly and when to slow down.

This lesson gives you a simple mental model and a short settings recipe. Once you have both, you can move much faster without accidents.

## The three permission tiers

When Claude Code is about to do something, it falls into one of three tiers.

### Tier 1: Read-only (safe)

Looking at a file. Listing a folder. Running commands that only query information (like `ls` or `find`).

**Risk:** essentially none. Nothing changes on your computer.

**Advice:** auto-approve these once you are comfortable. Life is too short to click yes on "read the file I literally just told you to read".

### Tier 2: Writes and edits (contained)

Editing a file. Creating a new file. Running a command that modifies something (like renaming) but stays within the folder you pointed Claude Code at.

**Risk:** low, but a careless edit in the wrong file is still a real mistake.

**Advice:** keep these as ask-each-time. Read the diff, then approve.

### Tier 3: Destructive or global (danger)

Deleting files. Anything with `sudo`. Anything that touches system files. Anything outside the folder you were working in. Anything that sends data somewhere (uploading, posting, emailing).

**Risk:** irreversible. Some of these can wipe hours of work.

**Advice:** never auto-approve. Always read the plan, and if you are unsure, ask Claude Code "what does this actually do? show me without running it".

<div class="callout callout-tip">
  <span class="callout-icon">💡</span>
  <div>
    <strong>A useful question to ask.</strong> If you are not sure about a command, paste it back to Claude Code and ask: "before I approve this, explain in plain English what it does and what would happen if I regret it." It will tell you honestly.
  </div>
</div>

## The one setting that matters

Claude Code stores permission rules in a file called `settings.json`. You can edit it by hand, but the easier route is:

1. Approve a command once.
2. When Claude Code asks, pick **"Allow always"** only if you are absolutely sure.
3. Pick **"Allow once"** for anything you are not.

The starter recipe most people end up with:

- **Always allow:** reading files, listing folders, running read-only commands like `ls`, `cat`, `find`, `wc`, `grep`.
- **Ask each time:** writing files, editing files, running any command that changes your system.
- **Never auto-allow:** `rm`, `sudo`, anything that sends data over the internet.

<div class="callout callout-example">
  <span class="callout-icon">🎯</span>
  <div>
    <strong>What "always allow" actually does.</strong>
    <p>Picking "Allow always" for <code>ls</code> only auto-approves that exact read-only command. It does not give Claude Code blanket power. Each command type has its own rule.</p>
    <p>If you later decide you made a mistake, you can remove any rule by editing <code>settings.json</code> in your user folder. Claude Code will print the path.</p>
  </div>
</div>

## Habits that make this easier

Four small habits that let you move faster without accidents.

### 1. Work in a copy the first time

When a task is new, duplicate the folder first. Let Claude Code loose on the copy. If it messes up, you still have the original.

### 2. Keep a "todo" conversation going

Ask Claude Code to **plan before it acts**. Saying "plan this out in steps first, do not make any changes yet" turns a scary task into a reviewed one. Approve the plan, then say "go".

### 3. Ask for dry runs

For any command you are not sure about, ask it to **show** rather than **do**. "Show me which files this would rename, without actually renaming." Once you like the list, approve the real run.

### 4. Use version control on important work

If you work in files you care about, keep them in a folder with **git** initialised. Claude Code respects git, and you can always `git diff` or `git checkout` to revert a change. This is how most professional developers work with Claude Code all day.

<div class="callout callout-scenario">
  <span class="callout-icon">🎬</span>
  <div>
    <strong>A near miss.</strong>
    <p>Someone in a hurry told Claude Code "clean up the temp files in this folder". Claude Code said: "I'll delete 47 files matching *.tmp, here is the list. Run?" The user skim-read, saw the number, and hit enter. Two of the 47 files had been incorrectly named by another tool and were actually the day's working notes.</p>
    <p>Nothing Claude Code did was wrong. It showed the plan. The lesson is to read the list, not just the summary line. Thirty seconds of reading is always worth it on anything destructive.</p>
  </div>
</div>

## What "auto mode" is for

Claude Code can run in an auto mode where it approves its own actions within limits you set. Some people use this for bulk jobs where they are happy for it to chew through 50 files without supervision.

The rule of thumb: **auto mode is fine for read-heavy, contained tasks in a throwaway folder**. It is a bad idea anywhere important, anywhere new, or anywhere destructive. Lesson 3.2 in Module 3 covers auto mode properly once you have more miles in.

## The permissions mental model in one sentence

**Reading is cheap, writing is cautious, deleting is sacred.**

Hold that in your head, and you will be safe and fast from day one.

## You're through Module 1

You now know what Claude Code is, how to install it, how to use it for real work, and how to stay safe while doing so.

Next up, Module 2 covers the workflow that separates casual Claude Code users from power users. Plan mode, the slash commands you will actually use, how to teach Claude about your project with CLAUDE.md, and how to stay inside your plan limits.

<div class="quiz" data-quiz-title="Quick check">
  <div class="quiz-q" data-answer="0">
    <p class="quiz-prompt">Which action belongs in the "never auto-approve" tier?</p>
    <button class="quiz-option">Anything with <code>rm</code> or <code>sudo</code> in it</button>
    <button class="quiz-option">Reading a file</button>
    <button class="quiz-option">Listing files in a folder</button>
    <button class="quiz-option">Running <code>grep</code> to find text</button>
    <p class="quiz-explain">Deletion and elevated-privilege commands are irreversible or system-wide. Always read the plan before approving.</p>
  </div>
  <div class="quiz-q" data-answer="1">
    <p class="quiz-prompt">You are about to approve a command you do not fully understand. What is the smart move?</p>
    <button class="quiz-option">Approve it, you can always undo</button>
    <button class="quiz-option">Ask Claude Code to explain what it would do, and ideally do a dry run first</button>
    <button class="quiz-option">Restart your computer</button>
    <button class="quiz-option">Uninstall Claude Code</button>
    <p class="quiz-explain">Claude Code will happily explain any command in plain English, and you can almost always ask for a dry run. Ten seconds of asking beats an hour of regret.</p>
  </div>
  <div class="quiz-q" data-answer="2">
    <p class="quiz-prompt">The one-sentence permissions mental model is:</p>
    <button class="quiz-option">Always approve, always undo</button>
    <button class="quiz-option">Never approve anything you have not written</button>
    <button class="quiz-option">Reading is cheap, writing is cautious, deleting is sacred</button>
    <button class="quiz-option">Lock everything, type everything by hand</button>
    <p class="quiz-explain">Read-only commands are low-risk. Edits deserve a read. Deletes deserve your full attention.</p>
  </div>
</div>

Module 2 is next: [plan mode, and when to use it](/course/advanced/working-with-claude-code/plan-mode).
