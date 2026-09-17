<!-- libs/helical-svelte/src/navbar/NavbarMenuItem.svelte -->
<!-- Closely based on: @ark-ui/svelte/navigation-menu (Ark UI), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { NavigationMenuItem, type NavigationMenuItemProps } from '@ark-ui/svelte/navigation-menu';
  import { navbarMenuItemBase, cn, type NavbarMenuVariant } from '@cloudvoyant/helical-ui';
  import { getNavbarMenuStyle, setNavbarMenuStyle } from './NavbarMenuContext.svelte';

  let {
    value,
    disabled = false,
    variant = 'default',
    class: className = '',
    children,
    ...rest
  }: NavigationMenuItemProps & { variant?: NavbarMenuVariant } = $props();

  const parentStyle = getNavbarMenuStyle();
  setNavbarMenuStyle({
    get density() {
      return parentStyle.density;
    },
    get variant() {
      return variant;
    },
    get inContent() {
      return false;
    },
  });
  const classes = $derived(cn(navbarMenuItemBase, className));
</script>

<NavigationMenuItem {value} {disabled} data-variant={variant} class={classes} {...rest}>
  {@render children?.()}
</NavigationMenuItem>
