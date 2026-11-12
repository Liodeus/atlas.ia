import React,{useState} from 'react';
import {ragContextContent as content} from './courseWorkshopContent.js';

export function RagContextWorkshop(){
 const [complete,setComplete]=useState(false);
 const {rule,exception}=content;
 return <div className="course-workshop rag-context-workshop">
  <p className="workshop-caption">Simulation pédagogique · document fictif et réponses préparées</p>
  <h3>{content.question}</h3>
  <div className="workshop-document"><span className="card-kicker">DOCUMENT SOURCE</span><p>{rule} {exception}</p></div>
  <fieldset className="workshop-options"><legend>Quel passage fournissez-vous au générateur ?</legend><div>{[[false,'La règle seule'],[true,'La règle et son exception']].map(([value,label])=><button type="button" key={label} aria-pressed={complete===value} onClick={()=>setComplete(value)}>{label}</button>)}</div></fieldset>
  <section className="workshop-result" aria-live="polite"><span className="card-kicker">RÉPONSE ILLUSTRÉE</span><p>« {content.answers[Number(complete)]} »</p><p className="workshop-feedback">{content.feedback[Number(complete)]}</p></section>
  <details><summary>Voir le contexte transmis</summary><p>{rule}{complete?' '+exception:''}</p></details>
  <details><summary>Ce que cet atelier permet de comprendre</summary><p>{content.explanation}</p><p>{content.limitation}</p></details>
 </div>;
}
