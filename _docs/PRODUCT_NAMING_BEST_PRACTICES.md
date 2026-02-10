# Guide des Meilleures Pratiques de Dénomination Produits (GraphShop OS)

Ce guide définit la stratégie optimale pour nommer les produits dans la base de données de GraphShop OS. L'objectif est de garantir une **recherche rapide** pour le gérant, une **lisibilité parfaite** pour le client (ticket de caisse, étiquettes), et une **cohérence** des données.

## 1. La Formule d'Or (Golden Formula)

Pour qu'un nom de produit soit efficace partout, il doit suivre cette structure stricte :

> **[MARQUE] + [NATURE DU PRODUIT] + [PARFUM/VARIÉTÉ] + [QUANTITÉ]**

### Pourquoi cet ordre ?
1.  **Marque** : C'est souvent le premier mot clé recherché (ex: "Coca", "Soummam").
2.  **Nature** : Ce que c'est (ex: "Jus", "Lait", "Savon").
3.  **Variété** : Le détail qui différencie (ex: "Orange", "Entier", "Lavande").
4.  **Quantité** : Toujours à la fin pour la lecture rapide (ex: "1L", "500g").

---

## 2. Optimisation pour la Recherche (Searchability)

Le système de recherche de GraphShop OS (et des moteurs en général) priorise souvent le début de la phrase.

*   ✅ **Bonne Pratique** : `CANDIA Lait UHT Demi-Ecrémé 1L`
    *   *Si je tape "Candia" -> Trouvé.*
    *   *Si je tape "Lait" -> Trouvé.*
*   ❌ **Mauvaise Pratique** : `Lait 1L de la marque CANDIA (Demi)`
    *   *Trop de bruit, informations non triées.*

**Astuce "Mots-Clés Cachés" :**
Si un produit a un nom populaire qui n'est pas sur l'emballage, ajoutez-le entre parenthèses à la fin ou dans un champ "Tags" si disponible.
*   *Exemple :* `HAMOUD BOUALEM Gazouz Blanche 1L (Limonade)`

---

## 3. Contraintes & Abréviations (Ticket de Caisse & Étiquettes)

Les imprimantes thermiques (tickets) et les étiquettes de rayon (ESL) ont une place limitée (souvent **20 à 40 caractères**). Il faut standardiser les abréviations pour que le texte ne soit pas coupé n'importe comment.

### Table des Abréviations Standards (Algérie/France)

| Mot Complet | Abréviation Recommandée | Contexte |
| :--- | :--- | :--- |
| **Quantités** | | |
| Grammes / Kilogrammes | `g` / `Kg` | 500g, 1Kg |
| Litre / Millilitre | `L` / `ml` / `cl` | 1L, 33cl |
| Pièce / Unité | `Pce` / `Uté` | Vente à l'unité |
| **Nature** | | |
| Bouteille | `Blle` | Eau, Jus |
| Canette | `Can` | Soda |
| Sachet | `Sach` | Lait, Semoule |
| Carton / Pack | `Crt` / `Pk` | Vente en gros |
| **Variétés** | | |
| Chocolat | `Choco` | Biscuits, Yaourts |
| Fraise | `Frs` | Yaourts |
| Vanille | `Van` | Yaourts, Glaces |
| Nature | `Nat` | Yaourts, Thon |
| Tomate | `Tom` | Conserves |
| Végétal | `Végé` | Smen, Huile |

### Exemple de Transformation pour Ticket de Caisse
*   **Nom Complet :** `SOUMMAM Yaourt Brassé Arôme Fraise 100g` (41 chars - TROP LONG)
*   **Version Ticket :** `SOUMMAM Yaourt Bras. Frs 100g` (28 chars - PARFAIT)

---

## 4. Exemples Concrets (Avant / Après)

| Catégorie | ❌ À Éviter (Trop long, flou) | ✅ Recommandé (Structuré, efficace) |
| :--- | :--- | :--- |
| **Boissons** | Boissons Gazeuse Coca 1 litre et demi | **COCA COLA Soda 1.5L** |
| **Laiterie** | boite de fromage la vache qui rit 16p | **LVQR Fromage Portion x16** |
| **Épicerie** | Pates spaghetti sim 500 grammes | **SIM Pâtes Spaghetti 500g** |
| **Entretien** | OMO lessive machine a laver main 3kg | **OMO Lessive Poudre Main 3Kg** |
| **Conserves** | Tomate concentré izhdihar boite | **IZDIHAR Tomate Double Conc. 400g** |

---

## 5. Stratégie pour les Produits en Vrac (Fruits & Légumes)

Pour les produits sans code-barres (pesée), utilisez des préfixes pour grouper les produits dans la recherche tactile.

Structure : **[CATÉGORIE] + [VARIÉTÉ] + [ORIGINE/TYPE]**

*   `F&L Tomate Fraîche (Alg)`
*   `F&L Pomme de Terre (Spunta)`
*   `VRAC Lentilles (Canada)`
*   `VRAC Pois Chiches (Mexique)`

*Le préfixe `F&L` ou `VRAC` permet de sortir toute la liste en tapant juste 3 lettres.*

## 6. Résumé pour la Saisie

Lors de la création d'un produit dans GraphShop OS :
1.  **Désignation** : Utilisez la **Formule d'Or** (Marque + Nature + Variété + Qté).
2.  **Majuscules** : Écrivez toujours la MARQUE en MAJUSCULES pour la lisibilité (`CANDIA` pas `Candia`).
3.  **Code Court (SKU)** : Laissez le système générer le code séquentiel (1001, 1002...).
4.  **Ticket** : Si le logiciel coupe le nom, utilisez la table des abréviations pour raccourcir la fin de la désignation.
