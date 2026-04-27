---
title: Your first three commands
duration: 10
summary: Three real tasks to try in your first ten minutes with Claude Code. You will finish with a working example, not just theory.
---

Claude Code is installed. Now you need to use it on something real, because the difference between "I read about it" and "I can get value out of it" is about fifteen minutes of hands-on practice.

This lesson walks you through three starter tasks. By the end you will have done real work with Claude Code.

Open your terminal, navigate to a folder you want to work in, and type `claude`.

## Command 1: Look around

The easiest first command, and the one that builds your confidence the fastest.

```
what's in this folder and what do you think each file is for?
```

Claude Code will read your folder listing, possibly peek inside a few files, and give you a tidy summary. Something like:

> You have 14 files here. invoice-template.docx looks like a blank invoice template. clients.csv has 23 rows and three columns: name, email, hourly rate. April-timesheets.xlsx has the last month of work...

This single command teaches you several things:

- Claude Code can see your files without you having to upload anything.
- It gives you a fresh pair of eyes on work you have stared at for weeks.
- It asks permission before it opens any individual file.

<div class="callout callout-tip">
  <span class="callout-icon">💡</span>
  <div>
    <strong>Navigate your folders first.</strong> Before typing <code>claude</code>, use <code>cd</code> (change directory) to move into the folder you want to work with. For example, <code>cd ~/Documents/Accounts</code>. Claude Code always works on whichever folder your terminal is pointed at.
  </div>
</div>

## Command 2: Edit a file

Now ask it to change something for you.

Pick a file you have that needs a small, boring fix. A messy CSV. A document with lots of typos. A README you never got round to writing properly. Then ask:

```
open notes.md and tidy it up. fix the typos, add clear headings, and keep all my original content.
```

Claude Code will:

1. Show you a **preview of the changes** before it saves anything.
2. Ask you to approve.
3. Save the edit once you say yes.

The key thing: **it does not edit the file until you approve**. Read the diff carefully. If it has changed something you did not want changed, say no and refine your request.

<div class="callout callout-scenario">
  <span class="callout-icon">🎬</span>
  <div>
    <strong>A real example.</strong> You have a folder of 30 blog drafts. Every one has the wrong author name at the bottom because you pasted from an old template. You ask: "in every .md file in this folder, replace 'by Emily Smith' with 'by James Woodhouse'. Show me which files you are changing before you save."
    <p>Claude Code reads the 30 files, shows you the 30 one-line changes, waits for your yes, and saves them all. Two minutes. That is an hour's work in the old world.</p>
  </div>
</div>

## Command 3: Run something

Claude Code can also run terminal commands on your behalf. That is where it starts to save serious time.

Try a harmless one first:

```
find every PDF in my Downloads folder that was created this year, list their names sorted by size.
```

Claude Code will work out the right terminal command, **show it to you**, ask permission to run it, and then present the result.

You will see something like:

> I'll run: `find ~/Downloads -name "*.pdf" -newermt "2026-01-01" -exec ls -lhS {} \;`
>
> Run this command? (yes/no)

Say yes. You get a tidy list.

Again, the safety pattern is the same: **the AI shows you what it is about to do, and you approve it**.

<div class="callout callout-warning">
  <span class="callout-icon">⚠️</span>
  <div>
    <strong>Do not auto-approve destructive commands.</strong> Anything with <code>rm</code> (delete), <code>mv</code> overwriting files, or <code>sudo</code> in it deserves a second read. When in doubt, ask Claude Code to "show me what this would delete without actually doing it" first. We cover this in the next lesson.
  </div>
</div>

## A combined example: real admin in under five minutes

Pull these three skills together with a single end-to-end task.

```
I have a folder called Receipts full of PDF bank statements. Read them all,
pull out the total spend per month, and make a single CSV called monthly-summary.csv
with two columns: month and total. Show me the first few rows before you save.
```

Claude Code will:

1. Look at the folder (Command 1).
2. Read each PDF, extract totals per month.
3. Generate a CSV and preview it (Command 2).
4. Save it on your approval.

You did not open a single file. You did not copy-paste anything. You told it what you wanted in English.

<div class="callout callout-try">
  <span class="callout-icon">⚡</span>
  <div>
    <strong>Try this now.</strong> Pick a real folder on your computer that has at least five related files. Could be a holiday album, a set of invoices, a folder of job applications, anything.
    <p>Ask Claude Code: "look at this folder and tell me three things I could automate or tidy up with your help."</p>
    <p>Pick whichever of its three suggestions is smallest, and do it together with it. You will have your first "oh, that's useful" moment within ten minutes.</p>
  </div>
</div>

## Three habits to build from day one

1. **Read the preview before you approve.** Claude Code shows you its plan for a reason. A two-second scan saves you from the rare but painful mistake.
2. **Start in a folder you can safely mess up.** Make a test folder with copies of files, not the originals, until you trust it.
3. **If a task feels big, ask Claude Code to plan first.** You can say "plan this out in steps before you do anything" and it will.

## What is next

The last lesson in this module covers the safety model properly. Once you understand it, you can let Claude Code do a lot more without standing over its shoulder, but only in the right places.

<div class="quiz" data-quiz-title="Quick check">
  <div class="quiz-q" data-answer="0">
    <p class="quiz-prompt">When Claude Code is about to edit a file, what happens?</p>
    <button class="quiz-option">It shows you the changes and waits for approval</button>
    <button class="quiz-option">It saves immediately, you can undo later</button>
    <button class="quiz-option">It emails the diff to you for review</button>
    <button class="quiz-option">It creates a copy and leaves the original alone</button>
    <p class="quiz-explain">Claude Code always previews before saving. Reading that diff is the single most important habit to build.</p>
  </div>
  <div class="quiz-q" data-answer="2">
    <p class="quiz-prompt">Claude Code needs to run a terminal command to complete your task. What does it do first?</p>
    <button class="quiz-option">Runs it immediately</button>
    <button class="quiz-option">Emails it to you</button>
    <button class="quiz-option">Shows you the command and asks permission</button>
    <button class="quiz-option">Refuses, because terminal commands are risky</button>
    <p class="quiz-explain">Same safety pattern as with file edits. You see exactly what it wants to run, then decide.</p>
  </div>
  <div class="quiz-q" data-answer="1">
    <p class="quiz-prompt">Which is the best first task on day one?</p>
    <button class="quiz-option">Delete old files from your Downloads folder</button>
    <button class="quiz-option">Ask it to summarise a folder and suggest what it could help with</button>
    <button class="quiz-option">Ask it to install a new operating system</button>
    <button class="quiz-option">Let it run with full permissions and go make a cup of tea</button>
    <p class="quiz-explain">Exploratory, read-only tasks are the safest way to get a feel for what Claude Code sees and can do. Save the riskier stuff for after you have read the next lesson.</p>
  </div>
</div>

Next: [the safety model](/course/advanced/claude-code/safety-model), so you know which tasks to trust Claude Code with and which to review carefully.
