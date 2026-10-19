export type Theme = 'light' | 'dark';
const THEME_KEY = 'mini-library.theme';

export function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    /* Theme remains usable when browser storage is unavailable. */
  }
  return typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'dark' ? '#141c29' : '#f6f5f1');
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* A preference is optional. */
  }
}
