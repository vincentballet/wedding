# 💍 Mariage Lola & Vincent — Site web

Site statique one-page pour le mariage de Lola & Vincent,
**10, 11 et 12 octobre 2026** au **Château du Griffon**, Provence.

---

## Aperçu

| Section | Contenu |
|---|---|
| 🏠 Hero | Plein écran, photo de fond Provence, bouton RSVP |
| 💬 Notre histoire | Mot d'accueil, photo du couple |
| 🏰 Le lieu | Château du Griffon, carte, boutons |
| 📅 Programme | Timeline 3 jours avec horaires |
| ℹ️ Infos pratiques | Parking, hébergement, dress code, météo |
| ✉️ RSVP | Formulaire connecté à Google Forms |

---

## Lancer le site localement

Le site est **100 % statique** — aucune installation, aucun build.
Il suffit d'un serveur HTTP local pour éviter les restrictions de sécurité du navigateur.

```bash
# Option 1 — Python (préinstallé sur macOS/Linux)
cd wedding_landing
python3 -m http.server 8080
# → Ouvrir http://localhost:8080

# Option 2 — Node.js (si installé)
npx serve .
# → Ouvrir l'URL affichée dans le terminal

# Option 3 — VS Code
# Installer l'extension "Live Server" → clic droit sur index.html → Open with Live Server
```

> ⚠️ Ne pas ouvrir `index.html` directement avec `file://` : certaines ressources
> (carte OSM, polices) peuvent être bloquées par les navigateurs.

---

## Personnaliser le site

### 📝 Textes à remplacer

Recherchez les commentaires `<!-- TODO -->` dans `index.html` :

| Commentaire | Où modifier |
|---|---|
| `TODO TEXTE` — Mot d'accueil | Section `#histoire`, paragraphes (~ligne 120) |
| `TODO` — Date limite RSVP | Section `#rsvp`, balise `.rsvp__date-limite` |
| `TODO` — Hébergements | Section `#infos`, carte `.info-carte--placeholder` |
| `TODO` — Covoiturage | Section `#infos`, carte suivante |
| `TODO` — Dress code | Section `#infos`, carte suivante |

### 🖼️ Photos à remplacer

**Photo hero (plein écran)** :
1. Placez votre photo dans `images/hero.jpg` (ou `hero.webp` — recommandé)
2. Ouvrez `css/style.css` et trouvez la règle `.hero__bg`
3. Remplacez l'URL Unsplash par : `background-image: url('../images/hero.jpg');`
4. Format recommandé : WebP, largeur 1920 px, qualité 80 %, taille < 400 Ko

**Photo couple (section Notre Histoire)** :
1. Placez votre photo dans `images/couple.jpg`
2. Dans `index.html`, trouvez la balise `<img class="histoire__image">` (~ligne 130)
3. Remplacez l'attribut `src` par `images/couple.jpg`
4. Mettez à jour l'attribut `alt` avec une description pertinente

**Conseils photo** :
- Format WebP si possible (meilleure compression)
- Dimensionnez avant d'importer (pas d'image brute de 10 Mo !)
- Utilisez [Squoosh](https://squoosh.app) pour compresser gratuitement

### 🎨 Couleurs & typographie

Toutes les couleurs sont des variables CSS dans `css/style.css` (lignes 10–25) :

```css
:root {
  --terracotta: #C4704A;   /* couleur principale, boutons, accents */
  --ocre:       #D4A853;   /* dorure, labels, timeline */
  --olive:      #6B7C4E;   /* accent secondaire */
  --sauge:      #8A9E7A;   /* teinte douce */
  --creme:      #F5F0E8;   /* fond clair, texte sur fond sombre */
  --fond:       #FAF7F2;   /* fond général */
  --texte:      #2D2926;   /* texte principal */
  --texte-doux: #6B6058;   /* texte secondaire */
}
```

La police **Cormorant Garamond** est chargée depuis Google Fonts.
Pour utiliser une autre police, modifiez le lien `<link>` dans `<head>`
et la variable `--ff-serif` dans `css/style.css`.

---

## Formulaire RSVP

Le formulaire est connecté à **Google Forms**.
La configuration est déjà faite — **rien à modifier** si vous utilisez le même formulaire.

- **Form ID** : `1FAIpQLSdcNHi-fA9iI38E9neM3p0N7-DEUK9kOyEIy_neg-UzYPBgwg`
- **URL courte** : https://forms.gle/2HCAe8phxpbC6qot7
- **Champs utilisés** :
  - `entry.1605506176` → Nom et prénom
  - `entry.1405610770` → Jours de présence (checkboxes)
  - `entry.1104877686` → Régime alimentaire
  - `entry.1548994614` → Message

**Comment voir les réponses** : ouvrez le Google Form, cliquez sur l'onglet « Réponses »,
puis « Ouvrir dans Sheets » pour une feuille de calcul auto-mise à jour.

**Si le formulaire ne fonctionne pas** : le navigateur redirige automatiquement
vers le formulaire Google natif (lien de secours dans `js/main.js`).

---

## Déployer le site

### Netlify (recommandé — le plus simple)

1. Allez sur [netlify.com](https://netlify.com) → créez un compte gratuit
2. Glissez-déposez le dossier `wedding_landing` dans la zone de dépôt
3. Votre site est en ligne en 30 secondes ✓
4. Pour un domaine personnalisé : `Site settings → Domain management → Add custom domain`

### Vercel

```bash
npm i -g vercel   # installer une seule fois
cd wedding_landing
vercel            # suivre les instructions → choisir "Static Site"
```

### GitHub Pages

1. Créez un dépôt GitHub (public ou privé)
2. Poussez le contenu du dossier à la racine du dépôt
3. `Settings → Pages → Source : Deploy from branch → main`
4. Le site sera accessible sur `https://votrecompte.github.io/nom-du-repo`

### Domaine personnalisé (ex. lolaetvincentmariageé.fr)

Quel que soit l'hébergeur, une fois le site déployé :
1. Achetez votre domaine (OVH, Gandi, Namecheap…)
2. Suivez les instructions de votre hébergeur pour configurer le DNS
3. Le HTTPS est automatique chez Netlify/Vercel

---

## Structure des fichiers

```
wedding_landing/
├── index.html       ← page principale (tout le contenu)
├── css/
│   └── style.css    ← tous les styles (variables, mobile-first)
├── js/
│   └── main.js      ← JavaScript : nav, animations, RSVP
├── images/
│   ├── .gitkeep     ← placeholder (ajouter vos photos ici)
│   ├── hero.jpg     ← à créer : photo de fond hero
│   └── couple.jpg   ← à créer : photo section Notre Histoire
├── favicon.svg      ← monogramme L & V
└── README.md        ← ce fichier
```

---

## Checklist avant mise en ligne

- [ ] Remplacer la photo hero par une photo personnelle
- [ ] Rédiger le mot d'accueil (section Notre Histoire)
- [ ] Ajouter une photo du couple
- [ ] Indiquer la date limite de réponse RSVP
- [ ] Compléter les hébergements recommandés
- [ ] Préciser le dress code
- [ ] Compléter l'organisation du covoiturage
- [ ] Tester le formulaire RSVP (vérifier la réception dans Google Sheets)
- [ ] Tester sur mobile (Chrome DevTools → 375 px)
- [ ] Vérifier tous les liens externes (château, itinéraire)

---

*Fait avec ❤️ pour Lola & Vincent — octobre 2026*
