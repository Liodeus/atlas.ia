import test from 'node:test';
import assert from 'node:assert/strict';
import {workshopCatalog} from '../src/workshopCatalog.js';
import {workshopContent,workshopLessonHref,memoryBudget,evaluateWorkshop,workshopValues,workshopQuestions} from '../src/workshops.js';
import {workshopConnections} from '../src/workshopConnections.js';
import {updateWorkshop,validateWorkshops,isWorkshopComplete} from '../src/workshopProgress.js';
import {validateProgress,readStoredProgress} from '../src/core.js';
import {initial} from '../src/appData.js';
import {courseEditorial} from '../src/courseCurriculum.js';
import {pageMetadata,publicPagePaths} from '../src/metadata.js';
import {findLessonAnchor} from '../src/practiceSupport.js';
// Les tests du premier cas isolent ses critères ; les variantes sont testées plus bas.
const pass=(id,values)=>{const checks=evaluateWorkshop(id,values).filter(check=>!check.id.startsWith('next-'));return checks.length>0&&checks.every(check=>check.pass)};
test('workshops have public routes and every help link targets a real course passage',()=>{
 assert.equal(workshopCatalog.length,18);
 assert.deepEqual(Object.keys(workshopContent).sort(),workshopCatalog.map(item=>item.id).sort());
 for(const item of workshopCatalog){
  assert.equal(pageMetadata('/ateliers/'+item.id).heading,item.title);
  assert.ok(publicPagePaths().includes('/ateliers/'+item.id));
  const content=workshopContent[item.id];assert.ok(content.support.length>=2);
  for(const reference of content.support){
   const lesson=courseEditorial[reference.theme][reference.step-1];
   assert.ok(lesson[reference.part].some(section=>section.heading===reference.heading));
   const anchor=findLessonAnchor('#'+workshopLessonHref(reference).split('#')[1],lesson,reference.theme,reference.step);
   assert.ok(anchor);assert.equal(anchor.deep,reference.part==='deepDive');
  }
  for(const question of workshopQuestions(content)){
   if(question.kind==='number'){assert.ok(Number.isFinite(question.answer));assert.ok(question.feedback.length>45);continue}
   const values=question.options.map(option=>option.value);assert.equal(new Set(values).size,values.length);
   for(const answer of (question.answerBy?Object.values(question.answerBy.answers):[question.answer].flat()))assert.ok(values.includes(answer));
   assert.ok(question.options.every(option=>option.feedback.trim().length>0));
  }
 }
 for(const [key,ids] of Object.entries(workshopConnections)){
  const [theme,step]=key.split('-');assert.ok(courseEditorial[theme][step-1]);
  ids.forEach(id=>assert.ok(workshopContent[id]));
 }
 assert.equal(pageMetadata('/ateliers/inconnu').noindex,true);
});
test('the memory mission rejects savings that sacrifice quality, context or concurrency',()=>{
 const good={precision:'8',context:'8192',sequences:'4'},b=memoryBudget(good);
 assert.equal(b.cache,4);assert.equal(b.total,11.4);assert.ok(pass('budget-memoire',good));
 const expectedFailures={precision:'quality',context:'context',sequences:'sequences'};
 for(const [key,value] of Object.entries({precision:'4',context:'2048',sequences:'1'})){
  const checks=evaluateWorkshop('budget-memoire',{...good,[key]:value});
  assert.equal(checks.find(check=>check.id===expectedFailures[key]).pass,false);
 }
 const winners=[];
 for(const precision of ['16','8','4'])for(const context of ['2048','8192','16384'])for(const sequences of ['1','4','8'])if(pass('budget-memoire',{precision,context,sequences}))winners.push({precision,context,sequences});
 assert.deepEqual(winners,[good]);
});
test('the scenarios reject incompatible files and unsupported conclusions',()=>{
 assert.ok(pass('choisir-les-fichiers',{model:'instruct',files:['projector-v2']}));
 for(const values of [{model:'base',files:['projector-v2']},{model:'instruct',files:[]},{model:'instruct',files:['projector-v2','dataset']}])assert.equal(pass('choisir-les-fichiers',values),false);
 assert.ok(pass('fidelite-et-qualite',{candidate:'a',interpretation:'score'}));
 for(const candidate of ['b','c'])assert.equal(pass('fidelite-et-qualite',{candidate,interpretation:'score'}),false);
 assert.equal(pass('fidelite-et-qualite',{candidate:'a',interpretation:'kl'}),false);
 assert.ok(pass('performance-durable',{hypothesis:'thermal',experiment:'cooling'}));
 assert.equal(pass('performance-durable',{hypothesis:'thermal',experiment:'short'}),false);
 assert.equal(pass('performance-durable',{hypothesis:'power',experiment:'cooling'}),false);
 const plan=['build','resources','quality','load'];assert.ok(pass('changer-environnement',{plan}));
 assert.equal(pass('changer-environnement',{plan:[...plan,'copy']}),false);
 assert.equal(pass('changer-environnement',{plan:['build','quality']}),false);
 assert.equal(pass('unknown',{}),false);
});
test('workshop attempts survive progression exports and old backups remain valid',()=>{
 assert.ok(validateProgress(initial));
 const values={precision:'8',context:'8192',sequences:'4'},completed=updateWorkshop(null,values,true,true);
 const progress={...initial,workshops:{'budget-memoire':completed}};
 assert.ok(validateProgress(progress));assert.deepEqual(readStoredProgress(JSON.stringify(progress)).progress,progress);
 const retry=updateWorkshop(completed,{...values,precision:'4'});assert.equal(retry.completed,true);assert.equal(retry.checked,false);
 for(const invalid of [null,[],{'bad id':completed},{a:{...completed,checked:1}},{a:{...completed,values:{precision:{nested:true}}}}])assert.equal(validateWorkshops(invalid),false);
 assert.equal(readStoredProgress(JSON.stringify({...initial,workshops:{a:{}}})).blocked,true);
 assert.deepEqual(workshopValues('budget-memoire',{precision:'-2',context:'999999999',sequences:{}}),{precision:'16',context:'2048',sequences:'1'});
 const files=workshopValues('choisir-les-fichiers',{files:['projector-v2','invented','projector-v2'],model:'instruct'});assert.equal(files.model,'instruct');assert.deepEqual(files.files,['projector-v2']);
});

test('attention and routing distinguish allowed connections, normalization and storage',async()=>{
 const {attentionMix}=await import('../src/workshopsQuantitative.js');
 const mix=attentionMix(['t1','t3','t4','t5']);assert.equal(mix.value,6);assert.deepEqual(mix.positions.map(position=>position.weight),[0.1,0,0.2,0.3,0.4,0]);
 assert.equal(attentionMix([]).value,null);assert.equal(attentionMix(['t1','t1']).value,2);
 assert.ok(pass('masquer-attention',{positions:['t1','t3','t4','t5'],meaning:'combination'}));
 assert.equal(pass('masquer-attention',{positions:['t1','t3','t4','t5','t6'],meaning:'combination'}),false);
 assert.ok(pass('router-experts',{experts:['e1','e2'],memory:'stored'}));
 assert.equal(pass('router-experts',{experts:['e2','e3'],memory:'stored'}),false);
});
test('context planning accepts multiple solutions but never drops essential information',async()=>{
 const {contextBudget}=await import('../src/workshopsQuantitative.js');
 assert.equal(contextBudget({history:'full',documents:'full',output:'1200'}).total,8492);
 const accepted=[];
 for(const history of ['full','summary','none'])for(const documents of ['full','focused','without-exception'])for(const output of ['512','1200','2000']){
  const values={history,documents,output,memory:'sent'},valid=pass('composer-contexte',values);
  if(valid){accepted.push(values);assert.notEqual(history,'none');assert.notEqual(documents,'without-exception');assert.ok(Number(output)>=1200);assert.ok(contextBudget(values).total<=8192)}
 }
 assert.equal(accepted.length,6);
 assert.equal(pass('composer-contexte',{history:'summary',documents:'focused',output:'1200',memory:'screen'}),false);
});
test('numeric answers support French decimals and changed costs change the accepted filter',()=>{
 const good={policy:'regular',precision:'66,7',recall:'90',candidate:'a'};
 assert.ok(pass('comparer-filtres',good));assert.ok(pass('comparer-filtres',{...good,precision:'66.7'}));
 for(const precision of ['',' ','66,6','Infinity','66x','66,7 %','0x42'])assert.equal(pass('comparer-filtres',{...good,precision}),false,precision);
 assert.equal(pass('comparer-filtres',{...good,policy:'sensitive'}),false);
 assert.ok(pass('comparer-filtres',{...good,policy:'sensitive',candidate:'b'}));
 for(const policy of [undefined,'inconnu'])assert.equal(pass('comparer-filtres',{precision:'66.7',recall:'90',policy}),false);
 assert.deepEqual(workshopValues('comparer-filtres',{policy:'inconnu',precision:'66,7',recall:'90'}),{policy:'regular',precision:'66,7',recall:'90'});
});
test('catalog filters cover all workshops once and preserve shareable searches',async()=>{
 const {workshopGroups,readWorkshopFilters,searchWorkshops,workshopCatalogHref}=await import('../src/workshopBrowse.js');
 const ids=workshopGroups.flatMap(group=>group.ids);assert.equal(new Set(ids).size,18);assert.deepEqual(ids.sort(),workshopCatalog.map(item=>item.id).sort());
 for(const group of workshopGroups)assert.equal(searchWorkshops({q:'',group:group.id}).length,group.ids.length);
 assert.deepEqual(searchWorkshops({q:'RAG',group:'all'}).map(item=>item.id).sort(),['assembler-des-preuves','choisir-une-adaptation','composer-une-chaine']);
 assert.equal(searchWorkshops({q:'precision-inconnue',group:'all'}).length,0);
 assert.deepEqual(searchWorkshops({q:'contexte',group:'comprendre'}).map(item=>item.id),['composer-contexte']);
 const filters={q:'erreurs',group:'evaluer'};assert.deepEqual(readWorkshopFilters(workshopCatalogHref(filters).split('?')[1]),filters);
 assert.deepEqual(readWorkshopFilters('?famille=inconnue'),{q:'',group:'all'});
});

test('every extended workshop has 4–6 decisions and its variant participates in validation',()=>{
 for(const item of workshopCatalog){
  const content=workshopContent[item.id],questions=workshopQuestions(content);
  const decisions=questions.length+(item.id==='budget-memoire'?3:content.controls?.length||0);
  assert.ok(decisions>=4&&decisions<=6,item.id+' : '+decisions);
  assert.ok(content.followUp?.scenario.length>=80,item.id);
  assert.equal(new Set(questions.map(question=>question.id)).size,questions.length,item.id);
  const checks=evaluateWorkshop(item.id,workshopValues(item.id,{}));
  for(const question of content.followUp.questions){const check=checks.find(check=>check.id===question.id);assert.ok(check,item.id+' '+question.id);assert.equal(check.pass,false)}
 }
});
test('a correct first case does not compensate for a wrong transfer decision',()=>{
 const success=(id,values)=>evaluateWorkshop(id,values).every(check=>check.pass);
 const attention={positions:['t1','t3','t4','t5'],meaning:'combination','next-direct':['t3','t4','t5'],'next-path':'layers','next-guarantee':'possible'};
 assert.ok(success('masquer-attention',attention));assert.equal(success('masquer-attention',{...attention,'next-direct':['t1','t3','t4','t5']}),false);
 const experts={experts:['e1','e2'],memory:'stored','next-routing':'new','next-distinct':'22','next-cost':'remeasure'};
 assert.ok(success('router-experts',experts));assert.equal(success('router-experts',{...experts,'next-distinct':'18'}),false);
 const context={history:'summary',documents:'focused',output:'1200',memory:'sent','next-plan':'full-history','next-margin':'1900'};
 assert.ok(success('composer-contexte',context));assert.equal(success('composer-contexte',{...context,'next-plan':'summary'}),false);
 const filters={policy:'regular',precision:'66,7',recall:'90',candidate:'a','next-precision':'44,4','next-interpretation':'both'};
 assert.ok(success('comparer-filtres',filters));assert.equal(success('comparer-filtres',{...filters,'next-precision':'80'}),false);
});

test('old successes retain their answers but must complete the enriched version',()=>{
 const old={values:{precision:'8',context:'8192',sequences:'4'},checked:true,completed:true};
 assert.ok(validateProgress({...initial,workshops:{'budget-memoire':old}}));
 assert.equal(isWorkshopComplete(old),false);
 const resumed=updateWorkshop(old,{...old.values,'next-memory-total':'15,4'});
 assert.equal(resumed.completed,false);assert.equal(resumed.checked,false);
 assert.equal(resumed.values.precision,'8');
 assert.ok(isWorkshopComplete(updateWorkshop(resumed,resumed.values,true,true)));
});
