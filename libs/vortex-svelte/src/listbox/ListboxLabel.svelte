<!-- libs/vortex-svelte/src/listbox/ListboxLabel.svelte -->
<script lang="ts">
  import { ListboxLabel, type ListboxLabelProps } from '@ark-ui/svelte/listbox';
  import { listboxLabelBase, cn } from '@cloudvoyant/vortex-ui';
  import type { Snippet } from 'svelte';

  type Props = ListboxLabelProps & { class?: string; children?: Snippet };

  let { class: className = '', children, ...rest }: Props = $props();
</script>

<ListboxLabel class={cn(listboxLabelBase, className)} {...rest}>
  {#if children}{@render children()}{/if}
</ListboxLabel>
