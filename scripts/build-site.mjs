import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'acorn';

// The original React sources were not recovered. Keep the published release as
// an immutable baseline; content and small presentation changes are maintained
// separately so rebuilding never relies on editing minified output by hand.
const BASE = '0ef5a45';
const MAIN = 'index-BewyJDjZ.js';
const root = path.resolve(import.meta.dirname, '..');
process.chdir(root);
const readJSON = name => JSON.parse(fs.readFileSync(`content/${name}.json`, 'utf8'));
const ast = source => parse(source, { ecmaVersion: 'latest', sourceType: 'module' });
const literal = value => JSON.stringify(value);
const dataNames = { X: 'publications', ca: 'bio', Et: 'events', xo: 'talks', ga: 'books', Wo: 'timeline', ve: 'highlight', da: 'stats', ua: 'outlets' };
const mainPatch = readJSON('main-patches');
mainPatch.variables ??= {};
for (const [name, file] of Object.entries(dataNames)) mainPatch.variables[name] = literal(readJSON(file));
// A future dated engagement becomes past automatically after its end date.
mainPatch.variables.Et += '.map(event => ({...event, status: event.status === "upcoming" && Date.parse((event.endDate || event.sortDate) + "T23:59:59-03:00") < Date.now() ? "past" : event.status}))';
const patches = { [MAIN]: mainPatch, ...readJSON('page-patches') };

function applyPatch(source, patch, filename) {
  const tree = ast(source);
  const edits = [];
  const foundVariables = new Set(), foundFunctions = new Set(), foundStrings = new Set();
  for (const node of tree.body) {
    if (node.type === 'VariableDeclaration') {
      for (const item of node.declarations) {
        const replacement = patch.variables?.[item.id.name];
        if (replacement !== undefined) {
          ast(`const value = (${replacement});`);
          edits.push({ start: item.init.start, end: item.init.end, text: replacement });
          foundVariables.add(item.id.name);
        }
      }
    }
    if (node.type === 'FunctionDeclaration' && patch.functions?.[node.id.name]) {
      const replacement = patch.functions[node.id.name];
      ast(replacement);
      edits.push({ start: node.start, end: node.end, text: replacement });
      foundFunctions.add(node.id.name);
    }
  }
  function walk(node) {
    if (!node || typeof node !== 'object') return;
    if (edits.some(edit => node.start >= edit.start && node.end <= edit.end)) return;
    if (node.type === 'Literal' && typeof node.value === 'string' && Object.hasOwn(patch.strings ?? {}, node.value)) {
      edits.push({ start: node.start, end: node.end, text: literal(patch.strings[node.value]) });
      foundStrings.add(node.value);
      return;
    }
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) value.forEach(walk);
      else if (value && typeof value === 'object') walk(value);
    }
  }
  walk(tree);
  for (const [kind, found] of [['variables', foundVariables], ['functions', foundFunctions], ['strings', foundStrings]]) {
    for (const key of Object.keys(patch[kind] ?? {})) {
      if (!found.has(key)) throw new Error(`${filename}: unmatched ${kind} patch: ${key}`);
    }
  }
  edits.sort((a, b) => b.start - a.start);
  let boundary = source.length;
  for (const edit of edits) {
    if (edit.end > boundary) throw new Error(`${filename}: overlapping edits`);
    source = source.slice(0, edit.start) + edit.text + source.slice(edit.end);
    boundary = edit.start;
  }
  for (const edit of patch.replacements ?? []) {
    if (source.split(edit.from).length !== 2) throw new Error(`${filename}: raw patch must match exactly once`);
    source = source.replace(edit.from, edit.to);
  }
  ast(source);
  return source;
}

const baselineFiles = execFileSync('git', ['ls-tree', '-r', '--name-only', BASE, 'public/assets'], { encoding: 'utf8' }).trim().split('\n');
const modules = new Map();
for (const file of baselineFiles.filter(file => file.endsWith('.js'))) {
  const name = path.basename(file);
  const source = execFileSync('git', ['show', `${BASE}:${file}`], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  modules.set(name, patches[name] ? applyPatch(source, patches[name], name) : source);
}
for (const name of Object.keys(patches)) if (!modules.has(name)) throw new Error(`Missing baseline: ${name}`);

// Version the complete app graph together: the entry and lazy chunks have
// circular imports, so independent content hashes would not converge.
const release = createHash('sha256').update([...modules].map(([name, code]) => name + code).join('\n')).digest('hex').slice(0, 12);
const names = new Map([...modules.keys()].filter(name => name === MAIN || name.includes('Page-')).map(name => [name, name.replace(/\.js$/, `-u${release}.js`)]));
const outputs = new Map();
for (const [name, code] of modules) {
  let updated = code;
  for (const [oldName, newName] of names) updated = updated.replaceAll(oldName, newName);
  ast(updated);
  outputs.set(names.get(name) ?? name, updated);
}
const publicDir = 'public/assets';
for (const file of fs.readdirSync(publicDir)) {
  if (file.endsWith('.js') && (file.startsWith('index-') || file.includes('Page-')) && !outputs.has(file)) fs.unlinkSync(path.join(publicDir, file));
}
for (const [name, code] of outputs) fs.writeFileSync(path.join(publicDir, name), code);
for (const file of fs.readdirSync('public').filter(file => file.endsWith('.html'))) {
  const filename = path.join('public', file);
  let html = fs.readFileSync(filename, 'utf8');
  html = html.replace(/\/assets\/index-[A-Za-z0-9_-]+\.js/g, `/assets/${names.get(MAIN)}`);
  fs.writeFileSync(filename, html);
}
fs.writeFileSync('content/build-manifest.json', JSON.stringify({ baselineCommit: BASE, contentAsOf: '2026-10-14', release, entry: `/assets/${names.get(MAIN)}`, modules: [...outputs.keys()] }, null, 2) + '\n');
console.log(`Built release ${release}: ${outputs.size} modules; content through 14 October 2026.`);
