import {learningPaths,learningPathGroups} from './learningPaths.js';
import {courseTitles} from './courseTitles.js';
import {createSearchIndex,searchIndex} from './search.js';

const index=createSearchIndex(learningPaths,{title:path=>path.title,body:path=>[path.id,path.description,...path.outcomes,...path.lessons.map(lesson=>courseTitles[lesson.theme-1][lesson.step-1])].join(' ')});
export function readPathFilters(search){
 const params=new URLSearchParams(search),requested=params.get('famille');
 return {q:(params.get('q')||'').slice(0,180),group:learningPathGroups.some(group=>group.id===requested)?requested:'all'};
}
export function pathCatalogHref(filters={}){
 const params=new URLSearchParams();
 if(typeof filters.q==='string'&&filters.q)params.set('q',filters.q.slice(0,180));
 if(learningPathGroups.some(group=>group.id===filters.group))params.set('famille',filters.group);
 return '/parcours'+(params.size?'?'+params.toString():'');
}
export function searchLearningPaths({q='',group='all'}={}){
 return searchIndex(index,q).map(result=>result.item).filter(path=>group==='all'||path.group===group);
}
