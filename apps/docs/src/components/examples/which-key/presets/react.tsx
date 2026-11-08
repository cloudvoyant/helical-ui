// apps/docs/src/components/examples/which-key/presets/react.tsx

// 1. Imports
import {
  HStack,
  Pane,
  ToggleGroup,
  ToggleGroupItem,
  VStack,
  WhichKey,
  WhichKeyMode,
  WhichKeyProvider,
  useWhichKey,
  type KeybindingPreset,
} from '@cloudvoyant/helical-react';

// 2. Module constants & types
const PRESET_ITEMS = ['Alpha Item', 'Bravo Item', 'Charlie Item', 'Delta Item'];
const PRESETS: KeybindingPreset[] = ['helix', 'vim', 'kakoune'];

// 3. Local helpers / inner components
function PresetsSurface() {
  // --- State ---
  const { preset, setPreset } = useWhichKey();

  // --- Render ---
  return (
    <VStack className="gap-3 rounded-lg border border-border bg-card p-4">
      <HStack className="flex-wrap items-center justify-between gap-2">
        <ToggleGroup
          attached
          value={[preset]}
          onValueChange={(d) => {
            const next = d.value[0] as KeybindingPreset | undefined;
            if (next) setPreset(next);
          }}
          aria-label="Preset selector"
        >
          {PRESETS.map((p) => (
            <ToggleGroupItem key={p} value={p} size="sm" variant="outline">
              {p.toUpperCase()}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <WhichKeyMode showPreset />
      </HStack>

      <Pane paneId="wk-presets-pane" paneTitle="Preset Sandbox" className="flex flex-wrap gap-2">
        {PRESET_ITEMS.map((label) => (
          <button
            key={label}
            type="button"
            className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
          >
            {label}
          </button>
        ))}
      </Pane>
    </VStack>
  );
}

// 4. Exported component
export default function ReactWhichKeyPresets() {
  // --- Render ---
  return (
    <WhichKeyProvider preset="helix">
      <PresetsSurface />
      <WhichKey />
    </WhichKeyProvider>
  );
}
