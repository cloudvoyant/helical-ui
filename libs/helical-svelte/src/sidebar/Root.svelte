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
    DrawerGrabber,
    DrawerGrabberIndicator,
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
  const open = $derived(sidebar.open);
  const setOpen = sidebar.setOpen;
  const openMobile = $derived(sidebar.openMobile);
  const setOpenMobile = sidebar.setOpenMobile;
  const controlled = $derived(sidebar.controlled);

  // A controlled provider drives the mobile drawer with the same `open` state as
  // desktop; an uncontrolled one keeps the shadcn split (openMobile for the
  // drawer). The right sidebar renders as a non-modal "widget" drawer.
  const drawerOpen = $derived(controlled ? open : openMobile);
  const isWidget = $derived(side === 'right');
  const setDrawerOpen = (value: boolean) => (controlled ? setOpen(value) : setOpenMobile(value));

  // Snap points only apply to the widget (bottom-sheet) drawer, where the
  // grabber resizes between 35% and 50% of the viewport height. The full-height
  // side sheet must not be handed snap config — Ark would rest it partially
  // off-canvas at the first snap offset instead of fully in view.
  const snapPoints = $derived(isWidget ? [0.35, 0.5] : undefined);
  const defaultSnapPoint = $derived(isWidget ? 0.5 : undefined);
  const snapToSequentialPoints = $derived(isWidget);

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
  <DrawerRoot
    open={drawerOpen}
    onOpenChange={(details) => setDrawerOpen(details.open)}
    swipeDirection={side === 'left' ? 'start' : 'down'}
    modal={!isWidget}
    {snapPoints}
    {defaultSnapPoint}
    {snapToSequentialPoints}
    preventDragOnScroll={false}
    {...rest}
  >
    {#if !isWidget}
      <DrawerBackdrop class={sidebarStyles.mobileBackdropClass} />
    {/if}
    <DrawerPositioner class={sidebarStyles.mobilePositionerClass}>
      <DrawerContent
        data-sidebar="sidebar"
        data-slot="sidebar"
        data-mobile="true"
        class={cn(sidebarStyles.mobileContentClass, className)}
        style={`--sidebar-width: ${SIDEBAR_WIDTH_MOBILE};`}
      >
        <DrawerTitle class="sr-only">Sidebar</DrawerTitle>
        <DrawerDescription class="sr-only">Displays the mobile sidebar.</DrawerDescription>
        <DrawerCloseTrigger class="hidden" />
        {#if isWidget}
          <DrawerGrabber class={sidebarStyles.mobileGrabberClass}>
            <DrawerGrabberIndicator class={sidebarStyles.mobileGrabberIndicatorClass} />
          </DrawerGrabber>
        {/if}
        <div data-no-drag class="flex min-h-0 flex-1 flex-col">
          <Col class="h-full w-full">{@render children?.()}</Col>
        </div>
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
