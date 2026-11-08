<!-- apps/docs/src/components/examples/kbd/default/svelte.svelte -->
<script lang="ts">
  // 1. Imports
  import { HStack, Kbd } from '@cloudvoyant/helical-svelte';
</script>

<HStack class="flex-wrap items-center gap-3">
  <Kbd hotkey="Mod+K" />
  <Kbd hotkey="Control+w" />
  <Kbd hotkey="Space ?" />
  <Kbd hotkey="Shift+Z" />
</HStack>
