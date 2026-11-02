<!-- libs/helical-svelte/src/listbox/ListboxItemGroup.svelte -->
<script lang="ts">
  import { ListboxItemGroup, type ListboxItemGroupProps } from '@ark-ui/svelte/listbox';
  import { listboxItemGroupBase, cn } from '@cloudvoyant/helical-ui';
  import type { Snippet } from 'svelte';

  type Props = ListboxItemGroupProps & {
    class?: string;
    children?: Snippet;
  };

  let { class: className = '', children, ...rest }: Props = $props();
</script>

<ListboxItemGroup class={cn(listboxItemGroupBase, className)} {...rest}>
  {@render children?.()}
</ListboxItemGroup>
