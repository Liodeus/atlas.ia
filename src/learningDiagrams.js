// Les ancrages éditoriaux sont contrôlés par les tests : un titre renommé ne doit
// jamais faire disparaître silencieusement son illustration.
export const diagramPlacements = [
 {theme:1,step:1,section:'Partir d’une tâche observable',id:'families'},
 {theme:1,step:2,section:'Trois organisations du traitement',id:'architectures'},
 {theme:2,step:1,section:'Passer d’une représentation à des candidats',id:'token-path'},
 {theme:2,step:3,section:'Produire Q, K et V',id:'qkv'},
 {theme:3,step:1,section:'Pourquoi partager K/V peut économiser de la mémoire',id:'heads',deep:true},
 {theme:4,step:3,section:'Répartir les Experts entre appareils',id:'expert-devices'},
 {theme:5,step:1,section:'Un Token n’est pas une unité grammaticale imposée',id:'tokenizer'},
 {theme:5,step:3,section:'Limiter les candidats ou maintenir plusieurs pistes',id:'sampling'},
 {theme:6,step:1,section:'Séparer l’apprentissage, les choix et le jugement final',id:'data-split'},
 {theme:6,step:2,section:'Calculer une direction puis décider d’un pas',id:'training-loop'},
 {theme:7,step:1,section:'Une nouvelle entrée ou de nouveaux Parameters ?',id:'adaptation'},
 {theme:7,step:3,section:'D’où vient la récompense, et comment est-elle utilisée ?',id:'alignment'},
 {theme:8,step:1,section:'Suivre une requête plutôt que chercher un seul chiffre',id:'latency'},
 {theme:8,step:3,section:'Réutiliser les calculs sans confondre les caches',id:'kv-cache'},
 {theme:9,step:1,section:'Comparer des représentations plutôt que des phrases brutes',id:'embedding-space'},
 {theme:9,step:2,section:'Préparer des passages que la recherche pourra utiliser',id:'chunks'},
 {theme:10,step:2,section:'Contraindre la génération ou vérifier son résultat',id:'validation'},
 {theme:12,step:2,section:'Lire plusieurs nombres au lieu d’un seul',id:'confusion'},
 {theme:14,step:2,section:'Comprendre ce qui est représenté dans le Latent Space',id:'latent-diffusion'},
 {theme:14,step:3,section:'Séparer les étapes d’une interaction vocale',id:'speech'},
 {theme:17,step:2,section:'Host, Client et Server',id:'mcp'},
 {theme:17,step:3,section:'Continuer au-delà d’une seule Context Window',id:'handoff'}
];

export const diagramInfo = {
 families:{title:'Des familles qui s’emboîtent',note:'Repère pour les LLM modernes. Le NLP est un domaine d’application qui traverse plusieurs approches ; toute AI n’apprend pas à partir de données.'},
 architectures:{title:'Trois chemins de traitement',note:'Organisations classiques, simplifiées. Les représentations de l’Encoder peuvent alimenter une tête de classification ; un Decoder génère une sortie progressivement.'},
 'token-path':{title:'Du Token ID au prochain Token',note:'À chaque étape de génération, la dernière position fournit les scores du prochain Token. Les Weights sont gelés en Inference ordinaire. Les Activations dépendent de l’entrée ; un cache peut réutiliser certains calculs antérieurs.',source:['Transformer · architecture','https://arxiv.org/html/1706.03762v7']},
 qkv:{title:'Comparer Q et K, puis combiner V',note:'Une tête de Self-Attention, pour une position i. Les pondérations portent seulement sur les positions autorisées. Les contributions sont numériques, sans rôle linguistique imposé.',source:['Attention Is All You Need · § 3.2','https://arxiv.org/html/1706.03762v7#S3.SS2']},
 heads:{title:'Quatre Query Heads, trois façons de partager K/V',note:'Chaque boîte K/V représente une paire de têtes Key et Value. Le partage concerne les Parameters et le cache K/V, pas le nombre de Query Heads. MLA utilise un autre mécanisme.',source:['GQA · Ainslie et al.','https://arxiv.org/abs/2305.13245']},
 'expert-devices':{title:'Un Token peut voyager vers plusieurs GPU',note:'Exemple fictif de Top-2 Routing : E1 et E3 sont sélectionnés. Les flèches transportent des représentations et leurs résultats ; les poids des Experts restent sur leurs appareils.'},
 tokenizer:{title:'Le texte devient des identifiants',note:'Découpage et identifiants inventés. « ␠ » rend l’espace visible. Un autre Tokenizer pourrait découper autrement et utiliser d’autres identifiants.'},
 sampling:{title:'Modifier une distribution, puis limiter les candidats',note:'Cinq candidats fictifs, triés par probabilité. Chaque réglage est comparé séparément au même exemple ; Top-k et Top-p sont montrés avant renormalisation. Aucun réglage ne vérifie les faits.'},
 'data-split':{title:'Trois jeux de données, trois rôles',note:'Répartition illustrative sans proportions imposées. Éviter les recouvrements et réserver le test jusqu’aux choix finaux ; les groupes ou dates peuvent imposer une séparation spécifique.'},
 'training-loop':{title:'Une mise à jour des Parameters',note:'Une étape simplifiée de Training. La cible sert au calcul de la Loss ; les Gradients servent à l’Optimizer. Une Epoch peut contenir de nombreuses mises à jour.'},
 adaptation:{title:'Où intervient le changement ?',note:'Ces approches peuvent se compléter. Ici, Prompting et RAG désignent l’usage à la requête ; le Prompt Tuning, qui entraîne des vecteurs, est un autre mécanisme.'},
 alignment:{title:'Trois signaux pour adapter un modèle',note:'Schémas simplifiés : SFT peut précéder RLHF ou DPO. DPO classique n’entraîne pas de Reward Model séparé. Apprendre une préférence ne garantit pas la vérité.',source:['Direct Preference Optimization','https://arxiv.org/abs/2305.18290']},
 latency:{title:'Attendre le début, puis recevoir la suite',note:'Exemple côté utilisateur : réseau, file d’attente et calcul contribuent au délai. La convention de mesure des Tokens/s doit être précisée. Les durées ici ne sont pas des mesures réelles.'},
 'kv-cache':{title:'Réutiliser le passé, ajouter le présent',note:'Transformer causal avec cache croissant, une couche illustrée. Au Decode, Q et l’Attention du nouveau Token sont encore calculés. Les caches à fenêtre glissante peuvent retirer d’anciennes positions.',source:['Hugging Face · fonctionnement du cache','https://huggingface.co/docs/transformers/main/en/cache_explanation']},
 'embedding-space':{title:'Retrouver des représentations proches',note:'Positions fictives dans un espace 2D, avec une distance euclidienne illustrative. Les vrais Embeddings ont souvent bien plus de dimensions ; la mesure doit correspondre au modèle. Proximité ne signifie pas vérité.'},
 chunks:{title:'Découper en conservant une zone commune',note:'Exemple en phrases, pas en Tokens : chaque passage contient trois phrases, avec une phrase commune. Les tailles réelles et les frontières dépendent de la stratégie de Chunking.'},
 validation:{title:'Deux contrôles avant d’utiliser une sortie',note:'Exemple d’extraction : le montant numérique respecte la structure mais contredit la source. Une action telle qu’un paiement demanderait aussi un contrôle de permission.'},
 confusion:{title:'100 messages : regarder les bonnes cases',note:'« Positif » signifie ici « indésirable ». Les lignes indiquent la réalité et les colonnes la prédiction. Les valeurs reprennent l’exemple de la leçon.',source:['scikit-learn · métriques de classification','https://scikit-learn.org/stable/modules/model_evaluation.html#confusion-matrix']},
 'latent-diffusion':{title:'Générer dans le Latent Space, décoder en pixels',note:'Génération Text-to-Image simplifiée : le débruitage agit dans l’espace latent, le décodeur produit les pixels. L’Encoder d’image intervient notamment dans l’apprentissage de l’Autoencoder, pas comme entrée obligatoire de cette génération.',source:['Latent Diffusion Models · Rombach et al.','https://arxiv.org/abs/2112.10752']},
 speech:{title:'Un assistant vocal en plusieurs étapes',note:'Exemple de pipeline en cascade. D’autres systèmes traitent directement l’audio. Une erreur de transcription peut se propager au traitement puis à la réponse parlée.'},
 mcp:{title:'Les Clients appartiennent au Host',note:'Deux connexions illustratives. Un Client communique avec un Server ; les Servers peuvent être locaux ou distants. Protocole, permissions et confiance dans le contenu restent distincts.',source:['MCP · architecture','https://modelcontextprotocol.io/docs/learn/architecture']},
 handoff:{title:'Compacter ou repartir avec une transmission',note:'Exemples d’organisation applicative. Une synthèse peut perdre des détails ; un document de transmission n’est pas un Checkpoint exécutable. L’état externe doit être revérifié après reprise.'}
};

// Seules les démonstrations déplacées ont un ancrage ; les autres gardent leur
// emplacement historique. MCP est remplacé par son schéma structurel intégré.
export const demoPlacements = {
 2:{step:2,section:'Transporter et normaliser les représentations'},
 6:{step:3,section:'Ce que disent ensemble Training et validation'},
 7:{step:2,section:'LoRA apprend une correction ; QLoRA compacte aussi la base'},
 10:{step:1,section:'Décrire le résultat attendu et les informations disponibles'},
 12:{step:1,section:'Construire une référence puis distinguer les qualités'}
};
export const demoStep = theme => theme===17 ? null : demoPlacements[theme]?.step ?? 2;

// Réutilisation ciblée : une seule illustration pertinente par fiche.
export const conceptDiagrams = {
 'Token':'tokenizer','Tokenizer':'tokenizer','Tokenization':'tokenizer',
 'Embedding Layer':'token-path','Parameter / Weight':'token-path','Activation':'token-path',
 'Top-k Sampling':'sampling','Top-p / Nucleus Sampling':'sampling','Temperature':'sampling',
 'Precision':'confusion','Recall':'confusion','Confusion Matrix':'confusion',
 'KV Cache (Key-Value Cache)':'kv-cache','TTFT (Time To First Token)':'latency',
 'Context Compaction':'handoff','Context Reset':'handoff'
};
export function comparisonDiagram(comparison){
 const left=comparison.left?.name,right=comparison.right?.name;
 const pairs=[['Tokenizer','Embedding Layer','token-path'],['Weight','Activation','token-path'],['Top-k Sampling','Top-p Sampling','sampling'],['Precision','Recall','confusion']];
 return pairs.find(([a,b])=>a===left&&b===right)?.[2];
}

export const samplingBase = [0.5,0.25,0.15,0.07,0.03];
export function temperatureDistribution(probabilities,temperature){
 const powers=probabilities.map(p=>p**(1/temperature)),total=powers.reduce((a,b)=>a+b,0);
 return powers.map(p=>p/total);
}
export function nucleusCount(probabilities,threshold){
 let sum=0;
 return probabilities.findIndex(p=>(sum+=p)>=threshold-1e-12)+1 || probabilities.length;
}
export const confusionCounts={tp:16,fn:4,fp:8,tn:72};
export function classificationMetrics({tp,fn,fp,tn}){
 return {accuracy:(tp+tn)/(tp+fn+fp+tn),precision:tp/(tp+fp),recall:tp/(tp+fn),f1:2*tp/(2*tp+fp+fn)};
}
