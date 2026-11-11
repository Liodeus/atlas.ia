import test from 'node:test';
import assert from 'node:assert/strict';
import {learningPaths} from '../src/learningPaths.js';
import {searchLearningPaths,readPathFilters,pathCatalogHref} from '../src/pathSearch.js';

test('path search finds objectives and lesson topics with accent and typo tolerance',()=>{
 assert.equal(searchLearningPaths().length,learningPaths.length);
 assert.equal(searchLearningPaths({q:'securite'}).some(path=>path.id==='securite'),true);
 assert.equal(searchLearningPaths({q:'memorie'}).some(path=>path.id==='memoire'),true);
 assert.equal(searchLearningPaths({q:'quantization'}).some(path=>path.id==='local'),true);
 assert.equal(searchLearningPaths({q:'MCP'})[0].id,'mcp');
 assert.equal(searchLearningPaths({q:'zzzintrouvable'}).length,0);
});
test('path search combines family and query filters without leaking other families',()=>{
 assert.deepEqual(searchLearningPaths({group:'fiabilite'}).map(path=>path.id),['evaluation','securite','confidentialite']);
 const filtered=searchLearningPaths({q:'MCP',group:'applications'});
 assert.ok(filtered.some(path=>path.id==='mcp'));
 assert.ok(filtered.every(path=>path.group==='applications'));
 assert.equal(searchLearningPaths({q:'MCP',group:'reperes'}).length,0);
});
test('catalog filter URLs round trip and keep the return destination local',()=>{
 const filters={q:'mémoire & contexte',group:'applications'},href=pathCatalogHref(filters);
 assert.ok(href.startsWith('/parcours?'));
 assert.deepEqual(readPathFilters(href.split('?')[1]),filters);
 assert.deepEqual(readPathFilters('?famille=inconnue&q=MCP'),{q:'MCP',group:'all'});
 assert.equal(readPathFilters('?q='+'a'.repeat(300)).q.length,180);
 assert.equal(pathCatalogHref({group:'https://example.com',q:42}),'/parcours');
});
