// apps/docs/e2e/theming.spec.ts
import { test, expect } from '@playwright/test';
import { FRAMEWORKS, island, selectFramework } from './helpers';

for (const framework of FRAMEWORKS) {
  test.describe(`Theming · ${framework}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('components/theming');
      await selectFramework(page, framework);
    });

    test.describe('Given themes are provided in a helical ui project', () => {
      test.describe('When a user selects a theme', () => {
        test.beforeEach(async ({ page }) => {
          const demo = island(page, framework, 'default');
          await demo.locator('[data-theme-swatch="catppuccin"]').click();
        });

        test('it is applied to the document root and marks the swatch pressed', async ({
          page,
        }) => {
          const demo = island(page, framework, 'default');
          await expect(page.locator('html')).toHaveClass(/theme-catppuccin/);
          await expect(demo.locator('[data-theme-swatch="catppuccin"]')).toHaveAttribute(
            'aria-pressed',
            'true',
          );
        });
      });

      test.describe('When toggling light/dark modes', () => {
        test.beforeEach(async ({ page }) => {
          const demo = island(page, framework, 'default');
          await demo.locator('[data-theme-swatch="cyberpunk"]').click();
          await expect(page.locator('html')).toHaveClass(/theme-cyberpunk/);
          await demo.locator('[data-light-switch]').click();
        });

        test('it toggles dark mode while theme selection remains the same', async ({ page }) => {
          const demo = island(page, framework, 'default');
          await expect(page.locator('html')).toHaveClass(/dark/);
          await expect(page.locator('html')).toHaveClass(/theme-cyberpunk/);
          await expect(demo.locator('[data-theme-swatch="cyberpunk"]')).toHaveAttribute(
            'aria-pressed',
            'true',
          );

          await demo.locator('[data-light-switch]').click();
          await expect(page.locator('html')).not.toHaveClass(/dark/);
          await expect(page.locator('html')).toHaveClass(/theme-cyberpunk/);
        });
      });
    });

    test.describe('Given a custom theme is provided', () => {
      test.describe('When theme has css', () => {
        test.beforeEach(async ({ page }) => {
          const demo = island(page, framework, 'custom-theme');
          await demo.locator('[data-theme-swatch="solar-flare"]').click();
        });

        test('it is registered and can be applied', async ({ page }) => {
          const demo = island(page, framework, 'custom-theme');
          await expect(page.locator('html')).toHaveClass(/theme-solar-flare/);
          await expect(demo.locator('[data-theme-swatch="solar-flare"]')).toHaveAttribute(
            'aria-pressed',
            'true',
          );
        });
      });

      test.describe('When theme has no css', () => {
        test.beforeEach(async ({ page }) => {
          const demo = island(page, framework, 'custom-theme');
          await demo.locator('[data-theme-swatch="solar-flare"]').click();
          await expect(page.locator('html')).toHaveClass(/theme-solar-flare/);
          await demo.locator('[data-theme-swatch="missing-css"]').click();
        });

        test('it falls back to the default theme', async ({ page }) => {
          const demo = island(page, framework, 'custom-theme');
          await expect(page.locator('html')).toHaveClass(/theme-helical-ui/);
          await expect(page.locator('html')).not.toHaveClass(/theme-missing-css/);
          await expect(demo.locator('[data-theme-swatch="helical-ui"]')).toHaveAttribute(
            'aria-pressed',
            'true',
          );
          await expect(demo.locator('[data-theme-swatch="missing-css"]')).toHaveAttribute(
            'aria-pressed',
            'false',
          );
        });
      });
    });
  });
}
