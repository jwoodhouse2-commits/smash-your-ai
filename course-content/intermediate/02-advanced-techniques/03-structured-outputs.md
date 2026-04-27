---
title: Structured outputs in JSON, CSV, and markdown tables
duration: 10
summary: How to make AI give you output that's ready to paste into a spreadsheet, a form, or a document. No cleanup needed.
---

Most AI output comes back as prose. Prose is fine for emails. It's terrible for spreadsheets, reports, data extraction, and anything you'll use in a workflow.

The fix: **ask for structure explicitly**.

## The three formats worth knowing

### 1. Markdown tables

For anything you'll read on screen or paste into Notion, Docs, Confluence.

```
Give me the comparison as a markdown table with these columns:
| Option | Monthly cost | Setup time | Best for |
```

You'll get back a proper table, neatly rendered in any modern tool.

### 2. CSV

For anything heading to Excel or Google Sheets.

```
Return the output as CSV (comma-separated). First row is the header.
Columns: name, email, last contacted date, status, priority.
Use "N/A" for missing data. Wrap any string containing a comma
in double quotes.
```

Paste the result into Sheets and it separates cleanly into columns.

### 3. JSON

For anything you'll feed into another tool, a form, an API, or a script.

```
Return the response as a JSON array of objects with this schema:
[
  { "title": string, "summary": string (max 140 chars),
    "tag": "urgent" | "normal" | "low" }
]
Return ONLY the JSON array. No preamble, no markdown code fences.
```

JSON is the most brittle format (any typo and it's broken), so be very specific in your prompt.

## The golden rules

### Rule 1: Show the shape

Don't say *"return as JSON"*. Say *"return as JSON in this exact format"* and then give a dummy example:

```
[
  { "name": "Jane Smith", "email": "jane@example.com", "status": "active" }
]
```

The AI matches the shape.

### Rule 2: Ask for the format again at the end

LLMs drift when prompts are long. End your prompt with a final instruction like *"Return ONLY the JSON. No commentary."* That last line is the one the AI pays closest attention to.

### Rule 3: Don't trust JSON from small free models

The free tiers of some tools occasionally produce JSON with trailing commas, missing brackets, or stray markdown fences. For important workflows, either:

- Use a paid model (ChatGPT Plus, Claude Pro, Gemini Advanced). They're much more reliable.
- Or use a small script/tool to sanity-check the JSON before using it.

## Real uses worth trying today

### Extract action items from a meeting transcript

```
Below is a meeting transcript. Extract every action item.
Return as a markdown table with columns:
| Owner | Action | Due date (DD/MM/YYYY) | Source quote |

Use "Unassigned" if the owner is not clear.
Use "Not specified" if the date is not mentioned.

[paste transcript]
```

Paste into Notion, job done.

### Turn a long email thread into a summary spreadsheet

```
Below is an email thread with a supplier. Extract every commitment
made by either side.

Return as CSV with columns:
source, commitment, made_by (me|supplier), due_date

[paste thread]
```

Save the CSV, open in Sheets, follow up systematically.

### Draft social posts ready to schedule

```
Generate 14 Twitter/X posts for the next 2 weeks promoting our
cafe's Tuesday pizza night.

Return as CSV with columns:
post_number, date (DD/MM/YYYY), post_text, suggested_hashtags

Keep each post_text under 240 characters. Space the posts naturally
across the 14 days.
```

Import into Buffer, Later, or Hootsuite.

## Combining with chain-of-thought

The two techniques stack beautifully.

```
Think through this problem step by step first. Then, at the end,
give your final answer in this JSON format:
{
  "decision": "option_a" | "option_b" | "option_c",
  "confidence": "high" | "medium" | "low",
  "top_risk": string,
  "recommended_next_step": string
}

Return the reasoning as plain text, then the JSON at the very end.
```

You get the reasoning you can read, and a structured summary at the bottom ready for a dashboard or form.

## The mental shift

Once you get comfortable with structured outputs, you'll start seeing workflows everywhere.

*"I could ask the AI for structured data here, and then my usual tool takes over."*

That's the bridge between "using AI in conversations" and "building AI-assisted workflows". [The next module picks up this thread with custom GPTs](/course/intermediate/custom-gpts/what-a-custom-gpt-is).

Next up: [roleplay prompts done well](/course/intermediate/advanced-techniques/roleplay-prompts).
