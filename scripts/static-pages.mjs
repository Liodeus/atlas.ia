import {assertWorkshopReviews} from './workshop-review.mjs';
import {workshopCatalog} from '../src/workshopCatalog.js';
import {workshopContent,workshopLessonHref} from '../src/workshops.js';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {pathToFileURL} from 'node:url';
import {loadEnv} from 'vite';
import {pageMetadata,publicPagePaths,normalizeSiteUrl,defaultSiteUrl} from '../src/metadata.js';
import {orderedThemes,short,entriesById} from '../src/appData.js';
import {courseTitles} from '../src/courseTitles.js';
import {courseEditorial} from '../src/courseCurriculum.js';
import {notionContent} from '../src/notionContent.js';
import {notionContentSources} from '../src/notionSources.js';
import {conceptName} from '../src/terminology.js';
import {lessonPath} from '../src/lessonNavigation.js';
import {learningPaths,learningPathGroups} from '../src/learningPaths.js';
import {lessonSectionId,lessonPracticeId,practiceSupport} from '../src/practiceSupport.js';

export const escapeHtml=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function metadataTags(data){
 const meta=(name,content,property=false)=>`<meta ${property?'property':'name'}="${name}" content="${escapeHtml(content)}">`;
 return `<title>${escapeHtml(data.title)}</title>`+meta('description',data.description)+meta('robots',data.noindex?'noindex, follow':'index, follow')+(data.url?`<link rel="canonical" href="${escapeHtml(data.url)}">`:'')+
  Object.entries({title:data.title,description:data.description,url:data.url,image:data.image,type:['notion','course'].includes(data.kind)?'article':'website',locale:'fr_FR',site_name:'Atlas IA','image:width':'1200','image:height':'630','image:alt':'Atlas IA, comprendre l’intelligence artificielle'}).filter(([,v])=>v).map(([k,v])=>meta('og:'+k,v,true)).join('')+
  Object.entries({card:'summary_large_image',title:data.title,description:data.description,image:data.image,'image:alt':'Atlas IA, comprendre l’intelligence artificielle'}).map(([k,v])=>meta('twitter:'+k,v)).join('');
}
function pageBody(data,base){
 const link=(path,label)=>`<a href="${escapeHtml(base+path.replace(/^\//,''))}">${escapeHtml(label)}</a>`;
 const list=items=>'<ul>'+items.map(item=>'<li>'+item+'</li>').join('')+'</ul>';
 const paragraphs=items=>items.map(text=>`<p>${escapeHtml(text)}</p>`).join('');
 const dataTable=table=>'<table><caption>'+escapeHtml(table.caption)+'</caption><thead><tr>'+table.headers.map(value=>'<th scope="col">'+escapeHtml(value)+'</th>').join('')+'</tr></thead><tbody>'+table.rows.map(row=>'<tr>'+row.map(value=>'<td>'+escapeHtml(value)+'</td>').join('')+'</tr>').join('')+'</tbody></table>';
 const sections=(items,part)=>items.map(item=>`<section><h2${part?` id="${lessonSectionId(data.theme,data.step,part,item.heading)}"`:''}>${escapeHtml(item.heading)}</h2>${paragraphs(item.paragraphs)}</section>`).join('');
 const lessonLinks=theme=>[1,2,3].map(step=>link(lessonPath({theme,step}),courseTitles[theme-1][step-1]));
 let body='';
 if(data.kind==='course'){
  const lesson=courseEditorial[data.theme][data.step-1];
  body=paragraphs([lesson.goal])+sections(lesson.sections,'sections')+`<h2>À retenir</h2>`+list(lesson.takeaways.map(escapeHtml))+`<h2>Les notions à connaître</h2>`+list(lesson.concepts.map(id=>link('/notions/'+id,conceptName(entriesById.get(id)))));
  const support=practiceSupport(lesson,data.theme,data.step);
  const reminders=support.length?'<details><summary>Retrouver les passages utiles</summary>'+list(support.map(reference=>`<a href="#${reference.id}">${escapeHtml(reference.heading)}</a>`))+'</details>':'';
  body+='<details><summary>Approfondir la leçon</summary>'+sections(lesson.deepDive,'deepDive')+(lesson.practice?`<h2 id="${lessonPracticeId(data.theme,data.step)}">À vous d’appliquer</h2>`+paragraphs([lesson.practice.prompt])+reminders+'<details><summary>Voir le corrigé raisonné</summary>'+paragraphs(lesson.practice.solution)+'</details>':'')+'</details>';
  if(lesson.references?.length)body+='<h2>Sources de la leçon</h2>'+list(lesson.references.map(source=>`<a href="${escapeHtml(source.url)}">${escapeHtml(source.label)}</a>`));
 }else if(data.kind==='workshop'){
  const workshop=workshopContent[data.workshop.id];
  body='<h2>Votre mission</h2>'+paragraphs([workshop.scenario,'Cas pédagogique fictif. Les fichiers et mesures ne décrivent pas un produit réel.'])+list((workshop.facts||[]).map(escapeHtml));
  if(workshop.table)body+=dataTable(workshop.table);
  if(workshop.controls?.length)body+='<h2>Réglages de départ</h2>'+list(workshop.controls.map(control=>escapeHtml(control.label+' : '+control.options.find(([value])=>value===control.default)[1])));
  body+='<h2>À vous de décider</h2>'+paragraphs((workshop.questions||[]).map(question=>question.label));
  if(workshop.followUp){const next=workshop.followUp;body+='<h2>'+escapeHtml(next.title)+'</h2>'+paragraphs([next.scenario])+list((next.facts||[]).map(escapeHtml))+(next.table?dataTable(next.table):'')+list(next.questions.map(question=>escapeHtml(question.label)))}
  body+='<p>Activez JavaScript pour manipuler les données et vérifier vos choix.</p><h2>Passages utiles du cours</h2>'+list(workshop.support.map(reference=>link(workshopLessonHref(reference),reference.heading)))+link('/ateliers','Tous les ateliers');
 }else if(data.kind==='notion'){
  const detail=notionContent[data.entry.id];
  body=sections([{heading:'Pour comprendre',paragraphs:[detail.explanation]},{heading:'Un exemple concret',paragraphs:[detail.example]},{heading:'À ne pas confondre',paragraphs:[detail.misconception]}])+link('/themes/'+data.entry.theme,'Explorer '+short[data.entry.theme-1]);
  const sources=notionContentSources[data.entry.id]||[];
  if(sources.length)body+='<h2>Sources de cette fiche</h2>'+list(sources.map(url=>`<a href="${escapeHtml(url)}">${escapeHtml(new URL(url).hostname)}</a>`));
 }else if(data.kind==='theme')body=list(lessonLinks(data.theme));
 else if(data.kind==='goal')body=paragraphs([data.goal.level+' · '+data.goal.lessons.length+' leçons','Prérequis : '+data.goal.prerequisite])+'<h2>Ce que vous saurez faire</h2>'+list(data.goal.outcomes.map(escapeHtml))+'<h2>Les étapes du parcours</h2>'+list(data.goal.lessons.map(lesson=>link(lessonPath(lesson)+'?parcours='+data.goal.id,courseTitles[lesson.theme-1][lesson.step-1])))+link('/parcours','Tous les parcours');
 else if(data.path==='/ateliers')body=list(workshopCatalog.map(workshop=>link('/ateliers/'+workshop.id,workshop.title)+paragraphs([workshop.description])));
 else if(data.path==='/parcours')body=learningPathGroups.map(group=>'<h2>'+escapeHtml(group.title)+'</h2>'+paragraphs([group.description])+list(learningPaths.filter(path=>path.group===group.id).map(path=>link('/parcours/'+path.id,path.title)+' · '+escapeHtml(path.level)+' · '+path.lessons.length+' leçons'+paragraphs([path.description])))).join('');
 else if(data.path==='/'||data.path==='/apprendre')body='<h2>Parcours par objectif</h2>'+list(learningPaths.map(path=>link('/parcours/'+path.id,path.title)))+'<h2>Les thèmes</h2>'+list(orderedThemes.map(theme=>link('/themes/'+theme.id,short[theme.id-1])));
 return `<main class="content"><nav>${link('/','Atlas IA')} · ${link('/apprendre','Apprendre')} · ${link('/parcours','Parcours')} · ${link('/ateliers','Ateliers')} · ${link('/glossaire','Glossaire')} · ${link('/schemas','Schémas')} · ${link('/distinctions','Distinctions')}</nav><h1>${escapeHtml(data.heading)}</h1><p>${escapeHtml(data.description)}</p>${body}<noscript><p>Activez JavaScript pour les quiz, la recherche et l’enregistrement de votre progression.</p></noscript></main>`;
}
export async function generateStaticPages({base,siteUrl=defaultSiteUrl,dist=resolve('dist')}){
 assertWorkshopReviews();
 const root=normalizeSiteUrl(siteUrl);
 const emit=async(fileName,source)=>{const target=resolve(dist,fileName);await mkdir(dirname(target),{recursive:true});await writeFile(target,source)};
  const template=(await readFile(resolve(dist,'index.html'),'utf8')).replace(/<title>[\s\S]*?<\/title>/,'').replace(/<meta\s+name="description"[^>]*>/,'');
  const paths=[...publicPagePaths(),'/progression'];
  for(const path of paths){
   const data=pageMetadata(path,'',root),html=template.replace('</head>',metadataTags(data)+'</head>').replace('<div id="root"></div>',`<div id="root">${pageBody(data,base)}</div>`);
   await emit(path==='/'?'index.html':path.slice(1)+'/index.html',html);
  }
  await emit('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+publicPagePaths().map(path=>`<url><loc>${escapeHtml(pageMetadata(path,'',root).url)}</loc></url>`).join('')+'</urlset>');
  if(base==='/')await emit('robots.txt',`User-agent: *\nAllow: /\nSitemap: ${root}sitemap.xml\n`);
 console.log(`${paths.length} pages HTML et sitemap générés.`);
}

if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 const env=loadEnv('production',process.cwd(),'VITE_');
 await generateStaticPages({base:process.env.VITE_BASE_PATH||env.VITE_BASE_PATH||'/',siteUrl:process.env.VITE_SITE_URL||env.VITE_SITE_URL||defaultSiteUrl});
}
