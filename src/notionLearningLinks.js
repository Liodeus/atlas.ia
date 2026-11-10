import themes from './themes.js';
import comparisons from './distinctions.json' with {type:'json'};
import {courseEditorial} from './courseCurriculum.js';
import {courseTitles} from './courseTitles.js';
import {conceptName} from './terminology.js';

// Alias éditoriaux : les libellés regroupant plusieurs termes ne doivent pas
// déclencher une recherche sur un fragment vague (« Full », « Size », « V »).
const aliasesById={
 'notion-35':['Parameters','Weights','Parameter','Weight'],
 'notion-39':['Hidden Dimension','d_model'],
 'notion-44':['SiLU','Swish'],
 'notion-46':['FFN','MLP','Feed-Forward Network'],
 'notion-60':['Q/K/V','Query','Key','Value'],
 'notion-71':['Dense Attention','Full Attention'],
 'notion-97':['Context Rot','Lost in the Middle'],
 'notion-109':['Top-1 Routing','Top-2 Routing','Top-1','Top-2'],
 'notion-128':['Vocabulary','Vocab Size'],
 'notion-130':['BOS','EOS'],
 'notion-131':['PAD Token','PAD'],
 'notion-134':['Prompt Tokens','Completion Tokens'],
 'notion-138':['Log Probability','Logprob'],
 'notion-141':['Top-p','Nucleus Sampling'],
 'notion-145':['Frequency Penalty','Presence Penalty'],
 'notion-148':['Determinism','Seed'],
 'notion-157':['Epoch'],
 'notion-158':['Batch','Mini-batch'],
 'notion-165':['AdamW','Adam'],
 'notion-178':['Train / Validation / Test Split','Training Set','Validation Set','Test Set'],
 'notion-197':['Prompt Tuning','Soft Prompt'],
 'notion-201':['Teacher','Student'],
 'notion-218':['Alignment Tax','Capability Trade-off'],
 'notion-223':['FP32','FP16','BF16'],
 'notion-224':['FP8','FP4'],
 'notion-225':['INT8','INT4'],
 'notion-242':['Disaggregated Prefill','Disaggregated'],
 'notion-248':['P50','P95','P99'],
 'notion-253':['Compute-Bound','Memory-Bound'],
 'notion-258':['Compilation','Graph Optimization'],
 'notion-280':['Chunk Size','Overlap'],
 'notion-283':['Late Interaction','ColBERT'],
 'notion-291':['Attribution','Citation Grounding'],
 'notion-295':['Retrieval Recall','Retrieval Precision'],
 'notion-301':['System Message','System Prompt'],
 'notion-322':['Tool Calling','Function Calling'],
 'notion-323':['Tool Result','Tool Output'],
 'notion-328':['Observe–Act Loop','Observe-Act Loop'],
 'notion-334':['Model Router','Model Cascading'],
 'notion-338':['Plugin','Connector'],
 'notion-345':['Human Approval'],
 'notion-352':['Eval','Evaluation Harness'],
 'notion-371':['BLEU','ROUGE'],
 'notion-397':['Backdoor','Trigger'],
 'notion-415':['Audit Log','Trace'],
 'notion-434':['Sampler','Scheduler'],
 'notion-435':['Guidance','CFG','Classifier-Free Guidance'],
 'notion-445':['Audio Tokenization','Codec Tokens'],
 'notion-455':['VRAM','HBM'],
 'notion-473':['Gradient Checkpointing','Activation Checkpointing'],
 'notion-478':['SLA','SLO'],
 'notion-481':['MLflow','Experiment Tracking'],
 'notion-482':['MLOps','LLMOps'],
 'notion-487':['Proprietary','Closed Model'],
 'notion-494':['On-Premises','Self-Hosted'],
 'notion-495':['Edge AI','On-Device AI'],
 'notion-501':['Model Variant','Model Size'],
 'notion-502':['Research Paper','Preprint'],
 'notion-505':['Inference Cost','Token Pricing']
};

// Ces expressions désignent une autre notion, pas une occurrence autonome.
const excludedContinuations={
 'notion-232':['Quantization','Offloading'],
 'notion-456':['Core','Cores']
};

function aliasesFor(entry){
 if(aliasesById[entry.id])return aliasesById[entry.id];
 const name=conceptName(entry);
 const outside=name.replace(/\([^)]*\)/g,'').trim();
 const inside=[...name.matchAll(/\(([^)]*)\)/g)].map(match=>match[1]);
 return [...new Set([outside,...outside.split(' / '),...inside].map(s=>s.trim()).filter(s=>s.length>1))];
}

function patternFor(alias,id){
 const escaped=alias.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/[–-]/g,'[–-]').replace(/\s+/g,'\\s+');
 // Une limite Unicode empêche AI dans RLAIF, RAG dans fragment et Attention
 // dans FlashAttention ou Self-Attention. Les acronymes gardent leur casse.
 const acronym=/^[A-Z][A-Z0-9]{1,5}$/.test(alias);
 const excluded=excludedContinuations[id];
 const suffix=excluded?`(?!\\s+(?:${excluded.join('|')})(?![\\p{L}\\p{N}_–-]))`:'';
 return new RegExp(`(?<![\\p{L}\\p{N}_–-])${escaped}s?(?![\\p{L}\\p{N}_–-])${suffix}`,acronym?'u':'iu');
}

export function buildNotionLearningLinks(themeData,editorial,distinctions,titles){
 const result={};
 for(const theme of themeData)for(const entry of theme.entries){
  const step=editorial[theme.id]?.findIndex(lesson=>lesson.concepts.includes(entry.id));
  if(step===undefined||step<0)continue;
  const lesson=editorial[theme.id][step];
  const candidates=[];
  const aliases=aliasesFor(entry).sort((a,b)=>b.length-a.length);
  for(const [sectionIndex,section] of lesson.sections.entries())for(const [paragraphIndex,paragraph] of section.paragraphs.entries()){
   const matches=aliases.flatMap(alias=>{
    const match=patternFor(alias,entry.id).exec(paragraph);
    if(!match)return [];
    const prefix=paragraph.slice(0,match.index).split(/[.!?;:]/).at(-1).trim();
    // « Retrieval constitue… » est plus utile que sa mention dans
    // « Parent-Child Retrieval ». La recherche reste strictement lexicale.
    const score=/^(?:(?:Un|Une|Le|La|Les|Des|Chaque)|L[’'])?$/iu.test(prefix)?1:0;
    return [{alias,score}];
   }).sort((a,b)=>b.score-a.score);
   if(!matches.length)continue;
   const {alias:matchedAlias,score}=matches[0];
   // Les paragraphes communs sont déjà courts. Garder leur intégralité préserve
   // les antécédents de « ces deux méthodes » et les nuances après la définition.
   // Si un futur paragraphe est trop long, ne pas le tronquer artificiellement.
   if(paragraph.length<=650)candidates.push({text:paragraph,paragraph,heading:section.heading,sectionIndex,paragraphIndex,matchedAlias,score});
  }
  result[entry.id]={
   course:{theme:theme.id,step:step+1,title:titles[theme.id-1]?.[step]||'',path:`/cours/${theme.id}?etape=${step+1}`},
   excerpts:candidates.sort((a,b)=>b.score-a.score).slice(0,2).map(({score,...excerpt})=>excerpt),
   distinctions:distinctions.flatMap((comparison,index)=>['left','right'].filter(side=>comparison[side]?.concept===entry.id).map(side=>({index,title:comparison.title,side,counterpartConcept:comparison[side==='left'?'right':'left']?.concept||null})))
  };
 }
 return result;
}

const entriesById=new Map(themes.flatMap(theme=>theme.entries.map(entry=>[entry.id,entry])));
const cache=new Map();

// Construire les extraits seulement lorsqu'une fiche est ouverte.
export function getNotionLearningLinks(id){
 if(cache.has(id))return cache.get(id);
 const entry=entriesById.get(id);
 if(!entry)return null;
 const links=buildNotionLearningLinks([{id:entry.theme,entries:[entry]}],courseEditorial,comparisons,courseTitles)[id];
 cache.set(id,links);
 return links;
}
