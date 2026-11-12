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

export const dialogStyles = {
  backdrop: dialogBackdropBase,
  positioner: dialogPositionerBase,
  content: dialogContentBase,
  title: dialogTitleBase,
  description: dialogDescriptionBase,
  header: dialogHeaderBase,
  footer: dialogFooterBase,
  headerSticky: dialogHeaderStickyBase,
  footerSticky: dialogFooterStickyBase,
  fullscreenContent: dialogFullscreenContentBase,
  closeTrigger: dialogCloseTriggerBase,
} as const;

/**
 * Captures the currently focused DOM element before a dialog opens, excluding
 * `document.body`, `document.documentElement`, and any element inside `excludeRoot`.
 */
export function captureDialogFocusTarget(excludeRoot?: HTMLElement | null): HTMLElement | null {
  if (typeof document === 'undefined' || !(document.activeElement instanceof HTMLElement)) {
    return null;
  }
  const active = document.activeElement;
  if (active === document.body || active === document.documentElement) {
    return null;
  }
  if (excludeRoot?.contains(active)) {
    return null;
  }
  return active;
}

/**
 * Restores focus to `previousFocusEl` after a dialog closes unless an action
 * inside the dialog has already moved focus to a new target or opened another modal.
 */
export function restoreDialogFocusTarget(
  previousFocusEl: HTMLElement | null,
  closingContentEl?: HTMLElement | null,
): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const hasFocusMovedElsewhere = (): boolean => {
    const active = document.activeElement as HTMLElement | null;
    if (
      active &&
      active !== document.body &&
      active !== document.documentElement &&
      active !== previousFocusEl &&
      (!closingContentEl || !closingContentEl.contains(active)) &&
      !active.closest('[data-state="closed"]')
    ) {
      return true;
    }
    const openModal = document.querySelector<HTMLElement>(
      '[role="dialog"][data-state="open"], [data-modal="true"]:not([data-state="closed"])',
    );
    if (openModal && openModal !== closingContentEl) {
      return true;
    }
    return false;
  };

  if (hasFocusMovedElsewhere()) return;

  const applyRestore = () => {
    if (hasFocusMovedElsewhere()) return;
    if (previousFocusEl && document.contains(previousFocusEl)) {
      previousFocusEl.focus();
    }
  };

  if (typeof window.requestAnimationFrame === 'function') {
    window.requestAnimationFrame(() => {
      if (hasFocusMovedElsewhere()) return;
      window.requestAnimationFrame(applyRestore);
    });
  } else {
    applyRestore();
  }
}
