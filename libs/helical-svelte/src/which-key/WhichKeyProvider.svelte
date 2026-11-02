<!-- libs/helical-svelte/src/which-key/WhichKeyProvider.svelte -->
<script lang="ts">
  import { untrack, type Snippet } from 'svelte';
  import { useEnvironmentContext } from '@ark-ui/svelte/environment';
  import { HotkeysProvider } from '@tanstack/svelte-hotkeys';
  import {
    createWhichKeyController,
    type WhichKeyControllerOptions,
    type WhichKeyState,
  } from '@cloudvoyant/helical-ui';
  import { setWhichKeyContext } from './context.svelte';

  type Props = WhichKeyControllerOptions & {
    scoped?: boolean;
    children?: Snippet;
  };

  let {
    preset,
    defaultMode = 'normal',
    leaderKey = 'Space',
    jumpAction,
    jumpAlphabet,
    storageKey,
    keymap,
    commands,
    enabled = true,
    disableOnMobile = true,
    scoped = true,
    onPresetChange,
    onModeChange,
    onJumpActionChange,
    onCommand,
    onYank,
    children,
  }: Props = $props();

  const env = useEnvironmentContext();
  let scopeEl: HTMLDivElement | null = $state(null);

  const controller = untrack(() =>
    createWhichKeyController({
      preset,
      defaultMode,
      leaderKey,
      jumpAction,
      jumpAlphabet,
      storageKey,
      keymap,
      commands,
      enabled,
      disableOnMobile,
      getDocument: () => {
        try {
          return env?.().getDocument?.() ?? document;
        } catch {
          return document;
        }
      },
      getScopeElement: () => (scoped ? scopeEl : null),
      onPresetChange: (next) => onPresetChange?.(next),
      onModeChange: (next) => onModeChange?.(next),
      onJumpActionChange: (next) => onJumpActionChange?.(next),
      onCommand: (id, ctx) => onCommand?.(id, ctx),
      onYank: (text, ctx) => onYank?.(text, ctx),
    }),
  );

  let reactiveState: WhichKeyState = $state(controller.getState());

  setWhichKeyContext({
    controller,
    get state() {
      return reactiveState;
    },
  });

  $effect(() => {
    const unsubscribe = controller.subscribe(() => {
      reactiveState = controller.getState();
    });
    return () => {
      unsubscribe();
    };
  });

  $effect(() => {
    if (preset !== undefined) {
      controller.setPreset(preset);
    }
  });

  $effect(() => {
    if (jumpAction !== undefined) {
      controller.setJumpAction(jumpAction);
    }
  });

  $effect(() => {
    if (!enabled) return;
    let doc: Document | undefined;
    try {
      doc = env?.().getDocument?.();
    } catch {
      doc = typeof document !== 'undefined' ? document : undefined;
    }
    return controller.attach(doc);
  });

  $effect(() => {
    if (!keymap) return;
    return controller.registerKeymap('__provider_keymap__', keymap, {
      enabled: true,
    });
  });

  $effect(() => {
    if (!commands) return;
    const cleanups = Object.entries(commands).map(([id, handler]) =>
      controller.registerCommand(id, handler),
    );
    return () => {
      for (const fn of cleanups) fn();
    };
  });
</script>

<HotkeysProvider>
  {#if scoped}
    <div bind:this={scopeEl} data-which-key-scope class="contents">
      {@render children?.()}
    </div>
  {:else}
    {@render children?.()}
  {/if}
</HotkeysProvider>
