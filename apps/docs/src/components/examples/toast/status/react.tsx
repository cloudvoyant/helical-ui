// apps/docs/src/components/examples/toast/status/react.tsx

// 1. Imports
import { Button, HStack, useToast } from '@cloudvoyant/helical-react';

// 2. Exported component
export default function ReactToastStatus() {
  // --- State ---
  const toast = useToast();

  // --- Methods ---
  const showInfo = () =>
    toast.create({
      title: 'Update available',
      description: 'A new version of helical-ui is ready to install.',
      type: 'info',
    });

  const showSuccess = () =>
    toast.create({
      title: 'Changes saved',
      description: 'Your workspace preferences have been updated.',
      type: 'success',
    });

  const showWarning = () =>
    toast.create({
      title: 'Rate limit approaching',
      description: '85% of your hourly API quota has been consumed.',
      type: 'warning',
    });

  const showError = () =>
    toast.create({
      title: 'Deployment failed',
      description: 'Could not reach the remote build cluster.',
      type: 'error',
    });

  // --- Render ---
  return (
    <HStack className="flex-wrap items-center gap-2">
      <Button size="sm" variant="outline" data-testid="toast-status-info" onClick={showInfo}>
        Info
      </Button>
      <Button size="sm" variant="outline" color="success" data-testid="toast-status-success" onClick={showSuccess}>
        Success
      </Button>
      <Button size="sm" variant="outline" color="warn" data-testid="toast-status-warning" onClick={showWarning}>
        Warning
      </Button>
      <Button size="sm" variant="outline" color="danger" data-testid="toast-status-error" onClick={showError}>
        Error
      </Button>
    </HStack>
  );
}
