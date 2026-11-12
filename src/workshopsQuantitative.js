const support=(theme,step,part,heading)=>({theme,step,part,heading});
const option=(value,label,feedback)=>({value,label,feedback});
export const quantitativeCatalog=[
 {id:'masquer-attention',title:'Tracer les connexions d’attention',description:'Autorisez les bonnes positions et observez comment leurs contributions se combinent.',type:'Carte de connexions',level:'Intermédiaire'},
 {id:'router-experts',title:'Router les bons experts',description:'Appliquez un routage Top-2 et distinguez paramètres actifs et paramètres stockés.',type:'Routage interactif',level:'Intermédiaire'},
 {id:'composer-contexte',title:'Composer une fenêtre de contexte',description:'Gardez les informations décisives tout en réservant assez de place pour la réponse.',type:'Budget de tokens',level:'Accessible'},
 {id:'comparer-filtres',title:'Choisir un filtre selon ses erreurs',description:'Calculez précision et rappel, puis voyez comment le coût des erreurs change la décision.',type:'Comparaison chiffrée',level:'Intermédiaire'}
];
export const quantitativeContent={
 'masquer-attention':{
  scenario:'Vous examinez la position T5 dans une seule couche d’attention. Elle utilise une fenêtre causale de trois positions, position courante comprise, et possède en plus un accès direct à T1. Activez exactement les connexions permises, puis observez la combinaison calculée.',
  facts:['La séquence comporte T1 à T6. Le masque causal interdit l’accès aux positions futures.','Les valeurs V sont ici de simples nombres pour rendre le calcul visible. Un modèle réel combine des vecteurs.','Les coefficients positifs fournis sont déjà les exponentielles des scores, avant masquage et normalisation. La contribution d’une position interdite doit être nulle ; les coefficients autorisés sont ensuite divisés par leur somme.'],
  table:{caption:'Données de la couche miniature',headers:['Position','Coefficient avant normalisation','Valeur V'],rows:[['T1','1','2'],['T2','5','10'],['T3','2','4'],['T4','3','6'],['T5','4','8'],['T6','6','12']]},
  questions:[
   {id:'positions',label:'Quelles positions T5 peut-elle consulter directement dans cette couche ?',multiple:true,answer:['t1','t3','t4','t5'],options:[
    option('t1','T1','T1 est autorisée par l’accès global supplémentaire défini dans le scénario.'),
    option('t2','T2','T2 est hors de la fenêtre T3 à T5 et ne dispose d’aucune exception directe dans cette couche.'),
    option('t3','T3','T3 est la première des trois positions de la fenêtre, position courante comprise.'),
    option('t4','T4','T4 est dans la fenêtre locale causale de T5.'),
    option('t5','T5','La position courante est comprise dans cette fenêtre de trois positions.'),
    option('t6','T6','T6 est une position future : le masque causal interdit cette connexion.') ]},
   {id:'meaning',label:'Que représente le résultat affiché par la simulation ?',answer:'combination',options:[
    option('combination','Une combinaison pondérée des valeurs autorisées dans cette couche miniature.','Les valeurs sont combinées avec les poids normalisés. Le reste du modèle transforme ensuite cette représentation ; le calcul ne fournit pas à lui seul un mot de réponse.'),
    option('future','Le token que le modèle produira nécessairement ensuite.','Une sortie d’attention n’est pas directement le prochain token. Il manque ici les autres transformations et la distribution de sortie.'),
    option('all-past','La preuve que toutes les informations passées sont conservées fidèlement.','L’existence d’une connexion ne garantit pas la conservation fidèle d’une information à travers toutes les couches.') ]}
  ],
  lab:'attention',afterQuestion:'positions',
  support:[support(3,2,'deepDive','Cas guidé : parcourir six positions'),support(3,1,'sections','Passer de la compatibilité à une combinaison'),support(2,3,'sections','Produire Q, K et V')],
  takeaway:'Le masque fixe les connexions possibles. Les scores normalisés règlent leurs contributions. Une connexion directe absente dans une couche n’interdit pas nécessairement une influence indirecte à travers plusieurs couches.'
 },
 'router-experts':{
  scenario:'Un sous-ensemble MoE miniature contient 10 millions de paramètres communs et huit experts de 4 millions chacun. Pour le token étudié, la règle est Top-2 : sélectionnez les deux experts les mieux classés par le routeur, puis interprétez les comptes affichés.',
  facts:['Les 10 millions de paramètres communs sont tous utilisés pour chaque token dans ce modèle simplifié.','Il n’y a ici ni égalité de scores, ni expert partagé supplémentaire, ni limite de capacité qui modifie le routage.','Tous les experts restent disponibles pour d’autres tokens. Les compteurs ne modélisent ni les communications, ni la mémoire du cache, ni le temps d’exécution.'],
  table:{caption:'Scores fictifs du routeur pour un token',headers:['Expert','Score du routeur'],rows:[['E1','0,40'],['E2','0,25'],['E3','0,10'],['E4','0,08'],['E5','0,07'],['E6','0,05'],['E7','0,03'],['E8','0,02']]},
  questions:[
   {id:'experts',label:'Quels sont les deux experts à activer pour ce token ?',multiple:true,answer:['e1','e2'],options:Array.from({length:8},(_,i)=>option('e'+(i+1),'E'+(i+1),i<2?'Cet expert fait partie des deux mieux classés pour ce token. Son activation respecte la règle Top-2.':'Cet expert est disponible dans le modèle, mais son score ne fait pas partie des deux meilleurs pour ce token.'))},
   {id:'memory',label:'Que pouvez-vous conclure lorsque deux experts sont actifs ?',answer:'stored',options:[
    option('stored','18 millions de paramètres sont actifs ; les 42 millions de paramètres totaux restent à stocker quelque part.','Le total vaut 10 + 8 × 4 = 42 millions. Le compte actif simplifié vaut 10 + 2 × 4 = 18 millions. Les six autres experts restent disponibles pour d’autres tokens.'),
    option('removed','Les experts inactifs disparaissent : il suffit de stocker 18 millions de paramètres au total.','Un expert inactif pour ce token peut être sélectionné pour un autre. Le routage ne supprime pas ses poids du modèle.'),
    option('speed','Le modèle est nécessairement 42/18 fois plus rapide qu’un modèle dense de même taille totale.','Le nombre de paramètres actifs n’est pas un chronomètre. Les opérations, les échanges et les contraintes du service doivent être mesurés.') ]}
  ],
  lab:'experts',afterQuestion:'experts',
  support:[support(4,2,'sections','Du classement à la sélection'),support(4,2,'sections','Compter ce qui existe et ce qui travaille')],
  takeaway:'Le routeur choisit un chemin pour un token. Le compte actif décrit ce chemin ; le compte total décrit les paramètres disponibles. Aucun des deux ne prédit seul la vitesse réelle.'
 },
 'composer-contexte':{
  scenario:'Vous préparez une réponse à une demande client dans une fenêtre de 8 192 tokens. Il faut conserver sa contrainte exacte, la règle et son exception, puis réserver au moins 1 200 tokens de sortie. Ajustez les éléments transmis sans perdre ces exigences.',
  facts:['Les comptes incluent le tokenizer choisi et sont fournis pour cet exercice : instructions 512 tokens, question 200, marqueurs 80, soit 792 tokens fixes.','L’historique complet fait 1 800 tokens. Son résumé vérifié de 600 tokens conserve la contrainte client exacte. Sans historique ni résumé, cette contrainte manque.','Les documents complets font 4 700 tokens. La sélection de 2 500 tokens conserve la règle, son exception et les pièces utiles. La version de 2 100 tokens omet l’exception.','La limite de 8 192 tokens est partagée entre l’entrée et la sortie réservée. Les chiffres ne décrivent pas les limites d’un service réel.'],
  controls:[
   {id:'history',label:'Historique transmis',default:'full',options:[['full','Complet : 1 800 tokens'],['summary','Résumé vérifié : 600 tokens'],['none','Aucun : 0 token']]},
   {id:'documents',label:'Documents transmis',default:'full',options:[['full','Complets : 4 700 tokens'],['focused','Sélection avec exception : 2 500 tokens'],['without-exception','Sélection sans exception : 2 100 tokens']]},
   {id:'output',label:'Réserve de sortie',default:'1200',options:[['512','512 tokens'],['1200','1 200 tokens'],['2000','2 000 tokens']]}
  ],
  questions:[{id:'memory',label:'L’interface affiche encore les anciens messages retirés du contexte. Sont-ils automatiquement accessibles au modèle dans cette requête ?',answer:'sent',options:[
   option('sent','Non : seules les informations effectivement transmises sont disponibles ici.','L’historique visible dans l’interface ne décrit pas le contenu de la requête. Un résumé ou une recherche peut réintroduire certaines informations, mais cela doit être organisé par l’application.'),
   option('screen','Oui : tout ce qui apparaît à l’écran fait partie de la mémoire du modèle.','L’interface peut afficher des messages que l’application ne renvoie plus. Leur visibilité à l’écran ne les ajoute pas à la fenêtre de contexte.'),
   option('always','Oui : chaque conversation est automatiquement apprise dans les paramètres du modèle.','L’ajout d’un message au contexte n’est pas un entraînement des paramètres. Cette application ne fournit ici aucun mécanisme de mémoire supplémentaire.') ]}],
  lab:'context',
  support:[support(5,2,'sections','Construire l’entrée réellement reçue'),support(5,2,'deepDive','Préparer le budget sans inventer une mémoire automatique')],
  takeaway:'Un budget valide doit tenir en tokens et préserver les informations nécessaires. Plusieurs sélections peuvent convenir ; réduire le total en supprimant une contrainte décisive n’est pas une solution.'
 },
 'comparer-filtres':{
  scenario:'Deux filtres ont traité les mêmes 100 messages : 20 indésirables et 80 légitimes. « Positif » signifie ici « bloqué comme indésirable ». Calculez deux métriques puis choisissez le filtre qui minimise le coût d’erreur défini par le profil sélectionné.',
  facts:['VP : indésirable bloqué. FN : indésirable laissé passer. FP : message légitime bloqué. VN : message légitime conservé.','Précision = VP / (VP + FP). Rappel = VP / (VP + FN). Les réponses attendues sont des pourcentages, avec une décimale si nécessaire.','Dans les deux profils, bloquer un message légitime coûte 5 unités. Laisser passer un indésirable coûte 1 unité dans le profil courant, ou 30 dans le profil sensible.','Coût total = FP × coût d’un blocage erroné + FN × coût d’un indésirable manqué. Ces coûts fictifs sont des unités de travail, pas des tarifs.'],
  table:{caption:'Matrice de résultats sur les mêmes messages',headers:['Filtre','VP','FN','FP','VN'],rows:[['A','16','4','8','72'],['B','18','2','18','62']]},
  controls:[{id:'policy',label:'Conséquence d’un indésirable manqué',default:'regular',options:[['regular','Profil courant : 1 unité'],['sensitive','Profil sensible : 30 unités']]}],
  questions:[
   {id:'precision',kind:'number',label:'Quelle est la précision du filtre A, en pourcentage ?',answer:100*16/24,tolerance:0.05,unit:'%',feedback:'Parmi les 24 messages bloqués par A, 16 sont indésirables. Sa précision est 16 / (16 + 8) × 100, soit environ 66,7 %.'},
   {id:'recall',kind:'number',label:'Quel est le rappel du filtre B, en pourcentage ?',answer:90,tolerance:0.05,unit:'%',feedback:'B bloque 18 des 20 indésirables. Son rappel est 18 / (18 + 2) × 100, soit 90 %. Cela ne dit pas combien de messages légitimes il bloque aussi.'},
   {id:'candidate',label:'Quel filtre minimise le coût total dans le profil actuellement sélectionné ?',answerBy:{field:'policy',answers:{regular:'a',sensitive:'b'}},options:[
    option('a','Filtre A','A coûte 8 × 5 + 4 × 1 = 44 unités dans le profil courant, contre 160 dans le profil sensible.'),
    option('b','Filtre B','B coûte 18 × 5 + 2 × 1 = 92 unités dans le profil courant, contre 150 dans le profil sensible.') ]}
  ],
  lab:'metrics',afterQuestion:'candidate',
  support:[support(12,2,'sections','Lire plusieurs nombres au lieu d’un seul'),support(12,2,'deepDive','Calculer un coût d’erreur et contrôler le protocole')],
  takeaway:'Précision et rappel décrivent des erreurs différentes. La préférence peut s’inverser quand leur coût change, sans modifier les prédictions ni les métriques. Une décision réelle vérifie aussi les effectifs et les cas critiques.'
 }
};
export const quantitativeConnections={
 '2-3':['masquer-attention'],'3-1':['masquer-attention'],'3-2':['masquer-attention'],
 '4-2':['router-experts'],'5-2':['composer-contexte'],'12-2':['comparer-filtres']
};
export const attentionPositions=Array.from({length:6},(_,i)=>({id:'t'+(i+1),label:'T'+(i+1),coefficient:[1,5,2,3,4,6][i],value:[2,10,4,6,8,12][i]}));
export function attentionMix(selected=[]){
 const active=attentionPositions.filter(position=>Array.isArray(selected)&&selected.includes(position.id)),sum=active.reduce((n,position)=>n+position.coefficient,0);
 return {positions:attentionPositions.map(position=>({...position,weight:sum&&active.includes(position)?position.coefficient/sum:0})),value:sum?active.reduce((n,position)=>n+position.coefficient*position.value/sum,0):null};
}
export function contextBudget(values){
 const history={full:1800,summary:600,none:0}[values.history]??1800;
 const documents={full:4700,focused:2500,'without-exception':2100}[values.documents]??4700;
 const output=['512','1200','2000'].includes(values.output)?Number(values.output):1200;
 return {fixed:792,history,documents,output,total:792+history+documents+output,capacity:8192};
}
export function quantitativeChecks(id,values){
 if(id!=='composer-contexte')return [];
 const b=contextBudget(values);
 return [
  {id:'capacity',pass:b.total<=8192,label:'Capacité de la fenêtre',message:`${b.fixed} + ${b.history} + ${b.documents} + ${b.output} = ${b.total} tokens, pour une capacité de 8 192.`},
  {id:'constraint',pass:['full','summary'].includes(values.history),label:'Contrainte client conservée',message:'L’historique complet et son résumé vérifié conservent la contrainte exacte. L’absence des deux la retire du contexte.'},
  {id:'exception',pass:['full','focused'].includes(values.documents),label:'Règle et exception présentes',message:'Les documents complets et la sélection de 2 500 tokens contiennent l’exception. La version de 2 100 tokens la perd.'},
  {id:'output-budget',pass:b.output>=1200,label:'Réserve de sortie suffisante',message:`La réserve choisie est de ${b.output} tokens ; la mission en demande au moins 1 200.`}
 ];
}

quantitativeContent['masquer-attention'].followUp={
 title:'Même fenêtre, une couche de plus',
 scenario:'Dans une autre configuration, l’accès global à T1 est supprimé. Chaque couche garde une fenêtre causale de trois positions, position courante comprise. Vous observez à nouveau T5, puis vous examinez ce que deux couches successives rendent possible.',
 facts:['Dans chaque couche, une position lit les représentations disponibles à l’entrée de cette couche. Elle ne réutilise pas instantanément la sortie fraîche d’une autre position de la même couche.'],
 questions:[
  {id:'next-direct',label:'Sans accès global, quelles positions T5 peut-elle consulter directement dans une couche ?',multiple:true,answer:['t3','t4','t5'],options:[
   option('t1','T1','T1 est maintenant hors de la fenêtre locale de T5 et ne bénéficie plus d’un accès global direct.'),
   option('t2','T2','Une fenêtre de trois positions, position courante comprise, commence ici à T3. T2 n’en fait pas partie.'),
   option('t3','T3','La fenêtre couvre T3, T4 et T5 : T3 est donc une connexion directe autorisée.'),
   option('t4','T4','T4 appartient à la fenêtre causale locale de trois positions qui se termine à T5.'),
   option('t5','T5','La position courante compte dans la fenêtre : T5 peut consulter sa représentation d’entrée.') ]},
  {id:'next-path',label:'Quel chemin permet théoriquement à une information de T1 d’influencer T5 après deux couches ?',answer:'layers',options:[
   option('layers','T3 reçoit de l’information de T1 dans la première couche ; T5 lit la représentation de T3 dans la seconde.','Dans la première couche, T3 peut consulter T1 à T3. Dans la seconde, T5 peut consulter la représentation ainsi obtenue en T3. Les deux connexions respectent le même masque local.'),
   option('same-layer','T3 lit T1 puis transmet instantanément sa nouvelle sortie à T5 dans la même couche.','Le scénario interdit cette réutilisation instantanée. Le chemin passe par les représentations de deux couches successives.'),
   option('future','T5 consulte T6, qui récupère ensuite T1 pour lui.','T6 est une position future pour T5 et n’appartient pas à sa fenêtre causale. Ce détour n’est pas autorisé.') ]},
  {id:'next-guarantee',label:'L’existence de ce chemin garantit-elle que le détail provenant de T1 sera correctement utilisé dans la réponse ?',answer:'possible',options:[
   option('possible','Non : le chemin rend l’influence possible, mais les transformations peuvent atténuer ou perdre le détail.','Une connexion décrit un accès possible, pas une garantie de conservation fidèle ni de bon usage final. Il faut évaluer la tâche et les détails effectivement restitués.'),
   option('perfect','Oui : dès qu’un chemin existe, toute information le parcourt sans perte.','Les représentations combinent plusieurs sources et subissent des transformations. Un chemin ne constitue pas une mémoire parfaite.'),
   option('impossible','Non : seule une connexion directe peut transmettre une information, quel que soit le nombre de couches.','Des couches successives peuvent créer une influence indirecte, comme le chemin T1 vers T3 puis T5. L’absence de lien direct ne suffit pas à exclure toute influence.') ]}
 ]
};
quantitativeContent['router-experts'].followUp={
 title:'Un autre token change la sélection',
 scenario:'L’architecture reste identique, mais un autre token reçoit de nouveaux scores. La règle Top-2 reste applicable, toujours sans conflit de capacité. Les deux meilleurs experts sont désormais E7 avec 0,45 et E2 avec 0,30 ; tous les autres scores sont inférieurs à 0,10. Le premier token utilisait E1 et E2. Pour compter l’union des paramètres distincts touchés par les deux tokens, un même poids n’est compté qu’une fois.',
 facts:['Chaque token conserve sa propre entrée et son propre calcul. Deux tokens qui sollicitent le même expert réutilisent ses poids, mais cela ne signifie pas que leur calcul devient une seule opération.'],
 questions:[
  {id:'next-routing',label:'Quelle sélection applique la règle pour ce nouveau token ?',answer:'new',options:[
   option('new','E7 et E2.','Le routeur sélectionne les deux meilleurs scores de ce token. La sélection du token précédent n’impose pas les experts du suivant.'),
   option('previous','E1 et E2, puisqu’ils ont servi au token précédent.','Le routage dépend de la représentation et des scores du token considéré. Conserver automatiquement la sélection précédente ignore les nouvelles données.'),
   option('all','Les huit experts, puisque le classement a changé.','Un classement différent change les experts choisis, pas la règle Top-2. Il ne demande pas d’exécuter tous les experts.') ]},
  {id:'next-distinct',kind:'number',label:'Sur les deux tokens, combien de millions de paramètres distincts ont été sollicités, composants communs comptés une seule fois ?',answer:22,tolerance:0,unit:'millions',feedback:'L’union contient E1, E2 et E7, plus les paramètres communs. Elle vaut 10 + 3 × 4 = 22 millions. Chaque token n’en active toujours que 18 millions ; l’union ne compte pas plusieurs fois les poids réutilisés.'},
  {id:'next-cost',label:'L’union de 22 millions de paramètres distincts suffit-elle à prévoir le temps de calcul des deux tokens ?',answer:'remeasure',options:[
   option('remeasure','Non : des poids communs sont utilisés pour plusieurs entrées ; les opérations et les échanges doivent être mesurés.','L’union compte des poids distincts, pas leur nombre d’utilisations ni le travail effectué. E2 et les composants communs interviennent pour les deux tokens, avec leurs entrées respectives.'),
   option('once','Oui : puisque E2 est commun, son calcul du premier token sert automatiquement de résultat au second.','Réutiliser les poids d’un expert ne signifie pas réutiliser son résultat sur une entrée différente. Le scénario conserve un calcul propre à chaque token.'),
   option('speed','Oui : traiter les deux tokens prend nécessairement 22/18 fois le temps d’un token.','Ce rapport compare des comptes de paramètres de natures différentes. Il ne décrit ni les opérations répétées, ni leur organisation, ni les communications du service.') ]}
 ]
};
quantitativeContent['composer-contexte'].followUp={
 title:'Un résumé plus court, mais incomplet',
 scenario:'Une nouvelle version du résumé occupe toujours 600 tokens, mais un contrôle montre qu’elle a perdu la contrainte exacte du client : « livraison impérative avant le 17 juin ». Le reste des documents ne contient pas cette date. L’historique complet la conserve. La sélection documentaire de 2 500 tokens et une réserve de sortie de 1 200 tokens restent disponibles.',
 questions:[
  {id:'next-plan',label:'Quelle préparation permet de conserver cette contrainte tout en respectant le budget de 8 192 tokens ?',answer:'full-history',options:[
   option('full-history','Reprendre l’historique complet de 1 800 tokens, garder les documents sélectionnés et réserver 1 200 tokens de sortie.','Le total vaut 792 + 1 800 + 2 500 + 1 200 = 6 292 tokens. Cette configuration tient et préserve la contrainte exacte dans l’historique.'),
   option('summary','Garder le résumé incomplet, puisqu’il était annoncé comme vérifié dans le premier cas.','La nouvelle observation invalide cette hypothèse. Un résumé court qui perd une contrainte indispensable ne remplit plus la mission.'),
   option('invent','Retirer l’historique et demander au modèle d’inférer la date la plus probable.','La date exacte n’est pas présente ailleurs. Une valeur plausible ne remplace pas la contrainte du client.') ]},
  {id:'next-margin',kind:'number',label:'Avec l’historique complet, les documents sélectionnés et 1 200 tokens de sortie, combien de tokens restent disponibles ?',answer:1900,tolerance:0,unit:'tokens',feedback:'La préparation utilise 792 + 1 800 + 2 500 + 1 200 = 6 292 tokens. Il reste 8 192 − 6 292 = 1 900 tokens. Le budget et la conservation des informations doivent être contrôlés ensemble.'}
 ]
};
quantitativeContent['comparer-filtres'].followUp={
 title:'Une population avec peu d’indésirables',
 scenario:'Un nouveau test porte sur 1 000 messages, dont seulement 10 sont indésirables. Le filtre bloque 8 indésirables et 10 messages légitimes ; il laisse donc passer 2 indésirables. Le sens de « positif » reste « bloqué comme indésirable ».',
 questions:[
  {id:'next-precision',kind:'number',label:'Quelle est la précision sur cette nouvelle population, en pourcentage ?',answer:100*8/18,tolerance:0.05,unit:'%',feedback:'Le filtre bloque 18 messages au total, dont seulement 8 sont indésirables. La précision vaut 8 / (8 + 10) × 100, soit environ 44,4 %.'},
  {id:'next-interpretation',label:'Son rappel vaut 80 %. Quelle lecture des résultats est justifiée ?',answer:'both',options:[
   option('both','Il détecte 8 indésirables sur 10, mais les faux blocages sont plus nombreux que les bons ; il faut examiner les deux types d’erreurs.','Le rappel vaut 8 / 10 = 80 %, tandis que la précision est d’environ 44,4 %. La faible présence d’indésirables dans la population rend les faux positifs particulièrement visibles parmi les messages bloqués.'),
   option('same','Un rappel de 80 % implique que 80 % des messages bloqués sont réellement indésirables.','Cette seconde proportion est la précision, avec un autre dénominateur. Ici elle vaut 8 / 18, et non 8 / 10.'),
   option('accuracy','L’Accuracy élevée suffit à accepter le filtre, quelles que soient les conséquences des faux blocages.','La majorité des messages est légitime. Une Accuracy élevée peut masquer les erreurs sur les messages bloqués et ne remplace pas l’examen des coûts ou des contraintes du service.') ]}
 ]
};
