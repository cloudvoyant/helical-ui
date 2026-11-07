// apps/docs/e2e/command-palette.spec.ts
// End-to-end coverage for CommandPalette across React and Svelte.
import { test, expect } from '@playwright/test';
import { FRAMEWORKS, island, selectFramework } from './helpers';

for (const framework of FRAMEWORKS) {
  test.describe(`CommandPalette · ${framework}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('components/command-palette');
      await selectFramework(page, framework);
    });

    test.describe('Given a modal CommandPalette with nested commands', () => {
      test.describe('When opened', () => {
        test('Then centers in the viewport and focuses the search input', async ({ page }) => {
          const demo = island(page, framework, 'default');
          await demo.getByTestId('cp-default-open').click();

          const palette = page.locator('[data-testid="command-palette"][data-modal="true"]').last();
          await expect(palette).toBeVisible();
          await expect(palette.getByTestId('command-palette-input')).toBeFocused();

          const viewport = page.viewportSize();
          const box = await palette.boundingBox();
          expect(viewport).not.toBeNull();
          expect(box).not.toBeNull();
          const paletteCenterY = box!.y + box!.height / 2;
          const viewportCenterY = viewport!.height / 2;
          expect(Math.abs(paletteCenterY - viewportCenterY)).toBeLessThanOrEqual(40);
        });

        test('Then lists root commands with badges and without colon prefixes', async ({ page }) => {
          const demo = island(page, framework, 'default');
          await demo.getByTestId('cp-default-open').click();

          const palette = page.locator('[data-testid="command-palette"][data-modal="true"]').last();
          const searchItem = palette.locator('[data-testid="command-palette-item"][data-value="search"]');
          await expect(searchItem).toBeVisible();
          await expect(searchItem).toContainText('Search Docs');
          await expect(searchItem).toContainText('Future');
          await expect(searchItem).not.toContainText(':search');

          const themeItem = palette.locator('[data-testid="command-palette-item"][data-value="theme"]');
          await expect(themeItem).toContainText('Change Theme');
          await expect(themeItem).not.toContainText(':theme');
        });
      });

      test.describe('When navigating with the keyboard', () => {
        test('Then cycles through items on Tab and selects the highlighted item on Enter', async ({ page }) => {
          const demo = island(page, framework, 'default');
          await demo.getByTestId('cp-default-open').click();

          const palette = page.locator('[data-testid="command-palette"][data-modal="true"]').last();
          const searchItem = palette.locator('[data-testid="command-palette-item"][data-value="search"]');
          const githubItem = palette.locator('[data-testid="command-palette-item"][data-value="github"]');

          await expect(searchItem).toHaveAttribute('data-highlighted', '');
          await page.keyboard.press('Tab');
          await expect(githubItem).toHaveAttribute('data-highlighted', '');
          await page.keyboard.press('Shift+Tab');
          await expect(searchItem).toHaveAttribute('data-highlighted', '');

          await page.keyboard.press('Enter');
          await expect(palette).toBeHidden();
          await expect(page.getByTestId('toast-item').last()).toContainText('Search Docs');
        });

        test('Then closes the dialog on Escape', async ({ page }) => {
          const demo = island(page, framework, 'default');
          await demo.getByTestId('cp-default-open').click();

          const palette = page.locator('[data-testid="command-palette"][data-modal="true"]').last();
          await expect(palette).toBeVisible();
          await palette.getByTestId('command-palette-input').press('Escape');
          await expect(palette).toBeHidden();
        });
      });

      test.describe('When a branch command is selected', () => {
        test('Then drills into child commands and shows a breadcrumb badge', async ({ page }) => {
          const demo = island(page, framework, 'default');
          await demo.getByTestId('cp-default-open').click();

          const palette = page.locator('[data-testid="command-palette"][data-modal="true"]').last();
          await palette.locator('[data-testid="command-palette-item"][data-value="theme"]').click();

          await expect(palette.getByTestId('command-palette-breadcrumbs')).toContainText('Change Theme');
          await expect(
            palette.locator('[data-testid="command-palette-item"][data-value="theme/catppuccin"]'),
          ).toBeVisible();
        });

        test('Then returns to the parent level on Backspace when the input is empty', async ({ page }) => {
          const demo = island(page, framework, 'default');
          await demo.getByTestId('cp-default-open').click();

          const palette = page.locator('[data-testid="command-palette"][data-modal="true"]').last();
          await palette.locator('[data-testid="command-palette-item"][data-value="theme"]').click();
          await expect(palette.getByTestId('command-palette-breadcrumbs')).toContainText('Change Theme');

          await palette.getByTestId('command-palette-input').press('Backspace');
          await expect(palette.getByTestId('command-palette-breadcrumbs')).toHaveCount(0);
          await expect(palette.locator('[data-testid="command-palette-item"][data-value="theme"]')).toBeVisible();
        });
      });

      test.describe('When a theme command is selected', () => {
        test('Then applies the theme to the document and updates the active checkmark', async ({ page }) => {
          const demo = island(page, framework, 'default');
          await demo.getByTestId('cp-default-open').click();

          const palette = page.locator('[data-testid="command-palette"][data-modal="true"]').last();
          await palette.locator('[data-testid="command-palette-item"][data-value="theme"]').click();
          await palette.locator('[data-testid="command-palette-item"][data-value="theme/catppuccin"]').click();

          await expect(palette).toBeHidden();
          await expect(page.locator('html')).toHaveClass(/theme-catppuccin/);

          await demo.getByTestId('cp-default-open').click();
          await palette.locator('[data-testid="command-palette-item"][data-value="theme"]').click();

          const catppuccinItem = palette.locator('[data-testid="command-palette-item"][data-value="theme/catppuccin"]');
          const defaultThemeItem = palette.locator(
            '[data-testid="command-palette-item"][data-value="theme/helical-ui"]',
          );
          await expect(catppuccinItem).toHaveAttribute('data-command-active', 'true');
          await expect(defaultThemeItem).not.toHaveAttribute('data-command-active', 'true');
        });
      });

      test.describe('When filtering with a fuzzy search query', () => {
        test('Then ranks matching nested commands with <mark> highlights and ancestor path', async ({ page }) => {
          const demo = island(page, framework, 'default');
          await demo.getByTestId('cp-default-open').click();

          const palette = page.locator('[data-testid="command-palette"][data-modal="true"]').last();
          await palette.getByTestId('command-palette-input').fill('catp');

          const catppuccinItem = palette.locator('[data-testid="command-palette-item"][data-value="theme/catppuccin"]');
          await expect(catppuccinItem).toBeVisible();
          await expect(catppuccinItem).toContainText('Change Theme ›');
          await expect(catppuccinItem.locator('mark').first()).toBeVisible();
        });

        test('Then executes the top match on Enter and closes the dialog', async ({ page }) => {
          const demo = island(page, framework, 'default');
          await demo.getByTestId('cp-default-open').click();

          const palette = page.locator('[data-testid="command-palette"][data-modal="true"]').last();
          const input = palette.getByTestId('command-palette-input');
          await input.fill('catp');
          await input.press('Enter');

          await expect(palette).toBeHidden();
          await expect(page.locator('html')).toHaveClass(/theme-catppuccin/);
          await expect(page.getByTestId('toast-item').last()).toContainText('Catppuccin');
        });
      });
    });

    test.describe('Given a modal CommandPalette with zero commands', () => {
      test.describe('When opened', () => {
        test('Then displays "No commands registered."', async ({ page }) => {
          const demo = island(page, framework, 'empty');
          await demo.getByTestId('cp-empty-open').click();

          const palette = page.locator('[data-testid="command-palette"][data-modal="true"]').last();
          await expect(palette).toBeVisible();

          const emptyState = palette.getByTestId('command-palette-empty');
          await expect(emptyState).toBeVisible();
          await expect(emptyState).toHaveAttribute('data-empty-kind', 'no-commands');
          await expect(emptyState).toContainText('No commands registered.');
        });
      });
    });
  });
}
