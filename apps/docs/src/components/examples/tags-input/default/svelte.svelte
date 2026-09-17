<!-- apps/docs/src/components/examples/tags-input/default/svelte.svelte -->
<script lang="ts">
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
  } from '@cloudvoyant/helical-svelte';
  import { X } from 'lucide-svelte';
</script>

<TagInput defaultValue={['react', 'svelte']} class="max-w-sm">
  <TagInputControl>
    <TagInputContext>
      {#snippet render(api)}
        {#each api().value as value, index (value)}
          <TagInputItem {index} {value}>
            <TagInputItemPreview>
              <TagInputItemText>{value}</TagInputItemText>
              <TagInputItemDeleteTrigger>
                <X />
              </TagInputItemDeleteTrigger>
            </TagInputItemPreview>
            <TagInputItemInput />
          </TagInputItem>
        {/each}
        <TagInputInput placeholder="Add tag" />
      {/snippet}
    </TagInputContext>
  </TagInputControl>
</TagInput>
