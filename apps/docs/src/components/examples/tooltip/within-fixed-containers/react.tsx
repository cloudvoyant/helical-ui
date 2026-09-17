// apps/docs/src/components/examples/tooltip/within-fixed-containers/react.tsx
import { Tooltip, TooltipTrigger, TooltipContent } from '@cloudvoyant/helical-react';

export default function ReactTooltipWithinFixedContainers() {
  return (
    <div className="flex flex-col gap-2 rounded-md border p-4">
      <p className="text-sm text-muted-foreground">Rendered inside a fixed container</p>
      <Tooltip positioning={{ strategy: 'fixed' }}>
        <TooltipTrigger className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
          Hover me
        </TooltipTrigger>
        <TooltipContent>Fixed strategy tooltip</TooltipContent>
      </Tooltip>
    </div>
  );
}
