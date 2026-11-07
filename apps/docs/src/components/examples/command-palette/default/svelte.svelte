<!-- apps/docs/src/components/examples/command-palette/default/svelte.svelte -->
<script lang="ts">
  import {
    Badge,
    Button,
    CommandPalette,
    HStack,
    Kbd,
    Toaster,
    VStack,
    createToaster,
  } from '@cloudvoyant/helical-svelte';
  import { buildDocsCommandTree } from '../../../../lib/commands';

  const demoToaster = createToaster({
    placement: 'bottom-end',
    overlap: true,
    max: 3,
  });

  let open = $state(false);
  let lastSelected = $state('None');
  let activeTheme = $state('helical-ui');
  let activeMode = $state<'light' | 'dark' | 'system'>('dark');
  let activePreset = $state<'helix' | 'vim' | 'kakoune'>('helix');
  let activeFramework = $state<'react' | 'svelte'>('svelte');

  const items = $derived(
    buildDocsCommandTree({
      currentTheme: activeTheme,
      currentColorMode: activeMode,
      currentPreset: activePreset,
      currentFramework: activeFramework,
      onThemeSelect: (theme) => {
        activeTheme = theme;
      },
      onColorModeSelect: (mode) => {
        activeMode = mode;
      },
      onPresetSelect: (preset) => {
        activePreset = preset;
      },
      onFrameworkSelect: (fw) => {
        activeFramework = fw;
      },
      onOpenGitHub: () => {
        lastSelected = 'View GitHub';
      },
      onSearchDocs: () => {
        lastSelected = 'Search Docs';
      },
    }),
  );
</script>

<VStack class="w-full gap-3 rounded-lg border border-border bg-card p-4">
  <HStack class="flex-wrap items-center justify-between gap-2">
    <HStack class="flex-wrap items-center gap-2">
      <span class="text-xs font-medium text-muted-foreground">Last command:</span>
      <Badge variant="subtle" color="primary" data-testid="cp-default-selected">
        {lastSelected}
      </Badge>
    </HStack>
    <Button
      size="sm"
      variant="outline"
      data-testid="cp-default-open"
      onclick={() => {
        open = true;
      }}
    >
      Open Command Palette <Kbd size="sm">⌘K</Kbd>
    </Button>
  </HStack>
  <p class="text-xs text-muted-foreground">
    Click the button to open the command palette, search across nested commands, or drill into
    <strong>Change Theme</strong>, <strong>Change Light/Dark Mode</strong>,
    <strong>Change Keybind Style</strong>, and <strong>Change Framework</strong>.
  </p>
  <CommandPalette
    {items}
    bind:open
    onSelectCommand={(ctx) => {
      lastSelected = ctx.node.label;
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
