---
title: Instructions vs knowledge vs actions
duration: 10
summary: The three knobs that make a custom GPT. Here's what each one does and when to reach for which.
---

A custom GPT has three ways to give it context. Most people use instructions well, upload random files into knowledge, and ignore actions. Let's fix that.

## Instructions

**What it is:** a block of text that the GPT reads before every single message. Your rules, your voice, your format.

**When to use:** for anything that should **always** be true. Voice, tone, audience, default formats, rules for how to respond.

**Rules of thumb:**

- Keep it under 1,500 words. Longer and the GPT starts skipping bits.
- Put the most important rules at the top and again at the bottom. LLMs pay more attention to the beginning and end.
- Write in plain English. You don't need to format as bullet points for the AI's benefit, but bullets help you keep it organised.
- Use **commands** not suggestions. *"Always end with a question"* not *"Maybe consider ending with a question"*.

**What it can't do:** It can't "remember" anything you type in a conversation. If you want a GPT to know a huge amount of detail (a product catalogue, a policy document, a training manual), use Knowledge instead.

## Knowledge

**What it is:** files you upload to the GPT. PDFs, Word docs, text, spreadsheets. The GPT can reference them when you ask a question.

**When to use:**

- **Reference material** the GPT should consult. Your brand style guide. An FAQ. A product spec. A set of policies.
- **Voice samples** that are too long to fit in instructions.
- **Worked examples** of completed outputs.

**Rules of thumb:**

- Upload **2 to 5 really good files**, not 30 mediocre ones.
- Each file should be **focused**. A single clean "Brand Voice Guide" is better than a dump of five random past emails.
- **Prefer plain text or well-structured PDFs** over scanned or messy documents. The GPT reads the text, not the layout.
- **Tell the GPT about the files** in the instructions. Something like *"You have access to three files: [X], [Y], [Z]. When asked about [X topic], check the [X] file first."*

**The hidden gotcha:** the GPT will sometimes ignore uploaded files unless you prompt it to check. Write *"If you're unsure about a fact, check the knowledge files before answering"* into the Instructions.

**Privacy note:** don't upload client data you don't own, medical information, or anything confidential. Treat anything in Knowledge as if OpenAI has a copy.

## Actions

**What it is:** the GPT can call external APIs or web services. This is the technical bit. Actions let the GPT actually **do things** beyond just talking. Send a message, look up a calendar event, fetch a live price, create a record.

**When to use:**

- You want the GPT to pull **live data** (stock prices, weather, news, your own database).
- You want the GPT to **create things** in another system (make a Trello card, send a Slack message, log a Calendly slot).
- You're building a GPT for **internal use** at a company where workflows need to happen.

**What's involved:**

- Actions are defined using a format called **OpenAPI schema** (essentially: a standardised way to describe an API).
- You need the API to exist, or you need to build it.
- You need to know or get the authentication details.

**In practice:** for 80% of small business users, you won't need Actions. When you do, you'll usually work with a developer, or use a connector platform like **Zapier** or **Make** to bridge the gap without writing code.

## The typical mix

For most of the GPTs you'll build, the split looks like this:

| GPT type | Instructions | Knowledge | Actions |
|---|---|---|---|
| Writing assistant | ★★★★★ | ★★ (voice samples) | - |
| Onboarding helper | ★★★★ | ★★★ (checklist, templates) | - |
| Research assistant | ★★★ | ★★★★★ (reference docs) | ★ (optional live search) |
| Sales AI for your team | ★★★★ | ★★★ (playbooks) | ★★★ (CRM integration) |
| Task automator | ★★ | ★ | ★★★★★ |

## The test: can this be done with a good prompt?

Before you build a GPT, ask yourself: *"Could I just write a really good prompt and save it somewhere?"*

If yes, do that. GPTs earn their keep when:

- You use the same flow **at least weekly**.
- You have **files** the GPT should reference.
- You want **others on your team** to use the same setup.

Otherwise, a saved prompt in your notes app is fine.

Next up: [how to share a custom GPT with your team](/course/intermediate/custom-gpts/sharing-a-gpt) without the usual trade-offs.
