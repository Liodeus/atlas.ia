import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,mkdir,writeFile,copyFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {buildGlossary} from '../scripts/import-glossary.mjs';
import corrections from '../src/glossaryCorrections.json' with {type:'json'};

const glossary=JSON.parse(await readFile(new URL('../src/glossary.json',import.meta.url),'utf8'));
// Fixture autonome : les tests du dépôt ne dépendent pas du Markdown externe.
const md=glossary.map(theme=>`## ${theme.id}. ${theme.title}\n`+theme.entries.map(entry=>`- **${entry.priority?'⭐ ':''}${entry.name}** — ${corrections[entry.id]?.sourceDefinition||entry.definition}`).join('\n')).join('\n\n')+'\n\n## 12 distinctions à ne pas mélanger\n1. **Exemple historique** : Ce texte ne doit pas remplacer les comparaisons enrichies.\n';

test('reimport keeps reviewed definitions and stable notion IDs',()=>{
 const result=buildGlossary(md,glossary,corrections);
 assert.equal(result.length,16);
 assert.equal(result.flatMap(t=>t.entries).length,506);
 assert.deepEqual(result,glossary);
});

test('a changed source definition under a correction requires explicit review',()=>{
 const patch=corrections['notion-438'];
 const changed=md.replace(patch.sourceDefinition,'Nouvelle définition dans la source.');
 assert.notEqual(changed,md);
 assert.throws(()=>buildGlossary(changed,glossary,corrections),/notion-438.*source.*changé/i);
});

test('ordinary source updates are imported, rather than masked by existing output',()=>{
 const entry=glossary[0].entries.find(e=>e.id==='notion-2');
 const changed=md.replace(entry.definition,'Définition source mise à jour pour le test.');
 assert.notEqual(changed,md);
 const result=buildGlossary(changed,glossary,corrections);
 assert.equal(result[0].entries.find(e=>e.id===entry.id).definition,'Définition source mise à jour pour le test.');
});

test('source can adopt a reviewed correction without requiring duplicate edits',()=>{
 const patch=corrections['notion-438'];
 const result=buildGlossary(md.replace(patch.sourceDefinition,patch.definition),glossary,corrections);
 assert.equal(result.flatMap(t=>t.entries).find(e=>e.id==='notion-438').definition,patch.definition);
});

test('CLI import preserves authored distinctions byte for byte and fails before writing on conflict',async()=>{
 const root=await mkdtemp(join(tmpdir(),'atlas-content-import-'));
 try{
  const project=join(root,'atlas-ia');
  await mkdir(join(project,'scripts'),{recursive:true});
  await mkdir(join(project,'src'));
  for(const file of ['scripts/import.mjs','scripts/import-glossary.mjs','scripts/id-map.mjs','src/glossary.json','src/glossaryCorrections.json','src/distinctions.json','src/priorityContent.js','src/extensionHarness.js','src/extensionFamilies.js'])await copyFile(new URL('../'+file,import.meta.url),join(project,file));
  await writeFile(join(project,'glossaire_ia_llm_exhaustif.md'),md);
  const distinctionPath=join(project,'src/distinctions.json');
  const before=await readFile(distinctionPath,'utf8');
  const priorityBefore=await readFile(join(project,'src/priorityContent.js'),'utf8');
  const extensionsBefore=await Promise.all(['extensionHarness.js','extensionFamilies.js'].map(file=>readFile(join(project,'src',file),'utf8')));
  const output=execFileSync(process.execPath,[join(project,'scripts/import.mjs')],{encoding:'utf8'});
  assert.match(output,/distinctions.*conserv/i);
  assert.equal(await readFile(distinctionPath,'utf8'),before);
  assert.equal(await readFile(join(project,'src/priorityContent.js'),'utf8'),priorityBefore);
  assert.deepEqual(await Promise.all(['extensionHarness.js','extensionFamilies.js'].map(file=>readFile(join(project,'src',file),'utf8'))),extensionsBefore);
  const glossaryBefore=await readFile(join(project,'src/glossary.json'),'utf8');
  await writeFile(join(project,'glossaire_ia_llm_exhaustif.md'),md.replace(corrections['notion-438'].sourceDefinition,'Source changée.'));
  assert.throws(()=>execFileSync(process.execPath,[join(project,'scripts/import.mjs')],{stdio:'pipe'}));
  assert.equal(await readFile(join(project,'src/glossary.json'),'utf8'),glossaryBefore);
  assert.equal(await readFile(distinctionPath,'utf8'),before);
 }finally{await rm(root,{recursive:true,force:true});}
});
