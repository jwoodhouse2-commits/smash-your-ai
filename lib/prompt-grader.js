const OPENAI_MODEL = process.env.OPENAI_GRADER_MODEL || 'gpt-4o-mini';
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

function buildSystemPrompt({ lessonTitle, task, rubric }) {
  const rubricText = Array.isArray(rubric) ? rubric.map((r, i) => `${i + 1}. ${r}`).join('\n') : String(rubric || '');
  return `You are a patient, expert AI tutor reviewing a learner's prompt for a lesson from an AI course for non-developers.

Lesson: "${lessonTitle}"
Task the learner was asked to write a prompt for: ${task}

Rubric (what a strong answer includes):
${rubricText}

Grade the learner's prompt honestly but encouragingly. Do NOT rewrite it to be perfect unless they are very close already; instead, explain what to change and let them iterate.

Return ONLY valid JSON, no prose before or after, with this exact shape:
{
  "score": <integer 0 to 10>,
  "headline": "<one short sentence verdict, warm tone>",
  "strengths": ["<specific thing done well>", ...],
  "fixes": ["<one specific thing to change next, with why>", ...],
  "rewrite": "<your best version of the learner's prompt, rewritten to meet the rubric. Keep it in their voice where possible.>"
}

Rules:
- British spellings. No em dashes or en dashes (no "—" or "–"). Use full stops and commas.
- Maximum 4 strengths. Maximum 4 fixes. Each bullet under 25 words.
- Be honest about low scores. Do not flatter.
- If the input is off-topic, clearly not a prompt, or empty: score 0, headline "This doesn't look like a prompt for the lesson's task.", one fix explaining what to try, rewrite shows a good example.`;
}

async function gradePrompt({ userPrompt, lessonTitle, task, rubric }) {
  if (!process.env.OPENAI_API_KEY) {
    return {
      ok: false,
      error: 'grader-not-configured',
      message: "The prompt grader isn't switched on yet. We'll flick this on shortly.",
    };
  }

  if (!userPrompt || typeof userPrompt !== 'string' || userPrompt.trim().length < 10) {
    return {
      ok: false,
      error: 'too-short',
      message: 'Write a bit more before asking for a grade. Aim for at least a sentence or two.',
    };
  }
  if (userPrompt.length > 4000) {
    return {
      ok: false,
      error: 'too-long',
      message: 'That is longer than most real prompts. Trim to under 4,000 characters and try again.',
    };
  }

  const system = buildSystemPrompt({ lessonTitle, task, rubric });

  let res;
  try {
    res = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 0.3,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: `Here is my prompt for the lesson task:\n\n${userPrompt}` },
        ],
      }),
    });
  } catch (err) {
    console.error('OpenAI fetch failed:', err.message);
    return { ok: false, error: 'network', message: 'Could not reach the grader. Try again in a moment.' };
  }

  if (!res.ok) {
    const bodyText = await res.text().catch(() => '');
    console.error(`OpenAI ${res.status}: ${bodyText.slice(0, 300)}`);
    if (res.status === 401) return { ok: false, error: 'auth', message: 'The grader is misconfigured. An admin needs to check the API key.' };
    if (res.status === 429) return { ok: false, error: 'rate-limited', message: 'Too many grader requests right now. Try again in a minute.' };
    return { ok: false, error: 'upstream', message: 'The grader had a hiccup. Try again.' };
  }

  const data = await res.json();
  const content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  if (!content) return { ok: false, error: 'empty', message: 'The grader returned nothing. Try again.' };

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (err) {
    console.error('Grader JSON parse failed:', err.message, content.slice(0, 200));
    return { ok: false, error: 'parse', message: 'The grader returned an unexpected format. Try again.' };
  }

  const score = Number.isInteger(parsed.score) ? Math.max(0, Math.min(10, parsed.score)) : 0;
  return {
    ok: true,
    score,
    scoreOutOf: 10,
    headline: String(parsed.headline || '').slice(0, 300),
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 4).map(s => String(s).slice(0, 300)) : [],
    fixes: Array.isArray(parsed.fixes) ? parsed.fixes.slice(0, 4).map(s => String(s).slice(0, 300)) : [],
    rewrite: String(parsed.rewrite || '').slice(0, 4000),
  };
}

module.exports = { gradePrompt };
