<!-- libs/vortex-svelte/src/listbox/ListboxContent.svelte -->
<!-- The scrollable, `role="listbox"` surface. Options go inside; interactive chrome (the -->
<!-- filter input) must sit OUTSIDE this element, as a sibling under Listbox. -->
<script lang="ts">
  import { ListboxContent, type ListboxContentProps } from '@ark-ui/svelte/listbox';
  import { listboxContentBase, cn } from '@cloudvoyant/vortex-ui';
  import type { Snippet } from 'svelte';

  type Props = ListboxContentProps & { class?: string; children?: Snippet };

  let { class: className = '', children, ...rest }: Props = $props();

  const classes = $derived(cn(listboxContentBase, className));
</script>

<ListboxContent class={classes} {...rest}>
  {#if children}{@render children()}{/if}
</ListboxContent>
