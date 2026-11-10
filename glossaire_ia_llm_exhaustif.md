# Grand glossaire de l'IA, des LLM et des agents

**Un panorama technique pour reconnaître le vocabulaire des modèles modernes.** Définitions courtes, niveau débutant à avancé. Les termes sont regroupés par famille, et non par ordre alphabétique. ⭐ marque les termes à maîtriser en priorité. Les techniques décrites ne sont pas nécessairement présentes dans tous les modèles.

## 1. Fondamentaux et familles de modèles

- **⭐ IA (Artificial Intelligence)** — ensemble de techniques permettant à des systèmes d'accomplir des tâches associées à l'intelligence.
- **Machine Learning (ML)** — apprentissage de régularités à partir de données plutôt que de règles écrites à la main.
- **Deep Learning (DL)** — apprentissage automatique reposant sur des réseaux de neurones profonds.
- **⭐ LLM (Large Language Model)** — grand modèle conçu pour traiter et générer du langage.
- **SLM (Small Language Model)** — modèle de langage relativement compact, souvent moins coûteux à exécuter.
- **AGI (Artificial General Intelligence)** — idée d'une IA capable d'accomplir de manière générale une large variété de tâches cognitives ; définition discutée.
- **ASI (Artificial Superintelligence)** — notion hypothétique d'une IA dépassant largement les capacités humaines dans de nombreux domaines.
- **Foundation Model** — modèle préentraîné polyvalent servant de base à de nombreux usages.
- **⭐ Generative AI (GenAI)** — IA produisant du contenu : texte, code, images, audio ou vidéo.
- **NLP (Natural Language Processing)** — traitement automatique du langage naturel.
- **NLU (Natural Language Understanding)** — tâches visant à interpréter le sens du langage.
- **NLG (Natural Language Generation)** — génération automatique de texte.
- **⭐ Transformer** — architecture neuronale reposant notamment sur l'attention.
- **GPT (Generative Pre-trained Transformer)** — appellation d'une famille de modèles Transformer génératifs préentraînés.
- **Base Model** — modèle de base, généralement avant son adaptation au dialogue et aux instructions.
- **⭐ Instruct Model** — modèle adapté pour suivre les consignes des utilisateurs.
- **Chat Model** — modèle optimisé pour des échanges conversationnels.
- **Test-Time Compute** — ressources de calcul supplémentaires mobilisées pendant la résolution d'une requête.
- **Inference-Time Scaling** — amélioration possible des performances en augmentant le calcul ou les essais pendant l'inférence.
- **Verifier Model** — modèle ou système chargé d'évaluer la validité d'une solution candidate.
- **Reasoning Model** — modèle ou système optimisé pour des tâches nécessitant plusieurs étapes de résolution.
- **Code Model** — modèle spécialisé pour produire, compléter ou analyser du code.
- **Embedding Model** — modèle qui transforme une entrée en représentation vectorielle.
- **Reranker Model** — modèle qui reclasse des résultats déjà récupérés selon leur pertinence.
- **Reward Model** — modèle apprenant à attribuer un score à des réponses ou comportements.
- **Multimodal Model** — modèle traitant plusieurs modalités, par exemple texte et image.
- **VLM (Vision-Language Model)** — modèle combinant compréhension visuelle et langage.
- **VLA (Vision-Language-Action)** — modèle reliant perception, langage et actions, notamment en robotique.
- **World Model** — modèle apprenant une représentation de l'évolution d'un environnement.
- **Autoregressive Model** — modèle générant les éléments d'une séquence conditionnellement aux précédents.
- **Encoder-only Model** — architecture centrée sur l'encodage d'une entrée, souvent utile à la classification.
- **Decoder-only Model** — architecture fréquemment utilisée pour générer du texte token après token.
- **Encoder-Decoder / Seq2Seq** — architecture qui encode une entrée puis génère une sortie correspondante.
- **Dense Model** — modèle où les composants concernés sont généralement activés pour chaque token, par opposition à un routage sparse.

## 2. Anatomie d'un réseau et d'un Transformer

- **⭐ Parameter / Weight (paramètre / poids)** — valeur numérique apprise pendant l'entraînement.
- **Bias (biais numérique)** — paramètre additif d'une couche ; à distinguer d'un biais sociétal.
- **Layer (couche)** — étape de transformation dans un réseau neuronal.
- **Hidden State** — représentation interne calculée à une étape du modèle.
- **Hidden Dimension / d_model** — taille des vecteurs internes du Transformer.
- **Activation** — sortie numérique d'un neurone ou d'une couche.
- **Activation Function** — fonction non linéaire appliquée aux valeurs du réseau.
- **ReLU** — fonction d'activation qui remplace les valeurs négatives par zéro.
- **GELU** — fonction d'activation lisse très utilisée dans les Transformers.
- **SiLU / Swish** — autre fonction d'activation présente dans de nombreux modèles.
- **SwiGLU** — mécanisme de couche feed-forward utilisant des portes et une activation de type Swish.
- **⭐ FFN / MLP (Feed-Forward Network)** — sous-réseau traitant les représentations des tokens après l'attention.
- **Residual Connection / Skip Connection** — chemin qui additionne l'entrée d'un bloc à sa sortie.
- **LayerNorm** — normalisation des activations au sein d'une couche.
- **RMSNorm** — variante de normalisation fondée sur la moyenne quadratique.
- **Pre-Norm / Post-Norm** — position de la normalisation avant ou après un sous-bloc.
- **Softmax** — transformation de scores en distribution de valeurs positives normalisées.
- **Logit** — score brut produit avant conversion en probabilité.
- **Embedding Layer** — table ou transformation associant chaque token à un vecteur.
- **Positional Encoding** — mécanisme signalant l'ordre ou la position des tokens.
- **⭐ RoPE (Rotary Position Embedding)** — encodage positionnel utilisant des rotations des vecteurs Q et K.
- **ALiBi** — mécanisme ajoutant des biais dépendant de la distance entre positions d'attention.
- **YaRN** — méthode d'extension de contexte fondée sur l'adaptation de l'encodage RoPE.
- **Attention Head** — tête d'attention apprenant une certaine manière de relier des positions.
- **Projection Matrix** — matrice qui transforme les représentations vers d'autres espaces, par exemple Q, K ou V.
- **⭐ Q / K / V (Query, Key, Value)** — trois projections utilisées pour calculer et agréger l'attention.
- **Weight Tying** — partage de certains poids, notamment entre embeddings d'entrée et sortie.
- **Vocabulary Head / LM Head** — projection des états internes vers les scores des tokens du vocabulaire.
- **Mechanistic Interpretability** — recherche visant à comprendre les mécanismes internes responsables des comportements d'un modèle.
- **Sparse Autoencoder (SAE)** — autoencodeur encourageant une représentation clairsemée, utilisé notamment pour analyser les activations internes.
- **Superposition** — encodage de plusieurs caractéristiques dans des directions qui se chevauchent dans les représentations.
- **Steering Vector / Activation Steering** — modification contrôlée de certaines activations pour influencer le comportement d'un modèle.
- **Representation Learning** — apprentissage de caractéristiques internes utiles à diverses tâches.

## 3. Attention, contexte long et architectures alternatives

- **⭐ Attention** — mécanisme permettant à des positions d'une séquence de pondérer l'information d'autres positions.
- **⭐ Self-Attention** — attention entre des positions d'une même séquence.
- **Cross-Attention** — attention d'une séquence vers les représentations d'une autre, ou d'une autre modalité.
- **⭐ Full / Dense Attention** — attention calculée sur toutes les positions autorisées par le masque.
- **Context Length Extrapolation** — emploi d'un modèle sur une séquence plus longue que celle généralement vue à l'entraînement.
- **⭐ Sparse Attention** — attention limitée à certaines connexions entre positions ; ses gains réels dépendent de son implémentation.
- **Local Attention** — chaque token prête attention principalement aux positions proches.
- **Sliding Window Attention (SWA)** — attention causale limitée à une fenêtre récente glissante.
- **Global Attention** — certaines positions disposent de connexions vers un grand nombre d'autres positions.
- **Block-Sparse Attention** — sélection de blocs de positions plutôt que de connexions individuelles.
- **Strided Attention** — attention suivant un motif de positions régulièrement espacées.
- **Dilated Attention** — attention échantillonnant des positions à différents intervalles.
- **Dynamic Sparse Attention** — motifs clairsemés déterminés dynamiquement selon les entrées ou les scores.
- **⭐ Causal Attention** — empêche une position de consulter les tokens futurs lors de la prédiction autorégressive.
- **Bidirectional Attention** — une position peut consulter celles situées des deux côtés quand la tâche le permet.
- **Attention Mask** — matrice ou règle interdisant certaines connexions d'attention.
- **Attention Score** — mesure de compatibilité calculée entre une requête Q et une clé K.
- **Scaled Dot-Product Attention** — calcul d'attention fondé sur des produits scalaires normalisés.
- **⭐ Multi-Head Attention (MHA)** — plusieurs têtes d'attention apprennent des relations en parallèle.
- **Multi-Query Attention (MQA)** — plusieurs têtes de requêtes partagent une seule tête K/V.
- **⭐ Grouped-Query Attention (GQA)** — plusieurs groupes de requêtes partagent les têtes K/V pour économiser des ressources.
- **⭐ Multi-Head Latent Attention (MLA)** — mécanisme comprimant des représentations liées aux clés/valeurs dans un espace latent.
- **Linear Attention** — famille de méthodes modifiant le calcul de l'attention pour tendre vers un coût linéaire en longueur de séquence.
- **⭐ FlashAttention** — algorithme exact d'attention optimisé pour réduire les mouvements de données en mémoire ; pas synonyme de sparse attention.
- **PagedAttention** — technique de gestion de la mémoire du KV cache par blocs, utilisée pour servir les LLM.
- **Attention Sink** — positions initiales absorbant souvent une part importante de l'attention, utiles à certaines stratégies de cache.
- **Ring Attention** — calcul distribué de l'attention avec circulation de blocs entre accélérateurs.
- **Long-Context Model** — modèle conçu pour accepter de longues séquences de tokens.
- **Context Extension** — techniques augmentant la taille de contexte exploitable par un modèle.
- **Context Rot / Lost in the Middle** — dégradation possible de l'exploitation d'informations dans des contextes longs.
- **⭐ SSM (State Space Model)** — famille de modèles séquentiels utilisant un état interne plutôt qu'une attention complète classique.
- **Mamba** — architecture séquentielle utilisant des modèles d'état sélectifs.
- **Hybrid Architecture** — modèle combinant plusieurs mécanismes, comme attention et SSM.
- **Recurrent Neural Network (RNN)** — réseau traitant une séquence via un état transmis d'une étape à la suivante.
- **LSTM** — type de RNN avec portes pour préserver des informations sur de longues périodes.

## 4. MoE, experts, routage et sparsité

- **⭐ MoE (Mixture of Experts)** — architecture combinant plusieurs sous-réseaux « experts » et un mécanisme de sélection.
- **⭐ Sparse MoE** — MoE qui n'active qu'une partie des experts disponibles pour chaque token ou élément traité.
- **Dense MoE** — variante combinant potentiellement tous les experts à chaque entrée.
- **Expert** — sous-réseau spécialisé, souvent une couche FFN, sélectionné par le routeur.
- **⭐ Router / Gating Network** — réseau qui choisit et pondère les experts sollicités.
- **Top-k Routing** — sélection des k experts les mieux notés pour une entrée.
- **Top-1 / Top-2 Routing** — activation respectivement d'un ou de deux experts.
- **Shared Expert** — expert actif pour de nombreux tokens en plus d'experts routés.
- **Routed Expert** — expert sélectionné conditionnellement par le routeur.
- **Expert Parallelism** — répartition des experts d'un MoE sur plusieurs accélérateurs.
- **Load Balancing Loss** — terme d'entraînement favorisant une répartition équilibrée entre experts.
- **Expert Collapse** — situation où le routeur utilise trop peu d'experts.
- **Capacity Factor** — paramètre contrôlant la capacité d'accueil des experts dans certains MoE.
- **Token Dropping** — abandon éventuel de tokens lors d'une surcharge de capacité d'experts.
- **Active Parameters** — paramètres réellement utilisés pour un calcul ou un token donné.
- **Total Parameters** — ensemble des paramètres du modèle, activés ou non à chaque passage.
- **Conditional Computation** — calcul exécuté seulement pour certaines entrées ou selon une décision de routage.
- **Sparsity** — propriété selon laquelle certaines connexions, activations ou valeurs sont nulles ou non utilisées.
- **Pruning** — suppression de paramètres, connexions ou structures jugés peu utiles.

## 5. Tokenisation, génération et fenêtres de contexte

- **⭐ Token** — unité de texte, de code ou parfois d'une autre modalité traitée par le modèle.
- **⭐ Tokenizer** — programme convertissant des entrées en identifiants de tokens.
- **Tokenization** — opération de découpage et de codage en tokens.
- **Subword Tokenization** — découpage en unités plus petites que les mots entiers.
- **BPE (Byte Pair Encoding)** — méthode courante d'apprentissage d'un vocabulaire de sous-mots.
- **SentencePiece** — boîte à outils de tokenisation indépendante d'un découpage préalable en mots.
- **Vocabulary / Vocab Size** — ensemble des tokens reconnus et sa taille.
- **Special Token** — token réservé à un rôle de formatage ou de contrôle.
- **BOS / EOS** — tokens de début et de fin de séquence.
- **PAD Token** — token servant à compléter artificiellement des séquences dans un lot.
- **Chat Template** — convention de sérialisation des rôles et des messages pour un modèle de chat.
- **⭐ Context Window** — capacité maximale en tokens du contexte traité, avec une répartition entrée/sortie variable selon le système.
- **Prompt Tokens / Completion Tokens** — tokens de l'entrée et tokens générés en sortie.
- **⭐ Prefill** — phase de traitement du prompt avant la génération des nouveaux tokens.
- **⭐ Decode** — phase générant les tokens successivement à partir de l'état courant.
- **Next-Token Prediction** — prédiction d'une distribution sur le token suivant.
- **Log Probability / Logprob** — logarithme de la probabilité attribuée à une sortie.
- **⭐ Temperature** — paramètre contrôlant la dispersion de la distribution d'échantillonnage.
- **Top-k Sampling** — tirage limité aux k tokens les mieux notés.
- **⭐ Top-p / Nucleus Sampling** — tirage parmi le plus petit ensemble de tokens dépassant un seuil de probabilité cumulée.
- **Greedy Decoding** — choix du token le plus probable à chaque étape.
- **Beam Search** — exploration de plusieurs suites candidates de génération.
- **Repetition Penalty** — mécanisme pénalisant la répétition de tokens ou séquences.
- **Frequency / Presence Penalty** — réglages ajustant la probabilité de tokens déjà présents.
- **Stop Sequence** — séquence qui provoque l'arrêt de génération.
- **Streaming** — transmission progressive des tokens au lieu d'attendre la sortie entière.
- **Determinism / Seed** — contrôle partiel de la reproductibilité de la génération ; non garanti entre tous environnements.
- **Logit Bias** — modification directe de scores de tokens particuliers avant échantillonnage.

## 6. Entraînement, données et optimisation

- **⭐ Pretraining (préentraînement)** — apprentissage initial du modèle sur un grand corpus.
- **Training Dataset / Corpus** — ensemble de documents ou d'exemples utilisés pour l'apprentissage.
- **Self-Supervised Learning** — apprentissage avec des cibles construites à partir des données elles-mêmes.
- **Supervised Learning** — apprentissage à partir d'exemples accompagnés de réponses ou étiquettes de référence.
- **Unsupervised Learning** — apprentissage de structures sans étiquettes de référence explicites.
- **Policy (politique)** — règle ou modèle donnant une distribution d'actions à choisir dans un état.
- **Reinforcement Learning (RL)** — apprentissage visant à optimiser des récompenses au fil de décisions.
- **Epoch** — passage sur une fois l'ensemble de données considéré.
- **Batch / Mini-batch** — ensemble d'exemples traités conjointement.
- **Batch Size** — nombre d'exemples regroupés dans un lot.
- **Gradient** — indication mathématique de la façon de modifier les paramètres pour réduire une perte.
- **⭐ Backpropagation** — calcul des gradients à travers les couches du réseau.
- **Gradient Descent** — mise à jour de paramètres dans une direction réduisant la perte.
- **Gradient Accumulation** — accumulation de gradients sur plusieurs micro-lots avant mise à jour.
- **Optimizer** — algorithme mettant à jour les paramètres à partir des gradients.
- **Adam / AdamW** — optimiseurs adaptatifs courants, AdamW séparant la décroissance des poids.
- **⭐ Learning Rate** — amplitude des mises à jour des paramètres.
- **Learning Rate Schedule** — évolution programmée du taux d'apprentissage.
- **Warmup** — période initiale où le taux d'apprentissage augmente progressivement.
- **Loss Function** — objectif chiffré que l'entraînement cherche à minimiser.
- **Cross-Entropy Loss** — perte souvent utilisée pour prédire des tokens ou des classes.
- **Perplexity** — mesure de performance probabiliste d'un modèle de langage sur des données.
- **Regularization** — techniques limitant le surapprentissage ou favorisant des solutions robustes.
- **Dropout** — désactivation aléatoire de certaines activations pendant l'entraînement.
- **Weight Decay** — pénalisation favorisant des poids moins grands.
- **⭐ Overfitting** — apprentissage trop spécifique aux données d'entraînement, au détriment de la généralisation.
- **Underfitting** — modèle insuffisamment adapté aux données d'entraînement.
- **Generalization** — capacité à fonctionner sur des exemples non vus.
- **Train / Validation / Test Split** — séparation des données pour apprentissage, réglage et évaluation finale.
- **Data Deduplication** — élimination de doublons dans un corpus.
- **Data Contamination** — présence d'exemples d'évaluation dans les données d'entraînement ou d'adaptation.
- **Data Curation** — sélection, nettoyage et préparation des exemples.
- **Synthetic Data** — données créées artificiellement, souvent avec un autre modèle.
- **Scaling Laws** — relations empiriques entre taille du modèle, données, calcul et performance.
- **Compute-Optimal Training** — recherche d'un équilibre efficace entre ressources, taille du modèle et volume de données.
- **FLOP / FLOPs** — opération flottante / nombre de ces opérations, indicateur de calcul.
- **Checkpoint** — état sauvegardé du modèle pendant ou après l'entraînement.

## 7. Adaptation, post-training et alignement

- **⭐ Fine-tuning** — adaptation d'un modèle préentraîné à de nouvelles données ou tâches.
- **Full Fine-tuning** — mise à jour de la quasi-totalité ou de la totalité des paramètres.
- **⭐ SFT (Supervised Fine-Tuning)** — adaptation supervisée sur des exemples de consignes et de bonnes réponses.
- **Instruction Tuning** — entraînement destiné à améliorer le respect de consignes.
- **Continued Pretraining** — poursuite du préentraînement sur un nouveau corpus ou domaine.
- **Domain Adaptation** — adaptation à un secteur ou un type de données particulier.
- **⭐ PEFT (Parameter-Efficient Fine-Tuning)** — méthodes n'entraînant qu'une petite partie des paramètres ou des modules ajoutés.
- **⭐ LoRA (Low-Rank Adaptation)** — adaptation par matrices supplémentaires de faible rang.
- **⭐ QLoRA** — adaptation de type LoRA avec modèle de base quantifié pour économiser la mémoire.
- **Adapter** — petit module entraînable ajouté à un modèle généralement gelé.
- **Prompt Tuning / Soft Prompt** — adaptation via vecteurs de prompt appris, différents d'un prompt texte.
- **Prefix Tuning** — adaptation par états de préfixe entraînables injectés dans des couches.
- **Model Merging** — combinaison de poids ou d'adaptations provenant de plusieurs modèles.
- **⭐ Knowledge Distillation** — transfert de comportements d'un modèle professeur vers un modèle élève.
- **Teacher / Student Model** — modèle de référence et modèle qui apprend de ses sorties.
- **Alignment** — ajustement du comportement d'un modèle selon des objectifs et préférences souhaités.
- **⭐ RLHF (Reinforcement Learning from Human Feedback)** — optimisation utilisant des signaux de préférence humaine et de l'apprentissage par renforcement.
- **RLAIF** — utilisation de retours produits par une IA plutôt que par des humains pour guider l'optimisation.
- **RLVR (Reinforcement Learning with Verifiable Rewards)** — apprentissage par renforcement guidé par des vérifications automatiques, par exemple tests de code ou réponses calculables.
- **Process Reward Model (PRM)** — modèle qui évalue des étapes intermédiaires plutôt que seulement le résultat final.
- **Outcome Reward Model (ORM)** — modèle qui évalue principalement le résultat final d'une tentative.
- **⭐ DPO (Direct Preference Optimization)** — optimisation directe sur des paires de réponses préférées et rejetées.
- **PPO (Proximal Policy Optimization)** — algorithme d'apprentissage par renforcement utilisé dans certains post-entraînements.
- **GRPO (Group Relative Policy Optimization)** — optimisation par groupes de réponses utilisant des récompenses relatives.
- **ORPO** — méthode de préférence combinant une perte supervisée et un terme fondé sur les rapports de chances.
- **Preference Dataset** — ensemble de comparaisons exprimant quelle réponse est préférée.
- **Reward Hacking** — comportement optimisant une mesure de récompense sans atteindre réellement le but.
- **Reward Shaping** — conception de récompenses intermédiaires pour guider l'apprentissage.
- **Constitutional AI** — approche d'entraînement où des principes explicites guident l'évaluation ou la révision des réponses.
- **Human-in-the-Loop (HITL)** — intervention humaine à des étapes clés du processus.
- **Post-training** — ensemble des étapes d'adaptation du modèle après le préentraînement initial.
- **Alignment Tax / Capability Trade-off** — possible coût de performance associé à certaines contraintes de comportement.
- **Machine Unlearning** — techniques visant à réduire ou retirer l'influence d'une partie des données apprises.
- **Catastrophic Forgetting** — perte de certaines compétences lors d'une adaptation sur de nouvelles données.

## 8. Inférence, optimisation, mémoire et performances

- **⭐ Inference (inférence)** — exécution d'un modèle entraîné pour produire une prédiction ou une réponse.
- **⭐ Quantization (quantification)** — représentation de poids ou activations avec moins de bits pour réduire le coût matériel.
- **FP32 / FP16 / BF16** — formats numériques à virgule flottante utilisés pour stocker et calculer.
- **FP8 / FP4** — formats flottants plus compacts utilisés dans certaines optimisations matérielles.
- **INT8 / INT4** — formats entiers sur 8 ou 4 bits souvent employés en quantification.
- **PTQ (Post-Training Quantization)** — quantification appliquée après l'entraînement.
- **QAT (Quantization-Aware Training)** — entraînement tenant compte des effets de la quantification.
- **AWQ (Activation-Aware Weight Quantization)** — méthode de quantification des poids utilisant l'information des activations.
- **GPTQ** — famille de méthodes de quantification post-entraînement des poids de LLM.
- **GGUF** — format de fichiers utilisé notamment pour distribuer et charger des modèles quantifiés localement.
- **ONNX** — format d'échange de graphes de modèles et écosystème d'exécution associé.
- **⭐ KV Cache (Key-Value Cache)** — conservation des clés et valeurs d'attention pour éviter de les recalculer à chaque token.
- **Prefix Caching** — réutilisation du calcul d'un préfixe identique entre plusieurs requêtes.
- **Prompt Caching** — mise en cache de parties d'entrées pour économiser du calcul selon le fournisseur.
- **KV Cache Quantization** — compression numérique des entrées du cache K/V.
- **KV Cache Offloading** — déplacement de tout ou partie du cache hors de la mémoire accélérateur.
- **⭐ Speculative Decoding** — génération de tokens candidats par un modèle rapide puis validation par un modèle cible.
- **Draft Model** — petit modèle proposant les tokens candidats en speculative decoding.
- **⭐ Continuous Batching** — regroupement dynamique de requêtes actives pendant la génération.
- **Dynamic Batching** — création de lots à la volée selon les requêtes reçues.
- **Chunked Prefill** — découpage du traitement du prompt en morceaux planifiables.
- **Disaggregated Prefill / Decode** — exécution des deux phases sur des ressources séparées.
- **⭐ TTFT (Time To First Token)** — délai avant l'arrivée du premier token généré.
- **TTLT (Time To Last Token)** — délai jusqu'au dernier token généré.
- **⭐ Tokens per Second (TPS)** — débit de production des tokens, souvent exprimé par requête.
- **Throughput** — volume total de travail traité par unité de temps.
- **Latency** — temps pris par une requête ou une partie de son traitement.
- **P50 / P95 / P99 Latency** — percentiles des temps de réponse, utiles pour mesurer les cas lents.
- **Concurrency** — nombre de requêtes pouvant être traitées simultanément.
- **Tail Latency** — latence des requêtes les plus lentes.
- **Batch Size at Inference** — nombre d'entrées traitées ensemble pendant le service.
- **Memory Bandwidth** — vitesse de transfert vers ou depuis la mémoire, souvent cruciale pour le décodage.
- **Compute-Bound / Memory-Bound** — tâche limitée principalement par la puissance de calcul ou par les accès mémoire.
- **⭐ Model Serving** — mise à disposition d'un modèle pour répondre à des requêtes.
- **Inference Engine** — logiciel exécutant efficacement les calculs de génération.
- **Kernel Fusion** — combinaison d'opérations bas niveau pour limiter les transferts et surcoûts.
- **CUDA Kernel** — fonction de calcul exécutée sur GPU NVIDIA avec CUDA.
- **Compilation / Graph Optimization** — transformation du graphe de calcul pour accélérer l'exécution.
- **Weight-Only Quantization** — quantification des poids tout en conservant d'autres calculs à une précision plus élevée.- **Pruning** — suppression de structures peu utiles pour tenter d'alléger le modèle.
- **Offloading** — placement de certains poids ou caches sur CPU, disque ou autre mémoire.

## 9. Embeddings, moteurs de recherche et RAG

- **⭐ RAG (Retrieval-Augmented Generation)** — récupération de sources externes pertinentes avant de générer une réponse.
- **Retrieval** — recherche de passages ou documents candidats.
- **⭐ Embedding** — vecteur représentant une entrée dans un espace numérique.
- **Embedding Space** — espace où des vecteurs peuvent être comparés selon leur proximité.
- **⭐ Vector Database** — base ou moteur optimisé pour stocker et interroger des vecteurs.
- **Semantic Search** — recherche fondée sur la proximité de sens plutôt que sur les seuls mots exacts.
- **Keyword Search** — recherche par correspondance de termes.
- **BM25** — méthode classique de classement de documents selon les mots de la requête.
- **RRF (Reciprocal Rank Fusion)** — fusion de plusieurs listes de résultats à partir de leurs rangs plutôt que de scores absolus.
- **MMR (Maximal Marginal Relevance)** — sélection favorisant la pertinence et la diversité des résultats récupérés.
- **⭐ Hybrid Search** — combinaison de recherche lexicale et vectorielle.
- **Cosine Similarity** — mesure de proximité fondée sur l'angle entre deux vecteurs.
- **Dot Product** — produit scalaire utilisé comme score de similarité ou d'attention.
- **Nearest Neighbor Search (kNN)** — recherche des k vecteurs les plus proches.
- **⭐ ANN (Approximate Nearest Neighbor)** — recherche approximative de voisins proches, souvent plus rapide à grande échelle.
- **HNSW** — structure de graphe efficace pour la recherche approximative de voisins.
- **IVF (Inverted File Index)** — indexation vectorielle partitionnant l'espace en groupes.
- **Metadata Filtering** — filtrage de documents selon des attributs non vectoriels.
- **⭐ Chunking** — découpage de documents en passages indexables.
- **Chunk Size / Overlap** — longueur des passages et répétition entre passages adjacents.
- **Parent-Child Retrieval** — recherche de petits passages puis restitution d'un contexte parent plus large.
- **⭐ Reranking** — reclassement des candidats récupérés avec un modèle souvent plus précis.
- **Late Interaction / ColBERT** — approche de recherche combinant tardivement les représentations des tokens de requête et de document.
- **Cross-Encoder** — modèle évaluant conjointement une requête et un document pour la pertinence.
- **Bi-Encoder** — modèle encodant séparément une requête et un document en vecteurs comparables.
- **Query Rewriting** — reformulation d'une question pour améliorer la recherche.
- **Query Expansion** — enrichissement d'une requête par des termes connexes.
- **Multi-Query Retrieval** — plusieurs recherches reformulées pour couvrir davantage de documents.
- **HyDE (Hypothetical Document Embeddings)** — recherche à partir d'un document hypothétique généré pour la requête.
- **⭐ Grounding** — ancrage d'une réponse dans des éléments externes vérifiables.
- **Attribution / Citation Grounding** — rattachement explicite d'affirmations à des sources identifiées.
- **Knowledge Graph** — représentation de faits sous forme d'entités et de relations.
- **GraphRAG** — approche de RAG exploitant un graphe de connaissances ou de relations.
- **Agentic RAG** — recherche documentaire orchestrée par un agent qui choisit ses étapes.
- **Retrieval Recall / Precision** — capacité de récupération à trouver les bons documents, avec peu d'intrus.
- **Contextual Compression** — réduction de passages récupérés à l'information pertinente.
- **Index Freshness** — caractère récent des documents présents dans l'index de recherche.
- **Embedding Drift** — changement de caractéristiques des représentations affectant les comparaisons dans le temps.

## 10. Prompts, consignes et formats de sortie

- **⭐ Prompt** — entrée envoyée au modèle pour orienter sa réponse.
- **⭐ Prompt Engineering** — conception et amélioration de prompts pour une tâche.
- **System Message / System Prompt** — instructions de haut niveau définissant le cadre de l'assistant.
- **Developer Message** — consignes applicatives distinctes de la requête finale de l'utilisateur.
- **User Message** — demande ou contenu fourni par l'utilisateur.
- **Few-Shot Prompting** — présentation de quelques exemples de la tâche attendue.
- **Zero-Shot Prompting** — demande sans exemple fourni dans le prompt.
- **One-Shot Prompting** — demande accompagnée d'un unique exemple.
- **In-Context Learning (ICL)** — adaptation du comportement à partir des exemples inclus dans le contexte, sans changer les poids.
- **⭐ Chain-of-Thought (CoT)** — raisonnement explicité en étapes ; ne garantit pas que l'explication reflète le calcul interne.
- **Self-Consistency** — comparaison de plusieurs réponses ou parcours pour améliorer un choix final.
- **Tree of Thoughts (ToT)** — exploration structurée de plusieurs pistes de raisonnement.
- **Prompt Chaining** — enchaînement de plusieurs prompts ou appels de modèles.
- **⭐ Structured Output** — réponse contrainte à une structure attendue, telle qu'un objet JSON.
- **JSON Schema** — description formelle des champs et types attendus en JSON.
- **Constrained Decoding** — génération limitée aux continuations conformes à des règles ou un schéma.
- **Grammar-Constrained Generation** — génération validée par une grammaire explicite.
- **Tool Schema** — description formelle des paramètres d'un outil accessible à un modèle.
- **Context Engineering** — conception des données, outils et instructions réellement placés dans le contexte.
- **Prompt Template** — modèle réutilisable de prompt avec variables.
- **Guardrail** — contrôle applicatif de conformité, sécurité ou format placé autour de l'usage du modèle.

## 11. Agents, outils et orchestration

- **⭐ AI Agent** — système qui utilise un modèle pour décider de certaines étapes et exécuter des actions via des outils.
- **Agentic Workflow** — processus dans lequel un agent planifie, agit et adapte son exécution.
- **⭐ Tool Calling / Function Calling** — demande structurée d'exécution d'un outil externe.
- **Tool Result / Tool Output** — résultat renvoyé par un outil, à traiter comme une donnée externe potentiellement non fiable.
- **Planner** — composant qui décompose un objectif en sous-tâches.
- **Executor** — composant qui réalise les actions ou appels prévus.
- **Orchestrator** — composant organisant les étapes, agents et outils.
- **⭐ ReAct** — schéma de fonctionnement alternant réflexion, action et observation.
- **Observe–Act Loop** — cycle répétant observation de l'environnement et action.
- **Multi-Agent System** — système coordonnant plusieurs agents.
- **Supervisor Agent** — agent qui délègue et supervise d'autres agents.
- **Sub-Agent** — agent spécialisé appelé par un agent ou orchestrateur principal.
- **Handoff** — transfert de responsabilité ou de contexte vers un autre agent.
- **Tool Router** — composant déterminant quel outil doit recevoir une requête.
- **Model Router / Model Cascading** — sélection du modèle le plus approprié en fonction d'une requête.
- **A2A (Agent-to-Agent)** — famille de conventions ou protocoles pour faire communiquer des agents entre eux.
- **Computer Use** — capacité d'un agent à interagir avec une interface graphique en cliquant et en saisissant du texte.
- **⭐ MCP (Model Context Protocol)** — protocole pour connecter des applications d'IA à des outils et sources de contexte.
- **Plugin / Connector** — intégration donnant accès à une application ou un système externe.
- **Skill** — procédure ou capacité réutilisable mise à disposition d'un agent.
- **Agent Memory** — stockage d'informations utiles sur plusieurs étapes ou interactions.
- **Short-Term Memory** — état de travail et contexte récent.
- **Long-Term Memory** — conservation durable d'informations pour des interactions futures.
- **Episodic Memory** — stockage d'événements ou d'interactions passés.
- **Semantic Memory** — stockage de faits ou de connaissances abstraites.
- **Human Approval / Human-in-the-Loop** — validation humaine avant une action sensible.
- **Sandbox** — environnement isolant l'exécution de code ou d'outils.
- **Idempotency** — propriété d'une opération répétée sans effet additionnel indésirable.
- **Workflow State** — représentation de l'avancement et des résultats intermédiaires d'un processus.
- **Rollback** — retour à un état antérieur après une action ou un échec.

## 12. Évaluation, qualité, métriques et limites

- **SOTA (State of the Art)** — meilleur niveau connu dans un domaine ou sur un test précis à un instant donné.
- **⭐ Benchmark** — jeu d'épreuves standardisé pour comparer des modèles ou systèmes.
- **⭐ Eval / Evaluation Harness** — protocole ou logiciel qui exécute et mesure des tests de modèles.
- **Ground Truth** — référence considérée comme correcte pour évaluer une sortie.
- **Golden Dataset** — ensemble d'exemples de référence validés.
- **Hallucination** — génération d'une affirmation non fondée ou fausse, présentée comme plausible.
- **Factuality** — exactitude factuelle d'une sortie.
- **Faithfulness** — fidélité d'une réponse aux sources ou preuves fournies.
- **Helpfulness** — utilité de la réponse pour l'objectif de l'utilisateur.
- **Robustness** — capacité à maintenir un comportement correct malgré des perturbations.
- **Calibration** — correspondance entre niveaux de confiance et fréquences réelles de réussite.
- **Confidence Score** — estimation de confiance, qui peut être mal calibrée.
- **⭐ Accuracy** — proportion de prédictions exactes parmi les cas évalués.
- **Precision** — parmi les prédictions positives, proportion réellement positive.
- **Recall / Rappel** — parmi les vrais cas positifs, proportion correctement retrouvée.
- **⭐ F1 Score** — moyenne harmonique de précision et de rappel.
- **False Positive (FP)** — cas annoncé positif alors qu'il ne l'est pas.
- **False Negative (FN)** — cas positif passé inaperçu.
- **Confusion Matrix** — tableau des erreurs et succès de classification.
- **Pass@k** — proportion de tâches réussies lorsqu'on considère jusqu'à k tentatives.
- **Exact Match (EM)** — proportion de réponses correspondant exactement à la référence.
- **BLEU / ROUGE** — métriques de similarité textuelle historiquement utilisées en traduction ou résumé.
- **Semantic Similarity** — proximité de sens entre deux textes.
- **⭐ LLM-as-a-Judge** — utilisation d'un autre modèle pour noter une réponse ou une interaction.
- **Pairwise Evaluation** — comparaison de deux réponses plutôt qu'une note absolue.
- **Human Evaluation** — appréciation directe par des évaluateurs humains.
- **A/B Testing** — comparaison de versions sur des groupes ou des flux distincts.
- **Model Collapse** — dégradation possible quand l'entraînement réutilise excessivement des sorties synthétiques de modèles.
- **Data Leakage** — fuite d'informations entre entraînement, réglage et évaluation.
- **Distribution Shift** — changement entre les données rencontrées et celles utilisées lors du développement.
- **OOD (Out-of-Distribution)** — données situées hors de la distribution habituelle d'entraînement.
- **Regression Test** — test vérifiant qu'une modification n'a pas détérioré un comportement antérieur.
- **Red Team Evaluation** — tests adversariaux cherchant à provoquer des comportements problématiques.
- **Pareto Frontier** — ensemble des compromis non dominés, par exemple qualité contre coût et latence.

## 13. Sécurité, sûreté et confidentialité des LLM

- **⭐ Prompt Injection** — tentative de détourner les instructions d'un modèle via un contenu contrôlé par un attaquant.
- **Direct Prompt Injection** — attaque insérée directement dans une entrée adressée au système.
- **⭐ Indirect Prompt Injection** — instructions hostiles cachées dans une source externe lue par le modèle.
- **Jailbreak** — contournement tenté des restrictions comportementales d'un modèle.
- **System Prompt Leakage** — exposition d'instructions internes censées rester non publiques.
- **Data Exfiltration** — sortie non autorisée d'informations vers une destination externe.
- **⭐ Least Privilege (moindre privilège)** — donner à chaque composant uniquement les permissions nécessaires.
- **Trust Boundary** — frontière entre contenu/instructions de niveaux de confiance différents.
- **Untrusted Input** — donnée externe qui ne doit pas devenir une instruction privilégiée.
- **Tool Output Injection** — injection placée dans la réponse d'un outil consommée par l'agent.
- **RAG Poisoning** — modification hostile des documents ou résultats utilisés comme sources RAG.
- **Data Poisoning** — altération malveillante des données d'entraînement ou d'adaptation.
- **Model Poisoning** — modification malveillante d'un modèle ou de ses poids.
- **Backdoor / Trigger** — comportement caché activé par une condition particulière.
- **Model Extraction** — tentative de reproduire ou dérober le fonctionnement d'un modèle via ses interfaces.
- **Model Inversion** — tentative d'inférer des caractéristiques des données d'entraînement depuis un modèle.
- **Membership Inference** — estimation de la présence d'un exemple dans les données d'entraînement.
- **Sensitive Information Disclosure** — divulgation d'informations privées ou confidentielles.
- **PII (Personally Identifiable Information)** — données permettant d'identifier une personne.
- **Secret Management** — gestion sécurisée des clés, tokens et identifiants d'accès.
- **⭐ Excessive Agency** — permissions, autonomie ou capacités trop larges accordées à un agent.
- **Improper Output Handling** — absence de validation de la sortie avant son emploi par un système aval.
- **Output Validation** — vérification de la structure, du contenu et de la sûreté des sorties.
- **Content Filtering** — détection ou blocage de contenus selon des règles.
- **Moderation** — classification ou traitement de contenus au regard de critères de sécurité.
- **Rate Limiting** — limitation du nombre ou du rythme des appels.
- **Denial of Service (DoS)** — attaque visant à rendre un service indisponible.
- **Unbounded Consumption** — consommation non maîtrisée de tokens, calcul ou outils.
- **Adversarial Example** — entrée spécialement construite pour tromper un modèle.
- **Red Teaming** — exercice organisé de tests offensifs dans un cadre autorisé.
- **Defense in Depth** — superposition de contrôles complémentaires plutôt qu'une protection unique.
- **Audit Log / Trace** — journal des actions, appels et décisions utile aux enquêtes.
- **Provenance** — information sur l'origine et les transformations d'un contenu ou d'une donnée.
- **PII Redaction** — suppression ou masquage des données personnelles sensibles.

## 14. Images, audio, vidéo et modèles génératifs

- **⭐ Multimodalité** — capacité à traiter ou générer plusieurs types de signaux.
- **Image Encoder** — module transformant une image en représentations utilisables par un modèle.
- **Vision Transformer (ViT)** — Transformer adapté au traitement des images.
- **Patch Embedding** — transformation de régions d'image en vecteurs d'entrée.
- **OCR (Optical Character Recognition)** — extraction de texte à partir d'images.
- **Image Captioning** — production d'une description textuelle d'une image.
- **Visual Question Answering (VQA)** — réponse à une question fondée sur une image.
- **Grounded Vision** — liaison entre affirmations textuelles et régions ou éléments visuels.
- **Text-to-Image** — génération d'image à partir d'une description textuelle.
- **Image-to-Image** — transformation d'une image guidée par des instructions ou une autre référence.
- **Text-to-Video** — génération de vidéo à partir d'une description.
- **⭐ Diffusion Model** — modèle génératif apprenant à inverser un processus de perturbation progressive.
- **Denoising** — étape de suppression progressive de bruit dans certaines méthodes génératives.
- **Latent Diffusion** — diffusion effectuée dans un espace latent comprimé plutôt que sur les pixels directement.
- **Diffusion Transformer (DiT)** — architecture de génération par diffusion utilisant des blocs Transformer.
- **Flow Matching** — méthode d'entraînement apprenant une dynamique de transport entre distributions.
- **Sampler / Scheduler** — mécanisme contrôlant les étapes de génération d'un modèle de diffusion.
- **Guidance / CFG (Classifier-Free Guidance)** — technique renforçant l'adhésion d'une génération aux conditions demandées.
- **VAE (Variational Autoencoder)** — modèle apprenant à encoder et décoder via un espace latent probabiliste.
- **GAN (Generative Adversarial Network)** — système entraînant un générateur face à un discriminateur.
- **Autoencoder** — modèle apprenant une représentation comprimée puis une reconstruction.
- **Latent Space** — espace numérique condensant des caractéristiques de données.
- **ASR (Automatic Speech Recognition)** — conversion de parole en texte.
- **TTS (Text-to-Speech)** — synthèse de parole depuis un texte.
- **Speech-to-Speech** — transformation ou génération vocale directement depuis de l'audio.
- **Voice Activity Detection (VAD)** — détection de zones contenant de la parole.
- **Speaker Diarization** — identification de « qui parle quand » dans un enregistrement.
- **Audio Tokenization / Codec Tokens** — représentation d'audio en unités discrètes exploitables par un modèle.
- **Streaming ASR** — transcription progressive d'une entrée audio en cours.
- **Real-Time Multimodal** — traitement interactif de texte, son, image ou vidéo avec faible latence.
- **Action Token** — représentation discrète d'une action dans certains modèles d'action ou de robotique.
- **JEPA (Joint Embedding Predictive Architecture)** — famille de méthodes prédisant des représentations latentes plutôt que de reconstruire le signal brut.
- **Contrastive Learning** — apprentissage rapprochant les représentations de paires liées et éloignant celles de paires différentes.
- **CLIP** — approche d'apprentissage contrastif reliant représentations d'images et de textes.

## 15. Infrastructure, déploiement et exploitation

- **⭐ GPU (Graphics Processing Unit)** — accélérateur massivement parallèle très utilisé pour les réseaux neuronaux.
- **TPU (Tensor Processing Unit)** — accélérateur spécialisé dans les calculs de tenseurs.
- **NPU (Neural Processing Unit)** — processeur spécialisé pour certains calculs d'IA.
- **VRAM / HBM** — mémoire vidéo / mémoire à large bande passante employée par les accélérateurs.
- **Tensor** — tableau multidimensionnel de valeurs numériques.
- **Matrix Multiplication (MatMul)** — opération dominante de nombreuses couches des réseaux neuronaux.
- **Tensor Core** — unité matérielle spécialisée dans certaines opérations matricielles.
- **CUDA** — plateforme de programmation parallèle pour GPU NVIDIA.
- **ROCm** — écosystème logiciel de calcul accéléré notamment utilisé avec GPU AMD.
- **PyTorch** — bibliothèque courante de développement de modèles neuronaux.
- **JAX** — environnement de calcul numérique et d'autodifférentiation performant.
- **Hugging Face Transformers** — bibliothèque d'architectures et d'outils pour utiliser des modèles préentraînés.
- **⭐ vLLM** — moteur de service de LLM optimisé pour le débit et la gestion de mémoire.
- **llama.cpp** — moteur d'inférence particulièrement connu pour l'exécution locale de modèles.
- **TensorRT-LLM** — ensemble d'optimisations pour l'inférence de LLM, notamment sur GPU NVIDIA.
- **Triton** — langage et environnement pour écrire des kernels optimisés sur accélérateurs.
- **⭐ Data Parallelism** — copie du modèle sur plusieurs dispositifs traitant des portions différentes de données.
- **⭐ Tensor Parallelism** — répartition de calculs matriciels et de tenseurs d'une couche sur plusieurs dispositifs.
- **Pipeline Parallelism** — distribution de couches successives sur plusieurs dispositifs.
- **Model Parallelism** — terme général pour répartir les calculs d'un même modèle.
- **Distributed Training** — entraînement réparti sur plusieurs dispositifs ou machines.
- **Gradient Checkpointing / Activation Checkpointing** — recalcul de certaines activations pour économiser la mémoire d'entraînement.
- **ZeRO** — famille de stratégies répartissant les états d'optimisation, gradients et paramètres.
- **Sharding** — partitionnement de poids, données ou caches entre ressources.
- **Inference Endpoint** — point d'accès réseau exposant les capacités d'un modèle.
- **API (Application Programming Interface)** — interface logicielle structurée pour appeler un service.
- **SLA / SLO** — engagement / objectif de niveau de service, notamment sur disponibilité et latence.
- **Observability** — collecte de métriques, traces et journaux pour comprendre un système.
- **Model Registry** — catalogue versionné des modèles et de leurs métadonnées.
- **MLflow / Experiment Tracking** — outils ou pratiques de suivi des expériences et versions de modèles.
- **MLOps / LLMOps** — pratiques d'industrialisation, surveillance et maintenance des modèles / applications LLM.
- **Canary Deployment** — diffusion progressive d'une nouvelle version sur une fraction du trafic.
- **Rollback Deployment** — retour à une version précédente lors d'un problème.

## 16. Distribution des modèles, écosystème et culture technique

- **⭐ Open Weights** — poids téléchargeables, avec des droits d'utilisation qui dépendent de la licence.
- **⭐ Open Source** — accès au code source sous une licence répondant à des critères d'ouverture ; à distinguer de simples poids ouverts.
- **Proprietary / Closed Model** — modèle dont les poids ou les conditions d'utilisation restent contrôlés par son éditeur.
- **Model Card** — fiche documentant usages, limites, risques et conditions d'un modèle.
- **Dataset Card** — documentation de l'origine, du contenu et des limites d'un jeu de données.
- **License** — règles juridiques d'utilisation, modification et redistribution d'un modèle ou de son code.
- **Commercial-Use License** — licence précisant les droits d'exploitation commerciale.
- **Gated Model** — modèle dont les fichiers exigent un accès ou l'acceptation de conditions.
- **API-only Model** — modèle utilisable via un service sans accès direct aux poids.
- **On-Premises / Self-Hosted** — déploiement sur l'infrastructure du client / hébergement géré par soi-même.
- **Edge AI / On-Device AI** — traitement local sur un équipement proche de l'utilisateur.
- **Model Hub** — plateforme de publication, recherche et téléchargement de modèles.
- **Leaderboard** — classement de modèles d'après certaines évaluations.
- **AI Slop** — appellation familière de contenu généré massivement par IA avec une faible qualité ou faible valeur.
- **Frontier Model** — terme informel désignant des modèles à la pointe des capacités disponibles.
- **Model Family** — ensemble de variantes apparentées d'un modèle.
- **Model Variant / Size** — déclinaison différant par sa taille, ses capacités ou son mode d'emploi.
- **Research Paper / Preprint** — publication scientifique / manuscrit diffusé avant examen formel éventuel.
- **ArXiv** — plateforme de diffusion de prépublications scientifiques.
- **Reproducibility** — capacité à reproduire un résultat avec des conditions et procédures documentées.
- **Inference Cost / Token Pricing** — coût de traitement des entrées et sorties, souvent tarifé au token.
- **TCO (Total Cost of Ownership)** — coût total d'exploitation, intégrant matériel, hébergement et maintenance.

---

## 12 distinctions à ne pas mélanger

1. **Sparse Attention ≠ Sparse MoE** : la première sélectionne les connexions *entre tokens* ; le second sélectionne des *experts* à activer.
2. **FlashAttention ≠ Sparse Attention** : FlashAttention optimise le calcul exact de l'attention sans devoir supprimer des connexions.
3. **PagedAttention ≠ FlashAttention** : PagedAttention gère efficacement la mémoire du KV cache ; FlashAttention optimise le calcul de l'attention.
4. **GQA ≠ MoE** : GQA partage certaines clés/valeurs d'attention ; MoE route vers des sous-réseaux experts.
5. **RAG ≠ Fine-tuning** : RAG apporte des informations au moment de la requête ; fine-tuning modifie des paramètres appris.
6. **Fine-tuning ≠ Prompting** : le fine-tuning modifie des poids ; l'usage de prompts classiques ne les modifie pas.
7. **Quantization ≠ Distillation** : quantification réduit la précision numérique ; distillation entraîne un élève à imiter un professeur.
8. **Open Weights ≠ Open Source** : poids téléchargeables ne signifient pas automatiquement code, données et droits pleinement ouverts.
9. **Context Window ≠ Mémoire durable** : un long contexte n'implique pas une conservation entre sessions.
10. **Prompt Injection ≠ Jailbreak** : l'injection vient souvent d'une source de moindre confiance ; le jailbreak cherche à contourner des garde-fous, y compris par une demande directe.
11. **Hallucination ≠ Mensonge intentionnel** : une réponse fausse ou inventée n'implique pas d'intention consciente du modèle.
12. **Benchmark ≠ Qualité universelle** : un score élevé sur un test ne démontre pas une supériorité sur toutes les tâches.

## Les 25 notions à apprendre d'abord

**LLM, Transformer, Token, Tokenizer, Context Window, Attention, Self-Attention, Full Attention, Sparse Attention, FlashAttention, GQA, KV Cache, MoE, Sparse MoE, Router, RAG, Embedding, Vector Database, Fine-tuning, LoRA, Quantization, Inference, Prompt Injection, Agent, Tool Calling.**

## Sources de référence pour approfondir

- Google, *Machine Learning Glossary* : https://developers.google.com/machine-learning/glossary
- Google Cloud, *Generative AI Glossary* : https://docs.cloud.google.com/docs/ai-ml/generative-ai/glossary
- Hugging Face, *Cache strategies* : https://huggingface.co/docs/transformers/kv_cache
- Hugging Face, *Expert parallelism* : https://huggingface.co/docs/transformers/main/expert_parallelism
- vLLM, *Documentation* : https://docs.vllm.ai/en/latest/
- OWASP, *GenAI Security Project* : https://genai.owasp.org/
- ICLR 2026, *Reinforcement Learning with Verifiable Rewards* : https://proceedings.iclr.cc/paper_files/paper/2026/hash/517f9b9c227b9dd51dba4560f37165ed-Abstract-Conference.html
- ICLR 2024, *Sparse Autoencoders Find Highly Interpretable Features in Language Models* : https://proceedings.iclr.cc/paper_files/paper/2024/hash/1fa1ab11f4bd5f94b2ec20e794dbfa3b-Abstract-Conference.html
- Microsoft Learn, *RAG Information Retrieval* : https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-information-retrieval

*Glossaire pédagogique : les définitions sont volontairement synthétiques ; certains termes ont plusieurs variantes ou des usages différents selon les publications.*
