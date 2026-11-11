export const defaultSiteUrl='https://liodeus.github.io/atlas.ia/';
export function normalizeSiteUrl(value){
 const url=new URL(value);
 if(!['https:','http:'].includes(url.protocol)||url.username||url.password||url.search||url.hash)throw Error('VITE_SITE_URL doit être une URL HTTP(S) publique, sans paramètres ni identifiants.');
 return url.href.replace(/\/?$/,'/');
}
