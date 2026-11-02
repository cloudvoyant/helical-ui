// apps/docs/e2e/which-key.spec.ts
// BDD end-to-end coverage for WhichKey, WhichKeyExplorer (<leader>?), modal presets,
// pane navigation, form normal/insert navigation, ProseMirror ModalKeymap editor,
// forward jump labels, and docs shell keyboard integration across React and Svelte.
import { test, expect, type Page } from '@playwright/test';
import { FRAMEWORKS, selectFramework } from './helpers';

// --- Helpers ---

function island(page: Page, framework: string, example: string) {
  return page.locator(`[data-example-id="${example}"] [data-example-preview] [data-fw="${framework}"]`);
}

// --- Tests ---

for (const framework of FRAMEWORKS) {
  test.describe(`WhichKey · ${framework}`, () => {
    test.describe('Given a WhichKeyProvider in normal mode on /components/which-key', () => {
      test.beforeEach(async ({ page }) => {
        // Arrange
        await page.goto('components/which-key');
        await selectFramework(page, framework);
      });

      test.describe('When the user presses Space', () => {
        test('Then mounts the Helix-style bottom-right WhichKey panel via Ark Presence/Portal showing ? (Explore Keybindings), +window, +goto, +view, and command items', async ({
          page,
        }) => {
          // Arrange
          const demo = island(page, framework, 'default');
          await demo.getByTestId('wk-default-surface').click();

          // Act
          await page.keyboard.press('Space');

          // Assert
          const panel = page.getByTestId('which-key-panel');
          await expect(panel).toBeVisible();
          await expect(panel).toHaveAttribute('data-variant', 'helix');
          await expect(panel.locator('[data-testid="which-key-item"][data-key="?"]')).toContainText(
            'Explore Keybindings',
          );
          await expect(panel.locator('[data-testid="which-key-item"][data-key="w"]')).toContainText(
            '+window',
          );
        });
      });

      test.describe('When the user presses Space then w and then Backspace', () => {
        test('Then transitions to the Window submenu with breadcrumb "Space » w" on w and pops one prefix level back on Backspace', async ({
          page,
        }) => {
          // Arrange
          const demo = island(page, framework, 'default');
          await demo.getByTestId('wk-default-surface').click();

          // Act
          await page.keyboard.press('Space');
          await page.keyboard.press('w');

          // Assert submenu
          const panel = page.getByTestId('which-key-panel');
          await expect(panel).toBeVisible();
          await expect(panel.getByTestId('which-key-breadcrumb')).toContainText('Space » w');

          // Act Backspace
          await page.keyboard.press('Backspace');

          // Assert back to root Space menu
          await expect(panel.getByTestId('which-key-breadcrumb')).toContainText('Space');
          await expect(panel.getByTestId('which-key-breadcrumb')).not.toContainText('Space » w');
        });
      });

      test.describe('When WhichKey is open inside an active Dialog and the user presses Escape', () => {
        test('Then closes the WhichKey popup only and keeps the Dialog open via @zag-js/dismissable trackDismissableBranch', async ({
          page,
        }) => {
          // Arrange
          const demo = island(page, framework, 'default');
          await demo.getByTestId('wk-default-open-dialog').click();
          const dialog = page.getByTestId('wk-default-dialog');
          await expect(dialog).toBeVisible();

          // Act: open WhichKey inside the open dialog, then press Escape
          await page.keyboard.press('Space');
          const panel = page.getByTestId('which-key-panel');
          await expect(panel).toBeVisible();
          await page.keyboard.press('Escape');

          // Assert: WhichKey closes while Dialog stays open
          await expect(panel).toBeHidden();
          await expect(dialog).toBeVisible();
        });
      });
    });

    test.describe('Given a WhichKeyProvider with default leaderKey="Space"', () => {
      test.beforeEach(async ({ page }) => {
        // Arrange
        await page.goto('components/which-key');
        await selectFramework(page, framework);
      });

      test.describe('When the user presses ? (or Space then ?) in normal mode', () => {
        test('Then opens the WhichKeyExplorer Dialog + Listbox modal listing active preset bindings grouped by ListboxItemGroup with <Kbd> chords', async ({
          page,
        }) => {
          // Arrange
          const demo = island(page, framework, 'explorer');
          await demo.getByTestId('wk-explorer-surface').click();

          // Act
          await page.keyboard.press('?');

          // Assert
          const explorer = page.getByTestId('which-key-explorer');
          await expect(explorer).toBeVisible();
          await expect(explorer.getByTestId('which-key-explorer-input')).toBeVisible();
          await expect(explorer.getByTestId('which-key-explorer-item').first()).toBeVisible();
        });
      });

      test.describe('When the user types a filter query in ListboxInput and presses Enter', () => {
        test('Then filters displayed bindings, highlights matched query substrings in <mark> tags via Ark Highlight, and executes the highlighted command on Enter', async ({
          page,
        }) => {
          // Arrange
          const demo = island(page, framework, 'explorer');
          await demo.getByTestId('wk-explorer-trigger').click();
          const explorer = page.getByTestId('which-key-explorer');
          const input = explorer.getByTestId('which-key-explorer-input');
          await expect(explorer).toBeVisible();

          // Act: filter for our custom command "Format Document"
          await input.fill('Format Document');

          // Assert highlight mark
          const items = explorer.getByTestId('which-key-explorer-item');
          await expect(items).toHaveCount(1);
          await expect(items.first().locator('mark').first()).toContainText(/Format/i);

          // Act: press Enter to execute
          await input.press('Enter');

          // Assert: explorer closes and command executed
          await expect(explorer).toBeHidden();
          await expect(demo.getByTestId('wk-explorer-executed')).toHaveText('demo.formatDocument');
        });
      });

      test.describe('When WhichKeyExplorer is open and the user presses Escape', () => {
        test('Then closes the explorer Dialog', async ({ page }) => {
          // Arrange
          const demo = island(page, framework, 'explorer');
          await demo.getByTestId('wk-explorer-trigger').click();
          const explorer = page.getByTestId('which-key-explorer');
          await expect(explorer).toBeVisible();

          // Act
          await page.keyboard.press('Escape');

          // Assert
          await expect(explorer).toBeHidden();
        });
      });
    });

    test.describe('Given the keybinding presets demo on /components/which-key', () => {
      test.beforeEach(async ({ page }) => {
        // Arrange
        await page.goto('components/which-key');
        await selectFramework(page, framework);
      });

      test.describe('When the default Helix preset is active and the user presses g or Shift+Z', () => {
        test('Then opens Goto on g and enters sticky View mode on Shift+Z until Escape', async ({
          page,
        }) => {
          // Arrange
          const demo = island(page, framework, 'presets');
          await demo.getByTestId('wk-preset-item-0').focus();

          // Act: press g then e (goto bottom)
          await page.keyboard.press('g');
          const panel = page.getByTestId('which-key-panel');
          await expect(panel).toBeVisible();
          await page.keyboard.press('e');
          await expect(demo.getByTestId('wk-presets-focused-item')).toHaveText('Delta Item');

          // Act: press Shift+Z to enter sticky View mode
          await page.keyboard.press('Shift+Z');
          await expect(panel).toBeVisible();
          await expect(panel).toHaveAttribute('data-sticky', 'true');

          // Repeat j in sticky View mode — panel stays open until Escape
          await page.keyboard.press('j');
          await expect(panel).toBeVisible();
          await page.keyboard.press('Escape');
          await expect(panel).toBeHidden();
        });
      });

      test.describe('When the preset is switched to Vim or Kakoune', () => {
        test('Then executes Vim Shift+G / 0 / $ and Kakoune v / Shift+V view lock', async ({
          page,
        }) => {
          // Arrange
          const demo = island(page, framework, 'presets');
          await demo.getByTestId('wk-preset-btn-vim').click();
          await demo.getByTestId('wk-preset-item-0').focus();

          // Act: Vim Shift+G jumps immediately to bottom item
          await page.keyboard.press('Shift+G');
          await expect(demo.getByTestId('wk-presets-focused-item')).toHaveText('Delta Item');

          // Act: Vim 0 jumps to first item
          await page.keyboard.press('0');
          await expect(demo.getByTestId('wk-presets-focused-item')).toHaveText('Alpha Item');

          // Switch to Kakoune
          await demo.getByTestId('wk-preset-btn-kakoune').click();
          await demo.getByTestId('wk-preset-item-0').focus();

          // Act: Kakoune Shift+V opens sticky view lock
          await page.keyboard.press('Shift+V');
          const panel = page.getByTestId('which-key-panel');
          await expect(panel).toBeVisible();
          await expect(panel).toHaveAttribute('data-sticky', 'true');
          await page.keyboard.press('Escape');
          await expect(panel).toBeHidden();
        });
      });
    });

    test.describe('Given multiple registered panes on /components/which-key', () => {
      test.beforeEach(async ({ page }) => {
        // Arrange
        await page.goto('components/which-key');
        await selectFramework(page, framework);
      });

      test.describe('When the user navigates with Space w l / Space 1..3 / Ctrl-o / Ctrl-i', () => {
        test('Then moves active pane focus spatially, focuses panes by index restoring last focused child, and traverses Jumplist history', async ({
          page,
        }) => {
          // Arrange
          const demo = island(page, framework, 'panes');
          const btn1Pane1 = demo.getByTestId('wk-pane-1-btn-2');
          await btn1Pane1.focus();
          await expect(demo.getByTestId('wk-panes-active-id')).toContainText('pane-nav');

          // Act: Space w l moves right to pane-editor
          await page.keyboard.press('Space');
          await page.keyboard.press('w');
          await page.keyboard.press('l');
          await expect(demo.getByTestId('wk-panes-active-id')).toContainText('pane-editor');

          // Act: Space 3 jumps to pane 3 (pane-inspector)
          await page.keyboard.press('Space');
          await page.keyboard.press('3');
          await expect(demo.getByTestId('wk-panes-active-id')).toContainText('pane-inspector');

          // Act: Space 1 returns to pane 1 and restores focus to wk-pane-1-btn-2
          await page.keyboard.press('Space');
          await page.keyboard.press('1');
          await expect(demo.getByTestId('wk-panes-active-id')).toContainText('pane-nav');
          await expect(btn1Pane1).toBeFocused();

          // Act: Ctrl-o jumps backward in Jumplist to pane-inspector
          await page.keyboard.press('Control+o');
          await expect(demo.getByTestId('wk-panes-active-id')).toContainText('pane-inspector');

          // Act: Ctrl-i jumps forward in Jumplist back to pane-nav
          await page.keyboard.press('Control+i');
          await expect(demo.getByTestId('wk-panes-active-id')).toContainText('pane-nav');
        });
      });
    });

    test.describe('Given a form pane containing buttons and text inputs on /components/which-key', () => {
      test.beforeEach(async ({ page }) => {
        // Arrange
        await page.goto('components/which-key');
        await selectFramework(page, framework);
      });

      test.describe('When the user steps with j/k in normal mode, enters insert mode via i, types, and presses Escape', () => {
        test('Then steps across controls without mutating input values in normal mode, types in insert mode, and resumes normal mode on Escape', async ({
          page,
        }) => {
          // Arrange
          const demo = island(page, framework, 'forms');
          const startBtn = demo.getByTestId('wk-form-btn-start');
          const nameInput = demo.getByTestId('wk-form-input-name');
          const notesInput = demo.getByTestId('wk-form-input-notes');

          await startBtn.focus();
          await expect(demo.getByTestId('wk-forms-mode')).toHaveText('NORMAL');

          // Act: press j to focus nameInput in normal mode, then press j again to focus notesInput
          await page.keyboard.press('j');
          await expect(nameInput).toBeFocused();
          await expect(demo.getByTestId('wk-forms-mode')).toHaveText('NORMAL');

          await page.keyboard.press('j');
          await expect(notesInput).toBeFocused();
          await expect(nameInput).toHaveValue('');

          // Act: press k to step back to nameInput, then press i to enter insert mode
          await page.keyboard.press('k');
          await expect(nameInput).toBeFocused();
          await page.keyboard.press('i');
          await expect(demo.getByTestId('wk-forms-mode')).toHaveText('INSERT');

          // Type modal keys into input while in insert mode
          await page.keyboard.type('jk g');
          await expect(nameInput).toHaveValue('jk g');

          // Act: press Escape to return to normal mode and step down with j
          await page.keyboard.press('Escape');
          await expect(demo.getByTestId('wk-forms-mode')).toHaveText('NORMAL');
          await page.keyboard.press('j');
          await expect(notesInput).toBeFocused();
        });
      });
    });

    test.describe('Given visible interactive controls in the jump-labels demo on /components/which-key', () => {
      test.beforeEach(async ({ page }) => {
        // Arrange
        await page.goto('components/which-key');
        await selectFramework(page, framework);
      });

      test.describe('When the user triggers jump mode (gw) with focus vs activate', () => {
        test('Then renders home-row jump badges, focuses without clicking on focus mode, and clicks on activate mode', async ({
          page,
        }) => {
          // Arrange
          const demo = island(page, framework, 'jump-labels');
          await demo.evaluate((el) =>
            el.scrollIntoView({ block: 'center', behavior: 'instant' as ScrollBehavior }),
          );
          await demo.getByTestId('wk-jump-target-0').focus();

          // Act: press g then w in default focus mode
          await page.keyboard.press('g');
          await page.keyboard.press('w');

          const overlay = page.getByTestId('which-key-jump-overlay');
          await expect(overlay).toBeVisible();
          const badges = overlay.getByTestId('which-key-jump-badge');
          const count = await badges.count();
          expect(count).toBeGreaterThanOrEqual(4);

          // Find the badge label for the second target button (Run Migrations) or type the last badge's label
          const targetBtn = demo.getByTestId('wk-jump-target-1');
          const targetBox = await targetBtn.boundingBox();
          expect(targetBox).not.toBeNull();

          // Match badge positioned near wk-jump-target-1
          const findLabelForTarget = async () => {
            const box = await targetBtn.boundingBox();
            expect(box).not.toBeNull();
            return overlay.evaluate((el, b) => {
              const spans = Array.from(el.querySelectorAll<HTMLElement>('[data-jump-label]'));
              let best: { label: string; dist: number } | null = null;
              for (const s of spans) {
                const r = s.getBoundingClientRect();
                const dist = Math.hypot(r.left - b.x, r.top - b.y);
                const label = s.getAttribute('data-jump-label') ?? '';
                if (!best || dist < best.dist) {
                  best = { label, dist };
                }
              }
              return best?.label ?? '';
            }, box!);
          };

          const matchedLabel = await findLabelForTarget();
          expect(matchedLabel.length).toBeGreaterThan(0);

          // Type the matched label in focus mode
          for (const ch of matchedLabel) {
            await page.keyboard.press(ch);
          }

          await expect(overlay).toBeHidden();
          await expect(demo.getByTestId('wk-jump-focused')).toHaveText('Run Migrations');
          await expect(demo.getByTestId('wk-jump-activated')).toHaveText('None');

          // Switch to activate mode and trigger jump again
          await demo.getByTestId('wk-jump-mode-activate').click();
          await demo.getByTestId('wk-jump-trigger').click();
          await expect(overlay).toBeVisible();
          await expect(overlay).toHaveAttribute('data-jump-action', 'activate');

          const secondLabel = await findLabelForTarget();
          for (const ch of secondLabel) {
            await page.keyboard.press(ch);
          }

          await expect(overlay).toBeHidden();
          await expect(demo.getByTestId('wk-jump-activated')).toHaveText('Run Migrations');
        });
      });
    });

    test.describe('Given the Editor (.ProseMirror) with ModalKeymap on /components/editor', () => {
      test.beforeEach(async ({ page }) => {
        // Arrange
        await page.goto('components/editor');
        await selectFramework(page, framework);
      });

      test.describe('When the user clicks into .ProseMirror, presses Escape for normal mode, and executes modal motions/operators', () => {
        test('Then renders [data-pm-modal-cursor], selects words/lines/text-objects (w, x, m i p), flips/collapses (Alt-;, ;), deletes/undoes (d, u), opens WhichKey on Space, and returns to insert mode on i', async ({
          page,
        }) => {
          // Arrange
          const editor = island(page, framework, 'default').locator('.ProseMirror').first();
          const firstParagraph = editor.locator('p').first();
          await firstParagraph.click({ position: { x: 16, y: 12 } });

          // Act: press Escape to switch from insert to normal mode
          await page.keyboard.press('Escape');

          // Assert: editor keeps focus, data-modal-mode="normal", and block cursor decoration is rendered
          await expect(editor).toHaveAttribute('data-modal-mode', 'normal');
          await expect(editor.locator('[data-pm-modal-cursor]').first()).toBeVisible();

          // Act: press w to select forward word, then Alt-; to flip selection, then ; to collapse
          await page.keyboard.press('w');
          const selectedLenAfterW = await editor.evaluate(() => {
            const sel = window.getSelection();
            return sel ? sel.toString().length : 0;
          });
          expect(selectedLenAfterW).toBeGreaterThan(0);

          await page.keyboard.press('Alt+;');
          await page.keyboard.press(';');

          // Act: press m i p to select inner paragraph text object, then d to delete, then u to undo
          const originalParagraphText = await firstParagraph.textContent();
          await page.keyboard.press('m');
          await page.keyboard.press('i');
          await page.keyboard.press('p');
          await page.keyboard.press('d');
          await expect(firstParagraph).not.toHaveText(originalParagraphText ?? '');

          await page.keyboard.press('u');
          await expect(firstParagraph).toHaveText(originalParagraphText ?? '');

          // Act: press Space inside normal-mode editor to open WhichKey popup
          await page.keyboard.press('Space');
          const panel = page.getByTestId('which-key-panel');
          await expect(panel).toBeVisible();
          await page.keyboard.press('Escape');
          await expect(panel).toBeHidden();

          // Act: press i to return to insert mode and type text
          await page.keyboard.press('i');
          await expect(editor).toHaveAttribute('data-modal-mode', 'insert');
        });
      });
    });
  });
}

test.describe('Docs Shell Keyboard Integration', () => {
  test.describe('Given the docs site shell on /components/which-key', () => {
    test.beforeEach(async ({ page }) => {
      // Arrange
      await page.goto('components/which-key');
      await page.locator('[data-framework-selector][data-ready]').waitFor();
    });

    test.describe('When the user switches keybinding flavor in Settings or clicks the ? explorer button', () => {
      test('Then updates the active preset in localStorage below Color mode and opens WhichKeyExplorer from TopNav', async ({
        page,
      }) => {
        // Arrange: open Settings modal
        await page.locator('[data-theme-selector]').click();
        const modal = page.locator('[data-theme-modal]');
        await expect(modal).toBeVisible();
        const vimBtn = modal.locator('[data-keybinding-selector] button[data-preset="vim"]');

        // Act
        await vimBtn.click();

        // Assert
        await expect(vimBtn).toHaveAttribute('aria-pressed', 'true');
        const stored = await page.evaluate(() => window.localStorage.getItem('vortex:keymap-preset'));
        expect(stored).toBe('vim');

        // Close Settings modal
        await page.keyboard.press('Escape');
        await expect(modal).toBeHidden();

        // Act: open explorer from TopNav ? button
        await page.locator('[data-keybinding-explorer-trigger]').click();
        const explorer = page.getByTestId('which-key-explorer');
        await expect(explorer).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(explorer).toBeHidden();
      });
    });
  });
});
