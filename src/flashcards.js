import {conceptName} from './terminology.js';

const validId=id=>typeof id==='string'&&/^notion-\d+$/.test(id);
const record=value=>value&&typeof value==='object'&&!Array.isArray(value);
const rating=value=>value==='known'||value==='review';

export function maskFlashcardDefinition(entry){
 const aliases=new Set();
 for(const name of [conceptName(entry),entry.name].filter(Boolean)){
  const outside=name.replace(/\([^)]*\)/g,'').trim();
  for(const value of [outside,...outside.split(/\s*\/\s*/),...[...name.matchAll(/\(([^)]*)\)/g)].map(match=>match[1])]){
   const alias=value.trim();if(alias.length>=3||/^[A-Z]{2}$/.test(alias))aliases.add(alias);
  }
 }
 let definition=entry.definition;
 for(const alias of [...aliases].sort((a,b)=>b.length-a.length)){
  const escaped=alias.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/\s+/g,'\\s+');
  const acronym=/^[A-Z][A-Z0-9]{1,5}$/.test(alias),suffix=/[A-Za-z]$/.test(alias)&&!alias.endsWith('s')?'s?':'';
  definition=definition.replace(new RegExp(`(?<![\\p{L}\\p{N}_–-])${escaped}${suffix}(?![\\p{L}\\p{N}_–-])`,acronym?'u':'iu'),'[terme masqué]');
 }
 return definition;
}

export function buildFlashcardDeck(entries,{theme='all',scope='all',favorites=[],status={},count=10}={},random=Math.random){
 if(!['all','review','favorites'].includes(scope))return [];
 const favoriteIds=new Set(favorites),seen=new Set(),groups=new Map();
 for(const entry of entries){
  if(!validId(entry.id)||seen.has(entry.id)||(theme!=='all'&&String(entry.theme)!==String(theme)))continue;
  if(scope==='review'&&status[entry.id]!=='review')continue;
  if(scope==='favorites'&&!favoriteIds.has(entry.id))continue;
  seen.add(entry.id);if(!groups.has(entry.theme))groups.set(entry.theme,[]);groups.get(entry.theme).push(entry.id);
 }
 const shuffle=values=>{for(let i=values.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[values[i],values[j]]=[values[j],values[i]]}return values};
 for(const group of groups.values())shuffle(group);
 let keys=shuffle([...groups.keys()]);const result=[],limit=count==='all'?Infinity:Math.max(0,Math.floor(Number(count)||0));
 while(keys.length&&result.length<limit){for(const key of keys){const id=groups.get(key).pop();if(id)result.push(id);if(result.length>=limit)break}keys=keys.filter(key=>groups.get(key).length)}
 return result;
}

export function createFlashcardSession(ids,direction='term'){
 if(!Array.isArray(ids)||!ids.length||new Set(ids).size!==ids.length||!ids.every(validId)||!['term','definition'].includes(direction))return null;
 return {ids:[...ids],index:0,revealed:false,ratings:{},finished:false,direction};
}
export function flipFlashcard(session){return session&&!session.finished?{...session,revealed:!session.revealed}:session}
export function moveFlashcard(session,index){
 if(!session||session.finished||!Number.isInteger(index)||index<0||index>=session.ids.length)return session;
 return {...session,index,revealed:false};
}
export function rateFlashcard(progress,value,now=new Date().toISOString()){
 const session=progress?.session;
 if(!session||session.finished||!session.revealed||!rating(value))return progress;
 const id=session.ids[session.index];
 return {...progress,status:{...progress.status,[id]:value},reviewedAt:{...progress.reviewedAt,[id]:now},session:{...session,ratings:{...session.ratings,[id]:value}}};
}
export function dueFlashcardIds(progress,now=new Date().toISOString()){
 const current=Date.parse(now);
 return Object.keys(progress.status).filter(id=>{
  const date=Date.parse(progress.reviewedAt?.[id]||'');
  const interval=progress.status[id]==='review'?1:7;
  return !Number.isFinite(date)||current-date>=interval*86400000;
 });
}
export function finishFlashcardSession(session){
 if(!session||session.finished||!session.ids.every(id=>rating(session.ratings[id])))return session;
 return {...session,finished:true};
}
export function validateFlashcards(value){
 if(!record(value)||!record(value.status)||Object.keys(value.status).length>2000||!Object.entries(value.status).every(([id,v])=>validId(id)&&rating(v)))return false;
 if(value.reviewedAt!==undefined&&(!record(value.reviewedAt)||Object.keys(value.reviewedAt).length>2000||!Object.entries(value.reviewedAt).every(([id,date])=>validId(id)&&id in value.status&&typeof date==='string'&&Number.isFinite(Date.parse(date)))))return false;
 const session=value.session;if(session==null)return true;
 if(!record(session)||!Array.isArray(session.ids)||!session.ids.length||session.ids.length>2000||!session.ids.every(validId)||new Set(session.ids).size!==session.ids.length||!Number.isInteger(session.index)||session.index<0||session.index>=session.ids.length||typeof session.revealed!=='boolean'||typeof session.finished!=='boolean'||!['term','definition'].includes(session.direction)||!record(session.ratings))return false;
 const ids=new Set(session.ids);
 if(!Object.entries(session.ratings).every(([id,v])=>ids.has(id)&&rating(v)&&value.status[id]===v))return false;
 return !session.finished||session.ids.every(id=>rating(session.ratings[id]));
}
export function cleanFlashcards(value,knownIds){
 if(value===undefined)return {value:undefined,removed:false};
 const status=Object.fromEntries(Object.entries(value.status).filter(([id])=>knownIds.has(id)));
 const session=value.session?.ids.some(id=>!knownIds.has(id))?null:value.session;
 const reviewedAt=value.reviewedAt===undefined?undefined:Object.fromEntries(Object.entries(value.reviewedAt).filter(([id])=>knownIds.has(id)));
 return {value:{...value,status,session,...(reviewedAt===undefined?{}:{reviewedAt})},removed:Object.keys(status).length!==Object.keys(value.status).length||Boolean(value.session&&!session)};
}
