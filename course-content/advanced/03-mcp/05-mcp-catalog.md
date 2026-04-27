---
title: "The MCP catalog: 8 more servers worth knowing"
duration: 15
summary: A reference for eight MCP servers beyond Notion, Playwright and Gmail. What each one does best, when it is worth installing, and when it is overkill.
---

You now have the pattern. `/mcp` → add → authenticate → test read → test write. That same flow works for almost any MCP server.

This lesson is a **reference**, not a walkthrough. Eight MCPs worth knowing about, with what each is best at and when it is not the right tool. Add one when you have a real use case for it. Do not install all eight on day one.

## 1. Google Calendar

**What it does:** read, search, create and update events on your Google Calendar.

**Best for:**
- "What am I doing on Thursday?"
- "Block 2 hours tomorrow morning for focused work."
- "Read my calendar for next week and tell me where I have gaps longer than 90 minutes."

**Pair it with Gmail** and you unlock the single best inbox workflow there is: "find the email from [client] about [project], propose three meeting slots next week that work with my calendar, and draft a reply offering them."

**Install:** `/mcp` → add → **Google Calendar**. OAuth, same pattern as Gmail.

**Watch out for:** shared calendars. Claude Code will only see what your account has access to. If you manage a shared team calendar, connect the team Google account specifically.

## 2. Google Drive

**What it does:** search, read, and create files in your Drive. Great for Docs and Sheets.

**Best for:**
- "Find every document that mentions [topic] and summarise what the latest says."
- "Read last month's sales sheet and pull the top 5 clients by revenue."
- "Create a new Doc in the Meeting notes folder for today's team sync with these sections."

**Install:** `/mcp` → add → **Google Drive**. OAuth.

**Watch out for:** large spreadsheets. Claude Code can read them, but token limits kick in fast. For huge sheets, export a subset first, or use a dedicated database MCP.

## 3. Slack

**What it does:** search, read, post to Slack channels and DMs.

**Best for:**
- "What did the team decide about the launch date last week?"
- "Summarise all unread messages in the product channel from yesterday."
- "Post a summary of this week's shipping progress to #general, formatted nicely."

**Install:** `/mcp` → add → **Slack**. Needs a Slack workspace admin to install the integration if you are on a work Slack.

**Watch out for:** cross-channel noise. Be specific about which channel you want searched, or Claude Code will scan the lot and burn through tokens.

<div class="callout callout-tip">
  <span class="callout-icon">💡</span>
  <div>
    <strong>The killer Slack + Gmail combo.</strong> Ask Claude Code to "cross-reference this week's Slack messages with my email, and tell me anything I was asked to do that is not yet on my calendar or in my task list". That is a personal chief of staff, for free.
  </div>
</div>

## 4. Filesystem

**What it does:** read and write files in a specific folder on your computer.

**Best for:**
- "Read every invoice PDF in my Invoices folder and give me a running total by month."
- "Look at this Word doc and summarise the action items."
- "Create a folder called Week 16, and inside it make empty docs for Monday through Friday."

**Install:** `/mcp` → add → **Filesystem**. You pick which folders Claude can see.

**Watch out for:** scope. **Only** grant access to the folder you actually need. Never the whole home directory. The filesystem MCP can be genuinely dangerous if pointed at the wrong place, because it can delete.

<div class="callout callout-warning">
  <span class="callout-icon">⚠️</span>
  <div>
    <strong>Filesystem MCP scope rule.</strong> One project folder. Always. Never your whole Desktop. Never your Documents folder. Never your home directory. The MCP has the same power your user account does, which means it can overwrite a file you care about.
  </div>
</div>

## 5. Stripe

**What it does:** query your Stripe account for payments, subscriptions, customers, and revenue data. Read-only by default.

**Best for:**
- "What was our MRR at the end of last month?"
- "Show me the five biggest refunds in the last 90 days."
- "Which customers have failed payments in the last week?"

**Install:** `/mcp` → add → **Stripe**. Paste your Stripe API key. Use a **restricted key with read-only permissions** for your first month.

**Watch out for:** anything that writes. Creating payments, refunds, or subscriptions via MCP is possible, but it is live money. Keep the key read-only until you have a strong reason to change it.

## 6. HubSpot

**What it does:** read and update contacts, deals, and tasks in your HubSpot CRM.

**Best for:**
- "Summarise every deal at the Proposal stage and tell me which have not had contact in 14 days."
- "Find the contact record for john@example.com, add a note with today's call summary."
- "Give me a list of all contacts that signed up in the last 30 days and group them by source."

**Install:** `/mcp` → add → **HubSpot**. OAuth.

**Watch out for:** reporting. Claude Code is great for one-off queries, but if you need the same report weekly, build it as a proper HubSpot dashboard once rather than asking Claude Code every Monday.

## 7. Linear

**What it does:** read, create, and update issues in Linear. The engineering team's task tracker.

**Best for:** software teams.
- "Create a Linear issue under the Growth project for 'Audit homepage conversion rate'."
- "List every issue assigned to me that is in progress."
- "Summarise what the team shipped last sprint."

**Install:** `/mcp` → add → **Linear**. OAuth.

**Watch out for:** if you are not a software team, this one is not for you. Jira, Asana, and Trello all have MCPs too. Same pattern, different names.

## 8. Airtable

**What it does:** read and write Airtable bases. Perfect for the many small businesses that use Airtable as a lightweight database.

**Best for:**
- "Read the Clients base, find every entry without an assigned account manager, and add me to those rows."
- "For each row in the Orders table with status 'Pending', draft a follow-up email."
- "Summarise this week's entries in the Feedback table into three themes."

**Install:** `/mcp` → add → **Airtable**. API key.

**Watch out for:** bulk updates. If you ask Claude Code to "update all rows where X", check the preview before approving. Bulk edits are hard to undo.

## Where to find more MCPs

New MCP servers appear every week. The best places to browse:

- **The official MCP servers list** at `modelcontextprotocol.io/examples`. Anthropic and the community keep this up to date.
- **The `/mcp` command inside Claude Code.** The search function pulls from the same registry, and tells you at a glance which servers are most popular.
- **GitHub search for "MCP server".** Useful for niche tools (your CMS, your analytics platform, your industry-specific SaaS).

<div class="callout callout-try">
  <span class="callout-icon">⚡</span>
  <div>
    <strong>Try this now.</strong> Of the eight MCPs above, pick the one that would save you the most time if you connected it this week. Install it. Run one read query. Run one write (in draft or preview mode where possible).
    <p>Do not install the other seven. Wait until a real task makes you want one.</p>
  </div>
</div>

## The rule of one

If you take one thing from this catalog, take this.

**Do not install MCPs speculatively.** They are a bit like apps on your phone. If you install all of them the day you get a new phone, you end up with a cluttered mess and no sense of which ones you actually use.

Instead, whenever you catch yourself doing a repetitive task across tools, ask: "is there an MCP that would let Claude Code do this for me?". Install it at that moment, when the motivation is fresh and the use case is clear. You will end up with three or four MCPs that genuinely save you hours every week, not twenty you installed once and never touched again.

<div class="quiz" data-quiz-title="Quick check">
  <div class="quiz-q" data-answer="2">
    <p class="quiz-prompt">What is the strongest pairing of MCPs for day-to-day productivity?</p>
    <button class="quiz-option">Stripe and Linear</button>
    <button class="quiz-option">Filesystem and Airtable</button>
    <button class="quiz-option">Gmail and Google Calendar</button>
    <button class="quiz-option">Slack and HubSpot</button>
    <p class="quiz-explain">Gmail + Calendar is the sweet spot. Reading the email, proposing slots that match your calendar, and drafting the reply is the single workflow that saves the most time for most people.</p>
  </div>
  <div class="quiz-q" data-answer="1">
    <p class="quiz-prompt">What is the sensible scope rule for Filesystem MCP?</p>
    <button class="quiz-option">Grant it access to your entire home directory on day one</button>
    <button class="quiz-option">Grant it one project folder, and only expand later when you need to</button>
    <button class="quiz-option">Grant it your Documents folder</button>
    <button class="quiz-option">Grant it your Downloads folder</button>
    <p class="quiz-explain">Filesystem MCP has the same destructive power as your user account. Start with one narrow folder. Broader access is never worth the risk.</p>
  </div>
  <div class="quiz-q" data-answer="0">
    <p class="quiz-prompt">What is the "rule of one" for installing MCP servers?</p>
    <button class="quiz-option">Install one MCP at a time, when you have a real use case. Do not install speculatively.</button>
    <button class="quiz-option">Install exactly one MCP and never install another</button>
    <button class="quiz-option">Install all of them on day one so you never need to come back</button>
    <button class="quiz-option">Only use one MCP per week</button>
    <p class="quiz-explain">Speculative installs lead to clutter and wasted setup time. Add an MCP the moment a real task makes you want one.</p>
  </div>
</div>

That is the MCP module. You have the pattern for any server, a browser for any website, an inbox reader for your email, and a shortlist of the most useful next steps.

Next up, Module 4: **agents**. When it is right to hand a whole job off to Claude Code, and when it is not.

Next: [what makes a good agent task](/course/advanced/agents/good-agent-tasks).
