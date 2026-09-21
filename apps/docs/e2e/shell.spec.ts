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

  test('right gutter uses Toc with an active indicator', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('components/toc');

    const toc = page.locator('[data-docs-toc]');
    await expect(toc.locator('nav[data-part="root"]')).toBeVisible();
    await expect(toc.locator('[data-part="indicator"]')).toBeAttached();

    const links = toc.locator('a[data-value]');
    await expect(links).not.toHaveCount(0);
    await expect(toc.locator('a[data-value="guide"]')).toBeVisible();
    await expect(toc.locator('a[data-value="nested-headings"]')).toBeVisible();
    await expect(page.locator('.docs-prose h3#nested-headings')).toBeVisible();
    await expect(toc.locator('a[data-value="props"]')).toHaveCount(0);
    await expect(toc.locator('a[data-value="usage"]')).toHaveCount(0);
    const lastLink = links.last();
    const lastValue = await lastLink.getAttribute('data-value');
    expect(lastValue).toBeTruthy();

    // Preview frames can finish sizing after the document first scrolls. Keep
    // moving to the latest scroll end until layout settles and the final
    // heading enters the machine's visible range.
    await expect(async () => {
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await expect(toc.locator(`a[data-current][data-value="${lastValue}"]`)).toHaveCount(1, { timeout: 500 });
    }).toPass({ timeout: 30_000, intervals: [100, 250, 500] });
    await expect(lastLink).toHaveAttribute('aria-current', 'location');
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
