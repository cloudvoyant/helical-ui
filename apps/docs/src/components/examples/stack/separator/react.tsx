// apps/docs/src/components/examples/stack/separator/react.tsx
import { Stack } from '@cloudvoyant/helical-react';

export default function ReactStackSeparator() {
  return (
    <Stack className="gap-0 divide-y divide-border">
      <div className="py-2 text-sm">Item 1</div>
      <div className="py-2 text-sm">Item 2</div>
      <div className="py-2 text-sm">Item 3</div>
    </Stack>
  );
}
