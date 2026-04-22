# Déployer Orivana — vraie analyse Claude + chat IA direct

Ce guide prend environ **10 minutes**. Il branche deux endpoints Claude :
- `/api/audit` — l'audit SEO en streaming (démo sur la home)
- `/api/chat` — l'agent IA conversationnel (widget violet en bas à droite, sur toutes les pages)

Les deux utilisent la même clé API Anthropic.

## 1. Récupérer une clé API Anthropic

1. Va sur https://console.anthropic.com/
2. Crée un compte (carte de crédit requise — facturation à l'usage, ~0,05 à 0,20 $ CAD par audit)
3. Dans **Settings → API Keys**, clique **Create Key**
4. Copie la clé qui commence par `sk-ant-...`

**Coût estimé** :
- **Audit** (`/api/audit`) : avec Claude Sonnet 4.5 + 5 recherches web par audit, ~**0,15 $ USD / audit**. 100 audits/mois = ~15 $.
- **Chat IA** (`/api/chat`) : conversation typique 5-10 messages, max 700 tokens/réponse, ~**0,01-0,03 $ / conversation**. 500 conversations/mois = ~10 $.

Total chat + audit pour une centaine de leads : ~25 $/mois. Largement absorbé par un seul client à 250 $/mois.

## 2. Déployer sur Vercel (option recommandée)

### Option A — via le site web Vercel (le plus simple)

1. Crée un compte gratuit sur https://vercel.com
2. Installe Git si ce n'est pas déjà fait, puis dans le dossier du site :
   ```bash
   git init
   git add .
   git commit -m "initial"
   ```
3. Crée un dépôt vide sur GitHub et pousse-le.
4. Sur vercel.com, clique **Add New Project**, importe ton dépôt GitHub.
5. Dans **Settings → Environment Variables**, ajoute :
   - Nom : `ANTHROPIC_API_KEY`
   - Valeur : ta clé `sk-ant-...`
   - Environnements : Production, Preview, Development
6. Clique **Deploy**.

Ton site est en ligne à `https://<projet>.vercel.app`. La démo appelle automatiquement `/api/audit`.

### Option B — via la CLI Vercel

```bash
npm install -g vercel
cd <dossier_du_site>
vercel login
vercel env add ANTHROPIC_API_KEY    # colle ta clé
vercel --prod
```

## 3. Tester en local

```bash
npm install
vercel dev
```

Ouvre http://localhost:3000, va sur la page d'accueil, scroll jusqu'à la démo, remplis le formulaire et clique **Lancer un audit IA**. Tu devrais voir le texte apparaître progressivement en streaming depuis Claude.

## 4. Alternatives d'hébergement

Le code serverless est compatible avec :
- **Netlify** : renomme `api/` en `netlify/functions/` et adapte les exports (ou utilise le plugin Next.js compat)
- **Cloudflare Pages** : nécessite une petite adaptation vers l'API Workers (`export default { fetch }`)
- **Node server classique** : tu peux envelopper `handler(req, res)` dans un Express handler

## 5. Personnaliser

- **Prompt d'audit** : modifie `buildPrompt()` dans `api/audit.js`. Tu peux ajouter un contexte spécifique à ton agence, des benchmarks sectoriels précis, un ton différent.
- **Prompt de l'agent chat** : modifie `SYSTEM_FR` / `SYSTEM_EN` dans `api/chat.js`. C'est là que tu ajoutes / retires des services, mets à jour les prix, définis le ton d'Alex (l'agent IA). Quand tu changes un tarif sur le site, pense à le changer aussi dans ces deux prompts.
- **Modèle** : par défaut `claude-sonnet-4-5` (meilleur rapport qualité/prix). Pour des audits plus poussés sur des gros clients, passe à `claude-opus-4-6` via la variable d'env `CLAUDE_MODEL`.
- **Recherches web** : `max_uses: 5` dans `api/audit.js`. Augmente pour des audits plus complets (coût proportionnel).
- **Widget chat** : si tu veux l'installer sur un site client (pour vendre ce service), copie juste `scripts.js` (partie `CHAT_I18N` + `initChatWidget`) + les styles `.chat-*` + déploie la route `/api/chat` côté client avec leur propre system prompt.

## 6. Protection anti-abus (recommandé)

Un visiteur anonyme peut déclencher un audit = 0,15 $ de coût chaque fois, ou tenir une conversation chat qui accumule des tokens. Pour éviter les abus :

- Ajoute un rate-limit : [Upstash Redis](https://upstash.com) + middleware
  - `/api/audit` : 5 audits / IP / heure
  - `/api/chat` : 20 messages / IP / heure
- Ou mets la démo derrière un captcha (Cloudflare Turnstile, gratuit)
- Ou exige un email avant de lancer l'audit (transforme le lead en contact qualifié)
- Pour le chat : le prompt système lui dit déjà de ne pas diverger vers des sujets hors-scope, mais un rate-limit reste recommandé en prod.

L'implémentation de ces protections sort du scope de cette base — dis-moi laquelle tu préfères et je l'ajoute.

## 7. Référencement Google / SEO

Le site est déjà configuré pour un bon référencement :
- Balises title + meta description optimisées avec mots-clés prioritaires (agence SEO, consultant SEO, agence marketing digital, référencement Google, SEO local, agence de génération de leads) ;
- Open Graph + Twitter Card sur chaque page ;
- Données structurées JSON-LD (Organization, Service, FAQPage, Article) ;
- `canonical` sur chaque page ;
- `sitemap.xml` + `robots.txt` à la racine ;
- Favicon SVG inline ;
- Blog `/blog/` avec 5 articles ciblant les mots-clés informationnels.

Après le déploiement :
1. Crée une propriété sur [Google Search Console](https://search.google.com/search-console)
2. Soumets `https://orivanamarketing.com/sitemap.xml`
3. Branche Google Analytics 4 (recommandé pour mesurer les conversions du chat et du formulaire)

## 7. Dépannage

**La démo reste en mode "Backend non configuré — aperçu simulé"**
→ `/api/audit` répond en erreur. Vérifie que `ANTHROPIC_API_KEY` est bien dans les env vars Vercel (onglet Deployments → clique le déploiement → Functions → logs).

**Erreur 401 ou "Invalid API key"**
→ La clé copiée est incomplète ou révoquée. Régénère-en une nouvelle sur console.anthropic.com.

**L'audit est lent (>30 s)**
→ C'est normal : Claude fait 3 à 5 recherches Google puis analyse. `maxDuration: 60` est déjà configuré dans `vercel.json`. Si ça coupe, passe à un plan Pro (300 s max).

**Le modèle retourne du texte en dehors du format attendu**
→ Renforce le prompt dans `api/audit.js` : ajoute "Do not add preamble. Start your response with the line `🔎 Connexion...`".
