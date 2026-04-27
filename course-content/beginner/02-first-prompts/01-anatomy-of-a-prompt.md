---
title: The anatomy of a good prompt
duration: 8
summary: Four ingredients that turn a vague ask into a useful answer, with before-and-after examples.
graderTask: >-
  Write a prompt that asks an AI to draft a short promotional email for your
  business or a fictional one. Include the four ingredients (role, task, context,
  format).
graderRubric:
  - Role is specific and relevant (not just "helpful assistant"). It names a job, specialism, or experience level.
  - Task is concrete and actionable. The reader could act on it without follow-up questions.
  - Context covers who the learner is, who the audience is, tone of voice, and any key constraints or numbers.
  - Format specifies exactly how the output should look (length, structure, number of options, any required elements).
  - Overall voice is plain English, no jargon, and the prompt is scannable rather than a wall of text.
---

Most of the frustration people have with AI is really a prompting problem. They're typing six words when the AI needs six sentences of context. This lesson fixes that.

A good prompt almost always has **four ingredients**. Role, task, context, format. You don't always need all four, but you'll usually need at least three.

## The four ingredients

### 1. Role

Tell the AI who to be.

*"You are a marketing consultant who has helped 100 small businesses write better email campaigns."*

Giving the AI a role changes the tone, the vocabulary, and what it prioritises. It's the single cheapest upgrade you can make to any prompt.

### 2. Task

Say what you want. Specifically.

*"Write a subject line for a re-engagement email to customers who haven't opened our emails in 90 days."*

Not *"write me a subject line"*. Not *"help with email marketing"*. A real, specific task.

### 3. Context

Give the AI what it needs to answer well.

*"Our business is a Northumberland pet grooming salon called Top Tails. Average customer spend is £45. Our tone is warm and cheeky, not corporate."*

Context is where amateur prompts fall short. The AI can't read your mind. It doesn't know your audience, your tone, your product, or your goals unless you tell it.

### 4. Format

Tell it how to reply.

*"Give me 5 options, each under 60 characters, as a numbered list. After each, explain in one short sentence why that subject line might work."*

Without a format instruction, the AI will default to walls of text. Specify exactly what you want and you'll get usable output the first time.

<div class="callout callout-tip">
  <span class="callout-icon">💡</span>
  <div>
    <strong>Top tip.</strong> Of the four ingredients, <em>context</em> is the one almost everyone skips, and it's the one that makes the biggest single difference. If you only add one thing to your next prompt, make it a sentence about who you are, who the output is for, and what tone matters.
  </div>
</div>

## Before and after

<div class="callout callout-example">
  <span class="callout-icon">🎯</span>
  <div>
    <strong>Real example: cafe captions.</strong>
    <p><strong>Weak prompt:</strong> <em>"Write me some Instagram captions for my cafe."</em></p>
    <p><strong>Strong prompt:</strong> <em>"You are a social media manager who writes for independent cafes. Write 5 Instagram captions for a Saturday brunch post at The Bean House, a cafe in Alnwick, Northumberland. Our tone is friendly and down-to-earth, never corporate. The photo shows a plate of poached eggs on sourdough. Each caption should be under 150 characters, include one light pun or joke, and end with a call to book a table. Return them as a numbered list."</em></p>
    <p>The weak prompt gets you five generic captions that could be for any cafe. The strong prompt gets you five captions you could actually post.</p>
  </div>
</div>

## A quick template you can steal

Copy this into your notes app. It's the workhorse template.

```
Role: You are [who the AI should be].

Task: [What you want done, specifically.]

Context:
- About me/my business: [details]
- Who this is for: [audience]
- Tone of voice: [warm / formal / playful / etc.]
- What I've tried: [optional, helps the AI avoid repeating what hasn't worked]

Format: [number of options, length, structure]
```

Fill in the blanks. Paste it in. Watch the difference.

<div class="callout callout-try">
  <span class="callout-icon">⚡</span>
  <div>
    <strong>Try this now.</strong>
    <p>Take whatever you were last going to ask an AI (or are about to ask one). Rewrite it using the template above. Then paste both versions into ChatGPT or Claude and compare the answers side by side.</p>
    <p>Takes 2 minutes. Shows you the difference better than any lesson can.</p>
  </div>
</div>

<div class="prompt-grader" data-lesson-key="beginner/first-prompts/anatomy-of-a-prompt" data-task="Write a prompt for an AI to draft a short promotional email. Include all four ingredients: role, task, context, format. We will grade it and suggest improvements."></div>

## Don't overthink it

You don't need all four ingredients for every prompt. *"Translate this email to French"* is fine on its own. The four-ingredient structure matters when the answer needs to fit *your* world, not a generic one.

Rule of thumb: **the bigger the gap between a generic answer and what you actually want, the more context and format you need to provide.**

<div class="quiz" data-quiz-title="Quick check">
  <div class="quiz-q" data-answer="2">
    <p class="quiz-prompt">Which ingredient is missing most often in weak prompts?</p>
    <button class="quiz-option">Role</button>
    <button class="quiz-option">Task</button>
    <button class="quiz-option">Context</button>
    <button class="quiz-option">Format</button>
    <p class="quiz-explain">Context is the one people skip. Without it, the AI invents plausible defaults about who you are and what you want. The defaults are always generic.</p>
  </div>
  <div class="quiz-q" data-answer="0">
    <p class="quiz-prompt">Which of these is the strongest "role" line?</p>
    <button class="quiz-option">"You are a UK-based chartered accountant who specialises in creative agencies between 5 and 20 staff."</button>
    <button class="quiz-option">"You are an accountant."</button>
    <button class="quiz-option">"You are a helpful AI assistant."</button>
    <button class="quiz-option">"You are a professional."</button>
    <p class="quiz-explain">The more specific the role, the better the answer. Include the geography, the specialism, and the rough size of client the role knows.</p>
  </div>
  <div class="quiz-q" data-answer="1">
    <p class="quiz-prompt">You need to send a short message. Do you need all four ingredients?</p>
    <button class="quiz-option">Yes, always all four</button>
    <button class="quiz-option">No, scale the ceremony to the stakes</button>
    <button class="quiz-option">No, you only ever need task</button>
    <button class="quiz-option">Only if the prompt is over 50 words</button>
    <p class="quiz-explain">For quick asks (a translation, a formula, a definition), one line is fine. The four ingredients earn their keep when the answer needs to fit YOUR world, not a generic one.</p>
  </div>
</div>

Next up: [the five most common prompting mistakes](/course/beginner/first-prompts/five-common-mistakes), and the easy fix for each.
