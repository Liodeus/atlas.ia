import {validateWorkshops} from './workshopProgress.js';
import {validateFlashcards} from './flashcards.js';
import {validateStudyMarks} from './studyMarks.js';
export const normalize = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function grade(q, value) {
  if(q.kind==='number') { if(!String(value).trim()) return false; const n=Number(String(value).trim().replace(',','.')); return Number.isFinite(n) && Math.abs(n-q.answer)<=(q.tolerance||0); }
  if(Array.isArray(q.answer)) return Array.isArray(value) && q.answer.length===value.length && q.answer.every((v,i)=>v===value[i]);
  return value===q.answer;
}
export function buildQuiz(questions,themes,count,level='all') {
 const selected=questions.filter(q=>(!themes.length||themes.includes(q.theme))&&(level==='all'||q.level===level));
 const groups=new Map(); for(const q of selected){if(!groups.has(q.theme))groups.set(q.theme,[]);groups.get(q.theme).push(q)}
 const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}; for(const a of groups.values()) shuffle(a);
 const result=[]; let keys=shuffle([...groups.keys()]); while(keys.length && result.length<count){for(const k of keys){const q=groups.get(k).pop();if(q) result.push(q);if(result.length>=count) break;}keys=keys.filter(k=>groups.get(k).length)} return result;
}
export function validateProgress(p) {
 const strings=a=>Array.isArray(a)&&a.length<=2000&&a.every(x=>typeof x==='string'&&x.length<200);
 const origin=x=>x==null||(typeof x==='object'&&!Array.isArray(x)&&Number.isInteger(x.theme)&&x.theme>0&&x.theme<=10000&&Number.isInteger(x.step)&&x.step>=1&&x.step<=3);
 const answer=x=>typeof x==='string'||strings(x);
 const details=h=>(h.origin===undefined||origin(h.origin))&&(h.mode===undefined||['practice','exam'].includes(h.mode))&&(h.level===undefined||['all','debutant','intermediaire','avance'].includes(h.level))&&(h.themes===undefined||(Array.isArray(h.themes)&&h.themes.length<=100&&h.themes.every(t=>Number.isInteger(t)&&t>0&&t<=10000)))&&(h.results===undefined||(Array.isArray(h.results)&&h.results.length<=1000&&h.results.every(r=>r&&typeof r==='object'&&typeof r.id==='string'&&r.id.length<200&&typeof r.correct==='boolean'&&answer(r.value))));
 if(!p||p.version!==1||(p.workshops!==undefined&&!validateWorkshops(p.workshops))||!strings(p.completed)||!strings(p.favorites)||!strings(p.errors)||!Array.isArray(p.history)||p.history.length>50||(p.flashcards!==undefined&&!validateFlashcards(p.flashcards))||(p.studyMarks!==undefined&&!validateStudyMarks(p.studyMarks))) return false;
 if(!p.history.every(h=>h&&typeof h.id==='number'&&typeof h.date==='string'&&!Number.isNaN(Date.parse(h.date))&&Number.isInteger(h.correct)&&Number.isInteger(h.total)&&h.correct>=0&&h.correct<=h.total&&details(h)))return false;
 const s=p.session;
 if(s==null)return true;
 return typeof s==='object'&&(s.origin===undefined||origin(s.origin))&&(s.level===undefined||['all','debutant','intermediaire','avance'].includes(s.level))&&typeof s.id==='number'&&['practice','exam'].includes(s.mode)&&Number.isInteger(s.index)&&Array.isArray(s.items)&&s.items.length>0&&s.items.length<=1000&&s.index>=0&&s.index<s.items.length&&s.items.every(q=>q&&typeof q.id==='string'&&Number.isInteger(q.theme)&&['choice','number','order','matching'].includes(q.kind)&&typeof q.prompt==='string'&&typeof q.explanation==='string'&&Array.isArray(q.choices)&&q.choices.every(c=>typeof c==='string')&&(typeof q.answer==='string'||typeof q.answer==='number'||strings(q.answer))&&(q.kind!=='matching'||strings(q.labels)))&&s.answers&&typeof s.answers==='object'&&!Array.isArray(s.answers)&&Object.values(s.answers).every(a=>a&&typeof a.correct==='boolean'&&(typeof a.value==='string'||strings(a.value)))&&(s.drafts===undefined||(s.drafts&&typeof s.drafts==='object'&&!Array.isArray(s.drafts)&&Object.values(s.drafts).every(value=>typeof value==='string'||strings(value))))&&typeof s.checked==='boolean'&&typeof s.finished==='boolean'&&(!s.checked||Boolean(s.answers[s.items[s.index].id]))&&(!s.finished||s.items.every(q=>Boolean(s.answers[q.id])));
}
export function readStoredProgress(raw) {
 if(raw===null)return {progress:null,blocked:false};
 try {const progress=JSON.parse(raw);return validateProgress(progress)?{progress,blocked:false}:{progress:null,blocked:true}}
 catch{return {progress:null,blocked:true}}
}
export function formatCorrectAnswer(q) {
 if(q.kind==='matching')return q.labels.map((label,i)=>`${label} : ${q.answer[i]}`).join(' ; ');
 if(q.kind==='order')return q.answer.join(' → ');
 return String(q.answer);
}
export function saveQuestionDraft(session,id,value){return {...session,drafts:{...(session.drafts||{}),[id]:value}}}
export function beginQuestionEdit(session,id){
 const answer=session.answers[id];if(!answer)return session;
 return {...saveQuestionDraft(session,id,answer.value),checked:false};
}
export function cancelQuestionEdit(session,id){
 const drafts={...(session.drafts||{})};delete drafts[id];
 return {...session,drafts,checked:Boolean(session.answers[id])};
}
export function commitQuizAnswer(session,id,value,correct){
 const drafts={...(session.drafts||{})};delete drafts[id];
 return {...session,drafts,checked:true,answers:{...session.answers,[id]:{value,correct}}};
}
export function moveQuizSession(session,index){
 if(!Number.isInteger(index)||index<0||index>=session.items.length)return session;
 const id=session.items[index].id,hasDraft=Object.hasOwn(session.drafts||{},id);
 return {...session,index,checked:Boolean(session.answers[id])&&!hasDraft};
}
export function upsertQuizHistory(history,result){return [result,...history.filter(item=>item.id!==result.id)].slice(0,50)}
