// apps/docs/src/components/examples/stack/responsive-direction/react.tsx
import { Item, Stack } from '@cloudvoyant/helical-react';

export default function ReactStackResponsiveDirection() {
  return (
    <Stack className="md:flex-row">
      <Item variant="surface">One</Item>
      <Item variant="surface">Two</Item>
      <Item variant="surface">Three</Item>
    </Stack>
  );
}
