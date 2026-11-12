// Métadonnées légères : le contenu des exercices reste chargé avec la rubrique.
export const workshopCatalog=[
 {
  "id": "choisir-les-fichiers",
  "title": "Choisir les bons fichiers",
  "description": "Préparez les composants d’un assistant capable de lire des images.",
  "type": "Sélection de fichiers",
  "level": "Accessible"
 },
 {
  "id": "budget-memoire",
  "title": "Faire tenir un service en mémoire",
  "description": "Ajustez les poids et le cache sans sacrifier la qualité ni les besoins des utilisateurs.",
  "type": "Simulation de budget",
  "level": "Technique"
 },
 {
  "id": "fidelite-et-qualite",
  "title": "Choisir au-delà du score",
  "description": "Comparez des modèles et leurs versions quantifiées avec des contraintes concrètes.",
  "type": "Comparaison",
  "level": "Accessible"
 },
 {
  "id": "performance-durable",
  "title": "Comprendre un ralentissement",
  "description": "Lisez des mesures, testez une hypothèse et distinguez un pic de débit d’une performance durable.",
  "type": "Diagnostic",
  "level": "Technique"
 },
 {
  "id": "changer-environnement",
  "title": "Préparer une migration",
  "description": "Construisez un plan de validation pour passer d’un poste avec GPU à une machine virtuelle.",
  "type": "Plan de déploiement",
  "level": "Technique"
 },
 {
  "id": "masquer-attention",
  "title": "Tracer les connexions d’attention",
  "description": "Autorisez les bonnes positions et observez comment leurs contributions se combinent.",
  "type": "Carte de connexions",
  "level": "Intermédiaire"
 },
 {
  "id": "router-experts",
  "title": "Router les bons experts",
  "description": "Appliquez un routage Top-2 et distinguez paramètres actifs et paramètres stockés.",
  "type": "Routage interactif",
  "level": "Intermédiaire"
 },
 {
  "id": "composer-contexte",
  "title": "Composer une fenêtre de contexte",
  "description": "Gardez les informations décisives tout en réservant assez de place pour la réponse.",
  "type": "Budget de tokens",
  "level": "Accessible"
 },
 {
  "id": "comparer-filtres",
  "title": "Choisir un filtre selon ses erreurs",
  "description": "Calculez précision et rappel, puis voyez comment le coût des erreurs change la décision.",
  "type": "Comparaison chiffrée",
  "level": "Intermédiaire"
 },
 {
  "id": "composer-une-chaine",
  "title": "Attribuer le bon rôle à chaque modèle",
  "description": "Composez un assistant documentaire et repérez le composant responsable d’une source manquante.",
  "type": "Conception de système",
  "level": "Accessible"
 },
 {
  "id": "entrainement-et-generalisation",
  "title": "Lire les signes d’un apprentissage fragile",
  "description": "Préparez une séparation des données et choisissez un checkpoint à partir de mesures comparables.",
  "type": "Diagnostic d’entraînement",
  "level": "Technique"
 },
 {
  "id": "choisir-une-adaptation",
  "title": "Choisir comment améliorer un assistant",
  "description": "Distinguez un manque d’information, une consigne insuffisante et un comportement à apprendre.",
  "type": "Plan d’amélioration",
  "level": "Accessible"
 },
 {
  "id": "assembler-des-preuves",
  "title": "Construire une réponse avec ses preuves",
  "description": "Conservez une règle et son exception, puis reconnaissez ce que les documents ne permettent pas de conclure.",
  "type": "Enquête documentaire",
  "level": "Accessible"
 },
 {
  "id": "valider-une-extraction",
  "title": "Contrôler une extraction structurée",
  "description": "Vérifiez le format, le sens des valeurs et la conduite à tenir lorsqu’une information manque.",
  "type": "Validation de données",
  "level": "Accessible"
 },
 {
  "id": "reprendre-un-agent",
  "title": "Reprendre un agent sans doubler une action",
  "description": "Examinez un journal d’outils, retrouvez un résultat incertain et arrêtez la boucle au bon moment.",
  "type": "Analyse de trajectoire",
  "level": "Intermédiaire"
 },
 {
  "id": "contenir-une-injection",
  "title": "Garder une source à sa place",
  "description": "Répondez à partir d’un document sans lui laisser décider des actions de l’assistant.",
  "type": "Contrôle des actions",
  "level": "Intermédiaire"
 },
 {
  "id": "verifier-une-extraction",
  "title": "Vérifier ce que l’image permet de dire",
  "description": "Distinguez une lecture vérifiable, une mauvaise zone et un détail qui reste illisible.",
  "type": "Vérification multimodale",
  "level": "Accessible"
 },
 {
  "id": "verifier-les-droits",
  "title": "Choisir un modèle avec ses documents",
  "description": "Croisez droits d’usage, exécution hors ligne et limites de la fiche du modèle pour préparer un pilote.",
  "type": "Dossier de décision",
  "level": "Accessible"
 }
];
export const findWorkshop=id=>workshopCatalog.find(item=>item.id===id);
