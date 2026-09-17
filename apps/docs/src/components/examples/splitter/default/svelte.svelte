<!-- apps/docs/src/components/examples/splitter/default/svelte.svelte -->
<script lang="ts">
  import {
    Splitter,
    SplitterPanel,
    SplitterResizeTrigger,
    SplitterResizeTriggerIndicator,
  } from '@cloudvoyant/helical-svelte';
</script>

<div class="h-64 w-full rounded-md border border-border bg-background">
  <Splitter panels={[{ id: 'a' }, { id: 'b' }]}>
    <SplitterPanel id="a" class="flex items-center justify-center">
      <span class="text-sm font-medium">A</span>
    </SplitterPanel>
    <SplitterResizeTrigger id="a:b">
      <SplitterResizeTriggerIndicator />
    </SplitterResizeTrigger>
    <SplitterPanel id="b" class="flex items-center justify-center">
      <span class="text-sm font-medium">B</span>
    </SplitterPanel>
  </Splitter>
</div>
