import React from 'react';

export function CourseDepth({value,onChange}){
 return <fieldset className="course-depth"><legend>Choisir la profondeur</legend><p>Les mêmes notions sont abordées dans les deux parcours. Le niveau de détail change.</p><div className="course-depth-options">{[
  {id:'essential',title:'Essentiel',time:'5 à 10 min',description:'Les explications et exemples pour comprendre les bases.'},
  {id:'detailed',title:'Approfondi',time:'10 à 20 min',description:'Les mêmes notions, avec davantage de mécanismes et de cas concrets.'}
 ].map(option=><label key={option.id} className="course-depth-option"><input type="radio" name="course-depth" value={option.id} checked={value===option.id} onChange={()=>onChange(option.id)}/><span><span className="course-depth-heading"><strong>{option.title}</strong><small>{option.time}</small></span><span className="course-depth-description">{option.description}</span></span></label>)}</div><small className="course-depth-note">Durées indicatives pour une première lecture et l’activité. Prévoyez davantage de temps pour assimiler les notions.</small></fieldset>
}
