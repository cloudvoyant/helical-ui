// apps/docs/src/components/examples/popover/same-width/react.tsx
import { Popover, PopoverTrigger, PopoverTitle, PopoverDescription, PopoverContent } from '@cloudvoyant/helical-react';

export default function ReactPopoverSameWidth() {
  return (
    <Popover positioning={{ sameWidth: true }}>
      <PopoverTrigger
        className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
        style={{ minWidth: 200 }}
      >
        Open Popover
      </PopoverTrigger>
      <PopoverContent>
        <PopoverTitle>Matched Width</PopoverTitle>
        <PopoverDescription>This popover matches the width of its trigger element.</PopoverDescription>
      </PopoverContent>
    </Popover>
  );
}
