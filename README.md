# Atlas IA

Site pédagogique en français sur l’IA, les LLM et les agents. Les 506 définitions initiales proviennent du glossaire fourni. Deux modules complémentaires, Agent Harness & Tooling et Model Families, ajoutent 45 notions issues de sources officielles consultées le 9 novembre 2026. La couverture évolue et ne prétend pas être exhaustive. Le contenu, les quiz et la progression fonctionnent sans compte ni serveur applicatif.

## Utilisation

- Le glossaire permet de chercher dans les 551 notions, avec 24 fiches affichées par page pour garder une navigation fluide. Les 82 notions prioritaires disposent d’une explication, d’un exemple et d’un point de vigilance. Les autres fiches présentent un extrait pertinent de leur leçon et donnent accès au cours correspondant.
- Les 18 thèmes suivent un ordre conseillé et restent accessibles librement. Leurs 54 leçons abordent les 551 notions du glossaire, réparties entre les étapes de chaque thème.
- Chaque leçon propose deux profondeurs : « Essentiel » (5 à 10 minutes indicatives) et « Approfondi » (10 à 20 minutes indicatives). Les deux présentent les mêmes notions ; la version approfondie ajoute des explications, des cas guidés et des exemples. Le choix est conservé dans le navigateur.
- Les fiches du glossaire servent de référence et pointent vers la leçon correspondante. Une fiche ouverte depuis un cours permet de revenir à cette leçon.
- La page « Distinctions » compare 35 paires de notions : elle explique chaque terme, leur différence et, lorsque c’est utile, un exemple et des liens vers les fiches.
- Dans un cours, les flèches gauche et droite passent à la leçon précédente ou suivante. Elles ne marquent pas automatiquement les leçons comme terminées et ne perturbent pas les contrôles des démonstrations.
- Les quiz proposent 278 questions rédigées, filtrables par thème et niveau. Il est possible de revenir à une réponse, de la modifier et de recalculer le score, même après le résultat. En mode Évaluation, les corrections restent masquées jusqu’au résultat ; si le quiz est rouvert ensuite, le site indique que les corrections ont déjà été affichées.
- Les flashcards reprennent les 551 notions, dans les deux sens ou en mélangeant les sens dans une même session ; le sens de chaque carte reste stable après reprise. Des filtres permettent de choisir un thème, les favoris ou les cartes à revoir. Chaque repère « Je connais » ou « À revoir » peut être modifié ; la session et les repères sont enregistrés localement et inclus dans les exports de progression. Les flèches permettent de naviguer entre les cartes et la touche Espace retourne la carte lorsqu’elle est focalisée.
- Les noms des concepts techniques sont présentés en anglais et les explications sont en français.

## Développement

Node.js 24 et npm sont nécessaires.

```sh
npm ci
npm run dev
npm test
npm run build
```

Le site compilé se trouve dans `dist`. Les données converties sont incluses dans `src/glossary.json` pour que la construction Docker reste autonome.

## Mettre à jour les contenus

`npm run import` lit `glossaire_ia_llm_exhaustif.md` et met à jour uniquement `src/glossary.json`. Les nouvelles définitions du Markdown sont importées ; les identifiants existants sont conservés. Le fichier source contient une seconde définition de Pruning accolée à Weight-Only Quantization : l’import retire cette mention de la définition de Weight-Only. La première entrée Pruning reste accessible dans le thème MoE.

Les corrections relues sont dans `src/glossaryCorrections.json` : chaque entrée conserve le nom attendu, la définition source relue et sa correction. Si cette définition source change, l’import s’arrête avant toute écriture au lieu de masquer la modification. Relire alors la nouvelle source, actualiser `sourceDefinition` et `definition`, puis relancer l’import. Si le Markdown adopte directement la correction existante, l’import l’accepte. Pour apporter une nouvelle correction, ajouter une entrée dans ce fichier plutôt que modifier seulement le JSON généré.

Les comparaisons de `src/distinctions.json`, les fiches de `src/priorityContent.js` et les leçons `src/courseEditorial*.json` et les modules `src/extensionHarness.js` et `src/extensionFamilies.js` sont des contenus rédigés séparément. Les ajouts sont agrégés dans `src/themes.js` et `src/allQuestions.js`. L’import les conserve sans modification et l’annonce explicitement. La section historique « 12 distinctions » du Markdown ne fait plus autorité : modifier les comparaisons directement dans `src/distinctions.json`. Les paragraphes présentés dans les fiches proviennent des leçons communes via `src/notionLearningLinks.js`, sans génération de nouveaux exemples.

Pour ajouter, retirer ou renommer une notion, mettre également à jour sa répartition dans les cours et ses liens. L’import refuse une disparition d’identifiant ou une couverture différente de 16 thèmes et 506 notions tant que les contrôles correspondants n’ont pas été adaptés explicitement. Après une modification, exécuter `npm test` et `npm run build`.

Les corrections techniques s’appuient notamment sur [Attention Is All You Need](https://arxiv.org/abs/1706.03762), [Switch Transformers](https://arxiv.org/abs/2101.03961), [Evaluating Large Language Models Trained on Code](https://arxiv.org/abs/2107.03374) et le chapitre [Autoencoders de Deep Learning](https://www.deeplearningbook.org/contents/autoencoders.html).

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

Les liens directs et les rechargements utilisent une page `404.html` de secours qui redirige vers l’application en conservant le chemin, les paramètres et le fragment. La requête initiale d’un lien profond reçoit donc une réponse HTTP 404 avant la redirection ; JavaScript doit être activé. La progression reste locale au navigateur : un export est nécessaire pour la transférer ou la sauvegarder. Ne pas placer de secrets ou de sauvegardes personnelles dans un dépôt public.

`VITE_BASE_PATH` permet de construire pour un autre chemin de déploiement, par exemple `VITE_BASE_PATH=/nom-du-depot/ npm run build`. Pour un domaine personnalisé servi à la racine, configurer le domaine dans les paramètres GitHub Pages et créer la variable de dépôt **Settings → Secrets and variables → Actions → Variables → New repository variable** : `ATLAS_BASE_PATH` avec la valeur `/`. Relancer ensuite le workflow Pages. Sans cette variable, le workflow utilise le sous-chemin du dépôt.

Dans les cours et fiches, les abréviations reconnues sont développées à leur première occurrence dans un passage, par exemple « TTFT (Time To First Token) ». Les réponses des flashcards inversées ne sont pas développées à l’avance afin de ne pas dévoiler la notion.
