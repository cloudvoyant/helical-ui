// apps/docs/src/components/examples/navbar/scroll/react.tsx
import {
  Navbar,
  NavbarProvider,
  NavbarBrand,
  NavbarMenu,
  NavbarActions,
  NavbarTrigger,
  NavbarMobileOverlay,
  Container,
  VStack,
  NavbarMenuList,
  NavbarMenuItem,
  NavbarMenuTrigger,
  NavbarMenuContent,
  NavbarMenuLink,
  NavbarMobileMenu,
  NavbarMobileMenuTrigger,
  NavbarMobileMenuContent,
} from '@cloudvoyant/helical-react';
import { HelicalLogo } from '../../HelicalLogo';

const CONTENT = [
  ['About', 'A brief history of helical-ui and its guiding principles.'],
  ['Installation', 'Add helical-ui to your Astro, Vite, or framework project.'],
  ['Components', 'Every component, demoed and documented for React and Svelte.'],
  ['Theming', 'Light and dark themes over the shadcn token model.'],
  ['Accessibility', "Roles, focus, and keyboard behavior come from Ark's state machine."],
  ['Roadmap', 'What is coming next — from drawers to tours.'],
];

export default function ReactNavbarScroll() {
  return (
    <div className="relative h-[420px] overflow-y-auto overscroll-y-contain rounded-md bg-background">
      <NavbarProvider>
        <Navbar variant="scroll">
          <NavbarBrand>
            <HelicalLogo className="h-7 w-auto" />
            <span className="text-sm font-semibold">helical-ui</span>
          </NavbarBrand>
          <NavbarMenu placement="center">
            <NavbarMenuList>
              <NavbarMenuItem value="docs" variant="link">
                <NavbarMenuTrigger>Docs</NavbarMenuTrigger>
                <NavbarMenuContent>
                  <NavbarMenuLink href="#">Components</NavbarMenuLink>
                  <NavbarMenuLink href="#">Theming</NavbarMenuLink>
                </NavbarMenuContent>
              </NavbarMenuItem>
              <NavbarMenuItem value="blog" variant="link">
                <NavbarMenuLink href="#">Blog</NavbarMenuLink>
              </NavbarMenuItem>
            </NavbarMenuList>
          </NavbarMenu>
          <NavbarActions>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Sign in
            </a>
          </NavbarActions>
          <NavbarTrigger />
          <NavbarMobileOverlay>
            <NavbarMobileMenu>
              <NavbarMobileMenuTrigger>Docs</NavbarMobileMenuTrigger>
              <NavbarMobileMenuContent>
                <a
                  href="#"
                  className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  Components
                </a>
                <a
                  href="#"
                  className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  Theming
                </a>
              </NavbarMobileMenuContent>
            </NavbarMobileMenu>
            <a
              href="#"
              className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              Blog
            </a>
          </NavbarMobileOverlay>
        </Navbar>
        <Container className="py-6">
          <VStack className="gap-4">
            <p className="rounded-md bg-muted/50 p-4 text-sm text-muted-foreground">
              With <code>variant="scroll"</code> the bar scrolls away with the page — no sticky, no shrink.
            </p>
            {CONTENT.map(([title, body]) => (
              <div key={title} className="rounded-md border border-border p-4">
                <p className="text-sm font-medium">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </VStack>
        </Container>
      </NavbarProvider>
    </div>
  );
}
