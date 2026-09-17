<!-- libs/helical-svelte/src/combobox/ComboboxItemGroup.svelte -->
<!-- Closely based on: Shark UI combobox (@ark-ui/svelte/combobox), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { ComboboxItemGroup, type ComboboxItemGroupProps } from '@ark-ui/svelte/combobox';

  let { class: className = '', children, ...rest }: ComboboxItemGroupProps = $props();
</script>

<ComboboxItemGroup class={className} {...rest}>
  {@render children?.()}
</ComboboxItemGroup>
