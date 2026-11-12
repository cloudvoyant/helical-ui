// libs/helical-react/src/light-switch.tsx

// 1. Imports
import { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import {
  cn,
  cycleThemeModeValue,
  lightSwitchButtonVariants,
  readDocumentDarkMode,
  readSystemDarkMode,
  subscribeDocumentTheme,
  subscribeSystemDarkMode,
  syncDocumentDarkMode,
  syncDocumentTheme,
  type LightSwitchBaseProps,
  type ThemeMode,
  type ThemeName,
} from '@cloudvoyant/helical-ui';
import { Button, type ButtonProps } from './button';

// 2. Module constants & types
export interface LightSwitchProps
  extends Omit<ButtonProps, 'onChange'>,
    LightSwitchBaseProps {
  theme?: ThemeName;
}

// 4. Exported component
export function LightSwitch({
  theme,
  mode: controlledMode,
  defaultMode,
  onModeChange,
  className,
  onClick,
  ...props
}: LightSwitchProps) {
  // --- State ---
  const [uncontrolledMode, setUncontrolledMode] = useState<ThemeMode>(
    () => defaultMode ?? (readDocumentDarkMode() ? 'dark' : 'light'),
  );
  const [systemDark, setSystemDark] = useState<boolean>(() => readSystemDarkMode());
  const currentMode = controlledMode ?? uncontrolledMode;

  // --- Effects ---
  useEffect(() => {
    const dark = currentMode === 'system' ? systemDark : currentMode === 'dark';
    if (theme) {
      syncDocumentTheme(theme, dark);
    } else {
      syncDocumentDarkMode(dark);
    }
  }, [theme, currentMode, systemDark]);

  useEffect(() => subscribeSystemDarkMode(setSystemDark), []);

  useEffect(() => {
    if (controlledMode !== undefined) return;
    return subscribeDocumentTheme(({ dark }) => {
      setUncontrolledMode((prev) => {
        const prevDark = prev === 'system' ? readSystemDarkMode() : prev === 'dark';
        if (prevDark === dark) return prev;
        return dark ? 'dark' : 'light';
      });
    });
  }, [controlledMode]);

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
      className={cn(lightSwitchButtonVariants(), className)}
      aria-label={`Theme: ${currentMode}`}
      title={`Theme: ${currentMode}`}
      data-light-switch
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
