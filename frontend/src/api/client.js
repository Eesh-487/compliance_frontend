// VITE_API_BASE_URL (set in Vercel or a local .env) overrides both defaults:
// the local backend during `npm run dev`, the Tailscale Funnel URL in builds.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? 'http://127.0.0.1:8000' : 'https://eesh.tail793a05.ts.net');

const LONG_REQUEST_MS = 10 * 60 * 1000;

function buildUrl(path) {
  return `${API_BASE_URL}${path}`;
}

function normalizeError(status, payload, fallbackMessage) {
  const messageFromPayload =
    payload?.message || payload?.detail || payload?.error || fallbackMessage;

  return {
    message: messageFromPayload || 'Request failed',
    status,
    details: payload,
  };
}

export async function apiRequest(path, options = {}) {
  const {
    method = 'GET',
    body,
    headers = {},
    timeoutMs,
    isFormData = false,
  } = options;

  const controller = new AbortController();
  const requestTimeout = timeoutMs ?? LONG_REQUEST_MS;
  const timer = setTimeout(() => controller.abort(), requestTimeout);

  try {
    const fetchHeaders = { ...headers };
    let payloadBody = body;

    if (body && !isFormData) {
      fetchHeaders['Content-Type'] = 'application/json';
      payloadBody = JSON.stringify(body);
    }

    const response = await fetch(buildUrl(path), {
      method,
      headers: fetchHeaders,
      body: payloadBody,
      signal: controller.signal,
    });

    const rawText = await response.text();
    let data = null;

    if (rawText) {
      try {
        data = JSON.parse(rawText);
      } catch {
        data = { message: rawText };
      }
    }

    if (!response.ok) {
      throw normalizeError(response.status, data, `Request failed: ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw {
        message: 'Request timed out. Please try again.',
        status: 408,
      };
    }

    if (error.status) {
      throw error;
    }

    throw normalizeError(
      500,
      error,
      'Unable to reach backend. Check API base URL and server status.',
    );
  } finally {
    clearTimeout(timer);
  }
}

export { API_BASE_URL, LONG_REQUEST_MS };
