<!-- libs/helical-svelte/src/navbar/NavbarMobileMenuContent.svelte -->
<!-- Closely based on: @ark-ui/svelte/collapsible (Ark UI), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { CollapsibleContent } from '@ark-ui/svelte/collapsible';
  import { navbarMobileMenuContentBase, cn } from '@cloudvoyant/helical-ui';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    class?: string;
    children?: Snippet;
  } & HTMLAttributes<HTMLDivElement>;

  let { class: className = '', children, ...rest }: Props = $props();

  const classes = $derived(cn(navbarMobileMenuContentBase, className));
</script>

<CollapsibleContent>
  <div data-slot="navbar-mobile-menu-content" class={classes} {...rest}>
    {@render children?.()}
  </div>
</CollapsibleContent>
