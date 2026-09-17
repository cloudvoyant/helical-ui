// libs/helical-svelte/src/sidebar/index.ts
// Unified export. `Sidebar` parts are exported flat (SidebarProvider,
// Sidebar, SidebarHeader, and the other named parts) as the only public API:
//   <SidebarProvider> <Sidebar> <SidebarHeader> </SidebarProvider>

import Provider from './Provider.svelte';
import Root from './Root.svelte';
import Header from './Header.svelte';
import Footer from './Footer.svelte';
import Separator from './Separator.svelte';
import Content from './Content.svelte';
import Group from './Group.svelte';
import GroupAction from './GroupAction.svelte';
import Menu from './Menu.svelte';
import MenuItem from './MenuItem.svelte';
import MenuButton from './MenuButton.svelte';
import MenuLink from './MenuLink.svelte';
import MenuAction from './MenuAction.svelte';
import MenuBadge from './MenuBadge.svelte';
import MenuSkeleton from './MenuSkeleton.svelte';
import MenuSub from './MenuSub.svelte';
import MenuSubItem from './MenuSubItem.svelte';
import MenuSubButton from './MenuSubButton.svelte';
import Trigger from './Trigger.svelte';
import Rail from './Rail.svelte';
import Inset from './Inset.svelte';
import Input from './Input.svelte';
import { getSidebarContext as useSidebar } from './context.svelte';

export {
  Provider as SidebarProvider,
  Root as Sidebar,
  Header as SidebarHeader,
  Footer as SidebarFooter,
  Separator as SidebarSeparator,
  Content as SidebarContent,
  Group as SidebarGroup,
  GroupAction as SidebarGroupAction,
  Menu as SidebarMenu,
  MenuItem as SidebarMenuItem,
  MenuButton as SidebarMenuButton,
  MenuLink as SidebarMenuLink,
  MenuAction as SidebarMenuAction,
  MenuBadge as SidebarMenuBadge,
  MenuSkeleton as SidebarMenuSkeleton,
  MenuSub as SidebarMenuSub,
  MenuSubItem as SidebarMenuSubItem,
  MenuSubButton as SidebarMenuSubButton,
  Trigger as SidebarTrigger,
  Rail as SidebarRail,
  Inset as SidebarInset,
  Input as SidebarInput,
  useSidebar,
};
