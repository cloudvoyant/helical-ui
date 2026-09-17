// apps/docs/src/components/examples/tooltip/context/react.tsx
import { Tooltip, TooltipTrigger, TooltipContent, useTooltipContext } from '@cloudvoyant/helical-react';

function TooltipStatus() {
  const tooltip = useTooltipContext();
  return <p className="text-sm text-muted-foreground">Tooltip is {tooltip.open ? 'open' : 'closed'}</p>;
}

export default function ReactTooltipContext() {
  return (
    <Tooltip>
      <div className="flex items-center gap-4">
        <TooltipTrigger className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
          Hover me
        </TooltipTrigger>
        <TooltipStatus />
      </div>
      <TooltipContent>Context tooltip</TooltipContent>
    </Tooltip>
  );
}
