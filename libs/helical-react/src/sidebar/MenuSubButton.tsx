// libs/helical-react/src/sidebar/MenuSubButton.tsx
// Source: shadcn/ui sidebar (https://ui.shadcn.com/docs/components/base/sidebar),
//         re-based on Ark UI (drawer, tooltip, asChild factory)
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import { sidebarStyles, cn } from '@cloudvoyant/helical-ui';

export function MenuSubButton({
  asChild = false,
  size = 'md',
  isActive = false,
  className,
  ...props
}: HTMLArkProps<'a'> & {
  asChild?: boolean;
  size?: 'sm' | 'md';
  isActive?: boolean;
}) {
  return (
    <ark.a
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      asChild={asChild}
      className={cn(sidebarStyles.menuSubButtonClass, className)}
      {...props}
    />
  );
}
