<!-- libs/helical-svelte/src/code-block/CodeBlockHeader.svelte -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import { codeBlockHeaderBase, cn } from '@cloudvoyant/helical-ui';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string } & HTMLAttributes<HTMLDivElement>;
  let { children, class: className = '', ...rest }: Props = $props();
  const classes = $derived(cn(codeBlockHeaderBase, className));
</script>

<Ark as="div" class={classes} {...rest}>
  {#if children}{@render children()}{/if}
</Ark>
