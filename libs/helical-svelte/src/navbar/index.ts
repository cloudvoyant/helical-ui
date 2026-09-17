// libs/helical-svelte/src/navbar/index.ts
// Unified export. `Navbar` parts are exported flat (NavbarProvider, Navbar,
// and the other named parts) as the only public API:
//   <NavbarProvider> <Navbar> ... </NavbarProvider>
// NavbarMenu and its parts (NavbarMenuList, NavbarMenuItem, ...) are the
// Navbar's menu — coupled to the Navbar, so they render via the provider.

import NavbarProvider from './NavbarProvider.svelte';
import Navbar from './NavbarRoot.svelte';
import NavbarActivationArea from './NavbarActivationArea.svelte';
import NavbarBrand from './NavbarBrand.svelte';
import NavbarMenu from './NavbarMenu.svelte';
import NavbarActions from './NavbarActions.svelte';
import NavbarTrigger from './NavbarTrigger.svelte';
import NavbarMobileOverlay from './NavbarMobileOverlay.svelte';
import NavbarMenuList from './NavbarMenuList.svelte';
import NavbarMenuItem from './NavbarMenuItem.svelte';
import NavbarMenuTrigger from './NavbarMenuTrigger.svelte';
import NavbarMenuContent from './NavbarMenuContent.svelte';
import NavbarMenuLink from './NavbarMenuLink.svelte';
import NavbarMobileMenu from './NavbarMobileMenu.svelte';
import NavbarMobileMenuTrigger from './NavbarMobileMenuTrigger.svelte';
import NavbarMobileMenuContent from './NavbarMobileMenuContent.svelte';
import NavbarMenuViewport from './NavbarMenuViewport.svelte';
import NavbarMenuViewportPositioner from './NavbarMenuViewportPositioner.svelte';
import NavbarMenuIndicator from './NavbarMenuIndicator.svelte';
import { getNavbarContext as useNavbar } from './NavbarContext.svelte';
import { navbarMenuTriggerStyle, type NavbarMenuDensity, type NavbarMenuVariant } from '@cloudvoyant/helical-ui';

export {
  Navbar,
  NavbarProvider,
  NavbarActivationArea,
  NavbarBrand,
  NavbarMenu,
  NavbarActions,
  NavbarTrigger,
  NavbarMobileOverlay,
  NavbarMenuList,
  NavbarMenuItem,
  NavbarMenuTrigger,
  NavbarMenuContent,
  NavbarMenuLink,
  NavbarMobileMenu,
  NavbarMobileMenuTrigger,
  NavbarMobileMenuContent,
  NavbarMenuViewport,
  NavbarMenuViewportPositioner,
  NavbarMenuIndicator,
  useNavbar,
  navbarMenuTriggerStyle,
  type NavbarMenuDensity,
  type NavbarMenuVariant,
};
