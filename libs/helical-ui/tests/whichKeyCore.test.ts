import { describe, expect, it } from 'vitest';
import {
  buildWhichKeyTree,
  createJumplist,
  findDirectionalPane,
  flattenKeymapEntries,
  generateJumpLabels,
  resolveNode,
  type PaneRect,
  type WhichKeyNode,
} from '../src/index';

// =============================================================================
// Helpers
// =============================================================================

function createSampleTrie(): Record<string, WhichKeyNode> {
  return {
    'Control+w': {
      key: 'Control+w',
      label: '+window',
      group: 'Window',
      category: 'Window',
      sticky: true,
      children: {
        h: {
          key: 'h',
          label: 'Focus Left',
          description: 'Move focus left',
          commandId: 'pane.left',
        },
        l: {
          key: 'l',
          label: 'Focus Right',
          description: 'Move focus right',
          commandId: 'pane.right',
        },
      },
    },
    Space: {
      key: 'Space',
      label: '+space',
      group: 'Space',
      category: 'Space',
      children: {
        '?': {
          key: '?',
          label: 'Explore Keybindings',
          description: 'Open keybinding explorer',
          commandId: 'whichKey.openExplorer',
        },
        w: {
          key: 'w',
          label: '+window',
          group: 'Window',
          proxy: ['Control+w'],
        },
        b: {
          key: 'b',
          label: '+buffers',
          group: 'Buffers',
          expand: () => ({
            '1': {
              key: '1',
              label: 'Buffer 1',
              commandId: 'buffer.1',
            },
            '2': {
              key: '2',
              label: 'Buffer 2',
              commandId: 'buffer.2',
            },
          }),
        },
      },
    },
  };
}

// =============================================================================
// Tests
// =============================================================================

describe('Given a nested preset keymap trie with proxy and expand nodes', () => {
  describe('When resolveNode and buildWhichKeyTree are called for a prefix path', () => {
    it('Then resolves child groups, aliases ["Space", "w"] -> ["Control+w"], and dynamic expanders', () => {
      // Arrange
      const trie = createSampleTrie();

      // Act
      const proxiedLeaf = resolveNode(trie, ['Space', 'w', 'h']);
      const expandedLeaf = resolveNode(trie, ['Space', 'b', '2']);
      const proxiedTree = buildWhichKeyTree(trie, ['Space', 'w']);

      // Assert
      expect(proxiedLeaf?.commandId).toBe('pane.left');
      expect(expandedLeaf?.commandId).toBe('buffer.2');
      expect(proxiedTree.title).toBe('Window');
      expect(proxiedTree.sticky).toBe(true);
      expect(proxiedTree.items.map((item) => item.key)).toEqual(['h', 'l']);
    });

    it('Then omits cyclic self-proxy children when resolving and building a proxied submenu', () => {
      // Arrange
      const trie = createSampleTrie();
      trie['Control+w']!.children!.s = {
        key: 's',
        label: 'Sticky Window',
        sticky: true,
        loop: true,
        proxy: ['Control+w'],
      };

      // Act
      const proxiedTree = buildWhichKeyTree(trie, ['Space', 'w']);
      const cyclicNode = resolveNode(trie, ['Space', 'w', 's']);

      // Assert
      expect(proxiedTree.items.map((item) => item.key)).toEqual(['h', 'l']);
      expect(cyclicNode).toBeNull();
    });
  });

  describe('When flattenKeymapEntries is called on a preset + custom keymap tree', () => {
    it('Then returns flattened KeymapExplorerEntry items with full chord sequences and group labels', () => {
      // Arrange
      const trie = createSampleTrie();

      // Act
      const entries = flattenKeymapEntries(trie);

      // Assert
      const explorerCmd = entries.find((entry) => entry.commandId === 'whichKey.openExplorer');
      const proxiedWinCmd = entries.find(
        (entry) => entry.sequenceText === 'Space w h' && entry.commandId === 'pane.left',
      );
      const expandedBufCmd = entries.find((entry) => entry.commandId === 'buffer.1');

      expect(explorerCmd).toBeDefined();
      expect(explorerCmd?.chords).toEqual(['Space', '?']);
      expect(explorerCmd?.group).toBe('Space');
      expect(proxiedWinCmd).toBeDefined();
      expect(proxiedWinCmd?.group).toBe('Space / Window');
      expect(expandedBufCmd?.chords).toEqual(['Space', 'b', '1']);
    });
  });
});

describe('Given a set of 2D pane bounding boxes', () => {
  describe('When findDirectionalPane is called for left/down/up/right', () => {
    it('Then selects the nearest candidate in the requested half-plane by weighted center projection', () => {
      // Arrange
      const sidebar: PaneRect = { id: 'sidebar', x: 0, y: 0, width: 240, height: 800 };
      const content: PaneRect = { id: 'content', x: 240, y: 0, width: 720, height: 800 };
      const toc: PaneRect = { id: 'toc', x: 960, y: 0, width: 240, height: 400 };
      const footer: PaneRect = { id: 'footer', x: 240, y: 800, width: 720, height: 120 };
      const allPanes = [sidebar, content, toc, footer];

      // Act
      const rightFromSidebar = findDirectionalPane(sidebar, allPanes, 'right');
      const rightFromContent = findDirectionalPane(content, allPanes, 'right');
      const leftFromToc = findDirectionalPane(toc, allPanes, 'left');
      const downFromContent = findDirectionalPane(content, allPanes, 'down');
      const upFromFooter = findDirectionalPane(footer, allPanes, 'up');

      // Assert
      expect(rightFromSidebar?.id).toBe('content');
      expect(rightFromContent?.id).toBe('toc');
      expect(leftFromToc?.id).toBe('content');
      expect(downFromContent?.id).toBe('footer');
      expect(upFromFooter?.id).toBe('content');
    });

    it('Then steps through a tall scrollable center pane between two viewport-height sticky gutters (sidebar -> content -> toc -> content -> sidebar)', () => {
      // Arrange
      const stickyLeft: PaneRect = { id: 'docs-sidebar', x: 0, y: 64, width: 224, height: 800 };
      const tallMain: PaneRect = { id: 'docs-main', x: 224, y: 0, width: 800, height: 5000 };
      const stickyRight: PaneRect = { id: 'docs-toc', x: 1024, y: 64, width: 256, height: 800 };
      const panes = [stickyLeft, tallMain, stickyRight];

      // Act & Assert
      expect(findDirectionalPane(stickyLeft, panes, 'right')?.id).toBe('docs-main');
      expect(findDirectionalPane(tallMain, panes, 'right')?.id).toBe('docs-toc');
      expect(findDirectionalPane(stickyRight, panes, 'left')?.id).toBe('docs-main');
      expect(findDirectionalPane(tallMain, panes, 'left')?.id).toBe('docs-sidebar');
    });
  });
});

describe('Given N visible target elements', () => {
  describe('When generateJumpLabels is called', () => {
    it('Then generates N prefix-free home-row labels with zero prefix collisions', () => {
      // Arrange
      const targetCount = 45;

      // Act
      const labels = generateJumpLabels(targetCount);

      // Assert
      expect(labels).toHaveLength(targetCount);
      for (let i = 0; i < labels.length; i += 1) {
        for (let j = 0; j < labels.length; j += 1) {
          if (i === j) continue;
          expect(labels[j]!.startsWith(labels[i]!)).toBe(false);
        }
      }
    });
  });
});

describe('Given a bounded Jumplist instance', () => {
  describe('When locations are pushed and back() / forward() are called', () => {
    it('Then navigates history in LIFO order and truncates forward history on new pushes', () => {
      // Arrange
      const jumplist = createJumplist(5);
      jumplist.push({ paneId: 'sidebar', elementSelector: '#nav-1' });
      jumplist.push({ paneId: 'content', elementSelector: '#demo-1' });
      jumplist.push({ paneId: 'toc', elementSelector: '#toc-1' });

      // Act
      const firstBack = jumplist.back();
      const secondBack = jumplist.back();
      const firstForward = jumplist.forward();
      jumplist.push({ paneId: 'footer', elementSelector: '#foot-1' });
      const forwardAfterNewPush = jumplist.forward();

      // Assert
      expect(firstBack?.paneId).toBe('content');
      expect(secondBack?.paneId).toBe('sidebar');
      expect(firstForward?.paneId).toBe('content');
      expect(forwardAfterNewPush).toBeNull();
      expect(jumplist.entries().map((e) => e.paneId)).toEqual(['sidebar', 'content', 'footer']);
    });
  });
});
