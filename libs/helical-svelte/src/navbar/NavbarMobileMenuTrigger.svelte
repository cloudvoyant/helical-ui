<!-- libs/helical-svelte/src/navbar/NavbarMobileMenuTrigger.svelte -->
<!-- Closely based on: @ark-ui/svelte/collapsible (Ark UI), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { CollapsibleTrigger, type CollapsibleTriggerProps } from '@ark-ui/svelte/collapsible';
  import { navbarMenuTriggerStyle, cn } from '@cloudvoyant/helical-ui';

  let { class: className = '', children, ...rest }: CollapsibleTriggerProps = $props();

  const classes = $derived(cn(navbarMenuTriggerStyle(), 'w-full justify-between', className));
</script>

<CollapsibleTrigger data-slot="navbar-mobile-menu-trigger" class={classes} {...rest}>
  {@render children?.()}
  <svg
    class="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="m6 9 6 6 6-6"></path>
  </svg>
</CollapsibleTrigger>
