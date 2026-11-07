// apps/docs/src/components/examples/toast/action/react.tsx

// 1. Imports
import { useState } from 'react';
import { Badge, Button, HStack, useToast } from '@cloudvoyant/helical-react';

// 2. Exported component
export default function ReactToastAction() {
  // --- State ---
  const toast = useToast();
  const [undone, setUndone] = useState(false);

  // --- Methods ---
  const handleArchive = () => {
    setUndone(false);
    toast.create({
      title: 'File archived',
      description: 'Moved quarterly-report.mdx to archive.',
      type: 'info',
      action: {
        label: 'Undo',
        onClick: () => setUndone(true),
      },
    });
  };

  // --- Render ---
  return (
    <HStack className="flex-wrap items-center gap-3">
      <Button size="sm" variant="outline" data-testid="toast-action-trigger" onClick={handleArchive}>
        Archive File
      </Button>
      <Badge variant="subtle" color={undone ? 'success' : 'secondary'} data-testid="toast-action-state">
        {undone ? 'Restored' : 'Idle'}
      </Badge>
    </HStack>
  );
}
