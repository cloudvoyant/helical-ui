// libs/helical-svelte/src/theme/theme-service.svelte.ts
import {
  THEMES,
  cycleThemeModeValue,
  mergeThemePresets,
  readSystemDarkMode,
  subscribeSystemDarkMode,
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
    subscribeSystemDarkMode((dark) => {
      this.setSystemDark(dark);
    });
  }

  private isDark(): boolean {
    return this.themeMode === 'system' ? this.systemDark : this.themeMode === 'dark';
  }

  registerThemes(customThemes: readonly ThemeMeta[], options?: { defaultTheme?: ThemeName }): void {
    const merged = mergeThemePresets(customThemes);
    this.themes = merged;
    this.validThemeNames = new Set(merged.map((t) => t.name));
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
    return this.setThemeMode(cycleThemeModeValue(this.themeMode));
  }
}

export const themeService = new ThemeService();
