---
title: Chain-of-thought, showing your working
duration: 9
summary: Ask the AI to reason step by step, and watch it stop guessing. Especially powerful for maths, logic, and multi-step tasks.
---

Here's a weird, useful quirk of LLMs. If you just ask them a hard question, they often get it wrong. If you ask them the same question with *"think through this step by step first"* tacked on, they often get it right.

This technique is called **chain-of-thought prompting**, or CoT. It's worth 20 minutes to learn because it transforms the kind of problem the AI can handle.

## Why it works

An LLM generates one token at a time. Each token is influenced by everything that came before.

If you ask a hard question and the AI jumps straight to an answer, the answer is generated without any reasoning token to anchor it. The AI is essentially guessing.

If you ask it to **reason first**, the reasoning tokens get generated, and then the final answer is generated *with that reasoning in its working memory*. The answer is much more likely to be right.

It's a bit like the difference between a student answering a maths question in their head versus showing their working on paper.

## The magic phrases

Any of these at the start or end of a prompt will trigger a chain-of-thought response:

- *"Think through this step by step."*
- *"Let's reason through this carefully."*
- *"Before you answer, break the problem down."*
- *"Show your working first, then give the answer."*

You can add *"then give me a clear final answer at the end"* so the reasoning doesn't get in the way.

## When to use chain-of-thought

- **Maths and logic problems.** Anything with a right answer the AI needs to arrive at.
- **Multi-step planning.** ("Plan a 5-day marketing campaign launch." Don't just ask for the plan; ask it to reason through dependencies first.)
- **Analysis tasks.** Pros and cons. Trade-offs. "What's the best decision given these constraints?"
- **Anything where the AI tends to skip to a confident wrong answer.**

## A worked example

### Without chain-of-thought

```
A hair salon has 4 chairs. Each chair does 5 cuts per day at £35
each, and one colour per day at £80. They're open 6 days a week.
What's weekly revenue?
```

The AI might give you the right answer. Or it might fumble the maths.

### With chain-of-thought

```
A hair salon has 4 chairs. Each chair does 5 cuts per day at £35
each, and one colour per day at £80. They're open 6 days a week.
What's weekly revenue?

Think through this step by step, showing each calculation, then
give the final number at the end.
```

You'll get:

- Revenue per chair per day from cuts: 5 × £35 = £175
- Revenue per chair per day from colours: 1 × £80 = £80
- Revenue per chair per day total: £175 + £80 = £255
- 4 chairs: £255 × 4 = £1,020 per day
- 6 days: £1,020 × 6 = **£6,120 per week**

Reliable. Checkable. Right.

## Chain-of-thought for decisions

CoT isn't just for maths. It's brilliant for soft-skilled business calls.

### Example

```
Think through this step by step, then give a recommendation.

I run a small graphic design studio. Revenue is up 18% this year
but profit is flat because costs have risen. I'm considering
either (a) putting prices up by 15% across the board, (b) trimming
one project manager whose role has changed, or (c) keeping things
as they are for 6 months to ride it out.

Walk through the pros and cons of each, then the risks I might
not be seeing, then your recommendation.
```

The AI will often surface a nuance you'd have missed, because it's been forced to reason rather than leap to an opinion.

## Don't use it when

- The task is simple. ("Translate this sentence.") Extra reasoning just wastes time.
- You're asking for creativity, not logic. Chain-of-thought can make creative output more conservative.

## Combining with other techniques

CoT plays well with:

- **Few-shot.** Give examples of step-by-step reasoning, then ask for a fresh problem.
- **Role prompting.** *"As a senior accountant, reason through this carefully."* The role shapes the style of the reasoning.
- **Structured outputs.** *"Reason through this step by step. Then give a final answer in this format: { decision, confidence, risks }."*

Which is a handy segue to [the next lesson on structured outputs](/course/intermediate/advanced-techniques/structured-outputs).
