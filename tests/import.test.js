import test from 'node:test';
import assert from 'node:assert/strict';
import {createIdAssigner} from '../scripts/id-map.mjs';
test('reordering or inserting concepts preserves previously assigned IDs',()=>{
 const assign=createIdAssigner([{id:1,entries:[{id:'notion-1',name:'Alpha'},{id:'notion-2',name:'Beta'}]}]);
 assert.equal(assign(1,'Beta'),'notion-2');
 assert.equal(assign(1,'Gamma'),'notion-3');
 assert.equal(assign(1,'Alpha'),'notion-1');
});
test('the same term in another theme receives a distinct ID',()=>{
 const assign=createIdAssigner([{id:1,entries:[{id:'notion-1',name:'Alpha'}]}]);
 assert.equal(assign(2,'Alpha'),'notion-2');
});
