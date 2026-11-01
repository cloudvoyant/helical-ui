// apps/docs/src/components/examples/sidebar/right-side/react.tsx
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
    <Sidebar collapsible="icon" side="right" className="h-full">
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

export default function ReactSidebarRightSide() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      <SidebarProvider className="h-screen w-full">
        <SidebarInset>
          <header className="flex h-12 items-center gap-2 border-b px-4">
            <span className="text-sm font-medium">Right-side sidebar</span>
            <SidebarTrigger className="ml-auto">
              <PanelLeft />
            </SidebarTrigger>
          </header>
          <Container className="flex-1 py-6">
            <p className="text-sm text-muted-foreground">
              This sidebar is anchored to the right edge of the content area. Click the trigger (or the rail, or press
              Cmd/Ctrl+B) to collapse it to an icon rail.
            </p>
          </Container>
        </SidebarInset>
        <AppSidebar />
      </SidebarProvider>
    </div>
  );
}
