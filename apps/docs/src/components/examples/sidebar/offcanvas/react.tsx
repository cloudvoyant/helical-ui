// apps/docs/src/components/examples/sidebar/offcanvas/react.tsx
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuLink,
  SidebarInset,
  SidebarTrigger,
  Container,
} from '@cloudvoyant/helical-react';
import { Home, Inbox, Settings, PanelLeft } from 'lucide-react';
import { HelicalLogo } from '../../HelicalLogo';

const NAV = [
  { label: 'Home', icon: Home },
  { label: 'Inbox', icon: Inbox },
  { label: 'Settings', icon: Settings },
];

export default function ReactSidebarOffcanvas() {
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
                  <SidebarMenuLink key={item.label} icon={<item.icon />} isActive={item.label === 'Home'}>
                    {item.label}
                  </SidebarMenuLink>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-12 items-center gap-2 border-b px-4">
            <SidebarTrigger>
              <PanelLeft />
            </SidebarTrigger>
            <span className="text-sm font-medium">Offcanvas sidebar</span>
          </header>
          <Container className="flex-1 py-6">
            <p className="text-sm text-muted-foreground">
              Click the trigger (or press Cmd/Ctrl+B) to completely hide this sidebar off-screen.
            </p>
          </Container>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
