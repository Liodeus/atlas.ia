import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';

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
   const body=await readFile(target);const type={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.json':'application/json'}[extname(target)]||'application/octet-stream';res.writeHead(200,{'content-type':type});res.end(body);
  }catch{res.writeHead(404,{'content-type':'text/html'});res.end(await readFile(resolve(dist,'404.html')).catch(()=>'<h1>Not found</h1>'))}
 });
 await new Promise(r=>server.listen(5201,'127.0.0.1',r));
 browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
 page=await browser.newPage();page.setDefaultTimeout(15000);
});
after(async()=>{await browser?.close();await new Promise(r=>server?.close(r))});
test('project homepage loads with assets from the Pages subpath',async()=>{
 await page.goto(origin+base);
 await page.getByRole('heading',{level:1}).waitFor();assert.match(await page.title(),/Atlas IA/);
 const resources=await page.evaluate(()=>performance.getEntriesByType('resource').map(r=>r.name));
 assert.equal(resources.some(name=>/notionContent-|notionSources-/.test(name)),false);
});
test('a direct lesson link and refresh retain path and query',async()=>{
 await page.goto(origin+base+'cours/1?etape=2');
 await page.getByRole('heading',{level:1,name:/Foundation Model/}).waitFor();
 assert.equal(new URL(page.url()).pathname,base+'cours/1');assert.equal(new URL(page.url()).search,'?etape=2');
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
 await fresh.goto(origin+base+'glossaire');await fresh.getByLabel('Rechercher une notion').waitFor();
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
 await fresh.getByLabel('Rechercher une notion').fill('token');
 await fresh.waitForFunction(()=>history.state?.atlasGlossary?.q==='token'&&history.state?.atlasGlossary?.glossLevel==='debutant');
 blocked=false;await fresh.getByRole('button',{name:'Réessayer'}).click();
 await fresh.waitForFunction(()=>{const node=document.querySelector('.results-count');return node&&/NOTIONS? TROUVÉES?/.test(node.textContent)});
 assert.equal(await fresh.getByLabel('Rechercher une notion').inputValue(),'token');
 await context.close();
});
test('the diagram gallery loads and refreshes from a direct Pages link',async()=>{
 await page.goto(origin+base+'schemas');await page.getByRole('heading',{level:1,name:'Tous les schémas.'}).waitFor();
 assert.equal(await page.locator('.gallery-item').count(),39);
 await page.reload();await page.locator('[data-catalog-id="qkv"]>summary').click();
 await page.locator('[data-diagram="qkv"]').waitFor();
});
