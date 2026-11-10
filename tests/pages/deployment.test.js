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
 page=await browser.newPage();page.setDefaultTimeout(8000);
});
after(async()=>{await browser?.close();await new Promise(r=>server?.close(r))});
test('project homepage loads with assets from the Pages subpath',async()=>{
 await page.goto(origin+base);
 await page.getByRole('heading',{level:1}).waitFor();assert.match(await page.title(),/Atlas IA/);
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
