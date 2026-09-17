<!-- libs/helical-svelte/src/navbar/NavbarMenuViewport.svelte -->
<!-- Closely based on: @ark-ui/svelte/navigation-menu (Ark UI), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { NavigationMenuViewport, type NavigationMenuViewportProps } from '@ark-ui/svelte/navigation-menu';
  import { navbarMenuViewportBase, cn } from '@cloudvoyant/helical-ui';

  let { class: className = '', ...rest }: NavigationMenuViewportProps = $props();

  const classes = $derived(cn(navbarMenuViewportBase, className));
</script>

<NavigationMenuViewport class={classes} {...rest} />
