/**
 * One-time port: bring the authored element doc pages + demos for this pack
 * out of the vanilla-breeze repo into this mini-site, rewriting asset paths.
 * Re-runnable. Requires the vanilla-breeze checkout as a sibling: ../../vanilla-breeze.
 */
import { mkdirSync, copyFileSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(here, '..');
const repoRoot = resolve(siteRoot, '..');
const VB = resolve(repoRoot, '../vanilla-breeze');
const PACK_JS = 'vb-project-planning.js', PACK_CSS = 'vb-project-planning.css';

const COMPONENTS = ['user-persona','user-story','user-journey','empathy-map','impact-effort','quadrant-grid','risk-register','traceability-matrix','burndown-chart','product-roadmap','kanban-board','story-map','review-surface','gantt-chart','work-item','adr-wc'];

if (!existsSync(VB)) { console.error(`! vanilla-breeze checkout not found at ${VB}`); process.exit(1); }

const ensure = (p) => mkdirSync(p, { recursive: true });
ensure(resolve(siteRoot, 'plugins'));
ensure(resolve(siteRoot, 'data'));
ensure(resolve(siteRoot, 'src/pages/elements'));
ensure(resolve(siteRoot, 'src/pages/demos'));

copyFileSync(resolve(VB, 'site/plugins/generate-api-tables.js'), resolve(siteRoot, 'plugins/generate-api-tables.js'));
copyFileSync(resolve(VB, 'site/src/_data/apiRegistry.js'), resolve(siteRoot, 'data/apiRegistry.js'));
console.log('✓ plugin + apiRegistry');

const DOCS = resolve(VB, 'site/src/pages/docs/elements/web-components');
const referencedDemos = new Set();
for (const c of COMPONENTS) {
  const srcFile = resolve(DOCS, `${c}.html`);
  if (!existsSync(srcFile)) { console.warn(`  ! no doc page for ${c}`); continue; }
  let html = readFileSync(srcFile, 'utf8');
  for (const m of html.matchAll(/\/docs\/examples\/demos\/([^"']+)/g)) referencedDemos.add(m[1]);
  html = html.replace(/\/docs\/examples\/demos\/([^"'\s#?]+)\.html/g, '/demos/$1/').replace(/\/docs\/examples\/demos\//g, '/demos/');
  writeFileSync(resolve(siteRoot, `src/pages/elements/${c}.html`), html);
}
console.log(`✓ ${COMPONENTS.length} element pages (referenced demos: ${referencedDemos.size})`);

const DEMOS = resolve(VB, 'demos/examples/demos');
let copied = 0, missing = [];
for (const rel of referencedDemos) {
  const from = resolve(DEMOS, rel);
  if (!existsSync(from)) { missing.push(rel); continue; }
  let html = readFileSync(from, 'utf8');
  html = html
    .replace(/\/src\/main\.css/g, '/assets/vendor/vanilla-breeze.css')
    .replace(/\/src\/main\.js/g, `/assets/pack/${PACK_JS}`);
  // ensure pack CSS + the drag-surface peer are loaded in demos
  if (!html.includes(`/assets/pack/${PACK_CSS}`)) {
    const inject = `/assets/vendor/vanilla-breeze.css`;
    html = html
      .replace(`${inject}" />`, `${inject}" />\n  <link rel="stylesheet" href="/assets/pack/${PACK_CSS}" />\n  <script type="module" src="/assets/vendor/drag-surface.js"></script>`)
      .replace(`${inject}">`, `${inject}">\n  <link rel="stylesheet" href="/assets/pack/${PACK_CSS}">\n  <script type="module" src="/assets/vendor/drag-surface.js"></script>`);
  }
  const outDir = resolve(siteRoot, 'src/pages/demos', dirname(rel));
  ensure(outDir);
  writeFileSync(resolve(siteRoot, 'src/pages/demos', rel), html);
  copied++;
}
console.log(`✓ demos copied: ${copied}${missing.length ? ` — missing (skipped): ${missing.join(', ')}` : ''}`);
console.log('Port complete.');
