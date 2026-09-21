// apps/docs/e2e/shell.spec.ts
import { test, expect } from '@playwright/test';
import { expectIslandRendered } from './helpers';

test.describe('Docs shell', () => {
  test('framework selector defaults to React and switches islands', async ({ page }) => {
    await page.goto('components/button');
    await page.locator('[data-framework-selector][data-ready]').waitFor();
    await expectIslandRendered(page, 'react');
    await expect(page.locator('[data-demo] [data-fw="svelte"]').first()).toBeHidden();

    await page.locator('[data-framework-selector] button[data-fw="svelte"]').click();
    await expectIslandRendered(page, 'svelte');
    await expect(page.locator('[data-demo] [data-fw="react"]').first()).toBeHidden();
  });

  test('framework selection persists across navigation', async ({ page }) => {
    await page.goto('components/button');
    await page.locator('[data-framework-selector][data-ready]').waitFor();
    await page.locator('[data-framework-selector] button[data-fw="svelte"]').click();
    await expectIslandRendered(page, 'svelte');

    await page.goto('general/introduction');
    await expect(page.locator('html')).toHaveAttribute('data-framework', 'svelte');
  });

  test('theme selector switches color mode and theme, and persists', async ({ page }) => {
    await page.goto('components/button');
    const trigger = page.locator('[data-theme-selector]');
    await expect(trigger).toBeVisible();

    // Open the modal — retry until the React island hydrates.
    const openModal = () =>
      expect(async () => {
        await trigger.click();
        await expect(page.locator('[data-theme-modal]')).toBeVisible();
      }).toPass();

    await openModal();
    await page.locator('[data-color-mode="dark"]').click();
    await expect(page.locator('html')).toHaveClass(/dark/);

    await page.locator('[data-theme-swatch="catppuccin"]').click();
    await expect(page.locator('html')).toHaveClass(/theme-catppuccin/);

    await page.goto('general/introduction');
    await expect(page.locator('html')).toHaveClass(/dark/);
    await expect(page.locator('html')).toHaveClass(/theme-catppuccin/);

    await openModal();
    await page.locator('[data-color-mode="light"]').click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
    await expect(page.locator('html')).toHaveClass(/theme-catppuccin/);
  });

  test('topnav marks scrolled once the page is scrolled', async ({ page }) => {
    await page.goto('components/button');
    const header = page.locator('[data-slot="navbar"]');
    await expect(header).not.toHaveAttribute('data-scrolled', 'true');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(async () => {
      await expect(header).toHaveAttribute('data-scrolled', 'true');
    }).toPass();
  });

  test('mobile menu opens the overlay and closes on Escape', async ({ page }) => {
    await page.setViewportSize({ width: 640, height: 800 });
    await page.goto('general/introduction');

    // Wait for the topnav island to hydrate (framework selector is hidden on
    // mobile, so wait for attachment rather than visibility).
    await page.locator('[data-framework-selector][data-ready]').waitFor({ state: 'attached' });

    const trigger = page.locator('[data-slot="navbar-trigger"]');
    await expect(trigger).toBeVisible();

    await trigger.click();
    const overlay = page.locator('[data-slot="navbar-mobile-overlay"]').filter({ visible: true }).first();
    await expect(overlay).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(overlay).toBeHidden();
  });
});
