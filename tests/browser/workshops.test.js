import {answerVariant} from '../workshopScenarioAnswers.js';
import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {workshopCatalog} from '../../src/workshopCatalog.js';
import {chromium} from 'playwright';

let server,browser;const errors=[],origin='http://127.0.0.1:5208';
before(async()=>{
 server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','5208','--strictPort'],{stdio:'ignore'});
 for(let i=0;i<100;i++){try{if((await fetch(origin)).ok)break}catch{}await new Promise(resolve=>setTimeout(resolve,100))}
 browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
});
after(async()=>{await browser?.close();server?.kill();assert.deepEqual(errors,[])});
async function fresh(width=1366){const page=await browser.newPage({viewport:{width,height:900}});page.on('pageerror',error=>errors.push(error.message));return page}
async function at(page,id=''){await page.goto(origin+'/ateliers'+(id?'/'+id:''));await page.locator(id?'.workshop-page':'.workshops-page').waitFor()}
const verify=async page=>{await answerVariant(page,new URL(page.url()).pathname.split('/').at(-1));await page.getByRole('button',{name:'Vérifier mes choix'}).click()};

test('all workshops are reachable from the sidebar, full width, and usable on a narrow screen',async()=>{
 const page=await fresh();
 try{
  await at(page);
  const nav=page.locator('.sidebar nav');assert.equal(await nav.getByRole('link',{name:'Ateliers',exact:true}).getAttribute('aria-current'),'page');
  const links=await nav.locator('a').allTextContents();assert.equal(links[links.indexOf('Parcours')+1],'Ateliers');
  assert.equal(await page.locator('.workshop-card').count(),18);
  const size=await page.locator('.workshops-page').boundingBox();assert.ok(size.width>1000);
  for(const width of [390,320]){
   await page.setViewportSize({width,height:844});
   for(const id of ['',...workshopCatalog.map(item=>item.id)]){
    await at(page,id);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),id+' at '+width);
    assert.equal(await page.locator('h1').count(),1);
   }
  }
  await page.getByRole('button',{name:'Ouvrir le menu'}).click();await nav.getByRole('link',{name:'Ateliers',exact:true}).click();await page.locator('.workshops-page').waitFor();
  await page.goto(origin+'/ateliers/inconnu');await page.getByRole('heading',{name:'Oups, ce chemin n’existe pas.'}).waitFor();
 }finally{await page.close()}
});
test('a memory attempt is corrected, saved, resumed and included in the progress export',async()=>{
 const page=await fresh();
 try{
  await at(page,'budget-memoire');await verify(page);
  await page.getByRole('heading',{name:'Des choix à revoir'}).waitFor();
  assert.equal(await page.locator('#workshop-result').evaluate(element=>document.activeElement===element),true);
  await page.getByRole('combobox',{name:'Précision des poids',exact:true}).selectOption('8');await page.getByRole('combobox',{name:'Positions par conversation',exact:true}).selectOption('8192');await page.getByRole('combobox',{name:'Conversations simultanées',exact:true}).selectOption('4');
  assert.equal(await page.locator('#workshop-result').count(),0);assert.match(await page.locator('.workshop-budget').innerText(),/11,4 \/ 12 GiB/);
  await page.reload();await page.locator('.workshop-page').waitFor();assert.equal(await page.getByRole('combobox',{name:'Précision des poids',exact:true}).inputValue(),'8');
  await verify(page);await page.getByRole('heading',{name:'Mission réussie',exact:true}).waitFor();
  await page.getByRole('link',{name:'Tous les ateliers',exact:true}).click();assert.match(await page.locator('.workshop-catalog-intro').innerText(),/1\/18 réussis/);
  await page.goto(origin+'/progression');await page.getByRole('link',{name:'Retrouver les ateliers'}).waitFor();
  const downloaded=page.waitForEvent('download');await page.getByRole('button',{name:'Exporter',exact:true}).click();const download=await downloaded;
  const stream=await download.createReadStream();let text='';for await(const chunk of stream)text+=chunk;const exported=JSON.parse(text);
  assert.equal(exported.workshops['budget-memoire'].completed,true);assert.equal(exported.workshops['budget-memoire'].values.context,'8192');
  await at(page,'budget-memoire');await page.getByRole('button',{name:'Recommencer',exact:true}).click();assert.equal(await page.getByRole('combobox',{name:'Précision des poids',exact:true}).inputValue(),'16');
  assert.equal(await page.locator('#workshop-result').count(),0);
 }finally{await page.close()}
});
test('course help opens the exact advanced passage without losing the chosen files',async()=>{
 const page=await fresh();
 try{
  await at(page,'choisir-les-fichiers');await page.getByLabel('Modele-A-7B-Instruct-Q4_K_M.gguf',{exact:true}).check();await page.getByLabel('mmproj-Modele-A-v2.gguf',{exact:true}).check();
  const opened=page.waitForEvent('popup');await page.getByRole('link',{name:'Préparer tous les composants d’un modèle multimodal (nouvel onglet)'}).click();const course=await opened;
  const heading=course.getByRole('heading',{name:'Préparer tous les composants d’un modèle multimodal',exact:true});await heading.waitFor();assert.ok(await heading.isVisible());assert.ok(await course.getByRole('radio',{name:/Approfondi/}).isChecked());
  await course.close();await verify(page);await page.getByRole('heading',{name:'Mission réussie',exact:true}).waitFor();
  await page.reload();await page.getByRole('heading',{name:'Mission réussie',exact:true}).waitFor();
 }finally{await page.close()}
});
test('quality, thermal and migration workshops evaluate complete decisions and allow retries',async()=>{
 const page=await fresh(390);
 try{
  await at(page,'fidelite-et-qualite');await page.getByLabel('Variante B',{exact:true}).check();await page.getByLabel('B a nécessairement la plus faible divergence KL avec son modèle original.').check();await verify(page);await page.getByRole('heading',{name:'Des choix à revoir'}).waitFor();
  await page.getByLabel('Variante A',{exact:true}).check();await page.getByLabel('B conserve le mieux son score agrégé, mais reste sous le seuil de qualité demandé.').check();await verify(page);await page.getByRole('heading',{name:'Mission réussie',exact:true}).waitFor();
  await at(page,'performance-durable');await page.getByLabel('Une limitation thermique contribue au ralentissement.').check();await page.getByLabel('Relancer le même test et ne garder que la première minute.').check();assert.match(await page.locator('.workshop-chart').innerText(),/performance durable reste inconnue/);await verify(page);await page.getByRole('heading',{name:'Des choix à revoir'}).waitFor();
  await page.getByLabel('Améliorer uniquement le refroidissement, puis rejouer et répéter la même charge.').check();assert.match(await page.locator('.workshop-chart').innerText(),/16,8 à 17,2/);await verify(page);await page.getByRole('heading',{name:'Mission réussie',exact:true}).waitFor();
  await at(page,'changer-environnement');for(const value of ['build','resources','quality','load'])await page.locator(`input[value="${value}"]`).check();await verify(page);await page.getByRole('heading',{name:'Mission réussie',exact:true}).waitFor();
  await page.locator('input[value="copy"]').check();await verify(page);await page.getByRole('heading',{name:'Des choix à revoir'}).waitFor();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 }finally{await page.close()}
});

test('workshop filters survive an activity visit and expose empty searches clearly',async()=>{
 const page=await fresh();
 try{
  await at(page);await page.getByLabel('Famille d’ateliers').selectOption('evaluer');await page.waitForFunction(()=>document.querySelectorAll('.workshop-card').length===4);assert.equal(await page.locator('.workshop-card').count(),4);
  await page.getByLabel('Rechercher un atelier').fill('erreurs');await page.waitForFunction(()=>document.querySelectorAll('.workshop-card').length===1);assert.equal(await page.locator('.workshop-card').count(),1);
  await page.getByRole('link',{name:'Choisir un filtre selon ses erreurs',exact:true}).click();await page.locator('.workshop-page').waitFor();
  await page.getByRole('link',{name:'Tous les ateliers',exact:true}).click();assert.equal(await page.getByLabel('Famille d’ateliers').inputValue(),'evaluer');assert.equal(await page.getByLabel('Rechercher un atelier').inputValue(),'erreurs');
  await page.reload();await page.locator('.workshops-page').waitFor();assert.equal(await page.locator('.workshop-card').count(),1);
  await page.getByLabel('Rechercher un atelier').fill('zzinexistant');await page.getByText('Aucun atelier ne correspond.',{exact:false}).waitFor();
  await page.getByRole('button',{name:'Réinitialiser les filtres',exact:true}).click();await page.waitForFunction(()=>document.querySelectorAll('.workshop-card').length===18);assert.equal(await page.locator('.workshop-card').count(),18);
  await page.getByLabel('Rechercher un atelier').fill('RAG');await page.waitForFunction(()=>document.querySelectorAll('.workshop-card').length===3);assert.doesNotMatch(await page.locator('.workshop-grid').innerText(),/apprentissage fragile/);
 }finally{await page.close()}
});
test('numeric answers and simulation changes persist and invalidate an obsolete verdict',async()=>{
 const page=await fresh(390);
 try{
  await at(page,'comparer-filtres');await page.getByLabel('Quelle est la précision du filtre A, en pourcentage ?',{exact:true}).fill('66,7');await page.getByLabel('Quel est le rappel du filtre B, en pourcentage ?',{exact:true}).fill('90');await page.getByLabel('Filtre A',{exact:true}).check();await verify(page);await page.getByRole('heading',{name:'Mission réussie',exact:true}).waitFor();
  await page.getByLabel('Conséquence d’un indésirable manqué').selectOption('sensitive');assert.equal(await page.locator('#workshop-result').count(),0);await verify(page);await page.getByRole('heading',{name:'Des choix à revoir'}).waitFor();
  await page.getByLabel('Filtre B',{exact:true}).check();await verify(page);await page.getByRole('heading',{name:'Mission réussie',exact:true}).waitFor();await page.reload();await page.getByRole('heading',{name:'Mission réussie',exact:true}).waitFor();assert.equal(await page.getByLabel('Quelle est la précision du filtre A, en pourcentage ?',{exact:true}).inputValue(),'66,7');
  await at(page,'composer-contexte');await page.getByLabel('Historique transmis').selectOption('summary');await page.getByLabel('Non : seules les informations effectivement transmises sont disponibles ici.',{exact:true}).check();await verify(page);await page.getByRole('heading',{name:'Mission réussie',exact:true}).waitFor();
  await page.getByLabel('Documents transmis').selectOption('without-exception');await verify(page);await page.getByRole('heading',{name:'Des choix à revoir'}).waitFor();assert.match(await page.locator('.workshop-feedback').innerText(),/Règle et exception présentes/);
 }finally{await page.close()}
});

test('an old two-question success is resumed without falsely completing the enriched workshop',async()=>{
 const page=await fresh();
 try{
  await page.addInitScript(()=>{
   if(!localStorage.getItem('atlas-progress'))localStorage.setItem('atlas-progress',JSON.stringify({version:1,completed:[],favorites:[],history:[],errors:[],session:null,workshops:{'budget-memoire':{values:{precision:'8',context:'8192',sequences:'4'},checked:true,completed:true}}}));
  });
  await at(page);assert.match(await page.locator('.workshop-catalog-intro').innerText(),/0\/18 réussis/);
  await page.getByRole('link',{name:'Faire tenir un service en mémoire',exact:true}).click();await page.locator('.workshop-page').waitFor();assert.equal(await page.getByRole('combobox',{name:'Précision des poids',exact:true}).inputValue(),'8');assert.equal(await page.locator('#workshop-result').count(),0);
  await page.getByRole('button',{name:'Vérifier mes choix'}).click();await page.getByRole('heading',{name:'Des choix à revoir'}).waitFor();
  await answerVariant(page,'budget-memoire');await page.getByRole('button',{name:'Vérifier mes choix'}).click();await page.getByRole('heading',{name:'Mission réussie',exact:true}).waitFor();
  await page.reload();await page.getByRole('heading',{name:'Mission réussie',exact:true}).waitFor();
  await page.getByRole('link',{name:'Tous les ateliers',exact:true}).click();assert.match(await page.locator('.workshop-catalog-intro').innerText(),/1\/18 réussis/);
 }finally{await page.close()}
});
