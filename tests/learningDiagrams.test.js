import test from 'node:test';
import assert from 'node:assert/strict';
import {diagramPlacements,diagramInfo,demoPlacements,demoStep,conceptDiagrams,comparisonDiagram,samplingBase,temperatureDistribution,nucleusCount,confusionCounts,classificationMetrics} from '../src/learningDiagrams.js';
import {courseEditorial} from '../src/courseCurriculum.js';
import themes from '../src/themes.js';
import {conceptName} from '../src/terminology.js';
import distinctions from '../src/distinctions.json' with {type:'json'};

test('all 22 diagrams have a real editorial anchor and a caption explaining their scope',()=>{
 assert.equal(diagramPlacements.length,22);
 assert.equal(new Set(diagramPlacements.map(p=>p.id)).size,22);
 for(const p of diagramPlacements){
  const sections=courseEditorial[p.theme][p.step-1][p.deep?'deepDive':'sections'];
  assert.equal(sections.filter(s=>s.heading===p.section).length,1,p.id);
  assert.ok(diagramInfo[p.id].title&&diagramInfo[p.id].note,p.id);
 }
});
test('existing demonstrations move to the lesson that teaches the illustrated subject',()=>{
 assert.equal(demoStep(6),3);assert.equal(demoStep(10),1);assert.equal(demoStep(12),1);
 assert.equal(demoStep(17),null);
 for(const [id,p] of Object.entries(demoPlacements))assert.ok(courseEditorial[id][p.step-1].sections.some(s=>s.heading===p.section),id);
});
test('reused illustrations resolve existing notions and the four promised comparisons',()=>{
 const names=new Set(themes.flatMap(t=>t.entries.map(conceptName)));
 for(const [name,id] of Object.entries(conceptDiagrams)){assert.ok(names.has(name),name);assert.ok(diagramInfo[id],id)}
 assert.equal(distinctions.filter(d=>comparisonDiagram(d)).length,4);
});
test('temperature example preserves probabilities and increases concentration at lower temperature',()=>{
 const p=temperatureDistribution(samplingBase,.5);
 assert.ok(Math.abs(p.reduce((a,b)=>a+b,0)-1)<1e-12);
 assert.ok(p[0]>samplingBase[0]);assert.ok(p.at(-1)<samplingBase.at(-1));
 assert.ok(Math.abs(p[0]-.25/.3408)<1e-12);
 assert.deepEqual(temperatureDistribution(samplingBase,1),samplingBase);
});
test('Top-p includes the threshold-crossing candidate and handles exact thresholds',()=>{
 assert.equal(nucleusCount(samplingBase,.8),3);
 assert.equal(nucleusCount(samplingBase,.75),2);
 assert.equal(nucleusCount(samplingBase,1),5);
});
test('confusion matrix totals and percentages match the 100-message lesson example',()=>{
 const {tp,fn,fp,tn}=confusionCounts;
 assert.equal(tp+fn+fp+tn,100);
 const m=classificationMetrics(confusionCounts);
 assert.equal(m.accuracy,.88);assert.equal(m.precision,2/3);assert.equal(m.recall,.8);
 assert.ok(Math.abs(m.f1-8/11)<1e-12);
});
