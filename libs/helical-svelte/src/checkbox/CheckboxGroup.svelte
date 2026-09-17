<!-- libs/helical-svelte/src/checkbox/CheckboxGroup.svelte -->
<!-- Closely based on: Shark UI checkbox (@ark-ui/svelte/checkbox), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { CheckboxGroup, type CheckboxGroupProps } from '@ark-ui/svelte/checkbox';
  import { checkboxGroupBase, cn } from '@cloudvoyant/helical-ui';

  let { class: className = '', children, ...rest }: CheckboxGroupProps = $props();

  const classes = $derived(cn(checkboxGroupBase, className));
</script>

<CheckboxGroup class={classes} {...rest}>
  {@render children?.()}
</CheckboxGroup>
