import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'acorn';

process.chdir(path.resolve(import.meta.dirname, '..'));
const read = name => JSON.parse(fs.readFileSync(`content/${name}.json`, 'utf8'));
const publications = read('publications');
const articles = publications.filter(item => item.kind === 'article');
assert.equal(articles.length, 18, '18 original press articles');
assert.equal(new Set(publications.map(item => item.id)).size, publications.length, 'Unique publication IDs');
assert.equal(new Set(articles.map(item => item.links[0].href)).size, 18, 'Unique originals');
assert.equal(publications.filter(item => item.kind === 'book').length, 2, 'Books stay separate');
assert.equal(publications.filter(item => item.kind === 'podcast').length, 1, 'Podcast stays separate');
for (const item of articles) {
  assert.ok(item.sortDate <= '2026-10-14', `Future article: ${item.title}`);
  assert.ok(Number.isFinite(Date.parse(item.sortDate)), `Invalid article date: ${item.title}`);
  for (const link of item.links) assert.equal(new URL(link.href).protocol, 'https:');
}
const events = read('events');
assert.ok(events.every(event => event.status === 'past'), 'All supplied engagements have happened');
assert.equal(events.find(event => event.id === 'icaily-2026').place, 'Online');
assert.ok(read('books').find(book => book.id === 'pt').blurb.includes('9 de outubro de 2026'));
assert.equal(read('stats')[2].value, String(articles.length));

for (const file of ['index.html', 'about.html', 'speaking.html']) {
  const html = fs.readFileSync(`public/${file}`, 'utf8');
  const scripts = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g)];
  const nodes = scripts.flatMap(match => {
    const value = JSON.parse(match[1]);
    return value['@graph'] ?? [value];
  });
  const schemaArticles = nodes.filter(item => item['@type'] === 'Article');
  assert.equal(schemaArticles.length, 18, `${file}: structured data matches article count`);
  for (const item of articles) {
    const schema = schemaArticles.find(entry => entry.url === item.links[0].href);
    assert.ok(schema, `${file}: missing article ${item.title}`);
    assert.equal(schema.datePublished, item.sortDate, `${file}: date matches canonical data`);
  }
}

const manifest = read('build-manifest');
assert.ok(fs.readFileSync('public/index.html', 'utf8').includes(manifest.entry));
for (const file of fs.readdirSync('public/assets').filter(file => file.endsWith('.js'))) {
  const code = fs.readFileSync(`public/assets/${file}`, 'utf8');
  parse(code, { ecmaVersion: 'latest', sourceType: 'module' });
  for (const match of code.matchAll(/["'](?:\.\/|assets\/)([^"']+\.js)["']/g)) {
    assert.ok(fs.existsSync(`public/assets/${match[1]}`), `${file}: missing imported module ${match[1]}`);
  }
}
const files = [...fs.readdirSync('public').filter(file => file.endsWith('.html')).map(file => `public/${file}`), ...manifest.modules.map(file => `public/assets/${file}`)];
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  assert.ok(!/Global Digital Citizenship|Bloomsbury|He is the keynote speaker|É palestrante principal do ICAILY/.test(text), `${file}: outdated or undisclosed content`);
}
assert.ok(!JSON.stringify(publications).includes('xultr.com'), 'Do not count lead-only aggregation');
console.log('Content checks passed: 18 originals, separate editions, completed events, valid SEO and module graph, no undisclosed launch details.');
