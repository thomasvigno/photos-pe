# Vérification — Photos PE 1.1

## Exécuté dans l’environnement de développement

- 10 tests Node réussis : formats d’identifiants et chemins interdits, UUID distincts, noms 1–10, CSV attendu/présent et caractères français, lots bornés, CRC32 connu, ZIP aller-retour binaire/UTF-8, corruption, doublons/chemins/compression interdits, ZIP tronqués/volumineux et présence de toutes les ressources du cache.
- Contrôle de syntaxe JavaScript : app.js, db.js et sw.js.
- Vérification indépendante d’un ZIP produit par le code avec Python `zipfile` : archive lisible, CRC conforme, nom UTF-8 conservé.
- Essai d’interface dans Chrome distant : démarrage, enregistrement du nom de projet, création FEN-24B, dix emplacements, progression 0/10, refus du doublon fen-24b, génération d’une sauvegarde d’une PE vide, persistance du projet/de la PE après rechargement, réouverture et renommage en MBY502-A12.
- L’aperçu fourni par l’environnement est HTTP sur un nom d’hôte distant non sécurisé. Le message « HTTPS requis » a été vérifié. Cet aperçu ne permet pas de valider service worker, SHA-256 navigateur ou mode hors ligne.

**Pas exécuté sur un véritable iPhone/Safari.** Caméra, partage Fichiers, IndexedDB avec photos, restauration complète, quota plein, comportement en arrière-plan et redémarrage hors ligne restent à tester. Aucun déploiement GitHub Pages n’a été effectué.

## Recette iPhone obligatoire avant le terrain

Installer la version HTTPS depuis Safari, idéalement iOS 17+.

| Essai | Résultat attendu |
| --- | --- |
| Ouvrir depuis l’icône avec Internet | Message ressources hors ligne prêtes |
| Mode avion, fermer complètement et relancer | Interface fonctionnelle sans réseau |
| Créer PE12 et prendre une photo | Caméra proposée ; PE12.1.jpg ; compteur 1/10 seulement après sauvegarde |
| Fermer et relancer en mode avion | Projet, PE et photo toujours accessibles |
| Compléter jusqu’à 10 | Compteur 10/10 ; pas de 11e emplacement ; filtre incomplètes exclut PE12 |
| Annuler la caméra à l’emplacement 2 | Compteur inchangé ; autre photo intacte |
| Refuser le remplacement d’une photo | Photo actuelle intacte, caméra non ouverte |
| Confirmer un remplacement, puis annuler caméra | Photo actuelle intacte |
| Remplacer une photo jusqu’au bout | Nouvelle image visible ; compteur inchangé |
| Créer pe12 après PE12 | Doublon refusé |
| Renommer PE12 en FEN-24B | Photos présentes, nouveaux noms au prochain export |
| Recréer PE12 après renommage | Nouvelle parcelle indépendante autorisée |
| Renommer vers un nom existant | Refus, données intactes |
| Export une PE incomplète | ZIP avec photos présentes et CSV de 10 lignes attendues |
| Export plusieurs PE | Noms et dossiers corrects, aucune photo supprimée |
| Partage → Enregistrer dans Fichiers | ZIP visible et extractible dans le dossier choisi |
| Plus de 32 Mio de photos | Plusieurs parties, aucun lot massif unique ; chaque partie enregistrable |
| Sauvegarde puis restauration dans installation vide distincte | Projet, PE, images et compteurs rétablis après toutes les parties |
| Restaurer les parties dans un autre ordre | Photos fusionnées, statut des parties correct |
| Restaurer deux fois la même partie | Identiques ignorées, pas de doublon |
| Restaurer après avoir remplacé une photo | Conflit refusé sans écrasement |
| ZIP altéré ou ZIP export simple | Refus compréhensible, aucune écriture partielle de la partie |
| Stockage insuffisant (appareil de test) | Message d’erreur, aucun succès annoncé à tort, ancien emplacement conservé |
| Nouvelle version du cache | Mise à jour après fermeture/réouverture connectée, photos conservées |

Pour vérifier une restauration, comparer aussi visuellement plusieurs photos et leurs noms dans Fichiers. Conserver les ZIP à l’extérieur du navigateur pendant l’essai. Ne pas tester une suppression de données avec des photos terrain uniques.

## Ajouts vérifiés pour la version 1.1

Les dix tests Node passent toujours. Sept vérifications supplémentaires ont été exécutées dans le navigateur Chrome avec **IndexedDB réel**, dans une base isolée : suppression ciblée d’une photo, réutilisation de son emplacement, suppression en cascade de la PE avec conservation des autres PE, refus d’une capture sur une PE supprimée, effacement complet du projet et des marqueurs de restauration, persistance après fermeture/réouverture de la base, création avec un ancien identifiant.

Essais complémentaires sur iPhone : annuler chaque confirmation et vérifier l’absence de changement ; supprimer une photo et vérifier la baisse du compteur puis la reprise de l’emplacement ; supprimer une PE et contrôler les autres ; exporter une sauvegarde puis supprimer le projet avec le mot SUPPRIMER et vérifier que le ZIP externe existe toujours. La validation de ces gestes sur Safari/iPhone reste à effectuer.
