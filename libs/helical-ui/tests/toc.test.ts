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

  it('assigns stable ids while ignoring non-headings and headings inside a Toc', () => {
    const generated = heading('H2', '', 'No id');
    const root = {
      querySelectorAll: () => [
        heading('DIV', 'not-a-heading', 'No'),
        generated,
        heading('H2', 'toc-title', 'On this page', true),
        heading('H4', 'kept', 'Kept'),
      ],
    } as unknown as ParentNode;

    expect(collectTocItems(root, '*')).toEqual([
      { value: 'no-id', depth: 2, label: 'No id' },
      { value: 'kept', depth: 4, label: 'Kept' },
    ]);
    expect(generated.id).toBe('no-id');
  });

  it('deduplicates generated ids against explicit heading ids', () => {
    const generated = heading('H3', '', 'Overview');
    const root = {
      querySelectorAll: () => [heading('H2', 'overview', 'Overview'), generated],
    } as unknown as ParentNode;

    expect(collectTocItems(root)).toEqual([
      { value: 'overview', depth: 2, label: 'Overview' },
      { value: 'overview-2', depth: 3, label: 'Overview' },
    ]);
    expect(generated.id).toBe('overview-2');
  });
});
