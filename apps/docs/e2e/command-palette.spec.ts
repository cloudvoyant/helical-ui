// apps/docs/e2e/command-palette.spec.ts
// BDD end-to-end coverage for CommandPalette across React and Svelte:
// default modal trigger, nested submenu drill-down & Backspace/breadcrumb pop,
// fuzzy search with <mark> character highlights, empty commands UI state,
// and docs shell integration with commandStyle preference toggle.
import { test, expect } from '@playwright/test';
import { FRAMEWORKS, island, selectFramework } from './helpers';

// --- Tests ---

for (const framework of FRAMEWORKS) {
  test.describe(`CommandPalette · ${framework}`, () => {
    test.describe('Given the CommandPalette page (/components/command-palette)', () => {
      test.beforeEach(async ({ page }) => {
        // Arrange
        await page.goto('components/command-palette');
        await selectFramework(page, framework);
      });

      test.describe('When the user opens the Default CommandPalette demo', () => {
        test('Then renders the modal CommandPalette with Search Docs (Future badge), View GitHub, Change Theme, Change Light/Dark Mode, Change Keybind Style, and Change Framework', async ({
          page,
        }) => {
          // Arrange
          const demo = island(page, framework, 'default');

          // Act
          await demo.getByTestId('cp-default-open').click();

          // Assert
          const palette = page.locator('[data-testid="command-palette"][data-modal="true"]').last();
          await expect(palette).toBeVisible();
          await expect(palette.getByTestId('command-palette-input')).toBeFocused();

          const searchItem = palette.locator('[data-testid="command-palette-item"][data-value="search"]');
          await expect(searchItem).toBeVisible();
          await expect(searchItem).toContainText('Search Docs');
          await expect(searchItem).toContainText('Future');

          await expect(palette.locator('[data-testid="command-palette-item"][data-value="github"]')).toContainText(
            'View GitHub',
          );
          await expect(palette.locator('[data-testid="command-palette-item"][data-value="theme"]')).toContainText(
            'Change Theme',
          );
          await expect(palette.locator('[data-testid="command-palette-item"][data-value="mode"]')).toContainText(
            'Change Light/Dark Mode',
          );
          await expect(palette.locator('[data-testid="command-palette-item"][data-value="keybind"]')).toContainText(
            'Change Keybind Style',
          );
          await expect(palette.locator('[data-testid="command-palette-item"][data-value="framework"]')).toContainText(
            'Change Framework',
          );
        });
      });

      test.describe('When the user selects a branch item ("Change Theme") and then presses Backspace on an empty input', () => {
        test('Then drills into the nested submenu with a "Change Theme" breadcrumb badge and pops back to root on Backspace', async ({
          page,
        }) => {
          // Arrange
          const demo = island(page, framework, 'default');
          await demo.getByTestId('cp-default-open').click();
          const palette = page.locator('[data-testid="command-palette"][data-modal="true"]').last();
          await expect(palette).toBeVisible();

          // Act: click "Change Theme" branch item
          await palette.locator('[data-testid="command-palette-item"][data-value="theme"]').click();

          // Assert: drilled into Change Theme submenu
          await expect(palette.getByTestId('command-palette-breadcrumbs')).toContainText('Change Theme');
          await expect(
            palette.locator('[data-testid="command-palette-item"][data-value="theme/catppuccin"]'),
          ).toBeVisible();
          await expect(
            palette.locator('[data-testid="command-palette-item"][data-value="theme/claude"]'),
          ).toBeVisible();

          // Act: press Backspace on empty search input to pop back to root
          await palette.getByTestId('command-palette-input').press('Backspace');

          // Assert: back at root level
          await expect(palette.getByTestId('command-palette-breadcrumbs')).toHaveCount(0);
          await expect(palette.locator('[data-testid="command-palette-item"][data-value="theme"]')).toBeVisible();

          // Act: press Escape at root to close modal
          await palette.getByTestId('command-palette-input').press('Escape');
          await expect(palette).toBeHidden();
        });
      });

      test.describe('When the user types a fuzzy query ("catp") at the root level and presses Enter', () => {
        test('Then ranks the nested descendant ("Catppuccin") with <mark> character highlights and ancestor path, and selects it on Enter', async ({
          page,
        }) => {
          // Arrange
          const demo = island(page, framework, 'default');
          await demo.getByTestId('cp-default-open').click();
          const palette = page.locator('[data-testid="command-palette"][data-modal="true"]').last();
          const input = palette.getByTestId('command-palette-input');

          // Act
          await input.fill('catp');

          // Assert: Catppuccin item is visible with <mark> highlights and ancestor path
          const catppuccinItem = palette.locator('[data-testid="command-palette-item"][data-value="theme/catppuccin"]');
          await expect(catppuccinItem).toBeVisible();
          await expect(catppuccinItem).toContainText('Change Theme ›');
          await expect(catppuccinItem.locator('mark').first()).toBeVisible();

          // Act: press Enter to select the top fuzzy match
          await input.press('Enter');

          // Assert: modal closes and demo records the selected command
          await expect(palette).toBeHidden();
          await expect(demo.getByTestId('cp-default-selected')).toContainText('Catppuccin');
        });
      });

      test.describe('When the Inline CommandPalette has zero commands registered', () => {
        test('Then renders "No commands registered." directly in the UI with data-empty-kind="no-commands"', async ({
          page,
        }) => {
          // Arrange
          const demo = island(page, framework, 'inline');
          const inlinePalette = demo.getByTestId('command-palette');
          await expect(inlinePalette).toBeVisible();

          // Act: toggle empty commands state
          await demo.getByTestId('cp-inline-toggle-empty').click();

          // Assert
          const emptyState = inlinePalette.getByTestId('command-palette-empty');
          await expect(emptyState).toBeVisible();
          await expect(emptyState).toHaveAttribute('data-empty-kind', 'no-commands');
          await expect(emptyState).toContainText('No commands registered.');
        });
      });
    });
  });
}

test.describe('CommandPalette · Docs Shell & Preferences Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('components/command-palette');
    await page.locator('[data-framework-selector][data-ready]').waitFor();
  });

  test('Given the docs top-nav Settings popover, When the user toggles Command Style between Palette (⌘K) and Colon (:), Then updates localStorage ("vortex:command-style") and the top-nav command trigger button', async ({
    page,
  }) => {
    // Arrange: open Settings popover
    await page.locator('[data-theme-selector]').click();
    const selector = page.locator('[data-command-style-selector]');
    await expect(selector).toBeVisible();

    // Act: switch to Colon (:)
    await selector.locator('[data-command-style="colon"]').click();

    // Assert: localStorage and top-nav trigger reflect colon style
    const storedColon = await page.evaluate(() => localStorage.getItem('vortex:command-style'));
    expect(storedColon).toBe('colon');
    await expect(page.locator('[data-command-trigger]')).toHaveAttribute('data-command-style', 'colon');

    // Act: switch back to Palette (⌘K)
    await selector.locator('[data-command-style="palette"]').click();
    const storedPalette = await page.evaluate(() => localStorage.getItem('vortex:command-style'));
    expect(storedPalette).toBe('palette');
    await expect(page.locator('[data-command-trigger]')).toHaveAttribute('data-command-style', 'palette');
  });

  test('Given the docs global CommandPalette opened from the top-nav trigger, When the user executes Change Light/Dark Mode -> Dark and Change Theme -> Catppuccin, Then updates the document theme and color mode', async ({
    page,
  }) => {
    // Arrange: click top-nav command trigger
    await page.locator('[data-command-trigger]').click();
    const palette = page.locator('[data-testid="command-palette"][data-modal="true"]').first();
    await expect(palette).toBeVisible();

    // Act: drill into Change Light/Dark Mode -> Dark
    await palette.locator('[data-testid="command-palette-item"][data-value="mode"]').click();
    await palette.locator('[data-testid="command-palette-item"][data-value="mode/dark"]').click();

    // Assert: dark class applied to <html>
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Act: reopen and change theme to Catppuccin
    await page.locator('[data-command-trigger]').click();
    await expect(palette).toBeVisible();
    await palette.locator('[data-testid="command-palette-item"][data-value="theme"]').click();
    await palette.locator('[data-testid="command-palette-item"][data-value="theme/catppuccin"]').click();

    // Assert: theme-catppuccin class applied to <html>
    await expect(page.locator('html')).toHaveClass(/theme-catppuccin/);
  });
});
