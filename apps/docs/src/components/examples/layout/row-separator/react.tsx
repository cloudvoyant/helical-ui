// apps/docs/src/components/examples/row/separator/react.tsx
import { Row } from '@cloudvoyant/helical-react';

export default function ReactRowSeparator() {
  return (
    <Row className="gap-0 divide-x divide-border">
      <div className="px-3 py-2 text-sm">Item 1</div>
      <div className="px-3 py-2 text-sm">Item 2</div>
      <div className="px-3 py-2 text-sm">Item 3</div>
    </Row>
  );
}
