// apps/docs/src/components/examples/badge/sizes/react.tsx
import { Badge } from '@cloudvoyant/helical-react';

export default function ReactBadgeSizes() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge size="xs">Extra small</Badge>
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  );
}
