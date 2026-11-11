import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {chromium} from 'playwright';
import {diagramPlacements,demoPlacements,conceptDiagrams} from '../../src/learningDiagrams.js';
import themes from '../../src/themes.js';
import {conceptName} from '../../src/terminology.js';

let server,browser;const errors=[],origin='http://127.0.0.1:5203';
before(async()=>{
 server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','5203','--strictPort'],{stdio:'ignore'});
 for(let i=0;i<100;i++){try{if((await fetch(origin)).ok)break}catch{}await new Promise(r=>setTimeout(r,100))}
 browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
});
after(async()=>{await browser?.close();server?.kill();assert.deepEqual(errors,[])});
async function newPage(width,theme='light',depth='detailed'){
 const page=await browser.newPage({viewport:{width,height:900}});page.setDefaultTimeout(10000);
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(({theme,depth})=>{if(!localStorage.getItem('atlas-theme'))localStorage.setItem('atlas-theme',theme);if(!localStorage.getItem('atlas-course-depth'))localStorage.setItem('atlas-course-depth',depth)},{theme,depth});
 return page;
}
async function assertFits(figure){
 const overflow=await figure.evaluate(el=>{
  const bounds=el.getBoundingClientRect();
  return [...el.querySelectorAll('*')].filter(n=>{
   const r=n.getBoundingClientRect();return r.width>0&&(r.left<bounds.left-1||r.right>bounds.right+1);
  }).map(n=>n.tagName+'.'+n.getAttribute('class'));
 });
 assert.deepEqual(overflow,[]);
}
for(const [width,theme] of [[320,'light'],[1280,'dark']])test(`all diagrams appear at their section and fit at ${width}px in ${theme} mode`,async()=>{
 const page=await newPage(width,theme);
 try{for(const p of diagramPlacements){
  await page.goto(`${origin}/cours/${p.theme}?etape=${p.step}`);
  const figure=page.locator(`[data-diagram="${p.id}"]`);await figure.waitFor();
  assert.equal(await figure.count(),1,p.id);await assertFits(figure);
  assert.equal(await figure.evaluate(el=>el.closest('.course-explanation').querySelector('h2').textContent.length>0),true);
  assert.ok((await figure.locator('.sd-note').innerText()).length>30);
  const caption=await figure.getAttribute('aria-labelledby');assert.equal(await page.locator(`[id="${caption}"]`).count(),1);
  // Figures use opaque theme surfaces: check actual rendered text, including inherited backgrounds.
  const lowContrast=await figure.evaluate(el=>{
   const rgb=s=>s.match(/[\d.]+/g)?.map(Number);
   const lum=c=>c.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
   return [...el.querySelectorAll('*')].filter(n=>n.namespaceURI==='http://www.w3.org/1999/xhtml'&&[...n.childNodes].some(c=>c.nodeType===3&&c.textContent.trim())).flatMap(n=>{
    const color=rgb(getComputedStyle(n).color);let parent=n,bg;
    while(parent){bg=rgb(getComputedStyle(parent).backgroundColor);if(bg&&bg[3]!==0)break;parent=parent.parentElement}
    if(!bg||!color)return [];
    const [a,b]=[lum(color),lum(bg)].sort((x,y)=>x-y),ratio=(b+.05)/(a+.05);
    return ratio<4.5?[{text:n.textContent.slice(0,50),ratio}]:[];
   });
  });
  assert.deepEqual(lowContrast,[],p.id);
 }}finally{await page.close()}
});
test('advanced heads diagram follows depth selection and survives lesson navigation',async()=>{
 const page=await newPage(390,'light','essential');
 try{
  await page.goto(origin+'/cours/3?etape=1');await page.locator('.course-terms').waitFor();
  assert.equal(await page.locator('[data-diagram="heads"]').count(),0);
  await page.getByRole('radio',{name:/Approfondi/}).check();await page.locator('[data-diagram="heads"]').waitFor();
  await page.reload();await page.locator('[data-diagram="heads"]').waitFor();
  await page.goto(origin+'/cours/3?etape=2');await page.locator('.course-terms').waitFor();
  await page.goto(origin+'/cours/3?etape=1');await page.locator('[data-diagram="heads"]').waitFor();
 }finally{await page.close()}
});
test('moved demos and QLoRA work at their new anchors',async()=>{
 const page=await newPage(390);
 try{
  for(const [id,p] of Object.entries(demoPlacements)){
   await page.goto(`${origin}/cours/${id}?etape=${p.step}`);const demo=page.locator('.demo');await demo.waitFor();await assertFits(demo);
   assert.equal(await demo.evaluate(el=>Boolean(el.closest('.course-explanation'))),true);
  }
  await page.goto(origin+'/cours/2?etape=2');await page.locator('.res-block').first().waitFor();
  for(const width of [320,1280]){
   await page.setViewportSize({width,height:900});
   const gaps=await page.locator('.res-block').evaluateAll(blocks=>blocks.map(el=>{
    const branch=el.querySelector('.res-bypass').getBoundingClientRect(),sum=el.querySelector('.res-add>span').getBoundingClientRect();
    return Math.abs(branch.bottom-(sum.top+sum.height/2));
   }));assert.ok(gaps.every(gap=>gap<=2),'residual branches must reach the sum, even when the formula wraps');
  }
  await page.setViewportSize({width:390,height:900});
  await page.goto(origin+'/cours/7?etape=2');await page.getByRole('button',{name:'QLoRA',exact:true}).click();
  assert.match(await page.locator('.finetuning-diagram').innerText(),/Stockage quantifié en 4 bits/);
  assert.match(await page.locator('.finetuning-diagram').innerText(),/Matrices A et B entraînées/);
  await page.getByRole('button',{name:'Full Fine-tuning',exact:true}).click();assert.equal(await page.locator('.ft-frozen').count(),0);
  await page.goto(origin+'/cours/17?etape=2');await page.locator('[data-diagram="mcp"]').waitFor();assert.equal(await page.locator('.demo').count(),0);
 }finally{await page.close()}
});
test('the same figures are available in notion cards and the four comparisons',async()=>{
 const page=await newPage(390);
 try{
  const entries=themes.flatMap(t=>t.entries);
  for(const name of ['Tokenizer','Parameter / Weight','Top-p / Nucleus Sampling','Precision']){
   const entry=entries.find(e=>conceptName(e)===name);
   await page.goto(origin+'/notions/'+entry.id);const figure=page.locator(`[data-diagram="${conceptDiagrams[name]}"]`);await figure.waitFor();await assertFits(figure);
  }
  await page.goto(origin+'/distinctions');await page.locator('.distinction-card').first().waitFor();
  for(const card of await page.locator('.distinction-card').all())if(await card.locator('.learning-diagram').count())await card.locator('summary').click();
  await page.locator('.learning-diagram').first().waitFor();
  assert.equal(await page.locator('.learning-diagram').count(),4);
  for(const figure of await page.locator('.learning-diagram').all())await assertFits(figure);
 }finally{await page.close()}
});
test('Schémas navigation opens a searchable gallery of all illustrations and demos',async()=>{
 const page=await newPage(1280);
 try{
  await page.goto(origin+'/');await page.getByRole('link',{name:'Schémas',exact:true}).click();
  await page.waitForURL('**/schemas');await page.getByRole('heading',{level:1,name:'Tous les schémas.'}).waitFor();
  assert.equal(await page.getByRole('link',{name:'Schémas',exact:true}).getAttribute('aria-current'),'page');
  assert.equal(await page.locator('.gallery-item').count(),39);
  assert.equal(await page.locator('.learning-diagram,.demo').count(),0);
  await page.getByLabel('Rechercher un schéma').fill('QLoRA');
  assert.ok(await page.locator('[data-catalog-id="demo-7"]').count());
  await page.locator('[data-catalog-id="demo-7"]>summary').click();
  await page.getByRole('button',{name:'QLoRA',exact:true}).click();
  assert.match(await page.locator('.finetuning-diagram').innerText(),/Stockage quantifié en 4 bits/);
  await page.getByLabel('Rechercher un schéma').fill('aucun-resultat-xyz');
  await page.getByText('Aucun schéma ne correspond à cette recherche.').waitFor();
  await page.getByRole('button',{name:'Réinitialiser les filtres'}).click();
  await page.getByRole('combobox',{name:'Thème des schémas'}).click();
  await page.getByRole('option',{name:'Attention & Long Context',exact:true}).click();
  assert.equal(await page.locator('.gallery-item').count(),2);
  await page.locator('[data-catalog-id="heads"]>summary').focus();await page.keyboard.press('Enter');
  await page.locator('[data-diagram="heads"]').waitFor();
  await page.getByRole('link',{name:/Lire la leçon/}).click();
  await page.waitForURL('**/cours/3?etape=1');await page.locator('[data-diagram="heads"]').waitFor();
 }finally{await page.close()}
});
test('mobile gallery menu closes and every illustration can be opened without horizontal overflow',async()=>{
 const page=await newPage(390);
 try{
  await page.goto(origin+'/');await page.getByRole('button',{name:'Ouvrir le menu'}).click();
  await page.getByRole('link',{name:'Schémas',exact:true}).click();
  await page.locator('.gallery-item').first().waitFor();assert.equal(await page.locator('.sidebar.opened').count(),0);
  for(const item of await page.locator('.gallery-item').all())await item.locator('summary').click();
  await page.waitForFunction(()=>document.querySelectorAll('.gallery-item-content').length===39);
  assert.equal(await page.locator('.learning-diagram').count(),22);assert.equal(await page.locator('.demo').count(),17);
  for(const item of await page.locator('.gallery-item').all())await assertFits(item);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
  await page.reload();await page.getByRole('heading',{level:1,name:'Tous les schémas.'}).waitFor();
 }finally{await page.close()}
});
