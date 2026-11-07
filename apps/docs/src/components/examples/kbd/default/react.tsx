// apps/docs/src/components/examples/kbd/default/react.tsx

// 1. Imports
import { HStack, Kbd } from '@cloudvoyant/helical-react';

// 4. Exported component
export default function ReactKbdDefault() {
  // --- Render ---
  return (
    <HStack className="flex-wrap items-center gap-3">
      <Kbd>⌘K</Kbd>
      <Kbd hotkey="Control+w" />
      <Kbd hotkey="Space ?" />
      <Kbd hotkey="Shift+Z" />
    </HStack>
  );
}
