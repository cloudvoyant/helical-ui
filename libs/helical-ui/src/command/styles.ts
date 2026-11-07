// Source: https://ui.shadcn.com/docs/components/radix/command
// Closely based on: Ark UI listbox & dialog (https://ark-ui.com/docs/components/listbox, https://ark-ui.com/docs/components/dialog) and Helix command mode (https://docs.helix-editor.com/commands.html).

// 1. Imports
import { cva, type VariantProps } from 'class-variance-authority';

// 2. Exported variants & base classes
export const commandPaletteVariants = cva(
  'flex w-full flex-col overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl outline-none',
  {
    variants: {
      size: {
        sm: 'max-w-md',
        md: 'max-w-xl',
        lg: 'max-w-2xl',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export type CommandPaletteVariants = VariantProps<typeof commandPaletteVariants>;

export const commandPalettePositionerBase = 'items-center justify-center p-4';

export const commandPaletteDialogContentBase = 'my-auto gap-0 overflow-hidden p-0 sm:max-w-xl';

export const commandPaletteHeaderBase = 'flex items-center gap-2 border-b border-border px-3 py-2.5';

export const commandPaletteBreadcrumbBase =
  'inline-flex shrink-0 items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground';

export const commandPaletteInputBase =
  'flex-1 border-0 bg-transparent px-1 py-0.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-0';

export const commandPaletteListBase = 'max-h-80 overflow-y-auto p-1.5 outline-none';

export const commandPaletteItemBase =
  'group relative flex w-full cursor-pointer select-none items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-sm outline-none transition-colors data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50';

export const commandPaletteFooterBase =
  'flex flex-wrap items-center justify-between gap-2 border-t border-border bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground';

export const colonCommandVariants = cva(
  'flex w-full flex-col overflow-hidden border border-border bg-popover text-popover-foreground shadow-2xl outline-none font-mono',
  {
    variants: {
      placement: {
        bottom: 'w-full max-w-none rounded-none border-x-0 border-b-0',
        center: 'max-w-2xl rounded-lg',
        top: 'max-w-3xl rounded-lg',
      },
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      placement: 'bottom',
      size: 'md',
    },
  },
);

export type ColonCommandVariants = VariantProps<typeof colonCommandVariants>;

export const colonCommandPositionerVariants = cva('', {
  variants: {
    placement: {
      bottom: 'items-end justify-stretch p-0!',
      center: 'items-center justify-center p-4',
      top: 'items-start justify-center p-4 pt-6',
    },
  },
  defaultVariants: {
    placement: 'bottom',
  },
});

export const colonCommandDialogPositionerVariants = cva('gap-0 overflow-hidden p-0', {
  variants: {
    placement: {
      bottom:
        'fixed inset-x-0 bottom-0 top-auto my-0 w-full max-w-none translate-x-0 translate-y-0 rounded-none border-x-0 border-b-0 border-t border-border p-0 shadow-2xl sm:max-w-none sm:rounded-none',
      center: 'my-auto w-full max-w-2xl p-0 sm:max-w-2xl',
      top: 'my-0 w-full max-w-3xl p-0 sm:max-w-3xl',
    },
  },
  defaultVariants: {
    placement: 'bottom',
  },
});

export const colonCommandListVariants = cva(
  'max-h-60 overflow-y-auto border-b border-border bg-popover/95 p-2 outline-none',
  {
    variants: {
      columns: {
        auto: 'grid! grid-flow-col! gap-x-3 gap-y-1',
        1: 'flex flex-col gap-0.5',
        2: 'grid! grid-flow-col! gap-x-3 gap-y-1',
        3: 'grid! grid-flow-col! gap-x-3 gap-y-1',
        4: 'grid! grid-flow-col! gap-x-3 gap-y-1',
      },
    },
    defaultVariants: {
      columns: 'auto',
    },
  },
);

export const colonCommandListBase = colonCommandListVariants({ columns: 'auto' });

export const colonCommandItemBase =
  'group relative flex min-w-0 w-full cursor-pointer select-none items-center justify-between gap-2 rounded-md px-2.5 py-1.5 font-mono text-xs outline-none transition-colors data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50';

export const colonCommandPromptBarBase =
  'flex w-full items-center gap-1.5 border-t border-border/60 bg-muted/50 px-3 py-2 font-mono';

export const colonCommandPrefixBase = 'select-none font-mono font-bold text-primary';

export const colonCommandInputBase =
  'flex-1 border-0 bg-transparent px-1 py-0.5 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-0';

export const colonCommandErrorBase =
  'flex items-center justify-between gap-2 border-t border-destructive/30 bg-destructive/10 px-3 py-1.5 font-mono text-xs text-destructive';
