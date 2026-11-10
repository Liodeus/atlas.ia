import test from 'node:test';
import assert from 'node:assert/strict';
import {buildFlashcardDeck,createFlashcardSession,flipFlashcard,moveFlashcard,rateFlashcard,finishFlashcardSession,validateFlashcards,cleanFlashcards,maskFlashcardDefinition} from '../src/flashcards.js';
import {validateProgress} from '../src/core.js';

const entries=[{id:'notion-1',theme:1},{id:'notion-2',theme:1},{id:'notion-3',theme:2},{id:'notion-4',theme:2}];
const oldProfile={version:1,completed:[],favorites:[],history:[],errors:[],session:null};

test('decks filter themes, favorites and review without duplicates',()=>{
 const options={theme:'all',scope:'all',favorites:['notion-2'],status:{'notion-3':'review'},count:'all'};
 assert.deepEqual(new Set(buildFlashcardDeck(entries,options,()=>0)),new Set(entries.map(e=>e.id)));
 assert.deepEqual(buildFlashcardDeck(entries,{...options,theme:'2'},()=>0).sort(),['notion-3','notion-4']);
 assert.deepEqual(buildFlashcardDeck(entries,{...options,scope:'favorites'},()=>0),['notion-2']);
 assert.deepEqual(buildFlashcardDeck(entries,{...options,scope:'review'},()=>0),['notion-3']);
 assert.equal(new Set(buildFlashcardDeck(entries,{...options,count:3},()=>0)).size,3);
 assert.deepEqual(buildFlashcardDeck(entries,{...options,theme:'1',scope:'review'},()=>0),[]);
});

test('the complete glossary supplies usable cards',async()=>{
 const {default:themes}=await import('../src/themes.js');
 const all=themes.flatMap(theme=>theme.entries);
 const deck=buildFlashcardDeck(all,{count:'all'},()=>0.5);
 assert.equal(deck.length,all.length);
 assert.equal(new Set(deck).size,all.length);
 assert.ok(all.every(entry=>entry.name.trim()&&entry.definition.trim()));
 for(const theme of themes)assert.equal(buildFlashcardDeck(all,{theme:String(theme.id),count:'all'},()=>0.5).length,theme.entries.length);
});

test('rating requires reveal, preserves earlier ratings and allows corrections',()=>{
 let progress={status:{},session:createFlashcardSession(['notion-1','notion-2'],'term')};
 assert.deepEqual(rateFlashcard(progress,'known'),progress);
 progress={...progress,session:flipFlashcard(progress.session)};
 progress=rateFlashcard(progress,'review');
 assert.equal(progress.status['notion-1'],'review');
 assert.equal(progress.session.ratings['notion-1'],'review');
 progress={...progress,session:moveFlashcard(progress.session,1)};
 assert.equal(progress.session.revealed,false);
 assert.equal(finishFlashcardSession(progress.session).finished,false);
 progress={...progress,session:flipFlashcard(progress.session)};
 progress=rateFlashcard(progress,'known');
 progress={...progress,session:moveFlashcard(progress.session,0)};
 progress={...progress,session:flipFlashcard(progress.session)};
 progress=rateFlashcard(progress,'known');
 assert.equal(progress.status['notion-1'],'known');
 assert.equal(progress.session.ratings['notion-1'],'known');
 assert.equal(Object.keys(progress.session.ratings).length,2);
 assert.equal(finishFlashcardSession(progress.session).finished,true);
});

test('progress remains compatible with existing backups and rejects malformed flashcards',()=>{
 assert.equal(validateProgress(oldProfile),true);
 const valid={status:{'notion-1':'review'},session:createFlashcardSession(['notion-1'],'definition')};
 assert.equal(validateFlashcards(valid),true);
 assert.equal(validateProgress({...oldProfile,flashcards:valid}),true);
 assert.equal(validateProgress({...oldProfile,flashcards:{status:{'notion-1':'bad'},session:null}}),false);
 assert.equal(validateFlashcards({status:{},session:{...valid.session,ids:['notion-1','notion-1']}}),false);
 assert.equal(validateFlashcards({status:{},session:{...valid.session,finished:true}}),false);
 assert.equal(validateFlashcards({status:{'notion-1':'known'},session:{...valid.session,ratings:{'notion-1':'review'}}}),false);
});

test('backup import removes unknown card statuses and discards invalidated sessions',()=>{
 const progress={status:{'notion-1':'known','notion-9':'review'},session:createFlashcardSession(['notion-1','notion-9'],'term')};
 const cleaned=cleanFlashcards(progress,new Set(['notion-1']));
 assert.deepEqual(cleaned,{value:{status:{'notion-1':'known'},session:null},removed:true});
 assert.deepEqual(cleanFlashcards(undefined,new Set()),{value:undefined,removed:false});
});

test('reverse cards hide the answer when a definition contains the concept name',()=>{
 const entry={id:'notion-345',name:'Human Approval / Human-in-the-Loop',definition:'Human Approval est une validation ; Human-in-the-Loop permet aussi une supervision.'};
 const masked=maskFlashcardDefinition(entry);
 assert.doesNotMatch(masked,/Human Approval|Human-in-the-Loop/i);
 assert.match(masked,/\[terme masqué\]/);
 assert.equal(maskFlashcardDefinition({id:'notion-261',name:'RAG',definition:'Un fragment fournit du contexte.'}),'Un fragment fournit du contexte.');
});

test('reverse cards do not reveal family names inside model variants',async()=>{
 const {familyTheme}=await import('../src/extensionFamilies.js');
 for(const entry of familyTheme.entries){
  assert.ok(!maskFlashcardDefinition(entry).toLowerCase().includes(entry.name.toLowerCase()),entry.name);
 }
});

test('revision dates are recorded, survive old backups and select cards due for review', async()=>{
 const {dueFlashcardIds}=await import('../src/flashcards.js');
 const old={status:{'notion-1':'review'},session:null};
 assert.equal(validateFlashcards(old),true);
 let progress={status:{},session:flipFlashcard(createFlashcardSession(['notion-1'],'term'))};
 progress=rateFlashcard(progress,'known','2026-11-10T12:00:00.000Z');
 assert.equal(progress.reviewedAt['notion-1'],'2026-11-10T12:00:00.000Z');
 assert.deepEqual(dueFlashcardIds(progress,'2026-11-16T12:00:00.000Z'),[]);
 assert.deepEqual(dueFlashcardIds(progress,'2026-11-17T12:00:00.000Z'),['notion-1']);
 assert.deepEqual(dueFlashcardIds(old,'2026-11-10T12:00:00.000Z'),['notion-1']);
 assert.equal(validateFlashcards({...old,reviewedAt:{'notion-1':'invalid'}}),false);
});

test('mixed sessions preserve a balanced direction for each card and validate backups',()=>{
 const ids=['notion-1','notion-2','notion-3','notion-4'];
 const session=createFlashcardSession(ids,'mixed',()=>0.3);
 assert.equal(session.direction,'mixed');
 assert.deepEqual(Object.keys(session.directions).sort(),ids);
 assert.equal(Object.values(session.directions).filter(value=>value==='term').length,2);
 assert.equal(validateFlashcards({status:{},session}),true);
 assert.equal(validateFlashcards({status:{},session:{...session,directions:{'notion-1':'invalid'}}}),false);
 const moved=moveFlashcard(session,1);
 assert.deepEqual(moved.directions,session.directions);
});
