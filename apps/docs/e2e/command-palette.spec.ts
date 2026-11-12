// apps/docs/e2e/command-palette.spec.ts
// End-to-end coverage for CommandPalette across React and Svelte.
import { expect, test } from '@playwright/test';
import { FRAMEWORKS, island, selectFramework } from './helpers';

const PALETTE_SHORTCUT = process.platform === 'darwin' ? 'Meta+k' : 'Control+k';

for (const framework of FRAMEWORKS) {
  test.describe(`CommandPalette · ${framework}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('components/command-palette');
      await selectFramework(page, framework);
    });

    test.describe('Given a closed command palette', () => {
      test('it suppresses the fallback trigger and inline anchor box when controlled without a trigger', async ({
        page,
      }) => {
        const triggerlessAnchor = page.locator('[data-command-palette-anchor="true"].contents');
        await expect(triggerlessAnchor).toHaveCount(1);
        await expect(triggerlessAnchor.locator('button')).toHaveCount(0);
      });

      test.describe('When the command palette shortcut is pressed', () => {
        test.beforeEach(async ({ page }) => {
          await page.keyboard.press(PALETTE_SHORTCUT);
        });

        test('it appears in the window', async ({ page }) => {
          const palette = page.locator('[data-testid="command-palette"][data-modal="true"]').last();
          await expect(palette).toBeVisible();
        });

        test('it has input active and in focus', async ({ page }) => {
          const palette = page.locator('[data-testid="command-palette"][data-modal="true"]').last();
          await expect(palette.getByTestId('command-palette-input')).toBeFocused();
        });

        test('it shows empty state when no commands are registered', async ({ page }) => {
          await page.keyboard.press('Escape');
          const emptyDemo = island(page, framework, 'empty');
          await emptyDemo.getByRole('button').focus();
          await page.keyboard.press(PALETTE_SHORTCUT);

          const palette = page.locator('[data-testid="command-palette"][data-modal="true"]').last();
          await expect(palette).toBeVisible();
          const emptyState = palette.getByTestId('command-palette-empty');
          await expect(emptyState).toBeVisible();
          await expect(emptyState).toHaveText('No commands registered.');
        });

        test('it shows commands when commands are registered', async ({ page }) => {
          const palette = page.locator('[data-testid="command-palette"][data-modal="true"]').last();
          await expect(palette.getByText('Search Docs')).toBeVisible();
          await expect(palette.getByText('Future')).toBeVisible();
          await expect(palette.getByText('Change Theme')).toBeVisible();
          await expect(palette.getByText('Change Keybind Style')).toBeVisible();
        });
      });
    });

    test.describe('Given an open command palette', () => {
      test.beforeEach(async ({ page }) => {
        await page.keyboard.press(PALETTE_SHORTCUT);
        const palette = page.locator('[data-testid="command-palette"][data-modal="true"]').last();
        await expect(palette).toBeVisible();
      });

      test.describe('When the user types', () => {
        test.beforeEach(async ({ page }) => {
          const palette = page.locator('[data-testid="command-palette"][data-modal="true"]').last();
          await palette.getByTestId('command-palette-input').fill('cthm');
        });

        test('it continually filters options', async ({ page }) => {
          const palette = page.locator('[data-testid="command-palette"][data-modal="true"]').last();
          const themeItem = palette.locator(
            '[data-testid="command-palette-item"][data-value="theme"]',
          );
          await expect(themeItem).toBeVisible();
          await expect(themeItem.locator('mark').first()).toBeVisible();
          await expect(
            palette.locator('[data-testid="command-palette-item"][data-value="search"]'),
          ).toHaveCount(0);
        });

        test('it shows empty state when no commands match', async ({ page }) => {
          const palette = page.locator('[data-testid="command-palette"][data-modal="true"]').last();
          await palette.getByTestId('command-palette-input').fill('zzzzzz');
          await expect(palette.getByTestId('command-palette-empty')).toBeVisible();
        });
      });

      test.describe('When the user tabs', () => {
        test.beforeEach(async ({ page }) => {
          const palette = page.locator('[data-testid="command-palette"][data-modal="true"]').last();
          await palette.getByTestId('command-palette-input').focus();
          await page.keyboard.press('Tab');
        });

        test('it cycles through matching options', async ({ page }) => {
          const palette = page.locator('[data-testid="command-palette"][data-modal="true"]').last();
          const themeItem = palette.locator(
            '[data-testid="command-palette-item"][data-value="theme"]',
          );
          const modeItem = palette.locator(
            '[data-testid="command-palette-item"][data-value="mode"]',
          );

          await expect(modeItem).toHaveAttribute('data-highlighted', '');

          await page.keyboard.press('Shift+Tab');
          await expect(themeItem).toHaveAttribute('data-highlighted', '');
        });
      });

      test.describe('When the user uses arrow keys', () => {
        test.beforeEach(async ({ page }) => {
          const palette = page.locator('[data-testid="command-palette"][data-modal="true"]').last();
          await palette.getByTestId('command-palette-input').focus();
          await page.keyboard.press('ArrowDown');
        });

        test('it moves the active highlight across options', async ({ page }) => {
          const palette = page.locator('[data-testid="command-palette"][data-modal="true"]').last();
          const themeItem = palette.locator(
            '[data-testid="command-palette-item"][data-value="theme"]',
          );
          const modeItem = palette.locator(
            '[data-testid="command-palette-item"][data-value="mode"]',
          );

          await expect(modeItem).toHaveAttribute('data-highlighted', '');

          await page.keyboard.press('ArrowUp');
          await expect(themeItem).toHaveAttribute('data-highlighted', '');
        });
      });

      test.describe('When the user enters/selects a menu', () => {
        test.beforeEach(async ({ page }) => {
          const palette = page.locator('[data-testid="command-palette"][data-modal="true"]').last();
          await palette.getByTestId('command-palette-input').fill('Change Theme');
          await page.keyboard.press('Enter');
        });

        test('it drills into the submenu and shows breadcrumb pills', async ({ page }) => {
          const palette = page.locator('[data-testid="command-palette"][data-modal="true"]').last();
          await expect(palette.getByTestId('command-palette-breadcrumb')).toContainText(
            'Change Theme',
          );
          await expect(
            palette.locator('[data-testid="command-palette-item"][data-value="theme/catppuccin"]'),
          ).toBeVisible();
        });

        test('it returns to the parent menu on Backspace', async ({ page }) => {
          const palette = page.locator('[data-testid="command-palette"][data-modal="true"]').last();
          await page.keyboard.press('Backspace');
          await expect(palette.getByTestId('command-palette-breadcrumb')).toHaveCount(0);
          await expect(palette.getByText('Search Docs')).toBeVisible();
        });
      });

      test.describe('When a leaf command that focuses an element is selected', () => {
        test.beforeEach(async ({ page }) => {
          const palette = page.locator('[data-testid="command-palette"][data-modal="true"]').last();
          await palette.getByTestId('command-palette-input').fill('Open Settings');
          await page.keyboard.press('Enter');
        });

        test('it closes the command palette and preserves focus on the target element', async ({
          page,
        }) => {
          const palette = page.locator('[data-testid="command-palette"][data-modal="true"]');
          await expect(palette).toHaveCount(0);
          const defaultDemo = island(page, framework, 'default');
          await expect(defaultDemo.getByRole('button')).toBeFocused();
        });
      });
    });

    test.describe('Given a composed inline command palette', () => {
      test.describe('When rendered with custom search and fallback parts', () => {
        test('it displays the custom search placeholder and omits the default footer', async ({
          page,
        }) => {
          const composedDemo = island(page, framework, 'composed');
          const input = composedDemo.getByTestId('command-palette-input');
          await expect(input).toHaveAttribute('placeholder', 'Filter editor actions...');
          await expect(composedDemo.getByText('New File')).toBeVisible();
          await expect(composedDemo.getByText('Navigate')).toHaveCount(0);
        });
      });

      test.describe('When the user filters to zero matching items', () => {
        test.beforeEach(async ({ page }) => {
          const composedDemo = island(page, framework, 'composed');
          await composedDemo.getByTestId('command-palette-input').fill('zzzzzz');
        });

        test('it renders the custom CommandPaletteFallback content', async ({ page }) => {
          const composedDemo = island(page, framework, 'composed');
          const empty = composedDemo.getByTestId('command-palette-empty');
          await expect(empty).toBeVisible();
          await expect(empty).toHaveText('No matching editor actions.');
        });
      });
    });
  });
}
