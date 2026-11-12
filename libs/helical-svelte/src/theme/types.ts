// libs/helical-svelte/src/theme/types.ts
import type {
  LightSwitchBaseProps,
  LightSwitchButtonVariants,
  ThemeMeta,
  ThemeMode,
  ThemeName,
  ThemeSelectorBaseProps,
  ThemeSelectorSwatchVariants,
  ThemeServiceOptions,
  ThemeToggleBaseProps,
  ThemeToggleButtonVariants,
} from '@cloudvoyant/helical-ui';
import type { ThemeService } from './theme-service.svelte';

export type {
  LightSwitchBaseProps,
  LightSwitchButtonVariants,
  ThemeMeta,
  ThemeMode,
  ThemeName,
  ThemeSelectorBaseProps,
  ThemeSelectorSwatchVariants,
  ThemeServiceOptions,
  ThemeToggleBaseProps,
  ThemeToggleButtonVariants,
};

export interface LightSwitchProps extends LightSwitchBaseProps {
  theme?: ThemeService;
  class?: string;
}

export type ThemeToggleProps = LightSwitchProps;

export interface ThemeSelectorProps extends ThemeSelectorBaseProps {
  theme?: ThemeService;
  class?: string;
}
