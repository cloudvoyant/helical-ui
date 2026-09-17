<!-- apps/docs/src/components/examples/card/default/svelte.svelte -->
<script lang="ts">
  import { Card, CardHeader, CardBody, CardFooter, CardTitle, CardDescription, Button } from '@cloudvoyant/helical-svelte';
</script>

<Card class="w-full max-w-sm">
  <CardHeader>
    <CardTitle>Team members</CardTitle>
    <CardDescription>Manage your team and their roles.</CardDescription>
  </CardHeader>
  <CardBody>
    <p class="text-sm text-muted-foreground">
      This is the card body. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    </p>
  </CardBody>
  <CardFooter>
    <Button variant="solid" color="primary" size="sm">Add member</Button>
    <Button variant="outline" color="primary" size="sm">Cancel</Button>
  </CardFooter>
</Card>
