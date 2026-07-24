/* ==========================================================
   Job Univers — Chatbot d'aide (widget flottant)
   Aucune dépendance externe, aucun backend requis.
   Ajout : <script src="chatbot.js"></script> juste avant </body>
   ========================================================== */
(function () {

  /* ---------- Base de connaissances (à adapter librement) ---------- */
  const RULES = [
    {
      keywords: ["bonjour", "salut", "bonsoir", "hello"],
      reply: "Bonjour 👋 Je suis l'assistant Job Univers. Je peux vous aider à trouver une offre, créer un compte, ou répondre à vos questions. Que cherchez-vous ?"
    },
    {
      keywords: ["emploi", "offre", "poste", "job", "recherche", "chercher"],
      reply: "Vous pouvez utiliser la barre de recherche en haut de la page d'accueil : entrez un métier ou une compétence, puis un pays ou une ville, et cliquez sur « Rechercher »."
    },
    {
      keywords: ["compte", "inscription", "inscrire", "créer un compte"],
      reply: "Pour créer un compte, allez sur la page de connexion, choisissez « Candidat » ou « Recruteur », puis cliquez sur le lien en bas du formulaire."
    },
    {
      keywords: ["connexion", "connecter", "login", "mot de passe"],
      reply: "Vous pouvez vous connecter depuis le bouton « Connexion » en haut de la page d'accueil. Mot de passe oublié ? Un lien dédié est disponible sur la page de connexion."
    },
    {
      keywords: ["postuler", "candidature"],
      reply: "Pour postuler à une offre, cliquez sur le bouton « Postuler » présent sur chaque annonce dans la liste des offres."
    },
    {
      keywords: ["recruteur", "publier", "entreprise", "annonce"],
      reply: "Si vous êtes recruteur, connectez-vous avec un compte recruteur puis utilisez le bouton « Publier une offre » en haut de la page."
    },
    {
      keywords: ["hse", "sécurité", "qhse"],
      reply: "Les offres HSE / QHSE apparaissent avec un badge vert dans la liste des dernières offres. Vous pouvez aussi taper « HSE » dans la barre de recherche."
    },
    {
      keywords: ["contact", "aide", "support", "problème"],
      reply: "Je peux répondre aux questions courantes ici. Pour un problème plus spécifique, un formulaire de contact sera bientôt disponible."
    },
    {
      keywords: ["merci"],
      reply: "Avec plaisir 🙂 N'hésitez pas si vous avez d'autres questions."
    }
  ];

  const FALLBACK = "Je n'ai pas bien compris. Essayez par exemple : « comment postuler », « créer un compte », ou « chercher un emploi ».";

  function findReply(text) {
    const lower = text.toLowerCase();
    for (const rule of RULES) {
      if (rule.keywords.some(k => lower.includes(k))) return rule.reply;
    }
    return FALLBACK;
  }

  /* ---------- Styles (namespacés sous #ju-chatbot) ---------- */
  const style = document.createElement('style');
  style.textContent = `
    #ju-chatbot-toggle{
      position:fixed; bottom:20px; right:20px; z-index:9999;
      width:56px; height:56px; border-radius:50%;
      background:#0F1B2D; color:#fff; border:none;
      box-shadow:0 10px 24px -6px rgba(15,27,45,0.45);
      display:flex; align-items:center; justify-content:center;
      cursor:pointer; font-size:1.4rem;
    }
    #ju-chatbot-panel{
      position:fixed; bottom:88px; right:20px; z-index:9999;
      width:min(340px, calc(100vw - 40px)); height:min(460px, calc(100vh - 140px));
      background:#fff; border-radius:16px; overflow:hidden;
      box-shadow:0 20px 50px -12px rgba(15,27,45,0.35);
      display:none; flex-direction:column;
      font-family:'Inter', sans-serif;
    }
    #ju-chatbot-panel.open{display:flex;}
    #ju-chatbot-head{
      background:#0F1B2D; color:#fff; padding:14px 16px;
      font-family:'Sora', sans-serif; font-weight:700; font-size:0.95rem;
      display:flex; align-items:center; justify-content:space-between;
    }
    #ju-chatbot-close{background:none; border:none; color:#fff; font-size:1.1rem; cursor:pointer; opacity:0.8;}
    #ju-chatbot-body{
      flex:1; overflow-y:auto; padding:14px; display:flex; flex-direction:column; gap:10px;
      background:#F7F5F1;
    }
    .ju-msg{max-width:80%; padding:9px 12px; border-radius:12px; font-size:0.86rem; line-height:1.4;}
    .ju-msg.bot{background:#fff; border:1px solid #E4E1D9; align-self:flex-start; border-bottom-left-radius:2px;}
    .ju-msg.user{background:#0F1B2D; color:#fff; align-self:flex-end; border-bottom-right-radius:2px;}
    #ju-chatbot-form{display:flex; gap:8px; padding:10px; border-top:1px solid #E4E1D9; background:#fff;}
    #ju-chatbot-input{
      flex:1; border:1.5px solid #E4E1D9; border-radius:10px; padding:9px 12px;
      font-family:'Inter', sans-serif; font-size:0.86rem; outline:none;
    }
    #ju-chatbot-input:focus{border-color:#0F1B2D;}
    #ju-chatbot-send{
      background:#0F1B2D; color:#fff; border:none; border-radius:10px;
      padding:0 16px; font-family:'Sora', sans-serif; font-weight:600; cursor:pointer;
    }
  `;
  document.head.appendChild(style);

  /* ---------- Structure HTML ---------- */
  const toggle = document.createElement('button');
  toggle.id = 'ju-chatbot-toggle';
  toggle.setAttribute('aria-label', "Ouvrir l'assistant");
  toggle.textContent = '💬';

  const panel = document.createElement('div');
  panel.id = 'ju-chatbot-panel';
  panel.innerHTML = `
    <div id="ju-chatbot-head">
      <span>Assistant Job Univers</span>
      <button id="ju-chatbot-close" aria-label="Fermer">✕</button>
    </div>
    <div id="ju-chatbot-body"></div>
    <form id="ju-chatbot-form">
      <input id="ju-chatbot-input" type="text" placeholder="Écrivez votre question…" autocomplete="off">
      <button type="submit" id="ju-chatbot-send">Envoyer</button>
    </form>
  `;

  document.body.appendChild(toggle);
  document.body.appendChild(panel);

  const body = panel.querySelector('#ju-chatbot-body');
  const form = panel.querySelector('#ju-chatbot-form');
  const input = panel.querySelector('#ju-chatbot-input');
  const closeBtn = panel.querySelector('#ju-chatbot-close');

  function addMessage(text, who) {
    const msg = document.createElement('div');
    msg.className = 'ju-msg ' + who;
    msg.textContent = text;
    body.appendChild(msg);
    body.scrollTop = body.scrollHeight;
  }

  let started = false;
  function openPanel() {
    panel.classList.add('open');
    if (!started) {
      started = true;
      addMessage("Bonjour 👋 Je suis l'assistant Job Univers. Comment puis-je vous aider ?", 'bot');
    }
    input.focus();
  }

  toggle.addEventListener('click', () => {
    panel.classList.contains('open') ? panel.classList.remove('open') : openPanel();
  });
  closeBtn.addEventListener('click', () => panel.classList.remove('open'));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    input.value = '';
    setTimeout(() => addMessage(findReply(text), 'bot'), 350);
  });

})();

