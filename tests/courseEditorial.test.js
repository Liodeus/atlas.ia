import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {courseEditorial} from '../src/courseCurriculum.js';
import themes from '../src/themes.js';

test('all glossary notions are included once in the guided lessons of their theme',()=>{
 let count=0;
 for(const theme of themes){
  const lessons=courseEditorial[theme.id];assert.equal(lessons?.length,3,`theme ${theme.id}`);
  const expected=theme.entries.map(e=>e.id).sort(),actual=lessons.flatMap(lesson=>lesson.concepts).sort();
  assert.deepEqual(actual,expected,`theme ${theme.id}: every notion must be covered exactly once`);
  count+=actual.length;
 }
 assert.equal(count,themes.flatMap(theme=>theme.entries).length);
});

test('each lesson has progressive common material and additional detailed material',()=>{
 for(const theme of themes)for(const [index,lesson] of courseEditorial[theme.id].entries()){
  const label=`${theme.id}-${index+1}`;
  assert.ok(lesson.goal?.trim().length>=30,label);
  assert.ok(lesson.sections?.length>=2,label);
  assert.ok(lesson.deepDive?.length>=2,label);
  assert.ok(lesson.takeaways?.length>=2,label);
  for(const section of [...lesson.sections,...lesson.deepDive]){
   assert.ok(section.heading?.trim(),label);
   assert.ok(section.paragraphs?.length>=2,label);
   for(const paragraph of section.paragraphs)assert.ok(paragraph.trim().length>=30,label);
  }
  assert.ok(!JSON.stringify(lesson).includes('\u2014'),label);
 }
});
