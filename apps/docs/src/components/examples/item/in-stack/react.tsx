// apps/docs/src/components/examples/item/in-stack/react.tsx
import { Item, Stack } from '@cloudvoyant/helical-react';

export default function ReactItemInStack() {
  return (
    <Stack>
      <Item variant="surface">One</Item>
      <Item variant="surface">Two</Item>
      <Item variant="surface">Three</Item>
    </Stack>
  );
}
