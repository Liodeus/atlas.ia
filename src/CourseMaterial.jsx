import React from 'react';
import {Link} from 'react-router-dom';
import {ArrowRight} from 'lucide-react';
import {conceptName} from './terminology.js';
import {sentenceStart,prioritizedConcepts} from './editorialPresentation.js';

function ReadingSections({sections,deep=false}){
 return <div className={'course-section-grid'+(deep?' is-deep':'')}>{sections.map((section,index)=><section className="course-explanation" key={section.heading+'-'+index}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph,i)=><p key={i}>{paragraph}</p>)}</section>)}</div>;
}

function CourseTerm({id,entriesById,details,mode,returnTo}){
 const entry=entriesById.get(id),detail=details[id];if(!entry)return null;
 return <article id={'course-term-'+id} tabIndex={-1} className="course-term"><h3>{conceptName(entry)}</h3><p>{sentenceStart(entry.definition)}</p>{mode==='detailed'&&detail&&<details className="course-term-detail"><summary>Approfondir cette notion</summary><p>{detail.explanation}</p><p><b>Exemple :</b> {detail.example.replace(/^Exemple illustratif\s*:\s*/i,'')}</p><p><b>À distinguer :</b> {detail.misconception}</p></details>}<Link className="text-link" to={'/notions/'+id} state={{returnTo}} aria-label={'Ouvrir la fiche '+conceptName(entry)}>Ouvrir la fiche <ArrowRight size={14}/></Link></article>;
}

export function CourseMaterial({lesson,mode,intro,extra,entriesById,details,returnTo,children}){
 const ordered=prioritizedConcepts(lesson.concepts,details);
 return <article className="lesson-content">
  <section className="lesson-objective"><span className="card-kicker">OBJECTIF DE LA LEÇON</span><p>{lesson.goal}</p></section>
  <div className="lesson-lead">{intro}</div>
  <ReadingSections sections={lesson.sections}/>
  {mode==='detailed'&&<section className="course-deep-dive"><span className="card-kicker">POUR APPROFONDIR</span><h2>Aller plus loin</h2><ReadingSections sections={lesson.deepDive} deep/></section>}
  {children}
  <section className="example-card"><span className="card-kicker">UN EXEMPLE CONCRET</span><p>{extra.example}</p></section>
  <section className="knowledge-check"><span className="card-kicker">FAIRE UNE PAUSE</span><h2>À vous de réfléchir</h2><p>{extra.question}</p><details><summary>Voir la réponse</summary><p>{extra.answer}</p></details></section>
  <section className="course-terms"><div className="course-terms-header"><div><span className="card-kicker">VOCABULAIRE DE LA LEÇON</span><h2 id="course-term-heading" tabIndex={-1}>Les notions à connaître</h2><p>Commencez par les notions essentielles, puis explorez les autres à votre rythme. Chaque fiche permet de retrouver sa définition.</p></div><span className="pill">{lesson.concepts.length} notions</span></div>
   <div className="course-terms-grid">{ordered.visible.map(id=><CourseTerm key={id} id={id} entriesById={entriesById} details={details} mode={mode} returnTo={returnTo}/>)}</div>
   {lesson.concepts.length>6&&<details className="course-more-terms"><summary>Voir les {lesson.concepts.length-6} autres notions de cette leçon</summary><div className="course-terms-grid">{ordered.extra.map(id=><CourseTerm key={id} id={id} entriesById={entriesById} details={details} mode={mode} returnTo={returnTo}/>)}</div></details>}
  </section>
  <section className="course-takeaways"><span className="card-kicker">L’ESSENTIEL</span><h2>À retenir</h2><ul>{lesson.takeaways.map((point,i)=><li key={i}>{point}</li>)}</ul></section>
 </article>;
}
