// apps/docs/src/components/examples/col/separator/react.tsx
import { Col } from '@cloudvoyant/helical-react';

export default function ReactColSeparator() {
  return (
    <Col className="gap-0 divide-y divide-border">
      <div className="py-2 text-sm">Item 1</div>
      <div className="py-2 text-sm">Item 2</div>
      <div className="py-2 text-sm">Item 3</div>
    </Col>
  );
}
