<!-- apps/docs/src/components/examples/prose/sizes/svelte.svelte -->
<script lang="ts">
  import { Prose } from '@cloudvoyant/vortex-svelte';
  const sizes = ['sm', 'base', 'lg'] as const;
</script>

<div class="flex flex-col gap-6">
  {#each sizes as size}
    <Prose {size}>
      <h2>Size: {size}</h2>
      <p>The quick brown fox jumps over the lazy dog.</p>
    </Prose>
  {/each}
</div>
