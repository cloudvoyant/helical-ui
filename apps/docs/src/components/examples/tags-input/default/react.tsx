// apps/docs/src/components/examples/tags-input/default/react.tsx
import {
  TagInput,
  TagInputControl,
  TagInputInput,
  TagInputItem,
  TagInputItemPreview,
  TagInputItemText,
  TagInputItemInput,
  TagInputItemDeleteTrigger,
  TagInputContext,
} from '@cloudvoyant/helical-react';
import { X } from 'lucide-react';

export default function ReactTagInputDefault() {
  return (
    <TagInput defaultValue={['react', 'svelte']} className="max-w-sm">
      <TagInputControl>
        <TagInputContext>
          {(api) => (
            <>
              {api.value.map((value, index) => (
                <TagInputItem key={value} index={index} value={value}>
                  <TagInputItemPreview>
                    <TagInputItemText>{value}</TagInputItemText>
                    <TagInputItemDeleteTrigger>
                      <X />
                    </TagInputItemDeleteTrigger>
                  </TagInputItemPreview>
                  <TagInputItemInput />
                </TagInputItem>
              ))}
              <TagInputInput placeholder="Add tag" />
            </>
          )}
        </TagInputContext>
      </TagInputControl>
    </TagInput>
  );
}
