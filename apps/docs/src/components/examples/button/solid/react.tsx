// apps/docs/src/components/examples/button/solid/react.tsx
import { Button } from '@cloudvoyant/helical-react';

export default function ReactButtonSolid() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button color="primary">Primary</Button>
      <Button color="secondary">Secondary</Button>
      <Button color="success">Success</Button>
      <Button color="danger">Danger</Button>
      <Button color="warn">Warn</Button>
      <Button color="info">Info</Button>
    </div>
  );
}
