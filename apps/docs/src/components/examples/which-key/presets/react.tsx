// apps/docs/src/components/examples/which-key/presets/react.tsx
import { useState } from 'react';
import {
  Button,
  HStack,
  Kbd,
  Pane,
  VStack,
  WhichKey,
  WhichKeyMode,
  WhichKeyProvider,
  useWhichKey,
  type KeybindingPreset,
} from '@cloudvoyant/helical-react';

const PRESET_ITEMS = ['Alpha Item', 'Bravo Item', 'Charlie Item', 'Delta Item'];

function PresetsSurface({ lastCommand }: { lastCommand: string }) {
  const { preset, setPreset } = useWhichKey();
  const [focusedItem, setFocusedItem] = useState(PRESET_ITEMS[0]!);

  return (
    <div data-testid="wk-presets-surface" className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4">
      <HStack className="flex-wrap items-center justify-between gap-2">
        <HStack className="items-center gap-1.5" role="group" aria-label="Preset selector">
          {(['helix', 'vim', 'kakoune'] as KeybindingPreset[]).map((p) => (
            <Button
              key={p}
              size="sm"
              variant={preset === p ? 'solid' : 'outline'}
              data-testid={`wk-preset-btn-${p}`}
              onClick={() => setPreset(p)}
            >
              {p.toUpperCase()}
            </Button>
          ))}
        </HStack>
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
            <strong>Helix:</strong> <Kbd size="sm">g</Kbd> opens Goto (<Kbd size="sm">gg</Kbd> top,{' '}
            <Kbd size="sm">ge</Kbd> bottom, <Kbd size="sm">gw</Kbd> jump), <Kbd size="sm">z</Kbd> opens View, and{' '}
            <Kbd size="sm">Shift+Z</Kbd> locks View mode.
          </>
        )}
        {preset === 'vim' && (
          <>
            <strong>Vim:</strong> <Kbd size="sm">Shift+G</Kbd> jumps to bottom, <Kbd size="sm">0</Kbd> /{' '}
            <Kbd size="sm">$</Kbd> jump to start/end, and <Kbd size="sm">s</Kbd> triggers jump labels.
          </>
        )}
        {preset === 'kakoune' && (
          <>
            <strong>Kakoune:</strong> <Kbd size="sm">v</Kbd> opens View, <Kbd size="sm">Shift+V</Kbd> locks View mode
            until <Kbd size="sm">Esc</Kbd>, and <Kbd size="sm">g</Kbd> opens Goto (<Kbd size="sm">gk</Kbd>/
            <Kbd size="sm">gj</Kbd>).
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

export default function ReactWhichKeyPresets() {
  const [lastCommand, setLastCommand] = useState('Ready');

  return (
    <WhichKeyProvider preset="helix" onCommand={(id) => setLastCommand(id)}>
      <VStack className="w-full gap-3">
        <PresetsSurface lastCommand={lastCommand} />
        <WhichKey />
      </VStack>
    </WhichKeyProvider>
  );
}
