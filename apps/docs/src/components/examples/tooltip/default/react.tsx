// apps/docs/src/components/examples/tooltip/default/react.tsx
import { Tooltip, TooltipTrigger, TooltipContent } from '@cloudvoyant/helical-react';

export default function ReactTooltipDefault() {
  return (
    <Tooltip>
      <TooltipTrigger className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
        Hover me
      </TooltipTrigger>
      <TooltipContent>I am a tooltip</TooltipContent>
    </Tooltip>
  );
}
