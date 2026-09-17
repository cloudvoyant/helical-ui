<!-- apps/docs/src/components/examples/page/footer/svelte.svelte -->
<script lang="ts">
  import { Page, PageContent, PageFooter, Container } from '@cloudvoyant/helical-svelte';
</script>

<Page>
  <PageContent class="flex items-center justify-center">
    <div class="p-8 text-center">
      <h1 class="text-xl font-semibold">Page content</h1>
      <p class="mt-2 text-sm text-muted-foreground">The footer sits below the page body.</p>
    </div>
  </PageContent>
  <PageFooter class="border-t border-border bg-muted/40">
    <Container class="grid grid-cols-2 gap-6 py-6 md:grid-cols-4">
      <div>
        <p class="text-sm font-semibold">Product</p>
        <ul class="mt-2 space-y-1 text-sm text-muted-foreground">
          <li>Overview</li>
          <li>Pricing</li>
        </ul>
      </div>
      <div>
        <p class="text-sm font-semibold">Company</p>
        <ul class="mt-2 space-y-1 text-sm text-muted-foreground">
          <li>About</li>
          <li>Blog</li>
        </ul>
      </div>
      <div>
        <p class="text-sm font-semibold">Resources</p>
        <ul class="mt-2 space-y-1 text-sm text-muted-foreground">
          <li>Docs</li>
          <li>Support</li>
        </ul>
      </div>
      <div>
        <p class="text-sm font-semibold">Legal</p>
        <ul class="mt-2 space-y-1 text-sm text-muted-foreground">
          <li>Privacy</li>
          <li>Terms</li>
        </ul>
      </div>
    </Container>
    <p class="border-t border-border px-4 py-3 text-sm text-muted-foreground">© 2026 helical-ui</p>
  </PageFooter>
</Page>
