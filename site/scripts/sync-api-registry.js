/**
 * Overlay this pack's own api.json manifests onto site/data/apiRegistry.js.
 *
 * The registry was first copied from the vanilla-breeze repo (see
 * port-from-vb.js), so edits to src/web-components/<name>/api.json never
 * reached the {{ attributeTable() }} / {{ eventsTable() }} macros on the doc
 * pages. Running this in prebuild keeps the pack's entries in step with
 * their manifests; entries for other VB elements are left untouched.
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(here, '..');
const repoRoot = resolve(siteRoot, '..');
const registryFile = resolve(siteRoot, 'data/apiRegistry.js');
const componentsDir = resolve(repoRoot, 'src/web-components');

const { default: registry } = await import(pathToFileURL(registryFile).href);

const changed = [];
for (const name of readdirSync(componentsDir)) {
  const manifest = resolve(componentsDir, name, 'api.json');
  if (!existsSync(manifest)) continue;
  const api = JSON.parse(readFileSync(manifest, 'utf8'));
  const key = api.element || name;
  if (JSON.stringify(registry[key]) !== JSON.stringify(api)) {
    registry[key] = api;
    changed.push(key);
  }
}

if (changed.length) {
  const out = `// @generated from api.json manifests — do not edit by hand\nexport default ${JSON.stringify(registry, null, 2)};\n`;
  writeFileSync(registryFile, out);
  console.log(`  ✓ apiRegistry synced: ${changed.join(', ')}`);
} else {
  console.log('  ✓ apiRegistry already in sync');
}
