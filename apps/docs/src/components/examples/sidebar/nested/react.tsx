// apps/docs/src/components/examples/sidebar/nested/react.tsx
import { useState } from 'react';
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
} from '@cloudvoyant/helical-react';
import { Home, Inbox, Settings, Bell, MessageSquare, HelpCircle, PanelLeft, PanelRight } from 'lucide-react';
import { HelicalLogo } from '../../HelicalLogo';

const LEFT_NAV = [
  { label: 'Home', icon: Home },
  { label: 'Inbox', icon: Inbox },
  { label: 'Settings', icon: Settings },
];

const RIGHT_NAV = [
  { label: 'Notifications', icon: Bell },
  { label: 'Messages', icon: MessageSquare },
  { label: 'Help', icon: HelpCircle },
];

// Matches SidebarTrigger's sizing so both header buttons render 16px icons.
const triggerClass =
  'flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground ring-ring outline-hidden transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0';

export default function ReactSidebarNested() {
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(true);

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-background">
      {/* Left sidebar: full viewport height; the topnav lives inside the inset, so
          it slides right as the left sidebar opens. */}
      <SidebarProvider open={leftOpen} onOpenChange={setLeftOpen} className="h-full min-h-0 w-full">
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
            <SidebarGroup label="Navigation">
              <SidebarMenu>
                {LEFT_NAV.map((item) => (
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
          <SidebarRail />
        </Sidebar>

        <SidebarInset className="flex min-h-0 flex-1 flex-col">
          <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger>
              <PanelLeft />
            </SidebarTrigger>
            <span className="text-sm font-medium">Nested sidebars</span>
            <button
              type="button"
              onClick={() => setRightOpen((o) => !o)}
              aria-label="Toggle right sidebar"
              className={`${triggerClass} ml-auto`}
            >
              <PanelRight />
            </button>
          </header>

          <div className="flex min-h-0 flex-1">
            <Container className="flex-1 py-6">
              <p className="text-sm text-muted-foreground">
                The left sidebar spans the full viewport height and pushes the top bar right when it opens. The right
                sidebar stays in the area under the top bar, and on small screens it becomes a half-height widget drawer
                without a backdrop.
              </p>
            </Container>

            <SidebarProvider open={rightOpen} onOpenChange={setRightOpen} className="h-full min-h-0 w-auto">
              <Sidebar collapsible="offcanvas" side="right" className="top-12 bottom-0 h-auto">
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
                  <SidebarGroup label="Communication">
                    <SidebarMenu>
                      {RIGHT_NAV.map((item) => (
                        <SidebarMenuLink key={item.label} icon={<item.icon />} tooltip={item.label}>
                          {item.label}
                        </SidebarMenuLink>
                      ))}
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
  );
}
