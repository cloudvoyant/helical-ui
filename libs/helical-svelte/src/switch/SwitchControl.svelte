<!-- libs/helical-svelte/src/switch/SwitchControl.svelte -->
<!-- Closely based on: Shark UI switch (@ark-ui/svelte/switch), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { getContext } from 'svelte';
  import { SwitchControl, type SwitchControlProps } from '@ark-ui/svelte/switch';
  import { switchVariants, switchControlBase, cn } from '@cloudvoyant/helical-ui';

  let { class: className = '', children, ...rest }: SwitchControlProps = $props();

  const size = getContext<'sm' | 'md' | 'lg'>('switch-size');

  const classes = $derived(cn(switchVariants({ size }), switchControlBase, className));
</script>

<SwitchControl class={classes} {...rest}>
  {@render children?.()}
</SwitchControl>
