import test from 'node:test';
import assert from 'node:assert/strict';
import {learningPaths,learningPathGroups,findLearningPath,learningPathLink,resumeLearningPath,pathForLesson,isCourseReturnLink} from '../src/learningPaths.js';
import {courseEditorial} from '../src/courseCurriculum.js';
import {validateProgress} from '../src/core.js';

test('goal paths reuse existing lessons and finish in a bounded sequence',()=>{
 assert.equal(new Set(learningPaths.map(path=>path.id)).size,18);
 assert.equal(new Set(learningPaths.map(path=>path.lessons.map(lesson=>`${lesson.theme}-${lesson.step}`).sort().join(','))).size,learningPaths.length,'each path has a distinct selection of lessons');
 const groups=new Set(learningPathGroups.map(group=>group.id));
 for(const group of groups)assert.ok(learningPaths.some(path=>path.group===group));
 for(const path of learningPaths){
  assert.ok(groups.has(path.group));
  assert.ok(path.level&&path.prerequisite&&path.description);
  assert.equal(new Set(path.outcomes).size,3);
  assert.ok(path.lessons.length>=5&&path.lessons.length<=10);
  assert.equal(new Set(path.lessons.map(lesson=>`${lesson.theme}-${lesson.step}`)).size,path.lessons.length);
  for(const lesson of path.lessons)assert.ok(courseEditorial[lesson.theme][lesson.step-1]);
 }
});
test('notion return links preserve every valid goal and reject unrelated or external destinations',()=>{
 for(const path of learningPaths)for(const lesson of path.lessons){
  assert.equal(isCourseReturnLink(learningPathLink(path,lesson)),true);
  assert.equal(isCourseReturnLink(lessonPathForTest(lesson)),true);
 }
 assert.equal(isCourseReturnLink('/cours/1?etape=2'),true);
 for(const value of [null,'https://example.com/cours/1/lecons/1','//example.com','/cours/1/lecons/1?parcours=production','/cours/1/lecons/1?parcours=inconnu','/cours/1/lecons/4','/cours/1/lecons/1?parcours=bases&redirect=elsewhere'])assert.equal(isCourseReturnLink(value),false);
});
const lessonPathForTest=({theme,step})=>`/cours/${theme}/lecons/${step}`;
test('goal progress shares completed lessons and resumes an unfinished lesson',()=>{
 const path=findLearningPath('bases');
 assert.deepEqual(resumeLearningPath(path,{completed:['1-1'],lastLesson:{theme:9,step:1}}),{theme:1,step:2});
 const data={version:1,completed:['1-1'],favorites:[],errors:[],history:[],lastLesson:{theme:5,step:2,goal:'bases'}};
 assert.equal(validateProgress(data),true);
 assert.deepEqual(resumeLearningPath(path,data),data.lastLesson);
 assert.equal(resumeLearningPath(path,{completed:path.lessons.map(lesson=>`${lesson.theme}-${lesson.step}`)}),null);
});
test('a goal is carried only through its own lessons',()=>{
 const path=findLearningPath('bases');
 assert.equal(learningPathLink(path,{theme:1,step:1}),'/cours/1/lecons/1?parcours=bases');
 assert.equal(learningPathLink(path,{theme:17,step:2}),'/cours/17/lecons/2');
 assert.equal(pathForLesson('inconnu',{theme:1,step:1}),null);
 assert.equal(pathForLesson('bases',{theme:17,step:2}),null);
});
