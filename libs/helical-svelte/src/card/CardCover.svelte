<!-- libs/helical-svelte/src/card/CardCover.svelte -->
<!-- Closely based on: Chakra UI Card, built on @ark-ui/svelte/factory (Ark UI), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { getContext } from 'svelte';
  import { Ark } from '@ark-ui/svelte/factory';
  import { cardCoverVariants, cn } from '@cloudvoyant/helical-ui';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    variant?: 'flush' | 'inset';
    orientation?: 'vertical' | 'horizontal';
    class?: string;
    children?: Snippet;
  } & HTMLAttributes<HTMLDivElement>;

  let { variant = 'flush', orientation, class: className = '', children, ...rest }: Props = $props();

  const contextOrientation = getContext<'vertical' | 'horizontal'>('card-orientation');

  const classes = $derived(cn(cardCoverVariants({ variant, orientation: orientation ?? contextOrientation }), className));
</script>

<Ark as="div" class={classes} {...rest}>
  {@render children?.()}
</Ark>
