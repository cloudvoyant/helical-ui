// libs/helical-react/src/combobox.tsx
// Closely based on: Shark UI combobox (@ark-ui/react/combobox)
// Note: adapted to Ark UI v5 collection-based API (Combobox.Root `collection` +
// Combobox.Item `item`), while preserving the plan's `items` convenience surface.
import { Portal } from '@ark-ui/react/portal';
import { useMemo } from 'react';
import {
  ComboboxRoot as ArkComboboxRoot,
  ComboboxControl as ArkComboboxControl,
  ComboboxInput as ArkComboboxInput,
  ComboboxTrigger as ArkComboboxTrigger,
  ComboboxClearTrigger as ArkComboboxClearTrigger,
  ComboboxContent as ArkComboboxContent,
  ComboboxPositioner as ArkComboboxPositioner,
  ComboboxItem as ArkComboboxItem,
  ComboboxItemGroup as ArkComboboxItemGroup,
  ComboboxItemGroupLabel as ArkComboboxItemGroupLabel,
  ComboboxItemText as ArkComboboxItemText,
  ComboboxItemIndicator as ArkComboboxItemIndicator,
  ComboboxList as ArkComboboxList,
  ComboboxEmpty as ArkComboboxEmpty,
  createListCollection,
  useComboboxContext,
  type ListCollection,
  type ComboboxRootProps,
  type ComboboxInputProps as ArkComboboxInputProps,
  type ComboboxItemProps as ArkComboboxItemProps,
} from '@ark-ui/react/combobox';
import type {
  ComboboxControlProps,
  ComboboxTriggerProps,
  ComboboxClearTriggerProps,
  ComboboxContentProps,
  ComboboxItemGroupProps,
  ComboboxItemGroupLabelProps,
  ComboboxItemTextProps,
  ComboboxItemIndicatorProps,
  ComboboxListProps,
  ComboboxEmptyProps,
} from '@ark-ui/react/combobox';
import {
  inputVariants,
  comboboxControlBase,
  comboboxInputBase,
  comboboxTriggerBase,
  comboboxClearTriggerBase,
  comboboxContentBase,
  comboboxPositionerBase,
  comboboxItemVariants,
  comboboxItemGroupLabelBase,
  comboboxItemIndicatorBase,
  comboboxListBase,
  comboboxEmptyBase,
  cn,
} from '@cloudvoyant/helical-ui';
import type { ComboboxItemVariants, SelectItemData } from '@cloudvoyant/helical-ui';

export type ComboboxProps = Omit<ComboboxRootProps<SelectItemData>, 'collection'> & {
  items?: SelectItemData[];
  collection?: ListCollection<SelectItemData>;
};

export function Combobox({
  items,
  collection,
  openOnClick = true,
  lazyMount = true,
  unmountOnExit = true,
  ...props
}: ComboboxProps) {
  const resolvedCollection = useMemo(
    () => collection ?? createListCollection({ items: items ?? [] }),
    [collection, items],
  );
  return (
    <ArkComboboxRoot
      collection={resolvedCollection}
      openOnClick={openOnClick}
      lazyMount={lazyMount}
      unmountOnExit={unmountOnExit}
      {...props}
    />
  );
}

export function ComboboxControl({ className, ...props }: ComboboxControlProps) {
  return <ArkComboboxControl className={cn(comboboxControlBase, className)} {...props} />;
}

export type ComboboxInputProps = Omit<ArkComboboxInputProps, 'size'> & { size?: 'sm' | 'md' | 'lg' };

export function ComboboxInput({ size = 'md', className, ...props }: ComboboxInputProps) {
  return <ArkComboboxInput className={cn(inputVariants({ size }), comboboxInputBase, className)} {...props} />;
}

export function ComboboxTrigger({ className, ...props }: ComboboxTriggerProps) {
  return <ArkComboboxTrigger className={cn(comboboxTriggerBase, className)} {...props} />;
}

export function ComboboxClear({ className, ...props }: ComboboxClearTriggerProps) {
  return <ArkComboboxClearTrigger aria-label="Clear" className={cn(comboboxClearTriggerBase, className)} {...props} />;
}

export function ComboboxContent({ className, ...props }: ComboboxContentProps) {
  return (
    <Portal>
      <ArkComboboxPositioner className={comboboxPositionerBase}>
        <ArkComboboxContent className={cn(comboboxContentBase, className)} {...props} />
      </ArkComboboxPositioner>
    </Portal>
  );
}

export function ComboboxItemGroup({ className, ...props }: ComboboxItemGroupProps) {
  return <ArkComboboxItemGroup className={className} {...props} />;
}

export function ComboboxItemGroupLabel({ className, ...props }: ComboboxItemGroupLabelProps) {
  return <ArkComboboxItemGroupLabel className={cn(comboboxItemGroupLabelBase, className)} {...props} />;
}

export type ComboboxItemProps = Omit<ArkComboboxItemProps, 'item'> & ComboboxItemVariants & { item: SelectItemData };

export function ComboboxItem({ item, showIndicator = true, className, ...props }: ComboboxItemProps) {
  return (
    <ArkComboboxItem
      item={item}
      persistFocus
      className={cn(comboboxItemVariants({ showIndicator }), className)}
      {...props}
    />
  );
}

export function ComboboxItemText({ className, ...props }: ComboboxItemTextProps) {
  return <ArkComboboxItemText className={className} {...props} />;
}

export function ComboboxItemIndicator({ className, ...props }: ComboboxItemIndicatorProps) {
  return <ArkComboboxItemIndicator className={cn(comboboxItemIndicatorBase, className)} {...props} />;
}

export function ComboboxList({ className, ...props }: ComboboxListProps) {
  return <ArkComboboxList className={cn(comboboxListBase, className)} {...props} />;
}

export function ComboboxEmpty({ className, children, ...props }: ComboboxEmptyProps) {
  return (
    <ArkComboboxEmpty className={cn(comboboxEmptyBase, className)} {...props}>
      {children ?? 'No results found.'}
    </ArkComboboxEmpty>
  );
}

export const useCombobox = useComboboxContext;

export type {
  ComboboxControlProps,
  ComboboxTriggerProps,
  ComboboxClearTriggerProps,
  ComboboxContentProps,
  ComboboxItemGroupProps,
  ComboboxItemGroupLabelProps,
  ComboboxItemTextProps,
  ComboboxItemIndicatorProps,
  ComboboxListProps,
  ComboboxEmptyProps,
};
