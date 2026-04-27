---
title: Why AI gets things wrong (hallucinations, explained)
duration: 7
summary: What an AI "hallucination" actually is, why it happens, and how to spot one before it bites you.
---

If you use AI for anything real, you will run into a **hallucination**. It's the single most common way AI lets people down. This lesson explains what one is, why it happens, and how to catch it before it ends up in your work.

## What a hallucination actually is

A hallucination is when an LLM gives you **a confident answer that is wrong**.

Not a lazy answer. Not a cautious one. A confident, detailed, fluent answer that sounds right and isn't.

Common examples:

- Citing a book or paper that doesn't exist.
- Quoting a person who never said that thing.
- Inventing a software feature that isn't in the product.
- Making up a statistic ("73% of small businesses…") that was never measured.
- Confidently giving you the wrong year, date, or price.

The giveaway is usually **plausibility with too much detail**. It reads like the AI has researched this thoroughly. It hasn't.

## Why hallucinations happen

Remember the previous lesson: an LLM doesn't have a database. It predicts the next token. If it's seen lots of similar-looking text during training, its prediction will usually be right. If it hasn't, it will **still make a prediction**. It doesn't have a "don't know" button.

Imagine a bright student sitting an exam they haven't revised for. They're clever, they've read a lot, and they'd rather guess confidently than hand in a blank page. Sometimes they guess right. Sometimes they guess with conviction and are completely wrong. An LLM behaves the same way.

Three situations make hallucinations more likely:

1. **Very specific facts.** Names, dates, numbers, citations, prices. Anything where "roughly right" is still wrong.
2. **Recent events.** The AI's training data has a cut-off date. Ask it about anything after that and you're rolling the dice.
3. **Niche topics.** The less training data there was on a subject, the more creative the AI will get.

<div class="callout callout-example">
  <span class="callout-icon">🎯</span>
  <div>
    <strong>A real-world warning.</strong> In 2023, a New York lawyer filed a legal brief with six citations. All six were cases ChatGPT had invented. Confidently. With made-up judges' names, made-up docket numbers, and made-up quotes. The lawyer had copied the citations into court without checking. The judge did check. The lawyer was publicly sanctioned and fined. The entire incident became a teaching moment for the legal profession.
    <p>Hallucinations are not a minor quirk. They're the central thing to understand about AI.</p>
  </div>
</div>

## How to spot one

Four cheap tests you can run on any AI answer.

1. **Does it cite a source?** If yes, click through. If the source doesn't exist, that's a hallucination.
2. **Is the number suspiciously round?** "Exactly 50%", "doubled in five years", "£1,000 per month on average". If you can't find that exact number in a real report, be sceptical.
3. **Would you have heard of this?** If the AI mentions a "famous" person, book, or study you've never encountered in the topic you know, that's a flag.
4. **Ask again, in a new chat.** Hallucinations are often inconsistent. Ask the same question fresh and see if the answer stays the same.

## How to reduce them

You can't eliminate hallucinations. You can make them rarer.

- **Give the AI the source material.** Paste the article, upload the document, link the web page. The AI can't hallucinate facts that are sitting in front of it.
- **Ask for a quote, not a paraphrase.** "Quote the exact sentence from the document that supports this" forces the AI to point to real text.
- **Use a model with web search turned on** for anything time-sensitive. Gemini and ChatGPT both support this.
- **Lower the stakes of the mistake.** Use AI for brainstorming and first drafts, where a wrong fact is easy to catch. Don't use it unchecked for legal, medical, or financial advice.

## The one rule

If the cost of being wrong is high, you **always** verify. Every fact, every number, every quote.

The [next lesson](/course/beginner/what-is-ai/fact-checking) gives you a 5-step checklist for doing exactly that.
