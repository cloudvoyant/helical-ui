<!-- apps/docs/src/components/examples/page/gutter-scroll/svelte.svelte -->
<script lang="ts">
  import { Page, PageGutter, PageContent, Scroll } from '@cloudvoyant/helical-svelte';

  const tags = Array.from({ length: 60 }, (_, i) => `v1.2.0-beta.${60 - i}`);
</script>

<Page>
  <PageGutter side="left">
    <Scroll variant="hidden" class="w-full border-r border-border bg-muted/40">
      <div>
        <p class="px-2 pb-2 text-xs font-semibold text-muted-foreground">Releases</p>
        {#each tags as tag (tag)}
          <div class="border-t border-border px-2 py-1.5 text-sm text-muted-foreground">{tag}</div>
        {/each}
      </div>
    </Scroll>
  </PageGutter>
  <PageContent class="flex items-center justify-center">
    <div class="p-8 text-center">
      <h1 class="text-xl font-semibold">Scrolling gutters</h1>
      <p class="mt-2 text-sm text-muted-foreground">The gutter content scrolls independently via Scroll.</p>
    </div>
  </PageContent>
</Page>
