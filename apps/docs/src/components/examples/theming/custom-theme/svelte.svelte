<!-- apps/docs/src/components/examples/theming/custom-theme/svelte.svelte -->
<script lang="ts">
  // 1. Imports
  import { HStack, LightSwitch, ThemeSelector, VStack, type ThemeMeta } from '@cloudvoyant/helical-svelte';

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
</script>

<VStack class="w-full max-w-md gap-3">
  <HStack class="items-center justify-between">
    <span class="text-xs font-medium text-muted-foreground">Custom Themes</span>
    <LightSwitch />
  </HStack>
  <ThemeSelector customThemes={CUSTOM_THEMES} />
</VStack>
