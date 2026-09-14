<!-- libs/vortex-svelte/src/listbox/ListboxInput.svelte -->
<!-- Ark's listbox input: supplies arrow/Home/End forwarding to the list, highlight -->
<!-- management, and the aria-activedescendant / aria-controls linkage. Must be a SIBLING -->
<!-- of ListboxContent (never inside role="listbox"), so it also stays out of the scroller. -->
<script lang="ts">
  import { ListboxInput, type ListboxInputProps } from '@ark-ui/svelte/listbox';
  import { listboxInputBase, cn } from '@cloudvoyant/vortex-ui';

  type Props = ListboxInputProps & { class?: string };

  let { class: className = '', ...rest }: Props = $props();
</script>

<ListboxInput class={cn(listboxInputBase, className)} {...rest} />
