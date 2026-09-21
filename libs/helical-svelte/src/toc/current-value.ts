import type { UseTocReturn } from './internal';

type TocApi = ReturnType<UseTocReturn>;

/**
 * Keep Ark's first active item during normal scrolling, but let the last active
 * heading (in document order) win at the end of the scroll root. When several
 * same-level headings share the viewport at scroll end, the topmost one would
 * otherwise stick as current even though you can no longer scroll to isolate the
 * lower ones — so there the bottommost visible heading wins.
 */
export function getCurrentValue(api: TocApi, activeItems: readonly { value: string }[] = api.activeItems) {
  const firstActiveValue = activeItems[0]?.value;
  if (!firstActiveValue || typeof document === 'undefined' || typeof window === 'undefined') {
    return firstActiveValue;
  }

  // The active heading that appears last in item (document) order.
  const order = new Map(api.items.map((item, index) => [item.value, index]));
  const lastActiveValue = activeItems.reduce((last, item) =>
    (order.get(item.value) ?? -1) > (order.get(last.value) ?? -1) ? item : last,
  ).value;
  if (lastActiveValue === firstActiveValue) return firstActiveValue;

  const heading = document.getElementById(lastActiveValue);
  if (!heading) return firstActiveValue;

  let scrollRoot: HTMLElement | null = null;
  for (let parent = heading.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
    const overflowY = window.getComputedStyle(parent).overflowY;
    if (/(auto|scroll)/.test(overflowY) && parent.scrollHeight > parent.clientHeight) {
      scrollRoot = parent;
      break;
    }
  }

  const scrollingElement = document.scrollingElement;
  const atEnd = scrollRoot
    ? Math.ceil(scrollRoot.scrollTop + scrollRoot.clientHeight) >= scrollRoot.scrollHeight - 1
    : !!scrollingElement &&
      Math.ceil(scrollingElement.scrollTop + scrollingElement.clientHeight) >= scrollingElement.scrollHeight - 1;

  return atEnd ? lastActiveValue : firstActiveValue;
}
