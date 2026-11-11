// libs/helical-svelte/src/theme/types.ts
import type {
  ThemeMeta,
  ThemeMode,
  ThemeName,
  ThemeServiceOptions,
  ThemeToggleBaseProps,
  ThemeToggleButtonVariants,
} from '@cloudvoyant/helical-ui';
import type { ThemeService } from './theme-service.svelte';

export type { ThemeMeta, ThemeMode, ThemeName, ThemeServiceOptions, ThemeToggleBaseProps, ThemeToggleButtonVariants };

export interface ThemeToggleProps extends ThemeToggleBaseProps {
  theme?: ThemeService;
  class?: string;
}
