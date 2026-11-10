// Ne différer que les brouillons de quiz : les validations et repères restent immédiats.
export function isDraftOnlyChange(previous,next){
 if(!previous||!next||!previous.session||!next.session||previous.session===next.session)return false;
 const a=previous.session,b=next.session;
 if(a.drafts===b.drafts)return false;
 const sameExcept=(left,right,except)=>[...new Set([...Object.keys(left),...Object.keys(right)])].every(key=>key===except||left[key]===right[key]);
 return sameExcept(previous,next,'session')&&sameExcept(a,b,'drafts');
}

export function createProgressWriter(write,onError,delay=200,canWritePending=()=>true,onConflict=()=>{}){
 let pending,timer;
 function cancel(){if(timer!==undefined)clearTimeout(timer);timer=undefined;pending=undefined}
 function flush(force=false){
  if(timer!==undefined)clearTimeout(timer);timer=undefined;
  if(pending===undefined)return;
  const value=pending;pending=undefined;
  try{if(!force&&!canWritePending()){onConflict();return}write(value)}catch(error){onError(error)}
 }
 return {
  schedule(value){pending=value;if(timer!==undefined)clearTimeout(timer);timer=setTimeout(flush,delay)},
  writeNow(value){pending=value;flush(true)},
  flush,
  cancel
 };
}
