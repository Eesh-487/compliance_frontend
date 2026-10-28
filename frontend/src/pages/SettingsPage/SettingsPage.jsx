import { useState } from 'react';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import PageHeader from '../../components/PageHeader/PageHeader';
import { useLlmConfig } from '../../hooks/useLlmConfig';
import { CUSTOM, LLM_PRESETS, findPreset, presetIdForBaseUrl } from './llmPresets';
import styles from './SettingsPage.module.css';

// Form state for a given base URL + model: picks the matching provider preset,
// and falls back to the free-text model input when the model isn't listed.
function formFor(baseUrl, model) {
  const providerId = presetIdForBaseUrl(baseUrl);
  const preset = findPreset(providerId);
  return {
    providerId,
    customModel: !preset || !preset.models.includes(model),
    base_url: baseUrl,
    model,
    api_key: '',
  };
}

const DEFAULT_FORM = formFor(LLM_PRESETS[0].baseUrl, LLM_PRESETS[0].models[0]);

function SettingsPage() {
  const { data: current, saveConfig, saveStatus, saveError } = useLlmConfig();
  const [form, setForm] = useState(DEFAULT_FORM);
  const preset = findPreset(form.providerId);

  const update = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const onProviderChange = (event) => {
    const next = findPreset(event.target.value);
    setForm((prev) =>
      next
        ? { ...prev, providerId: next.id, base_url: next.baseUrl, model: next.models[0], customModel: false }
        : { ...prev, providerId: CUSTOM, base_url: '', model: '', customModel: true },
    );
  };

  const onModelChange = (event) => {
    const { value } = event.target;
    setForm((prev) =>
      value === CUSTOM ? { ...prev, model: '', customModel: true } : { ...prev, model: value, customModel: false },
    );
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const { base_url, api_key, model } = form;
    // The key is only sent to the backend, never stored in the browser.
    saveConfig({ base_url, api_key, model }, { onSuccess: () => setForm((prev) => ({ ...prev, api_key: '' })) });
  };

  const isRemote = current?.provider === 'remote';

  return (
    <section className={styles.page}>
      <PageHeader
        eyebrow="Settings"
        title="LLM Provider"
        description="Point every pipeline stage at any OpenAI-compatible API (OpenAI, Groq, OpenRouter, Ollama, ...) instead of the local MLX model. The key is held in backend memory only and is cleared when the backend restarts."
      />

      <Card
        title="Current"
        actions={
          isRemote ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setForm(formFor(current.base_url, current.model))}
            >
              Edit
            </Button>
          ) : null
        }
      >
        <p className={styles.status}>
          {current
            ? isRemote
              ? `Remote · ${current.model} · ${current.base_url || 'api.openai.com'}${current.has_api_key ? ' · key set' : ''}`
              : `Local MLX · ${current.model}`
            : 'Loading…'}
        </p>
      </Card>

      <Card title={isRemote ? 'Edit API' : 'Use an API'}>
        <form className={styles.form} onSubmit={onSubmit}>
          <label className={styles.field}>
            <span className={styles.label}>Provider</span>
            <select className={styles.input} value={form.providerId} onChange={onProviderChange}>
              {LLM_PRESETS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
              <option value={CUSTOM}>Custom (enter base URL)</option>
            </select>
            {preset ? <span className={styles.hint}>{preset.baseUrl}</span> : null}
          </label>
          {preset ? null : (
            <label className={styles.field}>
              <span className={styles.label}>Base URL</span>
              <input
                className={styles.input}
                type="url"
                value={form.base_url}
                onChange={update('base_url')}
                placeholder="https://your-provider.example.com/v1 (blank = OpenAI)"
              />
            </label>
          )}
          <label className={styles.field}>
            <span className={styles.label}>Model</span>
            {preset ? (
              <select
                className={styles.input}
                value={form.customModel ? CUSTOM : form.model}
                onChange={onModelChange}
              >
                {preset.models.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
                <option value={CUSTOM}>Other…</option>
              </select>
            ) : null}
            {form.customModel ? (
              <input
                className={styles.input}
                value={form.model}
                onChange={update('model')}
                placeholder="Model ID, e.g. gemini-3.8-flash"
                required
              />
            ) : null}
          </label>
          <label className={styles.field}>
            <span className={styles.label}>API key</span>
            <input
              className={styles.input}
              type="password"
              autoComplete="off"
              value={form.api_key}
              onChange={update('api_key')}
              placeholder={
                current?.has_api_key
                  ? 'Leave blank to keep the current key'
                  : 'Leave blank for keyless servers like Ollama'
              }
            />
          </label>
          {saveError ? <p className={styles.error}>{saveError.message}</p> : null}
          <div className={styles.actions}>
            <Button type="submit" isLoading={saveStatus === 'pending'}>
              Save
            </Button>
            {isRemote ? (
              <Button variant="secondary" onClick={() => saveConfig({ base_url: '', api_key: '', model: '' })}>
                Use local MLX
              </Button>
            ) : null}
          </div>
        </form>
      </Card>
    </section>
  );
}

export default SettingsPage;
