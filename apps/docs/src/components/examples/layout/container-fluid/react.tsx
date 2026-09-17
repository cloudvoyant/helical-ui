// apps/docs/src/components/examples/container/fluid/react.tsx
import { Container, Item } from '@cloudvoyant/helical-react';

export default function ReactContainerFluid() {
  return (
    <Container className="max-w-full">
      <Item className="w-full bg-muted">This container stretches to fill the width of its parent.</Item>
    </Container>
  );
}
