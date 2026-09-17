<!-- libs/helical-svelte/src/combobox/ComboboxItemText.svelte -->
<!-- Closely based on: Shark UI combobox (@ark-ui/svelte/combobox), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { ComboboxItemText, type ComboboxItemTextProps } from '@ark-ui/svelte/combobox';

  let { class: className = '', children, ...rest }: ComboboxItemTextProps = $props();
</script>

<ComboboxItemText class={className} {...rest}>
  {@render children?.()}
</ComboboxItemText>
