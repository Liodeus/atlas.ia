import {createHash} from 'node:crypto';
import {workshopCatalog} from '../src/workshopCatalog.js';
import {workshopContent} from '../src/workshops.js';
import workshopReviews from '../src/workshopReviews.json' with {type:'json'};
export const workshopContentDigest=(catalog,content)=>createHash('sha256').update(JSON.stringify({catalog,content})).digest('hex');
export function assertWorkshopReviews({catalog=workshopCatalog,contents=workshopContent,reviews=workshopReviews}={}){
 const ids=new Set(catalog.map(item=>item.id));
 if(Object.keys(reviews).some(id=>!ids.has(id)))throw Error('Une revue d’atelier ne correspond plus au catalogue.');
 for(const item of catalog){
  const review=reviews[item.id];
  if(!review||review.accepted!==true||!Number.isInteger(review.score)||review.score<88||review.score>100||!review.reviewedBy||!review.reviewedAt)throw Error(`Atelier non accepté : ${item.id}. Une revue indépendante avec une note d’au moins 88/100 est nécessaire.`);
  if(!contents[item.id]||review.contentDigest!==workshopContentDigest(item,contents[item.id]))throw Error(`Atelier modifié depuis sa revue : ${item.id}. Faites relire cette version avant publication.`);
 }
 return catalog.length;
}
