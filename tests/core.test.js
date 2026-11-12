import test from 'node:test';
import assert from 'node:assert/strict';
import { normalize, grade, buildQuiz, validateProgress } from '../src/core.js';

test('search ignores accents and case', () => assert.equal(normalize('Éléphant'), 'elephant'));
test('numeric answers accept comma with tolerance', () => assert.equal(grade({kind:'number',answer:2.5,tolerance:0.01}, '2,50'), true));
test('wrong and invalid numeric answers do not pass', () => assert.equal(grade({kind:'number',answer:0,tolerance:0}, ''), false));
test('quiz questions never repeat', () => { const q=Array.from({length:12},(_,i)=>({id:String(i),theme:1})); assert.equal(new Set(buildQuiz(q,[1],10).map(x=>x.id)).size,10); });
test('progress rejects unknown versions', () => assert.equal(validateProgress({version:99}),false));
test('progress rejects malformed imported history', () => assert.equal(validateProgress({version:1,completed:[],favorites:[],history:[null],errors:[],session:null}),false));
test('progress accepts an empty profile', () => assert.equal(validateProgress({version:1,completed:[],favorites:[],history:[],errors:[],session:null}),true));
test('the 16 source themes retain their original IDs and include the new notions', async () => {
  const {readFile}=await import('node:fs/promises');
  const themes=JSON.parse(await readFile(new URL('../src/glossary.json',import.meta.url),'utf8'));
  assert.equal(themes.length,16);
  const entries=themes.flatMap(t=>t.entries);
  assert.equal(entries.length,519);
  const ids=new Set(entries.map(entry=>entry.id));
  assert.equal(ids.size,entries.length);
  for(let id=1;id<=506;id++)assert.ok(ids.has(`notion-${id}`));
  assert.equal(themes.flatMap(t=>t.entries).filter(e=>e.priority).length,82);
  assert.ok(themes.flatMap(t=>t.entries).every(e=>!e.definition.includes('—')&&!e.definition.includes('**')));
});
test('ordering is correct only when every step is in the right position', () => {
  const q={kind:'order',answer:['A','B','C']};
  assert.equal(grade(q,['A','B','C']),true);
  assert.equal(grade(q,['B','A','C']),false);
});
test('matching requires every pair to be correct', () => {
  const q={kind:'matching',answer:['Chat','RAG']};
  assert.equal(grade(q,['Chat','RAG']),true);
  assert.equal(grade(q,['RAG','Chat']),false);
});
test('quiz filters difficulty before sampling', () => {
  const pool=[{id:'a',theme:1,level:'debutant'},{id:'b',theme:1,level:'avance'}];
  assert.deepEqual(buildQuiz(pool,[1],10,'avance').map(q=>q.id),['b']);
});
test('progress accepts a checked ordering answer', () => {
  const session={id:1,mode:'practice',index:0,checked:true,finished:false,items:[{id:'o',theme:1,kind:'order',prompt:'Ordre ?',explanation:'Explication',answer:['A','B'],choices:['B','A']}],answers:{o:{value:['A','B'],correct:true}}};
  assert.equal(validateProgress({version:1,completed:[],favorites:[],history:[],errors:[],session}),true);
});
test('GQA definition distinguishes sharing within each group', async () => {
  const {readFile}=await import('node:fs/promises');
  const themes=JSON.parse(await readFile(new URL('../src/glossary.json',import.meta.url),'utf8'));
  const gqa=themes.flatMap(t=>t.entries).find(e=>e.id==='notion-88');
  assert.match(gqa.definition,/chaque groupe partage une tête de clés et une tête de valeurs/);
});
test('unknown saved versions are protected from automatic overwriting', async () => {
  const {readStoredProgress}=await import('../src/core.js');
  assert.deepEqual(readStoredProgress('{"version":2}'),{progress:null,blocked:true});
  assert.deepEqual(readStoredProgress('not valid JSON'),{progress:null,blocked:true});
  assert.deepEqual(readStoredProgress(null),{progress:null,blocked:false});
});
test('corrections show the actual ordering and matching pairs', async () => {
 const {formatCorrectAnswer}=await import('../src/core.js');
 assert.equal(formatCorrectAnswer({kind:'order',answer:['A','B']}),'A → B');
 assert.equal(formatCorrectAnswer({kind:'matching',labels:['L1','L2'],answer:['A','B']}),'L1 : A ; L2 : B');
});

test('progress rejects malformed new quiz history while accepting old history',()=>{
 const old={version:1,completed:[],favorites:[],errors:[],session:null,history:[{id:1,date:'2026-11-10T12:00:00Z',correct:0,total:1}]};
 assert.equal(validateProgress(old),true);
 assert.equal(validateProgress({...old,history:[{...old.history[0],results:[null]}]}),false);
 assert.equal(validateProgress({...old,history:[{...old.history[0],themes:['bad']}]}),false);
 assert.equal(validateProgress({...old,history:[{...old.history[0],origin:{theme:1,step:2},themes:[1],results:[{id:'q-1',value:'a',correct:false}]}]}),true);
});
