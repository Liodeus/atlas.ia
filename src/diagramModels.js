export function attentionAllowed(mode,row,col){
 if(!Number.isInteger(row)||!Number.isInteger(col)||row<0||col<0||row>5||col>5)return false;
 if(mode==='bidirectional')return true;
 if(mode==='causal')return col<=row;
 if(mode==='local')return col<=row&&row-col<3;
 return false;
}
export function contextBudget(withDocument,reserved){const capacity=100,used=10+30+(withDocument?40:0)+reserved;return {used,capacity,exceeded:used>capacity}}
export function routeExperts(token,k){const scores={A:[1,3,2,4],B:[3,2,4,1]};return (scores[token]||[]).slice(0,k)}
export function ragScenario(query,rerank){
 const data=query==='window'?{question:'Une Context Window est-elle une mémoire durable ?',retrieved:['P2','P1'],reference:'P1',answer:'La Context Window ne constitue pas une mémoire durable.'}:{question:'À quoi sert le KV Cache ?',retrieved:['P2','P1'],reference:'P1',answer:'Le KV Cache conserve des clés et valeurs pour éviter certains recalculs.'};
 return {...data,ranked:rerank?[...data.retrieved].reverse():[...data.retrieved]};
}

export function visibleRagPassages(scenario,stage){return stage===0?scenario.retrieved:scenario.ranked}
export function decodedTokens(count){return ['dort','sur','le','canapé'].slice(0,Math.max(0,Math.min(4,count)))}
