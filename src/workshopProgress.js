// Révision pédagogique : tous les ateliers incluent maintenant un cas de transfert.
export const workshopRevision=2;
export const isCurrentWorkshopAttempt=item=>item?.revision===workshopRevision;
export const isWorkshopComplete=item=>isCurrentWorkshopAttempt(item)&&item.completed===true;
export function validateWorkshops(value){
 const record=x=>Boolean(x&&typeof x==='object'&&!Array.isArray(x));
 const text=x=>typeof x==='string'&&x.length<=200;
 return record(value)&&Object.keys(value).length<=30&&Object.entries(value).every(([id,item])=>/^[a-z0-9-]{1,80}$/.test(id)&&record(item)&&(item.revision===undefined||(Number.isInteger(item.revision)&&item.revision>=1&&item.revision<=1000))&&typeof item.checked==='boolean'&&typeof item.completed==='boolean'&&record(item.values)&&Object.keys(item.values).length<=20&&Object.entries(item.values).every(([key,v])=>/^[a-z0-9-]{1,50}$/.test(key)&&(text(v)||(Array.isArray(v)&&v.length<=20&&v.every(text)))));
}
export function updateWorkshop(previous,values,checked=false,success=false){
 return {revision:workshopRevision,values,checked,completed:Boolean(isWorkshopComplete(previous)||success)};
}
