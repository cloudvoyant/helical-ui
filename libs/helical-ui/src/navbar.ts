// libs/helical-ui/src/navbar.ts
// Closely based on: shadcnblocks navbar6 / navbar7 (https://www.shadcnblocks.com/block/navbar6,
//                   https://www.shadcnblocks.com/block/navbar7), re-based on Ark UI
//                   (navigation-menu + collapsible). Shared class strings / cva. No framework imports.
import { cva } from 'class-variance-authority';

export type NavbarVariant = 'scroll' | 'sticky' | 'shrink' | 'hide';

export type NavbarDensity = 'relaxed' | 'compact';

export const navbarVariants = cva(
  'w-full bg-background/80 backdrop-blur transition-[box-shadow,height,translate] duration-300',
  {
    variants: {
      variant: {
        scroll: 'border-b border-border',
        sticky:
          'sticky top-0 z-50 border-b border-border data-[scrolled=true]:bg-background/95 data-[scrolled=true]:shadow-md',
        shrink:
          'sticky top-0 z-50 border-b border-border data-[scrolled=true]:bg-background/95 data-[scrolled=true]:shadow-md',
        hide: 'sticky top-0 z-50 border-b border-border data-[scrolled=true]:bg-background/95 data-[scrolled=true]:shadow-md data-[hidden=true]:-translate-y-full',
      },
      floating: {
        false: '',
        true: 'fixed inset-x-0 top-4 z-50 mx-auto w-[calc(100%-2rem)] max-w-6xl rounded-full border',
      },
    },
    defaultVariants: {
      variant: 'sticky',
      floating: false,
    },
  },
);

export const navbarContainerBase = 'flex items-center justify-between transition-[height,gap,padding] duration-300';

export const navbarDensityVariants = cva('', {
  variants: {
    density: {
      relaxed: 'h-16 gap-4 px-4 md:px-6',
      compact: 'h-12 gap-1.5 px-2',
    },
  },
  defaultVariants: {
    density: 'relaxed',
  },
});

// The `shrink` variant reduces height only (padding/gap stay put); the menu
// items compact via the NavbarMenu density.
export const navbarShrunkBase = 'h-12';

export const navbarBrandBase = 'flex shrink-0 items-center gap-2';

export const navbarMenuBase = 'hidden items-center md:flex';

export const navbarMenuPlacementVariants = cva('', {
  variants: {
    placement: {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
    },
  },
  defaultVariants: {
    placement: 'center',
  },
});

export const navbarActionsBase = 'ml-auto hidden items-center gap-2 md:flex';

export const navbarTriggerVariants = cva(
  'inline-flex h-9 w-9 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  {
    variants: {
      floating: {
        false: 'rounded-md border border-border',
        true: 'rounded-full',
      },
    },
    defaultVariants: {
      floating: false,
    },
  },
);

export const navbarMobileBase = 'md:hidden';

export const navbarActivationAreaBase = 'fixed inset-x-0 top-0 z-40 h-12';

export const navbarMobileContentBase = 'flex h-full flex-col bg-background';

export const navbarMobileHeaderBase = 'flex items-center justify-between gap-2 px-4 py-3';

export const navbarMobileMenuBase = 'flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-2';

export const navbarMobileActionsBase = 'flex items-center gap-2 border-t border-border px-4 py-4';
