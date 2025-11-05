- Nom:
- Prénom:
- URL pocketbase: 
- URL:

## Configuration de l'API IA

Ce projet utilise l'API OpenRouter pour générer des configurations de lunettes avec l'IA.

### Installation

1. Installez les dépendances :
```bash
npm install
```

2. Copiez le fichier `.env.example` en `.env` :
```bash
cp .env.example .env
```

3. Obtenez un token d'API sur [OpenRouter](https://openrouter.ai) et remplissez le fichier `.env` :
```env
OR_URL=https://openrouter.ai/api/v1
OR_TOKEN=votre_token_ici
```

### Utilisation

Le configurateur possède deux modes :
- **Manuel** : Personnalisation complète avec sélecteurs de couleurs
- **IA** : Génération automatique basée sur une description textuelle

#### Mode IA

1. Accédez à l'onglet "Création avec IA"
2. Décrivez vos lunettes dans le champ de texte
3. Choisissez un modèle d'IA (GPT-4o Mini recommandé)
4. Sélectionnez une ambiance (optionnel)
5. Choisissez une préférence de couleur (optionnel)
6. Cliquez sur "Générer avec l'IA"
7. Visualisez et ajustez le résultat
8. Cliquez sur "Continuer" pour sauvegarder

### Modèles d'IA disponibles

- **GPT-4o Mini** (Recommandé) : Rapide et performant
- **GPT-4o** (Premium) : Qualité maximale
- **Claude 3.5 Sonnet** : Créativité avancée
- **DeepSeek Coder** : Spécialisé en code
- **Qwen 2.5 Coder** : Alternative performante
- **CodeLlama 34B** : Open source puissant
- **Mistral 7B** (Gratuit) : Léger et rapide
- **Llama 3.1 8B** (Gratuit) : Option gratuite