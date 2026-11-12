import {workshopCatalog} from './workshopCatalog.js';
export const workshopGroups=[
 {id:'comprendre',title:'Comprendre les modèles',ids:['composer-une-chaine','masquer-attention','router-experts','composer-contexte']},
 {id:'concevoir',title:'Concevoir une application',ids:['entrainement-et-generalisation','choisir-une-adaptation','assembler-des-preuves','valider-une-extraction','reprendre-un-agent']},
 {id:'evaluer',title:'Évaluer et protéger',ids:['comparer-filtres','fidelite-et-qualite','verifier-une-extraction','contenir-une-injection']},
 {id:'deployer',title:'Préparer le déploiement',ids:['choisir-les-fichiers','budget-memoire','performance-durable','changer-environnement','verifier-les-droits']}
];
const keywords={
 'choisir-les-fichiers':'GGUF tokenizer quantification multimodal',
 'budget-memoire':'RAM VRAM KV Cache quantification',
 'fidelite-et-qualite':'KL évaluation quantification',
 'performance-durable':'température thermique watts joules puissance énergie',
 'changer-environnement':'VM ARM x86 GPU conteneur',
 'masquer-attention':'Q K V causal masque Transformer',
 'router-experts':'MoE router top-k paramètres',
 'composer-contexte':'LLM tokens fenêtre mémoire',
 'comparer-filtres':'précision rappel recall accuracy métriques évaluation',
 'composer-une-chaine':'embeddings reranking RAG modèle',
 'entrainement-et-generalisation':'overfitting apprentissage validation fuite de données',
 'choisir-une-adaptation':'RAG prompting fine-tuning LoRA',
 'assembler-des-preuves':'RAG recherche retrieval documentaire',
 'valider-une-extraction':'JSON schéma structured output',
 'reprendre-un-agent':'agent outils autorisation idempotence harness',
 'contenir-une-injection':'injection prompt sécurité données exfiltration',
 'verifier-une-extraction':'image audio OCR multimodal',
 'verifier-les-droits':'licence license open weights model card déploiement'
};
const normalize=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function readWorkshopFilters(input){
 const params=input instanceof URLSearchParams?input:new URLSearchParams(typeof input==='string'?input:'');
 const group=params.get('famille');return {q:(params.get('q')||'').slice(0,120),group:workshopGroups.some(item=>item.id===group)?group:'all'};
}
export function workshopCatalogHref(filters){
 const params=new URLSearchParams();if(filters.q)params.set('q',filters.q.slice(0,120));if(workshopGroups.some(item=>item.id===filters.group))params.set('famille',filters.group);
 return '/ateliers'+(params.size?'?'+params:'');
}
const acronyms=new Set(['rag','moe','vm','llm','kv','gpu','ram','vram','json','ocr','kl']);
export function searchWorkshops(filters){
 const group=workshopGroups.find(item=>item.id===filters.group),words=normalize(filters.q||'').trim().split(/\s+/).filter(Boolean);
 return workshopCatalog.filter(item=>{
  if(group&&!group.ids.includes(item.id))return false;
  const text=normalize([item.title,item.description,item.type,item.level,keywords[item.id]||''].join(' '));
  const tokens=text.match(/[\p{L}\p{N}]+/gu)||[];
  return words.every(word=>acronyms.has(word)?tokens.includes(word):text.includes(word));
 });
}
