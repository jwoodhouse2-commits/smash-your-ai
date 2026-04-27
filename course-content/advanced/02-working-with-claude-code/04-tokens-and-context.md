---
title: Tokens, context, and not burning through your plan
duration: 9
summary: A practical guide to how Claude Code uses its context window, why you hit limits, and what to do about it.
---

Every Claude Code user eventually runs into the same three experiences. The session feels sluggish. The answers get worse. A banner pops up saying you have used most of your allowance.

All three have the same root cause, and the same small set of fixes. This lesson covers both.

## The short version

Claude Code has a **context window**, a limited amount of text it can hold in its head at once. Everything it reads (your prompts, the files it opens, its own replies) counts toward that limit.

You have two budgets to care about.

1. **The context window in a single session.** Like the RAM on a computer. Fills up, gets slow, eventually refuses new work until you clear it.
2. **Your monthly plan or API allowance.** Like your phone data. Top up or wait for reset.

Manage both and you will never have a surprise.

## Tokens in 90 seconds

A **token** is a rough unit of text. Very roughly: **one token ≈ 4 characters of English, or about 0.75 of a word.** A page of writing is usually 400 to 600 tokens. A code file can be thousands.

Claude's context window in Claude Code is very large (hundreds of thousands of tokens) but not infinite. And every token you fill the window with counts toward your plan usage.

You do not need to count tokens manually. You just need to understand what fills them up.

## What actually fills your context

Four common culprits, ordered by how often they bite.

### 1. Reading huge files (the biggest one)

When you ask Claude Code to look at a folder, it often reads dozens of files. A CSV with 10,000 rows can be 50,000 tokens on its own. A whole Python project can be a couple of hundred thousand.

**Fix:** be specific about what you want Claude to read. Instead of "look at this project", say "read just README.md and main.py". Claude Code is very good at deciding what to read; it is also polite and will read what you ask for.

### 2. Long, rambling conversations

The longer the conversation, the more Claude has to carry in its head each turn. After 40 or 50 back-and-forth messages, the context is heavy even if none of the individual exchanges were large.

**Fix:** `/clear` between unrelated tasks, `/compact` within a long single task.

### 3. Pasting big blocks of text

Pasting a 20-page document into the prompt adds 8,000+ tokens in one go.

**Fix:** save it as a file and ask Claude to read the file instead. Same information, better handled.

### 4. Large tool outputs from MCP

If an MCP server returns a gigantic response (e.g. "search Notion for 'meeting'" that returns 200 pages), all of that lands in context.

**Fix:** be specific in MCP calls. Ask for summaries or first-N results, not "all of them".

<div class="callout callout-tip">
  <span class="callout-icon">💡</span>
  <div>
    <strong>A useful mental model.</strong> Treat context like a whiteboard at a meeting. Fresh and organised at the start, scribbled over by the end. You clear the whiteboard between agenda items. You do not try to run a whole day from one sheet.
  </div>
</div>

## Your plan limits in plain English

Two pricing routes most people take.

**Claude Pro (£15 or £20/month).** Fixed message limits over a 5-hour window, plus a weekly cap. If you blast through a lot of work, you can hit the 5-hour cap and be asked to wait a couple of hours. The weekly cap is generous for most one-person users.

**API key (pay as you go).** You pay per token. No hard limits, but your bill grows with usage. For normal Claude Code use the numbers are small. Leave too many big files open in context and it adds up.

Check usage with `/cost` at any time.

## The five habits that extend any plan

1. **`/clear` between tasks.** Single best habit.
2. **Ask Claude Code to read specific files, not "the project".**
3. **Use `/compact` inside long single-task sessions** when the conversation is piling up.
4. **Prefer files over pasted text.** "Read notes.md" is cheaper than pasting notes.md into the chat.
5. **For bulk searches, use subagents.** If you need to search a massive codebase, spin up a subagent for the search (we cover this in Module 4). The subagent runs on its own context and only returns the answer to yours.

<div class="callout callout-example">
  <span class="callout-icon">🎯</span>
  <div>
    <strong>Before and after, same task.</strong>
    <p><strong>Wasteful:</strong> "Read this whole folder of 80 blog posts, then tell me which ones mention our new pricing, then also suggest headline tweaks, then write a tweet for each." A single giant conversation, 80 files in context, one huge final reply.</p>
    <p><strong>Lean:</strong> Ask Claude Code to first produce a filtered list of posts mentioning pricing (saved to a file). <code>/clear</code>. New task: "for each post in pricing-posts.txt, suggest a headline." <code>/clear</code>. New task: "for each post in pricing-posts.txt, write one tweet." Three focused sessions, context stays fresh.</p>
    <p>Same outcome. A fraction of the tokens, and the quality of each reply is measurably better.</p>
  </div>
</div>

## Picking the right model

If you use an API key, you can switch models with `/model`. The short version:

- **Claude Opus** for hard thinking, ambiguous tasks, one-shot writing where quality matters.
- **Claude Sonnet** is the sensible default for most work.
- **Claude Haiku** for cheap, fast, routine tasks (renaming files, simple summaries, quick searches).

Moving work to Haiku for straightforward admin can extend a pay-as-you-go budget by many multiples.

<div class="callout callout-scenario">
  <span class="callout-icon">🎬</span>
  <div>
    <strong>A real usage pattern.</strong>
    <p>A one-person business uses Claude Opus for a weekly planning session (one high-quality chat). For day-to-day admin, cleaning up CSVs, renaming files, sending templated emails, they switch to Haiku with <code>/model</code>. Same Claude Code. Monthly bill is about £4 on API credits, plus the Pro sub for the planning work. Nobody is being clever; they just use the right tool for the job.</p>
  </div>
</div>

<div class="callout callout-try">
  <span class="callout-icon">⚡</span>
  <div>
    <strong>Try this now.</strong> Open Claude Code in a project you have used for a while. Run <code>/cost</code>. Then <code>/clear</code>. Then ask one small focused question. Check <code>/cost</code> again. You will see how cheap a fresh, scoped conversation is compared with the long one it replaced.
  </div>
</div>

<div class="quiz" data-quiz-title="Quick check">
  <div class="quiz-q" data-answer="1">
    <p class="quiz-prompt">What is the single biggest habit for staying within your plan?</p>
    <button class="quiz-option">Always use Opus</button>
    <button class="quiz-option">Run <code>/clear</code> between unrelated tasks</button>
    <button class="quiz-option">Paste full files into the prompt so Claude does not need to read them</button>
    <button class="quiz-option">Avoid using MCP servers</button>
    <p class="quiz-explain">Short, focused conversations are dramatically cheaper and give better answers than one long rambling session.</p>
  </div>
  <div class="quiz-q" data-answer="2">
    <p class="quiz-prompt">You are on an API key and want to do a lot of simple renames. Which model should you switch to?</p>
    <button class="quiz-option">Opus</button>
    <button class="quiz-option">Sonnet</button>
    <button class="quiz-option">Haiku</button>
    <button class="quiz-option">Whichever is slowest</button>
    <p class="quiz-explain">Haiku is fastest and cheapest. For routine, well-specified tasks, it is more than capable and saves you a lot.</p>
  </div>
  <div class="quiz-q" data-answer="0">
    <p class="quiz-prompt">Context is filling up on a long task you do not want to restart. What do you run?</p>
    <button class="quiz-option">/compact</button>
    <button class="quiz-option">/clear</button>
    <button class="quiz-option">/init</button>
    <button class="quiz-option">/bug</button>
    <p class="quiz-explain"><code>/compact</code> summarises and keeps the thread going. <code>/clear</code> would throw away useful context.</p>
  </div>
</div>

Next: [writing prompts that get Claude Code to do the right thing](/course/advanced/working-with-claude-code/writing-prompts).
