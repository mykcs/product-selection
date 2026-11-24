import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { assets, pages } from '../src/lib/legacy-pages.mjs';
const output=path.resolve('dist');
const read=name=>fs.readFileSync(path.join(output,name));
const files=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{
  const full=path.join(dir,entry.name);
  return entry.isDirectory()?files(full):[path.relative(output,full)];
});
const routes=pages();
const built=files(output);
assert.deepEqual(built.filter(file=>file.endsWith('.html')).sort(),routes.map(page=>page.file).sort());
for(const page of routes){
  const html=read(page.file).toString();
  // The original pricing/copy/script blocks are exact, not re-derived or evaluated.
  assert.ok(html.includes(page.head),'Head changed: '+page.file);
  assert.ok(html.includes(page.content),'Source body changed: '+page.file);
  assert.match(html,/<link\b[^>]*href="\/_astro\/[^"]+\.css"/);
  assert.ok(html.includes('href="#'+page.mainId+'"'));
}
const approved=new Set([...routes.map(page=>page.file),...assets()]);
for(const file of built){
  assert.ok(approved.has(file)||/^_astro\/[^/]+\.css$/.test(file),'Unexpected output: '+file);
}
for(const file of assets())assert.deepEqual(read(file),fs.readFileSync(file),'Asset changed: '+file);
console.log('Verified '+routes.length+' Astro routes; original content, inline code, allowed assets and reader bytes preserved.');
