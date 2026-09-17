// libs/helical-svelte/src/code-block/CodeBlockContext.svelte.ts
// Shared code-block context so composite parts (Title/Content/CopyButton) read the block's props.
import { getContext } from 'svelte';

export interface CodeBlockContextValue {
  code: string;
  language: string;
  html?: string;
  showLineNumbers: boolean;
  scrollable: boolean;
  maxHeight: number;
  highlightLines?: number[];
}

export const CODE_BLOCK_KEY = Symbol('helical-ui-code-block');

export function codeBlockContext(): CodeBlockContextValue | undefined {
  return getContext<CodeBlockContextValue | undefined>(CODE_BLOCK_KEY);
}
