// Progression pédagogique : IDs sources conservés, notions de base présentées d'abord.
export const learningOrder=[1,5,10,2,3,6,7,4,8,9,11,12,13,14,15,16,17,18];
export function parseLessonStep(value){
 return ['1','2','3'].includes(value)?Number(value):1;
}
export function nextIncompleteLesson(completed){
 const done=new Set(completed);
 for(const theme of learningOrder)for(let step=1;step<=3;step++)if(!done.has(`${theme}-${step}`))return {theme,step};
 return null;
}
export function resumeLesson(data){
 const last=data.lastLesson;
 if(last&&learningOrder.includes(last.theme)&&Number.isInteger(last.step)&&last.step>=1&&last.step<=3&&!data.completed.includes(`${last.theme}-${last.step}`))return last;
 return nextIncompleteLesson(data.completed);
}
export function lessonNeighbor(theme,step,direction){
 const themePosition=learningOrder.indexOf(theme);
 if(themePosition<0||!Number.isInteger(step)||step<1||step>3||![-1,1].includes(direction))return null;
 const position=themePosition*3+step-1+direction;
 if(position<0||position>=learningOrder.length*3)return null;
 return {theme:learningOrder[Math.floor(position/3)],step:position%3+1};
}
export function shouldHandleLessonArrow(event){
 if(!['ArrowLeft','ArrowRight'].includes(event.key)||event.defaultPrevented||event.repeat||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey)return false;
 const target=event.target;
 if(target?.isContentEditable)return false;
 if(typeof target?.closest==='function'&&target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="slider"], [role="dialog"], .demo'))return false;
 return true;
}
export const lessonPath=lesson=>`/cours/${lesson.theme}/lecons/${lesson.step}`;
