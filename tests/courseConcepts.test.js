import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {courseConcepts} from '../src/courseConcepts.js';
import themes from '../src/themes.js';
test('each step links to relevant concepts from its own theme',()=>{
 assert.equal(courseConcepts.length,themes.length);
 for(const [i,groups] of courseConcepts.entries()){
  assert.equal(groups.length,3);
  const available=new Set(themes[i].entries.map(e=>e.id));
  for(const group of groups){assert.ok(group.length);for(const id of group)assert.ok(available.has(id),`${id} is not in theme ${i+1}`)}
  const covered=new Set(groups.flat());for(const e of themes[i].entries.filter(e=>e.priority))assert.ok(covered.has(e.id),`${e.id} is missing`);
 }
});
