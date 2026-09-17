<!-- libs/helical-svelte/src/code-block/CodeBlockTitle.svelte -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import { codeBlockTitleBase, cn } from '@cloudvoyant/helical-ui';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  type Props = { children?: Snippet; class?: string } & HTMLAttributes<HTMLSpanElement>;
  let { children, class: className = '', ...rest }: Props = $props();
  const classes = $derived(cn(codeBlockTitleBase, className));
</script>

<Ark as="span" class={classes} {...rest}>
  {#if children}{@render children()}{/if}
</Ark>
