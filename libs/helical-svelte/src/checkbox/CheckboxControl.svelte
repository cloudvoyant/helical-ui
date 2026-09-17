<!-- libs/helical-svelte/src/checkbox/CheckboxControl.svelte -->
<!-- Closely based on: Shark UI checkbox (@ark-ui/svelte/checkbox), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { getContext } from 'svelte';
  import { CheckboxControl, type CheckboxControlProps } from '@ark-ui/svelte/checkbox';
  import { checkboxVariants, cn } from '@cloudvoyant/helical-ui';

  let { class: className = '', children, ...rest }: CheckboxControlProps = $props();

  const size = getContext<'sm' | 'md' | 'lg'>('checkbox-size');

  const classes = $derived(cn(checkboxVariants({ size }), className));
</script>

<CheckboxControl class={classes} {...rest}>
  {@render children?.()}
</CheckboxControl>
