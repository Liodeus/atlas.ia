import React from 'react';
import {Link} from 'react-router-dom';
import {ArrowRight} from 'lucide-react';
import {conceptName} from './terminology.js';
import {sentenceStart,prioritizedConcepts} from './editorialPresentation.js';
import {expandAbbreviations} from './abbreviations.js';
import {LearningDiagram} from './LearningDiagrams.jsx';
import {diagramPlacements} from './learningDiagrams.js';
import {priorityContent} from './priorityContent.js';

function ReadingSections({sections,deep=false,theme,step,inlineDemo}){
 return <div className={'course-section-grid'+(deep?' is-deep':'')}>{sections.map((section,index)=>{
  const diagrams=diagramPlacements.filter(p=>p.theme===theme&&p.step===step&&p.section===section.heading&&Boolean(p.deep)===deep);
  const demo=!deep&&inlineDemo?.section===section.heading?inlineDemo.element:null;
  return <section className={'course-explanation'+(diagrams.length||demo?' has-illustration':'')} key={section.heading+'-'+index}>
   <h2>{expandAbbreviations(section.heading)}</h2>{section.paragraphs.map((paragraph,i)=><p key={i}>{expandAbbreviations(paragraph)}</p>)}
   {diagrams.map(p=><LearningDiagram key={p.id} id={p.id}/>)}{demo}
  </section>;
 })}</div>;
}

function CourseTerm({id,entriesById,details,mode,returnTo}){
 const entry=entriesById.get(id),detail=details[id];if(!entry)return null;
 return <article id={'course-term-'+id} tabIndex={-1} className="course-term"><h3>{conceptName(entry)}</h3><p>{expandAbbreviations(sentenceStart(entry.definition))}</p>{mode==='detailed'&&detail&&<details className="course-term-detail"><summary>Approfondir cette notion</summary><p>{expandAbbreviations(detail.explanation)}</p><p><b>Exemple :</b> {expandAbbreviations(detail.example.replace(/^Exemple illustratif\s*:\s*/i,''))}</p><p><b>À distinguer :</b> {expandAbbreviations(detail.misconception)}</p></details>}<Link className="text-link" to={'/notions/'+id} state={{returnTo}} aria-label={'Ouvrir la fiche '+conceptName(entry)}>Ouvrir la fiche <ArrowRight size={14}/></Link></article>;
}

export function CourseMaterial({lesson,mode,intro,extra,entriesById,details,returnTo,children,theme,step,inlineDemo}){
 // La couverture des approfondissements ne change pas les six notions mises en avant.
 const ordered=prioritizedConcepts(lesson.concepts,priorityContent);
 return <article className="lesson-content">
  <div className="lesson-lead">{expandAbbreviations(intro)}</div>
  <ReadingSections sections={lesson.sections} theme={theme} step={step} inlineDemo={inlineDemo}/>
  {mode==='detailed'&&<section className="course-deep-dive"><span className="card-kicker">POUR APPROFONDIR</span><h2>Aller plus loin</h2><ReadingSections sections={lesson.deepDive} deep theme={theme} step={step}/></section>}
  {children}
  <section className="example-card"><span className="card-kicker">UN EXEMPLE CONCRET</span><p>{expandAbbreviations(extra.example)}</p></section>
  <section className="knowledge-check"><span className="card-kicker">FAIRE UNE PAUSE</span><h2>À vous de réfléchir</h2><p>{expandAbbreviations(extra.question)}</p><details><summary>Voir la réponse</summary><p>{expandAbbreviations(extra.answer)}</p></details></section>
  <section className="course-takeaways"><span className="card-kicker">L’ESSENTIEL</span><h2>À retenir</h2><ul>{lesson.takeaways.map((point,i)=><li key={i}>{expandAbbreviations(point)}</li>)}</ul></section>
  <section className="course-terms"><div className="course-terms-header"><div><span className="card-kicker">VOCABULAIRE DE LA LEÇON</span><h2 id="course-term-heading" tabIndex={-1}>Les notions à connaître</h2><p>Retrouvez les définitions utiles à cette leçon.</p></div><span className="pill">{lesson.concepts.length} notions</span></div>
   <div className="course-terms-grid">{ordered.visible.map(id=><CourseTerm key={id} id={id} entriesById={entriesById} details={details} mode={mode} returnTo={returnTo}/>)}</div>
   {lesson.concepts.length>6&&<details className="course-more-terms"><summary>Voir les {lesson.concepts.length-6} autres notions de cette leçon</summary><div className="course-terms-grid">{ordered.extra.map(id=><CourseTerm key={id} id={id} entriesById={entriesById} details={details} mode={mode} returnTo={returnTo}/>)}</div></details>}
  </section>
 </article>;
}
