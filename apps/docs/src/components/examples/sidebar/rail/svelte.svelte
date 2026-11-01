<!-- apps/docs/src/components/examples/sidebar/rail/svelte.svelte -->
<script lang="ts">
  import {
    SidebarProvider,
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuLink,
    SidebarRail,
    SidebarInset,
    SidebarTrigger,
    Container,
  } from '@cloudvoyant/helical-svelte';
  import { House as Home, Inbox, Settings, LifeBuoy } from 'lucide-svelte';
  import HelicalLogo from '../../HelicalLogo.svelte';

  const NAV = [
    { label: 'Home', icon: Home },
    { label: 'Inbox', icon: Inbox },
    { label: 'Settings', icon: Settings },
  ];
</script>

{#snippet logoIcon()}
  <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
    <HelicalLogo class="size-5" />
  </div>
{/snippet}
{#snippet helpIcon()}
  <LifeBuoy />
{/snippet}

<div class="relative h-screen w-full overflow-hidden bg-background">
  <SidebarProvider class="h-screen w-full">
    <Sidebar collapsible="offcanvas" class="h-full">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuLink href="#" size="lg" icon={logoIcon}>
            helical-ui
          </SidebarMenuLink>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent class="scroll-fade scroll-fade-20 no-scrollbar">
        <SidebarGroup label="Applications">
          <SidebarMenu>
            {#each NAV as item (item.label)}
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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuLink icon={helpIcon} tooltip="Help">
            Help
          </SidebarMenuLink>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>

    <SidebarInset>
      <header class="flex h-12 items-center gap-2 border-b px-4">
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
        <span class="text-sm font-medium">Rail sidebar</span>
      </header>
      <Container class="flex-1 py-6">
        <p class="text-sm text-muted-foreground">
          Hover the rail handle on the sidebar edge (or use the trigger / Cmd/Ctrl+B) to collapse and expand.
        </p>
      </Container>
    </SidebarInset>
  </SidebarProvider>
</div>
