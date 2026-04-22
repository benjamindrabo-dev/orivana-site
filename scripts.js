/* Orivana shared scripts — language switch + AI demo */

function getLang() {
  return document.documentElement.getAttribute('data-lang') || 'fr';
}

function setLang(lang) {
  document.documentElement.setAttribute('data-lang', lang);
  document.querySelectorAll('[data-fr]').forEach(function(el){
    var val = el.getAttribute('data-' + lang);
    if (val !== null) {
      if (el.children.length === 0) el.textContent = val;
      else el.innerHTML = val;
    }
  });
  document.querySelectorAll('[data-fr-ph]').forEach(function(el){
    var val = el.getAttribute('data-' + lang + '-ph');
    if (val) el.setAttribute('placeholder', val);
  });
  document.querySelectorAll('.lang-switch button').forEach(function(btn){
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function initLang() {
  setLang('fr');
  document.querySelectorAll('.lang-switch button').forEach(function(btn){
    btn.addEventListener('click', function(){ setLang(btn.dataset.lang); });
  });
}

function initNav() {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', function(){ links.classList.toggle('open'); });
}

/* ---------- Fallback demo scripts ---------- */

var DEMO_SCRIPT_FR = [
  { text: "🔎 Connexion à l'API Claude...", delay: 500 },
  { text: "✓ Authentification réussie", delay: 400, cls: 'good' },
  { text: "", delay: 200 },
  { text: "📍 Analyse de {business} ({city}, QC)", delay: 600, ai: true },
  { text: "⏳ Recherche web des 3 concurrents top du map pack canadien...", delay: 1000 },
  { text: "", delay: 200 },
  { text: "▼ CONCURRENTS DÉTECTÉS", delay: 400, ai: true },
  { text: "  1. {competitor1} — 4,8★ (247 avis) — 142 photos", delay: 400 },
  { text: "  2. {competitor2} — 4,6★ (183 avis) — 89 photos", delay: 400 },
  { text: "  3. {competitor3} — 4,7★ (156 avis) — 67 photos", delay: 400 },
  { text: "", delay: 200 },
  { text: "▼ AUDIT DE VOTRE FICHE GOOGLE", delay: 400, ai: true },
  { text: "  Photos             : 8  (vs moy. 99)", delay: 300, cls: 'bad' },
  { text: "  Catégories         : 2  (vs moy. 6)", delay: 300, cls: 'bad' },
  { text: "  Avis Google        : 31 (vs moy. 195)", delay: 300, cls: 'bad' },
  { text: "  Publications / mois: 0  (vs moy. 8)", delay: 300, cls: 'bad' },
  { text: "  Q&R actives        : 1  (vs moy. 12)", delay: 300, cls: 'bad' },
  { text: "", delay: 200 },
  { text: "▼ SCORE SEO LOCAL", delay: 400, ai: true },
  { text: "  ████░░░░░░  34 / 100", delay: 500, cls: 'score' },
  { text: "", delay: 200 },
  { text: "▼ 5 ACTIONS PRIORITAIRES (semaine 1)", delay: 400, ai: true },
  { text: "  ① Ajouter catégorie secondaire « Urgence {service} »", delay: 350, cls: 'good' },
  { text: "  ② Publier 30 photos avant/après", delay: 350, cls: 'good' },
  { text: "  ③ Activer les publications GBP — 30 prêtes", delay: 350, cls: 'good' },
  { text: "  ④ Seeder 15 Q&R avec mots-clés locaux", delay: 350, cls: 'good' },
  { text: "  ⑤ Répondre à tous les avis existants", delay: 350, cls: 'good' },
  { text: "", delay: 200 },
  { text: "📈 Potentiel estimé : +340% de leads sur 90 jours", delay: 600, ai: true, cls: 'score' },
  { text: "🔒 Exclusivité vérifiée : 1 seul {service} accepté à {city}", delay: 400, ai: true, cls: 'good' },
  { text: "", delay: 100 },
  { text: "➜ Ceci est un aperçu. Le rapport complet d'Orivana fait 40 pages.", delay: 400, cls: 'good' }
];

var DEMO_SCRIPT_EN = [
  { text: "🔎 Connecting to Claude API...", delay: 500 },
  { text: "✓ Authentication successful", delay: 400, cls: 'good' },
  { text: "", delay: 200 },
  { text: "📍 Analyzing {business} ({city}, QC)", delay: 600, ai: true },
  { text: "⏳ Web-searching top 3 Canadian map-pack competitors...", delay: 1000 },
  { text: "", delay: 200 },
  { text: "▼ COMPETITORS DETECTED", delay: 400, ai: true },
  { text: "  1. {competitor1} — 4.8★ (247 reviews) — 142 photos", delay: 400 },
  { text: "  2. {competitor2} — 4.6★ (183 reviews) — 89 photos", delay: 400 },
  { text: "  3. {competitor3} — 4.7★ (156 reviews) — 67 photos", delay: 400 },
  { text: "", delay: 200 },
  { text: "▼ YOUR GOOGLE PROFILE AUDIT", delay: 400, ai: true },
  { text: "  Photos            : 8   (vs avg 99)", delay: 300, cls: 'bad' },
  { text: "  Categories        : 2   (vs avg 6)", delay: 300, cls: 'bad' },
  { text: "  Google reviews    : 31  (vs avg 195)", delay: 300, cls: 'bad' },
  { text: "  Posts / month     : 0   (vs avg 8)", delay: 300, cls: 'bad' },
  { text: "  Active Q&A        : 1   (vs avg 12)", delay: 300, cls: 'bad' },
  { text: "", delay: 200 },
  { text: "▼ LOCAL SEO SCORE", delay: 400, ai: true },
  { text: "  ████░░░░░░  34 / 100", delay: 500, cls: 'score' },
  { text: "", delay: 200 },
  { text: "▼ TOP 5 ACTIONS (week 1)", delay: 400, ai: true },
  { text: "  ① Add secondary category « Emergency {service} »", delay: 350, cls: 'good' },
  { text: "  ② Upload 30 before/after photos", delay: 350, cls: 'good' },
  { text: "  ③ Enable GBP posts — 30 ready", delay: 350, cls: 'good' },
  { text: "  ④ Seed 15 Q&As with local keywords", delay: 350, cls: 'good' },
  { text: "  ⑤ Reply to all existing reviews", delay: 350, cls: 'good' },
  { text: "", delay: 200 },
  { text: "📈 Estimated upside: +340% leads in 90 days", delay: 600, ai: true, cls: 'score' },
  { text: "🔒 Exclusivity verified: only 1 {service} accepted in {city}", delay: 400, ai: true, cls: 'good' },
  { text: "", delay: 100 },
  { text: "➜ This is a preview. Orivana's full report is 40 pages.", delay: 400, cls: 'good' }
];

var COMPETITORS_POOL = {
  fr: [
    ["Services Lavoie inc.", "Experts Bélanger", "Maison Gagnon"],
    ["Artisans Dubois", "Service Rapide QC", "Équipe Pro Laval"],
    ["Atelier Latendresse", "Experts Desjardins", "Rénov Québec Express"]
  ],
  en: [
    ["Lavoie Services Inc.", "Belanger Experts", "Gagnon Home Co"],
    ["Dubois Craftsmen", "QuickService QC", "TeamPro Laval"],
    ["Latendresse Workshop", "Desjardins Home Experts", "Quebec FastRenov"]
  ]
};

/* ---------- Output renderer ---------- */

function classifyLine(text) {
  if (!text) return { cls: '', ai: false };
  var t = text.trim();
  if (/^▼/.test(t) || /^📍/.test(t)) return { cls: '', ai: true };
  if (/^📈/.test(t) || /^🔒/.test(t)) return { cls: 'good', ai: true };
  if (/^✓/.test(t) || /^➜/.test(t) || /^[①②③④⑤]/.test(t)) return { cls: 'good', ai: false };
  if (/\d+\s*\/\s*100/.test(t) || /[█░]{3,}/.test(t)) return { cls: 'score', ai: false };
  if (/^(Photos|Catégories|Categories|Avis|Reviews|Publications|Posts|Q&R|Q&A|Note|Rating)/i.test(t)) return { cls: 'bad', ai: false };
  return { cls: '', ai: false };
}

function escapeHtml(s) {
  return String(s).replace(/[&<>]/g, function(c){ return { '&':'&amp;','<':'&lt;','>':'&gt;' }[c]; });
}

function appendLine(output, rawText) {
  var text = rawText == null ? '' : String(rawText);
  var meta = classifyLine(text);
  var div = document.createElement('div');
  div.className = 'line' + (meta.cls ? ' ' + meta.cls : '');
  if (meta.ai && text) div.innerHTML = '<span class="ai-label">[AI]</span> ' + escapeHtml(text);
  else div.textContent = text || '\u00A0';
  output.appendChild(div);
  output.scrollTop = output.scrollHeight;
}

/* ---------- Real audit via /api/audit (SSE) ---------- */

function runRealAudit(params, output, callbacks) {
  var onFirst = callbacks.onFirst || function(){};
  var onDone = callbacks.onDone || function(){};
  var onFail = callbacks.onFail || function(){};

  var controller = new AbortController();
  var buffer = '';
  var textBuffer = '';
  var gotAnything = false;

  fetch('/api/audit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
    signal: controller.signal
  }).then(function(resp){
    if (!resp.ok || !resp.body) {
      throw new Error('API unavailable (' + resp.status + ')');
    }
    var reader = resp.body.getReader();
    var decoder = new TextDecoder();

    function flushLines() {
      var nl = textBuffer.indexOf('\n');
      while (nl !== -1) {
        var line = textBuffer.slice(0, nl);
        textBuffer = textBuffer.slice(nl + 1);
        appendLine(output, line);
        nl = textBuffer.indexOf('\n');
      }
    }

    function pump() {
      return reader.read().then(function(res){
        if (res.done) {
          if (textBuffer.length) { appendLine(output, textBuffer); textBuffer = ''; }
          onDone();
          return;
        }
        buffer += decoder.decode(res.value, { stream: true });
        var parts = buffer.split(/\n\n/);
        buffer = parts.pop();
        parts.forEach(function(chunk){
          var event = 'message', data = '';
          chunk.split('\n').forEach(function(l){
            if (l.indexOf('event:') === 0) event = l.slice(6).trim();
            else if (l.indexOf('data:') === 0) data += l.slice(5).trim();
          });
          if (!data) return;
          var parsed;
          try { parsed = JSON.parse(data); } catch (e) { return; }
          if (event === 'text' && parsed.delta) {
            if (!gotAnything) { gotAnything = true; onFirst(); }
            textBuffer += parsed.delta;
            flushLines();
          } else if (event === 'error') {
            appendLine(output, '⚠ ' + (parsed.message || 'error'));
          } else if (event === 'done') {
            if (textBuffer.length) { appendLine(output, textBuffer); textBuffer = ''; }
          }
        });
        return pump();
      });
    }

    return pump();
  }).catch(function(err){
    if (gotAnything) onDone();
    else onFail(err);
  });

  return controller;
}

/* ---------- Simulated fallback ---------- */

function runSimulatedAudit(params, output, onDone) {
  var lang = params.lang;
  var script = lang === 'en' ? DEMO_SCRIPT_EN : DEMO_SCRIPT_FR;
  var compPool = COMPETITORS_POOL[lang];
  var competitors = compPool[Math.floor(Math.random() * compPool.length)];

  var i = 0;
  function next() {
    if (i >= script.length) { onDone && onDone(); return; }
    var item = script[i++];
    var text = item.text
      .split('{business}').join(params.business)
      .split('{city}').join(params.city)
      .split('{service}').join(params.service)
      .split('{competitor1}').join(competitors[0])
      .split('{competitor2}').join(competitors[1])
      .split('{competitor3}').join(competitors[2]);

    var div = document.createElement('div');
    div.className = 'line' + (item.cls ? ' ' + item.cls : '');
    if (item.ai) div.innerHTML = '<span class="ai-label">[AI]</span> ' + escapeHtml(text);
    else div.textContent = text || '\u00A0';
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
    setTimeout(next, item.delay);
  }
  next();
}

/* ---------- Orchestrator ---------- */

function runDemo() {
  var business = document.getElementById('demo-business').value.trim() || 'Votre Entreprise';
  var city = document.getElementById('demo-city').value.trim() || 'Montréal';
  var service = document.getElementById('demo-service').value.trim() || 'plomberie';
  var output = document.getElementById('demo-output');
  var btn = document.getElementById('demo-run');
  if (!output || !btn) return;

  var lang = getLang();
  var params = { business: business, city: city, service: service, lang: lang };

  output.classList.add('show');
  output.innerHTML = '';
  btn.disabled = true;
  btn.innerHTML = lang === 'en' ? '⏳ Running AI audit...' : '⏳ Audit IA en cours...';

  function finish() {
    btn.disabled = false;
    btn.innerHTML = lang === 'en' ? '⚡ Run another audit' : '⚡ Refaire un audit';
  }

  appendLine(output, lang === 'en' ? '🔎 Connecting to Claude API...' : "🔎 Connexion à l'API Claude...");

  runRealAudit(params, output, {
    onFirst: function(){},
    onDone: finish,
    onFail: function(){
      output.innerHTML = '';
      var note = document.createElement('div');
      note.className = 'line';
      note.style.color = '#f59e0b';
      note.textContent = lang === 'en'
        ? '⚠ Backend not configured — showing simulated preview. See DEPLOY.md to enable the real Claude audit.'
        : '⚠ Backend non configuré — aperçu simulé. Voir DEPLOY.md pour activer le vrai audit Claude.';
      output.appendChild(note);
      runSimulatedAudit(params, output, finish);
    }
  });
}

function initDemo() {
  var btn = document.getElementById('demo-run');
  if (btn) btn.addEventListener('click', runDemo);
}

function initContact() {
  var form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var lang = getLang();
    var msg = lang === 'en'
      ? 'Thanks! We will reach out within 24h.'
      : 'Merci ! Nous vous recontactons sous 24h.';
    var box = document.getElementById('contact-success');
    if (box) { box.style.display = 'block'; box.textContent = msg; }
    form.reset();
  });
}

/* ========================================================
   AI CHAT WIDGET — Orivana
   Floating bubble → Claude-powered conversational lead qual.
   Streams /api/chat (SSE). Falls back to scripted replies
   when the backend isn't configured.
   ======================================================== */

var CHAT_I18N = {
  fr: {
    title: "Alex · Orivana IA",
    subtitle: "En ligne · réponse en < 1 min",
    greeting: "👋 Salut ! Moi c'est <strong>Alex</strong>, l'agent IA d'Orivana. Je réponds à toutes vos questions sur notre SEO IA, nos campagnes Meta Ads ou nos tarifs — et je peux réserver votre audit offert en 30 secondes. Que puis-je faire pour vous ?",
    placeholder: "Écrivez un message…",
    quick: [
      { text: "💬 Combien ça coûte ?", prompt: "Combien ça coûte ?" },
      { text: "📍 Vérifier mon exclusivité", prompt: "Je veux vérifier l'exclusivité pour mon secteur et ma ville." },
      { text: "📢 Campagnes Meta Ads ?", prompt: "Parle-moi de vos campagnes Meta Ads avec génération de leads." },
      { text: "🎁 Audit gratuit", prompt: "Je veux mon audit SEO IA gratuit." }
    ],
    disclaimer: "Propulsé par Claude · Vos données ne servent pas à l'entraînement",
    fallback: {
      seo: "Notre offre SEO IA : 250$ USD/mois, tout inclus — audit IA mensuel, 30 posts Google Business Profile, réponses aux avis, optimisation des citations ChatGPT / Perplexity / Google AI. Sans contrat annuel. Et on garde une exclusivité stricte : 1 seul client par domaine, par ville.",
      ads: "Oui ! En plus du SEO, on gère vos campagnes Meta Ads (Facebook + Instagram) avec génération de leads. C'est +150$ USD/mois en sus (SEO + Ads = 400$/mois) + votre budget pub. On crée les créatifs avec l'IA, on bâtit le funnel lead gen, et on vous envoie les leads qualifiés directement par SMS/courriel.",
      chat: "Ce chat, c'est justement ça : contact IA direct avec Orivana. Plus besoin d'attendre une réponse courriel — vous avez une vraie réponse Claude en temps réel. Et on peut aussi installer ce même widget sur VOTRE site pour convertir vos visiteurs pendant que vous êtes en chantier.",
      price: "250$ USD/mois pour le SEO complet (sans contrat, résiliable en 1 clic). +150$/mois si vous voulez aussi la gestion Meta Ads + lead gen. Pas de frais de setup. Audit offert en bonus.",
      exclusivity: "Pour vérifier l'exclusivité j'ai besoin de 2 infos : votre domaine d'activité (ex. plomberie, rénovation, dentiste) et votre ville. Vous pouvez me les donner ?",
      audit: "Parfait ! Pour votre audit offert il me faut : 1) le nom de votre commerce, 2) votre ville, 3) votre service principal, 4) un email où envoyer le rapport. On le livre sous 24h.",
      default: "Bonne question ! Pour une réponse personnalisée, remplissez le formulaire de contact (réponse sous 24h) ou écrivez-nous à hello@orivana.ai. On peut aussi planifier un call de 20 min."
    }
  },
  en: {
    title: "Alex · Orivana AI",
    subtitle: "Online · reply in < 1 min",
    greeting: "👋 Hi! I'm <strong>Alex</strong>, Orivana's AI agent. I can answer any question about our AI SEO, Meta Ads campaigns or pricing — and I can book your free audit in 30 seconds. What can I help with?",
    placeholder: "Type a message…",
    quick: [
      { text: "💬 How much is it?", prompt: "How much does it cost?" },
      { text: "📍 Check my exclusivity", prompt: "I want to check exclusivity for my sector and city." },
      { text: "📢 Meta Ads campaigns?", prompt: "Tell me about your Meta Ads campaigns with lead generation." },
      { text: "🎁 Free audit", prompt: "I want my free AI SEO audit." }
    ],
    disclaimer: "Powered by Claude · Your data is not used for training",
    fallback: {
      seo: "Our AI SEO service is $250 USD/month, all included: monthly AI audit, 30 Google Business Profile posts, review replies, ChatGPT / Perplexity / Google AI citation optimization. No annual contract. Strict exclusivity: 1 client per sector, per city.",
      ads: "Yes! On top of SEO, we run your Meta Ads campaigns (Facebook + Instagram) with lead generation. It's +$150 USD/month (SEO + Ads = $400/month) plus your ad budget. We create the AI-powered creatives, build the lead-gen funnel and send qualified leads straight to your SMS/email.",
      chat: "This live chat IS the feature: immediate AI contact with Orivana. No more waiting for an email reply — you get a real Claude answer in real time. And we can install this same widget on YOUR website to convert visitors while you're on the job.",
      price: "$250 USD/month for full SEO (no contract, cancel in 1 click). +$150/month if you also want Meta Ads + lead gen management. No setup fees. Free audit included.",
      exclusivity: "To check exclusivity I need 2 things: your activity sector (e.g. plumbing, renovation, dentist) and your city. Can you share them?",
      audit: "Great! For your free audit I need: 1) your business name, 2) your city, 3) your main service, 4) an email to send the report. We deliver in 24h.",
      default: "Good question! For a personalized answer, fill the contact form (reply within 24h) or email hello@orivana.ai. We can also book a 20-min call."
    }
  }
};

function fallbackAnswer(userText, lang) {
  var fb = CHAT_I18N[lang].fallback;
  var t = (userText || '').toLowerCase();
  if (/\b(prix|coût|cout|tarif|price|cost|combien|how much)\b/.test(t)) return fb.price;
  if (/\b(ad|ads|meta|facebook|instagram|pub|publicit)/.test(t)) return fb.ads;
  if (/\b(exclusi|secteur|ville|city|sector)/.test(t)) return fb.exclusivity;
  if (/\b(audit|free|offert|gratuit)/.test(t)) return fb.audit;
  if (/\b(seo|google|map pack|fiche|gbp)/.test(t)) return fb.seo;
  if (/\b(chat|ai contact|ia contact|bot|widget)/.test(t)) return fb.chat;
  return fb.default;
}

function chatAppend(body, role, html, opts) {
  var div = document.createElement('div');
  div.className = 'chat-msg ' + role;
  if (opts && opts.typing) { div.className += ' typing'; div.innerHTML = '<span></span><span></span><span></span>'; }
  else div.innerHTML = html;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
  return div;
}

function chatRenderQuick(quickEl, inputEl, onSend, lang) {
  quickEl.innerHTML = '';
  CHAT_I18N[lang].quick.forEach(function(q){
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = q.text;
    b.addEventListener('click', function(){
      inputEl.value = q.prompt;
      onSend();
    });
    quickEl.appendChild(b);
  });
}

function chatSendReal(history, lang, onDelta, onDone, onFail) {
  var controller = new AbortController();
  var buffer = '';
  var textBuffer = '';
  var got = false;

  fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ history: history, lang: lang }),
    signal: controller.signal
  }).then(function(resp){
    if (!resp.ok || !resp.body) throw new Error('API ' + resp.status);
    var reader = resp.body.getReader();
    var decoder = new TextDecoder();
    function pump() {
      return reader.read().then(function(res){
        if (res.done) { onDone(textBuffer, got); return; }
        buffer += decoder.decode(res.value, { stream: true });
        var parts = buffer.split(/\n\n/);
        buffer = parts.pop();
        parts.forEach(function(chunk){
          var event = 'message', data = '';
          chunk.split('\n').forEach(function(l){
            if (l.indexOf('event:') === 0) event = l.slice(6).trim();
            else if (l.indexOf('data:') === 0) data += l.slice(5).trim();
          });
          if (!data) return;
          var parsed;
          try { parsed = JSON.parse(data); } catch (e) { return; }
          if (event === 'text' && parsed.delta) {
            got = true;
            textBuffer += parsed.delta;
            onDelta(parsed.delta);
          } else if (event === 'done') {
            onDone(textBuffer, got);
          }
        });
        return pump();
      });
    }
    return pump();
  }).catch(function(err){
    if (got) onDone(textBuffer, true);
    else onFail(err);
  });

  return controller;
}

function initChatWidget() {
  if (document.getElementById('ori-chat')) return;

  var root = document.createElement('div');
  root.id = 'ori-chat';

  var bubble = document.createElement('button');
  bubble.className = 'chat-bubble';
  bubble.type = 'button';
  bubble.setAttribute('aria-label', 'Chat with Orivana AI');
  bubble.innerHTML = '<span class="pulse"></span>💬';

  var panel = document.createElement('div');
  panel.className = 'chat-panel';
  panel.innerHTML = ''
    + '<div class="chat-head">'
    +   '<div class="avatar">A</div>'
    +   '<div>'
    +     '<div class="title" data-chat-title></div>'
    +     '<div class="subtitle" data-chat-subtitle></div>'
    +   '</div>'
    +   '<button type="button" class="close" aria-label="close">×</button>'
    + '</div>'
    + '<div class="chat-body" id="ori-chat-body"></div>'
    + '<div class="chat-quick" id="ori-chat-quick"></div>'
    + '<div class="chat-foot">'
    +   '<div class="chat-input-row">'
    +     '<input class="chat-input" id="ori-chat-input" type="text" autocomplete="off">'
    +     '<button type="button" class="chat-send" id="ori-chat-send" aria-label="send">➤</button>'
    +   '</div>'
    +   '<small class="chat-disclaimer" data-chat-disclaimer></small>'
    + '</div>';

  root.appendChild(bubble);
  root.appendChild(panel);
  document.body.appendChild(root);

  var bodyEl = panel.querySelector('#ori-chat-body');
  var quickEl = panel.querySelector('#ori-chat-quick');
  var inputEl = panel.querySelector('#ori-chat-input');
  var sendBtn = panel.querySelector('#ori-chat-send');
  var closeBtn = panel.querySelector('.close');
  var titleEl = panel.querySelector('[data-chat-title]');
  var subtitleEl = panel.querySelector('[data-chat-subtitle]');
  var discEl = panel.querySelector('[data-chat-disclaimer]');

  var history = []; // [{role:'user'|'assistant', content:''}]

  function applyLang() {
    var l = getLang();
    var dict = CHAT_I18N[l];
    titleEl.textContent = dict.title;
    subtitleEl.textContent = dict.subtitle;
    inputEl.placeholder = dict.placeholder;
    discEl.textContent = dict.disclaimer;
    chatRenderQuick(quickEl, inputEl, send, l);
    if (history.length === 0) {
      bodyEl.innerHTML = '';
      chatAppend(bodyEl, 'bot', dict.greeting);
    }
  }

  function open() {
    panel.classList.add('open');
    setTimeout(function(){ inputEl.focus(); }, 120);
    if (history.length === 0) applyLang();
  }
  function close() { panel.classList.remove('open'); }
  bubble.addEventListener('click', function(){ panel.classList.contains('open') ? close() : open(); });
  closeBtn.addEventListener('click', close);

  function send() {
    var text = (inputEl.value || '').trim();
    if (!text) return;
    inputEl.value = '';
    sendBtn.disabled = true;
    var lang = getLang();
    chatAppend(bodyEl, 'user', escapeHtml(text));
    history.push({ role: 'user', content: text });

    var typing = chatAppend(bodyEl, 'bot', '', { typing: true });

    var botEl = null;
    var buffered = '';
    chatSendReal(history, lang, function(delta){
      if (!botEl) {
        typing.remove();
        botEl = chatAppend(bodyEl, 'bot', '');
      }
      buffered += delta;
      botEl.innerHTML = escapeHtml(buffered).replace(/\n/g, '<br>');
      bodyEl.scrollTop = bodyEl.scrollHeight;
    }, function(finalText, got){
      if (!got) return;
      history.push({ role: 'assistant', content: finalText });
      sendBtn.disabled = false;
      inputEl.focus();
    }, function(){
      typing.remove();
      var answer = fallbackAnswer(text, lang);
      chatAppend(bodyEl, 'bot', escapeHtml(answer));
      history.push({ role: 'assistant', content: answer });
      sendBtn.disabled = false;
      inputEl.focus();
    });
  }

  sendBtn.addEventListener('click', send);
  inputEl.addEventListener('keydown', function(e){
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });

  // React to language switch (re-render chips + greeting)
  document.querySelectorAll('.lang-switch button').forEach(function(btn){
    btn.addEventListener('click', function(){
      var dict = CHAT_I18N[getLang()];
      titleEl.textContent = dict.title;
      subtitleEl.textContent = dict.subtitle;
      inputEl.placeholder = dict.placeholder;
      discEl.textContent = dict.disclaimer;
      chatRenderQuick(quickEl, inputEl, send, getLang());
      if (history.length === 0) {
        bodyEl.innerHTML = '';
        chatAppend(bodyEl, 'bot', dict.greeting);
      }
    });
  });

  applyLang();
}

document.addEventListener('DOMContentLoaded', function(){
  initLang();
  initNav();
  initDemo();
  initContact();
  initChatWidget();
});
