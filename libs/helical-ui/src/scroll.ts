// libs/helical-ui/src/scroll.ts
// Closely based on: Chakra UI ScrollArea slot recipe (built on @ark-ui/* scroll-area).
// Defaults baked in: variant "hover" (scrollbars fade in on hover/scroll) and
// size "md" (--scrollbar-size: 0.5rem). Customize via className, applied last.

export const scrollRootBase =
  'relative flex h-full w-full flex-col overflow-hidden [--scrollbar-size:0.5rem] [--scrollbar-margin:2px]';

// The viewport is a `flex flex-col` container. For horizontal scrolling, wrap
// your content in a single flex row (e.g. `flex gap-2 w-max`) or override the
// viewport class via the `viewportClassName`/`viewportClass` prop — sibling
// block children inside the flex-col viewport will not scroll horizontally.
export const scrollViewportBase =
  'flex h-full w-full flex-col rounded-[inherit] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

export const scrollContentBase = 'min-w-full';

export const scrollScrollbarBase =
  'relative m-[var(--scrollbar-margin)] flex touch-none select-none rounded-full bg-border/10 opacity-0 transition-opacity duration-150 data-[hover]:opacity-100 data-[scrolling]:opacity-100 data-[orientation=vertical]:w-[var(--scrollbar-size)] data-[orientation=vertical]:flex-col data-[orientation=horizontal]:h-[var(--scrollbar-size)] data-[orientation=horizontal]:flex-row [&:not([data-overflow-x],[data-overflow-y])]:hidden';

export const scrollThumbBase =
  'rounded-[inherit] bg-border/40 transition-colors data-[orientation=vertical]:w-full data-[orientation=horizontal]:h-full';

export const scrollCornerBase =
  'm-[var(--scrollbar-margin)] bg-muted opacity-0 transition-opacity duration-150 data-[hover]:opacity-100';
