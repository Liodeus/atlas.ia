import React, {useState, useEffect, useLayoutEffect, useRef, createContext, useContext, Suspense, lazy} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter,Routes,Route,Link,NavLink,Navigate,useParams,useNavigate,useLocation,useNavigationType} from 'react-router-dom';
import {ArrowRight, ArrowLeft, ArrowLeftRight, BookOpen, Bookmark, Check, ChevronRight, Compass, Network, GraduationCap, LayoutDashboard, Menu, Moon, Search, Sparkles, Sun, Target, X, RotateCcw, Download, Upload, Layers, CheckCircle2, SquareStack} from 'lucide-react';
import themes from './themes.js';
import {harnessSources} from './extensionHarness.js';
import {familySources} from './extensionFamilies.js';
import {FancySelect} from './FancySelect.jsx';
import {Eyebrow,ChoiceGroup,PageHead,Btn} from './LearningUI.jsx';
import {ErrorBoundary} from './ErrorBoundary.jsx';
import {isDraftOnlyChange,createProgressWriter} from './progressStorage.js';
import {NotFound} from './NotFound.jsx';
const LazyDiagramGallery=lazy(()=>import('./DiagramGallery.jsx'));
const RelatedDiagram=lazy(()=>import('./RelatedDiagram.jsx'));
const Flashcards=lazy(()=>import('./Flashcards.jsx').then(module=>({default:module.Flashcards})));
import {sentenceStart} from './editorialPresentation.js';
import {expandAbbreviations} from './abbreviations.js';
import {StudyMarks} from './StudyMarks.jsx';
import {conceptName} from './terminology.js';
import {learningOrder,lessonNeighbor,shouldHandleLessonArrow,lessonPath,parseLessonStep,resumeLesson} from './lessonNavigation.js';
import {courseTitles,coursePrerequisites} from './courseTitles.js';
import {resumeLearningPath,learningPathLink,pathForLesson,isCourseReturnLink} from './learningPaths.js';
import {createSearchIndex,searchIndex as searchRecords} from './search.js';
import {PageMetadata} from './PageMetadata.jsx';
const LazyGoalPath=lazy(()=>import('./GoalPaths.jsx'));
const LazyPathCatalog=lazy(()=>import('./PathCatalog.jsx'));
const CourseSearchResults=lazy(()=>import('./CourseSearchResults.jsx'));
import {CourseDepth} from './CourseDepth.jsx';
import './course-learning.css';
import {paginate} from './pagination.js';
import {normalize,readStoredProgress} from './core.js';
import './style.css';
import './interface.css';
import {Ctx,useApp} from './appContext.js';
import {orderedThemes,moduleNumber,entries,entriesById,priority,initial,short,icons,descriptions,sourceLabels,themeById} from './appData.js';
function Provider({children}){
 const [loaded]=useState(()=>{try{const raw=localStorage.getItem('atlas-progress');return {...readStoredProgress(raw),raw}}catch{return {progress:null,blocked:true,raw:null}}});
 const [storageBlocked,setStorageBlocked]=useState(loaded.blocked);
 const [warning,setWarning]=useState(loaded.blocked?(loaded.raw===null?'Le stockage est indisponible : exportez votre progression avant de quitter.':'La sauvegarde est illisible ou d’une version inconnue. Elle est protégée ; vous pouvez exporter sa copie depuis Progression.'):'');
 const [data,setData]=useState(()=>loaded.progress||initial);
 const previousData=useRef(null),writer=useRef(null),lastStored=useRef(loaded.raw);
 if(!writer.current)writer.current=createProgressWriter(value=>{const raw=JSON.stringify(value);localStorage.setItem('atlas-progress',raw);lastStored.current=raw},()=>setWarning('Le stockage du navigateur est indisponible : exportez votre progression avant de quitter.'),200,()=>localStorage.getItem('atlas-progress')===lastStored.current,()=>setWarning('La progression a changé dans un autre onglet. Exportez votre progression avant de continuer.'));
 const [dark,setDark]=useState(()=>{try{return localStorage.getItem('atlas-theme')==='dark'}catch{return false}});
 const [courseDepth,setCourseDepth]=useState(()=>{try{return localStorage.getItem('atlas-course-depth')==='detailed'?'detailed':'essential'}catch{return 'essential'}});
 useEffect(()=>{try{localStorage.setItem('atlas-course-depth',courseDepth)}catch{}},[courseDepth]);
 useEffect(()=>{document.documentElement.dataset.theme=dark?'dark':'light';try{localStorage.setItem('atlas-theme',dark?'dark':'light')}catch{}},[dark]);
 useLayoutEffect(()=>{if(storageBlocked){writer.current.cancel();previousData.current=data;return}if(isDraftOnlyChange(previousData.current,data))writer.current.schedule(data);else writer.current.writeNow(data);previousData.current=data},[data,storageBlocked]);
 useEffect(()=>{const flush=()=>writer.current.flush(),onHidden=()=>{if(document.visibilityState==='hidden')flush()};window.addEventListener('pagehide',flush);document.addEventListener('visibilitychange',onHidden);return()=>{window.removeEventListener('pagehide',flush);document.removeEventListener('visibilitychange',onHidden);flush()}},[]);
 return <Ctx.Provider value={{data,setData,dark,setDark,courseDepth,setCourseDepth,warning,setWarning,storageBlocked,setStorageBlocked,rawStored:loaded.raw}}>{children}</Ctx.Provider>;
}
function ScrollManager(){
 const location=useLocation(),navigation=useNavigationType(),positions=useRef(new Map()),current=useRef(location.key);
 useEffect(()=>{const previous=history.scrollRestoration;history.scrollRestoration='manual';const record=()=>positions.current.set(current.current,window.scrollY);window.addEventListener('scroll',record,{passive:true});return()=>{window.removeEventListener('scroll',record);history.scrollRestoration=previous}},[]);
 useLayoutEffect(()=>{current.current=location.key;const top=navigation==='POP'?(positions.current.get(location.key)||0):0;window.scrollTo({top,behavior:'instant'})},[location.key,navigation]);
 return null;
}
function Layout(){const {dark,setDark,warning}=useApp();const [menu,setMenu]=useState(false);const menuButton=useRef(null),menuPanel=useRef(null),closeButton=useRef(null);
 const closeMenu=()=>{setMenu(false);requestAnimationFrame(()=>menuButton.current?.focus())};
 useEffect(()=>{const media=matchMedia('(max-width: 900px)');const changed=event=>{if(!event.matches)setMenu(false)};media.addEventListener('change',changed);return()=>media.removeEventListener('change',changed)},[]);
 useEffect(()=>{if(!menu)return;closeButton.current?.focus();const handle=e=>{if(e.key==='Escape'){e.preventDefault();closeMenu();return}if(e.key!=='Tab')return;const items=[...menuPanel.current.querySelectorAll('a[href],button:not([disabled])')].filter(x=>x.getClientRects().length);if(!items.length)return;const first=items[0],last=items[items.length-1];if(e.shiftKey&&(document.activeElement===first||!menuPanel.current.contains(document.activeElement))){e.preventDefault();last.focus()}else if(!e.shiftKey&&(document.activeElement===last||!menuPanel.current.contains(document.activeElement))){e.preventDefault();first.focus()}};document.addEventListener('keydown',handle);return()=>document.removeEventListener('keydown',handle)},[menu]);const links=[['/',LayoutDashboard,'Accueil'],['/apprendre',BookOpen,'Apprendre'],['/parcours',Compass,'Parcours'],['/glossaire',Layers,'Glossaire'],['/schemas',Network,'Schémas'],['/distinctions',ArrowLeftRight,'Distinctions'],['/flashcards',SquareStack,'Flashcards'],['/quiz',Target,'Quiz'],['/progression',GraduationCap,'Progression']];return <div className="shell"><a href="#contenu-principal" className="skip-link">Aller au contenu principal</a><ScrollManager/><PageMetadata/><aside id="site-navigation" ref={menuPanel} role={menu?"dialog":undefined} aria-modal={menu?true:undefined} aria-label="Navigation principale" className={'sidebar '+(menu?'opened':'')}><div className="brand"><Link to="/" onClick={closeMenu}><span className="brand-mark">✳</span><span>atlas<span className="brand-accent">.</span><small>IA</small></span></Link><button ref={closeButton} className="mobile-close iconbtn" onClick={closeMenu} aria-label="Fermer le menu"><X size={19}/></button></div><div className="side-label">VOTRE ESPACE</div><nav>{links.map(([path,Icon,label])=><NavLink end={path==='/'} key={path} to={path} onClick={closeMenu} className={({isActive})=>'navlink '+(isActive?'active':'')}><Icon size={18}/>{label}</NavLink>)}</nav><div className="side-bottom"><button className="theme-toggle" onClick={()=>setDark(!dark)}>{dark?<Sun size={17}/>:<Moon size={17}/>} Mode {dark?'clair':'sombre'}</button></div></aside><div className="mainarea" inert={menu?true:undefined}><header className="topbar"><button ref={menuButton} className="mobile-menu iconbtn" onClick={()=>setMenu(true)} aria-label="Ouvrir le menu" aria-expanded={menu} aria-controls="site-navigation"><Menu/></button><span className="top-context">Votre espace d’apprentissage</span><Link className="top-search" to="/glossaire"><Search size={16}/> <span>Rechercher une notion ou un cours…</span></Link></header>{warning&&<div className="warning">{warning}</div>}<main id="contenu-principal" tabIndex={-1}><Suspense fallback={<p className="content" role="status">Chargement de la page…</p>}><Routes><Route path="/" element={<Home/>}/><Route path="/apprendre" element={<Learn/>}/><Route path="/parcours" element={<LazyPathCatalog/>}/><Route path="/essentiels" element={<Navigate replace to="/glossaire"/>}/><Route path="/parcours/:id" element={<LazyGoalPath/>}/><Route path="/distinctions" element={<LazyDistinctions/>}/><Route path="/themes/:id" element={<LazyThemePage/>}/><Route path="/cours/:id" element={<LegacyCourseRoute/>}/><Route path="/cours/:id/lecons/:step" element={<LazyCourse/>}/><Route path="/glossaire" element={<Glossary/>}/><Route path="/schemas" element={<LazyDiagramGallery/>}/><Route path="/notions/:id" element={<LazyNotion/>}/><Route path="/flashcards" element={<FlashcardsPage/>}/><Route path="/quiz" element={<QuizRoute/>}/><Route path="/progression" element={<LazyProgress/>}/><Route path="*" element={<NotFound/>}/></Routes></Suspense><footer><span><b>✳ atlas.IA</b> · Apprendre à voir plus clair.</span><span>Fait pour les curieux · sans compte</span></footer></main></div>{menu&&<button className="overlay" tabIndex={-1} onClick={closeMenu} aria-label="Fermer le menu"/>}</div>}
function ThemeCard({t,compact=false}){
 const {data}=useApp(),n=data.completed.filter(x=>x.startsWith(t.id+'-')).length;
 return <Link className="theme-card" to={'/themes/'+t.id} style={{'--card-color':`var(--c${(t.id-1)%4})`}}>
  <span className="theme-index">{moduleNumber(t.id)}</span>
  <div className="card-body"><h3>{short[t.id-1]}</h3>{!compact&&<p>{descriptions[t.id-1]}</p>}<span className="theme-card-progress">{n?`${n}/3 leçons terminées`:'3 leçons'}</span></div>
  <ArrowRight className="theme-card-arrow" size={18} aria-hidden="true"/>
 </Link>;
}
function Home(){
 const {data}=useApp(),goal=pathForLesson(data.lastLesson?.goal,data.lastLesson||{}),next=(goal&&resumeLearningPath(goal,data))||resumeLesson(data),started=Boolean(data.completed.length||data.lastLesson);
 return <div className="content home-page">
  <header className="home-welcome"><Eyebrow>APPRENDRE L’IA, SIMPLEMENT</Eyebrow><h1>Les grandes idées, <em>à portée de main.</em></h1><p>Comprenez les modèles et les agents, une leçon à la fois.</p></header>
  <div className="home-start">
   <section className="home-lesson" aria-labelledby="home-lesson-title">
    <div className="home-lesson-label"><BookOpen size={18} aria-hidden="true"/><span>{next?(started?'VOTRE PROCHAINE LEÇON':'VOTRE PREMIÈRE LEÇON'):'À VOTRE RYTHME'}</span></div>
    <h2 id="home-lesson-title">{next?(started?courseTitles[next.theme-1][next.step-1]:'Comprendre les bases de l’IA'):'Toutes les leçons sont terminées.'}</h2>
    <p>{next?(started?<>{short[next.theme-1]} · Leçon {next.step}{goal&&<> · {goal.title}</>}</>:'Une première leçon pour distinguer les grandes notions de l’IA.'):'Retrouvez les thèmes que vous souhaitez revoir.'}</p>
    <div className="home-lesson-action">{next?<Btn to={learningPathLink(goal,next)} state={{resumePosition:true}}>{started?'Reprendre mon parcours':'Commencer le parcours'}</Btn>:<Btn to="/apprendre">Explorer les thèmes</Btn>}{next&&!started&&<span>Aucun prérequis</span>}</div>
   </section>
   <nav className="home-shortcuts" aria-label="Autres façons d’apprendre">
    <Link className="home-shortcut" to="/parcours" aria-label="Choisir un parcours"><span className="home-shortcut-icon"><Compass size={21} aria-hidden="true"/></span><span><b>Choisir un parcours</b><small>Avancez selon votre objectif.</small></span><ArrowRight size={18} aria-hidden="true"/></Link>
    <Link className="home-shortcut" to="/quiz" aria-label="Se tester"><span className="home-shortcut-icon"><Target size={21} aria-hidden="true"/></span><span><b>Se tester</b><small>Faites le point sur vos connaissances.</small></span><ArrowRight size={18} aria-hidden="true"/></Link>
   </nav>
  </div>
  <div className="section-title"><h2>Les premiers thèmes</h2><Link className="text-link" to="/apprendre">Les {themes.length} thèmes <ArrowRight size={16}/></Link></div>
  <div className="theme-grid">{orderedThemes.slice(0,3).map(t=><ThemeCard key={t.id} t={t}/>)}</div>
  <div className="home-progress"><p>{data.completed.length?`${data.completed.length} leçon${data.completed.length>1?'s':''} terminée${data.completed.length>1?'s':''}. `:''}Votre progression est enregistrée dans ce navigateur.</p><Link className="text-link" to="/progression">Suivre et sauvegarder ma progression <ArrowRight size={16}/></Link></div>
 </div>;
}
function Learn(){
 return <div className="content learn-page"><PageHead eyebrow="LES THÈMES" title={<>Explorez à votre <em>rythme.</em></>} description={`${themes.length} thèmes, trois leçons chacun. Suivez l’ordre conseillé ou choisissez un sujet.`}/>
  <nav className="library-extras" aria-label="Repères pour apprendre"><Link className="text-link" to="/parcours">Choisir un parcours par objectif <ArrowRight size={16}/></Link></nav>
  <div className="theme-grid">{orderedThemes.map(t=><ThemeCard key={t.id} t={t} compact/>)}</div>
 </div>;
}
function Distinctions({distinctions}){
 const {hash}=useLocation(),[query,setQuery]=useState('');
 const filtered=distinctions.map((item,index)=>({item,index})).filter(({item})=>normalize(JSON.stringify(item)).includes(normalize(query.trim())));
 useEffect(()=>{
  if(!/^#distinction-\d+$/.test(hash))return;
  const frame=requestAnimationFrame(()=>{const target=document.getElementById(hash.slice(1));if(!target)return;target.open=true;target.querySelector('summary')?.focus({preventScroll:true});target.scrollIntoView({block:'start',behavior:'instant'})});
  return()=>cancelAnimationFrame(frame);
 },[hash]);
 return <div className="content distinctions-page"><Link to="/apprendre" className="back"><ArrowLeft size={15}/> Tous les thèmes</Link><PageHead eyebrow="POUR MIEUX COMPRENDRE" title={<>Les distinctions à ne pas <em>mélanger.</em></>} description="Choisissez deux notions pour comprendre ce qui les distingue."/>
  <label className="searchbox distinction-search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} aria-label="Rechercher une distinction" placeholder="Rechercher une notion ou une comparaison…"/></label>
  <p className="filter-note" aria-live="polite">{filtered.length} distinction{filtered.length!==1?'s':''} trouvée{filtered.length!==1?'s':''}</p>
  <div className="distinctions-grid">{filtered.map(({item:d,index:i})=><details className="distinction-card disclosure" id={'distinction-'+(i+1)} key={d.title}>
   <summary><h2>{d.title}</h2><ChevronRight className="disclosure-chevron" size={18} aria-hidden="true"/></summary>
   <div className="distinction-content">{d.left&&d.right?<><div className="distinction-difference"><b>La différence</b><p>{d.difference}</p></div><div className="distinction-sides">{[d.left,d.right].map(side=><section className="distinction-side" key={side.name}><h3>{side.name}</h3><p>{side.explanation}</p>{side.concept&&<Link className="text-link" to={'/notions/'+side.concept}>Voir la notion <ArrowRight size={14}/></Link>}</section>)}</div>{d.example&&<p className="distinction-example"><b>Exemple :</b> {d.example}</p>}</>:<p>{d.text}</p>}<RelatedDiagram comparison={d}/></div>
  </details>)}</div>
  {!filtered.length&&<div className="empty"><p>Aucune distinction trouvée.</p><button className="button secondary" onClick={()=>setQuery('')}>Effacer la recherche</button></div>}
 </div>;
}
function ThemePage({courseEditorial,lessonTiming,formatDuration}){
 const {id}=useParams(),t=themeById(id),{data,courseDepth,setCourseDepth}=useApp(),location=useLocation(),headingRef=useRef(null);
 useEffect(()=>{if(location.state?.focusCourseHeading)headingRef.current?.focus({preventScroll:true})},[location.key]);
 if(!t)return <NotFound/>;
 const titles=courseTitles[t.id-1],completed=[1,2,3].filter(step=>data.completed.includes(`${id}-${step}`));
 const next=[1,2,3].find(step=>!completed.includes(step))||1;
 const action=completed.length===3?'Revoir la leçon 1':completed.length?'Reprendre la leçon '+next:'Commencer la leçon 1';
 return <div className="content theme-page"><Link to="/apprendre" className="back"><ArrowLeft size={15}/> Tous les thèmes</Link><PageHead eyebrow={'MODULE '+moduleNumber(t.id)+' · 3 LEÇONS'} title={short[t.id-1]} description={descriptions[t.id-1]} headingRef={headingRef}/>
  <div className="theme-start"><CourseDepth value={courseDepth} onChange={setCourseDepth}/><Btn to={lessonPath({theme:id,step:next})}>{action}</Btn></div>
  <section className="theme-lessons" aria-labelledby="theme-lessons-title"><div className="section-title"><h2 id="theme-lessons-title">Votre parcours</h2><span className="muted">{completed.length}/3 terminées</span></div><div className="lesson-list">{titles.map((title,i)=><Link key={i} to={lessonPath({theme:id,step:i+1})} className="lesson-row"><span className="lesson-number">0{i+1}</span><span className="lesson-name"><b>{title}</b><small>{courseEditorial[t.id][i].concepts.length} notions · {formatDuration(lessonTiming(t.id,i+1,courseEditorial[t.id][i])[courseDepth])}</small></span>{data.completed.includes(`${id}-${i+1}`)?<CheckCircle2 className="success" size={19}/>:<ArrowRight size={18}/>}</Link>)}</div></section>
  {coursePrerequisites[t.id-1].length>0&&<details className="disclosure theme-extra"><summary><span>Les prérequis conseillés <small>Facultatifs</small></span><ChevronRight className="disclosure-chevron" size={18} aria-hidden="true"/></summary><div className="prereq-links">{coursePrerequisites[t.id-1].map(prereq=><Link key={prereq.theme+'-'+prereq.step} to={lessonPath(prereq)}><BookOpen size={16}/><span><b>{courseTitles[prereq.theme-1][prereq.step-1]}</b><small>{prereq.reason}</small></span><ChevronRight size={15}/></Link>)}</div></details>}
  <details className="disclosure theme-extra"><summary><span>Les ressources du thème <small>Fiches, flashcards et quiz</small></span><ChevronRight className="disclosure-chevron" size={18} aria-hidden="true"/></summary><div className="resource-links"><Link to={'/glossaire?theme='+id}>{t.entries.length} fiches du glossaire <ArrowRight size={16}/></Link><Link to={'/flashcards?theme='+id}>Réviser avec les flashcards <ArrowRight size={16}/></Link><Link to={'/quiz?theme='+id}>Faire le quiz du thème <ArrowRight size={16}/></Link></div><div className="related"><span className="card-kicker">{t.entries.some(e=>e.priority)?'NOTIONS ESSENTIELLES':'QUELQUES NOTIONS'}</span><div className="tag-list">{(t.entries.some(e=>e.priority)?t.entries.filter(e=>e.priority):t.entries.slice(0,5)).map(e=><Link className="tag" key={e.id} to={'/notions/'+e.id}>{conceptName(e)} <ChevronRight size={14}/></Link>)}</div></div></details>
  {(t.id===17||t.id===18)&&<details className="disclosure theme-extra"><summary><span>Sources officielles</span><ChevronRight className="disclosure-chevron" size={18} aria-hidden="true"/></summary><p className="filter-note">Références consultées du 9 au 12 novembre 2026. Les versions, capacités et conditions évoluent.</p><div className="tag-list">{(t.id===17?harnessSources:familySources).map(source=><a className="tag" key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label||source.name} ↗</a>)}</div></details>}
 </div>;
}
function Glossary(){
 const location=useLocation();
 const [conceptLevels,setConceptLevels]=useState(null),[levelError,setLevelError]=useState('');
 const searchIndex=React.useMemo(()=>createSearchIndex(entries,{title:conceptName,body:e=>e.name+' '+e.definition}),[]);
 const [initial]=useState(()=>{
  const requested=new URLSearchParams(location.search).get('theme');
  let retry;try{retry=JSON.parse(sessionStorage.getItem('atlas-glossary-retry'));sessionStorage.removeItem('atlas-glossary-retry')}catch{}
  const saved=retry||history.state?.atlasGlossary||location.state?.glossaryFilters;
  const fallback={q:'',category:themes.some(t=>String(t.id)===requested)?requested:'all',only:false,sort:'pedagogique',glossLevel:'all',page:1};
  return saved&&typeof saved==='object'?{...fallback,...saved}:fallback;
 });
 const [q,setQ]=useState(initial.q),[category,setCategory]=useState(initial.category),[only,setOnly]=useState(initial.only),[sort,setSort]=useState(initial.sort),[glossLevel,setGlossLevel]=useState(initial.glossLevel),[page,setPage]=useState(initial.page);
 const resultAnchor=useRef(null);
 useEffect(()=>{
  if(glossLevel==='all'||conceptLevels||levelError)return;
  let active=true;
  loadQuestions().then(questions=>{if(!active)return;const levels=questions.reduce((map,item)=>{if(!map.has(item.concept))map.set(item.concept,new Set());map.get(item.concept).add(item.level);return map},new Map());setConceptLevels(levels)}).catch(()=>{if(active)setLevelError('Impossible de charger les niveaux. Réessayez ou choisissez tous les niveaux.')});
  return()=>{active=false};
 },[glossLevel,conceptLevels,levelError]);
 const loadingLevels=glossLevel!=='all'&&!conceptLevels&&!levelError;
 const matches=React.useMemo(()=>searchRecords(searchIndex,q).map(match=>match.item),[searchIndex,q]);
 let found=matches.filter(e=>(category==='all'||e.theme===Number(category))&&(!only||e.priority)&&(glossLevel==='all'||conceptLevels?.get(e.id)?.has(glossLevel)));
 if(sort==='az')found=[...found].sort((a,b)=>conceptName(a).localeCompare(conceptName(b),'en'));
 const result=paginate(found,page,24);
 useEffect(()=>{try{history.replaceState({...history.state,atlasGlossary:{q,category,only,sort,glossLevel,page:loadingLevels||levelError?page:result.page}},'')}catch{}},[q,category,only,sort,glossLevel,page,result.page,loadingLevels,levelError]);
 const change=(setter,value)=>{if(setter===setGlossLevel)setLevelError('');setter(value);setPage(1)};
 const goToPage=next=>{setPage(next);requestAnimationFrame(()=>{resultAnchor.current?.focus({preventScroll:true});resultAnchor.current?.scrollIntoView({block:'start',behavior:'instant'})})};
 return <div className="content glossary-page"><PageHead eyebrow="LE GLOSSAIRE" title={<>Les mots pour <em>comprendre.</em></>} description="Une référence pour mettre des mots simples sur les concepts de l’IA."/><div className="filters"><label className="searchbox"><Search size={18}/><input value={q} onChange={e=>change(setQ,e.target.value)} placeholder="Rechercher une notion ou un cours…" aria-label="Rechercher une notion ou un cours"/></label><FancySelect label="Filtrer par thème" value={category} onChange={v=>change(setCategory,v)} options={[{value:'all',label:'Tous les thèmes'},...orderedThemes.map(t=>({value:String(t.id),label:short[t.id-1]}))]}/></div><details className="disclosure glossary-options"><summary><span>Plus de filtres{(glossLevel!=='all'||sort!=='pedagogique'||only)&&<small>{[glossLevel!=='all'&&({debutant:'Débutant',intermediaire:'Intermédiaire',avance:'Avancé'}[glossLevel]),sort==='az'&&'De A à Z',only&&'Essentiels'].filter(Boolean).join(' · ')}</small>}</span><ChevronRight className="disclosure-chevron" size={18} aria-hidden="true"/></summary><div className="filters secondary-filters"><FancySelect label="Niveau des questions associées" value={glossLevel} onChange={v=>change(setGlossLevel,v)} options={[{value:'all',label:'Tous les niveaux'},{value:'debutant',label:'Débutant'},{value:'intermediaire',label:'Intermédiaire'},{value:'avance',label:'Avancé'}]}/><FancySelect label="Trier les notions" value={sort} onChange={v=>change(setSort,v)} options={[{value:'pedagogique',label:q.trim()?'Pertinence':'Ordre des thèmes'},{value:'az',label:'De A à Z'}]}/><label className="check"><input type="checkbox" checked={only} onChange={e=>change(setOnly,e.target.checked)}/> Essentiels</label></div>
 <p className="filter-note">Le niveau concerne les questions associées, pas la difficulté de la notion. Les filtres de niveau et de notions essentielles s’appliquent uniquement aux fiches.</p></details>
 <div className="results-toolbar">{(q||category!=='all'||only||glossLevel!=='all'||sort!=='pedagogique')&&<button className="text-link reset-filters" onClick={()=>{setQ('');setCategory('all');setOnly(false);setGlossLevel('all');setSort('pedagogique');setLevelError('');setPage(1)}}>Réinitialiser</button>}<div ref={resultAnchor} className="results-count" tabIndex={-1} aria-live="polite">{loadingLevels?'Chargement des niveaux…':levelError?levelError:<>{result.total} NOTION{result.total!==1?'S':''} TROUVÉE{result.total!==1?'S':''}{result.total>0&&<span> · {result.first} À {result.last} AFFICHÉES</span>}</>}</div></div>{levelError&&glossLevel!=='all'&&<button type="button" className="button secondary" onClick={()=>{const filters={q,category,only,sort,glossLevel,page};try{sessionStorage.setItem('atlas-glossary-retry',JSON.stringify(filters));history.replaceState({...history.state,atlasGlossary:filters},'')}catch{}window.location.reload()}}>Réessayer</button>}
 {q.trim()&&<Suspense fallback={<p className="filter-note" role="status">Recherche dans les cours…</p>}><CourseSearchResults query={q} theme={category}/></Suspense>}
 <div className="glossary-grid">{result.items.map(e=><Link className="gloss-card" to={'/notions/'+e.id} state={{glossaryFilters:{q,category,only,sort,glossLevel,page:result.page}}} key={e.id}><div><span className="card-kicker">{sourceLabels[e.theme-1]}</span>{e.priority&&<span className="star" title="Notion prioritaire">✦</span>}</div><h3>{conceptName(e)}</h3><p>{expandAbbreviations(sentenceStart(e.definition))}</p><span className="card-link">Voir la fiche <ArrowRight size={14}/></span></Link>)}</div>
 {!loadingLevels&&!levelError&&!result.total&&<div className="empty">Aucune notion trouvée. Essayez un autre terme ou retirez un filtre.</div>}
 {result.pages>1&&<nav className="pagination" aria-label="Pages du glossaire"><button className="pagination-button" disabled={result.page===1} onClick={()=>goToPage(result.page-1)}><ArrowLeft size={16}/> Précédent</button><span>Page <b>{result.page}</b> sur {result.pages}</span><button className="pagination-button" disabled={result.page===result.pages} onClick={()=>goToPage(result.page+1)}>Suivant <ArrowRight size={16}/></button></nav>}
 </div>;
}

function Notion({courseEditorial,getNotionLearningLinks,notionContent,notionContentSources,distinctions,lessonSources}){
 const {id}=useParams(),{data,setData}=useApp(),e=entries.find(x=>x.id===id),location=useLocation();
 const previousCourse=isCourseReturnLink(location.state?.returnTo)?location.state.returnTo:null;
 const previousFlashcards=location.state?.returnTo==='/flashcards';
 if(!e)return <NotFound/>;
 const f=data.favorites.includes(id),detail=notionContent[id],source=e.source?['Documentation officielle',e.source]:lessonSources[e.theme-1],learning=getNotionLearningLinks(id);
 const assignedStep=learning.course.step,lesson=courseEditorial[e.theme][assignedStep-1],references=notionContentSources[id]||[];
 const related=lesson.concepts.map(conceptId=>entriesById.get(conceptId)).filter(item=>item&&item.id!==id).slice(0,6);
 return <div className="content notion-page">
  <Link to={previousCourse||(previousFlashcards?"/flashcards":"/glossaire")} state={previousCourse?{returnToTerms:true,returnToConcept:id}:previousFlashcards?undefined:{glossaryFilters:location.state?.glossaryFilters}} className="back"><ArrowLeft size={15}/> {previousCourse?"Retour à la leçon":previousFlashcards?"Retour aux flashcards":"Retour au glossaire"}</Link>
  <header className="notion-header"><PageHead eyebrow={sourceLabels[e.theme-1].toUpperCase()+(e.priority?' · NOTION ESSENTIELLE':'')} title={conceptName(e)} description={expandAbbreviations(sentenceStart(e.definition))}/><button className={'save '+(f?'saved':'')} onClick={()=>setData({...data,favorites:f?data.favorites.filter(x=>x!==id):[...data.favorites,id]})}><Bookmark size={16} fill={f?'currentColor':'none'}/> {f?'Enregistré dans mes favoris':'Ajouter aux favoris'}</button></header>
  <StudyMarks data={data} setData={setData} group="concepts" id={id} label="Cette notion"/><div className="notion-grid">
   <section className="notion-card notion-understand"><span className="card-kicker">01 · COMPRENDRE</span><h2>{detail?'Pour comprendre':'Dans le cours'}</h2>{detail?<p>{expandAbbreviations(detail.explanation)}</p>:learning.excerpts.length?<>{learning.excerpts.map(excerpt=><p key={excerpt.sectionIndex+'-'+excerpt.paragraphIndex}>{expandAbbreviations(excerpt.text)}</p>)}<small>Extrait de la leçon « {learning.course.title} »</small></>:<p>{expandAbbreviations(sentenceStart(e.definition))}</p>}</section>
   <RelatedDiagram concept={conceptName(e)}/>
   {detail&&<section className="notion-card notion-example example-card"><span className="card-kicker">02 · ILLUSTRER</span><h2>Un exemple concret</h2><p>{expandAbbreviations(sentenceStart(detail.example.replace(/^Exemple illustratif :\s*/, '')))}</p><small>Exemple illustratif</small></section>}
   {detail&&<section className="notion-card notion-caution"><span className="card-kicker">03 · PRENDRE DU RECUL</span><h2>À ne pas confondre</h2><p>{expandAbbreviations(detail.misconception)}</p></section>}
   <details className="disclosure notion-more"><summary><span>Pour aller plus loin <small>Cours, sources et notions liées</small></span><ChevronRight className="disclosure-chevron" size={18} aria-hidden="true"/></summary><div className="notion-more-content"><section className="notion-card notion-context"><span className="card-kicker">ALLER PLUS LOIN</span><h2>Sa place dans le cours</h2><p>{expandAbbreviations(lesson.goal)}</p><Link className="notion-course-link" to={lessonPath({theme:e.theme,step:assignedStep})}><span><b>Apprendre cette notion dans le cours</b><small>Leçon {assignedStep} · {courseTitles[e.theme-1][assignedStep-1]}</small></span><ArrowRight size={16}/></Link><Btn to={'/themes/'+e.theme}>Explorer {short[e.theme-1]}</Btn><div className="lesson-source">{references.length>0&&<p>Sources de cette fiche : {references.map((url,index)=><React.Fragment key={url}>{index>0?' · ':''}<a href={url} target="_blank" rel="noreferrer">{new URL(url).hostname.replace(/^www\./,'')} {references.filter(item=>new URL(item).hostname===new URL(url).hostname).length>1?`(${index+1}) `:''}↗</a></React.Fragment>)}</p>}Pour approfondir le thème : <a href={source[1]} target="_blank" rel="noreferrer">{source[0]} ↗</a></div></section>
   {learning.distinctions.length>0&&<section className="notion-card notion-comparisons"><span className="card-kicker">NE PAS CONFONDRE</span><h2>Comparer les notions proches</h2><div className="tag-list">{learning.distinctions.map(link=>{const comparison=distinctions[link.index];return <Link className="tag" key={link.index} to={'/distinctions#distinction-'+(link.index+1)}>{comparison.left.name} ≠ {comparison.right.name} <ChevronRight size={14}/></Link>})}</div></section>}
   {related.length>0&&<section className="notion-card notion-related"><span className="card-kicker">POURSUIVRE L’EXPLORATION</span><h2>Autres notions de cette leçon</h2><div className="tag-list">{related.map(item=><Link className="tag" key={item.id} to={'/notions/'+item.id}>{conceptName(item)} <ChevronRight size={14}/></Link>)}</div></section>}
  </div></details></div>
 </div>;
}

function FlashcardsPage(){const {data,setData}=useApp();return <Suspense fallback={<p className="content" role="status">Chargement des flashcards…</p>}><Flashcards entries={entries} orderedThemes={orderedThemes} themeLabels={short} data={data} setData={setData} ChoiceGroup={ChoiceGroup} PageHead={PageHead}/></Suspense> }
function LegacyCourseRoute(){const {id}=useParams(),location=useLocation(),params=new URLSearchParams(location.search);if(!themeById(id))return <NotFound/>;const lesson={theme:Number(id),step:parseLessonStep(params.get('etape'))},goal=pathForLesson(params.get('parcours'),lesson);return <Navigate replace to={learningPathLink(goal,lesson)+location.hash} state={location.state}/>;}
const LazyThemePage=lazy(()=>Promise.all([import('./courseCurriculum.js'),import('./courseTiming.js')]).then(([{courseEditorial},{lessonTiming,formatDuration}])=>({default:()=> <ThemePage courseEditorial={courseEditorial} lessonTiming={lessonTiming} formatDuration={formatDuration}/> })));
const LazyCourse=lazy(()=>Promise.all([import('./CoursePage.jsx'),import('./courseCurriculum.js'),import('./notionContent.js')]).then(([{Course},{courseEditorial},{notionContent}])=>({default:()=> <Course courseEditorial={courseEditorial} notionContent={notionContent}/> })));
const LazyNotion=lazy(()=>Promise.all([import('./courseCurriculum.js'),import('./notionLearningLinks.js'),import('./notionContent.js'),import('./notionSources.js'),import('./distinctions.json'),import('./lessonExtras.js')]).then(([{courseEditorial},{getNotionLearningLinks},{notionContent},{notionContentSources},{default:distinctions},{lessonSources}])=>({default:()=> <Notion courseEditorial={courseEditorial} getNotionLearningLinks={getNotionLearningLinks} notionContent={notionContent} notionContentSources={notionContentSources} distinctions={distinctions} lessonSources={lessonSources}/> })));
const withDistinctions=Component=>lazy(()=>import('./distinctions.json').then(({default:distinctions})=>({default:()=> <Component distinctions={distinctions}/>})));
const LazyDistinctions=withDistinctions(Distinctions);
const loadQuestions=()=>Promise.all([import('./allQuestions.js'),import('./additionalQuestions.js')]).then(([base,extra])=>[...base.authoredQuestions,...extra.additionalQuestions]);
const LazyProgress=lazy(()=>Promise.all([import('./QuizPages.jsx'),loadQuestions()]).then(([{Progress},authoredQuestions])=>({default:()=> <Progress authoredQuestions={authoredQuestions}/> })));
const LazyGeneralQuiz=lazy(()=>Promise.all([import('./QuizPages.jsx'),loadQuestions()]).then(([{Quiz},authoredQuestions])=>({default:()=> <Quiz authoredQuestions={authoredQuestions} courseEditorial={null}/> })));
const LazyLessonQuiz=lazy(()=>Promise.all([import('./QuizPages.jsx'),loadQuestions(),import('./courseCurriculum.js')]).then(([{Quiz},authoredQuestions,{courseEditorial}])=>({default:()=> <Quiz authoredQuestions={authoredQuestions} courseEditorial={courseEditorial}/> })));
function QuizRoute(){const {search}=useLocation(),params=new URLSearchParams(search);const theme=Number(params.get('theme'));const lesson=themes.some(t=>t.id===theme)&&['1','2','3'].includes(params.get('etape'));return lesson?<LazyLessonQuiz key={search}/>:<LazyGeneralQuiz key={search}/>;}

createRoot(document.getElementById('root')).render(<BrowserRouter basename={import.meta.env.BASE_URL}><Provider><ErrorBoundary><Layout/></ErrorBoundary></Provider></BrowserRouter>);
