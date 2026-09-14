// libs/vortex-react/src/editor/CursorOverlay.tsx
import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Editor } from '@tiptap/react';
import {
  lockEditorOverlayScroll,
  placeEditorOverlayAt,
  type OverlayPlacementOptions,
  type OverlayPosition,
} from '@cloudvoyant/vortex-ui';

export interface CursorOverlayProps extends OverlayPlacementOptions {
  editor: Editor;
  position: number;
  lockScroll?: boolean;
  children: ReactNode;
}

/** Fixed editor surface that follows a Tiptap document position across scroll and resize. */
export function CursorOverlay({
  editor,
  position,
  width,
  height,
  gap,
  viewportGap,
  lockScroll = true,
  children,
}: CursorOverlayProps) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<OverlayPosition>(() =>
    placeEditorOverlayAt(editor, position, { width, height, gap, viewportGap }),
  );

  useEffect(() => {
    const updatePosition = () => setCoords(placeEditorOverlayAt(editor, position, { width, height, gap, viewportGap }));
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [editor, position, width, height, gap, viewportGap]);

  useEffect(() => {
    if (!lockScroll) return;
    return lockEditorOverlayScroll(editor.view.dom, surfaceRef.current);
  }, [editor, lockScroll]);

  return (
    <div ref={surfaceRef} data-cursor-overlay className="fixed z-50" style={{ left: coords.left, top: coords.top }}>
      {children}
    </div>
  );
}
