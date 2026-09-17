// apps/docs/src/components/examples/popover/placement/react.tsx
import { Popover, PopoverTrigger, PopoverTitle, PopoverDescription, PopoverContent } from '@cloudvoyant/helical-react';

export default function ReactPopoverPlacement() {
  return (
    <Popover positioning={{ placement: 'left-start', offset: { mainAxis: 12, crossAxis: 12 } }}>
      <PopoverTrigger className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
        Open Popover
      </PopoverTrigger>
      <PopoverContent>
        <PopoverTitle>Left Placement</PopoverTitle>
        <PopoverDescription>This popover appears on the left with custom offset values.</PopoverDescription>
      </PopoverContent>
    </Popover>
  );
}
