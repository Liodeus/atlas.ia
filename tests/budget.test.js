import test from 'node:test';import assert from 'node:assert/strict';
import {initialJavaScriptFiles} from '../scripts/initial-budget.mjs';
test('initial JS budget counts entry and preloaded modules exactly once',()=>{
 const html='<script type="module" src="/atlas.ia/assets/index-a.js"></script><link rel="modulepreload" href="/atlas.ia/assets/runtime-b.js"><link rel="modulepreload" href="/atlas.ia/assets/runtime-b.js"><link rel="stylesheet" href="/atlas.ia/assets/app.css">';
 assert.deepEqual(initialJavaScriptFiles(html),['index-a.js','runtime-b.js']);
});
