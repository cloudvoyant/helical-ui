// apps/docs/e2e/mermaid.spec.ts
// Client-loading coverage for the Mermaid rich-text component, matrixed over React
// and Svelte via the docs demo islands. Covers the loading skeleton, the lazy-loaded
// mermaid chunk rendering an SVG, invalid-diagram source fallback, the prerendered
// (SSR) path, layout-shift-free aspect-ratio reservation, and the no-JS <noscript> source.
import { selectFramework } from './helpers';
import { test, expect } from '@playwright/test';

const FRAMEWORKS = ['react', 'svelte'] as const;

// Matches the Vite-emitted mermaid chunk. Used to delay (loading-state test) or abort
// (degradation + prerendered tests) the client-side mermaid import.
const MERMAID_CHUNK = /mermaid[^/]*\.js$/;

for (const framework of FRAMEWORKS) {
  test.describe(`Mermaid docs page · ${framework}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('components/mermaid');
      await selectFramework(page, framework);
    });

    test('placeholder root carries the JSON-encoded diagram source', async ({ page }) => {
      const root = page.locator(`[data-demo] [data-fw="${framework}"] [data-mermaid-code]`).first();
      const encoded = await root.getAttribute('data-mermaid-code');
      expect(encoded).not.toBeNull();
      expect(JSON.parse(encoded ?? '')).toContain('flowchart LR');
    });

    test('shows a loading skeleton while the diagram renders, then swaps to an SVG', async ({ page }) => {
      // Gate the mermaid chunk on a promise the test controls, so the loading state is
      // observable regardless of how fast hydration runs. Released after the assertions.
      let release!: () => void;
      const gate = new Promise<void>((resolve) => {
        release = resolve;
      });
      await page.route(MERMAID_CHUNK, async (route) => {
        await gate;
        await route.continue();
      });
      await page.goto('components/mermaid');
      await selectFramework(page, framework);

      const root = page.locator(`[data-demo] [data-fw="${framework}"] [data-mermaid-code]`).first();
      const skeleton = root.locator('[role="status"]').first();
      await expect(skeleton).toBeVisible();
      await expect(skeleton).toHaveAttribute('aria-label', 'Rendering diagram');
      await expect(root).toHaveAttribute('data-mermaid-state', 'loading');

      release();
      const svg = root.locator('svg').first();
      await expect(svg).toBeVisible({ timeout: 15_000 });
      await expect(root).toHaveAttribute('data-mermaid-state', 'done');
      await expect(root).toHaveAttribute('data-mermaid-src', /flowchart LR/);
      await expect(root.locator('[role="status"]')).toHaveCount(0);
    });

    test('renders the diagram as an SVG after client load', async ({ page }) => {
      const svg = page.locator(`[data-demo] [data-fw="${framework}"] [data-mermaid-code] svg`).first();
      await expect(svg).toBeVisible({ timeout: 15_000 });
      const root = page.locator(`[data-demo] [data-fw="${framework}"] [data-mermaid-code]`).first();
      await expect(root).toHaveAttribute('data-mermaid-src', /flowchart LR/);
      await expect(root).toHaveAttribute('data-mermaid-state', 'done');
    });

    test('invalid diagram keeps the source visible instead of an SVG', async ({ page }) => {
      // Wait for mermaid to have loaded and rendered the valid first example, so the
      // missing SVG in the fallback example is a real negative, not a pre-load race.
      await expect(page.locator(`[data-demo] [data-fw="${framework}"] [data-mermaid-code] svg`).first()).toBeVisible({
        timeout: 15_000,
      });
      const fallback = page
        .locator('[data-example-id="fallback"]')
        .locator(`[data-fw="${framework}"] [data-mermaid-code]`);
      await expect(fallback).toHaveAttribute('data-mermaid-state', 'error');
      await expect(fallback.locator('pre')).toBeVisible();
      await expect(fallback.locator('pre')).toContainText('not a valid mermaid diagram');
      await expect(fallback.locator('svg')).toHaveCount(0);
      // mermaid v11 appends its temp render container (`#d<render-id>`) to document.body;
      // suppressErrorRendering must make a failed render clean up after itself, leaving
      // no stray "Syntax error in text" graphic behind.
      await expect(page.locator('body > div[id^="dhelical-ui-mmd-"]')).toHaveCount(0);
      await expect(page.locator('svg text', { hasText: 'Syntax error in text' })).toHaveCount(0);
    });
  });

  test.describe(`Mermaid prerendered (SSR) · ${framework}`, () => {
    test('renders the pre-provided SVG without importing mermaid', async ({ page }) => {
      // Abort the mermaid chunk: the prerendered example must still render, proving it
      // never imports mermaid on the client.
      await page.route(MERMAID_CHUNK, (route) => route.abort());
      await page.goto('components/mermaid');
      await selectFramework(page, framework);

      const prerendered = page
        .locator('[data-example-id="prerendered"]')
        .locator(`[data-fw="${framework}"] [data-mermaid-code]`);
      await expect(prerendered).toHaveAttribute('data-mermaid-state', 'done');
      await expect(prerendered.locator('svg')).toBeVisible();
      await expect(prerendered.locator('svg')).toContainText('Prerendered');
      // No loading skeleton, no source fallback, no <noscript> fallback.
      await expect(prerendered.locator('[role="status"]')).toHaveCount(0);
      await expect(prerendered.locator('pre')).toHaveCount(0);
    });

    test('reserves the diagram aspect-ratio so the swap does not shift layout', async ({ page }) => {
      await page.goto('components/mermaid');
      await selectFramework(page, framework);
      const prerendered = page
        .locator('[data-example-id="prerendered"]')
        .locator(`[data-fw="${framework}"] [data-mermaid-code]`);
      // The prerendered SVG carries viewBox="0 0 480 180" → aspect-ratio: 480 / 180.
      await expect(prerendered).toHaveCSS('aspect-ratio', /480 \/ 180/);
    });
  });

  test.describe(`Mermaid client loading · ${framework}`, () => {
    test('degrades to the source when the mermaid chunk fails to load', async ({ page }) => {
      await page.route(MERMAID_CHUNK, (route) => route.abort());
      await page.goto('components/mermaid');
      await selectFramework(page, framework);
      const root = page.locator(`[data-demo] [data-fw="${framework}"] [data-mermaid-code]`).first();
      await expect(root).toHaveAttribute('data-mermaid-state', 'error');
      const pre = root.locator('pre').first();
      await expect(pre).toBeVisible();
      await expect(pre).toContainText('flowchart LR');
      await page.waitForLoadState('networkidle');
      await expect(root.locator('svg')).toHaveCount(0);
    });
  });
}

test.describe('Mermaid SSR placeholder', () => {
  test.use({ javaScriptEnabled: false });

  test('server-rendered HTML carries the source in a <noscript> block, not an SVG', async ({ page }) => {
    await page.goto('components/mermaid');
    const root = page.locator('[data-demo] [data-fw="react"] [data-mermaid-code]').first();
    await expect(root).toBeVisible();
    await expect(root).toHaveAttribute('data-mermaid-state', 'loading');
    // With JS disabled the browser renders <noscript> content, so the source is readable
    // and the loading spinner is hidden (it can never resolve without JS).
    await expect(root.locator('noscript pre')).toBeVisible();
    await expect(root.locator('noscript pre')).toContainText('flowchart LR');
    await expect(root.locator('[role="status"]')).toBeHidden();
    await expect(root.locator('svg')).toHaveCount(0);
  });

  test('prerendered SVG ships in the server-rendered HTML with no client JS', async ({ page }) => {
    await page.goto('components/mermaid');
    const prerendered = page
      .locator('[data-example-id="prerendered"]')
      .locator('[data-fw="react"] [data-mermaid-code]');
    await expect(prerendered.locator('svg')).toBeVisible();
    await expect(prerendered.locator('svg')).toContainText('Prerendered');
    await expect(prerendered).toHaveCSS('aspect-ratio', /480 \/ 180/);
  });
});
