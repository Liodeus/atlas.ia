import React,{useEffect,useRef} from 'react';
import {Link,useParams,useNavigate,useLocation} from 'react-router-dom';
import {ArrowLeft,ArrowRight} from 'lucide-react';
import {useApp} from './appContext.js';
import {entriesById,short,moduleNumber,themeById} from './appData.js';
import {lessons} from './content.js';
import {lessonExtras,lessonSources} from './lessonExtras.js';
import {Eyebrow} from './LearningUI.jsx';
import {NotFound} from './NotFound.jsx';
import {conceptName} from './terminology.js';
import {expandAbbreviations} from './abbreviations.js';
import {lessonNeighbor,shouldHandleLessonArrow,lessonPath,parseLessonStep} from './lessonNavigation.js';
import {courseTitles} from './courseTitles.js';
import {CourseDepth} from './CourseDepth.jsx';
import {CourseMaterial} from './CourseMaterial.jsx';
import {demoPlacements,demoStep} from './learningDiagrams.js';
import {Demo} from './CourseDemo.jsx';

export function Course({courseEditorial,notionContent}){
 const {id}=useParams(),t=themeById(id),nav=useNavigate(),location=useLocation(),{data,setData,courseDepth,setCourseDepth}=useApp();
 let step=parseLessonStep(new URLSearchParams(location.search).get('etape'));
 const headingRef=useRef(null),keyboardNavigation=useRef(false);
 useEffect(()=>{if(!t)return;setData(current=>current.lastLesson?.theme===t.id&&current.lastLesson?.step===step?current:{...current,lastLesson:{theme:t.id,step}})},[id,step,setData]);
 useEffect(()=>{
  if(!t)return;const positionKey=`${t.id}-${step}`;let timer;let ready=false;
  const read=()=>{try{return JSON.parse(localStorage.getItem('atlas-lesson-positions')||'{}')}catch{return {}}};
  const write=()=>{if(!ready)return;try{const positions=read();positions[positionKey]=Math.max(0,Math.round(window.scrollY));localStorage.setItem('atlas-lesson-positions',JSON.stringify(positions))}catch{}};
  const onScroll=()=>{clearTimeout(timer);timer=setTimeout(write,300)};
  const saved=read()[positionKey];const frame=requestAnimationFrame(()=>{if(location.state?.resumePosition&&Number.isFinite(saved)&&saved>0)window.scrollTo({top:saved,behavior:'instant'});ready=true});
  window.addEventListener('scroll',onScroll,{passive:true});return()=>{cancelAnimationFrame(frame);clearTimeout(timer);write();window.removeEventListener('scroll',onScroll)};
 },[id,step]);
 const previous=t?lessonNeighbor(t.id,step,-1):null,next=t?lessonNeighbor(t.id,step,1):null;
 useEffect(()=>{const onKeyDown=e=>{if(!shouldHandleLessonArrow(e)||document.querySelector('.sidebar.opened'))return;const destination=e.key==='ArrowLeft'?previous:next;if(!destination)return;e.preventDefault();keyboardNavigation.current=true;nav(lessonPath(destination))};document.addEventListener('keydown',onKeyDown);return()=>document.removeEventListener('keydown',onKeyDown)},[id,step,nav]);
 useEffect(()=>{if(keyboardNavigation.current){headingRef.current?.focus({preventScroll:true});keyboardNavigation.current=false}},[id,step]);
 useEffect(()=>{if(!location.state?.returnToTerms)return;const frame=requestAnimationFrame(()=>{const id=location.state?.returnToConcept;const term=typeof id==='string'?document.getElementById('course-term-'+id):null;const details=term?.closest('details.course-more-terms');if(details)details.open=true;const target=term||document.getElementById('course-term-heading');target?.focus({preventScroll:true});target?.scrollIntoView({block:'start',behavior:'instant'})});return()=>cancelAnimationFrame(frame)},[location.key]);
 if(!t)return <NotFound/>;
 const lesson=courseEditorial[t.id][step-1],key=id+'-'+step,returnTo='/cours/'+id+'?etape='+step;const lessonReferences=t.id===18?[...new Map(lesson.concepts.map(concept=>entriesById.get(concept)).filter(entry=>entry?.source).map(entry=>[entry.source,[conceptName(entry),entry.source]])).values()]:[lessonSources[t.id-1]];
 const mark=()=>setData(d=>({...d,completed:[...new Set([...d.completed,key])]}));const unmark=()=>setData(d=>({...d,completed:d.completed.filter(item=>item!==key)}));
 return <div className="content reading course-page"><Link className="back" to={'/themes/'+id}><ArrowLeft size={15}/> {short[t.id-1]}</Link><div className="course-header"><Eyebrow>MODULE {moduleNumber(t.id)} · LEÇON {step} / 3</Eyebrow><h1 ref={headingRef} tabIndex={-1}>{expandAbbreviations(courseTitles[t.id-1][step-1])}</h1><p className="course-goal">{expandAbbreviations(lesson.goal)}</p><div className="stepper">{[1,2,3].map(x=><Link key={x} onClick={e=>{if(e.detail===0&&x!==step)keyboardNavigation.current=true}} className={x===step?'current':data.completed.includes(id+'-'+x)?'done':''} to={'/cours/'+id+'?etape='+x}><span>{data.completed.includes(id+'-'+x)?'✓':x}</span>{['Comprendre','Explorer','Appliquer'][x-1]}</Link>)}</div></div>
 {t.id===1&&step===1&&<details className="lesson-guide disclosure"><summary>Un conseil pour débuter</summary><p>Commencez par trois idées : une tâche, une méthode qui apprend et un modèle de langage. Les acronymes complémentaires peuvent attendre votre deuxième lecture.</p></details>}<div className="course-mode-panel"><CourseDepth value={courseDepth} onChange={setCourseDepth}/></div>
 <CourseMaterial lesson={lesson} mode={courseDepth} intro={lessons[t.id-1][step]} extra={lessonExtras[t.id-1][step-1]} entriesById={entriesById} details={notionContent} returnTo={returnTo} theme={t.id} step={step} inlineDemo={demoPlacements[t.id]?.step===step?{section:demoPlacements[t.id].section,element:<Demo key={t.id} id={t.id}/>} : null}>{!demoPlacements[t.id]&&step===demoStep(t.id)&&<Demo key={t.id} id={t.id}/>}</CourseMaterial>
 <div className="lesson-check-link"><p>Vous avez terminé la lecture ? Vérifiez vos acquis avec quelques questions liées à cette leçon.</p><Link className="text-link" to={'/quiz?theme='+id+'&etape='+step}>Faire un quiz de cette leçon <ArrowRight size={16}/></Link></div><div className="lesson-source">Pour approfondir : {lessonReferences.map(([label,url],i)=><React.Fragment key={url}>{i>0?' · ':''}<a href={url} target="_blank" rel="noreferrer">{label} ↗</a></React.Fragment>)}</div><div className="end-lesson"><div><b>{data.completed.includes(key)?'Leçon terminée':'À vous de jouer'}</b><p>Marquez cette étape comme terminée pour suivre votre progression.</p></div><button className="button" onClick={()=>{mark();if(step<3){keyboardNavigation.current=true;nav('/cours/'+id+'?etape='+(step+1))}else nav('/themes/'+id,{state:{focusCourseHeading:true}})}}>{step<3?'Terminer et continuer':'Terminer la leçon'} <ArrowRight size={16}/></button>{data.completed.includes(key)&&<button className="button secondary" onClick={unmark}>Marquer comme non terminée</button>}</div><nav className="lesson-navigation" aria-label="Navigation entre les leçons">{previous?<Link to={lessonPath(previous)} onClick={e=>{if(e.detail===0)keyboardNavigation.current=true}} className="lesson-nav-link"><ArrowLeft size={16}/><span><small>PRÉCÉDENTE</small>Leçon {previous.step} · {short[previous.theme-1]}</span></Link>:<span className="lesson-nav-link is-disabled" aria-disabled="true"><ArrowLeft size={16}/><span>Début du parcours</span></span>}<span className="lesson-arrow-hint">Utilisez les flèches ← et → du clavier</span>{next?<Link to={lessonPath(next)} onClick={e=>{if(e.detail===0)keyboardNavigation.current=true}} className="lesson-nav-link next"><span><small>SUIVANTE</small>Leçon {next.step} · {short[next.theme-1]}</span><ArrowRight size={16}/></Link>:<span className="lesson-nav-link is-disabled" aria-disabled="true"><span>Fin du parcours</span><ArrowRight size={16}/></span>}</nav></div>
}
