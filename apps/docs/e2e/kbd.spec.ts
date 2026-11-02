// apps/docs/e2e/kbd.spec.ts
// BDD end-to-end coverage for the Kbd component across React and Svelte demos.
import { test, expect, type Page } from '@playwright/test';
import { FRAMEWORKS, selectFramework } from './helpers';

// --- Helpers ---

function island(page: Page, framework: string, example: string) {
  return page.locator(`[data-example-id="${example}"] [data-example-preview] [data-fw="${framework}"]`);
}

// --- Tests ---

for (const framework of FRAMEWORKS) {
  test.describe(`Kbd · ${framework}`, () => {
    test.describe('Given the /components/kbd page is rendered', () => {
      test.beforeEach(async ({ page }) => {
        // Arrange
        await page.goto('components/kbd');
        await selectFramework(page, framework);
      });

      test.describe('When viewing the default demo', () => {
        test('Then renders semantic <kbd> keycaps for single keys and multi-modifier chords', async ({ page }) => {
          // Arrange
          const demo = island(page, framework, 'default');
          const keycaps = demo.locator('kbd[data-slot="kbd"]');
          const sequences = demo.locator('[data-slot="kbd-sequence"]');

          // Act & Assert
          await expect(keycaps.first()).toBeVisible();
          await expect(keycaps.first()).toContainText('⌘K');
          await expect(keycaps.nth(1)).toContainText(/⌃\s*W/);
          await expect(sequences).toHaveCount(1);
          await expect(sequences.locator('kbd[data-slot="kbd"]')).toHaveCount(2);
        });
      });

      test.describe('When viewing the variants demo', () => {
        test('Then applies sm/md/lg size attributes and outline/subtle/solid variant styles', async ({ page }) => {
          // Arrange
          const demo = island(page, framework, 'variants');
          const outlineKbd = demo.locator('kbd[data-variant="outline"]').first();
          const subtleKbd = demo.locator('kbd[data-variant="subtle"]').first();
          const solidKbd = demo.locator('kbd[data-variant="solid"]').first();
          const smKbd = demo.locator('kbd[data-size="sm"]').first();
          const mdKbd = demo.locator('kbd[data-size="md"]').nth(3);
          const lgKbd = demo.locator('kbd[data-size="lg"]').first();

          // Act & Assert
          await expect(outlineKbd).toBeVisible();
          await expect(subtleKbd).toBeVisible();
          await expect(solidKbd).toBeVisible();
          await expect(smKbd).toBeVisible();
          await expect(mdKbd).toBeVisible();
          await expect(lgKbd).toBeVisible();

          const [smBox, lgBox] = await Promise.all([smKbd.boundingBox(), lgKbd.boundingBox()]);
          expect(smBox).not.toBeNull();
          expect(lgBox).not.toBeNull();
          expect(lgBox!.height).toBeGreaterThan(smBox!.height);
        });
      });
    });
  });
}
