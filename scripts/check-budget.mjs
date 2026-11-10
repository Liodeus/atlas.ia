import {readFile,stat} from 'node:fs/promises';
import {initialJavaScriptFiles} from './initial-budget.mjs';
const dist=new URL('../dist/',import.meta.url),assets=new URL('assets/',dist);
const files=initialJavaScriptFiles(await readFile(new URL('index.html',dist),'utf8'));
if(!files.length)throw new Error('JavaScript initial introuvable : exécutez npm run build.');
const sizes=await Promise.all(files.map(file=>stat(new URL(file,assets)).then(info=>info.size)));
const bytes=sizes.reduce((total,size)=>total+size,0),limit=480_000;
console.log(`JavaScript initial (${files.length} fichiers) : ${bytes} octets / budget ${limit} octets`);
if(bytes>limit)process.exitCode=1;
