// apps/docs/e2e/select.spec.ts
// Behavior + accessibility coverage for Select: listbox role, option selection
// via mouse and arrow keys, and the native-select fallback on coarse pointers.
import { expectIslandRendered, selectFramework } from './helpers';
import { test, expect } from '@playwright/test';

const FRAMEWORKS = ['react', 'svelte'] as const;

for (const framework of FRAMEWORKS) {
  test.describe(`Select docs page · ${framework}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('components/select');
      await selectFramework(page, framework);
    });

    test('opens a listbox with options', async ({ page }) => {
      const trigger = page.locator(`[data-demo] [data-fw="${framework}"] button`).first();
      await trigger.click();
      const listbox = page.locator('[role="listbox"]:visible').first();
      await expect(listbox).toBeVisible();
      await expect(listbox.locator('[role="option"]')).toHaveCount(3);
    });

    test('selects an option on click', async ({ page }) => {
      const trigger = page.locator(`[data-demo] [data-fw="${framework}"] button`).first();
      await expect(async () => {
        await trigger.click();
        await page.locator('[role="listbox"]:visible [role="option"]:has-text("Banana")').first().click();
        await expect(trigger).toContainText('Banana');
      }).toPass();
    });

    test('navigates options with arrow keys', async ({ page }) => {
      const trigger = page.locator(`[data-demo] [data-fw="${framework}"] button`).first();
      await trigger.focus();
      await page.keyboard.press('ArrowDown');
      const listbox = page.locator('[role="listbox"]:visible').first();
      await expect(listbox).toBeVisible();
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
      await expect(trigger).toContainText('Banana');
    });
  });
}

test.describe('Select native fallback (coarse pointer)', () => {
  test.use({ hasTouch: true, viewport: { width: 390, height: 844 } });

  for (const framework of FRAMEWORKS) {
    test(`renders a native select on mobile · ${framework}`, async ({ page }) => {
      await page.goto('components/select');
      await page.evaluate((fw) => {
        document.documentElement.dataset.framework = fw;
      }, framework);
      await expectIslandRendered(page, framework);
      const native = page.locator(`[data-demo] [data-fw="${framework}"] select`).first();
      await expect(native).toBeVisible();
      await expect(native.locator('option')).toHaveCount(3);
      await native.selectOption('banana');
      await expect(native).toHaveValue('banana');
    });
  }
});
