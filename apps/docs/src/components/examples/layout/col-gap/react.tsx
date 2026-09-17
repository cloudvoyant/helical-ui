// apps/docs/src/components/examples/col/with-gap/react.tsx
import { Item, Col } from '@cloudvoyant/helical-react';

export default function ReactColWithGap() {
  return (
    <Col className="gap-4">
      <Item className="bg-muted">One</Item>
      <Item className="bg-muted/50">Two</Item>
      <Item className="bg-muted">Three</Item>
    </Col>
  );
}
