// apps/docs/e2e/navbar.spec.ts
// Behavior + accessibility coverage for the Navbar, matrixed over React and Svelte
// via the docs demo islands: the mobile trigger toggles the disclosure panel,
// the desktop menu is keyboard navigable, and scrolling marks the sticky bar.
import { selectFramework } from './helpers';
import { test, expect, type Page } from '@playwright/test';

const FRAMEWORKS = ['react', 'svelte'] as const;

// Both navbar demos now live in a self-scrolling container. These tests only
// exercise the sticky example, so hide the second (floating) example to keep
// the framework selector and locators unambiguous.
async function hideFloatingExample(page: Page) {
  await page.locator('[data-example-id="density"]').evaluate((el) => (el.style.display = 'none'));
}

for (const framework of FRAMEWORKS) {
  test.describe(`Navbar docs page · ${framework}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('components/navbar');
      await hideFloatingExample(page);
      await selectFramework(page, framework);
    });

    test('renders a header with brand and menu links', async ({ page }) => {
      const header = page.locator(`[data-demo] [data-fw="${framework}"] header`).first();
      await expect(header).toBeVisible();
      await expect(header.locator('text=helical-ui').first()).toBeVisible();
    });

    test('mobile trigger toggles the mobile panel', async ({ page }) => {
      // The trigger is md:hidden — exercise the overlay at a mobile viewport.
      await page.setViewportSize({ width: 375, height: 667 });
      const trigger = page.locator(`[data-demo] [data-fw="${framework}"] [data-slot="navbar-trigger"]`).first();
      await expect(trigger).toBeVisible();
      await trigger.click();
      // The full-screen overlay portals to <body> and shows the collected menu.
      const overlay = page.locator('[data-slot="navbar-mobile-overlay"]').filter({ visible: true }).first();
      await expect(overlay).toBeVisible();
      const mobileLink = overlay.locator('a:has-text("Blog")').first();
      await expect(mobileLink).toBeVisible();
      await overlay.locator('button[aria-label="Close navigation menu"]').click();
      await expect(mobileLink).toBeHidden();
    });

    test('mobile overlay locks the background scroll', async ({ page }) => {
      // The overlay portals into the bar's scroll container (a demo card with
      // overflow-y-auto). Opening it must lock that container's scroll so the
      // page content below can't be scrolled past the overlay — while the page
      // itself stays scrollable.
      await page.setViewportSize({ width: 375, height: 667 });
      const trigger = page.locator(`[data-demo] [data-fw="${framework}"] [data-slot="navbar-trigger"]`).first();
      await expect(trigger).toBeVisible();

      // Grab the scroll container handle BEFORE opening, since the lock flips
      // its computed overflow to hidden (so it can no longer be found by an
      // overflow search).
      const containerHandle = await trigger.evaluateHandle((el) => {
        let c: HTMLElement | null = el.parentElement;
        while (c && !/auto|scroll|overlay/.test(getComputedStyle(c).overflowY)) c = c.parentElement;
        return c;
      });
      const container = containerHandle.asElement();
      expect(container).not.toBeNull();
      expect(await container!.evaluate((c) => getComputedStyle(c).overflowY)).toBe('auto');

      await trigger.click();
      const overlay = page.locator('[data-slot="navbar-mobile-overlay"]').filter({ visible: true }).first();
      await expect(overlay).toBeVisible();

      // While open: the container's scroll is locked and the overlay still
      // covers it (its top aligns with the container's top). The page is not.
      expect(await container!.evaluate((c) => getComputedStyle(c).overflowY)).toBe('hidden');
      expect(await page.evaluate(() => getComputedStyle(document.body).overflowY)).toBe('visible');
      // Measure the overlay and the container at the same scroll position —
      // clicking the trigger may auto-scroll the container into view.
      const overlayBox = await overlay.boundingBox();
      const containerBox = await container!.boundingBox();
      expect(overlayBox).not.toBeNull();
      expect(containerBox).not.toBeNull();
      expect(overlayBox!.y).toBeCloseTo(containerBox!.y, 0);

      // Closing restores the container's scroll.
      await overlay.locator('button[aria-label="Close navigation menu"]').click();
      await expect(overlay).toBeHidden();
      expect(await container!.evaluate((c) => getComputedStyle(c).overflowY)).toBe('auto');
    });

    test('desktop menu dropdown opens on keyboard', async ({ page }) => {
      const menu = page.locator(`[data-demo] [data-fw="${framework}"] [data-slot="navbar-menu"]`).first();
      const trigger = menu.locator('button:has-text("Docs")').first();
      const panelLink = menu.locator('a:has-text("Components")').first();
      await expect(async () => {
        await trigger.focus();
        await page.keyboard.press('Enter');
        await expect(panelLink).toBeVisible();
      }).toPass();
      await page.keyboard.press('Escape');
      await expect(panelLink).toBeHidden();
    });

    test('shrink-on-scroll bar stays pinned and compacts on container scroll', async ({ page }) => {
      // The "Shrink on scroll" example is the third [data-example] on the page.
      const example = page.locator('[data-example-id="shrink"]');
      const header = example.locator(`[data-fw="${framework}"] header[data-slot="navbar"]`).first();
      await header.scrollIntoViewIfNeeded();
      const pinned = await header.evaluate((el) => {
        // Find the demo's scroll container (overflow-y-auto ancestor).
        let c: HTMLElement | null = el.parentElement;
        while (c && !/auto|scroll|overlay/.test(getComputedStyle(c).overflowY)) c = c.parentElement;
        if (!c) return { scrollable: false };
        c.scrollTop = 160;
        return { scrollable: true, position: getComputedStyle(el).position };
      });
      expect(pinned.scrollable).toBe(true);
      expect(['sticky', 'fixed']).toContain(pinned.position);
      await expect(async () => {
        await expect(header).toHaveAttribute('data-scrolled', 'true');
      }).toPass();
      // variant="shrink": the bar compacts when scrolled (the header is the bar)
      const container = example.locator(`[data-fw="${framework}"] header[data-slot="navbar"]`).first();
      await expect(container).toHaveAttribute('data-shrunk', 'true');
      await expect(async () => {
        const h = await container.evaluate((el) => el.getBoundingClientRect().height);
        expect(h).toBeLessThan(64); // compacted below the default h-16 (64px)
      }).toPass();
      // NavbarMenu items shrink too (density="compact")
      const trigger = example
        .locator(`[data-fw="${framework}"] [data-slot="navbar-menu"] [data-part="trigger"]`)
        .first();
      await expect(async () => {
        const th = await trigger.evaluate((el) => el.getBoundingClientRect().height);
        expect(th).toBeLessThan(36); // compacted below h-9 (36px)
      }).toPass();
      await header.evaluate((el) => {
        let c: HTMLElement | null = el.parentElement;
        while (c && !/auto|scroll|overlay/.test(getComputedStyle(c).overflowY)) c = c.parentElement;
        if (c) c.scrollTop = 0;
      });
    });

    test('hide variant slides away and reveals on hover', async ({ page }) => {
      // The "Hide on leave" example is the fifth [data-example] on the page.
      const example = page.locator('[data-example-id="hide"]');
      const header = example.locator(`[data-fw="${framework}"] header[data-slot="navbar"]`).first();
      const area = example.locator(`[data-fw="${framework}"] [data-slot="navbar-activation-area"]`).first();
      await header.scrollIntoViewIfNeeded();
      // Park the mouse away from the bar so it isn't already hovered.
      await page.mouse.move(0, 0);
      await header.evaluate((el) => {
        let c: HTMLElement | null = el.parentElement;
        while (c && !/auto|scroll|overlay/.test(getComputedStyle(c).overflowY)) c = c.parentElement;
        if (c) c.scrollTop = 160;
      });
      await expect(async () => {
        await expect(header).toHaveAttribute('data-hidden', 'true');
      }).toPass();
      // Let the slide-up transition settle so the activation area is exposed.
      await page.waitForTimeout(400);
      // Move the mouse onto the activation area to reveal the bar.
      const box = await area.boundingBox();
      await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
      await expect(async () => {
        await expect(header).not.toHaveAttribute('data-hidden', 'true');
      }).toPass();
    });
  });
}
