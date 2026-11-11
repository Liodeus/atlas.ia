const parts=['sections','deepDive'];
const slug=text=>text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export const lessonSectionId=(theme,step,part,heading)=>`lesson-${theme}-${step}-${part==='deepDive'?'deep':'base'}-${slug(heading)}`;
export const lessonPracticeId=(theme,step)=>`lesson-${theme}-${step}-practice`;

export function practiceSupport(lesson,theme,step){
 return (lesson.practice?.support||[]).flatMap(reference=>{
  if(!parts.includes(reference.part))return [];
  const section=lesson[reference.part].find(section=>section.heading===reference.heading);
  return section?[{...reference,id:lessonSectionId(theme,step,reference.part,section.heading)}]:[];
 });
}

export function findLessonAnchor(hash,lesson,theme,step){
 let id;try{id=decodeURIComponent(hash.replace(/^#/,''))}catch{return null}
 if(lesson.practice&&id===lessonPracticeId(theme,step))return {id,deep:true,practice:true};
 for(const part of parts)for(const section of lesson[part]){
  if(id===lessonSectionId(theme,step,part,section.heading))return {id,deep:part==='deepDive',practice:false};
 }
 return null;
}
