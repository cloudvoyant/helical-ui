<!-- apps/docs/src/components/examples/tooltip/following-cursor/svelte.svelte -->
<script lang="ts">
  import { Tooltip, TooltipTrigger, TooltipContent, TooltipContext } from '@cloudvoyant/helical-svelte';

  let areaEl: HTMLDivElement | undefined = $state();
  const cursor = { x: 0, y: 0 };
</script>

<Tooltip
  positioning={{
    strategy: 'fixed',
    getAnchorRect: () => {
      const rect = areaEl?.getBoundingClientRect();
      return new DOMRect((rect?.left ?? 0) + cursor.x, (rect?.top ?? 0) + cursor.y, 1, 1);
    },
  }}
>
  <TooltipContext>
    {#snippet render(tooltip)}
      <div
        bind:this={areaEl}
        class="rounded-md border p-10 text-center"
        onpointermove={(e) => {
          const rect = areaEl?.getBoundingClientRect();
          if (!rect) return;
          cursor.x = e.clientX - rect.left;
          cursor.y = e.clientY - rect.top + 12;
          tooltip().reposition();
        }}
      >
        <TooltipTrigger class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
          Move your cursor here
        </TooltipTrigger>
      </div>
    {/snippet}
  </TooltipContext>
  <TooltipContent>Follows your cursor</TooltipContent>
</Tooltip>
