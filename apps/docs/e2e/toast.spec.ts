// apps/docs/e2e/toast.spec.ts
// End-to-end coverage for Toast across React and Svelte.
import { expect, test } from '@playwright/test';
import { FRAMEWORKS, island, selectFramework } from './helpers';

for (const framework of FRAMEWORKS) {
  test.describe(`Toast · ${framework}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('components/toast');
      await selectFramework(page, framework);
    });

    test.describe('Given a Toaster mounted in the page', () => {
      test.describe('When a default toast is triggered', () => {
        test.beforeEach(async ({ page }) => {
          const demo = island(page, framework, 'default');
          await demo.getByRole('button', { name: 'Show Toast' }).click();
        });

        test('it renders the title and description', async ({ page }) => {
          const toastItem = page.getByTestId('toast-item').last();
          await expect(toastItem).toBeVisible();
          await expect(toastItem.getByTestId('toast-title')).toHaveText('Scheduled: Catch up');
          await expect(toastItem.getByTestId('toast-description')).toContainText(
            'Friday, February 10, 2026',
          );
        });

        test('it dismisses when the close button is clicked', async ({ page }) => {
          const toastItem = page.getByTestId('toast-item').last();
          await expect(toastItem).toBeVisible();
          await toastItem.getByTestId('toast-close').click();
          await expect(toastItem).toBeHidden();
        });
      });

      test.describe('When status variant toasts are triggered', () => {
        test.beforeEach(async ({ page }) => {
          const demo = island(page, framework, 'status');
          await demo.getByRole('button', { name: 'Success' }).click();
          await demo.getByRole('button', { name: 'Error' }).click();
        });

        test('it renders success and error toasts with matching data-type attributes', async ({
          page,
        }) => {
          const successToast = page.locator('[data-testid="toast-item"][data-type="success"]').last();
          await expect(successToast).toBeVisible();
          await expect(successToast.getByTestId('toast-title')).toHaveText('Changes saved');

          const errorToast = page.locator('[data-testid="toast-item"][data-type="error"]').last();
          await expect(errorToast).toBeVisible();
          await expect(errorToast.getByTestId('toast-title')).toHaveText('Deployment failed');
        });
      });

      test.describe('When an action toast is triggered', () => {
        test.beforeEach(async ({ page }) => {
          const demo = island(page, framework, 'action');
          await demo.getByRole('button', { name: 'Archive File' }).click();
        });

        test('it invokes the action callback when the action button is clicked', async ({
          page,
        }) => {
          const demo = island(page, framework, 'action');
          const toastItem = page.getByTestId('toast-item').last();
          await expect(toastItem).toBeVisible();
          await expect(toastItem.getByTestId('toast-action')).toHaveText('Undo');

          await toastItem.getByTestId('toast-action').click();
          await expect(demo.getByText('Restored')).toBeVisible();
        });
      });
    });
  });
}
