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
import {pathForLesson,learningPathLink} from './learningPaths.js';
import {CourseDepth} from './CourseDepth.jsx';
import {lessonTiming} from './courseTiming.js';
import {CourseMaterial} from './CourseMaterial.jsx';
import {demoPlacements,demoStep} from './learningDiagrams.js';
import {Demo} from './CourseDemo.jsx';

export function Course({courseEditorial,notionContent}){
 const {id,step:requestedStep}=useParams(),t=['1','2','3'].includes(requestedStep)?themeById(id):null,nav=useNavigate(),location=useLocation(),{data,setData,courseDepth,setCourseDepth}=useApp();
 const step=parseLessonStep(requestedStep),goal=pathForLesson(new URLSearchParams(location.search).get('parcours'),{theme:t?.id,step}),goalIndex=goal?.lessons.findIndex(lesson=>lesson.theme===t?.id&&lesson.step===step),courseLink=lesson=>learningPathLink(goal,lesson);
 const headingRef=useRef(null),keyboardNavigation=useRef(false);
 useEffect(()=>{if(location.state?.courseDepth==='detailed')setCourseDepth('detailed')},[location.key,setCourseDepth]);
 useEffect(()=>{if(!t)return;setData(current=>current.lastLesson?.theme===t.id&&current.lastLesson?.step===step&&current.lastLesson?.goal===(goal?.id)?current:{...current,lastLesson:{theme:t.id,step,...(goal?{goal:goal.id}:{})}})},[id,step,goal?.id,setData]);
 useEffect(()=>{
  if(!t)return;const positionKey=`${t.id}-${step}`;let timer;let ready=false;
  const read=()=>{try{return JSON.parse(localStorage.getItem('atlas-lesson-positions')||'{}')}catch{return {}}};
  const write=()=>{if(!ready)return;try{const positions=read();positions[positionKey]=Math.max(0,Math.round(window.scrollY));localStorage.setItem('atlas-lesson-positions',JSON.stringify(positions))}catch{}};
  const onScroll=()=>{clearTimeout(timer);timer=setTimeout(write,300)};
  const saved=read()[positionKey];const frame=requestAnimationFrame(()=>{if(location.state?.resumePosition&&Number.isFinite(saved)&&saved>0)window.scrollTo({top:saved,behavior:'instant'});ready=true});
  window.addEventListener('scroll',onScroll,{passive:true});return()=>{cancelAnimationFrame(frame);clearTimeout(timer);write();window.removeEventListener('scroll',onScroll)};
 },[id,step]);
 const previous=goal?goal.lessons[goalIndex-1]:t?lessonNeighbor(t.id,step,-1):null,next=goal?goal.lessons[goalIndex+1]:t?lessonNeighbor(t.id,step,1):null;
 useEffect(()=>{const onKeyDown=e=>{if(!shouldHandleLessonArrow(e)||document.querySelector('.sidebar.opened'))return;const destination=e.key==='ArrowLeft'?previous:next;if(!destination)return;e.preventDefault();keyboardNavigation.current=true;nav(courseLink(destination))};document.addEventListener('keydown',onKeyDown);return()=>document.removeEventListener('keydown',onKeyDown)},[id,step,goal?.id,nav]);
 useEffect(()=>{if(keyboardNavigation.current){headingRef.current?.focus({preventScroll:true});keyboardNavigation.current=false}},[id,step]);
 useEffect(()=>{if(!location.state?.returnToTerms)return;const frame=requestAnimationFrame(()=>{const id=location.state?.returnToConcept;const term=typeof id==='string'?document.getElementById('course-term-'+id):null;let parent=term?.parentElement;while(parent){if(parent.tagName==='DETAILS')parent.open=true;parent=parent.parentElement}const target=term||document.getElementById('course-term-heading');target?.focus({preventScroll:true});target?.scrollIntoView({block:'start',behavior:'instant'})});return()=>cancelAnimationFrame(frame)},[location.key]);
 if(!t)return <NotFound/>;
 const lesson=courseEditorial[t.id][step-1],key=id+'-'+step,returnTo=courseLink({theme:t.id,step});const lessonReferences=lesson.references?.length?lesson.references.map(source=>[source.label,source.url]):t.id===18?[...new Map(lesson.concepts.map(concept=>entriesById.get(concept)).filter(entry=>entry?.source).map(entry=>[entry.source,[conceptName(entry),entry.source]])).values()]:[lessonSources[t.id-1]];
 const timing=lessonTiming(t.id,step,lesson);
 const mark=()=>setData(d=>({...d,completed:[...new Set([...d.completed,key])]}));const unmark=()=>setData(d=>({...d,completed:d.completed.filter(item=>item!==key)}));
 const conclusion=<><div className="lesson-check-link"><p>Vous avez terminé la lecture ? Vérifiez vos acquis avec quelques questions liées à cette leçon.</p><Link className="text-link" to={'/quiz?theme='+id+'&etape='+step}>Faire un quiz de cette leçon <ArrowRight size={16}/></Link></div><div className="lesson-source">Pour approfondir : {lessonReferences.map(([label,url],i)=><React.Fragment key={url}>{i>0?' · ':''}<a href={url} target="_blank" rel="noreferrer">{label} ↗</a></React.Fragment>)}</div><div className="end-lesson"><div><b>{data.completed.includes(key)?'Leçon terminée':'À vous de jouer'}</b><p>Marquez cette étape comme terminée pour suivre votre progression.</p></div><button className="button" onClick={()=>{mark();if(goal){if(next){keyboardNavigation.current=true;nav(courseLink(next))}else nav('/parcours/'+goal.id)}else if(step<3){keyboardNavigation.current=true;nav(lessonPath({theme:t.id,step:step+1}))}else nav('/themes/'+id,{state:{focusCourseHeading:true}})}}>{goal?(next?'Terminer et continuer':'Terminer et voir le parcours'):step<3?'Terminer et continuer':'Terminer la leçon'} <ArrowRight size={16}/></button>{data.completed.includes(key)&&<button className="button secondary" onClick={unmark}>Marquer comme non terminée</button>}</div></>;
 return <div className="content reading course-page"><Link className="back" to={goal?'/parcours/'+goal.id:'/themes/'+id}><ArrowLeft size={15}/> {goal?goal.title:short[t.id-1]}</Link><div className="course-header"><Eyebrow>MODULE {moduleNumber(t.id)} · LEÇON {step} / 3</Eyebrow><h1 ref={headingRef} tabIndex={-1}>{courseTitles[t.id-1][step-1]}</h1><p className="course-path-position">{goal?`Étape ${goalIndex+1} sur ${goal.lessons.length} du parcours`:null}</p><p className="course-goal">{expandAbbreviations(lesson.goal)}</p></div>
 {t.id===1&&step===1&&<details className="lesson-guide disclosure"><summary>Un conseil pour débuter</summary><p>Commencez par trois idées : une tâche, une méthode qui apprend et un modèle de langage. Les acronymes complémentaires peuvent attendre votre deuxième lecture.</p></details>}
 <CourseMaterial readingOptions={<CourseDepth compact value={courseDepth} onChange={value=>{const url=new URL(window.location.href);url.hash="";history.replaceState(history.state,"",url);setCourseDepth(value)}} timing={timing}/>} key={key} conclusion={conclusion} lesson={lesson} mode={courseDepth} onDepthChange={setCourseDepth} intro={lessons[t.id-1][step]} extra={lessonExtras[t.id-1][step-1]} entriesById={entriesById} details={notionContent} returnTo={returnTo} theme={t.id} step={step} inlineDemo={demoPlacements[t.id]?.step===step?{section:demoPlacements[t.id].section,element:<Demo key={t.id} id={t.id}/>} : null}>{!demoPlacements[t.id]&&step===demoStep(t.id)&&<Demo key={t.id} id={t.id}/>}</CourseMaterial>
<nav className="lesson-navigation" aria-label="Navigation entre les leçons">{previous?<Link to={courseLink(previous)} onClick={e=>{if(e.detail===0)keyboardNavigation.current=true}} className="lesson-nav-link"><ArrowLeft size={16}/><span><small>PRÉCÉDENTE</small>Leçon {previous.step} · {short[previous.theme-1]}</span></Link>:<span className="lesson-nav-link is-disabled" aria-disabled="true"><ArrowLeft size={16}/><span>Début du parcours</span></span>}<span className="lesson-arrow-hint">← → pour passer à la leçon précédente ou suivante</span>{next?<Link to={courseLink(next)} onClick={e=>{if(e.detail===0)keyboardNavigation.current=true}} className="lesson-nav-link next"><span><small>SUIVANTE</small>Leçon {next.step} · {short[next.theme-1]}</span><ArrowRight size={16}/></Link>:<span className="lesson-nav-link is-disabled" aria-disabled="true"><span>Fin du parcours</span><ArrowRight size={16}/></span>}</nav></div>
}
