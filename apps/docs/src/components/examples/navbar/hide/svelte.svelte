<!-- apps/docs/src/components/examples/navbar/hide/svelte.svelte -->
<script lang="ts">
  import {
    Navbar,
    NavbarProvider,
    NavbarActivationArea,
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
  } from '@cloudvoyant/helical-svelte';
  import HelicalLogo from '../../HelicalLogo.svelte';

  const CONTENT: [string, string][] = [
    ['About', 'A brief history of helical-ui and its guiding principles.'],
    ['Installation', 'Add helical-ui to your Astro, Vite, or framework project.'],
    ['Components', 'Every component, demoed and documented for React and Svelte.'],
    ['Theming', 'Light and dark themes over the shadcn token model.'],
    ['Accessibility', "Roles, focus, and keyboard behavior come from Ark's state machine."],
    ['Roadmap', 'What is coming next — from drawers to tours.'],
  ];
</script>

<div class="relative h-[420px] overflow-y-auto overscroll-y-contain rounded-md bg-background">
  <NavbarProvider>
    <NavbarActivationArea class="sticky top-0 -mb-12" />
    <Navbar variant="hide">
        <NavbarBrand>
          <HelicalLogo class="h-7 w-auto" /><span class="text-sm font-semibold">helical-ui</span>
        </NavbarBrand>
        <NavbarMenu placement="center">
          <NavbarMenuList>
            <NavbarMenuItem value="docs" variant="link">
              <NavbarMenuTrigger>Docs</NavbarMenuTrigger>
              <NavbarMenuContent>
                <NavbarMenuLink href="#components">Components</NavbarMenuLink>
                <NavbarMenuLink href="#theming">Theming</NavbarMenuLink>
              </NavbarMenuContent>
            </NavbarMenuItem>
            <NavbarMenuItem value="blog" variant="link">
              <NavbarMenuLink href="#blog">Blog</NavbarMenuLink>
            </NavbarMenuItem>
          </NavbarMenuList>
        </NavbarMenu>
        <NavbarActions>
          <a href="#sign-in" class="text-sm font-medium text-muted-foreground hover:text-foreground">Sign in</a>
        </NavbarActions>
        <NavbarTrigger />
      <NavbarMobileOverlay>
        <NavbarMobileMenu>
          <NavbarMobileMenuTrigger>Docs</NavbarMobileMenuTrigger>
          <NavbarMobileMenuContent>
            <a href="#components" class="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground">Components</a>
            <a href="#theming" class="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground">Theming</a>
          </NavbarMobileMenuContent>
        </NavbarMobileMenu>
        <a href="#blog" class="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground">Blog</a>
      </NavbarMobileOverlay>
    </Navbar>
    <Container class="py-6">
      <VStack class="gap-4">
        <p class="rounded-md bg-muted/50 p-4 text-sm text-muted-foreground">
          With <code>variant="hide"</code> the bar slides away once you scroll past it — hover the top strip
          (or the bar) to bring it back.
        </p>
        {#each CONTENT as [title, body] (title)}
          <div class="rounded-md border border-border p-4">
            <p class="text-sm font-medium">{title}</p>
            <p class="mt-1 text-sm text-muted-foreground">{body}</p>
          </div>
        {/each}
      </VStack>
    </Container>
  </NavbarProvider>
</div>
