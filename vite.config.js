import {defineConfig} from 'vite';
import {loadEnv} from 'vite';
import {normalizeSiteUrl,defaultSiteUrl} from './src/siteUrl.js';

// Pages ne réécrit pas les URL des applications monopages vers index.html.
// Cette page de secours conserve le chemin, la recherche et le fragment.
export default defineConfig(({mode})=>{
 const env=loadEnv(mode,process.cwd(),'VITE_');
 const base=process.env.VITE_BASE_PATH||env.VITE_BASE_PATH||'/';
 if(!/^\/(?:[A-Za-z0-9._~-]+\/)*$/.test(base))throw new Error('VITE_BASE_PATH doit être un chemin absolu terminé par /');
 const siteUrl=normalizeSiteUrl(process.env.VITE_SITE_URL||env.VITE_SITE_URL||defaultSiteUrl);
 return {base,define:{__ATLAS_SITE_URL__:JSON.stringify(siteUrl)},plugins:[{
  name:'atlas-pages-fallback',
  generateBundle(){
   const fallback=`<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Redirection · Atlas IA</title></head><body><p>Ouverture d’Atlas IA…</p><script>(function(){var base=${JSON.stringify(base)};var route=location.pathname+location.search+location.hash;location.replace(base+'?__atlas_route='+encodeURIComponent(route));})();</script></body></html>`;
   this.emitFile({type:'asset',fileName:'404.html',source:fallback});
  }
 }]};
});
