# Atlas IA

Site pédagogique en français sur l’IA, les LLM et les agents : 571 notions, 18 thèmes, 54 leçons, des schémas, des quiz et des flashcards. Le contenu et la progression fonctionnent sans compte ni serveur applicatif.

## Utilisation

L’accueil, les thèmes, les parcours, le glossaire, les notions, les schémas et les distinctions utilisent la largeur disponible avec des marges latérales communes.

L’interface privilégie le parcours et la lecture : les pages de thème affichent les trois leçons avant les ressources complémentaires, les cours suivent une colonne de lecture et les distinctions s’ouvrent à la demande. Le glossaire garde la recherche et le thème visibles ; « Plus de filtres » regroupe le niveau, le tri et les notions essentielles, avec un rappel des choix actifs. Les filtres et la page sont conservés lors du retour depuis une fiche.

- Le glossaire permet de chercher dans les 571 notions, avec 24 fiches affichées par page pour garder une navigation fluide. Les 571 notions disposent d’une explication, d’un exemple illustratif et d’un point de vigilance. Les 82 notions prioritaires gardent leur statut. Dans les cours en mode « Approfondi », chaque notion propose son approfondissement repliable ; le mode « Essentiel » conserve les définitions courtes.
- Les 18 thèmes suivent un ordre conseillé et restent accessibles librement. Leurs 54 leçons abordent les 571 notions du glossaire, réparties entre les étapes de chaque thème.
- La lecture des 54 leçons est continue : les paragraphes restent visibles, les sections sont séparées par leurs titres et des espaces, sans pagination ni commandes flottantes. Le choix Essentiel / Approfondi est accessible directement en tête de leçon. Les schémas et démonstrations restent aux passages concernés.
- Un atelier dans la leçon sur l’indexation RAG permet de comparer une règle isolée à une règle accompagnée de son exception, avec des réponses préparées et une limite de simulation explicite. Il reste facultatif et ne bloque pas la lecture.
- Chaque leçon propose deux formats : « Essentiel » pour comprendre les mécanismes, « Approfondi » pour les analyses supplémentaires, les cas travaillés et un exercice corrigé. Les durées sont calculées par leçon à partir du texte affiché (160–220 mots/min), avec 1–2 minutes de réflexion et le temps prévu pour l’exercice approfondi. Les fiches repliées et l’exploration libre des démonstrations restent facultatives. Chaque leçon cite ses références primaires.
- L’entrée « Schémas » du menu rassemble les 22 schémas et les 17 démonstrations interactives dans une galerie par thème, avec recherche, filtre et accès à la leçon correspondante.
- Les cours intègrent 22 schémas aux passages concernés : représentations, entraînement, cache, recherche, métriques, MCP et autres mécanismes. Le partage des têtes d’attention apparaît dans le parcours approfondi. Les exemples fictifs et les limites de simplification sont signalés ; les figures restent lisibles en modes clair et sombre. Plusieurs sont aussi réutilisées dans les fiches et quatre distinctions.
- Les fiches du glossaire servent de référence et pointent vers la leçon correspondante. Une fiche ouverte depuis un cours permet de revenir à cette leçon.
- La page « Distinctions » compare 35 paires de notions : elle explique chaque terme, leur différence et, lorsque c’est utile, un exemple et des liens vers les fiches.
- Dans un cours, les flèches gauche et droite passent à la leçon précédente ou suivante. Elles ne marquent pas automatiquement les leçons comme terminées et ne perturbent pas les contrôles des démonstrations.
- Les quiz proposent 386 questions rédigées, filtrables par thème et niveau, dont 108 mises en situation supplémentaires (deux par leçon). Il est possible de revenir à une réponse, de la modifier et de recalculer le score, même après le résultat. En mode Évaluation, les corrections restent masquées jusqu’au résultat ; si le quiz est rouvert ensuite, le site indique que les corrections ont déjà été affichées.
- Les flashcards reprennent les 571 notions, dans les deux sens ou en mélangeant les sens dans une même session ; le sens de chaque carte reste stable après reprise. Des filtres permettent de choisir un thème, les favoris ou les cartes à revoir. Chaque repère « Je connais » ou « À revoir » peut être modifié ; la session et les repères sont enregistrés localement et inclus dans les exports de progression. Les flèches permettent de naviguer entre les cartes et la touche Espace retourne la carte lorsqu’elle est focalisée.
- Les noms des concepts techniques sont présentés en anglais et les explications sont en français.

L’entrée « Parcours » de « Votre espace » ouvre 18 parcours par objectif, répartis entre cinq familles : prendre ses repères, comprendre les modèles, concevoir une application, évaluer et protéger, préparer l’exploitation. Aux parcours généraux s’ajoutent des parcours ciblés sur les contextes longs, les modèles à experts, la recherche documentaire, MCP, la mémoire des agents, l’évaluation, la sécurité, la confidentialité et l’usage local. Le catalogue affiche le niveau, le nombre de leçons et la progression. Sa recherche porte sur les objectifs et les titres des leçons ; elle se combine avec un filtre par famille. Les filtres sont conservés dans l’URL et lors du retour depuis un parcours. Chaque parcours précise ses prérequis et les compétences visées. Les cours restent accessibles librement ; les leçons terminées comptent dans tous les parcours qui les proposent. Les boutons de continuation et les flèches du clavier suivent le parcours choisi, conservé lors du retour depuis une fiche. L’accueil et le catalogue permettent de reprendre le parcours commencé. « Apprendre » donne accès aux parcours. L’entrée « Distinctions » du menu « Votre espace », placée sous « Schémas », donne accès aux comparaisons entre notions.

La recherche accepte plusieurs mots dans n’importe quel ordre, ignore les accents et tolère une faute simple ou une inversion de lettres sur les mots assez longs. Les sigles courts restent exacts. Les résultats privilégient les titres ; les cours associés sont recherchés dans leurs titres et leur contenu et apparaissent dans une liste compacte. Le filtre de thème s’applique aux fiches et aux cours ; les autres filtres concernent les fiches.

Les mises en pratique proposent « Retrouver les passages utiles » : des liens vers les sections de la même leçon qui expliquent les méthodes nécessaires. Un lien permet de revenir à l’exercice, sans ouvrir le corrigé. Les références sont définies dans `practice.support` (`part` et titre exact de section) et vérifiées avec les autres contenus.

## Développement

Node.js 24 et npm sont nécessaires.

```sh
npm ci
npm run dev
npm test
npm run build
```

Le site compilé se trouve dans `dist`. Tous les contenus utilisés par le site sont inclus dans `src` ; la compilation est autonome.

## Mettre à jour les contenus

Les définitions des 16 thèmes initiaux sont éditées directement dans `src/glossary.json`. Les deux thèmes complémentaires sont définis dans `src/extensionHarness.js` et `src/extensionFamilies.js`. Les ajouts du 12 novembre 2026 (notion-621 à notion-640) couvrent notamment Jev, la diffusion de langage, les mémoires neuronales et les protocoles d’agents. Chaque ajout possède un exemple, une limite explicite, une source primaire et un passage dans sa leçon associée. Conserver les identifiants des notions : les cours, les liens et les sauvegardes des utilisateurs en dépendent.

Les approfondissements sont dans `src/priorityContent.js` et `src/notionDetails/theme-*.json`, avec leurs références dans `src/notionDetails/sources-*.json` (consultées les 11 et 12 novembre 2026). Les 54 leçons utilisent les quatre fichiers `src/courseEditorial*.json` ; les comparaisons sont dans `src/distinctions.json`.

Les schémas sont définis dans `src/LearningDiagrams.jsx`, leur présentation dans `src/learning-diagrams.css` et leurs associations aux cours dans `src/learningDiagrams.js`. Lorsqu’une section ou une notion change, actualiser également ses liens et vérifier la couverture avec `npm test`.

Pour les contenus techniques, conserver les sources et la date de consultation, puis relire les affirmations avant publication.

## Aperçu Docker local

```sh
docker compose up --build -d
```

Ouvrir `http://localhost:8080`. Le port est lié à localhost pour permettre l’utilisation d’un reverse proxy existant. Arrêt : `docker compose down`.

## VPS avec domaine public

Installer Docker et le plugin Compose, faire pointer un domaine vers le VPS et rendre les ports 80 et 443 accessibles. Copier `.env.example` vers `.env` et remplacer le domaine par le vôtre, puis lancer :

```sh
docker compose -f compose.production.yaml up --build -d
```

Caddy obtient et renouvelle le certificat HTTPS. Les volumes Docker conservent ses données et sa configuration. Pour consulter les journaux : `docker compose -f compose.production.yaml logs -f`. Après mise à jour des fichiers, relancer la même commande pour reconstruire. Si un serveur occupe déjà les ports 80 ou 443, utiliser le mode local et configurer son reverse proxy vers `127.0.0.1:8080`.

## Hébergement statique

Chaque leçon possède une URL `/cours/:theme/lecons/:etape`. Les anciens liens `/cours/:theme?etape=:etape` restent compatibles et redirigent vers cette adresse.

Le build génère des fichiers HTML pour les fiches, les leçons, les thèmes et les parcours, avec du contenu lisible sans JavaScript, un titre, une description, une URL canonique et les métadonnées Open Graph/Twitter. L’aperçu utilise `public/social-card.png`, dont le dessin source est `public/social-card.svg`. Les métadonnées se mettent aussi à jour lors de la navigation dans l’application. `sitemap.xml` répertorie les pages publiques ; Progression est exclue et marquée `noindex`. Un `robots.txt` est fourni lorsque le site est construit à la racine d’un domaine.

Pour un autre domaine, définir l’URL publique complète avant de construire, par exemple `VITE_SITE_URL=https://atlas.example.com/ npm run build`. La valeur par défaut est `https://liodeus.github.io/atlas.ia/`. Le workflow Pages accepte la variable de dépôt `ATLAS_SITE_URL` ; Compose en production utilise automatiquement `ATLAS_DOMAIN`. Cette URL doit inclure le sous-chemin public éventuel et rester cohérente avec `VITE_BASE_PATH`.

Copier le contenu de `dist` dans la racine web. Le serveur doit servir `index.html` pour les routes de l’application et conserver une vraie erreur 404 pour les fichiers sous `/assets/`. Exemple Nginx :

```nginx
location /assets/ { try_files $uri =404; }
location / { try_files $uri $uri/ /index.html; }
```

Avec Apache, activer `mod_rewrite` et définir le DocumentRoot sur `dist` :

```apache
RewriteEngine On
RewriteRule ^assets/ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

## Sauvegarde

La progression est locale au navigateur. Utiliser « Progression », puis « Exporter » avant de changer d’appareil ou de supprimer les données du navigateur. L’import remplace la progression locale après confirmation. Une sauvegarde illisible ou d’une version inconnue est conservée et peut être exportée avant toute restauration. Conserver une copie de la sauvegarde dans un emplacement personnel.

Les réponses validées et les autres changements de progression sont enregistrés immédiatement. Les saisies en cours dans un quiz sont regroupées pendant 200 ms, puis enregistrées ; elles sont aussi enregistrées lors du rechargement ou de la mise en arrière-plan de la page. Une interruption brutale pendant ces 200 ms peut donc faire perdre la dernière saisie.

## Parcours, révisions et vérifications

L’accueil propose la première leçon ou la dernière leçon commencée si elle n’est pas terminée ; sinon il propose la prochaine leçon non terminée dans l’ordre conseillé. Terminer une leçon indique une étape de lecture, et non une validation de maîtrise. Le quiz d’un thème peut aider à vérifier des acquis.

Les flashcards enregistrent la date de la dernière autoévaluation. La sélection « À réviser aujourd’hui » propose les cartes marquées « À revoir » après un jour et celles marquées « Je connais » après sept jours. Il s’agit d’un rappel indicatif, calculé à l’ouverture du site, sans notification. Les anciennes sauvegardes restent utilisables ; leurs cartes évaluées sans date sont proposées à la révision.

La progression, y compris les dates de révision, reste dans le navigateur. La date du dernier export affichée est propre à cet appareil et indique uniquement qu’un téléchargement a été déclenché. Conserver le fichier téléchargé puis l’importer depuis la page Progression sur le nouvel appareil.

Pour vérifier les parcours dans Chromium :

```sh
npx playwright install chromium
npm run test:browser
npm run build
npm run check:budget
```

Pour utiliser un navigateur Chromium déjà installé, définir `CHROMIUM_PATH` avec son chemin. Le budget contrôle la taille non compressée des fichiers JavaScript initiaux, y compris les modules préchargés ; les fichiers chargés à la demande ne sont pas inclus. La vérification automatisée ne remplace pas une relecture humaine des contenus, un chronométrage auprès de débutants ou une évaluation avec lecteur d’écran.

Pour les contenus évolutifs, noter les sources et leur date de consultation, comparer régulièrement les affirmations aux documents d’origine et faire relire tout changement technique. Après toute mise à jour du contenu ou des dépendances, lancer les tests, la construction et les parcours navigateur ; contrôler aussi manuellement les exemples qui dépendent de versions ou de licences.

Dans un quiz, « À revoir » et « À approfondir » enregistrent la question. Sa notion associée reste accessible depuis la correction ; elle peut être enregistrée séparément depuis sa fiche ou une flashcard. Les réglages de thème, niveau, nombre de questions et mode sont disponibles directement avant de commencer. Les flashcards et les fiches proposent les mêmes choix pour les notions. Les choix des questions et des notions restent indépendants. Un nouveau clic sur le repère actif le retire ; ces repères sont distincts des réponses et de l’autoévaluation des flashcards. La page Progression les rassemble et permet de relancer un quiz sur les questions enregistrées. Ils sont inclus dans l’export de progression.

Une session de quiz inachevée demande une confirmation avant son remplacement. Les nouveaux résultats conservent le contexte et les corrections ; les anciens résultats sans ces données restent lisibles. La position de lecture est mémorisée localement sur cet appareil et n’est pas incluse dans l’export. Les rappels de révision sont indicatifs ; ils ne démontrent pas la maîtrise d’une notion.

## Déployer sur GitHub Pages

Le dépôt contient le workflow [GitHub Pages](.github/workflows/pages.yml). Il construit le site pour le sous-chemin du dépôt, vérifie les tests et les liens directs, puis publie `dist` lors d’un envoi sur `main` ou d’un lancement manuel du workflow.

1. Envoyer le contenu du dépôt sur GitHub, sur la branche `main` :

   ```sh
   git add .
   git commit -m "Ajouter Atlas IA"
   git push -u origin main
   ```
2. Dans le dépôt GitHub, ouvrir **Settings → Pages → Build and deployment → Source**, puis choisir **GitHub Actions**.
3. Si nécessaire, ouvrir l’onglet **Actions** et lancer « Déployer sur GitHub Pages » avec **Run workflow**. Attendre la réussite des étapes de construction et de déploiement.
4. Pour ce dépôt, l’adresse attendue est `https://liodeus.github.io/atlas.ia/`. L’adresse officielle est également affichée dans le résultat du déploiement et dans les paramètres Pages.

Pour contrôler localement la construction prévue pour Pages :

```sh
npm ci
npx playwright install chromium
npm test
npm run build:pages
npm run check:budget
npm run test:pages
```

Les liens directs des fiches, leçons, thèmes et parcours sont servis par leurs fichiers HTML, sans détour par une erreur 404. Les anciennes adresses et les chemins non générés utilisent encore une page `404.html` de secours qui conserve le chemin, les paramètres et le fragment ; cette compatibilité nécessite JavaScript. La progression reste locale au navigateur : un export est nécessaire pour la transférer ou la sauvegarder. Ne pas placer de secrets ou de sauvegardes personnelles dans un dépôt public.

`VITE_BASE_PATH` permet de construire pour un autre chemin de déploiement, par exemple `VITE_BASE_PATH=/nom-du-depot/ npm run build`. Pour un domaine personnalisé servi à la racine, configurer le domaine dans les paramètres GitHub Pages et créer la variable de dépôt **Settings → Secrets and variables → Actions → Variables → New repository variable** : `ATLAS_BASE_PATH` avec la valeur `/`. Relancer ensuite le workflow Pages. Sans cette variable, le workflow utilise le sous-chemin du dépôt.

Les titres des cours et de leurs sections restent courts. Dans le texte des cours et fiches, les abréviations reconnues sont développées à leur première occurrence dans un passage, par exemple « TTFT (Time To First Token) ». Les réponses des flashcards inversées ne sont pas développées à l’avance afin de ne pas dévoiler la notion.
