---
title: Few-shot prompting, teaching with examples
duration: 10
summary: The easiest way to transform AI output. Show it what good looks like, and it'll match.
---

"Few-shot" is the jargon. The idea is dead simple: instead of **telling** the AI how to do something, you **show** it two or three examples and let it pattern-match.

It's the single biggest quality upgrade you can make to any prompt, and almost nobody outside of AI teams uses it.

## Zero-shot vs few-shot

**Zero-shot** is the normal way. You describe what you want, the AI does its best.

**Few-shot** is giving the AI worked examples first.

A concrete comparison.

### Zero-shot prompt

```
Rewrite the following product description in the voice of
a friendly independent Northumberland bakery:

"Our new sourdough is a traditional 24-hour fermented loaf
made with organic flour."
```

The output will be correct. It'll also sound exactly like every other AI-rewritten product description.

### Few-shot prompt

```
I'm going to give you 3 examples of our Northumberland bakery's
voice. Then I'll give you a draft product description, and
you'll rewrite it to match the voice.

Example 1:
Input: "Our coffee is freshly ground each morning."
Output: "Fresh-ground every day before we've even had our first
cuppa. Fair warning, it ruins supermarket beans for life."

Example 2:
Input: "Our lunch menu changes seasonally."
Output: "What's on the lunch menu? Whatever's good this week.
Seasonal, local, and only ever changed when we've found something
better."

Example 3:
Input: "We use free-range eggs."
Output: "Our eggs come from hens 20 minutes up the road.
Happy hens, bright yolks, you can taste it."

Now rewrite this one in the same voice:
"Our new sourdough is a traditional 24-hour fermented loaf
made with organic flour."
```

Night and day difference. The AI picks up:

- The sentence rhythm
- The direct, chatty tone
- The "we're proud but don't take ourselves too seriously" stance
- The habit of ending with a concrete payoff

Zero-shot can't give you that. Few-shot does it in 30 seconds.

<div class="callout callout-scenario">
  <span class="callout-icon">🎬</span>
  <div>
    <strong>Scenario: the estate agent who stopped sounding like everyone else.</strong>
    <p>An independent estate agent in York had the usual problem. Every property description on every portal sounded identical. "Nestled in a desirable location." "Offering spacious accommodation." You've seen it a thousand times.</p>
    <p>She took her six best-ever property listings (the ones that got calls within hours) and pasted them as examples into a few-shot prompt. Now every new listing gets drafted in that same specific voice, dry humour and all. Listings get live in 10 minutes instead of 45, and they actually sound like her.</p>
    <p>That's few-shot prompting earning its keep.</p>
  </div>
</div>

## When to use few-shot

- **Brand voice matching.** Any time tone is the whole game.
- **Classification.** ("Is this a high-priority email? Here are 3 examples of high-priority and 3 of low.")
- **Extracting data in a specific format.** ("Here are 2 examples of how to pull names and dates from meeting notes.")
- **Writing in a genre.** Headlines, case studies, cold emails, anything with conventions.

## The three rules of few-shot

### Rule 1: 2-5 examples is the sweet spot

One example is often ambiguous. Ten is overkill. Three is almost always right.

### Rule 2: Use diverse examples

If all three of your examples are short, the AI will only produce short outputs. If they all use the same opening, it'll copy that opening. Mix it up.

### Rule 3: Show hard cases, not just easy ones

If you're teaching the AI to classify urgent vs non-urgent emails, include one **edge case** where the answer is tricky. That teaches it the boundary, not just the obvious middle.

## Where few-shot falls over

- **Very long examples** eat up context and slow everything down.
- **Private or sensitive data in examples** is risky on free AI plans. Don't paste real customer data unless you trust the platform.
- **Mixing too many patterns** confuses the AI. If you want different tones for different audiences, run separate prompts.

## One trick to save examples forever

Build a **voice library**. A single note file with 5-10 of your best written examples. When you need the AI to write in your voice, paste the top 2 or 3 examples at the start of any prompt.

You write the library once. It pays you back every week.

Next up: [chain-of-thought prompting](/course/intermediate/advanced-techniques/chain-of-thought). Less about **how** to answer, more about **how the AI thinks**.
