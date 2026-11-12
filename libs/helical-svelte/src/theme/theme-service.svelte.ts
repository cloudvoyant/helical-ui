// libs/helical-svelte/src/theme/theme-service.svelte.ts
import {
  DEFAULT_THEME,
  THEMES,
  cycleThemeModeValue,
  readDocumentDarkMode,
  readDocumentTheme,
  readSystemDarkMode,
  registerCustomThemes,
  subscribeDocumentTheme,
  subscribeSystemDarkMode,
  syncDocumentDarkMode,
  syncDocumentTheme,
  type ThemeMeta,
  type ThemeMode,
  type ThemeName,
  type ThemeServiceOptions,
} from '@cloudvoyant/helical-ui';

export class ThemeService {
  theme = $state<ThemeName>(readDocumentTheme());
  themeMode = $state<ThemeMode>(readDocumentDarkMode() ? 'dark' : 'light');
  systemDark = $state(readSystemDarkMode());
  darkMode = $derived(this.themeMode === 'system' ? this.systemDark : this.themeMode === 'dark');
  themes = $state<readonly ThemeMeta[]>(THEMES);
  private validThemeNames = new Set<string>(THEMES.map((t) => t.name));
  private readonly themeListeners = new Set<(theme: ThemeName) => void>();
  private readonly modeListeners = new Set<(mode: ThemeMode) => void>();

  constructor(options: ThemeServiceOptions = {}) {
    if (options.themes && options.themes.length > 0) {
      this.registerCustomThemes(options.themes);
    }
    if (options.initialMode) {
      this.themeMode = options.initialMode;
    }
    if (options.initialTheme && this.validThemeNames.has(options.initialTheme)) {
      this.theme = syncDocumentTheme(options.initialTheme, this.isDark());
    } else if (options.themes && options.themes[0]) {
      this.theme = syncDocumentTheme(options.themes[0].name, this.isDark());
    } else if (options.initialMode) {
      syncDocumentDarkMode(this.isDark());
    }
    if (options.onThemeChange) {
      this.themeListeners.add(options.onThemeChange);
    }
    if (options.onModeChange) {
      this.modeListeners.add(options.onModeChange);
    }
    subscribeSystemDarkMode((dark) => {
      this.setSystemDark(dark);
    });
    subscribeDocumentTheme(({ theme, dark }) => {
      if (this.theme !== theme) {
        this.theme = theme;
      }
      if (this.isDark() !== dark) {
        this.themeMode = dark ? 'dark' : 'light';
      }
    });
  }

  private isDark(): boolean {
    return this.themeMode === 'system' ? this.systemDark : this.themeMode === 'dark';
  }

  registerCustomThemes(customThemes: readonly ThemeMeta[], options?: { defaultTheme?: ThemeName }): void {
    const merged = registerCustomThemes(customThemes);
    this.themes = merged;
    this.validThemeNames = new Set(merged.map((t) => t.name));
    const nextDefault = options?.defaultTheme;
    if (nextDefault && this.validThemeNames.has(nextDefault) && this.theme === DEFAULT_THEME) {
      this.theme = syncDocumentTheme(nextDefault, this.isDark());
    }
  }

  registerThemes(customThemes: readonly ThemeMeta[], options?: { defaultTheme?: ThemeName }): void {
    this.registerCustomThemes(customThemes, options);
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
    if (this.themeMode === 'system') {
      syncDocumentDarkMode(this.isDark());
    }
  }

  setTheme(theme: ThemeName, notify = true): ThemeName {
    const applied = syncDocumentTheme(this.validThemeNames.has(theme) ? theme : DEFAULT_THEME, this.isDark());
    this.theme = applied;
    if (notify) {
      for (const listener of this.themeListeners) {
        listener(applied);
      }
    }
    return this.theme;
  }

  setThemeMode(mode: ThemeMode, notify = true): ThemeMode {
    this.themeMode = mode;
    syncDocumentDarkMode(this.isDark());
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
