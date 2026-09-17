<!-- libs/helical-svelte/src/code-block/CodeBlock.svelte -->
<!-- Closely based on: diffbook code-block family, rebuilt as a composable API, mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import CodeBlockHeader from './CodeBlockHeader.svelte';
  import CodeBlockTitle from './CodeBlockTitle.svelte';
  import CodeBlockContent from './CodeBlockContent.svelte';
  import CodeBlockCopyButton from './CodeBlockCopyButton.svelte';
  import { codeBlockRootBase, cn } from '@cloudvoyant/helical-ui';
  import { setContext } from 'svelte';
  import { CODE_BLOCK_KEY, type CodeBlockContextValue } from './CodeBlockContext.svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  type Props = {
    code: string;
    language?: string;
    filename?: string;
    html?: string;
    showLineNumbers?: boolean;
    scrollable?: boolean;
    maxHeight?: number;
    highlightLines?: number[];
    class?: string;
    children?: Snippet;
  } & HTMLAttributes<HTMLDivElement>;

  let {
    code,
    language = 'tsx',
    filename,
    html = undefined,
    showLineNumbers = false,
    scrollable = false,
    maxHeight = 400,
    highlightLines = undefined,
    class: className = '',
    children,
    ...rest
  }: Props = $props();

  setContext<CodeBlockContextValue>(CODE_BLOCK_KEY, {
    code,
    language,
    html,
    showLineNumbers,
    scrollable,
    maxHeight,
    highlightLines,
  });

  const classes = $derived(cn(codeBlockRootBase, className));
</script>

<Ark as="div" data-code-block class={classes} {...rest}>
  {#if children}
    {@render children()}
  {:else}
    <CodeBlockHeader>
      <CodeBlockTitle>{filename ?? language}</CodeBlockTitle>
      <div class="ml-auto">
        <CodeBlockCopyButton />
      </div>
    </CodeBlockHeader>
    <CodeBlockContent />
  {/if}
</Ark>
