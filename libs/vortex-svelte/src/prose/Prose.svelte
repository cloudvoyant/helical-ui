<!-- libs/vortex-svelte/src/prose/Prose.svelte -->
<!-- Closely based on: Shark UI prose, mirrored from @cloudvoyant/vortex-react -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { proseVariants, cn } from '@cloudvoyant/vortex-ui';

  type Props = HTMLAttributes<HTMLElement> & {
    element?: string;
    size?: 'sm' | 'base' | 'lg';
    class?: string;
    children?: Snippet;
  };

  // Spread ...rest so id/data-*/aria-* and event handlers pass through, matching React's Prose.
  let { element = 'div', size = 'base', class: className = '', children, ...rest }: Props = $props();

  const classes = $derived(cn(proseVariants({ size }), 'prose', className));
</script>

<svelte:element this={element} class={classes} {...rest}>
  {#if children}{@render children()}{/if}
</svelte:element>
