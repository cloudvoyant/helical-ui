// apps/docs/src/components/examples/popover/popover-with-tooltip/react.tsx
import { Popover, PopoverTrigger, PopoverTitle, PopoverDescription, PopoverContent } from '@cloudvoyant/helical-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@cloudvoyant/helical-react';

export default function ReactPopoverWithTooltip() {
  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
            Open Popover
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Shows on hover over the trigger</TooltipContent>
      </Tooltip>
      <PopoverContent>
        <PopoverTitle>Popover with Tooltip</PopoverTitle>
        <PopoverDescription>The trigger also shows a tooltip on hover.</PopoverDescription>
      </PopoverContent>
    </Popover>
  );
}
