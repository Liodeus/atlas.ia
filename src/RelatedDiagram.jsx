import React from 'react';
import {LearningDiagram} from './LearningDiagrams.jsx';
import {conceptDiagrams,comparisonDiagram} from './learningDiagrams.js';

export default function RelatedDiagram({concept,comparison}){
 const id=comparison?comparisonDiagram(comparison):conceptDiagrams[concept];
 if(!id)return null;
 return comparison?<LearningDiagram id={id}/>:<div className="notion-diagram"><LearningDiagram id={id}/></div>;
}
