import test from 'node:test';
import assert from 'node:assert/strict';
import {courseEditorial} from '../src/courseCurriculum.js';
import {countWords,lessonTiming} from '../src/courseTiming.js';

test('all lessons have substantial distinct advanced material and a worked exercise',()=>{
 for(const [theme,lessons] of Object.entries(courseEditorial))for(const [index,lesson] of lessons.entries()){
  const label=`${theme}-${index+1}`,common=lesson.sections.flatMap(section=>section.paragraphs),advanced=lesson.deepDive.flatMap(section=>section.paragraphs);
  assert.ok(countWords(common.join(' '))>=620,label+' essential reading');
  assert.ok(countWords(advanced.join(' '))>=700,label+' additional reading');
  assert.ok(advanced.every(paragraph=>!common.includes(paragraph)),label+' no repeated paragraph');
  assert.ok(lesson.practice?.prompt.length>=100,label+' transfer exercise');
  assert.ok(lesson.practice.solution.length>=3,label+' reasoned solution');
  assert.ok(Number.isInteger(lesson.practice.minutes)&&lesson.practice.minutes>=2&&lesson.practice.minutes<=10,label+' practice budget');
  assert.ok(lesson.references.length>=2,label+' primary references');
  for(const reference of lesson.references){assert.ok(reference.label.trim().length>3);assert.equal(new URL(reference.url).protocol,'https:')}
  const timing=lessonTiming(Number(theme),index+1,lesson);
  assert.ok(timing.essential.min>=5,label+' essential duration');
  assert.ok(timing.detailed.min>=timing.essential.min+5,label+' meaningful additional time');
  assert.ok(timing.detailed.max>timing.detailed.min);
 }
});
test('estimated time changes with actual text and the exercise budget',()=>{
 const lesson=courseEditorial[1][0],before=lessonTiming(1,1,lesson);
 const added=structuredClone(lesson);added.deepDive.push({heading:'Autre cas',paragraphs:['mot '.repeat(660)]});
 const after=lessonTiming(1,1,added);
 assert.deepEqual(after.essential,before.essential);
 assert.ok(after.detailed.min>=before.detailed.min+3);
 added.practice.minutes+=2;
 assert.equal(lessonTiming(1,1,added).detailed.min,after.detailed.min+2);
});
