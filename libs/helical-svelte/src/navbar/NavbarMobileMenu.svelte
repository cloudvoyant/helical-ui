<!-- libs/helical-svelte/src/navbar/NavbarMobileMenu.svelte -->
<!-- Closely based on: @ark-ui/svelte/collapsible (Ark UI), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { CollapsibleRoot, type CollapsibleRootProps } from '@ark-ui/svelte/collapsible';
  import { cn } from '@cloudvoyant/helical-ui';

  let { class: className = '', children, ...rest }: CollapsibleRootProps = $props();

  const classes = $derived(cn('group', className));
</script>

<CollapsibleRoot data-slot="navbar-mobile-menu" class={classes} {...rest}>
  {@render children?.()}
</CollapsibleRoot>
