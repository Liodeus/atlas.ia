import test from 'node:test';
import assert from 'node:assert/strict';
import {lessonNeighbor,shouldHandleLessonArrow} from '../src/lessonNavigation.js';
test('arrow navigation crosses theme boundaries and stops at the ends',()=>{
 assert.deepEqual(lessonNeighbor(1,1,1),{theme:1,step:2});
 assert.deepEqual(lessonNeighbor(1,3,1),{theme:5,step:1});
 assert.deepEqual(lessonNeighbor(5,1,-1),{theme:1,step:3});
 assert.deepEqual(lessonNeighbor(10,3,1),{theme:2,step:1});
 assert.equal(lessonNeighbor(1,1,-1),null);
 assert.equal(lessonNeighbor(18,3,1),null);
});
test('arrow shortcuts ignore controls, modifiers and repeats',()=>{
 const base={key:'ArrowRight',target:{closest:()=>null},repeat:false};
 assert.equal(shouldHandleLessonArrow(base),true);
 assert.equal(shouldHandleLessonArrow({...base,target:{closest:()=>({})}}),false);
 assert.equal(shouldHandleLessonArrow({...base,target:{isContentEditable:true}}),false);
 assert.equal(shouldHandleLessonArrow({...base,ctrlKey:true}),false);
 assert.equal(shouldHandleLessonArrow({...base,repeat:true}),false);
 assert.equal(shouldHandleLessonArrow({...base,key:'ArrowDown'}),false);
});
