<!-- libs/helical-svelte/src/code-block/CodeBlockCopyButton.svelte -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import CopyButton from '../CopyButton.svelte';
  import { codeBlockContext } from './CodeBlockContext.svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = { label?: string; class?: string } & HTMLAttributes<HTMLDivElement>;
  let { label = 'Copy code', class: className = '', ...rest }: Props = $props();

  const ctx = codeBlockContext();
  if (!ctx) {
    throw new Error('CodeBlockCopyButton must be rendered inside a CodeBlock.');
  }
</script>

<Ark as="div" class={className} {...rest}>
  <CopyButton value={ctx.code} {label} />
</Ark>
