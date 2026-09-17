<!-- apps/docs/src/components/examples/editor/mentions/svelte.svelte -->
<!-- Minimal, no Prose wrapper — a chat-style input with @user mentions, backed by the -->
<!-- injected mentionSource seam (a static in-memory list here). -->
<script lang="ts">
  import { Editor } from '@cloudvoyant/helical-svelte';
  import type { MentionItem } from '@cloudvoyant/helical-ui';

  const PEOPLE: MentionItem[] = [
    { id: '1', label: 'Ada Lovelace', type: 'user' },
    { id: '2', label: 'Alan Turing', type: 'user' },
    { id: '3', label: 'Grace Hopper', type: 'user' },
  ];

  const compactEditor = { enforceTitle: false };

  async function mentionSource(query: string): Promise<MentionItem[]> {
    const q = query.toLowerCase();
    return PEOPLE.filter((person) => person.label.toLowerCase().includes(q));
  }
</script>

<div class="rounded-lg border border-input p-3">
  <Editor content="" {...compactEditor} {mentionSource} />
</div>
