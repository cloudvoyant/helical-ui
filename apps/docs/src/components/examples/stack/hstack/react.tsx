// apps/docs/src/components/examples/stack/hstack/react.tsx
import { Item, HStack } from '@cloudvoyant/helical-react';

export default function ReactStackHstack() {
  return (
    <HStack>
      <Item variant="surface">One</Item>
      <Item variant="surface">Two</Item>
      <Item variant="surface">Three</Item>
    </HStack>
  );
}
