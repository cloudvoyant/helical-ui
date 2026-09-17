<!-- apps/docs/src/components/examples/toggle-button/icon/svelte.svelte -->
<script lang="ts">
  import { ToggleButton } from '@cloudvoyant/helical-svelte';
  import { Bold, Italic, Underline } from 'lucide-svelte';
</script>

<div class="flex flex-wrap items-center gap-3">
  <ToggleButton aria-label="Toggle bold">
    <Bold class="size-4" />
  </ToggleButton>
  <ToggleButton aria-label="Toggle italic">
    <Italic class="size-4" />
  </ToggleButton>
  <ToggleButton aria-label="Toggle underline">
    <Underline class="size-4" />
  </ToggleButton>
</div>
