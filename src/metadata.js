import {entries,entriesById,short,descriptions,orderedThemes,themeById} from './appData.js';
import {conceptName} from './terminology.js';
import {courseTitles} from './courseTitles.js';
import {lessonPath,parseLessonStep} from './lessonNavigation.js';
import {learningPaths,findLearningPath} from './learningPaths.js';

import {defaultSiteUrl,normalizeSiteUrl} from './siteUrl.js';
export {defaultSiteUrl,normalizeSiteUrl} from './siteUrl.js';
const summary=text=>{const value=String(text).replace(/\s+/g,' ').trim();return value.length>170?value.slice(0,167).replace(/\s+\S*$/,'')+'…':value.charAt(0).toUpperCase()+value.slice(1)};
const pages={
 '/':['Comprendre l’intelligence artificielle','Apprenez l’IA, les LLM et les agents à votre rythme : 18 thèmes, 54 leçons et 551 notions, avec schémas, quiz et flashcards.'],
 '/apprendre':['Les thèmes de l’IA','Explorez les 18 thèmes d’Atlas IA ou choisissez un parcours guidé selon votre objectif.'],
 '/parcours':['Les parcours d’apprentissage',`${learningPaths.length} parcours pour comprendre l’IA, concevoir des applications, évaluer les réponses, protéger les données et préparer un déploiement.`],
 '/distinctions':['35 distinctions à ne pas mélanger','Comparez les notions proches de l’IA : leurs différences, des exemples concrets et les fiches pour les comprendre.'],
 '/glossaire':['Le glossaire de l’IA','Retrouvez 551 notions de l’IA, des LLM et des agents. Recherchez une définition ou un cours, par thème et par mots-clés.'],
 '/schemas':['Les schémas de l’IA','Explorez 22 schémas et 17 démonstrations interactives pour comprendre les modèles, le RAG et les agents.'],
 '/flashcards':['Réviser avec les flashcards','Révisez les 551 notions d’Atlas IA avec des flashcards et retrouvez les notions à revoir.'],
 '/quiz':['Tester ses connaissances','Vérifiez votre compréhension de l’IA avec 278 questions, des corrections et des liens vers les notions.'],
 '/progression':['Ma progression','Retrouvez vos leçons terminées, vos révisions et vos sauvegardes de progression sur cet appareil.']
};

export function pageMetadata(pathname,search='',siteUrl=defaultSiteUrl){
 const path=pathname.replace(/\/+$/,'')||'/';
 let title,description,canonicalPath=path,noindex=path==='/progression',kind='page',theme,step,entry,goal;
 if(pages[path])[title,description]=pages[path];
 else if(/^\/themes\/\d+$/.test(path)&&(theme=themeById(path.split('/')[2]))){title=short[theme.id-1];description=descriptions[theme.id-1]+' Trois leçons et les notions associées.';kind='theme'}
 else if(/^\/notions\/[^/]+$/.test(path)&&(entry=entriesById.get(path.split('/')[2]))){title=conceptName(entry);description=summary(entry.definition);kind='notion'}
 else if(/^\/parcours\/[^/]+$/.test(path)&&(goal=findLearningPath(path.split('/')[2]))){title=goal.title;description=goal.description;kind='goal'}
 else if(/^\/cours\/\d+(?:\/lecons\/[123])?$/.test(path)&&(theme=themeById(path.split('/')[2]))){
  step=parseLessonStep(path.split('/')[4]||new URLSearchParams(search).get('etape'));
  title=courseTitles[theme.id-1][step-1];description=summary(`${title}. Leçon ${step} du thème ${short[theme.id-1]} : explications, exemples et notions à retenir.`);canonicalPath=lessonPath({theme:theme.id,step});kind='course';
 }else{title='Page introuvable';description='Ce chemin n’existe pas. Retrouvez les cours et les notions depuis l’accueil d’Atlas IA.';noindex=true;canonicalPath=null;kind='missing'}
 const root=normalizeSiteUrl(siteUrl),url=canonicalPath?new URL(canonicalPath.slice(1),root).href:null;
 return {title:title+' | Atlas IA',heading:title,description,url,image:new URL('social-card.png',root).href,noindex,kind,path:canonicalPath,theme:theme?.id,step,entry,goal};
}

export function publicPagePaths(){
 return [...Object.keys(pages).filter(path=>path!=='/progression'),...learningPaths.map(path=>'/parcours/'+path.id),...orderedThemes.map(theme=>'/themes/'+theme.id),...orderedThemes.flatMap(theme=>[1,2,3].map(step=>lessonPath({theme:theme.id,step}))),...entries.map(entry=>'/notions/'+entry.id)];
}
