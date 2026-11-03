// apps/docs/src/components/TopNav.tsx
// The docs site top navigation, built from the helical-ui Navbar (shrink variant).
import { useEffect, useState } from 'react';
import { type CommandStyle } from '@cloudvoyant/helical-ui';
import {
  Navbar,
  NavbarProvider,
  NavbarBrand,
  NavbarMenu,
  NavbarActions,
  NavbarTrigger,
  NavbarMobileOverlay,
  NavbarMenuList,
  NavbarMenuItem,
  NavbarMenuLink,
  Kbd,
  useWhichKey,
} from '@cloudvoyant/helical-react';
import { COMMAND_STYLE_EVENT, dispatchOpenCommandMenu, getStoredCommandStyle } from '../lib/commands';
import { HelicalLogo } from './examples/HelicalLogo';
import ThemeSelector from './ThemeSelector';
import FrameworkSelector from './FrameworkSelector';

interface NavItem {
  title: string;
  href: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

interface Props {
  currentPath?: string;
  groups?: NavGroup[];
}

const links = [
  { href: `${import.meta.env.BASE_URL}`, label: 'Home' },
  { href: `${import.meta.env.BASE_URL}general/introduction`, label: 'Docs' },
  { href: `${import.meta.env.BASE_URL}components/button`, label: 'Components' },
];

export default function TopNav({ currentPath = import.meta.env.BASE_URL, groups = [] }: Props) {
  const { openExplorer } = useWhichKey();
  const [commandStyle, setCommandStyleState] = useState<CommandStyle>(() => getStoredCommandStyle());

  useEffect(() => {
    setCommandStyleState(getStoredCommandStyle());
    const onStyleChange = (e: Event) => {
      const detail = (e as CustomEvent<CommandStyle>).detail;
      if (detail === 'palette' || detail === 'colon') {
        setCommandStyleState(detail);
      } else {
        setCommandStyleState(getStoredCommandStyle());
      }
    };
    window.addEventListener(COMMAND_STYLE_EVENT, onStyleChange);
    return () => window.removeEventListener(COMMAND_STYLE_EVENT, onStyleChange);
  }, []);

  return (
    <NavbarProvider>
      <Navbar
        variant="shrink"
        className="border-transparent bg-background/60 backdrop-blur-xl transition-[height,background-color,box-shadow,border-color] duration-300 data-[scrolled=true]:border-border data-[scrolled=true]:bg-background/75"
      >
        <NavbarBrand className="text-primary">
          <HelicalLogo className="h-7 w-auto" />
          <span className="font-brand text-sm font-semibold">helical-ui</span>
        </NavbarBrand>
        <NavbarMenu placement="center">
          <NavbarMenuList>
            {links.map((link) => (
              <NavbarMenuItem variant="link" value={link.href} key={link.href}>
                <NavbarMenuLink
                  href={link.href}
                  current={currentPath === link.href}
                  className={currentPath === link.href ? 'text-primary' : ''}
                >
                  {link.label}
                </NavbarMenuLink>
              </NavbarMenuItem>
            ))}
          </NavbarMenuList>
        </NavbarMenu>
        <NavbarActions>
          <FrameworkSelector />
          <div className="flex-1" />
          <button
            type="button"
            aria-label={commandStyle === 'colon' ? 'Open colon command menu (:)' : 'Open command palette (⌘K)'}
            title={commandStyle === 'colon' ? 'Open colon command menu (:)' : 'Open command palette (⌘K)'}
            data-command-trigger
            data-command-style={commandStyle}
            onClick={() => dispatchOpenCommandMenu(commandStyle)}
            className="hidden h-8 items-center justify-center gap-1.5 rounded-md border border-border bg-background/80 px-2 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:inline-flex"
          >
            <span className="hidden lg:inline">Commands</span>
            <Kbd size="sm" variant="subtle">
              {commandStyle === 'colon' ? ':' : '⌘K'}
            </Kbd>
          </button>
          <button
            type="button"
            aria-label="Explore keybindings"
            title="Explore keybindings (?)"
            data-keybinding-explorer-trigger
            onClick={openExplorer}
            className="hidden h-8 items-center justify-center rounded-md border border-border bg-background/80 px-2 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:inline-flex"
          >
            <Kbd size="sm" variant="subtle">
              ?
            </Kbd>
          </button>
          <ThemeSelector />
          <a
            href="https://github.com/cloudvoyant/helical-ui"
            aria-label="GitHub"
            className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>
        </NavbarActions>
        <NavbarTrigger />
        <NavbarMobileOverlay>
          {groups.map((group, i) => (
            <section key={group.label} className={i === 0 ? '' : 'mt-4 border-t border-border pt-3'}>
              <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
              {group.items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                    currentPath === item.href
                      ? 'bg-accent font-medium text-primary'
                      : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
                  }`}
                >
                  {item.title}
                </a>
              ))}
            </section>
          ))}
        </NavbarMobileOverlay>
      </Navbar>
    </NavbarProvider>
  );
}
