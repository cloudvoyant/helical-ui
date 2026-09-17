// libs/helical-ui/src/popover.ts
// Closely based on: Ark UI popover (https://ark-ui.com/docs/components/popover, @ark-ui/react/popover).
export const popoverPositionerBase = 'z-50 [--z-index:50]!';

// Zag's popper sets --arrow-size-half inline and derives --arrow-offset from it, so the
// !important override applies our +1px nudge. Private zag variable — a rename upstream
// would silently regress the arrow seam.
export const popoverArrowBase =
  '[--arrow-size:0.5rem] [--arrow-background:var(--color-popover)] z-[60]! [--arrow-size-half:calc(var(--arrow-size)/2_+_1px)]!';

export const popoverContentBase =
  'relative z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none';

export const popoverTitleBase = 'text-sm font-semibold leading-none';

export const popoverDescriptionBase = 'text-sm text-muted-foreground';

export const popoverCloseTriggerBase =
  'absolute end-3.5 top-3.5 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-[3px] focus:ring-ring/30 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0';

export const popoverIndicatorBase = 'transition-transform data-[state=open]:rotate-180';
