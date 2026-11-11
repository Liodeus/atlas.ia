import React,{useEffect,useState,useMemo} from 'react';
import {Link} from 'react-router-dom';
import {ArrowRight} from 'lucide-react';
import {searchIndex} from './search.js';
import {lessonPath} from './lessonNavigation.js';
import {short} from './appData.js';

export default function CourseSearchResults({query,theme}){
 const [index,setIndex]=useState(null),[error,setError]=useState(false);
 useEffect(()=>{let active=true;import('./courseSearch.js').then(module=>{if(active)setIndex({all:module.courseSearchIndex,essential:module.courseEssentialSearchIndex})}).catch(()=>{if(active)setError(true)});return()=>{active=false}},[]);
 const results=useMemo(()=>{
  if(!index)return [];
  const essential=new Set(searchIndex(index.essential,query).map(({item})=>`${item.theme}-${item.step}`));
  return searchIndex(index.all,query).filter(({item})=>theme==='all'||item.theme===Number(theme)).map(result=>({...result,deepOnly:!essential.has(`${result.item.theme}-${result.item.step}`)}));
 },[index,query,theme]);
 if(error)return <p className="filter-note" role="status">Les cours n’ont pas pu être chargés. <button className="text-link" onClick={()=>window.location.reload()}>Réessayer</button></p>;
 if(!index)return <p className="filter-note" role="status">Recherche dans les cours…</p>;
 if(!results.length)return null;
 const rows=items=>items.map(({item,deepOnly})=><Link className="course-search-row" key={`${item.theme}-${item.step}`} to={lessonPath(item)} state={deepOnly?{courseDepth:'detailed'}:undefined}><span><b>{item.title}</b><small>{short[item.theme-1]} · Leçon {item.step}{deepOnly?' · Approfondi':''}</small></span><ArrowRight size={16} aria-hidden="true"/></Link>);
 return <section className="course-search-results" aria-label="Cours trouvés"><h2>{results.length} cours associé{results.length>1?'s':''}</h2>{rows(results.slice(0,3))}{results.length>3&&<details className="course-search-more"><summary>Voir les {results.length-3} autres cours</summary>{rows(results.slice(3))}</details>}</section>;
}
