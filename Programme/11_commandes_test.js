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
