import {courseEditorial} from './courseCurriculum.js';
import {courseTitles} from './courseTitles.js';
import {learningOrder} from './lessonNavigation.js';
import {createSearchIndex} from './search.js';

const items=learningOrder.flatMap(theme=>courseEditorial[theme].map((lesson,index)=>({theme,step:index+1,title:courseTitles[theme-1][index],lesson})));
const common=lesson=>[lesson.goal,...lesson.sections.flatMap(section=>[section.heading,...section.paragraphs]),...lesson.takeaways];
export const courseEssentialSearchIndex=createSearchIndex(items,{title:item=>item.title,body:({lesson})=>common(lesson).join(' ')});
export const courseSearchIndex=createSearchIndex(items,{title:item=>item.title,body:({lesson})=>[...common(lesson),...lesson.deepDive.flatMap(section=>[section.heading,...section.paragraphs]),lesson.practice?.prompt||''].join(' ')});
