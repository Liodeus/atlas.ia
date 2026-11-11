import {diagramPlacements,diagramInfo,demoStep} from './learningDiagrams.js';
import {learningOrder} from './lessonNavigation.js';

const demoTitles={
 1:'Classification, génération et Embeddings',
 2:'Attention, FFN et connexions résiduelles',
 3:'Masques d’Attention : causal, bidirectionnel et local',
 4:'Router et sélection des Experts',
 5:'Context Window, Prefill et Decode',
 6:'Courbes de Loss : Training et validation',
 7:'Full Fine-tuning, LoRA et QLoRA',
 8:'Quantization et taille des poids',
 9:'Les étapes d’un pipeline RAG',
 10:'Consigne, contexte et format du Prompt',
 11:'La boucle d’un Agent et ses outils',
 12:'Exactitude, pertinence et sources',
 13:'Document externe, application et permissions',
 14:'Du bruit à une forme : le Denoising',
 15:'Data, Tensor et Pipeline Parallelism',
 16:'Poids, code et droits d’utilisation',
 18:'Famille, variante et service'
};
export const diagramCatalog=[
 ...diagramPlacements.map(p=>({...p,key:p.id,kind:'schema',title:diagramInfo[p.id].title,description:diagramInfo[p.id].note})),
 ...Object.entries(demoTitles).map(([theme,title])=>({key:'demo-'+theme,theme:Number(theme),step:demoStep(Number(theme)),kind:'demo',title,description:'Démonstration interactive'}))
].sort((a,b)=>learningOrder.indexOf(a.theme)-learningOrder.indexOf(b.theme)||a.step-b.step||a.title.localeCompare(b.title,'fr'));
