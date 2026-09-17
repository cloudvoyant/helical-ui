<!-- libs/helical-svelte/src/SidebarTrigger.svelte -->
<!-- Source: @ark-ui/svelte/factory (Ark UI), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import { sidebarStyles, cn } from '@cloudvoyant/helical-ui';
  import { getSidebarContext } from './context.svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  type Props = {
    class?: string;
    children?: Snippet;
  } & HTMLButtonAttributes;

  let { class: className = '', children, onclick, ...rest }: Props = $props();

  const { toggleSidebar } = getSidebarContext();
</script>

<Ark
  as="button"
  data-sidebar="trigger"
  data-slot="sidebar-trigger"
  type="button"
  aria-label="Toggle Sidebar"
  class={cn(sidebarStyles.triggerClass, className)}
  onclick={(e) => {
    onclick?.(e);
    toggleSidebar();
  }}
  {...rest}
>
  {@render children?.()}
</Ark>
