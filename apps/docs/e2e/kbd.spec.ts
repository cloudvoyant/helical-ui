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
        test('Then renders semantic <kbd> keycaps for single keys and multi-modifier chords', async ({ page }) => {
          const demo = island(page, framework, 'default');
          const keycaps = demo.locator('kbd[data-slot="kbd"]');
          const sequences = demo.locator('[data-slot="kbd-sequence"]');

          await expect(keycaps.first()).toBeVisible();
          await expect(keycaps.first()).toContainText('⌘K');
          await expect(keycaps.nth(1)).toContainText(/(?:⌃\s*W|Ctrl\+W)/);
          await expect(sequences).toHaveCount(1);
          await expect(sequences.locator('kbd[data-slot="kbd"]')).toHaveCount(2);
        });
      });

      test.describe('When viewing the chords demo', () => {
        test('Then renders space-separated command strings as multi-keycap chord sequences', async ({ page }) => {
          const demo = island(page, framework, 'chords');
          const modK = demo.getByTestId('kbd-chord-mod-k');
          const seq = demo.locator('[data-slot="kbd-sequence"]').first();
          const winChord = demo.getByTestId('kbd-platform-win');

          await expect(modK).toHaveText('⌘ K');
          await expect(seq.locator('kbd[data-slot="kbd"]')).toHaveCount(3);
          await expect(seq.locator('kbd[data-slot="kbd"]').nth(0)).toHaveText('Space');
          await expect(seq.locator('kbd[data-slot="kbd"]').nth(1)).toHaveText('w');
          await expect(seq.locator('kbd[data-slot="kbd"]').nth(2)).toHaveText('v');
          await expect(winChord).toHaveText('Ctrl+Shift+P');
        });

        test('Then marks broken commands with data-invalid="true" and distinctive destructive styling', async ({
          page,
        }) => {
          const demo = island(page, framework, 'chords');
          const invalidChord = demo.getByTestId('kbd-invalid-chord');
          const invalidSeq = demo.locator('[data-slot="kbd-sequence"][data-invalid="true"]');

          await expect(invalidChord).toHaveAttribute('data-invalid', 'true');
          await expect(invalidChord).toHaveAttribute('aria-invalid', 'true');
          await expect(invalidChord).toHaveClass(/line-through/);
          await expect(invalidSeq).toBeVisible();
          await expect(invalidSeq.locator('kbd[data-invalid="true"]')).toHaveCount(1);
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
