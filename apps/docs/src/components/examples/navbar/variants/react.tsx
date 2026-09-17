// apps/docs/src/components/examples/navbar/variants/react.tsx
import {
  Navbar,
  NavbarProvider,
  NavbarMenu,
  NavbarMenuList,
  NavbarMenuItem,
  NavbarMenuTrigger,
  NavbarMenuContent,
  NavbarMenuLink,
} from '@cloudvoyant/helical-react';

export default function ReactNavbarMenuVariants() {
  return (
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
              {/* asChild lets the trigger render as a real link instead of a button. */}
              <NavbarMenuTrigger asChild>
                <a href="#">Blog</a>
              </NavbarMenuTrigger>
              <NavbarMenuContent>
                <NavbarMenuLink href="#">Articles</NavbarMenuLink>
                <NavbarMenuLink href="#">Tutorials</NavbarMenuLink>
              </NavbarMenuContent>
            </NavbarMenuItem>
            <NavbarMenuItem variant="link" value="docs">
              <NavbarMenuLink href="#">Docs</NavbarMenuLink>
            </NavbarMenuItem>
          </NavbarMenuList>
        </NavbarMenu>
      </Navbar>
    </NavbarProvider>
  );
}
