// Source: https://shark.vini.one/docs/components/toast
// Closely based on: Shark UI toast and Ark UI toast (https://ark-ui.com/docs/components/toast, @zag-js/toast).

// 1. Imports
import { cva, type VariantProps } from 'class-variance-authority';

// 2. Module constants & types
export type ToastType = 'info' | 'success' | 'warning' | 'error' | 'loading';

export type ToastPlacement = 'top-start' | 'top' | 'top-end' | 'bottom-start' | 'bottom' | 'bottom-end';

export interface ToastActionOptions {
  label: string;
  onClick?: () => void;
}

// 4. Exported variants & base styles
export const toasterBase = [
  'w-[calc(100%-var(--viewport-offset-left))] sm:w-(--width) [--width:22.25rem]',
  'data-[align=center]:left-[calc(var(--viewport-offset-right)/2)]!',
  'sm:data-[align=center]:w-full',
].join(' ');

export const toastVariants = cva(
  [
    'z-(--z-index) translate-x-(--x) translate-y-(--y) opacity-(--opacity)',
    'data-[overlap]:scale-[calc(1-var(--index,0)*0.04)]',
    'relative w-[calc(100%-var(--viewport-offset-left))] sm:w-(--width)',
    'flex items-start justify-between gap-2.5 rounded-lg border border-border bg-popover px-3.5 py-3 text-sm text-popover-foreground shadow-lg select-none outline-none',
    'transition-[translate,scale,opacity,height] duration-250 ease-[cubic-bezier(0.21,1.02,0.73,1)] will-change-[translate,opacity,scale]',
    'data-[state=closed]:duration-200 data-[state=closed]:ease-[cubic-bezier(0.06,0.71,0.55,1)]',
    'motion-reduce:transition-none!',
    'data-[type=info]:border-info/30',
    'data-[type=success]:border-success/30',
    'data-[type=warning]:border-warn/30',
    'data-[type=error]:border-danger/30',
  ].join(' '),
);

export type ToastVariants = VariantProps<typeof toastVariants>;

export const toastIconBase = [
  'mt-0.5 shrink-0',
  'in-data-[type=warning]:text-warn',
  'in-data-[type=success]:text-success',
  'in-data-[type=error]:text-danger',
  'in-data-[type=info]:text-info',
  'in-data-[type=loading]:text-primary',
  '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
].join(' ');

export const toastTitleBase = 'text-sm font-medium leading-tight text-popover-foreground';

export const toastDescriptionBase = 'text-xs leading-relaxed text-muted-foreground';

export const toastActionTriggerBase =
  'inline-flex h-7 shrink-0 cursor-pointer items-center justify-center rounded-md border border-border bg-secondary px-2.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50';

export const toastCloseTriggerBase =
  'inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground opacity-70 transition-opacity hover:bg-accent hover:text-accent-foreground hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 [&_svg]:pointer-events-none [&_svg]:size-3.5';
