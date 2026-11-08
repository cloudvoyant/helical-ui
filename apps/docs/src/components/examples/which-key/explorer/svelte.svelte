<!-- apps/docs/src/components/examples/which-key/explorer/svelte.svelte -->
<script lang="ts">
  import {
    Badge,
    Button,
    HStack,
    Kbd,
    Pane,
    VStack,
    WhichKey,
    WhichKeyProvider,
    useWhichKey,
    type KeymapHandler,
    type WhichKeyNode,
  } from '@cloudvoyant/helical-svelte';

  let lastExecuted = $state('none');

  const customKeymap: Record<string, WhichKeyNode> = {
    Space: {
      key: 'Space',
      label: 'Leader',
      group: 'Leader',
      children: {
        p: {
          key: 'p',
          label: 'Format Document',
          description: 'Prettify and format the active buffer',
          group: 'Document',
          commandId: 'demo.formatDocument',
        },
        s: {
          key: 's',
          label: 'Sync Workspace',
          description: 'Synchronize workspace state with remote',
          group: 'Workspace',
          commandId: 'demo.syncWorkspace',
        },
      },
    },
  };

  const commands: Record<string, KeymapHandler> = {
    'demo.formatDocument': () => {
      lastExecuted = 'demo.formatDocument';
    },
    'demo.syncWorkspace': () => {
      lastExecuted = 'demo.syncWorkspace';
    },
  };
</script>

<WhichKeyProvider
  preset="helix"
  keymap={customKeymap}
  {commands}
  onCommand={(cmdId) => {
    lastExecuted = cmdId;
  }}
>
  {#snippet children()}
    {@const wk = useWhichKey()}
    <VStack class="w-full gap-3">
      <Pane
        paneId="wk-explorer-pane"
        paneTitle="Explorer Demo"
        class="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
      >
        <HStack class="flex-wrap items-center justify-between gap-2">
          <HStack class="items-center gap-2">
            <span class="text-xs font-medium text-muted-foreground">Executed Command:</span>
            <Badge variant="subtle" color="primary">
              {lastExecuted}
            </Badge>
          </HStack>
          <Button size="sm" variant="outline" onclick={() => wk.openExplorer()}>
            Open Explorer <Kbd size="sm">?</Kbd>
          </Button>
        </HStack>
        <p class="text-xs text-muted-foreground">
          Press <Kbd size="sm" hotkey="?" /> or <Kbd size="sm" hotkey={['Space', '?']} /> (or click the
          button) to open the searchable Keybinding Exploration Menu, filter by keyword, and press
          <Kbd size="sm">Enter</Kbd> to run a command.
        </p>
      </Pane>
      <WhichKey />
    </VStack>
  {/snippet}
</WhichKeyProvider>
