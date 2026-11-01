// apps/docs/astro.config.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

const docsRoot = path.dirname(fileURLToPath(import.meta.url));
const examplesRoot = path.join(docsRoot, 'src/components/examples');

const PREVIEW_FRAME_COMPONENTS = new Set(['sidebar', 'page']);
const SSR_EXAMPLES = new Set([
  'mermaid/prerendered',
  'latex/prerendered',
  'code-block/prerendered',
  'chart/prerendered',
  'editor/server-reader',
]);

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

function resolveLocalModule(dir, relSpec) {
  const base = path.resolve(dir, relSpec);
  for (const cand of [base, `${base}.ts`, `${base}.tsx`, `${base}.svelte`, path.join(base, 'index.ts')]) {
    if (fs.existsSync(cand) && fs.statSync(cand).isFile()) return cand;
  }
  return base;
}

function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
}

function parseBarrel(entryFile, map = new Map()) {
  if (!fs.existsSync(entryFile)) return map;
  const dir = path.dirname(entryFile);
  const src = stripComments(fs.readFileSync(entryFile, 'utf8'));

  for (const m of src.matchAll(/export\s+(type\s+)?\{([^{}]*)\}\s+from\s+['"]([^'"]+)['"]/g)) {
    const [, exportTypeKw, specList, fromSpec] = m;
    const isLocal = fromSpec.startsWith('.');
    const targetFile = isLocal ? resolveLocalModule(dir, fromSpec) : entryFile;
    const subMap = isLocal && targetFile.endsWith('/index.ts') ? parseBarrel(targetFile) : null;

    for (const raw of specList.split(',')) {
      const trimmed = raw.trim();
      if (!trimmed) continue;
      const isItemType = Boolean(exportTypeKw) || /^type\s+/.test(trimmed);
      const cleaned = trimmed.replace(/^type\s+/, '').trim();
      const parts = cleaned.match(/^(\w+)\s+as\s+(\w+)$/);
      const orig = parts ? parts[1] : cleaned;
      const exported = parts ? parts[2] : cleaned;

      if (subMap && subMap.has(orig)) {
        map.set(exported, subMap.get(orig));
      } else {
        map.set(exported, {
          targetPath: targetFile,
          importDefault: isLocal && orig === 'default',
          originalName: isLocal ? orig : exported,
          isType: isItemType,
        });
      }
    }
  }

  for (const m of src.matchAll(/export\s+(type\s+)?\{([^{}]*)\}(?!\s*from)/g)) {
    const isExportType = Boolean(m[1]);
    for (const raw of m[2].split(',')) {
      const trimmed = raw.trim();
      if (!trimmed) continue;
      const isItemType = isExportType || /^type\s+/.test(trimmed);
      const cleaned = trimmed.replace(/^type\s+/, '').trim();
      const parts = cleaned.match(/^(\w+)\s+as\s+(\w+)$/);
      const exported = parts ? parts[2] : cleaned;
      if (!map.has(exported)) {
        map.set(exported, {
          targetPath: entryFile,
          importDefault: false,
          originalName: exported,
          isType: isItemType,
        });
      }
    }
  }

  for (const m of src.matchAll(/export\s+(const|let|var|function|class|type|interface|enum)\s+(\w+)/g)) {
    const kind = m[1];
    const exported = m[2];
    if (!map.has(exported)) {
      map.set(exported, {
        targetPath: entryFile,
        importDefault: false,
        originalName: exported,
        isType: kind === 'type' || kind === 'interface',
      });
    }
  }

  for (const m of src.matchAll(/export\s+\*\s+from\s+['"]([^'"]+)['"]/g)) {
    const fromSpec = m[1];
    if (fromSpec.startsWith('.')) {
      const subFile = resolveLocalModule(dir, fromSpec);
      parseBarrel(subFile, map);
    }
  }

  return map;
}

function parseLucideSvelte(lucideDistDir) {
  const map = new Map();
  const iconsIndex = path.join(lucideDistDir, 'icons/index.js');
  if (fs.existsSync(iconsIndex)) {
    const src = fs.readFileSync(iconsIndex, 'utf8');
    for (const m of src.matchAll(/export\s+\{\s*default\s+as\s+(\w+)\s*\}\s+from\s+['"]\.\/([^'"]+)['"]/g)) {
      map.set(m[1], {
        targetPath: path.join(lucideDistDir, 'icons', m[2]).split(path.sep).join('/'),
        importDefault: true,
        originalName: 'default',
        isType: false,
      });
    }
  }
  const aliasesFile = path.join(lucideDistDir, 'aliases/aliases.js');
  if (fs.existsSync(aliasesFile)) {
    const src = fs.readFileSync(aliasesFile, 'utf8');
    for (const m of src.matchAll(/default\s+as\s+(\w+)\s*\}\s+from\s+['"]\.\.\/icons\/([^'"]+)['"]/g)) {
      if (!map.has(m[1])) {
        map.set(m[1], {
          targetPath: path.join(lucideDistDir, 'icons', m[2]).split(path.sep).join('/'),
          importDefault: true,
          originalName: 'default',
          isType: false,
        });
      }
    }
  }
  return map;
}

/**
 * Rewrites static named imports from `@cloudvoyant/helical-{ui,react,svelte}` and
 * `lucide-svelte` to their concrete subpath modules so Vite and Rollup never pull
 * unrelated component modules or unused icons through barrel files.
 */
function helicalBarrelSubpathPlugin() {
  let exportMaps = null;

  function ensureMaps() {
    if (exportMaps) return exportMaps;
    exportMaps = {
      '@cloudvoyant/helical-ui': parseBarrel(path.resolve(docsRoot, '../../libs/helical-ui/src/index.ts')),
      '@cloudvoyant/helical-react': parseBarrel(path.resolve(docsRoot, '../../libs/helical-react/src/index.ts')),
      '@cloudvoyant/helical-svelte': parseBarrel(path.resolve(docsRoot, '../../libs/helical-svelte/src/index.ts')),
      'lucide-svelte': parseLucideSvelte(path.resolve(docsRoot, 'node_modules/lucide-svelte/dist')),
    };
    return exportMaps;
  }

  return {
    name: 'helical-barrel-subpaths',
    enforce: 'pre',
    buildStart() {
      exportMaps = null;
      ensureMaps();
    },
    transform(code, id) {
      if (id.includes('?raw') || id.includes('node_modules')) return null;
      const cleanId = id.split('?')[0];
      if (!/\.(ts|tsx|svelte|astro|mdx|js|mjs)$/.test(cleanId)) return null;
      if (!code.includes('@cloudvoyant/helical-') && !code.includes('lucide-svelte')) return null;

      const maps = ensureMaps();
      let changed = false;

      const transformed = code.replace(
        /(import|export)\s+(type\s+)?\{([^{}]*)\}\s+from\s+['"](@cloudvoyant\/helical-(?:ui|react|svelte)|lucide-svelte)['"]\s*;?/g,
        (fullMatch, keyword, typeKw, specList, pkg) => {
          if (typeKw) return fullMatch;
          const pkgMap = maps[pkg];
          if (!pkgMap || pkgMap.size === 0) return fullMatch;

          const defaultLines = [];
          const namedByTarget = new Map();
          const passthroughSpecs = [];
          const typeSpecs = [];

          for (const raw of specList.split(',')) {
            const trimmed = raw.trim();
            if (!trimmed) continue;
            if (/^type\s+/.test(trimmed)) {
              typeSpecs.push(trimmed.replace(/^type\s+/, '').trim());
              continue;
            }
            const parts = trimmed.match(/^(\w+)(?:\s+as\s+(\w+))?$/);
            if (!parts) {
              passthroughSpecs.push(trimmed);
              continue;
            }
            const imported = parts[1];
            const local = parts[2] || imported;
            const entry = pkgMap.get(imported);
            if (!entry) {
              passthroughSpecs.push(trimmed);
              continue;
            }
            if (entry.isType) {
              typeSpecs.push(imported === local ? imported : `${imported} as ${local}`);
              continue;
            }
            const normTarget = entry.targetPath.split(path.sep).join('/');
            if (entry.importDefault) {
              if (keyword === 'export') {
                defaultLines.push(`export { default as ${local} } from '${normTarget}';`);
              } else {
                defaultLines.push(`import ${local} from '${normTarget}';`);
              }
            } else {
              if (!namedByTarget.has(normTarget)) namedByTarget.set(normTarget, []);
              const spec = entry.originalName === local ? local : `${entry.originalName} as ${local}`;
              namedByTarget.get(normTarget).push(spec);
            }
          }

          if (defaultLines.length === 0 && namedByTarget.size === 0) {
            return fullMatch;
          }

          changed = true;
          const outLines = [...defaultLines];
          for (const [target, specs] of namedByTarget.entries()) {
            outLines.push(`${keyword} { ${specs.join(', ')} } from '${target}';`);
          }
          if (typeSpecs.length > 0) {
            outLines.push(`${keyword} type { ${typeSpecs.join(', ')} } from '${pkg}';`);
          }
          if (passthroughSpecs.length > 0) {
            outLines.push(`${keyword} { ${passthroughSpecs.join(', ')} } from '${pkg}';`);
          }
          return outLines.join('\n');
        },
      );

      const withIslandPaths = transformed.replace(
        /("client:component-path":\s*["'])([^"']+)(["']\s*,\s*"client:component-export":\s*["'])(\w+)(["'])/g,
        (fullMatch, prefix, compPath, mid, exportName, suffix) => {
          let pkgMap = null;
          if (compPath === '@cloudvoyant/helical-react' || compPath.endsWith('/libs/helical-react/src/index.ts')) {
            pkgMap = maps['@cloudvoyant/helical-react'];
          } else if (
            compPath === '@cloudvoyant/helical-svelte' ||
            compPath.endsWith('/libs/helical-svelte/src/index.ts')
          ) {
            pkgMap = maps['@cloudvoyant/helical-svelte'];
          }
          const entry = pkgMap?.get(exportName);
          if (!entry) return fullMatch;
          changed = true;
          const normTarget = entry.targetPath.split(path.sep).join('/');
          const normExport = entry.importDefault ? 'default' : entry.originalName;
          const astroMeta = this.getModuleInfo?.(id)?.meta?.astro;
          if (astroMeta) {
            for (const list of [astroMeta.hydratedComponents, astroMeta.clientOnlyComponents]) {
              if (!Array.isArray(list)) continue;
              for (const item of list) {
                if (item.exportName === exportName && item.resolvedPath === compPath) {
                  item.resolvedPath = normTarget;
                  item.exportName = normExport;
                }
              }
            }
          }
          return `${prefix}${normTarget}${mid}${normExport}${suffix}`;
        },
      );

      if (!changed) return null;
      return {
        code: withIslandPaths,
        map: null,
      };
    },
  };
}

/**
 * Expands `<Examples>` and `<Demo>` in `.mdx` files before `@astrojs/mdx` runs so
 * each page only imports and hydrates its own React/Svelte example islands via
 * `<Demo>` named slots (`slot="react"` and `slot="svelte"`).
 */
function helicalMdxDemoPlugin() {
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
          if (PREVIEW_FRAME_COMPONENTS.has(component)) {
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
          if (SSR_EXAMPLES.has(exampleKey)) {
            reactDirective = '';
            svelteDirective = '';
          } else if (component === 'navbar') {
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

export default defineConfig({
  site: 'https://cloudvoyant.github.io',
  base: '/helical-ui/',
  integrations: [react(), svelte(), mdx()],
  devToolbar: {
    enabled: false,
  },
  // Make `astro check` type-check .ts/.tsx files too (it only audits .astro by default)
  check: {
    ts: true,
  },
  vite: {
    plugins: [helicalMdxDemoPlugin(), helicalBarrelSubpathPlugin(), tailwindcss()],
    resolve: {
      alias: [
        // Serve workspace packages from source in dev so edits to libs/* hot-reload
        // instead of requiring a rebuild (the package exports map points at dist/).
        // Exact-match anchors keep subpath imports (@cloudvoyant/helical-ui/theme.css, ...)
        // resolving through the exports map, not through the JS alias.
        {
          find: /^@cloudvoyant\/helical-ui$/,
          replacement: new URL('../../libs/helical-ui/src/index.ts', import.meta.url).pathname,
        },
        {
          find: /^@cloudvoyant\/helical-react$/,
          replacement: new URL('../../libs/helical-react/src/index.ts', import.meta.url).pathname,
        },
        {
          find: /^@cloudvoyant\/helical-svelte$/,
          replacement: new URL('../../libs/helical-svelte/src/index.ts', import.meta.url).pathname,
        },
      ],
    },
    optimizeDeps: {
      entries: [
        'src/**/*.{astro,tsx,ts,svelte}',
        '../../libs/helical-ui/src/**/*.ts',
        '../../libs/helical-react/src/**/*.{ts,tsx}',
        '../../libs/helical-svelte/src/**/*.{ts,svelte}',
      ],
      include: [
        'lucide-react',
        'katex',
        '@cloudvoyant/helical-ui > @tanstack/charts',
        '@cloudvoyant/helical-ui > lowlight',
        '@cloudvoyant/helical-ui > @tiptap/core',
        '@cloudvoyant/helical-ui > @tiptap/starter-kit',
        '@cloudvoyant/helical-ui > @tiptap/extension-code-block-lowlight',
        '@cloudvoyant/helical-ui > @tiptap/extension-highlight',
        '@cloudvoyant/helical-ui > @tiptap/extension-link',
        '@cloudvoyant/helical-ui > @tiptap/extension-placeholder',
        '@cloudvoyant/helical-ui > @tiptap/extension-task-item',
        '@cloudvoyant/helical-ui > @tiptap/extension-task-list',
        '@cloudvoyant/helical-ui > @tiptap/extension-text-align',
        '@cloudvoyant/helical-ui > @tiptap/extension-typography',
        '@cloudvoyant/helical-ui > @tiptap/extension-underline',
        '@cloudvoyant/helical-react > @ark-ui/react',
      ],
      // Workspace packages resolve to source in dev (see alias above); don't let
      // Vite pre-bundle and cache a stale copy (new named exports then throw
      // "does not provide an export named ..." until a dev-server restart).
      exclude: ['@cloudvoyant/helical-ui', '@cloudvoyant/helical-react', '@cloudvoyant/helical-svelte'],
    },
  },
  redirects: {
    '/docs': '/general/introduction',
    '/docs/general/introduction': '/general/introduction',
    '/docs/general/installation': '/general/installation',
    '/docs/general/theming': '/general/theming',
    '/docs/components/button': '/components/button',
    '/docs/components/toggle-button': '/components/toggle-button',
    '/docs/components/badge': '/components/badge',
    '/docs/components/container': '/components/layout',
    '/docs/components/row': '/components/layout',
    '/docs/components/col': '/components/layout',
    '/docs/components/layout': '/components/layout',
    '/docs/components/stack': '/components/stack',
    '/docs/components/scroll': '/components/scroll',
    '/docs/components/splitter': '/components/splitter',
    '/docs/components/nav-menu': '/components/navbar',
    '/docs/components/tabs': '/components/tabs',
    '/docs/components/pagination': '/components/pagination',
    '/docs/components/navbar': '/components/navbar',
    '/docs/components/mermaid': '/components/mermaid',
    '/docs/components/notice': '/components/notice',
    '/docs/components/figure': '/components/figure',
    '/docs/components/hint': '/components/reveal',
    '/docs/components/reveal': '/components/reveal',
    '/docs/components/math': '/components/latex',
    '/docs/components/latex': '/components/latex',
    '/docs/components/code-block': '/components/code-block',
    '/docs/components/manim': '/components/manim',
    '/docs/components/youtube': '/components/youtube',
    '/docs/components/chart': '/components/chart',
    '/docs/components/questions': '/components/questions',
    '/docs/components/assessment': '/components/quiz',
    '/docs/components/quiz': '/components/quiz',
    '/docs/components/prev-next': '/components/prev-next',
  },
});
