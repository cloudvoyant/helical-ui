// apps/docs/e2e/colon-command.spec.ts
// BDD end-to-end coverage for ColonCommand across React and Svelte:
// default modal trigger, Tab completion and nested subcommand drill-down,
// direct ":mode dark" leaf execution, inline "Unknown command:" error diagnostic,
// empty commands UI state ("No commands registered."), and docs normal-mode ":" trigger.
import { test, expect, type Page } from '@playwright/test';
import { FRAMEWORKS, selectFramework } from './helpers';

// --- Helpers ---

function island(page: Page, framework: string, example: string) {
  return page.locator(`[data-example-id="${example}"] [data-example-preview] [data-fw="${framework}"]`);
}

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
        test('Then renders the ":" prompt and lists top-level command completions (:search, :github, :theme, :mode, :keybind, :framework)', async ({
          page,
        }) => {
          // Arrange
          const demo = island(page, framework, 'default');

          // Act
          await demo.getByTestId('cc-default-open').click();

          // Assert
          const colon = page.locator('[data-testid="colon-command"][data-modal="true"]').last();
          await expect(colon).toBeVisible();
          await expect(colon.getByTestId('colon-command-prefix')).toHaveText(':');
          await expect(colon.getByTestId('colon-command-input')).toBeFocused();

          await expect(colon.locator('[data-testid="colon-command-item"][data-value="search"]')).toContainText(
            ':search',
          );
          await expect(colon.locator('[data-testid="colon-command-item"][data-value="github"]')).toContainText(
            ':github',
          );
          await expect(colon.locator('[data-testid="colon-command-item"][data-value="theme"]')).toContainText(':theme');
          await expect(colon.locator('[data-testid="colon-command-item"][data-value="mode"]')).toContainText(':mode');
          await expect(colon.locator('[data-testid="colon-command-item"][data-value="keybind"]')).toContainText(
            ':keybind',
          );
          await expect(colon.locator('[data-testid="colon-command-item"][data-value="framework"]')).toContainText(
            ':framework',
          );
        });
      });

      test.describe('When the user types "th" and presses Tab', () => {
        test('Then autocompletes the branch token to ":theme ", renders the "theme ›" breadcrumb, and lists nested theme subcommand completions', async ({
          page,
        }) => {
          // Arrange
          const demo = island(page, framework, 'default');
          await demo.getByTestId('cc-default-open').click();
          const colon = page.locator('[data-testid="colon-command"][data-modal="true"]').last();
          const input = colon.getByTestId('colon-command-input');

          // Act
          await input.fill('th');
          await input.press('Tab');

          // Assert: input completed with trailing space and nested completions visible
          await expect(input).toHaveValue(':theme ');
          await expect(colon.getByTestId('colon-command-breadcrumbs')).toContainText('theme');
          await expect(
            colon.locator('[data-testid="colon-command-item"][data-value="theme/catppuccin"]'),
          ).toBeVisible();
          await expect(colon.locator('[data-testid="colon-command-item"][data-value="theme/claude"]')).toBeVisible();
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
  });
});
