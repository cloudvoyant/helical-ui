// apps/docs/e2e/which-key.spec.ts
// End-to-end coverage for WhichKey, WhichKeyExplorer, modal presets,
// pane navigation, form normal/insert navigation, ProseMirror ModalKeymap editor,
// and 2D jump labels across React and Svelte.
import { expect, test } from '@playwright/test';
import { FRAMEWORKS, island, selectFramework } from './helpers';

for (const framework of FRAMEWORKS) {
  test.describe(`WhichKey · ${framework}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('components/which-key');
      await selectFramework(page, framework);
    });

    test.describe('Given a scoped WhichKey with all prefixes enabled (default)', () => {
      test.describe('When the leader key (Space) is pressed', () => {
        test.beforeEach(async ({ page }) => {
          const demo = island(page, framework, 'default');
          await demo.locator('[data-pane-id="wk-default-pane"]').click();
          await page.keyboard.press('Space');
        });

        test('it opens the bottom-right panel with submenu chevrons and top-right Esc/Backspace hints', async ({
          page,
        }) => {
          const panel = page.getByTestId('which-key-panel');
          await expect(panel).toBeVisible();
          await expect(panel).toHaveAttribute('data-variant', 'helix');
          await expect(panel.getByTestId('which-key-close')).toBeVisible();
          await expect(panel.getByTestId('which-key-footer')).toHaveText('');

          const windowItem = panel.locator('[data-testid="which-key-item"][data-key="w"]');
          const gotoItem = panel.locator('[data-testid="which-key-item"][data-key="g"]');
          await expect(windowItem).toContainText('Window');
          await expect(windowItem.locator('svg')).toBeVisible();
          await expect(gotoItem).toContainText('Go to');
          await expect(gotoItem.locator('svg')).toBeVisible();
        });

        test('it drills into a submenu ("Space » w") and steps back on Backspace', async ({
          page,
        }) => {
          await page.keyboard.press('w');

          const panel = page.getByTestId('which-key-panel');
          await expect(panel).toBeVisible();
          await expect(panel.getByTestId('which-key-breadcrumb')).toContainText('Space » w');

          await page.keyboard.press('Backspace');
          await expect(panel.getByTestId('which-key-breadcrumb')).toContainText('Space');
          await expect(panel.getByTestId('which-key-breadcrumb')).not.toContainText('Space » w');
        });
      });

      test.describe('When a non-leader prefix (g) is pressed', () => {
        test.beforeEach(async ({ page }) => {
          const demo = island(page, framework, 'default');
          await demo.locator('[data-pane-id="wk-default-pane"]').click();
          await page.keyboard.press('g');
        });

        test('it opens the Go to menu and closes on leaf execution', async ({ page }) => {
          const panel = page.getByTestId('which-key-panel');
          await expect(panel).toBeVisible();
          await page.keyboard.press('e');
          await expect(panel).toBeHidden();
        });
      });
    });

    test.describe('Given a scoped WhichKey with leaderOnly enabled', () => {
      test.describe('When a non-leader prefix (g) is pressed', () => {
        test.beforeEach(async ({ page }) => {
          const demo = island(page, framework, 'leader-only');
          await demo.locator('[data-pane-id="wk-leader-only-pane"]').click();
          await page.keyboard.press('g');
        });

        test('it keeps the popup hidden while multi-key chords remain active', async ({ page }) => {
          const panel = page.getByTestId('which-key-panel');
          await expect(panel).toBeHidden();
          await page.keyboard.press('e');
          await expect(panel).toBeHidden();
        });
      });

      test.describe('When the leader key (Space) is pressed', () => {
        test.beforeEach(async ({ page }) => {
          const demo = island(page, framework, 'leader-only');
          await demo.locator('[data-pane-id="wk-leader-only-pane"]').click();
          await page.keyboard.press('Space');
        });

        test('it opens the WhichKey popup with data-leader-only="true"', async ({ page }) => {
          const panel = page.getByTestId('which-key-panel');
          await expect(panel).toBeVisible();
          await expect(panel).toHaveAttribute('data-leader-only', 'true');
          await page.keyboard.press('Escape');
          await expect(panel).toBeHidden();
        });
      });
    });

    test.describe('Given WhichKey open inside an active Dialog', () => {
      test.describe('When Escape is pressed', () => {
        test.beforeEach(async ({ page }) => {
          const demo = island(page, framework, 'modal-interaction');
          await demo.getByRole('button', { name: 'Open Modal Dialog' }).first().click();
          await expect(page.getByRole('dialog', { name: 'Nested Modal Layer' })).toBeVisible();
          await page.keyboard.press('Space');
          await expect(page.getByTestId('which-key-panel')).toBeVisible();
          await page.keyboard.press('Escape');
        });

        test('it closes only WhichKey and keeps the Dialog open', async ({ page }) => {
          await expect(page.getByTestId('which-key-panel')).toBeHidden();
          await expect(page.getByRole('dialog', { name: 'Nested Modal Layer' })).toBeVisible();
        });
      });

      test.describe('When a command opens the Dialog with WhichKey enabled', () => {
        test.beforeEach(async ({ page }) => {
          const demo = island(page, framework, 'modal-interaction');
          await demo.getByRole('button', { name: 'Run Command' }).click();
          const menu = page.locator('[data-testid="command-menu"][data-modal="true"]').last();
          await expect(menu).toBeVisible();
          const input = menu.getByTestId('command-menu-input');
          await expect(input).toBeFocused();
          await input.press('Enter');
        });

        test('it closes the command menu and retains focus inside the newly opened Dialog', async ({
          page,
        }) => {
          const dialog = page.getByRole('dialog', { name: 'Nested Modal Layer' });
          await expect(dialog).toBeVisible();
          await expect(dialog.locator('button').first()).toBeFocused();
        });
      });
    });

    test.describe('Given WhichKeyExplorer', () => {
      test.describe('When opened via ?', () => {
        test.beforeEach(async ({ page }) => {
          const demo = island(page, framework, 'explorer');
          await demo.locator('[data-pane-id="wk-explorer-pane"]').click();
          await page.keyboard.press('?');
        });

        test('it lists active preset bindings grouped by category', async ({ page }) => {
          const explorer = page.getByTestId('which-key-explorer');
          await expect(explorer).toBeVisible();
          await expect(explorer.getByTestId('which-key-explorer-input')).toBeVisible();
          await expect(explorer.getByTestId('which-key-explorer-item').first()).toBeVisible();
        });
      });

      test.describe('When filtered with a search query', () => {
        test.beforeEach(async ({ page }) => {
          const demo = island(page, framework, 'explorer');
          await demo.getByRole('button', { name: /Open Explorer/i }).click();
          const explorer = page.getByTestId('which-key-explorer');
          await expect(explorer).toBeVisible();
          await explorer.getByTestId('which-key-explorer-input').fill('Format Document');
        });

        test('it highlights matches and closes on Enter', async ({ page }) => {
          const explorer = page.getByTestId('which-key-explorer');
          const input = explorer.getByTestId('which-key-explorer-input');
          const items = explorer.getByTestId('which-key-explorer-item');
          await expect(items).toHaveCount(1);
          await expect(items.first().locator('mark').first()).toContainText(/Format/i);

          await input.press('Enter');
          await expect(explorer).toBeHidden();
        });
      });

      test.describe('When Escape is pressed', () => {
        test.beforeEach(async ({ page }) => {
          const demo = island(page, framework, 'explorer');
          await demo.getByRole('button', { name: /Open Explorer/i }).click();
          await expect(page.getByTestId('which-key-explorer')).toBeVisible();
          await page.keyboard.press('Escape');
        });

        test('it closes the explorer dialog', async ({ page }) => {
          await expect(page.getByTestId('which-key-explorer')).toBeHidden();
        });
      });
    });

    test.describe('Given modal keybinding presets', () => {
      test.describe('When preset is Helix', () => {
        test.beforeEach(async ({ page }) => {
          const demo = island(page, framework, 'presets');
          await demo.getByRole('button', { name: 'Alpha Item' }).focus();
        });

        test('it opens Go to on g, focuses the last item on ge, and enters sticky View mode on Shift+Z', async ({
          page,
        }) => {
          const demo = island(page, framework, 'presets');
          await page.keyboard.press('g');
          const panel = page.getByTestId('which-key-panel');
          await expect(panel).toBeVisible();
          await page.keyboard.press('e');
          await expect(demo.getByRole('button', { name: 'Delta Item' })).toBeFocused();

          await page.keyboard.press('Shift+Z');
          await expect(panel).toBeVisible();
          await expect(panel).toHaveAttribute('data-sticky', 'true');
          await page.keyboard.press('j');
          await expect(panel).toBeVisible();
          await page.keyboard.press('Escape');
          await expect(panel).toBeHidden();
        });
      });

      test.describe('When preset is Vim or Kakoune', () => {
        test('it executes Vim Shift+G / 0 motions and Kakoune Shift+V view lock', async ({
          page,
        }) => {
          const demo = island(page, framework, 'presets');
          await demo.getByRole('radio', { name: 'VIM' }).click();
          await demo.getByRole('button', { name: 'Alpha Item' }).focus();

          await page.keyboard.press('Shift+G');
          await expect(demo.getByRole('button', { name: 'Delta Item' })).toBeFocused();
          await page.keyboard.press('0');
          await expect(demo.getByRole('button', { name: 'Alpha Item' })).toBeFocused();

          await demo.getByRole('radio', { name: 'KAKOUNE' }).click();
          await demo.getByRole('button', { name: 'Alpha Item' }).focus();
          await page.keyboard.press('Shift+V');
          const panel = page.getByTestId('which-key-panel');
          await expect(panel).toBeVisible();
          await expect(panel).toHaveAttribute('data-sticky', 'true');
          await page.keyboard.press('Escape');
          await expect(panel).toBeHidden();
        });
      });
    });

    test.describe('Given registered panes and Jumplist', () => {
      test.describe('When navigating panes and Jumplist history', () => {
        test.beforeEach(async ({ page }) => {
          const demo = island(page, framework, 'panes');
          await demo.getByRole('button', { name: 'src/controller.ts' }).focus();
        });

        test('it moves focus spatially with Space w l, jumps by index, and traverses history with Ctrl+o and Ctrl+i', async ({
          page,
        }) => {
          const demo = island(page, framework, 'panes');
          const navBtn = demo.getByRole('button', { name: 'src/controller.ts' });
          const editorBtn = demo.getByRole('button', { name: 'Buffer Tab A' });
          const inspectorBtn = demo.getByRole('button', { name: 'AST Symbols' });

          await page.keyboard.press('Space');
          await page.keyboard.press('w');
          await page.keyboard.press('l');
          await expect(editorBtn).toBeFocused();

          await page.keyboard.press('Space');
          await page.keyboard.press('3');
          await expect(inspectorBtn).toBeFocused();

          await page.keyboard.press('Space');
          await page.keyboard.press('1');
          await expect(navBtn).toBeFocused();

          await page.keyboard.press('Control+o');
          await expect(inspectorBtn).toBeFocused();

          await page.keyboard.press('Control+i');
          await expect(navBtn).toBeFocused();
        });
      });
    });

    test.describe('Given form controls inside a WhichKey scope', () => {
      test.describe('When stepping with j/k in normal mode and entering insert mode via i', () => {
        test.beforeEach(async ({ page }) => {
          const demo = island(page, framework, 'forms');
          await demo.getByRole('button', { name: /Focus Anchor Button/i }).focus();
        });

        test('it steps across controls without mutating input values in normal mode, types in insert mode, and resumes normal mode on Escape', async ({
          page,
        }) => {
          const demo = island(page, framework, 'forms');
          const nameInput = demo.getByPlaceholder(/Project name/i);
          const notesInput = demo.getByPlaceholder(/Commit notes/i);
          const modeBadge = demo.getByTestId('which-key-mode-badge');

          await expect(modeBadge).toHaveText(/normal/i);

          await page.keyboard.press('j');
          await expect(nameInput).toBeFocused();
          await expect(modeBadge).toHaveText(/normal/i);

          await page.keyboard.press('j');
          await expect(notesInput).toBeFocused();
          await expect(nameInput).toHaveValue('');

          await page.keyboard.press('k');
          await expect(nameInput).toBeFocused();
          await page.keyboard.press('i');
          await expect(modeBadge).toHaveText(/insert/i);

          await page.keyboard.type('jk g');
          await expect(nameInput).toHaveValue('jk g');

          await page.keyboard.press('Escape');
          await expect(modeBadge).toHaveText(/normal/i);
          await page.keyboard.press('j');
          await expect(notesInput).toBeFocused();
        });
      });
    });

    test.describe('Given 2D jump labels (gw)', () => {
      test.describe('When triggered in focus mode and activate mode', () => {
        test.beforeEach(async ({ page }) => {
          const demo = island(page, framework, 'jump-labels');
          await demo.evaluate((el) =>
            el.scrollIntoView({ block: 'center', behavior: 'instant' as ScrollBehavior }),
          );
          await demo.getByRole('button', { name: 'Deploy Service' }).focus();
        });

        test('it focuses without clicking in focus mode and clicks in activate mode', async ({
          page,
        }) => {
          const demo = island(page, framework, 'jump-labels');
          await page.keyboard.press('g');
          await page.keyboard.press('w');

          const overlay = page.getByTestId('which-key-jump-overlay');
          await expect(overlay).toBeVisible();
          const badges = overlay.getByTestId('which-key-jump-badge');
          expect(await badges.count()).toBeGreaterThanOrEqual(4);

          const targetBtn = demo.getByRole('button', { name: 'Run Migrations' });
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

          for (const ch of matchedLabel) {
            await page.keyboard.press(ch);
          }

          await expect(overlay).toBeHidden();
          await expect(targetBtn).toBeFocused();
          await expect(targetBtn).toHaveAttribute('aria-pressed', 'false');

          await demo.getByRole('radio', { name: 'jumpAction: activate' }).click();
          await demo.getByRole('button', { name: /Trigger Jump/i }).click();
          await expect(overlay).toBeVisible();
          await expect(overlay).toHaveAttribute('data-jump-action', 'activate');

          const secondLabel = await findLabelForTarget();
          for (const ch of secondLabel) {
            await page.keyboard.press(ch);
          }

          await expect(overlay).toBeHidden();
          await expect(targetBtn).toHaveAttribute('aria-pressed', 'true');
        });
      });
    });

    test.describe('Given a ProseMirror editor with ModalKeymap', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('components/editor');
        await selectFramework(page, framework);
      });

      test.describe('When in normal mode', () => {
        test.beforeEach(async ({ page }) => {
          const editor = island(page, framework, 'default').locator('.ProseMirror').first();
          const firstParagraph = editor.locator('p').first();
          await firstParagraph.click({ position: { x: 16, y: 12 } });
          await page.keyboard.press('Escape');
        });

        test('it renders the block cursor, selects words and text objects, deletes and undoes, opens WhichKey on Space, and enters insert mode on i', async ({
          page,
        }) => {
          const editor = island(page, framework, 'default').locator('.ProseMirror').first();
          const firstParagraph = editor.locator('p').first();

          await expect(editor).toHaveAttribute('data-modal-mode', 'normal');
          await expect(editor.locator('[data-pm-modal-cursor]').first()).toBeVisible();

          await page.keyboard.press('w');
          const selectedLenAfterW = await editor.evaluate(
            () => window.getSelection()?.toString().length ?? 0,
          );
          expect(selectedLenAfterW).toBeGreaterThan(0);

          await page.keyboard.press('Alt+;');
          await page.keyboard.press(';');

          const originalParagraphText = await firstParagraph.textContent();
          await page.keyboard.press('m');
          await page.keyboard.press('i');
          await page.keyboard.press('p');
          await page.keyboard.press('d');
          await expect(firstParagraph).not.toHaveText(originalParagraphText ?? '');

          await page.keyboard.press('u');
          await expect(firstParagraph).toHaveText(originalParagraphText ?? '');

          await page.keyboard.press('Space');
          const panel = page.getByTestId('which-key-panel');
          await expect(panel).toBeVisible();
          await page.keyboard.press('Escape');
          await expect(panel).toBeHidden();

          await page.keyboard.press('i');
          await expect(editor).toHaveAttribute('data-modal-mode', 'insert');
        });
      });

      test.describe('When in select mode (v or x)', () => {
        test.beforeEach(async ({ page }) => {
          await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
          const editor = island(page, framework, 'default').locator('.ProseMirror').first();
          const firstParagraph = editor.locator('p').first();
          await firstParagraph.click({ position: { x: 16, y: 12 } });
          await page.keyboard.press('Escape');
          await page.keyboard.press('g');
          await page.keyboard.press('g');
          await page.keyboard.press('j');
          await page.keyboard.press('0');
        });

        test('it expands selection on motions and yanks selected text to clipboard on y', async ({
          page,
        }) => {
          const editor = island(page, framework, 'default').locator('.ProseMirror').first();
          const firstParagraph = editor.locator('p').first();

          await page.keyboard.press('v');
          await expect(editor).toHaveAttribute('data-modal-mode', 'select');
          await page.keyboard.press('l');
          await page.keyboard.press('ArrowRight');
          const selAfterArrowRight = await editor.evaluate(
            () => window.getSelection()?.toString() ?? '',
          );
          expect(selAfterArrowRight.length).toBe(3);

          await page.keyboard.press('y');
          await expect(editor).toHaveAttribute('data-modal-mode', 'normal');
          const clipboardAfterV = await page.evaluate(() => navigator.clipboard.readText());
          expect(clipboardAfterV).toBe(selAfterArrowRight);

          const expectedLineText = (await firstParagraph.textContent()) ?? '';
          await page.keyboard.press('x');
          await expect(editor).toHaveAttribute('data-modal-mode', 'select');
          await page.keyboard.press('y');
          await expect(editor).toHaveAttribute('data-modal-mode', 'normal');
          const clipboardAfterX = await page.evaluate(() => navigator.clipboard.readText());
          expect(clipboardAfterX).toBe(expectedLineText);
        });
      });
    });
  });
}
