<!-- apps/docs/src/components/examples/colon-command/default/svelte.svelte -->
<script lang="ts">
  import {
    Badge,
    Button,
    ColonCommand,
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
        lastSelected = 'View GitHub (:github)';
      },
      onSearchDocs: () => {
        lastSelected = 'Search Docs (:search)';
      },
    }),
  );
</script>

<VStack class="w-full gap-3 rounded-lg border border-border bg-card p-4">
  <HStack class="flex-wrap items-center justify-between gap-2">
    <HStack class="flex-wrap items-center gap-2">
      <span class="text-xs font-medium text-muted-foreground">Executed:</span>
      <Badge variant="subtle" color="primary" data-testid="cc-default-selected">
        {lastSelected}
      </Badge>
    </HStack>
    <Button
      size="sm"
      variant="outline"
      data-testid="cc-default-open"
      onclick={() => {
        open = true;
      }}
    >
      Open Colon Menu <Kbd size="sm">:</Kbd>
    </Button>
  </HStack>
  <p class="text-xs text-muted-foreground">
    Type <code class="font-mono text-foreground">:theme </code> (or press
    <Kbd size="sm">Tab</Kbd> on <code class="font-mono text-foreground">th</code>) to
    autocomplete branch commands, or run <code class="font-mono text-foreground">:mode dark</code>,
    <code class="font-mono text-foreground">:keybind vim</code>, or
    <code class="font-mono text-foreground">:framework svelte</code>.
  </p>
  <ColonCommand
    {items}
    bind:open
    onSelectCommand={(ctx) => {
      lastSelected = `${ctx.node.label} (${ctx.commandString})`;
      demoToaster.create({
        title: `Executed ${ctx.commandString}`,
        description: ctx.node.label,
        type: ctx.node.badge === 'Future' ? 'info' : 'success',
      });
    }}
  />
  <Toaster toaster={demoToaster} />
</VStack>
