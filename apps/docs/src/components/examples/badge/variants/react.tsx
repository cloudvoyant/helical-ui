// apps/docs/src/components/examples/badge/variants/react.tsx
import { Badge } from '@cloudvoyant/helical-react';

export default function ReactBadgeVariants() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="solid">Solid</Badge>
      <Badge variant="subtle">Subtle</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="surface">Surface</Badge>
      <Badge variant="plain">Plain</Badge>
    </div>
  );
}
