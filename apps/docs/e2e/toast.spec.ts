// apps/docs/e2e/toast.spec.ts
// End-to-end coverage for Toast across React and Svelte.
import { test, expect } from '@playwright/test';
import { FRAMEWORKS, island, selectFramework } from './helpers';

for (const framework of FRAMEWORKS) {
  test.describe(`Toast · ${framework}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('components/toast');
      await selectFramework(page, framework);
    });

    test.describe('Given a Toaster mounted in the page', () => {
      test.describe('When a default toast is triggered', () => {
        test('Then renders the title and description', async ({ page }) => {
          const demo = island(page, framework, 'default');
          await demo.getByTestId('toast-default-trigger').click();

          const toastItem = page.getByTestId('toast-item').last();
          await expect(toastItem).toBeVisible();
          await expect(toastItem.getByTestId('toast-title')).toHaveText('Scheduled: Catch up');
          await expect(toastItem.getByTestId('toast-description')).toContainText('Friday, February 10, 2026');
        });

        test('Then dismisses when the close button is clicked', async ({ page }) => {
          const demo = island(page, framework, 'default');
          await demo.getByTestId('toast-default-trigger').click();

          const toastItem = page.getByTestId('toast-item').last();
          await expect(toastItem).toBeVisible();
          await toastItem.getByTestId('toast-close').click();
          await expect(toastItem).toBeHidden();
        });
      });

      test.describe('When status variant toasts are triggered', () => {
        test('Then renders success and error toasts with matching data-type attributes', async ({ page }) => {
          const demo = island(page, framework, 'status');

          await demo.getByTestId('toast-status-success').click();
          const successToast = page.locator('[data-testid="toast-item"][data-type="success"]').last();
          await expect(successToast).toBeVisible();
          await expect(successToast.getByTestId('toast-title')).toHaveText('Changes saved');

          await demo.getByTestId('toast-status-error').click();
          const errorToast = page.locator('[data-testid="toast-item"][data-type="error"]').last();
          await expect(errorToast).toBeVisible();
          await expect(errorToast.getByTestId('toast-title')).toHaveText('Deployment failed');
        });
      });

      test.describe('When an action toast is triggered', () => {
        test('Then invokes the action callback when the action button is clicked', async ({ page }) => {
          const demo = island(page, framework, 'action');
          await expect(demo.getByTestId('toast-action-state')).toHaveText('Idle');

          await demo.getByTestId('toast-action-trigger').click();
          const toastItem = page.getByTestId('toast-item').last();
          await expect(toastItem).toBeVisible();
          await expect(toastItem.getByTestId('toast-action')).toHaveText('Undo');

          await toastItem.getByTestId('toast-action').click();
          await expect(demo.getByTestId('toast-action-state')).toHaveText('Restored');
        });
      });
    });
  });
}
