import { describe, expect, it, vi } from 'vitest';
import { cycleThemeModeValue, mergeThemePresets, subscribeSystemDarkMode, syncDocumentTheme } from '../src/themes';

describe('Given syncDocumentTheme is called with a theme name and dark flag', () => {
  describe('When switching themes and dark mode on documentElement', () => {
    it('Then replaces any existing theme- class with the new theme class and toggles the dark class', () => {
      // Arrange
      const classes = new Set<string>(['theme-helical-ui', 'custom-class']);
      vi.stubGlobal('document', {
        documentElement: {
          classList: {
            forEach: (cb: (cls: string) => void) => classes.forEach(cb),
            remove: (cls: string) => classes.delete(cls),
            add: (cls: string) => classes.add(cls),
            toggle: (cls: string, force?: boolean) => {
              if (force) classes.add(cls);
              else classes.delete(cls);
            },
          },
        },
      });

      // Act
      syncDocumentTheme('catppuccin', true);

      // Assert
      expect(Array.from(classes)).toEqual(['custom-class', 'theme-catppuccin', 'dark']);
      vi.unstubAllGlobals();
    });
  });
});

describe('Given theme mode cycling, preset merging, and system dark mode subscription helpers', () => {
  describe('When cycleThemeModeValue, mergeThemePresets, and subscribeSystemDarkMode are invoked', () => {
    it('Then cycles system -> light -> dark -> system, prepends deduplicated custom themes, and forwards matchMedia changes', () => {
      // Arrange
      const listeners: Array<(event: MediaQueryListEvent) => void> = [];
      const observed: boolean[] = [];
      vi.stubGlobal('window', {
        matchMedia: () => ({
          matches: false,
          addEventListener: (_type: string, cb: (event: MediaQueryListEvent) => void) => {
            listeners.push(cb);
          },
          removeEventListener: () => {
            listeners.length = 0;
          },
        }),
      });

      // Act
      const merged = mergeThemePresets([
        { name: 'hypertextual', label: 'Hypertextual' },
        { name: 'catppuccin', label: 'Custom Catppuccin' },
      ]);
      const unsubscribe = subscribeSystemDarkMode((dark) => observed.push(dark));
      listeners[0]?.({ matches: true } as MediaQueryListEvent);
      unsubscribe();

      // Assert
      expect(cycleThemeModeValue('system')).toBe('light');
      expect(cycleThemeModeValue('light')).toBe('dark');
      expect(cycleThemeModeValue('dark')).toBe('system');
      expect(merged[0]).toEqual({ name: 'hypertextual', label: 'Hypertextual' });
      expect(merged.filter((t) => t.name === 'catppuccin')).toHaveLength(1);
      expect(observed).toEqual([true]);
      vi.unstubAllGlobals();
    });
  });
});
