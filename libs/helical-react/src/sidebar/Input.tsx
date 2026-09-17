// libs/helical-react/src/sidebar/Input.tsx
// Source: shadcn/ui sidebar (https://ui.shadcn.com/docs/components/base/sidebar),
//         re-based on Ark UI (drawer, tooltip, asChild factory)
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import { sidebarStyles, cn } from '@cloudvoyant/helical-ui';

export function Input({ className, ...props }: HTMLArkProps<'input'>) {
  return (
    <ark.input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn(sidebarStyles.inputClass, className)}
      {...props}
    />
  );
}
