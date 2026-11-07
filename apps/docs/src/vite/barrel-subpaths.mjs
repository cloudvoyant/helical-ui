// apps/docs/src/vite/barrel-subpaths.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const docsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

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

function parseSpecifier(raw, forceType = false) {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const isType = forceType || /^type\s+/.test(trimmed);
  const cleaned = trimmed.replace(/^type\s+/, '').trim();
  const parts = cleaned.match(/^(\w+)(?:\s+as\s+(\w+))?$/);
  if (!parts) return { raw: trimmed, isType, imported: null, local: null };
  return {
    raw: trimmed,
    isType,
    imported: parts[1],
    local: parts[2] || parts[1],
  };
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
      const spec = parseSpecifier(raw, Boolean(exportTypeKw));
      if (!spec || !spec.imported) continue;
      if (subMap && subMap.has(spec.imported)) {
        map.set(spec.local, subMap.get(spec.imported));
      } else {
        map.set(spec.local, {
          targetPath: targetFile,
          importDefault: isLocal && spec.imported === 'default',
          originalName: isLocal ? spec.imported : spec.local,
          isType: spec.isType,
        });
      }
    }
  }

  for (const m of src.matchAll(/export\s+(type\s+)?\{([^{}]*)\}(?!\s*from)/g)) {
    const isExportType = Boolean(m[1]);
    for (const raw of m[2].split(',')) {
      const spec = parseSpecifier(raw, isExportType);
      if (!spec || !spec.local || map.has(spec.local)) continue;
      map.set(spec.local, {
        targetPath: entryFile,
        importDefault: false,
        originalName: spec.local,
        isType: spec.isType,
      });
    }
  }

  for (const m of src.matchAll(/export\s+(const|let|var|function|class|type|interface|enum)\s+(\w+)/g)) {
    const [, kind, exported] = m;
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
    if (m[1].startsWith('.')) {
      parseBarrel(resolveLocalModule(dir, m[1]), map);
    }
  }

  return map;
}

function parseLucideSvelte(lucideDistDir) {
  const map = new Map();
  const addIcons = (file, regex) => {
    if (!fs.existsSync(file)) return;
    for (const m of fs.readFileSync(file, 'utf8').matchAll(regex)) {
      if (!map.has(m[1])) {
        map.set(m[1], {
          targetPath: path.join(lucideDistDir, 'icons', m[2]).split(path.sep).join('/'),
          importDefault: true,
          originalName: 'default',
          isType: false,
        });
      }
    }
  };
  addIcons(
    path.join(lucideDistDir, 'icons/index.js'),
    /export\s+\{\s*default\s+as\s+(\w+)\s*\}\s+from\s+['"]\.\/([^'"]+)['"]/g,
  );
  addIcons(
    path.join(lucideDistDir, 'aliases/aliases.js'),
    /default\s+as\s+(\w+)\s*\}\s+from\s+['"]\.\.\/icons\/([^'"]+)['"]/g,
  );
  return map;
}

/**
 * Rewrites static named imports from `@cloudvoyant/helical-{ui,react,svelte}` and
 * `lucide-svelte` to their concrete subpath modules so Vite and Rollup never pull
 * unrelated component modules or unused icons through barrel files.
 */
export function helicalBarrelSubpathPlugin() {
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
    handleHotUpdate({ file }) {
      if (file.endsWith('/index.ts')) {
        exportMaps = null;
      }
    },
    transform(code, id) {
      if (id.includes('?raw') || id.includes('node_modules')) return null;
      const cleanId = id.split('?')[0];
      if (!/\.(ts|tsx|svelte|astro|js|mjs)$/.test(cleanId)) return null;
      if (!code.includes('@cloudvoyant/helical-') && !code.includes('lucide-svelte')) return null;

      const maps = ensureMaps();
      let changed = false;

      const transformed = code.replace(
        /^[ \t]*(import|export)\s+(type\s+)?\{([^{}]*)\}\s+from\s+['"](@cloudvoyant\/helical-(?:ui|react|svelte)|lucide-svelte)['"]\s*;?/gm,
        (fullMatch, keyword, typeKw, specList, pkg) => {
          if (typeKw) return fullMatch;
          const pkgMap = maps[pkg];
          if (!pkgMap || pkgMap.size === 0) return fullMatch;

          const defaultLines = [];
          const namedByTarget = new Map();
          const passthroughSpecs = [];
          const typeSpecs = [];

          for (const raw of specList.split(',')) {
            const spec = parseSpecifier(raw);
            if (!spec) continue;
            if (spec.isType) {
              typeSpecs.push(spec.raw.replace(/^type\s+/, '').trim());
              continue;
            }
            if (!spec.imported) {
              passthroughSpecs.push(spec.raw);
              continue;
            }
            const entry = pkgMap.get(spec.imported);
            if (!entry) {
              passthroughSpecs.push(spec.raw);
              continue;
            }
            if (entry.isType) {
              typeSpecs.push(spec.imported === spec.local ? spec.imported : `${spec.imported} as ${spec.local}`);
              continue;
            }
            const normTarget = entry.targetPath.split(path.sep).join('/');
            if (entry.importDefault) {
              defaultLines.push(
                keyword === 'export'
                  ? `export { default as ${spec.local} } from '${normTarget}';`
                  : `import ${spec.local} from '${normTarget}';`,
              );
            } else {
              if (!namedByTarget.has(normTarget)) namedByTarget.set(normTarget, []);
              const outSpec = entry.originalName === spec.local ? spec.local : `${entry.originalName} as ${spec.local}`;
              namedByTarget.get(normTarget).push(outSpec);
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
