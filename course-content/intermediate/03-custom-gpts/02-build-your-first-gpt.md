---
title: Building your first custom GPT, step by step
duration: 15
summary: A 20-minute walkthrough. By the end you'll have your own working GPT saved to your account.
---

Time to build one. Pick a real use-case before you start. A writing assistant is the easiest to get value from, so we'll use that as the worked example.

You'll need **ChatGPT Plus** (or Team or Enterprise). Free tier can't create GPTs.

<div class="callout callout-scenario">
  <span class="callout-icon">🎬</span>
  <div>
    <strong>Scenario: the accountant who built a GPT over lunch.</strong>
    <p>A sole-trader accountant in Leeds was spending two hours a week writing client emails. Slightly different questions, very similar answers, always the same tone.</p>
    <p>Over lunch one Tuesday he built a custom GPT: name, description, and a 600-word instructions block with his tone of voice, three examples of his best past replies, and a checklist of the five common client question types he answers.</p>
    <p>Two hours a week became twenty minutes. The GPT drafts in his voice, he edits lightly, sends. Over a year that's more than 80 hours back. The £22/month ChatGPT Plus subscription paid for itself in the first week.</p>
  </div>
</div>

## Step 1: Open the Builder

Go to **chat.openai.com**. In the left sidebar, click **"Explore GPTs"** (or **"My GPTs"**). Hit the **+ Create** button in the top right.

You'll see a two-panel screen:

- **Left:** A chat panel called "Create" (this is ChatGPT helping you build).
- **Right:** A preview of your GPT in use.

## Step 2: Let the builder ask you questions

In the Create panel, the builder will ask what kind of GPT you want. You can just chat with it. Something like:

> "I want to build a writing assistant that drafts blog posts, social posts, and emails in my voice. My business is a small UK hair salon in Northumberland. Tone is warm and cheeky, never corporate. British English."

It'll ask you questions back. Name. Description. Avatar. Let it generate some defaults. You can always change them later.

## Step 3: Switch to "Configure" mode

In the create panel, click the **Configure** tab. This gives you direct access to the three things that actually matter.

### Name

*"Alnwick Writing Assistant"* (specific, not generic).

### Description

One line shown when anyone opens the GPT. Keep it short: *"Drafts posts, emails, and captions in Alnwick Salon's voice."*

### Instructions

This is the big one. Where most of your GPT's quality comes from.

## Step 4: Write the instructions

Don't write *"be helpful"*. Write a proper brief. Use this template to start:

```
You are the writing assistant for [business name], a [type of business]
based in [location]. You help draft posts, emails, captions, and any
other written content in our voice.

About us:
- [3-4 lines on who we are, what we do, and what makes us different]

Our audience:
- [who reads our writing, be specific]

Tone rules:
- [tone descriptor]
- [what to avoid]
- British English (never American spellings)
- No em dashes or en dashes. Use commas or full stops.
- Short, crisp sentences. Contractions are fine.

Voice examples (match this rhythm):
1. [paste 2-3 sentences of your real writing]
2. [paste 2-3 sentences of your real writing]
3. [paste 2-3 sentences of your real writing]

How you respond:
- If I ask for a post, default to under 150 words unless I say otherwise.
- If I ask for 1 option and you could reasonably give 3, give me 3.
- Always end with a question or call to action.
- If something is unclear about the task, ask before you draft.

Things to avoid:
- Corporate jargon
- "In today's fast-paced world"
- "Unlock", "leverage", "synergy"
- AI-giveaway phrases like "navigate the landscape"
```

## Step 5: Conversation starters

These are the buttons that appear on the GPT's home screen. Pick 3-4 common tasks:

- *"Draft a Monday social post"*
- *"Write a re-engagement email"*
- *"Give me 10 caption ideas for this photo"*
- *"Turn these notes into a newsletter"*

## Step 6: Knowledge (optional, very useful)

Scroll down to **Knowledge**. You can upload files the GPT can reference.

Useful things to upload:

- **A voice sample document.** 1000-2000 words of your best writing.
- **An FAQ or brand style guide.** So the GPT knows your house rules.
- **Template emails or posts.** So the GPT can match known structures.

Tip: don't upload 100 files. Upload 2-3 really good ones. Quality beats quantity.

## Step 7: Test it in the preview panel

Type a task into the preview panel. Watch what comes out.

It'll almost never be right first time. That's expected. The right move is to go back to the Instructions and tighten them.

Common first-time failures:

- **Too long.** Add *"Default to under X words unless I say otherwise."*
- **Tone is off.** Add or swap voice examples in the Instructions.
- **Generic openings.** Add *"Never start with a cliché. The opening must stop the reader scrolling."*
- **Over-apologises.** Add *"Do not start responses with 'Of course!' or 'Certainly!' or similar."*

## Step 8: Save

Click **Create** (top right). Choose who can use it:

- **Only me** (recommended for personal GPTs)
- **Only people with a link** (share with your team)
- **Anyone** (public, but they'll need ChatGPT Plus to use it)

Done. You've got your first custom GPT. Go use it for real work today.

Next up: [the three parts of a GPT in more depth](/course/intermediate/custom-gpts/instructions-knowledge-actions) (instructions, knowledge, and actions), and when to use each.
