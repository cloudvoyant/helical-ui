<!-- libs/helical-svelte/src/navbar/NavbarMenuViewportPositioner.svelte -->
<!-- Closely based on: @ark-ui/svelte/navigation-menu (Ark UI), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import {
    NavigationMenuViewportPositioner,
    type NavigationMenuViewportPositionerProps,
  } from '@ark-ui/svelte/navigation-menu';
  import { navbarMenuViewportPositionerBase, cn } from '@cloudvoyant/helical-ui';

  let { class: className = '', children, ...rest }: NavigationMenuViewportPositionerProps = $props();

  const classes = $derived(cn(navbarMenuViewportPositionerBase, className));
</script>

<NavigationMenuViewportPositioner class={classes} {...rest}>
  {@render children?.()}
</NavigationMenuViewportPositioner>
