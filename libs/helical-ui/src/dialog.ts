// libs/helical-ui/src/dialog.ts
// Closely based on: Ark UI dialog (https://ark-ui.com/docs/components/dialog, @ark-ui/react/dialog).
export const dialogBackdropBase = 'bg-black/50';

export const dialogPositionerBase =
  'fixed inset-0 z-50 [--z-index:50]! flex items-start justify-center overflow-y-auto p-4';

export const dialogContentBase =
  'relative z-50 my-auto grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg sm:rounded-lg outline-none';

export const dialogTitleBase = 'text-lg font-semibold leading-none tracking-tight';

export const dialogDescriptionBase = 'text-sm text-muted-foreground';

export const dialogHeaderBase = 'flex flex-col gap-2';

export const dialogFooterBase = 'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end';

export const dialogHeaderStickyBase = 'sticky top-0 z-10 bg-background';

export const dialogFooterStickyBase = 'sticky bottom-0 z-10 bg-background';

export const dialogFullscreenContentBase = 'h-dvh w-full max-w-none rounded-none border-0 p-0 sm:rounded-none';

export const dialogCloseTriggerBase =
  'absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-[3px] focus:ring-ring/30 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0';
