<!-- libs/helical-svelte/src/combobox/ComboboxItemGroupLabel.svelte -->
<!-- Closely based on: Shark UI combobox (@ark-ui/svelte/combobox), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { ComboboxItemGroupLabel, type ComboboxItemGroupLabelProps } from '@ark-ui/svelte/combobox';
  import { comboboxItemGroupLabelBase, cn } from '@cloudvoyant/helical-ui';

  let { class: className = '', children, ...rest }: ComboboxItemGroupLabelProps = $props();

  const classes = $derived(cn(comboboxItemGroupLabelBase, className));
</script>

<ComboboxItemGroupLabel class={classes} {...rest}>
  {@render children?.()}
</ComboboxItemGroupLabel>
