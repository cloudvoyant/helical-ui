// apps/docs/src/components/examples/tabs/default/react.tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@cloudvoyant/helical-react';

export default function ReactTabsDefault() {
  return (
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
  );
}
