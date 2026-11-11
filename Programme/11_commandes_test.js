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
//   Invisible pour les joueurs : dans À propos, toucher 5 fois de suite la dernière ligne (« Un projet personnel… Version… »),
//   ou ouvrir le jeu avec « ?test » à la fin de l'adresse. Une fenêtre permet d'ouvrir directement, pour chaque territoire :
//   la page d'un lieu (même fermé), la finale d'un lieu EN ESSAI (rien n'est enregistré) et le site remarquable.
//   Attention : les haltes du site remarquable jouées ainsi comptent dans la partie (le site n'a pas de mode essai).
//   Sert à tester la fin du parcours pendant la refonte de l'étape 1. À retirer (ou garder caché) avant d'ouvrir le jeu à tous.
// ==================================================================
function ouvrirAccesTest(t) {
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
  const pied = document.getElementById("pied-apropos");
  if (pied) {
    let n = 0, dernier = 0;
    pied.addEventListener("click", () => {
      const ici = Date.now(); n = ici - dernier < 1500 ? n + 1 : 1; dernier = ici;
      if (n >= 5) { n = 0; ouvrirAccesTest(); }
    });
  }
  if (/[?&]test\b/.test(location.search)) window.addEventListener("load", () => setTimeout(() => ouvrirAccesTest(), 600));
})();
