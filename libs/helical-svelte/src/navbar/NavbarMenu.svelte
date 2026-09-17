<!-- libs/helical-svelte/src/navbar/NavbarMenu.svelte -->
<!-- Source: @cloudvoyant/helical-react navbar menu (shadcnblocks navbar6/7, re-based on Ark UI) -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import {
    NavigationMenuRoot,
    NavigationMenuViewport,
    NavigationMenuViewportPositioner,
    type NavigationMenuRootProps,
  } from '@ark-ui/svelte/navigation-menu';
  import {
    navbarMenuRootBase,
    navbarMenuViewportPositionerBase,
    navbarMenuViewportBase,
    navbarMenuBase,
    navbarMenuPlacementVariants,
    cn,
    type NavbarMenuDensity,
    type NavbarMenuVariant,
  } from '@cloudvoyant/helical-ui';
  import { setNavbarMenuStyle } from './NavbarMenuContext.svelte';
  import { getNavbarContext } from './NavbarContext.svelte';
  import type { Snippet } from 'svelte';

  type Props = NavigationMenuRootProps & {
    placement?: 'left' | 'center' | 'right';
    class?: string;
    children?: Snippet;
  };

  let { placement = 'center', class: className = '', children, ...rest }: Props = $props();

  const navbar = getNavbarContext();
  const menuDensity = $derived<NavbarMenuDensity>(
    navbar.density === 'compact' || (navbar.variant === 'shrink' && navbar.scrolled)
      ? 'compact'
      : 'relaxed',
  );
  const classes = $derived(cn(navbarMenuBase, navbarMenuPlacementVariants({ placement }), className));

  setNavbarMenuStyle({
    get density() {
      return menuDensity;
    },
    get variant() {
      return 'default' as NavbarMenuVariant;
    },
    get inContent() {
      return false;
    },
  });
</script>

<Ark as="nav" data-slot="navbar-menu" data-placement={placement} class={classes}>
  <NavigationMenuRoot data-density={menuDensity} class={cn(navbarMenuRootBase)} {...rest}>
    {@render children?.()}
    <NavigationMenuViewportPositioner class={cn(navbarMenuViewportPositionerBase)}>
      <NavigationMenuViewport class={cn(navbarMenuViewportBase)} />
    </NavigationMenuViewportPositioner>
  </NavigationMenuRoot>
</Ark>
