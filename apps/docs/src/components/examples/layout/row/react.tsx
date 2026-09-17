// apps/docs/src/components/examples/row/default/react.tsx
import { Item, Row } from '@cloudvoyant/helical-react';

export default function ReactRowDefault() {
  return (
    <Row>
      <Item className="bg-muted">One</Item>
      <Item className="bg-muted/50">Two</Item>
      <Item className="bg-muted">Three</Item>
    </Row>
  );
}
