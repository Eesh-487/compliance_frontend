// OpenAI-compatible providers offered in the LLM Provider dropdowns. Model
// lists are suggestions only and will age - "Other..." always allows any model
// ID, and the "Custom" provider allows any base URL.
export const CUSTOM = 'custom';

export const LLM_PRESETS = [
  {
    id: 'google',
    label: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    models: ['gemini-3.8-flash', 'gemini-3.5-flash-lite'],
  },
  {
    id: 'groq',
    label: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    models: ['llama-3.3-70b-versatile', 'qwen/qwen3-32b', 'openai/gpt-oss-120b', 'llama-3.1-8b-instant'],
  },
  {
    id: 'openai',
    label: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    models: ['gpt-4o-mini', 'gpt-4.1-mini', 'gpt-4o'],
  },
  {
    id: 'openrouter',
    label: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    models: ['google/gemini-2.5-flash', 'meta-llama/llama-3.3-70b-instruct', 'deepseek/deepseek-chat'],
  },
];

export function findPreset(id) {
  return LLM_PRESETS.find((preset) => preset.id === id);
}

// Maps a saved base URL back to its preset so "Edit" reopens the right dropdown.
export function presetIdForBaseUrl(baseUrl) {
  const normalize = (url) => (url || '').replace(/\/+$/, '');
  const match = LLM_PRESETS.find((preset) => normalize(preset.baseUrl) === normalize(baseUrl));
  return match ? match.id : CUSTOM;
}
