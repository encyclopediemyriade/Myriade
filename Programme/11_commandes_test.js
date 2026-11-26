// 11_commandes_test.js — Les commandes de test à taper dans la console (voir commandes_console.txt).
// Une partie du programme du jeu, chargée par jeu.html dans l'ordre des numéros.

// ==================================================================
// 11 ter. COMMANDES DE TEST (étape 34)
//    Pour essayer le jeu sans avoir à tout débloquer en jouant. Elles se tapent
//    dans la "console" du navigateur : touche F12, onglet "Console", puis Entrée.
//
//      toutDebloquer()      → toutes les cases de toutes les fiches sont trouvées
//                             (médailles d'or, anneaux pleins, tous les défis ouverts)
//      toutDebloquer(0.5)   → seulement la moitié des cases de chaque espèce
//                             (0.5 = 50 % ; on peut mettre 0.2, 0.8…)
//      restaurerPartie()    → remet la vraie partie, telle qu'elle était avant toutDebloquer()
//      changerProfil()      → rouvre la première visite, sans rien effacer (étapes 52 et 60)
//    Étape 84 : débloquer séparément les espèces et les caractéristiques
//      decouvrirEspeces()           → toutes les espèces sont découvertes (photo reconnue), sans aucune caractéristique
//      decouvrirEspeces(10)         → 10 espèces inconnues, tirées au hasard, sont découvertes
//      decouvrirEspece("Chamois")   → une espèce précise est découverte (le nom, avec ou sans accents ni majuscules)
//      trouverCaracteristiques()    → toutes les caractéristiques des espèces DÉJÀ découvertes sont trouvées
//      trouverCaracteristiques(0.5) → seulement une partie (0.5 = la moitié) ; les espèces inconnues restent inconnues
//
//    La vraie partie est mise de côté dans le tiroir du navigateur avant d'être remplacée.
// ==================================================================
const CLE_AVANT_TEST = CLE_SAUVEGARDE + "-avant-test";

// Mettre la vraie partie de côté, sauf si une partie de test est déjà en cours (étape 84 : commun à toutes les commandes).
// Rend false si le tiroir du navigateur est indisponible : on prévient au lieu d'échouer en silence.
function mettreDeCote() {
  try {
    if (!localStorage.getItem(CLE_AVANT_TEST)) {
      localStorage.setItem(CLE_AVANT_TEST, localStorage.getItem(CLE_SAUVEGARDE) || "vide");
    }
    return true;
  } catch (e) {
    alert("Le navigateur refuse d'enregistrer (navigation privée ?). Le test ne peut pas être mis en place.");
    return false;
  }
}

// Découvrir des espèces (la photo reconnue), sans leur donner de caractéristiques
function decouvrirEspeces(combien) {
  if (!mettreDeCote()) return;
  let liste = ESPECES.filter(e => estRenseigne(e.photo) && !estIdentifiee(e));
  if (combien !== undefined) liste = melanger(liste).slice(0, combien);
  for (const espece of liste) { marquerVue(espece); progression[espece.nom_courant].acquis[IDENTIFICATION] = 1; }
  sauvegarder();
  location.reload();
  return `${liste.length} espèce(s) découverte(s). Pour revenir à la vraie partie : restaurerPartie()`;
}

function decouvrirEspece(nom) {
  const espece = ESPECES.find(e => simplifier(e.nom_courant) === simplifier(nom));
  if (!espece) return `Espèce introuvable : « ${nom} ». Vérifier l'orthographe (ex. decouvrirEspece("Chamois")).`;
  if (!mettreDeCote()) return;
  marquerVue(espece);
  progression[espece.nom_courant].acquis[IDENTIFICATION] = 1;
  sauvegarder();
  location.reload();
  return `${espece.nom_courant} est découverte.`;
}

// Trouver des caractéristiques, seulement pour les espèces déjà découvertes
function trouverCaracteristiques(part = 1) {
  if (!mettreDeCote()) return;
  const connues = ESPECES.filter(e => estIdentifiee(e));
  for (const espece of connues) {
    if (!progression[espece.nom_courant]) marquerVue(espece);   // une espèce sans photo compte comme découverte sans avoir encore de fiche
    const champs = casesCarnet(espece).filter(c => c !== IDENTIFICATION);   // étape PR8 : les cases du carnet, cris compris même son coupé
    for (const champ of champs.slice(0, Math.ceil(champs.length * part))) {
      if (nbBonnes(espece, champ) === 0) progression[espece.nom_courant].acquis[champ] = 1;
    }
  }
  sauvegarder();
  location.reload();
  return `Caractéristiques trouvées pour ${connues.length} espèce(s) découverte(s).`;
}

function toutDebloquer(part = 1) {
  if (!mettreDeCote()) return;
  for (const espece of ESPECES) {
    const champs = casesCarnet(espece);                           // la photo d'abord, puis les caractéristiques (étape PR8 : cris compris)
    const combien = Math.max(1, Math.ceil(champs.length * part));
    if (!progression[espece.nom_courant]) progression[espece.nom_courant] = { acquis: {} };
    for (const champ of champs.slice(0, combien)) {
      if (nbBonnes(espece, champ) === 0) progression[espece.nom_courant].acquis[champ] = 1;
    }
  }
  sauvegarder();
  location.reload();                                              // on recharge la page pour tout réafficher
  return "Partie de test en place. Pour revenir à la vraie partie : restaurerPartie()";
}

function restaurerPartie() {
  const avant = localStorage.getItem(CLE_AVANT_TEST);
  if (!avant) return "Aucune partie mise de côté : rien à restaurer.";
  if (avant === "vide") localStorage.removeItem(CLE_SAUVEGARDE);  // il n'y avait pas encore de partie
  else localStorage.setItem(CLE_SAUVEGARDE, avant);
  localStorage.removeItem(CLE_AVANT_TEST);
  location.reload();
  return "Vraie partie restaurée.";
}

// Étape 333 (30/10) : mesurer la lenteur du passage au Profil, sur la vraie partie du joueur.
//   Taper mesurerProfil() dans la console (F12), puis recopier le résultat à Claude.
function mesurerProfil() {
  const temps = {}, chrono = (nom, f) => { const t0 = performance.now(); try { f(); } finally { temps[nom] = Math.round(performance.now() - t0) + " ms"; } };
  const ESP = ESPECES;
  chrono("carnet de toute la France", () => carnetDe(ESP));
  chrono("cases de toutes les fiches", () => { for (const e of ESP) for (const c of casesCarnet(e)) niveauDonnee(e, c); });
  chrono("tous les badges", () => tousLesBadges().forEach(b => { palierDe(b); prochainSeuil(b); b.mesure(); }));
  chrono("page Profil complète", () => afficherPageProgression());
  const t0 = performance.now();
  montrer("progression");
  requestAnimationFrame(() => setTimeout(() => {
    temps["clic jusqu'à l'affichage"] = Math.round(performance.now() - t0) + " ms";
    temps["taille de la sauvegarde"] = Math.round((localStorage.getItem(CLE_SAUVEGARDE) || "").length / 1024) + " ko";
    temps["espèces dans le carnet"] = Object.keys(progression).length;
    console.table(temps);
  }, 0));
  return "Mesure en cours : le tableau s'affiche juste en dessous.";
}

// ==================================================================
// Étape R188c (11/11/2026, accord d'Aubin) — LE RACCOURCI DE TEST
//   Invisible pour les joueurs : ouvrir le jeu avec « ?test » à la fin de l'adresse (R319 : les 5 touches en bas d'À propos
//   ouvrent maintenant le mode testeur et son bloc « Pour tester », voir plus bas). Une fenêtre permet d'ouvrir directement, pour chaque territoire :
//   la page d'un lieu (même fermé), la finale d'un lieu EN ESSAI (rien n'est enregistré) et le site remarquable.
//   Attention : les haltes du site remarquable jouées ainsi comptent dans la partie (le site n'a pas de mode essai).
//   Sert à tester la fin du parcours pendant la refonte de l'étape 1. À retirer (ou garder caché) avant d'ouvrir le jeu à tous.
// ==================================================================
function ouvrirAccesTest(t) {
  window.ACCES_TEST_OUVERT = true;   // étape R190 : les repères « exemple » se montrent en mode test
  if (typeof chapitresDe !== "function") return;
  const terrs = Object.keys(TERRITOIRES).filter(x => chapitresDe(x).length);
  t = terrs.includes(t) ? t : (typeof territoireActif === "function" && terrs.includes(territoireActif()) ? territoireActif() : terrs[0]);
  let z = document.getElementById("acces-test");
  if (!z) { z = document.createElement("div"); z.id = "acces-test"; z.className = "acces-test"; document.body.append(z); }
  const lieux = lieuxDe(t), site = siteRemarquable(t);
  z.innerHTML = `<div class="at-boite" role="dialog" aria-label="Raccourci de test">
      <div class="at-tete"><b>Raccourci de test</b><button type="button" class="at-fermer" aria-label="Fermer">✕</button></div>
      <p class="at-aide">Pour tester la fin du parcours. Les finales se jouent <b>en essai</b> : rien n'est enregistré.</p>
      <select class="at-terr">${terrs.map(x => `<option${x === t ? " selected" : ""}>${echapper(x)}</option>`).join("")}</select>
      <div class="at-liste">${lieux.map((c, i) => `<div class="at-lieu"><span>${echapper(c.nom)}</span>
          <button type="button" data-lieu="${i}">Page</button>
          ${finaleDisponible(t, c) ? `<button type="button" data-finale="${i}">Finale</button>` : `<small>pas de finale</small>`}</div>`).join("")}
        ${site ? `<div class="at-lieu at-site"><span>${echapper(site.nom)} <small>(site remarquable)</small></span><button type="button" data-site="1">Ouvrir</button></div>
          <p class="at-aide">Les haltes du site jouées ici comptent dans votre partie (pensez à « Sauvegarder ma partie » avant).</p>` : ""}</div>
    </div>`;
  const fermer = () => z.remove();
  z.querySelector(".at-fermer").onclick = fermer;
  z.onclick = ev => { if (ev.target === z) fermer(); };
  z.querySelector(".at-terr").onchange = ev => ouvrirAccesTest(ev.target.value);
  z.querySelectorAll("[data-lieu]").forEach(b => b.onclick = () => { fermer(); ouvrirLieu(t, lieux[Number(b.dataset.lieu)].nom); window.scrollTo(0, 0); });
  z.querySelectorAll("[data-finale]").forEach(b => b.onclick = () => { fermer(); lancerFinale(t, lieux[Number(b.dataset.finale)].nom, true); });
  const bs = z.querySelector("[data-site]");
  if (bs) bs.onclick = () => { fermer(); ouvrirSite(t); };
}
(function brancherAccesTest() {
  // Étape R319 : les 5 touches en bas d'À propos ouvrent maintenant le mode testeur (« Pour tester », plus bas) ;
  //   ce raccourci-ci ne s'ouvre plus qu'avec « ?test » à la fin de l'adresse.
  if (/[?&]test\b/.test(location.search)) window.addEventListener("load", () => setTimeout(() => ouvrirAccesTest(), 600));
})();

// ==================================================================
// Étape R319 (26/11/2026, Notion 53.13, choix 13A du 25/11 au soir) — « Pour tester », en bas des Réglages
//   Critère : « Vous pouvez revoir ces trois écrans en deux gestes, et un joueur ne tombe jamais dessus. »
//   • Mode testeur : 5 touches de suite (en 3 secondes) sur le numéro de version, en bas de la page « Réglages et à propos ».
//     Il se retient sur cet appareil (CLE_TESTEUR, hors de la partie) ; 5 touches encore le retirent.
//   • Le bloc « Pour tester » n'apparaît qu'en mode testeur : la finale du lieu, le site remarquable, le trésor, sur le
//     territoire et le lieu en cours (si ce lieu n'a pas de finale ou de trésor : le lieu le plus proche du territoire qui en a un).
//   • Rien ne compte : avant l'essai, la partie est mise de côté telle quelle (CLE_ESSAI_ECRAN) ; « Terminer l'essai » (bandeau
//     en haut, sur tous les écrans) la remet et recharge le jeu. Si la page se ferme pendant l'essai, la partie est remise au
//     lancement suivant, avant même d'être lue (ce fichier passe avant 13_demarrage.js). Empreintes, clés, médaille, carnet,
//     finale, trésor : rien de l'essai ne reste. Dans l'essai, la finale et le trésor se jouent comme la première fois.
// ==================================================================
const CLE_TESTEUR = CLE_SAUVEGARDE + "-testeur";
const CLE_ESSAI_ECRAN = CLE_SAUVEGARDE + "-essai-ecran";
const CLE_RETOUR_ESSAI = CLE_SAUVEGARDE + "-retour-essai";     // (sessionStorage) après l'essai, on revient aux Réglages
function modeTesteur() { try { return localStorage.getItem(CLE_TESTEUR) === "oui"; } catch (e) { return false; } }
function essaiEcranEnCours() { try { return localStorage.getItem(CLE_ESSAI_ECRAN) !== null; } catch (e) { return false; } }
let touchesVersion = [];
function toucherVersion() {
  const maintenant = Date.now();
  touchesVersion = touchesVersion.filter(x => maintenant - x < 3000).concat(maintenant);
  if (touchesVersion.length < 5) return;
  touchesVersion = [];
  const oui = !modeTesteur();
  try { if (oui) localStorage.setItem(CLE_TESTEUR, "oui"); else localStorage.removeItem(CLE_TESTEUR); } catch (e) { return; }
  afficherBulle(oui ? "Mode testeur : « Pour tester » est en bas des Réglages" : "Mode testeur retiré");
  if (typeof dessinerActionsAPropos === "function") dessinerActionsAPropos();
}
// Remettre la partie d'avant l'essai (au lancement, avant charger())
function remettreApresEssai() {
  try {
    const texte = localStorage.getItem(CLE_ESSAI_ECRAN);
    if (texte === null) return false;
    const d = JSON.parse(texte);
    if (d.partie === null) localStorage.removeItem(CLE_SAUVEGARDE); else localStorage.setItem(CLE_SAUVEGARDE, d.partie);
    if (d.barre === null) localStorage.removeItem(CLE_EMPREINTES_BARRE); else localStorage.setItem(CLE_EMPREINTES_BARRE, d.barre);
    localStorage.removeItem(CLE_ESSAI_ECRAN);
    return true;
  } catch (e) { return false; }
}
remettreApresEssai();
function commencerEssaiEcran() {
  sauvegarder();                                   // la partie telle qu'elle est, juste avant
  try {
    if (localStorage.getItem(CLE_ESSAI_ECRAN) === null)
      localStorage.setItem(CLE_ESSAI_ECRAN, JSON.stringify({ partie: localStorage.getItem(CLE_SAUVEGARDE), barre: localStorage.getItem(CLE_EMPREINTES_BARRE) }));
  } catch (e) { afficherBulle("Le navigateur refuse d'enregistrer : l'essai n'est pas possible"); return false; }
  montrerBandeauEssai();
  return true;
}
function terminerEssaiEcran() {
  try { sessionStorage.setItem(CLE_RETOUR_ESSAI, "1"); } catch (e) { /* rien */ }
  location.reload();                               // la partie est remise au lancement (remettreApresEssai)
}
function montrerBandeauEssai() {
  let b = document.getElementById("essai-bandeau");
  if (!b) {
    b = document.createElement("div"); b.id = "essai-bandeau"; b.setAttribute("role", "status");
    b.innerHTML = `<span>Essai</span><button type="button">Terminer<br>l'essai</button>`;   // au bord droit, à mi-hauteur : rien de l'écran testé n'est caché
    b.querySelector("button").onclick = terminerEssaiEcran;
    document.body.appendChild(b);
  }
}
// Après « Terminer l'essai » : retour aux Réglages (appelé par 13_demarrage.js, une fois l'accueil montré)
function reprendreApresEssai() {
  let retour = false;
  try { retour = sessionStorage.getItem(CLE_RETOUR_ESSAI) === "1"; sessionStorage.removeItem(CLE_RETOUR_ESSAI); } catch (e) { /* rien */ }
  if (!retour) return;
  montrer("apropos");
  setTimeout(() => { const z = document.getElementById("pour-tester"); if (z) z.scrollIntoView({ block: "center" }); }, 50);
  afficherBulle("Essai terminé : votre partie est comme avant");
}
// Le lieu en cours ; s'il n'a pas ce qu'il faut, le lieu le plus proche du territoire qui l'a
function lieuDEssai(t, convient) {
  const lieux = lieuxDe(t), ici = (typeof lieuAReprendre === "function" && lieuAReprendre(t)) || lieux[0];
  if (ici && convient(ici)) return ici;
  const i = Math.max(0, lieux.indexOf(ici));
  return lieux.slice().sort((a, b) => Math.abs(lieux.indexOf(a) - i) - Math.abs(lieux.indexOf(b) - i)).find(convient) || null;
}
const ESSAIS_ECRANS = [
  { cle: "finale", titre: "La finale du lieu",
    ou: t => lieuDEssai(t, c => finaleDisponible(t, c)),
    lancer: (t, c) => { const k = t + "|" + c.nom; if (suivi.finales) delete suivi.finales[k]; if (suivi.finalesTrouves) delete suivi.finalesTrouves[k]; lancerFinale(t, c.nom); } },
  { cle: "site", titre: "Le site remarquable",
    ou: t => siteRemarquable(t),
    lancer: t => ouvrirSite(t) },
  { cle: "tresor", titre: "Le trésor",
    ou: t => typeof tresorDuLieu === "function" ? lieuDEssai(t, c => { const T = tresorDuLieu(t, c.nom); return !!T && !!especeDuTresor(T); }) : null,
    lancer: (t, c) => { const T = tresorDuLieu(t, c.nom); if (suivi.tresors) delete suivi.tresors[cleTresor(T)]; ouvrirPisteTresor(T); } },
];
function htmlPourTester() {
  if (!modeTesteur() || !profil) return "";
  const t = territoireActif();
  return `<div class="apropos-pour-tester" id="pour-tester"><h3>Pour tester</h3>
    <p><small>${echapper(t)}, lieu en cours. Rien ne compte : ni empreintes, ni clés, ni médaille, ni carnet. Tout revient comme avant avec « Terminer l'essai ».</small></p>
    <div class="apt-boutons">${ESSAIS_ECRANS.map(x => { const c = x.ou(t);
      return `<button class="bouton-apropos" type="button" data-essai="${x.cle}"${c ? "" : " disabled"}>${x.titre}<small>${c ? echapper(c.nom) : "aucun dans ce territoire"}</small></button>`; }).join("")}</div></div>`;
}
function brancherPourTester() {
  document.querySelectorAll("#pour-tester [data-essai]").forEach(b => b.onclick = () => {
    const x = ESSAIS_ECRANS.find(y => y.cle === b.dataset.essai), t = territoireActif(), c = x && x.ou(t);
    if (!c || !commencerEssaiEcran()) return;
    x.lancer(t, c);
  });
}
