<!-- libs/helical-svelte/src/field/FieldLabel.svelte -->
<!-- Closely based on: Shark UI field (@ark-ui/svelte/field), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { FieldLabel, type FieldLabelProps } from '@ark-ui/svelte/field';
  import { fieldLabelBase, cn } from '@cloudvoyant/helical-ui';

  let { class: className = '', children, ...rest }: FieldLabelProps = $props();

  const classes = $derived(cn(fieldLabelBase, className));
</script>

<FieldLabel class={classes} {...rest}>
  {@render children?.()}
</FieldLabel>
