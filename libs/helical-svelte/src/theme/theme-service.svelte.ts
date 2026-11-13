// libs/helical-svelte/src/theme/theme-service.svelte.ts

// 1. Imports
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
  type ThemeController,
  type ThemeMeta,
  type ThemeMode,
  type ThemeName,
  type ThemeServiceOptions,
  type UseThemeOptions,
} from '@cloudvoyant/helical-ui';

// 4. Exported classes & functions
/**
 * Reactive Svelte 5 runes theme controller synchronized with `document.documentElement`
 * and the shared `@cloudvoyant/helical-ui` theme registry.
 */
export class ThemeService implements ThemeController {
  /** Currently active color theme name. */
  theme = $state<ThemeName>(readDocumentTheme());
  /** Currently selected light/dark/system mode preference. */
  themeMode = $state<ThemeMode>(readDocumentDarkMode() ? 'dark' : 'light');
  /** Whether the operating system prefers dark mode. */
  systemDark = $state(readSystemDarkMode());
  /** Resolved boolean dark-mode state applied to `document.documentElement`. */
  darkMode = $derived(this.themeMode === 'system' ? this.systemDark : this.themeMode === 'dark');
  /** Registered theme presets available for selection. */
  themes = $state<readonly ThemeMeta[]>(THEMES);
  private validThemeNames = new Set<string>(THEMES.map((t) => t.name));
  private readonly themeListeners = new Set<(theme: ThemeName) => void>();
  private readonly modeListeners = new Set<(mode: ThemeMode) => void>();

  /**
   * Creates a `ThemeService` instance and subscribes to document and system theme changes.
   */
  constructor(options: ThemeServiceOptions = {}) {
    const initialThemes = options.customThemes ?? options.themes;
    if (initialThemes && initialThemes.length > 0) {
      this.registerCustomThemes(initialThemes);
    }
    if (options.initialMode) {
      this.themeMode = options.initialMode;
    }
    if (options.initialTheme && this.validThemeNames.has(options.initialTheme)) {
      this.theme = syncDocumentTheme(options.initialTheme, this.isDark());
    } else if (initialThemes && initialThemes[0]) {
      this.theme = syncDocumentTheme(initialThemes[0].name, this.isDark());
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
    subscribeDocumentTheme(({ theme, dark, themes: nextThemes }) => {
      if (this.theme !== theme) {
        this.theme = theme;
      }
      if (this.isDark() !== dark) {
        this.themeMode = dark ? 'dark' : 'light';
      }
      this.themes = nextThemes;
      this.validThemeNames = new Set(nextThemes.map((t) => t.name));
    });
  }

  private isDark(): boolean {
    return this.themeMode === 'system' ? this.systemDark : this.themeMode === 'dark';
  }

  /**
   * Registers custom theme presets into the shared theme store and injects their inline CSS.
   */
  registerCustomThemes(
    customThemes: readonly ThemeMeta[],
    options?: { defaultTheme?: ThemeName },
  ): readonly ThemeMeta[] {
    const merged = registerCustomThemes(customThemes);
    this.themes = merged;
    this.validThemeNames = new Set(merged.map((t) => t.name));
    const nextDefault = options?.defaultTheme;
    if (nextDefault && this.validThemeNames.has(nextDefault) && this.theme === DEFAULT_THEME) {
      this.theme = syncDocumentTheme(nextDefault, this.isDark());
    }
    return merged;
  }

  /**
   * Alias for {@link registerCustomThemes}.
   */
  registerThemes(customThemes: readonly ThemeMeta[], options?: { defaultTheme?: ThemeName }): readonly ThemeMeta[] {
    return this.registerCustomThemes(customThemes, options);
  }

  /**
   * Subscribes a callback to theme selection changes. Returns an unsubscribe function.
   */
  onThemeChange(listener: (theme: ThemeName) => void): () => void {
    this.themeListeners.add(listener);
    return () => {
      this.themeListeners.delete(listener);
    };
  }

  /**
   * Subscribes a callback to light/dark/system mode changes. Returns an unsubscribe function.
   */
  onModeChange(listener: (mode: ThemeMode) => void): () => void {
    this.modeListeners.add(listener);
    return () => {
      this.modeListeners.delete(listener);
    };
  }

  /**
   * Updates the tracked system dark-mode preference and syncs the document when in `'system'` mode.
   */
  setSystemDark(dark: boolean): void {
    this.systemDark = dark;
    if (this.themeMode === 'system') {
      syncDocumentDarkMode(this.isDark());
    }
  }

  /**
   * Applies the given color theme to `document.documentElement`, falling back to `'helical-ui'`
   * if its CSS is not loaded.
   */
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

  /**
   * Sets the active light/dark/system mode and synchronizes the `.dark` class on `document.documentElement`.
   */
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

  /**
   * Cycles the active theme mode through `'light'` -> `'dark'` -> `'system'`.
   */
  cycleThemeMode(): ThemeMode {
    return this.setThemeMode(cycleThemeModeValue(this.themeMode));
  }
}

/** Shared singleton `ThemeService` instance. */
export const themeService = new ThemeService();

/**
 * Svelte 5 hook for reading and updating the active document color theme, light/dark mode,
 * and registered custom themes via the shared `@cloudvoyant/helical-ui` theme store.
 */
export function useTheme(options: UseThemeOptions = {}): ThemeController {
  const customList = options.customThemes ?? options.themes;
  if (customList && customList.length > 0) {
    themeService.registerCustomThemes(customList, { defaultTheme: options.defaultTheme });
  } else if (options.defaultTheme) {
    themeService.setTheme(options.defaultTheme, false);
  }
  if (options.defaultMode) {
    themeService.setThemeMode(options.defaultMode, false);
  }
  if (options.onThemeChange) {
    themeService.onThemeChange(options.onThemeChange);
  }
  if (options.onModeChange) {
    themeService.onModeChange(options.onModeChange);
  }
  return themeService;
}
