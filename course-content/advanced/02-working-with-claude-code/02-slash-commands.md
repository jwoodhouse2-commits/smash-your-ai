---
title: The slash commands you will actually use
duration: 10
summary: Claude Code has a lot of slash commands. You only need eight of them for everyday work. Here they are, in a table.
---

Type `/` inside Claude Code and a menu appears. There are a lot. You do not need most of them.

This lesson covers the eight slash commands that earn their keep in real use. Learn these and you can ignore the rest until you need them.

## The eight you will use

| Command | What it does | When to reach for it |
|---|---|---|
| `/help` | Shows the full list of commands in your version. | First week. When you cannot remember a command's exact spelling. |
| `/init` | Creates a `CLAUDE.md` file in the current folder summarising the project. | First time you open a new project with Claude Code. Gives it persistent context. |
| `/clear` | Wipes the current conversation and starts fresh, keeping your project context. | When a task is finished and you are about to start a different one. |
| `/compact` | Summarises the current conversation so far, freeing up context without losing the thread. | Long sessions where the context is getting heavy. |
| `/mcp` | Opens the MCP server menu. Add, remove, or check the status of connected tools. | Installing Notion, Gmail, GitHub, or any other MCP. |
| `/cost` | Shows how much the current session has spent (API key users) or how far through your plan you are (Pro users). | Any time you want a sanity check on usage. |
| `/model` | Switches between models (Opus, Sonnet, Haiku). | When you want more power for a hard task, or less cost for a simple one. |
| `/permissions` | Lists and edits your "always allow" rules from lesson 1.4. | When you want to grant or revoke standing permission for a command. |

## Why these eight

Day-to-day Claude Code use rhymes with this pattern:

1. **Start a session.** Run `claude`. Optionally `/init` if this is a new project.
2. **Do focused work.** One task per conversation.
3. **Clean up.** `/clear` before starting the next unrelated task. `/compact` if the same task is running long.
4. **Check usage.** `/cost` if you want to know where you are.
5. **Tune tools.** `/mcp` to add a server. `/permissions` when you want standing permission for a frequent command.
6. **Change model.** `/model` when you need more firepower (Opus) or want cheaper draft-level help (Haiku or Sonnet).

Almost every other slash command is for edge cases you will meet eventually and can Google at the time.

## The three common mistakes

### 1. Keeping one giant conversation going

The single most common habit to fix. Claude Code is at its best when each conversation covers **one task**. If you have been in the same session for an hour across five unrelated jobs, context becomes crowded and answers degrade.

**Fix:** `/clear` between unrelated tasks. Think of it like closing and reopening a document.

### 2. Never running `/compact`

The opposite problem. You are halfway through a long, legitimate task and the context is filling up. Instead of clearing (which would lose the thread) or starting over, use `/compact`. Claude will summarise the conversation so far and continue with fresh breathing room.

### 3. Not using `/init`

If you work on the same project for more than a single session, run `/init` once. It reads through the project and writes a `CLAUDE.md` file in the root with a short summary. From that point on, every future session automatically has context about the project. We cover `CLAUDE.md` properly in the next lesson.

<div class="callout callout-tip">
  <span class="callout-icon">💡</span>
  <div>
    <strong>Keyboard shortcut for <code>/clear</code>.</strong> You can also press <code>Ctrl + K</code> (or <code>Cmd + K</code> on macOS) to clear the conversation. Handy once you do it a lot.
  </div>
</div>

## Commands worth knowing about, for later

You will eventually meet these. Skip until you need them.

| Command | What it does |
|---|---|
| `/resume` | Reopens a previous conversation. Useful if you quit Claude Code mid-task. |
| `/memory` | Edits your personal notes Claude Code uses across sessions (things like "I always want British spellings"). |
| `/hooks` | Configures automated actions ("every time Claude finishes, run the tests"). |
| `/doctor` | Runs a diagnostic when something is misbehaving. |
| `/bug` | Files a bug report to Anthropic. |
| `/add-dir` | Extends the workspace to include another folder outside your current directory. |
| `/review` | Kicks off a code review on the current changes. |

Full list via `/help`.

<div class="callout callout-example">
  <span class="callout-icon">🎯</span>
  <div>
    <strong>A realistic session.</strong>
    <pre><code>$ claude
> /init
(Claude reads the project and writes CLAUDE.md)

> summarise the three spreadsheets in /data and find any duplicates
(long answer)

> /clear
(fresh context, same project)

> draft a reply to the email in inbox.txt
(short answer)

> /cost
You have used 22 of 200 messages in this 5-hour window.

> /mcp
(add Notion)</code></pre>
    <p>Four commands, three tasks, under ten minutes. This is what daily use looks like.</p>
  </div>
</div>

<div class="callout callout-try">
  <span class="callout-icon">⚡</span>
  <div>
    <strong>Try this now.</strong> Open Claude Code. Type <code>/help</code> and skim the list. Then type <code>/cost</code> to see your current usage. Finally type <code>/clear</code> and start fresh.
    <p>You have used three of the eight in two minutes. The rest follow naturally once tasks come up that need them.</p>
  </div>
</div>

<div class="quiz" data-quiz-title="Quick check">
  <div class="quiz-q" data-answer="2">
    <p class="quiz-prompt">Your conversation is getting long, but you want to keep going on the same task. What should you run?</p>
    <button class="quiz-option">/clear</button>
    <button class="quiz-option">/init</button>
    <button class="quiz-option">/compact</button>
    <button class="quiz-option">/model</button>
    <p class="quiz-explain"><code>/compact</code> summarises what has happened so far without losing the thread. <code>/clear</code> would throw away context you still need.</p>
  </div>
  <div class="quiz-q" data-answer="1">
    <p class="quiz-prompt">You are starting work in a new project for the first time. Which command should you run early?</p>
    <button class="quiz-option">/bug</button>
    <button class="quiz-option">/init</button>
    <button class="quiz-option">/resume</button>
    <button class="quiz-option">/doctor</button>
    <p class="quiz-explain"><code>/init</code> produces a <code>CLAUDE.md</code> summary of your project. Every future session then has instant context, saving you repeating yourself.</p>
  </div>
  <div class="quiz-q" data-answer="0">
    <p class="quiz-prompt">You want to check how much of your message allowance you have used. Which command?</p>
    <button class="quiz-option">/cost</button>
    <button class="quiz-option">/model</button>
    <button class="quiz-option">/permissions</button>
    <button class="quiz-option">/help</button>
    <p class="quiz-explain"><code>/cost</code> shows session spend (API key users) or plan usage (Pro users). Sanity check before a long task.</p>
  </div>
</div>

Next: [CLAUDE.md, and how to teach Claude about your project](/course/advanced/working-with-claude-code/claude-md).
