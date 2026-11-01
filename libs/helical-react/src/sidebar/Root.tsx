// libs/helical-react/src/sidebar/Root.tsx
// Source: shadcn/ui sidebar (https://ui.shadcn.com/docs/components/base/sidebar),
//         re-based on Ark UI (drawer, tooltip, asChild factory)
/// <reference lib="dom" />
import type * as React from 'react';
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
  type DrawerRootProps,
} from '@ark-ui/react/drawer';
import { SIDEBAR_WIDTH_MOBILE, sidebarStyles, cn } from '@cloudvoyant/helical-ui';
import { Col } from '../col';
import { useSidebar } from './context';

export function Root({
  side = 'left',
  variant = 'sidebar',
  collapsible = 'offcanvas',
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  side?: 'left' | 'right';
  variant?: 'sidebar' | 'floating' | 'inset';
  collapsible?: 'offcanvas' | 'icon' | 'none';
}) {
  const { isMobile, state, open, setOpen, openMobile, setOpenMobile, controlled } = useSidebar();

  if (collapsible === 'none') {
    return (
      <Col
        data-slot="sidebar"
        data-sidebar="sidebar"
        className={cn('h-full w-(--sidebar-width) bg-sidebar text-sidebar-foreground', className)}
        {...props}
      >
        {children}
      </Col>
    );
  }

  if (isMobile) {
    // A controlled provider drives the mobile drawer with the same `open` state
    // as desktop (one state per sidebar); an uncontrolled one keeps the shadcn
    // split (openMobile for the drawer). The right sidebar renders as a
    // non-modal "widget" drawer: no backdrop, capped at half the viewport height,
    // with a drag grabber that resizes it between snap points.
    const isWidget = side === 'right';
    const drawerOpen = controlled ? open : openMobile;
    const setDrawerOpen = (value: boolean) => (controlled ? setOpen(value) : setOpenMobile(value));
    // Snap points only apply to the widget (bottom-sheet) drawer, where the
    // grabber resizes between 35% and 50% of the viewport height. The full-height
    // side sheet must not be handed snap config — Ark would rest it partially
    // off-canvas at the first snap offset instead of fully in view.
    const snapProps = isWidget
      ? { snapPoints: [0.35, 0.5] as number[], defaultSnapPoint: 0.5, snapToSequentialPoints: true }
      : {};
    return (
      <DrawerRoot
        open={drawerOpen}
        onOpenChange={(details) => setDrawerOpen(details.open)}
        swipeDirection={side === 'left' ? 'start' : 'down'}
        modal={!isWidget}
        {...snapProps}
        preventDragOnScroll={false}
        {...(props as DrawerRootProps)}
      >
        {!isWidget && <DrawerBackdrop className={sidebarStyles.mobileBackdropClass} />}
        <DrawerPositioner className={sidebarStyles.mobilePositionerClass}>
          <DrawerContent
            data-sidebar="sidebar"
            data-slot="sidebar"
            data-mobile="true"
            className={cn(sidebarStyles.mobileContentClass, className)}
            style={{ '--sidebar-width': SIDEBAR_WIDTH_MOBILE } as React.CSSProperties}
          >
            <DrawerTitle className="sr-only">Sidebar</DrawerTitle>
            <DrawerDescription className="sr-only">Displays the mobile sidebar.</DrawerDescription>
            <DrawerCloseTrigger className="hidden" />
            {isWidget && (
              <DrawerGrabber className={sidebarStyles.mobileGrabberClass}>
                <DrawerGrabberIndicator className={sidebarStyles.mobileGrabberIndicatorClass} />
              </DrawerGrabber>
            )}
            {/* Keep the nav itself out of the resize drag so menu clicks land on
                the buttons; only the grabber resizes the widget sheet. */}
            <div data-no-drag className="flex min-h-0 flex-1 flex-col">
              <Col className="h-full w-full">{children}</Col>
            </div>
          </DrawerContent>
        </DrawerPositioner>
      </DrawerRoot>
    );
  }

  return (
    <div
      className="group peer hidden text-sidebar-foreground md:block"
      data-state={state}
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      <div
        data-slot="sidebar-gap"
        className={cn(
          sidebarStyles.gapClass,
          side === 'right' && 'rotate-180',
          variant === 'floating' || variant === 'inset'
            ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
            : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
        )}
      />
      <div
        data-slot="sidebar-container"
        className={cn(
          sidebarStyles.containerClass,
          side === 'left'
            ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
            : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
          variant === 'floating' || variant === 'inset'
            ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
            : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l',
          className,
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          data-variant={variant}
          className={cn(sidebarStyles.innerClass)}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
