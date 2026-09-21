import { describe, expect, it } from 'vitest';
import { collectTocItems, tocHeadingSelector } from '../src/toc';

function heading(tagName: string, id: string, textContent: string, insideToc = false) {
  return {
    tagName,
    id,
    textContent,
    closest: () => (insideToc ? {} : null),
  } as unknown as HTMLElement;
}

describe('collectTocItems', () => {
  it('derives values, depths, and normalized labels from headings', () => {
    const headings = [heading('H2', 'overview', '  Overview  '), heading('H3', 'advanced', 'Advanced\n configuration')];
    const root = {
      querySelectorAll: (selector: string) => {
        expect(selector).toBe(tocHeadingSelector);
        return headings;
      },
    } as unknown as ParentNode;

    expect(collectTocItems(root)).toEqual([
      { value: 'overview', depth: 2, label: 'Overview' },
      { value: 'advanced', depth: 3, label: 'Advanced configuration' },
    ]);
  });

  it('ignores non-heading matches, missing ids, and headings inside a Toc', () => {
    const root = {
      querySelectorAll: () => [
        heading('DIV', 'not-a-heading', 'No'),
        heading('H2', '', 'No id'),
        heading('H2', 'toc-title', 'On this page', true),
        heading('H4', 'kept', 'Kept'),
      ],
    } as unknown as ParentNode;

    expect(collectTocItems(root, '[id]')).toEqual([{ value: 'kept', depth: 4, label: 'Kept' }]);
  });
});
