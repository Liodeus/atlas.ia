import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {chromium} from 'playwright';
import {courseEditorial} from '../../src/courseCurriculum.js';
import {expandAbbreviations} from '../../src/abbreviations.js';
import {lessonSectionId} from '../../src/practiceSupport.js';

let server,browser;const errors=[],origin='http://127.0.0.1:5205';
before(async()=>{
 server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','5205','--strictPort'],{stdio:'ignore'});
 for(let i=0;i<100;i++){try{if((await fetch(origin)).ok)break}catch{}await new Promise(r=>setTimeout(r,100))}
 browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
});
after(async()=>{await browser?.close();server?.kill();assert.deepEqual(errors,[])});
async function pageAt(width=390){const page=await browser.newPage({viewport:{width,height:844}});page.on('pageerror',e=>errors.push(e.message));return page}

test('all 54 lessons expose their complete essential text without pagination or overlays',async()=>{
 const page=await pageAt();
 try{
  await page.addInitScript(()=>localStorage.setItem('atlas-course-reading',JSON.stringify({view:'guided',positions:{'9-2':{essential:'lesson-9-2-atelier-contexte'}}})));
  for(const [theme,lessons] of Object.entries(courseEditorial))for(const [i,lesson] of lessons.entries()){
   await page.goto(`${origin}/cours/${theme}/lecons/${i+1}`);await page.locator('.continuous-reading').waitFor();
   assert.deepEqual(await page.locator('.course-section-grid > .course-explanation > p:visible').allTextContents(),lesson.sections.flatMap(s=>s.paragraphs).map(expandAbbreviations),`${theme}/${i+1}`);
   assert.equal(await page.locator('.sequence-panel,.sequence-actions,.sequence-sticky-header').count(),0);
   assert.equal(await page.getByRole('button',{name:/Lire la suite|Séquence suivante/}).count(),0);
   assert.ok(await page.getByRole('radio',{name:/Essentiel/}).isVisible());
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  }
 }finally{await page.close()}
});

test('the workshop stays within its explanatory section and never gates the following text',async()=>{
 const page=await pageAt();
 try{
  await page.goto(origin+'/cours/9/lecons/2#lesson-9-2-atelier-contexte');await page.locator('.rag-context-workshop').waitFor();
  assert.equal(await page.locator('.course-explanation').first().locator('.rag-context-workshop').count(),1);
  const next=page.locator('.course-explanation').nth(1);assert.ok(await next.isVisible());
  await page.getByRole('button',{name:'La règle et son exception',exact:true}).click();
  assert.match(await page.locator('.workshop-feedback').innerText(),/L’exception est présente/);
  await page.getByRole('button',{name:'La règle et son exception',exact:true}).focus();await page.keyboard.press('ArrowRight');
  assert.equal(new URL(page.url()).pathname,'/cours/9/lecons/2');
  await next.scrollIntoViewIfNeeded();assert.ok(await next.locator('p').first().isVisible());
 }finally{await page.close()}
});

test('old sequence links now focus the matching section in the continuous detailed lesson',async()=>{
 const page=await pageAt(320);
 try{
  await page.addInitScript(()=>localStorage.setItem('atlas-theme','dark'));
  const lesson=courseEditorial[18][2],anchor=lessonSectionId(18,3,'deepDive',lesson.deepDive[0].heading);
  await page.goto(origin+'/cours/18/lecons/3#'+anchor+'-suite-2');
  await page.waitForFunction(id=>document.activeElement?.id===id,anchor);
  assert.ok(await page.getByRole('radio',{name:/Approfondi/}).isChecked());
  assert.equal(await page.locator('.course-explanation:visible').count(),lesson.sections.length+lesson.deepDive.length);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 }finally{await page.close()}
});
