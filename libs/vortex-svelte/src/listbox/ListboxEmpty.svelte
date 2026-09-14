<!-- libs/vortex-svelte/src/listbox/ListboxEmpty.svelte -->
<script lang="ts">
  import { ListboxEmpty, type ListboxEmptyProps } from '@ark-ui/svelte/listbox';
  import { listboxEmptyBase, cn } from '@cloudvoyant/vortex-ui';
  import type { Snippet } from 'svelte';

  type Props = ListboxEmptyProps & { class?: string; children?: Snippet };

  let { class: className = '', children, ...rest }: Props = $props();
</script>

<ListboxEmpty class={cn(listboxEmptyBase, className)} {...rest}>
  {#if children}{@render children()}{:else}No results.{/if}
</ListboxEmpty>
