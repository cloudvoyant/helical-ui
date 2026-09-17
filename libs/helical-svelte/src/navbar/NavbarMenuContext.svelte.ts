// libs/helical-svelte/src/navbar/NavbarMenuContext.svelte.ts
// Shared Svelte context for the NavbarMenu style (density from the root, variant
// from the item). NavbarMenuTrigger/NavbarMenuLink read it to resolve their cva
// directly; NavbarMenuContent overrides it (relaxed/default + inContent) so
// dropdown panel links use the plain link style and never inherit the
// top-level density/variant.
import { getContext, setContext } from 'svelte';
import type { NavbarMenuDensity, NavbarMenuVariant } from '@cloudvoyant/helical-ui';

export interface NavbarMenuStyle {
  density: NavbarMenuDensity;
  variant: NavbarMenuVariant;
  inContent: boolean;
}

const NAVBAR_MENU_STYLE_KEY = Symbol('helical-ui.navbar-menu.style');

export function setNavbarMenuStyle(style: NavbarMenuStyle) {
  setContext(NAVBAR_MENU_STYLE_KEY, style);
}

export function getNavbarMenuStyle(): NavbarMenuStyle {
  return (
    getContext<NavbarMenuStyle>(NAVBAR_MENU_STYLE_KEY) ?? { density: 'relaxed', variant: 'default', inContent: false }
  );
}
