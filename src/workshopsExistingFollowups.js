const option=(value,label,feedback)=>({value,label,feedback});

// Variantes après le cas initial : mêmes notions, observations et décisions nouvelles.
export const existingFollowups={
 'choisir-les-fichiers':{
  title:'La version change, le nom du fichier reste le même',
  scenario:'Une révision v3 du même assistant est publiée. Vous préparez sa mise à jour, puis un test avant remise en service. Le nom du fichier de poids est identique à celui de v2 : il ne permet donc pas de reconnaître la révision à lui seul.',
  facts:[
   'Le manifeste officiel v3 donne la révision, les empreintes des fichiers requis et un projecteur mmproj v3. La vérification du téléchargement n’a pas encore été faite.',
   'Le tokenizer et le Chat Template de v3 sont inclus dans ses poids. Un collègue propose de remplacer ce template par un modèle de message générique trouvé ailleurs.',
   'Après préparation des fichiers, le moteur démarre et répond à « Bonjour ». Aucun test avec une image n’a encore été réalisé.'
  ],
  questions:[
   {id:'next-files-revision',label:'Quelle vérification permet de contrôler la révision téléchargée malgré le nom inchangé ?',answer:'manifest',options:[
    option('name','Conserver le fichier déjà présent, puisque le nom demandé n’a pas changé.','Deux révisions peuvent porter le même nom. Cette égalité ne prouve ni la version du contenu ni son intégrité.'),
    option('manifest','Comparer les fichiers et leurs empreintes au manifeste officiel v3, puis vérifier les métadonnées de la variante.','Le manifeste associe la révision aux fichiers attendus. La comparaison des empreintes vérifie leur intégrité ; les métadonnées et la fiche confirment la variante et ses composants.'),
    option('rename','Ajouter « v3 » au nom du fichier v2 pour indiquer la nouvelle version.','Renommer un fichier ne change ni ses poids ni sa version. Cela masquerait une différence au lieu de la vérifier.')
   ]},
   {id:'next-files-template',label:'Que faire du Chat Template générique proposé par votre collègue ?',answer:'keep-variant',options:[
    option('generic','Le substituer automatiquement : un template plus récent convient à toutes les variantes.','Un template générique ou récent n’est pas nécessairement celui attendu par cette variante. Il peut modifier la sérialisation des messages et les entrées du modèle.'),
    option('remove','Retirer tout template : les bulles affichées dans l’interface suffisent au modèle.','Le modèle reçoit une entrée sérialisée, pas l’affichage de l’interface. Retirer sa convention de message ne rend pas cette entrée plus fidèle.'),
    option('keep-variant','Conserver le template correspondant à v3, sauf procédure de remplacement explicitement prévue et vérifiée.','Les composants associés doivent correspondre à la variante. Ici le template requis est déjà fourni : le remplacer sans justification introduirait un changement supplémentaire dans le service.')
   ]},
   {id:'next-files-validation',label:'Le test « Bonjour » réussit. Quelle vérification manque encore pour la mission de lecture d’images ?',answer:'image-test',options:[
    option('image-test','Envoyer une image connue avec une question vérifiable et contrôler la réponse de la chaîne complète.','Un échange purement textuel peut réussir sans que le chemin visuel soit valide. Une image connue permet de vérifier le chargement des composants et le résultat attendu sur la modalité réellement utilisée.'),
    option('text-more','Répéter uniquement le même message textuel jusqu’à obtenir dix réponses identiques.','Répéter un test textuel ne sollicite pas les composants visuels. L’identité des réponses ne remplace pas un test de la tâche image.'),
    option('startup','Considérer le démarrage du moteur comme une validation complète du traitement des images.','Le démarrage prouve seulement qu’une configuration a pu être chargée. Il ne démontre pas que l’image est traitée correctement ni que la réponse correspond à son contenu.')
   ]}
  ]
 },
 'budget-memoire':{
  title:'Le nombre de conversations double',
  scenario:'Le service doit maintenant accueillir huit conversations simultanées, avec toujours 8 192 positions par conversation et au moins 94 réussites sur 100. Recalculez le budget pour la variante 8 bits, puis choisissez une adaptation qui conserve toutes les exigences.',
  facts:[
   'Les poids 8 bits occupent toujours 6,4 GiB et leur score reste de 96/100 sur le test fourni. Le cache reste à 128 KiB par position et par séquence.',
   'Pour ce calcul simplifié, les buffers restent fixés à 1 GiB. On garde 4 GiB pour le système et la marge, quelle que soit la mémoire totale choisie.',
   'La variante 4 bits conserve son score de 86/100. Une allocation totale de 20 GiB est possible ; elle devra ensuite être vérifiée par des mesures de mémoire en service.'
  ],
  questions:[
   {id:'next-memory-total',kind:'number',label:'Combien de GiB le service 8 bits nécessite-t-il avec huit conversations, hors les 4 GiB réservés au système et à la marge ?',answer:15.4,tolerance:0.01,unit:'GiB',feedback:'Le cache vaut 128 × 8 192 × 8 / 1 048 576 = 8 GiB. Le service demande donc 6,4 + 8 + 1 = 15,4 GiB. Ce total n’inclut pas les 4 GiB réservés au système et à la marge.'},
   {id:'next-memory-adaptation',label:'Quelle proposition respecte toutes les exigences dans le budget estimé de ce scénario ?',answer:'more-memory',options:[
    option('more-memory','Allouer 20 GiB au total et garder les poids 8 bits, les huit conversations et les 8 192 positions.','Après les 4 GiB réservés, le service dispose de 16 GiB : les 15,4 GiB estimés tiennent. Le contexte, la concurrence et la qualité sont conservés. La validation réelle doit encore contrôler le pic de mémoire.'),
    option('smaller-context','Garder 16 GiB au total, mais réduire le contexte à 4 096 positions par conversation.','Réduire le contexte économise du cache, mais viole ici l’exigence de 8 192 positions. Un total de mémoire plus faible n’est pas suffisant pour accepter la configuration.'),
    option('fewer-users','Garder 16 GiB au total et n’autoriser que quatre conversations simultanées.','Cette configuration peut reprendre le budget du premier cas, mais ne satisfait pas la nouvelle exigence de huit conversations simultanées.'),
    option('four-bits','Garder 16 GiB au total et passer aux poids 4 bits sans revoir les exigences.','Le score de 86/100 reste inférieur au minimum de 94. Avec huit caches pleins, le total estimé atteindrait aussi 3,5 + 8 + 1 = 12,5 GiB, au-delà des 12 GiB disponibles pour le service.')
   ]}
  ]
 },
 'fidelite-et-qualite':{
  title:'Le meilleur score cache une erreur décisive',
  scenario:'Un second pilote compare X et Y sur les mêmes 100 cas, selon la même grille de correction. Dix de ces cas portent sur une contrainte indispensable. Pour entrer dans ce pilote, une variante doit réussir au moins 90 cas au total et les dix cas critiques. Les deux variantes respectent déjà les limites de mémoire et de débit.',
  table:{caption:'Résultats fictifs du second pilote',headers:['Variante','Cas réussis sur 100','Cas critiques réussis sur 10'],rows:[['X','96','7'],['Y','93','10']]},
  facts:[
   'Les dix cas critiques font partie des 100 cas : il ne s’agit pas d’un second total à ajouter au premier.',
   'Un rapport annexe annonce aussi une divergence KL de 0,02 pour X et de 0,004 pour Y. Les deux rapports utilisent des références, des corpus et des tokenizers différents.'
  ],
  questions:[
   {id:'next-quality-pilot',label:'Quelle variante remplit les critères annoncés pour entrer dans ce pilote ?',answer:'y',options:[
    option('x','X, car 96/100 est le meilleur score global.','X dépasse le seuil global mais échoue sur trois cas critiques. Le meilleur total ne compense pas une exigence définie comme indispensable.'),
    option('y','Y, car elle dépasse 90/100 et réussit les dix cas critiques du test.','Y respecte les deux critères du pilote. Cette décision utilise les erreurs par catégorie et les seuils définis à l’avance, pas uniquement le classement des scores globaux.'),
    option('both','X et Y, puisque leurs scores globaux dépassent tous deux 90/100.','Le seuil global n’est qu’une des deux exigences. X ne respecte pas celle des cas critiques, même si sa moyenne est élevée.')
   ]},
   {id:'next-quality-generalisation',label:'Que permet de conclure la réussite de Y sur les dix cas critiques ?',answer:'observed',options:[
    option('guarantee','Y ne pourra jamais produire d’erreur sur cette catégorie en production.','Dix réussites ne prouvent pas une absence universelle d’erreur. Le nombre de cas, leur diversité et les changements de situation limitent cette conclusion.'),
    option('observed','Y a réussi ces dix cas ; il faut encore vérifier d’autres cas représentatifs et les erreurs importantes.','Le résultat est une preuve sur les exemples observés. Avant un usage plus large, on examine les effectifs, la couverture des situations et les conséquences des erreurs qui pourraient manquer au test.'),
    option('ignore','Les cas critiques n’apportent aucune information tant que le score global n’atteint pas 100/100.','Les résultats par catégorie apportent une information distincte du total. Leur intérêt ne dépend pas d’un score global parfait.')
   ]},
   {id:'next-quality-kl',label:'Les valeurs KL du rapport annexe prouvent-elles que Y préserve mieux son modèle de référence que X ?',answer:'protocol',options:[
    option('smaller','Oui : 0,004 est plus petit que 0,02, quel que soit le protocole.','Une comparaison numérique seule ignore les références, événements et corpus utilisés. Ici les protocoles et les tokenizers diffèrent : les valeurs ne permettent pas cette conclusion directe.'),
    option('protocol','Non : il faut un protocole de comparaison compatible et documenté avant d’interpréter cet écart.','La divergence dépend des distributions comparées, de la référence, du corpus et de l’agrégation. Des tokenizers différents peuvent même changer les événements sur lesquels la mesure porte.'),
    option('quality','Oui : la plus petite KL démontre aussi que Y aura le meilleur score sur toute tâche.','Même une divergence mesurée dans un protocole cohérent décrit une proximité, pas une qualité universelle. Les résultats de la tâche et les erreurs critiques restent à évaluer séparément.')
   ]}
  ]
 },
 'performance-durable':{
  title:'Cette fois, le refroidissement ne semble pas en cause',
  scenario:'Sur une autre machine, une même tâche complète est exécutée avec deux profils d’alimentation autorisés par le fabricant. Le modèle, les entrées, les sorties attendues et les critères de qualité restent identiques. Analysez les mesures avant de choisir une nouvelle expérience.',
  table:{caption:'Mesures fictives de la même tâche',headers:['Profil','Puissance moyenne de la machine','Durée','Limitation thermique signalée','Limite de puissance signalée'],rows:[['A','18 W','12 s','Non','Non'],['B','12 W','20 s','Non','Oui']]},
  facts:[
   'Les deux exécutions satisfont les mêmes critères de qualité. La puissance moyenne est mesurée sur toute la durée de la tâche, au même périmètre : la machine entière.',
   'Les indicateurs sont ceux du journal disponible. L’absence de signal thermique ne prouve pas l’absence de toute contrainte possible ; la limite de puissance est ici l’indice supplémentaire observé.'
  ],
  questions:[
   {id:'next-thermal-hypothesis',label:'Quelle hypothèse est la mieux soutenue pour expliquer une partie du ralentissement avec B ?',answer:'power',options:[
    option('heat','Une surchauffe est démontrée par le seul fait que B est plus lent.','La lenteur seule ne démontre pas une surchauffe. Aucun signal thermique n’apparaît dans ce journal ; il faut regarder les autres limites et les conditions de mesure.'),
    option('power','La contrainte de puissance peut contribuer au ralentissement ; il faut la tester dans des conditions contrôlées.','Le journal signale une limite de puissance avec B. Cela justifie cette hypothèse sans établir que toute la différence de durée provient nécessairement de ce seul mécanisme.'),
    option('quality','B a nécessairement produit une réponse de meilleure qualité puisqu’il a pris plus de temps.','Le scénario indique que les deux tâches satisfont les mêmes critères de qualité. Une durée plus longue ne suffit pas à prouver une meilleure réponse.')
   ]},
   {id:'next-thermal-experiment',label:'Quel protocole aiderait à tester cette hypothèse sans confondre plusieurs changements ?',answer:'controlled',options:[
    option('controlled','Répéter la même charge en ne changeant que le profil autorisé, avec refroidissement et environnement comparables, puis relever durées, fréquences et indicateurs de limitation.','Conserver les autres conditions permet de relier les différences au profil testé. Des répétitions et les journaux de fréquence et de limitation donnent davantage d’éléments qu’une seule durée isolée.'),
    option('disable','Désactiver les protections thermiques et électriques pour chercher le meilleur débit possible.','Le cours demande de conserver les protections. Le but est de mesurer une configuration viable, pas de supprimer les limites de sécurité du matériel.'),
    option('change-model','Utiliser un modèle plus petit, raccourcir la tâche et changer de profil en même temps.','Ces modifications peuvent changer la durée, mais elles empêchent d’attribuer l’effet au profil de puissance. La charge de référence n’est plus conservée.')
   ]},
   {id:'next-thermal-energy',kind:'number',label:'Quelle énergie la tâche du profil A consomme-t-elle, en joules, avec les mesures fournies ?',answer:216,tolerance:0,unit:'J',feedback:'Une puissance moyenne de 18 W pendant 12 s donne 18 × 12 = 216 J. B consomme 12 × 20 = 240 J : sa puissance plus faible ne suffit donc pas à réduire l’énergie de cette tâche, au périmètre mesuré.'}
  ]
 },
 'changer-environnement':{
  title:'La VM démarre : le service est-il prêt ?',
  scenario:'Le moteur ARM fonctionne maintenant dans la VM et cinq cas fonctionnels connus réussissent. Les fichiers, le tokenizer et le Chat Template correspondent à la version de départ. Vous examinez ensuite un essai à quatre conversations simultanées pour décider de la suite.',
  table:{caption:'Observations fictives après la migration',headers:['Vérification','Résultat observé','Exigence du pilote'],rows:[['Cas fonctionnels de démarrage','5 réussites sur 5','Réussir ces 5 cas'],['Pic de mémoire du service','15 GiB','Au plus 12 GiB'],['Délai avant le premier token pour une requête de l’essai','3,4 s','Au plus 2 s par requête']]},
  facts:[
   'Le budget de 12 GiB concerne le service après la réserve du système. Le délai de 3,4 s est observé pour une requête pendant la charge attendue, dans cette VM.',
   'La VM n’expose toujours aucun GPU. Un collègue propose de placer le moteur dans un conteneur pour lui donner automatiquement accès au GPU du poste.',
   'Les cinq réponses fonctionnelles ne sont pas toutes formulées exactement comme sur le poste de départ, mais elles respectent les critères de correction prévus.'
  ],
  questions:[
   {id:'next-migration-startup',label:'Que démontre la réussite des cinq cas fonctionnels de démarrage ?',answer:'limited',options:[
    option('limited','Le service traite correctement ces cinq cas ; cela ne valide pas à lui seul sa capacité sous charge.','Un contrôle fonctionnel vérifie les cas exécutés. Il ne remplace ni une évaluation plus large des réponses ni les mesures de mémoire, de latence et de débit dans l’environnement de destination.'),
    option('production','La VM peut nécessairement tenir toutes les performances du poste avec GPU.','Les performances du poste de départ ne sont pas transférées avec les poids. Les cinq réponses réussies ne démontrent pas la tenue sous la charge attendue.'),
    option('no-more-tests','Aucun autre cas ne doit être testé tant que le moteur et les fichiers gardent les mêmes noms.','Les noms ne garantissent ni la couverture des situations ni la réussite de tous les usages. Le protocole doit encore examiner des cas représentatifs et la charge attendue.')
   ]},
   {id:'next-migration-limits',label:'Quelles exigences du tableau ne sont pas respectées ? Sélectionnez uniquement les échecs observés.',multiple:true,answer:['memory','latency'],options:[
    option('memory','Le pic de mémoire du service.','15 GiB dépasse le budget de 12 GiB. Le démarrage réussi ne supprime pas ce dépassement observé sous charge.'),
    option('latency','Le délai avant le premier token.','Une requête de l’essai atteint 3,4 s avant le premier token, au-delà du maximum de 2 s par requête fixé pour ce pilote.'),
    option('startup','La réussite des cinq cas fonctionnels de démarrage.','Les cinq cas sont annoncés réussis selon leurs critères. Le tableau n’indique pas un échec de ce contrôle.'),
    option('all-responses','La qualité de toutes les réponses futures est démontrée insuffisante.','Ce tableau ne permet pas une conclusion universelle sur toutes les réponses futures. Il montre des dépassements de mémoire et de délai, ainsi que cinq cas fonctionnels réussis.')
   ]},
   {id:'next-migration-container',label:'Le conteneur proposé donnera-t-il, à lui seul, accès au GPU du poste depuis cette VM ?',answer:'exposure',options:[
    option('yes','Oui : une image de conteneur apporte automatiquement les accélérateurs de la machine physique.','L’image fournit une application et des dépendances, pas un accès automatique aux périphériques physiques. La VM et le conteneur restent soumis aux ressources effectivement exposées.'),
    option('exposure','Non : il faut un accès compatible au GPU dans cet environnement, ainsi que les pilotes et le moteur adaptés.','Un conteneur peut fonctionner dans une VM, mais il ne crée pas un accélérateur absent de sa configuration. L’accès doit être prévu et vérifié dans la pile d’exécution réelle.'),
    option('never','Non : aucune machine virtuelle ne peut utiliser un GPU, quelle que soit sa configuration.','Certaines configurations de VM permettent un accès au GPU. Le problème décrit ici est l’absence d’exposition dans cette VM, pas une impossibilité générale de la virtualisation.')
   ]},
   {id:'next-migration-wording',label:'Pour juger les réponses dont la formulation a changé, quel contrôle correspond à la validation fonctionnelle enseignée ?',answer:'criteria',options:[
    option('criteria','Rejouer les cas avec les mêmes critères de réussite et vérifier le contenu attendu, plutôt que l’identité de tous les tokens.','La validation doit porter sur la tâche : exactitude, contraintes et contenu attendu selon les critères du test. Une reformulation n’est pas automatiquement une régression, mais elle doit être vérifiée.'),
    option('identical','Refuser toute différence de token, même lorsque tous les critères de la tâche sont respectés.','Une identité stricte n’est pas l’exigence de ce scénario. Elle peut rejeter des réponses correctes sans mesurer la réussite réelle de la tâche.'),
    option('fluent','Accepter toute réponse fluide, même si une valeur obligatoire ou une contrainte est fausse.','La fluidité ne prouve pas l’exactitude ni le respect des contraintes. Les mêmes critères de correction doivent rester appliqués après la migration.')
   ]}
  ]
 }
};
