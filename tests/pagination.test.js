import test from 'node:test';
import assert from 'node:assert/strict';
import {paginate} from '../src/pagination.js';
test('large glossaries show only the requested page of entries',()=>{
 const result=paginate(Array.from({length:506},(_,i)=>i),1,24);
 assert.equal(result.items.length,24);assert.equal(result.total,506);assert.equal(result.pages,22);
 assert.equal(result.first,1);assert.equal(result.last,24);
});
test('filtering or empty results clamp page without losing entries',()=>{
 const clamped=paginate([1,2,3],9,2);assert.equal(clamped.page,2);assert.deepEqual(clamped.items,[3]);
 const empty=paginate([],4,24);assert.equal(empty.page,1);assert.equal(empty.first,0);assert.equal(empty.last,0);
});
