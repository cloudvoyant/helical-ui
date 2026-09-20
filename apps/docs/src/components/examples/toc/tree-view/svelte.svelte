<!-- apps/docs/src/components/examples/toc/tree-view/svelte.svelte -->
<!-- Mirrors Ark UI's TOC "With Tree View" example. The section hierarchy below
     drives the article content only; it is flattened into the public flat
     `TocItem[]`, and the high-level `variant="tree"` derives the TreeView
     collection and its expansion state. -->
<script lang="ts">
  import { Toc } from '@cloudvoyant/helical-svelte';

  type Section = {
    id: string;
    name: string;
    lines: number;
    children?: Section[];
  };

  const sections: Section[] = [
    {
      id: 'svelte-09-guides',
      name: 'Guides',
      lines: 10,
      children: [
        { id: 'svelte-09-quick-start', name: 'Quick Start', lines: 6 },
        { id: 'svelte-09-manual-setup', name: 'Manual Setup', lines: 5 },
      ],
    },
    {
      id: 'svelte-09-core-concepts',
      name: 'Core Concepts',
      lines: 9,
      children: [
        { id: 'svelte-09-toc-props', name: 'Props', lines: 7 },
        { id: 'svelte-09-toc-events', name: 'Events', lines: 6 },
        { id: 'svelte-09-toc-context', name: 'Context', lines: 8 },
      ],
    },
    {
      id: 'svelte-09-advanced',
      name: 'Advanced',
      lines: 11,
      children: [
        { id: 'svelte-09-root-api', name: 'Root Provider', lines: 7 },
        { id: 'svelte-09-custom-rendering', name: 'Custom Rendering', lines: 6 },
      ],
    },
  ];

  // Flattened to the public flat item list — no tree structure crosses the API.
  const items = sections.flatMap((section) => [
    { value: section.id, depth: 2, label: section.name },
    ...(section.children ?? []).map((child) => ({ value: child.id, depth: 3, label: child.name })),
  ]);

  let contentRef: HTMLElement | null = $state(null);
</script>

<div class="grid min-h-dvh grid-cols-[minmax(0,1fr)_16rem] bg-background text-foreground">
  <main bind:this={contentRef} data-toc-scroll class="h-dvh overflow-y-auto p-8">
    <div class="mx-auto flex max-w-2xl flex-col gap-10">
      {#each sections as section (section.id)}
        <section class="scroll-mt-8">
          <h2 id={section.id} class="text-lg font-semibold">{section.name}</h2>
          <div class="mt-3 flex flex-col gap-2">
            {#each Array.from({ length: section.lines }) as _, i (i)}
              <div class="h-2.5 rounded bg-muted"></div>
            {/each}
          </div>
          {#each section.children ?? [] as child (child.id)}
            <div class="mt-6 scroll-mt-8 ps-6">
              <h3 id={child.id} class="text-base font-semibold">{child.name}</h3>
              <div class="mt-3 flex flex-col gap-2">
                {#each Array.from({ length: child.lines }) as _, i (i)}
                  <div class="h-2.5 rounded bg-muted"></div>
                {/each}
              </div>
            </div>
          {/each}
        </section>
      {/each}
    </div>
  </main>
  <aside class="h-dvh border-s border-border p-6">
    <Toc {items} scrollEl={() => contentRef} variant="tree" />
  </aside>
</div>
