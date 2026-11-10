import {readdir, stat} from 'node:fs/promises';
const dir=new URL('../dist/assets/',import.meta.url);
const main=(await readdir(dir)).find(name=>/^index-.*\.js$/.test(name));
if(!main)throw new Error('Fichier JavaScript principal introuvable : exécutez npm run build.');
const bytes=(await stat(new URL(main,dir))).size;
const limit=560_000;
console.log(`JavaScript initial : ${bytes} octets / budget ${limit} octets`);
if(bytes>limit)process.exitCode=1;
