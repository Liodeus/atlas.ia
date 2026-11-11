import test from 'node:test';
import assert from 'node:assert/strict';
import {createSearchIndex,searchIndex} from '../src/search.js';
import {entries} from '../src/appData.js';
import {conceptName} from '../src/terminology.js';
import {courseSearchIndex} from '../src/courseSearch.js';

const index=createSearchIndex(entries,{title:conceptName,body:entry=>entry.name+' '+entry.definition});
test('search finds every word independently of order and accents',()=>{
 const direct=searchIndex(index,'vector search').map(result=>result.item.id);
 assert.deepEqual(searchIndex(index,'search vector').map(result=>result.item.id),direct);
 assert.deepEqual(searchIndex(index,'entraînement').map(result=>result.item.id),searchIndex(index,'entrainement').map(result=>result.item.id));
 assert.ok(direct.length>0);
});
test('small typos and transpositions find the intended concepts',()=>{
 for(const query of ['tranformer','transfomer','trasnformer'])assert.equal(conceptName(searchIndex(index,query)[0].item),'Transformer');
 assert.equal(conceptName(searchIndex(index,'serach semantic')[0].item),'Semantic Search');
 assert.equal(searchIndex(index,'zzzzzzzzzzz').length,0);
});
test('short acronyms are exact and all query terms must match',()=>{
 const sample=createSearchIndex([{title:'RAG',text:'documents'},{title:'RIG',text:'tools'},{title:'RAG avancé',text:'tools'}],{title:item=>item.title,body:item=>item.text});
 assert.equal(searchIndex(sample,'rag')[0].item.title,'RAG');
 assert.deepEqual(searchIndex(sample,'rag documents').map(result=>result.item.title),['RAG']);
 assert.equal(searchIndex(sample,'mcp').length,0);
 assert.equal(searchIndex(sample,'   ').length,3);
});
test('course search includes lesson prose and ranks matching titles first',()=>{
 assert.ok(searchIndex(courseSearchIndex,'vector serach').some(({item})=>item.theme===9&&item.step===1));
 assert.ok(searchIndex(courseSearchIndex,'permissions').some(({item})=>item.theme===11&&item.step===3));
 assert.equal(searchIndex(courseSearchIndex,'Indexation puis pipeline RAG')[0].item.step,2);
});
