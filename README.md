# Site Orivana — déploiement sur Vercel
Site vitrine de **Orivana**, plateforme d'automatisation pour vendeurs Amazon, opérée par **Little Homie Ltd.**

## 📁 Contenu

- `index.html` — page d'accueil
- `privacy.html` — politique de confidentialité (LPRPDE + RGPD)
- `terms.html` — conditions générales d'utilisation
- `CNAME` — fichier de domaine custom (contient `orivanamarketing.com`)
- `.nojekyll` — empêche GitHub Pages de traiter les fichiers via Jekyll

## 🚀 Déploiement

Voir `DEPLOY-GITHUB-PAGES.md` à la racine du dossier de candidature pour la procédure complète.

En résumé :
1. Créer un repo public sur GitHub
2. `git push` ce dossier dans le repo
3. Settings → Pages → activer depuis la branche `main`
4. Acheter `orivanamarketing.com` chez un registrar
5. Configurer les DNS du domaine vers les IPs GitHub Pages
6. Cocher "Enforce HTTPS" dans Settings → Pages
