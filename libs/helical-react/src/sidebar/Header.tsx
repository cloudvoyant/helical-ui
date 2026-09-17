// libs/helical-react/src/sidebar/Header.tsx
// Source: shadcn/ui sidebar (https://ui.shadcn.com/docs/components/base/sidebar),
//         re-based on Ark UI (drawer, tooltip, asChild factory)
import type { HTMLArkProps } from '@ark-ui/react/factory';
import { sidebarStyles, cn } from '@cloudvoyant/helical-ui';
import { Col } from '../col';

export function Header({ className, ...props }: HTMLArkProps<'div'>) {
  return (
    <Col
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn(sidebarStyles.headerClass, className)}
      {...props}
    />
  );
}
