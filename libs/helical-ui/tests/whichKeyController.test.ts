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
  describe('When "Space" then "?" (<leader>?) is dispatched in normal mode', () => {
    it('Then sets explorerOpen=true, clears activePath, and exposes flattened explorerEntries', () => {
      // Arrange
      const controller = createWhichKeyController();

      // Act
      controller.handleKeyDown(createKeyEvent(' ', { code: 'Space' }));
      const stateAfterSpace = controller.getState();
      controller.handleKeyDown(createKeyEvent('?', { shiftKey: true }));
      const stateAfterQuestion = controller.getState();

      // Assert
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
      expect(backToSpaceState.title).toBe('Space');
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
      const fakeEditorElement = { parentElement: null } as unknown as HTMLElement;
      const target: ModalEditorTarget = {
        move: vi.fn(() => true),
        selectTextObject: vi.fn(() => true),
        transformSelection: vi.fn(() => true),
        execOperator: vi.fn(() => ({ enterInsert: false })),
        setModalState: vi.fn(),
      };
      const unregister = registerModalEditor(fakeEditorElement, target);
      const controller = createWhichKeyController();

      try {
        // Act
        controller.handleKeyDown(createKeyEvent('2', { target: fakeEditorElement }));
        controller.handleKeyDown(createKeyEvent('w', { target: fakeEditorElement }));

        controller.handleKeyDown(createKeyEvent('m', { target: fakeEditorElement }));
        controller.handleKeyDown(createKeyEvent('i', { target: fakeEditorElement }));
        controller.handleKeyDown(createKeyEvent('p', { target: fakeEditorElement }));

        controller.handleKeyDown(createKeyEvent(';', { altKey: true, target: fakeEditorElement }));
        controller.handleKeyDown(createKeyEvent('d', { target: fakeEditorElement }));

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
      } finally {
        // Cleanup
        unregister();
      }
    });
  });
});
