<!-- libs/helical-svelte/src/checkbox/CheckboxIndicator.svelte -->
<!-- Closely based on: Shark UI checkbox (@ark-ui/svelte/checkbox), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { CheckboxIndicator, type CheckboxIndicatorProps } from '@ark-ui/svelte/checkbox';
  import { checkboxIndicatorBase, cn } from '@cloudvoyant/helical-ui';

  let { class: className = '', children, ...rest }: CheckboxIndicatorProps = $props();

  const classes = $derived(cn(checkboxIndicatorBase, className));
</script>

<CheckboxIndicator class={classes} {...rest}>
  {@render children?.()}
</CheckboxIndicator>
