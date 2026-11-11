import {test, before, after} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {chromium} from 'playwright';
import {notionContent} from '../../src/notionContent.js';
import {notionContentSources} from '../../src/notionSources.js';
import {expandAbbreviations} from '../../src/abbreviations.js';

let server, browser, page; const pageErrors=[];
before(async()=>{
 server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','5199','--strictPort'],{stdio:'ignore'});
 for(let i=0;i<100;i++){try{if((await fetch('http://127.0.0.1:5199/')).ok)break}catch{} await new Promise(r=>setTimeout(r,100));}
 browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
 page=await browser.newPage({viewport:{width:390,height:844}}); page.setDefaultTimeout(10000); page.on('pageerror',error=>pageErrors.push(error.message));
});
after(async()=>{await browser?.close();server?.kill();assert.deepEqual(pageErrors,[])});
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
 await page.waitForURL('**/cours/1?etape=2');
 await page.goto('http://127.0.0.1:5199/');
 assert.equal(await page.getByRole('link',{name:/Reprendre/}).count()>0,true);
 await page.goto('http://127.0.0.1:5199/progression');
 assert.match(await page.locator('.stats-grid').innerText(),/1\s*\/\s*54/);
});
test('glossary search and comparisons can be filtered',async()=>{
 await page.goto('http://127.0.0.1:5199/glossaire');
 await page.getByLabel('Rechercher une notion').fill('transformer');
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
 assert.match(await page.locator('h1').innerText(),/TTFT \(Time To First Token\)/);
 await page.goto('http://127.0.0.1:5199/notions/notion-243');
 await page.locator('.notion-understand').waitFor();
 assert.match(await page.locator('.notion-understand').innerText(),/TTFT \(Time To First Token\)/);
});
test('formerly incomplete notions now show their own explanation, example and references',async()=>{
 for(const id of ['notion-2','notion-3','notion-467','notion-507','notion-620']){
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
 assert.match(await page.locator('.results-count').innerText(),/551 NOTIONS/);
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
