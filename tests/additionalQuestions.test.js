import test from 'node:test';import assert from 'node:assert/strict';
import {additionalQuestions} from '../src/additionalQuestions.js';import {authoredQuestions} from '../src/allQuestions.js';import themes from '../src/themes.js';import {grade} from '../src/core.js';
import {courseEditorial} from '../src/courseCurriculum.js';
import {prepareQuizQuestion} from '../src/quizSession.js';
test('additional scenario questions use valid concepts and distinct answers',()=>{
 const ids=new Set(authoredQuestions.map(q=>q.id));
 for(const q of additionalQuestions){assert.ok(!ids.has(q.id));ids.add(q.id);assert.ok(themes.find(t=>t.id===q.theme).entries.some(e=>e.id===q.concept));assert.equal(new Set(q.options).size,q.options.length);assert.ok(q.options.includes(q.answer));assert.ok(grade(q,q.answer));assert.ok(q.explanation.length>20)}
});

test('every lesson has two new scenarios grounded in an identifiable course passage',()=>{
 const scenarios=additionalQuestions.filter(q=>q.id.startsWith('practice-'));
 assert.equal(scenarios.length,108);
 for(const theme of themes){
  const lessons=courseEditorial[theme.id];
  for(const [index,lesson] of lessons.entries()){
   const step=index+1;
   const questions=scenarios.filter(q=>q.theme===theme.id&&q.support.step===step);
   assert.deepEqual(questions.map(q=>q.id),[1,2].map(n=>`practice-${theme.id}-${step}-${n}`));
   for(const q of questions){
    assert.ok(lesson.concepts.includes(q.concept),`${q.id}: concept covered in this lesson`);
    assert.ok(['sections','deepDive'].includes(q.support.part),q.id);
    assert.ok(lesson[q.support.part].some(section=>section.heading===q.support.heading),`${q.id}: source passage exists`);
    assert.ok(['debutant','intermediaire','avance'].includes(q.level),q.id);
    assert.equal(q.kind,'choice',q.id);
    assert.equal(q.options.length,4,q.id);
    assert.equal(q.options.filter(option=>option===q.answer).length,1,q.id);
    for(const option of q.options)assert.equal(grade(q,option),option===q.answer,`${q.id}: ${option}`);
   }
  }
 }
});

test('the complete quiz bank keeps unique identities and distinct prompts',()=>{
 const all=[...authoredQuestions,...additionalQuestions];
 assert.equal(all.length,386);
 assert.equal(new Set(all.map(q=>q.id)).size,all.length);
 assert.equal(new Set(all.map(q=>q.prompt.trim().toLocaleLowerCase('fr'))).size,all.length);
});

test('new questions retain their correct answer and course reference when prepared for a session',()=>{
 const entries=themes.flatMap(t=>t.entries);
 for(const q of additionalQuestions.filter(q=>q.support)){
  const prepared=prepareQuizQuestion(q,entries);
  assert.deepEqual(new Set(prepared.choices),new Set(q.options),q.id);
  assert.deepEqual(prepared.support,q.support,q.id);
  assert.equal(grade(prepared,q.answer),true,q.id);
 }
});
