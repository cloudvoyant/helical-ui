// libs/helical-svelte/src/theme/types.ts
import type {
  ThemeController,
  ThemeMeta,
  ThemeMode,
  ThemeName,
  ThemeSelectorBaseProps,
  ThemeSelectorSwatchVariants,
  ThemeServiceOptions,
  UseThemeOptions,
} from '@cloudvoyant/helical-ui';
import type { ThemeService } from './theme-service.svelte';

export type {
  ThemeController,
  ThemeMeta,
  ThemeMode,
  ThemeName,
  ThemeSelectorBaseProps,
  ThemeSelectorSwatchVariants,
  ThemeServiceOptions,
  UseThemeOptions,
};

export interface ThemeSelectorProps extends ThemeSelectorBaseProps {
  theme?: ThemeService;
  class?: string;
}
