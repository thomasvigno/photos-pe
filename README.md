# Photos PE — version 1.0

Application Web progressive en français, sans compte, sans serveur de données et sans dépendance JavaScript externe. Développement et publication possibles entièrement depuis Windows. Cible : **Safari sur iPhone avec iOS 17 ou ultérieur**, en HTTPS et installé sur l’écran d’accueil.

## Installation rapide depuis Windows

1. Extraire cette archive dans un dossier `photos-pe`.
2. Sur GitHub, créer un dépôt **public** nommé `photos-pe` (GitHub Free).
3. Avec GitHub Desktop : **File > Add local repository > Choose > Create a repository** dans ce dossier si nécessaire, puis **Publish repository**. Choisir le nom `photos-pe`, décocher « Keep this code private ». Publier seulement les sources, jamais vos photos ou vos sauvegardes.
4. Vérifier que la branche est `main`. Dans GitHub : **Settings > Pages > Build and deployment > Source > GitHub Actions**.
5. Dans **Actions > Publier Photos PE**, lancer **Run workflow**, ou pousser un nouveau commit. Le workflow fourni teste et publie les seuls fichiers statiques nécessaires.
6. L’URL HTTPS est affichée dans **Settings > Pages** et dans le résultat du déploiement. Elle ressemble à `https://VOTRE-COMPTE.github.io/photos-pe/`.

Alternative sans GitHub Desktop : créer le dépôt dans GitHub, téléverser les fichiers en conservant `.github/workflows/pages.yml`, puis activer GitHub Actions comme ci-dessus. L’archive inclut les dossiers commençant par un point ; ne pas les omettre.

**Publication préparée, pas effectuée** : ce livrable n’a pas créé de dépôt ni publié de site sur votre compte.

## Installer depuis Safari sur iPhone

1. Ouvrir l’URL HTTPS du site dans **Safari**, avec Internet.
2. Attendre « Ressources hors ligne prêtes ».
3. **Partager > Sur l’écran d’accueil** (selon la version d’iOS : menu de partage puis « Ajouter à l’écran d’accueil »). Activer l’ouverture en app Web si l’option est proposée.
4. Ouvrir **Photos PE depuis cette nouvelle icône**, toujours connecté une première fois, et attendre le message hors ligne prêt. Saisir le nom du projet dans cette installation.
5. Appuyer sur **Protéger le stockage local**. Safari décide de l’octroi ; ce bouton ne garantit jamais la conservation à long terme.
6. Tester le mode avion : fermer complètement l’application, la relancer depuis l’icône et créer une PE d’essai. Prendre une photo, fermer puis rouvrir et vérifier qu’elle est toujours présente.

Éviter la navigation privée. Utiliser toujours la même icône, le même iPhone et la même adresse. Une installation sur l’écran d’accueil peut avoir un espace de données distinct de Safari : vérifier où les photos ont été prises. Ne pas désinstaller pour mettre à jour. Ne pas effacer les données du site sans sauvegarde vérifiée.

## Utilisation sur le terrain

- Créer un identifiant : `PE12`, `FEN-24B`, `MBY502-A12`. Entre 1 et 60 caractères ASCII : lettres, chiffres, tirets, traits de soulignement ; premier caractère lettre ou chiffre. Casse préservée dans les fichiers, doublons refusés sans distinction de casse.
- Ouvrir une PE et appuyer sur **Prendre la prochaine photo**. L’app demande la caméra arrière avec l’attribut `capture="environment"` ; le choix final caméra/photothèque dépend d’iOS. iOS peut permettre de changer d’objectif.
- La photo est convertie en **vrai JPEG**, qualité 92 %, côté maximal **3 200 px**, sans agrandissement. Le réencodage ne conserve pas les métadonnées EXIF/GPS originales. Fichiers source limités à 50 Mio, pour contenir la mémoire de décodage. Une image non décodable est refusée sans écraser l’emplacement.
- Attendre le message **enregistrée et vérifiée** avant de passer à la suivante. Le compteur vient des enregistrements effectivement présents, après fin de transaction et relecture.
- **Voir** permet de contrôler une photo. **Reprendre** demande confirmation ; l’ancienne photo reste présente jusqu’à l’enregistrement réussi de sa remplaçante. Annuler la caméra n’efface rien.
- Chaque PE propose exactement 10 emplacements. La progression globale affiche les photos présentes sur le nombre attendu. Le filtre **Incomplètes** et le tableau permettent de reprendre une PE.
- **Renommer** conserve les photos via un identifiant interne stable. Le nouveau nom sera utilisé dans les prochains ZIP et CSV ; un ZIP déjà enregistré ne change pas.
- Un projet par installation ; pas de suppression de parcelles ou de photos proposée dans cette version.

## Exports et sauvegardes

**Exporter cette PE** ou cocher plusieurs PE puis **Exporter la sélection**. Les photos sont placées dans un dossier par parcelle : `FEN-24B/FEN-24B.1.jpg`. Le nom du projet sert au nom du ZIP, pas à celui des photos.

Chaque ZIP contient `manifeste.csv`, encodé UTF-8 avec BOM et séparateur point-virgule pour Excel français. Il liste les dix photos attendues de chaque PE sélectionnée : projet, parcelle, emplacement, fichier attendu, présence, octets et date UTC. Pour un export en plusieurs parties, le manifeste décrit **la sélection entière au début de l’export**, pas uniquement la partie courante.

Les lots sont automatiquement découpés à **32 Mio de photos par ZIP**, plus les en-têtes et métadonnées. Une PE peut être répartie entre plusieurs ZIP. Le traitement lit une seule photo à la fois pour son CRC ; les Blobs du lot courant sont conservés jusqu’à sa livraison. Il ne charge pas tout le projet en mémoire. Le ZIP final et le partage iOS peuvent nécessiter des copies mémoire supplémentaires : il n’y a pas de garantie absolue contre les limites mémoire d’iOS.

Quand le ZIP est prêt :

1. Appuyer sur **Enregistrer dans Fichiers / partager**.
2. Dans la feuille de partage iOS, choisir **Enregistrer dans Fichiers**, puis le dossier souhaité. Pour rester hors ligne, choisir un dossier local « Sur mon iPhone ».
3. Si le partage de ZIP n’est pas disponible, utiliser **Télécharger le ZIP**, puis le retrouver dans les téléchargements de Safari/Fichiers. Le comportement dépend de la version iOS.
4. Enregistrer la partie courante **avant** de demander la suivante ; l’app ne peut pas confirmer que le fichier a réellement été enregistré dans Fichiers.
5. Recommencer jusqu’à la dernière partie. Ne pas modifier les photos pendant l’export ; une modification détectée interrompt la préparation plutôt que de produire un instantané incohérent.

Aucun original n’est supprimé après export. Un export simple de photos n’est **pas** une sauvegarde restaurable par l’app.

**Sauvegarder tout le projet** produit des ZIP contenant aussi `sauvegarde.json` : identifiants, nom du projet, liste de toutes les photos attendues, photos incluses dans cette partie et empreintes SHA-256. Les numéros de parties et un identifiant de sauvegarde apparaissent dans les noms de ZIP. Conserver toutes les parties ensemble, sans les recomprimer.

**Restaurer une sauvegarde** : sélectionner une partie ZIP, confirmer, puis répéter pour toutes les parties, dans n’importe quel ordre. L’application vérifie structure, tailles, CRC32 et SHA-256 avant une transaction atomique par partie. Une partie valide n’écrase pas une photo existante différente : elle est refusée en cas de conflit. Les photos identiques sont ignorées. Le statut indique les parties reçues et le nombre de photos manquantes. Une restauration sur appareil vide remet le nom du projet et les parcelles, y compris incomplètes ou vides.

Restaurer dans une installation vide ou dans le même projet interne. Une sauvegarde provenant d’un autre projet est refusée si des parcelles sont présentes. En cas de conflit après renommage ou modification, privilégier une installation vide distincte pour récupérer la sauvegarde ; ne pas effacer l’installation courante sans autre sauvegarde vérifiée. La transaction protège la partie courante, pas l’ensemble des parties en une fois.

**Pratique recommandée** : sauvegarder chaque journée, ouvrir les ZIP pour vérifier leur contenu et conserver une deuxième copie externe. Les données du navigateur ne constituent pas une sauvegarde permanente.

## Développer depuis Windows

Aucun Mac, Xcode, compte Apple développeur, compilation ou npm install requis.

- Installer Python 3 depuis python.org pour le serveur de test et Node.js 22+ depuis nodejs.org pour les tests.
- Ouvrir PowerShell dans le dossier du projet :

```powershell
py -m http.server 8080
```

- Ouvrir `http://localhost:8080` dans Edge ou Chrome sur ce PC. Ne pas ouvrir directement `index.html` par double-clic.
- Dans un autre terminal :

```powershell
npm test
```

- Modifier HTML/CSS/JS avec VS Code, tester, puis pousser avec GitHub Desktop.
- Pour tester sur l’iPhone, employer l’URL **HTTPS GitHub Pages**. `http://ADRESSE-IP-DU-PC:8080` n’est pas un contexte sécurisé et ne permet pas un test PWA complet.
- Après toute modification d’une ressource mise en cache, incrémenter `CACHE` dans `sw.js`, puis publier. La nouvelle version attend la fermeture des anciennes fenêtres. Rouvrir connecté, puis refaire le test en mode avion. IndexedDB reste conservé par les mises à jour de ressources.

Le nom de base IndexedDB est `photos-pe`, version 1. Tous les chemins sont relatifs pour fonctionner dans un sous-dossier GitHub Pages. Ne pas déplacer le site vers une autre origine sans exporter puis restaurer : les données restent attachées à leur origine. Deux exemplaires du site sur la même origine partagent cette base.

## Sources incluses

| Fichier | Rôle |
| --- | --- |
| `index.html`, `style.css` | Interface française et présentation responsive |
| `app.js` | Parcelles, caméra, progression, exports, restauration |
| `db.js` | IndexedDB, transactions, vérification après écriture et SHA-256 |
| `core.js` | Noms, identifiants, CSV, lots |
| `zip.js` | ZIP STORE et lecture des sauvegardes, CRC32, sans dépendance |
| `sw.js` | Cache local versionné des ressources |
| `manifest.webmanifest`, `icon-*.png` | Installation PWA |
| `.github/workflows/pages.yml` | Tests et déploiement GitHub Pages |
| `tests/core.test.mjs` | Tests automatisés |
| `VERIFICATION.md` | Résultats et protocole iPhone à exécuter |

## Confidentialité et limites

Pas d’envoi HTTP de photos, pas de suivi analytique, pas de CDN, pas de compte. Les seules requêtes réseau servent à charger et mettre à jour les fichiers statiques. Aucune synchronisation ou sauvegarde automatique distante. La feuille de partage reste une action manuelle : choisir un service cloud à cette étape transmettrait le ZIP au service choisi.

Un quota affiché est une **estimation**, pas l’espace réellement garanti. IndexedDB peut perdre ses données si le navigateur ou le système les supprime. Une demande de persistance est une protection supplémentaire, pas un remplacement de la sauvegarde. Garder l’app ouverte pendant conversion, sauvegarde et restauration : iOS peut suspendre une PWA en arrière-plan. En cas d’interruption, rouvrir et contrôler les emplacements.

L’app est conçue pour une seule fenêtre d’utilisation. L’index unique protège les noms contre les doublons ; la sauvegarde photo refuse une modification concurrente détectée. Éviter plusieurs fenêtres pendant une restauration ou un export.

## Références techniques

- WebKit, Storage Policy : https://webkit.org/blog/14403/updates-to-storage-policy/
- MDN, Web Share : https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
- MDN, Service Workers : https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
- GitHub, configuration Pages : https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

Développé comme une première version fonctionnelle à valider sur votre appareil avant un usage terrain essentiel.
