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
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

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
    return (
      <DrawerRoot
        open={openMobile}
        onOpenChange={(details) => setOpenMobile(details.open)}
        {...(props as DrawerRootProps)}
      >
        <DrawerBackdrop />
        <DrawerPositioner className="w-(--sidebar-width)">
          <DrawerContent
            data-sidebar="sidebar"
            data-slot="sidebar"
            data-mobile="true"
            className={cn('w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground', className)}
            style={{ '--sidebar-width': SIDEBAR_WIDTH_MOBILE } as React.CSSProperties}
          >
            <DrawerTitle className="sr-only">Sidebar</DrawerTitle>
            <DrawerDescription className="sr-only">Displays the mobile sidebar.</DrawerDescription>
            <DrawerCloseTrigger className="hidden" />
            <Col className="h-full w-full">{children}</Col>
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
