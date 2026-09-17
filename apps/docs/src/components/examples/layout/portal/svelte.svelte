<!-- apps/docs/src/components/examples/layout/portal/svelte.svelte -->
<script lang="ts">
  import { Portal } from '@cloudvoyant/helical-svelte';
</script>

<p class="text-sm text-muted-foreground">
  This text renders in place.
  <Portal>
    <span class="rounded bg-accent px-1.5 py-0.5 text-xs font-medium text-accent-foreground">
      This badge renders at document.body via Portal
    </span>
  </Portal>
</p>
