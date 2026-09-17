import { describe, it, expect } from 'vitest';
import { Editor, getSchema } from '@tiptap/core';
import {
  buildExtensions,
  createInternalMention,
  createLinkPreview,
  createUrlMention,
  defaultListboxFilter,
  slashCommands,
  type MentionItem,
} from '@cloudvoyant/helical-ui';

// Node views are never instantiated by these assertions (no DOM node views are created), so
// inert factories are sufficient and keep the test framework-free.
const noopNodeView = () => () => ({}) as never;
const nodeViews = {
  image: noopNodeView,
  urlMention: noopNodeView,
  linkPreview: noopNodeView,
  codeBlock: noopNodeView,
};

describe('editor extension layer', () => {
  it('builds a full extension set without a framework renderer', () => {
    const extensions = buildExtensions({ nodeViews });
    expect(extensions.length).toBeGreaterThan(10);
  });

  it('wires title enforcement and the supported rich-block schema', () => {
    const extensions = buildExtensions({ nodeViews });
    const extensionNames = extensions.map((extension) => extension.name);
    expect(extensionNames).toEqual(expect.arrayContaining(['heading', 'titleHeading', 'exitHeading', 'notice']));
    expect(extensionNames).not.toEqual(expect.arrayContaining(['tableKit', 'mermaidDiagram', 'emoji']));

    const schema = getSchema(extensions);
    expect(Object.keys(schema.nodes)).toEqual(expect.arrayContaining(['blockquote', 'notice']));
    expect(Object.keys(schema.nodes)).not.toEqual(expect.arrayContaining(['table', 'mermaidDiagram']));
  });

  it('allows compact editors to disable the required title', () => {
    const extensionNames = buildExtensions({ nodeViews, enforceTitle: false }).map((extension) => extension.name);
    expect(extensionNames).not.toEqual(expect.arrayContaining(['titleHeading', 'exitHeading']));
  });

  // NOTE: H1 *enforcement* is not asserted here. titleHeading works via ProseMirror's
  // `appendTransaction`, which needs a dispatched transaction on a real DOM view; a headless
  // editor neither fires it from an empty dispatch nor allows insertContent (no selection).
  // Enforcement is covered end-to-end by apps/docs/e2e/editor.spec.ts, which passes.

  it('maps slash Heading 1–4 to h2–h5 and omits unsupported post linking', () => {
    const suggestion = (
      slashCommands.options as unknown as {
        suggestion: {
          items: (args: { query: string }) => Array<{
            title: string;
            command: (args: { editor: unknown; range: { from: number; to: number } }) => void;
          }>;
        };
      }
    ).suggestion;
    const commands = suggestion.items({ query: '' });
    expect(commands.map((command) => command.title)).toEqual(
      expect.arrayContaining(['Heading 1', 'Heading 2', 'Heading 3', 'Heading 4', 'Quote', 'Notice', 'YouTube']),
    );
    expect(commands.map((command) => command.title)).not.toEqual(
      expect.arrayContaining(['Link Post/Series', 'Table', 'Mermaid']),
    );

    const levels: number[] = [];
    const chain = {
      focus: () => chain,
      deleteRange: () => chain,
      setNode: (_name: string, attrs: { level: number }) => {
        levels.push(attrs.level);
        return chain;
      },
      run: () => true,
    };
    const editor = { chain: () => chain };

    for (const title of ['Heading 1', 'Heading 2', 'Heading 3', 'Heading 4']) {
      commands.find((command) => command.title === title)?.command({ editor, range: { from: 1, to: 2 } });
    }
    expect(levels).toEqual([2, 3, 4, 5]);
  });

  it('round-trips seed JSON for autosave and prepopulation', () => {
    const seed = {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'Title' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Body text' }] },
      ],
    };
    const editor = new Editor({ extensions: buildExtensions({ nodeViews }), content: seed });
    const json = editor.getJSON();
    expect(JSON.stringify(json)).toContain('Title');
    expect(JSON.stringify(json)).toContain('Body text');
    editor.destroy();
  });

  describe('injectable seams', () => {
    it('routes mention search through the injected mentionSource', async () => {
      const queries: string[] = [];
      const extension = createInternalMention({
        mentionSource: async (query: string) => {
          queries.push(query);
          return [{ id: '1', label: 'Ada Lovelace', type: 'user' }];
        },
        render: () => ({}),
      });

      // SAFETY: Tiptap's MentionOptions types `suggestion.items` with a full props bag
      // ({ query, editor, signal }); this test only exercises the query path, so narrow through
      // `unknown` rather than fabricating an editor instance.
      const suggestion = (
        extension.options as unknown as {
          suggestion: { items: (args: { query: string }) => Promise<MentionItem[]> };
        }
      ).suggestion;

      const items = await suggestion.items({ query: 'ad' });
      expect(queries).toEqual(['ad']);
      expect(items).toHaveLength(1);
      expect(items[0]?.label).toBe('Ada Lovelace');
    });

    it('returns no mentions when no source is supplied (no hardcoded endpoint)', async () => {
      const extension = createInternalMention({ render: () => ({}) });
      // SAFETY: same narrow-through-`unknown` as above.
      const suggestion = (
        extension.options as unknown as {
          suggestion: { items: (args: { query: string }) => Promise<MentionItem[]> };
        }
      ).suggestion;
      await expect(suggestion.items({ query: 'anything' })).resolves.toEqual([]);
    });

    it('honours the injected hrefBuilder for internal-mention links', () => {
      const extension = createInternalMention({
        hrefBuilder: (item: MentionItem) => `/custom/${item.id}`,
        render: () => ({}),
      });

      // renderHTML is the seam's consumer. Tiptap exposes it on the node spec rather than as a
      // plain method, so read it off the extension's config and drive it directly.
      const nodeConfig = (
        extension as unknown as {
          config: {
            renderHTML?: (args: {
              node: { attrs: Record<string, unknown> };
              HTMLAttributes: Record<string, unknown>;
            }) => unknown;
          };
        }
      ).config;
      expect(nodeConfig.renderHTML).toBeTypeOf('function');

      const rendered = nodeConfig.renderHTML?.({
        node: { attrs: { id: '42', label: 'A Post', type: 'post', seriesId: '7' } },
        HTMLAttributes: {},
      }) as [string, Record<string, unknown>, string];

      expect(rendered[1].href).toBe('/custom/42');
    });

    it('falls back to the source /read/... path when no hrefBuilder is given', () => {
      const extension = createInternalMention({ render: () => ({}) });
      const nodeConfig = (
        extension as unknown as {
          config: {
            renderHTML?: (args: {
              node: { attrs: Record<string, unknown> };
              HTMLAttributes: Record<string, unknown>;
            }) => unknown;
          };
        }
      ).config;

      const rendered = nodeConfig.renderHTML?.({
        node: { attrs: { id: '42', label: 'A Post', type: 'post', seriesId: '7' } },
        HTMLAttributes: {},
      }) as [string, Record<string, unknown>, string];

      // The source editor's shape: /read/{seriesId}?post={id} for posts.
      expect(rendered[1].href).toBe('/read/7?post=42');
    });
  });
});

describe('defaultListboxFilter (shared helper)', () => {
  it('matches case-insensitively on the label', () => {
    expect(defaultListboxFilter({ value: 'a', label: 'Apple' }, 'app')).toBe(true);
    expect(defaultListboxFilter({ value: 'a', label: 'Apple' }, 'APP')).toBe(true);
    expect(defaultListboxFilter({ value: 'a', label: 'Apple' }, 'banana')).toBe(false);
  });

  it('passes everything through for an empty query', () => {
    expect(defaultListboxFilter({ value: 'a', label: 'Apple' }, '')).toBe(true);
  });
});

// The static Reader consumes renderHTML via dangerouslySetInnerHTML / {@html}, so text that
// reaches an href or an iframe src is an in-origin execution sink. These assertions drive
// renderHTML directly (DOM-free) and pin both halves of the fix: dangerous URL schemes are
// dropped, and content is emitted as child nodes rather than an `innerHTML` attribute (which
// ProseMirror serializes literally, leaving the pill/card empty).
describe('editor link safety (renderHTML)', () => {
  const inertNodeView = () => () => ({}) as never;

  type Rendered = [string, Record<string, unknown>, ...unknown[]];
  type RenderHTML = (args: {
    node: { attrs: Record<string, unknown> };
    HTMLAttributes: Record<string, unknown>;
  }) => unknown;

  const render = (extension: unknown, attrs: Record<string, unknown>): Rendered => {
    const config = (extension as { config: { renderHTML?: RenderHTML } }).config;
    expect(config.renderHTML).toBeTypeOf('function');
    return config.renderHTML?.({ node: { attrs }, HTMLAttributes: attrs }) as Rendered;
  };

  // Depth-first search for a render-spec node by tag, so nested specs (the embed iframe) can
  // be asserted without hardcoding the wrapper shape.
  const findTag = (spec: unknown, tag: string): [string, Record<string, unknown>, ...unknown[]] | undefined => {
    if (!Array.isArray(spec)) return undefined;
    if (spec[0] === tag) return spec as [string, Record<string, unknown>, ...unknown[]];
    for (const child of spec.slice(1)) {
      const found = findTag(child, tag);
      if (found) return found;
    }
    return undefined;
  };

  // Content strings of a render spec: skips index 0 (the tag) and index 1 (the attributes)
  // and recurses into child specs. Reachable text proves the body is real children — it is
  // unreachable when the body is stuffed into an `innerHTML` attribute string.
  const collectText = (spec: unknown): string[] => {
    if (!Array.isArray(spec)) return [];
    return spec.slice(2).flatMap((child) => (typeof child === 'string' ? [child] : collectText(child)));
  };

  describe('url-mention pill', () => {
    it('drops a javascript: href', () => {
      const [, attrs] = render(createUrlMention(inertNodeView), {
        url: 'javascript:alert(1)',
        title: 'Evil',
      });
      expect(attrs.href).toBe('');
    });

    it('drops a data: href', () => {
      const [, attrs] = render(createUrlMention(inertNodeView), {
        url: 'data:text/html,<script>alert(1)</script>',
        title: 'Evil',
      });
      expect(attrs.href).toBe('');
    });

    it('keeps an https href', () => {
      const [, attrs] = render(createUrlMention(inertNodeView), {
        url: 'https://example.com/a',
        title: 'Example',
      });
      expect(attrs.href).toBe('https://example.com/a');
    });

    it('emits the favicon and title as children, not an innerHTML attribute', () => {
      const rendered = render(createUrlMention(inertNodeView), {
        url: 'https://example.com',
        title: 'Example',
      });
      expect(rendered[1]).not.toHaveProperty('innerHTML');
      // favicon fallback glyph + title span
      expect(rendered.length).toBe(4);
      const titleSpan = findTag(rendered, 'span');
      expect(titleSpan?.[2]).toBe('Example');
    });
  });

  describe('link-preview', () => {
    it('drops a javascript: src on an embed iframe', () => {
      const rendered = render(createLinkPreview(inertNodeView), {
        url: 'javascript:alert(1)',
        type: 'embed',
      });
      expect(findTag(rendered, 'iframe')?.[1].src).toBe('');
    });

    it('keeps an https src on an embed iframe', () => {
      const rendered = render(createLinkPreview(inertNodeView), {
        url: 'https://example.com/embed',
        type: 'embed',
      });
      expect(findTag(rendered, 'iframe')?.[1].src).toBe('https://example.com/embed');
    });

    it('converts a YouTube watch URL to a privacy-enhanced embed URL', () => {
      const rendered = render(createLinkPreview(inertNodeView), {
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        type: 'embed',
      });
      expect(findTag(rendered, 'iframe')?.[1].src).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
    });

    it('drops a javascript: href on a bookmark card and renders its body as children', () => {
      const rendered = render(createLinkPreview(inertNodeView), {
        url: 'javascript:alert(1)',
        title: 'Evil',
        description: 'A card',
        type: 'bookmark',
      });
      const anchor = findTag(rendered, 'a');
      expect(anchor?.[1].href).toBe('');
      expect(anchor?.[1]).not.toHaveProperty('innerHTML');
      expect(collectText(rendered)).toEqual(expect.arrayContaining(['Evil', 'A card']));
    });
  });
});
