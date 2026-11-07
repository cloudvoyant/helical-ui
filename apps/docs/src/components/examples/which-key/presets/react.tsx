// apps/docs/src/components/examples/which-key/presets/react.tsx

// 1. Imports
import { useState } from 'react';
import {
  HStack,
  Kbd,
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
function PresetsSurface({ lastCommand }: { lastCommand: string }) {
  // --- State ---
  const { preset, setPreset } = useWhichKey();
  const [focusedItem, setFocusedItem] = useState(PRESET_ITEMS[0]!);

  // --- Render ---
  return (
    <div data-testid="wk-presets-surface" className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4">
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
            <ToggleGroupItem key={p} value={p} size="sm" variant="outline" data-testid={`wk-preset-btn-${p}`}>
              {p.toUpperCase()}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <HStack className="items-center gap-2">
          <WhichKeyMode showPreset data-testid="wk-presets-active" />
          <span className="text-xs text-muted-foreground" data-testid="wk-presets-last-cmd">
            {lastCommand}
          </span>
        </HStack>
      </HStack>

      <p className="text-xs text-muted-foreground">
        {preset === 'helix' && (
          <>
            <strong>Helix:</strong> <Kbd size="sm" hotkey="g" /> opens Goto (<Kbd size="sm" hotkey="g g" /> top,{' '}
            <Kbd size="sm" hotkey="g e" /> bottom, <Kbd size="sm" hotkey="g w" /> jump), <Kbd size="sm" hotkey="z" />{' '}
            opens View, and <Kbd size="sm" hotkey="Shift+Z" /> locks View mode.
          </>
        )}
        {preset === 'vim' && (
          <>
            <strong>Vim:</strong> <Kbd size="sm" hotkey="Shift+G" /> jumps to bottom, <Kbd size="sm" hotkey="0" /> /{' '}
            <Kbd size="sm" hotkey="$" /> jump to start/end, and <Kbd size="sm" hotkey="s" /> triggers jump labels.
          </>
        )}
        {preset === 'kakoune' && (
          <>
            <strong>Kakoune:</strong> <Kbd size="sm" hotkey="v" /> opens View, <Kbd size="sm" hotkey="Shift+V" /> locks
            View mode until <Kbd size="sm" hotkey="Escape" />, and <Kbd size="sm" hotkey="g" /> opens Goto (
            <Kbd size="sm" hotkey="g k" />/<Kbd size="sm" hotkey="g j" />
            ).
          </>
        )}
      </p>

      <Pane paneId="wk-presets-pane" paneTitle="Preset Sandbox" className="flex flex-col gap-2">
        <HStack className="flex-wrap gap-2">
          {PRESET_ITEMS.map((label, idx) => (
            <button
              key={label}
              type="button"
              data-testid={`wk-preset-item-${idx}`}
              onFocus={() => setFocusedItem(label)}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
            >
              {label}
            </button>
          ))}
        </HStack>
      </Pane>
      <span className="text-xs text-muted-foreground">
        Focused target: <strong data-testid="wk-presets-focused-item">{focusedItem}</strong>
      </span>
    </div>
  );
}

// 4. Exported component
export default function ReactWhichKeyPresets() {
  // --- State ---
  const [lastCommand, setLastCommand] = useState('Ready');

  // --- Render ---
  return (
    <WhichKeyProvider preset="helix" onCommand={(id) => setLastCommand(id)}>
      <VStack className="w-full gap-3">
        <PresetsSurface lastCommand={lastCommand} />
        <WhichKey />
      </VStack>
    </WhichKeyProvider>
  );
}
