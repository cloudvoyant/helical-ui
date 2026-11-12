// libs/helical-react/src/use-theme.ts

// 1. Imports
import { useEffect, useState } from 'react';
import {
  DEFAULT_THEME,
  THEMES,
  cycleThemeModeValue,
  readDocumentDarkMode,
  readDocumentTheme,
  readSystemDarkMode,
  registerCustomThemes as registerCoreCustomThemes,
  subscribeDocumentTheme,
  subscribeSystemDarkMode,
  syncDocumentDarkMode,
  syncDocumentTheme,
  type ThemeController,
  type ThemeMeta,
  type ThemeMode,
  type ThemeName,
  type UseThemeOptions,
} from '@cloudvoyant/helical-ui';

// 2. Module constants & types
export type { ThemeController, UseThemeOptions };

// 4. Exported hook
/**
 * React hook for reading and updating the active document color theme, light/dark mode,
 * and registered custom themes via the shared `@cloudvoyant/helical-ui` theme store.
 */
export function useTheme(options: UseThemeOptions = {}): ThemeController {
  // --- State ---
  const customList = options.customThemes ?? options.themes;
  const [themes, setThemes] = useState<readonly ThemeMeta[]>(() =>
    customList && customList.length > 0 ? registerCoreCustomThemes(customList) : [...THEMES],
  );
  const [theme, setThemeState] = useState<ThemeName>(() => options.defaultTheme ?? readDocumentTheme());
  const [themeMode, setThemeModeState] = useState<ThemeMode>(
    () => options.defaultMode ?? (readDocumentDarkMode() ? 'dark' : 'light'),
  );
  const [systemDark, setSystemDark] = useState<boolean>(() => readSystemDarkMode());

  const darkMode = themeMode === 'system' ? systemDark : themeMode === 'dark';

  // --- Effects ---
  useEffect(() => {
    if (customList && customList.length > 0) {
      setThemes([...registerCoreCustomThemes(customList)]);
    }
  }, [customList]);

  useEffect(() => {
    if (options.defaultTheme) {
      const applied = syncDocumentTheme(options.defaultTheme, darkMode);
      setThemeState(applied);
    }
  }, [options.defaultTheme]);

  useEffect(() => {
    if (options.defaultMode) {
      syncDocumentDarkMode(options.defaultMode === 'system' ? systemDark : options.defaultMode === 'dark');
    }
  }, [options.defaultMode]);

  useEffect(() => {
    return subscribeSystemDarkMode((nextDark) => {
      setSystemDark(nextDark);
      if (themeMode === 'system') {
        syncDocumentDarkMode(nextDark);
      }
    });
  }, [themeMode]);

  useEffect(() => {
    return subscribeDocumentTheme(({ theme: docTheme, dark, themes: nextThemes }) => {
      setThemeState(docTheme);
      setThemeModeState((prev) => (prev === 'system' ? prev : dark ? 'dark' : 'light'));
      setThemes(nextThemes);
    });
  }, []);

  // --- Methods ---
  const registerCustomThemes = (
    nextCustomThemes: readonly ThemeMeta[],
    regOptions?: { defaultTheme?: ThemeName },
  ): readonly ThemeMeta[] => {
    const merged = registerCoreCustomThemes(nextCustomThemes);
    setThemes([...merged]);
    if (regOptions?.defaultTheme && theme === DEFAULT_THEME) {
      const applied = syncDocumentTheme(regOptions.defaultTheme, darkMode);
      setThemeState(applied);
    }
    return merged;
  };

  const setTheme = (nextTheme: ThemeName): ThemeName => {
    const applied = syncDocumentTheme(nextTheme, darkMode);
    setThemeState(applied);
    options.onThemeChange?.(applied);
    return applied;
  };

  const setThemeMode = (nextMode: ThemeMode): ThemeMode => {
    const nextDark = nextMode === 'system' ? systemDark : nextMode === 'dark';
    setThemeModeState(nextMode);
    syncDocumentDarkMode(nextDark);
    options.onModeChange?.(nextMode);
    return nextMode;
  };

  const cycleThemeMode = (): ThemeMode => {
    return setThemeMode(cycleThemeModeValue(themeMode));
  };

  return {
    theme,
    themeMode,
    darkMode,
    themes,
    setTheme,
    setThemeMode,
    cycleThemeMode,
    registerCustomThemes,
  };
}
