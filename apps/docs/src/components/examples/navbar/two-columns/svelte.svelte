<!-- apps/docs/src/components/examples/navbar/two-columns/svelte.svelte -->
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
    Row,
    Col,
  } from '@cloudvoyant/helical-svelte';

  const gettingStarted = [
    { title: 'Introduction', description: 'Rebuilt components with accessible markup, in React and Svelte.', href: '#' },
    { title: 'Installation', description: 'Add helical-ui to your Astro, Vite, or framework project.', href: '#' },
    { title: 'Typography', description: 'Type scale, headings, and inline text styles.', href: '#' },
    { title: 'Theming', description: 'Light and dark themes over the shadcn token model.', href: '#' },
  ];

  const resources = [
    { title: 'Why helical-ui?', description: 'Layout primitives, shared cva, and thin Ark wrappers.', href: '#' },
    { title: 'Packages', description: '@cloudvoyant/helical-ui, @cloudvoyant/helical-react, and @cloudvoyant/helical-svelte.', href: '#' },
    { title: 'Components', description: 'Every component, demoed and documented.', href: '#' },
  ];
</script>

<NavbarProvider>
  <Navbar variant="scroll">
    <NavbarMenu>
      <NavbarMenuList>
        <NavbarMenuItem value="getting-started">
          <NavbarMenuTrigger>Getting Started</NavbarMenuTrigger>
          <NavbarMenuContent>
            <Row class="w-[300px] grid grid-cols-1 gap-3 p-4 md:w-[420px] md:grid-cols-2">
              {#each gettingStarted as link (link.title)}
                <NavbarMenuLink href={link.href}>
                  <span class="text-sm font-medium leading-none">{link.title}</span>
                  <span class="mt-1 line-clamp-2 text-sm leading-snug text-muted-foreground">{link.description}</span>
                </NavbarMenuLink>
              {/each}
            </Row>
          </NavbarMenuContent>
        </NavbarMenuItem>
        <NavbarMenuItem value="resources">
          <NavbarMenuTrigger>Resources</NavbarMenuTrigger>
          <NavbarMenuContent>
            <Row class="w-[300px] grid grid-cols-1 gap-3 p-4 md:w-[520px] md:grid-cols-[0.75fr_1fr]">
              <Col class="row-span-3 justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6">
                <span class="text-base font-medium">helical-ui</span>
                <p class="mt-1 text-sm leading-tight text-muted-foreground">
                  A React + Svelte component library built on Ark UI, with a shared framework-agnostic core.
                </p>
              </Col>
              {#each resources as link (link.title)}
                <NavbarMenuLink href={link.href}>
                  <span class="text-sm font-medium leading-none">{link.title}</span>
                  <span class="mt-1 line-clamp-2 text-sm leading-snug text-muted-foreground">{link.description}</span>
                </NavbarMenuLink>
              {/each}
            </Row>
          </NavbarMenuContent>
        </NavbarMenuItem>
        <NavbarMenuItem value="docs">
          <NavbarMenuLink href="#">Documentation</NavbarMenuLink>
        </NavbarMenuItem>
      </NavbarMenuList>
    </NavbarMenu>
  </Navbar>
</NavbarProvider>
