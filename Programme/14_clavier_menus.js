// 14_clavier_menus.js — Le clavier en fin de partie (étape 229, 20/10/2026).
//
// Sur l'écran de fin de partie (fin des jeux et fin de Rencontre) :
//   flèches → un cadre ocre passe d'un bouton à l'autre
//            (« Essayer à nouveau ces questions », « Rejouer », « Accueil »…)
//   Entrée  → comme un clic sur le bouton encadré
// Ailleurs, rien ne change.

let boutonFinClavier = null;

function boutonsFinDePartie() {
  if (document.getElementById("vue-rencontre").classList.contains("cache")) return [];
  const ecran = ["fin-defi", "fin-session"].map(id => document.getElementById(id))
    .find(e => e && !e.classList.contains("cache"));
  if (!ecran) return [];
  return [...ecran.querySelectorAll("button")].filter(b => !b.disabled && b.getClientRects().length && !b.closest(".cache"));
}

function encadrerFin(bouton) {
  if (boutonFinClavier) boutonFinClavier.classList.remove("cadre-clavier");
  boutonFinClavier = bouton;
  if (!bouton) return;
  bouton.classList.add("cadre-clavier");
  bouton.focus({ preventScroll: true });
  bouton.scrollIntoView({ block: "nearest" });
}

document.addEventListener("keydown", ev => {
  if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].includes(ev.key)) return;
  if (ev.ctrlKey || ev.altKey || ev.metaKey) return;
  if (typeof feteOuverte !== "undefined" && feteOuverte) return;       // une fête ouverte se ferme d'abord (Entrée)
  const boutons = boutonsFinDePartie();
  if (!boutons.length) { encadrerFin(null); return; }
  ev.preventDefault();
  ev.stopPropagation();
  let i = boutons.indexOf(boutonFinClavier);
  if (ev.key === "Enter") {
    if (i === -1) { encadrerFin(boutons[0]); return; }                 // première touche : on montre où l'on est
    const bouton = boutons[i];
    encadrerFin(null);
    bouton.click();
    return;
  }
  const avance = (ev.key === "ArrowDown" || ev.key === "ArrowRight") ? 1 : -1;
  i = i === -1 ? 0 : Math.min(boutons.length - 1, Math.max(0, i + avance));
  encadrerFin(boutons[i]);
}, true);

// Un clic de souris efface le cadre
document.addEventListener("mousedown", () => encadrerFin(null), true);

// ==================================================================
// Étape M14 (07/11/2026) — le bouton « retour » du téléphone (geste ou touche ◁ d'Android).
// Avant : il faisait quitter le jeu. Maintenant il fait comme le bouton « ← » de l'écran
// (expédition → lieu → territoire → accueil), et ne quitte le jeu que depuis l'accueil.
// Téléphone seulement (écran de moins de 760 px) : rien ne change sur ordinateur.
// Principe : une page « de garde » est ajoutée à l'historique du navigateur ; quand le joueur
// fait « retour », le navigateur revient de cette page, le jeu fait son propre retour, puis remet la garde.
// ==================================================================
// Étape R241 (17/11, notes 2, 17 et 33 du 16/11, choix d'Aubin « 2aA · 2bA ») : la touche retour revient TOUJOURS à la page
//   précédente (le jeu garde la liste des pages vues). Exceptions : une fenêtre ouverte se ferme d'abord ; dans un jeu, on en
//   sort comme avec son « ← » (défi mis de côté, Rencontre → page de l'expédition, jeux → page des jeux) ; sur l'accueil,
//   un second appui quitte le jeu (« Appuyez encore pour quitter ») ; on ne revient jamais à l'écran de bienvenue.
const RETOURS_ECRAN = [
  "#ency-piste.ouvert #ency-piste-fermer",   // étape M18 : la piste d'une espèce à découvrir
  ".alb-retour",             // étape M18 : album d'une famille → sommaire de la collection
  "#retour-bienvenue",       // première visite, 2e écran
  "#fermer-famille",         // fenêtre « Nouvelle famille »
  "#finale-sortir",          // finale du lieu (question)
  "#planche-retour",         // planche de la finale
  ".fil-retour",             // « ← Expédition » pendant le jeu (Rencontre, étape 2, Approfondir)
  "#dfx-quitter",            // R241 : le défi → mis de côté, page de l'expédition
  "#cdo-quitter",            // R241 : Coup d'œil → les jeux
  "#ore-quitter",            // R241 : À l'oreille → les jeux
  ".haut-jeu-retour",        // R241 : un jeu lancé hors expédition → là d'où il a été lancé
  "#vue-atlas .at-retour"    // R241 : la carte d'un territoire → la France
];
// ---- La liste des pages vues (R241) ----
const pileRetour = [];
let pageCourante = null, retourEnCours = false;
function etatPage(vue) {
  const y = 0;   // étape R262 (lenteurs) : la position est lue en quittant la page (noterDepartPage) ; la lire ici forçait un calcul de mise en page
  switch (vue) {
    case "maison": case "accueil": case "progression": case "apropos": case "carte": case "arcade":
      return { vue, cle: vue, y, aller: () => montrer(vue) };
    case "encyclopedie": { const c = typeof filtreClasse !== "undefined" ? filtreClasse : null;
      return { vue, cle: "ency|" + c, y, aller: () => { if (c !== null) filtreClasse = c; montrer("encyclopedie"); } }; }
    case "atlas": { const t = typeof atlasTerritoire !== "undefined" ? atlasTerritoire : null, l = typeof atlasLieu !== "undefined" ? atlasLieu : null;
      return { vue, cle: "atlas|" + t, y, aller: () => { atlasTerritoire = t; atlasLieu = l; montrer("atlas"); } }; }
    case "espece": { const e = typeof especeOuverte !== "undefined" ? especeOuverte : null;
      return e ? { vue, cle: "espece|" + e.nom_courant, y, aller: () => ouvrirPageEspece(e) } : null; }
    case "expedition": { const x = typeof expeditionAffichee !== "undefined" ? expeditionAffichee : null;
      return x ? { vue, cle: "exp|" + x.id, y, aller: () => ouvrirExpedition(x) } : null; }
    case "lieu": { const l = typeof lieuAffiche !== "undefined" && lieuAffiche ? { ...lieuAffiche } : null;
      if (!l || l.finale) return null;   // la finale est un jeu : on n'y revient pas
      return { vue, cle: "lieu|" + l.t + "|" + l.nom + (l.site ? "|site" : ""), y, aller: () => l.site ? ouvrirSite(l.t) : ouvrirLieu(l.t, l.nom) }; }
    default: return null;                // les jeux (Rencontre, défi, Coup d'œil…) ne sont pas des pages où l'on revient
  }
}
// Appelé par montrer() au début (la page quittée) et à la fin (la page affichée)
function noterDepartPage(vue) {
  if (retourEnCours || !pageCourante) return;
  const neuve = etatPage(vue);
  if (neuve && neuve.cle === pageCourante.cle) return;   // la même page redessinée
  pageCourante.y = window.scrollY || 0;
  if (!pileRetour.length || pileRetour[pileRetour.length - 1].cle !== pageCourante.cle) pileRetour.push(pageCourante);
  if (pileRetour.length > 40) pileRetour.shift();
}
function noterArriveePage(vue) { pageCourante = etatPage(vue); }
function revenirPagePrecedente() {
  while (pileRetour.length) {
    const p = pileRetour.pop();
    if (pageCourante && p.cle === pageCourante.cle) continue;   // la page où l'on est déjà
    retourEnCours = true;
    try { p.aller(); } finally { retourEnCours = false; }
    const y = p.y || 0;
    requestAnimationFrame(() => window.scrollTo(0, y));
    return true;
  }
  return false;
}
let dernierAppuiAccueil = 0;
function surTelephone() { return !!(window.matchMedia && window.matchMedia("(max-width: 760px)").matches); }
function visibleALEcran(el) { return el && el.getClientRects().length > 0 && !el.closest(".cache") && !el.disabled; }
function retourTelephone() {
  if (typeof signalementOuvert === "function" && signalementOuvert()) { fermerSignalement(); return true; }   // étape CT1 : le panneau « Signaler » se ferme d'abord
  if (typeof feteOuverte !== "undefined" && feteOuverte && typeof fermerFete === "function") { fermerFete(); return true; }
  if (typeof tiroirOuvert === "function" && tiroirOuvert()) { fermerTiroir(); return true; }   // étape R194 : d'abord le tiroir de la fiche
  const grande = document.getElementById("photo-agrandie");   // R239 : la grande photo (et la galerie) se ferme d'abord
  if (grande && grande.classList.contains("ouvert")) { grande.classList.remove("ouvert"); return true; }
  if (typeof saviezVousOuvert === "function" && saviezVousOuvert()) { fermerSaviezVous(); return true; }   // étape R246
  const fen = document.getElementById("fenetre");
  if (fen && fen.classList.contains("visible") && typeof fermerFenetre === "function") { fermerFenetre(); return true; }
  for (const sel of RETOURS_ECRAN) {
    const b = [...document.querySelectorAll(sel)].find(visibleALEcran);
    if (b) { b.click(); return true; }
  }
  const bienvenue = document.getElementById("vue-bienvenue");
  if (bienvenue && !bienvenue.classList.contains("cache")) return false;
  // L'accueil : un second appui quitte le jeu (2aA)
  const accueil = typeof vueAccueil === "function" ? vueAccueil() : "maison";
  const vueAcc = document.getElementById("vue-" + accueil);
  if (vueAcc && !vueAcc.classList.contains("cache")) {
    if (Date.now() - dernierAppuiAccueil < 2500) return false;
    dernierAppuiAccueil = Date.now();
    if (typeof afficherBulle === "function") afficherBulle("Appuyez encore pour quitter");
    return true;
  }
  // Ailleurs : la page d'avant (2bA : après un changement d'onglet, l'onglet d'avant), sinon l'accueil
  if (revenirPagePrecedente()) return true;
  montrer(accueil); window.scrollTo(0, 0);
  return true;
}
if (surTelephone() && window.history && history.pushState) {
  try {
    history.replaceState({ myriade: "base" }, "");
    history.pushState({ myriade: "garde" }, "");
    window.addEventListener("popstate", () => {
      if (typeof arreterCri === "function") arreterCri();   // étape R176 : le retour du téléphone coupe le son
      if (!surTelephone()) return;
      if (retourTelephone()) history.pushState({ myriade: "garde" }, "");
      else history.back();                       // depuis l'accueil : on quitte vraiment le jeu
    });
  } catch (e) { /* navigateur sans historique : on laisse faire */ }
}

// ==================================================================
// Étape R239 (17/11/2026, note 5 du 16/11, tâche 36.05) — le temps de garde : un toucher dans le premier quart de seconde
// après l'arrivée de nouvelles réponses ne compte pas (on touchait parfois une réponse de la question suivante sans le vouloir).
// Seuls les vrais touchers sont concernés (pas les clics faits par le programme ni par les tests).
// ==================================================================
const REPONSES_GARDEES = "#reponses button, .en-rep, .fl-rep, .cdo-nom, .ore-photo, .fe-photos button";
const GARDE_MS = 250;
let arriveeReponses = 0;
try {
  new MutationObserver(muts => {
    for (const m of muts) for (const n of m.addedNodes)
      if (n.nodeType === 1 && (n.matches(REPONSES_GARDEES) || n.querySelector(REPONSES_GARDEES))) { arriveeReponses = performance.now(); return; }
  }).observe(document.body, { childList: true, subtree: true });
  document.addEventListener("click", ev => {
    if (!ev.isTrusted || performance.now() - arriveeReponses >= GARDE_MS) return;
    if (ev.target && ev.target.closest && ev.target.closest(REPONSES_GARDEES)) { ev.stopImmediatePropagation(); ev.preventDefault(); }
  }, true);
} catch (e) { /* navigateur trop ancien : pas de temps de garde */ }
