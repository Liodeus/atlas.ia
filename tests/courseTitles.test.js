import test from 'node:test';
import assert from 'node:assert/strict';
import {courseTitles,coursePrerequisites} from '../src/courseTitles.js';
import {lessons} from '../src/content.js';

test('the themes each have three distinct, descriptive course titles',()=>{
 assert.equal(courseTitles.length,lessons.length);
 assert.equal(courseTitles.length,lessons.length);
 for(const titles of courseTitles){
  assert.equal(titles.length,3);
  assert.equal(new Set(titles).size,3);
  for(const title of titles){
   assert.ok(typeof title==='string'&&title.trim().length>10);
   assert.equal(title.includes('\u2014'),false);
  }
 }
});

test('informative prerequisites link to existing lessons without circular dependencies',()=>{
 assert.equal(coursePrerequisites.length,lessons.length);
 for(const [index,links] of coursePrerequisites.entries()){
  assert.ok(Array.isArray(links));
  const destinations=new Set();
  for(const link of links){
   assert.deepEqual(Object.keys(link).sort(),['reason','step','theme']);
   assert.ok(Number.isInteger(link.theme)&&link.theme>=1&&link.theme<=lessons.length);
   assert.ok(Number.isInteger(link.step)&&link.step>=1&&link.step<=3);
   assert.ok(lessons[link.theme-1][link.step]);
   assert.ok(courseTitles[link.theme-1][link.step-1]);
   assert.notEqual(link.theme,index+1);
   assert.ok(typeof link.reason==='string'&&link.reason.trim().length>20);
   assert.equal(link.reason.includes('\u2014'),false);
   const destination=`${link.theme}-${link.step}`;
   assert.equal(destinations.has(destination),false);
   destinations.add(destination);
  }
 }
 const visit=(theme,path=new Set())=>{
  assert.equal(path.has(theme),false,`Circular prerequisite involving theme ${theme}`);
  for(const link of coursePrerequisites[theme-1]) visit(link.theme,new Set([...path,theme]));
 };
 coursePrerequisites.forEach((_,index)=>visit(index+1));
});
test('recommended prerequisites appear earlier in the learning path',async()=>{
 const {learningOrder}=await import('../src/lessonNavigation.js');
 for(let i=0;i<coursePrerequisites.length;i++)for(const prerequisite of coursePrerequisites[i]){
  assert.ok(learningOrder.indexOf(prerequisite.theme)<learningOrder.indexOf(i+1),`theme ${i+1} prerequisite ${prerequisite.theme}`);
 }
});
