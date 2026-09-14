// apps/docs/e2e/toggle-group.spec.ts
// Behavior coverage for ToggleGroup: initial pressed state and toggling via click,
// for both frameworks. Ark UI renders group items as buttons with data-state on|off.
import { selectFramework } from './helpers';
import { test, expect } from '@playwright/test';

const FRAMEWORKS = ['react', 'svelte'] as const;

for (const framework of FRAMEWORKS) {
  test.describe(`ToggleGroup docs page · ${framework}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('components/toggle-group');
      await selectFramework(page, framework);
    });

    test('renders the default item pressed', async ({ page }) => {
      const first = page
        .locator(`[data-example-id="default"] [data-example-preview] [data-fw="${framework}"] button`)
        .first();
      await expect(first).toHaveAttribute('data-state', 'on');
    });

    test('toggles an item on click', async ({ page }) => {
      const second = page
        .locator(`[data-example-id="default"] [data-example-preview] [data-fw="${framework}"] button`)
        .nth(1);
      await expect(second).toHaveAttribute('data-state', 'off');
      await expect(async () => {
        await second.click();
        await expect(second).toHaveAttribute('data-state', 'on');
      }).toPass();
    });

    test('attached items have no shadow and emphasize the selected border', async ({ page }) => {
      const items = page.locator(`[data-example-id="attached"] [data-example-preview] [data-fw="${framework}"] button`);
      const selected = items.first();
      const unselected = items.nth(1);
      await expect(selected).toHaveAttribute('data-state', 'on');
      const visibleShadow = async (item: typeof selected) =>
        item.evaluate((element) => {
          const shadow = getComputedStyle(element).boxShadow;
          if (shadow === 'none') return false;
          const alphaValues = [...shadow.matchAll(/rgba\([^)]*?,\s*([\d.]+)\)/g)].map((match) => Number(match[1]));
          return alphaValues.length === 0 || alphaValues.some((alpha) => alpha > 0);
        });
      expect(await visibleShadow(selected)).toBe(false);
      expect(await visibleShadow(unselected)).toBe(false);
      const [selectedBorder, unselectedBorder] = await Promise.all([
        selected.evaluate((element) => getComputedStyle(element).borderColor),
        unselected.evaluate((element) => getComputedStyle(element).borderColor),
      ]);
      expect(selectedBorder).not.toBe(unselectedBorder);
    });
  });
}
