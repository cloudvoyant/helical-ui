// apps/docs/e2e/helpers.ts
// Shared Playwright helpers for the docs demo islands: the framework selector
// wiring is defined once here so layout, scroll-area, and splitter specs stay
// in sync with any change to the selector markup.
import { expect, type Page } from '@playwright/test';

export const FRAMEWORKS = ['react', 'svelte'] as const;
export type Framework = (typeof FRAMEWORKS)[number];

// Wait for the active framework's demo island to have rendered real content.
// The toggle hides/shows islands via html[data-framework], but the active island
// is an empty 0-height shell until it hydrates — so visibility alone races
// hydration. A non-zero box means it has actually rendered. Every spec's
// beforeEach navigates fresh and selects a framework, so this runs per test.
export async function expectIslandRendered(page: Page, framework: Framework) {
  await expect(page.locator(`[data-demo] [data-fw="${framework}"] astro-island[ssr]`)).toHaveCount(0, {
    timeout: 10_000,
  });
  const demo = page.locator(`[data-demo] [data-fw="${framework}"]`).first();
  await expect
    .poll(
      async () => {
        const box = await demo.boundingBox();
        return box !== null && box.height > 0;
      },
      { timeout: 10_000 },
    )
    .toBe(true);
}

export async function selectFramework(page: Page, framework: Framework) {
  // Wait for the FrameworkSelector island to hydrate — its SSR buttons have no
  // handler until then, so an early click silently does nothing.
  await page.locator('[data-framework-selector][data-ready]').waitFor();
  await page.locator(`[data-framework-selector] button[data-fw="${framework}"]`).click();
  await expectIslandRendered(page, framework);
}

export function island(page: Page, framework: string, example: string) {
  return page.locator(`[data-example-id="${example}"] [data-example-preview] [data-fw="${framework}"]`);
}
