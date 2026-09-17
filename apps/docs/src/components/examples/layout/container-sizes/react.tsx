// apps/docs/src/components/examples/container/sizes/react.tsx
import { Container, Item } from '@cloudvoyant/helical-react';

export default function ReactContainerSizes() {
  return (
    <div className="flex flex-col gap-4">
      <Container className="max-w-sm">
        <Item className="w-full bg-muted">max-w-sm</Item>
      </Container>
      <Container className="max-w-2xl">
        <Item className="w-full bg-muted">max-w-2xl</Item>
      </Container>
      <Container className="max-w-5xl">
        <Item className="w-full bg-muted">max-w-5xl</Item>
      </Container>
    </div>
  );
}
