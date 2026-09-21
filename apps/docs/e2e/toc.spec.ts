// apps/docs/e2e/toc.spec.ts
// Behavior coverage for the Toc component page, matrixed over React and Svelte.
// Every Toc example renders in a PreviewFrame iframe and uses the published Page
// layout with Toc in its right PageGutter. Assertions target the isolated preview
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
// mounts both islands at once; the Toc machine resolves headings with
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
  readySelector = '[data-toc-scroll]',
): Promise<FrameLocator> {
  const card = cardFor(page, example);
  await card.scrollIntoViewIfNeeded();
  const frame = card.frameLocator('iframe[data-preview]');
  await expect(frame.locator(`${scope(framework)} ${readySelector}`).first()).toBeVisible({ timeout: 15_000 });
  return frame;
}

/** Scroll a tracked heading into the isolated full-preview Page scroll root. */
async function scrollHeadingIntoBand(frame: FrameLocator, framework: Framework, id: string) {
  await frame.locator(`${scope(framework)} [id="${idOf(framework, id)}"]`).evaluate((el) => {
    const root = el.closest('[data-toc-scroll-root]') as HTMLElement | null;
    if (!root) return;
    const targetTop = root.scrollTop + el.getBoundingClientRect().top - root.getBoundingClientRect().top - 100;
    // Assigning scrollTop bypasses CSS smooth scrolling, so IntersectionObserver
    // receives one deterministic position instead of overlapping animations.
    root.scrollTop = targetTop;
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

/** The `activeIds` the Root Provider example renders from its own machine. */
async function outputIds(frame: FrameLocator, framework: Framework): Promise<string[]> {
  const text = (await frame.locator(`${scope(framework)} [data-toc-active-ids]`).textContent()) ?? '';
  const json = text.slice(text.indexOf('['));
  if (!json.startsWith('[')) return [];
  try {
    return JSON.parse(json) as string[];
  } catch {
    return [];
  }
}

test('wheel input over the long rail preview can still reach the end of the docs page', async ({ page }) => {
  await page.goto('components/toc');
  await page.locator('[data-framework-selector][data-ready]').waitFor();
  await frameFor(page, 'rail', 'react');

  const iframe = cardFor(page, 'rail').locator('iframe[data-preview]');
  await iframe.scrollIntoViewIfNeeded();
  const box = await iframe.boundingBox();
  expect(box).not.toBeNull();
  if (!box) return;

  await page.mouse.move(box.x + box.width / 2, box.y + Math.min(box.height / 2, 250));
  for (let index = 0; index < 20; index += 1) {
    await page.mouse.wheel(0, 1_000);
  }

  await expect
    .poll(() =>
      page.evaluate(() => ({
        atEnd: Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight,
      })),
    )
    .toEqual({ atEnd: true });
});

for (const framework of FRAMEWORKS) {
  test.describe(`Toc docs page · ${framework}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('components/toc');
      // Every Toc example is an iframe, so wait for the framework selector to
      // hydrate and click; the frames pick the framework up via postMessage.
      await page.locator('[data-framework-selector][data-ready]').waitFor();
      await page.locator(`[data-framework-selector] button[data-fw="${framework}"]`).click();
    });

    test('renders nine demos, each in its own preview iframe', async ({ page }) => {
      const frames = page.locator('[data-preview-frame][data-component="toc"]');
      await expect(frames).toHaveCount(ALL_EXAMPLES.length);
      for (const example of ALL_EXAMPLES) {
        const src = await cardFor(page, example).locator('iframe[data-preview]').getAttribute('src');
        expect(src).toContain(`preview/toc/${example}/`);
      }
    });

    test('represents all eight Ark examples one-for-one, plus Prose', async ({ page }) => {
      for (const example of ARK_EXAMPLES) {
        await expect(cardFor(page, example)).toHaveCount(1);
      }
      await expect(cardFor(page, 'prose')).toHaveCount(1);
      // Every example uses Page inside one full-preview scroll root. Gutter
      // variants place Toc in the right gutter; Ark's stacked collapsible stays sticky above
      // its content instead of being forced into a sidebar.
      for (const example of ALL_EXAMPLES) {
        const frame = await frameFor(
          page,
          example,
          framework,
          example === 'prose' ? '[data-slot="page-content"]' : '[data-toc-scroll]',
        );
        await expect(frame.locator(`${scope(framework)} [data-slot="page"]`)).toHaveCount(1);
        const rightGutter = frame.locator(
          `${scope(framework)} [data-slot="page-gutter-area"][class*="grid-area:right"]`,
        );
        await expect(rightGutter).toHaveCount(example === 'collapsible' ? 0 : 1);
        await expect(frame.locator(`${scope(framework)} [data-slot="page-content"]`)).not.toHaveCSS(
          'overflow-y',
          'auto',
        );
      }

      // The one-machine guarantee: each example renders exactly one toc root.
      const frame = await frameFor(page, 'basic', framework);
      await expect(frame.locator(`${scope(framework)} [data-part="root"]`)).toHaveCount(1);
    });

    test('basic: tracks the active heading and follows link navigation', async ({ page }) => {
      const frame = await frameFor(page, 'basic', framework);

      // Use a middle heading that does not clamp either framework's preview
      // root to its maximum scroll position.
      await scrollHeadingIntoBand(frame, framework, '01-getting-started');
      await expectActive(frame, framework, '01-getting-started');

      // Clicking a link scrolls the isolated Page root and updates its hash.
      const scrollRoot = frame.locator(`${scope(framework)} [data-toc-scroll-root]`);
      const beforeClickTop = await scrollRoot.evaluate((el) => el.scrollTop);
      await frame.locator(`${scope(framework)} nav a[data-value="${idOf(framework, '01-installation')}"]`).click();
      await expect
        .poll(() => scrollRoot.evaluate((el, before) => Math.abs(el.scrollTop - before), beforeClickTop))
        .toBeGreaterThan(10);
      await expect
        .poll(() => frame.locator('html').evaluate(() => location.hash))
        .toBe(`#${idOf(framework, '01-installation')}`);

      // End the machine's smooth link-scroll animation at one deterministic
      // position before asserting IntersectionObserver-derived current state.
      await scrollHeadingIntoBand(frame, framework, '01-installation');
      await expectActive(frame, framework, '01-installation');

      // Moving the surrounding docs page must not alter the iframe machine's
      // current item when the preview's own scroll position is unchanged.
      const innerTop = await scrollRoot.evaluate((el) => el.scrollTop);
      await page.evaluate(() => window.scrollBy(0, 250));
      await expect(scrollRoot).toHaveJSProperty('scrollTop', innerTop);
      await expectActive(frame, framework, '01-installation');
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

      // Active tracking works for a nested (depth 3) heading.
      await scrollHeadingIntoBand(frame, framework, '02-configuration');
      await expectActive(frame, framework, '02-configuration');
    });

    test('root provider: one machine drives both the output and the active link', async ({ page }) => {
      const frame = await frameFor(page, 'root-provider', framework);

      // Exactly one machine: the exported useToc the example created.
      await expect(frame.locator(`${scope(framework)} [data-toc-active-ids]`)).toHaveCount(1);
      await expect(frame.locator(`${scope(framework)} nav[data-part="root"]`)).toHaveCount(1);

      await scrollHeadingIntoBand(frame, framework, '03-usage');

      // Ark can report a contiguous active range. During normal scrolling the
      // high-level Toc agrees with the machine's first active id, proving both
      // read the same supplied machine without discarding its range state.
      await expect
        .poll(
          async () => {
            const link = await frame.locator(`${scope(framework)} nav a[data-current]`).getAttribute('data-value');
            const ids = await outputIds(frame, framework);
            return { firstId: ids[0], includesUsage: ids.includes(idOf(framework, '03-usage')), link };
          },
          { timeout: 10_000 },
        )
        .toEqual({
          firstId: idOf(framework, '03-usage'),
          includesUsage: true,
          link: idOf(framework, '03-usage'),
        });
    });

    test('collapsible: reveals numbered links from the progress-ring trigger', async ({ page }) => {
      const frame = await frameFor(page, 'collapsible', framework);
      const trigger = frame.locator(`${scope(framework)} [data-part="trigger"]`).first();
      const sticky = frame.locator(`${scope(framework)} [data-toc-sticky]`);
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

      // Three content-free headings at the end deliberately occupy the active
      // band together. Ark retains that range internally, while the public Toc
      // marks its last item current and aligns one single-row indicator to it.
      await frame
        .locator(`${scope(framework)} [data-toc-scroll-root]`)
        .evaluate((root) => root.scrollTo({ top: root.scrollHeight }));
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

      // Activating a child heading expands its branch.
      await scrollHeadingIntoBand(frame, framework, '09-toc-events');
      await expectActive(frame, framework, '09-toc-events');
      await expect(childLink).toBeVisible();
      await expect(
        frame.locator(`${scope(framework)} [data-part="branch-control"]`).filter({ hasText: 'Core Concepts' }),
      ).toHaveAttribute('data-state', 'open');
    });

    test('prose: renders Prose in a gutter and tracks isolated preview scroll', async ({ page }) => {
      const frame = await frameFor(page, 'prose', framework, '[data-slot="page-content"]');

      await expect(frame.locator(`${scope(framework)} [data-slot="page-gutter"]`)).toBeAttached();
      await expect(frame.locator(`${scope(framework)} .prose`)).toBeVisible();
      // Real headings with matching ids inside the Prose article.
      await expect(frame.locator(`${scope(framework)} .prose h2#${idOf(framework, 'prose-theming')}`)).toBeAttached();

      await scrollHeadingIntoBand(frame, framework, 'prose-authoring');
      await expectActive(frame, framework, 'prose-authoring');
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
