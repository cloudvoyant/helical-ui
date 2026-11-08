// apps/docs/e2e/base-path.spec.ts
// Guards against the deploy-phase base-path bug: with `base: '/helical-ui/'`, string
// literal href/src in Astro templates stay root-absolute and 404 once the site
// is served from `https://cloudvoyant.github.io/helical-ui/`. Assert the rendered
// shell carries no such URLs.
import { test, expect } from '@playwright/test';

test.describe('Base-path', () => {
  test('rendered nav links and assets are /helical-ui/-prefixed', async ({ page }) => {
    await page.goto('components/button');

    const favicons = page.locator('link[rel="icon"][data-favicon]');
    await expect(favicons).toHaveCount(2);
    for (const href of await favicons.evaluateAll((els) => els.map((el) => el.getAttribute('href')))) {
      expect(href).toMatch(/^\/helical-ui\//);
    }
    await expect(page.locator('a[href="/"]')).toHaveCount(0);
    await expect(page.locator('a[href^="/"]:not([href^="/helical-ui/"])')).toHaveCount(0);
    await expect(page.locator('img[src^="/"]:not([src^="/helical-ui/"])')).toHaveCount(0);
    await expect(page.locator('[data-slot="navbar"] a[href="/helical-ui/general/introduction"]')).toHaveCount(1);
  });

  test('docs left sidebar preserves scroll position and keyboard focus across link navigation', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('components/button');

    const scroller = page.locator('[data-sidebar-scroll]');
    await expect(scroller).toBeVisible();
    await scroller.evaluate((el) => {
      el.scrollTop = 180;
    });

    const targetLink = scroller.locator('a[href="/helical-ui/components/toc"]');
    await targetLink.focus();
    await expect(targetLink).toBeFocused();
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/\/helical-ui\/components\/toc\/?$/);
    const nextScroller = page.locator('[data-sidebar-scroll]');
    const nextTargetLink = nextScroller.locator('a[href="/helical-ui/components/toc"]');
    await expect(nextTargetLink).toHaveAttribute('aria-current', 'page');
    await expect(nextTargetLink).toBeFocused();
    const restoredScrollTop = await nextScroller.evaluate((el) => el.scrollTop);
    expect(restoredScrollTop).toBe(180);
  });
});
