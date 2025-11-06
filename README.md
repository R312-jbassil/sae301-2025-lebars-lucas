- Nom: Lebars
- Prénom: Lucas
- URL pocketbase: sae301.lucas-lebars.fr/_/
- URL: sae301.lucas-lebars.fr

## Configuration de l'API IA

Ce projet utilise l'API OpenRouter pour générer des configurations de lunettes avec l'IA.

### Utilisation

Le configurateur possède deux modes :
- **Manuel** : Personnalisation complète avec sélecteurs de couleurs
- **IA** : Génération automatique basée sur une description textuelle

### Modèles d'IA disponibles

- **GPT-4o Mini** (Recommandé) : Rapide et performant
- **GPT-4o** (Premium) : Qualité maximale
- **Claude 3.5 Sonnet** : Créativité avancée
- **DeepSeek Coder** : Spécialisé en code
- **Qwen 2.5 Coder** : Alternative performante
- **CodeLlama 34B** : Open source puissant
- **Mistral 7B** (Gratuit) : Léger et rapide
- **Llama 3.1 8B** (Gratuit) : Option gratuite

---

## 🔧 Problèmes rencontrés lors du déploiement

Voici les erreurs que j'ai rencontrées sur le VPS et ce que j'ai essayé pour les résoudre (certaines sont toujours en cours de résolution).

### Erreur : Service Unavailable (503)

**Ce qui s'est passé :** Quand j'accédais à sae301.lucas-lebars.fr, j'avais juste une page "Service Unavailable" avec Apache en signature.

**Ce que j'ai compris :** Apache tourne bien sur le port 443 et répond, mais il n'arrive pas à joindre mon application Node.js en arrière-plan. Le reverse proxy est configuré mais l'app PM2 ne tourne pas ou a crashé.

**Ce que j'ai essayé :**
- J'ai d'abord vérifié les logs PM2 avec `pm2 logs sae301` → ça m'a montré plein d'erreurs de crash
- J'ai regardé si le port était bien le bon dans la config Apache avec `sudo grep ProxyPass /etc/apache2/sites-enabled/*.conf`
- J'ai testé en direct avec `curl http://127.0.0.1:8084` pour voir si l'app répondait

**Statut :** Partiellement résolu - je dois encore nettoyer PM2 et redémarrer proprement.

### Erreur : EADDRINUSE: address already in use ::1:8075

**Ce qui s'est passé :** PM2 plantait en boucle avec cette erreur. Le port 8075 (puis 8082, puis 8084) était "déjà utilisé" et l'app redémarrait sans arrêt.

**Ce que j'ai compris :** J'avais plusieurs instances PM2 qui tournaient en même temps et se battaient pour le même port. C'était un vrai chaos.

**Ce que j'ai essayé :**
- `pm2 status` → j'ai vu 5-6 instances en même temps (entry, sae301, controlefinal...)
- `pm2 stop all` et `pm2 delete all` → mais ça continuait de crasher
- `ss -ltnp | grep 8075` → pour trouver quel processus bloquait le port
- J'ai même tenté `pkill -9 node` pour tout tuer brutalement

**Statut :** En cours - je dois faire un cleanup complet avec `pm2 kill` puis redémarrer UNE SEULE instance proprement.

### Erreur : GitHub Actions qui timeout sur le SCP

**Ce qui s'est passé :** Mon workflow GitHub Actions restait bloqué pendant la copie des fichiers vers le VPS (étape "Deploy to VPS via SCP"). Ça tournait pendant 10-15 minutes puis timeout.

**Ce que j'ai compris :** C'était probablement un problème de connexion SSH ou de droits sur le dossier /var/www/sae301.

**Ce que j'ai essayé :**
- Ajouté une étape "Test SSH connectivity" pour vérifier que la connexion passait
- Vérifié que les secrets GitHub (HOST, USER, SSH_PRIVATE_KEY) étaient bien configurés
- Changé le port dans le workflow pour utiliser 8084 au lieu de 8075

**Statut :** Partiellement résolu - la connexion SSH fonctionne mais l'installation des dépendances npm côté VPS est très longue. J'ai essayé de contourner en passant à un build standalone sans npm ci sur le VPS.

### Problème : Multiples instances PM2 qui se relancent

**Ce qui s'est passé :** Même après avoir arrêté PM2, de nouvelles instances apparaissaient. J'avais "entry", "sae301", "controlefinal" qui tournaient tous en même temps.

**Ce que j'ai compris :** Mon workflow GitHub Actions lançait `pm2 restart sae301 || pm2 start entry.mjs --name sae301` à chaque deploy, ce qui créait parfois de nouvelles instances au lieu de redémarrer proprement.

**Ce que j'ai essayé :**
- Modifier le workflow pour faire `pm2 stop sae301 && pm2 delete sae301` avant de redémarrer
- Chercher s'il y avait des processus Node orphelins avec `ps aux | grep node`

**Statut :** Non résolu - je dois faire un nettoyage manuel complet et adapter le script de déploiement.

### Configuration PocketBase et permissions

**Ce qui s'est passé :** J'ai copié mon dossier pb_data sur le VPS avec `scp -P 22037 -r pocketbase/pb_data etudiant@185.157.244.202:/var/www/backendsae301`.

**Ce que j'ai essayé :**
- Lancé PocketBase en screen avec `/var/www/backendsae301/pocketbase serve --http="0.0.0.0:8078"`
- Créé src/utils/pb.ts pour pointer vers la bonne URL selon l'environnement (dev/prod)

**Statut :** En cours - PocketBase démarre mais je n'ai pas encore testé si l'app arrive à s'y connecter en production.

