import React from 'react';
import {Link,useSearchParams} from 'react-router-dom';
import {ArrowRight} from 'lucide-react';
import {learningPaths,learningPathGroups,pathForLesson,resumeLearningPath,learningPathLink} from './learningPaths.js';
import {useApp} from './appContext.js';
import {PageHead,Btn} from './LearningUI.jsx';
import {readPathFilters,pathCatalogHref,searchLearningPaths} from './pathSearch.js';

export default function PathCatalog(){
 const {data}=useApp(),active=pathForLesson(data.lastLesson?.goal,data.lastLesson||{}),next=active&&resumeLearningPath(active,data);
 const [params,setParams]=useSearchParams(),filters=readPathFilters(params),matches=searchLearningPaths(filters);
 const update=changes=>setParams(pathCatalogHref({...filters,...changes}).split('?')[1]||'',{replace:true});
 return <div className="content paths-page">
  <PageHead eyebrow="PARCOURS PAR OBJECTIF" title={<>Choisissez votre <em>parcours.</em></>} description={`${learningPaths.length} parcours pour apprendre selon vos objectifs.`}/>
  {next&&<section className="path-resume" aria-label="Votre parcours en cours"><div><span className="card-kicker">VOTRE PARCOURS EN COURS</span><h2>{active.title}</h2></div><Btn to={learningPathLink(active,next)} state={{resumePosition:true}}>Reprendre ce parcours</Btn></section>}
  <div className="path-filters" role="search" aria-label="Trouver un parcours"><label>Rechercher un parcours<input type="search" placeholder="Ex. : sécurité, MCP, mémoire…" value={filters.q} maxLength={180} onChange={event=>update({q:event.target.value})}/></label><label>Famille de parcours<select aria-label="Famille de parcours" value={filters.group} onChange={event=>update({group:event.target.value})}><option value="all">Toutes les familles</option>{learningPathGroups.map(group=><option key={group.id} value={group.id}>{group.title}</option>)}</select></label></div>
  <div className="path-results"><p role="status">{matches.length} parcours {matches.length===1?'disponible':'disponibles'}</p>{(filters.q||filters.group!=='all')&&<button className="text-link" onClick={()=>update({q:'',group:'all'})}>Réinitialiser les filtres</button>}</div>
  {learningPathGroups.map((group,index)=>matches.some(path=>path.group===group.id)&&<section className="path-group" key={group.id} aria-labelledby={'path-group-'+group.id} style={{'--path-color':`var(--c${index%4})`}}>
   <div className="path-group-heading"><h2 id={'path-group-'+group.id}>{group.title}</h2><p>{group.description}</p></div>
   <div className="path-grid">{matches.filter(path=>path.group===group.id).map(path=>{
    const count=path.lessons.filter(lesson=>data.completed.includes(`${lesson.theme}-${lesson.step}`)).length,done=count===path.lessons.length;
    return <Link className="path-card" key={path.id} to={'/parcours/'+path.id} state={{catalogFilters:filters}} aria-labelledby={'path-title-'+path.id}>
     <div className="path-card-meta"><span>{path.level}</span><span>{path.lessons.length} leçons</span></div>
     <h3 id={'path-title-'+path.id}>{path.title}</h3><p>{path.description}</p>
     <div className="path-card-bottom"><span>{done?'Parcours terminé':count?`${count}/${path.lessons.length} leçons terminées`:'Découvrir le parcours'}</span><ArrowRight size={17} aria-hidden="true"/></div>
     {count>0&&<div className="path-progress" aria-hidden="true"><span style={{width:100*count/path.lessons.length+'%'}}/></div>}
    </Link>;
   })}</div>
  </section>)}
  {matches.length===0&&<div className="path-empty"><h2>Aucun parcours ne correspond</h2><p>Essayez un autre mot ou choisissez une autre famille.</p></div>}
  <div className="path-catalog-note"><p>Une leçon terminée compte dans tous les parcours qui la proposent. Vous pouvez changer de parcours à tout moment.</p></div>
 </div>;
}
