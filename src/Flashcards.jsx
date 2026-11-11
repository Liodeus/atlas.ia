import React,{useEffect,useMemo,useRef,useState} from 'react';
import {Link,useLocation} from 'react-router-dom';
import {ArrowLeft,ArrowRight,BookOpen,RotateCcw,Layers} from 'lucide-react';
import {FancySelect} from './FancySelect.jsx';
import {conceptName} from './terminology.js';
import {sentenceStart} from './editorialPresentation.js';
import {expandAbbreviations} from './abbreviations.js';
import {StudyMarks} from './StudyMarks.jsx';
import {buildFlashcardDeck,createFlashcardSession,flipFlashcard,moveFlashcard,rateFlashcard,finishFlashcardSession,maskFlashcardDefinition,dueFlashcardIds} from './flashcards.js';
import './flashcards.css';

const emptyProgress=()=>({status:{},session:null});
const plural=(n,singular,pluralForm=singular+'s')=>n===1?singular:pluralForm;

export function Flashcards({entries,orderedThemes,themeLabels,data,setData,ChoiceGroup,PageHead}){
 const location=useLocation(),requested=new URLSearchParams(location.search).get('theme');
 const initialTheme=orderedThemes.some(t=>String(t.id)===requested)?requested:'all';
 const [theme,setTheme]=useState(initialTheme),[scope,setScope]=useState(new URLSearchParams(location.search).get('scope')==='due'?'due':'all'),[count,setCount]=useState('10'),[direction,setDirection]=useState('term');
 const progress=data.flashcards||emptyProgress(),session=progress.session;
 const entryMap=useMemo(()=>new Map(entries.map(entry=>[entry.id,entry])),[entries]);
 const validSession=Boolean(session&&session.ids.every(id=>entryMap.has(id)));
 const [setup,setSetup]=useState(()=>initialTheme!=='all'||new URLSearchParams(location.search).get('scope')==='due'||!validSession);
 const cardRef=useRef(null),resultHeading=useRef(null);
 const focusCard=()=>requestAnimationFrame(()=>{window.scrollTo({top:0,behavior:'instant'});cardRef.current?.focus({preventScroll:true})});
 const update=fn=>setData(current=>({...current,flashcards:fn(current.flashcards||emptyProgress())}));
 const dueIds=dueFlashcardIds(progress);const dueSet=new Set(dueIds);const poolEntries=scope==='due'?entries.filter(entry=>dueSet.has(entry.id)):entries;
 const poolOptions={theme,scope:scope==='due'?'all':scope,favorites:data.favorites,status:progress.status,count:'all'};
 const available=useMemo(()=>buildFlashcardDeck(poolEntries,poolOptions).length,[entries,theme,scope,data.favorites,progress.status,progress.reviewedAt]);
 const {reviewCount,knownCount,favoritesCount}=useMemo(()=>{const favoriteIds=new Set(data.favorites);let reviewCount=0,knownCount=0,favoritesCount=0;for(const entry of entries){if(progress.status[entry.id]==='review')reviewCount++;if(progress.status[entry.id]==='known')knownCount++;if(favoriteIds.has(entry.id))favoritesCount++}return {reviewCount,knownCount,favoritesCount}},[entries,data.favorites,progress.status]);
 const current=validSession?entryMap.get(session.ids[session.index]):null;
 const rated=current?session.ratings[current.id]:undefined;
 const allRated=validSession&&session.ids.every(id=>Boolean(session.ratings[id]));
 function start(){
  const ids=buildFlashcardDeck(poolEntries,{...poolOptions,count});if(!ids.length)return;
  update(current=>({...current,session:createFlashcardSession(ids,direction)}));setSetup(false);focusCard();
 }
 function startReview(){
  const selected=new Set(session.ids.filter(id=>session.ratings[id]==='review'));
  const ids=buildFlashcardDeck(entries.filter(entry=>selected.has(entry.id)),{count:'all'});
  if(!ids.length)return;update(current=>({...current,session:createFlashcardSession(ids,session.direction)}));
  focusCard();
 }
 function flip(){update(current=>({...current,session:flipFlashcard(current.session)}))}
 function move(index){update(current=>({...current,session:moveFlashcard(current.session,index)}));requestAnimationFrame(()=>{cardRef.current?.focus({preventScroll:true});cardRef.current?.scrollIntoView({block:'nearest',behavior:'instant'})})}
 function rate(value){update(current=>rateFlashcard(current,value))}
 function finish(){update(current=>({...current,session:finishFlashcardSession(current.session)}))}
 useEffect(()=>{if(!setup&&validSession&&session.finished){const frame=requestAnimationFrame(()=>{window.scrollTo({top:0,behavior:'instant'});resultHeading.current?.focus({preventScroll:true})});return()=>cancelAnimationFrame(frame)}},[setup,validSession,session?.finished]);
 useEffect(()=>{if(scope==='due'&&dueIds.length===0)setScope('all');if(scope==='review'&&reviewCount===0)setScope('all');if(scope==='favorites'&&favoritesCount===0)setScope('all')},[scope,reviewCount,favoritesCount,dueIds.length]);
 useEffect(()=>{
  if(setup||!validSession||session.finished)return;
  const onKey=e=>{
   if(e.defaultPrevented||e.repeat||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||document.querySelector('.sidebar.opened'))return;
   const target=e.target;
   if(target?.isContentEditable||target?.closest?.('input,textarea,select,[contenteditable]:not([contenteditable="false"]),[role="combobox"],[role="dialog"]'))return;
   if(e.key==='ArrowLeft'&&session.index>0){e.preventDefault();move(session.index-1)}
   else if(e.key==='ArrowRight'&&rated&&session.index<session.ids.length-1){e.preventDefault();move(session.index+1)}
   else if((e.key===' '||e.key==='Spacebar')&&target===document.body){e.preventDefault();flip()}
  };
  document.addEventListener('keydown',onKey);return()=>document.removeEventListener('keydown',onKey);
 },[setup,validSession,session?.id,session?.index,session?.finished,session?.revealed,rated]);

 if(!setup&&validSession&&session.finished){
  const known=session.ids.filter(id=>session.ratings[id]==='known').length,review=session.ids.length-known;
  return <div className="content flashcards-page"><PageHead eyebrow="SESSION TERMINÉE" title={<>Votre révision <em>en bref.</em></>} description="Ces repères correspondent à votre propre évaluation. Vous pouvez les modifier lors d’une prochaine révision." headingRef={resultHeading}/><div className="flashcards-result"><div><span>JE CONNAIS</span><strong>{known}</strong><small>{plural(known,'carte')}</small></div><div><span>À REVOIR</span><strong>{review}</strong><small>{plural(review,'carte')}</small></div></div><div className="actions">{review>0&&<button type="button" className="button" onClick={startReview}>{review===1?'Revoir cette carte':`Revoir ces ${review} cartes`} <RotateCcw size={16}/></button>}<button type="button" className="button secondary" onClick={()=>setSetup(true)}>Nouvelle session <ArrowRight size={16}/></button><Link className="button secondary" to="/progression">Ma progression <ArrowRight size={16}/></Link></div></div>;
 }
 if(!setup&&validSession&&current){
  const currentDirection=session.direction==='mixed'?session.directions[current.id]:session.direction;
  const front=currentDirection==='term'?conceptName(current):sentenceStart(maskFlashcardDefinition(current));
  const back=currentDirection==='term'?expandAbbreviations(sentenceStart(current.definition)):conceptName(current);
  const frontLabel=currentDirection==='term'?'NOTION':'DÉFINITION',backLabel=currentDirection==='term'?'DÉFINITION':'NOTION';
  return <div className="content flashcards-page flashcards-session"><button type="button" className="back back-button" onClick={()=>setSetup(true)}><ArrowLeft size={15}/> Quitter la session</button><div className="flashcards-progress"><div><span>CARTE {session.index+1} SUR {session.ids.length}</span><span>{Object.keys(session.ratings).length} évaluée{Object.keys(session.ratings).length!==1?'s':''}</span></div><div className="progress-track"><div style={{width:(Object.keys(session.ratings).length/session.ids.length*100)+'%'}}/></div></div><div className="flashcard-topic"><Layers size={17} aria-hidden="true"/><span>{themeLabels[current.theme-1]}</span></div>
   <button key={current.id} type="button" ref={cardRef} className={'flashcard-face '+(session.revealed?'is-revealed':'')} aria-expanded={session.revealed} aria-controls="flashcard-answer" onClick={flip}><span className="flashcard-kicker">{frontLabel}</span><strong className="flashcard-front">{front}</strong><span id="flashcard-answer" className="flashcard-answer" hidden={!session.revealed}><span className="flashcard-kicker">{backLabel}</span><span>{back}</span></span><span className="flashcard-flip"><RotateCcw size={16} aria-hidden="true"/>{session.revealed?'Masquer la réponse':'Afficher la réponse'}</span></button>
   <StudyMarks data={data} setData={setData} group="concepts" id={current.id} label="Cette notion"/><div className="flashcard-assessment"><div><h2>Comment vous sentez-vous ?</h2><p>{session.revealed?'Choisissez un repère. Vous pourrez revenir et le modifier.':'Révélez la réponse avant de choisir un repère.'}</p></div><div className="flashcard-ratings"><button type="button" className={'flashcard-rating review '+(rated==='review'?'selected':'')} aria-pressed={rated==='review'} disabled={!session.revealed} onClick={()=>rate('review')}>À revoir</button><button type="button" className={'flashcard-rating known '+(rated==='known'?'selected':'')} aria-pressed={rated==='known'} disabled={!session.revealed} onClick={()=>rate('known')}>Je connais</button></div></div><p className="flashcard-rated" role="status" aria-live="polite">{rated?(rated==='known'?'Marquée : je connais.':'Marquée : à revoir.'):' '}{progress.reviewedAt?.[current.id]&&` Dernière révision : ${new Date(progress.reviewedAt[current.id]).toLocaleDateString('fr-FR')}.`}</p>
   <div className="flashcard-navigation"><button type="button" className="button secondary" disabled={session.index===0} onClick={()=>move(session.index-1)}><ArrowLeft size={16}/> Carte précédente</button><Link className="text-link" to={'/notions/'+current.id} state={{returnTo:'/flashcards'}}>Ouvrir la fiche <BookOpen size={16}/></Link>{session.index===session.ids.length-1?<button type="button" className="button" disabled={!allRated} onClick={finish}>Voir le bilan <ArrowRight size={16}/></button>:<button type="button" className="button" disabled={!rated} onClick={()=>move(session.index+1)}>Carte suivante <ArrowRight size={16}/></button>}</div><p className="flashcard-keyboard">Utilisez ← et → pour naviguer. Espace sur la carte pour la retourner.</p></div>;
 }
 return <div className="content flashcards-page"><PageHead eyebrow="RÉVISER À SON RYTHME" title={<>Réviser avec des <em>flashcards.</em></>} description="Retrouvez une notion, puis retournez la carte pour vérifier."/><p className="flashcards-status"><span><b>{knownCount}</b> connues</span><span><b>{reviewCount}</b> à revoir</span><Link className="text-link" to="/progression">Ma progression <ArrowRight size={14}/></Link></p>
 {validSession&&<div className="resume"><div><b>Une session vous attend</b><p>{session.finished?'Vous pouvez consulter votre dernier bilan.':`Carte ${session.index+1} sur ${session.ids.length}.`}</p></div><button type="button" className="button secondary" onClick={()=>{setSetup(false);if(!session.finished)focusCard()}}>Reprendre <ArrowRight size={16}/></button></div>}
 {session&&!validSession&&<p className="flashcard-notice">Cette ancienne session contient des notions indisponibles. Vous pouvez démarrer une nouvelle session.</p>}
 <div className="flashcards-setup"><div className="setup-heading"><div><span className="card-kicker">UNE RÉVISION À VOTRE MESURE</span><h2>Composer ma session</h2><p>Les cartes sont mélangées, sans répétition.</p></div><span className="setup-icon"><Layers size={23}/></span></div>
 <ChoiceGroup compact name="flashcards-scope" legend="1. Quelles cartes ?" value={scope} onChange={setScope} options={[{value:'all',title:'Toutes les cartes'},{value:'due',title:'À réviser aujourd’hui',description:dueIds.length+' '+plural(dueIds.length,'notion')+' à réviser',disabled:dueIds.length===0},{value:'review',title:'À revoir',description:reviewCount+' '+plural(reviewCount,'notion')+' à revoir',disabled:reviewCount===0},{value:'favorites',title:'Mes favoris',description:favoritesCount+' '+plural(favoritesCount,'notion')+' enregistrée'+(favoritesCount===1?'':'s'),disabled:favoritesCount===0}]}/>
 <div className="flashcard-theme"><span id="flashcards-theme-label">2. Quel thème ?</span><FancySelect label="Thème des flashcards" value={theme} onChange={setTheme} options={[{value:'all',label:'Tous les thèmes'},...orderedThemes.map(t=>({value:String(t.id),label:themeLabels[t.id-1]}))]}/></div>
 <ChoiceGroup compact name="flashcards-count" legend="3. Combien de cartes ?" value={count} onChange={setCount} options={[{value:'10',title:'10'},{value:'20',title:'20'},{value:'40',title:'40'},{value:'all',title:'Toutes'}]}/>
 <ChoiceGroup compact name="flashcards-direction" legend="4. Dans quel sens ?" value={direction} onChange={setDirection} options={[{value:'term',title:'Notion → définition'},{value:'definition',title:'Définition → notion'},{value:'mixed',title:'Mélanger les deux sens'}]}/>
 <p className="setup-note">{available} {plural(available,'carte')} disponible{available===1?'':'s'} avec ces filtres.{count!=='all'&&available>0&&available<Number(count)?` La session contiendra ${available} ${plural(available,'carte')}.`:''}</p>{validSession&&!session.finished&&<p className="setup-note">Une nouvelle session remplacera la session en cours. Vos repères restent enregistrés.</p>}<button type="button" className="button" disabled={!available} onClick={start}>{validSession?'Commencer une nouvelle session':'Commencer la révision'} <ArrowRight size={16}/></button></div></div>;
}
