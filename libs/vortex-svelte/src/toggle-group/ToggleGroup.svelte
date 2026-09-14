<!-- libs/vortex-svelte/src/toggle-group/ToggleGroup.svelte -->
<!-- Closely based on: @ark-ui/svelte/toggle-group, mirrored from @cloudvoyant/vortex-react -->
<script lang="ts">
  import { ToggleGroupRoot, type ToggleGroupRootProps } from '@ark-ui/svelte/toggle-group';
  import { toggleGroupRootVariants, cn } from '@cloudvoyant/vortex-ui';
  import type { Snippet } from 'svelte';

  type Props = ToggleGroupRootProps & {
    orientation?: 'horizontal' | 'vertical';
    attached?: boolean | null;
    class?: string;
    children?: Snippet;
  };

  let {
    orientation = 'horizontal',
    attached = false,
    class: className = '',
    children,
    ...rest
  }: Props = $props();

  const classes = $derived(cn(toggleGroupRootVariants({ orientation, attached }), className));
</script>

<ToggleGroupRoot {orientation} class={classes} {...rest}>
  {#if children}{@render children()}{/if}
</ToggleGroupRoot>
