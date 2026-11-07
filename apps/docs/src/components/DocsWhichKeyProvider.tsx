// apps/docs/src/components/DocsWhichKeyProvider.tsx
// Site-wide WhichKeyProvider + WhichKey command panel + CommandPalette / ColonCommand for the Astro docs shell.
import { useEffect, useMemo, useState } from 'react';
import { matchesCommandHotkey, type CommandStyle } from '@cloudvoyant/helical-ui';
import {
  ColonCommand,
  CommandPalette,
  Toaster,
  WhichKey,
  WhichKeyProvider,
  toast,
  useWhichKey,
  type KeymapHandler,
  type WhichKeyNode,
} from '@cloudvoyant/helical-react';
import {
  APPEARANCE_CHANGE_EVENT,
  COMMAND_STYLE_EVENT,
  OPEN_COMMAND_MENU_EVENT,
  buildDocsCommandTree,
  dispatchOpenCommandMenu,
  getStoredCommandStyle,
} from '../lib/commands';
import { FRAMEWORK_EVENT, getStoredFramework, setFramework, type Framework } from '../lib/framework';
import { getInitialColorMode, getInitialTheme, type ColorMode } from '../lib/theme';

function DocsCommandShell({
  paletteOpen,
  setPaletteOpen,
  colonOpen,
  setColonOpen,
}: {
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  colonOpen: boolean;
  setColonOpen: (open: boolean) => void;
}) {
  const { preset, setPreset, jumpAction, setJumpAction, leaderOnly, setLeaderOnly, openExplorer } = useWhichKey();
  const [theme, setThemeState] = useState<string>(() => getInitialTheme());
  const [colorMode, setColorModeState] = useState<ColorMode>(() => getInitialColorMode());
  const [framework, setFrameworkState] = useState<Framework>(() => getStoredFramework());
  const [commandStyle, setCommandStyleState] = useState<CommandStyle>(() => getStoredCommandStyle());

  useEffect(() => {
    setThemeState(getInitialTheme());
    setColorModeState(getInitialColorMode());
    setFrameworkState(getStoredFramework());
    setCommandStyleState(getStoredCommandStyle());

    const onAppearance = () => {
      setThemeState(getInitialTheme());
      setColorModeState(getInitialColorMode());
    };
    const onFramework = (e: Event) => {
      const detail = (e as CustomEvent<Framework>).detail;
      setFrameworkState(detail ?? getStoredFramework());
    };
    const onCommandStyle = (e: Event) => {
      const detail = (e as CustomEvent<CommandStyle>).detail;
      setCommandStyleState(detail ?? getStoredCommandStyle());
    };
    const onOpenMenu = (e: Event) => {
      const detail = (e as CustomEvent<{ style?: CommandStyle }>).detail;
      const targetStyle = detail?.style ?? getStoredCommandStyle();
      if (targetStyle === 'colon') {
        setPaletteOpen(false);
        setColonOpen(true);
      } else {
        setColonOpen(false);
        setPaletteOpen(true);
      }
    };

    window.addEventListener(APPEARANCE_CHANGE_EVENT, onAppearance);
    window.addEventListener(FRAMEWORK_EVENT, onFramework);
    window.addEventListener(COMMAND_STYLE_EVENT, onCommandStyle);
    window.addEventListener(OPEN_COMMAND_MENU_EVENT, onOpenMenu);
    return () => {
      window.removeEventListener(APPEARANCE_CHANGE_EVENT, onAppearance);
      window.removeEventListener(FRAMEWORK_EVENT, onFramework);
      window.removeEventListener(COMMAND_STYLE_EVENT, onCommandStyle);
      window.removeEventListener(OPEN_COMMAND_MENU_EVENT, onOpenMenu);
    };
  }, [setColonOpen, setPaletteOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (matchesCommandHotkey(event, 'Mod+k')) {
        event.preventDefault();
        event.stopPropagation();
        const style = getStoredCommandStyle();
        if (style === 'colon') {
          setPaletteOpen(false);
          setColonOpen(!colonOpen);
        } else {
          setColonOpen(false);
          setPaletteOpen(!paletteOpen);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [colonOpen, paletteOpen, setColonOpen, setPaletteOpen]);

  const commandItems = useMemo(
    () =>
      buildDocsCommandTree({
        currentTheme: theme,
        currentColorMode: colorMode,
        currentPreset: preset,
        currentJumpAction: jumpAction,
        currentLeaderOnly: leaderOnly,
        currentFramework: framework,
        currentCommandStyle: commandStyle,
        onPresetSelect: (nextPreset) => {
          setPreset(nextPreset);
        },
        onJumpActionSelect: (nextJump) => {
          setJumpAction(nextJump);
        },
        onLeaderOnlySelect: (nextLeaderOnly) => {
          setLeaderOnly(nextLeaderOnly);
        },
        onOpenExplorer: () => {
          setPaletteOpen(false);
          setColonOpen(false);
          requestAnimationFrame(() => openExplorer());
        },
        onSearchDocs: () => {
          toast.create({
            title: 'Search Docs is coming soon',
            description: 'Full-text documentation search will land in an upcoming release.',
            type: 'info',
          });
        },
      }),
    [
      theme,
      colorMode,
      preset,
      jumpAction,
      leaderOnly,
      framework,
      commandStyle,
      setPreset,
      setJumpAction,
      setLeaderOnly,
      openExplorer,
      setPaletteOpen,
      setColonOpen,
    ],
  );

  return (
    <>
      <CommandPalette
        items={commandItems}
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        onSelectCommand={(ctx) => {
          if (ctx.value !== 'search') {
            toast.create({
              title: ctx.node.label,
              type: 'success',
            });
          }
        }}
      />
      <ColonCommand
        items={commandItems}
        open={colonOpen}
        onOpenChange={setColonOpen}
        onSelectCommand={(ctx) => {
          if (ctx.value !== 'search') {
            toast.create({
              title: `Executed ${ctx.commandString}`,
              description: ctx.node.label,
              type: 'success',
            });
          }
        }}
      />
      <Toaster />
    </>
  );
}

export default function DocsWhichKeyProvider() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [colonOpen, setColonOpen] = useState(false);

  const keymap = useMemo<Record<string, WhichKeyNode>>(
    () => ({
      ':': {
        key: ':',
        label: 'Colon Command Prompt (:)',
        group: 'Commands',
        commandId: 'docs.openColonCommand',
      },
      Space: {
        key: 'Space',
        label: 'Leader',
        group: 'Leader',
        children: {
          f: {
            key: 'f',
            label: 'Toggle Framework (React/Svelte)',
            group: 'Docs',
            commandId: 'docs.toggleFramework',
          },
          ':': {
            key: ':',
            label: 'Open Command Menu',
            group: 'Commands',
            commandId: 'docs.openPreferredCommandMenu',
          },
        },
      },
    }),
    [],
  );

  const commands = useMemo<Record<string, KeymapHandler>>(
    () => ({
      'docs.toggleFramework': () => {
        const current = getStoredFramework();
        setFramework(current === 'react' ? 'svelte' : 'react');
      },
      'docs.openColonCommand': () => {
        setPaletteOpen(false);
        setColonOpen(true);
      },
      'docs.openPreferredCommandMenu': () => {
        dispatchOpenCommandMenu();
      },
    }),
    [],
  );

  return (
    <WhichKeyProvider scoped={false} storageKey="vortex" keymap={keymap} commands={commands}>
      <WhichKey />
      <DocsCommandShell
        paletteOpen={paletteOpen}
        setPaletteOpen={setPaletteOpen}
        colonOpen={colonOpen}
        setColonOpen={setColonOpen}
      />
    </WhichKeyProvider>
  );
}
