import fs from 'node:fs';
import path from 'node:path';
import { assets } from '../src/lib/legacy-pages.mjs';
const dest=path.resolve('.public-build');
fs.rmSync(dest,{recursive:true,force:true});
fs.mkdirSync(dest,{recursive:true});
for(const file of assets()){
  const target=path.join(dest,file);
  fs.mkdirSync(path.dirname(target),{recursive:true});
  fs.copyFileSync(file,target);
}
console.log('Prepared '+assets().length+' approved public assets.');
