import { useState } from 'react';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import PageHeader from '../../components/PageHeader/PageHeader';
import { useLlmConfig } from '../../hooks/useLlmConfig';
import styles from './SettingsPage.module.css';

function SettingsPage() {
  const { data: current, saveConfig, saveStatus, saveError } = useLlmConfig();
  const [form, setForm] = useState({ base_url: '', api_key: '', model: '' });

  const update = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const onSubmit = (event) => {
    event.preventDefault();
    // The key is only sent to the backend, never stored in the browser.
    saveConfig(form, { onSuccess: () => setForm((prev) => ({ ...prev, api_key: '' })) });
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
              onClick={() => setForm({ base_url: current.base_url, api_key: '', model: current.model })}
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
            <span className={styles.label}>Base URL</span>
            <input
              className={styles.input}
              type="url"
              value={form.base_url}
              onChange={update('base_url')}
              placeholder="https://api.groq.com/openai/v1 (blank = OpenAI)"
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Model</span>
            <input
              className={styles.input}
              value={form.model}
              onChange={update('model')}
              placeholder="e.g. gpt-4o-mini, llama-3.3-70b-versatile"
              required
            />
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
