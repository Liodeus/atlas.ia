import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {conceptName} from '../src/terminology.js';
const themes=JSON.parse(await readFile(new URL('../src/glossary.json',import.meta.url),'utf8'));
const byId=id=>themes.flatMap(t=>t.entries).find(e=>e.id===id);
test('concept labels retain their canonical English names without French equivalents',()=>{
 for(const [id,name] of [['notion-1','AI (Artificial Intelligence)'],['notion-35','Parameter / Weight'],['notion-37','Layer'],['notion-150','Pretraining'],['notion-221','Inference'],['notion-222','Quantization'],['notion-364','Recall'],['notion-390','Least Privilege'],['notion-418','Multimodality']])assert.equal(conceptName(byId(id)),name,id);
});
test('other established English terms and acronyms are preserved',()=>{
 assert.equal(conceptName(byId('notion-88')),'Grouped-Query Attention (GQA)');
 assert.equal(conceptName(byId('notion-4')),'LLM (Large Language Model)');
});
