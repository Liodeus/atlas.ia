import test from 'node:test';
import assert from 'node:assert/strict';
import {courseEditorial} from '../src/courseCurriculum.js';
import {learningOrder,lessonNeighbor} from '../src/lessonNavigation.js';
import {harnessTheme,harnessQuestions} from '../src/extensionHarness.js';

test('les nouveaux thèmes rejoignent le parcours sans déplacer les modules existants',()=>{
 assert.deepEqual(learningOrder.slice(-2),[17,18]);
 assert.deepEqual(lessonNeighbor(16,3,1),{theme:17,step:1});
 assert.equal(courseEditorial[17].length,3);
 assert.equal(courseEditorial[17].flatMap(lesson=>lesson.concepts).length,harnessTheme.entries.length);
 assert.equal(harnessQuestions.length,15);
});
