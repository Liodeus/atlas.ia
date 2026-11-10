const record=x=>x&&typeof x==='object'&&!Array.isArray(x);
const valid=value=>value==='review'||value==='deep';
export function validateStudyMarks(value){return record(value)&&['questions','concepts'].every(group=>record(value[group])&&Object.entries(value[group]).length<=2000&&Object.entries(value[group]).every(([id,mark])=>id.length>0&&id.length<200&&valid(mark)))}
export function toggleStudyMark(marks,group,id,mark){
 if(!['questions','concepts'].includes(group)||!valid(mark)||typeof id!=='string'||!id)return marks;
 const current=marks||{questions:{},concepts:{}};const updated={...current[group]};
 if(updated[id]===mark)delete updated[id];else updated[id]=mark;
 return {...current,[group]:updated};
}
export function cleanStudyMarks(marks,questions,concepts){
 if(marks===undefined)return undefined;
 return {questions:Object.fromEntries(Object.entries(marks.questions).filter(([id])=>questions.has(id))),concepts:Object.fromEntries(Object.entries(marks.concepts).filter(([id])=>concepts.has(id)))};
}
