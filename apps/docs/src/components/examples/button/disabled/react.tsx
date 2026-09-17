// apps/docs/src/components/examples/button/disabled/react.tsx
import { Button } from '@cloudvoyant/helical-react';

export default function ReactButtonDisabled() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button color="primary" disabled>
        Primary
      </Button>
      <Button color="secondary" disabled>
        Secondary
      </Button>
      <Button color="success" disabled>
        Success
      </Button>
      <Button color="danger" disabled>
        Danger
      </Button>
      <Button color="warn" disabled>
        Warn
      </Button>
      <Button color="info" disabled>
        Info
      </Button>
    </div>
  );
}
