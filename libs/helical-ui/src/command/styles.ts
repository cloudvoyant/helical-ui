// libs/helical-ui/src/command/styles.ts

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

export const commandMenuVariants = cva(
  'flex w-full flex-col overflow-hidden border border-border bg-popover font-mono text-popover-foreground shadow-2xl outline-none',
  {
    variants: {
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export type CommandMenuVariants = VariantProps<typeof commandMenuVariants>;

export const commandMenuPositionerBase = 'items-end justify-stretch p-0!';

export const commandMenuDialogContentBase =
  'fixed inset-x-0 bottom-0 top-auto my-0 w-full max-w-none translate-x-0 translate-y-0 gap-0 overflow-hidden rounded-none border-x-0 border-b-0 border-t border-border p-0 shadow-2xl sm:max-w-none sm:rounded-none';

export const commandMenuListVariants = cva('overflow-y-auto border-b border-border bg-popover/95 outline-none', {
  variants: {
    columns: {
      auto: 'grid! grid-flow-col!',
      1: 'flex flex-col',
      2: 'grid! grid-flow-col!',
      3: 'grid! grid-flow-col!',
      4: 'grid! grid-flow-col!',
    },
    size: {
      sm: 'max-h-44 gap-x-2 gap-y-0.5 px-2 py-1',
      md: 'max-h-60 gap-x-3 gap-y-1 p-2',
      lg: 'max-h-72 gap-x-4 gap-y-1.5 p-3',
    },
  },
  defaultVariants: {
    columns: 'auto',
    size: 'md',
  },
});

export const commandMenuItemVariants = cva(
  'group relative flex min-w-0 w-full cursor-pointer select-none items-center justify-between gap-2 rounded-md font-mono outline-none transition-colors data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  {
    variants: {
      size: {
        sm: 'px-1.5 py-0.5 text-[11px] leading-tight',
        md: 'px-2.5 py-1.5 text-xs',
        lg: 'px-3 py-2 text-sm',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const commandMenuPromptBarVariants = cva(
  'flex w-full items-center border-t border-border/60 bg-muted/50 font-mono',
  {
    variants: {
      size: {
        sm: 'gap-1 px-2 py-1 text-xs',
        md: 'gap-1.5 px-3 py-2 text-sm',
        lg: 'gap-2 px-4 py-2.5 text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const commandMenuPrefixBase = 'select-none font-mono font-bold text-primary';

export const commandMenuInputVariants = cva(
  'flex-1 border-0 bg-transparent font-mono text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-0',
  {
    variants: {
      size: {
        sm: 'px-0.5 py-0 text-xs',
        md: 'px-1 py-0.5 text-sm',
        lg: 'px-1.5 py-1 text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const commandMenuErrorBase =
  'flex items-center justify-between gap-2 border-t border-destructive/30 bg-destructive/10 px-3 py-1.5 font-mono text-xs text-destructive';

export const colonCommandVariants = commandMenuVariants;
export type ColonCommandVariants = CommandMenuVariants;
export const colonCommandPositionerBase = commandMenuPositionerBase;
export const colonCommandDialogContentBase = commandMenuDialogContentBase;
export const colonCommandListVariants = commandMenuListVariants;
export const colonCommandItemVariants = commandMenuItemVariants;
export const colonCommandPromptBarVariants = commandMenuPromptBarVariants;
export const colonCommandPrefixBase = commandMenuPrefixBase;
export const colonCommandInputVariants = commandMenuInputVariants;
export const colonCommandErrorBase = commandMenuErrorBase;
