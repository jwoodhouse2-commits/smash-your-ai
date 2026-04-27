---
title: The CO-STAR framework, for when you need nuance
duration: 10
summary: Context, Objective, Style, Tone, Audience, Response. For the prompts where tone and audience matter as much as the content.
---

CO-STAR comes from Singapore's government AI team and it's the framework professional prompt engineers reach for most often. Six ingredients, each of them worth its place.

## The six ingredients

### Context

What's the situation? What's happened already? What does the AI need to know about your world?

### Objective

What outcome are you trying to achieve with this output? Not "what do you want the AI to do" but "what do you want to happen in the real world"?

*"I want the recipient to reply by Friday agreeing to a 15-minute call."*

That's an objective. *"Write an email"* is a task. Big difference.

### Style

How should the writing itself work? Formal, conversational, punchy, academic, lyrical?

### Tone

How should the reader feel? Reassured, energised, held accountable, welcomed, nudged?

Style and tone sound similar. Style is how the writing **sounds**. Tone is how the writing **feels**. You need both.

### Audience

Who specifically is reading this? Not a vague persona. A specific person or group, with specific assumptions, priorities, and frustrations.

### Response

What format does the output take? Email, post, report, table, transcript, list?

## The template

```
# Context
[Background, situation, prior history]

# Objective
[What should happen in the real world after this is read]

# Style
[How the writing should sound]

# Tone
[How the reader should feel]

# Audience
[Who, specifically, with known priorities]

# Response
[Format, length, structure]

Now produce the response.
```

## A worked example

### Scenario

You need to send a message to your team about a hiring freeze.

### Prompt

```
# Context
I'm the MD of a 12-person marketing agency. The last two months have
been slow. Two new-business deals we thought were done have fallen
through. Cash is tight enough that I'm pausing a planned hire for
now. The team doesn't yet know. They've been aware of the slowdown
and a couple of people have asked privately if their jobs are safe.

# Objective
After reading this, the team should feel clearly informed, not
panicked. They should trust me with the truth. I don't want anyone
polishing their CV because they assume the worst.

# Style
Direct. No corporate hedging. Short sentences. Uses contractions.
Writes like I'd actually speak, not like an HR memo.

# Tone
Grounded and honest. Not performatively upbeat. Not scary.
Quietly confident.

# Audience
My team. Mostly 25-35 years old. Smart, commercial, allergic to
corporate spin. They'll notice if I dodge specifics.

# Response
A Slack message, roughly 150-200 words. Paragraphs separated by
blank lines. One line at the end invites anyone with concerns
to DM me directly.

Now write the Slack message.
```

You'll get something you can actually hit send on.

## Why CO-STAR works

Most prompts fail because they answer "what task" but not "what outcome". CO-STAR separates those out. Writing *"I want the team to feel informed but not panicked"* is a dramatically better brief than *"write a message about the hiring freeze"*.

The Style + Tone split is the other unlock. The AI gets pulled towards one default (usually: polished corporate). If you're explicit about style AND tone, you overrule that default.

## When to use it

- Internal comms where tone is life or death.
- Sales or partnership emails to specific people.
- Difficult conversations: firing, declining, escalating.
- Anything where the audience is narrower than "the general public".

## Why I don't use it for everything

CO-STAR takes two or three minutes to write. For a quick caption or follow-up email, RTF in 30 seconds is better. **Use CO-STAR when the stakes justify the setup.**

Last framework lesson: [which framework for which job](/course/intermediate/prompting-frameworks/which-framework-when). Short and practical.
