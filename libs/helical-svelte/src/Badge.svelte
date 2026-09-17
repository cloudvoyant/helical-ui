<!-- libs/helical-svelte/src/Badge.svelte -->
<!-- Closely based on: @ark-ui/svelte/factory (Ark UI), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import { badgeVariants, cn } from '@cloudvoyant/helical-ui';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    variant?: 'solid' | 'subtle' | 'outline' | 'surface' | 'plain';
    color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warn' | 'info';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    class?: string;
    children?: Snippet;
  } & HTMLAttributes<HTMLSpanElement>;

  let { variant = 'subtle', color = 'primary', size = 'sm', class: className = '', children, ...rest }: Props = $props();

  const classes = $derived(cn(badgeVariants({ variant, color, size }), className));
</script>

<Ark as="span" class={classes} {...rest}>
  {@render children?.()}
</Ark>
