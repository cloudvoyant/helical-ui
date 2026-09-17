// apps/docs/src/components/examples/item/in-container/react.tsx
import { Item, Row } from '@cloudvoyant/helical-react';

export default function ReactItemInContainer() {
  return (
    <Row className="gap-2">
      <Item>One</Item>
      <Item>Two</Item>
      <Item>Three</Item>
    </Row>
  );
}
