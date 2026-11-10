// Les graphies officielles de certains noms commencent volontairement par une minuscule.
export function sentenceStart(text){
 if(/^(?:vLLM|gpt-oss)\b/.test(text))return text;
 return text.replace(/^\p{Ll}/u,letter=>letter.toLocaleUpperCase('fr-FR'));
}
export function prioritizedConcepts(ids,details,limit=6){
 const first=new Set(ids.filter(id=>Boolean(details[id])).slice(0,limit));
 for(const id of ids){if(first.size>=limit)break;first.add(id)}
 return {visible:ids.filter(id=>first.has(id)),extra:ids.filter(id=>!first.has(id))};
}
