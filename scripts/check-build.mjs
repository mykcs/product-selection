import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { assets, pages } from '../src/lib/site-files.mjs';
const output=path.resolve('dist');
const read=name=>fs.readFileSync(path.join(output,name));
const files=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{
  const full=path.join(dir,entry.name);
  return entry.isDirectory()?files(full):[path.relative(output,full)];
});
const routes=pages(),built=files(output);
assert.deepEqual(built.filter(file=>file.endsWith('.html')).sort(),routes.map(page=>page.file).sort());
for(const page of routes){
  const html=read(page.file).toString();
  assert.match(html,/<main\b[^>]*id="main"/);
  assert.match(html,/<link\b[^>]*href="\/_astro\/[^"]+\.css"/);
  assert.ok(html.includes('href="#main"'));
  assert.equal((html.match(/href="\/assets\/site\.css"/g)||[]).length,1);
  assert.equal((html.match(/href="\/assets\/interaction-craft\.css"/g)||[]).length,1);
}
const approved=new Set([...routes.map(page=>page.file),...assets()]);
for(const file of built)assert.ok(approved.has(file)||/^_astro\/[^/]+\.css$/.test(file),'Unexpected output: '+file);
for(const file of assets())assert.deepEqual(read(file),fs.readFileSync(file),'Asset changed: '+file);
const reader=fs.readFileSync('agent/index.html','utf8');
const body=reader.match(/<body[^>]*>([\s\S]*?)<\/body>/i)[1].replace('<main class="wrap">','<main id="main" class="wrap">');
assert.ok(read('agent/index.html').toString().includes(body),'Generated reader body changed');
console.log('Verified '+routes.length+' native Astro routes, single shared design owner, approved assets and exact reader projection.');
