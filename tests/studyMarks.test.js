import test from 'node:test';import assert from 'node:assert/strict';
import {toggleStudyMark,cleanStudyMarks,validateStudyMarks} from '../src/studyMarks.js';
test('question and concept markers are independent and toggle',()=>{
 let marks=toggleStudyMark(undefined,'questions','q-1','review');
 marks=toggleStudyMark(marks,'concepts','notion-1','deep');
 assert.deepEqual(marks,{questions:{'q-1':'review'},concepts:{'notion-1':'deep'}});
 marks=toggleStudyMark(marks,'questions','q-1','review');
 assert.deepEqual(marks.questions,{});assert.equal(marks.concepts['notion-1'],'deep');
 assert.equal(validateStudyMarks(marks),true);
 assert.equal(validateStudyMarks({questions:{q:'bad'},concepts:{}}),false);
});
test('import removes markers whose question or concept no longer exists',()=>{
 const marks={questions:{'q-1':'review','q-2':'deep'},concepts:{'notion-1':'deep','notion-2':'review'}};
 assert.deepEqual(cleanStudyMarks(marks,new Set(['q-1']),new Set(['notion-1'])),{questions:{'q-1':'review'},concepts:{'notion-1':'deep'}});
});
