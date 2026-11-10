import {extendedTitles,extendedPrerequisites} from './extensionLayout.js';
// Indexation par identifiant de thème moins un ; les identifiants restent stables.
export const courseTitles=[
 ['Distinguer AI, Machine Learning, Deep Learning et LLM','Foundation Model, Base Model et Instruct Model','Choisir un type de modèle pour une tâche'],
 ['Tokens, représentations et Parameters','Attention, FFN et Residual Connections','Q/K/V et information de position'],
 ['Ce que combine l’Attention','Causal Mask, Sliding Window et Sparse Attention','Long Context : capacité et limites'],
 ['Experts et Router','Top-k Routing et Active Parameters','Sparse MoE : mémoire et communication'],
 ['Tokenizer et identifiants de Tokens','Context Window, Prefill et Decode','Sampling, Temperature et limites'],
 ['Pretraining et données de validation','Loss, Backpropagation et Optimizer','Reconnaître l’Overfitting'],
 ['Prompting et Fine-tuning','Full Fine-tuning, LoRA et QLoRA','SFT, préférences et Alignment'],
 ['Inference, TTFT et débit','Quantization et mémoire des poids','KV Cache et contraintes de service'],
 ['Embeddings et Vector Search','Indexation puis pipeline RAG','Vérifier les passages et la réponse'],
 ['Formuler une tâche claire','Structured Output et validation','Comparer des Prompts sur plusieurs cas'],
 ['Modèle, application et Tool Calling','Agent Loop : action et observation','Arrêts, erreurs et permissions'],
 ['Définir tâche, exemples et critères','Accuracy, False Positive et False Negative','Limites des Benchmarks et des juges'],
 ['Instructions et sources externes','Prompt Injection et contrôle des actions','Least Privilege et données sensibles'],
 ['Modalités d’entrée et de sortie','Diffusion et génération progressive','Vérifier les détails et la fidélité'],
 ['Du modèle à un service','Data, Tensor et Pipeline Parallelism','Charge, mémoire et coûts'],
 ['Open Weights, code et droits d’accès','License, Model Card et Dataset Card','Comparer des solutions pour un usage']
];

// Conseils de lecture uniquement : aucune condition de déverrouillage.
// Même indexation que courseTitles. Chaque lien vise /cours/:theme?etape=:step.
export const coursePrerequisites=[
 [],
 [{theme:5,step:1,reason:'Comprendre les Tokens avant de suivre leurs représentations dans un Transformer.'}],
 [{theme:2,step:3,reason:'Identifier Q, K et V avant d’explorer les connexions d’Attention.'}],
 [{theme:2,step:2,reason:'Situer le FFN que remplacent souvent les Experts dans un bloc Transformer.'}],
 [{theme:1,step:1,reason:'Situer le Language Model parmi les différentes techniques d’AI.'}],
 [{theme:2,step:1,reason:'Distinguer les Parameters appris des représentations calculées sur une entrée.'}],
 [{theme:6,step:2,reason:'Comprendre comment un entraînement met à jour les Parameters.'},{theme:10,step:1,reason:'Distinguer une modification du Prompt d’une adaptation des Parameters.'}],
 [{theme:5,step:2,reason:'Distinguer Prefill et Decode pour comprendre le temps de réponse et le cache.'},{theme:3,step:1,reason:'Revoir comment l’Attention utilise les représentations des Tokens précédents.'}],
 [{theme:5,step:2,reason:'Comprendre comment les passages récupérés occupent la Context Window.'},{theme:10,step:1,reason:'Situer la question et les documents dans l’entrée envoyée au modèle.'}],
 [{theme:5,step:2,reason:'Comprendre le contexte fourni au modèle avant d’organiser les consignes.'}],
 [{theme:10,step:2,reason:'Comprendre les sorties structurées avant une demande de Tool Calling.'}],
 [{theme:10,step:3,reason:'Partir de plusieurs cas représentatifs pour comparer des réponses.'}],
 [{theme:11,step:2,reason:'Identifier qui propose, contrôle et exécute les appels d’outils.'},{theme:9,step:2,reason:'Comprendre comment une source externe entre dans le contexte d’un modèle.'}],
 [{theme:1,step:1,reason:'Situer les modèles génératifs parmi les différentes techniques d’AI.'}],
 [{theme:8,step:3,reason:'Distinguer poids et KV Cache avant d’organiser les ressources du service.'}],
 [{theme:1,step:3,reason:'Définir la tâche visée avant de comparer les droits et les conditions des modèles.'}]
];

courseTitles.push(...extendedTitles);
coursePrerequisites.push(...extendedPrerequisites);
