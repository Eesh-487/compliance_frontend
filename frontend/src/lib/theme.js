import { useSyncExternalStore } from 'react';

// Appearance preference: 'system' | 'light' | 'dark'. The resolved theme is
// written to <html data-theme>, which tokens.css keys the dark palette off.
// index.html runs the same resolution inline before first paint.
const KEY = 'theme';
const media = window.matchMedia('(prefers-color-scheme: dark)');

export function readPreference() {
  try {
    const value = localStorage.getItem(KEY);
    return value === 'light' || value === 'dark' ? value : 'system';
  } catch {
    return 'system';
  }
}

function apply(preference) {
  const theme = preference === 'system' ? (media.matches ? 'dark' : 'light') : preference;
  document.documentElement.dataset.theme = theme;
}

export function setPreference(preference) {
  try {
    if (preference === 'system') {
      localStorage.removeItem(KEY);
    } else {
      localStorage.setItem(KEY, preference);
    }
  } catch {
    // Storage blocked: the choice still applies for this visit.
  }
  apply(preference);
}

media.addEventListener('change', () => apply(readPreference()));
apply(readPreference());

function subscribe(callback) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

/** The resolved theme ('light' | 'dark'), re-rendering when it changes. */
export function useResolvedTheme() {
  return useSyncExternalStore(subscribe, () => document.documentElement.dataset.theme);
}
