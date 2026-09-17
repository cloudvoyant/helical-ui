// apps/docs/src/components/examples/row/with-gap/react.tsx
import { Item, Row } from '@cloudvoyant/helical-react';

export default function ReactRowWithGap() {
  return (
    <Row className="gap-4">
      <Item className="bg-muted">One</Item>
      <Item className="bg-muted/50">Two</Item>
      <Item className="bg-muted">Three</Item>
    </Row>
  );
}
