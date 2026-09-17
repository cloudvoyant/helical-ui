// apps/docs/src/components/examples/window/context/react.tsx
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
  useWindowContext,
} from '@cloudvoyant/helical-react';
import { Minus, Maximize2, RotateCcw, X } from 'lucide-react';

function WindowStatus() {
  const window = useWindowContext();
  return <p className="text-sm text-muted-foreground">Window is {window.open ? 'open' : 'closed'}</p>;
}

export default function ReactWindowContext() {
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
            <WindowTitle>Context</WindowTitle>
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
          <WindowStatus />
          <p className="text-sm text-muted-foreground">The status above is read via useWindowContext.</p>
        </WindowBody>
        <WindowResizeTrigger />
      </Window>
    </div>
  );
}
