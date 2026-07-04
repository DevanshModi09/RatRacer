export type ThemeName = 'ratracer' | 'ratracer-light';

const STORAGE_KEY = 'ratracer-theme';

export function getStoredTheme(): ThemeName {
  if (typeof window === 'undefined') return 'ratracer';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'ratracer-light' ? 'ratracer-light' : 'ratracer';
}

export function applyTheme(theme: ThemeName) {
  document.documentElement.setAttribute('data-theme', theme);
  window.localStorage.setItem(STORAGE_KEY, theme);
}
