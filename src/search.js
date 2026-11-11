const stopWords=new Set(['a','au','aux','avec','ce','ces','dans','de','des','du','en','et','la','le','les','ou','par','pour','sur','un','une','the','of','and']);
const normalize=text=>String(text).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export const searchWords=text=>normalize(text).match(/[a-z0-9]+/g)||[];

// Une insertion, suppression, substitution ou inversion de deux lettres voisines.
function nearWord(a,b){
 if(a===b)return true;
 if(Math.abs(a.length-b.length)>1)return false;
 let i=0;while(i<a.length&&a[i]===b[i])i++;
 if(a.length===b.length)return a.slice(i+1)===b.slice(i+1)||(a[i]===b[i+1]&&a[i+1]===b[i]&&a.slice(i+2)===b.slice(i+2));
 return a.length>b.length?a.slice(i+1)===b.slice(i):a.slice(i)===b.slice(i+1);
}
export function createSearchIndex(items,{title,body}){
 return items.map(item=>{const heading=searchWords(title(item));return {item,title:heading.join(' '),heading:new Set(heading),words:new Set([...heading,...searchWords(body(item))])}});
}
export function searchIndex(index,query){
 const words=[...new Set(searchWords(query))].filter(word=>!stopWords.has(word));
 if(!words.length)return query.trim()?[]:index.map(record=>({item:record.item,score:0}));
 const phrase=searchWords(query).join(' '),results=[];
 for(const record of index){
  let score=record.title===phrase?1000:record.title.includes(phrase)?100:0,matched=true;
  for(const word of words){
   if(record.heading.has(word)){score+=20;continue}
   if(record.words.has(word)){score+=5;continue}
   if(word.length>=3&&[...record.heading].some(candidate=>candidate.startsWith(word))){score+=12;continue}
   if(word.length>=3&&[...record.words].some(candidate=>candidate.startsWith(word))){score+=3;continue}
   // Les sigles courts (RAG, MCP…) restent exacts pour éviter les faux rapprochements.
   if(word.length>=4&&[...record.heading].some(candidate=>nearWord(word,candidate))){score+=2;continue}
   if(word.length>=5&&[...record.words].some(candidate=>nearWord(word,candidate))){score+=1;continue}
   matched=false;break;
  }
  if(matched)results.push({item:record.item,score});
 }
 return results.sort((a,b)=>b.score-a.score);
}
