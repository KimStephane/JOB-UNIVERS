/* ==========================================================
   Job Univers — Navigation intelligente selon connexion
   - Menu ☰ (Tableau de bord, Messages, Paramètres, Déconnexion)
     visible UNIQUEMENT si connecté.
   - "Publier une offre" redirige vers la connexion si on n'est
     pas connecté en tant que recruteur, puis revient publier
     une fois connecté/inscrit.
   Ajout : <script src="auth-state.js"></script> avant </body>
   ========================================================== */
(function () {
  const candidate = JSON.parse(localStorage.getItem('ju_candidate') || 'null');
  const recruiter = JSON.parse(localStorage.getItem('ju_recruiter') || 'null');
  const isLoggedIn = !!((candidate && candidate.email) || (recruiter && recruiter.email));
  const dashboardHref = recruiter ? 'dashboard-recruteur.html' : 'dashboard.html';

  /* ---------- 1. Cacher "Connexion" et afficher le menu ☰ si connecté ---------- */
  const loginLink = document.querySelector('a[href="login.html"]');

  if (isLoggedIn) {
    if (loginLink) loginLink.style.display = 'none';
    injectMenu();
  }

  function injectMenu() {
    const style = document.createElement('style');
    style.textContent = `
      #ju-menu-btn{
        background:none; border:1px solid rgba(255,255,255,0.3); color:#fff;
        width:38px; height:38px; border-radius:9px; font-size:1.1rem; cursor:pointer;
        display:flex; align-items:center; justify-content:center; margin-left:8px;
      }
      #ju-menu-dropdown{
        position:fixed; top:60px; right:14px; z-index:9999;
        background:#fff; border:1px solid #E4E1D9; border-radius:12px;
        box-shadow:0 16px 32px -10px rgba(15,27,45,0.35);
        min-width:200px; padding:8px; display:none; font-family:'Inter', sans-serif;
      }
      #ju-menu-dropdown.open{display:block;}
      #ju-menu-dropdown a, #ju-menu-dropdown button{
        display:flex; align-items:center; gap:10px; width:100%; text-align:left;
        padding:11px 12px; border-radius:8px; font-size:0.88rem; color:#1A1F26;
        background:none; border:none; cursor:pointer; text-decoration:none; font-family:'Inter', sans-serif;
      }
      #ju-menu-dropdown a:hover, #ju-menu-dropdown button:hover{background:#F7F5F1;}
      #ju-menu-dropdown .divider{height:1px; background:#E4E1D9; margin:6px 0;}
      #ju-menu-dropdown .logout{color:#C4432E;}
    `;
    document.head.appendChild(style);

    const btn = document.createElement('button');
    btn.id = 'ju-menu-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Menu');
    btn.textContent = '☰';

    const dropdown = document.createElement('div');
    dropdown.id = 'ju-menu-dropdown';
    dropdown.innerHTML = `
      <a href="${dashboardHref}">📊 Tableau de bord</a>
      <a href="messages.html">💬 Messages</a>
      <a href="parametres.html">⚙️ Paramètres du compte</a>
      <div class="divider"></div>
      <button type="button" class="logout" id="ju-logout-btn">🚪 Déconnexion</button>
    `;

    // Insère le bouton menu juste après le lien "Connexion" (masqué) s'il existe, sinon en fin de nav
    if (loginLink && loginLink.parentNode) {
      loginLink.parentNode.appendChild(btn);
    } else {
      document.body.appendChild(btn);
      btn.style.position = 'fixed';
      btn.style.top = '14px';
      btn.style.right = '14px';
      btn.style.zIndex = '9998';
      btn.style.background = '#0F1B2D';
    }
    document.body.appendChild(dropdown);

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });
    document.addEventListener('click', () => dropdown.classList.remove('open'));

    document.getElementById('ju-logout-btn').addEventListener('click', () => {
      localStorage.removeItem('ju_candidate');
      localStorage.removeItem('ju_recruiter');
      window.location.href = 'index.html';
    });
  }

  /* ---------- 2. "Publier une offre" : exige d'être connecté en recruteur ---------- */
  const publishLink = document.querySelector('a[href="publish-job.html"]');
  if (publishLink) {
    publishLink.addEventListener('click', (e) => {
      if (!recruiter || !recruiter.email) {
        e.preventDefault();
        window.location.href = 'login.html?redirect=publish-job.html';
      }
      // sinon, comportement normal : navigation directe vers publish-job.html
    });
  }

  /* ---------- 3. Fait passer le paramètre "redirect" vers les liens d'inscription ---------- */
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get('redirect');
  if (redirect) {
    document.querySelectorAll('a[href="signup.html"], a[href="signup-recruteur.html"]').forEach(a => {
      a.href += '?redirect=' + encodeURIComponent(redirect);
    });
  }

})();

