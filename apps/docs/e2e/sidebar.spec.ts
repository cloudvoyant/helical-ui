// apps/docs/e2e/sidebar.spec.ts
// Behavior + accessibility coverage for the Sidebar, matrixed over React and
// Svelte via the docs demo islands: collapse-to-icon-rail, collapse-to-offcanvas,
// and rail-handle toggling. Asserts observable state (`data-state`) and visibility,
// never generated class strings. The demos render in PreviewFrame iframes, so
// assertions target the active framework's island inside each frame.
import { test, expect, type Locator, type Page, type FrameLocator } from '@playwright/test';

const FRAMEWORKS = ['react', 'svelte'] as const;
type Framework = (typeof FRAMEWORKS)[number];

async function exampleFrame(page: Page, index: number): Promise<FrameLocator> {
  const example = page.locator('[data-example]').nth(index);
  await example.scrollIntoViewIfNeeded();
  const iframe = example.locator('iframe[data-preview]');
  await expect(iframe).toHaveAttribute('src', /\/preview\/sidebar\//);
  return example.frameLocator('iframe[data-preview]');
}

function previewCard(page: Page, example: string): Locator {
  return page.locator(`[data-preview-frame][data-component="sidebar"][data-preview-example="${example}"]`);
}

async function assertMobileSheet(page: Page, example: string, framework: Framework, expectedSwipe: 'left' | 'down') {
  const card = previewCard(page, example);
  await card.locator('button[data-preview-width="mobile"]').click();
  const fw = card.frameLocator('iframe[data-preview]').locator(`[data-fw="${framework}"]`);
  const drawer = fw.locator('[data-slot="sidebar"][data-mobile="true"]');
  const positioner = fw.locator('[data-part="positioner"][data-scope="drawer"]');
  const trigger = fw.locator('[data-sidebar="trigger"]');

  await expect(positioner).toBeHidden();

  await expect(async () => {
    await trigger.click();
    await expect(positioner).toBeVisible();
  }).toPass();
  await expect(drawer).toHaveAttribute('data-swipe-direction', expectedSwipe);
  await expect(drawer).toHaveAttribute('data-state', 'open');

  await page.keyboard.press('Escape');
  await expect(positioner).toBeHidden();
}

function sidebar(frame: FrameLocator, framework: Framework) {
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

      // Starts collapsed (the default) — a 3rem icon rail.
      await expect(sb).toHaveAttribute('data-state', 'collapsed');
      await expect(container).toHaveCSS('width', '48px');
      await expect(menuButton).toBeVisible();
      await expect(menuButton.locator('svg').first()).toBeVisible();

      // Opening expands to the full 16rem (256px) desktop sidebar.
      await expect(async () => {
        await trigger.click();
        await expect(sb).toHaveAttribute('data-state', 'expanded');
      }).toPass();
      await expect(container).toHaveCSS('width', '256px');

      // And it collapses back to the icon rail.
      await expect(async () => {
        await trigger.click();
        await expect(sb).toHaveAttribute('data-state', 'collapsed');
      }).toPass();
      await expect(container).toHaveCSS('width', '48px');
    });

    test('renders as a full-height mobile side sheet', async ({ page }) => {
      // The icon example (side="left") opens a full-height sheet anchored left.
      await assertMobileSheet(page, 'icon', framework, 'left');
    });

    test('renders the right sidebar as a bottom sheet', async ({ page }) => {
      await assertMobileSheet(page, 'right-side', framework, 'down');
    });

    test('fits right-side and nested sidebars within the desktop preview width without horizontal scrolling', async ({
      page,
    }) => {
      for (const example of ['right-side', 'nested'] as const) {
        const card = previewCard(page, example);
        await card.scrollIntoViewIfNeeded();
        const viewport = card.locator('[data-preview-viewport]');
        const rightSidebar = card
          .frameLocator('iframe[data-preview]')
          .locator(`[data-fw="${framework}"] [data-slot="sidebar"][data-side="right"] [data-slot="sidebar-container"]`);

        await expect(rightSidebar).toBeVisible();
        const hasOverflow = await viewport.evaluate((el) => el.scrollWidth > el.clientWidth);
        expect(hasOverflow).toBe(false);

        const viewportBox = await viewport.boundingBox();
        const sidebarBox = await rightSidebar.boundingBox();
        expect(viewportBox).not.toBeNull();
        expect(sidebarBox).not.toBeNull();
        if (viewportBox && sidebarBox) {
          expect(sidebarBox.x + sidebarBox.width).toBeLessThanOrEqual(viewportBox.x + viewportBox.width + 1);
        }
      }
    });

    test('completely disappears on collapse (offcanvas)', async ({ page }) => {
      const frame = await exampleFrame(page, 1); // offcanvas example
      const sb = sidebar(frame, framework);
      const gap = frame.locator(`[data-fw="${framework}"] [data-slot="sidebar-gap"]`).first();
      const trigger = frame.locator(`[data-fw="${framework}"] [data-sidebar="trigger"]`).first();

      // Starts collapsed (the default): the offcanvas sidebar is fully gone.
      await expect(sb).toHaveAttribute('data-state', 'collapsed');
      await expect(gap).toHaveCSS('width', '0px');

      await expect(async () => {
        await trigger.click();
        await expect(sb).toHaveAttribute('data-state', 'expanded');
      }).toPass();
      // The offcanvas gap grows to the full 16rem (256px) when open.
      await expect(gap).toHaveCSS('width', '256px');

      await expect(async () => {
        await trigger.click();
        await expect(sb).toHaveAttribute('data-state', 'collapsed');
      }).toPass();
      await expect(gap).toHaveCSS('width', '0px');
    });

    test('toggles expanded/collapsed with the rail handle', async ({ page }) => {
      const frame = await exampleFrame(page, 2); // rail example
      const sb = sidebar(frame, framework);
      const rail = frame.locator(`[data-fw="${framework}"] [data-sidebar="rail"]`).first();

      await expect(sb).toHaveAttribute('data-state', 'collapsed');
      await expect(rail).toHaveAttribute('aria-label', 'Toggle Sidebar');

      const card = page.locator('[data-preview-frame][data-preview-example="rail"]');
      const clickRail = async () => {
        await card.scrollIntoViewIfNeeded();
        await page.waitForTimeout(120);
        const box = await rail.boundingBox();
        if (!box) throw new Error('rail handle not visible');
        await page.mouse.click(box.x + 13, box.y + 100);
      };

      await expect(async () => {
        await clickRail();
        await expect(sb).toHaveAttribute('data-state', 'expanded');
      }).toPass();

      await expect(async () => {
        await clickRail();
        await expect(sb).toHaveAttribute('data-state', 'collapsed');
      }).toPass();
    });

    test('rail activates with the Enter key', async ({ page }) => {
      const frame = await exampleFrame(page, 2); // rail example
      const sb = sidebar(frame, framework);
      const rail = frame.locator(`[data-fw="${framework}"] [data-sidebar="rail"]`).first();

      await expect(sb).toHaveAttribute('data-state', 'collapsed');
      await expect(async () => {
        await rail.focus();
        await page.keyboard.press('Enter');
        await expect(sb).toHaveAttribute('data-state', 'expanded');
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
