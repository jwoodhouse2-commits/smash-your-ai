---
title: "Playwright MCP: give Claude a browser"
duration: 14
summary: Set up Playwright so Claude can navigate real websites, fill in forms, screenshot pages and pull data. The most visible wow factor of the MCP world.
---

The Notion MCP talks to an **API**. Playwright is different. Playwright gives Claude Code **a real web browser**, and lets it click, type, and navigate the same way you do.

This is the MCP that makes people's jaws drop. You ask Claude Code to "go to my competitor's pricing page, grab the prices, and put them in a table", and you watch it open a browser and do exactly that in front of you.

## What Playwright actually is

Playwright is a browser automation library built by Microsoft. It is the same tool that professional QA teams use to test websites. Point it at a URL and it can:

- Navigate between pages.
- Click buttons and links.
- Fill in forms.
- Take screenshots.
- Read the text of any element on the page.
- Handle logins (with a bit of care).

The **Playwright MCP server** wraps all of that up as tools Claude Code can use on your behalf.

<div class="callout callout-tip">
  <span class="callout-icon">💡</span>
  <div>
    <strong>Why this is different.</strong> Most MCP servers talk to an API behind the scenes. Playwright controls a real Chrome window. That means it works for <em>any</em> site, even ones without an official API. You are essentially lending Claude Code your mouse and keyboard.
  </div>
</div>

## Before you start

You need:

- Claude Code installed and working.
- Chrome or Chromium installed on your machine (Playwright will use it).
- Permission to let a process open browser windows for you. That is you, if you are on your own laptop.

No accounts to create, no auth to fiddle with. Playwright runs locally.

## Step 1: Install the Playwright MCP server

Inside Claude Code, run:

```
/mcp
```

Pick "Add" and search for **Playwright**. The official server is maintained by Microsoft and is usually top of the list.

Install it. Claude Code will download the server and the browser binary it needs (that first install takes a minute or two).

## Step 2: Your first navigation

Try the simplest thing possible:

```
open https://smashyourai.com in a browser and tell me the main headline on the page
```

Claude Code will:

1. Open a Chromium window.
2. Navigate to the URL.
3. Read the page's DOM.
4. Return the headline text.

You will see the browser window appear. This is called **headed mode**. It is perfect while you are learning, because you can watch exactly what Claude is doing.

<div class="callout callout-example">
  <span class="callout-icon">🎯</span>
  <div>
    <strong>Headed vs headless.</strong> Headless mode runs the browser invisibly in the background. It is faster and uses less memory. Use it once you trust the workflow. For now, keep it headed so you can see what is going on.
  </div>
</div>

## Step 3: Pull structured data

This is where Playwright shines. Ask it to turn a messy webpage into neat data.

```
go to the BBC news homepage, find the top 5 headlines in the main story area,
and give them to me as a numbered list with each headline, the category,
and the short description underneath
```

Claude Code will navigate, inspect the page, pick out the right elements, and return them formatted.

This is the task that used to take a developer half a day with custom scraping code. You are now doing it in English, in about fifteen seconds.

## Step 4: Form filling (carefully)

This is where Playwright gets powerful, and where you need to be deliberate.

Ask it to fill a form that is harmless. For example, the search bar on your own website, or a public test form.

```
go to https://smashyourai.com, click into the search, type "AI automation",
and tell me the titles of the first 3 results that come up
```

Watch it click, type, wait, and read. That is a real end-to-end workflow.

<div class="callout callout-warning">
  <span class="callout-icon">⚠️</span>
  <div>
    <strong>Do not let Playwright touch things that cost money or send messages on day one.</strong> Do not ask it to "book my flight" or "post this on LinkedIn" until you have used it on read-only tasks for a week or two. A browser automation can fire off a payment or a public post with no undo button.
  </div>
</div>

## Real-world jobs Playwright is brilliant at

A few patterns James and Paul use regularly:

**Competitor research**
```
visit the pricing pages of these three competitors, grab the price
of their entry-level plan, and give me a comparison table
```

**Content research**
```
find the top 10 blog posts on [competitor blog], pull their titles
and publish dates, and suggest three topics they have not covered
```

**Personal admin**
```
go to my library's booking page, find the next available slot for
meeting room 2, and tell me the earliest morning I could book
```

**Quality check**
```
load my homepage on mobile viewport (375px wide), take a screenshot,
and flag anything that looks squashed or broken
```

<div class="callout callout-try">
  <span class="callout-icon">⚡</span>
  <div>
    <strong>Try this now.</strong> Pick a website you visit at least once a week. A news site, a forum, a shop, a booking page.
    <p>Ask Playwright to pull the piece of information you actually care about into a clean list. Time how long it takes compared with clicking around yourself.</p>
  </div>
</div>

## Common gotchas

Things that surprise people the first week.

**Captchas and bot detection.** Some sites (flight booking, ticket sites, some news sites) actively block automated browsers. Playwright can handle many of them, but not all. If a captcha appears, Claude Code will usually stop and ask for your help.

**Logged-in pages.** Playwright can log in, but you need to tell it your credentials. Never paste passwords directly into the chat. Use your OS keychain or a password manager integration instead. For sensitive accounts (banking, work email), just do the login yourself in the browser window it opened, then tell Claude Code to continue.

**Slow-loading pages.** If a page takes ages to load, Claude Code may read it before the content renders. Ask it to "wait for the main content to load" in your prompt.

**It used a lot of memory.** Browsers are heavy. If your laptop is slow, close the browser window after each job with "close the browser please", or run in headless mode.

## When to use Playwright vs an API MCP

A rule of thumb.

- If the tool has an official MCP (Notion, Gmail, Calendar, Slack), use that. It is faster, more reliable, and more secure.
- If the tool has no MCP but you need to work with it, Playwright is your universal fallback.
- If you need to do something visual (screenshots, layout checks, seeing what a page looks like on different devices), Playwright is the right tool even if an API exists.

<div class="quiz" data-quiz-title="Quick check">
  <div class="quiz-q" data-answer="2">
    <p class="quiz-prompt">What does Playwright MCP give Claude access to?</p>
    <button class="quiz-option">Your operating system files</button>
    <button class="quiz-option">Your email inbox</button>
    <button class="quiz-option">A real web browser that can click, type and read pages</button>
    <button class="quiz-option">A spreadsheet database</button>
    <p class="quiz-explain">Playwright wraps a real Chrome/Chromium browser. That is what makes it a universal fallback for websites with no API.</p>
  </div>
  <div class="quiz-q" data-answer="1">
    <p class="quiz-prompt">When should you use Playwright instead of a tool's official MCP?</p>
    <button class="quiz-option">Always. It is the fastest option.</button>
    <button class="quiz-option">Only when there is no official MCP, or when you need something visual (screenshots, layout checks).</button>
    <button class="quiz-option">Only on Fridays.</button>
    <button class="quiz-option">Only when you are offline.</button>
    <p class="quiz-explain">Official API-based MCPs are faster and more reliable. Save Playwright for sites without an API, and for visual tasks.</p>
  </div>
  <div class="quiz-q" data-answer="0">
    <p class="quiz-prompt">What is the safer way to use Playwright in your first week?</p>
    <button class="quiz-option">Read-only tasks like research and pulling data. Keep the browser in headed mode so you can watch.</button>
    <button class="quiz-option">Let it book flights and post on LinkedIn immediately, you will learn faster.</button>
    <button class="quiz-option">Run it in headless mode straight away.</button>
    <button class="quiz-option">Give it your banking password on day one so it can check your balance.</button>
    <p class="quiz-explain">Watch it work in headed mode, and stick to read-only tasks while you build trust. Destructive actions like payments or public posts can be irreversible.</p>
  </div>
</div>

Next up, Gmail. Your inbox is probably the single highest-leverage place to connect Claude Code.

Next: [Gmail MCP](/course/advanced/mcp/gmail-mcp).
