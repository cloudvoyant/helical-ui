// apps/docs/src/components/examples/window/controlled-size/react.tsx
import { useState } from 'react';
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

export default function ReactWindowControlledSize() {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState({ width: 320, height: 220 });
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
      >
        Open Window
      </button>
      <Window open={open} onOpenChange={(e) => setOpen(e.open)} size={size} onSizeChange={(e) => setSize(e.size)}>
        <WindowDragTrigger>
          <WindowHeader>
            <WindowTitle>Controlled Size</WindowTitle>
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
        <WindowBody>
          Size: {size.width} × {size.height}
        </WindowBody>
        <WindowResizeTrigger />
      </Window>
    </div>
  );
}
