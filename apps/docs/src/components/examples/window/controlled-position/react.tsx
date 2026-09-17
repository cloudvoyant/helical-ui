// apps/docs/src/components/examples/window/controlled-position/react.tsx
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

export default function ReactWindowControlledPosition() {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ x: 120, y: 60 });
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
      >
        Open Window
      </button>
      <Window
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
        position={position}
        onPositionChange={(e) => setPosition(e.position)}
      >
        <WindowDragTrigger>
          <WindowHeader>
            <WindowTitle>Controlled Position</WindowTitle>
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
          Position: ({position.x}, {position.y})
        </WindowBody>
        <WindowResizeTrigger />
      </Window>
    </div>
  );
}
