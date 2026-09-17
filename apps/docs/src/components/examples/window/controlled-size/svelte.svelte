<!-- apps/docs/src/components/examples/window/controlled-size/svelte.svelte -->
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
  let size = $state({ width: 320, height: 220 });
</script>

<div class="flex flex-col items-center gap-4">
  <button
    type="button"
    class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
    onclick={() => (open = true)}
  >
    Open Window
  </button>
  <Window bind:open bind:size>
      <WindowDragTrigger>
      <WindowHeader>
        <WindowTitle>Controlled Size</WindowTitle>
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
      <WindowBody>
      Size: {size.width} × {size.height}
      </WindowBody>
      <WindowResizeTrigger />
  </Window>
</div>
