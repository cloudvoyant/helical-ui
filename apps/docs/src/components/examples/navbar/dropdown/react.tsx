// apps/docs/src/components/examples/navbar/dropdown/react.tsx
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

export default function ReactNavbarMenuDropdown() {
  return (
    <NavbarProvider>
      <Navbar variant="scroll">
        <NavbarMenu>
          <NavbarMenuList>
            <NavbarMenuItem value="platform">
              <NavbarMenuTrigger>Platform</NavbarMenuTrigger>
              <NavbarMenuContent>
                <NavbarMenuLink href="#">Analytics</NavbarMenuLink>
                <NavbarMenuLink href="#">Integrations</NavbarMenuLink>
                <NavbarMenuLink href="#">Automations</NavbarMenuLink>
              </NavbarMenuContent>
            </NavbarMenuItem>
            <NavbarMenuItem value="company">
              <NavbarMenuTrigger>Company</NavbarMenuTrigger>
              <NavbarMenuContent>
                <NavbarMenuLink href="#">About</NavbarMenuLink>
                <NavbarMenuLink href="#">Careers</NavbarMenuLink>
                <NavbarMenuLink href="#">Contact</NavbarMenuLink>
              </NavbarMenuContent>
            </NavbarMenuItem>
          </NavbarMenuList>
        </NavbarMenu>
      </Navbar>
    </NavbarProvider>
  );
}
