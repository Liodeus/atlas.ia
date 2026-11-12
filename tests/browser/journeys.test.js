import {test, before, after} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {chromium} from 'playwright';
import {notionContent} from '../../src/notionContent.js';
import {notionContentSources} from '../../src/notionSources.js';
import {expandAbbreviations} from '../../src/abbreviations.js';
import {courseEditorial} from '../../src/courseCurriculum.js';
import {lessonTiming,formatDuration} from '../../src/courseTiming.js';
import {practiceSupport,lessonSectionId,lessonPracticeId} from '../../src/practiceSupport.js';
import {learningPaths} from '../../src/learningPaths.js';

let server, browser, page; const pageErrors=[];
before(async()=>{
 server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','5199','--strictPort'],{stdio:'ignore'});
 for(let i=0;i<100;i++){try{if((await fetch('http://127.0.0.1:5199/')).ok)break}catch{} await new Promise(r=>setTimeout(r,100));}
 browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
 page=await browser.newPage({viewport:{width:390,height:844}}); page.setDefaultTimeout(10000); page.on('pageerror',error=>pageErrors.push(error.message));
});
after(async()=>{await browser?.close();server?.kill();assert.deepEqual(pageErrors,[])});
test('path filters survive reload and a detail visit, and empty results can be reset',async()=>{
 const context=await browser.newContext({viewport:{width:1280,height:900}}),fresh=await context.newPage();
 try{
  await fresh.goto('http://127.0.0.1:5199/parcours');
  await fresh.getByLabel('Famille de parcours',{exact:true}).selectOption('fiabilite');
  await fresh.getByRole('status').filter({hasText:'3 parcours disponibles'}).waitFor();
  assert.equal(await fresh.locator('.path-card').count(),3);
  await fresh.getByLabel('Rechercher un parcours',{exact:true}).fill('securite');
  await fresh.getByRole('link',{name:'Sécuriser une application avec LLM',exact:true}).click();
  await fresh.getByRole('heading',{name:'Sécuriser une application avec LLM',exact:true}).waitFor();
  await fresh.getByRole('link',{name:'Tous les parcours',exact:true}).click();
  assert.equal(await fresh.getByLabel('Rechercher un parcours',{exact:true}).inputValue(),'securite');
  assert.equal(await fresh.getByLabel('Famille de parcours',{exact:true}).inputValue(),'fiabilite');
  await fresh.reload();await fresh.locator('.paths-page').waitFor();
  assert.equal(await fresh.getByLabel('Rechercher un parcours',{exact:true}).inputValue(),'securite');
  assert.equal(new URL(fresh.url()).searchParams.get('famille'),'fiabilite');
  await fresh.getByLabel('Rechercher un parcours',{exact:true}).fill('zzzintrouvable');
  await fresh.getByRole('heading',{name:'Aucun parcours ne correspond',exact:true}).waitFor();
  assert.equal(await fresh.locator('.path-card').count(),0);
  await fresh.getByRole('button',{name:'Réinitialiser les filtres',exact:true}).click();
  await fresh.getByRole('status').filter({hasText:learningPaths.length+' parcours disponibles'}).waitFor();
  assert.equal(await fresh.locator('.path-card').count(),learningPaths.length);
  assert.equal(new URL(fresh.url()).search,'');
 }finally{await context.close()}
});
test('the sidebar catalog opens every curated path with its objectives and existing lessons',async()=>{
 const context=await browser.newContext({viewport:{width:1440,height:900}}),fresh=await context.newPage();
 try{
  await fresh.goto('http://127.0.0.1:5199/');
  await fresh.locator('.sidebar').getByRole('link',{name:'Parcours',exact:true}).click();
  await fresh.locator('.path-card').first().waitFor();
  assert.equal(await fresh.locator('.path-card').count(),learningPaths.length);
  for(const path of learningPaths){
   await fresh.getByRole('link',{name:path.title,exact:true}).click();
   await fresh.getByRole('heading',{level:1,name:path.title,exact:true}).waitFor();
   assert.equal(await fresh.locator('.sidebar').getByRole('link',{name:'Parcours',exact:true}).getAttribute('aria-current'),'page');
   assert.equal(await fresh.locator('.goal-page .lesson-row').count(),path.lessons.length);
   assert.equal(await fresh.locator('.goal-outcomes').evaluate(el=>el.open),false);
   await fresh.getByText('Ce que vous saurez faire',{exact:true}).click();
   assert.equal(await fresh.locator('.goal-outcomes li').count(),3);
   await fresh.getByRole('link',{name:'Tous les parcours',exact:true}).click();
  }
  assert.equal(await fresh.locator('a[href="/essentiels"]').count(),0);
  await fresh.goto('http://127.0.0.1:5199/apprendre');await fresh.locator('.learn-page').waitFor();
  assert.equal(await fresh.locator('a[href="/essentiels"]').count(),0);
  await fresh.getByRole('link',{name:'Choisir un parcours par objectif',exact:true}).waitFor();
  assert.equal(await fresh.locator('.learn-page a[href="/distinctions"]').count(),0);
  const links=await fresh.locator('.sidebar nav a').allTextContents();
  assert.equal(links[links.indexOf('Schémas')+1],'Distinctions');
  await fresh.locator('.sidebar').getByRole('link',{name:'Distinctions',exact:true}).click();
  await fresh.locator('.distinctions-page').waitFor();
  await fresh.goto('http://127.0.0.1:5199/essentiels');await fresh.waitForURL('**/glossaire');
  await fresh.getByLabel('Rechercher une notion ou un cours').waitFor();
 }finally{await context.close()}
});
test('a new path retains its goal through a notion visit, completion, reload and resume',async()=>{
 const context=await browser.newContext({viewport:{width:1280,height:900}}),fresh=await context.newPage();
 try{
  await fresh.goto('http://127.0.0.1:5199/parcours/prompts');
  await fresh.getByRole('link',{name:'Commencer ce parcours',exact:true}).click();
  await fresh.waitForURL('**/cours/5/lecons/2?parcours=prompts');
  await fresh.locator('.course-term a').first().click();
  await fresh.getByRole('link',{name:'Retour à la leçon',exact:true}).click();
  await fresh.waitForURL('**/cours/5/lecons/2?parcours=prompts');
  await fresh.getByRole('button',{name:'Terminer et continuer',exact:true}).click();
  await fresh.waitForURL('**/cours/5/lecons/3?parcours=prompts');
  await fresh.reload();await fresh.getByRole('heading',{level:1}).waitFor();
  await fresh.goto('http://127.0.0.1:5199/parcours');
  await fresh.locator('.path-resume').waitFor();
  assert.match(await fresh.getByRole('link',{name:'Mieux utiliser un LLM',exact:true}).innerText(),/1\/7 leçons terminées/);
  await fresh.getByRole('link',{name:'Reprendre ce parcours',exact:true}).click();
  await fresh.waitForURL('**/cours/5/lecons/3?parcours=prompts');
  await fresh.goto('http://127.0.0.1:5199/cours/12/lecons/1?parcours=prompts');
  await fresh.getByRole('button',{name:'Terminer et voir le parcours',exact:true}).click();
  await fresh.waitForURL('**/parcours/prompts');
  assert.match(await fresh.locator('.goal-start').innerText(),/2\/7 leçons terminées/);
 }finally{await context.close()}
});
test('the mobile navigation exposes paths and closes after choosing the catalog',async()=>{
 const context=await browser.newContext({viewport:{width:390,height:844}}),fresh=await context.newPage();
 try{
  await fresh.goto('http://127.0.0.1:5199/');
  await fresh.getByRole('button',{name:'Ouvrir le menu',exact:true}).click();
  await fresh.getByRole('dialog',{name:'Navigation principale'}).getByRole('link',{name:'Parcours',exact:true}).click();
  await fresh.locator('.paths-page').waitFor();
  assert.equal(await fresh.getByRole('button',{name:'Ouvrir le menu',exact:true}).getAttribute('aria-expanded'),'false');
  await fresh.getByRole('link',{name:'Optimiser et déployer un modèle',exact:true}).click();
  await fresh.getByRole('heading',{level:1,name:'Optimiser et déployer un modèle',exact:true}).waitFor();
  assert.ok(await fresh.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 }finally{await context.close()}
});
test('exercise reminders lead to the right lesson passage and back without opening the answer',async()=>{
 const context=await browser.newContext(),fresh=await context.newPage();
 try{
  for(const [theme,step,width,goal] of [[1,1,1280,'bases'],[8,3,320,null],[18,3,390,null]]){
   await fresh.setViewportSize({width,height:900});
   const query=goal?'?parcours='+goal:'';
   await fresh.goto(`http://127.0.0.1:5199/cours/${theme}/lecons/${step}${query}`);
   await fresh.getByRole('radio',{name:/Approfondi/}).check();
   const practice=fresh.locator('.advanced-practice'),help=practice.locator('.practice-help'),answer=practice.locator('.practice-solution');
   assert.equal(await help.evaluate(node=>node.open),false);assert.equal(await answer.evaluate(node=>node.open),false);
   await help.locator('summary').focus();await fresh.keyboard.press('Enter');
   const references=practiceSupport(courseEditorial[theme][step-1],theme,step);
   assert.equal(await help.getByRole('link').count(),references.length);
   for(const reference of references){
    const link=help.getByRole('link',{name:reference.heading,exact:true});await link.focus();await fresh.keyboard.press('Enter');
    await fresh.waitForFunction(id=>document.activeElement?.id===id,reference.id);
    assert.equal(new URL(fresh.url()).search,query);
    assert.equal(new URL(fresh.url()).hash,'#'+reference.id);
    const box=await fresh.locator('#'+reference.id).boundingBox();assert.ok(box.y>=60&&box.y<200);
    await fresh.getByRole('link',{name:'Revenir à la mise en pratique',exact:true}).click();
    await fresh.waitForFunction(id=>document.activeElement?.id===id,lessonPracticeId(theme,step));
    assert.equal(await answer.evaluate(node=>node.open),false);
   }
   assert.ok(await fresh.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   assert.equal(await fresh.getByText('Comment est estimée la durée ?', {exact:true}).count(),0);
   assert.equal(await practice.locator('.card-kicker').innerText(),'MISE EN PRATIQUE');
  }
 }finally{await context.close()}
});
test('a shared passage link opens detailed content and still allows a later switch to essential',async()=>{
 const context=await browser.newContext(),fresh=await context.newPage();
 try{
  const lesson=courseEditorial[1][0],anchor=lessonSectionId(1,1,'deepDive',lesson.deepDive[0].heading);
  await fresh.goto('http://127.0.0.1:5199/cours/1/lecons/1?parcours=bases#'+anchor);
  await fresh.waitForFunction(id=>document.activeElement?.id===id,anchor);
  assert.equal(await fresh.getByRole('radio',{name:/Approfondi/}).isChecked(),true);
  await fresh.getByRole('radio',{name:/Essentiel/}).check();
  assert.equal(await fresh.locator('.course-deep-dive').count(),0);
  await fresh.reload();await fresh.waitForFunction(id=>document.activeElement?.id===id,anchor);
  await fresh.getByRole('link',{name:'Revenir à la mise en pratique',exact:true}).click();
  assert.equal(await fresh.locator('.practice-solution').evaluate(node=>node.open),false);
 }finally{await context.close()}
});
test('course durations match their content and advanced practice is genuinely additional',async()=>{
 const context=await browser.newContext({viewport:{width:1280,height:900}}),fresh=await context.newPage();
 try{
  for(const theme of [1,9,17,18]){
   const lesson=courseEditorial[theme][0],timing=lessonTiming(theme,1,lesson);
   await fresh.goto(`http://127.0.0.1:5199/cours/${theme}/lecons/1`);
   await fresh.getByRole('radio',{name:/Essentiel/}).check();
   assert.match(await fresh.locator('.course-depth-options').innerText(),new RegExp(formatDuration(timing.essential)));
   assert.match(await fresh.locator('.course-depth-options').innerText(),new RegExp(formatDuration(timing.detailed)));
   assert.equal(await fresh.locator('.advanced-practice').count(),0);
   await fresh.getByRole('radio',{name:/Approfondi/}).check();
   await fresh.getByRole('heading',{name:'À vous d’appliquer',exact:true}).waitFor();
   assert.equal(await fresh.locator('.advanced-practice .practice-solution').evaluate(node=>node.open),false);
   await fresh.getByText('Voir le corrigé raisonné',{exact:true}).click();
   assert.ok((await fresh.locator('.advanced-practice .practice-solution').innerText()).includes(expandAbbreviations(lesson.practice.solution[0]).slice(0,40)));
   assert.equal(await fresh.locator('.course-deep-dive .course-explanation').count(),lesson.deepDive.length);
   await fresh.getByRole('radio',{name:/Essentiel/}).check();
   assert.equal(await fresh.locator('.course-deep-dive,.advanced-practice').count(),0);
  }
 }finally{await context.close()}
});
test('goal journeys continue across themes, survive reload and return from notion cards',async()=>{
 const context=await browser.newContext({viewport:{width:1280,height:900}}),fresh=await context.newPage();
 try{
  await fresh.goto('http://127.0.0.1:5199/apprendre');
  await fresh.getByRole('link',{name:'Choisir un parcours par objectif',exact:true}).click();
  await fresh.locator('.path-card').getByText('Comprendre les bases',{exact:true}).click();
  await fresh.getByRole('link',{name:'Commencer ce parcours'}).click();
  await fresh.waitForURL('**/cours/1/lecons/1?parcours=bases');
  await fresh.getByRole('button',{name:'Terminer et continuer'}).click();
  await fresh.waitForURL('**/cours/1/lecons/2?parcours=bases');
  await fresh.getByRole('button',{name:'Terminer et continuer'}).click();
  await fresh.waitForURL('**/cours/5/lecons/1?parcours=bases');
  await fresh.locator('.course-term a').first().click();
  await fresh.getByRole('link',{name:'Retour à la leçon'}).click();
  await fresh.waitForURL('**/cours/5/lecons/1?parcours=bases');
  await fresh.goto('http://127.0.0.1:5199/');
  await fresh.getByRole('link',{name:'Reprendre mon parcours'}).click();
  await fresh.waitForURL('**/cours/5/lecons/1?parcours=bases');
  await fresh.reload();await fresh.getByRole('heading',{level:1}).waitFor();
  await fresh.keyboard.press('ArrowLeft');await fresh.waitForURL('**/cours/1/lecons/2?parcours=bases');
  await fresh.goto('http://127.0.0.1:5199/cours/1/lecons/3?parcours=bases');
  await fresh.getByRole('button',{name:'Terminer et voir le parcours'}).click();
  await fresh.waitForURL('**/parcours/bases');
  assert.match(await fresh.locator('.goal-start').innerText(),/3\/6 leçons terminées/);
 }finally{await context.close()}
});
test('search tolerates transpositions, finds courses and retains its query on return',async()=>{
 const context=await browser.newContext({viewport:{width:390,height:844}}),fresh=await context.newPage();
 try{
  await fresh.goto('http://127.0.0.1:5199/glossaire');
  const input=fresh.getByLabel('Rechercher une notion ou un cours');
  await input.fill('serach vector');
  await fresh.getByRole('region',{name:'Cours trouvés'}).getByRole('link',{name:/Embeddings et Vector Search/}).waitFor();
  await fresh.locator('.gloss-card').first().click();
  await fresh.getByRole('link',{name:'Retour au glossaire'}).click();
  assert.equal(await input.inputValue(),'serach vector');
  await fresh.reload();assert.equal(await input.inputValue(),'serach vector');
  await fresh.getByRole('region',{name:'Cours trouvés'}).getByRole('link',{name:/Embeddings et Vector Search/}).click();
  await fresh.waitForURL('**/cours/9/lecons/1');
  await fresh.goBack();assert.equal(await input.inputValue(),'serach vector');
  await input.fill('zzzzzzzzzzzz');await fresh.getByText('Aucune notion trouvée.',{exact:false}).waitFor();
  assert.equal(await fresh.locator('.course-search-results').count(),0);
 }finally{await context.close()}
});
test('titles and sharing metadata follow client navigation and ignore progress parameters',async()=>{
 const context=await browser.newContext({viewport:{width:1280,height:900}}),fresh=await context.newPage();
 try{
  await fresh.goto('http://127.0.0.1:5199/cours/1?etape=2&parcours=bases');
  await fresh.waitForURL('**/cours/1/lecons/2?parcours=bases');await fresh.locator('.course-term a').first().waitFor();
  assert.match(await fresh.title(),/^Foundation Model/);
  assert.match(await fresh.locator('link[rel="canonical"]').getAttribute('href'),/\/cours\/1\/lecons\/2$/);
  await fresh.locator('.course-term a').first().click();await fresh.locator('.notion-understand').waitFor();
  assert.equal(await fresh.title(),(await fresh.locator('h1').innerText())+' | Atlas IA');
  assert.equal(await fresh.locator('meta[property="og:title"]').getAttribute('content'),await fresh.title());
  assert.equal(await fresh.locator('meta[property="og:title"]').count(),1);
  await fresh.goto('http://127.0.0.1:5199/cours/1/lecons/9');
  await fresh.getByRole('heading',{name:'Oups, ce chemin n’existe pas.'}).waitFor();
  assert.equal(await fresh.locator('meta[name="robots"]').getAttribute('content'),'noindex, follow');
 }finally{await context.close()}
});
test('path catalog, goal pages and search results fit narrow screens in both themes',async()=>{
 const context=await browser.newContext({viewport:{width:320,height:760}}),fresh=await context.newPage();
 try{
  for(const theme of ['light','dark']){
   await fresh.goto('http://127.0.0.1:5199/');await fresh.evaluate(theme=>localStorage.setItem('atlas-theme',theme),theme);
   for(const route of ['/apprendre','/parcours','/parcours/documents','/glossaire']){
    await fresh.goto('http://127.0.0.1:5199'+route);await fresh.locator('h1').waitFor();
    if(route==='/glossaire'){await fresh.getByLabel('Rechercher une notion ou un cours').fill('rag');await fresh.locator('.course-search-results').waitFor()}
    assert.ok(await fresh.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),theme+' '+route);
   }
  }
 }finally{await context.close()}
});
test('the first visit starts in light mode and remembers a later choice',async()=>{
 const context=await browser.newContext({colorScheme:'dark',viewport:{width:1280,height:800}});
 const fresh=await context.newPage();
 try{
  await fresh.goto('http://127.0.0.1:5199/');
  await fresh.getByRole('heading',{level:1}).waitFor();
  assert.equal(await fresh.locator('html').getAttribute('data-theme'),'light');
  await fresh.getByRole('button',{name:'Mode sombre'}).click();
  await fresh.reload();
  await fresh.getByRole('button',{name:'Mode clair'}).waitFor();
  assert.equal(await fresh.locator('html').getAttribute('data-theme'),'dark');
 }finally{await context.close()}
});
test('invalid lesson URL remains usable', async()=>{
 await page.goto('http://127.0.0.1:5199/cours/1?etape=1.5');
 await page.getByRole('heading',{level:1}).waitFor();
 assert.match(await page.locator('h1').innerText(),/Distinguer/);
});
test('lesson completion survives reload and home offers a next step', async()=>{
 await page.goto('http://127.0.0.1:5199/cours/1?etape=1');
 await page.getByRole('button',{name:'Terminer et continuer'}).click();
 await page.waitForURL('**/cours/1/lecons/2');
 await page.goto('http://127.0.0.1:5199/');
 assert.equal(await page.getByRole('link',{name:/Reprendre/}).count()>0,true);
 await page.goto('http://127.0.0.1:5199/progression');
 assert.match(await page.locator('.stats-grid').innerText(),/1\s*\/\s*54/);
});
test('glossary search and comparisons can be filtered',async()=>{
 await page.goto('http://127.0.0.1:5199/glossaire');
 await page.getByLabel('Rechercher une notion ou un cours').fill('transformer');
 assert.match(await page.locator('.results-count').innerText(),/NOTION/);
 await page.goto('http://127.0.0.1:5199/distinctions');
 await page.getByLabel('Rechercher une distinction').fill('RAG');
 assert.ok(await page.locator('.distinction-card').count()>0);
 assert.ok(await page.locator('.distinction-card').count()<35);
});
test('flashcard can be rated and progress exported',async()=>{
 await page.goto('http://127.0.0.1:5199/flashcards');
 await page.getByRole('button',{name:'Commencer la révision'}).click();
 await page.locator('.flashcard-face').click();
 await page.locator('.flashcard-rating.known').click();
 assert.match(await page.locator('.flashcard-rated').innerText(),/je connais/i);
 await page.goto('http://127.0.0.1:5199/progression');
 const downloadPromise=page.waitForEvent('download');
 await page.getByRole('button',{name:'Exporter',exact:true}).click();
 assert.equal((await downloadPromise).suggestedFilename(),'atlas-ia-progression.json');
});
test('a five-question quiz can be completed',async()=>{
 await page.goto('http://127.0.0.1:5199/quiz?theme=1');
 await page.getByRole('button',{name:'Commencer le quiz'}).click();
 for(let i=0;i<5;i++){
  const choice=page.locator('.choice').first();
  if(await choice.count())await choice.click();
  else if(await page.locator('.order-row').count()){}
  else if(await page.locator('.number-label input').count())await page.locator('.number-label input').fill('1');
  else if(await page.locator('.matching-row').count()){const selects=page.locator('.matching-row [role=combobox]');for(let n=0;n<await selects.count();n++){await selects.nth(n).click();await page.locator('[role=option]').nth(n).click()}}
  else throw new Error('Unexpected question type');
  await page.getByRole('button',{name:'Valider ma réponse'}).click();
  await page.getByRole('button',{name:/Question suivante|Voir les résultats/}).click();
 }
 await page.getByText('SESSION TERMINÉE').waitFor();
});
test('backup can be restored after replacing current local progress',async()=>{
 await page.goto('http://127.0.0.1:5199/progression');
 const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Exporter',exact:true}).click();
 const download=await downloadPromise; const path=await download.path();
 await page.evaluate(()=>localStorage.removeItem('atlas-progress'));await page.reload();
 await page.locator('input[type=file]').setInputFiles(path);
 await page.getByRole('button',{name:'Confirmer le remplacement'}).click();
 assert.match(await page.locator('.stats-grid').innerText(),/1\s*\/\s*54/);
});
test('dense vocabulary starts with a manageable set and reveals the remainder',async()=>{
 await page.goto('http://127.0.0.1:5199/cours/1?etape=1');
 const terms=page.locator('.course-terms'); await terms.waitFor();
 assert.ok(await terms.locator('.course-term').count()>6);
 assert.ok(await terms.locator('details.course-more-terms').count());
 assert.equal(await terms.locator('.course-more-terms').evaluate(e=>e.open),false);
 await terms.locator('.course-more-terms > summary').click();
 assert.equal(await terms.locator('.course-more-terms').evaluate(e=>e.open),true);
});
test('mobile navigation is reachable by keyboard and no page overflows',async()=>{
 await page.goto('http://127.0.0.1:5199/');
 await page.keyboard.press('Tab');
 assert.equal(await page.evaluate(()=>document.activeElement.className),'skip-link');
 await page.keyboard.press('Tab');
 await page.getByRole('button',{name:'Ouvrir le menu'}).click();
 assert.equal(await page.getByRole('dialog',{name:'Navigation principale'}).count(),1);
 await page.keyboard.press('Escape');
 assert.equal(await page.getByRole('button',{name:'Ouvrir le menu'}).getAttribute('aria-expanded'),'false');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),true);
});
test('lesson quiz explicitly filters questions to the lesson',async()=>{
 await page.goto('http://127.0.0.1:5199/cours/1?etape=1');
 await page.getByRole('link',{name:'Faire un quiz de cette leçon'}).click();
 await page.getByText('Questions liées aux notions de cette leçon').waitFor();
 await page.getByRole('button',{name:'Commencer le quiz'}).click();
 await page.locator('.question').waitFor();
});
test('due cards from a previous backup are offered for revision',async()=>{
 await page.goto('http://127.0.0.1:5199/');
 await page.evaluate(()=>{const p=JSON.parse(localStorage.getItem('atlas-progress'));p.flashcards={status:{'notion-1':'review'},session:null};localStorage.setItem('atlas-progress',JSON.stringify(p))});
 await page.goto('http://127.0.0.1:5199/flashcards');
 const due=page.getByText('À réviser aujourd’hui');await due.waitFor();await due.click();
 await page.getByRole('button',{name:'Commencer la révision'}).click();
 assert.match(await page.locator('.flashcards-progress').innerText(),/1 SUR 1/);
});
test('theme, notion and distinction links remain usable with deferred content',async()=>{
 await page.goto('http://127.0.0.1:5199/apprendre');
 await page.getByRole('heading',{name:/Explorez/}).waitFor();
 await page.goto('http://127.0.0.1:5199/themes/1');
 await page.getByRole('heading',{name:'Fondamentaux',exact:true}).waitFor();
 await page.goto('http://127.0.0.1:5199/notions/notion-1');
 await page.getByRole('heading',{level:1}).waitFor();assert.match(await page.locator('h1').innerText(),/Artificial Intelligence/);
 await page.goto('http://127.0.0.1:5199/distinctions#distinction-1');
 await page.locator('#distinction-1').waitFor();assert.equal(await page.locator('#distinction-1').count(),1);
});
test('returning from a later vocabulary card reopens it and restores focus',async()=>{
 await page.goto('http://127.0.0.1:5199/cours/1?etape=1');
 const more=page.locator('.course-more-terms');await more.locator('summary').click();
 const link=more.locator('.course-term a').first();const destination=await link.getAttribute('href');
 await link.click();await page.getByRole('link',{name:'Retour à la leçon'}).click();
 const target=page.locator('#course-term-'+destination.split('/').pop());await target.waitFor();
 assert.equal(await more.evaluate(e=>e.open),true);
 assert.equal(await target.evaluate(e=>document.activeElement===e),true);
});
test('an unfinished quiz must be confirmed before it is replaced',async()=>{
 await page.goto('http://127.0.0.1:5199/');await page.evaluate(()=>localStorage.removeItem('atlas-progress'));
 await page.goto('http://127.0.0.1:5199/quiz?theme=1');await page.getByRole('button',{name:'Commencer le quiz'}).click();
 const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('atlas-progress')).session.id);
 await page.goto('http://127.0.0.1:5199/quiz?theme=9');await page.getByRole('button',{name:'Commencer le quiz'}).click();
 await page.getByText('Votre session en cours sera remplacée').waitFor();
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('atlas-progress')).session.id),before);
 await page.getByRole('button',{name:'Annuler',exact:true}).click();
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('atlas-progress')).session.id),before);
});
test('lesson completion can be undone and crucial notions are visible',async()=>{
 await page.goto('http://127.0.0.1:5199/cours/1?etape=1');
 await page.locator('.course-terms').waitFor();
 assert.equal(await page.locator('.course-terms-grid').first().getByRole('heading',{name:'Generative AI'}).count(),1);
 await page.getByRole('button',{name:'Terminer et continuer'}).click();
 await page.goto('http://127.0.0.1:5199/cours/1?etape=1');
 await page.getByRole('button',{name:'Marquer comme non terminée'}).click();
 assert.ok(!(await page.evaluate(()=>JSON.parse(localStorage.getItem('atlas-progress')).completed)).includes('1-1'));
});
test('a question can be marked without changing its associated concept',async()=>{
 await page.goto('http://127.0.0.1:5199/');await page.evaluate(()=>localStorage.removeItem('atlas-progress'));
 await page.goto('http://127.0.0.1:5199/quiz?theme=1');await page.getByRole('button',{name:'Commencer le quiz'}).click();
 const question=page.getByRole('group',{name:'Cette question'});await question.getByRole('button',{name:'À revoir'}).click();
 await page.goto('http://127.0.0.1:5199/progression');await page.getByRole('heading',{name:'Mes éléments à revoir ou à approfondir'}).waitFor();
 const marks=await page.evaluate(()=>JSON.parse(localStorage.getItem('atlas-progress')).studyMarks);
 assert.equal(Object.values(marks.questions)[0],'review');assert.deepEqual(marks.concepts,{});
 assert.ok(await page.locator('.review-list summary').count()>0);
 await page.reload();assert.equal((await page.evaluate(()=>JSON.parse(localStorage.getItem('atlas-progress')).studyMarks)).questions[Object.keys(marks.questions)[0]],'review');
});
test('flashcard concept can be marked for deeper study',async()=>{
 await page.goto('http://127.0.0.1:5199/flashcards');await page.getByRole('button',{name:'Commencer la révision'}).click();
 await page.getByRole('group',{name:'Cette notion'}).getByRole('button',{name:'À approfondir'}).click();
 assert.equal(await page.getByRole('group',{name:'Cette notion'}).getByRole('button',{name:'À approfondir'}).getAttribute('aria-pressed'),'true');
});
test('marked questions can form a quiz and survive export and import',async()=>{
 await page.goto('http://127.0.0.1:5199/progression');
 const marks=await page.evaluate(()=>JSON.parse(localStorage.getItem('atlas-progress')).studyMarks);
 const wait=page.waitForEvent('download');await page.getByRole('button',{name:'Exporter',exact:true}).click();const file=await (await wait).path();
 await page.evaluate(()=>localStorage.removeItem('atlas-progress'));await page.reload();
 await page.locator('input[type=file]').setInputFiles(file);await page.getByRole('button',{name:'Confirmer le remplacement'}).click();
 assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('atlas-progress')).studyMarks),marks);
 await page.getByRole('link',{name:'Refaire mes questions enregistrées'}).click();
 await page.waitForURL('**/quiz?scope=marked');await page.getByLabel('Périmètre').waitFor();
 assert.equal(await page.getByLabel('Périmètre').inputValue(),'marked');
 await page.getByRole('button',{name:'Commencer le quiz'}).click();
 if(await page.getByRole('button',{name:'Remplacer la session'}).count())await page.getByRole('button',{name:'Remplacer la session'}).click();
 await page.locator('.question').waitFor();const ids=await page.evaluate(()=>JSON.parse(localStorage.getItem('atlas-progress')).session.items.map(q=>q.id));
 assert.ok(ids.length>0&&ids.every(id=>Object.hasOwn(marks.questions,id)));
});
test('resume returns to the previous position in the lesson',async()=>{
 await page.goto('http://127.0.0.1:5199/cours/5?etape=1');await page.locator('.course-terms').waitFor();
 await page.evaluate(()=>window.scrollTo(0,1200));await page.waitForTimeout(500);
 await page.goto('http://127.0.0.1:5199/');
 await page.getByRole('link',{name:'Reprendre mon parcours'}).click();await page.locator('.course-terms').waitFor();await page.waitForTimeout(300);
 assert.ok((await page.evaluate(()=>window.scrollY))>300);
});
test('quiz settings and one pair of marking buttons are directly accessible',async()=>{
 await page.goto('http://127.0.0.1:5199/');await page.evaluate(()=>localStorage.removeItem('atlas-progress'));
 await page.goto('http://127.0.0.1:5199/quiz');
 await page.getByLabel('Périmètre').selectOption('selected');
 await page.getByLabel('Choisir un ou plusieurs thèmes').selectOption(['1','5']);
 await page.getByLabel('Nombre de questions').selectOption('5');
 assert.equal(await page.locator('details.quiz-settings').count(),0);
 await page.getByRole('button',{name:'Commencer le quiz'}).click();
 const marks=page.getByRole('group',{name:'Cette question'});await marks.waitFor();
 assert.equal(await marks.locator('button').count(),2);assert.equal(await page.locator('details.quiz-marking').count(),0);
 await marks.getByRole('button',{name:'À approfondir'}).click();
 assert.equal(await marks.getByRole('button',{name:'À approfondir'}).getAttribute('aria-pressed'),'true');
});
test('mixed flashcard session keeps both directions after reload',async()=>{
 await page.goto('http://127.0.0.1:5199/');await page.evaluate(()=>localStorage.removeItem('atlas-progress'));
 await page.goto('http://127.0.0.1:5199/flashcards');await page.getByText('Mélanger les deux sens').click();
 await page.getByRole('button',{name:'Commencer la révision'}).click();await page.locator('.flashcard-face').waitFor();
 const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('atlas-progress')).flashcards.session);
 assert.equal(stored.direction,'mixed');assert.deepEqual(new Set(Object.values(stored.directions)),new Set(['term','definition']));
 const front=await page.locator('.flashcard-front').innerText();await page.reload();
 assert.equal(await page.locator('.flashcard-front').innerText(),front);
 assert.deepEqual((await page.evaluate(()=>JSON.parse(localStorage.getItem('atlas-progress')).flashcards.session)).directions,stored.directions);
});
test('course and concept cards remind readers what abbreviations mean',async()=>{
 await page.goto('http://127.0.0.1:5199/cours/8?etape=1');
 await page.getByRole('heading',{level:1}).waitFor();
 assert.equal(await page.locator('h1').innerText(),'Inference, TTFT et débit');
 assert.match(await page.locator('.lesson-content').innerText(),/TTFT \(Time To First Token\)/);
 await page.goto('http://127.0.0.1:5199/notions/notion-243');
 await page.locator('.notion-understand').waitFor();
 assert.match(await page.locator('.notion-understand').innerText(),/TTFT \(Time To First Token\)/);
});
test('completed and recent notions show their explanation, example and sources on mobile',async()=>{
 for(const id of ['notion-2','notion-3','notion-467','notion-507','notion-620',...Array.from({length:20},(_,i)=>`notion-${621+i}`)]){
  await page.goto('http://127.0.0.1:5199/notions/'+id);
  await page.getByRole('heading',{name:'Pour comprendre',exact:true}).waitFor();
  assert.equal(await page.locator('.notion-understand p').innerText(),expandAbbreviations(notionContent[id].explanation));
  assert.equal(await page.locator('.notion-example').count(),1);
  assert.equal(await page.locator('.notion-caution p').innerText(),expandAbbreviations(notionContent[id].misconception));
  const more=page.locator('.notion-more');
  assert.equal(await more.evaluate(e=>e.open),false);
  await more.locator(':scope > summary').click();
  for(const source of notionContentSources[id])assert.ok(await more.locator('a').evaluateAll((links,url)=>links.some(a=>a.href===url),source),`${id}: ${source}`);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),true,id);
 }
});
test('searching JEV opens its sourced notion and the lesson that teaches it',async()=>{
 const context=await browser.newContext({viewport:{width:1440,height:900}}),fresh=await context.newPage();
 try{
  await fresh.goto('http://127.0.0.1:5199/glossaire');
  await fresh.getByLabel('Rechercher une notion ou un cours').fill('JEV');
  const result=fresh.locator('.gloss-card').first();
  assert.equal(await result.getAttribute('href'),'/notions/notion-621');
  await result.click();
  await fresh.getByRole('heading',{level:1,name:'Jev',exact:true}).waitFor();
  await fresh.locator('.notion-more > summary').click();
  await fresh.locator('.notion-course-link').click();
  await fresh.waitForURL('**/cours/18/lecons/3');
  assert.match(await fresh.locator('.lesson-content').innerText(),/Jev, proposé par TypeSafe/);
  await fresh.getByRole('radio',{name:/Approfondi/}).check();
  await fresh.locator('.course-more-terms > summary').click();
  const term=fresh.locator('.course-term').filter({has:fresh.locator('a[href="/notions/notion-621"]')});
  await term.locator('.course-term-detail > summary').click();
  assert.match(await term.innerText(),/Une médiathèque/);
 }finally{await context.close()}
});
test('all course terms offer an optional deepening while essential mode stays compact',async()=>{
 for(const theme of [1,17,18]){
  await page.goto(`http://127.0.0.1:5199/cours/${theme}?etape=1`);
  await page.getByRole('radio',{name:/Approfondi/}).check();
  const terms=page.locator('.course-term');
  const details=terms.locator('.course-term-detail');
  assert.equal(await details.count(),await terms.count(),`theme ${theme}`);
  assert.ok(await details.count()>0);
  assert.equal(await details.evaluateAll(elements=>elements.every(e=>!e.open)),true);
  const first=terms.first();
  const id=(await first.getAttribute('id')).replace('course-term-','');
  await first.getByText('Approfondir cette notion',{exact:true}).click();
  assert.equal(await first.locator('.course-term-detail p').first().innerText(),expandAbbreviations(notionContent[id].explanation));
  await page.getByRole('radio',{name:/Essentiel/}).check();
  assert.equal(await page.locator('.course-term-detail').count(),0);
 }
});
test('mixed flashcard directions survive export and import',async()=>{
 await page.close();page=await browser.newPage({viewport:{width:390,height:844}});page.setDefaultTimeout(10000);page.on('pageerror',error=>pageErrors.push(error.message));
 await page.goto('http://127.0.0.1:5199/');await page.evaluate(()=>localStorage.removeItem('atlas-progress'));
 await page.goto('http://127.0.0.1:5199/flashcards');await page.getByText('Mélanger les deux sens').click();
 await page.getByRole('button',{name:'Commencer la révision'}).click();await page.locator('.flashcard-face').waitFor();
 const session=await page.evaluate(()=>JSON.parse(localStorage.getItem('atlas-progress')).flashcards.session);
 const front=await page.locator('.flashcard-front').innerText();
 await page.goto('http://127.0.0.1:5199/progression');const wait=page.waitForEvent('download');await page.getByRole('button',{name:'Exporter',exact:true}).click();const path=await(await wait).path();
 await page.evaluate(()=>localStorage.removeItem('atlas-progress'));await page.reload();await page.locator('input[type=file]').setInputFiles(path);await page.getByRole('button',{name:'Confirmer le remplacement'}).click();
 await page.goto('http://127.0.0.1:5199/flashcards');await page.locator('.flashcard-face').waitFor();
 assert.equal(await page.locator('.flashcard-front').innerText(),front);
 assert.deepEqual((await page.evaluate(()=>JSON.parse(localStorage.getItem('atlas-progress')).flashcards.session)).directions,session.directions);
});
test('a quiz draft survives an immediate reload',async()=>{
 await page.goto('http://127.0.0.1:5199/');
 await page.evaluate(()=>localStorage.setItem('atlas-progress',JSON.stringify({version:1,completed:[],favorites:[],history:[],errors:[],session:{id:12345,mode:'practice',index:0,checked:false,finished:false,items:[{id:'draft-test',theme:1,kind:'number',prompt:'Combien ?',answer:42,choices:[],explanation:'Quarante-deux.'}],answers:{}}})));
 await page.goto('http://127.0.0.1:5199/quiz');await page.getByLabel('Votre réponse').fill('42');
 await page.reload();assert.equal(await page.getByLabel('Votre réponse').inputValue(),'42');
});
test('unknown saved data remains untouched while storage is blocked',async()=>{
 await page.goto('http://127.0.0.1:5199/');const raw='{"version":99,"note":"original"}';
 await page.evaluate(value=>localStorage.setItem('atlas-progress',value),raw);
 await page.goto('http://127.0.0.1:5199/cours/1?etape=1');
 await page.getByRole('button',{name:'Terminer et continuer'}).click();
 assert.equal(await page.evaluate(()=>localStorage.getItem('atlas-progress')),raw);
 await page.goto('http://127.0.0.1:5199/progression');
 await page.getByRole('button',{name:'Exporter la sauvegarde originale'}).waitFor();
});

test('secondary glossary filters stay visible in the summary and survive a notion visit',async()=>{
 await page.goto('http://127.0.0.1:5199/glossaire');
 const disclosure=page.locator('.glossary-options'),summary=disclosure.locator('summary');
 await summary.focus();await page.keyboard.press('Enter');
 await page.getByLabel('Essentiels',{exact:true}).check();
 await page.getByRole('combobox',{name:'Trier les notions'}).click();
 await page.getByRole('option',{name:'De A à Z',exact:true}).click();
 await summary.click();
 assert.match(await summary.innerText(),/De A à Z · Essentiels/);
 const before=await page.locator('.results-count').innerText();
 await page.locator('.gloss-card').first().click();await page.getByRole('link',{name:'Retour au glossaire'}).click();
 assert.equal(await page.locator('.results-count').innerText(),before);
 assert.match(await summary.innerText(),/Essentiels/);
 await page.getByRole('button',{name:'Réinitialiser',exact:true}).click();
 assert.match(await page.locator('.results-count').innerText(),/571 NOTIONS/);
 assert.doesNotMatch(await summary.innerText(),/Essentiels/);
});
test('comparison deep links open the right disclosure and preserve keyboard access',async()=>{
 await page.goto('http://127.0.0.1:5199/distinctions#distinction-2');
 const item=page.locator('#distinction-2');await item.locator('.distinction-content').waitFor();
 assert.equal(await item.evaluate(el=>el.open),true);
 assert.equal(await item.locator('summary').evaluate(el=>el===document.activeElement),true);
 await page.keyboard.press('Enter');assert.equal(await item.evaluate(el=>el.open),false);
 await page.keyboard.press('Enter');assert.equal(await item.evaluate(el=>el.open),true);
 await page.getByLabel('Rechercher une distinction').fill('aucun-resultat-xyz');
 await page.getByRole('button',{name:'Effacer la recherche'}).click();
 assert.equal(await page.locator('.distinction-card').count(),35);
});
test('theme resources remain reachable by keyboard without obscuring the lessons',async()=>{
 await page.goto('http://127.0.0.1:5199/themes/1');
 const resources=page.locator('.theme-extra').filter({hasText:'Les ressources du thème'});
 await page.getByRole('link',{name:'Commencer la leçon 1'}).waitFor();
 assert.equal(await page.locator('.theme-lessons .lesson-row').count(),3);
 await resources.locator('summary').focus();await page.keyboard.press('Enter');
 await resources.getByRole('link',{name:'Réviser avec les flashcards'}).click();
 await page.waitForURL('**/flashcards?theme=1');await page.getByRole('button',{name:/Commencer.*session|Commencer la révision/}).waitFor();
});
