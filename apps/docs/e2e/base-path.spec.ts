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
});
