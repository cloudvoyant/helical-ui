// libs/helical-react/src/sidebar/Separator.tsx
// Source: shadcn/ui sidebar (https://ui.shadcn.com/docs/components/base/sidebar),
//         re-based on Ark UI (drawer, tooltip, asChild factory)
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import { sidebarStyles, cn } from '@cloudvoyant/helical-ui';

export function Separator({ className, ...props }: HTMLArkProps<'div'>) {
  return (
    <ark.div
      data-slot="sidebar-separator"
      data-sidebar="separator"
      role="separator"
      className={cn(sidebarStyles.separatorClass, className)}
      {...props}
    />
  );
}
