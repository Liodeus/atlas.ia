import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowRight,ChevronDown,Search} from 'lucide-react';
import {PageHead} from './LearningUI.jsx';
import {FancySelect} from './FancySelect.jsx';
import {orderedThemes,short} from './appData.js';
import {courseTitles} from './courseTitles.js';
import {normalize} from './core.js';
import {useApp} from './appContext.js';
import {LearningDiagram} from './LearningDiagrams.jsx';
import {Demo} from './CourseDemo.jsx';
import {diagramCatalog} from './diagramCatalog.js';
import './diagram-gallery.css';

function GalleryItem({item}){
 const [loaded,setLoaded]=useState(false);
 const {setCourseDepth}=useApp();
 return <details className="gallery-item" data-catalog-id={item.key} onToggle={event=>{if(event.currentTarget.open)setLoaded(true)}}>
  <summary>
   <span className="gallery-item-heading"><span className="gallery-item-kind">{item.kind==='demo'?'Démonstration interactive':'Schéma'}{item.deep?' · Approfondi':''}</span><strong>{item.title}</strong></span>
   <ChevronDown className="gallery-chevron" size={20} aria-hidden="true"/>
  </summary>
  {loaded&&<div className="gallery-item-content">
   {item.kind==='demo'?<Demo id={item.theme}/>:<LearningDiagram id={item.id}/>}
   <Link className="gallery-lesson-link" to={'/cours/'+item.theme+'?etape='+item.step} onClick={()=>{if(item.deep)setCourseDepth('detailed')}}>
    <span><b>Lire la leçon</b><small>{courseTitles[item.theme-1][item.step-1]}</small></span><ArrowRight size={18} aria-hidden="true"/>
   </Link>
  </div>}
 </details>;
}

export default function DiagramGallery(){
 const [query,setQuery]=useState(''),[theme,setTheme]=useState('all');
 const terms=normalize(query).trim().split(/\s+/).filter(Boolean);
 const results=diagramCatalog.filter(item=>{
  if(theme!=='all'&&item.theme!==Number(theme))return false;
  const text=normalize([item.title,item.description,item.section,short[item.theme-1],courseTitles[item.theme-1][item.step-1]].join(' '));
  return terms.every(term=>text.includes(term));
 });
 return <div className="content diagram-gallery">
  <PageHead eyebrow="LA BIBLIOTHÈQUE VISUELLE" title={<>Tous les <em>schémas.</em></>} description="Retrouvez les schémas et les démonstrations des cours, réunis par thème. Ouvrez un titre pour explorer son illustration."/>
  <div className="gallery-filters">
   <label className="searchbox"><Search size={18} aria-hidden="true"/><input aria-label="Rechercher un schéma" placeholder="Rechercher : cache, Attention, LoRA…" value={query} onChange={event=>setQuery(event.target.value)}/></label>
   <FancySelect label="Thème des schémas" value={theme} onChange={setTheme} options={[{value:'all',label:'Tous les thèmes'},...orderedThemes.map(t=>({value:String(t.id),label:short[t.id-1]}))]}/>
  </div>
  <p className="gallery-count" role="status">{results.length} illustration{results.length>1?'s':''} sur {diagramCatalog.length}</p>
  {results.length?orderedThemes.map(t=>{
   const items=results.filter(item=>item.theme===t.id);
   return items.length>0&&<section className="gallery-theme" key={t.id} aria-labelledby={'gallery-theme-'+t.id}>
    <h2 id={'gallery-theme-'+t.id}>{short[t.id-1]} <small>{items.length}</small></h2>
    <div className="gallery-items">{items.map(item=><GalleryItem item={item} key={item.key}/>)}</div>
   </section>;
  }):<div className="gallery-empty"><p>Aucun schéma ne correspond à cette recherche.</p><button className="button secondary" onClick={()=>{setQuery('');setTheme('all')}}>Réinitialiser les filtres</button></div>}
 </div>;
}
