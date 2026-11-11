import React,{useEffect,useRef,useState} from 'react';
import {Link,useLocation} from 'react-router-dom';
import {ArrowRight} from 'lucide-react';
import {conceptName} from './terminology.js';
import {sentenceStart,prioritizedConcepts} from './editorialPresentation.js';
import {expandAbbreviations} from './abbreviations.js';
import {LearningDiagram} from './LearningDiagrams.jsx';
import {diagramPlacements} from './learningDiagrams.js';
import {priorityContent} from './priorityContent.js';
import {lessonSectionId,lessonPracticeId,practiceSupport,findLessonAnchor} from './practiceSupport.js';

function ReadingSections({sections,deep=false,theme,step,inlineDemo,activeSupport,practiceId,onJump}){
 return <div className={'course-section-grid'+(deep?' is-deep':'')}>{sections.map((section,index)=>{
  const anchor=lessonSectionId(theme,step,deep?'deepDive':'sections',section.heading);
  const diagrams=diagramPlacements.filter(p=>p.theme===theme&&p.step===step&&p.section===section.heading&&Boolean(p.deep)===deep);
  const demo=!deep&&inlineDemo?.section===section.heading?inlineDemo.element:null;
  return <section className={'course-explanation'+(diagrams.length||demo?' has-illustration':'')} key={section.heading+'-'+index}>
   <h2 id={anchor} tabIndex={-1} className="lesson-section-title">{section.heading}</h2>{activeSupport===anchor&&<a className="text-link practice-return" href={'#'+practiceId} onClick={event=>onJump(event,practiceId)}>Revenir à la mise en pratique <ArrowRight size={14}/></a>}{section.paragraphs.map((paragraph,i)=><p key={i}>{expandAbbreviations(paragraph)}</p>)}
   {diagrams.map(p=><LearningDiagram key={p.id} id={p.id}/>)}{demo}
  </section>;
 })}</div>;
}

function CourseTerm({id,entriesById,details,mode,returnTo}){
 const entry=entriesById.get(id),detail=details[id];if(!entry)return null;
 return <article id={'course-term-'+id} tabIndex={-1} className="course-term"><h3>{conceptName(entry)}</h3><p>{expandAbbreviations(sentenceStart(entry.definition))}</p>{mode==='detailed'&&detail&&<details className="course-term-detail"><summary>Approfondir cette notion</summary><p>{expandAbbreviations(detail.explanation)}</p><p><b>Exemple :</b> {expandAbbreviations(detail.example.replace(/^Exemple illustratif\s*:\s*/i,''))}</p><p><b>À distinguer :</b> {expandAbbreviations(detail.misconception)}</p></details>}<Link className="text-link" to={'/notions/'+id} state={{returnTo}} aria-label={'Ouvrir la fiche '+conceptName(entry)}>Ouvrir la fiche <ArrowRight size={14}/></Link></article>;
}

function focusLessonAnchor(id){
 const target=document.getElementById(id);if(!target)return;
 target.focus({preventScroll:true});target.scrollIntoView({block:'start',behavior:'instant'});
}

export function CourseMaterial({lesson,mode,onDepthChange,intro,extra,entriesById,details,returnTo,children,theme,step,inlineDemo}){
 // La couverture des approfondissements ne change pas les six notions mises en avant.
 const ordered=prioritizedConcepts(lesson.concepts,priorityContent);
 const {hash}=useLocation(),restoredAnchor=useRef(null),[activeSupport,setActiveSupport]=useState(null);
 const practiceId=lessonPracticeId(theme,step),support=practiceSupport(lesson,theme,step);
 useEffect(()=>{
  const key=`${theme}-${step}-${hash}`;if(restoredAnchor.current===key)return;
  const target=findLessonAnchor(hash,lesson,theme,step);
  if(!target){restoredAnchor.current=key;setActiveSupport(null);return}
  if(target.deep&&mode!=='detailed'){onDepthChange?.('detailed');return}
  restoredAnchor.current=key;setActiveSupport(target.practice?null:target.id);
  const frame=requestAnimationFrame(()=>focusLessonAnchor(target.id));return()=>cancelAnimationFrame(frame);
 },[hash,lesson,theme,step,mode,onDepthChange]);
 const jump=(event,id)=>{
  if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  event.preventDefault();setActiveSupport(id===practiceId?null:id);
  const url=new URL(window.location.href);url.hash=id;history.replaceState(history.state,'',url);
  requestAnimationFrame(()=>focusLessonAnchor(id));
 };
 const navigation={activeSupport,practiceId,onJump:jump};
 return <article className="lesson-content">
  <div className="lesson-lead">{expandAbbreviations(intro)}</div>
  <ReadingSections sections={lesson.sections} theme={theme} step={step} inlineDemo={inlineDemo} {...navigation}/>
  {mode==='detailed'&&<section className="course-deep-dive"><span className="card-kicker">POUR APPROFONDIR</span><h2>Aller plus loin</h2><ReadingSections sections={lesson.deepDive} deep theme={theme} step={step} {...navigation}/></section>}
  {children}
  <section className="example-card"><span className="card-kicker">UN EXEMPLE CONCRET</span><p>{expandAbbreviations(extra.example)}</p></section>
  <section className="knowledge-check"><span className="card-kicker">FAIRE UNE PAUSE</span><h2>À vous de réfléchir</h2><p>{expandAbbreviations(extra.question)}</p><details><summary>Voir la réponse</summary><p>{expandAbbreviations(extra.answer)}</p></details></section>
  {mode==='detailed'&&lesson.practice&&<section className="knowledge-check advanced-practice"><span className="card-kicker">MISE EN PRATIQUE</span><h2 id={practiceId} tabIndex={-1} className="lesson-section-title">À vous d’appliquer</h2><p>{expandAbbreviations(lesson.practice.prompt)}</p>{support.length>0&&<details className="practice-help"><summary>Retrouver les passages utiles</summary><nav aria-label="Passages utiles pour cet exercice"><ul>{support.map(reference=><li key={reference.id}><a className="text-link" href={'#'+reference.id} onClick={event=>jump(event,reference.id)}>{reference.heading}</a></li>)}</ul></nav></details>}<details className="practice-solution"><summary>Voir le corrigé raisonné</summary>{lesson.practice.solution.map((text,index)=><p key={index}>{expandAbbreviations(text)}</p>)}</details></section>}
  <section className="course-takeaways"><span className="card-kicker">L’ESSENTIEL</span><h2>À retenir</h2><ul>{lesson.takeaways.map((point,i)=><li key={i}>{expandAbbreviations(point)}</li>)}</ul></section>
  <section className="course-terms"><div className="course-terms-header"><div><span className="card-kicker">VOCABULAIRE DE LA LEÇON</span><h2 id="course-term-heading" tabIndex={-1}>Les notions à connaître</h2><p>Retrouvez les définitions utiles à cette leçon.</p></div><span className="pill">{lesson.concepts.length} notions</span></div>
   <div className="course-terms-grid">{ordered.visible.map(id=><CourseTerm key={id} id={id} entriesById={entriesById} details={details} mode={mode} returnTo={returnTo}/>)}</div>
   {lesson.concepts.length>6&&<details className="course-more-terms"><summary>Voir les {lesson.concepts.length-6} autres notions de cette leçon</summary><div className="course-terms-grid">{ordered.extra.map(id=><CourseTerm key={id} id={id} entriesById={entriesById} details={details} mode={mode} returnTo={returnTo}/>)}</div></details>}
  </section>
 </article>;
}
