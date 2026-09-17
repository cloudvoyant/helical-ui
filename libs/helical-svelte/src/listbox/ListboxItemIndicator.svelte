<!-- libs/helical-svelte/src/listbox/ListboxItemIndicator.svelte -->
<script lang="ts">
  import { ListboxItemIndicator, type ListboxItemIndicatorProps } from '@ark-ui/svelte/listbox';
  import { listboxItemIndicatorBase, cn } from '@cloudvoyant/helical-ui';
  import type { Snippet } from 'svelte';

  type Props = ListboxItemIndicatorProps & { class?: string; children?: Snippet };

  let { class: className = '', children, ...rest }: Props = $props();
</script>

<ListboxItemIndicator class={cn(listboxItemIndicatorBase, className)} {...rest}>
  {#if children}{@render children()}{/if}
</ListboxItemIndicator>
