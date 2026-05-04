// Live model-comparison sandbox. Given a prompt + a set of models,
// streams responses from each provider in parallel.
//
// Usage:
//   const { runSandbox, AVAILABLE_MODELS, isConfigured } = require('./lib/model-sandbox');
//   await runSandbox({ prompt, models: ['gpt-4o-mini', 'claude-haiku'] }, onEvent);
//
// The onEvent callback receives { type, model, text?, elapsedMs?, usage?, error? }
// events as the streams progress.

const Anthropic = require('@anthropic-ai/sdk');

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

const AVAILABLE_MODELS = {
  'gpt-4o-mini': {
    provider: 'openai',
    model: 'gpt-4o-mini',
    label: 'GPT-4o mini',
    vendor: 'OpenAI',
    speed: 'Fast',
    note: 'Cheap, quick, good for bulk tasks',
  },
  'gpt-4o': {
    provider: 'openai',
    model: 'gpt-4o',
    label: 'GPT-4o',
    vendor: 'OpenAI',
    speed: 'Medium',
    note: 'Smarter, better at nuance',
  },
  'claude-haiku': {
    provider: 'anthropic',
    model: 'claude-haiku-4-5-20251001',
    label: 'Claude Haiku 4.5',
    vendor: 'Anthropic',
    speed: 'Fast',
    note: 'Very quick, strong writing',
  },
};

const DEFAULT_MODELS = ['gpt-4o-mini', 'claude-haiku'];

function isConfigured() {
  return {
    openai: Boolean(process.env.OPENAI_API_KEY),
    anthropic: Boolean(process.env.ANTHROPIC_API_KEY),
  };
}

function validateRequest({ prompt, models }) {
  if (!prompt || typeof prompt !== 'string') {
    return { ok: false, error: 'empty', message: 'Type a prompt first.' };
  }
  const trimmed = prompt.trim();
  if (trimmed.length < 3) return { ok: false, error: 'too-short', message: 'Your prompt is too short. Try a full sentence.' };
  if (trimmed.length > 2000) return { ok: false, error: 'too-long', message: 'Keep prompts under 2,000 characters for the sandbox.' };
  if (!Array.isArray(models) || models.length === 0) return { ok: false, error: 'no-models', message: 'Pick at least one model.' };
  if (models.length > 3) return { ok: false, error: 'too-many', message: 'You can compare up to 3 models at once.' };
  for (const slug of models) {
    if (!AVAILABLE_MODELS[slug]) return { ok: false, error: 'bad-model', message: `Unknown model: ${slug}` };
  }
  return { ok: true, prompt: trimmed, models };
}

// --- OpenAI streaming via native fetch (SSE). No SDK dep for OpenAI. ---
async function streamOpenAI({ prompt, model, onDelta, onDone, onError }) {
  const start = Date.now();
  let res;
  try {
    res = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        stream: true,
        // Without stream_options.include_usage, OpenAI emits usage=null on every
        // streamed chunk. Asking for it adds a final chunk with total token counts.
        stream_options: { include_usage: true },
        temperature: 0.7,
        max_tokens: 700,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
  } catch (err) {
    return onError({ message: 'Could not reach OpenAI. Try again.' });
  }

  if (!res.ok || !res.body) {
    const bodyText = await res.text().catch(() => '');
    console.error(`OpenAI stream ${res.status}: ${bodyText.slice(0, 300)}`);
    if (res.status === 401) return onError({ message: 'OpenAI key is not configured properly.' });
    if (res.status === 429) return onError({ message: 'OpenAI rate limit hit. Try again in a minute.' });
    return onError({ message: 'OpenAI had a hiccup. Try again.' });
  }

  const decoder = new TextDecoder();
  let buffer = '';
  let inputTokens = 0;
  let outputTokens = 0;
  try {
    for await (const chunk of res.body) {
      buffer += decoder.decode(chunk, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line.startsWith('data:')) continue;
        const payload = line.slice(5).trim();
        if (payload === '[DONE]') continue;
        try {
          const event = JSON.parse(payload);
          const delta = event.choices && event.choices[0] && event.choices[0].delta && event.choices[0].delta.content;
          if (delta) onDelta(delta);
          if (event.usage) {
            inputTokens = event.usage.prompt_tokens || 0;
            outputTokens = event.usage.completion_tokens || 0;
          }
        } catch (_) { /* ignore malformed keep-alive lines */ }
      }
    }
  } catch (err) {
    return onError({ message: 'OpenAI stream interrupted.' });
  }

  onDone({ elapsedMs: Date.now() - start, inputTokens, outputTokens });
}

// --- Anthropic streaming via SDK. ---
async function streamAnthropic({ prompt, model, onDelta, onDone, onError }) {
  const start = Date.now();
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const stream = client.messages.stream({
      model,
      max_tokens: 700,
      temperature: 0.7,
      messages: [{ role: 'user', content: prompt }],
    });

    stream.on('text', (text) => onDelta(text));
    stream.on('error', (err) => {
      console.error('Anthropic stream error:', err.message);
      onError({ message: 'Anthropic stream interrupted.' });
    });

    const final = await stream.finalMessage();
    const inputTokens = (final.usage && final.usage.input_tokens) || 0;
    const outputTokens = (final.usage && final.usage.output_tokens) || 0;
    onDone({ elapsedMs: Date.now() - start, inputTokens, outputTokens });
  } catch (err) {
    console.error('Anthropic call failed:', err.message);
    if (err.status === 401) return onError({ message: 'Anthropic key is not configured properly.' });
    if (err.status === 429) return onError({ message: 'Anthropic rate limit hit. Try again in a minute.' });
    onError({ message: 'Anthropic had a hiccup. Try again.' });
  }
}

// Fan out to each selected model concurrently. The emit callback is called
// synchronously as events happen in any order. Returns a promise that
// resolves once every stream has emitted either `done` or `error`.
async function runSandbox({ prompt, models }, emit) {
  const configured = isConfigured();

  const tasks = models.map(async (slug) => {
    const def = AVAILABLE_MODELS[slug];
    if (def.provider === 'openai' && !configured.openai) {
      return emit({ type: 'error', model: slug, message: 'OpenAI is not switched on yet.' });
    }
    if (def.provider === 'anthropic' && !configured.anthropic) {
      return emit({ type: 'error', model: slug, message: 'Anthropic is not switched on yet.' });
    }

    emit({ type: 'start', model: slug });

    const onDelta = (text) => emit({ type: 'delta', model: slug, text });
    const onDone = ({ elapsedMs, inputTokens, outputTokens }) =>
      emit({ type: 'done', model: slug, elapsedMs, inputTokens, outputTokens });
    const onError = ({ message }) => emit({ type: 'error', model: slug, message });

    if (def.provider === 'openai') {
      return streamOpenAI({ prompt, model: def.model, onDelta, onDone, onError });
    }
    if (def.provider === 'anthropic') {
      return streamAnthropic({ prompt, model: def.model, onDelta, onDone, onError });
    }
  });

  await Promise.allSettled(tasks);
  emit({ type: 'all-done' });
}

module.exports = { runSandbox, validateRequest, AVAILABLE_MODELS, DEFAULT_MODELS, isConfigured };
