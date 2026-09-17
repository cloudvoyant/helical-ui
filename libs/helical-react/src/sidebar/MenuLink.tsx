// libs/helical-react/src/sidebar/MenuLink.tsx
// Source: @cloudvoyant/helical-react sidebar shorthand (shadcn/ui sidebar, re-based on Ark UI)
// Renders a single menu item: <li> > <a|button>, with icon, label, active state,
// and (in the collapsed icon-rail state) a tooltip. Composes SidebarMenuButton
// for the button styles + tooltip behavior.
import type * as React from 'react';
import { sidebarStyles, cn } from '@cloudvoyant/helical-ui';
import { MenuButton } from './MenuButton';

export interface MenuLinkProps {
  /** Icon shown before the label. */
  icon?: React.ReactNode;
  /** Optional href; renders an <a> instead of a <button> when set. */
  href?: string;
  /** Marks the item active. */
  isActive?: boolean;
  /** Menu button style. */
  variant?: 'default' | 'outline';
  /** Menu button size. */
  size?: 'default' | 'sm' | 'lg';
  /** Label shown as a tooltip when the sidebar is collapsed to an icon rail. */
  tooltip?: MenuButtonProps['tooltip'];
  /** Click handler; receives the anchor or button event. */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  /** Extra classes merged via `cn`. */
  className?: string;
  /** The item label. */
  children?: React.ReactNode;
}

type MenuButtonProps = React.ComponentProps<typeof MenuButton>;

export function MenuLink({
  icon,
  href,
  onClick,
  isActive,
  variant,
  size,
  tooltip,
  className,
  children,
}: MenuLinkProps) {
  const content = (
    <>
      {icon}
      {children != null && <span>{children}</span>}
    </>
  );

  return (
    <li data-slot="sidebar-menu-item" data-sidebar="menu-item" className={cn(sidebarStyles.menuItemClass)}>
      {href == null ? (
        <MenuButton
          isActive={isActive}
          variant={variant}
          size={size}
          tooltip={tooltip}
          className={className}
          onClick={onClick}
        >
          {content}
        </MenuButton>
      ) : (
        <MenuButton asChild isActive={isActive} variant={variant} size={size} tooltip={tooltip} className={className}>
          <a href={href} onClick={onClick}>
            {content}
          </a>
        </MenuButton>
      )}
    </li>
  );
}
