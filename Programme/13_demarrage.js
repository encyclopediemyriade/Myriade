// 13_demarrage.js — Le démarrage : les boutons sont branchés et la partie sauvegardée est chargée.
// Une partie du programme du jeu, chargée par jeu.html dans l'ordre des numéros.

// ==================================================================
// 12. DÉMARRAGE
// ==================================================================
// Étape M4 : sur téléphone, l'accueil est la page du territoire (maquette A) ; sur ordinateur, la page carte (étape 255)
// Étape M9 (07/11) : sur téléphone, l'onglet Accueil ouvre une vraie page d'accueil (« maison ») ; la page du territoire s'ouvre depuis elle
// Étape R273 (19/11, choix 9A d'Aubin, test du 19/11 n° 21 : « deux Accueil sur ordinateur ») : un mot désigne un seul écran.
//   Sur ordinateur, « Accueil » ouvre la page du territoire (les défis du jour, l'espèce du jour, les lieux) ;
//   l'ancienne page « Vos territoires » a son propre onglet, « Territoires » (le bouton « Carte » du téléphone, renommé).
function vueAccueil() { return window.matchMedia && window.matchMedia("(max-width: 760px)").matches ? "maison" : "accueil"; }
document.getElementById("onglet-accueil").onclick = () => { const v = vueAccueil(); montrer(v); if (v !== "carte") window.scrollTo(0, 0); };
document.getElementById("onglet-jouer").onclick = () => ouvrirPlusDeJeux();   // étape 253 : l'onglet « Plus de jeux »
document.getElementById("je-ne-sais-pas").onclick = () => {   // étape 76 ; R155 : sur la 1re photo d'une espèce, « Je ne la connais pas encore »
  if (document.getElementById("je-ne-sais-pas").dataset.ouverture === "oui") pasEncoreConnue(); else repondre(null, false, true);
};
document.querySelectorAll("[data-quitter]").forEach(bouton => bouton.onclick = quitterJeu);   // étape 73
if (document.getElementById("revoir-precedente")) document.getElementById("revoir-precedente").onclick = () => ouvrirHistorique((historiquePartie() || []).length - 1);   // étapes 247-248
document.getElementById("onglet-encyclopedie").onclick = () => montrer("encyclopedie");
if (document.getElementById("onglet-carte")) document.getElementById("onglet-carte").onclick = () => {
  if (vueAccueil() !== "maison") { montrer("carte"); window.scrollTo(0, 0); return; }   // R273 (9A) : sur ordinateur, l'onglet « Territoires »
  atlasTerritoire = null; atlasLieu = null; montrer("atlas"); };   // étape K2 : l'espace Carte (téléphone)
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
document.getElementById("retour-bienvenue").onclick = () => { etapeBienvenue = ECRANS_BIENVENUE[Math.max(0, ECRANS_BIENVENUE.indexOf(etapeBienvenue) - 1)]; afficherBienvenue(); window.scrollTo(0, 0); };   // étape PR4
// Un rappel affiché dans la console (F12) à chaque ouverture de la page :
// s'il apparaît, c'est que cette version du jeu connaît bien les commandes de test.
console.log("Commandes de test :  toutDebloquer()   toutDebloquer(0.5)   restaurerPartie()   changerProfil()\n"
          + "                     decouvrirEspeces()   decouvrirEspeces(10)   decouvrirEspece(\"Chamois\")\n"
          + "                     trouverCaracteristiques()   trouverCaracteristiques(0.5)");
// Étape R192 (n° 11.7, note d'Aubin du 13/11 : « la page d'accueil ne se met pas à jour ») : sur téléphone, l'application
//   reste ouverte en arrière-plan ; en y revenant (le lendemain, après une autre appli…), l'accueil montrait encore la date,
//   l'espèce du jour, les défis et le lieu d'avant. On le redessine dès que le jeu revient à l'écran.
function rafraichirAccueilVisible() {
  if (document.hidden) return;
  const maison = document.getElementById("vue-maison"), terr = document.getElementById("vue-accueil");
  if (maison && !maison.classList.contains("cache") && typeof dessinerMaison === "function") dessinerMaison();
  else if (terr && !terr.classList.contains("cache") && typeof afficherAccueil === "function") afficherAccueil();
}
document.addEventListener("visibilitychange", rafraichirAccueilVisible);
window.addEventListener("pageshow", ev => { if (ev.persisted) rafraichirAccueilVisible(); });
// Étape R270 (test du 19/11, n° 10 : « 0 expédition terminée sur 9 » à l'ouverture, alors qu'une l'était) : ce fichier dessine
//   l'accueil avant que les derniers fichiers du programme soient chargés (23 les repères, 27, 29…) ; sans les repères, le
//   trait demandé à l'étape 1 n'est pas le même pour certaines espèces, et leur expédition paraissait inachevée jusqu'au
//   prochain passage par l'accueil. On redessine donc l'accueil une fois tout le programme chargé.
document.addEventListener("DOMContentLoaded", () => { rafraichirAccueilVisible(); if (typeof afficherStats === "function") afficherStats(); });
document.addEventListener("keydown", auClavier);    // le clavier pendant la Rencontre (partie 7 bis)
window.addEventListener("scroll", fermerFenetre);   // la fenêtre se ferme si on fait défiler la page
// Étape R262 (lenteurs) : chaque dessin de page garde en mémoire, le temps du dessin, le statut et l'avancement des espèces
//   (avecMemoPage, 02_progression.js). Les pages ne changent pas la progression : rien d'autre ne change.
for (const nom of ["afficherAccueil", "afficherStats", "afficherPageCarte", "afficherAtlas", "afficherArcade", "afficherEncyclopedie",
                   "afficherPageEspece", "afficherPageProgression", "dessinerMaison", "dessinerEcranExpedition", "afficherAPropos", "verifierBadges", "photoFin", "photoProgression"])
  if (typeof window[nom] === "function" && !window[nom].avantMemo) window[nom] = avecMemoPage(window[nom]);
charger();                                         // ← on ressort la partie sauvegardée
if (typeof migrerToutDebloque === "function") migrerToutDebloque();   // étape PR6 : Tout débloquer, espèces comprises
if (typeof migrerLieuxR133 === "function") migrerLieuxR133();         // étape R133 : les lieux déjà ouverts le restent
// Étape 106 : les badges déjà mérités, sans vignette — étape R262 : fait après l'ouverture (fin de prechaufferCalculs)
afficherStats();
// Première visite (pas encore de profil) : ses trois écrans ; sinon, l'Accueil (étape 52)
if (profil) montrer(vueAccueil()); else montrerBienvenue();   // étape 255 : on arrive sur la page carte
// Étape R193 (n° 11.8, note d'Aubin du 14/11 : « un léger temps de latence pour tous les écrans ») : la première fois qu'un écran
//   a besoin de toutes les espèces (Carte, Jeux, une expédition, la première Rencontre), le jeu calculait d'un coup, pour des
//   centaines d'espèces, les questions possibles et les traits d'allure (jusqu'à 1,5 s sur téléphone). Ces calculs sont
//   maintenant faits à l'avance, par petits paquets, pendant que le joueur lit l'accueil : les écrans s'ouvrent ensuite sans attente.
// Étape R239b (36.03) : puis l'étape 2 des expéditions du territoire en cours (ouvrir une expédition la calculait d'un coup)
let prechauffeExp = false;
function prechaufferExpeditions() {
  if (typeof questionsEnsembleExp !== "function" || typeof expeditionsDe !== "function") return;
  const t = typeof territoireActif === "function" ? territoireActif() : null;
  const liste = t ? expeditionsDe(t) : [];
  let i = 0;
  const pas = () => {
    const fin = performance.now() + 12;
    while (i < liste.length && performance.now() < fin) { try { questionsEnsembleExp(liste[i]); } catch (err) { /* rien */ } i++; }
    if (i < liste.length) (window.requestIdleCallback ? requestIdleCallback(pas, { timeout: 500 }) : setTimeout(pas, 30));
  };
  pas();
}
function prechaufferCalculs() {
  const liste = ESPECES.slice();
  let i = 0;
  const attendre = cb => (window.requestIdleCallback ? requestIdleCallback(cb, { timeout: 400 }) : setTimeout(() => cb(null), 30));
  const paquet = echeance => {
    const fin = performance.now() + 12;            // au plus ~12 ms d'affilée : le jeu reste fluide pendant ce temps
    while (i < liste.length && (echeance ? echeance.timeRemaining() > 2 : performance.now() < fin)) {
      const e = liste[i++];
      try { listeQuestions(e); if (typeof champsEtape === "function") { champsEtape(e, 1); champsEtape(e, 2); champsEtape(e, 3); }   // R262
            if (typeof casesCarnet === "function") casesCarnet(e); if (typeof traitsAllure === "function") traitsAllure(e); if (typeof traitsPortrait === "function") traitsPortrait(e); } catch (err) { /* une espèce en défaut ne bloque rien */ }
      if (!echeance && performance.now() >= fin) break;
    }
    if (i < liste.length) attendre(paquet);
    else if (!prechauffeExp) {
      prechauffeExp = true;
      // Étape R262 : les badges déjà mérités (sans vignette), maintenant que les calculs sont prêts
      attendre(() => {
        if (!badgesInitiaux) verifierBadges(false);
        calculsPrets = true; afficherStats();      // R262 : le vrai nombre d'empreintes dans la barre du haut
        prechaufferExpeditions();
      });
    }
  };
  setTimeout(() => attendre(paquet), 600);         // juste après l'affichage de l'accueil
}
prechaufferCalculs();
