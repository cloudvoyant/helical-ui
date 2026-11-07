// libs/helical-ui/src/which-key/styles.ts
// Shared cva variants and Tailwind class constants for WhichKey, WhichKeyExplorer, Pane, and JumpOverlay.
import { cva, type VariantProps } from 'class-variance-authority';

export const whichKeyVariants = cva(
  'fixed z-50 flex flex-col overflow-hidden border bg-popover/95 text-popover-foreground shadow-xl backdrop-blur-md transition-all duration-150 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
  {
    variants: {
      variant: {
        helix:
          'right-4 bottom-4 w-80 max-w-[calc(100vw-2rem)] rounded-lg data-[state=closed]:slide-out-to-bottom-2 data-[state=open]:slide-in-from-bottom-2',
        modern:
          'bottom-4 left-1/2 w-[min(36rem,calc(100vw-2rem))] -translate-x-1/2 rounded-xl data-[state=closed]:slide-out-to-bottom-2 data-[state=open]:slide-in-from-bottom-2',
        classic: 'inset-x-0 bottom-0 w-full rounded-none border-x-0 border-b-0 px-4 py-2',
      },
    },
    defaultVariants: {
      variant: 'helix',
    },
  },
);

export type WhichKeyVariants = VariantProps<typeof whichKeyVariants>;

export const whichKeyHeaderBase = 'flex items-center justify-between gap-2 px-3 pt-2.5 pb-1 text-xs font-medium';

export const whichKeyTitleBase = 'flex items-center gap-1.5 font-semibold text-foreground';

export const whichKeyBreadcrumbBase = 'flex items-center gap-1 text-[11px] text-muted-foreground';

export const whichKeyBodyVariants = cva('p-1.5', {
  variants: {
    variant: {
      helix: 'flex flex-col gap-0.5',
      modern: 'grid grid-cols-1 gap-1 sm:grid-cols-2',
      classic: 'grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3 md:grid-cols-4',
    },
  },
  defaultVariants: {
    variant: 'helix',
  },
});

export const whichKeyItemBase =
  'group flex w-full cursor-pointer items-center justify-between gap-3 rounded-md px-2 py-1 text-left text-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none';

export const whichKeyItemLabelBase =
  'inline-flex min-w-0 items-center gap-1 truncate text-foreground group-hover:text-accent-foreground data-[group=true]:font-medium data-[group=true]:text-primary';

export const whichKeyFooterBase = 'pointer-events-none h-2 shrink-0';

export const whichKeyModeBadgeVariants = cva(
  'inline-flex items-center gap-1 rounded font-mono font-semibold tracking-wider uppercase select-none',
  {
    variants: {
      mode: {
        normal: 'bg-primary/15 text-primary',
        select: 'bg-warn/20 text-warn',
        insert: 'bg-success/20 text-success',
        jump: 'bg-info/20 text-info',
      },
      size: {
        sm: 'px-1.5 py-0.5 text-[10px]',
        md: 'px-2 py-0.5 text-xs',
        lg: 'px-2.5 py-1 text-sm',
      },
    },
    defaultVariants: {
      mode: 'normal',
      size: 'sm',
    },
  },
);

export type WhichKeyModeBadgeVariants = VariantProps<typeof whichKeyModeBadgeVariants>;

export const whichKeyExplorerContentBase =
  'flex max-h-[min(34rem,85vh)] w-full max-w-xl flex-col gap-0 overflow-hidden bg-popover p-0 text-popover-foreground';

export const whichKeyExplorerHeaderBase = 'flex flex-row items-center justify-between gap-2 px-4 pt-3.5 pb-2.5';

export const whichKeyExplorerListboxBase =
  'flex min-h-0 flex-1 flex-col rounded-none border-0 bg-transparent shadow-none';

export const whichKeyExplorerInputBase =
  'mx-4 mb-2 w-[calc(100%-2rem)] rounded-md border-0 border-b-2 border-transparent bg-muted/60 px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus-visible:border-primary focus-visible:ring-0';

export const whichKeyExplorerListContentBase = 'max-h-none flex-1 overflow-visible px-2.5 pt-1 pb-3 outline-none';

export const whichKeyExplorerItemBase =
  'flex w-full cursor-pointer items-center justify-between gap-3 rounded-md px-2.5 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground';

export const whichKeyExplorerHighlightMarkBase = 'rounded-xs bg-primary/20 px-0.5 font-semibold text-foreground';

export const paneVariants = cva(
  'relative transition-shadow duration-150 data-[pane-active=true]:ring-1 data-[pane-active=true]:ring-primary/40',
  {
    variants: {
      active: {
        true: 'ring-1 ring-primary/40',
        false: '',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export const jumpOverlayRootBase = 'pointer-events-none fixed inset-0 z-[60] overflow-hidden';

export const jumpBadgeVariants = cva(
  'pointer-events-auto fixed z-[61] inline-flex items-center justify-center rounded border px-1 py-0.5 font-mono text-[11px] leading-none font-bold shadow-md transition-transform select-none',
  {
    variants: {
      action: {
        focus: 'border-primary bg-primary text-primary-foreground',
        activate: 'border-warn bg-warn text-warn-foreground',
      },
    },
    defaultVariants: {
      action: 'focus',
    },
  },
);

export const jumpBadgeMatchedPrefixBase = 'opacity-50 line-through';
