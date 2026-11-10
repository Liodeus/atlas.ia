import test from 'node:test';import assert from 'node:assert/strict';
import {isDraftOnlyChange,createProgressWriter} from '../src/progressStorage.js';
test('only a change to quiz drafts may be deferred',()=>{
 const before={version:1,completed:[],session:{id:1,index:0,checked:false,drafts:{}}};
 const draft={...before,session:{...before.session,drafts:{q:'42'}}};
 assert.equal(isDraftOnlyChange(before,draft),true);
 assert.equal(isDraftOnlyChange(draft,{...draft,completed:['1-1']}),false);
 assert.equal(isDraftOnlyChange(draft,{...draft,session:{...draft.session,index:1}}),false);
 assert.equal(isDraftOnlyChange(null,draft),false);
});
test('pending draft flushes the latest snapshot; immediate writes supersede it',()=>{
 const saved=[];const writer=createProgressWriter(value=>saved.push(value),()=>{},10000);
 writer.schedule({draft:'a'});writer.schedule({draft:'ab'});assert.deepEqual(saved,[]);
 writer.flush();assert.deepEqual(saved,[{draft:'ab'}]);
 writer.schedule({draft:'abc'});writer.writeNow({submitted:true});writer.flush();
 assert.deepEqual(saved,[{draft:'ab'},{submitted:true}]);writer.cancel();
});
test('storage errors are reported and cancellation protects a blocked backup',()=>{
 let errors=0;const writer=createProgressWriter(()=>{throw Error('unavailable')},()=>errors++,10000);
 writer.schedule({a:1});writer.cancel();writer.flush();assert.equal(errors,0);
 writer.writeNow({a:2});assert.equal(errors,1);
});
test('a delayed draft does not overwrite a newer save from another tab',()=>{
 const saved=[];let conflicts=0;
 const writer=createProgressWriter(value=>saved.push(value),()=>{},10000,()=>false,()=>conflicts++);
 writer.schedule({draft:'42'});writer.flush();
 assert.deepEqual(saved,[]);assert.equal(conflicts,1);
 writer.writeNow({submitted:true});assert.deepEqual(saved,[{submitted:true}]);
});
