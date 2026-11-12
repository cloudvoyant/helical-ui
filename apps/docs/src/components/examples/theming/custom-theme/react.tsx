// apps/docs/src/components/examples/theming/custom-theme/react.tsx

// 1. Imports
import { HStack, LightSwitch, ThemeSelector, VStack, useTheme } from '@cloudvoyant/helical-react';
import type { ThemeMeta } from '@cloudvoyant/helical-ui';

// 2. Module constants & types
const CUSTOM_THEMES: ThemeMeta[] = [
  {
    name: 'solar-flare',
    label: 'Solar Flare',
    css: `
      .theme-solar-flare {
        --background: oklch(0.99 0.015 75);
        --foreground: oklch(0.22 0.05 40);
        --primary: oklch(0.65 0.22 42);
        --primary-foreground: oklch(0.99 0.01 75);
        --border: oklch(0.88 0.04 65);
      }
      .theme-solar-flare.dark {
        --background: oklch(0.18 0.03 38);
        --foreground: oklch(0.95 0.02 75);
        --primary: oklch(0.74 0.2 48);
        --primary-foreground: oklch(0.16 0.03 38);
        --border: oklch(0.3 0.05 42);
      }
    `,
  },
  {
    name: 'missing-css',
    label: 'Missing CSS',
  },
];

// 4. Exported component
export default function ThemingCustomTheme() {
  // --- State ---
  useTheme({ customThemes: CUSTOM_THEMES });

  // --- Render ---
  return (
    <VStack className="w-full max-w-md gap-3">
      <HStack className="items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Solar Flare Custom Theme</span>
        <LightSwitch />
      </HStack>
      <ThemeSelector />
    </VStack>
  );
}
