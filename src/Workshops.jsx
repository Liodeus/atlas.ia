import React,{useEffect,useRef,useState} from 'react';
import {Link,useParams,useSearchParams,useLocation} from 'react-router-dom';
import {ArrowLeft,ArrowRight,Check,ExternalLink,FlaskConical} from 'lucide-react';
import {useApp} from './appContext.js';
import {PageHead} from './LearningUI.jsx';
import {NotFound} from './NotFound.jsx';
import {workshopCatalog,findWorkshop} from './workshopCatalog.js';
import {workshopContent,workshopLessonHref,workshopValues,evaluateWorkshop,memoryBudget,formatMemory,thermalTrials} from './workshops.js';
import {updateWorkshop,isCurrentWorkshopAttempt,isWorkshopComplete} from './workshopProgress.js';
import {WorkshopControls,WorkshopLab} from './WorkshopLabs.jsx';
import {workshopGroups,readWorkshopFilters,workshopCatalogHref,searchWorkshops} from './workshopBrowse.js';
import './workshops.css';

function Catalog(){
 const {data}=useApp();
 const [params,setParams]=useSearchParams(),filters=readWorkshopFilters(params),matches=searchWorkshops(filters);
 const update=changes=>setParams(workshopCatalogHref({...filters,...changes}).split('?')[1]||'',{replace:true});
 const completed=workshopCatalog.filter(item=>isWorkshopComplete(data.workshops?.[item.id])).length;
 return <div className="content workshops-page"><PageHead eyebrow="APPRENDRE EN PRATIQUANT" title={<>À vous de <em>jouer.</em></>} description="Des situations concrètes pour relier les notions, faire des choix et comprendre leurs conséquences. Aucune installation nécessaire."/>
  <div className="workshop-filters" role="search" aria-label="Trouver un atelier"><label>Rechercher un atelier<input type="search" value={filters.q} maxLength={120} placeholder="Ex. : RAG, erreurs, contexte…" onChange={event=>update({q:event.target.value})}/></label><label>Famille d’ateliers<select value={filters.group} onChange={event=>update({group:event.target.value})}><option value="all">Toutes les familles</option>{workshopGroups.map(group=><option key={group.id} value={group.id}>{group.title}</option>)}</select></label></div>
  <div className="workshop-catalog-intro"><span><b role="status">{matches.length} atelier{matches.length===1?'':'s'}</b> · À suivre dans l’ordre de votre choix</span><span>{completed}/{workshopCatalog.length} réussis</span></div>
  {(filters.q||filters.group!=='all')&&<button className="workshop-reset-filter" onClick={()=>update({q:'',group:'all'})}>Réinitialiser les filtres</button>}
  <div className="workshop-grid">{matches.map(item=>{
   const saved=data.workshops?.[item.id];
   return <Link to={'/ateliers/'+item.id} state={{catalogSearch:params.toString()}} key={item.id} className="workshop-card" aria-labelledby={'workshop-'+item.id}>
    <div className="workshop-card-top"><span className="workshop-number">{String(workshopCatalog.indexOf(item)+1).padStart(2,'0')}</span><span>{item.type} · {item.level}</span></div>
    <h2 id={'workshop-'+item.id}>{item.title}</h2><p>{item.description}</p><div className="workshop-card-bottom"><span>{isWorkshopComplete(saved)?<><Check size={16}/> Réussi</>:saved?'Reprendre l’atelier':'Ouvrir l’atelier'}</span><ArrowRight size={18}/></div>
   </Link>;
  })}</div>{matches.length===0&&<p className="workshop-empty">Aucun atelier ne correspond. Essayez un autre mot ou une autre famille.</p>}<p className="workshop-catalog-note">Chaque atelier fournit ses données, des passages du cours et une correction expliquée. Vos choix et vos réussites sont conservés sur cet appareil, avec votre progression.</p>
 </div>;
}
function DataTable({table}){return <div className="workshop-table" tabIndex={0} role="region" aria-label={table.caption}><table><caption>{table.caption}</caption><thead><tr>{table.headers.map(text=><th scope="col" key={text}>{text}</th>)}</tr></thead><tbody>{table.rows.map((row,index)=><tr key={index}>{row.map((text,i)=>i===0?<th scope="row" key={i}>{text}</th>:<td key={i} data-label={table.headers[i]}>{text}</td>)}</tr>)}</tbody></table></div>}
function Options({question,value,onChange}){
 if(question.kind==='number')return <div className="workshop-number-question"><label htmlFor={'workshop-answer-'+question.id}>{question.label}</label><div><input id={'workshop-answer-'+question.id} type="text" inputMode="decimal" maxLength={40} autoComplete="off" value={value||''} onChange={event=>onChange(question.id,event.target.value)}/><span>{question.unit}</span></div><small>Vous pouvez utiliser une virgule ou un point.</small></div>;
 return <fieldset className="workshop-options"><legend>{question.label}</legend><div>{question.options.map(option=>{
 const checked=question.multiple?Array.isArray(value)&&value.includes(option.value):value===option.value;
 return <label key={option.value} className={checked?'selected':''}><input type={question.multiple?'checkbox':'radio'} name={question.id} value={option.value} checked={checked} onChange={()=>onChange(question.id,question.multiple?(checked?value.filter(item=>item!==option.value):[...(value||[]),option.value]):option.value)}/><span>{option.label}</span></label>;
 })}</div></fieldset>}
function MemoryLab({values,onChange}){
 const budget=memoryBudget(values),scale=Math.max(budget.capacity,budget.total);
 const selectors=[['precision','Précision des poids',[['16','16 bits'],['8','8 bits'],['4','4 bits']]],['context','Positions par conversation',[['2048','2 048'],['8192','8 192'],['16384','16 384']]],['sequences','Conversations simultanées',[['1','1'],['4','4'],['8','8']]]];
 return <><div className="workshop-controls">{selectors.map(([id,label,options])=><label key={id}>{label}<select value={values[id]} onChange={event=>onChange(id,event.target.value)}>{options.map(([value,text])=><option key={value} value={value}>{text}</option>)}</select></label>)}</div>
  <div className="workshop-budget" role="status" aria-live="polite"><div className="workshop-budget-heading"><h3>Budget calculé</h3><strong>{formatMemory(budget.total)} / 12 GiB</strong></div>
   <div className="workshop-memory-track" aria-hidden="true"><div className="workshop-memory-bar">{[['weights',budget.weights],['cache',budget.cache],['buffers',budget.buffers]].map(([name,size])=><span key={name} className={name} style={{width:100*size/scale+'%'}}/>)}</div><i className="workshop-capacity-marker" style={{left:100*budget.capacity/scale+'%'}}/></div>
   <div className="workshop-memory-legend"><span><i className="weights"/> Poids : {formatMemory(budget.weights)} GiB</span><span><i className="cache"/> Cache : {formatMemory(budget.cache)} GiB</span><span><i className="buffers"/> Buffers : 1 GiB</span><span>Trait vertical : limite de 12 GiB</span></div>
   <p>Cache : 128 KiB × {formatMemory(budget.context)} positions × {budget.sequences} séquence(s) ÷ 1 048 576 = <b>{formatMemory(budget.cache)} GiB</b>.</p><p>{budget.total<=12?`${formatMemory(12-budget.total)} GiB restent dans le budget du service.`:`Dépassement : ${formatMemory(budget.total-12)} GiB.`} Qualité de cette variante : <b>{budget.quality} cas réussis sur 100</b>.</p>
  </div>
 </>;
}
function ThermalLab({experiment}){
 const trial=thermalTrials[experiment],base=[18,17,9],xs=[62,62+496*4/14,558],y=value=>176-value*4.3;
 const points=values=>values.map((value,i)=>`${xs[i]},${y(value)}`).join(' ');
 return <figure className="workshop-chart"><figcaption>Débit au fil de l’essai <span>Mesures simulées, en tokens/s</span></figcaption>
  <svg viewBox="0 0 620 212" role="img" aria-label={`Essai initial à 1, 5 et 15 minutes : 18, 17 et 9 tokens par seconde.${trial?' Nouvel essai : '+trial.values.join(', ')+'.':''}`}>
   {[0,10,20,30].map(value=><g key={value}><line x1="55" x2="575" y1={y(value)} y2={y(value)} stroke="var(--line)"/><text x="42" y={y(value)+4} textAnchor="end">{value}</text></g>)}
   <polyline points={points(base)} fill="none" stroke="var(--accent)" strokeWidth="3"/>{base.map((value,i)=><circle key={i} cx={xs[i]} cy={y(value)} r="4" fill="var(--accent)"/>)}
   {trial&&<><polyline points={points(trial.values)} fill="none" stroke="var(--workshop-trial)" strokeWidth="3" strokeDasharray="7 5"/>{trial.values.map((value,i)=><circle key={i} cx={xs[i]} cy={y(value)} r="5" fill="var(--workshop-trial)"/>)}</>}
   {['1 min','5 min','15 min'].map((text,i)=><text key={text} x={xs[i]} y="201" textAnchor="middle">{text}</text>)}
  </svg><div className="workshop-chart-legend"><span>Trait plein : essai initial</span>{trial&&<span>Pointillés : {trial.title}</span>}</div>
  <p role="status">{trial?trial.summary:'Choisissez un essai ci-dessus pour afficher ses résultats simulés.'}</p>
 </figure>;
}
function Workshop({item}){
 const location=useLocation(),catalogHref=workshopCatalogHref(readWorkshopFilters(location.state?.catalogSearch));
 const {data,setData}=useApp(),content=workshopContent[item.id],saved=data.workshops?.[item.id];
 const values=workshopValues(item.id,saved?.values),checks=evaluateWorkshop(item.id,values),success=checks.length>0&&checks.every(check=>check.pass);
 const [focusResult,setFocusResult]=useState(false),resultRef=useRef(null);
 useEffect(()=>{if(focusResult){resultRef.current?.focus();setFocusResult(false)}},[focusResult]);
 const change=(key,value)=>setData(current=>({...current,workshops:{...current.workshops,[item.id]:updateWorkshop(current.workshops?.[item.id],{...workshopValues(item.id,current.workshops?.[item.id]?.values),[key]:value})}}));
 const submit=event=>{event.preventDefault();setData(current=>({...current,workshops:{...current.workshops,[item.id]:updateWorkshop(current.workshops?.[item.id],values,true,success)}}));setFocusResult(true)};
 const reset=()=>{setData(current=>{const workshops={...current.workshops};delete workshops[item.id];return {...current,workshops}})};
 return <div className="content workshop-page"><Link className="back" to={catalogHref}><ArrowLeft size={16}/> Tous les ateliers</Link>
  <PageHead eyebrow={item.type.toUpperCase()} title={item.title} description={item.description}/>
  <div className="workshop-mission"><span className="card-kicker"><FlaskConical size={16}/> VOTRE MISSION</span><p>{content.scenario}</p><small>Cas pédagogique fictif. Les fichiers et mesures ne décrivent pas un produit réel.</small></div>
  <section className="workshop-evidence" aria-labelledby="workshop-data"><h2 id="workshop-data">Les données à votre disposition</h2>{content.facts&&<ul>{content.facts.map(fact=><li key={fact}>{fact}</li>)}</ul>}{content.table&&<DataTable table={content.table}/>}</section>
  <aside className="workshop-references" aria-label="Passages utiles du cours"><h2>Besoin d’un repère ?</h2><p>Ces passages s’ouvrent dans un nouvel onglet pour garder votre atelier sous les yeux.</p><ul>{content.support.map(reference=><li key={reference.heading}><Link to={workshopLessonHref(reference)} target="_blank" rel="noopener" aria-label={reference.heading+' (nouvel onglet)'}>{reference.heading}<ExternalLink size={14} aria-hidden="true"/></Link></li>)}</ul></aside>
  <form onSubmit={submit} className="workshop-form"><h2>À vous de décider</h2>{content.controls&&<WorkshopControls controls={content.controls} values={values} onChange={change}/>}
   {content.lab&&!content.afterQuestion&&<WorkshopLab kind={content.lab} values={values}/>}
   {item.id==='budget-memoire'?<MemoryLab values={values} onChange={change}/>:content.questions.map(question=><React.Fragment key={question.id}><Options question={question} value={values[question.id]} onChange={change}/>{content.lab&&content.afterQuestion===question.id&&<WorkshopLab kind={content.lab} values={values}/>}</React.Fragment>)}
   {item.id==='performance-durable'&&<ThermalLab experiment={values.experiment}/>}
   {content.followUp&&<section className="workshop-followup" aria-labelledby="workshop-followup-title"><span className="card-kicker">ET SI LA SITUATION CHANGE ?</span><h3 id="workshop-followup-title">{content.followUp.title}</h3><p>{content.followUp.scenario}</p>{content.followUp.facts&&<ul>{content.followUp.facts.map(fact=><li key={fact}>{fact}</li>)}</ul>}{content.followUp.table&&<DataTable table={content.followUp.table}/>}<div>{content.followUp.questions.map(question=><Options key={question.id} question={question} value={values[question.id]} onChange={change}/>)}</div></section>}
   <div className="workshop-actions"><button className="button" type="submit">Vérifier mes choix <ArrowRight size={16}/></button>{saved&&<button type="button" className="text-link" onClick={reset}>Recommencer</button>}{isWorkshopComplete(saved)&&!saved.checked&&<span><Check size={16}/> Déjà réussi · nouvel essai</span>}</div>
  </form>
  {isCurrentWorkshopAttempt(saved)&&saved.checked&&<section className={'workshop-feedback '+(success?'passed':'retry')} aria-labelledby="workshop-result"><h2 id="workshop-result" ref={resultRef} tabIndex={-1}>{success?'Mission réussie':'Des choix à revoir'}</h2><p>{success?'Vous avez respecté les exigences du scénario.':`${checks.filter(check=>check.pass).length}/${checks.length} critères validés. Appuyez-vous sur ces explications, puis ajustez vos choix.`}</p>
   <ul>{checks.map(check=><li key={check.id}><strong>{check.pass?'✓ Validé':'À revoir'} · {check.label}</strong><p>{check.message}</p></li>)}</ul>
   <div className="workshop-takeaway"><h3>Ce que vous pouvez réutiliser</h3><p>{content.takeaway}</p></div><Link className="text-link" to={catalogHref}>Choisir un autre atelier <ArrowRight size={15}/></Link>
  </section>}
 </div>;
}
export default function Workshops(){const {id}=useParams();if(!id)return <Catalog/>;const item=findWorkshop(id);return item?<Workshop key={id} item={item}/>:<NotFound/>}
