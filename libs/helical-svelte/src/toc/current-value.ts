import type { UseTocReturn } from './internal';

type TocApi = ReturnType<UseTocReturn>;

/** Select the last active heading in document order. */
export function getCurrentValue(api: TocApi, activeItems: readonly { value: string }[] = api.activeItems) {
  if (activeItems.length === 0) return undefined;
  const order = new Map(api.items.map((item, index) => [item.value, index]));
  return activeItems.reduce((last, item) =>
    (order.get(item.value) ?? -1) > (order.get(last.value) ?? -1) ? item : last,
  ).value;
}
