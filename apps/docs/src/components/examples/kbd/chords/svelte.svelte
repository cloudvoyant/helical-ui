<!-- apps/docs/src/components/examples/kbd/chords/svelte.svelte -->
<script lang="ts">
  // 1. Imports
  import { type KbdHotkey } from '@cloudvoyant/helical-ui';
  import { HStack, Kbd, VStack } from '@cloudvoyant/helical-svelte';

  // 2. Module constants & types
  const BROKEN_MODIFIER = 'InvalidMod+K' as unknown as KbdHotkey;
  const BROKEN_SEQUENCE = 'Space UnknownKey' as unknown as KbdHotkey;
</script>

<VStack class="items-start gap-4 text-xs text-muted-foreground">
  <HStack class="flex-wrap items-center gap-3">
    <span class="w-32 font-medium text-foreground">Single chords:</span>
    <Kbd hotkey="Mod+K" />
    <Kbd hotkey="Control+o" />
    <Kbd hotkey="Shift+Z" />
    <Kbd hotkey="Escape" />
  </HStack>

  <HStack class="flex-wrap items-center gap-3">
    <span class="w-32 font-medium text-foreground">Multi-step sequences:</span>
    <Kbd hotkey="Space w v" />
    <Kbd hotkey="Control+w l" />
    <Kbd hotkey={['g', 'w']} />
  </HStack>

  <HStack class="flex-wrap items-center gap-3">
    <span class="w-32 font-medium text-foreground">Broken / invalid:</span>
    <Kbd hotkey={BROKEN_MODIFIER} />
    <Kbd hotkey={BROKEN_SEQUENCE} />
  </HStack>
</VStack>
