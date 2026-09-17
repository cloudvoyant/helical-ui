// libs/helical-react/src/sidebar/MenuSub.tsx
// Source: shadcn/ui sidebar (https://ui.shadcn.com/docs/components/base/sidebar),
//         re-based on Ark UI (drawer, tooltip, asChild factory)
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import { sidebarStyles, cn } from '@cloudvoyant/helical-ui';

export function MenuSub({ className, ...props }: HTMLArkProps<'ul'>) {
  return (
    <ark.ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(sidebarStyles.menuSubClass, className)}
      {...props}
    />
  );
}
