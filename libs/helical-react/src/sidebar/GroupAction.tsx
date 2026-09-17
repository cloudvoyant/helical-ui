// libs/helical-react/src/sidebar/GroupAction.tsx
// Source: shadcn/ui sidebar (https://ui.shadcn.com/docs/components/base/sidebar),
//         re-based on Ark UI (drawer, tooltip, asChild factory)
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import { sidebarStyles, cn } from '@cloudvoyant/helical-ui';

export function GroupAction({ className, asChild = false, ...props }: HTMLArkProps<'button'> & { asChild?: boolean }) {
  return (
    <ark.button
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      asChild={asChild}
      type="button"
      className={cn(sidebarStyles.groupActionClass, className)}
      {...props}
    />
  );
}
