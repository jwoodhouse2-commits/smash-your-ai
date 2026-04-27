---
title: The RTF framework
duration: 8
summary: Role, Task, Format. The simplest framework there is, and the one you'll use 80% of the time.
---

**RTF** is the framework you reach for first. Three ingredients. No ceremony.

## The three ingredients

### Role

Tell the AI who to be.

*"You are a UK-based small business accountant with 15 years' experience."*

Rough rule: the more specific the role, the better the answer. *"You are an accountant"* is weaker than *"You are a UK-based chartered accountant who specialises in creative agencies between 5 and 20 staff"*.

### Task

Say what you want. Specifically.

*"Explain the difference between a sole trader and a limited company for a freelance illustrator who earns £45k a year."*

Not *"explain sole trader vs ltd"*. Put the specifics in.

### Format

Tell it how to answer.

*"Give me a side-by-side comparison table with 6 rows covering tax, legal liability, admin, flexibility, perception, and cost. Under the table, add a one-paragraph recommendation."*

This is the bit most people skip. It's the highest-leverage part of the whole framework.

## The template

```
Role: You are [specific role with expertise].

Task: [What you want, specifically, with any key numbers or constraints.]

Format: [Structure, length, style of output.]
```

Three lines. Paste and fill in. That's RTF.

## Real examples

### Example 1: A client-facing explainer

```
Role: You are a friendly pensions adviser writing for a complete beginner.

Task: Explain what a SIPP (self-invested personal pension) actually is,
and who it makes sense for.

Format: Three short paragraphs. No jargon without a plain-English
translation. End with a 3-bullet "is this for you?" checklist.
```

### Example 2: Helping yourself think

```
Role: You are a strategic COO for a 5-person service business.

Task: I'm considering putting up my rates by 20% in January. Analyse
the main risks, opportunities, and what I should do before announcing.

Format: 3 sections: Risks, Opportunities, What to do first.
Under 400 words total. End with a recommendation.
```

### Example 3: Learning something

```
Role: You are a patient physics teacher explaining to a 13-year-old.

Task: Explain what entropy is, using a real-life example.

Format: A 3-paragraph explanation, followed by a short analogy,
followed by 2 questions to check I've understood.
```

## Why this works

RTF works because it forces you to answer three questions the AI would otherwise guess the answer to.

- **Who's talking?** (Role)
- **About what, exactly?** (Task)
- **Give me what shape of answer?** (Format)

Skip any one of those, and the AI fills in the gap with its default. The defaults are always generic.

## When RTF isn't enough

If the answer matters for a specific audience, add **tone** and **audience** explicitly. That's when [CO-STAR](/course/intermediate/prompting-frameworks/co-star-framework) (two lessons from now) comes in.

If you need the AI to learn from examples, [few-shot prompting](/course/intermediate/advanced-techniques/few-shot-prompting) is the move (next module).

But for 80% of everyday prompts, RTF is all you need.

Next up: [the CARE framework](/course/intermediate/prompting-frameworks/care-framework), for when you want a specific outcome with a worked example.
