---
title: Automating your email drafts
duration: 8
summary: Not "AI reads and replies for you". A better pattern, where you stay in control and still save a day a month.
---

Most "AI email" tools promise to read and reply for you. In practice, that always ends badly. The AI sends something slightly off, you look dodgy, the relationship suffers.

The better pattern: **AI drafts, you edit and send.** Same time saving. No risk.

This lesson shows three ways to set that up.

## Pattern 1: One-shot drafting inside your inbox

The simplest setup. You already use Gmail (Gemini) or Outlook (Copilot). Both have built-in "Draft with AI" features.

The upgrade most people miss: **give it proper context**.

Don't click the shiny sparkle button and accept the first draft. Instead:

1. Click the draft button.
2. In the prompt box, type a proper brief:

> *"Draft a reply to this email. Tone should be warm and direct. Under 100 words. The client seems annoyed about the delay; I want to acknowledge it, explain what happened without over-apologising, and commit to a specific new date. Don't start with 'I hope you're well'."*

3. Edit and send.

That extra 30 seconds of brief-writing is the difference between a polite AI-ish reply and a reply that actually does the job.

## Pattern 2: A "reply drafter" custom GPT

If you write the same kinds of replies over and over, build a custom GPT that handles your style by default.

**Setup:**

Build a custom GPT called *"My Email Drafter"* with instructions like:

```
You draft email replies in my voice.

About me:
- [role, business, context]

Voice rules:
- British English, no em dashes, short sentences.
- Never start with "I hope you're well" or similar.
- Contractions are fine.
- Always end with a clear next step.

How to work:
- I'll paste an email I need to reply to, plus a one-line brief.
- You'll give me 2 drafts: one warmer, one cooler.
- Each under 120 words unless I say otherwise.
- Flag if there's anything you're not sure about.

Voice examples:
[paste 3-4 real examples of your replies]
```

Now your workflow is: copy the email, open the GPT, paste. Two drafts in ten seconds. Pick, tweak, send.

## Pattern 3: Zapier/Make for high-volume recurring email tasks

If you're doing the **same kind of reply more than 20 times a week** (support queries, quote requests, onboarding welcomes), a no-code tool like **Zapier** or **Make** pays off.

**Typical setup:**

- When an email with [label] arrives...
- Read the content...
- Ask an AI to draft a reply in your voice...
- Save the draft to your Drafts folder (not Send; never Send).

You open your drafts folder, review a batch of pre-drafted replies, edit or delete, and send.

This is how agencies and small teams handle high email volume. It turns one hour of typing into 15 minutes of editing.

## The templates that save the most time

A small number of email types eat most of your hours. Build drafters for these, in priority order:

1. **Re-engagement emails.** ("Haven't heard back, nudging politely.")
2. **Welcome emails.** ("New client / new customer onboarding.")
3. **Decline emails.** ("Polite no to an opportunity or request.")
4. **Follow-up after a call.** ("Summary + action items + next step.")
5. **Quote or proposal emails.** ("Here's what we discussed + pricing + next steps.")

Templates for these five alone reclaim a surprising amount of a week.

## The rule that stops disasters

**Never set up full auto-reply.** The AI writes the draft. You send it.

Two reasons:

1. Nuance failures compound fast. One mis-sent email to an annoyed client costs more than the hundred automated replies saved.
2. You lose the tiny micro-decisions that make your relationships work. The warmth of a slight personal touch. The deliberate silence to a low-priority request. Automation erases those.

AI makes drafting 10x faster. Sending is still your job.

Next up: [AI for content creation, end to end](/course/intermediate/workflow/content-pipeline).
