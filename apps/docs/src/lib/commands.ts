// apps/docs/src/lib/commands.ts
import {
  THEMES,
  getDocumentWhichKeyController,
  subscribeDocumentWhichKeyController,
  type CommandNode,
  type CommandStyle,
  type JumpAction,
  type KeybindingPreset,
} from '@cloudvoyant/helical-ui';
import { FRAMEWORK_EVENT, getStoredFramework, setFramework, type Framework } from './framework';
import { applyColorMode, applyTheme, getInitialColorMode, getInitialTheme, type ColorMode } from './theme';

export const COMMAND_STYLE_KEY = 'vortex:command-style' as const;
export const COMMAND_STYLE_EVENT = 'vortex:command-style' as const;
export const OPEN_COMMAND_MENU_EVENT = 'vortex:open-command-menu' as const;
export const OPEN_SETTINGS_MODAL_EVENT = 'vortex:open-settings-modal' as const;
export const APPEARANCE_CHANGE_EVENT = 'vortex:appearance-change' as const;

export const GITHUB_REPO_URL = 'https://github.com/cloudvoyant/helical-ui';

export function getStoredCommandStyle(): CommandStyle {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return 'palette';
  }
  try {
    const saved = localStorage.getItem(COMMAND_STYLE_KEY);
    if (saved === 'colon' || saved === 'palette') {
      return saved;
    }
  } catch {
    // Ignore storage errors
  }
  return 'palette';
}

export function setCommandStyle(style: CommandStyle): CommandStyle {
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.commandStyle = style;
  }
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(COMMAND_STYLE_KEY, style);
    } catch {
      // Ignore storage errors
    }
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(COMMAND_STYLE_EVENT, { detail: style }));
  }
  return style;
}

export function dispatchOpenCommandMenu(style?: CommandStyle): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent(OPEN_COMMAND_MENU_EVENT, {
      detail: { style: style ?? getStoredCommandStyle() },
    }),
  );
}

export function dispatchOpenSettingsModal(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(OPEN_SETTINGS_MODAL_EVENT));
}

export function notifyAppearanceChange(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(APPEARANCE_CHANGE_EVENT));
}

export function subscribeDocsCommandState(onChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  let unsubController: (() => void) | null = null;
  const syncControllerSub = () => {
    unsubController?.();
    const ctrl = getDocumentWhichKeyController();
    unsubController = ctrl ? ctrl.subscribe(() => onChange()) : null;
  };
  syncControllerSub();
  const unsubRoot = subscribeDocumentWhichKeyController(document, () => {
    syncControllerSub();
    onChange();
  });
  window.addEventListener(APPEARANCE_CHANGE_EVENT, onChange);
  window.addEventListener(FRAMEWORK_EVENT, onChange);
  window.addEventListener(COMMAND_STYLE_EVENT, onChange);
  return () => {
    unsubController?.();
    unsubRoot();
    window.removeEventListener(APPEARANCE_CHANGE_EVENT, onChange);
    window.removeEventListener(FRAMEWORK_EVENT, onChange);
    window.removeEventListener(COMMAND_STYLE_EVENT, onChange);
  };
}

export interface DocsCommandTreeOptions {
  currentTheme?: string;
  currentColorMode?: ColorMode;
  currentPreset?: KeybindingPreset;
  currentJumpAction?: JumpAction;
  currentLeaderOnly?: boolean;
  currentFramework?: Framework;
  currentCommandStyle?: CommandStyle;
  onThemeSelect?: (theme: string) => void;
  onColorModeSelect?: (mode: ColorMode) => void;
  onPresetSelect?: (preset: KeybindingPreset) => void;
  onJumpActionSelect?: (action: JumpAction) => void;
  onLeaderOnlySelect?: (leaderOnly: boolean) => void;
  onFrameworkSelect?: (framework: Framework) => void;
  onCommandStyleSelect?: (style: CommandStyle) => void;
  onOpenExplorer?: () => void;
  onOpenSettings?: () => void;
  onOpenGitHub?: () => void;
  onSearchDocs?: () => void;
}

export function buildDocsCommandTree(options: DocsCommandTreeOptions = {}): CommandNode[] {
  const rootController = typeof document !== 'undefined' ? getDocumentWhichKeyController(document) : null;
  const rootState = rootController?.getState();
  const activeTheme = options.currentTheme ?? getInitialTheme();
  const activeMode = options.currentColorMode ?? getInitialColorMode();
  const activePreset = options.currentPreset ?? rootState?.preset ?? 'helix';
  const activeJump = options.currentJumpAction ?? rootState?.jumpAction ?? 'activate';
  const activeLeaderOnly = options.currentLeaderOnly ?? rootState?.leaderOnly ?? false;
  const activeFramework = options.currentFramework ?? getStoredFramework();
  const activeCommandStyle = options.currentCommandStyle ?? getStoredCommandStyle();

  const selectTheme = (themeName: string) => {
    applyTheme(themeName);
    notifyAppearanceChange();
    options.onThemeSelect?.(themeName);
  };

  const selectColorMode = (mode: ColorMode) => {
    applyColorMode(mode);
    notifyAppearanceChange();
    options.onColorModeSelect?.(mode);
  };

  const selectPreset = (preset: KeybindingPreset) => {
    getDocumentWhichKeyController()?.setPreset(preset);
    notifyAppearanceChange();
    options.onPresetSelect?.(preset);
  };

  const selectJumpAction = (action: JumpAction) => {
    getDocumentWhichKeyController()?.setJumpAction(action);
    notifyAppearanceChange();
    options.onJumpActionSelect?.(action);
  };

  const selectLeaderOnly = (leaderOnly: boolean) => {
    getDocumentWhichKeyController()?.setLeaderOnly(leaderOnly);
    notifyAppearanceChange();
    options.onLeaderOnlySelect?.(leaderOnly);
  };

  const selectFramework = (fw: Framework) => {
    setFramework(fw);
    notifyAppearanceChange();
    options.onFrameworkSelect?.(fw);
  };

  const selectCommandStyle = (style: CommandStyle) => {
    setCommandStyle(style);
    notifyAppearanceChange();
    options.onCommandStyleSelect?.(style);
  };

  return [
    {
      value: 'search',
      label: 'Search Docs',
      group: 'Navigation',
      command: 'search',
      aliases: ['find', 's'],
      badge: 'Future',
      shortcut: '/',
      keywords: ['documentation', 'query', 'future'],
      onSelect: () => {
        options.onSearchDocs?.();
      },
    },
    {
      value: 'github',
      label: 'View GitHub',
      group: 'Navigation',
      command: 'github',
      aliases: ['gh', 'repo'],
      keywords: ['repository', 'source', 'code'],
      onSelect: () => {
        if (options.onOpenGitHub) {
          options.onOpenGitHub();
        } else if (typeof window !== 'undefined') {
          window.open(GITHUB_REPO_URL, '_blank', 'noopener,noreferrer');
        }
      },
    },
    {
      value: 'theme',
      label: 'Change Theme',
      group: 'Appearance',
      command: 'theme',
      aliases: ['t', 'colorscheme'],
      keywords: ['color', 'palette', 'swatch', 'style'],
      children: THEMES.map((t) => ({
        value: t.name,
        label: t.label,
        group: 'Themes',
        command: t.name,
        active: activeTheme === t.name,
        keywords: ['theme', t.name, t.label],
        onSelect: () => selectTheme(t.name),
      })),
    },
    {
      value: 'mode',
      label: 'Change Light/Dark Mode',
      group: 'Appearance',
      command: 'mode',
      aliases: ['m', 'color-mode'],
      keywords: ['light', 'dark', 'system', 'appearance'],
      children: [
        {
          value: 'light',
          label: 'Light',
          group: 'Color Mode',
          command: 'light',
          active: activeMode === 'light',
          onSelect: () => selectColorMode('light'),
        },
        {
          value: 'dark',
          label: 'Dark',
          group: 'Color Mode',
          command: 'dark',
          active: activeMode === 'dark',
          onSelect: () => selectColorMode('dark'),
        },
        {
          value: 'system',
          label: 'System',
          group: 'Color Mode',
          command: 'system',
          active: activeMode === 'system',
          onSelect: () => selectColorMode('system'),
        },
      ],
    },
    {
      value: 'keybind',
      label: 'Change Keybind Style',
      group: 'Preferences',
      command: 'keybind',
      aliases: ['k', 'preset', 'keymap'],
      keywords: ['helix', 'vim', 'kakoune', 'modal', 'keybindings'],
      children: [
        {
          value: 'helix',
          label: 'Helix',
          group: 'Keybind Style',
          command: 'helix',
          aliases: ['hx'],
          active: activePreset === 'helix',
          onSelect: () => selectPreset('helix'),
        },
        {
          value: 'vim',
          label: 'Vim',
          group: 'Keybind Style',
          command: 'vim',
          active: activePreset === 'vim',
          onSelect: () => selectPreset('vim'),
        },
        {
          value: 'kakoune',
          label: 'Kakoune',
          group: 'Keybind Style',
          command: 'kakoune',
          aliases: ['kak'],
          active: activePreset === 'kakoune',
          onSelect: () => selectPreset('kakoune'),
        },
      ],
    },
    {
      value: 'framework',
      label: 'Change Framework',
      group: 'Preferences',
      command: 'framework',
      aliases: ['fw'],
      shortcut: 'Space f',
      keywords: ['react', 'svelte', 'demos'],
      children: [
        {
          value: 'react',
          label: 'React',
          group: 'Framework',
          command: 'react',
          active: activeFramework === 'react',
          onSelect: () => selectFramework('react'),
        },
        {
          value: 'svelte',
          label: 'Svelte',
          group: 'Framework',
          command: 'svelte',
          active: activeFramework === 'svelte',
          onSelect: () => selectFramework('svelte'),
        },
      ],
    },
    {
      value: 'command-style',
      label: 'Change Command Style',
      group: 'Preferences',
      command: 'command-style',
      aliases: ['cmd'],
      keywords: ['palette', 'colon', 'menu', 'cmdk'],
      children: [
        {
          value: 'palette',
          label: 'Palette (⌘K)',
          group: 'Command Style',
          command: 'palette',
          active: activeCommandStyle === 'palette',
          onSelect: () => selectCommandStyle('palette'),
        },
        {
          value: 'colon',
          label: 'Colon (:)',
          group: 'Command Style',
          command: 'colon',
          active: activeCommandStyle === 'colon',
          onSelect: () => selectCommandStyle('colon'),
        },
      ],
    },
    {
      value: 'jump',
      label: 'Change Jump Behavior',
      group: 'Preferences',
      command: 'jump',
      aliases: ['gw'],
      keywords: ['click', 'focus', 'activate', 'labels'],
      children: [
        {
          value: 'activate',
          label: 'Click',
          group: 'Jump Behavior',
          command: 'activate',
          aliases: ['click'],
          active: activeJump === 'activate',
          onSelect: () => selectJumpAction('activate'),
        },
        {
          value: 'focus',
          label: 'Focus',
          group: 'Jump Behavior',
          command: 'focus',
          active: activeJump === 'focus',
          onSelect: () => selectJumpAction('focus'),
        },
      ],
    },
    {
      value: 'which-key',
      label: 'Change WhichKey Popup',
      group: 'Preferences',
      command: 'which-key',
      aliases: ['wk'],
      keywords: ['leader', 'prefixes', 'popup', 'chords'],
      children: [
        {
          value: 'all',
          label: 'All Prefixes',
          group: 'WhichKey Popup',
          command: 'all',
          active: !activeLeaderOnly,
          onSelect: () => selectLeaderOnly(false),
        },
        {
          value: 'leader',
          label: 'Leader Only',
          group: 'WhichKey Popup',
          command: 'leader',
          active: activeLeaderOnly,
          onSelect: () => selectLeaderOnly(true),
        },
      ],
    },
    {
      value: 'bindings',
      label: 'Explore Keybindings',
      group: 'Tools',
      command: 'bindings',
      aliases: ['keys'],
      shortcut: '?',
      keywords: ['which-key', 'shortcuts', 'help'],
      onSelect: () => {
        if (options.onOpenExplorer) {
          options.onOpenExplorer();
        } else {
          requestAnimationFrame(() => getDocumentWhichKeyController()?.openExplorer());
        }
      },
    },
    {
      value: 'settings',
      label: 'Open Settings',
      group: 'Tools',
      command: 'settings',
      aliases: ['prefs', 'preferences'],
      keywords: ['preferences', 'modal', 'configure'],
      onSelect: () => {
        if (options.onOpenSettings) {
          options.onOpenSettings();
        } else {
          dispatchOpenSettingsModal();
        }
      },
    },
  ];
}
