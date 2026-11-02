<!-- libs/helical-svelte/src/which-key/WhichKey.svelte -->
<script lang="ts">
  import { Portal } from '@ark-ui/svelte/portal';
  import { Presence } from '@ark-ui/svelte/presence';
  import {
    cn,
    jumpBadgeMatchedPrefixBase,
    jumpBadgeVariants,
    jumpOverlayRootBase,
    whichKeyBodyVariants,
    whichKeyBreadcrumbBase,
    whichKeyFooterBase,
    whichKeyHeaderBase,
    whichKeyItemBase,
    whichKeyItemLabelBase,
    whichKeyModeBadgeVariants,
    whichKeyTitleBase,
    whichKeyVariants,
    type WhichKeyProps as CoreWhichKeyProps,
  } from '@cloudvoyant/helical-ui';
  import Kbd from '../Kbd.svelte';
  import Row from '../Row.svelte';
  import Scroll from '../Scroll.svelte';
  import { getOptionalWhichKeyContext } from './context.svelte';
  import WhichKeyExplorer from './WhichKeyExplorer.svelte';

  type Props = Omit<CoreWhichKeyProps, 'className'> & {
    class?: string;
    className?: string;
  };

  let {
    variant = 'helix',
    showModeBadge = true,
    showExplorer = true,
    class: className = '',
    className: reactClassName = '',
  }: Props = $props();

  const ctx = getOptionalWhichKeyContext();

  let panelRef: HTMLDivElement | null = $state(null);
  let jumpOverlayRef: HTMLDivElement | null = $state(null);

  $effect(() => {
    if (!ctx?.state.isOpen) return;
    return ctx.controller.trackBranchElement(() => panelRef);
  });

  $effect(() => {
    if (ctx?.state.mode !== 'jump') return;
    return ctx.controller.trackBranchElement(() => jumpOverlayRef);
  });
</script>

{#if ctx}
  <Portal>
    <Presence present={ctx.state.isOpen} lazyMount unmountOnExit>
      <div
        bind:this={panelRef}
        role="region"
        aria-label={ctx.state.title || 'WhichKey commands'}
        data-which-key-root="true"
        data-testid="which-key-panel"
        data-variant={variant}
        data-preset={ctx.state.preset}
        data-mode={ctx.state.mode}
        data-sticky={ctx.state.sticky ? 'true' : 'false'}
        class={cn(whichKeyVariants({ variant }), className, reactClassName)}
      >
        <div class={whichKeyHeaderBase}>
          <div class={whichKeyTitleBase}>
            {#if showModeBadge}
              <span
                data-testid="which-key-mode-badge"
                class={whichKeyModeBadgeVariants({ mode: ctx.state.mode })}
              >
                {ctx.state.sticky ? `${ctx.state.mode}·lock` : ctx.state.mode}
              </span>
            {/if}
            <span data-testid="which-key-title">
              {ctx.state.title === 'Space' ? 'Leader' : ctx.state.title}
            </span>
            {#if ctx.state.countBuffer}
              <span
                data-testid="which-key-count"
                class="rounded bg-muted px-1 font-mono text-[10px]"
              >
                {ctx.state.countBuffer}×
              </span>
            {/if}
          </div>
          <div
            data-testid="which-key-breadcrumb"
            class={whichKeyBreadcrumbBase}
          >
            <span>{ctx.state.breadcrumb.join(' » ')}</span>
          </div>
        </div>

        <Scroll class="max-h-72" viewportClass="max-h-72">
          <div
            data-testid="which-key-items"
            class={whichKeyBodyVariants({ variant })}
          >
            {#each ctx.state.items as node (node.key)}
              {@const isGroup = Boolean(
                node.children || node.proxy || node.expand || node.label.startsWith('+'),
              )}
              <button
                type="button"
                data-testid="which-key-item"
                data-key={node.key}
                data-group={isGroup ? 'true' : 'false'}
                onclick={(e: MouseEvent) => {
                  e.preventDefault();
                  e.stopPropagation();
                  ctx.controller.triggerKey(node.key);
                }}
                class={whichKeyItemBase}
              >
                <span
                  data-group={isGroup ? 'true' : 'false'}
                  class={whichKeyItemLabelBase}
                >
                  {node.label}
                </span>
                <Kbd
                  size="sm"
                  variant={isGroup ? 'subtle' : 'outline'}
                  hotkey={node.key}
                />
              </button>
            {/each}
          </div>
        </Scroll>

        <div class={whichKeyFooterBase}>
          <Row class="items-center gap-2">
            {#if ctx.state.breadcrumb.length > 1}
              <button
                type="button"
                onclick={() => ctx.controller.stepBackPrefix()}
                class="inline-flex items-center gap-1 hover:text-foreground"
              >
                <Kbd size="sm">⌫</Kbd>
                <span>Back</span>
              </button>
            {/if}
            <button
              type="button"
              onclick={() => ctx.controller.closePrefix()}
              class="inline-flex items-center gap-1 hover:text-foreground"
            >
              <Kbd size="sm">Esc</Kbd>
              <span>Close</span>
            </button>
          </Row>
          <span class="font-mono uppercase opacity-75">
            {ctx.state.preset}
          </span>
        </div>
      </div>
    </Presence>
  </Portal>

  <Portal>
    <Presence
      present={ctx.state.mode === 'jump' && ctx.state.jumpTargets.length > 0}
      lazyMount
      unmountOnExit
    >
      <div
        bind:this={jumpOverlayRef}
        data-which-key-jump-overlay="true"
        data-testid="which-key-jump-overlay"
        data-jump-action={ctx.state.jumpAction}
        class={jumpOverlayRootBase}
      >
        {#each ctx.state.jumpTargets as target (target.id)}
          <span
            data-testid="which-key-jump-badge"
            data-jump-label={target.label}
            style={`top: ${Math.max(4, target.rect.top - 4)}px; left: ${Math.max(4, target.rect.left - 4)}px;`}
            class={jumpBadgeVariants({ action: ctx.state.jumpAction })}
          >
            {#if target.matchedPrefix}
              <span class={jumpBadgeMatchedPrefixBase}>
                {target.matchedPrefix}
              </span>
            {/if}
            <span>{target.remainingLabel}</span>
          </span>
        {/each}
      </div>
    </Presence>
  </Portal>

  {#if showExplorer}
    <WhichKeyExplorer />
  {/if}
{/if}
