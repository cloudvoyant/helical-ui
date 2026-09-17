// libs/helical-react/src/sidebar/MenuSubItem.tsx
// Source: shadcn/ui sidebar (https://ui.shadcn.com/docs/components/base/sidebar),
//         re-based on Ark UI (drawer, tooltip, asChild factory)
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import { sidebarStyles, cn } from '@cloudvoyant/helical-ui';

export function MenuSubItem({ className, ...props }: HTMLArkProps<'li'>) {
  return (
    <ark.li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn(sidebarStyles.menuSubItemClass, className)}
      {...props}
    />
  );
}
