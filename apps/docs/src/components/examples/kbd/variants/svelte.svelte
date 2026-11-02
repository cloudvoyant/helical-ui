<!-- apps/docs/src/components/examples/kbd/variants/svelte.svelte -->
<script lang="ts">
  import { HStack, Kbd, VStack } from '@cloudvoyant/helical-svelte';
</script>

<VStack class="items-start gap-4">
  <HStack class="items-center gap-3">
    <Kbd variant="outline">Outline</Kbd>
    <Kbd variant="subtle">Subtle</Kbd>
    <Kbd variant="solid">Solid</Kbd>
  </HStack>
  <HStack class="items-center gap-3">
    <Kbd size="sm" hotkey="Space" />
    <Kbd size="md" hotkey="Space" />
    <Kbd size="lg" hotkey="Space" />
  </HStack>
</VStack>
