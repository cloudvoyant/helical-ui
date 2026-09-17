// libs/helical-ui/src/tooltip.ts
// Closely based on: Ark UI tooltip (https://ark-ui.com/docs/components/tooltip, @ark-ui/react/tooltip).
export const tooltipPositionerBase = 'z-50 [--z-index:50]!';

// Zag's popper sets --arrow-size-half inline and derives --arrow-offset from it, so the
// !important override applies our +1px nudge. Private zag variable — a rename upstream
// would silently regress the arrow seam.
export const tooltipArrowBase =
  '[--arrow-size:0.5rem] [--arrow-background:var(--color-popover)] z-[60]! [--arrow-size-half:calc(var(--arrow-size)/2_+_1px)]!';

export const tooltipContentBase =
  'relative z-50 max-w-xs rounded-md border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md outline-none';
