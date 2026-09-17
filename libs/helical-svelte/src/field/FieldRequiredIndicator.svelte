<!-- libs/helical-svelte/src/field/FieldRequiredIndicator.svelte -->
<!-- Closely based on: Shark UI field (@ark-ui/svelte/field), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { FieldRequiredIndicator, type FieldRequiredIndicatorProps } from '@ark-ui/svelte/field';
  import { fieldRequiredIndicatorBase, cn } from '@cloudvoyant/helical-ui';

  let { class: className = '', children, ...rest }: FieldRequiredIndicatorProps = $props();

  const classes = $derived(cn(fieldRequiredIndicatorBase, className));
</script>

<FieldRequiredIndicator class={classes} {...rest}>
  {@render children?.()}
</FieldRequiredIndicator>
