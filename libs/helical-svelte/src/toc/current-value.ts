import type { UseTocReturn } from './internal';

type TocApi = ReturnType<UseTocReturn>;

/**
 * Keep Ark's first active item during normal scrolling, but let the final
 * heading win at the end of the scroll root when the machine can see it.
 */
export function getCurrentValue(api: TocApi, activeItems: readonly { value: string }[] = api.activeItems) {
  const firstActiveValue = activeItems[0]?.value;
  const finalValue = api.items.at(-1)?.value;
  if (
    !finalValue ||
    !activeItems.some((item) => item.value === finalValue) ||
    typeof document === 'undefined' ||
    typeof window === 'undefined'
  ) {
    return firstActiveValue;
  }

  const heading = document.getElementById(finalValue);
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

  return atEnd ? finalValue : firstActiveValue;
}
