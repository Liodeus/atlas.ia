import React from 'react';
import {Link,useParams,useLocation} from 'react-router-dom';
import {ArrowLeft,ArrowRight,CheckCircle2,ChevronRight} from 'lucide-react';
import {findLearningPath,resumeLearningPath,learningPathLink} from './learningPaths.js';
import {courseTitles} from './courseTitles.js';
import {short} from './appData.js';
import {useApp} from './appContext.js';
import {PageHead,Btn} from './LearningUI.jsx';
import {NotFound} from './NotFound.jsx';
import {pathCatalogHref} from './pathSearch.js';

export default function GoalPath(){
 const {id}=useParams(),{state}=useLocation(),{data}=useApp(),path=findLearningPath(id);
 if(!path)return <NotFound/>;
 const next=resumeLearningPath(path,data),count=path.lessons.filter(lesson=>data.completed.includes(`${lesson.theme}-${lesson.step}`)).length;
 return <div className="content theme-page goal-page"><Link className="back" to={pathCatalogHref(state?.catalogFilters||{})}><ArrowLeft size={15}/> Tous les parcours</Link><PageHead eyebrow={'PARCOURS · '+path.level.toLocaleUpperCase('fr')} title={path.title} description={path.description}/>
  <div className="goal-start"><div><b>{count}/{path.lessons.length} leçons terminées</b><p><strong>Prérequis : </strong>{path.prerequisite}</p></div><Btn to={learningPathLink(path,next||path.lessons[0])} state={{resumePosition:Boolean(next)}}>{next?(count||data.lastLesson?.goal===path.id?'Reprendre ce parcours':'Commencer ce parcours'):'Revoir ce parcours'}</Btn></div>
  <details className="disclosure goal-outcomes"><summary><span>Ce que vous saurez faire</span><ChevronRight className="disclosure-chevron" size={18} aria-hidden="true"/></summary><ul>{path.outcomes.map(outcome=><li key={outcome}>{outcome}</li>)}</ul></details>
  <h2 className="goal-lessons-heading">Les étapes du parcours</h2>
  <div className="lesson-list">{path.lessons.map((lesson,index)=>{const done=data.completed.includes(`${lesson.theme}-${lesson.step}`);return <Link className="lesson-row" key={`${lesson.theme}-${lesson.step}`} to={learningPathLink(path,lesson)}><span className="lesson-number">{String(index+1).padStart(2,'0')}</span><span className="lesson-name"><b>{courseTitles[lesson.theme-1][lesson.step-1]}</b><small>{short[lesson.theme-1]} · Leçon {lesson.step}{done?' · Terminée':''}</small></span>{done?<CheckCircle2 className="success" size={19} aria-label="Terminée"/>:<ArrowRight size={18} aria-hidden="true"/>}</Link>})}</div>
 </div>;
}
