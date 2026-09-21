// apps/docs/e2e/toc.spec.ts
// Behavior coverage for the TableOfContents component page, matrixed over React and Svelte.
// Every example renders in a PreviewFrame iframe and uses the published Page
// layout with TableOfContents in its right PageGutter. Assertions target the isolated preview
// document and guard both the composition and the one-machine contract.
import { test, expect, type FrameLocator, type Page } from '@playwright/test';
import { FRAMEWORKS, type Framework } from './helpers';

// The docs card is narrower than the `md` breakpoint at Playwright's default
// viewport, which would hide the `Prose` example's `PageGutter`. Run the suite
// at a width where the gutter content is visible.
test.use({ viewport: { width: 1440, height: 900 } });

// The eight Ark UI examples, by the exact docs example id.
const ARK_EXAMPLES = [
  'basic',
  'nested-headings',
  'root-provider',
  'collapsible',
  'hover',
  'indicator',
  'rail',
  'tree-view',
] as const;
// Plus the helical-ui specific Prose/gutter example.
const ALL_EXAMPLES = [...ARK_EXAMPLES, 'prose'] as const;

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
  const card = cardFor(page, example);
  await card.scrollIntoViewIfNeeded();
  const frame = card.frameLocator('iframe[data-preview]');
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

/** Put one heading near the viewport bottom while keeping the next heading below it. */
async function scrollHeadingToViewportBottom(frame: FrameLocator, framework: Framework, id: string) {
  await frame.locator(`${scope(framework)} [id="${idOf(framework, id)}"]`).evaluate((el) => {
    const view = el.ownerDocument.defaultView;
    if (!view) return;
    const headingBottom = el.getBoundingClientRect().bottom;
    const targetBottom = view.innerHeight - 24;
    view.scrollBy({ top: headingBottom - targetBottom, behavior: 'instant' });
  });
}

/** The high-level renderer exposes exactly one current link from Ark's active range. */
async function expectActive(frame: FrameLocator, framework: Framework, id: string) {
  await expect(
    frame.locator(`${scope(framework)} nav a[data-value="${idOf(framework, id)}"][data-current]`),
  ).toBeVisible({
    timeout: 10_000,
  });
  await expect(frame.locator(`${scope(framework)} nav a[data-value="${idOf(framework, id)}"]`)).toHaveAttribute(
    'aria-current',
    'location',
  );
  await expect(frame.locator(`${scope(framework)} nav a[data-current]`)).toHaveCount(1);
  await expect(frame.locator(`${scope(framework)} nav a[aria-current="location"]`)).toHaveCount(1);
}

/** The requested heading is included in Zag's visible range. */
async function expectVisibleHeading(frame: FrameLocator, framework: Framework, id: string) {
  await expect(
    frame.locator(`${scope(framework)} nav a[data-value="${idOf(framework, id)}"][data-active]`),
  ).toBeVisible({ timeout: 10_000 });
}

/** The renderer exposes the last heading in Zag's visible range as current. */
async function expectLastVisibleCurrent(frame: FrameLocator, framework: Framework) {
  await expect
    .poll(
      async () => {
        const activeValues = await frame
          .locator(`${scope(framework)} nav a[data-active]`)
          .evaluateAll((links) => links.map((link) => link.getAttribute('data-value')));
        const currentValue = await frame.locator(`${scope(framework)} nav a[data-current]`).getAttribute('data-value');
        return activeValues.length > 0 && currentValue === activeValues.at(-1);
      },
      { timeout: 10_000 },
    )
    .toBe(true);
  await expect(frame.locator(`${scope(framework)} nav a[data-current]`)).toHaveCount(1);
  await expect(frame.locator(`${scope(framework)} nav a[aria-current="location"]`)).toHaveCount(1);
}

/** The `activeIds` the Root Provider example renders from its own machine. */
async function outputIds(frame: FrameLocator, framework: Framework): Promise<string[]> {
  const text = (await frame.locator(`${scope(framework)} output`).textContent()) ?? '';
  const json = text.slice(text.indexOf('['));
  if (!json.startsWith('[')) return [];
  try {
    return JSON.parse(json) as string[];
  } catch {
    return [];
  }
}

test('wheel input scrolls the long rail preview document', async ({ page }) => {
  await page.goto('components/toc');
  await page.locator('[data-framework-selector][data-ready]').waitFor();
  const frame = await frameFor(page, 'rail', 'react');

  await frame.locator(`${scope('react')} nav`).hover();
  const before = await frame.locator('html').evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 1_000);
  await expect.poll(() => frame.locator('html').evaluate(() => window.scrollY)).toBeGreaterThan(before);
});

for (const framework of FRAMEWORKS) {
  test.describe(`TableOfContents docs page · ${framework}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('components/toc');
      // Every TableOfContents example is an iframe, so wait for the framework selector to
      // hydrate and click; the frames pick the framework up via postMessage.
      await page.locator('[data-framework-selector][data-ready]').waitFor();
      await page.locator(`[data-framework-selector] button[data-fw="${framework}"]`).click();
    });

    test('defers offscreen preview navigation until it approaches the viewport', async ({ page }) => {
      const card = cardFor(page, 'tree-view');
      const iframe = card.locator('iframe[data-preview]');
      await expect(iframe).toHaveAttribute('loading', 'lazy');
      await expect(iframe).not.toHaveAttribute('src', /preview\/toc\/tree-view/);

      await card.scrollIntoViewIfNeeded();
      await expect(iframe).toHaveAttribute('src', /preview\/toc\/tree-view\//);
    });

    test('renders nine demos, each in its own preview iframe', async ({ page }) => {
      const frames = page.locator('[data-preview-frame][data-component="toc"]');
      await expect(frames).toHaveCount(ALL_EXAMPLES.length);
      for (const example of ALL_EXAMPLES) {
        const card = cardFor(page, example);
        const iframe = card.locator('iframe[data-preview]');
        await expect(iframe).toHaveAttribute('loading', 'lazy');
        await card.scrollIntoViewIfNeeded();
        await expect.poll(() => iframe.getAttribute('src')).toContain(`preview/toc/${example}/`);
      }
    });

    test('basic: tracks the active heading and follows link navigation', async ({ page }) => {
      const frame = await frameFor(page, 'basic', framework);

      // Use a middle heading that does not clamp either framework's preview
      // root to its maximum scroll position.
      await scrollHeadingIntoBand(frame, framework, '01-getting-started');
      await expectVisibleHeading(frame, framework, '01-getting-started');
      await expectLastVisibleCurrent(frame, framework);

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
      await expectVisibleHeading(frame, framework, '01-installation');
      await expectLastVisibleCurrent(frame, framework);

      // Moving the surrounding docs page must not alter the iframe machine's
      // current item when the preview document's own scroll position is unchanged.
      const innerTop = await documentElement.evaluate(() => window.scrollY);
      const currentBeforeOuterScroll = await frame
        .locator(`${scope(framework)} nav a[data-current]`)
        .getAttribute('data-value');
      await page.evaluate(() => window.scrollBy(0, 250));
      await expect.poll(() => documentElement.evaluate(() => window.scrollY)).toBe(innerTop);
      await expect
        .poll(() => frame.locator(`${scope(framework)} nav a[data-current]`).getAttribute('data-value'))
        .toBe(currentBeforeOuterScroll);
      await expectLastVisibleCurrent(frame, framework);
    });

    test('nested headings: keeps depth data and tracks nested headings', async ({ page }) => {
      const frame = await frameFor(page, 'nested-headings', framework);

      // Depth survives onto the item element.
      await expect(
        frame.locator(`${scope(framework)} nav li[data-value="${idOf(framework, '02-free-blocks')}"]`),
      ).toHaveAttribute('data-depth', '3');
      await expect(
        frame.locator(`${scope(framework)} nav li[data-value="${idOf(framework, '02-importance')}"]`),
      ).toHaveAttribute('data-depth', '2');

      // Deeper items are indented further (depth drives indentation).
      const indentOf = (value: string) =>
        frame
          .locator(`${scope(framework)} nav a[data-value="${idOf(framework, value)}"]`)
          .evaluate((el) => Number.parseFloat(getComputedStyle(el).paddingInlineStart));
      expect(await indentOf('02-free-blocks')).toBeGreaterThan(await indentOf('02-importance'));

      // Active tracking works for a nested (depth 3) heading, while the last
      // visible heading remains the one public current item.
      await scrollHeadingIntoBand(frame, framework, '02-configuration');
      await expectVisibleHeading(frame, framework, '02-configuration');
      await expectLastVisibleCurrent(frame, framework);
    });

    test('root provider: one machine drives both the output and the active link', async ({ page }) => {
      const frame = await frameFor(page, 'root-provider', framework);

      // Exactly one machine: the exported useToc the example created.
      await expect(frame.locator(`${scope(framework)} output`)).toHaveCount(1);
      await expect(frame.locator(`${scope(framework)} nav[data-part="root"]`)).toHaveCount(1);

      await scrollHeadingIntoBand(frame, framework, '03-usage');

      // Ark can report a contiguous visible range. TableOfContents marks the
      // last item in that range current while preserving the machine's full list.
      await expect
        .poll(
          async () => {
            const link = await frame.locator(`${scope(framework)} nav a[data-current]`).getAttribute('data-value');
            const ids = await outputIds(frame, framework);
            return {
              includesUsage: ids.includes(idOf(framework, '03-usage')),
              linkIsLastVisible: link === ids.at(-1),
            };
          },
          { timeout: 10_000 },
        )
        .toEqual({ includesUsage: true, linkIsLastVisible: true });
    });

    test('collapsible: reveals numbered links from the progress-ring trigger', async ({ page }) => {
      const frame = await frameFor(page, 'collapsible', framework);
      const trigger = frame.locator(`${scope(framework)} [data-part="trigger"]`).first();
      const sticky = frame.locator(`${scope(framework)} [data-slot="page-content"] > .sticky`);
      const link = frame.locator(`${scope(framework)} nav a[data-value="${idOf(framework, '04-quick-start')}"]`);

      // Ark's stacked composition pins the collapsible above scrolling content.
      await expect(sticky).toHaveCSS('position', 'sticky');
      await expect(frame.locator(`${scope(framework)} [data-slot="page-gutter"]`)).toHaveCount(0);

      // The trigger shows a progress ring; the list starts collapsed.
      await expect(trigger).toBeVisible();
      await expect(frame.locator(`${scope(framework)} [data-part="trigger"] svg text`)).toBeVisible();
      await expect(trigger).toHaveAttribute('data-state', 'closed');
      await expect(link).toBeHidden();

      await trigger.click();
      await expect(trigger).toHaveAttribute('data-state', 'open');
      await expect(link).toBeVisible();
      // Numbered links (the third item renders as "03").
      await expect(link).toContainText('03');
    });

    test('hover: swaps skeleton bars for links on pointer enter', async ({ page }) => {
      const frame = await frameFor(page, 'hover', framework);

      // Ark's hover nav is the root nav — not a second nested landmark.
      await expect(frame.locator(`${scope(framework)} nav`)).toHaveCount(1);

      const skeleton = frame.locator(`${scope(framework)} [data-type="off"]`);
      const links = frame.locator(`${scope(framework)} [data-type="on"]`);
      await expect(skeleton).toBeVisible();
      await expect(links).toBeHidden();

      const nav = frame.locator(`${scope(framework)} nav`);
      await nav.hover();
      await expect(links).toBeVisible();
      await expect(skeleton).toBeHidden();
      await expect(
        frame.locator(`${scope(framework)} nav a[data-value="${idOf(framework, '05-cloud-storage')}"]`),
      ).toBeVisible();
      await expect(links).toHaveCSS('list-style-type', 'none');
      await expect
        .poll(() =>
          nav.evaluate((el) => {
            const rect = el.getBoundingClientRect();
            return {
              centered: Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2) <= 2,
              onRight: window.innerWidth - rect.right < 80,
            };
          }),
        )
        .toEqual({ centered: true, onRight: true });
    });

    test('indicator: slides a marker to the active item', async ({ page }) => {
      const frame = await frameFor(page, 'indicator', framework);
      const root = frame.locator(`${scope(framework)} [data-part="root"]`).first();
      const marker = frame.locator(`${scope(framework)} [data-part="indicator"]`);

      await scrollHeadingIntoBand(frame, framework, '06-upload-progress');
      await expectActive(frame, framework, '06-upload-progress');
      await expect(marker).toBeVisible();
      await expect(marker).toHaveCSS('position', 'absolute');
      // The machine publishes the active rect on the root as CSS custom properties.
      await expect
        .poll(() => root.evaluate((el) => (el as HTMLElement).style.getPropertyValue('--height')))
        .not.toBe('');
      const firstTop = await root.evaluate((el) => (el as HTMLElement).style.getPropertyValue('--top'));

      // Scroll a band with trailing content after it: the machine can only mark a
      // heading active once it reaches the top band of the scroll root. Ark's
      // last section is deliberately short and never reaches it at the bottom.
      await scrollHeadingIntoBand(frame, framework, '06-build-pipeline');
      await expectActive(frame, framework, '06-build-pipeline');
      await expect
        .poll(() => root.evaluate((el) => (el as HTMLElement).style.getPropertyValue('--top')))
        .not.toBe(firstTop);

      // The final short sections advance one at a time as each becomes the last
      // visible heading. This guards against jumping directly from Database to
      // Publish before Final Draft and Final Review enter the viewport.
      for (const id of ['06-database-health', '06-final-draft', '06-final-review'] as const) {
        await scrollHeadingToViewportBottom(frame, framework, id);
        await expectActive(frame, framework, id);
      }

      // At the scroll boundary all trailing headings are visible. Ark retains the
      // full range internally, while TableOfContents marks its last item current
      // and aligns one single-row indicator to it.
      await frame
        .locator('html')
        .evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
      await expect.poll(() => frame.locator(`${scope(framework)} nav a[data-active]`).count()).toBeGreaterThan(1);
      await expectActive(frame, framework, '06-publish');
      await expect.poll(() => marker.evaluate((el) => Math.round(el.getBoundingClientRect().height))).toBe(30);
      const currentLink = frame.locator(`${scope(framework)} nav a[data-current]`);
      await expect
        .poll(async () => {
          const [markerBox, currentBox] = await Promise.all([marker.boundingBox(), currentLink.boundingBox()]);
          return markerBox && currentBox ? Math.abs(markerBox.y - currentBox.y) : Number.POSITIVE_INFINITY;
        })
        .toBeLessThanOrEqual(2);
      const databaseLink = frame.locator(
        `${scope(framework)} nav a[data-value="${idOf(framework, '06-database-health')}"]`,
      );
      await expect
        .poll(async () => {
          const [markerBox, databaseBox] = await Promise.all([marker.boundingBox(), databaseLink.boundingBox()]);
          return markerBox && databaseBox ? markerBox.y > databaseBox.y + 2 : false;
        })
        .toBe(true);
    });

    test('rail: renders per-item depth geometry with clamped deep levels', async ({ page }) => {
      const frame = await frameFor(page, 'rail', framework);

      // One rail SVG per item, plus a bezier turn wherever the depth changes.
      // The upstream per-row SVG math assumes zero list gap.
      await expect(frame.locator(`${scope(framework)} nav a svg`)).toHaveCount(9);
      await expect(frame.locator(`${scope(framework)} nav ul`)).toHaveCSS('row-gap', '0px');
      await expect(frame.locator(`${scope(framework)} nav svg path`).first()).toBeAttached();

      const indentOf = (value: string) =>
        frame
          .locator(`${scope(framework)} nav a[data-value="${idOf(framework, value)}"]`)
          .evaluate((el) => Number.parseFloat(getComputedStyle(el).paddingInlineStart));
      // depth 2 < depth 3 < depth 4 (Ark's rail clamps only above h4, which the
      // example does not contain).
      expect(await indentOf('07-package-manager')).toBeGreaterThan(await indentOf('07-installation'));
      expect(await indentOf('07-theming')).toBeGreaterThan(await indentOf('07-styling'));
    });

    test('tree view: auto-expands the branch around the active section', async ({ page }) => {
      const frame = await frameFor(page, 'tree-view', framework);

      await expect(frame.locator(`${scope(framework)} [data-part="branch-control"]`)).toHaveCount(3);
      const childLink = frame.locator(`${scope(framework)} nav a[data-value="${idOf(framework, '09-toc-events')}"]`);
      // Branches start collapsed, so child links are not shown.
      await expect(childLink).toBeHidden();

      // Activating a child heading expands its branch. A later visible heading
      // may be current, but it must be the last item in Zag's visible range.
      await scrollHeadingIntoBand(frame, framework, '09-toc-events');
      await expectVisibleHeading(frame, framework, '09-toc-events');
      await expectLastVisibleCurrent(frame, framework);
      await expect(childLink).toBeVisible();
      await expect(
        frame.locator(`${scope(framework)} [data-part="branch-control"]`).filter({ hasText: 'Core Concepts' }),
      ).toHaveAttribute('data-state', 'open');
    });

    test('prose: renders Prose in a gutter and tracks iframe document scroll', async ({ page }) => {
      const frame = await frameFor(page, 'prose', framework);

      await expect(frame.locator(`${scope(framework)} [data-slot="page-gutter"]`)).toBeAttached();
      await expect(frame.locator(`${scope(framework)} .prose`)).toBeVisible();
      // Real headings with matching ids inside the Prose article.
      await expect(frame.locator(`${scope(framework)} .prose h2#${idOf(framework, 'prose-theming')}`)).toBeAttached();

      await scrollHeadingIntoBand(frame, framework, 'prose-authoring');
      await expectVisibleHeading(frame, framework, 'prose-authoring');
      await expectLastVisibleCurrent(frame, framework);
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
