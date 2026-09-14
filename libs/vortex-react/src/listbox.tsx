// libs/vortex-react/src/listbox.tsx
// Closely based on: Ark UI listbox (https://ark-ui.com/docs/components/listbox).
//
// `Listbox` is a thin pass-through: it owns the collection and the consumer renders the
// Listbox parts as children. There is deliberately no filterFn/filterQuery seam — filtering
// the collection without filtering the children would silently desync them. Filter `items`
// yourself (defaultListboxFilter is exported for convenience) and render the result.
import { useMemo, type ReactNode } from 'react';
import {
  ListboxRoot,
  ListboxContent as ArkListboxContent,
  ListboxItem as ArkListboxItem,
  ListboxItemText as ArkListboxItemText,
  ListboxItemIndicator as ArkListboxItemIndicator,
  ListboxInput as ArkListboxInput,
  ListboxEmpty as ArkListboxEmpty,
  ListboxLabel as ArkListboxLabel,
  createListCollection,
  useListboxContext,
  type ListboxRootProps,
  type ListboxContentProps as ArkListboxContentProps,
  type ListboxItemProps as ArkListboxItemProps,
  type ListboxItemTextProps as ArkListboxItemTextProps,
  type ListboxItemIndicatorProps as ArkListboxItemIndicatorProps,
  type ListboxInputProps as ArkListboxInputProps,
  type ListboxEmptyProps as ArkListboxEmptyProps,
  type ListboxLabelProps as ArkListboxLabelProps,
  type CollectionItem,
  type ListCollection,
} from '@ark-ui/react/listbox';
import {
  listboxRootBase,
  listboxContentBase,
  listboxItemBase,
  listboxItemTextBase,
  listboxItemIndicatorBase,
  listboxInputBase,
  listboxEmptyBase,
  listboxLabelBase,
  cn,
  type ListboxItemData,
} from '@cloudvoyant/vortex-ui';

export const useListbox = useListboxContext;

export interface ListboxProps extends Omit<ListboxRootProps<CollectionItem>, 'collection'> {
  items?: ListboxItemData[];
  collection?: ListCollection<CollectionItem>;
  className?: string;
  children?: ReactNode;
}

// `items` is deliberately NOT defaulted in the destructure: a `= []` default allocates a new
// array every render and would defeat the memo below. Mirror select.tsx exactly.
export function Listbox({ items, collection, className, children, ...rest }: ListboxProps) {
  const resolvedCollection = useMemo(
    () => collection ?? createListCollection({ items: items ?? [] }),
    [collection, items],
  );
  return (
    <ListboxRoot collection={resolvedCollection} className={cn(listboxRootBase, className)} {...rest}>
      {children}
    </ListboxRoot>
  );
}

export type ListboxContentProps = ArkListboxContentProps & { className?: string };

export function ListboxContent({ className, children, ...rest }: ListboxContentProps) {
  return (
    <ArkListboxContent className={cn(listboxContentBase, className)} {...rest}>
      {children}
    </ArkListboxContent>
  );
}

export type ListboxItemProps = ArkListboxItemProps & { className?: string; children?: ReactNode };

// Pass-through, matching SelectItem: `children` are the row's CONTENT.
export function ListboxItem({ item, className, children, ...rest }: ListboxItemProps) {
  return (
    <ArkListboxItem item={item} className={cn(listboxItemBase, className)} {...rest}>
      {children}
    </ArkListboxItem>
  );
}

export type ListboxItemTextProps = ArkListboxItemTextProps & { className?: string };

export function ListboxItemText({ className, children, ...rest }: ListboxItemTextProps) {
  return (
    <ArkListboxItemText className={cn(listboxItemTextBase, className)} {...rest}>
      {children}
    </ArkListboxItemText>
  );
}

export type ListboxItemIndicatorProps = ArkListboxItemIndicatorProps & { className?: string };

export function ListboxItemIndicator({ className, children, ...rest }: ListboxItemIndicatorProps) {
  return (
    <ArkListboxItemIndicator className={cn(listboxItemIndicatorBase, className)} {...rest}>
      {children}
    </ArkListboxItemIndicator>
  );
}

// Ark's listbox input: arrow/Home/End forwarding, highlight management, and the
// aria-activedescendant / aria-controls linkage. Sibling of ListboxContent, never inside it.
export type ListboxInputProps = ArkListboxInputProps & { className?: string };

export function ListboxInput({ className, ...rest }: ListboxInputProps) {
  return <ArkListboxInput className={cn(listboxInputBase, className)} {...rest} />;
}

export type ListboxEmptyProps = ArkListboxEmptyProps & { className?: string; children?: ReactNode };

export function ListboxEmpty({ className, children, ...rest }: ListboxEmptyProps) {
  return (
    <ArkListboxEmpty className={cn(listboxEmptyBase, className)} {...rest}>
      {children ?? 'No results.'}
    </ArkListboxEmpty>
  );
}

export type ListboxLabelProps = ArkListboxLabelProps & { className?: string; children?: ReactNode };

export function ListboxLabel({ className, children, ...rest }: ListboxLabelProps) {
  return (
    <ArkListboxLabel className={cn(listboxLabelBase, className)} {...rest}>
      {children}
    </ArkListboxLabel>
  );
}
