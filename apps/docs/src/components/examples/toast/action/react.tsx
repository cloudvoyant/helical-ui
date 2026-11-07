// apps/docs/src/components/examples/toast/action/react.tsx
import { useState } from 'react';
import { Badge, Button, HStack, Toaster, createToaster } from '@cloudvoyant/helical-react';

const actionToaster = createToaster({
  placement: 'bottom-end',
  overlap: true,
  max: 5,
});

export default function ReactToastAction() {
  const [undone, setUndone] = useState(false);

  return (
    <HStack className="flex-wrap items-center gap-3">
      <Button
        size="sm"
        variant="outline"
        data-testid="toast-action-trigger"
        onClick={() => {
          setUndone(false);
          actionToaster.create({
            title: 'File archived',
            description: 'Moved quarterly-report.mdx to archive.',
            type: 'info',
            action: {
              label: 'Undo',
              onClick: () => setUndone(true),
            },
          });
        }}
      >
        Archive File
      </Button>
      <Badge variant="subtle" color={undone ? 'success' : 'secondary'} data-testid="toast-action-state">
        {undone ? 'Restored' : 'Idle'}
      </Badge>
      <Toaster toaster={actionToaster} />
    </HStack>
  );
}
