<!-- apps/docs/src/components/examples/code-block/language-tabs/svelte.svelte -->
<script lang="ts">
  import { LanguageTabsCodeBlock } from '@cloudvoyant/helical-svelte';

  const tabs = [
    {
      label: 'TypeScript',
      filename: 'sum.ts',
      code: `export function sum(a: number, b: number): number {\n  return a + b;\n}`,
      language: 'ts',
    },
    {
      label: 'Python',
      filename: 'sum.py',
      code: `def sum(a: int, b: int) -> int:\n    return a + b`,
      language: 'python',
    },
    {
      label: 'Go',
      filename: 'sum.go',
      code: `package main\n\nfunc sum(a, b int) int {\n\treturn a + b\n}`,
      language: 'go',
    },
    {
      label: 'C++',
      filename: 'sum.cpp',
      code: `int sum(int a, int b) {\n    return a + b;\n}`,
      language: 'cpp',
    },
    {
      label: 'Rust',
      filename: 'sum.rs',
      code: `fn sum(a: i32, b: i32) -> i32 {\n    a + b\n}`,
      language: 'rust',
    },
    {
      label: 'Zig',
      filename: 'sum.zig',
      code: `fn sum(a: i32, b: i32) i32 {\n    return a + b;\n}`,
      language: 'zig',
    },
    {
      label: 'C#',
      filename: 'Sum.cs',
      code: `public static int Sum(int a, int b) {\n    return a + b;\n}`,
      language: 'csharp',
    },
    {
      label: 'Haskell',
      filename: 'Sum.hs',
      code: `sum :: Int -> Int -> Int\nsum a b = a + b`,
      language: 'haskell',
    },
  ];
</script>

<LanguageTabsCodeBlock showLineNumbers {tabs} />
