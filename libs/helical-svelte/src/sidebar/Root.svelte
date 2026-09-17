<!-- libs/helical-svelte/src/Sidebar.svelte -->
<!-- Source: @ark-ui/svelte/drawer (Ark UI), mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import {
    DrawerRoot,
    DrawerBackdrop,
    DrawerPositioner,
    DrawerContent,
    DrawerTitle,
    DrawerDescription,
    DrawerCloseTrigger,
  } from '@ark-ui/svelte/drawer';
  import { SIDEBAR_WIDTH_MOBILE, sidebarStyles, cn } from '@cloudvoyant/helical-ui';
  import Col from '../Col.svelte';
  import { getSidebarContext } from './context.svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    side?: 'left' | 'right';
    variant?: 'sidebar' | 'floating' | 'inset';
    collapsible?: 'offcanvas' | 'icon' | 'none';
    class?: string;
    children?: Snippet;
  } & HTMLAttributes<HTMLDivElement> & { id?: string; role?: 'dialog' | 'alertdialog' };

  let {
    side = 'left',
    variant = 'sidebar',
    collapsible = 'offcanvas',
    class: className = '',
    children,
    ...rest
  }: Props = $props();

  const sidebar = getSidebarContext();
  const state = $derived(sidebar.state);
  const isMobile = $derived(sidebar.isMobile);
  const openMobile = $derived(sidebar.openMobile);
  const setOpenMobile = sidebar.setOpenMobile;

  const containerClasses = $derived(
    cn(
      sidebarStyles.containerClass,
      side === 'left'
        ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
        : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
      variant === 'floating' || variant === 'inset'
        ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
        : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l',
      className,
    ),
  );

  const gapClasses = $derived(
    cn(
      sidebarStyles.gapClass,
      side === 'right' && 'rotate-180',
      variant === 'floating' || variant === 'inset'
        ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
        : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
    ),
  );
</script>

{#if collapsible === 'none'}
  <Col
    data-slot="sidebar"
    data-sidebar="sidebar"
    class={cn('h-full w-(--sidebar-width) bg-sidebar text-sidebar-foreground', className)}
    {...rest}
  >
    {@render children?.()}
  </Col>
{:else if isMobile}
  <DrawerRoot open={openMobile} onOpenChange={(details) => setOpenMobile(details.open)} {...rest}>
    <DrawerBackdrop />
    <DrawerPositioner class="w-(--sidebar-width)">
      <DrawerContent
        data-sidebar="sidebar"
        data-slot="sidebar"
        data-mobile="true"
        class="w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground"
        style={`--sidebar-width: ${SIDEBAR_WIDTH_MOBILE};`}
      >
        <DrawerTitle class="sr-only">Sidebar</DrawerTitle>
        <DrawerDescription class="sr-only">Displays the mobile sidebar.</DrawerDescription>
        <DrawerCloseTrigger class="hidden" />
        <Col class="h-full w-full">{@render children?.()}</Col>
      </DrawerContent>
    </DrawerPositioner>
  </DrawerRoot>
{:else}
  <div
    class="group peer hidden text-sidebar-foreground md:block"
    data-state={state}
    data-collapsible={state === 'collapsed' ? collapsible : ''}
    data-variant={variant}
    data-side={side}
    data-slot="sidebar"
  >
    <div data-slot="sidebar-gap" class={gapClasses}></div>
    <div data-slot="sidebar-container" class={containerClasses} {...rest}>
      <Col data-sidebar="sidebar" data-slot="sidebar-inner" data-variant={variant} class={cn(sidebarStyles.innerClass)}>
        {@render children?.()}
      </Col>
    </div>
  </div>
{/if}
