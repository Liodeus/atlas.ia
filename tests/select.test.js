import test from 'node:test';
import assert from 'node:assert/strict';
import {nextSelectIndex} from '../src/select.js';
test('keyboard navigation wraps through select options',()=>{
 assert.equal(nextSelectIndex('ArrowDown',2,3),0);
 assert.equal(nextSelectIndex('ArrowUp',0,3),2);
 assert.equal(nextSelectIndex('Home',1,3),0);
 assert.equal(nextSelectIndex('End',1,3),2);
});
test('empty options do not produce an invalid focused index',()=>assert.equal(nextSelectIndex('ArrowDown',0,0),-1));
