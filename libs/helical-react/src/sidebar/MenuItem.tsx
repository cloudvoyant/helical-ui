// libs/helical-react/src/sidebar/MenuItem.tsx
// Source: shadcn/ui sidebar (https://ui.shadcn.com/docs/components/base/sidebar),
//         re-based on Ark UI (drawer, tooltip, asChild factory)
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import { sidebarStyles, cn } from '@cloudvoyant/helical-ui';

export function MenuItem({ className, ...props }: HTMLArkProps<'li'>) {
  return (
    <ark.li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn(sidebarStyles.menuItemClass, className)}
      {...props}
    />
  );
}
