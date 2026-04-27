const fs = require('fs');
const path = require('path');

const OPENAI_MODEL = process.env.OPENAI_WORKSHEET_MODEL || 'gpt-4o-mini';
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

const WORKSHEETS_DIR = path.join(__dirname, '..', 'course-content', 'worksheets');
const _cache = new Map();

function loadWorksheet(tier) {
  if (_cache.has(tier)) return _cache.get(tier);
  const file = path.join(WORKSHEETS_DIR, `${tier}.json`);
  if (!fs.existsSync(file)) return null;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  _cache.set(tier, data);
  return data;
}

function sanitiseAnswer(ws, id, value) {
  const q = ws.questions.find(q => q.id === id);
  if (!q) return null;
  const s = String(value == null ? '' : value).trim();
  if (!s) return q.required ? null : '';
  if (q.type === 'radio') {
    if (!q.options.includes(s)) return null;
    return s;
  }
  if (q.maxLength && s.length > q.maxLength) return s.slice(0, q.maxLength);
  return s;
}

async function generateWorksheet({ tier, answers }) {
  const ws = loadWorksheet(tier);
  if (!ws) return { ok: false, error: 'no-worksheet', message: 'No worksheet for that tier.' };

  if (!process.env.OPENAI_API_KEY) {
    return { ok: false, error: 'not-configured', message: "This feature isn't switched on yet." };
  }

  const cleaned = {};
  for (const q of ws.questions) {
    const v = sanitiseAnswer(ws, q.id, answers ? answers[q.id] : null);
    if (v === null) return { ok: false, error: 'missing', message: `Please answer: ${q.label}.` };
    cleaned[q.id] = v;
  }

  const userContent = 'The learner has answered:\n\n' +
    ws.questions.map(q => `- ${q.label}: ${cleaned[q.id] || '(not provided)'}`).join('\n');

  let res;
  try {
    res = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 0.4,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: ws.systemPrompt },
          { role: 'user', content: userContent },
        ],
      }),
    });
  } catch (err) {
    console.error('Worksheet fetch failed:', err.message);
    return { ok: false, error: 'network', message: 'Could not reach the generator. Try again in a moment.' };
  }

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    console.error(`Worksheet OpenAI ${res.status}: ${txt.slice(0, 300)}`);
    if (res.status === 429) return { ok: false, error: 'rate-limited', message: 'Too many requests right now. Try again in a minute.' };
    return { ok: false, error: 'upstream', message: 'The generator had a hiccup. Try again.' };
  }

  const data = await res.json();
  const content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  if (!content) return { ok: false, error: 'empty', message: 'Empty response from generator. Try again.' };

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (err) {
    console.error('Worksheet parse failed:', err.message);
    return { ok: false, error: 'parse', message: 'The generator returned an unexpected format. Try again.' };
  }

  const sections = Array.isArray(parsed.sections) ? parsed.sections
    .filter(s => s && typeof s === 'object' && s.body)
    .slice(0, 8)
    .map(s => ({
      heading: String(s.heading || '').slice(0, 200),
      type: ['prompt', 'note', 'claude-md', 'tip'].includes(s.type) ? s.type : 'note',
      body: String(s.body || '').slice(0, 4000),
    })) : [];

  return {
    ok: true,
    tier,
    title: String(parsed.title || ws.title).slice(0, 200),
    intro: String(parsed.intro || '').slice(0, 600),
    sections,
    nextStep: String(parsed.nextStep || '').slice(0, 400),
    answers: cleaned,
    generatedAt: new Date().toISOString(),
  };
}

function renderMarkdown(result) {
  const lines = [];
  lines.push(`# ${result.title}`);
  lines.push('');
  if (result.intro) { lines.push(result.intro); lines.push(''); }
  for (const s of result.sections) {
    lines.push(`## ${s.heading}`);
    lines.push('');
    lines.push(s.body);
    lines.push('');
  }
  if (result.nextStep) {
    lines.push('## Your next step');
    lines.push('');
    lines.push(result.nextStep);
    lines.push('');
  }
  lines.push('---');
  lines.push(`Generated on ${new Date(result.generatedAt).toLocaleDateString('en-GB')} from smashyourai.com`);
  return lines.join('\n');
}

function renderHtmlEmail(result) {
  const escape = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const sectionsHtml = result.sections.map(s => `
    <div style="background:#fafafa;border:1px solid #e5e7eb;border-radius:10px;padding:16px 18px;margin:0 0 14px;">
      <h3 style="margin:0 0 10px;font-size:16px;font-weight:700;color:#1f2937;">${escape(s.heading)}</h3>
      <pre style="margin:0;white-space:pre-wrap;word-break:break-word;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;line-height:1.5;color:#111827;background:#fff;padding:12px;border-radius:8px;border:1px solid #e5e7eb;">${escape(s.body)}</pre>
    </div>
  `).join('');

  return `<!DOCTYPE html><html><body style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#f9fafb;margin:0;padding:24px;">
    <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:14px;padding:28px 30px;box-shadow:0 1px 3px rgba(0,0,0,.05);">
      <p style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;color:#7c3aed;margin:0 0 6px;">Smash Your AI</p>
      <h1 style="margin:0 0 10px;font-size:24px;color:#111827;">${escape(result.title)}</h1>
      ${result.intro ? `<p style="color:#4b5563;line-height:1.55;margin:0 0 20px;">${escape(result.intro)}</p>` : ''}
      ${sectionsHtml}
      ${result.nextStep ? `<div style="background:linear-gradient(135deg,#f5f3ff,#eef2ff);border:1px solid #c4b5fd;border-radius:10px;padding:14px 16px;margin-top:18px;"><p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;color:#6d28d9;">Your next step</p><p style="margin:0;color:#1f2937;line-height:1.55;">${escape(result.nextStep)}</p></div>` : ''}
      <p style="color:#9ca3af;font-size:12px;margin-top:24px;border-top:1px solid #f3f4f6;padding-top:14px;">Generated for you at <a href="https://smashyourai.com/course" style="color:#6d28d9;text-decoration:none;">smashyourai.com</a>.</p>
    </div>
  </body></html>`;
}

module.exports = { loadWorksheet, generateWorksheet, renderMarkdown, renderHtmlEmail };
