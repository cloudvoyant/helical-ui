// libs/helical-react/src/editor/CodeBlockComponent.tsx
// React parity of CodeBlockComponent.svelte. Language selection reuses the same shared Select
// control as the static multi-language CodeBlock.
import { NodeViewWrapper, NodeViewContent, type NodeViewProps } from '@tiptap/react';
import { ChevronsUpDown, Check } from 'lucide-react';
import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockCopyButton,
  Select,
  SelectTrigger,
  SelectValue,
  SelectIndicator,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectItemIndicator,
} from '..';
import { cn, codeBlockBodyBase, codeBlockContentBase, type SelectItemData } from '@cloudvoyant/helical-ui';

const LANGUAGES: SelectItemData[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'bash', label: 'Bash' },
  { value: 'sql', label: 'SQL' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'plaintext', label: 'Plain Text' },
];

export function CodeBlockComponent({ node, editor, updateAttributes }: NodeViewProps) {
  const language = (node.attrs.language as string) || 'javascript';
  const editable = editor.isEditable;

  const currentLabel = LANGUAGES.find((item) => item.value === language)?.label ?? 'JavaScript';

  return (
    <NodeViewWrapper className="my-4">
      <CodeBlock code={node.textContent} language={language} className="my-0">
        <CodeBlockHeader>
          <CodeBlockTitle>{currentLabel}</CodeBlockTitle>
          <div className="ml-auto flex items-center gap-2" contentEditable={false}>
            {editable ? (
              <Select
                items={LANGUAGES}
                value={[language]}
                onValueChange={(details) => {
                  const next = details.value[0];
                  if (next) updateAttributes({ language: next });
                }}
                aria-label="Code language"
              >
                <SelectTrigger size="sm" className="min-w-36 justify-between font-mono text-xs">
                  <SelectValue />
                  <SelectIndicator>
                    <ChevronsUpDown className="size-3 opacity-50" />
                  </SelectIndicator>
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((item) => (
                    <SelectItem key={item.value} item={item}>
                      <SelectItemText>{item.label}</SelectItemText>
                      <SelectItemIndicator>
                        <Check className="size-4" />
                      </SelectItemIndicator>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}
            <CodeBlockCopyButton />
          </div>
        </CodeBlockHeader>
        <div className={codeBlockBodyBase}>
          <pre
            className={cn(
              codeBlockContentBase,
              'editor-code-content m-0 rounded-none border-0 bg-transparent p-4 font-mono [&_code]:bg-transparent [&_code]:p-0',
            )}
          >
            {/* NodeViewContent is generic with NoInfer<T>, so the element type must be explicit. */}
            <NodeViewContent<'code'> as="code" />
          </pre>
        </div>
      </CodeBlock>
    </NodeViewWrapper>
  );
}
