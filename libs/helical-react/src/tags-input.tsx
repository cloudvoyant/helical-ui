// libs/helical-react/src/tags-input.tsx
// Closely based on: Shark UI tags input (@ark-ui/react/tags-input)
import {
  TagsInputRoot as ArkTagsInputRoot,
  TagsInputControl as ArkTagsInputControl,
  TagsInputInput as ArkTagsInputInput,
  TagsInputItem as ArkTagsInputItem,
  TagsInputItemPreview as ArkTagsInputItemPreview,
  TagsInputItemText as ArkTagsInputItemText,
  TagsInputItemInput as ArkTagsInputItemInput,
  TagsInputItemDeleteTrigger as ArkTagsInputItemDeleteTrigger,
  TagsInputClearTrigger as ArkTagsInputClearTrigger,
  TagsInputHiddenInput as ArkTagsInputHiddenInput,
  TagsInputContext as ArkTagsInputContext,
  useTagsInputContext,
  type TagsInputRootProps,
  type TagsInputContextProps,
} from '@ark-ui/react/tags-input';
import type {
  TagsInputControlProps,
  TagsInputInputProps,
  TagsInputItemProps,
  TagsInputItemPreviewProps,
  TagsInputItemTextProps,
  TagsInputItemInputProps,
  TagsInputItemDeleteTriggerProps,
  TagsInputClearTriggerProps,
} from '@ark-ui/react/tags-input';
import {
  tagsInputRootBase,
  tagsInputControlBase,
  tagsInputInputBase,
  tagsInputItemBase,
  tagsInputItemTextBase,
  tagsInputItemInputBase,
  tagsInputItemDeleteTriggerBase,
  tagsInputClearTriggerBase,
  cn,
} from '@cloudvoyant/helical-ui';

export type TagInputProps = TagsInputRootProps;

export function TagInput({ className, editable = false, children, ...props }: TagInputProps) {
  return (
    <ArkTagsInputRoot className={cn(tagsInputRootBase, className)} editable={editable} {...props}>
      {children}
      <ArkTagsInputHiddenInput />
    </ArkTagsInputRoot>
  );
}

export function TagInputControl({ className, ...props }: TagsInputControlProps) {
  return <ArkTagsInputControl className={cn(tagsInputControlBase, className)} {...props} />;
}

export function TagInputInput({ className, ...props }: TagsInputInputProps) {
  return <ArkTagsInputInput className={cn(tagsInputInputBase, className)} {...props} />;
}

export function TagInputItem({ className, ...props }: TagsInputItemProps) {
  return <ArkTagsInputItem className={cn(tagsInputItemBase, className)} {...props} />;
}

export function TagInputItemPreview({ className, ...props }: TagsInputItemPreviewProps) {
  return <ArkTagsInputItemPreview className={className} {...props} />;
}

export function TagInputItemText({ className, ...props }: TagsInputItemTextProps) {
  return <ArkTagsInputItemText className={cn(tagsInputItemTextBase, className)} {...props} />;
}

export function TagInputItemInput({ className, ...props }: TagsInputItemInputProps) {
  return <ArkTagsInputItemInput className={cn(tagsInputItemInputBase, className)} {...props} />;
}

export function TagInputItemDeleteTrigger({ className, ...props }: TagsInputItemDeleteTriggerProps) {
  return (
    <ArkTagsInputItemDeleteTrigger
      aria-label="Remove tag"
      className={cn(tagsInputItemDeleteTriggerBase, className)}
      {...props}
    />
  );
}

export function TagInputClearTrigger({ className, ...props }: TagsInputClearTriggerProps) {
  return (
    <ArkTagsInputClearTrigger
      aria-label="Clear all tags"
      className={cn(tagsInputClearTriggerBase, className)}
      {...props}
    />
  );
}

export const TagInputContext = ArkTagsInputContext;
export type TagInputContextProps = TagsInputContextProps;

export const useTagInput = useTagsInputContext;

export type {
  TagsInputControlProps,
  TagsInputInputProps,
  TagsInputItemProps,
  TagsInputItemPreviewProps,
  TagsInputItemTextProps,
  TagsInputItemInputProps,
  TagsInputItemDeleteTriggerProps,
  TagsInputClearTriggerProps,
};
