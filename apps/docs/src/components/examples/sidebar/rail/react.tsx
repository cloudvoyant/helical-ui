// apps/docs/src/components/examples/sidebar/rail/react.tsx
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
} from '@cloudvoyant/helical-react';
import { Home, Inbox, Settings, LifeBuoy, PanelLeft } from 'lucide-react';
import { HelicalLogo } from '../../HelicalLogo';

const NAV = [
  { label: 'Home', icon: Home },
  { label: 'Inbox', icon: Inbox },
  { label: 'Settings', icon: Settings },
];

export default function ReactSidebarRail() {
  return (
    <div className="relative h-[560px] rounded-lg bg-background [transform:translateZ(0)]">
      <SidebarProvider className="h-full min-h-0">
        <Sidebar collapsible="offcanvas" className="h-full">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuLink
                href="#"
                size="lg"
                icon={
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <HelicalLogo className="size-5" />
                  </div>
                }
              >
                helical-ui
              </SidebarMenuLink>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent className="scroll-fade scroll-fade-20 no-scrollbar">
            <SidebarGroup label="Applications">
              <SidebarMenu>
                {NAV.map((item) => (
                  <SidebarMenuLink
                    key={item.label}
                    icon={<item.icon />}
                    tooltip={item.label}
                    isActive={item.label === 'Home'}
                  >
                    {item.label}
                  </SidebarMenuLink>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuLink icon={<LifeBuoy />} tooltip="Help">
                Help
              </SidebarMenuLink>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <header className="flex h-12 items-center gap-2 border-b px-4">
            <SidebarTrigger>
              <PanelLeft />
            </SidebarTrigger>
            <span className="text-sm font-medium">Rail sidebar</span>
          </header>
          <Container className="flex-1 py-6">
            <p className="text-sm text-muted-foreground">
              Hover the rail handle on the sidebar edge (or use the trigger / Cmd/Ctrl+B) to collapse and expand.
            </p>
          </Container>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
