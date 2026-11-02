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
import {
  SIDEBAR_WIDTH_MOBILE,
  SIDEBAR_WIDGET_SNAP_POINTS,
  SIDEBAR_WIDGET_DEFAULT_SNAP_POINT,
  sidebarStyles,
  cn,
  type SidebarPaneRegistrationProps,
} from '@cloudvoyant/helical-ui';
import { Col } from '../col';
import { useOptionalPaneRegistration } from '../which-key/context';
import { useSidebar } from './context';

export function Root({
  side = 'left',
  variant = 'sidebar',
  collapsible = 'offcanvas',
  paneId,
  paneTitle,
  paneDisabled,
  className,
  children,
  ...props
}: React.ComponentProps<'div'> &
  SidebarPaneRegistrationProps & {
    side?: 'left' | 'right';
    variant?: 'sidebar' | 'floating' | 'inset';
    collapsible?: 'offcanvas' | 'icon' | 'none';
  }) {
  const { isMobile, state, open, setOpen, openMobile, setOpenMobile, isControlled } = useSidebar();
  const pane = useOptionalPaneRegistration({
    paneId,
    paneTitle,
    paneDisabled: paneDisabled || state === 'collapsed',
    defaultTitle: 'Sidebar',
  });

  if (collapsible === 'none') {
    return (
      <Col
        ref={pane.ref}
        data-slot="sidebar"
        data-sidebar="sidebar"
        {...pane.dataAttributes}
        className={cn('h-full w-(--sidebar-width) bg-sidebar text-sidebar-foreground', className)}
        {...props}
      >
        {children}
      </Col>
    );
  }

  if (isMobile) {
    const isBottomWidgetSheet = side === 'right';
    const mobileSheetOpen = isControlled ? open : openMobile;
    const setMobileSheetOpen = isControlled ? setOpen : setOpenMobile;
    const bottomSheetSnapProps = isBottomWidgetSheet
      ? {
          snapPoints: SIDEBAR_WIDGET_SNAP_POINTS,
          defaultSnapPoint: SIDEBAR_WIDGET_DEFAULT_SNAP_POINT,
          snapToSequentialPoints: true,
        }
      : {};
    return (
      <DrawerRoot
        open={mobileSheetOpen}
        onOpenChange={(details) => setMobileSheetOpen(details.open)}
        swipeDirection={side === 'left' ? 'start' : 'down'}
        modal={!isBottomWidgetSheet}
        {...bottomSheetSnapProps}
        preventDragOnScroll={false}
        {...(props as DrawerRootProps)}
      >
        {!isBottomWidgetSheet && <DrawerBackdrop className={sidebarStyles.mobileBackdropClass} />}
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
            {isBottomWidgetSheet && (
              <DrawerGrabber className={sidebarStyles.mobileGrabberClass}>
                <DrawerGrabberIndicator className={sidebarStyles.mobileGrabberIndicatorClass} />
              </DrawerGrabber>
            )}
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
        ref={pane.ref}
        data-slot="sidebar-container"
        {...pane.dataAttributes}
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
