<!-- apps/docs/src/components/examples/page/landing/svelte.svelte -->
<script lang="ts">
  import { Page, PageSection, PageFooter } from '@cloudvoyant/helical-svelte';
</script>

<Page variant="landing">
  <PageSection class="flex items-center justify-center bg-muted/40">
    <div class="p-8 text-center">
      <h1 class="text-2xl font-semibold">Hero section</h1>
      <p class="mt-2 text-sm text-muted-foreground">Each section fills the viewport.</p>
    </div>
  </PageSection>
  <PageSection class="flex items-center justify-center">
    <div class="p-8 text-center">
      <h1 class="text-xl font-semibold">Features section</h1>
    </div>
  </PageSection>
  <PageFooter class="border-t border-border bg-muted/40">
    <p class="px-4 py-3 text-sm text-muted-foreground">Footer</p>
  </PageFooter>
</Page>
