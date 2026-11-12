// Références officielles consultées le 9 novembre 2026. Les versions des protocoles évoluent.
export const harnessSources=[
 {label:'Anthropic : Effective harnesses for long-running agents',url:'https://www.anthropic.com/research/effective-harnesses-for-long-running-agents'},
 {label:'MCP : spécification et architecture',url:'https://modelcontextprotocol.io/specification/2026-07-28'},
 {label:'MCP : nouveautés de la spécification 2026-07-28',url:'https://blog.modelcontextprotocol.io/posts/2026-07-28/'},
 {label:'MCP : sécurité et bonnes pratiques',url:'https://modelcontextprotocol.io/specification/2026-07-28/basic/security_best_practices'},
 {label:'Anthropic : évaluer les agents',url:'https://www.anthropic.com/research/demystifying-evals-for-ai-agents'},
 // Compléments vérifiés le 12 novembre 2026.
 {label:'ACP : Agent Client Protocol',url:'https://agentclientprotocol.com/get-started/introduction'},
 {label:'AGENTS.md : consignes de dépôt',url:'https://agents.md/'},
 {label:'MCP : Sampling (déprécié)',url:'https://modelcontextprotocol.io/specification/2026-07-28/client/sampling'},
 {label:'MCP : Elicitation',url:'https://modelcontextprotocol.io/specification/2026-07-28/client/elicitation'}
];

const definitions=[
 ['Agent Harness','Ensemble de composants qui encadrent un modèle pour conduire une tâche : boucle, contexte, outils, état et contrôles selon le système.'],
 ['Agent Runtime','Environnement qui exécute et coordonne les étapes d’un agent, notamment les appels au modèle et aux outils.'],
 ['Agent Loop','Cycle de décision, d’action et d’observation répété jusqu’à une condition d’arrêt.'],
 ['Tool Registry','Catalogue des outils disponibles et de leurs descriptions, paramètres et contraintes utiles à leur sélection.'],
 ['Tool Dispatcher','Composant qui dirige un appel d’outil proposé vers l’implémentation autorisée et récupère son résultat.'],
 ['Execution Budget','Limite de ressources fixée pour une exécution, par exemple le nombre d’étapes, le temps ou le coût.'],
 ['Timeout','Délai maximal attendu avant d’interrompre ou de considérer une opération comme expirée.'],
 ['Retry Policy','Règles qui déterminent si, quand et combien de fois une opération échouée peut être retentée.'],
 ['MCP Host','Application qui héberge les connexions MCP et décide comment utiliser les capacités exposées par les serveurs.'],
 ['MCP Client','Composant de l’application qui échange avec un MCP Server au moyen du protocole.'],
 ['MCP Server','Composant qui expose des capacités comme des Tools, Resources ou Prompts à des clients MCP.'],
 ['MCP Tool','Capacité exposée par un MCP Server et que le client peut demander à appeler avec des arguments.'],
 ['MCP Resource','Contenu identifié par une URI et exposé par un MCP Server pour être lu par un client.'],
 ['MCP Prompt','Modèle de message ou de séquence de messages exposé par un MCP Server pour une utilisation explicite par le client.'],
 ['Streamable HTTP','Transport MCP fondé sur HTTP permettant des échanges avec un serveur distant ou local selon la version du protocole.'],
 ['MCP Authorization','Mécanismes permettant de vérifier l’accès du client aux ressources protégées d’un MCP Server, selon le transport et le déploiement.'],
 ['Context Compaction','Réduction du contexte transmis au modèle, souvent par résumé ou sélection, avec un risque de perdre des détails utiles.'],
 ['Context Reset','Démarrage d’un nouveau contexte avec les informations retenues pour la suite, plutôt que conservation intégrale de l’historique.'],
 ['Session Handoff Artifact','Document ou état structuré transmis à une session suivante pour reprendre le travail et ses contraintes.'],
 ['Agent Checkpoint','État enregistré d’une exécution permettant une reprise selon les capacités du système, distinct d’un Model Checkpoint.'],
 ['Agent Trajectory','Suite des décisions, appels d’outils, observations et résultats d’une exécution d’agent.'],
 ['Agent Evals','Évaluations du comportement d’un agent sur des tâches et critères définis, y compris ses actions et résultats.'],
 ['MCP Apps','Extension MCP permettant à un serveur de fournir des interfaces interactives intégrées dans une application compatible.'],
 ['Tool Permission Policy','Ensemble de règles qui limite les outils et actions autorisés selon le contexte et les droits accordés.'],
 // Ajouts sourcés le 12 novembre 2026 ; identifiants explicites pour préserver les liens.
 ["Agent Client Protocol (ACP)", "Protocole qui standardise les échanges entre des clients, notamment des éditeurs de code, et des agents de programmation compatibles.", 636],
 ["AGENTS.md", "Convention de fichier Markdown pour fournir aux agents de programmation les consignes d’un dépôt : commandes, organisation du code et règles de contribution.", 637],
 ["MCP Sampling", "Capacité MCP permettant à un serveur de solliciter une génération de modèle via le client, dépréciée depuis la version 2026-07-28 du protocole.", 638],
 ["MCP Elicitation", "Capacité MCP permettant à un serveur de demander une information à l’utilisateur par l’intermédiaire du client, avec possibilité de refus ou d’annulation.", 639]
];
export const harnessTheme={id:17,title:'Agent Harness & Tooling',entries:definitions.map(([name,definition,id],i)=>({id:`notion-${id??507+i}`,name,definition,priority:false,theme:17}))};


const C=(n,level,concept,prompt,options,explanation)=>({id:`author-17-${n}`,theme:17,level,concept:`notion-${concept}`,kind:'choice',prompt,answer:options[0],options,explanation});
const T=(n,level,concept,prompt,answer,explanation)=>({id:`author-17-${n}`,theme:17,level,concept:`notion-${concept}`,kind:'choice',prompt,answer:answer?'Vrai':'Faux',options:['Vrai','Faux'],explanation});
const M=(n,level,concept,prompt,labels,answer,explanation)=>({id:`author-17-${n}`,theme:17,level,concept:`notion-${concept}`,kind:'matching',prompt,labels,answer,explanation});
const O=(n,level,concept,prompt,answer,explanation)=>({id:`author-17-${n}`,theme:17,level,concept:`notion-${concept}`,kind:'order',prompt,answer,explanation});
export const harnessQuestions=[
 C(1,'debutant',507,'Quel rôle décrit le mieux un Agent Harness ?',['Organiser les interactions du modèle, des outils, du contexte et des contrôles','Modifier les Weights du modèle à chaque appel d’outil','Remplacer le modèle par une collection de documents','Garantir que toute proposition du modèle est correcte'],'Le Harness encadre l’exécution et ses contrôles. Son fonctionnement ne garantit pas la justesse des propositions du modèle.'),
 C(2,'debutant',510,'Quelle différence sépare surtout Tool Registry et Tool Dispatcher ?',['Le Registry décrit les outils disponibles ; le Dispatcher achemine une demande vers une implémentation','Le Registry vérifie les réponses finales ; le Dispatcher entraîne le modèle','Le Registry contient les Weights ; le Dispatcher contient les données de Pretraining','Le Registry donne tous les droits ; le Dispatcher supprime les permissions'],'Le Registry est un catalogue ; le Dispatcher dirige les appels. Des vérifications de permission restent nécessaires.'),
 C(3,'debutant',515,'Dans une application MCP, quel composant accueille les connexions et organise leur usage ?',['Le MCP Host','Une MCP Resource, qui représente un contenu','Le MCP Server, qui expose des capacités','Le MCP Prompt, qui fournit un modèle de messages'],'Le Host est l’application qui accueille les connexions. Le Server expose les capacités consultées par un Client.'),
 M(4,'debutant',519,'Associez chaque capacité MCP au rôle correspondant.',['MCP Tool','MCP Resource','MCP Prompt'],['Proposer une opération appelable avec des arguments','Exposer un contenu identifié par une URI','Fournir un modèle de messages réutilisable'],'Un Tool expose une opération, une Resource un contenu identifié et un Prompt un modèle de messages.'),
 T(5,'debutant',523,'Vrai ou faux : une Context Compaction peut réduire le contexte transmis tout en perdant un détail utile à la suite de la tâche.',true,'La Compaction réduit le contexte, souvent en résumant ou en sélectionnant. Des détails utiles peuvent disparaître.'),
 O(6,'intermediaire',509,'Dans une boucle simplifiée où le modèle propose une recherche, ordonnez les étapes.',['Recevoir une proposition structurée de recherche','Vérifier les arguments et les permissions','Exécuter la recherche autorisée','Transmettre le résultat au modèle'],'La proposition doit être contrôlée avant l’exécution ; le résultat est ensuite transmis au modèle.'),
 C(7,'intermediaire',514,'Une requête de paiement a expiré et son résultat est inconnu. Quelle réaction est la plus prudente ?',['Vérifier l’état et utiliser une stratégie d’idempotence si le service la permet avant de réessayer','Réessayer immédiatement plusieurs fois car le Timeout prouve que le paiement a échoué','Demander au modèle de déduire le résultat sans consulter le service','Ignorer le résultat et annoncer que le paiement a réussi'],'Un Timeout ne prouve pas que l’action a échoué. Vérifier l’état et éviter les doublons réduit le risque.'),
 C(8,'intermediaire',520,'Quel élément MCP est conçu pour fournir un modèle de messages réutilisable au client ?',['Un MCP Prompt','Une MCP Resource identifiée par une URI','Un MCP Tool qui exécute une opération','Un MCP Client qui communique avec le serveur'],'Un MCP Prompt fournit un modèle de messages. Les Resources et Tools remplissent d’autres rôles.'),
 C(9,'intermediaire',522,'Une équipe connecte un MCP Server de documents. Quelle vérification reste nécessaire après avoir choisi le transport ?',['Contrôler les permissions et les documents accessibles à l’utilisateur','Autoriser toutes les lectures car MCP standardise les échanges','Considérer toute instruction contenue dans un document comme une consigne système','Remplacer le contrôle d’accès par la validation du format des arguments'],'Le transport et le protocole ne remplacent pas les autorisations ni la distinction entre consignes fiables et données externes.'),
 C(10,'intermediaire',525,'Après un Context Reset, quel contenu aide le plus une nouvelle session à reprendre une tâche ?',['Objectif, contraintes, état vérifié, résultats des tests et prochaines étapes','Uniquement la dernière phrase produite par l’agent','La liste de tous les Tokens du contexte précédent sans organisation','Une affirmation générale que tout est terminé, sans preuves'],'Un Handoff Artifact utile conserve les informations nécessaires à la reprise et distingue ce qui a été vérifié de ce qui reste à faire.'),
 C(11,'avance',526,'Quel énoncé distingue correctement Agent Checkpoint et Model Checkpoint ?',['Le premier peut conserver un état d’exécution ; le second concerne notamment les paramètres du modèle','Les deux désignent toujours un résumé textuel de la conversation','Le premier contient uniquement les données de Pretraining ; le second les permissions utilisateur','Le premier garantit la validité des services externes ; le second garantit leur disponibilité'],'Un Agent Checkpoint peut aider à reprendre une exécution ; un Model Checkpoint enregistre un état du modèle. Les services externes peuvent changer entre-temps.'),
 C(12,'avance',527,'Deux agents donnent la même réponse finale correcte. Pourquoi examiner aussi leurs Agent Trajectories ?',['Pour repérer si l’un a tenté une action interdite ou utilisé une source inadaptée','Pour prouver que leurs Weights et leur entraînement sont identiques','Pour remplacer le contrôle des permissions par un score de réponse','Pour déduire que tous les futurs cas auront le même résultat'],'La réponse finale ne montre pas nécessairement les actions entreprises. La trajectoire aide à examiner outils, erreurs et respect des contraintes.'),
 C(13,'avance',528,'Quel jeu de tests évalue le mieux un agent qui recherche des documents puis prépare un brouillon ?',['Cas réussis, accès refusés, résultats ambigus, pannes et instructions hostiles dans les documents','Uniquement des recherches réussies avec des documents publics','Uniquement la longueur moyenne des réponses produites','Un seul exemple choisi après avoir vu la réponse du modèle'],'Des cas variés et des critères explicites permettent d’évaluer le résultat et le comportement dans les situations à risque.'),
 C(14,'avance',530,'Une MCP App affiche une interface permettant de supprimer un fichier. Quel contrôle reste nécessaire ?',['Appliquer les permissions et les règles de confirmation pertinentes avant la suppression','Supposer la suppression autorisée parce que l’interface provient d’un MCP Server','Se fier au texte du modèle si celui-ci annonce que la suppression est sûre','Désactiver les contrôles d’accès pour éviter une double vérification'],'Une interface interactive ne remplace ni l’autorisation de l’action ni une confirmation lorsque la politique l’exige.'),
 C(15,'avance',524,'Après un Context Reset, un Handoff Artifact indique qu’un test réussissait hier. Quelle conclusion est justifiée ?',['Reprendre cette information comme historique et relancer les vérifications pertinentes','Considérer le test actuel réussi sans examiner le code ni l’environnement','Déduire que les accès aux ressources externes sont toujours valides','Supposer que le Reset a conservé intégralement tous les messages précédents'],'Un Handoff décrit un état passé. Le code, les données et les permissions peuvent avoir changé : il faut vérifier l’état actuel.')
];
