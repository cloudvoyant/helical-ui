<!-- apps/docs/src/components/examples/tabs/underline/svelte.svelte -->
<script lang="ts">
  import { Tabs, TabsList, TabsTrigger, TabsContent } from '@cloudvoyant/helical-svelte';
</script>

<Tabs defaultValue="account">
  <TabsList variant="underline">
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="billing">Billing</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account content</TabsContent>
  <TabsContent value="billing">Billing content</TabsContent>
</Tabs>
