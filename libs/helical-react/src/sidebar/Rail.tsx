// libs/helical-react/src/sidebar/Rail.tsx
// Source: shadcn/ui sidebar (https://ui.shadcn.com/docs/components/base/sidebar),
//         re-based on Ark UI (drawer, tooltip, asChild factory)
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import { sidebarStyles, cn } from '@cloudvoyant/helical-ui';
import { useSidebar } from './context';

export function Rail({ className, ...props }: HTMLArkProps<'button'>) {
  const { toggleSidebar } = useSidebar();

  return (
    <ark.button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      type="button"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(sidebarStyles.railClass, className)}
      {...props}
    />
  );
}
