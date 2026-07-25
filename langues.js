const traductions = {
    fr: {
        accueil: "Accueil",
        emplois: "Emplois",
        recruteur: "Recruteur",
        connexion: "Connexion"
    },

    en: {
        accueil: "Home",
        emplois: "Jobs",
        recruteur: "Recruiter",
        connexion: "Login"
    },

    es: {
        accueil: "Inicio",
        emplois: "Empleos",
        recruteur: "Reclutador",
        connexion: "Iniciar sesión"
    }
};

function changerLangue(langue) {
    document.getElementById("accueil").innerHTML = traductions[langue].accueil;
    document.getElementById("emplois").innerHTML = traductions[langue].emplois;
    document.getElementById("recruteur").innerHTML = traductions[langue].recruteur;
    document.getElementById("connexion").innerHTML = traductions[langue].connexion;
}
