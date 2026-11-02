// apps/docs/src/components/examples/kbd/default/react.tsx
import { HStack, Kbd } from '@cloudvoyant/helical-react';

export default function ReactKbdDefault() {
  return (
    <HStack className="flex-wrap items-center gap-3">
      <Kbd>⌘K</Kbd>
      <Kbd hotkey="Control+w" />
      <Kbd hotkey={['Space', '?']} />
      <Kbd hotkey="Shift+Z" />
    </HStack>
  );
}
