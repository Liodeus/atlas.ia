import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const distinctions=JSON.parse(await readFile(new URL('../src/distinctions.json',import.meta.url),'utf8'));
import themes from '../src/themes.js';
const ids=new Set(themes.flatMap(theme=>theme.entries.map(entry=>entry.id)));

test('distinctions explain both concepts and their difference with valid links',()=>{
  assert.ok(distinctions.length>=24);
  assert.equal(new Set(distinctions.map(d=>d.title)).size,distinctions.length);
  for(const d of distinctions){
    assert.ok(d.title?.trim());
    assert.ok(d.difference?.trim().length>=25,d.title);
    assert.ok(!JSON.stringify(d).includes('\u2014'),d.title);
    for(const side of [d.left,d.right]){
      assert.ok(side?.name?.trim(),d.title);
      assert.ok(side?.explanation?.trim().length>=25,d.title);
      assert.ok(side.concept===null || ids.has(side.concept),`${d.title}: ${side.concept}`);
    }
    assert.notEqual(d.left.name,d.right.name,d.title);
    assert.notEqual(d.left.explanation,d.right.explanation,d.title);
  }
});
