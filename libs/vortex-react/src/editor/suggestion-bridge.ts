// libs/vortex-react/src/editor/suggestion-bridge.ts
// React counterpart of the Svelte editor's mention render. Wraps ReactRenderer into a Tiptap
// suggestion `render` lifecycle. Like the Svelte version it mounts into document.body so the
// menu follows the caret rather than living inside the Editor tree.
import { ReactRenderer } from '@tiptap/react';
import type { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion';
import type { ComponentType } from 'react';

interface MenuRef {
  onKeyDown?: (props: SuggestionKeyDownProps) => boolean;
}

/**
 * Build a Tiptap suggestion render that mounts a React component.
 * `onState` (optional) receives each props update / null on exit — use it when the menu is
 * rendered from the parent's JSX instead of being mounted here.
 */
export function renderSuggestion<T>(
  Component: ComponentType<SuggestionProps<T>>,
  onState?: (state: SuggestionProps<T> | null) => void,
) {
  let renderer: ReactRenderer<MenuRef, SuggestionProps<T>> | null = null;
  let element: HTMLElement | null = null;

  return {
    onStart: (props: SuggestionProps<T>) => {
      element = document.createElement('div');
      element.style.position = 'fixed';
      element.style.zIndex = '50';
      document.body.appendChild(element);

      renderer = new ReactRenderer(Component, { props, editor: props.editor });
      element.appendChild(renderer.element);
      onState?.(props);
    },
    onUpdate: (props: SuggestionProps<T>) => {
      renderer?.updateProps(props);
      onState?.(props);
    },
    onKeyDown: (props: SuggestionKeyDownProps) => {
      if (props.event.key === 'Escape') return true;
      return renderer?.ref?.onKeyDown?.(props) ?? false;
    },
    onExit: () => {
      renderer?.destroy();
      element?.remove();
      renderer = null;
      element = null;
      onState?.(null);
    },
  };
}
