---
title: Sharing a GPT with your team safely
duration: 6
summary: Three ways to share, when to use each, and the gotchas most teams learn the hard way.
---

The point of a custom GPT is often to give your team a shortcut to your process. Here's how to share without regret.

## The three sharing options

When you save a GPT, you pick one of three visibility settings.

### 1. Only me (private)

The GPT is visible only in your own ChatGPT account. Useful when you're still refining it, or when it's a personal tool.

**Use when:** you're testing, iterating, or it's a personal assistant.

### 2. Only people with the link

You get a sharing URL. Anyone with that link can add the GPT to their account and use it. But they **must have ChatGPT Plus** themselves.

**Use when:** you want to share with colleagues, clients, or collaborators without making it public.

**Watch out:** anyone with the link can share the link onward. If the GPT contains sensitive instructions or files, treat the link like an internal document.

### 3. Public (anyone)

The GPT appears in the public GPT store. Anyone with ChatGPT Plus can find and use it.

**Use when:** you want the GPT to be a marketing asset, a lead magnet, or just something you're proud of.

**Watch out:** your Instructions are **visible to users** who know where to look. Don't put secrets in them.

## The three gotchas every team hits

### 1. Instructions leak

Users can often extract the exact text of your Instructions. Don't put anything confidential there. Treat Instructions like they'll end up on a public forum, because occasionally they do.

This is especially important if your GPT contains pricing rules, private commentary about competitors, or anything else you wouldn't want shared.

### 2. Knowledge files leak too

Files you upload as Knowledge can be read by the GPT out loud if a user asks cleverly. Same rule: don't upload anything you wouldn't want quoted.

If the file is genuinely confidential (client data, financials, IP), either:

- Don't upload it, or
- Use Actions to fetch the data live from an authenticated system, instead of baking it into the GPT.

### 3. Team GPTs drift

If you build a GPT once and share it, then update it six months later, **everyone who added it gets the new version automatically**. That's mostly a feature. But if someone had it working beautifully for their workflow, a change you made for your own use can break theirs.

The fix: for widely-shared GPTs, version them. Name a new one *"Client Onboarding v2"* and keep the old one running until people are ready to migrate.

## The ChatGPT Team / Enterprise option

If you're a company with several users, **ChatGPT Team** (around £22/user/month) or Enterprise gives you:

- A shared workspace for custom GPTs.
- Proper admin controls.
- Data isolation (your data is not used for training).
- Shared usage limits.

For anything more than a handful of users, Team is the right buy.

## What to share vs what to keep private

Good candidates for sharing with your team:

- **Onboarding assistant** (new hire reads the FAQ, tries the GPT).
- **Writing assistant** (everyone drafts in the same voice).
- **Research assistant** (internal knowledge base, one place to ask).
- **Process helper** (runs a checklist, asks the right questions).

Keep private:

- GPTs that contain personal info about you or your relationships with clients.
- GPTs that reflect your personal strategic thinking.
- GPTs containing pricing, commercial terms, or competitive analysis.

## The hygiene rule

Once a quarter, **re-read every Instruction block and Knowledge file** for every GPT you've shared. It's astonishing how much of your business's recent thinking gets baked into these tools without you noticing.

Last lesson in this module: [five custom GPTs you can copy directly and adapt](/course/intermediate/custom-gpts/five-gpts-to-copy).
