const support=(theme,step,part,heading)=>({theme,step,part,heading});
const option=(value,label,feedback)=>({value,label,feedback});

export const applicationCatalog=[
 {id:'composer-une-chaine',title:'Attribuer le bon rôle à chaque modèle',description:'Composez un assistant documentaire et repérez le composant responsable d’une source manquante.',type:'Conception de système',level:'Accessible'},
 {id:'entrainement-et-generalisation',title:'Lire les signes d’un apprentissage fragile',description:'Préparez une séparation des données et choisissez un checkpoint à partir de mesures comparables.',type:'Diagnostic d’entraînement',level:'Technique'},
 {id:'choisir-une-adaptation',title:'Choisir comment améliorer un assistant',description:'Distinguez un manque d’information, une consigne insuffisante et un comportement à apprendre.',type:'Plan d’amélioration',level:'Accessible'},
 {id:'assembler-des-preuves',title:'Construire une réponse avec ses preuves',description:'Conservez une règle et son exception, puis reconnaissez ce que les documents ne permettent pas de conclure.',type:'Enquête documentaire',level:'Accessible'},
 {id:'valider-une-extraction',title:'Contrôler une extraction structurée',description:'Vérifiez le format, le sens des valeurs et la conduite à tenir lorsqu’une information manque.',type:'Validation de données',level:'Accessible'}
];

export const applicationContent={
 'composer-une-chaine':{
  followUp:{
    "title": "Localiser la prochaine amélioration",
    "scenario": "La bibliothèque dispose maintenant d’un index vérifié. Sur un nouveau lot de 20 questions, chaque réponse attendue possède un passage de référence identifié. Examinez les résultats de la chaîne et d’un essai contrôlé, indépendamment de votre premier diagnostic.",
    "facts": [
      "Les 20 questions et les critères de correction sont identiques dans tous les essais ci-dessous. Une réponse est comptée comme réussie seulement si elle est correcte et soutenue par son passage.",
      "Dans l’essai contrôlé, on remplace seulement les passages récupérés par le passage de référence de chaque question. Le générateur, la consigne et les critères restent inchangés : il produit alors 17 réponses réussies sur 20."
    ],
    "table": {
      "caption": "Présence de la preuve et réussite sur les mêmes 20 questions",
      "headers": [
        "Étape de la chaîne initiale",
        "Nombre de questions concernées"
      ],
      "rows": [
        [
          "Passage attendu dans les 30 candidats",
          "18 sur 20"
        ],
        [
          "Passage attendu dans les trois passages sélectionnés",
          "13 sur 20"
        ],
        [
          "Réponse correcte et soutenue par sa source",
          "11 sur 20"
        ]
      ]
    },
    "questions": [
      {
        "id": "next-selection-loss",
        "kind": "number",
        "label": "Pour combien de questions le passage attendu était-il présent parmi les candidats, mais perdu lors du reclassement et de la sélection ?",
        "answer": 5,
        "tolerance": 0,
        "unit": "questions",
        "feedback": "Le passage était présent pour 18 questions et reste sélectionné pour 13 : 18 − 13 = 5 questions. Les deux passages absents dès la récupération relèvent d’un autre défaut."
      },
      {
        "id": "next-oracle",
        "label": "Que permet de conclure l’essai avec les passages de référence ?",
        "answer": "both",
        "options": [
          {
            "value": "both",
            "label": "L’essai suggère une limite dans la recherche ou la sélection, et le générateur échoue encore sur trois cas même avec la bonne preuve.",
            "feedback": "Le gain de 11 à 17 réussites en ne changeant que les passages soutient l’hypothèse d’une limite en amont de la rédaction. Les trois échecs restants demandent aussi d’examiner l’exploitation des preuves. Répéter l’essai aide à vérifier que le gain ne dépend pas seulement de la variabilité des générations."
          },
          {
            "value": "retrieval-only",
            "label": "Tous les échecs viennent de la recherche : un meilleur index garantira 20 réponses correctes.",
            "feedback": "Le générateur ne réussit que 17 des 20 cas malgré les passages de référence. Les données ne permettent donc pas d’attribuer tous les échecs à la recherche ni de promettre 20 réussites."
          },
          {
            "value": "generator-only",
            "label": "Le générateur est le seul composant à changer, puisque les documents existaient déjà dans l’archive.",
            "feedback": "La présence dans l’archive ne signifie pas présence dans le contexte final. Le gain obtenu en remplaçant seulement les passages montre que leur récupération et leur sélection comptent aussi."
          }
        ]
      },
      {
        "id": "next-comparison",
        "label": "Vous comparez deux Rerankers. Quelles précautions permettent d’attribuer un éventuel gain à ce changement ? Sélectionnez les deux précautions utiles.",
        "answer": [
          "same-candidates",
          "measure-selection"
        ],
        "options": [
          {
            "value": "same-candidates",
            "label": "Fournir aux deux Rerankers les mêmes questions et les mêmes listes de 30 candidats.",
            "feedback": "Des entrées communes permettent d’observer ce que change le reclassement. Modifier aussi les candidats empêcherait de séparer l’effet de la recherche de celui du Reranker."
          },
          {
            "value": "measure-selection",
            "label": "Mesurer la présence du passage attendu dans les trois résultats retenus, puis la fidélité des réponses finales.",
            "feedback": "Le premier contrôle mesure la sélection ; le second vérifie si le gain se traduit dans la réponse. Le score final seul ne localise pas les pertes de preuve."
          },
          {
            "value": "change-all",
            "label": "Changer l’index et le générateur en même temps que le Reranker pour attribuer le gain au nouveau classement.",
            "feedback": "Plusieurs changements simultanés peuvent améliorer le système, mais ce protocole ne permet pas d’attribuer le gain au seul Reranker."
          },
          {
            "value": "length",
            "label": "Retenir le Reranker qui conduit aux réponses les plus longues, sans revoir les sources.",
            "feedback": "La longueur ne mesure ni la présence de la preuve attendue ni son utilisation correcte. Elle ne fournit pas le critère de comparaison demandé."
          }
        ],
        "multiple": true
      }
    ]
  },
  scenario:'Une bibliothèque veut répondre à des questions formulées librement sur ses notices numériques. Vous devez proposer une chaîne qui retrouve des passages, reclasse les candidats et rédige une réponse appuyée sur les documents retenus.',
  facts:[
   'Les documents sont des textes, et l’application peut stocker leurs vecteurs dans un index. Aucun traitement d’image ni aucune action physique n’est demandé.',
   'La première recherche doit proposer 30 passages candidats. Un second composant doit examiner plus finement les paires question-passage et conserver les trois meilleurs.',
   'La réponse finale doit citer les passages réellement utilisés et reconnaître l’absence d’information lorsque les documents ne suffisent pas.'
  ],
  questions:[
   {id:'chain',label:'Quelle organisation attribue un rôle adapté à chacune des trois étapes ?',answer:'roles',options:[
    option('roles','Embedding Model et index pour rechercher ; Reranker pour reclasser ; modèle génératif pour rédiger avec les passages retenus.','Cette chaîne sépare la représentation utilisée pour rechercher, l’examen des candidats et la rédaction. Il reste à tester la récupération, le classement et la fidélité de la réponse : aucun composant ne garantit à lui seul la justesse.'),
    option('generate-first','Modèle génératif pour répondre de mémoire ; Embedding Model pour chercher ensuite une notice ressemblant à la réponse.','Chercher une notice après une réponse produite de mémoire risque de lui associer une citation qui ne la soutient pas. La mission demande de construire la réponse à partir des passages retenus.'),
    option('rerank-all','Reranker sur les 30 premiers fichiers de l’archive ; Embedding Model pour rédiger la réponse.','Les 30 premiers fichiers ne sont pas nécessairement les bons candidats. Surtout, un Embedding Model fournit des représentations : ce rôle ne remplace pas la rédaction d’une réponse.')
   ]},
   {id:'diagnosis',label:'Lors d’un essai, la notice requise existe dans l’archive, mais elle est absente des 30 candidats. Quel contrôle vient en premier ?',answer:'retrieval',options:[
    option('generation','Demander au générateur de répondre plus longuement avec les trois passages sélectionnés.','Une réponse plus longue ne fait pas apparaître la notice qui n’a jamais été transmise. Il faut d’abord comprendre pourquoi la recherche l’a manquée.'),
    option('retrieval','Vérifier que la notice a été indexée, puis examiner le découpage, les filtres et la recherche des candidats.','L’absence se produit avant le reclassement. Le contrôle doit remonter à la présence de la notice dans l’index et aux étapes qui construisent les candidats.'),
    option('reranker','Remplacer uniquement le Reranker par un modèle plus coûteux.','Un Reranker qui ne reçoit que ces 30 candidats ne peut pas sélectionner une notice absente. Améliorer son classement ne corrige pas ce manque de récupération.')
   ]}
  ],
  support:[support(1,3,'sections','Produire, représenter et reclasser'),support(1,3,'deepDive','Construire une chaîne documentaire vérifiable')],
  takeaway:'Attribuez une fonction observable à chaque composant. Lors d’un échec, suivez le passage nécessaire depuis l’archive jusqu’à la réponse pour corriger l’étape qui l’a perdu.'
 },
 'entrainement-et-generalisation':{
  followUp:{
    "title": "Vérifier ce qui a réellement changé",
    "scenario": "Une autre équipe prépare un entraînement distinct. Elle annonce que la Loss de validation est passée de 1,4 à 2,1, puis vous transmet son journal de données. Décidez si la comparaison est interprétable et comment préparer un nouvel essai fiable.",
    "facts": [
      "À la première mesure, la validation contient des incidents courants. À la seconde, elle a été remplacée par des incidents plus difficiles. Le mode de calcul de la Loss reste le même, mais la population évaluée a changé.",
      "Dans le journal ci-dessous, une ligne dérivée conserve le même incident source que l’original. Le résumé K a déjà été utilisé pour mettre à jour les paramètres du modèle.",
      "L’incident L et ses éventuels dérivés n’ont servi ni à entraîner ni à choisir les réglages. Ils peuvent rester réservés pour le jugement final."
    ],
    "table": {
      "caption": "Extrait fictif du journal de provenance",
      "headers": [
        "Élément",
        "Incident source",
        "Ensemble attribué"
      ],
      "rows": [
        [
          "Messages originaux J",
          "J",
          "Training"
        ],
        [
          "Résumé synthétique K",
          "K",
          "Training"
        ],
        [
          "Messages originaux K",
          "K",
          "Validation"
        ],
        [
          "Messages originaux L",
          "L",
          "Test réservé"
        ]
      ]
    },
    "questions": [
      {
        "id": "next-curve",
        "label": "La hausse de 1,4 à 2,1 suffit-elle à attribuer la dégradation à l’Overfitting ?",
        "answer": "comparable",
        "options": [
          {
            "value": "comparable",
            "label": "Non : il faut d’abord réévaluer les checkpoints sur un même ensemble et dans des conditions comparables.",
            "feedback": "La validation plus difficile peut faire augmenter la Loss sans que le modèle se soit davantage adapté au Training. Une comparaison commune est nécessaire avant d’interpréter la variation ; l’audit de provenance reste aussi à traiter."
          },
          {
            "value": "certain",
            "label": "Oui : toute hausse de Loss de validation prouve un Overfitting, même si les exemples ont changé.",
            "feedback": "Le changement de population est un facteur de confusion. La courbe ne sépare pas ici la difficulté des données de l’évolution du modèle."
          },
          {
            "value": "underfit",
            "label": "Oui : une validation plus difficile démontre que le modèle est en Underfitting.",
            "feedback": "La difficulté du nouveau lot ne prouve pas un apprentissage insuffisant. Il faut examiner les mesures comparables et les erreurs, plutôt que déduire le diagnostic de la seule composition du lot."
          }
        ]
      },
      {
        "id": "next-leak",
        "label": "Quelle ligne du Training compromet l’indépendance de la validation indiquée dans ce journal ?",
        "answer": "summary-k",
        "options": [
          {
            "value": "messages-j",
            "label": "Les messages originaux J, parce qu’un modèle ne doit jamais apprendre sur des messages de support.",
            "feedback": "Apprendre sur des incidents de support peut correspondre à la tâche. Dans cet extrait, J n’apparaît pas dans la validation ; ce n’est pas la frontière violée que montre le journal."
          },
          {
            "value": "summary-k",
            "label": "Le résumé synthétique K, car la validation contient les messages du même incident K.",
            "feedback": "Le résumé et les messages portent sur la même situation. Une reformulation synthétique ne rend pas l’incident indépendant de celui déjà rencontré pendant l’apprentissage."
          },
          {
            "value": "no-leak",
            "label": "Aucune ligne : un résumé et des messages originaux sont des textes différents.",
            "feedback": "L’indépendance ne se réduit pas à l’absence de copie exacte. Le résumé transmet de l’information sur l’incident K que la validation est censée garder distinct du Training."
          }
        ]
      },
      {
        "id": "next-repair",
        "label": "Quelle préparation corrige cette fuite pour un nouvel entraînement ?",
        "answer": "rebuild",
        "options": [
          {
            "value": "remove-file",
            "label": "Supprimer le fichier du résumé K du disque et conserver les paramètres déjà entraînés comme s’ils n’avaient jamais vu K.",
            "feedback": "Supprimer un fichier n’efface pas les mises à jour déjà effectuées à partir de son contenu. Ce geste ne rétablit pas à lui seul l’indépendance de l’évaluation de K."
          },
          {
            "value": "rebuild",
            "label": "Reconstruire les ensembles par incident et provenance, puis refaire l’entraînement depuis un état non exposé à la validation ; conserver L réservé.",
            "feedback": "Il faut traiter les originaux et leurs dérivés comme des éléments liés. Repartir d’un état non exposé à la validation permet d’évaluer le nouvel essai sans réutiliser le modèle déjà contaminé ; L conserve son rôle de test final dans les conditions données."
          },
          {
            "value": "relocate",
            "label": "Déplacer le résumé K dans le Test, tout en gardant les messages K dans la validation et les paramètres actuels.",
            "feedback": "Changer l’étiquette du fichier ne supprime pas son utilisation passée pendant l’apprentissage. Ce déplacement ajoute en plus un élément déjà vu au test au lieu de reconstruire des frontières cohérentes."
          }
        ]
      }
    ]
  },
  scenario:'Vous préparez un modèle de support qui devra traiter de nouveaux incidents chez des clients déjà connus. Chaque incident possède plusieurs messages et parfois un résumé synthétique. Définissez la séparation des données, puis examinez les checkpoints d’un entraînement préparé avec cette séparation.',
  facts:[
   'Un incident et ses messages ou résumés décrivent la même situation. Les répartir entre apprentissage et évaluation exposerait une partie de la situation avant le test.',
   'Les mesures ci-dessous proviennent d’un entraînement avec des incidents disjoints entre Training, validation et test. Les trois checkpoints sont évalués sur les mêmes ensembles fixes et avec le même calcul de Loss, sans pénalité supplémentaire.',
   'Une Loss plus faible est préférable pour cet objectif. La validation sert à choisir un checkpoint ; le test final reste réservé. Les valeurs ne constituent pas une garantie sur tous les futurs incidents.'
  ],
  table:{caption:'Losses fictives mesurées dans des conditions comparables',headers:['Checkpoint','Loss de Training','Loss de validation'],rows:[['A · étape 100','1,80','1,95'],['B · étape 200','1,25','1,48'],['C · étape 300','0,85','1,72']]},
  questions:[
   {id:'split',label:'Quelle préparation protège le mieux l’évaluation de nouveaux incidents dans ce scénario ?',answer:'groups',options:[
    option('messages','Répartir les messages au hasard, puis ajouter les résumés synthétiques dans le Training.','Des messages ou un résumé du même incident pourraient se retrouver des deux côtés. Une reformulation reste liée à sa source et peut faciliter artificiellement l’évaluation.'),
    option('groups','Regrouper chaque incident avec ses messages et dérivés avant de l’affecter à un seul ensemble ; réserver le test pour la fin.','Le regroupement conserve la frontière entre incidents appris et incidents évalués, y compris pour les résumés dérivés. Le jeu de validation permet les choix ; le test réservé estime ensuite le résultat.'),
    option('test-tuning','Faire une séparation par incident, puis choisir tous les réglages sur le test final.','Le regroupement est utile, mais choisir les réglages sur le test lui retire son rôle de jugement final. Utilisez la validation pour ces choix et gardez le test réservé.')
   ]},
   {id:'checkpoint',label:'Selon le critère de validation annoncé, quel checkpoint retenez-vous provisoirement et pourquoi ?',answer:'b',options:[
    option('c','C : sa Loss de Training est la plus basse, donc sa généralisation est forcément meilleure.','C progresse sur le Training, mais sa Loss de validation remonte par rapport à B. Cette divergence est compatible avec de l’Overfitting ; la Loss de Training seule ne départage pas la généralisation.'),
    option('a','A : arrêter le plus tôt possible garantit que le modèle n’apprend pas les détails inutiles.','Un arrêt précoce n’est pas automatiquement optimal. Ici A a une Loss de validation plus élevée que B et ne satisfait pas le critère de sélection annoncé.'),
    option('b','B : sa Loss de validation est la plus faible ; la dégradation observée ensuite invite à examiner la généralisation.','B est le meilleur des trois selon la mesure fixée. La progression du Training et la remontée de la validation à C soutiennent une hypothèse d’Overfitting, sans en faire une preuve universelle. Examinez aussi les erreurs concrètes et la variabilité avant de conclure.')
   ]}
  ],
  support:[support(6,1,'deepDive','Cas suivi : préparer un corpus de support'),support(6,3,'sections','Ce que disent ensemble Training et validation'),support(6,3,'deepDive','Cas suivi : le support s’améliore puis se dégrade')],
  takeaway:'Une courbe n’est interprétable que si le protocole est cohérent et les ensembles correctement séparés. Choisissez sur la validation, conservez un test final et vérifiez ce que les erreurs révèlent sur les cas nouveaux.'
 },
 'choisir-une-adaptation':{
  followUp:{
    "title": "Un gain peut cacher une régression",
    "scenario": "Un autre pilote doit produire des fiches de support au bon format tout en laissant la cause inconnue lorsque les faits ne permettent pas de la confirmer. Un prompt avec exemples et une adaptation supervisée sont évalués sur les mêmes 100 tickets réservés. Choisissez le candidat admissible, puis la cible de l’essai suivant.",
    "facts": [
      "Les seuils ont été fixés avant la comparaison : au moins 95 formats corrects sur 100 et au maximum deux causes inventées parmi les 20 tickets incomplets.",
      "Les 20 tickets incomplets font partie des 100 tickets. Les exemples ayant servi au Fine-tuning sont distincts du jeu évalué. Le protocole et les règles de correction sont identiques pour les deux candidats."
    ],
    "table": {
      "caption": "Résultats fictifs sur deux critères indépendants",
      "headers": [
        "Candidat",
        "Formats corrects / 100",
        "Causes inventées / 20 tickets incomplets"
      ],
      "rows": [
        [
          "Prompt avec exemples",
          "96",
          "1"
        ],
        [
          "Adaptation supervisée",
          "99",
          "6"
        ]
      ]
    },
    "questions": [
      {
        "id": "next-tradeoff",
        "label": "Quel candidat satisfait les deux seuils annoncés ?",
        "answer": "prompt",
        "options": [
          {
            "value": "prompt",
            "label": "Le prompt avec exemples : il respecte le seuil de format et la limite d’invention.",
            "feedback": "Ses 96 formats corrects dépassent le minimum de 95, et une cause inventée reste sous le maximum de deux. L’adaptation améliore le format, mais ses six inventions la rendent inadmissible selon les critères fixés."
          },
          {
            "value": "adapted",
            "label": "L’adaptation supervisée : ses trois formats corrects supplémentaires compensent automatiquement les inventions.",
            "feedback": "Les critères sont deux contraintes distinctes, pas une moyenne où chaque format pourrait compenser une cause inventée. L’adaptation dépasse la limite d’invention annoncée."
          },
          {
            "value": "equal",
            "label": "Les deux candidats : chaque résultat peut être présenté comme supérieur à 95 % sur une métrique choisie.",
            "feedback": "Choisir après coup une métrique favorable ne remplace pas le respect des deux seuils. Il faut aussi examiner les 20 cas incomplets selon le critère défini avant la comparaison."
          }
        ]
      },
      {
        "id": "next-target",
        "label": "Quelle modification cible le défaut observé de l’adaptation sans masquer sa mesure ?",
        "answer": "unknown-examples",
        "options": [
          {
            "value": "unknown-examples",
            "label": "Ajouter des démonstrations de tickets incomplets dont la cause reste inconnue, puis réévaluer format et inventions sur de nouveaux cas réservés.",
            "feedback": "Ces démonstrations enseignent précisément le comportement manquant. La comparaison doit conserver les deux critères et utiliser des cas non ajoutés à l’apprentissage afin de vérifier le gain et les éventuelles régressions."
          },
          {
            "value": "remove-cases",
            "label": "Retirer les tickets incomplets de l’évaluation pour obtenir un jeu plus uniforme.",
            "feedback": "Les tickets incomplets font partie de l’usage visé. Les supprimer de l’évaluation cacherait la régression au lieu de la corriger."
          },
          {
            "value": "vocabulary",
            "label": "Ajouter seulement un grand volume de notices techniques non annotées et déclarer le problème de prudence résolu.",
            "feedback": "Des textes techniques peuvent servir un objectif d’adaptation du vocabulaire, mais ils ne démontrent pas le comportement attendu face à une cause inconnue. Le résultat doit rester à mesurer sur les deux critères."
          }
        ]
      }
    ]
  },
  scenario:'Trois équipes rencontrent des difficultés différentes avec leur assistant. Choisissez pour chacune la prochaine intervention que les observations justifient. Il s’agit de définir un essai adapté, pas de promettre qu’une technique réussira automatiquement.',
  table:{caption:'Observations fictives obtenues sur des cas réservés',headers:['Équipe','Défaut observé','Résultat des essais'],rows:[
   ['A · Mise en forme','Les réponses mélangent diagnostic et action.','Une consigne précise avec trois exemples atteint 97 % de formats corrects, au-dessus du seuil de 95 %, sans régression observée.'],
   ['B · Procédures','Les règles changent chaque semaine.','L’assistant répond correctement lorsque la notice actuelle est fournie ; il se trompe quand il ne l’a pas.'],
   ['C · Classification','Les demandes doivent suivre des catégories stables.','Les faits utiles sont présents et plusieurs prompts clairs ont été comparés. La classification reste à 78 % pour un objectif de 95 %. Des exemples annotés sont disponibles.']
  ]},
  facts:['Chaque équipe dispose d’un protocole de comparaison commun aux essais de son cas. Tout changement ultérieur devra être évalué sur des exemples non utilisés pour l’ajustement.','Pour C, les exemples d’apprentissage et les exemples d’évaluation seront séparés. Les observations rendent un Fine-tuning pertinent à tester ; elles ne démontrent pas qu’il atteindra 95 %.'],
  questions:[
   {id:'format',label:'Équipe A : quelle solution garder comme point de départ ?',answer:'prompt',options:[
    option('prompt','Conserver le prompt avec exemples qui satisfait les critères mesurés, puis surveiller les nouveaux cas.','Les observations montrent déjà un gain suffisant sans changement des paramètres. Ce prompt devient une référence à conserver, avec son évaluation ; une adaptation apprise devrait justifier un bénéfice supplémentaire.'),
    option('training','Lancer un nouvel entraînement uniquement parce qu’un format régulier est demandé.','Une exigence de format ne rend pas l’entraînement obligatoire. Ici une modification de l’entrée satisfait déjà les critères mesurés.'),
    option('retrieval','Ajouter une recherche documentaire, même si tous les faits utiles sont déjà fournis.','Le défaut observé concerne l’organisation de la réponse et a été corrigé par les consignes et exemples. Aucun manque documentaire n’a été établi pour ce cas.')
   ]},
   {id:'freshness',label:'Équipe B : quelle intervention répond d’abord au manque observé ?',answer:'rag',options:[
    option('fine-tune','Réentraîner systématiquement le modèle sur chaque nouvelle notice avant de répondre.','Un apprentissage ne garantit pas l’intégration exacte ni la fraîcheur des règles. Le scénario montre que l’assistant sait déjà répondre lorsqu’il reçoit la notice actuelle.'),
    option('rag','Mettre les notices à jour dans une source versionnée, puis tester leur récupération et leur transmission dans le contexte.','Le besoin porte d’abord sur l’accès à l’information actuelle. Une récupération documentaire permet de fournir cette information, à condition de vérifier la mise à jour de l’index et les passages effectivement transmis.'),
    option('style','Ajouter des exemples de réponses plus longues sans apporter la notice actuelle.','Des exemples de style ne fournissent pas la règle manquante. L’échec reste lié à l’absence de la notice utile dans le contexte.')
   ]},
   {id:'behavior',label:'Équipe C : quel essai est désormais justifié ?',answer:'adapt',options:[
    option('adapt','Tester une adaptation supervisée sur les exemples annotés, contre le meilleur prompt, avec un jeu d’évaluation distinct.','Le comportement stable reste insuffisant malgré les informations et les prompts testés. Une adaptation supervisée est une hypothèse cohérente, à comparer au meilleur prompt et à contrôler pour ses régressions.'),
    option('facts','Ajouter davantage de notices sans modifier ni mesurer le comportement de classification.','Le scénario indique que les faits utiles sont présents. Accumuler des textes ne cible pas directement les catégories attendues et ne remplace pas un essai mesuré.'),
    option('guarantee','Déployer immédiatement un Fine-tuning : des exemples annotés garantissent l’atteinte de 95 %.','Des exemples rendent l’essai possible, sans garantir son résultat. Il faut mesurer la classification sur des cas distincts et contrôler les autres comportements avant tout déploiement.')
   ]}
  ],
  support:[support(7,1,'sections','Une nouvelle entrée ou de nouveaux Parameters ?'),support(7,1,'deepDive','Cas suivi : un assistant connaît les mots mais pas le format'),support(9,3,'sections','Préserver le sens quand le corpus évolue')],
  takeaway:'Partez du défaut observé : information manquante, consigne insuffisante ou comportement persistant. Comparez les solutions sur les mêmes critères ; prompting, récupération et adaptation peuvent aussi se compléter.'
 },
 'assembler-des-preuves':{
  followUp:{
    "title": "La règle la plus récente n’est pas toujours applicable",
    "scenario": "Dans une autre médiathèque, un usager demande le 10 mai 2027 une prolongation pour une tablette Série U non réservée. Il ne précise pas s’il s’agit de sa première prolongation. Utilisez exclusivement le dossier fictif ci-dessous, qui remplace les règles du premier cas pour cette variante.",
    "facts": [
      "Le statut non réservé de la tablette est confirmé. En revanche, son nombre de prolongations antérieures est inconnu.",
      "La date de publication d’un document et sa date d’effet sont deux informations différentes. Une règle future ne s’applique pas avant sa date d’effet.",
      "L’équipe produit aussi des résumés de règles réutilisés pour d’autres demandes : ils doivent conserver les conditions qui peuvent changer la décision."
    ],
    "table": {
      "caption": "Règles fictives et dates d’application",
      "headers": [
        "Passage",
        "Publication et application",
        "Règle"
      ],
      "rows": [
        [
          "P5",
          "Publié le 2 janvier ; applicable du 1er janvier au 31 mai 2027",
          "Le matériel non réservé peut être prolongé de sept jours."
        ],
        [
          "P6",
          "Publié le 20 avril ; applicable à partir du 1er juin 2027",
          "Les tablettes Série U non réservées peuvent être prolongées de quatorze jours."
        ],
        [
          "P7",
          "Applicable pendant toute l’année 2027",
          "La première prolongation est gratuite ; chaque prolongation suivante coûte 2 €."
        ]
      ]
    },
    "questions": [
      {
        "id": "next-effective",
        "label": "Quelle durée pouvez-vous annoncer pour la demande du 10 mai ?",
        "answer": "seven",
        "options": [
          {
            "value": "fourteen",
            "label": "Quatorze jours selon P6, puisqu’il s’agit du document publié le plus récemment.",
            "feedback": "P6 a bien été publié avant la demande, mais son effet commence le 1er juin. La fraîcheur de publication ne le rend pas applicable au 10 mai."
          },
          {
            "value": "seven",
            "label": "Sept jours selon P5, qui s’applique à cette date au matériel non réservé.",
            "feedback": "Le 10 mai se situe dans la période d’application de P5, et la tablette remplit la condition non réservée. La variante plus récente P6 ne prend effet que le mois suivant."
          },
          {
            "value": "unknown",
            "label": "Aucune durée ne peut être établie, car deux documents donnent des durées différentes.",
            "feedback": "Les dates d’effet permettent ici de résoudre la différence. Les deux durées ne sont pas simultanément applicables à la date donnée."
          }
        ]
      },
      {
        "id": "next-compression",
        "label": "Quel résumé de P5 conserve la condition nécessaire pour être réutilisé sur d’autres demandes ?",
        "answer": "conditional",
        "options": [
          {
            "value": "conditional",
            "label": "Du 1er janvier au 31 mai 2027, le matériel peut être prolongé de sept jours s’il n’est pas réservé.",
            "feedback": "Ce résumé conserve la période, la durée et la condition de réservation. Il évite d’appliquer ensuite la règle à un appareil réservé ou à une période différente."
          },
          {
            "value": "unconditional",
            "label": "Jusqu’au 31 mai 2027, tout matériel peut être prolongé de sept jours.",
            "feedback": "Le mot tout fait disparaître la condition non réservé. Le résumé semble fidèle à la durée, mais il élargit les cas autorisés au-delà du passage source."
          },
          {
            "value": "timeless",
            "label": "Le matériel non réservé bénéficie toujours de sept jours de prolongation.",
            "feedback": "La condition de réservation est préservée, mais toujours supprime la limite temporelle. Le résumé pourrait alors contredire une règle applicable à partir de juin."
          }
        ]
      },
      {
        "id": "next-missing-fact",
        "label": "Que faut-il demander avant d’annoncer le tarif de cette prolongation ?",
        "answer": "previous",
        "options": [
          {
            "value": "previous",
            "label": "S’il s’agit de la première prolongation ou d’une prolongation suivante, puis appliquer P7.",
            "feedback": "La règle tarifaire est présente, mais le fait qui décide entre gratuité et 2 € manque encore. La réponse doit demander cette information au lieu de choisir un cas sans preuve."
          },
          {
            "value": "free",
            "label": "Rien : annoncer la gratuité, car aucune prolongation antérieure n’a été mentionnée.",
            "feedback": "Ne pas mentionner une prolongation antérieure ne prouve pas qu’il n’y en a eu aucune. Cette conclusion transformerait une information manquante en confirmation du cas gratuit."
          },
          {
            "value": "date",
            "label": "Rien : utiliser la date de publication de P6 pour déduire que le tarif est de 2 €.",
            "feedback": "La date du changement de durée ne renseigne pas sur l’historique de cet usager. Le tarif de P7 dépend du rang de la prolongation, pas de la publication de P6."
          }
        ]
      }
    ]
  },
  scenario:'Le règlement fictif d’une médiathèque définit les renouvellements de prêts. Un usager demande : « Puis-je renouveler le prêt de ma tablette Série T, déjà réservée par quelqu’un d’autre ? Et le supplément sera-t-il de 5 € ? » Construisez le contexte minimal pertinent et une réponse qui respecte les preuves disponibles.',
  table:{caption:'Passages candidats retrouvés dans le corpus',headers:['Passage','Version et portée','Texte disponible'],rows:[
   ['P1','Règlement actuel · matériel','Les prêts de matériel peuvent être renouvelés une fois pour sept jours.'],
   ['P2','Règlement actuel · exception','Cette possibilité de renouvellement ne s’applique pas aux appareils déjà réservés par un autre usager.'],
   ['P3','Ancien règlement · remplacé','Les tablettes Série T peuvent être renouvelées même lorsqu’une réservation est enregistrée.'],
   ['P4','Règlement actuel · livres','La durée de prêt des livres est de vingt et un jours.']
  ]},
  facts:['La tablette appartient bien au matériel visé par P1 et elle est déjà réservée. Le règlement actuel remplace l’ancien règlement.','Aucun passage disponible ne précise de tarif ou de supplément. Vous ne devez ni inventer un montant ni transformer une absence d’information en gratuité.','Le contexte demandé doit conserver la règle actuelle et sa condition d’exception. Les sources sans rapport et les règles remplacées doivent être écartées de ce contexte minimal.'],
  questions:[
   {id:'evidence',label:'Quels passages conservez-vous dans ce contexte minimal ?',multiple:true,answer:['p1','p2'],options:[
    option('p1','P1 · Règle actuelle sur le renouvellement du matériel','P1 établit la règle générale applicable au matériel. Il faut la conserver avec sa condition d’exception pour ne pas transformer une règle conditionnelle en promesse absolue.'),
    option('p2','P2 · Exception actuelle pour un appareil réservé','P2 apporte la condition décisive pour cet usager. Son absence pourrait faire annoncer à tort que le renouvellement est possible.'),
    option('p3','P3 · Ancienne règle propre aux tablettes Série T','Le nom exact du produit rend P3 tentant, mais cette règle a été remplacée. Sa proximité avec la question ne la rend pas applicable à la demande actuelle.'),
    option('p4','P4 · Durée de prêt des livres','P4 concerne les livres et ne justifie ni le renouvellement de la tablette ni le montant du supplément. Il n’appartient pas au contexte minimal demandé.')
   ]},
   {id:'answer',label:'Quelle réponse est entièrement soutenue par ce contexte et signale correctement le manque d’information ?',answer:'bounded',options:[
    option('yes','Oui, vous pouvez renouveler la tablette pour sept jours ; le supplément sera de 5 €.','Cette réponse ignore l’exception liée à la réservation et invente une confirmation du montant. Ni la seule règle générale ni l’ancien règlement ne justifient cette conclusion.'),
    option('free','Le renouvellement est impossible et il n’y a aucun supplément, puisque le tarif n’apparaît pas dans les documents.','L’exception justifie le refus de renouvellement, mais l’absence de tarif ne démontre pas une gratuité. Cette seconde affirmation dépasse les preuves disponibles.'),
    option('bounded','Le renouvellement prévu par P1 ne s’applique pas à votre tablette déjà réservée, selon P2. Les passages fournis ne permettent pas de confirmer les 5 € ; il faut consulter la règle tarifaire applicable.','La réponse relie la décision à la règle et à son exception. Elle distingue ensuite le tarif inconnu d’un tarif nul, sans présenter une nouvelle recherche comme déjà réalisée.')
   ]}
  ],
  support:[support(9,2,'deepDive','Cas suivi : une règle séparée de son exception'),support(9,3,'sections','Une source présente n’est pas encore une preuve suffisante'),support(9,3,'deepDive','Cas suivi : une réponse bien citée mais périmée')],
  takeaway:'Une preuve utile doit soutenir l’affirmation et s’appliquer au cas traité. Préservez les exceptions, écartez les versions remplacées et rendez visibles les informations que les sources ne permettent pas d’établir.'
 },
 'valider-une-extraction':{
  followUp:{
    "title": "Le contrat change : suivre les unités et les permissions",
    "scenario": "Une autre application adopte un contrat v2 pour une facture F7. Le document lisible indique « Sous-total : 22,50 EUR ; taxe : 4,50 EUR ; total à payer : 27,00 EUR ». Préparez la valeur conforme, puis examinez séparément le format de l’objet et une proposition d’action.",
    "facts": [
      "Le contrat v2 exige exactement trois champs : total_centimes, entier ou null ; devise, égale à EUR ; statut, égal à confirme ou a_verifier. Aucun champ supplémentaire n’est autorisé. Un euro vaut 100 centimes.",
      "Tous les montants de F7 sont lisibles. Pour ce cas, le statut attendu est confirme. L’unité du nouveau champ est le centime, contrairement au contrat du premier cas.",
      "L’utilisateur a autorisé seulement l’extraction pour une revue humaine. L’application doit contrôler une autorisation distincte avant tout paiement ; aucune autorisation de paiement n’a été accordée."
    ],
    "questions": [
      {
        "id": "next-cents",
        "kind": "number",
        "label": "Quelle valeur entière doit contenir total_centimes pour la facture F7 ?",
        "answer": 2700,
        "tolerance": 0,
        "unit": "centimes",
        "feedback": "Le total à payer est 27,00 EUR. Le champ attend des centimes : 27 × 100 = 2 700. Le sous-total et l’unité euros ne correspondent pas au sens de ce champ."
      },
      {
        "id": "next-closed-schema",
        "label": "Le modèle propose {\"total_centimes\":2700,\"devise\":\"EUR\",\"statut\":\"confirme\",\"payer\":true}. Quelle validation de structure convient ?",
        "answer": "extra-field",
        "options": [
          {
            "value": "extra-field",
            "label": "Rejeter la présence du champ payer, absent du contrat, puis revérifier l’objet corrigé.",
            "feedback": "Les trois champs requis sont correctement renseignés, mais le contrat interdit toute propriété supplémentaire. La valeur vraie ou fausse du champ payer ne change pas cette non-conformité."
          },
          {
            "value": "accept",
            "label": "Accepter l’objet, car les trois champs obligatoires sont présents et le total est correct.",
            "feedback": "Un contrat fermé exige aussi l’absence de champs supplémentaires. La présence des champs attendus ne suffit donc pas à rendre cet objet conforme."
          },
          {
            "value": "false",
            "label": "Remplacer payer par false et considérer que le schéma est alors respecté.",
            "feedback": "Le champ reste absent du contrat, même lorsque sa valeur est false. Il faut corriger la structure elle-même, puis la valider de nouveau."
          }
        ]
      },
      {
        "id": "next-payment",
        "label": "Supposez l’extraction corrigée et son total confirmé. Un autre composant propose ensuite un appel de paiement bien formé pour F7. Quelle décision reste nécessaire ?",
        "answer": "permission",
        "options": [
          {
            "value": "permission",
            "label": "Refuser l’exécution dans cette tâche tant qu’aucune autorisation de paiement n’a été accordée.",
            "feedback": "La lecture correcte du montant et le format de l’appel ne donnent pas le droit d’effectuer un paiement. Le service doit appliquer la permission de la tâche indépendamment de la conformité des données."
          },
          {
            "value": "execute",
            "label": "Exécuter le paiement, puisque le montant a été vérifié et les arguments respectent le schéma.",
            "feedback": "Ces contrôles établissent la valeur et la forme des arguments, pas l’autorisation d’une action. La demande initiale se limite à préparer une revue humaine."
          },
          {
            "value": "ask-model",
            "label": "Demander au même modèle si le paiement paraît raisonnable, puis traiter son accord comme une autorisation.",
            "feedback": "Un jugement du modèle ne crée pas une permission manquante. Le contrôle doit se rattacher aux droits et à l’intention autorisée, pas à la plausibilité de l’action."
          }
        ]
      }
    ]
  },
  scenario:'Une application extrait le total à payer d’une facture fictive pour préparer une revue humaine. Contrôlez la sortie proposée avant de la transmettre. Aucun paiement automatique n’est autorisé dans cet atelier.',
  facts:[
   'La source indique explicitement : « Sous-total : 250 EUR ; taxe : 50 EUR ; total à payer : 300 EUR ». Les montants du contrat sont exprimés en euros, pas en centimes.',
   'Contrat de données : total_a_payer est un nombre ou null ; devise vaut EUR ; statut vaut confirme ou a_verifier. Les trois champs sont obligatoires, sans champ supplémentaire. La règle applicative impose null avec a_verifier si le total n’est pas lisible.',
   'Sortie proposée : {"total_a_payer":250,"devise":"EUR","statut":"confirme"}. Un validateur a confirmé sa conformité au contrat de structure ; il n’a pas comparé les valeurs au document.'
  ],
  questions:[
   {id:'validation',label:'Quelle décision prenez-vous pour cette première sortie ?',answer:'source',options:[
    option('accept','L’accepter : les trois champs sont présents et le nombre respecte le schéma.','La conformité de structure ne prouve pas que la valeur correspond au libellé demandé. Ici 250 désigne le sous-total, alors que le total à payer explicite vaut 300.'),
    option('source','La rejeter comme extraction factuellement incorrecte, puis vérifier une correction à 300 contre le libellé « total à payer ».','Le défaut concerne le sens de la valeur extraite. Le contrôle doit relier le champ au bon libellé et à sa valeur dans la source ; un schéma valide ne réalise pas cette lecture.'),
    option('syntax','La rejeter parce que 250 est une chaîne de caractères et non un nombre JSON.','La valeur 250 apparaît sans guillemets : c’est bien un nombre JSON. Le problème se situe dans le choix du sous-total, pas dans le type de cette valeur.')
   ]},
   {id:'missing',label:'Sur une seconde facture, tous les montants sont illisibles et seule la devise EUR est lisible. Quelle sortie et quelle suite respectent le contrat ?',answer:'unknown',options:[
    option('zero','Renvoyer {"total_a_payer":0,"devise":"EUR","statut":"confirme"}, puis transmettre comme une facture gratuite.','Zéro signifie un montant établi égal à zéro. Ici aucun montant n’est lisible : cette sortie invente une valeur et supprime l’incertitude que le contrat sait représenter.'),
    option('retry','Relancer jusqu’à obtenir un nombre, puis le considérer comme confirmé dès qu’il passe le schéma.','Une répétition de génération n’apporte pas de nouvelle information sur un montant illisible. Elle peut produire un nombre conforme mais inventé ; il faut une source lisible ou une revue.'),
    option('unknown','Renvoyer {"total_a_payer":null,"devise":"EUR","statut":"a_verifier"}, puis demander une source lisible ou une revue humaine.','Cette sortie respecte la représentation prévue pour une information absente. La suite du traitement conserve l’incertitude et demande un élément qui peut réellement permettre de lire le montant.')
   ]}
  ],
  support:[support(10,2,'sections','Une structure est un contrat de données'),support(10,2,'deepDive','Cas suivi : une facture correctement formatée mais mal comprise'),support(10,2,'deepDive','Choisir le périmètre d’une contrainte')],
  takeaway:'Validez séparément la structure, la correspondance avec la source et la suite autorisée du traitement. Une donnée inconnue doit rester distincte d’un zéro ou d’une valeur plausible.'
 }
};

export const applicationConnections={
 '1-3':['composer-une-chaine'],
 '6-1':['entrainement-et-generalisation'],
 '6-3':['entrainement-et-generalisation'],
 '7-1':['choisir-une-adaptation'],
 '9-2':['assembler-des-preuves'],
 '9-3':['assembler-des-preuves','choisir-une-adaptation'],
 '10-2':['valider-une-extraction']
};
