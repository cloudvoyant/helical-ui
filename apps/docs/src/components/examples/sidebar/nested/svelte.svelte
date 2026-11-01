<!-- apps/docs/src/components/examples/sidebar/nested/svelte.svelte -->
<script lang="ts">
  import {
    SidebarProvider,
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuLink,
    SidebarRail,
    SidebarInset,
    SidebarTrigger,
    Container,
  } from '@cloudvoyant/helical-svelte';
  import { House as Home, Inbox, Settings, Bell, MessageSquare, CircleHelp } from 'lucide-svelte';
  import HelicalLogo from '../../HelicalLogo.svelte';

  const LEFT_NAV = [
    { label: 'Home', icon: Home },
    { label: 'Inbox', icon: Inbox },
    { label: 'Settings', icon: Settings },
  ];

  const RIGHT_NAV = [
    { label: 'Notifications', icon: Bell },
    { label: 'Messages', icon: MessageSquare },
    { label: 'Help', icon: CircleHelp },
  ];

  const triggerClass =
    'flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground ring-ring outline-hidden transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2';

  let leftOpen = $state(false);
  let rightOpen = $state(true);
</script>

{#snippet logoIcon()}
  <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
    <HelicalLogo class="size-5" />
  </div>
{/snippet}

<div class="relative flex h-screen w-full overflow-hidden bg-background">
  <SidebarProvider open={leftOpen} onOpenChange={(open) => (leftOpen = open)} class="h-full min-h-0 w-full">
    <Sidebar collapsible="icon" class="h-full">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuLink href="#" size="lg" icon={logoIcon}>
            helical-ui
          </SidebarMenuLink>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent class="scroll-fade scroll-fade-20 no-scrollbar">
        <SidebarGroup label="Navigation">
          <SidebarMenu>
            {#each LEFT_NAV as item (item.label)}
              {#snippet itemIcon()}
                <item.icon />
              {/snippet}
              <SidebarMenuLink icon={itemIcon} tooltip={item.label} isActive={item.label === 'Home'}>
                {item.label}
              </SidebarMenuLink>
            {/each}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>

    <SidebarInset class="flex min-h-0 flex-1 flex-col">
      <header class="flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M15 3v18" /></svg
          >
        </SidebarTrigger>
        <span class="text-sm font-medium">Nested sidebars</span>
        <button
          type="button"
          aria-label="Toggle right sidebar"
          class="ml-auto {triggerClass}"
          onclick={() => (rightOpen = !rightOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18" /></svg
          >
        </button>
      </header>

      <div class="flex min-h-0 flex-1">
        <Container class="flex-1 py-6">
          <p class="text-sm text-muted-foreground">
            The left sidebar spans the full viewport height and pushes the top bar right when it opens. The right
            sidebar stays in the area under the top bar, and on small screens it becomes a half-height widget drawer
            without a backdrop.
          </p>
        </Container>

        <SidebarProvider open={rightOpen} onOpenChange={(open) => (rightOpen = open)} class="h-full min-h-0 w-auto">
          <Sidebar collapsible="offcanvas" side="right" class="top-12 bottom-0 h-auto">
            <SidebarHeader>
              <SidebarMenu>
                <SidebarMenuLink href="#" size="lg" icon={logoIcon}>
                  helical-ui
                </SidebarMenuLink>
              </SidebarMenu>
            </SidebarHeader>
            <SidebarContent class="scroll-fade scroll-fade-20 no-scrollbar">
              <SidebarGroup label="Communication">
                <SidebarMenu>
                  {#each RIGHT_NAV as item (item.label)}
                    {#snippet itemIcon()}
                      <item.icon />
                    {/snippet}
                    <SidebarMenuLink icon={itemIcon} tooltip={item.label}>
                      {item.label}
                    </SidebarMenuLink>
                  {/each}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
          </Sidebar>
        </SidebarProvider>
      </div>
    </SidebarInset>
  </SidebarProvider>
</div>
