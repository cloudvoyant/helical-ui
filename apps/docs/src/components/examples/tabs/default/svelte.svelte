<!-- apps/docs/src/components/examples/tabs/default/svelte.svelte -->
<script lang="ts">
  import { Tabs, TabsList, TabsTrigger, TabsContent } from '@cloudvoyant/helical-svelte';
</script>

<Tabs defaultValue="profile">
  <TabsList>
    <TabsTrigger value="profile">Profile</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
    <TabsTrigger value="security">Security</TabsTrigger>
  </TabsList>
  <TabsContent value="profile">Profile content</TabsContent>
  <TabsContent value="settings">Settings content</TabsContent>
  <TabsContent value="security">Security content</TabsContent>
</Tabs>
