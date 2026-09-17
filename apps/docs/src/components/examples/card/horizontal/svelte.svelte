<!-- apps/docs/src/components/examples/card/horizontal/svelte.svelte -->
<script lang="ts">
  import { Card, CardHeader, CardBody, CardTitle, CardDescription, CardCover } from '@cloudvoyant/helical-svelte';
  import { User } from 'lucide-svelte';
</script>

<Card orientation="horizontal" class="w-full max-w-2xl">
  <CardCover class="w-1/3">
    <div class="flex h-full min-h-40 w-full items-center justify-center bg-gradient-to-br from-primary/40 to-accent/50">
      <User class="size-8 text-primary" />
    </div>
  </CardCover>
  <div class="flex flex-1 flex-col gap-4">
    <CardHeader>
      <CardTitle>Horizontal card</CardTitle>
      <CardDescription>The cover bleeds to the left, top, and bottom edges.</CardDescription>
    </CardHeader>
    <CardBody>
      <p class="text-sm text-muted-foreground">
        Use orientation="horizontal" with a flush cover and wrap the content in a flex column.
      </p>
    </CardBody>
  </div>
</Card>
