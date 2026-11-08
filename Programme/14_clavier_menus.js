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
const RETOURS_ECRAN = [
  "#ency-piste.ouvert #ency-piste-fermer",   // étape M18 : la piste d'une espèce à découvrir
  ".alb-retour",             // étape M18 : album d'une famille → sommaire de la collection
  "#retour-bienvenue",       // première visite, 2e écran
  "#fermer-famille",         // fenêtre « Nouvelle famille »
  "#finale-sortir",          // finale du lieu (question)
  "#planche-retour",         // planche de la finale
  ".fil-retour",             // « ← Expédition » pendant le jeu
  "#exp-retour-m",           // écran d'une expédition → le lieu
  "#lieu-sortir-m",          // page d'un lieu → le territoire
  "#pe-retour",              // fiche d'une espèce → l'encyclopédie
  "[data-quitter]"           // petits jeux et Rencontre : Quitter
];
function surTelephone() { return !!(window.matchMedia && window.matchMedia("(max-width: 760px)").matches); }
function visibleALEcran(el) { return el && el.getClientRects().length > 0 && !el.closest(".cache") && !el.disabled; }
function retourTelephone() {
  if (typeof feteOuverte !== "undefined" && feteOuverte && typeof fermerFete === "function") { fermerFete(); return true; }
  const fen = document.getElementById("fenetre");
  if (fen && fen.classList.contains("visible") && typeof fermerFenetre === "function") { fermerFenetre(); return true; }
  for (const sel of RETOURS_ECRAN) {
    const b = [...document.querySelectorAll(sel)].find(visibleALEcran);
    if (b) { b.click(); return true; }
  }
  // Sinon : on revient à l'accueil, sauf si l'on y est déjà (alors le retour quitte le jeu, comme une appli)
  const bienvenue = document.getElementById("vue-bienvenue");
  if (bienvenue && !bienvenue.classList.contains("cache")) return false;
  const accueil = typeof vueAccueil === "function" ? vueAccueil() : "maison";
  const vueAcc = document.getElementById("vue-" + accueil);
  if (vueAcc && !vueAcc.classList.contains("cache")) return false;
  montrer(accueil); window.scrollTo(0, 0);
  return true;
}
if (surTelephone() && window.history && history.pushState) {
  try {
    history.replaceState({ myriade: "base" }, "");
    history.pushState({ myriade: "garde" }, "");
    window.addEventListener("popstate", () => {
      if (!surTelephone()) return;
      if (retourTelephone()) history.pushState({ myriade: "garde" }, "");
      else history.back();                       // depuis l'accueil : on quitte vraiment le jeu
    });
  } catch (e) { /* navigateur sans historique : on laisse faire */ }
}
