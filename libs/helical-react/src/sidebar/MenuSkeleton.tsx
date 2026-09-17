// libs/helical-react/src/sidebar/MenuSkeleton.tsx
// Source: shadcn/ui sidebar (https://ui.shadcn.com/docs/components/base/sidebar),
//         re-based on Ark UI (drawer, tooltip, asChild factory)
/// <reference lib="dom" />
import * as React from 'react';
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import { sidebarStyles, cn } from '@cloudvoyant/helical-ui';

export function MenuSkeleton({ className, showIcon = false, ...props }: HTMLArkProps<'div'> & { showIcon?: boolean }) {
  const width = React.useMemo(() => `${Math.floor(Math.random() * 40) + 50}%`, []);

  return (
    <ark.div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn(sidebarStyles.menuSkeletonClass, className)}
      {...props}
    >
      {showIcon && (
        <ark.div
          className="size-4 shrink-0 animate-pulse rounded-md bg-sidebar-accent"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <ark.div
        className="h-4 max-w-(--skeleton-width) flex-1 animate-pulse rounded-md bg-sidebar-accent"
        data-sidebar="menu-skeleton-text"
        style={{ '--skeleton-width': width } as React.CSSProperties}
      />
    </ark.div>
  );
}
