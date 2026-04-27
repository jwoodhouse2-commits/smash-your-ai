---
title: How LLMs actually work
duration: 10
summary: Tokens, training, and the "it's just very good at guessing the next word" model, in plain English.
---

You don't need a PhD to use AI well. But you do need a rough mental model of what's happening when you type something in. That way, when the AI surprises you (for better or worse), you'll know why.

Here's the ten-minute version.

## LLMs learn from a lot of text

An LLM is trained on huge amounts of text. Books, websites, forums, code, manuals, the lot. During training, the model plays a game: given a chunk of text, predict the next word. Do this billions of times, adjust the model each time it guesses wrong, and eventually it gets very, very good at predicting what word comes next.

That's it. That's the whole headline idea.

Everything else an LLM can do (writing essays, translating, answering questions, writing code) falls out of that one ability. If you can predict the next word reliably, you can sound coherent. If you sound coherent about the right topic, you can look intelligent.

## Tokens, not words

LLMs don't actually think in words. They think in **tokens**. A token is usually part of a word, sometimes a whole word, sometimes punctuation.

For example:

- *"Smash Your AI"* is roughly 4 tokens: `Sm`, `ash`, ` Your`, ` AI`.
- *"cat"* is 1 token.
- *"pseudonymity"* might be 3 tokens: `pseud`, `onym`, `ity`.

You don't need to memorise this. Two practical consequences are all you need to know.

1. **You pay by tokens, not words.** Every free or paid AI has a limit on how much text it can handle at once. That limit is in tokens.
2. **Short, clear prompts are cheaper and faster.** Waffle costs real money on paid plans and real time on all plans.

## Predicting one token at a time

When you ask an LLM a question, it doesn't compose the whole answer, then type it. It generates **one token at a time**, in order. Each token is chosen based on everything that came before it.

That's why:

- AI can lose track in very long conversations. Older tokens drop out of its "working memory".
- AI loves to start an answer and then get better as it goes. First sentences are the weakest; the middle is usually the strongest.
- A good prompt changes the whole trajectory of the answer. If you set the AI up well at the start, every token after that is more useful.

## There is no database inside

This is the bit that trips people up most.

An LLM has no built-in search engine. It has no hard list of facts. When you ask "who wrote Pride and Prejudice?", it doesn't look up an answer. It **predicts the most likely tokens to follow your question**, based on what it saw during training.

For common facts ("Jane Austen"), that prediction is usually right. For specific, recent, or niche facts, it's often wrong. The AI will still sound confident, because that's what the training data sounds like. It doesn't know what it doesn't know.

Modern tools dodge this by plugging the LLM into real data sources. Gemini uses Google Search. Some ChatGPT answers use live web browsing. Claude can read files you upload. These additions make the LLM much more reliable, but the underlying "predict the next token" machinery is still the core.

## Why this matters on a Tuesday afternoon

Three practical things fall out of this.

1. **Give it context.** An LLM guessing without context gets vague answers. An LLM with your email draft, your audience, and your goal gives you something usable.
2. **Don't trust numbers, names, dates.** They're the things most likely to be made up. Always verify.
3. **Ask for sources, not just facts.** "Answer and include the sources you'd cite" prompts many tools to actually check before speaking.

Next up: [Lesson 5: Why AI gets things wrong](/course/beginner/what-is-ai/hallucinations). We'll unpack hallucinations properly and show you how to spot one before it bites.
