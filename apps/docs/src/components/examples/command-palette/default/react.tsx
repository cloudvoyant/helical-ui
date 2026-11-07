// apps/docs/src/components/examples/command-palette/default/react.tsx
import { useMemo, useState } from 'react';
import { Badge, Button, CommandPalette, HStack, Kbd, Toaster, VStack, createToaster } from '@cloudvoyant/helical-react';
import { buildDocsCommandTree } from '../../../../lib/commands';

const demoToaster = createToaster({
  placement: 'bottom-end',
  overlap: true,
  max: 3,
});

export default function ReactCommandPaletteDefault() {
  const [open, setOpen] = useState(false);
  const [lastSelected, setLastSelected] = useState('None');
  const [activeTheme, setActiveTheme] = useState('helical-ui');
  const [activeMode, setActiveMode] = useState<'light' | 'dark' | 'system'>('dark');
  const [activePreset, setActivePreset] = useState<'helix' | 'vim' | 'kakoune'>('helix');
  const [activeFramework, setActiveFramework] = useState<'react' | 'svelte'>('react');

  const items = useMemo(
    () =>
      buildDocsCommandTree({
        currentTheme: activeTheme,
        currentColorMode: activeMode,
        currentPreset: activePreset,
        currentFramework: activeFramework,
        onThemeSelect: (theme) => setActiveTheme(theme),
        onColorModeSelect: (mode) => setActiveMode(mode),
        onPresetSelect: (preset) => setActivePreset(preset),
        onFrameworkSelect: (fw) => setActiveFramework(fw),
        onOpenGitHub: () => setLastSelected('View GitHub'),
        onSearchDocs: () => setLastSelected('Search Docs'),
      }),
    [activeTheme, activeMode, activePreset, activeFramework],
  );

  return (
    <VStack className="w-full gap-3 rounded-lg border border-border bg-card p-4">
      <HStack className="flex-wrap items-center justify-between gap-2">
        <HStack className="flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Last command:</span>
          <Badge variant="subtle" color="primary" data-testid="cp-default-selected">
            {lastSelected}
          </Badge>
        </HStack>
        <Button size="sm" variant="outline" data-testid="cp-default-open" onClick={() => setOpen(true)}>
          Open Command Palette <Kbd size="sm">⌘K</Kbd>
        </Button>
      </HStack>
      <p className="text-xs text-muted-foreground">
        Click the button to open the command palette, search across nested commands, or drill into{' '}
        <strong>Change Theme</strong>, <strong>Change Light/Dark Mode</strong>, <strong>Change Keybind Style</strong>,
        and <strong>Change Framework</strong>.
      </p>
      <CommandPalette
        items={items}
        open={open}
        onOpenChange={setOpen}
        onSelectCommand={(ctx) => {
          setLastSelected(ctx.node.label);
          demoToaster.create({
            title: ctx.node.label,
            description:
              ctx.node.badge === 'Future'
                ? 'Full-text documentation search is coming soon.'
                : `Executed ${ctx.valuePath.join(' › ')}`,
            type: ctx.node.badge === 'Future' ? 'info' : 'success',
          });
        }}
      />
      <Toaster toaster={demoToaster} />
    </VStack>
  );
}
