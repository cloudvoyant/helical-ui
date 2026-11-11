// libs/helical-svelte/src/theme/types.ts
import type {
  ThemeMeta,
  ThemeMode,
  ThemeName,
  ThemeServiceOptions,
  ThemeToggleButtonVariants,
} from '@cloudvoyant/helical-ui';
import type { ThemeService } from './themeService.svelte';

export type { ThemeMeta, ThemeMode, ThemeName, ThemeServiceOptions, ThemeToggleButtonVariants };

export interface ThemeToggleProps {
  theme?: ThemeService;
  class?: string;
}
