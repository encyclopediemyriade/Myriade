// 13_demarrage.js — Le démarrage : les boutons sont branchés et la partie sauvegardée est chargée.
// Une partie du programme du jeu, chargée par jeu.html dans l'ordre des numéros.

// ==================================================================
// 12. DÉMARRAGE
// ==================================================================
// Étape M4 : sur téléphone, l'accueil est la page du territoire (maquette A) ; sur ordinateur, la page carte (étape 255)
// Étape M9 (07/11) : sur téléphone, l'onglet Accueil ouvre une vraie page d'accueil (« maison ») ; la page du territoire s'ouvre depuis elle
function vueAccueil() { return window.matchMedia && window.matchMedia("(max-width: 760px)").matches ? "maison" : "carte"; }
document.getElementById("onglet-accueil").onclick = () => { const v = vueAccueil(); montrer(v); if (v !== "carte") window.scrollTo(0, 0); };
document.getElementById("onglet-jouer").onclick = () => ouvrirPlusDeJeux();   // étape 253 : l'onglet « Plus de jeux »
document.getElementById("je-ne-sais-pas").onclick = () => {   // étape 76 ; R155 : sur la 1re photo d'une espèce, « Je ne la connais pas encore »
  if (document.getElementById("je-ne-sais-pas").dataset.ouverture === "oui") pasEncoreConnue(); else repondre(null, false, true);
};
document.querySelectorAll("[data-quitter]").forEach(bouton => bouton.onclick = quitterJeu);   // étape 73
if (document.getElementById("revoir-precedente")) document.getElementById("revoir-precedente").onclick = () => ouvrirHistorique((historiquePartie() || []).length - 1);   // étapes 247-248
document.getElementById("onglet-encyclopedie").onclick = () => montrer("encyclopedie");
document.getElementById("bouton-jouer-accueil").onclick = () => lancerJouer();   // étape 196 : un seul bouton
document.getElementById("bouton-encyclopedie-accueil").onclick = () => montrer("encyclopedie");
// Étape 274 (« Revoir 4 ») : fin de Rencontre — une autre Rencontre au hasard, le territoire, ou l'accueil
document.getElementById("bouton-rejouer").onclick = () => rencontreAleatoire();
document.getElementById("bouton-fin-territoire").onclick = () => { session = null; montrer("accueil"); window.scrollTo(0, 0); };
document.getElementById("bouton-fin-accueil").onclick = () => { session = null; montrer(vueAccueil()); window.scrollTo(0, 0); };
// Étape 274 : fin de partie — Rejouer · Retour au territoire (ou aux jeux, depuis « Plus de jeux ») · Accueil (la page carte)
document.getElementById("bouton-territoire-defi").onclick = () => { montrer(depuisArcade ? "arcade" : "accueil"); window.scrollTo(0, 0); };
document.getElementById("bouton-autre-defi").onclick = () => { depuisArcade = false; montrer(vueAccueil()); window.scrollTo(0, 0); };
document.getElementById("suivant").onclick = () => {
  // Qui est-ce ? et Plus ou moins sans chronomètre : espèce ou duel suivant, ou l'écran de fin
  if (defi) { suiteDuJeu(); return; }                   // la fin, une découverte ou la manche suivante (étape 73)
  if (session && session.focus && session.faites < session.total && !resteAQuestionner()) session.total = session.faites;   // étape 74
  if (session && session.faites >= session.total) terminerSession();
  else nouvelleRencontre();
};
// Étape PR4 : « Recommencer » est dans la page À propos (06_encyclopedie.js, afficherAPropos)
document.getElementById("onglet-apropos").onclick = () => montrer("apropos");   // étape 102
document.getElementById("onglet-progression").onclick = () => montrer("progression");   // étape 106
document.getElementById("suite-bienvenue").onclick = suiteBienvenue;
document.getElementById("retour-bienvenue").onclick = () => { etapeBienvenue = ECRANS_BIENVENUE[Math.max(0, ECRANS_BIENVENUE.indexOf(etapeBienvenue) - 1)]; afficherBienvenue(); };   // étape PR4
// Un rappel affiché dans la console (F12) à chaque ouverture de la page :
// s'il apparaît, c'est que cette version du jeu connaît bien les commandes de test.
console.log("Commandes de test :  toutDebloquer()   toutDebloquer(0.5)   restaurerPartie()   changerProfil()\n"
          + "                     decouvrirEspeces()   decouvrirEspeces(10)   decouvrirEspece(\"Chamois\")\n"
          + "                     trouverCaracteristiques()   trouverCaracteristiques(0.5)");
document.addEventListener("keydown", auClavier);    // le clavier pendant la Rencontre (partie 7 bis)
window.addEventListener("scroll", fermerFenetre);   // la fenêtre se ferme si on fait défiler la page
charger();                                         // ← on ressort la partie sauvegardée
if (typeof migrerToutDebloque === "function") migrerToutDebloque();   // étape PR6 : Tout débloquer, espèces comprises
if (typeof migrerLieuxR133 === "function") migrerLieuxR133();         // étape R133 : les lieux déjà ouverts le restent
verifierBadges(false);                             // étape 106 : les badges déjà mérités, sans vignette
afficherStats();
// Première visite (pas encore de profil) : ses trois écrans ; sinon, l'Accueil (étape 52)
if (profil) montrer(vueAccueil()); else montrerBienvenue();   // étape 255 : on arrive sur la page carte
