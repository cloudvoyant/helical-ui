// apps/docs/e2e/colon-command.spec.ts
// BDD end-to-end coverage for ColonCommand across React and Svelte:
// default modal trigger, Tab completion and nested subcommand drill-down,
// direct ":mode dark" leaf execution, inline "Unknown command:" error diagnostic,
// empty commands UI state ("No commands registered."), and docs normal-mode ":" trigger.
import { test, expect } from '@playwright/test';
import { FRAMEWORKS, island, selectFramework } from './helpers';

// --- Tests ---

for (const framework of FRAMEWORKS) {
  test.describe(`ColonCommand · ${framework}`, () => {
    test.describe('Given the ColonCommand page (/components/colon-command)', () => {
      test.beforeEach(async ({ page }) => {
        // Arrange
        await page.goto('components/colon-command');
        await selectFramework(page, framework);
      });

      test.describe('When the user opens the Default ColonCommand demo', () => {
        test('Then renders the ":" prompt docked at the bottom of the viewport with a column-first completion grid (search, github, theme, mode, keybind, framework) and "Tab Next" hint', async ({
          page,
        }) => {
          // Arrange
          const sidebar = page.locator('[data-pane-id="docs-sidebar"]');
          await expect(sidebar.getByRole('link', { name: 'Command Palette' })).toBeVisible();
          await expect(sidebar.getByRole('link', { name: 'Command Menu' })).toBeVisible();
          const demo = island(page, framework, 'default');

          // Act
          await demo.getByTestId('cc-default-open').click();

          // Assert
          const colon = page.locator('[data-testid="colon-command"][data-modal="true"]').last();
          await expect(colon).toBeVisible();
          await expect(colon.getByTestId('colon-command-prefix')).toHaveText(':');
          await expect(colon.getByTestId('colon-command-input')).toBeFocused();
          await expect(colon.getByTestId('colon-command-list')).toHaveAttribute('data-columns', 'auto');
          await expect(colon).toContainText('Next');

          const viewport = page.viewportSize();
          const box = await colon.boundingBox();
          expect(viewport).not.toBeNull();
          expect(box).not.toBeNull();
          expect(Math.round(box!.y + box!.height)).toBeGreaterThanOrEqual(viewport!.height - 2);
          expect(Math.round(box!.width)).toBe(viewport!.width);

          const searchItem = colon.locator('[data-testid="colon-command-item"][data-value="search"]');
          const githubItem = colon.locator('[data-testid="colon-command-item"][data-value="github"]');
          const themeItem = colon.locator('[data-testid="colon-command-item"][data-value="theme"]');
          const modeItem = colon.locator('[data-testid="colon-command-item"][data-value="mode"]');
          const keybindItem = colon.locator('[data-testid="colon-command-item"][data-value="keybind"]');
          const frameworkItem = colon.locator('[data-testid="colon-command-item"][data-value="framework"]');

          await expect(searchItem).toHaveText('search');
          await expect(githubItem).toHaveText('github');
          await expect(themeItem).toHaveText('theme');
          await expect(modeItem).toHaveText('mode');
          await expect(keybindItem).toHaveText('keybind');
          await expect(frameworkItem).toHaveText('framework');

          // Verify column-first layout (10 items -> 3 columns of 4 rows):
          // Column 1: search (0), github (1), theme (2), mode (3)
          // Column 2: keybind (4), framework (5), command-style (6), jump (7)
          const searchBox = await searchItem.boundingBox();
          const githubBox = await githubItem.boundingBox();
          const keybindBox = await keybindItem.boundingBox();
          expect(searchBox).not.toBeNull();
          expect(githubBox).not.toBeNull();
          expect(keybindBox).not.toBeNull();
          expect(Math.abs(searchBox!.x - githubBox!.x)).toBeLessThanOrEqual(2);
          expect(githubBox!.y).toBeGreaterThan(searchBox!.y);
          expect(keybindBox!.x).toBeGreaterThan(searchBox!.x);

          // Verify ArrowDown traverses down column 1 (search -> github -> theme -> mode) and ArrowRight / ArrowLeft traverse across columns
          await expect(searchItem).toHaveAttribute('data-highlighted', '');
          await page.keyboard.press('ArrowRight');
          await expect(keybindItem).toHaveAttribute('data-highlighted', '');
          await page.keyboard.press('ArrowLeft');
          await expect(searchItem).toHaveAttribute('data-highlighted', '');
          await page.keyboard.press('ArrowDown');
          await expect(githubItem).toHaveAttribute('data-highlighted', '');
          await page.keyboard.press('ArrowRight');
          await expect(frameworkItem).toHaveAttribute('data-highlighted', '');
          await page.keyboard.press('ArrowLeft');
          await expect(githubItem).toHaveAttribute('data-highlighted', '');
          await page.keyboard.press('ArrowDown');
          await expect(themeItem).toHaveAttribute('data-highlighted', '');
          await page.keyboard.press('ArrowDown');
          await expect(modeItem).toHaveAttribute('data-highlighted', '');
          await page.keyboard.press('ArrowDown');
          await expect(keybindItem).toHaveAttribute('data-highlighted', '');
        });
      });

      test.describe('When the user types "th", presses Tab to drill into theme selection, presses Tab to cycle themes, and presses Enter', () => {
        test('Then autocompletes ":theme ", keeps focus on the input while cycling theme completions with Tab, supports Backspace editing, and executes the selected theme on Enter', async ({
          page,
        }) => {
          // Arrange
          const demo = island(page, framework, 'default');
          await demo.getByTestId('cc-default-open').click();
          const colon = page.locator('[data-testid="colon-command"][data-modal="true"]').last();
          const input = colon.getByTestId('colon-command-input');

          // Act: type "th" and press Tab to complete ":theme "
          await input.fill('th');
          await page.keyboard.press('Tab');

          // Assert: input completed with trailing space, remains focused, no duplicate breadcrumb pills, and nested completions visible
          await expect(input).toHaveValue(':theme ');
          await expect(input).toBeFocused();
          await expect(colon.getByTestId('colon-command-breadcrumbs')).toHaveCount(0);
          await expect(
            colon.locator('[data-testid="colon-command-item"][data-value="theme/catppuccin"]'),
          ).toBeVisible();
          await expect(colon.locator('[data-testid="colon-command-item"][data-value="theme/claude"]')).toBeVisible();

          // Act: press Tab to complete the first theme, then Tab again to cycle to the second theme, then Enter
          await page.keyboard.press('Tab');
          await expect(input).toHaveValue(':theme amber-minimal');
          await expect(input).toBeFocused();
          await page.keyboard.press('Tab');
          await expect(input).toHaveValue(':theme amethyst-haze');
          await expect(input).toBeFocused();
          await page.keyboard.press('Enter');

          // Assert: modal closes and executes the selected theme
          await expect(colon).toBeHidden();
          await expect(demo.getByTestId('cc-default-selected')).toContainText('Amethyst Haze (:theme amethyst-haze)');
        });
      });

      test.describe('When the user types "mode dark" and presses Enter', () => {
        test('Then executes the leaf subcommand, closes the modal, and updates the selected status badge', async ({
          page,
        }) => {
          // Arrange
          const demo = island(page, framework, 'default');
          await demo.getByTestId('cc-default-open').click();
          const colon = page.locator('[data-testid="colon-command"][data-modal="true"]').last();
          const input = colon.getByTestId('colon-command-input');

          // Act
          await input.fill('mode dark');
          await input.press('Enter');

          // Assert
          await expect(colon).toBeHidden();
          await expect(demo.getByTestId('cc-default-selected')).toContainText('Dark (:mode dark)');
          await expect(page.getByTestId('toast-item').last()).toContainText('Dark');
        });
      });

      test.describe('When the user types an unrecognized command ("unknowncmd") and presses Enter', () => {
        test('Then keeps the prompt open and displays an inline error diagnostic "Unknown command: unknowncmd"', async ({
          page,
        }) => {
          // Arrange
          const demo = island(page, framework, 'default');
          await demo.getByTestId('cc-default-open').click();
          const colon = page.locator('[data-testid="colon-command"][data-modal="true"]').last();
          const input = colon.getByTestId('colon-command-input');

          // Act
          await input.fill('unknowncmd');
          await input.press('Enter');

          // Assert
          await expect(colon).toBeVisible();
          const errorBanner = colon.getByTestId('colon-command-error');
          await expect(errorBanner).toBeVisible();
          await expect(errorBanner).toContainText('Unknown command: unknowncmd');
        });
      });

      test.describe('When the inline ColonCommand has zero commands registered', () => {
        test('Then renders "No commands registered." directly in the UI with data-empty-kind="no-commands"', async ({
          page,
        }) => {
          // Arrange
          const demo = island(page, framework, 'placements');
          const inlineColon = demo.getByTestId('colon-command');
          await expect(inlineColon).toBeVisible();

          // Act
          await demo.getByTestId('cc-placements-toggle-empty').click();

          // Assert
          const emptyState = inlineColon.getByTestId('colon-command-empty');
          await expect(emptyState).toBeVisible();
          await expect(emptyState).toHaveAttribute('data-empty-kind', 'no-commands');
          await expect(emptyState).toContainText('No commands registered.');
        });
      });
    });
  });
}

test.describe('ColonCommand · Docs Shell Normal-Mode ":" Integration', () => {
  test('Given normal mode on the docs site, When the user presses ":" and executes "mode dark" and "keybind vim", Then updates the site color mode and modal keybind preset', async ({
    page,
  }) => {
    // Arrange
    await page.goto('components/colon-command');
    await page.locator('[data-framework-selector][data-ready]').waitFor();
    await page.locator('main').click({ position: { x: 10, y: 10 } });

    // Act: press ":" in normal mode to open the global ColonCommand
    await page.keyboard.press(':');
    const colon = page.locator('[data-testid="colon-command"][data-modal="true"]').first();
    await expect(colon).toBeVisible();

    const input = colon.getByTestId('colon-command-input');
    await input.fill('mode dark');
    await input.press('Enter');

    // Assert: dark class applied to <html>
    await expect(colon).toBeHidden();
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Act: press ":" again and execute "keybind vim"
    await page.keyboard.press(':');
    await expect(colon).toBeVisible();
    await input.fill('keybind vim');
    await input.press('Enter');

    // Assert: localStorage preset updated to vim
    const storedPreset = await page.evaluate(() => localStorage.getItem('vortex:keymap-preset'));
    expect(storedPreset).toBe('vim');

    // Act & Assert: verify gw and <leader>gw (Space g w) trigger 2D jump mode after using ColonCommand
    await page.keyboard.press('g');
    await page.keyboard.press('w');
    await expect(page.locator('[data-which-key-jump-overlay]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-which-key-jump-overlay]')).toBeHidden();

    await page.keyboard.press(' ');
    await page.keyboard.press('g');
    await page.keyboard.press('w');
    await expect(page.locator('[data-which-key-jump-overlay]')).toBeVisible();
    await page.keyboard.press('Escape');
  });
});
