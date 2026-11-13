// libs/helical-ui/src/light-switch.ts

// 1. Imports
import { cva, type VariantProps } from 'class-variance-authority';

// 2. Module constants & types
export type ThemeMode = 'light' | 'dark' | 'system';

export interface LightSwitchBaseProps {
  mode?: ThemeMode;
  defaultMode?: ThemeMode;
  onModeChange?: (mode: ThemeMode) => void;
}

const THEME_CLASS_PREFIX = 'theme-';
const DEFAULT_THEME = 'helical-ui';

export const lightSwitchButtonVariants = cva('ml-auto h-[26px] w-[26px] p-1');
export type LightSwitchButtonVariants = VariantProps<typeof lightSwitchButtonVariants>;

// 4. Exported functions
/**
 * Cycles a color-mode preference through `'system' -> 'light' -> 'dark' -> 'system'`.
 */
export function cycleThemeModeValue(mode: ThemeMode): ThemeMode {
  return mode === 'system' ? 'light' : mode === 'light' ? 'dark' : 'system';
}

/**
 * Reads whether the operating system currently prefers a dark color scheme via `matchMedia`.
 */
export function readSystemDarkMode(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
}

/**
 * Subscribes to operating system `prefers-color-scheme: dark` media query changes.
 * Returns an unsubscribe function.
 */
export function subscribeSystemDarkMode(onChange: (dark: boolean) => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => {};
  }
  try {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (event: MediaQueryListEvent) => onChange(event.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  } catch {
    return () => {};
  }
}

/**
 * Reads whether `document.documentElement` currently has the `dark` class applied.
 */
export function readDocumentDarkMode(): boolean {
  if (typeof document === 'undefined') return readSystemDarkMode();
  return document.documentElement.classList.contains('dark');
}

/**
 * Toggles the `dark` class on `document.documentElement` while preserving the active `theme-*` class.
 */
export function syncDocumentDarkMode(dark: boolean): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const hasThemeClass = Array.from(root.classList).some((cls) => cls.startsWith(THEME_CLASS_PREFIX));
  if (!hasThemeClass) {
    root.classList.add(`${THEME_CLASS_PREFIX}${DEFAULT_THEME}`);
  }
  root.classList.toggle('dark', dark);
}
