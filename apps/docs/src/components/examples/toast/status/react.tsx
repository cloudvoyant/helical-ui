// apps/docs/src/components/examples/toast/status/react.tsx
import { Button, HStack, Toaster, createToaster } from '@cloudvoyant/helical-react';

const statusToaster = createToaster({
  placement: 'bottom-end',
  overlap: true,
  max: 5,
});

export default function ReactToastStatus() {
  return (
    <HStack className="flex-wrap items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        data-testid="toast-status-info"
        onClick={() =>
          statusToaster.create({
            title: 'Update available',
            description: 'A new version of helical-ui is ready to install.',
            type: 'info',
          })
        }
      >
        Info
      </Button>
      <Button
        size="sm"
        variant="outline"
        color="success"
        data-testid="toast-status-success"
        onClick={() =>
          statusToaster.create({
            title: 'Changes saved',
            description: 'Your workspace preferences have been updated.',
            type: 'success',
          })
        }
      >
        Success
      </Button>
      <Button
        size="sm"
        variant="outline"
        color="warn"
        data-testid="toast-status-warning"
        onClick={() =>
          statusToaster.create({
            title: 'Rate limit approaching',
            description: '85% of your hourly API quota has been consumed.',
            type: 'warning',
          })
        }
      >
        Warning
      </Button>
      <Button
        size="sm"
        variant="outline"
        color="danger"
        data-testid="toast-status-error"
        onClick={() =>
          statusToaster.create({
            title: 'Deployment failed',
            description: 'Could not reach the remote build cluster.',
            type: 'error',
          })
        }
      >
        Error
      </Button>
      <Toaster toaster={statusToaster} />
    </HStack>
  );
}
