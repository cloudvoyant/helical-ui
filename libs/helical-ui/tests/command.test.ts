import { describe, expect, it } from 'vitest';
import {
  createCommandTree,
  formatColonCompletionInput,
  resolveColonCommandState,
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
  describe('When resolveCommandLevel and resolveColonCommandState are called', () => {
    it('Then returns hasCommands: false and empty items/suggestions so the UI renders "No commands registered."', () => {
      const emptyTree = createCommandTree([]);

      const paletteState = resolveCommandLevel(emptyTree, [], '');
      expect(paletteState.hasCommands).toBe(false);
      expect(paletteState.items).toEqual([]);
      expect(paletteState.groups).toEqual([]);
      expect(paletteState.breadcrumbs).toEqual([]);

      const colonState = resolveColonCommandState(emptyTree, ':theme');
      expect(colonState.hasCommands).toBe(false);
      expect(colonState.suggestions).toEqual([]);
      expect(colonState.exactNode).toBeNull();
      expect(colonState.error).toBeNull();
    });
  });
});

describe('Given a multi-level CommandNode[] tree passed to createCommandTree', () => {
  describe('When branch and leaf lookups are performed', () => {
    it('Then constructs a @zag-js/collection TreeCollection and resolves branch vs leaf nodes and ancestor paths', () => {
      const tree = createCommandTree(SAMPLE_COMMANDS);

      expect(createCommandTree(tree)).toBe(tree);

      const themeNode = tree.findNode('theme');
      const githubNode = tree.findNode('github');
      const catppuccinNode = tree.findNode('catppuccin');

      expect(themeNode).toBeDefined();
      expect(githubNode).toBeDefined();
      expect(catppuccinNode).toBeDefined();

      expect(tree.isBranchNode(themeNode!)).toBe(true);
      expect(tree.isBranchNode(githubNode!)).toBe(false);
      expect(tree.getNodeDisabled(tree.findNode('nord')!)).toBe(true);
    });
  });
});

describe('Given resolveCommandLevel is called at root and nested activePath levels', () => {
  const tree = createCommandTree(SAMPLE_COMMANDS);

  describe('When query is empty', () => {
    it('Then returns hasCommands: true, the active level children grouped by category, and the breadcrumb chain', () => {
      const rootRes = resolveCommandLevel(tree, [], '');
      expect(rootRes.hasCommands).toBe(true);
      expect(rootRes.breadcrumbs).toEqual([]);
      expect(rootRes.items).toHaveLength(6);
      expect(rootRes.groups.map((g) => g.label)).toEqual(['Navigation', 'Appearance', 'Preferences']);

      const nestedRes = resolveCommandLevel(tree, ['theme'], '');
      expect(nestedRes.hasCommands).toBe(true);
      expect(nestedRes.breadcrumbs).toEqual([{ value: 'theme', label: 'Change Theme', command: 'theme' }]);
      expect(nestedRes.items.map((item) => item.label)).toEqual(['Catppuccin', 'Dracula', 'Nord']);
      expect(nestedRes.items[0]?.fullCommand).toBe(':theme catppuccin');
      expect(nestedRes.items[0]?.valuePath).toEqual(['theme', 'catppuccin']);
    });
  });

  describe('When query is a fuzzy subsequence (e.g. "cthm" or "catp")', () => {
    it('Then ranks deep leaf items via fzf and populates matchPositions for character highlighting', () => {
      const fuzzyTheme = resolveCommandLevel(tree, [], 'cthm');
      expect(fuzzyTheme.hasCommands).toBe(true);
      expect(fuzzyTheme.items.length).toBeGreaterThan(0);
      expect(fuzzyTheme.items[0]?.label).toBe('Change Theme');
      expect(fuzzyTheme.items[0]?.matchPositions?.length).toBeGreaterThan(0);

      const deepLeaf = resolveCommandLevel(tree, [], 'catp');
      expect(deepLeaf.items[0]?.label).toBe('Catppuccin');
      expect(deepLeaf.items[0]?.breadcrumbLabels).toEqual(['Change Theme']);
      expect(deepLeaf.items[0]?.matchPositions).toEqual([0, 1, 2, 3]);

      const segments = splitHighlightSegments(deepLeaf.items[0]!.label, deepLeaf.items[0]!.matchPositions);
      expect(segments).toEqual([
        { text: 'Catp', highlight: true },
        { text: 'puccin', highlight: false },
      ]);
    });
  });
});

describe('Given resolveColonCommandState is called with colon inputs', () => {
  const tree = createCommandTree(SAMPLE_COMMANDS);

  describe('When given command aliases, trailing spaces (":t "), or partial subcommand tokens (":theme cat")', () => {
    it('Then resolves the target branch, filters child suggestions via fzf, and computes the Tab completion string', () => {
      const aliasDrill = resolveColonCommandState(tree, ':t ');
      expect(aliasDrill.hasCommands).toBe(true);
      expect(aliasDrill.completedTokens).toEqual(['theme']);
      expect(aliasDrill.breadcrumbs).toEqual([{ value: 'theme', label: 'Change Theme', command: 'theme' }]);
      expect(aliasDrill.suggestions.map((s) => s.command)).toEqual(['catppuccin', 'dracula', 'nord']);

      const partialSub = resolveColonCommandState(tree, ':theme cat');
      expect(partialSub.completedTokens).toEqual(['theme']);
      expect(partialSub.partialToken).toBe('cat');
      expect(partialSub.suggestions[0]?.command).toBe('catppuccin');
      expect(partialSub.suggestions[0]?.commandMatchPositions).toEqual([0, 1, 2]);
      expect(formatColonCompletionInput(partialSub.completedTokens, partialSub.suggestions[0]!)).toBe(
        ':theme catppuccin',
      );

      const partialBranch = resolveColonCommandState(tree, ':th');
      expect(partialBranch.suggestions[0]?.command).toBe('theme');
      expect(formatColonCompletionInput(partialBranch.completedTokens, partialBranch.suggestions[0]!)).toBe(':theme ');
    });
  });

  describe('When given an unrecognized command token (":notacommand")', () => {
    it('Then returns a non-null error diagnostic and empty suggestions', () => {
      const unknown = resolveColonCommandState(tree, ':notacommand');
      expect(unknown.hasCommands).toBe(true);
      expect(unknown.suggestions).toEqual([]);
      expect(unknown.exactNode).toBeNull();
      expect(unknown.error).toContain('Unknown command: notacommand');

      const leafExtraArgs = resolveColonCommandState(tree, ':github extra');
      expect(leafExtraArgs.suggestions).toEqual([]);
      expect(leafExtraArgs.error).toContain("Command ':github' does not take arguments");
    });
  });
});
