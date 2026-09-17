// apps/docs/src/components/examples/col/default/react.tsx
import { Item, Col } from '@cloudvoyant/helical-react';

export default function ReactColDefault() {
  return (
    <Col>
      <Item className="bg-muted">One</Item>
      <Item className="bg-muted/50">Two</Item>
      <Item className="bg-muted">Three</Item>
    </Col>
  );
}
