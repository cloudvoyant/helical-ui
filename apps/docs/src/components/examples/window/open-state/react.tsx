// apps/docs/src/components/examples/window/open-state/react.tsx
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

export default function ReactWindowOpenState() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
      >
        Open Window
      </button>
      <Window open={open} onOpenChange={(e) => setOpen(e.open)}>
        <WindowDragTrigger>
          <WindowHeader>
            <WindowTitle>Controlled Open State</WindowTitle>
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
        <WindowBody>The open state is controlled by the checkbox.</WindowBody>
        <WindowResizeTrigger />
      </Window>
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input type="checkbox" checked={open} onChange={(e) => setOpen(e.target.checked)} />
        Open
      </label>
    </div>
  );
}
