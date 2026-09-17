// apps/docs/src/components/examples/window/anchor-position/react.tsx
import { useRef, useState } from 'react';
import {
  Window,
  WindowDragTrigger,
  WindowHeader,
  WindowTitle,
  WindowControl,
  WindowStageTrigger,
  WindowDismiss,
  WindowBody,
  WindowResizeTrigger,
} from '@cloudvoyant/helical-react';
import { Minus, Maximize2, RotateCcw, X } from 'lucide-react';

export default function ReactWindowAnchorPosition() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
      >
        Open Window
      </button>
      <Window
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
        getAnchorPosition={() => {
          const r = buttonRef.current?.getBoundingClientRect();
          return { x: r?.x ?? 0, y: (r?.y ?? 0) + (r?.height ?? 0) + 8 };
        }}
      >
        <WindowDragTrigger>
          <WindowHeader>
            <WindowTitle>Anchored Position</WindowTitle>
            <WindowControl>
              <WindowStageTrigger stage="minimized">
                <Minus />
              </WindowStageTrigger>
              <WindowStageTrigger stage="maximized">
                <Maximize2 />
              </WindowStageTrigger>
              <WindowStageTrigger stage="default">
                <RotateCcw />
              </WindowStageTrigger>
              <WindowDismiss>
                <X />
              </WindowDismiss>
            </WindowControl>
          </WindowHeader>
        </WindowDragTrigger>
        <WindowBody>This window opens just below the button.</WindowBody>
        <WindowResizeTrigger />
      </Window>
    </div>
  );
}
