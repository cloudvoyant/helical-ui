<!-- apps/docs/src/components/examples/navbar/density/svelte.svelte -->
<script lang="ts">
  import {
    Navbar,
    NavbarProvider,
    NavbarMenu,
    NavbarMenuList,
    NavbarMenuItem,
    NavbarMenuTrigger,
    NavbarMenuContent,
    NavbarMenuLink,
  } from '@cloudvoyant/helical-svelte';
</script>

<NavbarProvider>
  <Navbar variant="scroll" density="compact">
    <NavbarMenu>
      <NavbarMenuList>
        <NavbarMenuItem value="getting-started">
          <NavbarMenuTrigger>Getting Started</NavbarMenuTrigger>
          <NavbarMenuContent>
            <NavbarMenuLink href="#">Installation</NavbarMenuLink>
            <NavbarMenuLink href="#">Components</NavbarMenuLink>
          </NavbarMenuContent>
        </NavbarMenuItem>
        <NavbarMenuItem value="docs">
          <NavbarMenuLink href="#">Docs</NavbarMenuLink>
        </NavbarMenuItem>
      </NavbarMenuList>
    </NavbarMenu>
  </Navbar>
</NavbarProvider>
