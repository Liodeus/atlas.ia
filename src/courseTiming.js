import {lessons} from './content.js';
import {lessonExtras} from './lessonExtras.js';
import {entriesById} from './appData.js';
import {priorityContent} from './priorityContent.js';
import {prioritizedConcepts} from './editorialPresentation.js';
import {expandAbbreviations} from './abbreviations.js';
import {ragContextContent} from './courseWorkshopContent.js';

export const countWords=text=>(String(text).match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)||[]).length;
const sectionText=sections=>sections.flatMap(section=>[section.heading,...section.paragraphs]);
export function lessonTiming(theme,step,lesson){
 const extra=lessonExtras[theme-1][step-1];
 const visible=prioritizedConcepts(lesson.concepts,priorityContent).visible;
 const common=[lesson.goal,lessons[theme-1][step],...sectionText(lesson.sections),extra.example,extra.question,extra.answer,...lesson.takeaways,...visible.map(id=>{const entry=entriesById.get(id);return entry.name+' '+entry.definition})];
 if(theme===9&&step===2)common.push(ragContextContent.question,ragContextContent.rule,ragContextContent.exception,...ragContextContent.answers,...ragContextContent.feedback);
 const advanced=[...sectionText(lesson.deepDive),lesson.practice?.prompt||'',...(lesson.practice?.solution||[])];
 const essentialWords=countWords(common.map(expandAbbreviations).join(' '));
 const detailedWords=essentialWords+countWords(advanced.map(expandAbbreviations).join(' '));
 // Estimation de lecture attentive, puis temps réservé aux exercices visibles.
 // Les fiches supplémentaires et approfondissements repliés restent facultatifs.
 const range=(words,practice)=>({min:Math.ceil(words/220)+1+practice,max:Math.ceil(words/160)+2+(practice?practice+2:0),words,practice});
 return {essential:range(essentialWords,0),detailed:range(detailedWords,lesson.practice?.minutes||0)};
}
export const formatDuration=range=>`${range.min} à ${range.max} min`;
