// libs/helical-react/src/theme-selector.tsx

// 1. Imports
import { useEffect, useMemo, useState, type CSSProperties, type HTMLAttributes } from 'react';
import {
  THEMES,
  cn,
  readDocumentDarkMode,
  readDocumentTheme,
  registerCustomThemes,
  subscribeDocumentTheme,
  syncDocumentTheme,
  themeSelectorContainerBase,
  themeSelectorGridBase,
  themeSelectorSwatchVariants,
  type ThemeMeta,
  type ThemeName,
  type ThemeSelectorBaseProps,
} from '@cloudvoyant/helical-ui';

// 2. Module constants & types
export interface ThemeSelectorProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'>,
    ThemeSelectorBaseProps {}

const SWATCH_FONT_STYLE = {
  ['--font-sans']: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
} as CSSProperties;

// 4. Exported component
export function ThemeSelector({
  value: controlledValue,
  defaultValue,
  themes,
  customThemes,
  onValueChange,
  className,
  ...props
}: ThemeSelectorProps) {
  // --- State ---
  const [uncontrolledValue, setUncontrolledValue] = useState<ThemeName>(
    () => defaultValue ?? readDocumentTheme(),
  );
  const [isDark, setIsDark] = useState<boolean>(() => readDocumentDarkMode());

  const resolvedThemes = useMemo<readonly ThemeMeta[]>(() => {
    if (themes && themes.length > 0) {
      registerCustomThemes(themes);
      return themes;
    }
    if (customThemes && customThemes.length > 0) {
      return registerCustomThemes(customThemes);
    }
    return THEMES;
  }, [themes, customThemes]);

  const activeTheme = controlledValue ?? uncontrolledValue;

  // --- Effects ---
  useEffect(() => {
    if (themes && themes.length > 0) {
      registerCustomThemes(themes);
    } else if (customThemes && customThemes.length > 0) {
      registerCustomThemes(customThemes);
    }
  }, [themes, customThemes]);

  useEffect(() => {
    if (defaultValue) {
      const applied = syncDocumentTheme(defaultValue);
      setUncontrolledValue(applied);
    }
  }, [defaultValue]);

  useEffect(() => {
    return subscribeDocumentTheme(({ theme, dark }) => {
      setIsDark(dark);
      if (controlledValue === undefined) {
        setUncontrolledValue(theme);
      }
    });
  }, [controlledValue]);

  // --- Methods ---
  const handleSelect = (name: ThemeName) => {
    const applied = syncDocumentTheme(name);
    if (controlledValue === undefined) {
      setUncontrolledValue(applied);
    }
    onValueChange?.(applied);
  };

  // --- Render ---
  return (
    <div
      className={cn(themeSelectorContainerBase, className)}
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
      <div className={themeSelectorGridBase} style={SWATCH_FONT_STYLE}>
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
                isDark && 'dark',
                themeSelectorSwatchVariants({ active }),
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
