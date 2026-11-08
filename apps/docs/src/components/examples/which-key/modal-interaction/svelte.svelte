<!-- apps/docs/src/components/examples/which-key/modal-interaction/svelte.svelte -->
<script lang="ts">
  // 1. Imports
  import {
    Button,
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
  } from '@cloudvoyant/helical-svelte';
</script>

<WhichKeyProvider preset="helix">
  <Pane
    paneId="wk-modal-pane"
    paneTitle="Modal Interaction"
    class="flex items-center justify-center rounded-lg border border-border bg-card p-4"
  >
    <Dialog lazyMount unmountOnExit>
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
  </Pane>
  <WhichKey />
</WhichKeyProvider>
