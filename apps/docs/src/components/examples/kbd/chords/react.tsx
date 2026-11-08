// apps/docs/src/components/examples/kbd/chords/react.tsx

// 1. Imports
import { type KbdHotkey } from '@cloudvoyant/helical-ui';
import { HStack, Kbd, VStack } from '@cloudvoyant/helical-react';

// 2. Module constants & types
const BROKEN_MODIFIER = 'InvalidMod+K' as unknown as KbdHotkey;
const BROKEN_SEQUENCE = 'Space UnknownKey' as unknown as KbdHotkey;

// 4. Exported component
export default function ReactKbdChords() {
  // --- Render ---
  return (
    <VStack className="items-start gap-4 text-xs text-muted-foreground">
      <HStack className="flex-wrap items-center gap-3">
        <span className="w-32 font-medium text-foreground">Single chords:</span>
        <Kbd hotkey="Mod+K" />
        <Kbd hotkey="Control+o" />
        <Kbd hotkey="Shift+Z" />
        <Kbd hotkey="Escape" />
      </HStack>

      <HStack className="flex-wrap items-center gap-3">
        <span className="w-32 font-medium text-foreground">Multi-step sequences:</span>
        <Kbd hotkey="Space w v" />
        <Kbd hotkey="Control+w l" />
        <Kbd hotkey={['g', 'w']} />
      </HStack>

      <HStack className="flex-wrap items-center gap-3">
        <span className="w-32 font-medium text-foreground">Broken / invalid:</span>
        <Kbd hotkey={BROKEN_MODIFIER} />
        <Kbd hotkey={BROKEN_SEQUENCE} />
      </HStack>
    </VStack>
  );
}
