import React from 'react';
import {attentionMix,contextBudget} from './workshopsQuantitative.js';
const format=value=>value.toLocaleString('fr-FR',{maximumFractionDigits:2});
export function WorkshopControls({controls,values,onChange}){return <div className="workshop-controls">{controls.map(control=><label key={control.id}>{control.label}<select value={values[control.id]} onChange={event=>onChange(control.id,event.target.value)}>{control.options.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>)}</div>}
export function WorkshopLab({kind,values}){
 if(kind==='attention'){
  const mix=attentionMix(values.positions);
  return <section className="workshop-lab" aria-label="Simulation des connexions proposées"><h3>Votre sélection simulée, à vérifier</h3><p>La simulation applique les connexions que vous cochez, même si elles ne respectent pas encore le masque demandé.</p>
   <div className="attention-contributions" aria-label="Contributions normalisées">{mix.positions.map(position=><div key={position.id}><span>{position.label}</span><div className="contribution-track" aria-hidden="true"><span style={{width:position.weight*100+'%'}}/></div><span>{format(position.weight*100)} % × {position.value}</span></div>)}</div>
   <p role="status">{mix.value===null?'Aucune position sélectionnée : la normalisation et la combinaison ne sont pas définies.':<>Somme des contributions : <b>{format(mix.value)}</b>. Les poids des positions cochées somment à 100 %.</>}</p>
  </section>;
 }
 if(kind==='experts'){
  const ids=Array.isArray(values.experts)?values.experts:[],count=ids.length;
  return <section className="workshop-lab" aria-label="Compte des paramètres"><h3>Le chemin que vous proposez</h3><div className="expert-selection" aria-hidden="true">{Array.from({length:8},(_,index)=><span key={index} className={ids.includes('e'+(index+1))?'selected':''}>E{index+1}</span>)}</div><p role="status"><b>{count} expert(s) sélectionné(s)</b> : 10 + {count} × 4 = <b>{10+count*4} millions</b> de paramètres actifs dans cette hypothèse. Le total reste de <b>42 millions</b>.</p><p>Le compte ne vérifie pas le classement : utilisez les scores pour respecter la règle Top-2.</p></section>;
 }
 if(kind==='context'){
  const b=contextBudget(values),scale=Math.max(b.total,b.capacity);
  const parts=[['Instructions, question et marqueurs',b.fixed],['Historique',b.history],['Documents',b.documents],['Sortie réservée',b.output]];
  return <section className="workshop-lab" aria-label="Budget de contexte calculé"><h3>Votre requête préparée</h3><div className="context-budget-bar" aria-hidden="true">{parts.map(([label,count],index)=><span key={label} style={{width:count/scale*100+'%',background:`var(--context-${index})`}}/>)}</div><div className="context-budget-parts">{parts.map(([label,count])=><span key={label}>{label} : <b>{format(count)}</b></span>)}</div><p role="status"><b>{format(b.total)} / 8 192 tokens</b>. {b.total>8192?`Dépassement de ${format(b.total-8192)} tokens.`:`Marge restante : ${format(8192-b.total)} tokens.`}</p><p>Le budget compte les tokens. La validation vérifiera aussi que la contrainte client, l’exception et la réserve de sortie sont conservées.</p></section>;
 }
 if(kind==='metrics'){
  const missed=values.policy==='sensitive'?30:1,costs={a:8*5+4*missed,b:18*5+2*missed},candidate=values.candidate;
  return <section className="workshop-lab" aria-label="Coût du filtre choisi"><h3>Conséquence de votre choix</h3><p>Profil actuel : 5 unités par message légitime bloqué ; {missed} par indésirable manqué.</p><p role="status">{candidate==='a'||candidate==='b'?<>Filtre {candidate.toUpperCase()} : <b>{costs[candidate]} unités de coût total</b>. Changez le profil pour observer si votre décision reste adaptée.</>:'Choisissez un filtre pour simuler le coût de ses erreurs.'}</p></section>;
 }
 return null;
}
