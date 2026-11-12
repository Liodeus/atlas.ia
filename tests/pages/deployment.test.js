import {answerVariant} from '../workshopScenarioAnswers.js';
import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {courseEditorial} from '../../src/courseCurriculum.js';
import {practiceSupport,lessonPracticeId} from '../../src/practiceSupport.js';
import {workshopCatalog} from '../../src/workshopCatalog.js';
import {learningPaths} from '../../src/learningPaths.js';

let server,browser,page;const base=process.env.TEST_PAGES_BASE||'/atlas.ia/';const origin='http://127.0.0.1:5201';
before(async()=>{
 const dist=resolve('dist');
 server=createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  const path=decodeURIComponent(url.pathname);
  if(!path.startsWith(base)){res.writeHead(404);return res.end()}
  const relative=path.slice(base.length)||'index.html';
  try{
   const target=resolve(dist,relative);if(!target.startsWith(dist+'/'))throw Error('outside');
   const body=await readFile(target).catch(error=>error.code==='EISDIR'?readFile(resolve(target,'index.html')):Promise.reject(error));const type={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.json':'application/json'}[extname(target)]||'text/html';res.writeHead(200,{'content-type':type});res.end(body);
  }catch{res.writeHead(404,{'content-type':'text/html'});res.end(await readFile(resolve(dist,'404.html')).catch(()=>'<h1>Not found</h1>'))}
 });
 await new Promise(r=>server.listen(5201,'127.0.0.1',r));
 browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
 page=await browser.newPage();page.setDefaultTimeout(15000);
});
after(async()=>{await browser?.close();await new Promise(r=>server?.close(r))});
test('the inline workshop opens directly within a complete lesson on Pages',async()=>{
 const fresh=await browser.newPage({viewport:{width:390,height:844}});
 try{
  await fresh.goto(origin+base+'cours/9/lecons/2#lesson-9-2-atelier-contexte');
  await fresh.locator('.rag-context-workshop').waitFor();
  assert.equal(await fresh.locator('.sequence-panel').count(),0);
  assert.equal(await fresh.locator('.course-section-grid > .course-explanation:visible').count(),3);
  await fresh.getByRole('button',{name:'La règle et son exception',exact:true}).click();
  assert.match(await fresh.locator('.workshop-feedback').innerText(),/L’exception est présente/);
  await fresh.reload();await fresh.locator('.rag-context-workshop').waitFor();
  assert.equal(new URL(fresh.url()).pathname,base+'cours/9/lecons/2');
  assert.ok(await fresh.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 }finally{await fresh.close()}
});
test('a filtered catalog refresh and its detail return preserve the Pages base and filters',async()=>{
 const context=await browser.newContext({viewport:{width:390,height:844}}),fresh=await context.newPage();
 try{
  await fresh.goto(origin+base+'parcours?q=MCP&famille=applications');
  await fresh.getByRole('link',{name:'Connecter des outils avec MCP',exact:true}).click();
  await fresh.getByRole('heading',{level:1,name:'Connecter des outils avec MCP',exact:true}).waitFor();
  await fresh.getByRole('link',{name:'Tous les parcours',exact:true}).click();
  await fresh.reload();await fresh.locator('.paths-page').waitFor();
  assert.equal(new URL(fresh.url()).pathname,base+'parcours');
  assert.equal(await fresh.getByLabel('Rechercher un parcours',{exact:true}).inputValue(),'MCP');
  assert.equal(await fresh.getByLabel('Famille de parcours',{exact:true}).inputValue(),'applications');
  assert.ok(await fresh.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 }finally{await context.close()}
});
test('the catalog and every new path are published with usable links without JavaScript',async()=>{
 const context=await browser.newContext({javaScriptEnabled:false}),fresh=await context.newPage();
 try{
  const response=await fresh.goto(origin+base+'parcours');assert.equal(response.status(),200);
  await fresh.getByRole('heading',{level:1,name:'Les parcours d’apprentissage'}).waitFor();
  for(const path of learningPaths){
   const link=fresh.getByRole('link',{name:path.title,exact:true});
   assert.equal(await link.getAttribute('href'),base+'parcours/'+path.id);
   const detail=await fetch(origin+base+'parcours/'+path.id);assert.equal(detail.status,200);
   assert.ok((await detail.text()).includes('Ce que vous saurez faire'));
  }
  await fresh.getByRole('link',{name:'Optimiser et déployer un modèle',exact:true}).click();
  await fresh.getByRole('heading',{level:1,name:'Optimiser et déployer un modèle'}).waitFor();
  await fresh.getByRole('link',{name:'Tous les parcours',exact:true}).click();
  assert.equal(await fresh.locator(`a[href="${base}essentiels"]`).count(),0);
  const sitemap=await (await fetch(origin+base+'sitemap.xml')).text();
  assert.ok(!sitemap.includes('/essentiels'));
 }finally{await context.close()}
});
test('exercise reminder links work from a direct GitHub Pages lesson link',async()=>{
 const context=await browser.newContext(),fresh=await context.newPage();
 try{
  await fresh.goto(origin+base+'cours/17/lecons/2?parcours=agents');
  await fresh.getByRole('radio',{name:/Approfondi/}).check();
  await fresh.getByText('Retrouver les passages utiles',{exact:true}).click();
  const reference=practiceSupport(courseEditorial[17][1],17,2)[0];
  await fresh.locator('.practice-help').getByRole('link',{name:reference.heading,exact:true}).click();
  await fresh.waitForFunction(id=>document.activeElement?.id===id,reference.id);
  assert.ok(new URL(fresh.url()).pathname.startsWith(base+'cours/17/lecons/2'));assert.equal(new URL(fresh.url()).search,'?parcours=agents');
  await fresh.getByRole('link',{name:'Revenir à la mise en pratique',exact:true}).click();
  await fresh.waitForFunction(id=>document.activeElement?.id===id,lessonPracticeId(17,2));
  assert.equal(await fresh.locator('.practice-solution').evaluate(node=>node.open),false);
 }finally{await context.close()}
});
test('lesson and notion HTML expose distinct metadata and content without JavaScript',async()=>{
 const context=await browser.newContext({javaScriptEnabled:false}),fresh=await context.newPage();
 try{
  for(const [route,title,content] of [['cours/1/lecons/2','Foundation Model','Les notions à connaître'],['notions/notion-2','Machine Learning','Pour comprendre'],['notions/notion-621','Jev','TypeSafe'],['notions/notion-640','Engram','mémoire conditionnelle'],['parcours/documents','Concevoir un assistant','Indexation puis pipeline RAG']]){
   const response=await fresh.goto(origin+base+route);assert.equal(response.status(),200);
   assert.ok((await fresh.title()).includes(title));await fresh.getByText(content,{exact:false}).first().waitFor();
   const canonical=await fresh.locator('link[rel="canonical"]').getAttribute('href');assert.ok(canonical.endsWith('/'+route));
   assert.equal(await fresh.locator('meta[property="og:title"]').getAttribute('content'),await fresh.title());
   assert.equal(await fresh.locator('meta[name="twitter:card"]').getAttribute('content'),'summary_large_image');
  }
  const image=await fetch(origin+base+'social-card.png');assert.equal(image.status,200);
  assert.equal(Buffer.from(await image.arrayBuffer()).subarray(1,4).toString(),'PNG');
  const sitemap=await (await fetch(origin+base+'sitemap.xml')).text();
  assert.ok(sitemap.includes('/cours/1/lecons/2'));assert.ok(sitemap.includes('/notions/notion-620'));assert.ok(sitemap.includes('/notions/notion-640'));assert.ok(!sitemap.includes('/progression'));
 }finally{await context.close()}
});
test('project homepage loads with assets from the Pages subpath',async()=>{
 await page.goto(origin+base);
 await page.getByRole('heading',{level:1}).waitFor();assert.match(await page.title(),/Atlas IA/);
 const resources=await page.evaluate(()=>performance.getEntriesByType('resource').map(r=>r.name));
 assert.equal(resources.some(name=>/notionContent-|notionSources-/.test(name)),false);
});
test('a direct lesson link and refresh retain path and query',async()=>{
 await page.goto(origin+base+'cours/1?etape=2');
 await page.getByRole('heading',{level:1,name:/Foundation Model/}).waitFor();
 assert.equal(new URL(page.url()).pathname,base+'cours/1/lecons/2');assert.equal(new URL(page.url()).search,'');
 await page.reload();await page.getByRole('heading',{level:1,name:/Foundation Model/}).waitFor();
});
test('a direct comparison link keeps its fragment',async()=>{
 await page.goto(origin+base+'distinctions#distinction-2');
 await page.locator('#distinction-2').waitFor();assert.match(page.url(),/#distinction-2$/);
});
test('theme filters and links remain within the Pages base path',async()=>{
 await page.goto(origin+base+'glossaire?theme=9');
 await page.getByRole('heading',{level:1,name:/Les mots pour/}).waitFor();
 assert.equal(new URL(page.url()).search,'?theme=9');
 await page.getByRole('link',{name:'Progression',exact:true}).click();
 await page.getByRole('heading',{level:1,name:/Chaque pas/}).waitFor();
 assert.equal(new URL(page.url()).pathname,base+'progression');
});
test('general quiz does not load the course curriculum',async()=>{
 const context=await browser.newContext();const fresh=await context.newPage();
 await fresh.goto(origin+base+'quiz');await fresh.getByRole('button',{name:'Commencer le quiz'}).waitFor();
 const resources=await fresh.evaluate(()=>performance.getEntriesByType('resource').map(r=>r.name));
 assert.equal(resources.some(name=>/courseCurriculum-/.test(name)),false);
 await context.close();
});
test('a course does not download comparisons or the notion index',async()=>{
 const context=await browser.newContext();const fresh=await context.newPage();
 await fresh.goto(origin+base+'cours/1?etape=1');await fresh.getByRole('heading',{level:1}).waitFor();
 const resources=await fresh.evaluate(()=>performance.getEntriesByType('resource').map(r=>r.name));
 assert.equal(resources.some(name=>/notionLearningLinks-|distinctions-/.test(name)),false);
 await context.close();
});
test('glossary loads quiz data only when a level filter is selected',async()=>{
 const context=await browser.newContext();const fresh=await context.newPage();
 await fresh.goto(origin+base+'glossaire');await fresh.getByLabel('Rechercher une notion ou un cours').waitFor();
 const resources=()=>fresh.evaluate(()=>performance.getEntriesByType('resource').map(r=>r.name));
 assert.equal((await resources()).some(name=>/allQuestions-/.test(name)),false);
 await fresh.locator('.glossary-options>summary').click();await fresh.getByRole('combobox',{name:'Niveau des questions associées'}).click();
 await fresh.getByRole('option',{name:'Débutant',exact:true}).click();
 await fresh.getByText('Le niveau concerne les questions associées, pas la difficulté de la notion.').waitFor();
 await fresh.waitForFunction(()=>performance.getEntriesByType('resource').some(r=>/allQuestions-/.test(r.name)));
 await context.close();
});
test('glossary offers recovery when loading level data fails',async()=>{
 const context=await browser.newContext();const fresh=await context.newPage();let blocked=true;
 await fresh.route('**/allQuestions-*.js',route=>blocked?route.abort():route.continue());
 await fresh.goto(origin+base+'glossaire');await fresh.locator('.glossary-options>summary').click();await fresh.getByRole('combobox',{name:'Niveau des questions associées'}).click();await fresh.getByRole('option',{name:'Débutant',exact:true}).click();
 await fresh.getByText('Impossible de charger les niveaux.',{exact:false}).waitFor();
 await fresh.getByLabel('Rechercher une notion ou un cours').fill('token');
 await fresh.waitForFunction(()=>history.state?.atlasGlossary?.q==='token'&&history.state?.atlasGlossary?.glossLevel==='debutant');
 blocked=false;await fresh.getByRole('button',{name:'Réessayer'}).click();
 await fresh.waitForFunction(()=>{const node=document.querySelector('.results-count');return node&&/NOTIONS? TROUVÉES?/.test(node.textContent)});
 assert.equal(await fresh.getByLabel('Rechercher une notion ou un cours').inputValue(),'token');
 await context.close();
});
test('the diagram gallery loads and refreshes from a direct Pages link',async()=>{
 await page.goto(origin+base+'schemas');await page.getByRole('heading',{level:1,name:'Tous les schémas.'}).waitFor();
 assert.equal(await page.locator('.gallery-item').count(),39);
 await page.reload();await page.locator('[data-catalog-id="qkv"]>summary').click();
 await page.locator('[data-diagram="qkv"]').waitFor();
});

test('workshop routes and exact course references work under the GitHub Pages prefix',async()=>{
 const context=await browser.newContext(),fresh=await context.newPage();
 try{
  for(const id of workshopCatalog.map(item=>item.id)){
   const response=await fresh.goto(origin+base+'ateliers/'+id);assert.equal(response.status(),200);
   await fresh.locator('.workshop-page').waitFor();
   assert.equal(await fresh.locator('.sidebar').getByRole('link',{name:'Ateliers',exact:true}).getAttribute('aria-current'),'page');
   for(const link of await fresh.locator('.workshop-references a').all())assert.ok((await link.getAttribute('href')).startsWith(base+'cours/'));
  }
  await fresh.goto(origin+base+'ateliers/budget-memoire');await fresh.getByRole('combobox',{name:'Précision des poids',exact:true}).selectOption('8');await fresh.getByRole('combobox',{name:'Positions par conversation',exact:true}).selectOption('8192');await fresh.getByRole('combobox',{name:'Conversations simultanées',exact:true}).selectOption('4');await answerVariant(fresh,'budget-memoire');await fresh.getByRole('button',{name:'Vérifier mes choix'}).click();await fresh.getByRole('heading',{name:'Mission réussie',exact:true}).waitFor();
  await fresh.reload();await fresh.getByRole('heading',{name:'Mission réussie',exact:true}).waitFor();
  await fresh.getByRole('link',{name:'Tous les ateliers',exact:true}).click();await fresh.locator('.workshop-card').first().waitFor();assert.equal(await fresh.locator('.workshop-card').count(),18);
 }finally{await context.close()}
});
test('workshop static pages contain the scenario, data and course links without JavaScript',async()=>{
 const context=await browser.newContext({javaScriptEnabled:false}),fresh=await context.newPage();
 try{
  await fresh.goto(origin+base+'ateliers');assert.equal(await fresh.locator('main>ul>li').count(),18);
  await fresh.getByRole('link',{name:'Faire tenir un service en mémoire',exact:true}).click();await fresh.getByRole('heading',{name:'Votre mission'}).waitFor();
  assert.match(await fresh.locator('main').innerText(),/12 GiB/);assert.equal(await fresh.locator('table').first().locator('tbody tr').count(),3);
  const link=fresh.getByRole('link',{name:'Composer un budget mémoire sans sacrifier la tâche',exact:true});assert.ok((await link.getAttribute('href')).startsWith(base+'cours/8/lecons/2#'));
  assert.match(await fresh.locator('link[rel="canonical"]').getAttribute('href'),/\/ateliers\/budget-memoire$/);
 }finally{await context.close()}
});
