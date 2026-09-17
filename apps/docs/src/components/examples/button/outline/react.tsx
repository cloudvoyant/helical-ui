// apps/docs/src/components/examples/button/outline/react.tsx
import { Button } from '@cloudvoyant/helical-react';

export default function ReactButtonOutline() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="outline" color="primary">
        Primary
      </Button>
      <Button variant="outline" color="secondary">
        Secondary
      </Button>
      <Button variant="outline" color="success">
        Success
      </Button>
      <Button variant="outline" color="danger">
        Danger
      </Button>
      <Button variant="outline" color="warn">
        Warn
      </Button>
      <Button variant="outline" color="info">
        Info
      </Button>
    </div>
  );
}
