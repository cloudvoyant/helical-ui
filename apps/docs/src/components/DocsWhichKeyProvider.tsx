// apps/docs/src/components/DocsWhichKeyProvider.tsx
// Site-wide WhichKeyProvider + WhichKey command panel for the Astro docs shell.
import { useMemo } from 'react';
import { WhichKey, WhichKeyProvider, type KeymapHandler, type WhichKeyNode } from '@cloudvoyant/helical-react';
import { getStoredFramework, setFramework } from '../lib/framework';

export default function DocsWhichKeyProvider() {
  const keymap = useMemo<Record<string, WhichKeyNode>>(
    () => ({
      Space: {
        key: 'Space',
        label: '+leader',
        group: 'Leader',
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
    <WhichKeyProvider scoped={false} storageKey="vortex" keymap={keymap} commands={commands}>
      <WhichKey />
    </WhichKeyProvider>
  );
}
