<!-- apps/docs/src/components/examples/window/context/svelte.svelte -->
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
    WindowContext,
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
        <WindowTitle>Context</WindowTitle>
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
      <WindowContext>
        {#snippet render(window)}
          <p class="text-sm text-muted-foreground">Window is {window().open ? 'open' : 'closed'}</p>
        {/snippet}
      </WindowContext>
      <p class="text-sm text-muted-foreground">The status above is read via the window context.</p>
    </WindowBody>
    <WindowResizeTrigger />
  </Window>
</div>
