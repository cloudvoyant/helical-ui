<!-- libs/helical-svelte/src/code-block/MultiFileCodeBlock.svelte -->
<!-- Closely based on: diffbook code-block family, mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import CopyButton from '../CopyButton.svelte';
  import CodeRenderer from './CodeRenderer.svelte';
  import { codeBlockRootBase, cn } from '@cloudvoyant/helical-ui';
  import type { FileEntry } from '@cloudvoyant/helical-ui';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    files: FileEntry[];
    showLineNumbers?: boolean;
    scrollable?: boolean;
    maxHeight?: number;
    class?: string;
  } & HTMLAttributes<HTMLDivElement>;

  let {
    files,
    showLineNumbers = false,
    scrollable = false,
    maxHeight = 400,
    class: className = '',
    ...rest
  }: Props = $props();

  let active = $state(files[0]?.filename ?? '');
  const file = $derived(files.find((f) => f.filename === active) ?? files[0]);

  $effect(() => {
    if (!files.some((f) => f.filename === active)) {
      active = files[0]?.filename ?? '';
    }
  });

  const classes = $derived(cn(codeBlockRootBase, className));
</script>

<Ark as="div" data-code-block class={classes} {...rest}>
  <div class="flex items-center justify-between border-b bg-muted/50">
    <div role="tablist" aria-label="Files" class="flex overflow-x-auto no-scrollbar pl-1">
      {#each files as f (f.filename)}
        <button
          role="tab"
          aria-selected={active === f.filename}
          onclick={() => (active = f.filename)}
          class={cn(
            'h-10 shrink-0 border-b-2 px-3 font-mono text-xs transition-colors',
            active === f.filename
              ? 'border-foreground text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground',
          )}
        >
          {f.filename}
        </button>
      {/each}
    </div>
    {#if file}
      <div class="shrink-0 pr-3">
        <CopyButton value={file.code} label="Copy code" />
      </div>
    {/if}
  </div>
  {#if file}
    <CodeRenderer
      code={file.code}
      language={file.language ?? 'tsx'}
      html={file.html}
      {showLineNumbers}
      {scrollable}
      {maxHeight}
    />
  {/if}
</Ark>
