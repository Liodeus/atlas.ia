import {createIdAssigner} from './id-map.mjs';

export function buildGlossary(markdown,existing,corrections={}){
 const chunks=markdown.split(/^## (\d+)\. ([^\n]+)\n/gm);
 const assignId=createIdAssigner(existing);
 const themes=[];
 for(let i=1;i<chunks.length;i+=3){
  const id=Number(chunks[i]),title=chunks[i+1],body=chunks[i+2];
  const entries=[...body.matchAll(/^- \*\*(.*?)\*\* — (.*)$/gm)].map(match=>{
   const name=match[1].replace('⭐ ','');
   return {id:assignId(id,name),name,definition:match[2].split('- **')[0].replaceAll('—',','),priority:match[1].includes('⭐'),theme:id};
  });
  themes.push({id,title,entries});
 }
 const entries=themes.flatMap(theme=>theme.entries);
 if(themes.length!==16||entries.length!==506)throw Error(`Import inattendu : ${themes.length} thèmes, ${entries.length} notions. Adapter explicitement le parcours et ses tests avant de modifier sa couverture.`);
 const byId=new Map(entries.map(entry=>[entry.id,entry]));
 for(const old of existing.flatMap(theme=>theme.entries)){
  if(!byId.has(old.id))throw Error(`Notion disparue ou renommée : ${old.id} (${old.name}). Vérifier ses liens avant de modifier son identifiant.`);
 }
 for(const [id,correction] of Object.entries(corrections)){
  const entry=byId.get(id);
  if(!entry||entry.name!==correction.name)throw Error(`Correction sans notion correspondante : ${id}.`);
  if(entry.definition!==correction.sourceDefinition&&entry.definition!==correction.definition)throw Error(`${id} : la définition source a changé. Relire la correction dans src/glossaryCorrections.json avant de réimporter.`);
  entry.definition=correction.definition;
 }
 return themes;
}
