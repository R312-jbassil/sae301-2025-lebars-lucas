# Documentation Technique - Génération IA de Lunettes

## Architecture

### Frontend (`src/pages/configurateur.astro`)

#### Interface utilisateur
- **Onglet "Création avec IA"** : Interface moderne pour la génération par IA
- **Sélecteur de modèle** : Dropdown permettant de choisir parmi 8 modèles d'IA
- **Zone de prompt** : Textarea pour décrire les lunettes souhaitées
- **Suggestions** : 4 boutons pour ajouter rapidement des styles
- **Ambiances** : 6 boutons pour définir le style général
- **Préférences de couleur** : 5 boutons avec gradients visuels

#### Logique JavaScript
```javascript
// Variables d'état
let aiGeneratedConfig = null;      // Configuration générée par l'IA
let selectedMood = null;           // Ambiance sélectionnée
let selectedColorPref = null;      // Préférence de couleur

// Appel API
const response = await fetch('/api/generateGlasses', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt,
    model,
    mood,
    colorPreference
  })
});
```

#### Fonctions principales
- `displayAIResult(config)` : Affiche le résultat dans l'interface
- `applyAIColorsToViewer(config)` : Applique les couleurs au viewer 3D
- Bouton "Régénérer" : Relance la génération avec le même prompt
- Bouton "Continuer" : Sauvegarde dans localStorage et redirige vers apercu

### Backend (`src/pages/api/generateGlasses.js`)

#### Configuration
```javascript
const BASE_URL = import.meta.env.OR_URL;    // https://openrouter.ai/api/v1
const OR_TOKEN = import.meta.env.OR_TOKEN;  // Token d'API
```

#### Mapping des modèles
| Modèle sélectionné | Endpoint OpenRouter |
|-------------------|---------------------|
| gpt-4o-mini | openai/gpt-4o-mini |
| gpt-4o | openai/gpt-4o |
| claude-3.5-sonnet | anthropic/claude-3.5-sonnet |
| deepseek-coder | deepseek/deepseek-coder |
| qwen-coder | qwen/qwen-2.5-coder-32b-instruct |
| codellama | meta-llama/codellama-34b-instruct |
| mistral-7b | mistralai/mistral-7b-instruct |
| llama-3.1 | meta-llama/llama-3.1-8b-instruct |

#### Prompt système
L'IA reçoit des instructions précises :
- Format JSON obligatoire
- Codes couleur hexadécimaux
- Matériaux réalistes (Acétate, Aluminum, Bois, etc.)
- Types de verres appropriés
- Taille S/M/L
- Explication des choix

#### Format de réponse
```json
{
  "success": true,
  "config": {
    "monture": {
      "color": "#HEX",
      "material": "Matériau",
      "price": 15
    },
    "branches": {
      "color": "#HEX",
      "material": "Matériau",
      "price": 0
    },
    "verres": {
      "color": "#HEX",
      "type": "Type",
      "price": 0
    },
    "size": "M",
    "sizePrice": 0,
    "explanation": "Explication des choix",
    "totalPrice": 104.99
  }
}
```

## Flux de données

1. **Utilisateur** entre une description + options
2. **Frontend** collecte les données et appelle `/api/generateGlasses`
3. **Backend** construit le prompt avec contexte
4. **OpenRouter** route vers le modèle IA choisi
5. **IA** génère une configuration JSON
6. **Backend** parse, normalise et calcule les prix
7. **Frontend** affiche le résultat et met à jour le viewer 3D
8. **Utilisateur** peut régénérer ou continuer vers l'aperçu

## Calcul des prix

- **Monture** : 15€
- **Branches** : 0€ (inclus)
- **Verres** : 0€ (inclus)
- **Taille** : 0€ (M), +5€ (L), -5€ (S)
- **Prix de base** : 89,99€
- **Prix total** : base + prix des options

## Gestion des erreurs

### Côté Backend
- Configuration fallback si l'API échoue
- Validation des codes couleur (regex #HEX)
- Valeurs par défaut pour champs manquants
- Logs des erreurs avec détails

### Côté Frontend
- Loading state pendant la génération
- Alert si erreur réseau/API
- Vérification du prompt non vide
- Désactivation du bouton pendant génération

## Variables d'environnement

```env
OR_URL=https://openrouter.ai/api/v1
OR_TOKEN=sk-or-v1-...
```

**Sécurité** :
- `.env` dans `.gitignore`
- Jamais commit les tokens
- Utiliser `.env.example` comme template

## Optimisations possibles

1. **Cache** : Sauvegarder les générations fréquentes
2. **Streaming** : Afficher la réponse progressivement
3. **Retry logic** : Tentatives multiples en cas d'échec
4. **Rate limiting** : Limiter les requêtes par utilisateur
5. **Image preview** : Générer un aperçu visuel réaliste
6. **Fine-tuning** : Entraîner un modèle sur des designs existants

## Debugging

### Vérifier l'API
```javascript
// Dans la console navigateur
fetch('/api/generateGlasses', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: "lunettes vintage marron",
    model: "gpt-4o-mini"
  })
}).then(r => r.json()).then(console.log);
```

### Logs backend
Les logs apparaissent dans la console du serveur Astro :
```
Requête de génération de lunettes reçue
Prompt utilisateur: lunettes vintage marron
AI Response: { monture: {...}, ... }
```

## Maintenance

### Ajouter un nouveau modèle
1. Ajouter dans le dropdown HTML
2. Ajouter dans le mapping `modelMap`
3. Tester la génération

### Modifier le prompt système
Éditer `systemMessage.content` dans `generateGlasses.js`

### Changer les prix
Modifier la fonction de normalisation dans l'API backend
