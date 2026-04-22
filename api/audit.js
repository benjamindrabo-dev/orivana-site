// Orivana — Serverless audit endpoint (Vercel / Netlify compatible)
// Calls Claude API with the web_search tool to produce a real local SEO audit.
//
// ENV REQUIRED:
//   ANTHROPIC_API_KEY   — your Anthropic API key (get one at https://console.anthropic.com)
//
// DEPLOY:
//   vercel --prod   (after `vercel login` and setting the env var in the dashboard)

import Anthropic from "@anthropic-ai/sdk";

const MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-4-5";

function buildPrompt({ business, city, service, lang }) {
  if (lang === "en") {
    return `You are Orivana's AI local-SEO auditor for Canadian small businesses. Produce a terminal-style audit of this business, using the web_search tool to find REAL public data.

BUSINESS : ${business}
CITY     : ${city}, QC, Canada
SECTOR   : ${service}

REQUIRED STEPS
1. Search "${business} ${city}" on Google to find their Google Business Profile. Extract rating, number of reviews, number of photos if visible, business categories.
2. Search for the top 3 direct competitors in the same sector in ${city} (e.g. "top ${service} ${city}"). For each, list name, rating, review count.
3. Estimate a local SEO score out of 100 based on the gaps between this business and competitors.
4. Give 5 concrete actions for week 1, prioritized.
5. Close with a realistic 90-day lift estimate based on gap size.

OUTPUT FORMAT — strictly this terminal structure, one instruction per line, no markdown fences, no headers outside the ones below:

🔎 Connecting to Claude API...
✓ Authentication successful

📍 Analyzing ${business} (${city}, QC)
⏳ Web-searching local competitors...

▼ COMPETITORS DETECTED
  1. <name> — <rating>★ (<reviews> reviews)
  2. <name> — <rating>★ (<reviews> reviews)
  3. <name> — <rating>★ (<reviews> reviews)

▼ YOUR GOOGLE PROFILE AUDIT
  Rating         : <value> (vs avg <value>)
  Reviews        : <value> (vs avg <value>)
  Photos         : <value> (vs avg <value>)
  Categories     : <value> (vs avg <value>)

▼ LOCAL SEO SCORE
  <bar 10 blocks>  <score> / 100

▼ TOP 5 ACTIONS (week 1)
  ① <action>
  ② <action>
  ③ <action>
  ④ <action>
  ⑤ <action>

📈 Estimated upside: <range>% leads in 90 days
🔒 Exclusivity verified: only 1 ${service} accepted in ${city}

➜ This is a preview. Orivana's full report is 40 pages.

Do not add any other text. If you cannot find the business, write "⚠ Profile not found — assuming fresh profile" and run the audit against sector benchmarks.`;
  }

  return `Tu es l'auditeur SEO local IA d'Orivana pour PME canadiennes. Produis un audit style terminal de ce commerce, en utilisant l'outil web_search pour trouver de VRAIES données publiques.

COMMERCE : ${business}
VILLE    : ${city}, QC, Canada
DOMAINE  : ${service}

ÉTAPES REQUISES
1. Cherche "${business} ${city}" sur Google pour trouver leur fiche Google Business Profile. Extrais note, nombre d'avis, nombre de photos si visible, catégories.
2. Cherche les 3 concurrents directs principaux du même domaine à ${city} (ex. "meilleur ${service} ${city}"). Pour chacun : nom, note, nombre d'avis.
3. Estime un score SEO local sur 100 basé sur l'écart avec les concurrents.
4. Donne 5 actions concrètes pour la semaine 1, prioritées.
5. Termine par une estimation réaliste du gain sur 90 jours selon l'écart.

FORMAT DE SORTIE — strictement cette structure terminal, une instruction par ligne, pas de backticks markdown, pas d'autres titres :

🔎 Connexion à l'API Claude...
✓ Authentification réussie

📍 Analyse de ${business} (${city}, QC)
⏳ Recherche web des concurrents locaux...

▼ CONCURRENTS DÉTECTÉS
  1. <nom> — <note>★ (<avis> avis)
  2. <nom> — <note>★ (<avis> avis)
  3. <nom> — <note>★ (<avis> avis)

▼ AUDIT DE VOTRE FICHE GOOGLE
  Note              : <valeur> (vs moy. <valeur>)
  Avis              : <valeur> (vs moy. <valeur>)
  Photos            : <valeur> (vs moy. <valeur>)
  Catégories        : <valeur> (vs moy. <valeur>)

▼ SCORE SEO LOCAL
  <barre 10 blocs>  <score> / 100

▼ 5 ACTIONS PRIORITAIRES (semaine 1)
  ① <action>
  ② <action>
  ③ <action>
  ④ <action>
  ⑤ <action>

📈 Potentiel estimé : <fourchette>% de leads sur 90 jours
🔒 Exclusivité vérifiée : 1 seul ${service} accepté à ${city}

➜ Ceci est un aperçu. Le rapport complet d'Orivana fait 40 pages.

N'ajoute aucun autre texte. Si la fiche est introuvable, écris "⚠ Fiche non trouvée — audit basé sur les benchmarks du domaine" et continue l'audit contre les benchmarks sectoriels.`;
}

function sanitize(s, max = 80) {
  if (!s) return "";
  return String(s).slice(0, max).replace(/[\r\n\x00-\x1F]/g, " ").trim();
}

export default async function handler(req, res) {
  // CORS + preflight
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  if (req.method !== "POST") { res.status(405).json({ error: "POST only" }); return; }

  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(500).json({ error: "ANTHROPIC_API_KEY not set on server" });
    return;
  }

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};

  const business = sanitize(body.business) || (body.lang === "en" ? "Your Business" : "Votre entreprise");
  const city     = sanitize(body.city)     || "Montréal";
  const service  = sanitize(body.service)  || (body.lang === "en" ? "plumbing" : "plomberie");
  const lang     = body.lang === "en" ? "en" : "fr";

  // SSE headers
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // disable Nginx buffering
  if (typeof res.flushHeaders === "function") res.flushHeaders();

  const send = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: 2048,
      tools: [{ type: "web_search_20250305", name: "web_search", max_uses: 5 }],
      messages: [{ role: "user", content: buildPrompt({ business, city, service, lang }) }],
    });

    stream.on("text", (delta) => send("text", { delta }));
    stream.on("error", (err) => send("error", { message: String(err && err.message || err) }));

    const final = await stream.finalMessage();
    send("done", { stop_reason: final.stop_reason, usage: final.usage });
    res.end();
  } catch (err) {
    send("error", { message: String(err && err.message || err) });
    res.end();
  }
}

// Vercel Node runtime config — increase the function duration for web search
export const config = { maxDuration: 60 };
