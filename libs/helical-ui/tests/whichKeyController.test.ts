import { describe, expect, it, vi } from 'vitest';
import { createWhichKeyController, registerModalEditor, type ModalEditorTarget } from '@cloudvoyant/helical-ui';

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
): KeyboardEvent {
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
  } as unknown as KeyboardEvent;
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
