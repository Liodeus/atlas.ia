import test from 'node:test';import assert from 'node:assert/strict';
import {additionalQuestions} from '../src/additionalQuestions.js';import {authoredQuestions} from '../src/allQuestions.js';import themes from '../src/themes.js';import {grade} from '../src/core.js';
test('additional scenario questions use valid concepts and distinct answers',()=>{
 const ids=new Set(authoredQuestions.map(q=>q.id));
 for(const q of additionalQuestions){assert.ok(!ids.has(q.id));ids.add(q.id);assert.ok(themes.find(t=>t.id===q.theme).entries.some(e=>e.id===q.concept));assert.equal(new Set(q.options).size,q.options.length);assert.ok(q.options.includes(q.answer));assert.ok(grade(q,q.answer));assert.ok(q.explanation.length>20)}
});
