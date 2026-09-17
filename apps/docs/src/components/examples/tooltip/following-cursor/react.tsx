// apps/docs/src/components/examples/tooltip/following-cursor/react.tsx
import { Tooltip, TooltipTrigger, TooltipContent, useTooltipContext } from '@cloudvoyant/helical-react';

const cursor = { x: 0, y: 0 };
let areaEl: HTMLDivElement | null = null;

function FollowArea() {
  const tooltip = useTooltipContext();
  return (
    <div
      ref={(el) => {
        areaEl = el;
      }}
      className="rounded-md border p-10 text-center"
      onPointerMove={(e) => {
        const rect = areaEl?.getBoundingClientRect();
        if (!rect) return;
        cursor.x = e.clientX - rect.left;
        cursor.y = e.clientY - rect.top + 12;
        tooltip.reposition();
      }}
    >
      <TooltipTrigger className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
        Move your cursor here
      </TooltipTrigger>
    </div>
  );
}

export default function ReactTooltipFollowingCursor() {
  return (
    <Tooltip
      positioning={{
        strategy: 'fixed',
        getAnchorRect: () => {
          const rect = areaEl?.getBoundingClientRect();
          return new DOMRect((rect?.left ?? 0) + cursor.x, (rect?.top ?? 0) + cursor.y, 1, 1);
        },
      }}
    >
      <FollowArea />
      <TooltipContent>Follows your cursor</TooltipContent>
    </Tooltip>
  );
}
