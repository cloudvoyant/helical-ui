// apps/docs/src/components/examples/command-palette/empty/react.tsx

// 1. Imports
import { useState } from 'react';
import { Button, CommandPalette } from '@cloudvoyant/helical-react';

// 2. Exported component
export default function ReactCommandPaletteEmpty() {
  // --- State ---
  const [open, setOpen] = useState(false);

  // --- Render ---
  return (
    <div className="flex flex-col items-center gap-4">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open Empty Command Palette
      </Button>
      <CommandPalette items={[]} open={open} onOpenChange={setOpen} />
    </div>
  );
}
