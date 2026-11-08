import { describe, expect, it } from 'vitest';
import {
  commandMenuDialogContentBase,
  commandMenuItemVariants,
  commandMenuListVariants,
  commandMenuPositionerBase,
  commandMenuPromptBarVariants,
  createCommandTree,
  formatCommandMenuCompletionInput,
  matchesCommandHotkey,
  resolveCommandMenuGridNavigation,
  resolveCommandMenuGridStyle,
  resolveCommandMenuState,
  resolveCommandLevel,
  splitHighlightSegments,
  type CommandNode,
} from '../src/command';

const SAMPLE_COMMANDS: CommandNode[] = [
  {
    value: 'search',
    label: 'Search Docs',
    group: 'Navigation',
    command: 'search',
    aliases: ['find', 's'],
    badge: 'Future',
    shortcut: 'Mod+f',
    keywords: ['documentation', 'query'],
  },
  {
    value: 'github',
    label: 'View GitHub',
    group: 'Navigation',
    command: 'github',
    aliases: ['gh', 'repo'],
    shortcut: 'g h',
  },
  {
    value: 'theme',
    label: 'Change Theme',
    group: 'Appearance',
    command: 'theme',
    aliases: ['t', 'colorscheme'],
    children: [
      {
        value: 'catppuccin',
        label: 'Catppuccin',
        command: 'catppuccin',
        aliases: ['ctp'],
        active: true,
      },
      {
        value: 'dracula',
        label: 'Dracula',
        command: 'dracula',
      },
      {
        value: 'nord',
        label: 'Nord',
        command: 'nord',
        disabled: true,
      },
    ],
  },
  {
    value: 'mode',
    label: 'Change Light/Dark Mode',
    group: 'Appearance',
    command: 'mode',
    aliases: ['m'],
    children: [
      { value: 'light', label: 'Light', command: 'light' },
      { value: 'dark', label: 'Dark', command: 'dark', active: true },
      { value: 'system', label: 'System', command: 'system' },
    ],
  },
  {
    value: 'keybind',
    label: 'Change Keybind Style',
    group: 'Preferences',
    command: 'keybind',
    aliases: ['k'],
    children: [
      { value: 'helix', label: 'Helix', command: 'helix' },
      { value: 'vim', label: 'Vim', command: 'vim' },
      { value: 'kakoune', label: 'Kakoune', command: 'kakoune' },
    ],
  },
  {
    value: 'framework',
    label: 'Change Framework',
    group: 'Preferences',
    command: 'framework',
    aliases: ['fw'],
    children: [
      { value: 'react', label: 'React', command: 'react' },
      { value: 'svelte', label: 'Svelte', command: 'svelte' },
    ],
  },
];

describe('Given an empty CommandNode[] array passed to createCommandTree', () => {
  describe('When resolveCommandLevel is called', () => {
    it('Then returns hasCommands: false and empty items, groups, and breadcrumbs', () => {
      const emptyTree = createCommandTree([]);

      const paletteState = resolveCommandLevel(emptyTree, [], '');

      expect(paletteState.hasCommands).toBe(false);
      expect(paletteState.items).toEqual([]);
      expect(paletteState.groups).toEqual([]);
      expect(paletteState.breadcrumbs).toEqual([]);
    });
  });

  describe('When resolveCommandMenuState is called', () => {
    it('Then returns hasCommands: false and empty suggestions so the UI renders "No commands registered."', () => {
      const emptyTree = createCommandTree([]);

      const menuState = resolveCommandMenuState(emptyTree, ':theme');

      expect(menuState.hasCommands).toBe(false);
      expect(menuState.suggestions).toEqual([]);
      expect(menuState.exactNode).toBeNull();
      expect(menuState.error).toBeNull();
    });
  });
});

describe('Given a multi-level CommandNode[] tree passed to createCommandTree', () => {
  describe('When branch and leaf lookups are performed', () => {
    it('Then constructs a @zag-js/collection TreeCollection and resolves branch vs leaf nodes and disabled state', () => {
      const tree = createCommandTree(SAMPLE_COMMANDS);
      const themeNode = tree.findNode('theme');
      const githubNode = tree.findNode('github');
      const catppuccinNode = tree.findNode('catppuccin');
      const nordNode = tree.findNode('nord');

      expect(createCommandTree(tree)).toBe(tree);
      expect(themeNode).toBeDefined();
      expect(githubNode).toBeDefined();
      expect(catppuccinNode).toBeDefined();
      expect(tree.isBranchNode(themeNode!)).toBe(true);
      expect(tree.isBranchNode(githubNode!)).toBe(false);
      expect(tree.getNodeDisabled(nordNode!)).toBe(true);
    });
  });
});

describe('Given resolveCommandLevel is called at root and nested activePath levels', () => {
  const tree = createCommandTree(SAMPLE_COMMANDS);

  describe('When query is empty at the root activePath', () => {
    it('Then returns hasCommands: true, all root items grouped by category, and empty breadcrumbs', () => {
      const rootRes = resolveCommandLevel(tree, [], '');

      expect(rootRes.hasCommands).toBe(true);
      expect(rootRes.breadcrumbs).toEqual([]);
      expect(rootRes.items).toHaveLength(6);
      expect(rootRes.groups.map((g) => g.label)).toEqual(['Navigation', 'Appearance', 'Preferences']);
    });
  });

  describe('When query is empty at a nested activePath', () => {
    it('Then returns the nested branch children, breadcrumb chain, and fullCommand metadata', () => {
      const nestedRes = resolveCommandLevel(tree, ['theme'], '');

      expect(nestedRes.hasCommands).toBe(true);
      expect(nestedRes.breadcrumbs).toEqual([{ value: 'theme', label: 'Change Theme', command: 'theme' }]);
      expect(nestedRes.items.map((item) => item.label)).toEqual(['Catppuccin', 'Dracula', 'Nord']);
      expect(nestedRes.items[0]?.fullCommand).toBe(':theme catppuccin');
      expect(nestedRes.items[0]?.valuePath).toEqual(['theme', 'catppuccin']);
    });
  });

  describe('When query is a fuzzy subsequence matching a branch ("cthm")', () => {
    it('Then ranks the matching branch item via fzf with matchPositions', () => {
      const fuzzyTheme = resolveCommandLevel(tree, [], 'cthm');

      expect(fuzzyTheme.hasCommands).toBe(true);
      expect(fuzzyTheme.items.length).toBeGreaterThan(0);
      expect(fuzzyTheme.items[0]?.label).toBe('Change Theme');
      expect(fuzzyTheme.items[0]?.matchPositions?.length).toBeGreaterThan(0);
    });
  });

  describe('When query is a fuzzy subsequence matching a deep leaf ("catp")', () => {
    it('Then ranks the deep leaf item with ancestor breadcrumbs and splits highlight segments', () => {
      const deepLeaf = resolveCommandLevel(tree, [], 'catp');
      const segments = splitHighlightSegments(deepLeaf.items[0]!.label, deepLeaf.items[0]!.matchPositions);

      expect(deepLeaf.items[0]?.label).toBe('Catppuccin');
      expect(deepLeaf.items[0]?.breadcrumbLabels).toEqual(['Change Theme']);
      expect(deepLeaf.items[0]?.matchPositions).toEqual([0, 1, 2, 3]);
      expect(segments).toEqual([
        { text: 'Catp', highlight: true },
        { text: 'puccin', highlight: false },
      ]);
    });
  });
});

describe('Given resolveCommandMenuState is called with command menu inputs', () => {
  const tree = createCommandTree(SAMPLE_COMMANDS);

  describe('When given a command alias followed by a trailing space (":t ")', () => {
    it('Then resolves the target branch and lists all child subcommand suggestions', () => {
      const aliasDrill = resolveCommandMenuState(tree, ':t ');

      expect(aliasDrill.hasCommands).toBe(true);
      expect(aliasDrill.completedTokens).toEqual(['theme']);
      expect(aliasDrill.breadcrumbs).toEqual([{ value: 'theme', label: 'Change Theme', command: 'theme' }]);
      expect(aliasDrill.suggestions.map((s) => s.command)).toEqual(['catppuccin', 'dracula', 'nord']);
    });
  });

  describe('When given a branch command and partial subcommand token (":theme cat")', () => {
    it('Then filters child suggestions via fzf and formats the leaf Tab completion string', () => {
      const partialSub = resolveCommandMenuState(tree, ':theme cat');
      const completedInput = formatCommandMenuCompletionInput(partialSub.completedTokens, partialSub.suggestions[0]!);

      expect(partialSub.completedTokens).toEqual(['theme']);
      expect(partialSub.partialToken).toBe('cat');
      expect(partialSub.suggestions[0]?.command).toBe('catppuccin');
      expect(partialSub.suggestions[0]?.commandMatchPositions).toEqual([0, 1, 2]);
      expect(completedInput).toBe(':theme catppuccin');
    });
  });

  describe('When given a partial branch command token (":th")', () => {
    it('Then formats the branch Tab completion string with a trailing space', () => {
      const partialBranch = resolveCommandMenuState(tree, ':th');
      const completedInput = formatCommandMenuCompletionInput(
        partialBranch.completedTokens,
        partialBranch.suggestions[0]!,
      );

      expect(partialBranch.suggestions[0]?.command).toBe('theme');
      expect(completedInput).toBe(':theme ');
    });
  });

  describe('When given an unrecognized command token (":notacommand")', () => {
    it('Then returns an "Unknown command" error diagnostic and empty suggestions', () => {
      const unknown = resolveCommandMenuState(tree, ':notacommand');

      expect(unknown.hasCommands).toBe(true);
      expect(unknown.suggestions).toEqual([]);
      expect(unknown.exactNode).toBeNull();
      expect(unknown.error).toContain('Unknown command: notacommand');
    });
  });

  describe('When given extra arguments after a leaf command (":github extra")', () => {
    it('Then returns a "does not take arguments" error diagnostic and empty suggestions', () => {
      const leafExtraArgs = resolveCommandMenuState(tree, ':github extra');

      expect(leafExtraArgs.suggestions).toEqual([]);
      expect(leafExtraArgs.error).toContain("Command ':github' does not take arguments");
    });
  });
});

describe('Given matchesCommandHotkey is called with a KeyboardEvent and hotkey string', () => {
  describe('When testing Mod+k, colon (:), and non-matching key events', () => {
    it('Then returns true when the platform modifier or colon key matches and false otherwise', () => {
      const matchingEvent = {
        key: 'k',
        code: 'KeyK',
        ctrlKey: true,
        metaKey: true,
        altKey: false,
        shiftKey: false,
      } as unknown as KeyboardEvent;
      const colonEvent = {
        key: ':',
        code: 'Semicolon',
        ctrlKey: false,
        metaKey: false,
        altKey: false,
        shiftKey: true,
        target: null,
      } as unknown as KeyboardEvent;
      const nonMatchingEvent = {
        key: 'j',
        code: 'KeyJ',
        ctrlKey: false,
        metaKey: false,
        altKey: false,
        shiftKey: false,
      } as unknown as KeyboardEvent;

      expect(matchesCommandHotkey(matchingEvent, 'Mod+k')).toBe(true);
      expect(matchesCommandHotkey(colonEvent, ':')).toBe(true);
      expect(matchesCommandHotkey(nonMatchingEvent, 'Mod+k')).toBe(false);
    });
  });
});

describe('Given CommandMenu bottom-docked positioner, compactness variants, and multi-column list variants', () => {
  describe('When size and columns variants are resolved', () => {
    it('Then docks flush across the bottom edge of the viewport, scales compactness across sm/md/lg, and computes column-first grid styles', () => {
      expect(commandMenuPositionerBase).toContain('items-end');
      expect(commandMenuDialogContentBase).toContain('fixed inset-x-0 bottom-0');
      expect(commandMenuListVariants({ columns: 'auto', size: 'sm' })).toContain('grid-flow-col');
      expect(commandMenuListVariants({ columns: 'auto', size: 'sm' })).toContain('py-1');
      expect(commandMenuItemVariants({ size: 'sm' })).toContain('py-0.5');
      expect(commandMenuItemVariants({ size: 'lg' })).toContain('py-2');
      expect(commandMenuPromptBarVariants({ size: 'sm' })).toContain('py-1');
      expect(commandMenuPromptBarVariants({ size: 'lg' })).toContain('py-2.5');
      expect(resolveCommandMenuGridStyle('auto', 6)).toEqual({
        display: 'grid',
        gridAutoFlow: 'column',
        gridTemplateRows: 'repeat(3, minmax(0, auto))',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      });
      expect(resolveCommandMenuGridStyle(3, 6)).toEqual({
        display: 'grid',
        gridAutoFlow: 'column',
        gridTemplateRows: 'repeat(2, minmax(0, auto))',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      });
      expect(resolveCommandMenuGridNavigation('auto', 6, 0, 'ArrowDown')).toBe(1);
      expect(resolveCommandMenuGridNavigation('auto', 6, 0, 'ArrowRight')).toBe(3);
      expect(resolveCommandMenuGridNavigation('auto', 6, 3, 'ArrowLeft')).toBe(0);
      expect(resolveCommandMenuGridNavigation('auto', 6, 1, 'ArrowRight')).toBe(4);
    });
  });
});
