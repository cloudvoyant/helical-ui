// apps/docs/src/components/examples/tooltip/multiple-triggers/react.tsx
import { useState } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@cloudvoyant/helical-react';

const items = ['First', 'Second', 'Third'];

export default function ReactTooltipMultipleTriggers() {
  const [active, setActive] = useState('First');
  return (
    <Tooltip onTriggerValueChange={(e) => setActive(e.value ?? 'First')}>
      <div className="flex items-center gap-2">
        {items.map((item) => (
          <TooltipTrigger
            key={item}
            value={item}
            className="rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground"
          >
            {item}
          </TooltipTrigger>
        ))}
      </div>
      <TooltipContent>This tooltip follows the active trigger ({active})</TooltipContent>
    </Tooltip>
  );
}
