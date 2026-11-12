import {existingFollowups} from './workshopsExistingFollowups.js';
import {applicationContent} from './workshopsApplications.js';
import {trustContent} from './workshopsTrust.js';
import {quantitativeContent,quantitativeChecks} from './workshopsQuantitative.js';
import {lessonSectionId} from './practiceSupport.js';
const support=(theme,step,part,heading)=>({theme,step,part,heading});
export const workshopLessonHref=reference=>`/cours/${reference.theme}/lecons/${reference.step}#${lessonSectionId(reference.theme,reference.step,reference.part,reference.heading)}`;
const option=(value,label,feedback)=>({value,label,feedback});
export const workshopContent={
 ...applicationContent,...trustContent,...quantitativeContent,
 'choisir-les-fichiers':{
  scenario:'Vous préparez un assistant qui répond à des questions sur des images. Le moteur installé accepte la variante GGUF indiquée dans le manifeste ci-dessous. Constituez le téléchargement minimal conforme à ce manifeste.',
  facts:['Variante demandée : Modele-A v2, Instruct, 7B, quantification Q4_K_M. Le manifeste associe explicitement Modele-A-7B-Instruct-Q4_K_M.gguf à cette révision v2, même si le numéro n’apparaît pas dans son nom.','Le manifeste exige les poids et le projecteur visuel mmproj de la même version.','Le tokenizer et le Chat Template sont intégrés aux poids. La licence et les empreintes des fichiers ont déjà été vérifiées.'],
  questions:[
   {id:'model',label:'Quel fichier de poids allez-vous utiliser ?',answer:'instruct',options:[
    option('base','Modele-A-7B-Base-Q4_K_M.gguf','Le format convient, mais Base ne correspond pas à la variante Instruct demandée.'),
    option('instruct','Modele-A-7B-Instruct-Q4_K_M.gguf','La famille, la variante, la quantification et le format correspondent au manifeste. Le nom est un indice ; ici le manifeste confirme le contenu.'),
    option('onnx','Modele-A-7B-Instruct.onnx','Cette conversion vise un autre format. Le moteur de ce scénario attend le fichier GGUF vérifié.') ]},
   {id:'files',label:'Quels fichiers supplémentaires sont nécessaires ? Sélectionnez uniquement ceux que demande le manifeste.',multiple:true,answer:['projector-v2'],options:[
    option('projector-v1','mmproj-Modele-A-v1.gguf','Le projecteur v1 ne correspond pas à la version v2 du modèle.'),
    option('projector-v2','mmproj-Modele-A-v2.gguf','Le projecteur visuel v2 est requis pour traiter les images avec cette variante.'),
    option('dataset','donnees-entrainement.zip','Le jeu d’entraînement n’est pas requis pour exécuter cet assistant.'),
    option('template','chat-template-generique.json','Un template générique n’est pas requis : celui de la variante est déjà intégré. Le remplacer pourrait modifier les entrées.') ]}
  ],
  support:[support(8,2,'sections','Lire le nom et le contenu d’un fichier de modèle'),support(8,2,'deepDive','Préparer tous les composants d’un modèle multimodal')],
  takeaway:'Un téléchargement cohérent se construit à partir du manifeste, de la tâche et des capacités du moteur. Charger les poids de langage ne suffit pas à valider une chaîne multimodale.'
 },
 'budget-memoire':{
  scenario:'Une équipe doit servir quatre conversations simultanées, avec 8 192 positions de contexte par conversation et au moins 94 cas réussis sur son test de 100 cas. Trouvez une configuration qui respecte ces exigences dans le budget disponible.',
  facts:['Machine : 16 GiB. Système et marge réservés : 4 GiB. Budget du service : 12 GiB.','Buffers : 1 GiB. KV Cache : 128 KiB par position et par séquence, quelle que soit la précision des poids choisie ici.','Le contexte inclut l’entrée et la sortie conservées en cache. Ce modèle simplifié suppose des caches pleins, sans partage entre séquences.'],
  table:{caption:'Mesures fictives des trois variantes',headers:['Poids','Mémoire des poids','Réussites / 100'],rows:[['16 bits','12,4 GiB','98'],['8 bits','6,4 GiB','96'],['4 bits','3,5 GiB','86']]},
  support:[support(8,2,'deepDive','Composer un budget mémoire sans sacrifier la tâche'),support(12,3,'sections','Distinguer fidélité au modèle et qualité sur la tâche')],
  takeaway:'Faire tenir les poids est seulement une partie du problème. La bonne configuration respecte aussi le contexte, la concurrence et la qualité. Ce budget ne prédit pas la vitesse du service.'
 },
 'fidelite-et-qualite':{
  scenario:'Choisissez une variante quantifiée pour ce pilote. Elle doit réussir au moins 85 cas sur 100, occuper au maximum 10 GiB en service et fournir au moins 8 tokens par seconde sur la charge prévue. Les trois variantes ont été évaluées sur les mêmes cas, avec la même correction et la même charge.',
  table:{caption:'Résultats fictifs du protocole commun',headers:['Famille','Réussites avant → après','Mémoire en service','Débit'],rows:[['A','92 → 86','7,2 GiB','9 tokens/s'],['B','80 → 79','5,8 GiB','12 tokens/s'],['C','90 → 87','11,8 GiB','10 tokens/s']]},
  facts:['Les scores comptent des cas réussis ; ils ne mesurent pas la distance entre les distributions de probabilités.','Ces mesures permettent de choisir un candidat pour le pilote. Elles ne remplacent pas l’analyse des erreurs critiques et des incertitudes avant une mise en production.'],
  questions:[
   {id:'candidate',label:'Quelle variante quantifiée respecte les trois seuils du pilote ?',answer:'a',options:[
    option('a','Variante A','A satisfait les trois seuils : 86 réussites, 7,2 GiB et 9 tokens/s. Sa baisse de score plus importante que celle de B ne l’exclut pas.'),
    option('b','Variante B','B respecte la mémoire et le débit, mais ses 79 réussites sont inférieures au minimum de 85.'),
    option('c','Variante C','C obtient 87 réussites et un débit suffisant, mais dépasse les 10 GiB disponibles.') ]},
   {id:'interpretation',label:'B perd seulement un point après quantification. Quelle conclusion les données permettent-elles ?',answer:'score',options:[
    option('quality','B donne les meilleures réponses après quantification.','B réussit 79 cas, contre 86 pour A et 87 pour C. Une faible baisse ne signifie pas un meilleur résultat final.'),
    option('score','B conserve le mieux son score agrégé, mais reste sous le seuil de qualité demandé.','La baisse d’un point est la plus petite. Elle ne suffit ni à satisfaire le seuil de 85 ni à prouver une meilleure proximité des distributions.'),
    option('kl','B a nécessairement la plus faible divergence KL avec son modèle original.','Le tableau ne contient aucune distribution de probabilités ni mesure KL. On ne peut pas déduire cette divergence des seuls scores de réussite.') ]}
  ],
  support:[support(12,3,'sections','Distinguer fidélité au modèle et qualité sur la tâche'),support(12,3,'deepDive','Ce que mesure une divergence KL')],
  takeaway:'Choisissez sur des exigences explicites. La conservation d’un score, la proximité des probabilités et la qualité finale sont trois observations distinctes.'
 },
 'performance-durable':{
  scenario:'Un service ralentit alors qu’il rejoue une charge identique : même modèle, mêmes longueurs d’entrée et de sortie, même concurrence. Analysez le journal puis choisissez une expérience qui permet de tester la cause du ralentissement.',
  table:{caption:'Journal fictif à charge constante',headers:['Après démarrage','Débit','Température','Fréquence','Limitation thermique'],rows:[['1 min','18 tokens/s','45 °C','2,4 GHz','Non'],['5 min','17 tokens/s','72 °C','2,3 GHz','Non'],['15 min','9 tokens/s','86 °C','1,2 GHz','Oui']]},
  facts:['Ces températures et fréquences appartiennent au scénario ; elles ne définissent aucun seuil universel.','Aucune limitation de puissance n’est signalée pendant cet essai.'],
  questions:[
   {id:'hypothesis',label:'Quelle hypothèse est la mieux étayée par ce journal ?',answer:'thermal',options:[
    option('thermal','Une limitation thermique contribue au ralentissement.','Le signal thermique actif et la baisse de fréquence soutiennent cette hypothèse. Une expérience contrôlée reste nécessaire pour mieux attribuer la baisse de débit.'),
    option('power','Une limite de puissance est démontrée.','Le journal ne signale pas de limite de puissance. Chaleur et limite de puissance sont deux contraintes distinctes.'),
    option('context','Le contexte s’est allongé pendant la mesure.','Le scénario indique des longueurs et une charge constantes. Cette hypothèse ne correspond pas aux données fournies.') ]},
   {id:'experiment',label:'Choisissez l’essai à simuler. Un seul changement doit permettre de tester l’hypothèse thermique.',answer:'cooling',options:[
    option('cooling','Améliorer uniquement le refroidissement, puis rejouer et répéter la même charge.','La charge et le modèle restent identiques. Le retour d’un débit durable et la disparition du signal thermique renforcent l’hypothèse dans ces conditions.'),
    option('model','Passer à un modèle plus petit et raccourcir les réponses.','Ce changement touche plusieurs facteurs. Il peut accélérer le service, mais n’isole pas l’effet du refroidissement.'),
    option('short','Relancer le même test et ne garder que la première minute.','La première minute ne permet pas de vérifier la tenue après échauffement.') ]}
  ],
  support:[support(15,3,'sections','Mesurer la performance qui dure'),support(15,3,'deepDive','Distinguer une limite thermique d’une limite de puissance')],
  takeaway:'Un diagnostic relie les mesures à une hypothèse, puis change un seul facteur pour la tester. Mesurez aussi l’énergie par tâche acceptable : une puissance moindre ne garantit pas une énergie moindre.'
 },
 'changer-environnement':{
  scenario:'Un service fonctionne sur un poste x86 avec GPU. Vous devez le déplacer vers une VM ARM disposant de 16 GiB de RAM, sans GPU exposé. Un moteur ARM prenant en charge la variante GGUF est disponible. Préparez le plan de validation avant de promettre un niveau de service.',
  facts:['Le fichier GGUF exact peut être transféré et son empreinte vérifiée.','Le tokenizer, le Chat Template et les réglages doivent être conservés pour isoler le changement d’environnement.','Les cas fonctionnels et la charge attendue sont connus ; aucune mesure n’a encore été faite sur la VM.'],
  questions:[
   {id:'plan',label:'Quelles actions incluez-vous ? Sélectionnez toutes les actions nécessaires au plan proposé.',multiple:true,answer:['build','resources','quality','load'],options:[
    option('build','Installer le moteur ARM compatible et vérifier les fichiers, versions et dépendances.','Le binaire x86 du poste n’est pas un exécutable ARM. La compatibilité annoncée des poids ne suffit pas à préparer toute la pile.'),
    option('resources','Vérifier la mémoire disponible, les quotas CPU et le fonctionnement réel en mode CPU.','Le plan doit partir des ressources visibles dans la VM, et non de celles du poste de départ.'),
    option('quality','Rejouer les cas fonctionnels avec les mêmes critères de qualité.','Un chargement réussi ne prouve pas que les entrées et les réponses sont encore traitées correctement.'),
    option('load','Mesurer la mémoire maximale, les latences et le débit durable sur la charge attendue.','Les performances doivent être mesurées sur la destination ; elles ne se transfèrent pas avec le fichier de poids.'),
    option('copy','Copier directement le binaire x86 du poste et réutiliser ses mesures GPU.','Cela mélange une architecture incompatible sans dispositif adapté et des performances d’un autre environnement.'),
    option('gpu','Dimensionner le service avec le GPU du poste de départ.','Aucun GPU n’est exposé dans la VM de ce scénario. Sa présence ailleurs ne lui apporte aucune ressource de calcul.') ]}
  ],
  support:[support(15,1,'sections','Exécution native, conteneur et machine virtuelle'),support(15,1,'deepDive','Migrer un service sans transposer ses performances')],
  takeaway:'La portabilité des fichiers, le bon fonctionnement et les performances se vérifient séparément. Les VM peuvent accéder à un GPU dans certaines configurations ; ce scénario n’en expose simplement aucun.'
 }
};
for(const [id,followUp] of Object.entries(existingFollowups))workshopContent[id].followUp=followUp;
export const workshopQuestions=content=>[...(content.questions||[]),...(content.followUp?.questions||[])];
export const memoryVariants={'16':{weights:12.4,quality:98},'8':{weights:6.4,quality:96},'4':{weights:3.5,quality:86}};
export const initialWorkshopValues=id=>id==='budget-memoire'?{precision:'16',context:'2048',sequences:'1'}:Object.fromEntries((workshopContent[id]?.controls||[]).map(control=>[control.id,control.default]));
export function memoryBudget(values){
 const variant=memoryVariants[values.precision]||memoryVariants['16'];
 const context=['2048','8192','16384'].includes(values.context)?Number(values.context):2048;
 const sequences=['1','4','8'].includes(values.sequences)?Number(values.sequences):1;
 const cache=128*context*sequences/1048576;
 return {...variant,context,sequences,cache,buffers:1,total:variant.weights+cache+1,capacity:12};
}
export function workshopValues(id,saved){
 const values=initialWorkshopValues(id);
 if(id==='budget-memoire'){
  for(const [key,allowed] of Object.entries({precision:['16','8','4'],context:['2048','8192','16384'],sequences:['1','4','8']}))if(allowed.includes(saved?.[key]))values[key]=saved[key];
 }else{
  for(const control of workshopContent[id]?.controls||[])if(control.options.some(([value])=>value===saved?.[control.id]))values[control.id]=saved[control.id];
 }
 for(const question of workshopQuestions(workshopContent[id]||{})){
  const v=saved?.[question.id];
  if(question.kind==='number'){if(typeof v==='string')values[question.id]=v.slice(0,40);continue}
  const allowed=question.options.map(option=>option.value);
  if(question.multiple)values[question.id]=Array.isArray(v)?[...new Set(v.filter(x=>allowed.includes(x)))]:[];
  else if(allowed.includes(v))values[question.id]=v;
 }

 return values;
}
export function parseWorkshopNumber(value){
 if(typeof value!=='string'||!/^\d+(?:[.,]\d+)?$/.test(value.trim()))return null;
 const result=Number(value.trim().replace(',','.'));return Number.isFinite(result)?result:null;
}
const fr=value=>value.toLocaleString('fr-FR',{maximumFractionDigits:2});
export const formatMemory=fr;
export function evaluateWorkshop(id,values){
 let special=[];
 if(id==='budget-memoire'){
  const b=memoryBudget(values);
  special=[
   {id:'memory',pass:b.total<=b.capacity,label:'Mémoire du service',message:`${fr(b.weights)} + ${fr(b.cache)} + 1 = ${fr(b.total)} GiB, pour un budget de 12 GiB.`},
   {id:'context',pass:b.context>=8192,label:'Contexte requis',message:`${fr(b.context)} positions par séquence ; au moins 8 192 sont demandées.`},
   {id:'sequences',pass:b.sequences>=4,label:'Conversations simultanées',message:`${b.sequences} séquence(s) ; au moins quatre doivent être possibles.`},
   {id:'quality',pass:b.quality>=94,label:'Qualité sur le test',message:`${b.quality} cas réussis sur 100 ; le minimum fixé est de 94.`}
  ];
 }
 const content=workshopContent[id];if(!content)return [];
 const checks=workshopQuestions(content).map(question=>{
  const value=values[question.id];
  if(question.kind==='number'){
   const number=parseWorkshopNumber(value);
   return {id:question.id,pass:number!==null&&Math.abs(number-question.answer)<=(question.tolerance||0)+1e-9,label:question.label,message:(number===null?'Saisissez un nombre, avec un point ou une virgule pour les décimales. ':'')+question.feedback};
  }
  const expected=question.answerBy?question.answerBy.answers[values[question.answerBy.field]]:question.answer;
  const selected=question.options.filter(option=>question.multiple?Array.isArray(value)&&value.includes(option.value):value===option.value);
  const pass=question.multiple?Array.isArray(value)&&Array.isArray(expected)&&value.length===expected.length&&expected.every(answer=>value.includes(answer)):expected!==undefined&&value===expected;
  const missing=question.multiple?question.options.filter(option=>expected.includes(option.value)&&!selected.includes(option)):[];
  const message=selected.length?selected.map(option=>option.feedback).join(' '):'Choisissez une réponse à partir du scénario et des passages du cours.';
  const correction=!pass&&!question.multiple&&selected.length?question.options.find(option=>option.value===expected):null;
  return {id:question.id,pass,label:question.label,message:message+(missing.length?' À ajouter : '+missing.map(option=>option.label+' '+option.feedback).join(' '):'')+(correction?' Choix attendu : '+correction.label+' '+correction.feedback:'')};
 });
 return [...special,...quantitativeChecks(id,values),...checks];
}

export const thermalTrials={
 cooling:{title:'Refroidissement amélioré, charge inchangée',values:[18,17,17],summary:'À 15 min : 65 °C, 2,3 GHz, 17 tokens/s, aucun signal thermique. Trois répétitions donnent de 16,8 à 17,2 tokens/s. Cela renforce l’hypothèse thermique dans ces conditions.'},
 model:{title:'Modèle plus petit et réponses plus courtes',values:[30,29,28],summary:'À 15 min : 28 tokens/s. Le modèle et la tâche ont changé : ce résultat ne permet pas d’isoler le rôle du refroidissement.'},
 short:{title:'Seulement la première minute',values:[18],summary:'À 1 min : 18 tokens/s. Aucune mesure après échauffement : la performance durable reste inconnue.'}
};
