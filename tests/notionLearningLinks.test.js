import test from 'node:test';
import assert from 'node:assert/strict';
import themes from '../src/themes.js';
import comparisons from '../src/distinctions.json' with {type:'json'};
import {courseEditorial} from '../src/courseCurriculum.js';
import {courseTitles} from '../src/courseTitles.js';
import {buildNotionLearningLinks,getNotionLearningLinks} from '../src/notionLearningLinks.js';
const notionLearningLinks=buildNotionLearningLinks(themes,courseEditorial,comparisons,courseTitles);

test('individual links are lazy, cached and consistent with the full audit index',()=>{
 assert.equal(getNotionLearningLinks('missing'),null);
 const links=getNotionLearningLinks('notion-465');
 assert.equal(getNotionLearningLinks('notion-465'),links);
 assert.deepEqual(links,notionLearningLinks['notion-465']);
 assert.ok(links.excerpts[0].text.includes('llama.cpp'));
 assert.ok(getNotionLearningLinks('notion-262').excerpts[0].text.startsWith('Retrieval constitue'));
});

test('every notion links to its assigned lesson, with verbatim common-course excerpts',()=>{
 assert.equal(Object.keys(notionLearningLinks).length,themes.flatMap(theme=>theme.entries).length);
 for(const theme of themes)for(const entry of theme.entries){
  const {course,excerpts,distinctions}=notionLearningLinks[entry.id];
  const lesson=courseEditorial[course.theme][course.step-1];
  assert.equal(course.theme,theme.id);
  assert.ok(lesson.concepts.includes(entry.id),entry.id);
  assert.equal(course.path,`/cours/${course.theme}/lecons/${course.step}`);
  assert.ok(excerpts.length<=2,entry.id);
  assert.ok(excerpts.length>0,entry.id);
  for(const excerpt of excerpts){
   assert.equal(excerpt.paragraph,lesson.sections[excerpt.sectionIndex].paragraphs[excerpt.paragraphIndex]);
   assert.ok(excerpt.paragraph.includes(excerpt.text),entry.id);
   assert.ok(excerpt.text.length<=650,entry.id);
  }
  for(const link of distinctions){
   assert.equal(comparisons[link.index][link.side].concept,entry.id);
   assert.ok(!link.counterpartConcept||themes.flatMap(t=>t.entries).some(e=>e.id===link.counterpartConcept));
  }
 }
});

test('matching rejects substrings, lowercase acronym words and unassigned lesson material',()=>{
 const entries=[{id:'a',name:'AI',theme:1},{id:'b',name:'RAG',theme:1},{id:'c',name:'PAD Token',theme:1},{id:'d',name:'Attention',theme:1}];
 const common=['RLAIF et fragments ne définissent pas les termes recherchés.','J’ai fait une recherche ; le padding est différent.','FlashAttention est une méthode spécialisée.'];
 const links=buildNotionLearningLinks([{id:1,entries}],{1:[{concepts:['a','b','c','d'],sections:[{heading:'Test',paragraphs:common}],deepDive:[{paragraphs:['AI, RAG, PAD Token et Attention.']}]},{concepts:[],sections:[{heading:'Autre',paragraphs:['AI, RAG, PAD Token et Attention.']}]}]},[],[['Test','Autre']]);
 for(const entry of entries)assert.deepEqual(links[entry.id].excerpts,[],entry.id);
});

test('distinctions are linked by exact concept IDs, never by names',()=>{
 const links=buildNotionLearningLinks([{id:1,entries:[{id:'a',name:'RAG',theme:1}]}],{1:[{concepts:['a'],sections:[{heading:'Recherche',paragraphs:['RAG fournit des sources au générateur.']}]}]},[{title:'RAG ou autre',left:{name:'RAG',concept:null},right:{name:'autre',concept:'b'}}],[['Recherche']]);
 assert.deepEqual(links.a.distinctions,[]);
 assert.equal(links.a.excerpts[0].text,'RAG fournit des sources au générateur.');
});

test('Tensor Cores and cache optimizations do not replace the underlying concept',()=>{
 const tensor=getNotionLearningLinks('notion-456');
 assert.ok(tensor.excerpts.length>=1&&tensor.excerpts.length<=2);
 assert.ok(tensor.excerpts.every(excerpt=>/\bTensors?\b(?!\s+Cores?\b)/.test(excerpt.text)));
 assert.ok(tensor.excerpts[0].text.startsWith('Un Tensor est un tableau'));
 const cache=getNotionLearningLinks('notion-232');
 assert.deepEqual([cache.excerpts[0].sectionIndex,cache.excerpts[0].paragraphIndex],[0,0]);
 assert.ok(cache.excerpts[0].text.includes('Keys et Values'));
});

test('selected excerpts retain the terms needed to understand their comparisons',()=>{
 const adam=getNotionLearningLinks('notion-165').excerpts[0].text;
 assert.ok(adam.includes('Parameters')&&adam.includes('AdamW'));
 const underfitting=getNotionLearningLinks('notion-176').excerpts[0].text;
 assert.ok(underfitting.includes('Underfitting')&&underfitting.includes('Overfitting'));
 const diffusion=getNotionLearningLinks('notion-431').excerpts[0].text;
 assert.ok(diffusion.includes('Latent Space'));
});
