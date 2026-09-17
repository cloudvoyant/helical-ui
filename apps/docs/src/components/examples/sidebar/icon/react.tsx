// apps/docs/src/components/examples/sidebar/icon/react.tsx
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

function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="h-full">
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
  );
}

export default function ReactSidebarIcon() {
  return (
    <div className="relative h-[560px] rounded-lg bg-background [transform:translateZ(0)]">
      <SidebarProvider className="h-full min-h-0">
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-12 items-center gap-2 border-b px-4">
            <SidebarTrigger>
              <PanelLeft />
            </SidebarTrigger>
            <span className="text-sm font-medium">Icon rail sidebar</span>
          </header>
          <Container className="flex-1 py-6">
            <p className="text-sm text-muted-foreground">
              Click the trigger (or the rail, or press Cmd/Ctrl+B) to collapse this sidebar to an icon rail.
            </p>
          </Container>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
