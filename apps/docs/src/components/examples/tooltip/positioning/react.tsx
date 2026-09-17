// apps/docs/src/components/examples/tooltip/positioning/react.tsx
import { Tooltip, TooltipTrigger, TooltipContent } from '@cloudvoyant/helical-react';

export default function ReactTooltipPositioning() {
  return (
    <Tooltip positioning={{ placement: 'right', offset: { mainAxis: 12 } }}>
      <TooltipTrigger className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
        Hover me
      </TooltipTrigger>
      <TooltipContent>Positioned on the right</TooltipContent>
    </Tooltip>
  );
}
