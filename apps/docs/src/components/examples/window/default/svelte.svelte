<!-- apps/docs/src/components/examples/window/default/svelte.svelte -->
<script lang="ts">
  import {
    Window,
    WindowDragTrigger,
    WindowHeader,
    WindowTitle,
    WindowControl,
    WindowStageTrigger,
    WindowDismiss,
    WindowBody,
    WindowResizeTrigger,
  } from '@cloudvoyant/helical-svelte';
  import { Minus, Maximize2, RotateCcw, X } from 'lucide-svelte';

  let open = $state(false);
</script>

<div class="flex flex-col items-center gap-4">
  <button
    type="button"
    class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
    onclick={() => (open = true)}
  >
    Open Window
  </button>
  <Window bind:open>
      <WindowDragTrigger>
      <WindowHeader>
        <WindowTitle>Window</WindowTitle>
        <WindowControl>
          <WindowStageTrigger stage="minimized">
            <Minus />
          </WindowStageTrigger>
          <WindowStageTrigger stage="maximized">
            <Maximize2 />
          </WindowStageTrigger>
          <WindowStageTrigger stage="default">
            <RotateCcw />
          </WindowStageTrigger>
          <WindowDismiss>
            <X />
          </WindowDismiss>
        </WindowControl>
      </WindowHeader>
      </WindowDragTrigger>
      <WindowBody>Drag me around by the header and resize me from the corner.</WindowBody>
      <WindowResizeTrigger />
  </Window>
</div>
