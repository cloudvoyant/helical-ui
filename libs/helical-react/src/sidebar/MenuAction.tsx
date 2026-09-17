// libs/helical-react/src/sidebar/MenuAction.tsx
// Source: shadcn/ui sidebar (https://ui.shadcn.com/docs/components/base/sidebar),
//         re-based on Ark UI (drawer, tooltip, asChild factory)
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import { sidebarStyles, cn } from '@cloudvoyant/helical-ui';

export function MenuAction({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}: HTMLArkProps<'button'> & {
  asChild?: boolean;
  showOnHover?: boolean;
}) {
  return (
    <ark.button
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      asChild={asChild}
      type="button"
      className={cn(
        sidebarStyles.menuActionClass,
        showOnHover &&
          'group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground data-[state=open]:opacity-100 md:opacity-0',
        className,
      )}
      {...props}
    />
  );
}
