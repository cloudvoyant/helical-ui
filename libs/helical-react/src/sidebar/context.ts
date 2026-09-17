// libs/helical-react/src/sidebar/context.ts
// Source: @cloudvoyant/helical-react sidebar context (shadcn/ui sidebar, re-based on Ark UI)
/// <reference lib="dom" />
import * as React from 'react';
import type { SidebarContextProps } from '@cloudvoyant/helical-ui';

export type SidebarContextValue = SidebarContextProps;

export const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }
  return context;
}
