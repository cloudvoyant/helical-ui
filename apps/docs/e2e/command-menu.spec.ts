// apps/docs/e2e/command-menu.spec.ts
// End-to-end coverage for CommandMenu across React and Svelte.
import { expect, test } from '@playwright/test';
import { FRAMEWORKS, island, selectFramework } from './helpers';

for (const framework of FRAMEWORKS) {
  test.describe(`CommandMenu · ${framework}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('components/command-menu');
      await selectFramework(page, framework);
    });

    test.describe('Given a closed command menu', () => {
      test.describe('When colon is pressed', () => {
        test.beforeEach(async ({ page }) => {
          await page.keyboard.press(':');
        });

        test('it appears at the bottom of the window', async ({ page }) => {
          const menu = page.locator('[data-testid="command-menu"][data-modal="true"]').last();
          await expect(menu).toBeVisible();

          const viewport = page.viewportSize();
          const box = await menu.boundingBox();
          expect(viewport).not.toBeNull();
          expect(box).not.toBeNull();
          expect(Math.abs(box!.y + box!.height - viewport!.height)).toBeLessThanOrEqual(2);
          expect(box!.x).toBeLessThanOrEqual(2);
          expect(Math.abs(box!.width - viewport!.width)).toBeLessThanOrEqual(2);
        });

        test('it has input active and in focus', async ({ page }) => {
          const menu = page.locator('[data-testid="command-menu"][data-modal="true"]').last();
          await expect(menu.getByTestId('command-menu-prefix')).toHaveText(':');
          await expect(menu.getByTestId('command-menu-input')).toBeFocused();
        });

        test('it shows empty state when no commands are registered', async ({ page }) => {
          await page.keyboard.press('Escape');
          const emptyDemo = island(page, framework, 'empty');
          await emptyDemo.getByRole('button').focus();
          await page.keyboard.press(':');

          const menu = page.locator('[data-testid="command-menu"][data-modal="true"]').last();
          await expect(menu).toBeVisible();
          const emptyState = menu.getByTestId('command-menu-empty');
          await expect(emptyState).toBeVisible();
          await expect(emptyState).toHaveText('No commands registered.');
        });

        test('it shows commands when commands are registered', async ({ page }) => {
          const menu = page.locator('[data-testid="command-menu"][data-modal="true"]').last();
          await expect(menu.getByTestId('command-menu-list')).toHaveAttribute('data-columns', 'auto');
          await expect(
            menu.locator('[data-testid="command-menu-item"][data-value="search"]'),
          ).toBeVisible();
          await expect(
            menu.locator('[data-testid="command-menu-item"][data-value="theme"]'),
          ).toBeVisible();
          await expect(
            menu.locator('[data-testid="command-menu-item"][data-value="keybind"]'),
          ).toBeVisible();
        });
      });
    });

    test.describe('Given an open command menu', () => {
      test.beforeEach(async ({ page }) => {
        await page.keyboard.press(':');
        const menu = page.locator('[data-testid="command-menu"][data-modal="true"]').last();
        await expect(menu).toBeVisible();
      });

      test.describe('When the user types', () => {
        test.beforeEach(async ({ page }) => {
          const menu = page.locator('[data-testid="command-menu"][data-modal="true"]').last();
          await menu.getByTestId('command-menu-input').fill('th');
        });

        test('it continually filters options', async ({ page }) => {
          const menu = page.locator('[data-testid="command-menu"][data-modal="true"]').last();
          await expect(
            menu.locator('[data-testid="command-menu-item"][data-value="theme"]'),
          ).toBeVisible();
          await expect(
            menu.locator('[data-testid="command-menu-item"][data-value="search"]'),
          ).toHaveCount(0);
        });

        test('it shows empty state when no commands match', async ({ page }) => {
          const menu = page.locator('[data-testid="command-menu"][data-modal="true"]').last();
          await menu.getByTestId('command-menu-input').fill('notacommand');
          await expect(menu.getByTestId('command-menu-empty')).toBeVisible();
        });
      });

      test.describe('When the user tabs', () => {
        test.beforeEach(async ({ page }) => {
          await page.keyboard.press('Tab');
        });

        test('it cycles through matching options and updates the input value', async ({ page }) => {
          const menu = page.locator('[data-testid="command-menu"][data-modal="true"]').last();
          const input = menu.getByTestId('command-menu-input');
          const themeItem = menu.locator('[data-testid="command-menu-item"][data-value="theme"]');
          const modeItem = menu.locator('[data-testid="command-menu-item"][data-value="mode"]');

          await expect(input).toHaveValue('theme');
          await expect(themeItem).toHaveAttribute('data-highlighted', '');

          await page.keyboard.press('Tab');
          await expect(input).toHaveValue('mode');
          await expect(modeItem).toHaveAttribute('data-highlighted', '');

          await page.keyboard.press('Shift+Tab');
          await expect(input).toHaveValue('theme');
          await expect(themeItem).toHaveAttribute('data-highlighted', '');
        });
      });

      test.describe('When the user uses arrow keys', () => {
        test.beforeEach(async ({ page }) => {
          const menu = page.locator('[data-testid="command-menu"][data-modal="true"]').last();
          await menu.getByTestId('command-menu-input').focus();
          await page.keyboard.press('ArrowDown');
        });

        test('it moves the active highlight across options', async ({ page }) => {
          const menu = page.locator('[data-testid="command-menu"][data-modal="true"]').last();
          const themeItem = menu.locator('[data-testid="command-menu-item"][data-value="theme"]');
          const modeItem = menu.locator('[data-testid="command-menu-item"][data-value="mode"]');
          const searchItem = menu.locator('[data-testid="command-menu-item"][data-value="search"]');

          await expect(modeItem).toHaveAttribute('data-highlighted', '');

          await page.keyboard.press('ArrowUp');
          await expect(themeItem).toHaveAttribute('data-highlighted', '');

          await page.keyboard.press('ArrowRight');
          await expect(searchItem).toHaveAttribute('data-highlighted', '');
        });
      });

      test.describe('When the user enters/selects a menu', () => {
        test.beforeEach(async ({ page }) => {
          const menu = page.locator('[data-testid="command-menu"][data-modal="true"]').last();
          await menu.getByTestId('command-menu-input').fill('theme');
          await page.keyboard.press('Enter');
        });

        test('it drills into the submenu and updates the input prefix', async ({ page }) => {
          const menu = page.locator('[data-testid="command-menu"][data-modal="true"]').last();
          const input = menu.getByTestId('command-menu-input');

          await expect(input).toHaveValue('theme ');
          await expect(
            menu.locator('[data-testid="command-menu-item"][data-value="theme/catppuccin"]'),
          ).toBeVisible();
          await expect(
            menu.locator('[data-testid="command-menu-item"][data-value="theme/dracula"]'),
          ).toBeVisible();
        });
      });

      test.describe('When the user types command manually', () => {
        test('it continually filters options', async ({ page }) => {
          const menu = page.locator('[data-testid="command-menu"][data-modal="true"]').last();
          const input = menu.getByTestId('command-menu-input');

          await input.fill('key');
          await expect(
            menu.locator('[data-testid="command-menu-item"][data-value="keybind"]'),
          ).toBeVisible();
          await expect(
            menu.locator('[data-testid="command-menu-item"][data-value="search"]'),
          ).toHaveCount(0);

          await input.fill('keybind v');
          await expect(
            menu.locator('[data-testid="command-menu-item"][data-value="keybind/vim"]'),
          ).toBeVisible();
          await expect(
            menu.locator('[data-testid="command-menu-item"][data-value="keybind/helix"]'),
          ).toHaveCount(0);
        });

        test('it auto selects submenus', async ({ page }) => {
          const menu = page.locator('[data-testid="command-menu"][data-modal="true"]').last();
          const input = menu.getByTestId('command-menu-input');

          await input.fill('theme ');
          const catppuccinItem = menu.locator(
            '[data-testid="command-menu-item"][data-value="theme/catppuccin"]',
          );
          await expect(catppuccinItem).toBeVisible();
          await expect(catppuccinItem).toHaveAttribute('data-highlighted', '');
        });
      });

      test.describe('When a leaf command that focuses an element is selected', () => {
        test.beforeEach(async ({ page }) => {
          const menu = page.locator('[data-testid="command-menu"][data-modal="true"]').last();
          await menu.getByTestId('command-menu-input').fill('settings');
          await page.keyboard.press('Enter');
        });

        test('it closes the command menu and preserves focus on the target element', async ({
          page,
        }) => {
          const menu = page.locator('[data-testid="command-menu"][data-modal="true"]');
          await expect(menu).toHaveCount(0);
          const defaultDemo = island(page, framework, 'default');
          await expect(defaultDemo.getByRole('button')).toBeFocused();
        });
      });
    });

    test.describe('Given an inline command menu with aliases', () => {
      test('it displays aliases in the trailing slot when showAliases is enabled and hides them when disabled', async ({
        page,
      }) => {
        const aliasesDemo = island(page, framework, 'aliases');
        const writeItem = aliasesDemo.locator('[data-testid="command-menu-item"][data-value="write"]');
        const writeAliases = writeItem.getByTestId('command-menu-item-aliases');

        await expect(writeAliases).toBeVisible();
        await expect(writeAliases).toHaveText('w');

        await aliasesDemo.getByRole('radio', { name: 'Hide Aliases' }).click();
        await expect(writeAliases).toHaveCount(0);

        await aliasesDemo.getByRole('radio', { name: 'Show Aliases' }).click();
        await expect(writeAliases).toBeVisible();
        await expect(writeAliases).toHaveText('w');

        await page.keyboard.press('Space');
        await expect(page.getByTestId('which-key-panel')).toBeVisible();
        await page.keyboard.press('Escape');
      });
    });
  });
}
