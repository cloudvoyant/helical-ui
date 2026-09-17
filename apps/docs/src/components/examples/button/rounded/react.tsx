// apps/docs/src/components/examples/button/rounded/react.tsx
import { Button } from '@cloudvoyant/helical-react';

export default function ReactButtonRounded() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button color="primary" className="rounded-full">
        Primary
      </Button>
      <Button color="secondary" className="rounded-full">
        Secondary
      </Button>
      <Button color="success" className="rounded-full">
        Success
      </Button>
      <Button color="danger" className="rounded-full">
        Danger
      </Button>
      <Button color="warn" className="rounded-full">
        Warn
      </Button>
      <Button color="info" className="rounded-full">
        Info
      </Button>
    </div>
  );
}
