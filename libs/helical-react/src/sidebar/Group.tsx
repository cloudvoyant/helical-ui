// libs/helical-react/src/sidebar/Group.tsx
// Source: shadcn/ui sidebar (https://ui.shadcn.com/docs/components/base/sidebar),
//         re-based on Ark UI (drawer, tooltip, asChild factory)
import type { HTMLArkProps } from '@ark-ui/react/factory';
import { sidebarStyles, cn } from '@cloudvoyant/helical-ui';
import { Col } from '../col';

export function Group({ label, className, children, ...props }: HTMLArkProps<'div'> & { label?: string }) {
  return (
    <Col data-slot="sidebar-group" data-sidebar="group" className={cn(sidebarStyles.groupClass, className)} {...props}>
      {label && (
        <div data-slot="sidebar-group-label" data-sidebar="group-label" className={cn(sidebarStyles.groupLabelClass)}>
          {label}
        </div>
      )}
      <div
        data-slot="sidebar-group-content"
        data-sidebar="group-content"
        className={cn(sidebarStyles.groupContentClass)}
      >
        {children}
      </div>
    </Col>
  );
}
