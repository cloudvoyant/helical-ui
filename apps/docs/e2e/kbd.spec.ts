// apps/docs/e2e/kbd.spec.ts
import { test, expect } from '@playwright/test';
import { FRAMEWORKS, island, selectFramework } from './helpers';

for (const framework of FRAMEWORKS) {
  test.describe(`Kbd · ${framework}`, () => {
    test.describe('Given the /components/kbd page is rendered', () => {
      test.beforeEach(async ({ page }) => {
        await page.goto('components/kbd');
        await selectFramework(page, framework);
      });

      test.describe('When viewing the default demo', () => {
        test('Then renders semantic <kbd> keycaps with automatically inferred platform modifiers', async ({ page }) => {
          const demo = island(page, framework, 'default');
          const keycaps = demo.locator('kbd[data-slot="kbd"]');
          const sequences = demo.locator('[data-slot="kbd-sequence"]');

          await expect(keycaps.first()).toBeVisible();
          await expect(keycaps.first()).toContainText(/(?:⌘\s*K|Ctrl\+K)/);
          await expect(keycaps.nth(1)).toContainText(/(?:⌃\s*W|Ctrl\+W)/);
          await expect(sequences).toHaveCount(1);
          await expect(sequences.locator('kbd[data-slot="kbd"]')).toHaveCount(2);
        });
      });

      test.describe('When viewing the chords demo', () => {
        test('Then formats single chords and splits multi-step sequences into individual keycaps', async ({ page }) => {
          const demo = island(page, framework, 'chords');
          const keycaps = demo.locator('kbd[data-slot="kbd"]');
          const sequences = demo.locator('[data-slot="kbd-sequence"]');

          await expect(keycaps.first()).toContainText(/(?:⌘\s*K|Ctrl\+K)/);
          await expect(keycaps.nth(1)).toContainText(/(?:⌃\s*O|Ctrl\+O)/);
          await expect(keycaps.nth(2)).toHaveText('Z');
          await expect(keycaps.nth(3)).toHaveText('Esc');
          await expect(sequences).toHaveCount(4);
          await expect(sequences.first().locator('kbd[data-slot="kbd"]')).toHaveCount(3);
        });

        test('Then marks malformed chords with data-invalid="true" and destructive styling', async ({ page }) => {
          const demo = island(page, framework, 'chords');
          const invalidKeycaps = demo.locator('kbd[data-slot="kbd"][data-invalid="true"]');

          await expect(invalidKeycaps).toHaveCount(2);
          await expect(invalidKeycaps.first()).toHaveAttribute('aria-invalid', 'true');
          await expect(invalidKeycaps.first()).toHaveClass(/line-through/);
          await expect(invalidKeycaps.first()).toHaveText('InvalidMod+K');

          await expect(invalidKeycaps.nth(1)).toHaveAttribute('aria-invalid', 'true');
          await expect(invalidKeycaps.nth(1)).toHaveClass(/line-through/);
          await expect(invalidKeycaps.nth(1)).toHaveText('UnknownKey');
        });
      });

      test.describe('When viewing the variants demo', () => {
        test('Then applies sm/md/lg size attributes and outline/subtle/solid variant styles', async ({ page }) => {
          const demo = island(page, framework, 'variants');
          const outlineKbd = demo.locator('kbd[data-variant="outline"]').first();
          const subtleKbd = demo.locator('kbd[data-variant="subtle"]').first();
          const solidKbd = demo.locator('kbd[data-variant="solid"]').first();
          const smKbd = demo.locator('kbd[data-size="sm"]').first();
          const mdKbd = demo.locator('kbd[data-size="md"]').nth(3);
          const lgKbd = demo.locator('kbd[data-size="lg"]').first();

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
