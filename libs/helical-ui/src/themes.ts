// libs/helical-ui/src/themes.ts
// Theme registry, CSS verification, document synchronization, and cva variants
// for helical-ui's shadcn-compatible theme presets and ThemeSelector.
import { cva, type VariantProps } from 'class-variance-authority';
import { readDocumentDarkMode, type ThemeMode } from './light-switch';

export interface ThemeMeta {
  name: string;
  label: string;
  css?: string;
}

export type ThemeName = string;

export interface ThemeServiceOptions {
  themes?: readonly ThemeMeta[];
  initialTheme?: ThemeName;
  initialMode?: ThemeMode;
  onThemeChange?: (theme: ThemeName) => void;
  onModeChange?: (mode: ThemeMode) => void;
}

export interface ThemeSelectorBaseProps {
  value?: ThemeName;
  defaultValue?: ThemeName;
  themes?: readonly ThemeMeta[];
  customThemes?: readonly ThemeMeta[];
  onValueChange?: (theme: ThemeName) => void;
}

export const THEME_CLASS_PREFIX = 'theme-';
export const DEFAULT_THEME = 'helical-ui';

export const themeSelectorContainerBase = 'max-h-64 overflow-y-auto rounded-md border border-border p-2';
export const themeSelectorGridBase = 'grid grid-cols-2 gap-2';

export const themeSelectorSwatchVariants = cva(
  'relative flex flex-col gap-1.5 overflow-hidden rounded-md border bg-background p-1.5 text-left text-foreground transition-colors',
  {
    variants: {
      active: {
        true: 'border-foreground',
        false: 'border-border hover:border-muted-foreground',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);
export type ThemeSelectorSwatchVariants = VariantProps<typeof themeSelectorSwatchVariants>;

const customThemesWithCss = new Set<string>();

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function ruleListHasThemeSelector(rules: CSSRuleList, pattern: RegExp): boolean {
  for (let i = 0; i < rules.length; i += 1) {
    const rule = rules[i];
    if (!rule) continue;
    if ('selectorText' in rule && typeof (rule as CSSStyleRule).selectorText === 'string') {
      if (pattern.test((rule as CSSStyleRule).selectorText)) {
        return true;
      }
    }
    if ('cssRules' in rule && (rule as CSSGroupingRule).cssRules) {
      if (ruleListHasThemeSelector((rule as CSSGroupingRule).cssRules, pattern)) {
        return true;
      }
    }
  }
  return false;
}

function injectCustomThemeCss(theme: ThemeMeta): void {
  if (theme.css?.trim()) {
    customThemesWithCss.add(theme.name);
  }
  if (typeof document === 'undefined' || !theme.css?.trim()) return;
  const selector = `style[data-helical-custom-theme="${theme.name}"]`;
  let styleEl = document.head.querySelector<HTMLStyleElement>(selector);
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.setAttribute('data-helical-custom-theme', theme.name);
    document.head.appendChild(styleEl);
  }
  if (styleEl.textContent !== theme.css) {
    styleEl.textContent = theme.css;
  }
}

/**
 * Registers custom theme definitions ahead of the built-in `THEMES` presets,
 * deduplicating by theme `name` and injecting any inline `css` declarations into `document.head`.
 */
export function registerCustomThemes(customThemes: readonly ThemeMeta[]): ThemeMeta[] {
  const merged: ThemeMeta[] = [];
  const seen = new Set<string>();
  for (const custom of customThemes) {
    if (!seen.has(custom.name)) {
      injectCustomThemeCss(custom);
      merged.push(custom);
      seen.add(custom.name);
    }
  }
  for (const preset of THEMES) {
    if (!seen.has(preset.name)) {
      merged.push(preset);
      seen.add(preset.name);
    }
  }
  return merged;
}

/**
 * Alias for {@link registerCustomThemes}.
 */
export const mergeThemePresets = registerCustomThemes;

/**
 * Checks whether a `.theme-{name}` CSS rule is loaded in the active document stylesheets.
 * Falls back to checking registered themes with CSS or built-in `THEME_NAMES` when running outside the browser.
 */
export function hasThemeCss(theme: ThemeName): boolean {
  if (!theme) return false;
  if (typeof document === 'undefined' || !document.styleSheets || document.styleSheets.length === 0) {
    return THEME_NAMES.includes(theme) || customThemesWithCss.has(theme);
  }
  const pattern = new RegExp(`\\.${THEME_CLASS_PREFIX}${escapeRegExp(theme)}(?![a-zA-Z0-9_-])`);
  for (let i = 0; i < document.styleSheets.length; i += 1) {
    const sheet = document.styleSheets[i];
    if (!sheet) continue;
    try {
      if (sheet.cssRules && ruleListHasThemeSelector(sheet.cssRules, pattern)) {
        return true;
      }
    } catch {
      // Ignore cross-origin stylesheets that restrict cssRules access.
    }
  }
  return false;
}

/**
 * Reads the active `theme-*` class from `document.documentElement`, falling back to `'helical-ui'`.
 */
export function readDocumentTheme(): ThemeName {
  if (typeof document === 'undefined') return DEFAULT_THEME;
  const classes = Array.from(document.documentElement.classList);
  for (const cls of classes) {
    if (cls.startsWith(THEME_CLASS_PREFIX)) {
      const candidate = cls.slice(THEME_CLASS_PREFIX.length);
      if (candidate) return candidate;
    }
  }
  return DEFAULT_THEME;
}

/**
 * Applies a `theme-{name}` class (and optional `dark` class) to `document.documentElement`.
 * If the requested theme has no loaded CSS rules, falls back to `'helical-ui'`.
 * Returns the resolved theme name that was applied.
 */
export function syncDocumentTheme(theme: ThemeName, dark?: boolean): ThemeName {
  const resolvedTheme = hasThemeCss(theme) ? theme : DEFAULT_THEME;
  if (typeof document === 'undefined') return resolvedTheme;
  const root = document.documentElement;
  const targetClass = `${THEME_CLASS_PREFIX}${resolvedTheme}`;
  const toRemove: string[] = [];
  root.classList.forEach((cls) => {
    if (cls.startsWith(THEME_CLASS_PREFIX) && cls !== targetClass) {
      toRemove.push(cls);
    }
  });
  for (const cls of toRemove) {
    root.classList.remove(cls);
  }
  if (!root.classList.contains(targetClass)) {
    root.classList.add(targetClass);
  }
  if (typeof dark === 'boolean') {
    root.classList.toggle('dark', dark);
  }
  return resolvedTheme;
}

/**
 * Observes `document.documentElement` class mutations and invokes `onChange` whenever
 * the active `theme-*` class or `dark` mode class changes. Returns an unsubscribe function.
 */
export function subscribeDocumentTheme(onChange: (state: { theme: ThemeName; dark: boolean }) => void): () => void {
  if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') {
    return () => {};
  }
  const root = document.documentElement;
  const observer = new MutationObserver(() => {
    onChange({
      theme: readDocumentTheme(),
      dark: readDocumentDarkMode(),
    });
  });
  observer.observe(root, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}

export const THEMES: ThemeMeta[] = [
  { name: 'amber-minimal', label: 'Amber Minimal' },
  { name: 'amethyst-haze', label: 'Amethyst Haze' },
  { name: 'anthropic', label: 'Anthropic' },
  { name: 'anyscale', label: 'Anyscale' },
  { name: 'bold-tech', label: 'Bold Tech' },
  { name: 'bubblegum', label: 'Bubblegum' },
  { name: 'caffeine', label: 'Caffeine' },
  { name: 'candyland', label: 'Candyland' },
  { name: 'catppuccin', label: 'Catppuccin' },
  { name: 'claude', label: 'Claude' },
  { name: 'claymorphism', label: 'Claymorphism' },
  { name: 'clean-slate', label: 'Clean Slate' },
  { name: 'cosmic-night', label: 'Cosmic Night' },
  { name: 'cyberpunk', label: 'Cyberpunk' },
  { name: 'darkmatter', label: 'Darkmatter' },
  { name: 'default', label: 'Default' },
  { name: 'doom-64', label: 'Doom 64' },
  { name: 'elegant-luxury', label: 'Elegant Luxury' },
  { name: 'graphite', label: 'Graphite' },
  { name: 'green', label: 'Green' },
  { name: 'kodama-grove', label: 'Kodama Grove' },
  { name: 'lambda', label: 'Lambda' },
  { name: 'mdbook', label: 'mdBook' },
  { name: 'midnight-bloom', label: 'Midnight Bloom' },
  { name: 'mocha-mousse', label: 'Mocha Mousse' },
  { name: 'modern-minimal', label: 'Modern Minimal' },
  { name: 'mono', label: 'Mono' },
  { name: 'nature', label: 'Nature' },
  { name: 'neo-brutalism', label: 'Neo Brutalism' },
  { name: 'northern-lights', label: 'Northern Lights' },
  { name: 'notebook', label: 'Notebook' },
  { name: 'ocean-breeze', label: 'Ocean Breeze' },
  { name: 'openai', label: 'Openai' },
  { name: 'pastel-dreams', label: 'Pastel Dreams' },
  { name: 'perpetuity', label: 'Perpetuity' },
  { name: 'quantum-rose', label: 'Quantum Rose' },
  { name: 'retro-arcade', label: 'Retro Arcade' },
  { name: 'rose', label: 'Rose' },
  { name: 'sage-garden', label: 'Sage Garden' },
  { name: 'slate', label: 'Slate' },
  { name: 'soft-pop', label: 'Soft Pop' },
  { name: 'solar-dusk', label: 'Solar Dusk' },
  { name: 'starry-night', label: 'Starry Night' },
  { name: 'sunset-horizon', label: 'Sunset Horizon' },
  { name: 'supabase', label: 'Supabase' },
  { name: 't3-chat', label: 'T3 Chat' },
  { name: 'tangerine', label: 'Tangerine' },
  { name: 'twitter', label: 'Twitter' },
  { name: 'vercel', label: 'Vercel' },
  { name: 'vintage-paper', label: 'Vintage Paper' },
  { name: 'violet-bloom', label: 'Violet Bloom' },
  { name: 'vitepress', label: 'Vitepress' },
  { name: 'helical-ui', label: 'Helical UI' },
];

export const THEME_NAMES: string[] = THEMES.map((t) => t.name);
