// Le document et les réponses sont fictifs : aucune génération en direct.
export const ragContextContent={
 question:'Peut-on retourner un article personnalisé ?',
 rule:'Les retours sont possibles sous 30 jours.',
 exception:'Les articles personnalisés ne sont pas éligibles.',
 answers:[
  'Oui, les retours sont possibles sous 30 jours.',
  'Les articles personnalisés ne sont pas éligibles au retour selon cette politique.'
 ],
 feedback:[
  'L’exception manque : la réponse illustrée autorise à tort le retour de cet article personnalisé.',
  'L’exception est présente : cette réponse tient compte du cas particulier.'
 ],
 explanation:'Le découpage et la sélection des passages déterminent les informations reçues par le générateur. Ici, conserver la règle avec son exception évite de perdre une information décisive.',
 limitation:'Ces réponses sont préparées pour isoler ce problème. Un modèle réel peut réagir autrement ; ajouter du texte ne garantit pas à lui seul une réponse correcte.'
};
