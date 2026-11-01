// apps/docs/e2e/toc.spec.ts
// Behavior coverage for the TableOfContents component page, matrixed over React and Svelte.
// Every example renders in a PreviewFrame iframe and uses the published Page
// layout with TableOfContents in its right PageGutter. Assertions target the isolated preview
// document and guard both the composition and the one-machine contract.
import { test, expect, type FrameLocator, type Page } from '@playwright/test';
import { previewFrameFor } from '@cloudvoyant/testing';
import { FRAMEWORKS, type Framework } from './helpers';

// The docs card is narrower than the `md` breakpoint at Playwright's default
// viewport, which would hide the `Prose` example's `PageGutter`. Run the suite
// at a width where the gutter content is visible.
test.use({ viewport: { width: 1440, height: 900 } });

const scope = (framework: Framework) => `[data-fw="${framework}"]`;

// Every heading id is namespaced with its framework because the preview route
// mounts both islands at once; the table-of-contents machine resolves headings with
// `document.getElementById`, so only the active framework may own the id.
const idOf = (framework: Framework, id: string) => `${framework}-${id}`;

// The intro `basic` demo has no card heading, so locate by the preview frame's
// own data attributes rather than by an example title.
function cardFor(page: Page, example: string) {
  return page.locator(`[data-preview-frame][data-component="toc"][data-preview-example="${example}"]`);
}

/**
 * Wait for the active framework's island inside an example iframe to hydrate and
 * render. Unlike the inline demos, these islands are 0-height until the frame
 * receives the framework via postMessage, so visibility is the readiness signal.
 */
async function frameFor(
  page: Page,
  example: string,
  framework: Framework,
  readySelector = 'nav',
): Promise<FrameLocator> {
  const frame = await previewFrameFor(cardFor(page, example), `toc/${example}`);
  await expect(frame.locator(`${scope(framework)} ${readySelector}`).first()).toBeVisible({ timeout: 15_000 });
  return frame;
}

/** Scroll a tracked heading into the iframe document's active band. */
async function scrollHeadingIntoBand(frame: FrameLocator, framework: Framework, id: string) {
  await frame.locator(`${scope(framework)} [id="${idOf(framework, id)}"]`).evaluate((el) => {
    const view = el.ownerDocument.defaultView;
    if (!view) return;
    const targetTop = view.scrollY + el.getBoundingClientRect().top - 100;
    view.scrollTo({ top: targetTop, behavior: 'instant' });
  });
}

/** Exactly one link is current, even when Ark observes multiple headings. */
async function expectActive(frame: FrameLocator, framework: Framework, id: string) {
  await expect(
    frame.locator(`${scope(framework)} nav a[data-value="${idOf(framework, id)}"][data-current]`),
  ).toBeVisible({ timeout: 10_000 });
  await expect(frame.locator(`${scope(framework)} nav a[data-value="${idOf(framework, id)}"]`)).toHaveAttribute(
    'aria-current',
    'location',
  );
  await expect(frame.locator(`${scope(framework)} nav a[data-current]`)).toHaveCount(1);
  await expect(frame.locator(`${scope(framework)} nav a[aria-current="location"]`)).toHaveCount(1);
}

for (const framework of FRAMEWORKS) {
  test.describe(`TableOfContents docs page · ${framework}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('components/toc');
      // Every TableOfContents example is an iframe, so wait for the framework selector to
      // hydrate and click; the frames pick the framework up via postMessage.
      await page.locator('[data-framework-selector][data-ready]').waitFor();
      await page.locator(`[data-framework-selector] button[data-fw="${framework}"]`).click();
    });

    test('scrolling to the end keeps the final heading visible and current', async ({ page }) => {
      const frame = await frameFor(page, 'indicator', framework);
      await frame
        .locator('html')
        .evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
      const lastLink = frame.locator(`${scope(framework)} nav a[data-value="${idOf(framework, '06-publish')}"]`);
      await expect(lastLink).toBeVisible();
      await expect(lastLink).toHaveAttribute('aria-current', 'location');
    });

    test('wheel input scrolls the long rail preview document', async ({ page }) => {
      const frame = await frameFor(page, 'rail', framework);
      await frame.locator(`${scope(framework)} nav`).hover();
      const before = await frame.locator('html').evaluate(() => window.scrollY);
      await page.mouse.wheel(0, 1_000);
      await expect.poll(() => frame.locator('html').evaluate(() => window.scrollY)).toBeGreaterThan(before);
    });

    test('basic: navigates to a heading, updates the hash, and isolates iframe scroll', async ({ page }) => {
      const frame = await frameFor(page, 'basic', framework);

      // Use a middle heading that does not clamp either framework's preview
      // root to its maximum scroll position.
      await scrollHeadingIntoBand(frame, framework, '01-getting-started');
      await expect(
        frame.locator(`${scope(framework)} nav a[data-value="${idOf(framework, '01-getting-started')}"]`),
      ).toHaveAttribute('aria-current', 'location');

      // Clicking a link scrolls the iframe document and updates its hash.
      const documentElement = frame.locator('html');
      const beforeClickTop = await documentElement.evaluate(() => window.scrollY);
      await frame.locator(`${scope(framework)} nav a[data-value="${idOf(framework, '01-installation')}"]`).click();
      await expect
        .poll(() => documentElement.evaluate((_, before) => Math.abs(window.scrollY - before), beforeClickTop))
        .toBeGreaterThan(10);
      await expect
        .poll(() => frame.locator('html').evaluate(() => location.hash))
        .toBe(`#${idOf(framework, '01-installation')}`);

      // End the machine's smooth link-scroll animation at one deterministic
      // position before asserting IntersectionObserver-derived current state.
      await scrollHeadingIntoBand(frame, framework, '01-installation');
      await expect(
        frame.locator(`${scope(framework)} nav a[data-value="${idOf(framework, '01-installation')}"]`),
      ).toHaveAttribute('aria-current', 'location');

      // Moving the surrounding docs page must not scroll the iframe document.
      // The active range may settle after the link's smooth-scroll animation.
      const innerTop = await documentElement.evaluate(() => window.scrollY);
      await page.evaluate(() => window.scrollBy(0, 250));
      await expect.poll(() => documentElement.evaluate(() => window.scrollY)).toBe(innerTop);
    });

    test('nested headings: navigates to and tracks a nested heading', async ({ page }) => {
      const frame = await frameFor(page, 'nested-headings', framework);

      const nestedLink = frame.locator(
        `${scope(framework)} nav a[data-value="${idOf(framework, '02-configuration')}"]`,
      );
      await nestedLink.click();
      await expect
        .poll(() => frame.locator('html').evaluate(() => location.hash))
        .toBe(`#${idOf(framework, '02-configuration')}`);
      await expect(nestedLink).toHaveAttribute('data-active', '');
      await expect(frame.locator(`${scope(framework)} nav a[aria-current="location"]`)).toHaveCount(1);
    });

    test('root provider: one machine drives both the output and the active link', async ({ page }) => {
      const frame = await frameFor(page, 'root-provider', framework);

      // Exactly one machine: the exported useToc the example created.
      await expect(frame.locator(`${scope(framework)} output`)).toHaveCount(1);
      await expect(frame.locator(`${scope(framework)} [data-part="root"]`)).toHaveCount(1);

      await scrollHeadingIntoBand(frame, framework, '03-usage');

      // Ark reports a contiguous visible range. The last item is current,
      // using the same machine as the output.
      await expect
        .poll(
          async () => {
            const links = await frame
              .locator(`${scope(framework)} nav a[aria-current="location"]`)
              .evaluateAll((elements) => elements.map((link) => link.getAttribute('data-value')));
            const output = await frame.locator(`${scope(framework)} output`).textContent();
            return {
              includesUsage: output?.includes('03-usage') ?? false,
              linkIsCurrent: links.length === 1 && links[0] === idOf(framework, '03-usage'),
            };
          },
          { timeout: 10_000 },
        )
        .toEqual({ includesUsage: true, linkIsCurrent: true });
    });

    test('collapsible: reveals links when expanded', async ({ page }) => {
      const frame = await frameFor(page, 'collapsible', framework);
      const trigger = frame.locator(`${scope(framework)} [data-part="trigger"]`).first();
      const link = frame.locator(`${scope(framework)} nav a[data-value="${idOf(framework, '04-quick-start')}"]`);

      // The list starts collapsed.
      await expect(trigger).toBeVisible();
      await expect(link).toBeHidden();

      await trigger.click();
      await expect(link).toBeVisible();
    });

    test('hover: swaps skeleton bars for links on pointer enter', async ({ page }) => {
      const frame = await frameFor(page, 'hover', framework);

      const nav = frame.locator(`${scope(framework)} nav`);
      await expect(nav.locator('a').first()).toBeHidden();
      await nav.hover();
      await expect(nav.locator('a').first()).toBeVisible();
    });

    test('current-link behavior: tracks the active item', async ({ page }) => {
      const frame = await frameFor(page, 'indicator', framework);

      await scrollHeadingIntoBand(frame, framework, '06-upload-progress');
      await expectActive(frame, framework, '06-upload-progress');
      // Scroll a band with trailing content after it: the machine can only mark a
      // heading active once it reaches the top band of the scroll root. Ark's
      // last section is deliberately short and never reaches it at the bottom.
      await scrollHeadingIntoBand(frame, framework, '06-build-pipeline');
      await expectActive(frame, framework, '06-build-pipeline');
      // At the scroll boundary several headings are active. The current link
      // remains the single current row, including the last short section.
      await frame
        .locator('html')
        .evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
      await expectActive(frame, framework, '06-publish');
    });

    test('tree view: auto-expands the branch around the active section', async ({ page }) => {
      const frame = await frameFor(page, 'tree-view', framework);

      const childLink = frame.locator(`${scope(framework)} nav a[data-value="${idOf(framework, '09-toc-events')}"]`);
      // Branches start collapsed, so child links are not shown.
      await expect(childLink).toBeHidden();

      // Activating a child heading expands its branch. A later visible heading
      // may be current, but it must be the last item in Zag's visible range.
      await scrollHeadingIntoBand(frame, framework, '09-toc-events');
      await expect(
        frame.locator(`${scope(framework)} nav a[data-value="${idOf(framework, '09-toc-events')}"]`),
      ).toHaveAttribute('aria-current', 'location');
      await expect(childLink).toBeVisible();
    });

    test('prose: renders Prose in a gutter and tracks iframe document scroll', async ({ page }) => {
      const frame = await frameFor(page, 'prose', framework);

      await expect(frame.locator(`${scope(framework)} [data-slot="page-gutter"]`)).toBeAttached();
      await expect(frame.locator(`${scope(framework)} .prose`)).toBeVisible();
      // Real headings with matching ids inside the Prose article.
      await expect(frame.locator(`${scope(framework)} .prose h2#${idOf(framework, 'prose-theming')}`)).toBeAttached();

      await scrollHeadingIntoBand(frame, framework, 'prose-authoring');
      await expect(
        frame.locator(`${scope(framework)} nav a[data-value="${idOf(framework, 'prose-authoring')}"]`),
      ).toHaveAttribute('data-active', '');
      await expect(frame.locator(`${scope(framework)} nav a[aria-current="location"]`)).toHaveCount(1);
    });

    test('framework and theme switching reach the preview frame', async ({ page }) => {
      const frame = await frameFor(page, 'basic', framework);
      const other: Framework = framework === 'react' ? 'svelte' : 'react';

      // The non-active framework's island is hidden inside the frame.
      await expect(frame.locator(scope(other))).toBeHidden();
      await expect(frame.locator('html')).toHaveAttribute('data-framework', framework);

      // Theme changes propagate through the existing postMessage protocol.
      const trigger = page.locator('[data-theme-selector]');
      await expect(trigger).toBeVisible();
      await expect(async () => {
        await trigger.click();
        await expect(page.locator('[data-theme-modal]')).toBeVisible();
      }).toPass();
      await page.locator('[data-theme-swatch="catppuccin"]').click();
      await expect(frame.locator('html')).toHaveClass(/theme-catppuccin/);
    });
  });
}
