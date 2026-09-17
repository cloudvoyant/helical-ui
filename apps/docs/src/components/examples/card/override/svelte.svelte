<!-- apps/docs/src/components/examples/card/override/svelte.svelte -->
<script lang="ts">
  import { Card, CardHeader, CardBody, CardTitle, CardDescription } from '@cloudvoyant/helical-svelte';
</script>

{#snippet heading(props)}
  <h2 {...props({ class: 'text-xl' })}>Overridden heading</h2>
{/snippet}

<Card class="w-full max-w-sm">
  <CardHeader>
    <CardTitle asChild={heading} />
    <CardDescription>This title renders as an h2 with a larger size instead of the default h3.</CardDescription>
  </CardHeader>
  <CardBody>
    <p class="text-sm text-muted-foreground">
      Use asChild to change the heading level, and a text-* class to change the size.
    </p>
  </CardBody>
</Card>
