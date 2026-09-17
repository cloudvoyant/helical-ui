<!-- libs/helical-svelte/src/navbar/NavbarBrand.svelte -->
<!-- Source: @cloudvoyant/helical-react navbar brand (shadcnblocks navbar6/7, re-based on Ark UI) -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import { navbarBrandBase, cn } from '@cloudvoyant/helical-ui';
  import { getNavbarContext } from './NavbarContext.svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    class?: string;
    children?: Snippet;
  } & HTMLAttributes<HTMLDivElement>;

  let { class: className = '', children, ...rest }: Props = $props();

  const navbar = getNavbarContext();
  $effect(() => navbar.setSlot('brand', children));

  const classes = $derived(cn(navbarBrandBase, className));
</script>

<Ark as="div" data-slot="navbar-brand" class={classes} {...rest}>
  {@render children?.()}
</Ark>
