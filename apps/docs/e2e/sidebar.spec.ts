// apps/docs/e2e/sidebar.spec.ts
// Behavior + accessibility coverage for the Sidebar, matrixed over React and
// Svelte via the docs demo islands: collapse-to-icon-rail, collapse-to-offcanvas,
// and rail-handle toggling. Asserts observable state (`data-state`) and visibility,
// never generated class strings. The demos render in PreviewFrame iframes, so
// assertions target the active framework's island inside each frame.
import { test, expect, type Page, type FrameLocator } from '@playwright/test';

const FRAMEWORKS = ['react', 'svelte'] as const;
type Framework = (typeof FRAMEWORKS)[number];

async function exampleFrame(page: Page, index: number): Promise<FrameLocator> {
  const example = page.locator('[data-example]').nth(index);
  await example.scrollIntoViewIfNeeded();
  const iframe = example.locator('iframe[data-preview]');
  await expect(iframe).toHaveAttribute('src', /\/preview\/sidebar\//);
  return example.frameLocator('iframe[data-preview]');
}

function sidebar(frame: FrameLocator, framework: Framework) {
  // The desktop sidebar (not the mobile drawer, which also carries
  // data-slot="sidebar" but with data-mobile="true").
  return frame.locator(`[data-fw="${framework}"] [data-slot="sidebar"]:not([data-mobile="true"])`).first();
}

for (const framework of FRAMEWORKS) {
  test.describe(`Sidebar docs page · ${framework}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('components/sidebar');
      // Every Sidebar example renders in a PreviewFrame iframe — there are no
      // inline islands — so wait for the framework selector to hydrate, then
      // click; the frames pick up the framework via postMessage.
      await page.locator('[data-framework-selector][data-ready]').waitFor();
      await page.locator(`[data-framework-selector] button[data-fw="${framework}"]`).click();
    });

    test('collapses to an icon rail (container narrows, icon remains)', async ({ page }) => {
      const frame = await exampleFrame(page, 0); // icon example
      const sb = sidebar(frame, framework);
      const container = frame.locator(`[data-fw="${framework}"] [data-slot="sidebar-container"]`).first();
      const menuButton = frame.locator(`[data-fw="${framework}"] [data-sidebar="menu-button"]:has(svg)`).first();
      const trigger = frame.locator(`[data-fw="${framework}"] [data-sidebar="trigger"]`).first();

      await expect(sb).toHaveAttribute('data-state', 'expanded');
      // The desktop sidebar is 16rem (256px) wide when expanded.
      await expect(container).toHaveCSS('width', '256px');

      await expect(async () => {
        await trigger.click();
        await expect(sb).toHaveAttribute('data-state', 'collapsed');
      }).toPass();

      // The icon rail collapses to the 3rem icon width (48px) while the menu button's icon stays visible.
      await expect(container).toHaveCSS('width', '48px');
      await expect(menuButton).toBeVisible();
      await expect(menuButton.locator('svg').first()).toBeVisible();

      // And it can be expanded again.
      await expect(async () => {
        await trigger.click();
        await expect(sb).toHaveAttribute('data-state', 'expanded');
      }).toPass();
      await expect(container).toHaveCSS('width', '256px');
    });

    test('completely disappears on collapse (offcanvas)', async ({ page }) => {
      const frame = await exampleFrame(page, 1); // offcanvas example
      const sb = sidebar(frame, framework);
      const gap = frame.locator(`[data-fw="${framework}"] [data-slot="sidebar-gap"]`).first();
      const trigger = frame.locator(`[data-fw="${framework}"] [data-sidebar="trigger"]`).first();

      await expect(sb).toHaveAttribute('data-state', 'expanded');

      await expect(async () => {
        await trigger.click();
        await expect(sb).toHaveAttribute('data-state', 'collapsed');
      }).toPass();

      // The offcanvas gap collapses to zero width — the sidebar is fully gone.
      await expect(gap).toHaveCSS('width', '0px');

      await expect(async () => {
        await trigger.click();
        await expect(sb).toHaveAttribute('data-state', 'expanded');
      }).toPass();
      await expect(gap).toHaveCSS('width', '256px');
    });

    test('toggles expanded/collapsed with the rail handle', async ({ page }) => {
      const frame = await exampleFrame(page, 2); // rail example
      const sb = sidebar(frame, framework);
      const rail = frame.locator(`[data-fw="${framework}"] [data-sidebar="rail"]`).first();

      await expect(sb).toHaveAttribute('data-state', 'expanded');
      await expect(rail).toHaveAttribute('aria-label', 'Toggle Sidebar');

      // Click a point on the rail's right edge: when collapsed (offcanvas) the
      // 16px-wide rail peeks ~8px into the demo box, so the element center can
      // fall under the card's overflow clip.
      const clickRail = () => rail.click({ position: { x: 13, y: 100 } });

      await expect(async () => {
        await clickRail();
        await expect(sb).toHaveAttribute('data-state', 'collapsed');
      }).toPass();

      await expect(async () => {
        await clickRail();
        await expect(sb).toHaveAttribute('data-state', 'expanded');
      }).toPass();
    });

    test('rail activates with the Enter key', async ({ page }) => {
      const frame = await exampleFrame(page, 2); // rail example
      const sb = sidebar(frame, framework);
      const rail = frame.locator(`[data-fw="${framework}"] [data-sidebar="rail"]`).first();

      await expect(sb).toHaveAttribute('data-state', 'expanded');
      await expect(async () => {
        await rail.focus();
        await page.keyboard.press('Enter');
        await expect(sb).toHaveAttribute('data-state', 'collapsed');
      }).toPass();
    });

    test('trigger and rail carry accessible labels', async ({ page }) => {
      const frame = await exampleFrame(page, 2); // rail example
      await expect(frame.locator(`[data-fw="${framework}"] [data-sidebar="trigger"]`).first()).toHaveAttribute(
        'aria-label',
        'Toggle Sidebar',
      );
      await expect(frame.locator(`[data-fw="${framework}"] [data-sidebar="rail"]`).first()).toHaveAttribute(
        'aria-label',
        'Toggle Sidebar',
      );
    });
  });
}
