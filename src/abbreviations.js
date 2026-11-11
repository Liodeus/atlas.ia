import themes from './themes.js';
import {conceptName} from './terminology.js';

// Réutiliser les noms du glossaire pour que les développements restent cohérents.
// Les noms à graphie particulière et les sigles ambigus restent explicites.
const expansions=new Map();
for(const entry of themes.flatMap(theme=>theme.entries)){
 const name=conceptName(entry).trim();
 const direct=name.match(/^([A-Z][A-Z0-9]{1,6})\s*\(([^()]+)\)$/);
 const reverse=name.match(/^([^()]+)\s+\(([A-Z][A-Z0-9]{1,6})\)$/);
 if(direct&&/\s/.test(direct[2]))expansions.set(direct[1],direct[2]);
 if(reverse&&/\s/.test(reverse[1]))expansions.set(reverse[2],reverse[1].trim());
}
for(const [key,value] of Object.entries({MLP:'Multilayer Perceptron',A2A:'Agent2Agent',IA:'Intelligence artificielle',AI:'Artificial Intelligence',CPU:'Central Processing Unit',HTTP:'Hypertext Transfer Protocol',HTTPS:'Hypertext Transfer Protocol Secure',JSON:'JavaScript Object Notation',URL:'Uniform Resource Locator',URI:'Uniform Resource Identifier',VRAM:'Video Random Access Memory',HNSW:'Hierarchical Navigable Small World',KV:'Key-Value',LoRA:'Low-Rank Adaptation',QLoRA:'Quantized Low-Rank Adaptation',RoPE:'Rotary Position Embedding',FFN:'Feed-Forward Network',MoE:'Mixture of Experts'}))expansions.set(key,value);
for(const key of ['FP','EM'])expansions.delete(key);
const patterns=[...expansions].map(([short,long])=>({short,long,lowerLong:long.toLocaleLowerCase('fr-FR'),token:new RegExp(`(?<![\\p{L}\\p{N}_–-])${short}(?![\\p{L}\\p{N}_–-])`,'gu')}));
// Conserver les noms composés intacts : « JSON Schema », « KV Cache »,
// « MCP Client », etc. Une expansion au milieu les rend difficiles à reconnaître.
const escapeRegExp=value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const protectedTerms=[...new Set([
 ...themes.flatMap(theme=>theme.entries).flatMap(entry=>conceptName(entry).replace(/\([^)]*\)/g,'').split(/\s*\/\s*/)),
 'Mistral AI','Cohere For AI','Stability AI','Moonshot AI'
].map(term=>term.trim()).filter(term=>/\s/.test(term)))].sort((a,b)=>b.length-a.length);
const compoundPattern=new RegExp(`(?<![\\p{L}\\p{N}_])(?:${protectedTerms.map(escapeRegExp).join('|')})(?![\\p{L}\\p{N}_])`,'giu');
const cache=new Map();
const CACHE_LIMIT=2048;

export function expandAbbreviations(text){
 if(typeof text!=='string'||!text)return text;
 if(cache.has(text))return cache.get(text);
 const compounds=[];
 let result=text.replace(compoundPattern,match=>{compounds.push(match);return `\uE000${compounds.length-1}\uE001`});
 let lower=text.toLocaleLowerCase('fr-FR');
 for(const {short,long,lowerLong,token} of patterns){
  if(lower.includes(lowerLong))continue;
  let expanded=false;
  result=result.replace(token,(match,offset,whole)=>{
   if(expanded||/^\s*\(/.test(whole.slice(offset+match.length)))return match;
   expanded=true;return `${match} (${long})`;
  });
  if(expanded)lower=(text+' '+result).toLocaleLowerCase('fr-FR');
 }
 result=result.replace(/\uE000(\d+)\uE001/g,(_,index)=>compounds[Number(index)]);
 if(cache.size>=CACHE_LIMIT)cache.delete(cache.keys().next().value);
 cache.set(text,result);
 return result;
}
