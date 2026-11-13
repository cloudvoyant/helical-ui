// apps/docs/src/components/examples/theming/default/react.tsx

// 1. Imports
import { HStack, LightSwitch, ThemeSelector, VStack } from '@cloudvoyant/helical-react';

// 4. Exported component
/**
 * Default appearance controls example pairing `LightSwitch` and `ThemeSelector`.
 */
export default function ThemingDefault() {
  // --- Render ---
  return (
    <VStack className="w-full max-w-md gap-3">
      <HStack className="items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Appearance</span>
        <LightSwitch />
      </HStack>
      <ThemeSelector />
    </VStack>
  );
}
