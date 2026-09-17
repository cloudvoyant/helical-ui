// apps/docs/src/components/examples/tooltip/arrow/react.tsx
import { Tooltip, TooltipTrigger, TooltipContent } from '@cloudvoyant/helical-react';

export default function ReactTooltipArrow() {
  return (
    <div className="flex items-center gap-6">
      <Tooltip>
        <TooltipTrigger className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
          With arrow
        </TooltipTrigger>
        <TooltipContent>Arrow on by default</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger className="rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground">
          Without arrow
        </TooltipTrigger>
        <TooltipContent arrow={false}>No arrow on this tooltip</TooltipContent>
      </Tooltip>
    </div>
  );
}
