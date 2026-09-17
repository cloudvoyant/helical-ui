// libs/helical-react/src/code-block.tsx
// Closely based on: diffbook code-block family (packages/diffbook-ui/src/components/ui/code-block.tsx),
// rebuilt as a composable API: CodeBlock / CodeBlockHeader / CodeBlockTitle / CodeBlockContent /
// CodeBlockCopyButton, plus MultiFileCodeBlock and LanguageTabsCodeBlock.
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { ark, type HTMLArkProps } from '@ark-ui/react/factory';
import { CopyButton } from './clipboard';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectIndicator,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectItemIndicator,
} from './select';
import {
  codeBlockRootBase,
  codeBlockHeaderBase,
  codeBlockTitleBase,
  codeBlockBodyBase,
  codeBlockBodyScrollableBase,
  codeBlockContentBase,
  codeBlockLineNumbersBase,
  codeBlockHighlightBase,
  codeBlockLoadingBase,
  codeBlockSpinnerBase,
  codeBlockCopyFloatBase,
  injectCodeBlockStyles,
  renderCodeToHtml,
  cn,
} from '@cloudvoyant/helical-ui';
import type { CodeBlockProps as CodeBlockPropsBase, FileEntry, LanguageTab } from '@cloudvoyant/helical-ui';

/* ------------------------------------------------------------------ */
/*  Context — lets the composite parts read the block's props           */
/* ------------------------------------------------------------------ */

interface CodeBlockContextValue {
  code: string;
  language: string;
  html?: string;
  showLineNumbers: boolean;
  scrollable: boolean;
  maxHeight: number;
  highlightLines?: number[];
}

const CodeBlockContext = createContext<CodeBlockContextValue | null>(null);

function useCodeBlock(): CodeBlockContextValue {
  const ctx = useContext(CodeBlockContext);
  if (!ctx) throw new Error('CodeBlock parts must be rendered inside a <CodeBlock>.');
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  CodeRenderer — the shiki highlight (shared by content + multi-file) */
/* ------------------------------------------------------------------ */

type CodeRendererProps = CodeBlockContextValue;

function CodeRenderer({
  code,
  language,
  html,
  showLineNumbers,
  scrollable,
  maxHeight,
  highlightLines,
}: CodeRendererProps) {
  const [rendered, setRendered] = useState<string | null>(html ?? null);

  useEffect(() => {
    injectCodeBlockStyles();
  }, []);

  const highlightKey = highlightLines?.join(',');
  useEffect(() => {
    if (html !== undefined) return;
    let cancelled = false;
    setRendered(null);
    renderCodeToHtml(code, language, highlightLines).then((h) => {
      if (!cancelled) setRendered(h);
    });
    return () => {
      cancelled = true;
    };
  }, [code, language, html, highlightKey]);

  return (
    <div
      className={cn(codeBlockBodyBase, scrollable && codeBlockBodyScrollableBase)}
      style={scrollable ? { maxHeight: `${maxHeight}px` } : undefined}
    >
      {rendered === null ? (
        <div className={codeBlockLoadingBase}>
          <div className={codeBlockSpinnerBase} />
        </div>
      ) : (
        <div
          dangerouslySetInnerHTML={{ __html: rendered }}
          className={cn(
            codeBlockContentBase,
            showLineNumbers && codeBlockLineNumbersBase,
            highlightLines?.length && codeBlockHighlightBase,
          )}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Composite API                                                       */
/* ------------------------------------------------------------------ */

export type CodeBlockProps = HTMLArkProps<'div'> &
  CodeBlockPropsBase & {
    /** Composite parts; when omitted, a default header + content is rendered. */
    children?: ReactNode;
  };

export function CodeBlock({
  code,
  language = 'tsx',
  filename,
  html,
  showLineNumbers = false,
  scrollable = false,
  maxHeight = 400,
  highlightLines,
  className,
  children,
  ...props
}: CodeBlockProps) {
  const ctx: CodeBlockContextValue = { code, language, html, showLineNumbers, scrollable, maxHeight, highlightLines };
  return (
    <CodeBlockContext.Provider value={ctx}>
      <ark.div data-code-block className={cn(codeBlockRootBase, className)} {...props}>
        {children ?? (
          <>
            <CodeBlockHeader>
              <CodeBlockTitle>{filename ?? language}</CodeBlockTitle>
              <div className="ml-auto">
                <CodeBlockCopyButton />
              </div>
            </CodeBlockHeader>
            <CodeBlockContent />
          </>
        )}
      </ark.div>
    </CodeBlockContext.Provider>
  );
}

export type CodeBlockHeaderProps = HTMLArkProps<'div'> & { children?: ReactNode };

export function CodeBlockHeader({ className, children, ...props }: CodeBlockHeaderProps) {
  return (
    <ark.div className={cn(codeBlockHeaderBase, className)} {...props}>
      {children}
    </ark.div>
  );
}

export type CodeBlockTitleProps = HTMLArkProps<'span'> & { children?: ReactNode };

export function CodeBlockTitle({ className, children, ...props }: CodeBlockTitleProps) {
  return (
    <ark.span className={cn(codeBlockTitleBase, className)} {...props}>
      {children}
    </ark.span>
  );
}

export type CodeBlockCopyButtonProps = HTMLArkProps<'div'> & { label?: string };

export function CodeBlockCopyButton({ label = 'Copy code', className, ...props }: CodeBlockCopyButtonProps) {
  const { code } = useCodeBlock();
  return (
    <ark.div className={className} {...props}>
      <CopyButton value={code} label={label} />
    </ark.div>
  );
}

export type CodeBlockContentProps = HTMLArkProps<'div'> & { html?: string };

export function CodeBlockContent({ className, html, ...props }: CodeBlockContentProps) {
  const ctx = useCodeBlock();
  return (
    <ark.div className={className} {...props}>
      <CodeRenderer {...ctx} html={html ?? ctx.html} />
    </ark.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Multi-file                                                          */
/* ------------------------------------------------------------------ */

export type MultiFileCodeBlockProps = HTMLArkProps<'div'> & {
  files: FileEntry[];
  showLineNumbers?: boolean;
  scrollable?: boolean;
  maxHeight?: number;
  className?: string;
};

export function MultiFileCodeBlock({
  files,
  showLineNumbers = false,
  scrollable = false,
  maxHeight = 400,
  className,
  ...props
}: MultiFileCodeBlockProps) {
  const [active, setActive] = useState(files[0]?.filename ?? '');
  const file = files.find((f) => f.filename === active) ?? files[0];

  useEffect(() => {
    if (!files.some((f) => f.filename === active)) {
      setActive(files[0]?.filename ?? '');
    }
  }, [files, active]);

  return (
    <ark.div data-code-block className={cn(codeBlockRootBase, className)} {...props}>
      <div className="flex items-center justify-between border-b bg-muted/50">
        <div role="tablist" aria-label="Files" className="flex overflow-x-auto no-scrollbar pl-1">
          {files.map((f) => (
            <button
              key={f.filename}
              role="tab"
              aria-selected={active === f.filename}
              onClick={() => setActive(f.filename)}
              className={cn(
                'h-10 shrink-0 border-b-2 px-3 font-mono text-xs transition-colors',
                active === f.filename
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              {f.filename}
            </button>
          ))}
        </div>
        {file ? (
          <div className="shrink-0 pr-3">
            <CopyButton value={file.code} label="Copy code" />
          </div>
        ) : null}
      </div>
      {file ? (
        <CodeRenderer
          code={file.code}
          language={file.language ?? 'tsx'}
          html={file.html}
          showLineNumbers={showLineNumbers}
          scrollable={scrollable}
          maxHeight={maxHeight}
        />
      ) : null}
    </ark.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Language tabs — dropdown selector, floating copy button             */
/* ------------------------------------------------------------------ */

export type LanguageTabsCodeBlockProps = HTMLArkProps<'div'> & {
  tabs: LanguageTab[];
  showLineNumbers?: boolean;
  scrollable?: boolean;
  maxHeight?: number;
  className?: string;
};

export function LanguageTabsCodeBlock({
  tabs,
  showLineNumbers = false,
  scrollable = false,
  maxHeight = 400,
  className,
  ...props
}: LanguageTabsCodeBlockProps) {
  const [active, setActive] = useState(tabs[0]?.label ?? '');
  const tab = tabs.find((t) => t.label === active) ?? tabs[0];

  useEffect(() => {
    if (!tabs.some((t) => t.label === active)) {
      setActive(tabs[0]?.label ?? '');
    }
  }, [tabs, active]);

  return (
    <ark.div data-code-block className={cn(codeBlockRootBase, className)} {...props}>
      <CodeBlockHeader>
        <CodeBlockTitle>{tab?.filename}</CodeBlockTitle>
        <div className="ml-auto">
          <Select
            items={tabs.map((t) => ({ value: t.label, label: t.label }))}
            value={[active]}
            onValueChange={(details) => setActive(details.value[0])}
            aria-label="Language"
          >
            <SelectTrigger size="sm" className="min-w-28 justify-between font-mono text-xs">
              <SelectValue />
              <SelectIndicator>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </SelectIndicator>
            </SelectTrigger>
            <SelectContent>
              {tabs.map((t) => (
                <SelectItem key={t.label} item={{ value: t.label, label: t.label }}>
                  <SelectItemText>{t.label}</SelectItemText>
                  <SelectItemIndicator>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </SelectItemIndicator>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CodeBlockHeader>
      {tab ? (
        <div className="relative">
          <CodeRenderer
            code={tab.code}
            language={tab.language ?? 'tsx'}
            html={tab.html}
            showLineNumbers={showLineNumbers}
            scrollable={scrollable}
            maxHeight={maxHeight}
          />
          <div className={codeBlockCopyFloatBase}>
            <CopyButton value={tab.code} label="Copy code" />
          </div>
        </div>
      ) : null}
    </ark.div>
  );
}
