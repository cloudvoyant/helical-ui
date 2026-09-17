<!-- libs/helical-svelte/src/code-block/CodeBlockContent.svelte -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import CodeRenderer from './CodeRenderer.svelte';
  import { codeBlockContext } from './CodeBlockContext.svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = { html?: string; class?: string } & HTMLAttributes<HTMLDivElement>;
  let { html = undefined, class: className = '', ...rest }: Props = $props();

  const ctx = codeBlockContext();
  if (!ctx) {
    throw new Error('CodeBlockContent must be rendered inside a CodeBlock.');
  }
</script>

<Ark as="div" class={className} {...rest}>
  <CodeRenderer {...ctx} html={html ?? ctx.html} />
</Ark>
