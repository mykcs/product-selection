import fs from 'node:fs';
import path from 'node:path';

export const ROOT = path.resolve(process.cwd());
const roots = ['agent', 'iphone', 'mac', 'osprey', 'watch'];
const assetRoots = [...roots, 'assets'];
const filesUnder = root => fs.existsSync(root) ? fs.readdirSync(root, { withFileTypes: true }).flatMap(entry => {
  const name = path.join(root, entry.name);
  if (entry.isSymbolicLink()) throw new Error('Unexpected symlink: ' + name);
  return entry.isDirectory() ? filesUnder(name) : [name];
}).sort() : [];

export function pages() {
  return ['index.html', ...roots.flatMap(root => filesUnder(root)).filter(file => file.endsWith('/index.html'))].sort().map(file => {
    const source = fs.readFileSync(file, 'utf8');
    const match = source.match(/^\s*<!doctype html>\s*<html lang="(zh-CN|en)">\s*<head>([\s\S]*?)<\/head>\s*<body>([\s\S]*?)<\/body>\s*<\/html>\s*$/i);
    if (!match) throw new Error('Unexpected document structure: ' + file);
    const [, lang, head, body] = match;
    const main = body.match(/<main\b[^>]*>/g);
    if (main?.length !== 1) throw new Error('Expected one main landmark: ' + file);
    const start = main[0];
    const id = start.match(/\bid="([^"]+)"/)?.[1] ?? 'main';
    const content = /\bid=/.test(start) ? body : body.replace(start, start.replace(/>$/, ' id="main">'));
    return { file, route: file.replace(/(?:^|\/)index\.html$/, ''), lang, head, body, content, mainId: id };
  });
}

export function assets() {
  const types = /\.(?:css|m?js|json|png|jpe?g|webp|avif|gif|svg|ico|woff2?|webmanifest)$/i;
  const approved = ['llms.txt','agent/SKILL.md'];
  return [...new Set([...approved,...assetRoots.flatMap(root=>filesUnder(root)).filter(file=>types.test(file))])].sort();
}
