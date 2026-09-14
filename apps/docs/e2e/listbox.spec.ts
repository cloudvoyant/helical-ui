/*
 * apps/docs/e2e/listbox.spec.ts
 * Behavior coverage for Listbox through both framework demos.
 */
import { selectFramework } from './helpers';
import { test, expect, type Page } from '@playwright/test';

const FRAMEWORKS = ['react', 'svelte'] as const;

function scope(page: Page, framework: string, example: string) {
  return page.locator(`[data-example-id="${example}"] [data-example-preview] [data-fw="${framework}"]`);
}

for (const framework of FRAMEWORKS) {
  test.describe(`Listbox docs page · ${framework}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('components/listbox');
      await selectFramework(page, framework);
    });

    test('renders listbox items', async ({ page }) => {
      const items = scope(page, framework, 'default').locator('[data-part="item"]');
      await expect(items.first()).toBeVisible();
      await expect(items).toHaveCount(4);
    });

    test('consumer-owned filtering narrows the rendered options', async ({ page }) => {
      const s = scope(page, framework, 'filtering');
      const input = s.locator('input').first();
      const options = s.getByRole('option');
      await expect(options).toHaveCount(5);

      await input.fill('app');
      await expect(options).toHaveCount(1);
      await expect(options.first()).toHaveText(/Apple/);
    });

    test('multiple mode marks more than one item selected', async ({ page }) => {
      const s = scope(page, framework, 'multiple');
      await expect(s.getByRole('option').first()).toBeVisible();
      await expect(s.getByRole('option', { selected: true })).toHaveCount(2);
    });

    test('ListboxInput forwards arrow keys to the list and tracks the active option', async ({ page }) => {
      const s = scope(page, framework, 'filtering');
      const input = s.locator('input').first();
      const content = s.locator('[data-part="content"]');

      await input.click();
      await input.press('ArrowDown');

      await expect(content).toHaveAttribute('aria-activedescendant', /.+/);
      const first = await content.getAttribute('aria-activedescendant');

      await input.press('ArrowDown');
      await expect(async () => {
        expect(await content.getAttribute('aria-activedescendant')).not.toBe(first);
      }).toPass();
      await expect(s.locator('[data-part="item"][data-highlighted]')).toHaveCount(1);
    });
  });
}
