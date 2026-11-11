import {lessonPath} from './lessonNavigation.js';

export const learningPathGroups=[
 {id:'reperes',title:'Prendre ses repères',description:'Comprendre les usages et faire des choix éclairés.'},
 {id:'mecanismes',title:'Comprendre les modèles',description:'Explorer leur fonctionnement, leur apprentissage et leurs modalités.'},
 {id:'applications',title:'Concevoir une application',description:'Relier les modèles aux documents, aux outils et à la mémoire.'},
 {id:'fiabilite',title:'Évaluer et protéger',description:'Mesurer la qualité, encadrer les actions et protéger les données.'},
 {id:'exploitation',title:'Préparer l’exploitation',description:'Choisir les ressources et les conditions d’exécution d’un modèle.'}
];

export const learningPaths=[
 {
  id:'bases',group:'reperes',level:'Découverte',title:'Comprendre les bases',
  description:'Situer les modèles, comprendre les tokens et formuler une première consigne.',prerequisite:'Aucun prérequis.',
  outcomes:['Distinguer IA, apprentissage automatique et modèle de langage.','Expliquer le rôle des tokens et du contexte.','Formuler une tâche et identifier le type de modèle adapté.'],
  lessons:[[1,1],[1,2],[5,1],[5,2],[10,1],[1,3]]
 },
 {
  id:'prompts',group:'reperes',level:'Pratique',title:'Mieux utiliser un LLM',
  description:'Rédiger des consignes claires, structurer les réponses et comparer plusieurs prompts.',prerequisite:'Savoir ce qu’est un modèle de langage ; le parcours « Comprendre les bases » suffit.',
  outcomes:['Organiser la consigne, les exemples et les documents dans le contexte.','Vérifier une sortie structurée et distinguer instructions et sources.','Comparer deux prompts sur des cas et des critères explicites.'],
  lessons:[[5,2],[5,3],[10,1],[10,2],[10,3],[13,1],[12,1]]
 },
 {
  id:'choisir',group:'reperes',level:'Pratique',title:'Choisir un modèle pour son besoin',
  description:'Comparer les familles, les résultats, les droits d’usage et les coûts sur une tâche précise.',prerequisite:'Distinguer un modèle de langage de l’application qui l’utilise.',
  outcomes:['Définir la tâche et les critères avant de comparer des candidats.','Lire une fiche de modèle et vérifier la variante, les capacités et les droits.','Construire une comparaison utile au-delà d’un classement général.'],
  lessons:[[1,3],[12,1],[18,1],[18,2],[18,3],[16,1],[16,2],[12,3],[16,3]]
 },
 {
  id:'architecture',group:'mecanismes',level:'Technique',title:'Comprendre un Transformer',
  description:'Suivre les tokens, l’attention et les experts pour comprendre les calculs du modèle.',prerequisite:'Connaître le rôle d’un modèle de langage. Aucun code à écrire.',
  outcomes:['Distinguer paramètres appris et représentations calculées.','Suivre Q, K et V, les masques d’attention et les limites du contexte.','Expliquer le routage des experts et ses contraintes de mémoire et de communication.'],
  lessons:[[5,1],[2,1],[2,2],[2,3],[3,1],[3,2],[3,3],[4,1],[4,2],[4,3]]
 },
 {
  id:'entrainement',group:'mecanismes',level:'Technique',title:'Comprendre l’entraînement et l’adaptation',
  description:'Passer des données aux paramètres, puis choisir une méthode d’adaptation et l’évaluer.',prerequisite:'Savoir ce qu’est un modèle et avoir déjà formulé une consigne.',
  outcomes:['Séparer les données d’apprentissage et de validation, puis repérer l’overfitting.','Comparer prompting, fine-tuning, LoRA et apprentissage par préférences.','Définir comment vérifier qu’une adaptation améliore la tâche visée.'],
  lessons:[[2,1],[6,1],[6,2],[6,3],[7,1],[7,2],[7,3],[12,1]]
 },
 {
  id:'multimodal',group:'mecanismes',level:'Pratique',title:'Explorer les images et l’audio',
  description:'Comprendre les entrées et sorties multimodales, la génération d’images et leurs contrôles.',prerequisite:'Les bases des modèles génératifs sont conseillées.',
  outcomes:['Vérifier les modalités réellement prises en charge par un modèle.','Situer les étapes et les réglages d’une génération d’image.','Contrôler les détails visuels, la transcription et la fidélité au contenu fourni.'],
  lessons:[[1,3],[14,1],[14,2],[12,1],[14,3],[16,2]]
 },
 {
  id:'documents',group:'applications',level:'Pratique',title:'Concevoir un assistant documentaire',
  description:'Organiser un RAG, retrouver les bons passages et vérifier une réponse sourcée.',prerequisite:'Les bases des modèles de langage sont conseillées.',
  outcomes:['Relier indexation, recherche et construction du contexte de réponse.','Vérifier séparément les passages retrouvés et les affirmations produites.','Prévoir les contrôles sur les sources externes et les données sensibles.'],
  lessons:[[5,2],[10,1],[9,1],[9,2],[9,3],[12,1],[13,1],[13,3]]
 },
 {
  id:'agents',group:'applications',level:'Technique',title:'Concevoir un agent et ses outils',
  description:'Organiser les appels d’outils, les limites et la mémoire d’un agent.',prerequisite:'Savoir formuler une consigne et distinguer modèle et application.',
  outcomes:['Décrire une boucle qui sépare proposition, autorisation, action et observation.','Organiser les outils, les échanges MCP et les conditions d’arrêt.','Préserver le contexte utile et évaluer le résultat d’une tâche longue.'],
  lessons:[[10,2],[11,1],[11,2],[11,3],[13,2],[17,1],[17,2],[17,3],[12,1]]
 },
 {
  id:'production',group:'exploitation',level:'Technique',title:'Optimiser et déployer un modèle',
  description:'Relier temps de réponse, mémoire, charge et coûts pour préparer un service.',prerequisite:'Comprendre les tokens et les grandes étapes du calcul d’un modèle.',
  outcomes:['Distinguer délai, débit, mémoire des poids et cache de génération.','Comparer les formes de parallélisme et les compromis d’une pile d’exécution.','Définir des limites de ressources et des critères avant d’étendre un déploiement.'],
  lessons:[[5,2],[8,1],[8,2],[8,3],[15,1],[15,2],[15,3],[13,3],[16,3]]
 },
 {
  id:'contexte',group:'mecanismes',level:'Technique',title:'Gérer les contextes longs',
  description:'Comprendre ce qu’un long contexte permet, ce qu’il coûte et ce qu’il ne garantit pas.',prerequisite:'Connaître les représentations et l’attention ; le parcours « Comprendre un Transformer » les présente.',
  outcomes:['Distinguer capacité de contexte, information accessible et information réellement utilisée.','Expliquer comment la position et les masques limitent les échanges entre tokens.','Relier longueur du contexte, cache et partage des ressources entre requêtes.'],
  lessons:[[5,2],[2,3],[3,1],[3,2],[3,3],[8,3]]
 },
 {
  id:'experts',group:'mecanismes',level:'Technique',title:'Comprendre les modèles à experts',
  description:'Suivre le routage d’un MoE et relier paramètres actifs, mémoire et échanges entre machines.',prerequisite:'Connaître les paramètres, les représentations et le rôle de l’attention dans un Transformer.',
  outcomes:['Situer les experts dans un bloc et interpréter le choix du routeur.','Distinguer paramètres totaux, paramètres actifs et charge des experts.','Expliquer les compromis de stockage, de quantification et de répartition du calcul.'],
  lessons:[[2,2],[4,1],[4,2],[4,3],[8,2],[15,2]]
 },
 {
  id:'recherche',group:'applications',level:'Pratique',title:'Améliorer la recherche documentaire',
  description:'Comparer la recherche lexicale et vectorielle, mesurer les erreurs et localiser les pertes de passages.',prerequisite:'Comprendre le rôle des documents dans le contexte d’un modèle de langage.',
  outcomes:['Relier représentations, indexation, classement et sélection des passages.','Construire des références et interpréter précision, rappel et erreurs.','Séparer les défauts de recherche et de génération grâce à des essais contrôlés.'],
  lessons:[[9,1],[9,2],[12,1],[12,2],[9,3],[18,3]]
 },
 {
  id:'mcp',group:'applications',level:'Technique',title:'Connecter des outils avec MCP',
  description:'Comprendre les échanges MCP et prévoir les contrats, permissions et limites des outils.',prerequisite:'Savoir distinguer le modèle, l’application et les services qu’elle appelle.',
  outcomes:['Définir les arguments, les résultats et les effets d’un appel d’outil.','Distinguer les rôles du Host, du Client et du Server ainsi que leurs capacités.','Prévoir les contrôles d’accès et de données autour de la connexion.'],
  lessons:[[10,2],[11,1],[13,2],[17,1],[17,2],[13,3]]
 },
 {
  id:'memoire',group:'applications',level:'Technique',title:'Gérer la mémoire et la reprise d’un agent',
  description:'Conserver les informations utiles, reprendre une tâche interrompue et vérifier l’état réel des actions.',prerequisite:'Connaître le principe d’un appel d’outil ; le parcours « Concevoir un agent et ses outils » le présente.',
  outcomes:['Distinguer contexte, mémoire enregistrée et état de travail.','Vérifier les sources et les actions avant de réutiliser un état sauvegardé.','Évaluer une reprise en conservant les limites et les permissions de la tâche.'],
  lessons:[[5,2],[11,2],[11,3],[17,1],[17,3],[12,1]]
 },
 {
  id:'evaluation',group:'fiabilite',level:'Pratique',title:'Évaluer la qualité des réponses',
  description:'Construire un jeu d’essai, choisir des métriques et comprendre les limites des juges automatiques.',prerequisite:'Savoir formuler une tâche et comparer deux réponses à une consigne.',
  outcomes:['Définir des exemples représentatifs et des critères de réussite explicites.','Interpréter les erreurs et les scores sans confondre benchmark et usage réel.','Vérifier les réponses documentaires en séparant recherche, sources et génération.'],
  lessons:[[10,3],[12,1],[12,2],[12,3],[9,2],[9,3],[18,3]]
 },
 {
  id:'securite',group:'fiabilite',level:'Technique',title:'Sécuriser une application avec LLM',
  description:'Repérer les instructions malveillantes et placer les contrôles sur les sorties et les actions.',prerequisite:'Distinguer une consigne, une source documentaire et une action de l’application.',
  outcomes:['Repérer les frontières entre instructions, documents et résultats d’outils.','Distinguer validation du format, vérification du contenu et autorisation d’une action.','Limiter les permissions et examiner les échanges avec les outils connectés.'],
  lessons:[[11,1],[9,2],[13,1],[10,2],[13,2],[13,3],[17,2]]
 },
 {
  id:'confidentialite',group:'fiabilite',level:'Pratique',title:'Protéger les données de son application',
  description:'Suivre les documents et les traces, réduire les accès et comparer les modes d’hébergement.',prerequisite:'Comprendre la différence entre un modèle et l’application qui l’utilise.',
  outcomes:['Repérer où passent les données entre recherche, génération, outils et journaux.','Réduire les données exposées et appliquer des accès adaptés à la tâche.','Comparer les conditions d’hébergement et les documents d’un modèle avant de l’utiliser.'],
  lessons:[[9,2],[11,1],[13,1],[13,3],[16,1],[16,2],[16,3]]
 },
 {
  id:'local',group:'exploitation',level:'Technique',title:'Préparer un modèle pour un usage local',
  description:'Vérifier les droits, estimer la mémoire et examiner les dépendances avant une exécution locale.',prerequisite:'Comprendre les tokens et la différence entre modèle et service.',
  outcomes:['Vérifier l’accès aux poids, les conditions et la compatibilité de la version retenue.','Estimer les besoins en mémoire des poids et du cache avec leurs limites.','Examiner la chaîne complète pour vérifier qu’un usage hors connexion est possible.'],
  lessons:[[16,1],[16,2],[18,3],[8,1],[8,2],[8,3],[15,1],[16,3]]
 }
].map(path=>({...path,lessons:path.lessons.map(([theme,step])=>({theme,step}))}));

export const findLearningPath=id=>learningPaths.find(path=>path.id===id);
export const lessonInPath=(path,lesson)=>Boolean(path?.lessons.some(item=>item.theme===lesson.theme&&item.step===lesson.step));
export function pathForLesson(id,lesson){const path=findLearningPath(id);return lessonInPath(path,lesson)?path:null}
export function learningPathLink(path,lesson){return lessonPath(lesson)+(lessonInPath(path,lesson)?'?parcours='+path.id:'')}
export function isCourseReturnLink(value){
 if(typeof value!=='string')return false;
 const match=/^\/cours\/([1-9]\d*)(?:\/lecons\/([123])(?:\?parcours=([a-z][a-z0-9-]*))?|\?etape=([123]))$/.exec(value);
 return Boolean(match&&(!match[3]||pathForLesson(match[3],{theme:Number(match[1]),step:Number(match[2])})));
}
export function resumeLearningPath(path,data){
 const pending=lesson=>!data.completed.includes(`${lesson.theme}-${lesson.step}`);
 if(lessonInPath(path,data.lastLesson||{})&&pending(data.lastLesson))return data.lastLesson;
 return path.lessons.find(pending)||null;
}
