<!-- libs/helical-svelte/src/navbar/NavbarMenuLink.svelte -->
<!-- Closely based on: @ark-ui/svelte/navigation-menu (Ark UI), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { NavigationMenuLink, type NavigationMenuLinkProps } from '@ark-ui/svelte/navigation-menu';
  import { navbarMenuLinkBase, navbarMenuTriggerStyle, cn } from '@cloudvoyant/helical-ui';
  import { getNavbarMenuStyle } from './NavbarMenuContext.svelte';

  let { class: className = '', children, ...rest }: NavigationMenuLinkProps = $props();

  const style = getNavbarMenuStyle();
  const classes = $derived(
    style.inContent ? cn(navbarMenuLinkBase, className) : cn(navbarMenuTriggerStyle(style), className),
  );
</script>

<NavigationMenuLink class={classes} {...rest}>
  {@render children?.()}
</NavigationMenuLink>
