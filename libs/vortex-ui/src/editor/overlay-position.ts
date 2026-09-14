import type { Editor } from '@tiptap/core';

export interface OverlayPosition {
  left: number;
  top: number;
}

export interface OverlayPlacementOptions {
  width: number;
  height: number;
  gap?: number;
  viewportGap?: number;
}

/**
 * Place an editor overlay below its anchor, or above it when the available space is tighter
 * below. The result is clamped to the viewport so the complete surface remains reachable.
 */
export function placeEditorOverlay(
  rect: Pick<DOMRect, 'left' | 'top' | 'bottom'>,
  { width, height, gap = 8, viewportGap = 16 }: OverlayPlacementOptions,
): OverlayPosition {
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;
  const preferredTop = spaceBelow < height && spaceAbove > spaceBelow ? rect.top - height - gap : rect.bottom + gap;
  const maxLeft = Math.max(window.innerWidth - width - viewportGap, viewportGap);
  const maxTop = Math.max(window.innerHeight - height - viewportGap, viewportGap);

  return {
    left: Math.min(Math.max(rect.left, viewportGap), maxLeft),
    top: Math.min(Math.max(preferredTop, viewportGap), maxTop),
  };
}

/** Position an overlay from a Tiptap document position using the same viewport strategy. */
export function placeEditorOverlayAt(
  editor: Editor,
  position: number,
  options: OverlayPlacementOptions,
): OverlayPosition {
  return placeEditorOverlay(editor.view.coordsAtPos(position), options);
}

/** Return the nearest scroll viewport that contains the editor, excluding the document body. */
export function findEditorScrollContainer(element: HTMLElement): HTMLElement | null {
  let current = element.parentElement;
  while (current && current !== document.body) {
    const overflowY = window.getComputedStyle(current).overflowY;
    if (/(auto|scroll)/.test(overflowY) && current.scrollHeight > current.clientHeight) return current;
    current = current.parentElement;
  }
  return null;
}

/**
 * Lock wheel scrolling on the editor's nearest scroll viewport while keeping an overlay's own
 * scrollable controls usable. Returns a cleanup function for framework lifecycle hooks.
 */
export function lockEditorOverlayScroll(editorElement: HTMLElement, overlayElement: HTMLElement | null): () => void {
  const container = findEditorScrollContainer(editorElement);
  if (!container) return () => undefined;

  const preventWheel = (event: WheelEvent) => {
    const target = event.target;
    if (target instanceof Node && overlayElement?.contains(target)) return;
    event.preventDefault();
  };

  container.addEventListener('wheel', preventWheel, { passive: false });
  return () => container.removeEventListener('wheel', preventWheel);
}
