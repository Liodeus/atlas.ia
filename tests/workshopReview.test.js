import test from 'node:test';
import assert from 'node:assert/strict';
import {assertWorkshopReviews} from '../scripts/workshop-review.mjs';
import {workshopCatalog} from '../src/workshopCatalog.js';
import {workshopContent} from '../src/workshops.js';
import reviews from '../src/workshopReviews.json' with {type:'json'};

test('every published workshop matches an independently judged version scoring at least 88',()=>{
 assert.equal(assertWorkshopReviews(),18);
 for(const review of Object.values(reviews)){assert.ok(review.score>=88);assert.match(review.contentDigest,/^[a-f0-9]{64}$/)}
});
test('publication rejects missing reviews, insufficient scores and changes after judging',()=>{
 const first=workshopCatalog[0],missing={...reviews};delete missing[first.id];
 assert.throws(()=>assertWorkshopReviews({reviews:{...reviews,[first.id]:{...reviews[first.id],accepted:false}}}),/non accepté/);
 assert.throws(()=>assertWorkshopReviews({reviews:missing}),/non accepté/);
 assert.throws(()=>assertWorkshopReviews({reviews:{...reviews,[first.id]:{...reviews[first.id],score:87}}}),/non accepté/);
 assert.throws(()=>assertWorkshopReviews({contents:{...workshopContent,[first.id]:{...workshopContent[first.id],scenario:'Scénario modifié'}}}),/modifié depuis sa revue/);
 assert.throws(()=>assertWorkshopReviews({catalog:workshopCatalog.map(item=>item.id===first.id?{...item,title:'Titre modifié'}:item)}),/modifié depuis sa revue/);
});
