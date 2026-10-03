// apps/docs/e2e/page.spec.ts
// Behavior coverage for the Page layout, matrixed over React and Svelte:
// sticky gutters bottom out at the footer, gutter content hides below md,
// and the landing variant stacks viewport-height sections. The app-screen
// examples (gutters, gutter-scroll, footer, landing) render in PreviewFrame
// iframes, so assertions target the iframe document; the default example
// stays inline.
import { test, expect, type FrameLocator, type Locator } from '@playwright/test';
import { FRAMEWORKS } from './helpers';

async function previewFrameFor(card: Locator): Promise<FrameLocator> {
  await card.scrollIntoViewIfNeeded();
  const iframe = card.locator('iframe[data-preview]');
  await expect(iframe).toHaveAttribute('src', /\/preview\/page\//);
  return card.frameLocator('iframe[data-preview]');
}

for (const framework of FRAMEWORKS) {
  test.describe(`Page docs page · ${framework}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('components/page');
      // Every Page example renders in a PreviewFrame iframe — there are no
      // inline islands — so wait for the framework selector to hydrate, then
      // click; the frames pick up the framework via postMessage.
      await page.locator('[data-framework-selector][data-ready]').waitFor();
      await page.locator(`[data-framework-selector] button[data-fw="${framework}"]`).click();
    });

    test('renders page landmarks (main content and footer)', async ({ page }) => {
      const frame = await previewFrameFor(page.locator('[data-preview-frame]').first());
      const fw = `[data-fw="${framework}"]`;
      await expect(frame.locator(`${fw} [data-slot="page-content"]`).first()).toBeVisible();
      await expect(frame.locator(`${fw} [data-slot="page-footer"]`).first()).toBeVisible();
    });

    test('keeps gutters sticky while scrolling the page body', async ({ page }) => {
      const guttersCard = page.getByRole('heading', { name: 'Gutters' }).locator('..');
      const frame = await previewFrameFor(guttersCard);
      const gutter = frame.locator(`[data-fw="${framework}"] [data-slot="page-gutter"]`).first();
      await expect(gutter).toHaveCSS('position', 'sticky');
      await frame
        .locator(`[data-fw="${framework}"]`)
        .first()
        .evaluate(() => window.scrollTo(0, 0));
      const baseY = Math.round((await gutter.boundingBox())?.y ?? 0);
      await frame
        .locator(`[data-fw="${framework}"]`)
        .first()
        .evaluate(() => window.scrollBy(0, Math.floor(window.innerHeight / 2)));
      await expect
        .poll(async () => Math.abs(Math.round((await gutter.boundingBox())?.y ?? -999) - baseY))
        .toBeLessThanOrEqual(2);
    });

    test('footer appears and gutters scroll up once the page body is past', async ({ page }) => {
      const guttersCard = page.getByRole('heading', { name: 'Gutters' }).locator('..');
      const iframeEl = guttersCard.locator('iframe[data-preview]');
      const frame = await previewFrameFor(guttersCard);
      const gutter = frame.locator(`[data-fw="${framework}"] [data-slot="page-gutter"]`).first();
      const footer = frame.locator(`[data-fw="${framework}"] [data-slot="page-footer"]`).first();
      await frame
        .locator(`[data-fw="${framework}"]`)
        .first()
        .evaluate(() => window.scrollTo(0, 0));
      await footer.scrollIntoViewIfNeeded();
      await expect(footer).toBeVisible();
      // Once the footer is reached the sticky gutter has run out of room and
      // rolled above the iframe's top. Compare against the iframe's own
      // position (not an absolute y) so parent-page scroll can't flake it.
      await expect
        .poll(async () => {
          const g = await gutter.boundingBox();
          const f = await iframeEl.boundingBox();
          return g !== null && f !== null ? g.y < f.y : false;
        })
        .toBe(true);
    });

    test('hides gutter content on narrow screens', async ({ page }) => {
      const guttersCard = page.getByRole('heading', { name: 'Gutters' }).locator('..');
      const frame = await previewFrameFor(guttersCard);
      await guttersCard.locator('button[data-preview-width="mobile"]').click();
      const gutterContent = frame.locator(`[data-fw="${framework}"] [data-slot="page-gutter-content"]`).first();
      await expect(gutterContent).toBeHidden();
    });

    test('landing variant stacks viewport-height sections above the footer', async ({ page }) => {
      const landingCard = page.getByRole('heading', { name: 'Landing' }).locator('..');
      const frame = await previewFrameFor(landingCard);
      const sections = frame.locator(`[data-fw="${framework}"] [data-slot="page-section"]`);
      const section = sections.first();
      await expect(section).toBeVisible();
      const innerHeight = await frame
        .locator(`[data-fw="${framework}"]`)
        .first()
        .evaluate(() => window.innerHeight);
      await expect.poll(async () => (await section.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(innerHeight);
      const footer = frame.locator(`[data-fw="${framework}"] [data-slot="page-footer"]`).first();
      const lastSection = sections.last();
      await expect
        .poll(async () => {
          const f = await footer.boundingBox();
          const s = await lastSection.boundingBox();
          return f !== null && s !== null ? f.y >= s.y + s.height - 1 : -1;
        })
        .toBe(true);
    });
  });
}
