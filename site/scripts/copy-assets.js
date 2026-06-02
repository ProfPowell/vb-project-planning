/**
 * Copy build-time assets into src/pages/assets/ (the served root):
 *   - Vanilla Breeze tokens/themes CSS (devDependency) — styling + theme picker
 *   - the <drag-surface> peer component (kanban/quadrant/impact-effort/story-map)
 *   - the pack's own dist bundle (../dist) — the components this site documents
 *   - companion components used by the docs (browser-window, code-block)
 */
import { mkdirSync, copyFileSync, existsSync, readFileSync, cpSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(here, '..');
const repoRoot = resolve(siteRoot, '..');
const nm = resolve(siteRoot, 'node_modules');
const vendor = resolve(siteRoot, 'src/pages/assets/vendor');
const packDir = resolve(siteRoot, 'src/pages/assets/pack');
mkdirSync(vendor, { recursive: true });
mkdirSync(packDir, { recursive: true });

const cp = (from, to) => {
  if (!existsSync(from)) { console.warn(`  ! missing: ${from}`); return false; }
  copyFileSync(from, to);
  console.log(`  ✓ ${to.replace(siteRoot + '/', '')}`);
  return true;
};
function pkgMain(pkg) {
  const pj = JSON.parse(readFileSync(resolve(nm, pkg, 'package.json'), 'utf8'));
  const m = pj.module || pj.main || (pj.exports && (pj.exports['.']?.import || pj.exports['.']?.default || pj.exports['.']));
  return resolve(nm, pkg, m);
}

console.log('Copying Vanilla Breeze assets…');
cp(resolve(nm, 'vanilla-breeze/dist/cdn/vanilla-breeze.css'), resolve(vendor, 'vanilla-breeze.css'));
// Real VB theme picker (standalone, conflict-free)
cp(resolve(nm, 'vanilla-breeze/dist/cdn/components/theme-picker.js'), resolve(vendor, 'vb-theme-picker.js'));
// <drag-surface> peer — standalone per-component CDN file (defines only `drag-surface`,
// so no conflict with the pack bundle's elements).
cp(resolve(nm, 'vanilla-breeze/dist/cdn/components/drag-surface.js'), resolve(vendor, 'drag-surface.js'));

console.log('Copying VB themes catalog…');
const themesTo = resolve(siteRoot, 'src/pages/cdn/themes');
mkdirSync(themesTo, { recursive: true });
cpSync(resolve(nm, 'vanilla-breeze/dist/cdn/themes'), themesTo, { recursive: true });
console.log('  ✓ src/pages/cdn/themes (' + readdirSync(themesTo).length + ' files)');

console.log('Copying pack bundle…');
cp(resolve(repoRoot, 'dist/vb-project-planning.js'), resolve(packDir, 'vb-project-planning.js'));
cp(resolve(repoRoot, 'dist/vb-project-planning.css'), resolve(packDir, 'vb-project-planning.css'));

console.log('Copying companion components (demos + source display)…');
try { cp(pkgMain('@profpowell/browser-window'), resolve(vendor, 'browser-window.js')); } catch (e) { console.warn('  ! browser-window:', e.message); }
try { cp(pkgMain('@profpowell/code-block'), resolve(vendor, 'code-block.js')); } catch (e) { console.warn('  ! code-block:', e.message); }

console.log('Assets copied.');
