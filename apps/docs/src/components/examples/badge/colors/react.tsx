// apps/docs/src/components/examples/badge/colors/react.tsx
import { Badge } from '@cloudvoyant/helical-react';

export default function ReactBadgeColors() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge color="primary">Primary</Badge>
      <Badge color="secondary">Secondary</Badge>
      <Badge color="success">Success</Badge>
      <Badge color="danger">Danger</Badge>
      <Badge color="warn">Warn</Badge>
      <Badge color="info">Info</Badge>
    </div>
  );
}
