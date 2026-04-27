---
title: AI in Google Sheets and Excel
duration: 10
summary: Writing formulas in English, analysing a block of data, and spotting the signal in the noise. No macros needed.
---

If spreadsheets are part of your job, AI inside Sheets and Excel is one of the highest-value upgrades you can make. It changes who can do data work.

## Two options, briefly

- **Google Sheets** has Gemini built in on most Workspace plans.
- **Microsoft Excel** has Copilot on the paid Copilot for Microsoft 365 add-on (around £22/user/month).

Both let you do the three things this lesson covers. The commands differ slightly, but the patterns are the same.

If you don't have either, you can still use this lesson's techniques by copy-pasting your data into ChatGPT, Claude, or Gemini. A bit clunkier, same concepts.

## Use 1: writing formulas in plain English

The biggest win. You describe what you want. The AI writes the formula.

### Example

You've got a sheet with columns A (Customer), B (Last purchase date), C (Lifetime spend).

You want: a column that flags anyone whose last purchase was over 90 days ago and who's spent over £300 lifetime.

Ask the AI:

> Write a formula for column D that says "Reactivate" if column B is more than 90 days ago AND column C is greater than 300. Otherwise, show nothing.

You'll get:

```
=IF(AND(B2<TODAY()-90, C2>300), "Reactivate", "")
```

Paste it in, drag it down, done.

**The prompt habit:** describe **the logic in English**. Never try to describe the formula. Let the AI translate.

### More formula-writing examples worth stealing

- *"Write a formula that counts how many rows in column B contain 'paid' (case-insensitive)."*
- *"Write a formula to extract the first word of every entry in column A."*
- *"Write a formula that returns the average of column C, but only for rows where column B is 'London'."*
- *"Write a formula to convert a date in column A to the day of the week name."*

## Use 2: analysing a block of data

Instead of writing a formula, you can just ask a question about the data.

### In Google Sheets

Open the Gemini side panel. Highlight a range. Ask:

> What's the trend in column C over the last 12 months? Are there any outliers I should look at?

Gemini reads the data and answers.

### In Excel

Open Copilot pane. Same thing.

### Without either

Select and copy the data. Paste into ChatGPT. Say:

> Here's [what the data is]. Tell me the trend. Flag any outliers. Suggest one follow-up question worth asking.

### What it's genuinely good at

- Spotting trends
- Calling out weird rows ("the August number looks off compared to the rest")
- Comparing segments ("Customers in group A spend 40% more than group B")
- Writing a plain-English summary of a table

### What it's less good at

- Long-range statistical analysis with hundreds of thousands of rows
- Anything requiring very precise numeric answers beyond about 4-5 digit arithmetic
- Judging causality (it can describe a trend; it can't always tell you why)

## Use 3: cleaning messy data

A wildly underused trick.

### Example

You've got a column of 500 customer addresses. Each written differently. Some have postcodes, some don't. Some are shortened.

Paste a sample into the AI:

> Below is a sample of 20 messy addresses from a customer list. Convert each into a clean structured format with these columns:
>
> line_1, line_2, town, county, postcode
>
> Return as CSV. If any field is unclear, put "N/A".
>
> [paste]

Do the same with the full batch (or chunks if it's huge) and you've cleaned in 10 minutes what would have taken a day.

Similarly:

- Convert a list of phone numbers into a consistent format.
- Normalise dates written different ways.
- Standardise country or city spellings.

<div class="callout callout-scenario">
  <span class="callout-icon">🎬</span>
  <div>
    <strong>Scenario: the gym owner's messy list.</strong>
    <p>A small gym owner exports her member list to Google Sheets. 340 members, but the data is a state: some have two spaces in the name, some have phone numbers formatted five different ways, some have nicknames instead of full names.</p>
    <p>Instead of spending a Saturday cleaning it, she pastes 30 sample rows into Gemini and asks: <em>"Give me a formula (or set of formulas) that would: title-case the name, strip extra spaces, and put all phone numbers in the format 07XXX XXX XXX."</em></p>
    <p>Ten minutes. Drag the formulas down. Done. The afternoon she got back was worth more than any membership upgrade she sold that month.</p>
  </div>
</div>

## Three habits worth building

### Habit 1: always ask "is there a formula that can do this?"

Before you spend 30 minutes manually sorting, filtering, counting, ask the AI. Nine times out of ten there's a formula, and the AI writes it in seconds.

### Habit 2: paste a sample, not the whole sheet, for quick answers

For quick insight, paste 50 rows, not 5,000. The AI's answer will be just as useful, and it'll be 5x faster.

### Habit 3: always sanity-check the output

AI-generated formulas usually work. When they don't, the failure is silent. Always check with 2-3 sample rows whether the result is what you'd expect.

Next up: [NotebookLM](/course/intermediate/workflow/notebooklm). The research tool that changes how you read.
