// apps/docs/src/lib/nav.ts
// Shared docs navigation groups. Consumed by both the Shell layout (TopNav
// mobile menu) and the Sidebar (left docs nav) so the ordering never drifts.
export interface NavGroup {
  label: string;
  section: 'general' | 'components';
  group: string;
}

export const NAV_GROUPS: NavGroup[] = [
  { label: 'General', section: 'general', group: '' },
  { label: 'Layouts', section: 'components', group: 'layouts' },
  { label: 'Navigation', section: 'components', group: 'navigation' },
  { label: 'Buttons', section: 'components', group: 'buttons' },
  { label: 'Keybindings', section: 'components', group: 'keyboard' },
  { label: 'Misc', section: 'components', group: 'misc' },
  { label: 'Forms', section: 'components', group: 'forms' },
  { label: 'Overlays', section: 'components', group: 'overlays' },
  { label: 'Rich Text', section: 'components', group: 'rich-text' },
];
