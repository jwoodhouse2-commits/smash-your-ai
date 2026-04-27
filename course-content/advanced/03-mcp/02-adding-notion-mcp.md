---
title: Adding your first MCP server (Notion)
duration: 12
summary: A hands-on walkthrough. By the end, Claude Code can search, read, and create pages in your Notion workspace on your behalf.
---

Time to connect Claude Code to a real tool. We are using **Notion** because almost everyone has some kind of Notion workspace, and because once you have done this once, adding Gmail, Calendar, or GitHub uses the same pattern.

By the end of this lesson, you will:

1. Have Notion MCP installed.
2. Have Claude Code read one of your Notion pages.
3. Have Claude Code **create** a new Notion page on your behalf.

Total time, around fifteen minutes.

## Before you start

You need:

- Claude Code installed and working (Module 1).
- A Notion account with at least one workspace.
- Permission to install an integration in that workspace. If it is your personal Notion, that is you. If it is a work workspace, you may need an admin.

Open your terminal and start Claude Code with `claude`.

## Step 1: Add the Notion MCP server

Inside Claude Code, type:

```
/mcp
```

You will see a menu of installed MCP servers. Pick "Add" (or "Install new").

Search for **Notion**. You should see the official server, usually listed as `@notionhq/notion-mcp-server` or simply "Notion".

Pick it and confirm. Claude Code will download the server and add it to your configuration.

<div class="callout callout-tip">
  <span class="callout-icon">💡</span>
  <div>
    <strong>Alternative route.</strong> If you prefer to install by hand, you can edit <code>~/.config/claude/mcp_servers.json</code> (on macOS/Linux) and add the Notion server block. The <code>/mcp</code> command just does this for you.
  </div>
</div>

## Step 2: Authenticate

Notion needs to know it is you, so the MCP server will ask you to authenticate.

You will see something like:

> To connect Notion, open this URL in your browser: https://notion.so/...

Open the URL. You will see a normal Notion permission page that says "Allow Claude to access your workspace?". Pick the workspace you want Claude Code to have access to, and tick the pages you want it to see.

**This is important.** Notion lets you **scope** the access. If you only want Claude Code to touch pages inside your "Projects" folder, only tick that folder. It cannot see anything you did not grant access to.

Click **Allow**. The page will redirect, and Claude Code will confirm the connection.

<div class="callout callout-warning">
  <span class="callout-icon">⚠️</span>
  <div>
    <strong>Start small on first connection.</strong> Do not grant Claude Code access to your entire workspace on day one. Give it one test folder with nothing sensitive in it. Expand access later once you trust the workflow.
  </div>
</div>

## Step 3: Test with a read

Ask Claude Code to read a Notion page you can see.

```
find my "April 21 team sync" page in Notion and summarise it in three bullets
```

Claude Code will:

1. Call the Notion MCP server's **search** tool.
2. Find your page.
3. Call the **read** tool.
4. Summarise the content.

You will see something like:

> I'll use Notion's search tool to find "April 21 team sync"...
> Found 1 page. Reading...
>
> - The team agreed to launch the new onboarding flow on 1 May.
> - Sarah is blocked on the legal review from last week.
> - Next meeting moved to Thursday 24 April, 10am.

That is a real end-to-end loop. Your AI, your tool, your content. No copy-paste.

## Step 4: Create a page

Now try a write action.

```
create a new page in Notion, inside the Projects folder, called "Weekly AI experiments".
Add the following sections: Goal, What I'll try, Results. Leave the sections empty for now.
```

Claude Code will ask you to approve the action. Read the preview. If the title, location, and content look right, approve.

Check Notion. The page is there.

<div class="callout callout-example">
  <span class="callout-icon">🎯</span>
  <div>
    <strong>This is the payoff.</strong> You just told an AI, in plain English, to create a structured page in your tool of choice, and it did it in three seconds. No templates to click through. No "new page" button. Just intent, translated to action.
  </div>
</div>

## Step 5: A useful real-world task

Pick something you actually do in Notion and try asking Claude Code to do it instead. A few ideas you can copy straight in:

```
look at my "Weekly planning" page in Notion, read the last 4 weekly entries,
and tell me three patterns in what I've said is slowing me down.
```

```
search Notion for any page that mentions "podcast guest", pull out the
names and contact details, and put them in a single summary page called
"Podcast guest shortlist".
```

```
every Monday morning, I want a blank "week ahead" page in my Personal folder
with five sections: Top goal, Key meetings, Commitments, Personal, Reflections.
Create the one for this week.
```

The more specific you are about the folder, the better the result.

<div class="callout callout-try">
  <span class="callout-icon">⚡</span>
  <div>
    <strong>Try this now.</strong> Take one regular Notion chore you do every week. Writing a status update, logging a habit, prepping for a meeting.
    <p>Ask Claude Code to do one version of it for you, end to end. Compare the time with how long it used to take. If it was faster, add it to your weekly routine.</p>
  </div>
</div>

## Common gotchas

A few things that trip people up on their first MCP connection.

**"Claude can't see that page."** Usually means the page is outside the scope you granted during authentication. Go back to Notion → Settings → My Connections → Claude, and extend access to the right folder.

**The MCP server is not responding.** Try <code>/mcp</code> inside Claude Code and look for the server's status. If it says "error", remove it and reinstall. Nine times out of ten a restart of Claude Code fixes it.

**"Why is it searching so many pages?"** By default the search tool runs across everything you granted access to. For big workspaces, be specific in your prompt: "inside the Projects folder, find...".

## What is next

You now have the template for adding any MCP server. The same steps work for Gmail, Calendar, GitHub, Slack, and the growing list.

Over the next three lessons we cover the ones that will save you the most time: **Playwright** for any website on the internet, **Gmail** for your inbox, and a **catalog of eight more** worth knowing.

<div class="callout callout-tip">
  <span class="callout-icon">💡</span>
  <div>
    <strong>Pattern for any MCP server.</strong>
    <ol>
      <li>In Claude Code, run <code>/mcp</code> and add the server.</li>
      <li>Authenticate in your browser. Scope access carefully.</li>
      <li>Test with a read.</li>
      <li>Test with a write.</li>
      <li>Use it for one real task.</li>
    </ol>
  </div>
</div>

<div class="quiz" data-quiz-title="Quick check">
  <div class="quiz-q" data-answer="1">
    <p class="quiz-prompt">How do you install an MCP server inside Claude Code?</p>
    <button class="quiz-option">Reinstall Claude Code from scratch</button>
    <button class="quiz-option">Type <code>/mcp</code> and pick "Add"</button>
    <button class="quiz-option">Download an .exe file from the Notion website</button>
    <button class="quiz-option">You have to edit system files as administrator</button>
    <p class="quiz-explain">The <code>/mcp</code> command inside Claude Code is the easiest route. It handles the install and config for you.</p>
  </div>
  <div class="quiz-q" data-answer="0">
    <p class="quiz-prompt">When you authenticate the Notion MCP server, what should you do?</p>
    <button class="quiz-option">Scope access to only the folders you want Claude Code to touch</button>
    <button class="quiz-option">Always grant full workspace access so nothing fails</button>
    <button class="quiz-option">Share your Notion password in the terminal</button>
    <button class="quiz-option">Skip authentication, it works without</button>
    <p class="quiz-explain">Notion lets you pick which pages and folders to share. Start small. You can widen the scope later from Notion settings.</p>
  </div>
  <div class="quiz-q" data-answer="2">
    <p class="quiz-prompt">Claude Code replies "I can't see that page". What is most likely?</p>
    <button class="quiz-option">Your internet is broken</button>
    <button class="quiz-option">Notion is down</button>
    <button class="quiz-option">The page is outside the scope you granted when connecting</button>
    <button class="quiz-option">Claude Code has a bug</button>
    <p class="quiz-explain">By design, Claude Code can only see Notion pages you explicitly gave the integration permission to read.</p>
  </div>
</div>

Next: [Playwright MCP, give Claude a browser](/course/advanced/mcp/playwright-mcp).
