// apps/docs/src/components/examples/kbd/chords/react.tsx

// 1. Imports
import { type KbdHotkey } from '@cloudvoyant/helical-ui';
import { HStack, Kbd, VStack } from '@cloudvoyant/helical-react';

// 2. Module constants & types
const BROKEN_CHORD = 'InvalidMod+K' as unknown as KbdHotkey;
const BROKEN_SEQUENCE = 'Space UnknownKey' as unknown as KbdHotkey;

// 4. Exported component
export default function ReactKbdChords() {
  // --- Render ---
  return (
    <VStack className="items-start gap-4 text-xs text-muted-foreground">
      <HStack className="flex-wrap items-center gap-3">
        <span className="w-28 font-medium text-foreground">Command strings:</span>
        <Kbd data-testid="kbd-chord-mod-k" hotkey="Mod+K" platform="mac" />
        <Kbd data-testid="kbd-chord-sequence" hotkey="Space w v" />
        <Kbd data-testid="kbd-chord-ctrl-w-l" hotkey="Control+w l" platform="mac" />
        <Kbd data-testid="kbd-chord-gg" hotkey="g g" />
      </HStack>

      <HStack className="flex-wrap items-center gap-3">
        <span className="w-28 font-medium text-foreground">Platforms:</span>
        <Kbd data-testid="kbd-platform-mac" hotkey="Mod+Shift+P" platform="mac" />
        <Kbd data-testid="kbd-platform-win" hotkey="Mod+Shift+P" platform="windows" />
      </HStack>

      <HStack className="flex-wrap items-center gap-3">
        <span className="w-28 font-medium text-foreground">Broken commands:</span>
        <Kbd data-testid="kbd-invalid-chord" hotkey={BROKEN_CHORD} />
        <Kbd data-testid="kbd-invalid-sequence" hotkey={BROKEN_SEQUENCE} />
      </HStack>
    </VStack>
  );
}
