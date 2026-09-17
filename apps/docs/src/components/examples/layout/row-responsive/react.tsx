// apps/docs/src/components/examples/row/responsive-direction/react.tsx
import { Item, Row } from '@cloudvoyant/helical-react';

export default function ReactRowResponsiveDirection() {
  return (
    <Row className="md:flex-col">
      <Item className="bg-muted">One</Item>
      <Item className="bg-muted/50">Two</Item>
      <Item className="bg-muted">Three</Item>
    </Row>
  );
}
