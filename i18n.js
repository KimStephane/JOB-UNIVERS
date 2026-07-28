/* ==========================================================
   Job Univers — Système de traduction (FR / EN / ES)
   Auto-installable : ne nécessite AUCUNE modification du HTML
   existant. Repère le texte français connu et le remplace.
   Ajout : <script src="i18n.js"></script> juste avant </body>
   ========================================================== */
(function () {

  /* ---------- Dictionnaire : texte français -> traductions ---------- */
  const dict = {
    "Publier une offre": { en: "Post a job", es: "Publicar una oferta" },
    "Connexion": { en: "Log in", es: "Iniciar sesión" },
    "Mon espace": { en: "My space", es: "Mi espacio" },
    "Accueil": { en: "Home", es: "Inicio" },
    "Retour": { en: "Back", es: "Volver" },
    "Déconnexion": { en: "Log out", es: "Cerrar sesión" },

    "Plateforme internationale de recrutement": { en: "International recruitment platform", es: "Plataforma internacional de contratación" },
    "Des offres vérifiées, mises à jour chaque jour, dans tous les secteurs et sur tous les continents.": { en: "Verified listings, updated daily, across every industry and every continent.", es: "Ofertas verificadas, actualizadas cada día, en todos los sectores y continentes." },
    "Offres actives": { en: "Active listings", es: "Ofertas activas" },
    "Pays couverts": { en: "Countries covered", es: "Países cubiertos" },
    "Mise à jour": { en: "Updated", es: "Actualización" },
    "Rechercher": { en: "Search", es: "Buscar" },
    "Dernières offres": { en: "Latest listings", es: "Últimas ofertas" },
    "Voir toutes les offres": { en: "View all listings", es: "Ver todas las ofertas" },
    "Voir l'offre": { en: "View listing", es: "Ver oferta" },
    "Postuler": { en: "Apply", es: "Postularme" },
    "Tous droits réservés": { en: "All rights reserved", es: "Todos los derechos reservados" },

    "Espace membre": { en: "Member area", es: "Área de miembros" },
    "Accédez à votre espace pour continuer votre recherche ou gérer vos offres.": { en: "Access your space to continue your search or manage your listings.", es: "Accede a tu espacio para continuar tu búsqueda o gestionar tus ofertas." },
    "Candidat": { en: "Candidate", es: "Candidato" },
    "Recruteur": { en: "Recruiter", es: "Reclutador" },
    "Adresse e-mail": { en: "Email address", es: "Correo electrónico" },
    "Mot de passe": { en: "Password", es: "Contraseña" },
    "Se souvenir de moi": { en: "Remember me", es: "Recordarme" },
    "Mot de passe oublié ?": { en: "Forgot password?", es: "¿Olvidaste tu contraseña?" },
    "Se connecter en tant que candidat": { en: "Log in as a candidate", es: "Iniciar sesión como candidato" },
    "Se connecter en tant que recruteur": { en: "Log in as a recruiter", es: "Iniciar sesión como reclutador" },
    "ou": { en: "or", es: "o" },
    "Continuer avec Google": { en: "Continue with Google", es: "Continuar con Google" },
    "Créer un compte candidat": { en: "Create a candidate account", es: "Crear cuenta de candidato" },
    "Créer un compte recruteur": { en: "Create a recruiter account", es: "Crear cuenta de reclutador" },

    "Tableau de bord": { en: "Dashboard", es: "Panel" },
    "Messages": { en: "Messages", es: "Mensajes" },
    "Mon profil": { en: "My profile", es: "Mi perfil" },
    "Modifier": { en: "Edit", es: "Editar" },
    "Mes candidatures": { en: "My applications", es: "Mis postulaciones" },
    "Offres sauvegardées": { en: "Saved listings", es: "Ofertas guardadas" },
    "Envoyées": { en: "Sent", es: "Enviadas" },
    "En attente": { en: "Pending", es: "Pendientes" },
    "Entretiens": { en: "Interviews", es: "Entrevistas" },

    /* ---------- Inscription ---------- */
    "Créer un compte": { en: "Create an account", es: "Crear una cuenta" },
    "Rejoignez Job Univers pour postuler aux offres.": { en: "Join Job Univers to apply for jobs.", es: "Únete a Job Univers para postularte a las ofertas." },
    "Nom complet": { en: "Full name", es: "Nombre completo" },
    "Recevoir le code par e-mail": { en: "Receive the code by email", es: "Recibir el código por correo" },
    "Valider mon compte": { en: "Verify my account", es: "Verificar mi cuenta" },
    "Renvoyer le code": { en: "Resend the code", es: "Reenviar el código" },
    "Déjà inscrit ? ": { en: "Already have an account? ", es: "¿Ya tienes una cuenta? " },
    "Se connecter": { en: "Log in", es: "Iniciar sesión" },
    "Créer un compte entreprise": { en: "Create a company account", es: "Crear una cuenta de empresa" },
    "Publiez vos offres et échangez directement avec les candidats.": { en: "Post jobs and message candidates directly.", es: "Publica ofertas y comunícate directamente con los candidatos." },
    "Nom de l'entreprise": { en: "Company name", es: "Nombre de la empresa" },
    "Nom du contact RH": { en: "HR contact name", es: "Nombre del contacto de RRHH" },
    "Adresse e-mail professionnelle": { en: "Professional email address", es: "Correo electrónico profesional" },

    /* ---------- Détail d'une offre ---------- */
    "Sauvegarder": { en: "Save", es: "Guardar" },
    "Sauvegardé": { en: "Saved", es: "Guardado" },
    "Contacter le recruteur": { en: "Contact the recruiter", es: "Contactar al reclutador" },
    "Description du poste": { en: "Job description", es: "Descripción del puesto" },
    "Profil recherché": { en: "Desired profile", es: "Perfil buscado" },
    "Lieu": { en: "Location", es: "Ubicación" },
    "Contrat": { en: "Contract", es: "Contrato" },
    "Publié": { en: "Posted", es: "Publicado" },
    "Secteur": { en: "Sector", es: "Sector" },
    "Salaire à négocier": { en: "Negotiable salary", es: "Salario a negociar" },

    /* ---------- Messagerie ---------- */
    "Messagerie": { en: "Messaging", es: "Mensajería" },
    "Votre e-mail": { en: "Your email", es: "Tu correo" },
    "E-mail du destinataire": { en: "Recipient's email", es: "Correo del destinatario" },
    "Démarrer la conversation": { en: "Start the conversation", es: "Iniciar la conversación" },
    "Changer": { en: "Change", es: "Cambiar" },
    "Écrire un message…": { en: "Write a message…", es: "Escribe un mensaje…" },
    "Conversation privée": { en: "Private conversation", es: "Conversación privada" },

    /* ---------- Publication d'offre ---------- */
    "Remplissez les informations ci-dessous. Votre offre sera vérifiée sous 24h avant mise en ligne.": { en: "Fill in the details below. Your listing will be reviewed within 24h before going live.", es: "Complete la información a continuación. Su oferta será revisada en 24h antes de publicarse." },
    "Votre e-mail (recruteur)": { en: "Your email (recruiter)", es: "Tu correo (reclutador)" },
    "Intitulé du poste": { en: "Job title", es: "Título del puesto" },
    "Entreprise": { en: "Company", es: "Empresa" },
    "Secteur d'activité": { en: "Industry", es: "Sector de actividad" },
    "Salaire (optionnel)": { en: "Salary (optional)", es: "Salario (opcional)" },
    "Publier l'offre": { en: "Post the listing", es: "Publicar la oferta" },

    /* ---------- Tableaux de bord ---------- */
    "Espace recruteur": { en: "Recruiter space", es: "Espacio de reclutador" },
    "Gérez vos offres et suivez vos candidatures.": { en: "Manage your listings and track applications.", es: "Gestiona tus ofertas y postulaciones." },
    "Offres publiées": { en: "Listings posted", es: "Ofertas publicadas" },
    "Candidatures": { en: "Applications", es: "Postulaciones" },
    "Vues totales": { en: "Total views", es: "Vistas totales" },
    "Nouvelle offre": { en: "New listing", es: "Nueva oferta" },
    "Publiez un poste en quelques minutes": { en: "Post a job in minutes", es: "Publica un puesto en minutos" },
    "Mes offres publiées": { en: "My listings", es: "Mis ofertas" },
    "Candidatures reçues": { en: "Applications received", es: "Postulaciones recibidas" },
    "Certifier mon entreprise": { en: "Verify my company", es: "Certificar mi empresa" },
    "Certifier": { en: "Verify", es: "Certificar" },
    "Accepter": { en: "Accept", es: "Aceptar" },
    "Refuser": { en: "Reject", es: "Rechazar" },
    "Complétez votre profil": { en: "Complete your profile", es: "Completa tu perfil" },
    "complété": { en: "complete", es: "completado" }
  };

  /* ---------- Construction du dictionnaire inversé pour EN/ES -> FR ---------- */
  function translateText(text, lang) {
    const trimmed = text.trim();
    if (dict[trimmed] && dict[trimmed][lang]) return dict[trimmed][lang];
    return null;
  }

  /* ---------- Application de la traduction sur la page ---------- */
  function applyTranslation(lang) {
    if (lang === 'fr') {
      location.reload(); // recharge la page pour revenir au français d'origine proprement
      return;
    }

    document.querySelectorAll('body *').forEach(el => {
      if (el.children.length > 0) return; // ne traite que les éléments "feuilles" (sans enfants HTML)
      const original = el.textContent;
      const translated = translateText(original, lang);
      if (translated) el.textContent = translated;
    });

    document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(el => {
      const translated = translateText(el.getAttribute('placeholder'), lang);
      if (translated) el.setAttribute('placeholder', translated);
    });

    document.documentElement.lang = lang;
  }

  /* ---------- Widget sélecteur de langue (flottant, en haut) ---------- */
  const style = document.createElement('style');
  style.textContent = `
    #ju-lang-switcher{
      position:fixed; top:14px; right:14px; z-index:9998;
      background:rgba(255,255,255,0.95); border:1px solid #E4E1D9; border-radius:100px;
      padding:6px 10px; font-family:'IBM Plex Mono', monospace; font-size:0.72rem;
      display:flex; gap:6px; box-shadow:0 6px 16px -4px rgba(15,27,45,0.25);
    }
    #ju-lang-switcher button{
      background:none; border:none; cursor:pointer; font-size:0.9rem; padding:2px 4px; border-radius:6px;
    }
    #ju-lang-switcher button.active{background:#0F1B2D; color:#fff;}
  `;
  document.head.appendChild(style);

  const switcher = document.createElement('div');
  switcher.id = 'ju-lang-switcher';
  switcher.innerHTML = `
    <button type="button" data-lang="fr" title="Français">🇫🇷</button>
    <button type="button" data-lang="en" title="English">🇬🇧</button>
    <button type="button" data-lang="es" title="Español">🇪🇸</button>
  `;
  document.body.appendChild(switcher);

  const savedLang = localStorage.getItem('ju_lang') || 'fr';
  switcher.querySelectorAll('button').forEach(btn => {
    if (btn.dataset.lang === savedLang) btn.classList.add('active');
    btn.addEventListener('click', () => {
      localStorage.setItem('ju_lang', btn.dataset.lang);
      switcher.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyTranslation(btn.dataset.lang);
    });
  });

  if (savedLang !== 'fr') {
    // léger délai pour laisser le reste de la page (offres dynamiques, etc.) se charger d'abord
    setTimeout(() => applyTranslation(savedLang), 400);
  }

})();

