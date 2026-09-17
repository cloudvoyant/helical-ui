// libs/helical-ui/src/splitter.ts
// Closely based on: Chakra UI Splitter slot recipe (built on @ark-ui/* splitter).
// Root/panel base classes are empty: Ark sets display/flex-direction, the
// height/width: 100% and overflow: hidden, and panel flex sizing inline.

/**
 * Intentionally empty: Ark UI sets `display`/`flex-direction` on the root and
 * the panel's `height`/`width: 100%`, `overflow`, and flex sizing inline.
 * Exported so React/Svelte wrappers share one class-merge call site; consumers
 * should pass overrides through `className` rather than reference this constant.
 */
export const splitterRootBase = '';

/**
 * Intentionally empty, for the same reason as {@link splitterRootBase}: Ark UI
 * owns the panel's box model. Kept exported to mirror `splitterRootBase`.
 */
export const splitterPanelBase = '';

export const splitterResizeTriggerBase =
  'group relative grid place-items-center outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 data-[orientation=horizontal]:-mx-1 data-[orientation=horizontal]:min-w-2 data-[orientation=vertical]:-my-1 data-[orientation=vertical]:min-h-2';

export const splitterResizeTriggerSeparatorBase =
  'absolute bg-border group-data-[orientation=horizontal]:inset-y-0 group-data-[orientation=horizontal]:right-1 group-data-[orientation=horizontal]:w-px group-data-[orientation=vertical]:inset-x-0 group-data-[orientation=vertical]:bottom-1 group-data-[orientation=vertical]:h-px';

export const splitterResizeTriggerIndicatorBase =
  'relative z-10 rounded-full border border-border bg-muted shadow-xs data-[dragging]:bg-muted-foreground data-[focus]:bg-accent data-[disabled]:hidden data-[orientation=horizontal]:h-6 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-6';
