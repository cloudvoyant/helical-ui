// libs/helical-react/src/theme-toggle.tsx

// 1. Imports
import { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import {
  cn,
  cycleThemeModeValue,
  readSystemDarkMode,
  subscribeSystemDarkMode,
  syncDocumentTheme,
  themeToggleButtonVariants,
  type ThemeMode,
  type ThemeName,
  type ThemeToggleBaseProps,
} from '@cloudvoyant/helical-ui';
import { Button, type ButtonProps } from './button';

// 2. Module constants & types
export interface ThemeToggleProps
  extends Omit<ButtonProps, 'onChange'>,
    ThemeToggleBaseProps {
  theme?: ThemeName;
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

  useEffect(() => subscribeSystemDarkMode(setSystemDark), []);

  // --- Methods ---
  const handleClick: ButtonProps['onClick'] = (event) => {
    const next = cycleThemeModeValue(currentMode);
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
