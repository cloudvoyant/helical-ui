import { describe, expect, it, vi } from 'vitest';
import {
  createWhichKeyController,
  getDocumentWhichKeyController,
  registerModalEditor,
  type ModalEditorTarget,
  type WhichKeyNode,
} from '@cloudvoyant/helical-ui';

// =============================================================================
// Helpers
// =============================================================================

function createKeyEvent(
  key: string,
  init: Partial<{
    code: string;
    ctrlKey: boolean;
    altKey: boolean;
    shiftKey: boolean;
    metaKey: boolean;
    target: unknown;
  }> = {},
): KeyboardEvent & { readonly propagationStopped: boolean } {
  let defaultPrevented = false;
  let propagationStopped = false;
  return {
    key,
    code: init.code ?? (key === ' ' ? 'Space' : `Key${key.toUpperCase()}`),
    ctrlKey: init.ctrlKey ?? false,
    altKey: init.altKey ?? false,
    shiftKey: init.shiftKey ?? false,
    metaKey: init.metaKey ?? false,
    target: init.target ?? null,
    get defaultPrevented() {
      return defaultPrevented;
    },
    get propagationStopped() {
      return propagationStopped;
    },
    preventDefault() {
      defaultPrevented = true;
    },
    stopPropagation() {
      propagationStopped = true;
    },
    stopImmediatePropagation() {
      propagationStopped = true;
    },
  } as unknown as KeyboardEvent & { readonly propagationStopped: boolean };
}

// =============================================================================
// Tests
// =============================================================================

describe('Given a controller initialized with the default "helix" preset', () => {
  describe('When "?" or "Space" then "?" (<leader>?) is dispatched in normal mode', () => {
    it('Then sets explorerOpen=true, clears activePath, and exposes flattened explorerEntries', () => {
      // Arrange
      const controller = createWhichKeyController();

      // Act: direct "?"
      controller.handleKeyDown(createKeyEvent('?', { shiftKey: true }));
      const stateAfterDirectQuestion = controller.getState();
      controller.closeExplorer();

      // Act: "Space" then "?"
      controller.handleKeyDown(createKeyEvent(' ', { code: 'Space' }));
      const stateAfterSpace = controller.getState();
      controller.handleKeyDown(createKeyEvent('?', { shiftKey: true }));
      const stateAfterQuestion = controller.getState();

      // Assert
      expect(stateAfterDirectQuestion.explorerOpen).toBe(true);
      expect(stateAfterSpace.isOpen).toBe(true);
      expect(stateAfterSpace.activePath).toEqual(['Space']);
      expect(stateAfterSpace.items.some((item) => item.commandId?.startsWith('pane.focus.'))).toBe(false);
      expect(stateAfterQuestion.explorerOpen).toBe(true);
      expect(stateAfterQuestion.activePath).toEqual([]);
      expect(stateAfterQuestion.explorerEntries.length).toBeGreaterThan(15);
      expect(stateAfterQuestion.explorerEntries.some((entry) => entry.commandId === 'whichKey.openExplorer')).toBe(
        true,
      );
    });
  });

  describe('When digits "3" then "j" are dispatched in normal mode', () => {
    it('Then invokes the "j" command handler with count: 3 and resets countBuffer', () => {
      // Arrange
      const observedCounts: number[] = [];
      const controller = createWhichKeyController({
        commands: {
          'motion.down': (ctx) => {
            observedCounts.push(ctx.count);
            return true;
          },
        },
      });

      // Act
      controller.handleKeyDown(createKeyEvent('3'));
      expect(controller.getState().countBuffer).toBe('3');
      controller.handleKeyDown(createKeyEvent('j'));

      // Assert
      expect(observedCounts).toEqual([3]);
      expect(controller.getState().countBuffer).toBe('');
    });
  });

  describe('When "Z" (Helix) or "V" (Kakoune) is dispatched', () => {
    it('Then keeps activePath open in sticky mode across leaf commands until Escape is pressed', () => {
      // Arrange
      const scrollCalls: string[] = [];
      const controller = createWhichKeyController({
        commands: {
          'view.scrollDown': () => {
            scrollCalls.push('down');
            return true;
          },
          'view.scrollUp': () => {
            scrollCalls.push('up');
            return true;
          },
        },
      });

      // Act
      controller.handleKeyDown(createKeyEvent('Z', { shiftKey: true }));
      const stickyState = controller.getState();
      controller.handleKeyDown(createKeyEvent('j'));
      controller.handleKeyDown(createKeyEvent('k'));
      const stillOpenState = controller.getState();
      const escEvent = createKeyEvent('Escape');
      controller.handleKeyDown(escEvent);
      const closedState = controller.getState();

      // Assert
      expect(stickyState.isOpen).toBe(true);
      expect(stickyState.sticky).toBe(true);
      expect(scrollCalls).toEqual(['down', 'up']);
      expect(stillOpenState.isOpen).toBe(true);
      expect(escEvent.defaultPrevented).toBe(true);
      expect(closedState.isOpen).toBe(false);
    });
  });

  describe('When "Space" then "w" then "Backspace" is dispatched', () => {
    it('Then steps into the Window submenu and pops back to the Space menu on Backspace', () => {
      // Arrange
      const controller = createWhichKeyController();

      // Act
      controller.handleKeyDown(createKeyEvent(' ', { code: 'Space' }));
      controller.handleKeyDown(createKeyEvent('w'));
      const windowSubmenuState = controller.getState();
      controller.handleKeyDown(createKeyEvent('Backspace'));
      const backToSpaceState = controller.getState();

      // Assert
      expect(windowSubmenuState.activePath).toEqual(['Space', 'w']);
      expect(windowSubmenuState.title).toBe('Window / Pane');
      expect(backToSpaceState.activePath).toEqual(['Space']);
      expect(backToSpaceState.title).toBe('Leader');
    });
  });

  describe('When tab navigation sequences ("g n", "g p", "g t", "g T", "] t", "[ t") are dispatched', () => {
    it('Then invokes tab.next and tab.prev across all presets', () => {
      // Arrange
      const calls: string[] = [];
      const controller = createWhichKeyController({
        commands: {
          'tab.next': () => {
            calls.push('next');
            return true;
          },
          'tab.prev': () => {
            calls.push('prev');
            return true;
          },
        },
      });

      // Act
      controller.handleKeyDown(createKeyEvent('g'));
      controller.handleKeyDown(createKeyEvent('n'));
      controller.handleKeyDown(createKeyEvent('g'));
      controller.handleKeyDown(createKeyEvent('p'));
      controller.handleKeyDown(createKeyEvent('g'));
      controller.handleKeyDown(createKeyEvent('t'));
      controller.handleKeyDown(createKeyEvent('g'));
      controller.handleKeyDown(createKeyEvent('T', { shiftKey: true }));
      controller.handleKeyDown(createKeyEvent(']'));
      controller.handleKeyDown(createKeyEvent('t'));
      controller.handleKeyDown(createKeyEvent('['));
      controller.handleKeyDown(createKeyEvent('t'));

      // Assert
      expect(calls).toEqual(['next', 'prev', 'next', 'prev', 'next', 'prev']);
    });
  });

  describe('When "g g" and "g b" are dispatched across helix, vim, and kakoune presets', () => {
    it('Then invokes motion.docStart on gg and motion.docEnd on gb in all three presets', () => {
      // Arrange
      const calls: string[] = [];
      const controller = createWhichKeyController({
        commands: {
          'motion.docStart': (ctx) => {
            calls.push(`${ctx.preset}:start`);
            return true;
          },
          'motion.docEnd': (ctx) => {
            calls.push(`${ctx.preset}:end`);
            return true;
          },
        },
      });

      // Act: helix (default)
      controller.handleKeyDown(createKeyEvent('g'));
      controller.handleKeyDown(createKeyEvent('b'));
      controller.handleKeyDown(createKeyEvent('g'));
      controller.handleKeyDown(createKeyEvent('g'));

      // Act: vim
      controller.setPreset('vim');
      controller.handleKeyDown(createKeyEvent('g'));
      controller.handleKeyDown(createKeyEvent('b'));
      controller.handleKeyDown(createKeyEvent('g'));
      controller.handleKeyDown(createKeyEvent('g'));

      // Act: kakoune
      controller.setPreset('kakoune');
      controller.handleKeyDown(createKeyEvent('g'));
      controller.handleKeyDown(createKeyEvent('b'));
      controller.handleKeyDown(createKeyEvent('g'));
      controller.handleKeyDown(createKeyEvent('g'));

      // Assert
      expect(calls).toEqual(['helix:end', 'helix:start', 'vim:end', 'vim:start', 'kakoune:end', 'kakoune:start']);
    });
  });

  describe('When leaderOnly is enabled on WhichKeyController', () => {
    it('Then keeps isOpen false on non-leader prefixes like "g" while still executing "g g", and sets isOpen true on "Space"', () => {
      // Arrange
      const calls: string[] = [];
      const controller = createWhichKeyController({
        leaderOnly: true,
        commands: {
          'motion.docStart': () => {
            calls.push('docStart');
            return true;
          },
        },
      });

      // Act: press g (non-leader prefix)
      controller.handleKeyDown(createKeyEvent('g'));
      const afterG = controller.getState();

      // Act: complete gg chord
      controller.handleKeyDown(createKeyEvent('g'));
      const afterGG = controller.getState();

      // Act: press Space (leader prefix)
      controller.handleKeyDown(createKeyEvent(' ', { code: 'Space' }));
      const afterSpace = controller.getState();

      // Act: press g inside Space » g
      controller.handleKeyDown(createKeyEvent('g'));
      const afterSpaceG = controller.getState();

      // Assert
      expect(afterG.activePath).toEqual(['g']);
      expect(afterG.isOpen).toBe(false);
      expect(calls).toEqual(['docStart']);
      expect(afterGG.activePath).toEqual([]);
      expect(afterSpace.activePath).toEqual(['Space']);
      expect(afterSpace.isOpen).toBe(true);
      expect(afterSpaceG.activePath).toEqual(['Space', 'g']);
      expect(afterSpaceG.isOpen).toBe(true);
    });
  });
});

describe('Given a controller switching between insert and normal modes', () => {
  describe('When the user enters insert mode via "i" and then presses "Escape"', () => {
    it('Then ignores normal-mode single-key bindings while in insert mode and exits to normal mode on Escape', () => {
      // Arrange
      const downHandler = vi.fn(() => true);
      const controller = createWhichKeyController({
        commands: {
          'motion.down': downHandler,
        },
      });

      // Act
      controller.handleKeyDown(createKeyEvent('i'));
      expect(controller.getState().mode).toBe('insert');

      const jInInsert = createKeyEvent('j');
      const handledInInsert = controller.handleKeyDown(jInInsert);

      const escEvent = createKeyEvent('Escape');
      const handledEsc = controller.handleKeyDown(escEvent);

      controller.handleKeyDown(createKeyEvent('j'));

      // Assert
      expect(handledInInsert).toBe(false);
      expect(jInInsert.defaultPrevented).toBe(false);
      expect(handledEsc).toBe(true);
      expect(escEvent.defaultPrevented).toBe(true);
      expect(controller.getState().mode).toBe('normal');
      expect(downHandler).toHaveBeenCalledTimes(1);
    });
  });
});

describe('Given a DOM element registered via registerModalEditor(dom, target)', () => {
  describe('When modal motions, text objects, selection transforms, and operators are dispatched in normal mode', () => {
    it('Then delegates directly to ModalEditorTarget methods with active preset, mode, and count', () => {
      // Arrange
      const onYank = vi.fn();
      const fakeEditorElement = { parentElement: null, dispatchEvent: vi.fn() } as unknown as HTMLElement;
      const target: ModalEditorTarget = {
        move: vi.fn(() => true),
        selectTextObject: vi.fn(() => true),
        transformSelection: vi.fn(() => true),
        execOperator: vi.fn((op) => ({
          enterInsert: false,
          ...(op === 'yank' ? { yankedText: 'yanked line' } : {}),
        })),
        setModalState: vi.fn(),
      };
      const unregister = registerModalEditor(fakeEditorElement, target);
      const controller = createWhichKeyController({ onYank });

      try {
        // Act
        controller.handleKeyDown(createKeyEvent('2', { target: fakeEditorElement }));
        controller.handleKeyDown(createKeyEvent('w', { target: fakeEditorElement }));

        controller.handleKeyDown(createKeyEvent('m', { target: fakeEditorElement }));
        controller.handleKeyDown(createKeyEvent('i', { target: fakeEditorElement }));
        controller.handleKeyDown(createKeyEvent('p', { target: fakeEditorElement }));

        controller.handleKeyDown(createKeyEvent(';', { altKey: true, target: fakeEditorElement }));
        controller.handleKeyDown(createKeyEvent('d', { target: fakeEditorElement }));
        controller.handleKeyDown(createKeyEvent('x', { target: fakeEditorElement }));

        // Assert
        expect(target.move).toHaveBeenCalledWith('wordForward', {
          preset: 'helix',
          mode: 'normal',
          count: 2,
        });
        expect(target.selectTextObject).toHaveBeenCalledWith('ip', {
          preset: 'helix',
          mode: 'normal',
        });
        expect(target.transformSelection).toHaveBeenCalledWith('flip');
        expect(target.execOperator).toHaveBeenCalledWith('delete', {
          preset: 'helix',
          mode: 'normal',
          count: 1,
        });
        expect(target.move).toHaveBeenCalledWith('lineSelect', {
          preset: 'helix',
          mode: 'normal',
          count: 1,
        });
        expect(controller.getState().mode).toBe('select');

        controller.handleKeyDown(createKeyEvent('y', { target: fakeEditorElement }));
        expect(onYank).toHaveBeenCalledWith(
          'yanked line',
          expect.objectContaining({ mode: 'select', preset: 'helix' }),
        );
        expect(fakeEditorElement.dispatchEvent).toHaveBeenCalled();
        expect(controller.getState().mode).toBe('normal');
      } finally {
        // Cleanup
        unregister();
      }
    });
  });

  describe('When jumpAction is inspected or updated', () => {
    it('Then defaults to "activate" (click) and notifies onJumpActionChange when updated', () => {
      // Arrange
      const onJumpActionChange = vi.fn();
      const controller = createWhichKeyController({ onJumpActionChange });

      // Act & Assert: default is 'activate'
      expect(controller.getState().jumpAction).toBe('activate');

      // Act: switch to 'focus'
      controller.setJumpAction('focus');

      // Assert
      expect(controller.getState().jumpAction).toBe('focus');
      expect(onJumpActionChange).toHaveBeenCalledWith('focus');
    });
  });

  describe('When running on a mobile touch-only viewport', () => {
    it('Then disables key handling by default unless disableOnMobile is false', () => {
      // Arrange
      const fakeDoc = {
        defaultView: {
          matchMedia: (query: string) => ({
            matches: query.includes('pointer: coarse'),
          }),
        },
      } as unknown as Document;

      const mobileController = createWhichKeyController({ getDocument: () => fakeDoc });
      const forcedController = createWhichKeyController({
        getDocument: () => fakeDoc,
        disableOnMobile: false,
      });

      // Act
      const handledByDefault = mobileController.handleKeyDown(createKeyEvent(' ', { code: 'Space' }));
      const handledWhenForced = forcedController.handleKeyDown(createKeyEvent(' ', { code: 'Space' }));

      // Assert
      expect(handledByDefault).toBe(false);
      expect(mobileController.getState().isOpen).toBe(false);
      expect(handledWhenForced).toBe(true);
      expect(forcedController.getState().isOpen).toBe(true);
    });
  });
});

function createFakeElement(parent: HTMLElement | null = null): HTMLElement {
  const el = {
    parentElement: parent,
    contains(candidate: Node | null): boolean {
      let cur: HTMLElement | null = candidate as HTMLElement | null;
      while (cur) {
        if (cur === el) return true;
        cur = cur.parentElement ?? null;
      }
      return false;
    },
  };
  return el as unknown as HTMLElement;
}

describe('Given scoped priority keymap layers registered on WhichKeyController', () => {
  describe('When multiple layers bind the same key across priority tiers and registration recency', () => {
    it('Then evaluates overlay > widget > extension > editor > pane > global, and breaks ties by most recent registration', () => {
      // Arrange
      const calls: string[] = [];
      const controller = createWhichKeyController();

      controller.registerKeymap(
        'global-layer',
        {
          k: {
            key: 'k',
            label: 'Global K',
            action: () => {
              calls.push('global');
              return true;
            },
          },
        },
        { priority: 'global' },
      );

      controller.registerKeymap(
        'pane-layer',
        {
          k: {
            key: 'k',
            label: 'Pane K',
            action: () => {
              calls.push('pane');
              return true;
            },
          },
        },
        { priority: 'pane' },
      );

      controller.registerKeymap(
        'editor-layer',
        {
          k: {
            key: 'k',
            label: 'Editor K',
            action: () => {
              calls.push('editor');
              return true;
            },
          },
        },
        { priority: 'editor' },
      );

      controller.registerKeymap(
        'extension-layer',
        {
          k: {
            key: 'k',
            label: 'Extension K',
            action: () => {
              calls.push('extension');
              return true;
            },
          },
        },
        { priority: 'extension' },
      );

      const unregisterWidget1 = controller.registerKeymap(
        'widget-layer-1',
        {
          k: {
            key: 'k',
            label: 'Widget 1 K',
            action: () => {
              calls.push('widget-1');
              return true;
            },
          },
        },
        { priority: 'widget' },
      );

      const unregisterWidget2 = controller.registerKeymap(
        'widget-layer-2',
        {
          k: {
            key: 'k',
            label: 'Widget 2 K',
            action: () => {
              calls.push('widget-2');
              return true;
            },
          },
        },
        { priority: 'widget' },
      );

      const unregisterOverlay = controller.registerKeymap(
        'overlay-layer',
        {
          k: {
            key: 'k',
            label: 'Overlay K',
            action: () => {
              calls.push('overlay');
              return true;
            },
          },
        },
        { priority: 'overlay' },
      );

      // Act & Assert
      controller.handleKeyDown(createKeyEvent('k'));
      expect(calls).toEqual(['overlay']);

      unregisterOverlay();
      controller.handleKeyDown(createKeyEvent('k'));
      expect(calls).toEqual(['overlay', 'widget-2']);

      unregisterWidget2();
      controller.handleKeyDown(createKeyEvent('k'));
      expect(calls).toEqual(['overlay', 'widget-2', 'widget-1']);

      unregisterWidget1();
      controller.handleKeyDown(createKeyEvent('k'));
      expect(calls).toEqual(['overlay', 'widget-2', 'widget-1', 'extension']);
    });
  });

  describe('When layers specify DOM element containment and overlay priority', () => {
    it('Then resolves portaled overlay layers first, followed by the deepest containing DOM element, and skips non-containing element layers', () => {
      // Arrange
      const calls: string[] = [];
      const outerPane = createFakeElement(null);
      const innerEditor = createFakeElement(outerPane);
      const deepWidget = createFakeElement(innerEditor);
      const unrelatedBranch = createFakeElement(outerPane);

      let activeElement: HTMLElement | null = deepWidget;
      const fakeDoc = {
        get activeElement() {
          return activeElement;
        },
      } as unknown as Document;

      const controller = createWhichKeyController({ getDocument: () => fakeDoc });

      controller.registerKeymap(
        'outer-pane',
        {
          Enter: {
            key: 'Enter',
            label: 'Outer enter',
            action: () => {
              calls.push('outer');
              return true;
            },
          },
        },
        { priority: 'pane', element: outerPane },
      );

      controller.registerKeymap(
        'inner-editor',
        {
          Enter: {
            key: 'Enter',
            label: 'Inner enter',
            action: () => {
              calls.push('inner');
              return true;
            },
          },
        },
        { priority: 'editor', element: () => innerEditor },
      );

      controller.registerKeymap(
        'unrelated-widget',
        {
          Enter: {
            key: 'Enter',
            label: 'Unrelated enter',
            action: () => {
              calls.push('unrelated');
              return true;
            },
          },
        },
        { priority: 'widget', element: unrelatedBranch },
      );

      let overlayOpen = true;
      controller.registerKeymap(
        'portaled-overlay',
        {
          Enter: {
            key: 'Enter',
            label: 'Overlay enter',
            action: () => {
              calls.push('overlay');
              return true;
            },
          },
        },
        { priority: 'overlay', enabled: () => overlayOpen },
      );

      // Act 1: overlay is open -> portaled overlay wins over element-scoped layers
      controller.handleKeyDown(createKeyEvent('Enter', { code: 'Enter', target: deepWidget }));

      // Act 2: overlay closes -> deepest containing element (innerEditor) wins over outerPane, while unrelatedBranch is skipped
      overlayOpen = false;
      controller.handleKeyDown(createKeyEvent('Enter', { code: 'Enter', target: deepWidget }));

      // Act 3: event.target is null, falls back to document.activeElement (outerPane)
      activeElement = outerPane;
      controller.handleKeyDown(createKeyEvent('Enter', { code: 'Enter', target: null }));

      // Assert
      expect(calls).toEqual(['overlay', 'inner', 'outer']);
    });
  });

  describe('When a higher-priority layer has a failing when(ctx) predicate or returns false from action(ctx)', () => {
    it('Then falls through to the next matching layer without clobbering lower layers, and only calls preventDefault/stopPropagation when a layer returns !== false', () => {
      // Arrange
      const calls: string[] = [];
      let overlayHasSelection = false;
      let editorCanHandleTab = false;

      const controller = createWhichKeyController();

      controller.registerKeymap(
        'pane-fallback',
        {
          Tab: {
            key: 'Tab',
            label: 'Pane Tab',
            action: () => {
              calls.push('pane');
              return false;
            },
          },
        },
        { priority: 'pane' },
      );

      controller.registerKeymap(
        'editor-indent',
        {
          Tab: {
            key: 'Tab',
            label: 'Editor Indent',
            action: () => {
              calls.push('editor');
              return editorCanHandleTab;
            },
          },
        },
        { priority: 'editor' },
      );

      controller.registerKeymap(
        'overlay-completion',
        {
          Tab: {
            key: 'Tab',
            label: 'Accept Completion',
            when: () => overlayHasSelection,
            action: () => {
              calls.push('overlay');
              return true;
            },
          },
        },
        { priority: 'overlay' },
      );

      // Act 1: overlay when() is false, editor action returns false, pane action returns false -> event is NOT prevented
      const unhandledTab = createKeyEvent('Tab', { code: 'Tab' });
      const handled1 = controller.handleKeyDown(unhandledTab);

      // Act 2: editor action returns true -> editor handles it and prevents default
      editorCanHandleTab = true;
      const editorTab = createKeyEvent('Tab', { code: 'Tab' });
      const handled2 = controller.handleKeyDown(editorTab);

      // Act 3: overlay when() is true -> overlay handles it first and prevents default
      overlayHasSelection = true;
      const overlayTab = createKeyEvent('Tab', { code: 'Tab' });
      const handled3 = controller.handleKeyDown(overlayTab);

      // Assert
      expect(handled1).toBe(false);
      expect(unhandledTab.defaultPrevented).toBe(false);
      expect(unhandledTab.propagationStopped).toBe(false);

      expect(handled2).toBe(true);
      expect(editorTab.defaultPrevented).toBe(true);
      expect(editorTab.propagationStopped).toBe(true);

      expect(handled3).toBe(true);
      expect(overlayTab.defaultPrevented).toBe(true);
      expect(overlayTab.propagationStopped).toBe(true);

      expect(calls).toEqual(['editor', 'pane', 'editor', 'overlay']);
    });
  });

  describe('When in insert mode with active overlay and editor extension keymap layers', () => {
    it('Then evaluates layers whose node mode explicitly includes "insert" before default Escape handling, and falls through to normal mode Escape once overlays decline', () => {
      // Arrange
      const calls: string[] = [];
      let slashMenuOpen = true;
      let inCodeBlock = true;

      const controller = createWhichKeyController({ defaultMode: 'insert' });

      // Normal-mode-only binding should NOT fire in insert mode
      controller.registerKeymap(
        'normal-only',
        {
          Enter: {
            key: 'Enter',
            label: 'Normal Enter',
            mode: 'normal',
            action: () => {
              calls.push('normal-enter');
              return true;
            },
          },
        },
        { priority: 'global' },
      );

      // Editor extension layer handling Tab and Shift-Tab (hyphen-separated chord) in insert mode conditionally
      controller.registerKeymap(
        'editor-extension',
        () =>
          ({
            Tab: {
              key: 'Tab',
              label: 'Indent Code Block',
              mode: ['insert'],
              when: () => inCodeBlock,
              action: () => {
                calls.push('editor:tab');
                return true;
              },
            },
            'Shift-Tab': {
              key: 'Shift-Tab',
              label: 'Outdent Code Block',
              mode: ['insert'],
              when: () => inCodeBlock,
              action: () => {
                calls.push('editor:shift-tab');
                return true;
              },
            },
            'Mod-Enter': {
              key: 'Mod-Enter',
              label: 'Exit Code Block',
              mode: ['insert'],
              when: () => inCodeBlock,
              action: () => {
                calls.push('editor:mod-enter');
                return true;
              },
            },
          }) satisfies Record<string, WhichKeyNode>,
        { priority: 'extension' },
      );

      // SlashMenu overlay handling ArrowDown, Enter, and Escape in insert mode (even when mode is omitted on overlay nodes)
      controller.registerKeymap(
        'slash-menu-overlay',
        {
          ArrowDown: {
            key: 'ArrowDown',
            label: 'Next Item',
            when: () => slashMenuOpen,
            action: () => {
              calls.push('slash:down');
              return true;
            },
          },
          ArrowUp: {
            key: 'ArrowUp',
            label: 'Prev Item',
            when: () => slashMenuOpen,
            action: () => {
              calls.push('slash:up');
              return true;
            },
          },
          Enter: {
            key: 'Enter',
            label: 'Select Item',
            when: () => slashMenuOpen,
            action: () => {
              calls.push('slash:enter');
              return true;
            },
          },
          Escape: {
            key: 'Escape',
            label: 'Close Slash Menu',
            when: () => slashMenuOpen,
            action: () => {
              calls.push('slash:escape');
              slashMenuOpen = false;
              return true;
            },
          },
        },
        { priority: 'overlay' },
      );

      // Act & Assert: ArrowDown, ArrowUp, Enter, Tab, Shift-Tab, and Mod-Enter are handled in insert mode
      const downEv = createKeyEvent('ArrowDown', { code: 'ArrowDown' });
      expect(controller.handleKeyDown(downEv)).toBe(true);
      expect(downEv.defaultPrevented).toBe(true);

      const upEv = createKeyEvent('ArrowUp', { code: 'ArrowUp' });
      expect(controller.handleKeyDown(upEv)).toBe(true);

      const enterEv = createKeyEvent('Enter', { code: 'Enter' });
      expect(controller.handleKeyDown(enterEv)).toBe(true);

      const tabEv = createKeyEvent('Tab', { code: 'Tab' });
      expect(controller.handleKeyDown(tabEv)).toBe(true);

      const shiftTabEv = createKeyEvent('Tab', { code: 'Tab', shiftKey: true });
      expect(controller.handleKeyDown(shiftTabEv)).toBe(true);

      const modEnterEv = createKeyEvent('Enter', { code: 'Enter', metaKey: true });
      expect(controller.handleKeyDown(modEnterEv)).toBe(true);

      // First Escape closes the slash menu AND keeps controller in insert mode
      const firstEsc = createKeyEvent('Escape', { code: 'Escape' });
      expect(controller.handleKeyDown(firstEsc)).toBe(true);
      expect(firstEsc.defaultPrevented).toBe(true);
      expect(controller.getState().mode).toBe('insert');

      // Once slashMenuOpen is false, Enter is not handled by normal-only layer and falls through to browser/editor
      const unhandledEnter = createKeyEvent('Enter', { code: 'Enter' });
      expect(controller.handleKeyDown(unhandledEnter)).toBe(false);
      expect(unhandledEnter.defaultPrevented).toBe(false);

      // When inCodeBlock is false, Tab in insert mode falls through without preventDefault
      inCodeBlock = false;
      const unhandledTab = createKeyEvent('Tab', { code: 'Tab' });
      expect(controller.handleKeyDown(unhandledTab)).toBe(false);
      expect(unhandledTab.defaultPrevented).toBe(false);

      // Second Escape falls through to default insert-mode Escape -> switches to normal mode
      const secondEsc = createKeyEvent('Escape', { code: 'Escape' });
      expect(controller.handleKeyDown(secondEsc)).toBe(true);
      expect(secondEsc.defaultPrevented).toBe(true);
      expect(controller.getState().mode).toBe('normal');

      expect(calls).toEqual([
        'slash:down',
        'slash:up',
        'slash:enter',
        'editor:tab',
        'editor:shift-tab',
        'editor:mod-enter',
        'slash:escape',
      ]);
    });
  });

  describe('When a scoped controller is attached to a document', () => {
    it('Then exposes the controller via getDocumentWhichKeyController(doc) for portaled overlays outside component context', () => {
      // Arrange
      const scopeEl = createFakeElement(null);
      const fakeDoc = {
        activeElement: scopeEl,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      } as unknown as Document;

      const controller = createWhichKeyController({
        getDocument: () => fakeDoc,
        getScopeElement: () => scopeEl,
      });

      // Act
      const detach = controller.attach(fakeDoc);
      const resolvedWhileAttached = getDocumentWhichKeyController(fakeDoc);
      detach();
      const resolvedAfterDetach = getDocumentWhichKeyController(fakeDoc);

      // Assert
      expect(resolvedWhileAttached).toBe(controller);
      expect(resolvedAfterDetach).toBeNull();
    });
  });

  describe('When pressing Space on demo buttons, toggle-group radios, or after a silent prefix', () => {
    it('Then opens the Space leader menu on buttons and toggle-group radios unless immediately preceded by Enter on a non-trigger demo button', () => {
      // Arrange
      const previewEl = {
        nodeType: 1,
        tagName: 'DIV',
        parentElement: null,
        hasAttribute: (attr: string) => attr === 'data-example-preview',
        getAttribute: () => null,
        contains(other: unknown) {
          let cur = other as { parentElement?: unknown } | null;
          while (cur) {
            if (cur === this) return true;
            cur = (cur.parentElement as { parentElement?: unknown } | null) ?? null;
          }
          return false;
        },
        closest(selector: string) {
          return selector.includes('[data-example-preview]') ? this : null;
        },
      } as unknown as HTMLElement;

      const demoButton = {
        nodeType: 1,
        tagName: 'BUTTON',
        parentElement: previewEl,
        hasAttribute: () => false,
        getAttribute: () => null,
        contains(other: unknown) {
          return other === this;
        },
        closest(selector: string) {
          return selector.includes('[data-example-preview]') ? previewEl : null;
        },
      } as unknown as HTMLElement;

      const toggleRadio = {
        nodeType: 1,
        tagName: 'BUTTON',
        parentElement: previewEl,
        hasAttribute: (attr: string) => attr === 'role',
        getAttribute: (attr: string) => (attr === 'role' ? 'radio' : null),
        contains(other: unknown) {
          return other === this;
        },
        closest(selector: string) {
          return selector.includes('[data-example-preview]') ? previewEl : null;
        },
      } as unknown as HTMLElement;

      const controller = createWhichKeyController({ leaderOnly: true });

      // Act 1: Pressing Space directly on a demo button opens WhichKey
      const directSpaceOnButton = createKeyEvent(' ', { code: 'Space', target: demoButton });
      const handledButtonSpace = controller.handleKeyDown(directSpaceOnButton);
      expect(handledButtonSpace).toBe(true);
      expect(controller.getState().activePath).toEqual(['Space']);
      expect(controller.getState().isOpen).toBe(true);
      controller.closePrefix();

      // Act 2: Pressing Space on a ToggleGroupItem (role="radio") opens WhichKey
      const spaceOnToggleRadio = createKeyEvent(' ', { code: 'Space', target: toggleRadio });
      const handledRadioSpace = controller.handleKeyDown(spaceOnToggleRadio);
      expect(handledRadioSpace).toBe(true);
      expect(controller.getState().activePath).toEqual(['Space']);
      expect(controller.getState().isOpen).toBe(true);
      controller.closePrefix();

      // Act 3: Pressing Enter then Space on the same non-trigger demo button yields Space to native button activation
      const enterOnButton = createKeyEvent('Enter', { code: 'Enter', target: demoButton });
      expect(controller.handleKeyDown(enterOnButton)).toBe(false);
      const spaceAfterEnter = createKeyEvent(' ', { code: 'Space', target: demoButton });
      expect(controller.handleKeyDown(spaceAfterEnter)).toBe(false);
      expect(controller.getState().isOpen).toBe(false);

      // Act 4: Pressing g (silent prefix when leaderOnly is true) then Space opens the Space leader menu
      const gEvent = createKeyEvent('g', { code: 'KeyG' });
      expect(controller.handleKeyDown(gEvent)).toBe(true);
      expect(controller.getState().activePath).toEqual(['g']);
      expect(controller.getState().isOpen).toBe(false);

      const spaceAfterSilentPrefix = createKeyEvent(' ', { code: 'Space' });
      expect(controller.handleKeyDown(spaceAfterSilentPrefix)).toBe(true);
      expect(controller.getState().activePath).toEqual(['Space']);
      expect(controller.getState().isOpen).toBe(true);
    });
  });
});
