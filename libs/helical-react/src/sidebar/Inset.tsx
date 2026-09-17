// libs/helical-react/src/sidebar/Inset.tsx
// Source: shadcn/ui sidebar (https://ui.shadcn.com/docs/components/base/sidebar),
//         re-based on Ark UI (drawer, tooltip, asChild factory)
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import { sidebarStyles, cn } from '@cloudvoyant/helical-ui';

export function Inset({ className, ...props }: HTMLArkProps<'main'>) {
  return <ark.main data-slot="sidebar-inset" className={cn(sidebarStyles.insetClass, className)} {...props} />;
}
