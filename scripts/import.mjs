import fs from 'node:fs';
import {buildGlossary} from './import-glossary.mjs';

const markdown=fs.readFileSync(new URL('../glossaire_ia_llm_exhaustif.md',import.meta.url),'utf8');
const output=new URL('../src/glossary.json',import.meta.url);
const existing=fs.existsSync(output)?JSON.parse(fs.readFileSync(output,'utf8')):[];
const corrections=JSON.parse(fs.readFileSync(new URL('../src/glossaryCorrections.json',import.meta.url),'utf8'));
// Valider l'intégralité de l'import et des corrections avant toute écriture.
const themes=buildGlossary(markdown,existing,corrections);
fs.writeFileSync(output,JSON.stringify(themes,null,2));
console.log(`Importé : ${themes.length} thèmes, ${themes.flatMap(t=>t.entries).length} notions ; ${Object.keys(corrections).length} corrections pédagogiques vérifiées.`);
console.log('Distinctions enrichies, fiches prioritaires et cours conservés. Leurs fichiers src/distinctions.json, src/priorityContent.js et src/courseEditorial*.json sont édités séparément ; la section historique des distinctions du Markdown n’est pas importée.');
