import { expect, type FrameLocator, type Locator } from '@playwright/test';
import { escapeRegExp } from '@cloudvoyant/utils';

export async function previewFrameFor(card: Locator, route: string): Promise<FrameLocator> {
  await card.scrollIntoViewIfNeeded();
  const iframe = card.locator('iframe[data-preview]');
  await expect(iframe).toHaveAttribute('src', new RegExp(`/preview/${escapeRegExp(route)}/`));
  return card.frameLocator('iframe[data-preview]');
}
