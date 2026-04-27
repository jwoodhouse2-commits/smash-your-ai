---
title: What Claude Code actually is (and isn't)
duration: 8
summary: Claude Code is not a chatbot. It is an AI that lives in your terminal, reads your files, and does real work. Here is the plain-English version.
---

Up to now the AI you have used has been a tab in your browser. You type, it replies, you copy and paste. Useful, but always one step removed from the real work.

Claude Code is different. It runs in your **terminal** (the black-window app on your computer), reads your actual files, edits them, runs commands, and gets real work done without you having to copy anything in or out.

That is a big shift. This lesson explains what Claude Code is, what it is not, and when it earns its keep.

## What Claude Code actually is

A simple way to think about it: Claude with hands.

The chatbot you know (at claude.ai or chatgpt.com) can only talk. Claude Code can:

- **Read** any file on your computer that you point it at.
- **Write** new files, or edit existing ones.
- **Run** commands in your terminal (installing software, running scripts, moving files).
- **Use tools** through MCP servers (more on those in the next module). Notion, Gmail, Calendar, GitHub, and many more.

It still asks your permission before doing anything that changes something. You are always in charge.

<div class="callout callout-tip">
  <span class="callout-icon">💡</span>
  <div>
    <strong>Picture this.</strong> You drag a messy folder of 200 customer invoices onto your desktop. In a chatbot, you would have to copy each file in one at a time. With Claude Code, you tell it "rename these so the date is at the start of each filename, and move anything from 2024 into a sub-folder called Archive." It reads the folder, asks "shall I rename and move these 200 files?", you say yes, and it is done.
  </div>
</div>

## What Claude Code is NOT

Three common misunderstandings to clear up early.

**It is not only for software developers.** Claude Code was built for coding, which is why it lives in a terminal, but it is just as good at admin, spreadsheet work, research, and writing. If you can describe what you want, Claude Code can usually do it.

**It is not a faster way to chat.** For a quick question like "what year did the euro launch?", the normal Claude or ChatGPT app is faster. Claude Code pays off when the job involves your actual files.

**It is not autopilot.** Claude Code is powerful precisely because it can edit and run things. That power comes with responsibility. It will ask before it does anything risky, and you should usually read what it is about to do before saying yes. More on this in lesson 1.4.

## When Claude Code earns its keep

Jobs where Claude Code is much better than a chatbot:

- **Bulk admin.** Renaming, reorganising, deduplicating files. Bulk edits across a folder of documents.
- **Research with real sources.** Reading a folder of PDFs and summarising them, or pulling quotes from them with real page references.
- **Writing with context.** Editing your blog posts, your CV, or your course notes in the file, without copy-paste.
- **Spreadsheet work.** Cleaning CSV files, merging sheets, running calculations, fixing date formats.
- **Small coding tasks.** Writing a Python script to automate something, even if you do not know Python.
- **Connecting your tools.** With MCP, Claude Code can reach into Notion, Gmail, GitHub, your calendar, and more.

Jobs where a chatbot is still fine:

- Quick questions with no file involved.
- Brainstorming.
- One-off emails or paragraphs.
- Anything you would happily do in a single browser tab.

Rule of thumb: **if the job involves more than three files, or any folder you want to keep tidy afterwards, reach for Claude Code**.

## What running it feels like

You open your terminal. You type `claude`. A prompt appears. You type what you want in plain English, exactly like you would to ChatGPT.

```
> summarise the three PDFs in this folder into one page

I'll read the three PDFs and summarise them. Proceeding.

[reads Report-2024.pdf]
[reads Q1-Notes.pdf]
[reads Client-Brief.pdf]

Here is the summary...
```

No special syntax. No coding. Just English, and files.

<div class="callout callout-scenario">
  <span class="callout-icon">🎬</span>
  <div>
    <strong>Scenario: month-end invoicing.</strong>
    <p>End of the month. You have a folder of receipts, a spreadsheet of clients, and you need an invoice out to each by Friday. In a chatbot, this would be 40 minutes of copy-paste per client. In Claude Code, you say "for every client in clients.csv, create an invoice in the Invoices folder using the template invoice-template.docx, filling in the hours from timesheet-april.csv." It reads the three files, shows you the plan, asks permission, generates all 12 invoices, and you are done in four minutes.</p>
  </div>
</div>

## Is this for me?

If any of these feel familiar, yes.

- You have a repetitive admin job you dread.
- You spend time moving data between tools.
- You write a lot and keep your work in files, not just in email threads.
- You have ever thought "I wish I could just tell the computer what I want".

If you just want to chat with an AI occasionally, Claude Code is probably overkill and the normal apps are fine.

<div class="callout callout-warning">
  <span class="callout-icon">⚠️</span>
  <div>
    <strong>A fair warning.</strong> Claude Code is powerful. That also means it can do damage if you are careless. Never auto-approve file deletions. Always check what it is about to do before saying yes. We cover the safety model properly in lesson 1.4 of this module.
  </div>
</div>

## What is next

The rest of this module gets you from "I read an interesting lesson" to "Claude Code is installed and I have done real work with it".

- **Lesson 1.2** installs Claude Code on your computer.
- **Lesson 1.3** walks you through three first commands to try.
- **Lesson 1.4** explains the safety model so you can let Claude Code do more with confidence.

<div class="quiz" data-quiz-title="Quick check">
  <div class="quiz-q" data-answer="2">
    <p class="quiz-prompt">Which is the clearest summary of what Claude Code is?</p>
    <button class="quiz-option">A new chatbot that replaces claude.ai</button>
    <button class="quiz-option">A tool only professional software developers can use</button>
    <button class="quiz-option">Claude with the ability to read, edit, and run things on your computer</button>
    <button class="quiz-option">An app that schedules AI tasks automatically with no oversight</button>
    <p class="quiz-explain">Claude Code is Claude with hands. It can read your files, edit them, and run commands, always with your permission. It does not replace claude.ai; the two are different products for different jobs.</p>
  </div>
  <div class="quiz-q" data-answer="1">
    <p class="quiz-prompt">Which job is Claude Code most worth reaching for?</p>
    <button class="quiz-option">Asking what year the euro launched</button>
    <button class="quiz-option">Renaming and tidying a folder of 200 receipts</button>
    <button class="quiz-option">Brainstorming three slogan options for a new product</button>
    <button class="quiz-option">Drafting a single follow-up email</button>
    <p class="quiz-explain">Once the job involves a folder of files and repetitive admin, Claude Code pulls away from a chatbot. The others are fine in a normal chat.</p>
  </div>
  <div class="quiz-q" data-answer="0">
    <p class="quiz-prompt">True or false: Claude Code will edit your files without asking.</p>
    <button class="quiz-option">False. It asks permission first, every time.</button>
    <button class="quiz-option">True. That is the whole point.</button>
    <button class="quiz-option">True, but only if you are logged in.</button>
    <button class="quiz-option">False, but only if you switch on safe mode.</button>
    <p class="quiz-explain">Claude Code always asks before it writes, edits, or runs something. You can loosen this once you trust it for specific tasks, but the default is safe.</p>
  </div>
</div>

Ready to install it? [Lesson 1.2 is here](/course/advanced/claude-code/installing-claude-code).
