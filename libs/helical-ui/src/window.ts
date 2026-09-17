// libs/helical-ui/src/window.ts
// Closely based on: Ark UI floating-panel (https://ark-ui.com/docs/components/floating-panel, @ark-ui/react/floating-panel), exposed as "Window".
export const windowPositionerBase = 'z-50 [--z-index:50]!';

export const windowContentBase =
  'relative z-50 flex w-80 flex-col overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-lg';

export const windowDragTriggerBase = 'flex flex-col';

export const windowHeaderBase = 'flex cursor-move items-center justify-between gap-2 border-b px-4 py-2.5';

export const windowTitleBase = 'text-sm font-semibold leading-none';

export const windowControlBase = 'flex items-center gap-1';

export const windowStageTriggerBase =
  'inline-flex size-6 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-[3px] focus:ring-ring/30 [&_svg]:size-3.5 [&_svg]:shrink-0';

export const windowCloseTriggerBase =
  'inline-flex size-6 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-[3px] focus:ring-ring/30 [&_svg]:size-3.5 [&_svg]:shrink-0';

export const windowBodyBase = 'flex flex-1 flex-col gap-4 overflow-auto p-4 text-sm';

export const windowResizeTriggerBase = 'absolute bottom-0 right-0 size-4 cursor-se-resize';
