---
title: Privacy, security, and what never to paste in
duration: 8
summary: A short, practical guide to not accidentally training the internet on your company's secrets.
---

AI is a game-changer. It's also a fast way to leak sensitive data if you're not paying attention. This lesson is the guide I wish everyone on a team had.

## The core principle

Whenever you paste something into a free or consumer AI, assume two things:

1. It may be used to train future versions of the model.
2. In a worst-case (platform breach, accidental sharing, config error), it could become retrievable later.

These aren't hypotheticals. Samsung engineers famously leaked chip design code by pasting it into ChatGPT in 2023. Countless smaller cases happen every week.

## The "never paste" list

These should never go into a free or consumer AI tool:

- **Client or customer personal data** (names combined with email, phone, address, DOB, ID numbers).
- **Payment info** (card numbers, bank details, sort codes).
- **Health or medical data** (yours or anyone else's).
- **Passwords, API keys, tokens, secrets.** Ever.
- **Confidential contract terms** (NDAs, pricing agreements, commercial trade secrets).
- **Unreleased product or IP details** that have real commercial value.
- **Anything you're legally obliged to keep confidential** (regulated data, legal privilege, under court order, under NDA).

## The "maybe paste, but carefully" list

These depend on the tool and the plan:

- **Your own internal documents and plans.** Usually fine. But don't paste 50,000 words of strategy into a free consumer tool.
- **Email contents from colleagues.** Strictly, you probably need their awareness. Practically, treat it like any other internal comms.
- **Anonymised customer feedback.** Fine, as long as you've actually anonymised it (first-name + location + specific issue is often enough to re-identify someone).
- **Financial reports.** Fine for your own numbers, careful for shareholder-sensitive info.

## The "fine to paste" list

Goes into any AI without worry:

- **Your own writing you wouldn't mind being public** (blog drafts, social posts, marketing copy).
- **Publicly available information.**
- **Generic questions and learning queries.**
- **Brainstorming material.**

## What changes with paid / enterprise plans

**ChatGPT Plus / Team / Enterprise, Gemini Advanced, Claude Pro, Copilot for Microsoft 365:**

These plans have clearer commercial terms. Typically:

- Your data is **not used for training** by default.
- There are enterprise-grade data isolation features.
- You get a proper contract with defined data handling.

For anything work-related involving more than a handful of people, **a paid plan with enterprise terms is the right buy**. The cost (around £20/user/month) pays for itself the first time it stops a data accident.

## Practical habits

### Habit 1: "would I put this in a public forum?"

Before pasting, ask yourself: *"If this appeared in a competitor's hands tomorrow, would I mind?"* If yes, don't paste it.

### Habit 2: anonymise first, paste second

If you need AI help on something involving real people, replace names and identifying details with placeholders before you paste.

```
Before:  Sarah Smith at Acme Ltd is refusing to pay invoice 4823 for £4,500.
After:   [Client A] at [Company A] is refusing to pay invoice [N] for [amount].
```

You'll get equally good AI advice without creating a data risk.

### Habit 3: use the right tool for the job

- Quick brainstorm, generic question? Any free AI is fine.
- Anything involving business data? Paid plan.
- Highly regulated data (legal, medical, financial advice)? Specialist enterprise AI, or don't use AI at all.

### Habit 4: write a "what we paste" rule with your team

Most accidental leaks are people who thought a rule was obvious. Write it down.

Something like:

> "At [Company], any of the following never goes into a free AI tool: client names with personal details, pricing commitments, unreleased plans. For those, we use [approved paid tool]. If in doubt, ask."

One page. Pin it in Slack. Saves a lot of pain.

## The AI-detection angle

As a small aside: a lot of customers and clients have **gotten good at spotting AI-written text**. Certain phrases are dead giveaways:

- *"In today's rapidly evolving landscape"*
- *"Let's delve into the intricacies"*
- *"Navigating the complexities"*
- *"It's important to note that"*

If you care about your brand looking human, these are worth hunting out during the edit pass.

<div class="quiz" data-quiz-title="End-of-tier check">
  <div class="quiz-q" data-answer="3">
    <p class="quiz-prompt">Which of these should NEVER go into a free consumer AI?</p>
    <button class="quiz-option">Your own blog draft</button>
    <button class="quiz-option">A summary of public news articles</button>
    <button class="quiz-option">Your internal marketing plan</button>
    <button class="quiz-option">A client's full name, email, and payment details</button>
    <p class="quiz-explain">Personal data combined with identifiers (name + email + payment) should never go into a free tool. Use an enterprise plan with data isolation, or anonymise before pasting.</p>
  </div>
  <div class="quiz-q" data-answer="1">
    <p class="quiz-prompt">You've pasted an AI-drafted reply and it sounds slightly off. Best move?</p>
    <button class="quiz-option">Send it, most people won't notice</button>
    <button class="quiz-option">Describe what's off and ask the AI to redraft</button>
    <button class="quiz-option">Start from scratch</button>
    <button class="quiz-option">Give up on AI for email</button>
    <p class="quiz-explain">Iterative refinement is the move. Tell the AI what's off ("it sounds too corporate", "the second paragraph repeats") and let it redraft. Usually one round solves it.</p>
  </div>
  <div class="quiz-q" data-answer="2">
    <p class="quiz-prompt">Which is the strongest reason to build a custom GPT rather than save a prompt template?</p>
    <button class="quiz-option">Custom GPTs are always more capable</button>
    <button class="quiz-option">They run faster</button>
    <button class="quiz-option">You want files/rules that always apply, and you'll use the flow at least weekly</button>
    <button class="quiz-option">They cost less than regular ChatGPT</button>
    <p class="quiz-explain">GPTs earn their keep when the flow has persistent files/rules AND you use it regularly. For one-off or low-volume tasks, a saved prompt is simpler.</p>
  </div>
  <div class="quiz-q" data-answer="0">
    <p class="quiz-prompt">Chain-of-thought prompting works because:</p>
    <button class="quiz-option">Reasoning tokens generated first improve the final answer</button>
    <button class="quiz-option">The AI thinks more slowly when told to</button>
    <button class="quiz-option">It uses a different model under the hood</button>
    <button class="quiz-option">It forces the AI to use Google Search</button>
    <p class="quiz-explain">LLMs predict one token at a time, with earlier tokens influencing later ones. Getting reasoning tokens out first makes the final answer much more reliable. Especially for maths and multi-step logic.</p>
  </div>
</div>

## That's the Intermediate tier done

You now have:

- Four frameworks for writing strong prompts.
- Five advanced techniques (few-shot, chain-of-thought, structured outputs, roleplay, iterative refinement).
- The skills to build custom GPTs for yourself and your team.
- AI integrated into your real workflow: Sheets, research, email, content.
- A sense of where the safety lines are.

If you ticked this one off and use what you've learned, you're in the top 5% of professional AI users in your industry.

<div class="cert-claim" data-tier="intermediate"></div>

## Your prompt framework pack

Before you move on, let's turn what you've learned into something you can keep. Give us three recurring tasks from your real work and we'll draft each one as a framework-based prompt (RTF, CARE, and CO-STAR), plus suggest the next custom GPT you could build.

<div class="tier-worksheet" data-tier="intermediate"></div>

[The Advanced tier](/course/advanced) is where we go beyond chatting with AI and start **doing things with it**. Claude Code, MCP servers, agentic workflows. The stuff that sounds like sci-fi but is genuinely real in 2026.
