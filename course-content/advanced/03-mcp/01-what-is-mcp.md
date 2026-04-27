---
title: What is MCP? The universal connector, explained
duration: 8
summary: The one protocol that lets any AI talk to any tool. MCP in plain English, with real examples.
---

You now have Claude Code running on your files. That alone is valuable. The next step is letting it talk to your **tools**. Your Notion workspace, your Gmail, your calendar, your GitHub, your CRM.

The piece of plumbing that makes that possible is called **MCP**. This lesson explains what it is, why it matters, and why it became the standard almost overnight.

## The short version

**MCP stands for Model Context Protocol.** Anthropic created it in late 2024 and released it as open. Within months, OpenAI, Google, and every major AI client had adopted it.

Think of it as a **universal adapter**. Before MCP, every AI had to be custom-built to talk to each tool. After MCP, any AI that speaks it can plug into any tool that speaks it, the same way a USB-C cable can charge your laptop, your phone, and your headphones.

<div class="callout callout-tip">
  <span class="callout-icon">💡</span>
  <div>
    <strong>The USB analogy.</strong> Thirty years ago, every device had its own cable. A printer used a parallel cable, a mouse used PS/2, a monitor used VGA. USB replaced all of them with one shape of plug. MCP is doing the same thing for AI tools.
  </div>
</div>

## What problem MCP actually solves

Before MCP, if you wanted your AI to read your Gmail, someone had to write a custom Gmail plugin for that specific AI. Then a custom Notion plugin. Then a custom Calendar plugin. Every tool you added was weeks of engineering, and if you switched AI, you started again.

After MCP, the flow looks like this:

1. Gmail publishes one **MCP server**.
2. Any AI client (Claude, ChatGPT, Cursor, Zed, and others) can talk to that server.
3. The AI now has Gmail. You did not wait for your AI vendor to build it.

The result is an ecosystem that grows on its own. At the time of writing there are public MCP servers for Notion, Gmail, Google Calendar, Google Drive, GitHub, Slack, Stripe, Figma, Playwright (browser control), Linear, Asana, Supabase, and dozens more. New ones appear every week.

## What an MCP server actually does

In plain English, an MCP server is a small program that **exposes tools**.

"Tools" in this context means things the AI can do on your behalf. For the Notion MCP server, the tools are:

- Search pages.
- Read a page.
- Create a new page.
- Update a page.
- Add a comment.

When Claude Code is connected to the Notion MCP server, it can pick any of those tools on your behalf, filling in the right parameters (the page title, the content, the location).

<div class="callout callout-example">
  <span class="callout-icon">🎯</span>
  <div>
    <strong>A concrete example.</strong> You say to Claude Code: "create a meeting notes page in Notion under the Projects folder, called 'April 21 team sync', with this agenda."
    <p>Claude Code looks at its available Notion tools, sees <strong>create-page</strong> and <strong>search-folder</strong>, figures out it needs the Projects folder's ID, finds it with search, then calls create-page with the right parameters. You get a Notion notification. Done.</p>
    <p>You never had to touch Notion, and Anthropic never had to build a Notion integration.</p>
  </div>
</div>

## What MCP is not

Three quick clarifications, because the name sounds more technical than it is.

**MCP is not a product.** You do not "buy MCP". It is a standard, the same way HTTP is a standard for websites.

**MCP is not Anthropic-only.** Anthropic invented it, but gave it away as open source. Any AI can use it. Any developer can publish a server.

**MCP is not a cloud service.** An MCP server runs wherever you want. Some are cloud-hosted by the tool vendor (Notion's official server is). Some run on your own computer. Some are tiny scripts you write yourself.

## Why this changes the game

Three things become true at once.

1. **Any tool you use gets AI.** If the vendor ships an MCP server (or someone else does), your AI can talk to it.
2. **You are not locked into one AI.** The same MCP servers work with Claude, ChatGPT, Cursor, and any other client that speaks MCP. Your tools are portable.
3. **Small teams can build real integrations fast.** A working MCP server is a few hundred lines of code. Weekend projects now deliver what used to need a team.

<div class="callout callout-scenario">
  <span class="callout-icon">🎬</span>
  <div>
    <strong>Scenario: the one-person business.</strong>
    <p>A freelance consultant connects Claude Code to Gmail, Calendar, Notion, and Stripe via MCP. From her terminal, she can say: "find last week's invoices from Stripe, draft a reminder email to anyone overdue, add a follow-up task in Notion for Monday, and put a 15-minute call on my calendar for the two biggest accounts."</p>
    <p>A single prompt. Four tools. No copy-paste. This is the unlock that MCP provides.</p>
  </div>
</div>

## Where MCP servers live

Three common places.

1. **The tool vendor publishes one.** Notion, GitHub, Linear, and many others ship official servers. Usually the safest and most up-to-date option.
2. **A community server exists.** Lots of open-source MCP servers for tools that have no official version yet. Quality varies.
3. **You build your own.** If you have an internal tool or a spreadsheet workflow, you can wrap it in MCP in a few hours. Out of scope for this lesson, but worth knowing.

A growing directory of available MCP servers is linked from the [Anthropic MCP docs](https://modelcontextprotocol.io). You can also install servers directly from Claude's settings once you know the name.

## What is next

The next lesson walks you through connecting your first MCP server (Notion) and running a real task through it. You will finish with your AI actually creating pages in your workspace on your behalf.

After that, this module is **early access** while we add lessons on Gmail, Calendar, GitHub, and building your own MCP server. More coming soon.

<div class="quiz" data-quiz-title="Quick check">
  <div class="quiz-q" data-answer="1">
    <p class="quiz-prompt">MCP is most like which of these?</p>
    <button class="quiz-option">A chat app you install</button>
    <button class="quiz-option">A universal adapter (like USB) that lets any AI talk to any tool</button>
    <button class="quiz-option">A subscription service from Anthropic</button>
    <button class="quiz-option">A programming language</button>
    <p class="quiz-explain">MCP is an open standard. The AI and the tool both speak it, which means they can connect without a custom integration every time.</p>
  </div>
  <div class="quiz-q" data-answer="2">
    <p class="quiz-prompt">Who can use MCP servers?</p>
    <button class="quiz-option">Only Claude users</button>
    <button class="quiz-option">Only paying enterprise customers</button>
    <button class="quiz-option">Any AI client that speaks MCP (Claude, ChatGPT, Cursor, etc.)</button>
    <button class="quiz-option">Only developers with a special licence</button>
    <p class="quiz-explain">MCP is open. Anthropic created it, but any AI can adopt it, and most of the big ones have.</p>
  </div>
  <div class="quiz-q" data-answer="0">
    <p class="quiz-prompt">What does a single MCP server expose to the AI?</p>
    <button class="quiz-option">A set of tools the AI can use (like search-page, create-page, send-email)</button>
    <button class="quiz-option">A copy of the AI model itself</button>
    <button class="quiz-option">Your entire hard drive</button>
    <button class="quiz-option">A chat interface for users</button>
    <p class="quiz-explain">Think of an MCP server as a menu of specific actions. The AI picks the right one for the job and fills in the blanks.</p>
  </div>
</div>

Next: [adding your first MCP server, Notion](/course/advanced/mcp/adding-notion-mcp).
