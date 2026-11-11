import test from 'node:test';import assert from 'node:assert/strict';
import {expandAbbreviations} from '../src/abbreviations.js';
test('expands relevant abbreviations visibly and only once per passage',()=>{
 assert.equal(expandAbbreviations('Le TTFT mesure l’attente. Un TTFT court aide.'),'Le TTFT (Time To First Token) mesure l’attente. Un TTFT court aide.');
 assert.equal(expandAbbreviations('Le TTFT, Time To First Token, mesure l’attente.'),'Le TTFT, Time To First Token, mesure l’attente.');
 assert.equal(expandAbbreviations('Le Machine Learning (ML) apprend.'),'Le Machine Learning (ML) apprend.');
 assert.equal(expandAbbreviations('Une API sert à appeler un service.'),'Une API (Application Programming Interface) sert à appeler un service.');
});
test('does not expand embedded fragments or brand names',()=>{
 assert.equal(expandAbbreviations('RAG-based et vLLM restent inchangés.'),'RAG-based et vLLM restent inchangés.');
 assert.equal(expandAbbreviations('Le GPU et le LLM coopèrent.'),'Le GPU (Graphics Processing Unit) et le LLM (Large Language Model) coopèrent.');
 assert.equal(expandAbbreviations('HNSW utilise un graphe ; QLoRA utilise LoRA.'),'HNSW (Hierarchical Navigable Small World) utilise un graphe ; QLoRA (Quantized Low-Rank Adaptation) utilise LoRA (Low-Rank Adaptation).');
});
test('keeps company names intact while expanding a later ordinary abbreviation',()=>{
 assert.equal(expandAbbreviations('Mistral AI développe une AI pour une tâche.'),'Mistral AI développe une AI (Artificial Intelligence) pour une tâche.');
 for(const name of ['Cohere For AI','Stability AI','Moonshot AI'])assert.equal(expandAbbreviations(name+' publie des modèles.'),name+' publie des modèles.');
});
test('repeated expansion preserves case, brand exclusions and punctuation',()=>{
 const input='Mistral AI explique le TTFT ; une API mesure le TTFT.';
 const expected='Mistral AI explique le TTFT (Time To First Token) ; une API (Application Programming Interface) mesure le TTFT.';
 for(let i=0;i<4;i++)assert.equal(expandAbbreviations(input),expected);
});
test('established compound terms stay contiguous while isolated acronyms remain explained',()=>{
 for(const term of ['JSON Schema','KV Cache','KV Cache Quantization','AI Agent','AI Slop','MCP Client','MCP Resource','RAG Poisoning','Sparse MoE'])assert.equal(expandAbbreviations(term),term);
 assert.equal(expandAbbreviations('JSON Schema formalise le format JSON.'),'JSON Schema formalise le format JSON (JavaScript Object Notation).');
 assert.equal(expandAbbreviations('Un MCP Client communique via MCP.'),'Un MCP Client communique via MCP (Model Context Protocol).');
 assert.equal(expandAbbreviations('Generative AI (GenAI) produit du contenu.'),'Generative AI (GenAI) produit du contenu.');
});
test('existing parenthetical explanations are not doubled',()=>{
 assert.equal(expandAbbreviations('LLM (Large Language Model) et API (Application Programming Interface).'),'LLM (Large Language Model) et API (Application Programming Interface).');
 const input='Le KV Cache et JSON Schema ont des rôles distincts.';
 assert.equal(expandAbbreviations(expandAbbreviations(input)),input);
});
test('distinct acronyms keep their own established expansions',()=>{
 assert.equal(expandAbbreviations('FFN et MLP ont des noms distincts.'),'FFN (Feed-Forward Network) et MLP (Multilayer Perceptron) ont des noms distincts.');
 assert.equal(expandAbbreviations('Le protocole A2A relie des agents.'),'Le protocole A2A (Agent2Agent) relie des agents.');
 assert.equal(expandAbbreviations('LM Head (Language Modeling Head) produit des scores.'),'LM Head (Language Modeling Head) produit des scores.');
});
