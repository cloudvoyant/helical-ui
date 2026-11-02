// apps/docs/src/components/DocsKeyboardShell.tsx
// Site-wide WhichKeyProvider + WhichKey command panel for the Astro docs shell.
// Connects the static Astro layout regions (Sidebar gutter, Main Content, TOC gutter)
// as navigable panes and syncs with TopNav's preset selector and <leader>? button.
import { useEffect, useMemo, useState } from 'react';
import {
  WhichKey,
  WhichKeyProvider,
  useWhichKey,
  type KeybindingPreset,
  type KeymapHandler,
  type WhichKeyNode,
} from '@cloudvoyant/helical-react';
import { getStoredFramework, setFramework } from '../lib/framework';

export const PRESET_STORAGE_KEY = 'vortex:keymap-preset';
export const PRESET_CHANGE_EVENT = 'vortex:keymap-preset-change';
export const EXPLORE_OPEN_EVENT = 'vortex:which-key-explore';

export function getStoredKeymapPreset(): KeybindingPreset {
  if (typeof window === 'undefined') return 'helix';
  try {
    const raw = window.localStorage.getItem(PRESET_STORAGE_KEY);
    if (raw === 'helix' || raw === 'vim' || raw === 'kakoune') {
      return raw;
    }
  } catch {
    // Ignore storage errors
  }
  return 'helix';
}

export function setStoredKeymapPreset(preset: KeybindingPreset): KeybindingPreset {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(PRESET_STORAGE_KEY, preset);
    } catch {
      // Ignore storage errors
    }
    document.documentElement.dataset.keymapPreset = preset;
    window.dispatchEvent(new CustomEvent<KeybindingPreset>(PRESET_CHANGE_EVENT, { detail: preset }));
  }
  return preset;
}

function DocsShellSync() {
  const { controller, activePaneId, openExplorer, setPreset } = useWhichKey();

  useEffect(() => {
    const gutters = Array.from(
      document.querySelectorAll<HTMLElement>('body > [data-slot="page"] [data-slot="page-gutter"]'),
    );
    const leftGutter = gutters[0] ?? null;
    const rightGutter = gutters[1] ?? null;
    const mainContent = document.querySelector<HTMLElement>('body > [data-slot="page"] [data-slot="page-content"]');

    const cleanups: Array<() => void> = [];

    if (leftGutter) {
      leftGutter.setAttribute('data-pane-id', 'docs-sidebar');
      leftGutter.setAttribute('data-pane-title', 'Sidebar');
      cleanups.push(
        controller.registerPane({
          id: 'docs-sidebar',
          title: 'Sidebar',
          element: leftGutter,
          order: 1,
        }),
      );
    }

    if (mainContent) {
      mainContent.setAttribute('data-pane-id', 'docs-main');
      mainContent.setAttribute('data-pane-title', 'Main Content');
      cleanups.push(
        controller.registerPane({
          id: 'docs-main',
          title: 'Main Content',
          element: mainContent,
          order: 2,
        }),
      );
    }

    if (rightGutter) {
      rightGutter.setAttribute('data-pane-id', 'docs-toc');
      rightGutter.setAttribute('data-pane-title', 'Table of Contents');
      cleanups.push(
        controller.registerPane({
          id: 'docs-toc',
          title: 'Table of Contents',
          element: rightGutter,
          order: 3,
        }),
      );
    }

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [controller]);

  useEffect(() => {
    const paneElements = document.querySelectorAll<HTMLElement>(
      '[data-pane-id="docs-sidebar"], [data-pane-id="docs-main"], [data-pane-id="docs-toc"]',
    );
    paneElements.forEach((el) => {
      const id = el.getAttribute('data-pane-id');
      el.setAttribute('data-pane-active', id === activePaneId ? 'true' : 'false');
    });
  }, [activePaneId]);

  useEffect(() => {
    const onPresetEvent = (e: Event) => {
      const detail = (e as CustomEvent<KeybindingPreset>).detail;
      if (detail === 'helix' || detail === 'vim' || detail === 'kakoune') {
        setPreset(detail);
      }
    };
    const onExploreEvent = () => {
      openExplorer();
    };
    window.addEventListener(PRESET_CHANGE_EVENT, onPresetEvent);
    window.addEventListener(EXPLORE_OPEN_EVENT, onExploreEvent);
    return () => {
      window.removeEventListener(PRESET_CHANGE_EVENT, onPresetEvent);
      window.removeEventListener(EXPLORE_OPEN_EVENT, onExploreEvent);
    };
  }, [openExplorer, setPreset]);

  return null;
}

export default function DocsKeyboardShell() {
  const [preset, setPresetState] = useState<KeybindingPreset>('helix');

  useEffect(() => {
    const initial = getStoredKeymapPreset();
    setPresetState(initial);
    document.documentElement.dataset.keymapPreset = initial;
  }, []);

  const keymap = useMemo<Record<string, WhichKeyNode>>(
    () => ({
      Space: {
        key: 'Space',
        label: '+space',
        group: 'Space',
        children: {
          f: {
            key: 'f',
            label: 'Toggle Framework (React/Svelte)',
            group: 'Docs',
            commandId: 'docs.toggleFramework',
          },
        },
      },
    }),
    [],
  );

  const commands = useMemo<Record<string, KeymapHandler>>(
    () => ({
      'docs.toggleFramework': () => {
        const current = getStoredFramework();
        setFramework(current === 'react' ? 'svelte' : 'react');
      },
    }),
    [],
  );

  return (
    <WhichKeyProvider
      scoped={false}
      preset={preset}
      keymap={keymap}
      commands={commands}
      onPresetChange={(next) => {
        setPresetState(next);
        setStoredKeymapPreset(next);
      }}
    >
      <DocsShellSync />
      <WhichKey />
    </WhichKeyProvider>
  );
}
