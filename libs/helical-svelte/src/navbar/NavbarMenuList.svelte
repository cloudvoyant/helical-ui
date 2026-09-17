<!-- libs/helical-svelte/src/navbar/NavbarMenuList.svelte -->
<!-- Closely based on: @ark-ui/svelte/navigation-menu (Ark UI), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { NavigationMenuList, type NavigationMenuListProps } from '@ark-ui/svelte/navigation-menu';
  import { navbarMenuListBase, cn } from '@cloudvoyant/helical-ui';

  let { class: className = '', children, ...rest }: NavigationMenuListProps = $props();

  const classes = $derived(cn(navbarMenuListBase, className));
</script>

<NavigationMenuList class={classes} {...rest}>
  {@render children?.()}
</NavigationMenuList>
