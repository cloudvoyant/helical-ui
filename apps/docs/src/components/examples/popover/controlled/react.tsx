// apps/docs/src/components/examples/popover/controlled/react.tsx
import { useState } from 'react';
import { Popover, PopoverTrigger, PopoverTitle, PopoverDescription, PopoverContent } from '@cloudvoyant/helical-react';

export default function ReactPopoverControlled() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center gap-4">
      <Popover open={open} onOpenChange={(e) => setOpen(e.open)}>
        <PopoverTrigger className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
          Open Popover
        </PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Controlled Popover</PopoverTitle>
          <PopoverDescription>This popover is fully controlled by the checkbox.</PopoverDescription>
        </PopoverContent>
      </Popover>
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input type="checkbox" checked={open} onChange={(e) => setOpen(e.target.checked)} />
        Open
      </label>
    </div>
  );
}
