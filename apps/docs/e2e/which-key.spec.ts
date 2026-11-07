// apps/docs/e2e/which-key.spec.ts
// End-to-end coverage for WhichKey, WhichKeyExplorer, modal presets,
// pane navigation, form normal/insert navigation, ProseMirror ModalKeymap editor,
// and 2D jump labels across React and Svelte.
import { test, expect } from '@playwright/test';
import { FRAMEWORKS, island, selectFramework } from './helpers';

for (const framework of FRAMEWORKS) {
  test.describe(`WhichKey · ${framework}`, () => {
    test.describe('Given a scoped WhichKey with all prefixes enabled (default)', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('components/which-key');
        await selectFramework(page, framework);
      });

      test.describe('When the leader key (Space) is pressed', () => {
        test('Then opens the bottom-right panel with submenu chevrons and top-right Esc/Backspace hints', async ({
          page,
        }) => {
          const demo = island(page, framework, 'default');
          await demo.getByTestId('wk-default-surface').click();
          await page.keyboard.press('Space');

          await expect(demo.getByTestId('wk-default-prefix')).toHaveText('Space');
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

        test('Then drills into a submenu ("Space » w") and steps back on Backspace', async ({ page }) => {
          const demo = island(page, framework, 'default');
          await demo.getByTestId('wk-default-surface').click();
          await page.keyboard.press('Space');
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
        test('Then opens the Go to menu and executes ge and gg motions', async ({ page }) => {
          const demo = island(page, framework, 'default');
          await demo.getByTestId('wk-default-surface').click();

          await page.keyboard.press('g');
          const panel = page.getByTestId('which-key-panel');
          await expect(demo.getByTestId('wk-default-prefix')).toHaveText('g');
          await expect(panel).toBeVisible();
          await page.keyboard.press('e');
          await expect(demo.getByTestId('wk-default-last-action')).toContainText('motion.docEnd');

          await page.keyboard.press('g');
          await page.keyboard.press('g');
          await expect(demo.getByTestId('wk-default-last-action')).toContainText('motion.docStart');
        });
      });
    });

    test.describe('Given a scoped WhichKey with leaderOnly enabled', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('components/which-key');
        await selectFramework(page, framework);
      });

      test.describe('When a non-leader prefix (g) is pressed', () => {
        test('Then keeps the popup hidden while still executing ge and gg chords', async ({ page }) => {
          const demo = island(page, framework, 'default');
          await demo.getByTestId('wk-default-toggle-leader-only').click();
          await expect(demo.getByTestId('wk-default-toggle-leader-only')).toHaveAttribute('aria-pressed', 'true');
          await demo.getByTestId('wk-default-surface').click();

          const panel = page.getByTestId('which-key-panel');
          await page.keyboard.press('g');
          await expect(panel).toBeHidden();
          await page.keyboard.press('e');
          await expect(demo.getByTestId('wk-default-last-action')).toContainText('motion.docEnd');
        });
      });

      test.describe('When the leader key (Space) is pressed', () => {
        test('Then opens the WhichKey popup', async ({ page }) => {
          const demo = island(page, framework, 'default');
          await demo.getByTestId('wk-default-toggle-leader-only').click();
          await demo.getByTestId('wk-default-surface').click();

          const panel = page.getByTestId('which-key-panel');
          await page.keyboard.press('Space');
          await expect(panel).toBeVisible();
          await expect(panel).toHaveAttribute('data-leader-only', 'true');
          await page.keyboard.press('Escape');
          await expect(panel).toBeHidden();
        });
      });
    });

    test.describe('Given WhichKey open inside an active Dialog', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('components/which-key');
        await selectFramework(page, framework);
      });

      test.describe('When Escape is pressed', () => {
        test('Then closes only WhichKey and keeps the Dialog open', async ({ page }) => {
          const demo = island(page, framework, 'default');
          await demo.getByTestId('wk-default-open-dialog').click();
          const dialog = page.getByTestId('wk-default-dialog');
          await expect(dialog).toBeVisible();

          await page.keyboard.press('Space');
          const panel = page.getByTestId('which-key-panel');
          await expect(panel).toBeVisible();
          await page.keyboard.press('Escape');

          await expect(panel).toBeHidden();
          await expect(dialog).toBeVisible();
        });
      });
    });

    test.describe('Given WhichKeyExplorer', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('components/which-key');
        await selectFramework(page, framework);
      });

      test.describe('When opened via ?', () => {
        test('Then lists active preset bindings grouped by category', async ({ page }) => {
          const demo = island(page, framework, 'explorer');
          await demo.getByTestId('wk-explorer-surface').click();
          await page.keyboard.press('?');

          const explorer = page.getByTestId('which-key-explorer');
          await expect(explorer).toBeVisible();
          await expect(explorer.getByTestId('which-key-explorer-input')).toBeVisible();
          await expect(explorer.getByTestId('which-key-explorer-item').first()).toBeVisible();
        });
      });

      test.describe('When filtered with a search query', () => {
        test('Then highlights matches and executes the selected command on Enter', async ({ page }) => {
          const demo = island(page, framework, 'explorer');
          await demo.getByTestId('wk-explorer-trigger').click();
          const explorer = page.getByTestId('which-key-explorer');
          const input = explorer.getByTestId('which-key-explorer-input');
          await expect(explorer).toBeVisible();

          await input.fill('Format Document');
          const items = explorer.getByTestId('which-key-explorer-item');
          await expect(items).toHaveCount(1);
          await expect(items.first().locator('mark').first()).toContainText(/Format/i);

          await input.press('Enter');
          await expect(explorer).toBeHidden();
          await expect(demo.getByTestId('wk-explorer-executed')).toHaveText('demo.formatDocument');
        });
      });

      test.describe('When Escape is pressed', () => {
        test('Then closes the explorer dialog', async ({ page }) => {
          const demo = island(page, framework, 'explorer');
          await demo.getByTestId('wk-explorer-trigger').click();
          const explorer = page.getByTestId('which-key-explorer');
          await expect(explorer).toBeVisible();

          await page.keyboard.press('Escape');
          await expect(explorer).toBeHidden();
        });
      });
    });

    test.describe('Given modal keybinding presets', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('components/which-key');
        await selectFramework(page, framework);
      });

      test.describe('When preset is Helix', () => {
        test('Then opens Go to on g and sticky View mode on Shift+Z', async ({ page }) => {
          const demo = island(page, framework, 'presets');
          await demo.getByTestId('wk-preset-item-0').focus();

          await page.keyboard.press('g');
          const panel = page.getByTestId('which-key-panel');
          await expect(panel).toBeVisible();
          await page.keyboard.press('e');
          await expect(demo.getByTestId('wk-presets-focused-item')).toHaveText('Delta Item');

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
        test('Then executes Vim Shift+G / 0 motions and Kakoune Shift+V view lock', async ({ page }) => {
          const demo = island(page, framework, 'presets');
          await demo.getByTestId('wk-preset-btn-vim').click();
          await demo.getByTestId('wk-preset-item-0').focus();

          await page.keyboard.press('Shift+G');
          await expect(demo.getByTestId('wk-presets-focused-item')).toHaveText('Delta Item');
          await page.keyboard.press('0');
          await expect(demo.getByTestId('wk-presets-focused-item')).toHaveText('Alpha Item');

          await demo.getByTestId('wk-preset-btn-kakoune').click();
          await demo.getByTestId('wk-preset-item-0').focus();
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
      test.beforeEach(async ({ page }) => {
        await page.goto('components/which-key');
        await selectFramework(page, framework);
      });

      test.describe('When navigating panes and Jumplist history', () => {
        test('Then moves focus spatially with Space w l, jumps by index, and traverses history with Ctrl+o and Ctrl+i', async ({
          page,
        }) => {
          const demo = island(page, framework, 'panes');
          const btn1Pane1 = demo.getByTestId('wk-pane-1-btn-2');
          await btn1Pane1.focus();
          await expect(demo.getByTestId('wk-panes-active-id')).toContainText('pane-nav');

          await page.keyboard.press('Space');
          await page.keyboard.press('w');
          await page.keyboard.press('l');
          await expect(demo.getByTestId('wk-panes-active-id')).toContainText('pane-editor');

          await page.keyboard.press('Space');
          await page.keyboard.press('3');
          await expect(demo.getByTestId('wk-panes-active-id')).toContainText('pane-inspector');

          await page.keyboard.press('Space');
          await page.keyboard.press('1');
          await expect(demo.getByTestId('wk-panes-active-id')).toContainText('pane-nav');
          await expect(btn1Pane1).toBeFocused();

          await page.keyboard.press('Control+o');
          await expect(demo.getByTestId('wk-panes-active-id')).toContainText('pane-inspector');

          await page.keyboard.press('Control+i');
          await expect(demo.getByTestId('wk-panes-active-id')).toContainText('pane-nav');
        });
      });
    });

    test.describe('Given form controls inside a WhichKey scope', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('components/which-key');
        await selectFramework(page, framework);
      });

      test.describe('When stepping with j/k in normal mode and entering insert mode via i', () => {
        test('Then steps across controls without mutating input values in normal mode, types in insert mode, and resumes normal mode on Escape', async ({
          page,
        }) => {
          const demo = island(page, framework, 'forms');
          const startBtn = demo.getByTestId('wk-form-btn-start');
          const nameInput = demo.getByTestId('wk-form-input-name');
          const notesInput = demo.getByTestId('wk-form-input-notes');

          await startBtn.focus();
          await expect(demo.getByTestId('wk-forms-mode')).toHaveText(/normal/i);

          await page.keyboard.press('j');
          await expect(nameInput).toBeFocused();
          await expect(demo.getByTestId('wk-forms-mode')).toHaveText(/normal/i);

          await page.keyboard.press('j');
          await expect(notesInput).toBeFocused();
          await expect(nameInput).toHaveValue('');

          await page.keyboard.press('k');
          await expect(nameInput).toBeFocused();
          await page.keyboard.press('i');
          await expect(demo.getByTestId('wk-forms-mode')).toHaveText(/insert/i);

          await page.keyboard.type('jk g');
          await expect(nameInput).toHaveValue('jk g');

          await page.keyboard.press('Escape');
          await expect(demo.getByTestId('wk-forms-mode')).toHaveText(/normal/i);
          await page.keyboard.press('j');
          await expect(notesInput).toBeFocused();
        });
      });
    });

    test.describe('Given 2D jump labels (gw)', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('components/which-key');
        await selectFramework(page, framework);
      });

      test.describe('When triggered in focus mode and activate mode', () => {
        test('Then focuses without clicking in focus mode and clicks in activate mode', async ({ page }) => {
          const demo = island(page, framework, 'jump-labels');
          await demo.evaluate((el) =>
            el.scrollIntoView({ block: 'center', behavior: 'instant' as ScrollBehavior }),
          );
          await demo.getByTestId('wk-jump-target-0').focus();

          await page.keyboard.press('g');
          await page.keyboard.press('w');

          const overlay = page.getByTestId('which-key-jump-overlay');
          await expect(overlay).toBeVisible();
          const badges = overlay.getByTestId('which-key-jump-badge');
          expect(await badges.count()).toBeGreaterThanOrEqual(4);

          const targetBtn = demo.getByTestId('wk-jump-target-1');
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
          await expect(demo.getByTestId('wk-jump-focused')).toHaveText('Run Migrations');
          await expect(demo.getByTestId('wk-jump-activated')).toHaveText('None');

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

    test.describe('Given a ProseMirror editor with ModalKeymap', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('components/editor');
        await selectFramework(page, framework);
      });

      test.describe('When in normal mode', () => {
        test('Then renders the block cursor, selects words and text objects, deletes and undoes, opens WhichKey on Space, and enters insert mode on i', async ({
          page,
        }) => {
          const editor = island(page, framework, 'default').locator('.ProseMirror').first();
          const firstParagraph = editor.locator('p').first();
          await firstParagraph.click({ position: { x: 16, y: 12 } });
          await page.keyboard.press('Escape');

          await expect(editor).toHaveAttribute('data-modal-mode', 'normal');
          await expect(editor.locator('[data-pm-modal-cursor]').first()).toBeVisible();

          await page.keyboard.press('w');
          const selectedLenAfterW = await editor.evaluate(() => window.getSelection()?.toString().length ?? 0);
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
        test('Then expands selection on motions and yanks selected text to clipboard on y', async ({ page }) => {
          await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
          const editor = island(page, framework, 'default').locator('.ProseMirror').first();
          const firstParagraph = editor.locator('p').first();
          await firstParagraph.click({ position: { x: 16, y: 12 } });
          await page.keyboard.press('Escape');
          await page.keyboard.press('g');
          await page.keyboard.press('g');
          await page.keyboard.press('j');
          await page.keyboard.press('0');

          await page.keyboard.press('v');
          await expect(editor).toHaveAttribute('data-modal-mode', 'select');
          await page.keyboard.press('l');
          await page.keyboard.press('ArrowRight');
          const selAfterArrowRight = await editor.evaluate(() => window.getSelection()?.toString() ?? '');
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
