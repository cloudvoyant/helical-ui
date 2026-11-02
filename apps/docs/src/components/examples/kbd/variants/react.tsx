// apps/docs/src/components/examples/kbd/variants/react.tsx
import { HStack, Kbd, VStack } from '@cloudvoyant/helical-react';

export default function ReactKbdVariants() {
  return (
    <VStack className="items-start gap-4">
      <HStack className="items-center gap-3">
        <Kbd variant="outline">Outline</Kbd>
        <Kbd variant="subtle">Subtle</Kbd>
        <Kbd variant="solid">Solid</Kbd>
      </HStack>
      <HStack className="items-center gap-3">
        <Kbd size="sm" hotkey="Space" />
        <Kbd size="md" hotkey="Space" />
        <Kbd size="lg" hotkey="Space" />
      </HStack>
    </VStack>
  );
}
