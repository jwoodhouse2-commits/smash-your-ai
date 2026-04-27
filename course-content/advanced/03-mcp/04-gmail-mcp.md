---
title: "Gmail MCP: let Claude read and draft your email"
duration: 12
summary: Connect Gmail to Claude Code. How to authenticate safely, start with drafts only, and graduate to real inbox workflows once you trust it.
---

Email is probably the single biggest time sink in your working week. Connecting Gmail to Claude Code is, for most people, the highest-leverage MCP they can set up.

The pattern is the same as the Notion lesson, but Gmail has three wrinkles. The authentication is trickier (Google OAuth), the consequences of a mistake are higher (real messages sent to real people), and the killer workflow is one you should build up to, not dive into.

Start slow. By the end of this lesson you will have Gmail connected, Claude reading your inbox, and drafts waiting for your review. Sending will wait.

## Before you start

You need:

- Claude Code installed and working.
- A Gmail account (personal or Google Workspace).
- Five minutes for the OAuth consent screen.

If your Gmail is a Workspace account your employer controls, you may need admin approval to grant third-party app access. Check with your IT team before you start if you are not sure.

## Step 1: Install the Gmail MCP server

Inside Claude Code, run:

```
/mcp
```

Pick "Add" and search for **Gmail**. The community-maintained Gmail MCP server is the most widely used one. You will see it listed along with its GitHub repo.

Install it. Claude Code will add the server to your config.

<div class="callout callout-tip">
  <span class="callout-icon">💡</span>
  <div>
    <strong>Why the community server?</strong> Google does not yet ship an official Gmail MCP. A handful of community servers have emerged. Pick the one with the most stars, most recent commits, and clearest documentation. The install flow is the same for all of them.
  </div>
</div>

## Step 2: Authenticate with Google

Claude Code will print a URL. Open it in your browser.

You will see Google's standard OAuth consent screen. It will ask for permission to:

- Read your messages.
- Search your messages.
- Create drafts.
- Send messages on your behalf.
- Modify labels.

<div class="callout callout-warning">
  <span class="callout-icon">⚠️</span>
  <div>
    <strong>Read the permissions carefully.</strong> If the server asks for "full account access", that is more than you need. A sensibly scoped Gmail MCP asks for read, search, draft, and (optionally) send. Nothing else. If you see broader scopes, pick a different server.
  </div>
</div>

Approve the scopes you need. Claude Code will confirm the connection and is now talking to Gmail.

## Step 3: Test with a read

Try the smallest thing first.

```
find the last email I got from Paul and summarise it in two sentences
```

Claude Code will:

1. Call Gmail's search tool.
2. Fetch the body of the most recent matching message.
3. Summarise it.

If that works, try a filtered search.

```
search for emails with "invoice" in the subject from the last 30 days,
tell me who sent each, what it was for, and the total amount
```

This is the read layer. You have read-only AI over your inbox now. Already useful.

## Step 4: Draft (do not send) a reply

Now do a write, but a safe one.

```
find the last email from my accountant. Draft a polite reply saying I've
attached the receipts and will get the remaining paperwork across by Friday.
Save it as a draft. Do not send.
```

Claude Code will pull the email, write a reply in your voice, and save it as a draft.

Open Gmail on your phone or in the browser. You will see the draft sitting there, ready for your review. Edit it, add attachments, and send it yourself.

<div class="callout callout-example">
  <span class="callout-icon">🎯</span>
  <div>
    <strong>This is the sweet spot.</strong> Claude writes the draft. You send. You stay in control of every message that goes out, but you skip 80% of the grunt work. For your first week or two, only ever ask Claude Code to draft. Do not ask it to send.
  </div>
</div>

## Step 5: When you are ready, let Claude send

Once you have used drafts for a week and trust how Claude writes in your voice, you can graduate to sending. A sensible progression:

**Week 1:** Drafts only. No `send`.
**Week 2:** Send-with-preview. "Draft a reply to X, show it to me, if I say yes then send it."
**Week 3:** Trusted recipients only. "Send follow-ups to my existing tutoring clients, but only reply-to-existing-thread, not new messages."
**Week 4+:** Expand the scope task by task.

<div class="callout callout-warning">
  <span class="callout-icon">⚠️</span>
  <div>
    <strong>Never auto-send to strangers on day one.</strong> The fastest way to burn your sender reputation (and your relationships) is to let Claude reply to cold enquiries unsupervised. Always check first responses yourself until you are confident.
  </div>
</div>

## Real-world workflows that are worth it

Where Gmail MCP genuinely saves hours.

**Inbox triage**
```
look at the last 24 hours of unread email. Group it into: urgent (needs
a reply today), can wait (reply this week), no action needed. Summarise
each one in a line.
```

**Follow-up chasing**
```
find emails I sent in the last 3 weeks where the recipient has not replied.
Flag any that are actually important (not newsletters or automated).
Draft a gentle nudge for each.
```

**Weekly summary**
```
summarise every email from a paying client this week, by client, in 2-3
bullets each. Highlight anything I've promised and not yet delivered.
```

**Template replies at scale**
```
find every booking enquiry from this week. For each one, draft a reply
using my standard welcome template, personalised to the specific tutoring
subject they asked about.
```

<div class="callout callout-try">
  <span class="callout-icon">⚡</span>
  <div>
    <strong>Try this now.</strong> Pick one task you do in your inbox every week. Weekly summaries, following up on outstanding threads, drafting three similar replies.
    <p>Ask Claude Code to do one run of it for you, in draft mode only. Then time it against your normal workflow.</p>
  </div>
</div>

## Common gotchas

**"Claude keeps missing emails."** Gmail search uses specific operators. If you know what you want, use them. `from:paul@example.com after:2026/03/01` is far more reliable than "emails from Paul last month".

**"The draft is too formal / too casual."** Give Claude Code a sample of your past writing. "Look at my last 5 sent emails to this person and match that tone." Or add a short style note to your CLAUDE.md: "My email tone is warm but brisk, British spellings, no em dashes."

**"The OAuth token expired."** Google tokens rotate periodically. If Claude Code returns an auth error, run `/mcp` and re-authenticate the Gmail server. Takes thirty seconds.

**"It replied to the wrong thread."** Easy trap. Always make your prompts specific. "Reply to the email from john@... dated 12 April about the invoice, not the other thread with the same subject line."

## When Gmail MCP is not the right tool

A few cases to keep in mind.

- **Mass outbound email.** Use a proper tool like Mailchimp or Kit. Gmail MCP is for your personal inbox, not cold campaigns.
- **Highly sensitive inboxes.** If your Gmail has privileged client data, investor info, or legal communications, think twice before granting any MCP access. The risk of a misstep is real.
- **Accounts shared with a team.** MCPs authenticate as one user. If five people use the account, you will not get the audit trail you need.

<div class="quiz" data-quiz-title="Quick check">
  <div class="quiz-q" data-answer="1">
    <p class="quiz-prompt">What should you do with Gmail MCP in your first week?</p>
    <button class="quiz-option">Give Claude full send permissions and let it handle all replies autonomously</button>
    <button class="quiz-option">Stick to drafts only. Let Claude compose, but send manually after you review.</button>
    <button class="quiz-option">Forward every email to a private address first</button>
    <button class="quiz-option">Use it only on weekends</button>
    <p class="quiz-explain">Drafts only for the first week builds trust safely. You get the time-saving on composition without risking an embarrassing or costly message going out.</p>
  </div>
  <div class="quiz-q" data-answer="2">
    <p class="quiz-prompt">Claude Code says "authentication failed" when searching Gmail. What is the most likely cause?</p>
    <button class="quiz-option">Gmail is down</button>
    <button class="quiz-option">You need to reinstall Claude Code</button>
    <button class="quiz-option">The OAuth token has expired. Run <code>/mcp</code> and re-authenticate.</button>
    <button class="quiz-option">Your keyboard is broken</button>
    <p class="quiz-explain">Google OAuth tokens rotate. Expired token is the most common cause of sudden auth failures, and re-authenticating fixes it in seconds.</p>
  </div>
  <div class="quiz-q" data-answer="0">
    <p class="quiz-prompt">Which is a poor fit for Gmail MCP?</p>
    <button class="quiz-option">Sending 10,000 cold outreach emails</button>
    <button class="quiz-option">Drafting replies to booking enquiries</button>
    <button class="quiz-option">Summarising unread email every morning</button>
    <button class="quiz-option">Finding follow-ups that never got replied</button>
    <p class="quiz-explain">Gmail MCP is for your personal inbox. Mass cold outreach belongs in a proper email tool with unsubscribe handling, deliverability management, and list hygiene.</p>
  </div>
</div>

Next up, a catalog of eight more MCP servers that are worth a look, from Google Calendar to Slack to Stripe.

Next: [the MCP catalog](/course/advanced/mcp/mcp-catalog).
