// libs/helical-svelte/src/theme/themeService.svelte.ts
import {
  THEMES,
  readSystemDarkMode,
  syncDocumentTheme,
  type ThemeMeta,
  type ThemeMode,
  type ThemeName,
  type ThemeServiceOptions,
} from '@cloudvoyant/helical-ui';

export class ThemeService {
  theme = $state<ThemeName>('helical-ui');
  themeMode = $state<ThemeMode>('system');
  systemDark = $state(readSystemDarkMode());
  darkMode = $derived(this.themeMode === 'system' ? this.systemDark : this.themeMode === 'dark');
  themes = $state<readonly ThemeMeta[]>(THEMES);
  private validThemeNames = new Set<string>(THEMES.map((t) => t.name));
  private readonly themeListeners = new Set<(theme: ThemeName) => void>();
  private readonly modeListeners = new Set<(mode: ThemeMode) => void>();

  constructor(options: ThemeServiceOptions = {}) {
    if (options.themes && options.themes.length > 0) {
      this.registerThemes(options.themes);
    }
    if (options.initialTheme && this.validThemeNames.has(options.initialTheme)) {
      this.theme = options.initialTheme;
    } else if (options.themes && options.themes[0]) {
      this.theme = options.themes[0].name;
    }
    if (options.initialMode) {
      this.themeMode = options.initialMode;
    }
    if (options.onThemeChange) {
      this.themeListeners.add(options.onThemeChange);
    }
    if (options.onModeChange) {
      this.modeListeners.add(options.onModeChange);
    }
    syncDocumentTheme(this.theme, this.isDark());
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      try {
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        media.addEventListener('change', (event) => {
          this.setSystemDark(event.matches);
        });
      } catch {
        // Ignore matchMedia errors
      }
    }
  }

  private isDark(): boolean {
    return this.themeMode === 'system' ? this.systemDark : this.themeMode === 'dark';
  }

  registerThemes(customThemes: readonly ThemeMeta[], options?: { defaultTheme?: ThemeName }): void {
    const merged: ThemeMeta[] = [...customThemes];
    const seen = new Set(customThemes.map((t) => t.name));
    for (const preset of THEMES) {
      if (!seen.has(preset.name)) {
        merged.push(preset);
        seen.add(preset.name);
      }
    }
    this.themes = merged;
    this.validThemeNames = seen;
    const nextDefault = options?.defaultTheme ?? customThemes[0]?.name;
    if (nextDefault && this.validThemeNames.has(nextDefault) && this.theme === 'helical-ui') {
      this.theme = nextDefault;
      syncDocumentTheme(this.theme, this.isDark());
    }
  }

  onThemeChange(listener: (theme: ThemeName) => void): () => void {
    this.themeListeners.add(listener);
    return () => {
      this.themeListeners.delete(listener);
    };
  }

  onModeChange(listener: (mode: ThemeMode) => void): () => void {
    this.modeListeners.add(listener);
    return () => {
      this.modeListeners.delete(listener);
    };
  }

  setSystemDark(dark: boolean): void {
    this.systemDark = dark;
    syncDocumentTheme(this.theme, this.isDark());
  }

  setTheme(theme: ThemeName, notify = true): ThemeName {
    if (!this.validThemeNames.has(theme)) return this.theme;
    this.theme = theme;
    syncDocumentTheme(this.theme, this.isDark());
    if (notify) {
      for (const listener of this.themeListeners) {
        listener(theme);
      }
    }
    return this.theme;
  }

  setThemeMode(mode: ThemeMode, notify = true): ThemeMode {
    this.themeMode = mode;
    syncDocumentTheme(this.theme, this.isDark());
    if (notify) {
      for (const listener of this.modeListeners) {
        listener(mode);
      }
    }
    return this.themeMode;
  }

  cycleThemeMode(): ThemeMode {
    const next: ThemeMode = this.themeMode === 'system' ? 'light' : this.themeMode === 'light' ? 'dark' : 'system';
    return this.setThemeMode(next);
  }
}

export const themeService = new ThemeService();
