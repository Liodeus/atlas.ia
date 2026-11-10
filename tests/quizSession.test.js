import test from 'node:test';import assert from 'node:assert/strict';
import {prepareQuizQuestion} from '../src/quizSession.js';
test('authored choices and ordering do not scan the glossary for distractors',()=>{
 const inaccessible=new Proxy([],{get(){throw Error('le glossaire ne devrait pas être lu')}});
 const choice={kind:'choice',answer:'A',options:['A','B'],theme:1};
 assert.deepEqual(new Set(prepareQuizQuestion(choice,inaccessible,()=>0).choices),new Set(['A','B']));
 const order={kind:'order',answer:['A','B']};assert.deepEqual(new Set(prepareQuizQuestion(order,inaccessible,()=>0).choices),new Set(['A','B']));
 assert.deepEqual(prepareQuizQuestion({kind:'number',answer:2},inaccessible,()=>0).choices,[]);
});
test('legacy definition questions still obtain distractors from their own theme',()=>{
 const entries=[{theme:1,definition:'A'},{theme:1,definition:'B'},{theme:1,definition:'C'},{theme:2,definition:'D'}];
 const result=prepareQuizQuestion({kind:'choice',theme:1,answer:'A'},entries,()=>0);
 assert.deepEqual(new Set(result.choices),new Set(['A','B','C']));
});
