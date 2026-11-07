// apps/docs/src/components/examples/colon-command/empty/react.tsx

// 1. Imports
import { useState } from 'react';
import { Button, ColonCommand } from '@cloudvoyant/helical-react';

// 2. Exported component
export default function ReactColonCommandEmpty() {
  // --- State ---
  const [open, setOpen] = useState(false);

  // --- Render ---
  return (
    <div className="flex flex-col items-center gap-4">
      <Button variant="outline" data-testid="cc-empty-open" onClick={() => setOpen(true)}>
        Open Empty Command Menu
      </Button>
      <ColonCommand items={[]} open={open} onOpenChange={setOpen} />
    </div>
  );
}
