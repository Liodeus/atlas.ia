import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {entries} from '../src/appData.js';
import {priorityContent} from '../src/priorityContent.js';
import {notionContent, supplementalContent} from '../src/notionContent.js';

import {notionContentSources} from '../src/notionSources.js';

const batches = await Promise.all(Array.from({length:18}, async (_,index)=>{
 const suffix=String(index+1).padStart(2,'0');
 const read=async kind=>JSON.parse(await readFile(new URL(`../src/notionDetails/${kind}-${suffix}.json`,import.meta.url),'utf8'));
 return {theme:index+1,content:await read('theme'),sources:await read('sources')};
}));

test('all 571 notions have teaching content and the original 82 remain intact',()=>{
 assert.equal(entries.length,571);
 assert.deepEqual(Object.keys(notionContent).sort(),entries.map(e=>e.id).sort());
 assert.equal(Object.keys(supplementalContent).length,489);
 for(const [id,content] of Object.entries(priorityContent)){
  assert.ok(!Object.hasOwn(supplementalContent,id),id);
  assert.deepEqual(notionContent[id],content,id);
 }
});

test('each theme supplies exactly its missing notions and their references',()=>{
 const seen=new Set();
 for(const {theme,content,sources} of batches){
  const expected=entries.filter(e=>e.theme===theme&&!Object.hasOwn(priorityContent,e.id)).map(e=>e.id).sort();
  assert.deepEqual(Object.keys(content).sort(),expected,`theme ${theme}`);
  assert.deepEqual(Object.keys(sources).sort(),expected,`sources ${theme}`);
  for(const id of Object.keys(content)){assert.ok(!seen.has(id),`duplicate ${id}`);seen.add(id)}
 }
 assert.equal(seen.size,489);
});

test('new teaching fields are distinct, substantive and explicitly illustrative',()=>{
 const seen=new Set();
 for(const [id,content] of Object.entries(supplementalContent)){
  assert.deepEqual(Object.keys(content).sort(),['example','explanation','misconception'],id);
  for(const [field,min] of [['explanation',180],['example',90],['misconception',70]]){
   const value=content[field];
   assert.equal(typeof value,'string',`${id} ${field}`);
   assert.ok(value.trim().length>=min,`${id} ${field} is too short`);
   assert.doesNotMatch(value,/\u2014|\bTODO\b|à rédiger|à compléter|lorem ipsum/i,`${id} ${field}`);
  }
  assert.ok(content.example.startsWith('Exemple illustratif :'),id);
  assert.equal(new Set(Object.values(content)).size,3,id);
  const signature=JSON.stringify(content);
  assert.ok(!seen.has(signature),`duplicate content ${id}`);seen.add(signature);
  const entry=entries.find(e=>e.id===id);
  assert.notEqual(content.explanation.trim().toLowerCase(),entry.definition.trim().toLowerCase(),id);
 }
});

test('every supplement has usable reference URLs without missing or orphan IDs',()=>{
 assert.deepEqual(Object.keys(notionContentSources).sort(),Object.keys(supplementalContent).sort());
 for(const [id,sources] of Object.entries(notionContentSources)){
  assert.ok(Array.isArray(sources)&&sources.length>0,id);
  assert.equal(new Set(sources).size,sources.length,id);
  for(const source of sources){
   const url=new URL(source);
   assert.equal(url.protocol,'https:',id);
   assert.ok(url.hostname.includes('.')&&!url.hostname.endsWith('example.com'),id);
  }
 }
});
