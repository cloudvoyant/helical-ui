<!-- libs/helical-svelte/src/card/Card.svelte -->
<!-- Closely based on: Chakra UI Card, built on @ark-ui/svelte/factory (Ark UI), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { setContext } from 'svelte';
  import { Ark } from '@ark-ui/svelte/factory';
  import { cardVariants, cn } from '@cloudvoyant/helical-ui';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    variant?: 'outline' | 'elevated' | 'subtle';
    size?: 'sm' | 'md' | 'lg';
    orientation?: 'vertical' | 'horizontal';
    class?: string;
    children?: Snippet;
  } & HTMLAttributes<HTMLDivElement>;

  let {
    variant = 'outline',
    size = 'md',
    orientation = 'vertical',
    class: className = '',
    children,
    ...rest
  }: Props = $props();

  setContext<'vertical' | 'horizontal'>('card-orientation', orientation);

  const classes = $derived(cn(cardVariants({ variant, size, orientation }), className));
</script>

<Ark as="div" class={classes} {...rest}>
  {@render children?.()}
</Ark>
