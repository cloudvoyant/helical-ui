<!-- libs/helical-svelte/src/code-block/LanguageTabsCodeBlock.svelte -->
<!-- Closely based on: diffbook code-block family, rebuilt with a helical-ui Select language dropdown
     + floating copy, mirrored from @cloudvoyant/helical-react -->
<script lang="ts">
  import { Ark } from '@ark-ui/svelte/factory';
  import CopyButton from '../CopyButton.svelte';
  import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectIndicator,
    SelectContent,
    SelectItem,
    SelectItemText,
    SelectItemIndicator,
  } from '../select';
  import CodeBlockHeader from './CodeBlockHeader.svelte';
  import CodeBlockTitle from './CodeBlockTitle.svelte';
  import CodeRenderer from './CodeRenderer.svelte';
  import {
    codeBlockRootBase,
    codeBlockCopyFloatBase,
    cn,
  } from '@cloudvoyant/helical-ui';
  import type { LanguageTab } from '@cloudvoyant/helical-ui';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    tabs: LanguageTab[];
    showLineNumbers?: boolean;
    scrollable?: boolean;
    maxHeight?: number;
    class?: string;
  } & HTMLAttributes<HTMLDivElement>;

  let {
    tabs,
    showLineNumbers = false,
    scrollable = false,
    maxHeight = 400,
    class: className = '',
    ...rest
  }: Props = $props();

  let active = $state(tabs[0]?.label ?? '');
  const tab = $derived(tabs.find((t) => t.label === active) ?? tabs[0]);
  const items = $derived(tabs.map((t) => ({ value: t.label, label: t.label })));

  $effect(() => {
    if (!tabs.some((t) => t.label === active)) {
      active = tabs[0]?.label ?? '';
    }
  });

  const classes = $derived(cn(codeBlockRootBase, className));
</script>

<Ark as="div" data-code-block class={classes} {...rest}>
  <CodeBlockHeader>
    <CodeBlockTitle>{tab?.filename}</CodeBlockTitle>
    <div class="ml-auto">
      <Select {items} value={[active]} onValueChange={(details) => (active = details.value[0])} aria-label="Language">
        <SelectTrigger size="sm" class="min-w-28 justify-between font-mono text-xs">
          <SelectValue />
          <SelectIndicator>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          </SelectIndicator>
        </SelectTrigger>
        <SelectContent>
          {#each tabs as t (t.label)}
            <SelectItem item={{ value: t.label, label: t.label }}>
              <SelectItemText>{t.label}</SelectItemText>
              <SelectItemIndicator>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5"></path>
                </svg>
              </SelectItemIndicator>
            </SelectItem>
          {/each}
        </SelectContent>
      </Select>
    </div>
  </CodeBlockHeader>
  {#if tab}
    <div class="relative">
      <CodeRenderer
        code={tab.code}
        language={tab.language ?? 'tsx'}
        html={tab.html}
        {showLineNumbers}
        {scrollable}
        {maxHeight}
      />
      <div class={codeBlockCopyFloatBase}>
        <CopyButton value={tab.code} label="Copy code" />
      </div>
    </div>
  {/if}
</Ark>
