// libs/helical-react/src/theme-selector.tsx

// 1. Imports
import type { CSSProperties, HTMLAttributes } from 'react';
import {
  cn,
  themeSelectorStyles,
  type ThemeName,
  type ThemeSelectorBaseProps,
} from '@cloudvoyant/helical-ui';
import { useTheme } from './use-theme';

// 2. Module constants & types
export interface ThemeSelectorProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'>,
    ThemeSelectorBaseProps {}

const SWATCH_FONT_STYLE = {
  ['--font-sans']: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
} as CSSProperties;

// 4. Exported component
/**
 * Visual color theme swatch selector synchronized with the shared `useTheme` store.
 */
export function ThemeSelector({
  value: controlledValue,
  defaultValue,
  themes: themesProp,
  customThemes,
  onValueChange,
  className,
  ...props
}: ThemeSelectorProps) {
  // --- State ---
  const themeController = useTheme({
    customThemes,
    themes: themesProp,
    defaultTheme: defaultValue,
    onThemeChange: onValueChange,
  });

  const resolvedThemes = themesProp && themesProp.length > 0 ? themesProp : themeController.themes;
  const activeTheme = controlledValue ?? themeController.theme;

  // --- Methods ---
  const handleSelect = (name: ThemeName) => {
    themeController.setTheme(name);
  };

  // --- Render ---
  return (
    <div
      className={cn(themeSelectorStyles.container, className)}
      data-theme-selector-grid
      {...props}
    >
      {resolvedThemes.map((t) =>
        t.css ? (
          <style key={`css-${t.name}`} data-helical-custom-theme={t.name}>
            {t.css}
          </style>
        ) : null,
      )}
      <div className={themeSelectorStyles.grid} style={SWATCH_FONT_STYLE}>
        {resolvedThemes.map((t) => {
          const active = activeTheme === t.name;
          return (
            <button
              key={t.name}
              type="button"
              title={t.label}
              aria-pressed={active}
              data-theme-swatch={t.name}
              onClick={() => handleSelect(t.name)}
              className={cn(
                `theme-${t.name}`,
                themeController.darkMode && 'dark',
                themeSelectorStyles.swatch({ active }),
              )}
            >
              {active && (
                <span className="absolute right-1 top-1 size-1.5 rounded-full bg-green-500" />
              )}
              <div className="flex h-9 flex-col justify-center gap-1 rounded-sm bg-foreground/10 p-1.5">
                <div className="h-1.5 w-4/5 rounded-full bg-primary" />
                <div className="h-1.5 w-3/5 rounded-full bg-foreground/40" />
              </div>
              <span
                className="truncate text-[11px] font-medium"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
