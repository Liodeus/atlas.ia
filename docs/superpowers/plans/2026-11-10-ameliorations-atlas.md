# Améliorations Atlas IA — plan de réalisation

**Objectif :** corriger les fragilités constatées et guider l’apprentissage sans casser les sauvegardes existantes.

**Architecture :** conserver React et les données existantes, extraire progressivement les comportements partagés, charger les fonctionnalités lourdes à la demande et couvrir les parcours principaux dans un vrai navigateur.

**Contraintes :** aucun compte ni serveur applicatif ; anciennes sauvegardes version 1 compatibles ; contenu technique à ne pas réécrire sans vérification ; ne pas représenter une autoévaluation comme une maîtrise mesurée.

1. Écrire les tests de navigation et corriger les paramètres de cours, avec récupération sur erreur.
2. Guider début et reprise, indiquer l’état des sauvegardes et différencier progression et résultats.
3. Faciliter la révision et les distinctions, et intégrer des vérifications ciblées aux cours.
4. Réduire le chargement initial et améliorer la structure, les dépendances, l’accessibilité et les contrôles automatisés.
5. Vérifier tests, build, parcours mobile/clavier et documenter les limites de validation éditoriale humaine.
