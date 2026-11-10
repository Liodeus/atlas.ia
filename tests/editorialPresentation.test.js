import test from 'node:test';
import assert from 'node:assert/strict';
import {sentenceStart, prioritizedConcepts} from '../src/editorialPresentation.js';
test('definition starts use capitals while preserving brand spellings',()=>{
 assert.equal(sentenceStart('ensemble de techniques.'),'Ensemble de techniques.');
 assert.equal(sentenceStart('vLLM est un moteur.'),'vLLM est un moteur.');
 assert.equal(sentenceStart('gpt-oss est une famille.'),'gpt-oss est une famille.');
 assert.equal(sentenceStart('évaluation du modèle.'),'Évaluation du modèle.');
});
test('essential concepts remain visible without disturbing their relative order',()=>{
 assert.deepEqual(prioritizedConcepts(['a','b','c','d'],{d:{},b:{}},2),{visible:['b','d'],extra:['a','c']});
 assert.deepEqual(prioritizedConcepts(['a','b','c'],{c:{}},2),{visible:['a','c'],extra:['b']});
});
