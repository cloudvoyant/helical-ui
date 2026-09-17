<!-- apps/docs/src/components/examples/sidebar/icon/svelte.svelte -->
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

<div class="relative h-[560px] rounded-lg bg-background [transform:translateZ(0)]">
  <SidebarProvider class="h-full min-h-0">
    <Sidebar collapsible="icon" class="h-full">
      <SidebarHeader>
        <SidebarMenu>
          {#snippet logoIcon()}
            <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <HelicalLogo class="size-5" />
            </div>
          {/snippet}
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
          {#snippet helpIcon()}
            <LifeBuoy />
          {/snippet}
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
        <span class="text-sm font-medium">Icon rail sidebar</span>
      </header>
      <Container class="flex-1 py-6">
        <p class="text-sm text-muted-foreground">
          Click the trigger (or the rail, or press Cmd/Ctrl+B) to collapse this sidebar to an icon rail.
        </p>
      </Container>
    </SidebarInset>
  </SidebarProvider>
</div>
