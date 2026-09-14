<!-- libs/vortex-svelte/src/toggle-group/ToggleGroupItem.svelte -->
<!-- Closely based on: @ark-ui/svelte/toggle-group, mirrored from @cloudvoyant/vortex-react -->
<script lang="ts">
  import { ToggleGroupItem, type ToggleGroupItemProps } from '@ark-ui/svelte/toggle-group';
  import { toggleButtonVariants, cn } from '@cloudvoyant/vortex-ui';
  import type { Snippet } from 'svelte';

  type Props = ToggleGroupItemProps & {
    variant?: 'default' | 'outline';
    size?: 'default' | 'sm' | 'lg';
    class?: string;
    children?: Snippet;
  };

  let {
    variant = 'default',
    size = 'default',
    class: className = '',
    children,
    ...rest
  }: Props = $props();

  const classes = $derived(cn(toggleButtonVariants({ variant, size }), className));
</script>

<ToggleGroupItem class={classes} {...rest}>
  {#if children}{@render children()}{/if}
</ToggleGroupItem>
