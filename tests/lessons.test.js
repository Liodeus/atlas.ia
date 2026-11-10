import test from 'node:test';
import assert from 'node:assert/strict';
import {lessonExtras,lessonSources} from '../src/lessonExtras.js';
import {lessons as allLessons} from '../src/content.js';
test('every theme has three complete examples and a cited source',()=>{
 assert.equal(lessonExtras.length,allLessons.length);
 assert.equal(lessonSources.length,allLessons.length);
 for(const lessons of lessonExtras){
  assert.equal(lessons.length,3);
  for(const lesson of lessons) for(const key of ['example','question','answer']){
   assert.ok(lesson[key].trim().length>20);
   assert.equal(lesson[key].includes('—'),false);
  }
 }
 for(const [name,url] of lessonSources){assert.ok(name);assert.match(url,/^https:\/\//)}
});
