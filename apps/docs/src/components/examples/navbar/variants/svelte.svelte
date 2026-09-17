<!-- apps/docs/src/components/examples/navbar/variants/svelte.svelte -->
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
  <Navbar variant="scroll">
    <NavbarMenu>
      <NavbarMenuList>
        <NavbarMenuItem variant="link" value="getting-started">
          <NavbarMenuTrigger>Getting Started</NavbarMenuTrigger>
          <NavbarMenuContent>
            <NavbarMenuLink href="#">Installation</NavbarMenuLink>
            <NavbarMenuLink href="#">Components</NavbarMenuLink>
          </NavbarMenuContent>
        </NavbarMenuItem>
        <NavbarMenuItem variant="link" value="blog">
          <NavbarMenuLink href="#">Blog</NavbarMenuLink>
        </NavbarMenuItem>
        <NavbarMenuItem variant="link" value="docs">
          <NavbarMenuLink href="#">Docs</NavbarMenuLink>
        </NavbarMenuItem>
      </NavbarMenuList>
    </NavbarMenu>
  </Navbar>
</NavbarProvider>
