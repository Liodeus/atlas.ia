function shuffleItems(items,random){
 const copy=[...items];
 for(let i=copy.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]]}
 return copy;
}

export function prepareQuizQuestion(question,entries,random=Math.random){
 let choices=[];
 if(question.kind==='choice'){
  const options=question.options||[question.answer,...shuffleItems(entries.filter(entry=>entry.theme===question.theme&&entry.definition!==question.answer),random).slice(0,3).map(entry=>entry.definition)];
  choices=shuffleItems(options,random);
 }else if(question.kind==='order'||question.kind==='matching')choices=shuffleItems(question.answer,random);
 return {...question,choices};
}
