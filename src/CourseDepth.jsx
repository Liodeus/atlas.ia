import React from 'react';

export function CourseDepth({value,onChange,timing}){
 return <fieldset className="course-depth"><legend>Format de lecture</legend><div className="course-depth-options">{[
  {id:'essential',title:'Essentiel',time:timing?`${timing.essential.min} à ${timing.essential.max} min`:'Comprendre les bases'},
  {id:'detailed',title:'Approfondi',time:timing?`${timing.detailed.min} à ${timing.detailed.max} min`:'Analyser et pratiquer'}
 ].map(option=><label key={option.id} className="course-depth-option"><input type="radio" name="course-depth" value={option.id} checked={value===option.id} onChange={()=>onChange(option.id)}/><span className="course-depth-heading"><strong>{option.title}</strong><small>{option.time}</small></span></label>)}</div><small className="course-depth-note">{timing?'Lecture et exercices inclus. Les compléments repliés sont facultatifs.':'Approfondi ajoute des analyses, des cas concrets et un exercice corrigé.'}</small></fieldset>
}
