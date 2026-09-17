<!-- apps/docs/src/components/examples/window/anchor-position/svelte.svelte -->
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
  let buttonEl: HTMLButtonElement | undefined = $state();
</script>

<div class="flex flex-col items-center gap-4">
  <button
    bind:this={buttonEl}
    type="button"
    class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
    onclick={() => (open = true)}
  >
    Open Window
  </button>
  <Window
    bind:open
    getAnchorPosition={() => {
      const r = buttonEl?.getBoundingClientRect();
      return { x: r?.x ?? 0, y: (r?.y ?? 0) + (r?.height ?? 0) + 8 };
    }}
  >
      <WindowDragTrigger>
      <WindowHeader>
        <WindowTitle>Anchored Position</WindowTitle>
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
      <WindowBody>This window opens just below the button.</WindowBody>
      <WindowResizeTrigger />
  </Window>
</div>
