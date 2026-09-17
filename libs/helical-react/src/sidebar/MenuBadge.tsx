// libs/helical-react/src/sidebar/MenuBadge.tsx
// Source: shadcn/ui sidebar (https://ui.shadcn.com/docs/components/base/sidebar),
//         re-based on Ark UI (drawer, tooltip, asChild factory)
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import { sidebarStyles, cn } from '@cloudvoyant/helical-ui';

export function MenuBadge({ className, ...props }: HTMLArkProps<'div'>) {
  return (
    <ark.div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(sidebarStyles.menuBadgeClass, className)}
      {...props}
    />
  );
}
