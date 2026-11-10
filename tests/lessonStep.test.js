import test from 'node:test';
import assert from 'node:assert/strict';
import {parseLessonStep, nextIncompleteLesson} from '../src/lessonNavigation.js';

test('invalid lesson parameters fall back safely to the first lesson', () => {
  for (const value of [null, '', '1.5', '0', '4', '-1', 'abc', 'Infinity', '2e0', '01']) assert.equal(parseLessonStep(value), 1);
  assert.equal(parseLessonStep('1'), 1);
  assert.equal(parseLessonStep('2'), 2);
  assert.equal(parseLessonStep('3'), 3);
});
test('resume follows the recommended order and handles completed paths', () => {
  assert.deepEqual(nextIncompleteLesson([]), {theme:1,step:1});
  assert.deepEqual(nextIncompleteLesson(['1-1','1-2','1-3']), {theme:5,step:1});
  assert.equal(nextIncompleteLesson([1,5,10,2,3,6,7,4,8,9,11,12,13,14,15,16,17,18].flatMap(t=>[1,2,3].map(s=>`${t}-${s}`))), null);
});

test('a saved lesson is used for resumption only while it remains unfinished and valid', async()=>{
 const {resumeLesson}=await import('../src/lessonNavigation.js');
 assert.deepEqual(resumeLesson({completed:[],lastLesson:{theme:5,step:2}}),{theme:5,step:2});
 assert.deepEqual(resumeLesson({completed:['5-2'],lastLesson:{theme:5,step:2}}),{theme:1,step:1});
 assert.deepEqual(resumeLesson({completed:[],lastLesson:{theme:999,step:2}}),{theme:1,step:1});
});
