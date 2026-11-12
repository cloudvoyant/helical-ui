<!-- apps/docs/src/components/examples/which-key/modal-interaction/svelte.svelte -->
<script lang="ts">
  // 1. Imports
  import {
    Button,
    CommandMenu,
    Dialog,
    DialogBackdrop,
    DialogContent,
    DialogDismiss,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    HStack,
    Pane,
    WhichKey,
    WhichKeyProvider,
    type CommandNode,
  } from '@cloudvoyant/helical-svelte';

  // 2. Module constants & types
  const MODAL_COMMANDS: CommandNode[] = [
    {
      value: 'open-dialog',
      label: 'Open Modal Dialog',
      command: 'open-dialog',
    },
  ];

  // --- State ---
  let dialogOpen = $state(false);
  let menuOpen = $state(false);
</script>

<WhichKeyProvider preset="helix">
  <Pane
    paneId="wk-modal-pane"
    paneTitle="Modal Interaction"
    class="flex items-center justify-center gap-2 rounded-lg border border-border bg-card p-4"
  >
    <Dialog bind:open={dialogOpen} lazyMount unmountOnExit>
      <DialogTrigger class="inline-flex">
        <Button size="sm" variant="outline" tag="span">
          Open Modal Dialog
        </Button>
      </DialogTrigger>
      <DialogBackdrop />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nested Modal Layer</DialogTitle>
          <DialogDismiss />
        </DialogHeader>
        <HStack class="mt-3 gap-2">
          <Button size="sm" variant="outline">
            Dialog Action 1
          </Button>
          <Button size="sm" variant="outline">
            Dialog Action 2
          </Button>
        </HStack>
      </DialogContent>
    </Dialog>
    <Button size="sm" variant="outline" onclick={() => (menuOpen = true)}>
      Run Command
    </Button>
  </Pane>
  <CommandMenu
    bind:open={menuOpen}
    hotkey={false}
    items={MODAL_COMMANDS}
    onSelectCommand={({ value }) => {
      if (value === 'open-dialog') {
        dialogOpen = true;
      }
    }}
  />
  <WhichKey />
</WhichKeyProvider>
