<!-- libs/helical-svelte/src/navbar/NavbarMenuIndicator.svelte -->
<!-- Closely based on: @ark-ui/svelte/navigation-menu (Ark UI), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { NavigationMenuIndicator, type NavigationMenuIndicatorProps } from '@ark-ui/svelte/navigation-menu';
  import { navbarMenuIndicatorBase, cn } from '@cloudvoyant/helical-ui';

  let { class: className = '', ...rest }: NavigationMenuIndicatorProps = $props();

  const classes = $derived(cn(navbarMenuIndicatorBase, className));
</script>

<NavigationMenuIndicator class={classes} {...rest} />
