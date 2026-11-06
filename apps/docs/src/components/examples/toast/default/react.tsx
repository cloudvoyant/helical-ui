// apps/docs/src/components/examples/toast/default/react.tsx
import { Button, HStack, Toaster, createToaster } from '@cloudvoyant/helical-react';

const toaster = createToaster({
  placement: 'bottom-end',
  overlap: true,
  max: 5,
});

export default function ReactToastDefault() {
  return (
    <HStack className="flex-wrap items-center gap-2">
      <Button
        variant="outline"
        data-testid="toast-default-trigger"
        onClick={() =>
          toaster.create({
            title: 'Scheduled: Catch up',
            description: 'Friday, February 10, 2026 at 5:57 PM',
            type: 'info',
          })
        }
      >
        Show Toast
      </Button>
      <Toaster toaster={toaster} />
    </HStack>
  );
}
