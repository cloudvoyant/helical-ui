<!-- apps/docs/src/components/examples/card/with-image/svelte.svelte -->
<script lang="ts">
  import { Card, CardHeader, CardBody, CardTitle, CardDescription, CardCover } from '@cloudvoyant/helical-svelte';
</script>

<div class="flex flex-col gap-4 sm:flex-row">
  <Card class="w-full max-w-sm">
    <CardCover>
      <div class="h-40 w-full bg-gradient-to-br from-primary/40 to-accent/50" />
    </CardCover>
    <CardHeader>
      <CardTitle>Flush cover</CardTitle>
      <CardDescription>The cover bleeds edge-to-edge.</CardDescription>
    </CardHeader>
    <CardBody>
      <p class="text-sm text-muted-foreground">A flush cover reaches the card boundaries.</p>
    </CardBody>
  </Card>
  <Card class="w-full max-w-sm">
    <CardCover variant="inset">
      <div class="h-40 w-full bg-gradient-to-br from-primary/40 to-accent/50" />
    </CardCover>
    <CardHeader>
      <CardTitle>Inset cover</CardTitle>
      <CardDescription>The cover keeps the card padding.</CardDescription>
    </CardHeader>
    <CardBody>
      <p class="text-sm text-muted-foreground">An inset cover stays within the padding with rounded corners.</p>
    </CardBody>
  </Card>
</div>
