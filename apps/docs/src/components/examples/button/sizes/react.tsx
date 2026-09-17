// apps/docs/src/components/examples/button/sizes/react.tsx
import { Button } from '@cloudvoyant/helical-react';

export default function ReactButtonSizes() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  );
}
