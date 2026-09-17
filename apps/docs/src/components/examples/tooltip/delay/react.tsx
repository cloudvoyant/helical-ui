// apps/docs/src/components/examples/tooltip/delay/react.tsx
import { Tooltip, TooltipTrigger, TooltipContent } from '@cloudvoyant/helical-react';

export default function ReactTooltipDelay() {
  return (
    <Tooltip openDelay={1000} closeDelay={200}>
      <TooltipTrigger className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
        Hover me (1s open delay)
      </TooltipTrigger>
      <TooltipContent>Delayed tooltip</TooltipContent>
    </Tooltip>
  );
}
