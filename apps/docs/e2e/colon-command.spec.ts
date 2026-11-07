// apps/docs/e2e/colon-command.spec.ts
// End-to-end coverage for ColonCommand across React and Svelte.
import { test, expect } from '@playwright/test';
import { FRAMEWORKS, island, selectFramework } from './helpers';

for (const framework of FRAMEWORKS) {
  test.describe(`ColonCommand · ${framework}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('components/colon-command');
      await selectFramework(page, framework);
    });

    test.describe('Given a modal ColonCommand at the root prompt', () => {
      test.describe('When opened', () => {
        test('Then docks at the bottom of the viewport with the ":" prefix and "Tab Next" hint', async ({ page }) => {
          const demo = island(page, framework, 'default');
          await demo.getByTestId('cc-default-open').click();

          const colon = page.locator('[data-testid="colon-command"][data-modal="true"]').last();
          await expect(colon).toBeVisible();
          await expect(colon.getByTestId('colon-command-prefix')).toHaveText(':');
          await expect(colon.getByTestId('colon-command-input')).toBeFocused();
          await expect(colon).toContainText('Next');

          const viewport = page.viewportSize();
          const box = await colon.boundingBox();
          expect(viewport).not.toBeNull();
          expect(box).not.toBeNull();
          expect(Math.round(box!.y + box!.height)).toBeGreaterThanOrEqual(viewport!.height - 2);
          expect(Math.round(box!.width)).toBe(viewport!.width);
        });

        test('Then renders root command tokens in a column-first completion grid', async ({ page }) => {
          const demo = island(page, framework, 'default');
          await demo.getByTestId('cc-default-open').click();

          const colon = page.locator('[data-testid="colon-command"][data-modal="true"]').last();
          await expect(colon.getByTestId('colon-command-list')).toHaveAttribute('data-columns', 'auto');

          const searchItem = colon.locator('[data-testid="colon-command-item"][data-value="search"]');
          const githubItem = colon.locator('[data-testid="colon-command-item"][data-value="github"]');
          const keybindItem = colon.locator('[data-testid="colon-command-item"][data-value="keybind"]');

          await expect(searchItem).toHaveText('search');
          await expect(githubItem).toHaveText('github');
          await expect(keybindItem).toHaveText('keybind');

          const [searchBox, githubBox, keybindBox] = await Promise.all([
            searchItem.boundingBox(),
            githubItem.boundingBox(),
            keybindItem.boundingBox(),
          ]);
          expect(searchBox).not.toBeNull();
          expect(githubBox).not.toBeNull();
          expect(keybindBox).not.toBeNull();
          expect(Math.abs(searchBox!.x - githubBox!.x)).toBeLessThanOrEqual(2);
          expect(githubBox!.y).toBeGreaterThan(searchBox!.y);
          expect(keybindBox!.x).toBeGreaterThan(searchBox!.x);
        });
      });

      test.describe('When navigating the completion grid with arrow keys', () => {
        test('Then moves vertically within a column on ArrowDown and ArrowUp', async ({ page }) => {
          const demo = island(page, framework, 'default');
          await demo.getByTestId('cc-default-open').click();

          const colon = page.locator('[data-testid="colon-command"][data-modal="true"]').last();
          const searchItem = colon.locator('[data-testid="colon-command-item"][data-value="search"]');
          const githubItem = colon.locator('[data-testid="colon-command-item"][data-value="github"]');
          const themeItem = colon.locator('[data-testid="colon-command-item"][data-value="theme"]');

          await expect(searchItem).toHaveAttribute('data-highlighted', '');
          await page.keyboard.press('ArrowDown');
          await expect(githubItem).toHaveAttribute('data-highlighted', '');
          await page.keyboard.press('ArrowDown');
          await expect(themeItem).toHaveAttribute('data-highlighted', '');
          await page.keyboard.press('ArrowUp');
          await expect(githubItem).toHaveAttribute('data-highlighted', '');
        });

        test('Then moves horizontally across columns on ArrowRight and ArrowLeft', async ({ page }) => {
          const demo = island(page, framework, 'default');
          await demo.getByTestId('cc-default-open').click();

          const colon = page.locator('[data-testid="colon-command"][data-modal="true"]').last();
          const searchItem = colon.locator('[data-testid="colon-command-item"][data-value="search"]');
          const keybindItem = colon.locator('[data-testid="colon-command-item"][data-value="keybind"]');

          await expect(searchItem).toHaveAttribute('data-highlighted', '');
          await page.keyboard.press('ArrowRight');
          await expect(keybindItem).toHaveAttribute('data-highlighted', '');
          await page.keyboard.press('ArrowLeft');
          await expect(searchItem).toHaveAttribute('data-highlighted', '');
        });
      });

      test.describe('When completing tokens with Tab', () => {
        test('Then completes a branch token with a trailing space and lists subcommands', async ({ page }) => {
          const demo = island(page, framework, 'default');
          await demo.getByTestId('cc-default-open').click();

          const colon = page.locator('[data-testid="colon-command"][data-modal="true"]').last();
          const input = colon.getByTestId('colon-command-input');
          await input.fill('th');
          await page.keyboard.press('Tab');

          await expect(input).toHaveValue(':theme ');
          await expect(input).toBeFocused();
          await expect(
            colon.locator('[data-testid="colon-command-item"][data-value="theme/catppuccin"]'),
          ).toBeVisible();
        });

        test('Then cycles leaf completions on repeated Tab presses and executes on Enter', async ({ page }) => {
          const demo = island(page, framework, 'default');
          await demo.getByTestId('cc-default-open').click();

          const colon = page.locator('[data-testid="colon-command"][data-modal="true"]').last();
          const input = colon.getByTestId('colon-command-input');
          await input.fill('th');
          await page.keyboard.press('Tab');
          await page.keyboard.press('Tab');
          await expect(input).toHaveValue(':theme amber-minimal');
          await expect(input).toBeFocused();

          await page.keyboard.press('Tab');
          await expect(input).toHaveValue(':theme amethyst-haze');
          await expect(input).toBeFocused();

          await page.keyboard.press('Enter');
          await expect(colon).toBeHidden();
          await expect(demo.getByTestId('cc-default-selected')).toContainText('Amethyst Haze (:theme amethyst-haze)');
        });

        test('Then allows editing the completed input with Backspace', async ({ page }) => {
          const demo = island(page, framework, 'default');
          await demo.getByTestId('cc-default-open').click();

          const colon = page.locator('[data-testid="colon-command"][data-modal="true"]').last();
          const input = colon.getByTestId('colon-command-input');
          await input.fill('th');
          await page.keyboard.press('Tab');
          await page.keyboard.press('Tab');
          await expect(input).toHaveValue(':theme amber-minimal');

          await page.keyboard.press('Backspace');
          await expect(input).toHaveValue(':theme amber-minima');
        });
      });

      test.describe('When submitting input on Enter', () => {
        test('Then executes a matched leaf command and closes the modal', async ({ page }) => {
          const demo = island(page, framework, 'default');
          await demo.getByTestId('cc-default-open').click();

          const colon = page.locator('[data-testid="colon-command"][data-modal="true"]').last();
          const input = colon.getByTestId('colon-command-input');
          await input.fill('mode dark');
          await input.press('Enter');

          await expect(colon).toBeHidden();
          await expect(demo.getByTestId('cc-default-selected')).toContainText('Dark (:mode dark)');
          await expect(page.getByTestId('toast-item').last()).toContainText('Dark');
        });

        test('Then stays open and displays an inline error for an unrecognized command', async ({ page }) => {
          const demo = island(page, framework, 'default');
          await demo.getByTestId('cc-default-open').click();

          const colon = page.locator('[data-testid="colon-command"][data-modal="true"]').last();
          const input = colon.getByTestId('colon-command-input');
          await input.fill('unknowncmd');
          await input.press('Enter');

          await expect(colon).toBeVisible();
          const errorBanner = colon.getByTestId('colon-command-error');
          await expect(errorBanner).toBeVisible();
          await expect(errorBanner).toContainText('Unknown command: unknowncmd');
        });
      });
    });

    test.describe('Given an inline ColonCommand', () => {
      test.describe('When rendered with commands', () => {
        test('Then renders the completion grid and prompt inline', async ({ page }) => {
          const demo = island(page, framework, 'placements');
          const inlineColon = demo.getByTestId('colon-command');
          await expect(inlineColon).toBeVisible();
          await expect(inlineColon.getByTestId('colon-command-input')).toBeVisible();
          await expect(inlineColon.getByTestId('colon-command-item').first()).toBeVisible();
        });
      });

      test.describe('When rendered with zero commands', () => {
        test('Then displays "No commands registered."', async ({ page }) => {
          const demo = island(page, framework, 'placements');
          const inlineColon = demo.getByTestId('colon-command');
          await demo.getByTestId('cc-placements-toggle-empty').click();

          const emptyState = inlineColon.getByTestId('colon-command-empty');
          await expect(emptyState).toBeVisible();
          await expect(emptyState).toHaveAttribute('data-empty-kind', 'no-commands');
          await expect(emptyState).toContainText('No commands registered.');
        });
      });
    });
  });
}
