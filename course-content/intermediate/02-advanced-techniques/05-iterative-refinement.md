---
title: Iterative refinement
duration: 8
summary: Almost nobody uses AI well on the first prompt. The ones who use it brilliantly use four. Here's the pattern.
---

The biggest gap between intermediate and advanced AI users isn't prompt wizardry. It's **persistence**. The intermediate user writes one prompt, reads the output, accepts or rejects it. The advanced user writes one prompt and then has a proper conversation.

This lesson is that pattern.

## The four-step loop

Almost every high-quality AI output goes through four rounds.

### Round 1: Divergent generation

Ask for lots of options. Your goal here is **breadth**, not quality.

```
Give me 10 different angles I could take for this blog post
about [topic]. Include a range, from obvious to weird.
Under each, give a one-line logline.
```

### Round 2: Selection

Pick one. Trust your gut. Don't overthink it.

```
Let's go with option 6. Expand it into a 600-word first draft.
Keep the angle sharp throughout.
```

### Round 3: Surgery

Read the draft. Instead of accepting it or starting over, **describe what's off** and let the AI fix it.

Typical surgery prompts:

- *"Cut this by 30%. Keep the opening and the last paragraph exactly as they are. Tighten everything else."*
- *"The middle section repeats itself. Combine paragraphs 3 and 4 into a single sharper point."*
- *"The tone goes slightly corporate in the second half. Pull it back to match the first two paragraphs."*

### Round 4: Polish

Final pass. Specific line-level fixes.

- *"The opening line is weak. Give me 5 alternatives."*
- *"The sign-off is flat. Make it land."*
- *"Swap any sentence that starts with 'In today's fast-paced world' or similar cliché. Give me 3 different openings to choose from."*

Four rounds. Three to five minutes. You go from blank page to publishable.

## The secret: describe the feeling, not the fix

The thing most people get wrong in round 3 is this. They read a weak draft and either:

- Accept it (*"good enough, send"*), or
- Rewrite it themselves from scratch.

Both are mistakes. The move is to **describe what's wrong** and let the AI fix it.

Examples of feelings-as-prompts:

- *"The opening feels like every other AI-written post."*
- *"This doesn't sound like me. It's too clean."*
- *"It reads like a list of facts. Where's the narrative?"*
- *"I don't believe the third point."*
- *"The ending lands flat."*
- *"This would not stop me if I was scrolling past."*

Paste the feeling. The AI will take a fresh run at it with that feedback baked in. The result is usually much closer to right.

## The "explain your edits" trick

After a surgery round, ask:

```
Explain the three most important changes you made and why.
```

Two reasons this is useful:

1. You'll sometimes spot a change the AI made that you disagree with. Now you can push back.
2. You learn the AI's editing intuitions, which sharpens your own.

## Using "show me what you'd cut"

A great round 3 prompt:

```
Read back through your last draft. If you had to cut 25% of the
words, which paragraphs or sentences would go first, and why?
Show me the cut version and keep the reasoning separate.
```

AI is shockingly good at this. Often the cut version is just better than the original.

## When to give up on an iteration loop

If after round 3 you've still not got close, don't try to rescue it. **Go back to round 1** with a better prompt. Start with more context, a clearer angle, or a stronger example.

Sometimes the problem is the premise, not the execution.

## The habit to build

Every time you're about to accept an AI output, pause. Ask yourself:

*"Would a better version of this be possible if I just said what's off about it?"*

90% of the time, yes. 95% of the time, the better version is only one prompt away.

Those are the minutes where AI genuinely does the work for you. The rest of the time, it's just drafting.

Module 2 done. You now have the core prompting techniques a competent professional uses. Next up: [Module 3 on custom GPTs](/course/intermediate/custom-gpts/what-a-custom-gpt-is). This is where your AI starts to feel **yours**.
