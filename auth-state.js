/* ==========================================================
   Job Univers — Détection de l'état de connexion
   Remplace le bouton "Connexion" par "Mon espace" si un
   candidat ou un recruteur est déjà connecté.
   Ajout : <script src="auth-state.js"></script> avant </body>
   ========================================================== */
(function () {
  const candidate = JSON.parse(localStorage.getItem('ju_candidate') || 'null');
  const recruiter = JSON.parse(localStorage.getItem('ju_recruiter') || 'null');

  const loginLink = document.querySelector('a[href="login.html"]');
  if (!loginLink) return;

  if (candidate && candidate.email) {
    loginLink.textContent = 'Mon espace';
    loginLink.href = 'dashboard.html';
  } else if (recruiter && recruiter.email) {
    loginLink.textContent = 'Mon espace';
    loginLink.href = 'dashboard-recruteur.html';
  }
})();

