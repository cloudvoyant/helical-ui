<!-- libs/helical-svelte/src/listbox/ListboxItemGroupLabel.svelte -->
<script lang="ts">
  import { ListboxItemGroupLabel, type ListboxItemGroupLabelProps } from '@ark-ui/svelte/listbox';
  import { listboxItemGroupLabelBase, cn } from '@cloudvoyant/helical-ui';
  import type { Snippet } from 'svelte';

  type Props = ListboxItemGroupLabelProps & {
    class?: string;
    children?: Snippet;
  };

  let { class: className = '', children, ...rest }: Props = $props();
</script>

<ListboxItemGroupLabel class={cn(listboxItemGroupLabelBase, className)} {...rest}>
  {@render children?.()}
</ListboxItemGroupLabel>
