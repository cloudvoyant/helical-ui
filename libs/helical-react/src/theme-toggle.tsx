// libs/helical-react/src/theme-toggle.tsx

// 1. Imports
import { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import {
  cn,
  readSystemDarkMode,
  syncDocumentTheme,
  themeToggleButtonVariants,
  type ThemeMode,
  type ThemeName,
} from '@cloudvoyant/helical-ui';
import { Button, type ButtonProps } from './button';

// 2. Module constants & types
export interface ThemeToggleProps extends Omit<ButtonProps, 'onChange'> {
  theme?: ThemeName;
  mode?: ThemeMode;
  defaultMode?: ThemeMode;
  onModeChange?: (mode: ThemeMode) => void;
}

// 4. Exported component
export function ThemeToggle({
  theme = 'helical-ui',
  mode: controlledMode,
  defaultMode = 'system',
  onModeChange,
  className,
  onClick,
  ...props
}: ThemeToggleProps) {
  // --- State ---
  const [uncontrolledMode, setUncontrolledMode] = useState<ThemeMode>(defaultMode);
  const [systemDark, setSystemDark] = useState<boolean>(() => readSystemDarkMode());
  const currentMode = controlledMode ?? uncontrolledMode;

  // --- Effects ---
  useEffect(() => {
    const dark = currentMode === 'system' ? systemDark : currentMode === 'dark';
    syncDocumentTheme(theme, dark);
  }, [theme, currentMode, systemDark]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    try {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches);
      media.addEventListener('change', onChange);
      return () => media.removeEventListener('change', onChange);
    } catch {
      return;
    }
  }, []);

  // --- Methods ---
  const handleClick: ButtonProps['onClick'] = (event) => {
    const next: ThemeMode =
      currentMode === 'system'
        ? 'light'
        : currentMode === 'light'
          ? 'dark'
          : 'system';
    if (controlledMode === undefined) {
      setUncontrolledMode(next);
    }
    onModeChange?.(next);
    onClick?.(event);
  };

  // --- Render ---
  return (
    <Button
      variant="text"
      size="sm"
      className={cn(themeToggleButtonVariants(), className)}
      aria-label={`Theme: ${currentMode}`}
      title={`Theme: ${currentMode}`}
      onClick={handleClick}
      {...props}
    >
      {currentMode === 'light' ? (
        <Sun size={14} strokeWidth={1.5} />
      ) : currentMode === 'dark' ? (
        <Moon size={14} strokeWidth={1.5} />
      ) : (
        <Monitor size={14} strokeWidth={1.5} />
      )}
    </Button>
  );
}
