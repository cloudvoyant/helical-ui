// libs/helical-react/src/sidebar/Content.tsx
// Source: shadcn/ui sidebar (https://ui.shadcn.com/docs/components/base/sidebar),
//         re-based on Ark UI (drawer, tooltip, asChild factory)
import type { HTMLArkProps } from '@ark-ui/react/factory';
import { sidebarStyles, cn } from '@cloudvoyant/helical-ui';
import { Col } from '../col';

export function Content({ className, ...props }: HTMLArkProps<'div'>) {
  return (
    <Col
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(sidebarStyles.contentClass, className)}
      {...props}
    />
  );
}
