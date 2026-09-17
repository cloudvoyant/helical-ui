// apps/docs/src/components/examples/popover/multiple-triggers/react.tsx
import { useState } from 'react';
import { Popover, PopoverTrigger, PopoverTitle, PopoverDescription, PopoverContent } from '@cloudvoyant/helical-react';

const items = [
  { id: 'share', label: 'Share', detail: 'Share this item with others via link or email.' },
  { id: 'export', label: 'Export', detail: 'Export this item as PDF, CSV, or JSON.' },
  { id: 'archive', label: 'Archive', detail: 'Move this item to the archive for later reference.' },
];

export default function ReactPopoverMultipleTriggers() {
  const [active, setActive] = useState(items[0]);
  return (
    <Popover onTriggerValueChange={(e) => setActive(items.find((i) => i.id === e.value) ?? items[0])}>
      <div className="flex items-center gap-2">
        {items.map((item) => (
          <PopoverTrigger
            key={item.id}
            value={item.id}
            className="rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground"
          >
            {item.label}
          </PopoverTrigger>
        ))}
      </div>
      <PopoverContent>
        <PopoverTitle>{active.label}</PopoverTitle>
        <PopoverDescription>{active.detail}</PopoverDescription>
      </PopoverContent>
    </Popover>
  );
}
