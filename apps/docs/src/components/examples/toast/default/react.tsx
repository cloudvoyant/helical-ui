// apps/docs/src/components/examples/toast/default/react.tsx

// 1. Imports
import { Button, HStack, useToast } from '@cloudvoyant/helical-react';

// 2. Exported component
export default function ReactToastDefault() {
  // --- State ---
  const toast = useToast();

  // --- Methods ---
  const handleShowToast = () => {
    toast.create({
      title: 'Scheduled: Catch up',
      description: 'Friday, February 10, 2026 at 5:57 PM',
      type: 'info',
    });
  };

  // --- Render ---
  return (
    <HStack className="flex-wrap items-center gap-2">
      <Button variant="outline" onClick={handleShowToast}>
        Show Toast
      </Button>
    </HStack>
  );
}
