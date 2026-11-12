import test from 'node:test';
import assert from 'node:assert/strict';
import {pageMetadata,publicPagePaths,normalizeSiteUrl} from '../src/metadata.js';
import {metadataTags} from '../scripts/static-pages.mjs';
import {learningPaths} from '../src/learningPaths.js';

test('each lesson and notion gets its own canonical title and description',()=>{
 const first=pageMetadata('/cours/1/lecons/1','?parcours=bases','https://example.com/atlas/');
 const second=pageMetadata('/cours/1/lecons/2/','','https://example.com/atlas/');
 assert.notEqual(first.title,second.title);assert.notEqual(first.description,second.description);
 assert.equal(first.url,'https://example.com/atlas/cours/1/lecons/1');
 assert.equal(pageMetadata('/cours/1','?etape=2','https://example.com/atlas/').url,second.url);
 assert.equal(pageMetadata('/notions/notion-2').title,'Machine Learning (ML) | Atlas IA');
 assert.match(metadataTags(first),/property="og:title"/);
 assert.match(metadataTags(first),/name="twitter:card" content="summary_large_image"/);
});
test('the path catalog and all goal pages have public addresses without the retired selection',()=>{
 assert.match(pageMetadata('/parcours').title,/parcours d’apprentissage/);
 assert.equal(publicPagePaths().includes('/essentiels'),false);
 assert.equal(pageMetadata('/essentiels').noindex,true);
 for(const path of learningPaths){
  const url='/parcours/'+path.id;
  assert.equal(pageMetadata(url).heading,path.title);
  assert.ok(publicPagePaths().includes(url));
 }
});
test('unknown pages are not indexed and public sitemap paths are unique and valid',()=>{
 for(const path of ['/notions/unknown','/themes/900','/cours/1/lecons/4','/parcours/unknown']){
  const meta=pageMetadata(path);assert.equal(meta.noindex,true);assert.equal(meta.url,null);
 }
 const paths=publicPagePaths();assert.equal(new Set(paths).size,paths.length);
 assert.equal(paths.filter(path=>path.startsWith('/notions/')).length,577);
 assert.equal(paths.filter(path=>path.startsWith('/cours/')).length,54);
 assert.ok(!paths.includes('/progression'));
 for(const path of paths)assert.equal(pageMetadata(path).noindex,false,path);
});
test('public URL configuration and HTML metadata are escaped safely',()=>{
 assert.equal(normalizeSiteUrl('https://example.com/atlas'),'https://example.com/atlas/');
 assert.throws(()=>normalizeSiteUrl('javascript:alert(1)'));
 assert.throws(()=>normalizeSiteUrl('https://user:secret@example.com'));
 const html=metadataTags({...pageMetadata('/'),title:'A < B & "C"'});
 assert.ok(html.includes('A &lt; B &amp; &quot;C&quot;'));assert.ok(!html.includes('A < B'));
});
