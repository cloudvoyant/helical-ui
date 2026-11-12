<!-- libs/helical-svelte/src/theme/ThemeToggle.svelte -->
<script lang="ts">
  // 1. Imports
  import LightSwitch from './LightSwitch.svelte';
  import type { ThemeToggleProps } from './types';

  // --- State ---
  let props: ThemeToggleProps = $props();
</script>

<LightSwitch {...props} />
