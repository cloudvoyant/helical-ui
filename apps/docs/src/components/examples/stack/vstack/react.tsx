// apps/docs/src/components/examples/stack/vstack/react.tsx
import { Item, VStack } from '@cloudvoyant/helical-react';

export default function ReactStackVstack() {
  return (
    <VStack>
      <Item variant="surface">One</Item>
      <Item variant="surface">Two</Item>
      <Item variant="surface">Three</Item>
    </VStack>
  );
}
