import test from 'node:test';
import assert from 'node:assert/strict';
import {moveQuizSession,beginQuestionEdit,saveQuestionDraft,commitQuizAnswer,cancelQuestionEdit,validateProgress} from '../src/core.js';
const makeSession=()=>({id:1,mode:'practice',index:1,checked:false,finished:false,items:[{id:'a',theme:1,kind:'choice',prompt:'Q1',answer:'oui',choices:['oui','non'],explanation:'E1'},{id:'b',theme:1,kind:'choice',prompt:'Q2',answer:'x',choices:['x','y'],explanation:'E2'}],answers:{a:{value:'non',correct:false}}});
test('a previous answer stays visible and can be revised without duplicate scores',()=>{
 let s=moveQuizSession(makeSession(),0);assert.equal(s.checked,true);
 s=beginQuestionEdit(s,'a');assert.equal(s.checked,false);assert.equal(s.drafts.a,'non');
 s=saveQuestionDraft(s,'a','oui');s=commitQuizAnswer(s,'a','oui',true);
 assert.equal(s.answers.a.correct,true);assert.equal(s.answers.a.value,'oui');assert.equal(Object.keys(s.answers).length,1);assert.equal(s.checked,true);
});
test('an unfinished answer survives navigating away and reloading',()=>{
 let s=saveQuestionDraft(makeSession(),'b','x');s=moveQuizSession(s,0);s=moveQuizSession(s,1);
 assert.equal(s.checked,false);assert.equal(s.drafts.b,'x');
 assert.equal(validateProgress({version:1,completed:[],favorites:[],history:[],errors:[],session:JSON.parse(JSON.stringify(s))}),true);
});
test('canceling an edit restores the validated answer',()=>{
 let s=moveQuizSession(makeSession(),0);s=beginQuestionEdit(s,'a');s=saveQuestionDraft(s,'a','oui');s=cancelQuestionEdit(s,'a');
 assert.equal(s.checked,true);assert.equal(s.answers.a.value,'non');assert.equal(s.drafts.a,undefined);
});
test('revising a finished quiz replaces its history score instead of creating a second attempt',async()=>{
 const {upsertQuizHistory}=await import('../src/core.js');
 const previous=[{id:1,correct:1,total:2,date:'2026-01-01T00:00:00.000Z'},{id:2,correct:2,total:2,date:'2026-01-01T00:00:00.000Z'}];
 const updated=upsertQuizHistory(previous,{id:1,correct:2,total:2,date:'2026-01-02T00:00:00.000Z'});
 assert.equal(updated.length,2);assert.equal(updated.filter(h=>h.id===1).length,1);assert.equal(updated.find(h=>h.id===1).correct,2);
});
test('a checked session without its current answer is rejected without overwriting storage',()=>{
 const session={...makeSession(),checked:true};
 assert.equal(validateProgress({version:1,completed:[],favorites:[],history:[],errors:[],session}),false);
});
