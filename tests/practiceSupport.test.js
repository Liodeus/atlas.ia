import test from 'node:test';
import assert from 'node:assert/strict';
import {courseEditorial} from '../src/courseCurriculum.js';
import {lessonSectionId,lessonPracticeId,practiceSupport,findLessonAnchor} from '../src/practiceSupport.js';

test('every exercise refers to a small set of real passages from its own lesson',()=>{
 for(const [theme,lessons] of Object.entries(courseEditorial))for(const [index,lesson] of lessons.entries()){
  const step=index+1,label=`${theme}-${step}`,references=lesson.practice.support;
  assert.ok(Array.isArray(references)&&references.length>=1&&references.length<=4,label);
  const resolved=practiceSupport(lesson,theme,step);
  assert.equal(resolved.length,references.length,label+' missing section');
  assert.equal(new Set(resolved.map(reference=>reference.id)).size,references.length,label+' duplicate reference');
  for(const reference of resolved){
   assert.deepEqual(Object.keys(reference).sort(),['heading','id','part']);
   assert.equal(lesson[reference.part].filter(section=>section.heading===reference.heading).length,1,label+' ambiguous heading');
   assert.equal(findLessonAnchor('#'+reference.id,lesson,theme,step)?.id,reference.id);
  }
  const ids=['sections','deepDive'].flatMap(part=>lesson[part].map(section=>lessonSectionId(theme,step,part,section.heading)));
  assert.equal(new Set(ids).size,ids.length,label+' duplicate anchor');
 }
});

test('anchor resolution preserves lesson scope and identifies deep links that require detailed mode',()=>{
 const lesson=courseEditorial[1][0];
 const base=lessonSectionId(1,1,'sections',lesson.sections[0].heading),deep=lessonSectionId(1,1,'deepDive',lesson.deepDive[0].heading);
 assert.deepEqual(findLessonAnchor('#'+base,lesson,1,1),{id:base,deep:false,practice:false});
 assert.deepEqual(findLessonAnchor('#'+deep,lesson,1,1),{id:deep,deep:true,practice:false});
 assert.deepEqual(findLessonAnchor('#'+lessonPracticeId(1,1),lesson,1,1),{id:lessonPracticeId(1,1),deep:true,practice:true});
 assert.equal(findLessonAnchor('#'+deep,lesson,1,2),null);
 assert.equal(findLessonAnchor('#unknown',lesson,1,1),null);
 assert.equal(findLessonAnchor('#%bad-escape',lesson,1,1),null);
 const invalid={...lesson,practice:{...lesson.practice,support:[{part:'sections',heading:'Section disparue'}]}};
 assert.deepEqual(practiceSupport(invalid,1,1),[]);
});
