// apps/docs/src/components/examples/tooltip/root-provider/react.tsx
import { useTooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@cloudvoyant/helical-react';

export default function ReactTooltipRootProvider() {
  const tooltip = useTooltip();
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-muted-foreground">Tooltip is {tooltip.open ? 'open' : 'closed'}</p>
      <TooltipProvider value={tooltip}>
        <TooltipTrigger className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
          Hover me
        </TooltipTrigger>
        <TooltipContent>Controlled externally</TooltipContent>
      </TooltipProvider>
    </div>
  );
}
