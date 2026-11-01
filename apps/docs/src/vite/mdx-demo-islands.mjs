// apps/docs/src/vite/mdx-demo-islands.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const docsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const examplesRoot = path.join(docsRoot, 'src/components/examples');

const DEFAULT_PREVIEW_FRAME_COMPONENTS = ['sidebar', 'page'];
const DEFAULT_SSR_EXAMPLES = [
  'mermaid/prerendered',
  'latex/prerendered',
  'code-block/prerendered',
  'chart/prerendered',
  'editor/server-reader',
];
const DEFAULT_CLIENT_ONLY_COMPONENTS = ['navbar'];

function titleFromId(id) {
  return id
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

function listExampleIds(component) {
  const compDir = path.join(examplesRoot, component);
  if (!fs.existsSync(compDir)) return [];
  return fs
    .readdirSync(compDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(compDir, entry.name, 'react.tsx')))
    .map((entry) => entry.name)
    .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

function toPosixRelative(fromDir, targetPath) {
  let rel = path.relative(fromDir, targetPath).split(path.sep).join('/');
  if (!rel.startsWith('.')) rel = `./${rel}`;
  return rel;
}

/**
 * Expands `<Examples>` and `<Demo>` in `.mdx` files before `@astrojs/mdx` runs so
 * each page only imports and hydrates its own React/Svelte example islands via
 * `<Demo>` named slots (`slot="react"` and `slot="svelte"`).
 *
 * @param {object} [options]
 * @param {Iterable<string>} [options.previewFrameComponents] Components rendered via `<PreviewFrame>` iframes rather than inline slots.
 * @param {Iterable<string>} [options.ssrExamples] `<component>/<example>` keys rendered strictly on the server without `client:*` hydration.
 * @param {Iterable<string>} [options.clientOnlyComponents] Components hydrated with `client:only` instead of `client:load`.
 */
export function helicalMdxDemoPlugin({
  previewFrameComponents = DEFAULT_PREVIEW_FRAME_COMPONENTS,
  ssrExamples = DEFAULT_SSR_EXAMPLES,
  clientOnlyComponents = DEFAULT_CLIENT_ONLY_COMPONENTS,
} = {}) {
  const previewFrameSet = new Set(previewFrameComponents);
  const ssrExampleSet = new Set(ssrExamples);
  const clientOnlySet = new Set(clientOnlyComponents);

  return {
    name: 'helical-mdx-demo-islands',
    enforce: 'pre',
    transform(code, id) {
      const cleanId = id.split('?')[0];
      if (!cleanId.endsWith('.mdx')) return null;

      let transformed = code.replace(
        /<Examples\s+component="([^"]+)"(?:\s+exclude=(?:"([^"]+)"|\{\[([^\]]*)\]\}))?(?:\s+order=\{\[([^\]]*)\]\})?\s*\/>/g,
        (_match, component, singleExclude, arrayExclude, arrayOrder) => {
          const excluded = new Set();
          if (singleExclude) {
            excluded.add(singleExclude);
          } else if (arrayExclude) {
            for (const m of arrayExclude.matchAll(/['"]([^'"]+)['"]/g)) {
              excluded.add(m[1]);
            }
          }
          const order = [];
          if (arrayOrder) {
            for (const m of arrayOrder.matchAll(/['"]([^'"]+)['"]/g)) {
              order.push(m[1]);
            }
          }
          const entries = listExampleIds(component)
            .filter((exampleId) => !excluded.has(exampleId))
            .map((exampleId) => ({ id: exampleId, title: titleFromId(exampleId) }));

          if (order.length > 0) {
            const rank = new Map(order.map((id, i) => [id, i]));
            entries.sort((a, b) => {
              const ra = rank.has(a.id) ? rank.get(a.id) : order.length;
              const rb = rank.has(b.id) ? rank.get(b.id) : order.length;
              return ra !== rb ? ra - rb : a.id.localeCompare(b.id);
            });
          }

          const sections = entries
            .map(
              (entry) =>
                `  <section class="flex flex-col gap-3">\n    <h3 class="text-lg font-semibold tracking-tight">${entry.title}</h3>\n    <Demo component="${component}" example="${entry.id}" />\n  </section>`,
            )
            .join('\n');

          return `<div class="flex flex-col gap-10">\n${sections}\n</div>`;
        },
      );

      const mdxDir = path.dirname(cleanId);
      const imports = new Map();

      transformed = transformed.replace(
        /<Demo\s+component="([^"]+)"\s+example="([^"]+)"\s*\/>/g,
        (fullMatch, component, example) => {
          if (previewFrameSet.has(component)) {
            return fullMatch;
          }

          const reactFile = path.join(examplesRoot, component, example, 'react.tsx');
          const svelteFile = path.join(examplesRoot, component, example, 'svelte.svelte');
          if (!fs.existsSync(reactFile) || !fs.existsSync(svelteFile)) {
            return fullMatch;
          }

          const safeKey = `${component}_${example}`.replace(/[^a-zA-Z0-9_]/g, '_');
          const reactIdent = `_R_${safeKey}`;
          const svelteIdent = `_S_${safeKey}`;

          imports.set(reactIdent, toPosixRelative(mdxDir, reactFile));
          imports.set(svelteIdent, toPosixRelative(mdxDir, svelteFile));

          const exampleKey = `${component}/${example}`;
          let reactDirective = ' client:load';
          let svelteDirective = ' client:load';
          if (ssrExampleSet.has(exampleKey)) {
            reactDirective = '';
            svelteDirective = '';
          } else if (clientOnlySet.has(component)) {
            reactDirective = ' client:only="react"';
            svelteDirective = ' client:only="svelte"';
          }

          return `<Demo component="${component}" example="${example}">\n  <${reactIdent} slot="react"${reactDirective} />\n  <${svelteIdent} slot="svelte"${svelteDirective} />\n</Demo>`;
        },
      );

      if (imports.size === 0 && transformed === code) {
        return null;
      }

      if (imports.size > 0) {
        const importLines = Array.from(imports.entries())
          .map(([ident, relPath]) => `import ${ident} from '${relPath}';`)
          .join('\n');
        transformed = transformed.replace(/^(---\r?\n[\s\S]*?\r?\n---\r?\n)/, `$1${importLines}\n`);
      }

      return {
        code: transformed,
        map: null,
      };
    },
  };
}
