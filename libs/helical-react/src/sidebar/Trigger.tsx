// libs/helical-react/src/sidebar/Trigger.tsx
// Source: shadcn/ui sidebar (https://ui.shadcn.com/docs/components/base/sidebar),
//         re-based on Ark UI (drawer, tooltip, asChild factory)
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import { sidebarStyles, cn } from '@cloudvoyant/helical-ui';
import { useSidebar } from './context';

export function Trigger({ className, onClick, children, ...props }: HTMLArkProps<'button'>) {
  const { toggleSidebar } = useSidebar();

  return (
    <ark.button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      type="button"
      aria-label="Toggle Sidebar"
      className={cn(sidebarStyles.triggerClass, className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      {children}
    </ark.button>
  );
}
