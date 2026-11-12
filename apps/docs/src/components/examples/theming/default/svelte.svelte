<!-- apps/docs/src/components/examples/theming/default/svelte.svelte -->
<script lang="ts">
  // 1. Imports
  import { HStack, LightSwitch, ThemeSelector, VStack } from '@cloudvoyant/helical-svelte';
</script>

<VStack class="w-full max-w-md gap-3">
  <HStack class="items-center justify-between">
    <span class="text-xs font-medium text-muted-foreground">Appearance</span>
    <LightSwitch />
  </HStack>
  <ThemeSelector />
</VStack>
