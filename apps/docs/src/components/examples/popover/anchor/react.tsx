// apps/docs/src/components/examples/popover/anchor/react.tsx
import {
  Popover,
  PopoverTrigger,
  PopoverAnchor,
  PopoverTitle,
  PopoverDescription,
  PopoverContent,
} from '@cloudvoyant/helical-react';
import { Input } from '@cloudvoyant/helical-react';

export default function ReactPopoverAnchor() {
  return (
    <Popover>
      <div className="flex items-center gap-3">
        <PopoverTrigger className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
          Open Popover
        </PopoverTrigger>
        <PopoverAnchor>
          <Input placeholder="Type here..." />
        </PopoverAnchor>
      </div>
      <PopoverContent>
        <PopoverTitle>Anchored Popover</PopoverTitle>
        <PopoverDescription>
          The popover positions relative to the anchor (the input), not the trigger.
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  );
}
