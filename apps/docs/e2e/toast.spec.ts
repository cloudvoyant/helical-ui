// apps/docs/e2e/toast.spec.ts
// BDD end-to-end coverage for Toast across React and Svelte:
// default toast trigger and close button dismissal, status variants (info, success, warning, error),
// and interactive action trigger ("Undo") updating demo state.
import { test, expect } from '@playwright/test';
import { FRAMEWORKS, island, selectFramework } from './helpers';

// --- Tests ---

for (const framework of FRAMEWORKS) {
  test.describe(`Toast · ${framework}`, () => {
    test.describe('Given the Toast page (/components/toast)', () => {
      test.beforeEach(async ({ page }) => {
        // Arrange
        await page.goto('components/toast');
        await selectFramework(page, framework);
      });

      test.describe('When the user clicks the Default toast trigger button and then clicks the close button', () => {
        test('Then renders a toast notification with title and description and dismisses it', async ({ page }) => {
          // Arrange
          const demo = island(page, framework, 'default');

          // Act
          await demo.getByTestId('toast-default-trigger').click();

          // Assert
          const toastItem = page.getByTestId('toast-item').last();
          await expect(toastItem).toBeVisible();
          await expect(toastItem.getByTestId('toast-title')).toHaveText('Scheduled: Catch up');
          await expect(toastItem.getByTestId('toast-description')).toContainText('Friday, February 10, 2026');

          // Act: dismiss via close button
          await toastItem.getByTestId('toast-close').click();
          await expect(toastItem).toBeHidden();
        });
      });

      test.describe('When the user triggers Status Variant toasts (info, success, warning, error)', () => {
        test('Then renders toast notifications with matching data-type attributes and titles', async ({ page }) => {
          // Arrange
          const demo = island(page, framework, 'status');

          // Act & Assert: Success
          await demo.getByTestId('toast-status-success').click();
          const successToast = page.locator('[data-testid="toast-item"][data-type="success"]').last();
          await expect(successToast).toBeVisible();
          await expect(successToast.getByTestId('toast-title')).toHaveText('Changes saved');

          // Act & Assert: Error
          await demo.getByTestId('toast-status-error').click();
          const errorToast = page.locator('[data-testid="toast-item"][data-type="error"]').last();
          await expect(errorToast).toBeVisible();
          await expect(errorToast.getByTestId('toast-title')).toHaveText('Deployment failed');
        });
      });

      test.describe('When the user triggers an Action toast and clicks the Undo action button', () => {
        test('Then invokes the action callback and updates the demo status badge to "Restored"', async ({ page }) => {
          // Arrange
          const demo = island(page, framework, 'action');
          await expect(demo.getByTestId('toast-action-state')).toHaveText('Idle');

          // Act: archive file
          await demo.getByTestId('toast-action-trigger').click();

          const toastItem = page.getByTestId('toast-item').last();
          await expect(toastItem).toBeVisible();
          await expect(toastItem.getByTestId('toast-action')).toHaveText('Undo');

          // Act: click Undo action inside toast
          await toastItem.getByTestId('toast-action').click();

          // Assert: restored
          await expect(demo.getByTestId('toast-action-state')).toHaveText('Restored');
        });
      });
    });
  });
}
