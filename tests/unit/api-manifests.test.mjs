/**
 * Every component's api.json must (1) match schemas/api.schema.json and
 * (2) agree with the component's code: the registered tag, the events it
 * dispatches, and the attributes it observes. The docs site renders its
 * attribute and event tables from these manifests, so drift here is drift
 * in the published docs.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const componentsDir = resolve(root, 'src/web-components');
const schema = JSON.parse(readFileSync(resolve(root, 'schemas/api.schema.json'), 'utf8'));

/** Minimal JSON Schema subset: type, required, properties, additionalProperties:false, enum, pattern, items, minLength. */
function validate(value, sch, path = '$', errors = []) {
  if (sch.enum && !sch.enum.includes(value)) errors.push(`${path}: ${JSON.stringify(value)} not in ${JSON.stringify(sch.enum)}`);
  const t = sch.type;
  if (t === 'object') {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) { errors.push(`${path}: expected object`); return errors; }
    for (const k of sch.required ?? []) if (!(k in value)) errors.push(`${path}: missing "${k}"`);
    for (const [k, v] of Object.entries(value)) {
      const ps = sch.properties?.[k];
      if (ps) validate(v, ps, `${path}.${k}`, errors);
      else if (sch.additionalProperties === false) errors.push(`${path}: unexpected "${k}"`);
    }
  } else if (t === 'array') {
    if (!Array.isArray(value)) { errors.push(`${path}: expected array`); return errors; }
    value.forEach((v, i) => sch.items && validate(v, sch.items, `${path}[${i}]`, errors));
  } else if (t === 'string') {
    if (typeof value !== 'string') errors.push(`${path}: expected string`);
    else {
      if (sch.pattern && !new RegExp(sch.pattern).test(value)) errors.push(`${path}: "${value}" !~ /${sch.pattern}/`);
      if (sch.minLength && value.length < sch.minLength) errors.push(`${path}: empty`);
    }
  } else if (t === 'boolean' && typeof value !== 'boolean') errors.push(`${path}: expected boolean`);
  return errors;
}

const components = readdirSync(componentsDir)
  .filter((c) => existsSync(resolve(componentsDir, c, 'api.json')));

/** All JS in the component's folder (logic + helpers), plus shared bases it may inherit dispatches from. */
function sourcesFor(c) {
  const dir = resolve(componentsDir, c);
  return readdirSync(dir).filter((f) => f.endsWith('.js'))
    .map((f) => readFileSync(resolve(dir, f), 'utf8')).join('\n');
}
const sharedSources = [
  resolve(root, 'src/lib/vb-element.js'),
  resolve(root, 'src/lib/vb-collection.js'),
  resolve(root, 'src/lib/board-surface.js'),
  resolve(componentsDir, '_ux-base.js'),
].filter(existsSync).map((f) => readFileSync(f, 'utf8')).join('\n');

/** Event suffixes the code can dispatch: literal 'tag:name' and templated `${…}:name`. */
function dispatchedSuffixes(code) {
  const out = new Set();
  for (const m of code.matchAll(/['"`]([a-z][a-z0-9-]*):([a-z][a-z0-9-]*)['"`]/g)) out.add(`${m[1]}:${m[2]}`);
  for (const m of code.matchAll(/`\$\{[^}]+\}:([a-z][a-z0-9-]*)`/g)) out.add(`*:${m[1]}`);
  // helpers called as emit('name') / #emit('name') / dispatch('name') / fire('name')
  for (const m of code.matchAll(/(?:emit|dispatch|fire|_fire|#fire|#emit|_emit)\(\s*['"]([a-z][a-z0-9-]*)['"]/g)) out.add(`*:${m[1]}`);
  // `tag:${variable}`: any suffix that appears as a quoted literal may be fired
  for (const m of code.matchAll(/`([a-z][a-z0-9-]*):\$\{/g)) {
    for (const q of code.matchAll(/['"]([a-z][a-z0-9-]*)['"]/g)) out.add(`${m[1]}:${q[1]}`);
  }
  // Older un-namespaced events dispatched literally: new CustomEvent('status-changed')
  for (const m of code.matchAll(/new CustomEvent\(\s*['"]([a-z]+(?:-[a-z]+)+)['"]/g)) out.add(m[1]);
  // UXShadowElement subclasses: `static readyEvent = 'persona-ready'` is dispatched by the base
  for (const m of code.matchAll(/static\s+readyEvent\s*=\s*['"]([a-z][a-z0-9-]*)['"]/g)) out.add(m[1]);
  return out;
}

for (const c of components) {
  const api = JSON.parse(readFileSync(resolve(componentsDir, c, 'api.json'), 'utf8'));
  const code = sourcesFor(c);

  test(`${c}: api.json matches schemas/api.schema.json`, () => {
    assert.deepEqual(validate(api, schema), []);
    for (const a of api.attributes) {
      if (a.type === 'enum') assert.ok(a.values?.length, `${a.name}: enum without values`);
    }
  });

  test(`${c}: element name is the registered tag`, () => {
    const reg = code.match(/registerComponent\(\s*['"]([a-z0-9-]+)['"]/);
    assert.ok(reg, 'no registerComponent() call found');
    assert.equal(api.element, reg[1]);
  });

  test(`${c}: every documented event is dispatched, and every dispatched event is documented`, () => {
    const documented = new Set(api.events.map((e) => e.name));
    const local = dispatchedSuffixes(code);
    const inherited = dispatchedSuffixes(sharedSources);
    const canDispatch = (name) => {
      const suffix = name.split(':')[1];
      if (!name.includes(':')) return local.has(name);
      return local.has(name) || local.has(`*:${suffix}`) || inherited.has(`*:${suffix}`);
    };
    const notDispatched = [...documented].filter((n) => !canDispatch(n));
    assert.deepEqual(notDispatched, [], 'documented but never dispatched');

    // Literal "<tag>:<event>" strings in the component's own code that look
    // like dispatches must be documented. (Listeners for OTHER components'
    // events use other tag prefixes and are ignored.)
    const literalOwn = [...local].filter((n) => n.startsWith(`${api.element}:`));
    const dispatchedLiterals = literalOwn.filter((n) =>
      new RegExp(`(?:CustomEvent|dispatch\\w*|emit\\w*)\\(\\s*['"\`]${n.replace(/[-:]/g, '\\$&')}['"\`]`).test(code));
    const undocumented = dispatchedLiterals.filter((n) => !documented.has(n));
    assert.deepEqual(undocumented, [], 'dispatched but undocumented');
  });

  test(`${c}: every observed attribute is documented`, () => {
    const block = code.match(/observedAttributes\s*\(\)\s*\{[\s\S]*?\]/);
    if (!block) return;
    const observed = [...block[0].matchAll(/['"]([a-z][a-z0-9-]*)['"]/g)].map((m) => m[1]);
    const documented = new Set(api.attributes.map((a) => a.name));
    const ALWAYS_OK = new Set(['class', 'style', 'hidden', 'tabindex', 'dir', 'lang']);
    const missing = observed.filter((a) => !documented.has(a) && !ALWAYS_OK.has(a));
    assert.deepEqual(missing, []);
  });
}
