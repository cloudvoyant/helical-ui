<!-- libs/helical-svelte/src/combobox/ComboboxTrigger.svelte -->
<!-- Closely based on: Shark UI combobox (@ark-ui/svelte/combobox), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { ComboboxTrigger, type ComboboxTriggerProps } from '@ark-ui/svelte/combobox';
  import { comboboxTriggerBase, cn } from '@cloudvoyant/helical-ui';

  let { class: className = '', children, ...rest }: ComboboxTriggerProps = $props();

  const classes = $derived(cn(comboboxTriggerBase, className));
</script>

<ComboboxTrigger class={classes} {...rest}>
  {@render children?.()}
</ComboboxTrigger>
