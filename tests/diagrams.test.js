import test from 'node:test';
import assert from 'node:assert/strict';
import {attentionAllowed,contextBudget,routeExperts,ragScenario,visibleRagPassages,decodedTokens} from '../src/diagramModels.js';
import {courseEditorial} from '../src/courseCurriculum.js';
test('attention masks distinguish causal, bidirectional and local connections',()=>{
 assert.equal(attentionAllowed('causal',2,3),false);
 assert.equal(attentionAllowed('bidirectional',2,3),true);
 assert.equal(attentionAllowed('local',4,1),false);
 assert.equal(attentionAllowed('local',4,2),true);
});
test('a context example signals when the reserved total exceeds capacity',()=>{
 assert.deepEqual(contextBudget(false,30),{used:70,capacity:100,exceeded:false});
 assert.deepEqual(contextBudget(true,30),{used:110,capacity:100,exceeded:true});
});
test('MoE routing changes with token and selects exactly k experts',()=>{
 assert.deepEqual(routeExperts('A',2),[1,3]);
 assert.deepEqual(routeExperts('B',1),[3]);
 assert.deepEqual(routeExperts('B',2),[3,2]);
 const example=courseEditorial[4][1].sections.flatMap(section=>section.paragraphs).find(text=>text.includes('Top-1 utilise'));
 assert.match(example,/Top-1 utilise E1 pour A et E3 pour B/);
 assert.match(example,/Top-2 ajoute E3 pour A et E2 pour B/);
});
test('RAG retrieval does not change when reranking is enabled',()=>{
 const a=ragScenario('cache',false),b=ragScenario('cache',true);
 assert.deepEqual(a.retrieved,b.retrieved);
 assert.deepEqual(visibleRagPassages(b,0),b.retrieved);
 assert.deepEqual(visibleRagPassages(b,1),b.ranked);
 assert.notDeepEqual(b.retrieved,b.ranked);
 assert.equal(b.reference,'P1');
});
test('Decode exposes only the continuation tokens already generated',()=>{
 assert.deepEqual(decodedTokens(0),[]);
 assert.deepEqual(decodedTokens(2),['dort','sur']);
});
