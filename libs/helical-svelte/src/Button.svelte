<!-- libs/helical-svelte/src/Button.svelte -->
<!-- Closely based on: @ark-ui/svelte/factory (Ark UI), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import { buttonVariants, cn } from '@cloudvoyant/helical-ui';
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  type Props = {
    variant?: 'solid' | 'outline' | 'text';
    color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warn' | 'info';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    class?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    children?: Snippet;
  } & HTMLButtonAttributes;

  let {
    variant = 'solid',
    color = 'primary',
    size = 'md',
    class: className = '',
    type = 'button',
    disabled = false,
    children,
    ...rest
  }: Props = $props();

  const classes = $derived(cn(buttonVariants({ variant, color, size }), className));
</script>

<Ark as="button" class={classes} {type} {disabled} {...rest}>
  {@render children?.()}
</Ark>
