<!-- apps/docs/src/components/examples/which-key/explorer/svelte.svelte -->
<script lang="ts">
  // 1. Imports
  import {
    Button,
    Kbd,
    Pane,
    WhichKey,
    WhichKeyProvider,
    useWhichKey,
    type WhichKeyNode,
  } from '@cloudvoyant/helical-svelte';

  // 2. Module constants & types
  const CUSTOM_KEYMAP: Record<string, WhichKeyNode> = {
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
</script>

<WhichKeyProvider preset="helix" keymap={CUSTOM_KEYMAP}>
  {#snippet children()}
    {@const wk = useWhichKey()}
    <Pane
      paneId="wk-explorer-pane"
      paneTitle="Explorer Demo"
      class="flex items-center justify-center rounded-lg border border-border bg-card p-4"
    >
      <Button size="sm" variant="outline" onclick={() => wk.openExplorer()}>
        Open Explorer <Kbd size="sm" hotkey="?" />
      </Button>
    </Pane>
    <WhichKey />
  {/snippet}
</WhichKeyProvider>
