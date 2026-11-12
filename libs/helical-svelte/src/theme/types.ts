// libs/helical-svelte/src/theme/types.ts
import type {
  ThemeMeta,
  ThemeMode,
  ThemeName,
  ThemeSelectorBaseProps,
  ThemeSelectorSwatchVariants,
  ThemeServiceOptions,
} from '@cloudvoyant/helical-ui';
import type { ThemeService } from './theme-service.svelte';

export type {
  ThemeMeta,
  ThemeMode,
  ThemeName,
  ThemeSelectorBaseProps,
  ThemeSelectorSwatchVariants,
  ThemeServiceOptions,
};

export interface ThemeSelectorProps extends ThemeSelectorBaseProps {
  theme?: ThemeService;
  class?: string;
}
