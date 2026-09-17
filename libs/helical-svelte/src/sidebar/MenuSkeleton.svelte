<!-- libs/helical-svelte/src/SidebarMenuSkeleton.svelte -->
<!-- Source: @ark-ui/svelte/factory (Ark UI), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import { sidebarStyles, cn } from '@cloudvoyant/helical-ui';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    showIcon?: boolean;
    class?: string;
  } & HTMLAttributes<HTMLDivElement>;

  let { showIcon = false, class: className = '', ...rest }: Props = $props();

  const width = $derived(`${Math.floor(Math.random() * 40) + 50}%`);
</script>

<Ark
  as="div"
  data-slot="sidebar-menu-skeleton"
  data-sidebar="menu-skeleton"
  class={cn(sidebarStyles.menuSkeletonClass, className)}
  {...rest}
>
  {#if showIcon}
    <Ark
      as="div"
      class="size-4 shrink-0 animate-pulse rounded-md bg-sidebar-accent"
      data-sidebar="menu-skeleton-icon"
    />
  {/if}
  <Ark
    as="div"
    class="h-4 max-w-(--skeleton-width) flex-1 animate-pulse rounded-md bg-sidebar-accent"
    data-sidebar="menu-skeleton-text"
    style={`--skeleton-width: ${width};`}
  />
</Ark>
