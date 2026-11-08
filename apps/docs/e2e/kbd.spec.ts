// apps/docs/e2e/kbd.spec.ts
import { expect, test } from '@playwright/test';
import { FRAMEWORKS, island, selectFramework } from './helpers';

for (const framework of FRAMEWORKS) {
  test.describe(`Kbd · ${framework}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('components/kbd');
      await selectFramework(page, framework);
    });

    test.describe('Given a valid key', () => {
      test.describe('When the default variant is used', () => {
        test('it renders semantic <kbd> keycaps with automatically inferred platform modifiers', async ({
          page,
        }) => {
          const demo = island(page, framework, 'default');
          const keycaps = demo.locator('kbd[data-slot="kbd"]');

          await expect(keycaps.first()).toBeVisible();
          await expect(keycaps.first()).toContainText(/(?:⌘\s*K|Ctrl\+K)/);
          await expect(keycaps.nth(1)).toContainText(/(?:⌃\s*W|Ctrl\+W)/);
        });
      });

      test.describe('When a style variant is used', () => {
        test('it applies outline, subtle, and solid variant styles', async ({ page }) => {
          const demo = island(page, framework, 'variants');
          const outlineKbd = demo.locator('kbd[data-variant="outline"]').first();
          const subtleKbd = demo.locator('kbd[data-variant="subtle"]').first();
          const solidKbd = demo.locator('kbd[data-variant="solid"]').first();

          await expect(outlineKbd).toBeVisible();
          await expect(subtleKbd).toBeVisible();
          await expect(solidKbd).toBeVisible();
        });
      });

      test.describe('When a size variant is used', () => {
        test('it applies sm, md, and lg size attributes and scales height', async ({ page }) => {
          const demo = island(page, framework, 'variants');
          const smKbd = demo.locator('kbd[data-size="sm"]').first();
          const mdKbd = demo.locator('kbd[data-size="md"]').nth(3);
          const lgKbd = demo.locator('kbd[data-size="lg"]').first();

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

    test.describe('Given a list of valid keys', () => {
      test('it splits multi-step sequences into individual keycaps inside a kbd-sequence container', async ({
        page,
      }) => {
        const demo = island(page, framework, 'chords');
        const sequences = demo.locator('[data-slot="kbd-sequence"]');

        await expect(sequences).toHaveCount(4);
        await expect(sequences.first().locator('kbd[data-slot="kbd"]')).toHaveCount(3);
      });
    });

    test.describe('Given an invalid key', () => {
      test('it marks malformed chords with data-invalid="true" and destructive styling', async ({
        page,
      }) => {
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
  });
}
