// Textes d’accompagnement des deux modules ajoutés au glossaire d’origine.
export const extendedLessons=[
 ['Agent Harness & Tooling','Un Agent Harness encadre le modèle, les outils et leur exécution. Il organise la boucle et applique les contrôles de l’application.','MCP organise les échanges entre un Host, ses Clients et les Servers. Tools, Resources et Prompts offrent des capacités différentes.','Pour les tâches longues, préservez les informations utiles entre sessions, évaluez les trajectoires et limitez les permissions des outils.'],
 ['Model Families','Les noms de familles désignent des ensembles de modèles et de variantes. Les produits, services et versions ne sont pas interchangeables.','Les fournisseurs proposent des familles aux usages variés. Vérifiez les modalités, l’accès et les conditions de chaque version.','Choisissez un modèle à partir de votre tâche, de vos contraintes et de tests représentatifs, pas uniquement de son nom.']
];
export const extendedDemoOptions=[
 [['MCP Host','L’application accueille les connexions et contrôle leur usage.'],['MCP Client','Le Client communique avec un Server.'],['MCP Server','Le Server expose des capacités comme Tools, Resources et Prompts.']],
 [['Famille','Un nom regroupe plusieurs modèles ou variantes.'],['Variante','Une version précise possède ses propres capacités et conditions.'],['Service','Une API ou une application donne accès à certains modèles selon ses propres règles.']]
];
export const extendedTitles=[
 ['Agent Harness, boucle et outils','MCP : Host, Client, Server et capacités','Tâches longues, permissions et Agent Evals'],
 ['Reconnaître les grandes familles de modèles','Modèles spécialisés et variantes','Choisir et vérifier un modèle pour son usage']
];
export const extendedPrerequisites=[
 [{theme:11,step:2,reason:'Comprendre les échanges entre modèle, outils et application.'},{theme:13,step:2,reason:'Identifier les frontières de confiance avant de connecter des outils.'}],
 [{theme:1,step:3,reason:'Distinguer les types de modèles et les tâches auxquelles ils répondent.'},{theme:16,step:2,reason:'Comprendre les licences et les fiches avant de comparer des modèles.'}]
];
const e=(example,question,answer)=>({example,question,answer});
export const extendedExtras=[
 [
 e('Un assistant propose une recherche de facture. Le Harness vérifie les arguments et les droits avant de lancer l’outil.','Une proposition de Tool Call suffit-elle à autoriser la recherche ?','Non. L’application doit vérifier les droits et les paramètres avant l’exécution.'),
 e('Une application connecte un MCP Client à un Server qui expose une recherche et des documents accessibles.','Le fait de parler MCP autorise-t-il automatiquement tous les accès aux documents ?','Non. Les permissions et les règles de confiance restent à appliquer séparément.'),
 e('Après une interruption, une nouvelle session consulte un état enregistré, puis vérifie que les fichiers et les accès sont toujours valides.','Un résumé de session garantit-il que les données externes sont restées identiques ?','Non. Le résumé décrit un état antérieur et les ressources externes peuvent avoir changé.')
 ],
 [
 e('Une équipe compare plusieurs familles et sélectionne une version précise selon sa tâche et les modalités nécessaires.','Deux variantes portant un nom de famille commun ont-elles nécessairement les mêmes capacités ?','Non. Les capacités et les conditions dépendent de la version et du service.'),
 e('Une application cherche un modèle adapté à la représentation de documents et examine les fiches des versions disponibles.','Un modèle de génération et un Embedding Model remplissent-ils nécessairement le même rôle ?','Non. Ils répondent à des besoins différents et doivent être évalués sur la tâche réelle.'),
 e('Avant un déploiement, une équipe vérifie la documentation, la licence, les coûts et les résultats sur ses propres cas.','Le seul nom de la famille suffit-il à confirmer le droit de déploiement ?','Non. Il faut lire les conditions applicables à la version et au mode de déploiement.')
 ]
];
export const extendedSources=[['Documentation officielle MCP','https://modelcontextprotocol.io/specification/2026-07-28'],['Documentation des modèles Gemini','https://ai.google.dev/gemini-api/docs/models']];
