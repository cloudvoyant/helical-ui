// apps/docs/e2e/prose.spec.ts
// Verifies Prose renders scoped typography (headings, links) for both frameworks.
import { selectFramework } from './helpers';
import { test, expect } from '@playwright/test';

const FRAMEWORKS = ['react', 'svelte'] as const;

for (const framework of FRAMEWORKS) {
  test.describe(`Prose docs page · ${framework}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('components/prose');
      await selectFramework(page, framework);
    });

    test('renders a heading inside the prose container', async ({ page }) => {
      const heading = page.locator(`[data-demo] [data-fw="${framework}"] .prose h1`).first();
      await expect(heading).toBeVisible();
      await expect(heading).toHaveText(/Typography/);
    });

    test('renders a styled link inside the prose container', async ({ page }) => {
      const link = page.locator(`[data-demo] [data-fw="${framework}"] .prose a`).first();
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', 'https://example.com');
    });
  });
}
