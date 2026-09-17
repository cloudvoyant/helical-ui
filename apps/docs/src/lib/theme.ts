// apps/docs/src/lib/theme.ts
// Color-mode (light/dark/system) and theme-preset helpers for the docs shell.
// Ported from diffbook; localStorage keys are intentionally unchanged and all
// document/localStorage access is guarded for SSR safety.
import { THEME_NAMES } from '@cloudvoyant/helical-ui';

export const COLOR_MODE_KEY = 'vortex:color-mode' as const;
export const THEME_KEY = 'vortex:theme' as const;
export type ColorMode = 'light' | 'dark' | 'system';
export type ThemeName = string; // any helical-ui theme name — see @cloudvoyant/helical-ui THEMES

const THEME_PREFIX = 'theme-';

// ── Color mode ───────────────────────────────────────────────────────────

/** Whether the OS currently prefers a dark color scheme. */
function systemPrefersDark(): boolean {
  return (
    typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

/**
 * Read the persisted color-mode PREFERENCE from localStorage: 'light', 'dark',
 * or 'system' (follow the OS). Falls back to 'system' when unavailable or unset.
 */
export function getInitialColorMode(): ColorMode {
  if (typeof window === 'undefined') return 'system';
  try {
    const saved = localStorage.getItem(COLOR_MODE_KEY);
    if (saved === 'dark' || saved === 'light' || saved === 'system') return saved;
  } catch {
    /* storage unavailable */
  }
  return 'system';
}

/** Resolve a preference to the effective applied mode ('system' → OS preference). */
export function resolveColorMode(mode: ColorMode): 'light' | 'dark' {
  return mode === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : mode;
}

/**
 * Apply a color-mode preference by toggling the `.dark` class on <html> to the
 * resolved effective mode, and persist the raw preference (incl. 'system').
 * Unknown values are ignored so the persisted preference stays in the registry.
 */
export function applyColorMode(mode: ColorMode): void {
  if (typeof document === 'undefined') return;
  if (mode !== 'light' && mode !== 'dark' && mode !== 'system') return;
  document.documentElement.classList.toggle('dark', resolveColorMode(mode) === 'dark');
  try {
    localStorage.setItem(COLOR_MODE_KEY, mode);
  } catch {
    /* storage unavailable */
  }
}

// ── Theme ────────────────────────────────────────────────────────────────

/**
 * Read the persisted theme from localStorage. Falls back to the helical-ui brand theme.
 */
export function getInitialTheme(): ThemeName {
  if (typeof window === 'undefined') return 'helical-ui';
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved && THEME_NAMES.includes(saved)) return saved;
  } catch {
    /* storage unavailable */
  }
  return 'helical-ui';
}

/**
 * Apply a theme by swapping the `theme-*` class on <html>. Every theme (including
 * 'default') has a `.theme-{name}` block from its copied file, so we always set
 * the class. Also persists the choice to localStorage. Unknown names are ignored
 * so the persisted value stays consistent with the THEMES registry.
 */
export function applyTheme(name: ThemeName): void {
  if (typeof document === 'undefined') return;
  if (!THEME_NAMES.includes(name)) return;
  const root = document.documentElement;
  const toRemove: string[] = [];
  root.classList.forEach((cls) => {
    if (cls.startsWith(THEME_PREFIX)) toRemove.push(cls);
  });
  for (const cls of toRemove) root.classList.remove(cls);
  root.classList.add(`${THEME_PREFIX}${name}`);
  try {
    localStorage.setItem(THEME_KEY, name);
  } catch {
    /* storage unavailable */
  }
}
