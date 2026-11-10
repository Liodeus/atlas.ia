import {courseEditorial} from './courseCurriculum.js';

// Chaque notion est abordée dans une des trois leçons de son thème.
export const courseConcepts=Array.from({length:Object.keys(courseEditorial).length},(_,i)=>courseEditorial[i+1].map(lesson=>lesson.concepts));
