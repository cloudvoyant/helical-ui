// libs/helical-ui/src/sidebar.ts
// Source: shadcn/ui sidebar (https://ui.shadcn.com/docs/components/base/sidebar),
//         re-based on Ark UI. Shared class strings / cva / constants / types.
import { cva, type VariantProps } from 'class-variance-authority';

export const SIDEBAR_WIDTH = '16rem';
export const SIDEBAR_WIDTH_MOBILE = '18rem';
export const SIDEBAR_WIDTH_ICON = '3rem';
export const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

export const sidebarMenuButtonVariants = cva(
  'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm ring-sidebar-ring outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        outline:
          'bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]',
      },
      size: {
        default: 'h-8 text-sm',
        sm: 'h-7 text-xs',
        lg: 'h-12 text-sm group-data-[collapsible=icon]:p-0!',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type SidebarMenuButtonVariants = VariantProps<typeof sidebarMenuButtonVariants>;

export interface SidebarContextProps {
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
}

export const sidebarStyles = {
  wrapperClass: 'group/sidebar-wrapper min-h-svh w-full has-data-[variant=inset]:bg-sidebar',

  // Base (static) classes for the desktop sidebar container. Side- and
  // variant-specific classes are applied inline in the framework wrappers via
  // ternaries, exactly as in the shadcn source. The `flex` direction bases are
  // provided by the Row/Col layout primitives at render time.
  containerClass:
    'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex',

  gapClass:
    'relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear group-data-[collapsible=offcanvas]:w-0',

  innerClass:
    'flex h-full w-full flex-col bg-sidebar data-[variant=floating]:rounded-lg data-[variant=floating]:border data-[variant=floating]:border-sidebar-border data-[variant=floating]:shadow-sm',

  headerClass: 'gap-2 p-2',
  footerClass: 'gap-2 p-2',
  separatorClass: 'mx-2 w-auto bg-sidebar-border',
  contentClass: 'min-h-0 flex-1 gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
  groupClass: 'relative w-full min-w-0 p-2',
  groupLabelClass:
    'flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
  groupActionClass:
    'absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 after:absolute after:-inset-2 md:after:hidden group-data-[collapsible=icon]:hidden',
  groupContentClass: 'w-full text-sm',
  menuClass: 'flex w-full min-w-0 flex-col gap-1',
  menuItemClass: 'group/menu-item relative',
  menuActionClass:
    'absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground ring-sidebar-ring outline-hidden transition-transform peer-hover/menu-button:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 after:absolute after:-inset-2 md:after:hidden peer-data-[size=sm]/menu-button:top-1 peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 group-data-[collapsible=icon]:hidden',
  menuBadgeClass:
    'pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium text-sidebar-foreground tabular-nums select-none peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground peer-data-[size=sm]/menu-button:top-1 peer-data-[size=default]/menu-button:top-1.5 peer-data-[size=lg]/menu-button:top-2.5 group-data-[collapsible=icon]:hidden',
  menuSkeletonClass: 'flex h-8 items-center gap-2 rounded-md px-2',
  menuSubClass:
    'mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5 group-data-[collapsible=icon]:hidden',
  menuSubItemClass: 'group/menu-sub-item relative',
  menuSubButtonClass:
    'flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground ring-sidebar-ring outline-hidden hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[size=sm]:text-xs data-[size=md]:text-sm group-data-[collapsible=icon]:hidden',
  triggerClass:
    'flex size-7 shrink-0 items-center justify-center rounded-md text-sidebar-foreground ring-sidebar-ring outline-hidden transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
  railClass:
    'absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border sm:flex group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[side=left]:cursor-w-resize group-data-[side=right]:cursor-e-resize [[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize [[data-side=left][data-collapsible=offcanvas]_&]:-right-2 [[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
  insetClass:
    'relative flex w-full flex-1 flex-col bg-background md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2',
  inputClass: 'h-8 w-full bg-background shadow-none',
  tooltipContentClass: 'z-50 w-auto rounded-md bg-sidebar-primary px-2 py-1.5 text-xs text-sidebar-primary-foreground',
} as const;
