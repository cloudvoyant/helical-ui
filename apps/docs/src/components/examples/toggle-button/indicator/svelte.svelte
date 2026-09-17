<!-- apps/docs/src/components/examples/toggle-button/indicator/svelte.svelte -->
<script lang="ts">
  import { ToggleButton, ToggleButtonIndicator } from '@cloudvoyant/helical-svelte';
  import { Bookmark } from 'lucide-svelte';
</script>

<div class="flex flex-wrap items-center gap-3">
  <ToggleButton aria-label="Toggle bookmark" defaultPressed>
    <ToggleButtonIndicator>
      <Bookmark class="size-4" fill="currentColor" />
      {#snippet fallback()}
        <Bookmark class="size-4" />
      {/snippet}
    </ToggleButtonIndicator>
  </ToggleButton>
</div>
