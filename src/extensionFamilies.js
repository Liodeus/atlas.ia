// Familles et collections représentatives. Vérifiées dans les sources indiquées le 9 novembre 2026.
// Le nom commercial ne garantit ni les modalités, ni les droits, ni les performances de chaque variante.
const definitions=[
 ['GPT','Famille de modèles d’OpenAI. Les générations et variantes proposées peuvent viser des usages différents ; leurs capacités dépendent du modèle précis.','https://developers.openai.com/api/docs/models'],
 ['gpt-oss','Famille de modèles à Open Weights d’OpenAI, conçus notamment pour être exécutés sur une infrastructure choisie par l’utilisateur.','https://developers.openai.com/api/docs/models/gpt-oss-20b'],
 ['Claude','Famille de modèles d’Anthropic comprenant notamment des variantes Opus, Sonnet et Haiku. Leurs capacités et disponibilités dépendent de la version et du service.','https://docs.anthropic.com/en/docs/about-claude/models'],
 ['Gemini','Famille de modèles de Google dont certaines variantes traitent plusieurs modalités. Gemini désigne aussi des produits et interfaces distincts des modèles eux-mêmes.','https://developers.google.com/machine-learning/glossary/generative'],
 ['Gemma','Famille de modèles de Google dont des variantes sont distribuées avec leurs Weights. Les capacités et les conditions dépendent de la version choisie.','https://ai.google.dev/gemma'],
 ['Llama','Famille de modèles de Meta, proposée en plusieurs versions et tailles, dont certaines prennent en charge des images en entrée.','https://github.com/meta-llama/llama-models'],
 ['Qwen','Famille de modèles développée par l’équipe Qwen chez Alibaba, avec notamment des variantes orientées langage, code ou multimodalité.','https://qwenlm.github.io/about/'],
 ['DeepSeek','Ensemble de modèles publiés par DeepSeek, comprenant des variantes aux objectifs différents. Chaque version doit être examinée séparément.','https://github.com/deepseek-ai/DeepSeek-V3'],
 ['Mistral','Nom de familles de modèles de Mistral AI comprenant des variantes générales et spécialisées. Les modalités et conditions changent selon le modèle.','https://docs.mistral.ai/getting-started/models/'],
 ['Mixtral','Série de modèles de Mistral AI reposant sur une architecture Mixture of Experts. Leurs variantes possèdent des caractéristiques et des conditions propres.','https://mistral.ai/news/mixtral-of-experts'],
 ['Phi','Famille de Small Language Models de Microsoft, comprenant plusieurs variantes dont certaines visent le raisonnement ou des entrées multimodales.','https://azure.microsoft.com/en-us/products/phi/'],
 ['Granite','Collection de modèles d’IBM comprenant notamment des modèles de langage et des modèles spécialisés pour d’autres tâches.','https://www.ibm.com/granite/docs/'],
 ['Command','Famille de modèles de langage de Cohere. Les variantes documentées peuvent différer par leurs usages, leurs entrées et leurs capacités.','https://docs.cohere.com/docs/models'],
 ['Aya','Famille de modèles multilingues de Cohere Labs, auparavant Cohere For AI, conçue pour élargir la couverture linguistique de l’AI générative. Certaines variantes acceptent des images.','https://docs.cohere.com/docs/models'],
 ['BGE','Famille de modèles de représentation et de recherche de BAAI. Certaines variantes produisent des Embeddings utiles à la recherche sémantique.','https://huggingface.co/BAAI/bge-m3'],
 ['Whisper','Famille de modèles de reconnaissance et de traitement de la parole d’OpenAI, notamment utilisée pour la transcription et certaines traductions de la parole.','https://github.com/openai/whisper'],
 ['Stable Diffusion','Famille de modèles de Stability AI utilisée pour la génération d’images. Les versions et leurs licences doivent être vérifiées séparément.','https://stability.ai/core-models'],
 ['FLUX','Ensemble de familles de modèles de Black Forest Labs, dont certaines générations servent à créer ou modifier des images et d’autres produisent de la vidéo.','https://help.bfl.ai/articles/7655484417-what-flux-models-are-available'],
 ['Kimi','Famille de modèles de Moonshot AI. Certaines variantes visent le langage, les agents ou plusieurs modalités ; vérifiez la version utilisée.','https://github.com/MoonshotAI'],
 ['GLM','Famille de modèles associée à Z.ai. Les générations et variantes possèdent leurs propres caractéristiques et conditions de distribution.','https://github.com/zai-org/GLM-5'],
 ['MiniMax-M','Série de modèles de langage de MiniMax comprenant plusieurs variantes destinées notamment aux tâches avec outils et au code.','https://github.com/MiniMax-AI/MiniMax-M2']
];
export const familyTheme={id:18,title:'Model Families et écosystèmes',entries:definitions.map(([name,definition,source],index)=>({id:`notion-${600+index}`,name,definition,source,priority:false,theme:18}))};

export const familyEditorial=[
 {
  goal:'Reconnaître les noms de grandes familles et distinguer un modèle, sa variante et le produit qui le présente.',
  sections:[
   {heading:'Un nom de famille ne décrit pas toute une application',paragraphs:[
    'GPT est un nom de famille de modèles d’OpenAI. ChatGPT est une application qui peut donner accès à certains modèles, avec des outils et des fonctions qui évoluent. Le nom affiché par une application ne décrit donc pas à lui seul la version du modèle ni son environnement d’exécution.',
    'Claude désigne une famille de modèles d’Anthropic ; Opus, Sonnet et Haiku sont des noms de variantes ou de gammes à rechercher dans la documentation. Une même gamme peut évoluer entre générations : il faut identifier la version exacte avant de comparer les caractéristiques.'
   ]},
   {heading:'Différencier des familles apparentées',paragraphs:[
    'Gemini est à la fois le nom de modèles de Google et celui de produits qui permettent d’y accéder. Gemma désigne une autre famille de modèles de Google. Une fonction disponible dans un produit Gemini ne prouve pas qu’une variante Gemma possède cette même fonction.',
    'gpt-oss est une famille d’OpenAI dont les Weights sont distribués pour des usages sur une infrastructure choisie par l’utilisateur. Ce mode de distribution ne permet pas d’en déduire automatiquement les droits ou les composants disponibles pour toute la famille GPT.'
   ]},
   {heading:'Lire une fiche plutôt que deviner à partir du nom',paragraphs:[
    'Llama regroupe des modèles de Meta de plusieurs tailles et générations. Certaines variantes acceptent aussi des images ; le nom Llama seul ne dit pas si une version précise accepte cette entrée ni quelle Context Window elle propose.',
    'Pour chaque candidat, relevez le nom complet, la version, les entrées et sorties acceptées ainsi que la manière d’y accéder. Les modèles d’une même famille peuvent avoir des coûts, contraintes et comportements différents.'
   ]}
  ],
  deepDive:[
   {heading:'Famille, variante, service : trois lignes à noter',paragraphs:[
    'Dans une fiche d’évaluation, inscrivez séparément la famille, l’identifiant exact de la variante et le service qui l’exécute. Deux applications peuvent employer une variante similaire tout en ajoutant des outils, des instructions et des limites différentes.',
    'Notez également la date de votre essai et, lorsqu’elle existe, la version figée ou le Snapshot. Un alias qui pointe vers la version recommandée peut changer ; comparer deux essais exige de savoir ce qui a réellement changé.'
   ]},
   {heading:'Une capacité n’est pas une garantie',paragraphs:[
    'Une variante peut accepter une image sans réussir toutes les tâches visuelles. Un modèle peut proposer un Tool Call sans que l’application autorise ou exécute nécessairement l’action correspondante.',
    'Transformez chaque critère en essai observable : détecter une erreur dans un document, répondre en français ou respecter un schéma JSON. Conservez des exemples difficiles et inspectez aussi les échecs.'
   ]}
  ],
  takeaways:['Une famille rassemble plusieurs modèles ou variantes qui peuvent évoluer.','Le modèle et l’application qui l’utilise sont deux éléments distincts.','Vérifiez l’identifiant exact et la documentation de la variante.'],
  concepts:['notion-600','notion-601','notion-602','notion-603','notion-604','notion-605']
 },
 {
  goal:'Situer plusieurs familles de modèles et comprendre ce que leurs variantes peuvent changer.',
  sections:[
   {heading:'Des collections avec des variantes spécialisées',paragraphs:[
    'Qwen est une famille associée à l’équipe Qwen chez Alibaba. Sa documentation présente notamment des variantes de langage, de code et multimodales. Le suffixe exact et la Model Card permettent de savoir quelle variante est envisagée.',
    'DeepSeek désigne plusieurs séries de modèles publiées par DeepSeek. Les séries DeepSeek-V et DeepSeek-R ne sont pas un seul modèle interchangeable : regardez les caractéristiques de la version précise et son objectif d’utilisation.',
    'Kimi est une famille de Moonshot AI ; GLM est associée à Z.ai ; MiniMax-M désigne des modèles de langage de MiniMax. Pour chacune, les versions et leurs disponibilités évoluent. Vérifiez les modalités, les conditions et la licence de la variante retenue.'
   ]},
   {heading:'Noms commerciaux et architecture',paragraphs:[
    'Mistral désigne plusieurs familles de modèles de Mistral AI. Certains modèles visent des usages généraux et d’autres des tâches spécialisées ; leurs modalités et droits sont à examiner variante par variante.',
    'Mixtral est une série de Mistral AI utilisant une architecture Mixture of Experts. MoE décrit une organisation du modèle et ne signifie pas automatiquement que tous les Experts sont actifs à chaque Token. Mistral et Mixtral ne sont pas deux façons de nommer toute la même collection.'
   ]},
   {heading:'Modèles compacts et collections spécialisées',paragraphs:[
    'Phi est une famille de Small Language Models de Microsoft. Certaines variantes sont conçues pour fonctionner avec des ressources plus limitées, mais une taille plus petite ne garantit ni une latence donnée ni une qualité suffisante pour votre tâche.',
    'Granite est une collection d’IBM qui comprend des modèles de langage et des variantes spécialisées. Comparez l’identifiant et le rôle du modèle avant de déduire de la documentation d’une variante les propriétés d’une autre.'
   ]}
  ],
  deepDive:[
   {heading:'Comparer un modèle dense et un MoE',paragraphs:[
    'Un modèle dense et un modèle MoE peuvent avoir des totaux de Parameters comparables mais ne pas mobiliser les mêmes parties du réseau pour traiter un Token. La comparaison doit distinguer les Parameters totaux des Parameters actifs.',
    'Pour un déploiement local, même des Parameters rarement activés doivent généralement être accessibles au système. La mémoire totale et la vitesse dépendent aussi du moteur, du matériel, de la Quantization et des transferts.'
   ]},
   {heading:'Éviter les conclusions trop générales',paragraphs:[
    'Une Model Card peut décrire plusieurs formats, langues et tâches testées. Ses résultats aident à sélectionner des candidats, mais ne prouvent pas qu’un autre jeu de documents ou un autre langage donnera le même résultat.',
    'Exécutez les mêmes cas représentatifs pour chaque variante retenue et comparez également les erreurs, la latence et les conditions d’exploitation. Une bonne première impression ne remplace pas cette comparaison.'
   ]}
  ],
  takeaways:['Une famille peut inclure des variantes générales ou spécialisées.','MoE décrit une architecture, tandis que le nom commercial identifie une collection.','La taille et la famille ne suffisent pas à prédire les résultats sur votre matériel.'],
  concepts:['notion-606','notion-607','notion-608','notion-609','notion-610','notion-611','notion-618','notion-619','notion-620']
 },
 {
  goal:'Identifier les familles par tâche, puis vérifier version, droits et compatibilité avant de choisir.',
  sections:[
   {heading:'Génération et couverture linguistique',paragraphs:[
    'Command est une famille de modèles de Cohere comprenant des variantes orientées vers différentes tâches. L’API et la Model Card indiquent les entrées disponibles, le contexte et le statut de chaque version.',
    'Aya est une famille multilingue de Cohere Labs, auparavant Cohere For AI. Son objectif de couverture linguistique ne garantit pas le même niveau de qualité pour chaque langue : testez les langues et registres importants pour votre usage.'
   ]},
   {heading:'Recherche et parole demandent des outils adaptés',paragraphs:[
    'BGE comprend notamment des modèles d’Embedding de BAAI. Un modèle BGE peut produire des vecteurs pour la recherche sémantique ; ce rôle diffère de la génération d’une réponse par un LLM.',
    'Whisper désigne des modèles d’OpenAI pour la reconnaissance de la parole et d’autres tâches audio associées. Une transcription reste à vérifier, notamment pour les noms propres et le vocabulaire spécialisé. Le statut d’une API précise peut évoluer indépendamment du modèle publié.'
   ]},
   {heading:'Explorer aussi la génération visuelle',paragraphs:[
    'Stable Diffusion regroupe des modèles de Stability AI utilisés notamment pour générer des images. Une version peut avoir une licence ou des conditions d’usage distinctes de celles d’une autre version.',
    'FLUX désigne des familles de Black Forest Labs : certaines versions sont destinées aux images et d’autres à la vidéo. Ce nom ne suffit pas à connaître la modalité, les droits ou la disponibilité d’une variante.'
   ]}
  ],
  deepDive:[
   {heading:'Choisir une chaîne plutôt qu’un seul nom',paragraphs:[
    'Un assistant documentaire peut combiner un modèle d’Embedding pour retrouver des passages et un modèle génératif pour rédiger à partir de ces passages. Évaluez séparément la recherche et la réponse, puis vérifiez les sources.',
    'Pour des réunions audio, une transcription peut précéder le résumé. Une erreur dans un nom ou un chiffre peut ensuite être amplifiée par le modèle génératif : conservez un moyen de contrôler la source audio.'
   ]},
   {heading:'Mode d’accès, licence et version',paragraphs:[
    'Avant un déploiement, consignez l’identifiant exact, le lien vers la Model Card et les conditions de la variante. L’accès aux Weights, l’autorisation d’usage commercial et les possibilités de redistribution sont des questions distinctes.',
    'En cas de service distant, vérifiez aussi ses conditions propres et le chemin des données. En cas d’hébergement autonome, mesurez les besoins matériels et prévoyez les mises à jour, la surveillance et la maintenance.'
   ]}
  ],
  takeaways:['Les familles peuvent viser la génération, la recherche, la parole ou l’image.','Les modalités et les droits se vérifient pour une variante précise.','Une chaîne peut associer plusieurs modèles aux rôles complémentaires.'],
  concepts:['notion-612','notion-613','notion-614','notion-615','notion-616','notion-617']
 }
];

const choice=(n,level,concept,prompt,options,explanation)=>({id:`author-18-${n}`,theme:18,level,concept:`notion-${concept}`,kind:'choice',prompt,options,answer:options[0],explanation});
const tf=(n,level,concept,prompt,answer,explanation)=>({id:`author-18-${n}`,theme:18,level,concept:`notion-${concept}`,kind:'choice',prompt,options:['Vrai','Faux'],answer:answer?'Vrai':'Faux',explanation});
const matching=(n,level,concept,prompt,labels,answer,explanation)=>({id:`author-18-${n}`,theme:18,level,concept:`notion-${concept}`,kind:'matching',prompt,labels,answer,explanation});
const order=(n,level,concept,prompt,answer,explanation)=>({id:`author-18-${n}`,theme:18,level,concept:`notion-${concept}`,kind:'order',prompt,answer,explanation});
export const familyQuestions=[
 choice(1,'debutant',600,'Une équipe compare un modèle GPT dans deux applications différentes. Quelle information supplémentaire l’aide à interpréter les écarts ?',['La variante exacte, les outils et les instructions de chaque application','Le seul nom commercial présent dans le titre de chaque application','La couleur de l’interface de chaque application','La date de création du compte utilisateur uniquement'],'Les applications peuvent combiner des variantes, outils et consignes différents, même lorsqu’elles affichent un nom de famille similaire.'),
 tf(2,'debutant',604,'Vrai ou faux : une fonctionnalité présente dans un produit Gemini est automatiquement disponible dans toute variante Gemma.',false,'Gemini et Gemma sont des familles distinctes ; une fonction de produit dépend aussi de son intégration.'),
 choice(3,'debutant',601,'Une équipe souhaite examiner des Weights d’OpenAI pour un hébergement qu’elle gère. Quelle famille représente une piste à vérifier ?',['gpt-oss','Claude Sonnet','Gemini','Command'],'gpt-oss est une famille d’OpenAI publiée avec des Weights accessibles. Il faut vérifier la variante, la licence et les ressources nécessaires.'),
 matching(4,'debutant',618,'Associez chaque famille à son organisation.',['Kimi','GLM','MiniMax-M'],['Moonshot AI','Z.ai','MiniMax'],'Kimi, GLM et MiniMax-M sont respectivement associés à Moonshot AI, Z.ai et MiniMax.'),
 choice(5,'debutant',615,'Une équipe veut transformer des enregistrements vocaux en texte avant de les résumer. Quel modèle est directement pertinent pour la première étape ?',['Whisper','Stable Diffusion','BGE','Mixtral'],'Whisper est une famille de reconnaissance de la parole. BGE concerne notamment les Embeddings et Stable Diffusion la génération d’images.'),
 choice(6,'intermediaire',609,'Dans Mixtral, que décrit principalement Mixture of Experts ?',['Une organisation utilisant plusieurs sous-réseaux Experts et un mécanisme de sélection','Une licence unique qui s’applique à tous les modèles de Mistral AI','Un ensemble de fournisseurs API chargés à tour de rôle','Un procédé qui transforme nécessairement tous les modèles en Embedding Models'],'MoE décrit l’architecture et le choix d’Experts ; il ne définit ni une licence ni un mode d’accès.'),
 choice(7,'intermediaire',606,'Une équipe lit que Qwen comprend des modèles de code et des modèles multimodaux. Que doit-elle vérifier avant de choisir ?',['La variante exacte et les entrées, sorties et tâches qu’elle prend en charge','Seulement le nom Qwen, qui garantit les mêmes modalités à toutes les variantes','Uniquement le nombre de Parameters, qui identifie les modalités','Seulement le fournisseur du service, qui détermine les capacités du modèle'],'La documentation de la variante permet de vérifier les modalités et capacités proposées. Le nom de famille seul ne suffit pas.'),
 tf(8,'intermediaire',617,'Vrai ou faux : toutes les variantes FLUX ont nécessairement la même modalité de sortie et les mêmes conditions d’utilisation.',false,'Les familles FLUX comprennent notamment des variantes pour l’image ou la vidéo, dont les conditions peuvent différer.'),
 matching(9,'intermediaire',614,'Associez chaque modèle ou famille au rôle directement concerné.',['BGE pour Embeddings','Whisper','Stable Diffusion'],['Représenter du texte pour une recherche sémantique','Transcrire de la parole','Générer une image'],'Ces modèles remplissent des rôles différents. Une application peut les associer à un modèle de langage.'),
 order(10,'intermediaire',607,'Une équipe veut évaluer une variante DeepSeek pour ses documents internes. Ordonnez ces étapes.',['Identifier la variante et consulter sa Model Card','Définir des exemples et critères représentatifs','Exécuter les essais dans les mêmes conditions que les autres candidats','Examiner les erreurs et les contraintes avant de choisir'],'Identifier le modèle et ses contraintes précède une évaluation comparable sur des cas représentatifs.'),
 choice(11,'avance',605,'Une documentation indique qu’une variante Llama accepte des images. Quelle conclusion est justifiée ?',['Cette variante peut recevoir des images dans le cadre décrit, mais sa qualité visuelle doit être évaluée','Toute variante Llama accepte les mêmes formats d’image et obtient les mêmes résultats','Toutes les interfaces utilisant Llama activent automatiquement la fonction visuelle','La variante produira nécessairement une description correcte de toute image'],'Une modalité acceptée concerne la variante et l’intégration documentées. Elle ne prouve pas la qualité sur toutes les images.'),
 choice(12,'avance',616,'Deux versions de Stable Diffusion sont accessibles au téléchargement. Que faut-il vérifier avant une redistribution commerciale ?',['Les conditions et droits de redistribution propres à chaque version','Le téléchargement réussi, qui vaut autorisation de redistribution','Le type de GPU utilisé, qui détermine les droits de redistribution','Le nom de famille uniquement, qui impose une licence identique à toutes les versions'],'L’accès aux fichiers ne détermine pas tous les droits. Chaque version peut avoir ses propres conditions.'),
 choice(13,'avance',613,'Une équipe doit choisir une variante Aya pour des réponses en plusieurs langues. Quel essai est le plus informatif ?',['Tester chaque langue et registre importants avec des exemples représentatifs','Mesurer uniquement la vitesse sur des phrases anglaises','Déduire la qualité de toutes les langues du seul nom multilingue','Évaluer uniquement la validité du format JSON des réponses'],'La couverture annoncée et un format valide ne garantissent pas la qualité pour chaque langue ou contexte.'),
 choice(14,'avance',610,'Deux variantes Phi tournent sur des configurations différentes. Pourquoi la plus petite ne sera-t-elle pas forcément la plus rapide ?',['La latence dépend aussi du moteur, du matériel et des paramètres d’exécution','La latence dépend uniquement du fournisseur du modèle','La latence est toujours proportionnelle au nombre total de Parameters','Un Small Language Model ne peut jamais fonctionner sur un GPU'],'La taille est un facteur parmi d’autres ; le moteur, la charge, les transferts et la configuration comptent également.'),
 choice(15,'avance',611,'Une application combine un modèle Granite et un outil externe. Quelle vérification porte sur le système complet ?',['Examiner la variante du modèle, les permissions de l’outil et le chemin des données','Vérifier seulement la Model Card de Granite','Vérifier uniquement si le modèle accepte du texte','Déduire les permissions de l’outil du nom de la famille'],'Les capacités du modèle ne définissent pas automatiquement les accès de l’outil ni le chemin suivi par les données.')
];

export const familySources = [...new Map(definitions.map(([name,,source])=>[source,{name,url:source}])).values()];
