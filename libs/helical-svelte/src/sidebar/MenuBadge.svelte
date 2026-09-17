<!-- libs/helical-svelte/src/SidebarMenuBadge.svelte -->
<!-- Source: @ark-ui/svelte/factory (Ark UI), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import { sidebarStyles, cn } from '@cloudvoyant/helical-ui';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    class?: string;
    children?: Snippet;
  } & HTMLAttributes<HTMLDivElement>;

  let { class: className = '', children, ...rest }: Props = $props();
</script>

<Ark
  as="div"
  data-slot="sidebar-menu-badge"
  data-sidebar="menu-badge"
  class={cn(sidebarStyles.menuBadgeClass, className)}
  {...rest}
>
  {@render children?.()}
</Ark>
