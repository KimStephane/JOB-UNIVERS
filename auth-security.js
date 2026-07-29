/* ==========================================================
   Job Univers — Sécurité de connexion
   S'installe sans modifier le code existant de login.html.
   Ajout : <script src="auth-security.js"></script> avant </body>
   ========================================================== */
(function () {
  const API_BASE = "http://localhost:3003";

  /* ---------- 1. Afficher/Masquer le mot de passe (toutes les pages) ---------- */
  document.querySelectorAll('input[type="password"]').forEach(input => {
    const wrapper = input.parentElement;
    if (!wrapper || wrapper.querySelector('.ju-toggle-pw')) return;

    wrapper.style.position = wrapper.style.position || 'relative';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ju-toggle-pw';
    btn.textContent = '👁️';
    btn.style.cssText = 'background:none;border:none;cursor:pointer;font-size:0.95rem;opacity:0.5;flex-shrink:0;';
    btn.addEventListener('click', () => {
      const hidden = input.type === 'password';
      input.type = hidden ? 'text' : 'password';
      btn.textContent = hidden ? '🙈' : '👁️';
    });
    wrapper.appendChild(btn);
  });

  /* ---------- 2. Lien "Mot de passe oublié" ---------- */
  document.querySelectorAll('a').forEach(a => {
    if (a.textContent.trim() === 'Mot de passe oublié ?') {
      a.href = 'forgot-password.html';
    }
  });

  /* ---------- 3. Interception de la connexion (uniquement sur login.html) ---------- */
  const isLoginPage = !!document.getElementById('tab-candidat');
  if (!isLoginPage) return;

  // Affiche une zone de message d'erreur au-dessus du formulaire, si absente
  let errorBox = document.getElementById('ju-login-error');
  if (!errorBox) {
    errorBox = document.createElement('div');
    errorBox.id = 'ju-login-error';
    errorBox.style.cssText = 'display:none; background:#FBEAE7; color:#C4432E; font-size:0.84rem; padding:12px 14px; border-radius:8px; margin-bottom:14px; text-align:center;';
    const form = document.querySelector('form');
    if (form) form.parentNode.insertBefore(errorBox, form);
  }

  // Écouteur en phase de capture sur le document : s'exécute AVANT
  // l'ancien gestionnaire de redirection déjà présent dans la page.
  document.addEventListener('submit', function (e) {
    const form = e.target;
    if (form.tagName !== 'FORM') return;

    e.preventDefault();
    e.stopPropagation(); // empêche l'ancien code de rediriger sans vérification

    errorBox.style.display = 'none';

    const emailInput = form.querySelector('input[type="email"]');
    const passwordInput = form.querySelector('input[type="password"], input[type="text"].ju-pw-visible');
    const submitBtn = form.querySelector('button[type="submit"]');

    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';

    if (!email || !password) {
      errorBox.textContent = "Merci de remplir tous les champs.";
      errorBox.style.display = 'block';
      return;
    }

    const originalText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Connexion..."; }

    fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json().then(data => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (ok && data.success) {
          const params = new URLSearchParams(window.location.search);
          const redirect = params.get('redirect');
          if (redirect) {
            window.location.href = redirect;
          } else {
            window.location.href = 'index.html';
          }
        } else {
          errorBox.textContent = data.error || "Adresse e-mail ou mot de passe incorrect.";
          errorBox.style.display = 'block';
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalText; }
        }
      })
      .catch(() => {
        errorBox.textContent = "Impossible de contacter le serveur. Vérifiez qu'il est bien lancé.";
        errorBox.style.display = 'block';
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalText; }
      });
  }, true); // true = phase de capture, s'exécute en premier

})();

