<!-- libs/helical-svelte/src/field/FieldSet.svelte -->
<!-- Closely based on: Shark UI field (@ark-ui/svelte/fieldset), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { FieldsetRoot, type FieldsetRootProps } from '@ark-ui/svelte/fieldset';
  import { fieldsetRootBase, cn } from '@cloudvoyant/helical-ui';

  let { class: className = '', children, ...rest }: FieldsetRootProps = $props();

  const classes = $derived(cn(fieldsetRootBase, className));
</script>

<FieldsetRoot class={classes} {...rest}>
  {@render children?.()}
</FieldsetRoot>
