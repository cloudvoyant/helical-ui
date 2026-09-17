<!-- libs/helical-svelte/src/combobox/ComboboxControl.svelte -->
<!-- Closely based on: Shark UI combobox (@ark-ui/svelte/combobox), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { ComboboxControl, type ComboboxControlProps } from '@ark-ui/svelte/combobox';
  import { comboboxControlBase, cn } from '@cloudvoyant/helical-ui';

  let { class: className = '', children, ...rest }: ComboboxControlProps = $props();

  const classes = $derived(cn(comboboxControlBase, className));
</script>

<ComboboxControl class={classes} {...rest}>
  {@render children?.()}
</ComboboxControl>
