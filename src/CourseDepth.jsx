import React from 'react';

export function CourseDepth({value,onChange}){
 return <fieldset className="course-depth"><legend>Format de lecture</legend><div className="course-depth-options">{[
  {id:'essential',title:'Essentiel',time:'5 à 10 min'},
  {id:'detailed',title:'Approfondi',time:'10 à 20 min'}
 ].map(option=><label key={option.id} className="course-depth-option"><input type="radio" name="course-depth" value={option.id} checked={value===option.id} onChange={()=>onChange(option.id)}/><span className="course-depth-heading"><strong>{option.title}</strong><small>{option.time}</small></span></label>)}</div><small className="course-depth-note">Mêmes notions, plus de détails en Approfondi. Durées indicatives.</small></fieldset>
}
