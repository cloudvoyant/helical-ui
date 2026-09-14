<!-- libs/vortex-svelte/src/listbox/ListboxItemText.svelte -->
<script lang="ts">
  import { ListboxItemText, type ListboxItemTextProps } from '@ark-ui/svelte/listbox';
  import { listboxItemTextBase, cn } from '@cloudvoyant/vortex-ui';
  import type { Snippet } from 'svelte';

  type Props = ListboxItemTextProps & { class?: string; children?: Snippet };

  let { class: className = '', children, ...rest }: Props = $props();
</script>

<ListboxItemText class={cn(listboxItemTextBase, className)} {...rest}>
  {#if children}{@render children()}{/if}
</ListboxItemText>
