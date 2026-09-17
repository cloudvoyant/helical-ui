// libs/helical-ui/src/navbar-menu.ts
// Closely based on: Ark UI navigation-menu (https://ark-ui.com/docs/components/navigation-menu),
//                   styled per shadcn navigation-menu (https://ui.shadcn.com/docs/components/base/navigation-menu).
// Shared class strings / cva / types. No framework imports.
//
// NavbarMenu is the Navbar's menu: it is coupled to the Navbar, so density
// (root) and variant (item) are resolved DIRECTLY via cva — the framework
// wrappers pass the values through context, so no data-attribute /
// group-data selectors are needed. Top-level links use `navbarMenuTriggerStyle`
// (so they match the triggers); dropdown content links use `navbarMenuLinkBase`.
import { cva } from 'class-variance-authority';

export const navbarMenuRootBase = 'group/nav-menu relative flex max-w-max flex-1 items-center justify-center';

export const navbarMenuListBase = 'group flex flex-1 list-none items-center justify-center gap-1';

export const navbarMenuItemBase = 'relative';

export type NavbarMenuDensity = 'relaxed' | 'compact';

export type NavbarMenuVariant = 'default' | 'link';

export const navbarMenuTriggerStyle = cva(
  'group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent/50 data-[state=open]:text-accent-foreground data-[state=open]:hover:bg-accent data-[state=open]:focus:bg-accent',
  {
    variants: {
      density: {
        relaxed: '',
        compact: 'h-8 px-2 text-xs',
      },
      variant: {
        default: '',
        link: 'bg-transparent px-3 text-muted-foreground hover:bg-transparent hover:text-primary focus:bg-transparent focus:text-primary focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:bg-transparent data-[state=open]:text-primary data-[state=open]:hover:bg-transparent data-[state=open]:focus:bg-transparent data-[active=true]:bg-transparent data-[active=true]:text-primary',
      },
    },
    defaultVariants: { density: 'relaxed', variant: 'default' },
  },
);

export const navbarMenuContentBase =
  'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 left-0 top-0 w-full min-w-44 bg-popover p-2 text-popover-foreground md:absolute md:w-auto';

export const navbarMenuLinkBase =
  'data-[active=true]:bg-accent data-[active=true]:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring';

export const navbarMobileMenuContentBase = 'flex flex-col gap-1 py-1';

export const navbarMobileMenuTriggerBase =
  'flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export const navbarMenuViewportPositionerBase = 'absolute left-0 top-full z-50 w-full';

export const navbarMenuViewportBase =
  'absolute left-(--viewport-x) top-0 mt-1.5 h-(--viewport-height) w-(--viewport-width) overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md transition-[width,height] duration-200';

export const navbarMenuIndicatorBase =
  'data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-50 flex h-1.5 items-end justify-center overflow-hidden';
