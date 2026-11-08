// 12_profil_badges.js — Le Profil et les badges.
// Une partie du programme du jeu, chargée par jeu.html dans l'ordre des numéros.

// ==================================================================
// 11 nonies. LA PAGE PROGRESSION ET LES BADGES (étape 106 — maquette B validée le 11/10)
//   • une page à part (onglet « Progression ») : le bilan à gauche, le détail à droite
//     (familles, jeux et records, badges) ; l'accueil ne garde que l'essentiel
//   • les badges viennent du tableur badges_V2.xlsx (dossier Données). Trois sortes :
//       - pour tout le jeu (collection, cris, régularité…), certains avec 3 paliers (I, II, III)
//       - par territoire : fabriqués tout seuls pour chaque territoire qui a des espèces
//       - les points communs entre espèces (« Brouteurs », « Grands dormeurs »…)
//   • un badge obtenu ne se perd jamais ; certains donnent un TITRE, que le joueur peut porter :
//     il s'affiche dans la pastille du haut, à côté du rang de naturaliste
//   • un nouveau badge : petite vignette dans le coin pendant le jeu, puis rappel sur l'écran de fin
// ==================================================================

// ---- Ce que le jeu note en plus pour les badges (gardé dans la sauvegarde) ----
// Rien n'est rétroactif : ces compteurs démarrent le jour où cette étape est installée.
let suivi = {
  jours: [],            // les jours où l'on a joué ("2026-10-11"…), une seule fois chacun
  echecs: {},           // le nombre d'échecs par case : { "Chamois|regime_alimentaire_type": 2 }
  portraits: 0,         // Portraits-robots réussis sans erreur
  types: [],            // les types de question du Carnet déjà joués ("portrait", "rangement", "plus", "indices", "cris")
  coupsDoeil: 0,        // espèces reconnues à leur première apparition, sans présentation
  tenacite: false, sansFaute: false, leveTot: false, nuit: false,
  meilleureSerie: 0,    // la plus longue série de bonnes réponses, tous jeux confondus
  recordSerieDuel: 0,   // étape 168 : au Duel, le plus de bonnes réponses d'affilée (tous territoires confondus)
  recordPartieDuel: 0,  // étape 168 : au Duel, le plus de bonnes réponses en une partie (3 vies)
  derniersBadges: [],   // étape 107 : les badges les plus récents, du plus ancien au plus récent
  parties: 0,           // étape 150 : le nombre de parties lancées (le « numéro » de la partie en cours)
  revues: {},           // étape 150 : pour chaque case trouvée, le numéro de la partie où elle l'a été la dernière fois
};
let badgesObtenus = {};  // { "collectionneur": 1, "p:Alpes:pisteur": 1… } : le palier atteint
let titreChoisi = null;  // le titre porté (ou null)
// Étape 109 : l'espèce favorite (son nom courant, ou null). Choisie sur la page d'une espèce déjà identifiée.
let especeFavorite = null;
function favorite() {
  const e = especeFavorite && ESPECES.find(x => x.nom_courant === especeFavorite);
  return e && estReconnue(e) ? e : null;           // une espèce retirée du jeu ou pas identifiée ne compte pas
}
const ETOILE = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z"/></svg>`;

// ---- Les petits dessins des badges : traits fins, dans un carré de 24 ----
// (Les badges d'une famille reprennent la silhouette des anneaux, voir SILHOUETTES.)
const ICONES_BADGES = {
  cadres:   `<rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/>`,
  fiche:    `<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8.5 12.5l2.5 2.5 4.5-5"/>`,
  son:      `<path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/>`,
  traces:   `<ellipse cx="8" cy="15" rx="3" ry="4"/><circle cx="5" cy="9" r="1.2"/><circle cx="8" cy="7.5" r="1.2"/><circle cx="11" cy="9" r="1.2"/><ellipse cx="17" cy="11" rx="2.6" ry="3.4"/><circle cx="15" cy="5.5" r="1"/><circle cx="17.5" cy="4.5" r="1"/><circle cx="20" cy="5.5" r="1"/>`,
  portrait: `<rect x="4" y="3" width="16" height="18" rx="3"/><circle cx="12" cy="10" r="3"/><path d="M7 18c1.5-3 8.5-3 10 0"/>`,
  boussole: `<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>`,
  rose:     `<circle cx="12" cy="12" r="2"/><path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M19 5l-4 4M9 15l-4 4"/>`,
  cible:    `<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>`,
  oeil:     `<path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"/><circle cx="12" cy="12" r="3"/>`,
  bouclier: `<path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6z"/>`,
  soleil:   `<path d="M4 17h16"/><path d="M7 17a5 5 0 0 1 10 0"/><path d="M12 7v2M5.5 10.5l1.4 1.4M18.5 10.5l-1.4 1.4"/>`,
  lune:     `<path d="M19 14.5A7.5 7.5 0 1 1 9.5 5a6 6 0 0 0 9.5 9.5z"/>`,
  calendrier:`<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>`,
  saisons:  `<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/>`,
  pas:      `<ellipse cx="9" cy="8" rx="3" ry="4.5"/><ellipse cx="15" cy="16" rx="3" ry="4.5"/>`,
  carte:    `<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>`,
  montagne: `<path d="M2 20l7-12 4 6 3-4 6 10z"/><path d="M7.5 10.5l1.5 1 1.5-1"/>`,
  flocon:   `<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5L12 6.5l2.5-2M9.5 19.5L12 17.5l2.5 2"/>`,
  herbe:    `<path d="M5 21c0-6 2-10 5-13M12 21c0-7 0-11 0-16M19 21c0-6-2-10-5-13"/>`,
  insecte:  `<ellipse cx="12" cy="14" rx="3.5" ry="5.5"/><circle cx="12" cy="6.5" r="2"/><path d="M8.5 11L4 9M8.5 15H4M9 18l-4 2M15.5 11L20 9M15.5 15H20M15 18l4 2"/>`,
  dormeur:  `<path d="M17 14.5A6.5 6.5 0 1 1 8.5 6a5 5 0 0 0 8.5 8.5z"/><path d="M15 4h4l-4 4h4"/>`,
  venin:    `<path d="M12 3c3 4.5 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 3-6.5 6-11z"/>`,
  feuillage:`<path d="M12 21V11"/><path d="M12 11C7 11 4 8 4 3c5 0 8 3 8 8zM12 13c5 0 8-3 8-8-5 0-8 3-8 8z"/>`,
  sommet:   `<path d="M2 20l10-16 10 16z"/><path d="M8.5 10l3.5 2 3.5-2"/>`,
  main:     `<path d="M5 20c2-4 4-5 7-5h4"/><path d="M12 15c0-5 3-8 8-9 0 5-3 8-8 9z"/>`,
  ensemble: `<circle cx="7" cy="9" r="2.5"/><circle cx="17" cy="9" r="2.5"/><circle cx="12" cy="7" r="2.8"/><path d="M2.5 19c.5-3 2.5-5 4.5-5M21.5 19c-.5-3-2.5-5-4.5-5M7 20c.5-4 2.5-6 5-6s4.5 2 5 6"/>`,
  vague:    `<path d="M2 10c2.5-2 4.5-2 7 0s4.5 2 7 0 4.5-2 6 0M2 15c2.5-2 4.5-2 7 0s4.5 2 7 0 4.5-2 6 0"/>`,
  sapin:    `<path d="M12 2l5 7h-3l4 6h-4l3 4H7l3-4H6l4-6H7z"/><path d="M12 19v3"/>`,
  rocher:   `<path d="M3 20l3-8 4-3 4 2 3-2 4 11z"/>`,
  riviere:  `<path d="M7 2c4 4-4 8 0 12s-4 6 0 8M15 2c4 4-4 8 0 12s-4 6 0 8"/>`,
  haie:     `<path d="M2 20h20"/><circle cx="6.5" cy="14" r="4.5"/><circle cx="13" cy="12.5" r="5"/><circle cx="19" cy="15" r="3.5"/>`,
  loupe:    `<circle cx="10" cy="10" r="6.5"/><path d="M15 15l6 6"/>`,
  medaille: `<circle cx="12" cy="12" r="9"/><path d="M12 5.5c4.5 2.5 4.5 8.5 0 12-4.5-3.5-4.5-9.5 0-12z"/>`,
  chemin:   `<path d="M8 21c0-4 8-5 8-9s-6-4-6-7"/><circle cx="10" cy="4" r="1"/>`,
};
function dessinBadge(b) {
  const svg = SILHOUETTES[b.icone]
    ? `<svg viewBox="0 0 48 48" class="plein" aria-hidden="true">${SILHOUETTES[b.icone]}</svg>`
    : `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONES_BADGES[b.icone] || ICONES_BADGES.cible}</svg>`;
  return `<span class="rond-badge">${svg}</span>`;
}

// ---- Les petits calculs dont les badges ont besoin ----
const nbEspeces = filtre => ESPECES.filter(filtre).length;
function saisonDe(jour) {                       // "2026-10-11" → "automne"
  const mois = Number(jour.slice(5, 7));
  return mois >= 3 && mois <= 5 ? "printemps" : mois >= 6 && mois <= 8 ? "été" : mois >= 9 && mois <= 11 ? "automne" : "hiver";
}
// « des Alpes », « du Massif armoricain » : le petit mot devant le nom d'un territoire
function deTerritoire(t) {
  if (/^(Alpes|Pyrénées|Vosges)$/.test(t) || /^Plaines /.test(t)) return "des " + t;   // étape GE4 : « des Plaines de l'Est et val de Saône »
  if (/^(Jura|Massif|Bassin|Grand)/.test(t)) return "du " + t;
  if (/^[AEIOUÉ]/.test(t)) return "de l'" + t;
  return "de la " + t;
}

// ---- La liste des badges ----
// Étape PR3 (01/11/2026, choix de l'utilisateur « réduire à ~20, vivants ») : des badges « souvenirs », tous atteignables
// en jouant normalement (expéditions, lieux, finales), chacun avec sa fête. Les ~180 badges d'avant (par territoire,
// par famille, « points communs ») et les titres sont retirés ; les badges déjà gagnés restent dans la sauvegarde.
// Chaque badge : cle (ne change jamais ; une condition nouvelle = une clé nouvelle), cat (groupe d'affichage),
// nom, cond, icone, et soit des paliers [I, II, III], soit un but unique. mesure() dit où en est le joueur.
const nbFinies = () => typeof toutesExpeditions === "function" ? toutesExpeditions().filter(x => empreintesExp(x) >= NB_ETAPES).length : 0;
const lieuxFinis = () => typeof CHAPITRES === "undefined" ? 0 : CHAPITRES.filter(c => estLieu(c) && chapitreFini(c.territoire, c)).length;
const nbFinales = () => suivi && suivi.finales ? Object.values(suivi.finales).filter(Boolean).length : 0;
const nbGardien = () => suivi && suivi.gardien ? Object.values(suivi.gardien).filter(Boolean).length : 0;
const territoiresVisites = () => tousLesTerritoires().filter(t => expeditionsDe(t).some(x => empreintesExp(x) >= 1)).length;
const famillesAuCarnet = () => new Set(ESPECES.filter(estReconnue).map(e => e.onglet)).size;
function unSpecialiste() {
  for (const t of tousLesTerritoires()) {
    const especes = especesDe(t);
    for (const cle in CLASSES) {
      const f = especes.filter(e => e.onglet === cle);
      if (f.length >= MINI_BADGE_FAMILLE && progresFamille(f).palier >= PALIERS_FAMILLE.length) return 1;
    }
  }
  return 0;
}
const BADGES_TOUT_LE_JEU = [
  // En chemin : les expéditions, les lieux, les territoires
  { cle: "premiere-expedition", cat: "E", nom: "Première expédition", cond: "Terminer une expédition (ses deux étapes)", icone: "chemin", but: 1,
    mesure: nbFinies },
  { cle: "premier-lieu", cat: "E", nom: "Premier lieu exploré", cond: "Terminer toutes les expéditions d'un lieu", icone: "carte", but: 1,
    mesure: lieuxFinis },
  { cle: "tout-est-lie", cat: "E", nom: "Finale du lieu", cond: "Réussir la finale d'un lieu", icone: "ensemble", but: 1,
    mesure: nbFinales },
  { cle: "gardien", cat: "E", nom: "Gardien", cond: "Terminer un territoire : tous ses lieux, puis le tour du site remarquable", icone: "montagne", but: 1,
    mesure: nbGardien },
  { cle: "voyageur", cat: "E", nom: "Grand voyageur", cond: "Partir en expédition dans plusieurs territoires", icone: "boussole", paliers: [3, 6, 11],
    mesure: territoiresVisites },
  { cle: "planches", cat: "E", nom: "Planches des lieux", cond: "Réunir les planches des finales des lieux", icone: "cadres", paliers: [10, 30, 110],
    mesure: nbFinales },
  // Le carnet
  { cle: "carnet", cat: "C", nom: "Carnet", cond: "Réunir des espèces dans votre carnet", icone: "fiche", paliers: [50, 200, 500],
    mesure: () => nbEspeces(estReconnue) },
  { cle: "toutes-familles", cat: "C", nom: "Toutes les familles", cond: "Avoir au carnet une espèce de chacune des 10 familles", icone: "rose", but: Object.keys(CLASSES).length,
    mesure: famillesAuCarnet },
  { cle: "specialiste", cat: "C", nom: "Spécialiste", cond: "Atteindre le rang Spécialiste dans une famille d'un territoire", icone: "loupe", but: 1,
    mesure: unSpecialiste },
  { cle: "or", cat: "C", nom: "Espèces familières", cond: "Rendre des espèces familières (étape « Approfondir »)", icone: "medaille", paliers: [5, 25, 100],   // étape R144
    mesure: () => nbEspeces(e => niveauTermine(e) === NB_NIVEAUX) },
  { cle: "raretes", cat: "C", nom: "Raretés", cond: "Découvrir des espèces rares", icone: "oeil", paliers: [5, 15, 30],
    mesure: () => nbEspeces(e => estReconnue(e) && e.rarete_observation === "Rare") },
  { cle: "proteger", cat: "C", nom: "À protéger", cond: "Connaître 10 espèces menacées en France", icone: "main", but: 10,
    mesure: () => nbEspeces(e => estReconnue(e) && ["Vulnérable", "En danger", "En danger critique"].includes(e.statut_conservation_france)) },
  // L'œil et l'oreille
  { cle: "oreille-fine", cat: "S", nom: "Oreille fine", cond: "Reconnaître des cris", icone: "son", paliers: [10, 30, 60],
    mesure: () => nbEspeces(e => nbBonnes(e, "cri_son") >= 1) },
  { cle: "lecteur-traces", cat: "S", nom: "Lecteur de traces", cond: "Reconnaître des empreintes", icone: "traces", paliers: [10, 25, 50],
    mesure: () => nbEspeces(e => nbBonnes(e, "empreinte_nom") >= 1 || nbBonnes(e, "empreinte_choix") >= 1) },
  { cle: "oeil-lynx", cat: "S", nom: "Œil de lynx", cond: "Reconnaître 10 espèces dès leur première apparition", icone: "cible", but: 10,
    mesure: () => suivi.coupsDoeil || 0 },
  { cle: "tenacite", cat: "S", nom: "Ténacité", cond: "Retrouver une réponse ratée trois fois auparavant", icone: "bouclier", but: 1,
    mesure: () => suivi.tenacite ? 1 : 0 },
  // Les rendez-vous (aucune série à tenir)
  { cle: "fidele", cat: "R", nom: "Fidèle", cond: "Jouer des jours différents (pas besoin de jours d'affilée)", icone: "calendrier", paliers: [7, 30],
    mesure: () => suivi.jours.length },
  { cle: "quatre-saisons", cat: "R", nom: "Quatre saisons", cond: "Jouer au printemps, en été, en automne et en hiver", icone: "saisons", but: 4,
    mesure: () => new Set(suivi.jours.map(saisonDe)).size },
  { cle: "leve-tot", cat: "R", nom: "Lève-tôt", cond: "Jouer avant 7 h du matin", icone: "soleil", but: 1,
    mesure: () => suivi.leveTot ? 1 : 0 },
  { cle: "oiseau-de-nuit", cat: "R", nom: "Oiseau de nuit", cond: "Jouer après 23 h", icone: "lune", but: 1,
    mesure: () => suivi.nuit ? 1 : 0 },
  { cle: "duel", cat: "R", nom: "Champion du Duel", cond: "20 bonnes réponses à la suite au Duel (Plus de jeux)", icone: "portrait", but: 20,
    mesure: () => suivi.recordSerieDuel || 0 },
];
const GROUPES_BADGES = [["E", "En chemin"], ["C", "Le carnet"], ["S", "L'œil et l'oreille"], ["R", "Les rendez-vous"]];
// Règle n°12 (11/10) : une famille ne compte (rang Spécialiste) dans un territoire que si elle y compte au moins 5 espèces
const MINI_BADGE_FAMILLE = 5;
function dansTerritoire(t) {
  if (/^(Alpes|Pyrénées|Vosges)$/.test(t) || /^Plaines /.test(t)) return "dans les " + t;   // étape GE4
  if (/^(Jura|Massif|Bassin|Grand)/.test(t)) return "dans le " + t;
  return "en " + t;
}
// Tous les badges du jeu, dans l'ordre d'affichage (fabriqués une fois, au premier besoin)
let BADGES = null;
function tousLesBadges() {
  if (!BADGES) BADGES = BADGES_TOUT_LE_JEU.slice();   // étape PR3
  return BADGES;
}
// Le palier atteint (0 = pas encore ; 1, 2, 3 pour un badge à paliers ; 1 pour un badge simple)
function palierCalcule(b, mesure = b.mesure()) {
  return b.paliers ? b.paliers.filter(p => mesure >= p).length : (mesure >= b.but ? 1 : 0);
}
function palierDe(b) { return badgesObtenus[b.cle] || 0; }
// Le prochain seuil à atteindre (null quand tout est gagné)
function prochainSeuil(b) {
  const palier = palierDe(b);
  if (b.paliers) return palier < b.paliers.length ? b.paliers[palier] : null;
  return palier ? null : b.but;
}
const ROMAINS = ["", "I", "II", "III"];
function nomBadge(b, palier = palierDe(b)) { return b.nom + (b.paliers && palier ? " " + ROMAINS[palier] : ""); }
function titresDisponibles() { return []; }   // étape PR3 : plus de titres (choix de l'utilisateur, 01/11)

// ---- Vérifier les badges ----
// Appelée après chaque bonne réponse, au début et à la fin de chaque partie.
// annoncer = false : on met à jour sans vignette (au chargement du jeu).
// Elle attend la fin de la réponse en cours (setTimeout 0) : plusieurs appels d'affilée n'en font qu'un.
let verificationPrevue = false;
function verifierBadgesBientot() {
  if (verificationPrevue) return;
  verificationPrevue = true;
  setTimeout(() => { verificationPrevue = false; verifierBadges(); }, 0);
}
function verifierBadges(annoncer = true) {
  if (annoncer) verifierOuverture();                     // étape 209 : un nouveau territoire ?
  if (typeof toutDebloque === "function" && toutDebloque()) return;   // étape PR6 : rien à gagner sur des espèces offertes
  let change = false;
  if (annoncer) verifierRangCarnet();                    // étape PR2 : le rang global monte-t-il ?
  for (const b of tousLesBadges()) {
    if (prochainSeuil(b) === null) continue;            // étape PR3 : déjà tout gagné, rien à recalculer
    const palier = palierCalcule(b);
    if (palier > palierDe(b)) {                          // un badge ne se perd jamais : on ne fait que monter
      badgesObtenus[b.cle] = palier;
      change = true;
      // Étape 107 : les derniers badges (les 3 plus récents s'affichent sur la fiche du naturaliste)
      suivi.derniersBadges = (suivi.derniersBadges || []).filter(c => c !== b.cle).concat(b.cle).slice(-6);
      if (annoncer) annoncerBadge(b, palier);
    }
  }
  if (change) { sauvegarder(); afficherStats(); }
}

// ---- Étape PR2 : la fête du rang global (« Petit carnet », « Grand carnet »…) ----
let rangCarnetVu = null;
function verifierRangCarnet() {
  const avant = rangCarnetVu === null ? rangActuel() : rangCarnetVu;
  const i = rangActuel();
  rangCarnetVu = i;
  if (i <= avant) return;
  sauvegarder();
  const r = infoRangCarnet();
  feter({ etiquette: "Votre carnet", titre: r.nom, son: "badge",
          detail: `${nombre(r.n)} espèces au carnet.${r.suivant ? ` Prochain rang : ${r.suivant.nom}, à ${nombre(r.suivant.seuil)} espèces.` : " Toutes les espèces du jeu !"}`,
          visuel: `<div class="fete-visuel dessin">${dessinTampon(i)}</div>` });
}

// ---- La vignette du coin : une à la fois, à la suite si plusieurs badges tombent ensemble ----
const fileBadges = [];
let fileEnCours = false;
function annoncerBadge(b, palier) { fileBadges.push({ b, palier }); if (!fileEnCours) suiteFileBadges(); }
function suiteFileBadges() {
  if (!fileBadges.length) { fileEnCours = false; return; }
  fileEnCours = true;
  // Une autre vignette (nouvelle espèce…) est déjà affichée : on attend qu'elle parte
  if (document.getElementById("carte-pop").classList.contains("visible")) { setTimeout(suiteFileBadges, 700); return; }
  const { b, palier } = fileBadges.shift();
  // Étape 142 : la fête (la vignette du coin reste en secours pendant une partie chronométrée)
  const pop = { couleur: "#1f3a2e", image: dessinBadge(b), etiquette: "Nouveau badge",
                titre: nomBadge(b, palier), detail: b.cond };
  feter({ etiquette: "Nouveau badge", titre: pop.titre, detail: pop.detail, son: "badge", pop, souvenir: { titre: pop.titre, image: dessinBadge(b) },   // R153
          visuel: `<div class="fete-visuel dessin">${dessinBadge(b)}</div>` });
  setTimeout(suiteFileBadges, 600);
}

// ---- Noter une partie qui commence : le jour, l'heure ----
function aujourdhui() {
  const d = new Date();                                // l'heure de l'ordinateur
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function noterPartie() {
  const jour = aujourdhui(), heure = new Date().getHours();
  suivi.parties = (suivi.parties || 0) + 1;            // étape 150 : une partie de plus
  if (!suivi.jours.includes(jour)) suivi.jours.push(jour);
  if (heure < 7) suivi.leveTot = true;
  if (heure >= 23) suivi.nuit = true;
  verifierBadgesBientot();
}
// Un type de question du Carnet joué pour la première fois (et les cris)
function noterType(type) { if (!suivi.types.includes(type)) suivi.types.push(type); }

// ---- La page Progression ----
let filtreBadges = "tous";        // "tous", "obtenus" ou "avenir"
// Étape 205 (retour du 18/10) : le Profil montre toute la France ; un clic sur la carte choisit un territoire
let territoireProfil = null;
function territoireProgression() { return territoireProfil; }

// La carte : comme sur l'accueil (couleur selon le carnet rempli), un clic lance le jeu sur le territoire
function dessinerCarteProgression() {
  const carte = document.getElementById("carte-progression");
  if (!carte) return;
  if (typeof CARTE_TERRITOIRES === "undefined") { carte.remove(); return; }
  carte.setAttribute("viewBox", CARTE_CADRE);
  const debloques = profil ? profil.territoires : [];
  const rang = t => especesDe(t.nom).length > 0 ? 0 : debloques.includes(t.nom) ? 2 : 1;
  let html = "";
  for (const t of CARTE_TERRITOIRES.slice().sort((a, b) => rang(a) - rang(b))) {
    html += `<path class="lisere" d="${t.contour}"/>`;
    const especes = especesDe(t.nom);
    if (especes.length) {
      const pct = carnetDe(especes).pct;
      const couleur = TERRITOIRES[t.nom] ? TERRITOIRES[t.nom].couleur : "#7a736a";
      const teinte = melangerCouleurs(couleur, "#f4efe6", 0.45 + 0.55 * pct / 100);
      const etat = territoireProfil ? (territoireProfil === t.nom ? " choisi" : " estompe") : "";   // étape 205
      html += `<path class="jouable${etat}" data-territoire="${t.nom}" d="${t.contour}" style="fill:${teinte};stroke:${teinte}"><title>${t.nom} : ${pct} % connu — cliquer pour le voir</title></path>`;
    } else {
      html += `<path class="gris${t.gris}${debloques.includes(t.nom) ? " debloque" : ""}" d="${t.contour}"><title>${t.nom} : à venir</title></path>`;
    }
  }
  carte.innerHTML = html;
  // Étape 205 : un clic choisit le territoire (un second clic revient à toute la France) ; on ne lance plus de partie d'ici
  carte.querySelectorAll("path.jouable").forEach(p => p.onclick = () => {
    territoireProfil = territoireProfil === p.dataset.territoire ? null : p.dataset.territoire;
    afficherPageProgression();
  });
  const toute = document.getElementById("pg-toute-france");
  if (toute) toute.onclick = () => { territoireProfil = null; afficherPageProgression(); };
}


// ---- Étape 177 (13/10, maquette A validée) : la page Profil en onglets ----
// En haut, toujours visible : le rang, le titre porté et l'espèce favorite.
// En dessous, quatre onglets : Vue d'ensemble · Familles · Badges · Jeux et records.
// Les badges deviennent de petites pastilles ; un clic ouvre leur détail juste sous leur groupe.
let ongletProfil = "ensemble";     // l'onglet ouvert (gardé tant que la page reste ouverte)
let badgeOuvert = null;            // la clé du badge dont le détail est ouvert

// La pastille d'un badge : son rond, son nom, et une mini-jauge vers le prochain palier
// Étape 207 : sous le titre d'un territoire, la tuile garde le nom court (« Premiers pas ») ; ailleurs, le nom complet
function htmlBadgeMini(b, court) {
  const palier = palierDe(b), seuil = prochainSeuil(b);
  const jauge = seuil !== null ? `<span class="pg-mini-jauge"><i style="width:${Math.min(100, 100 * b.mesure() / seuil)}%"></i></span>` : "";
  return `<button class="pg-mini${palier ? "" : " gris"}${badgeOuvert === b.cle ? " ouvert" : ""}" data-badge="${b.cle}" title="${b.cond}">`
    + `${dessinBadge(b)}<span class="nom">${court === true && b.court ? b.court + (b.paliers && palier ? " " + ROMAINS[palier] : "") : nomBadge(b)}</span>${jauge}</button>`;
}
// Le détail d'un badge : sa condition, où l'on en est, et « Porter le titre » s'il en a un
function htmlBadgeDetail(b) {
  const palier = palierDe(b), seuil = prochainSeuil(b), mesure = b.mesure();
  const ou = seuil === null ? (b.paliers ? "Tous les paliers sont obtenus." : "Obtenu.")
    : `${b.paliers && palier ? `Palier ${ROMAINS[palier]} obtenu · prochain palier : ` : ""}${Math.min(mesure, seuil)} / ${seuil}${b.unite || ""}`;
  const paliers = b.paliers ? ` (paliers : ${b.paliers.join(" · ")})` : "";
  const bouton = "";   // étape PR3 : plus de titres
  return `<div class="pg-encart pg-detail${palier ? "" : " gris"}">${dessinBadge(b)}<div>
      <div class="nom">${nomBadge(b)}</div>
      <div class="cond">${b.cond}${paliers}</div>
      <div class="cond">${ou}</div>
      ${seuil !== null ? `<div class="pg-mini-jauge large"><i style="width:${Math.min(100, 100 * mesure / seuil)}%"></i></div>` : ""}
      ${bouton}</div></div>`;
}
function htmlBadgesPage() {
  const avance = b => { const s = prochainSeuil(b); return s === null ? 1 : b.mesure() / s; };
  const groupes = GROUPES_BADGES;   // étape PR3
  let html = "";
  for (const [cle, titre] of groupes) {
    const tous = tousLesBadges().filter(b => b.cat === cle);
    let liste = tous;
    if (filtreBadges === "obtenus") liste = liste.filter(b => palierDe(b) > 0);
    if (filtreBadges === "avenir") liste = liste.filter(b => prochainSeuil(b) !== null);
    if (!liste.length) continue;
    // Les obtenus d'abord, puis les plus avancés
    liste = liste.slice().sort((a, b) => ((palierDe(b) > 0) - (palierDe(a) > 0)) || (avance(b) - avance(a)));
    const ouvert = liste.find(b => b.cle === badgeOuvert);
    html += `<div class="pg-cat"><span>${titre}</span><span>${tous.filter(b => palierDe(b) > 0).length} / ${tous.length}</span></div>`
          + `<div class="pg-minis">${liste.map(b => htmlBadgeMini(b, true)).join("")}</div>`
          + (ouvert ? htmlBadgeDetail(ouvert) : "");
  }
  return html || `<p class="pg-cat">Aucun badge ici pour l'instant.</p>`;
}

function afficherPageProgression() {
  const t = territoireProgression();                 // null = toute la France (étape 205)
  const especesT = t ? especesDe(t) : ESPECES;
  const carnet = carnetDe(especesT);
  // Les cases de toutes les espèces, par niveau : Découvert (1 fois), Connu (2), Confirmé (3 et plus)
  const niveaux = [0, 0, 0, 0];
  let totalCases = 0;
  for (const e of ESPECES) for (const c of casesCarnet(e)) { totalCases++; niveaux[niveauDonnee(e, c)]++; }
  const pc = n => (totalCases ? 100 * n / totalCases : 0).toFixed(1) + "%";
  // Le rang de naturaliste
  const i = rangActuel(), suivant = RANGS_NATURALISTE[i + 1];
  const badges = tousLesBadges(), obtenus = badges.filter(b => palierDe(b) > 0).length;
  // Les familles du territoire, et combien ont déjà un rang
  const familles = Object.keys(CLASSES).filter(cle => especesT.some(e => e.onglet === cle));
  const famillesAvecRang = familles.filter(cle => progresFamille(especesT.filter(e => e.onglet === cle)).palier > 0).length;
  // Les jeux et records
  const st = cle => statsJeux[cle] || { parties: 0, decouvertes: 0 };
  const chronos = Object.keys(records).filter(k => k.startsWith("chrono:revision:")).map(k => records[k]);
  const recordChrono = chronos.length ? chronos.reduce((a, b) => b.score > a.score ? b : a) : null;
  const ligne = (texte, valeur) => `<div class="pg-ligne"><span>${texte}</span><strong>${valeur}</strong></div>`;

  // L'en-tête : le rang, le titre porté (les titres se choisissent dans l'onglet Badges), l'espèce favorite
  const titres = titresDisponibles(), rc = infoRangCarnet();   // étape PR2
  const partRang = suivant ? Math.min(1, (lignesEcrites() - seuilRang(i)) / Math.max(1, seuilRang(i + 1) - seuilRang(i))) : 1;
  const enTeteProfil = carteNaturaliste(rc) + `<div class="pg-encart pg-profil">
      <div class="pg-profil-texte">
        ${blocPrenom("pg-prenom")}
        <div class="rang">${rc.nom}</div>
        <div class="pg-rang-carnet"><i class="jauge-jeu"><b style="width:${Math.round(100 * rc.part)}%"></b></i>
          <small>Carnet : ${nombre(rc.n)} espèces${rc.suivant ? ` · prochain rang : ${rc.suivant.nom}, à ${nombre(rc.suivant.seuil)}` : " · toutes les espèces du jeu !"}</small></div>
        <small>${(() => { const m = [0, 0, 0, 0]; for (const e of ESPECES.filter(estReconnue)) m[niveauTermine(e)]++;
          return `Vos espèces : ${m[3]} familière${m[3] > 1 ? "s" : ""} · ${m[2]} comprise${m[2] > 1 ? "s" : ""} · ${m[1]} croisée${m[1] > 1 ? "s" : ""}`; })()}</small>
      </div>
      <div class="pg-favori">
        <p class="pg-petit-titre">Espèce favorite</p>
        ${favorite()
          ? `<button class="pg-favori-carte" id="pg-favori" title="Ouvrir sa page" style="--couleur-classe:${classeDe(favorite()).couleur}"><span class="ph">${celluleImage(favorite(), true)}</span><span>${favorite().nom_courant}<small>${classeDe(favorite()).nom}</small></span></button>`
          : `<small>À choisir depuis la page d'une espèce déjà identifiée.</small><br><button class="porter" id="pg-favori-choisir">Ouvrir l'encyclopédie</button>`}
      </div>
    </div>`;

  const onglets = [["ensemble", "Vue d'ensemble", ""], ["familles", "Familles", `${famillesAvecRang} / ${familles.length}`],
                   ["badges", "Badges", `${obtenus} / ${badges.length}`], ["jeux", "Jeux et records", ""]];
  const barreOnglets = `<div class="pg-onglets" role="tablist">${onglets.map(([cle, nom, compte]) =>
    `<button role="tab" data-onglet-profil="${cle}" class="${ongletProfil === cle ? "actif" : ""}">${nom}${compte ? `<small>${compte}</small>` : ""}</button>`).join("")}</div>`;

  // -- Vue d'ensemble --
  const derniers = (suivi.derniersBadges || []).slice().reverse().map(c => badges.find(b => b.cle === c)).filter(Boolean).slice(0, 4);
  const panneauEnsemble = `<div class="pg-ensemble">
      <div class="pg-encart">
        <p class="pg-petit-titre">${t || `France · ${tousLesTerritoires().length} territoires`}</p>
        <div class="pg-grand">${carnet.pctTexte}<small> %</small></div>
        <p style="margin:6px 0 12px">de la nature ${t ? deTerritoire(t) : "de France"} connue</p>
        <div class="pg-carte"><svg id="carte-progression" role="img" aria-label="Carte des territoires"></svg></div>
        <p class="pg-carte-aide">${t ? `<button class="pg-lien" id="pg-toute-france">← Toute la France</button>` : "Sélectionnez un territoire pour voir sa part."}</p>
      </div>
      <div>
        <div class="pg-chiffres">
          <div class="pg-encart"><b>${especesT.filter(estReconnue).length}</b><span>espèces identifiées sur ${especesT.length}</span></div>
          <div class="pg-encart"><b>${especesT.filter(e => statut(e) === "maîtrisée").length}</b><span>espèces maîtrisées</span></div>
          <div class="pg-encart"><b>${obtenus}</b><span>badges sur ${badges.length}</span></div>
        </div>
        <div class="pg-titre-ligne"><h2>Derniers badges</h2><button class="pg-lien" data-onglet-profil="badges">Tous les badges →</button></div>
        <div class="pg-encart">${derniers.length ? `<div class="pg-minis">${derniers.map(b => htmlBadgeMini(b)).join("")}</div>`
                                                 : `<small style="color:var(--texte-doux)">Pas encore de badge : le premier arrive vite.</small>`}</div>
        <div class="pg-encart" style="margin-top:14px">
          <p class="pg-petit-titre">Caractéristiques trouvées</p>
          ${(() => {   // étape M21 (07/11) : plus de « 41 sur 15 660 » (toutes les cases du jeu, peu parlant) :
            //   ce qui est trouvé sur les espèces déjà rencontrées (ici ou dans toute la France, selon la carte)
            const vues = especesT.filter(estReconnue), cs = vues.flatMap(e => champsDe(e).filter(c => c !== IDENTIFICATION).map(c => nbBonnes(e, c) >= 1));
            const n = cs.filter(Boolean).length, tot = cs.length;
            return `<div class="pg-trois"><span class="pg-conf" style="width:${tot ? Math.round(100 * n / tot) : 0}%"></span></div>
          <div class="pg-legende-trois"><span>${nombre(n)} sur ${nombre(tot)} pour vos ${nombre(vues.length)} espèce${vues.length > 1 ? "s" : ""} rencontrée${vues.length > 1 ? "s" : ""}</span></div>`; })()}
        </div>
      </div>
    </div>`;

  // -- Jeux et records --
  const panneauJeux = `<div class="pg-jeux">
      <div class="pg-encart"><h3>Rencontre</h3>
        ${ligne("Parties jouées", nombre(st("rencontre").parties))}
        ${ligne("Espèces découvertes", nombre(st("rencontre").decouvertes))}
        ${ligne("Reconnues dès la 1<sup>re</sup> vue", nombre(suivi.coupsDoeil))}
      </div>
      <div class="pg-encart"><h3>Sortie nature</h3>
        ${ligne("Parties jouées", nombre(st("revision").parties))}
        ${ligne("Espèces découvertes", nombre(st("revision").decouvertes))}
        ${ligne("Meilleure série", suivi.meilleureSerie ? `${nombre(suivi.meilleureSerie)} bonnes réponses` : "—")}
        ${ligne(`Record avec chronomètre (${DUREE_DEFI} s)`, recordChrono ? `${nombre(recordChrono.score)} ${dessinEtoiles(recordChrono.etoiles)}` : "—")}
        ${ligne("Cris reconnus", nombre(nbEspeces(e => nbBonnes(e, "cri_son") >= 1)))}
      </div>
      <div class="pg-encart"><h3>Duel</h3>
        ${ligne("Parties jouées", nombre(st("plus").parties))}
        ${ligne("Record à la suite", suivi.recordSerieDuel ? nombre(suivi.recordSerieDuel) : "—")}
        ${ligne("Record sur une partie", suivi.recordPartieDuel ? nombre(suivi.recordPartieDuel) : "—")}
      </div>
      <div class="pg-encart"><h3>Espèce mystère</h3>
        ${ligne("Parties jouées", nombre(st("indices").parties))}
        ${ligne("Espèces découvertes", nombre(st("indices").decouvertes))}
      </div>
      <div class="pg-encart"><h3>Portrait-robot</h3>
        ${ligne("Parties jouées", nombre(st("portrait").parties))}
        ${ligne("Portraits sans erreur", nombre(suivi.portraits || 0))}
      </div>
    </div>`;

  // -- Badges : les titres gagnés, les filtres, puis les pastilles par groupe --
  const panneauBadges = `
      <div class="pg-filtres">
        ${[["tous", "Tous"], ["obtenus", "Obtenus"], ["avenir", "À obtenir"]].map(([k, texte]) =>
          `<button data-filtre="${k}" class="${filtreBadges === k ? "actif" : ""}">${texte}</button>`).join("")}
      </div>
      ${htmlBadgesPage()}`;

  const panneau = { ensemble: panneauEnsemble, familles: `<div class="pg-tuiles" id="tuiles-progression"></div>`,
                    badges: panneauBadges, jeux: panneauJeux }[ongletProfil];
  // Étape R153 (08/11, maquette A « Trois chiffres », choix d'Aubin) — sur téléphone seulement : la carte de naturaliste,
  //   le prochain rang du carnet, les souvenirs, puis familles et jeux repliés. Retirés : % de nature connue, carte,
  //   « identifiées / maîtrisées », caractéristiques trouvées. Les souvenirs ouvrent l'onglet Badges (avec un retour).
  const telA = true;   // étape R154 (08/11, « Oui pour pareil ordi ») : la même page sur ordinateur (avant : surPetitEcran())
  const profilA = () => `<div class="pg-a">
      ${rc.suivant ? `<div class="pg-encart pg-a-rang"><p class="pg-petit-titre">Prochaine page du carnet</p>
        <p>« ${rc.suivant.nom} » à ${nombre(rc.suivant.seuil)} espèces : encore <b>${nombre(Math.max(0, rc.suivant.seuil - rc.n))}</b>.</p>
        <i class="jauge-jeu"><b style="width:${Math.round(100 * rc.part)}%"></b></i></div>`
        : `<div class="pg-encart pg-a-rang"><p>Votre carnet est complet : toutes les espèces du jeu !</p></div>`}
      <button type="button" class="pg-encart pg-a-souv" data-onglet-profil="badges"><span class="pg-a-l"><b>Vos badges</b><small>${obtenus} sur ${badges.length}</small></span>
        <span class="pg-minis">${derniers.length ? derniers.map(b => `<span class="pg-a-mini">${dessinBadge(b)}</span>`).join("") : `<small>Le premier arrive vite.</small>`}</span></button>
      <details class="pg-encart pg-a-pli"${ongletProfil === "familles" ? " open" : ""}><summary>Vos familles</summary><div class="pg-tuiles" id="tuiles-progression"></div></details>
      <details class="pg-encart pg-a-pli"><summary>Jeux et records</summary>${panneauJeux}</details>
    </div>`;
  const corpsProfil = telA && ongletProfil !== "badges" ? profilA()
    : telA ? `<button type="button" class="pg-lien pg-a-retour" data-onglet-profil="ensemble">← Votre profil</button><div class="pg-panneau">${panneauBadges}</div>`
    : barreOnglets + `<div class="pg-panneau">${panneau}</div>`;
  document.getElementById("vue-progression").innerHTML = enTeteProfil + corpsProfil
    + `<button class="pg-apropos-mobile" id="pg-apropos" type="button">Réglages et à propos <span aria-hidden="true">›</span></button>`;   // étape M6 (téléphone)
  brancherPrenom();   // étape M6

  // Les tuiles des familles : anneau, rang, espèces identifiées, médailles d'espèces
  const zone = document.getElementById("tuiles-progression");
  if (zone) for (const cle of familles) {
    const especes = especesT.filter(e => e.onglet === cle);
    const f = progresFamille(especes);
    const meds = [1, 2, 3].map(n => especes.filter(e => niveauTermine(e) === n).length);   // médaille la plus haute de chaque espèce
    const tour = 2 * Math.PI * 20;
    const tuile = document.createElement("button");
    tuile.className = "pg-encart pg-tuile " + MEDAILLES[f.palier];
    tuile.style.setProperty("--couleur-classe", CLASSES[cle].couleur);
    tuile.title = `${CLASSES[cle].nom} : ${f.especesId} / ${f.nb} espèces identifiées, ${f.medailles} palier${f.medailles > 1 ? "s" : ""} d'espèce (${Math.round(f.part * 100)} %)`
      + (f.palier < PALIERS_FAMILLE.length ? ` · prochain rang : ${RANGS_FAMILLE[f.palier + 1]} à ${Math.round(PALIERS_FAMILLE[f.palier] * 100)} %` : "");
    tuile.innerHTML = `<svg class="anneau" viewBox="0 0 52 52" aria-hidden="true"><circle class="fond" cx="26" cy="26" r="20"/>
        ${f.trouvees ? `<circle class="arc" cx="26" cy="26" r="20" stroke-dasharray="${tour * f.part} ${tour}" transform="rotate(-90 26 26)"/>` : ""}
        <g class="silhouette" transform="translate(13.5 13.5) scale(0.52)">${SILHOUETTES[cle] || ""}</g></svg>
      <div class="nom">${CLASSES[cle].nom}</div>
      <div class="rang">${RANGS_FAMILLE[f.palier] || "—"}</div>
      <div class="compte">${especes.filter(estReconnue).length} / ${especes.length} espèces</div>
      <div class="pg-meds">${[1, 2, 3].map((n, k) =>
        `<span title="Espèces ${nomPalier(n)}s">${dessinMedaille("", n)}${meds[k]}</span>`).join("")}</div>`;   // étape R144
    tuile.onclick = () => { filtreClasse = cle; montrer("encyclopedie"); };   // comme sur l'accueil
    zone.appendChild(tuile);
  }
  if (ongletProfil === "ensemble" && document.getElementById("carte-progression")) dessinerCarteProgression();   // R153 : pas de carte sur téléphone
  const vue = document.getElementById("vue-progression");
  // Les onglets (et le lien « Tous les badges → »)
  vue.querySelectorAll("[data-onglet-profil]").forEach(b => b.onclick = () => { ongletProfil = b.dataset.ongletProfil; afficherPageProgression(); });
  // Un clic sur une pastille : son détail s'ouvre (un second clic le referme). Depuis la vue d'ensemble, on passe aux badges.
  vue.querySelectorAll(".pg-mini[data-badge]").forEach(b => b.onclick = () => {
    badgeOuvert = badgeOuvert === b.dataset.badge && ongletProfil === "badges" ? null : b.dataset.badge;
    if (ongletProfil !== "badges") { ongletProfil = "badges"; filtreBadges = "tous"; }
    afficherPageProgression();
  });
  vue.querySelectorAll(".pg-filtres button").forEach(b =>
    b.onclick = () => { filtreBadges = b.dataset.filtre; afficherPageProgression(); });
  // Étape 109 : l'espèce favorite → sa page ; pas encore de favorite → l'encyclopédie
  const carteFavori = document.getElementById("pg-favori");
  if (carteFavori) carteFavori.onclick = () => ouvrirPageEspece(favorite());
  const choisirFavori = document.getElementById("pg-favori-choisir");
  if (choisirFavori) choisirFavori.onclick = () => montrer("encyclopedie");
  // « Porter le titre » (un clic sur le titre porté le retire)
  vue.querySelectorAll(".porter[data-titre]").forEach(b => b.onclick = () => {
    titreChoisi = titreChoisi === b.dataset.titre ? null : b.dataset.titre;
    sauvegarder(); afficherStats(); afficherPageProgression();
  });
}

// ---- Étape 106 : ce que chaque réponse apprend aux badges ----
// noterReussite est appelée juste AVANT le +1 sur la case ; noterEchec à chaque réponse ratée.
function cleCase(espece, champ) { return espece.nom_courant + "|" + champ; }
function noterReussite(espece, champ) {
  const avant = nbBonnes(espece, champ);
  // Premier coup d'œil : reconnue sur photo en Rencontre, à la première fois, sans être passée par « Pas encore »
  // Étape 208 (retour du 18/10) : et JAMAIS ratée avant — une photo ratée puis retrouvée à la fin (« À revoir ») ne compte pas
  if (champ === IDENTIFICATION && avant === 0 && !defi && session && session.focus && !session.presentee
      && !(suivi.echecs[cleCase(espece, IDENTIFICATION)] > 0)) suivi.coupsDoeil++;
  if ((suivi.echecs[cleCase(espece, champ)] || 0) >= 3) suivi.tenacite = true;   // ratée 3 fois, puis retrouvée
  if (champ === "cri_son") noterType("cris");
  // Étape 107 : la date de la découverte (pour les dernières espèces de l'accueil)
  if (champ === IDENTIFICATION && avant === 0 && progression[espece.nom_courant]) progression[espece.nom_courant].decouverteLe = Date.now();
  verifierBadgesBientot();
}
function noterEchec(espece, champ) {
  if (champ === OUVERTURE) return;
  const cle = cleCase(espece, champ);
  suivi.echecs[cle] = (suivi.echecs[cle] || 0) + 1;
  if (champ === "cri_son") noterType("cris");
  if (defi) defi.erreurs = (defi.erreurs || 0) + 1;    // pour « Sans faute »
}


// ---- Étape 111 : l'aide « silhouette » ----
// Étape 112 : la silhouette est proposée pour TOUTES les questions sans photo (plus de liste d'exceptions).
function fichierSilhouette(espece) {
  // Étape 181 : une espèce sans photo (« photo à venir ») a quand même sa silhouette,
  // rangée sous le nom de l'espèce : « Raie bouclée » → Silhouettes/raie_bouclee.svg
  if (!estRenseigne(espece.photo)) return "Silhouettes/" + nomDeFichier(espece.nom_courant) + ".svg";
  return "Silhouettes/" + espece.photo.replace("Images/", "").replace(/\.[a-z]+$/i, "") + ".svg";
}
// On cache la zone ; puis, si une espèce est donnée (photo cachée), on propose le bouton.
function proposerSilhouette(espece) {
  const zone = document.getElementById("zone-silhouette"), aide = document.getElementById("silhouette-aide");
  const bouton = document.getElementById("bouton-silhouette");
  zone.classList.add("cache"); aide.classList.add("cache"); aide.innerHTML = ""; bouton.classList.remove("cache");
  const fichier = espece && fichierSilhouette(espece);
  if (!fichier) return;
  zone.classList.remove("cache");
  // Étape 147 : la silhouette s'affiche en passant la souris sur le bouton (ou en le sélectionnant au clavier),
  // et disparaît quand la souris s'en va. Un clic la garde ouverte ou la referme (pour les écrans tactiles).
  // Si le fichier manque, on retire simplement la zone.
  aide.innerHTML = `<img src="${fichier}" alt="Silhouette" onerror="document.getElementById('zone-silhouette').classList.add('cache')">`;
  let tenue = false;
  const montrerAide = () => aide.classList.remove("cache");
  const cacherAide = () => { if (!tenue) aide.classList.add("cache"); };
  bouton.onmouseenter = montrerAide; bouton.onfocus = montrerAide;
  bouton.onmouseleave = cacherAide;  bouton.onblur = () => { tenue = false; cacherAide(); };
  bouton.onclick = () => { tenue = !tenue; tenue ? montrerAide() : aide.classList.add("cache"); };
}


// =====================================================================================================
// Étape M6 (06/11/2026, choix de l'utilisateur) — le joueur se reconnaît dans son profil.
//   • Un prénom ou un pseudo (suivi.prenom), demandé à la première visite (facultatif), modifiable dans le Profil,
//     sur téléphone comme sur ordinateur.
//   • Sur téléphone : la « carte de naturaliste » (maquette 1) en tête du Profil — l'espèce favorite en photo,
//     le prénom, le rang, le premier jour de jeu, 3 chiffres et la famille de cœur ; « Réglages et à propos » en bas.
//     Sur ordinateur, la carte et ce bouton sont cachés (style.css, étape M6) ; seul le prénom s'ajoute à l'en-tête.
// =====================================================================================================
let prenomEnEdition = false;
function prenomJoueur() { return suivi && typeof suivi.prenom === "string" ? suivi.prenom.trim() : ""; }
function blocPrenom(classe) {
  const p = prenomJoueur();
  if (prenomEnEdition) return `<form class="${classe} pg-prenom-form" data-prenom-form><label class="cache-visuel" for="${classe}-champ">Votre prénom ou pseudo</label>
      <input id="${classe}-champ" type="text" maxlength="24" value="${echapper(p)}" placeholder="Votre prénom ou pseudo" autocomplete="nickname">
      <button type="submit">OK</button></form>`;
  // Étape M11 (07/11, idée de l'utilisateur) : le prénom se modifie dans « Réglages et à propos », plus dans le Profil
  return p ? `<div class="${classe}"><span class="pg-prenom-nom">${echapper(p)}</span></div>` : "";
}
function brancherPrenom() {
  const vue = document.getElementById("vue-progression");
  if (!vue) return;
  vue.querySelectorAll("[data-prenom-modifier]").forEach(b => b.onclick = () => {
    prenomEnEdition = true; afficherPageProgression();
    const champ = [...document.querySelectorAll("[data-prenom-form] input")].find(i => i.offsetParent);
    if (champ) champ.focus();
  });
  vue.querySelectorAll("[data-prenom-form]").forEach(f => f.onsubmit = ev => {
    ev.preventDefault();
    suivi.prenom = f.querySelector("input").value.trim().slice(0, 24);
    prenomEnEdition = false; sauvegarder(); afficherPageProgression();
  });
  const ap = document.getElementById("pg-apropos");
  if (ap) ap.onclick = () => montrer("apropos");
  const av = document.getElementById("pg-avatar");
  if (av) av.onclick = () => { const e = favorite(); if (e) ouvrirPageEspece(e); else montrer("encyclopedie"); };
}
function familleDeCoeur() {
  let meilleure = null, n = 0;
  for (const cle in CLASSES) {
    const k = ESPECES.filter(e => e.onglet === cle && estReconnue(e)).length;
    if (k > n) { n = k; meilleure = cle; }
  }
  return meilleure ? { cle: meilleure, n, total: ESPECES.filter(e => e.onglet === meilleure).length } : null;
}
function carteNaturaliste(rc) {
  const e = favorite(), t = territoireActif();
  const p = prenomJoueur();
  const jours = (suivi.jours || []).slice().sort();
  const debut = jours.length ? new Date(jours[0] + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "";
  const terrs = tousLesTerritoires();
  const pas = terrs.reduce((s, x) => s + (typeof empreintesTerritoire === "function" ? empreintesTerritoire(x) : 0), 0);
  const lieux = terrs.reduce((s, x) => s + (typeof lieuxDe === "function" ? lieuxDe(x).filter(c => lieuTermine(x, c)).length : 0), 0);
  const coeur = familleDeCoeur();
  const rangT = t && typeof rangTerritoire === "function" ? rangTerritoire(t) : null;
  const avatar = e ? `<img src="${photoEsp(e)}" alt="Votre espèce favorite : ${echapper(e.nom_courant)}">`
                   : `<span class="pg-avatar-vide">${typeof PICTO_LIENS !== "undefined" ? "" : ""}?</span>`;
  return `<section class="pg-carte-nat">
      <div class="pg-cn-etiq">Carte de naturaliste · Myriade</div>
      <div class="pg-cn-haut">
        <button type="button" class="pg-avatar" id="pg-avatar" title="${e ? "Votre espèce favorite" : "Choisir une espèce favorite dans l'encyclopédie"}">${avatar}</button>
        <div class="pg-cn-qui">
          ${prenomEnEdition ? blocPrenom("pg-cn-prenom") : `<div class="pg-cn-nom">${p ? echapper(p) : "Naturaliste"}</div>`}
          <div class="pg-cn-rang">${rc.nom}${rangT ? ` · ${rangT.nom} ${deTerritoire(t)}` : ""}</div>
          ${debut ? `<div class="pg-cn-debut">Sur le terrain depuis le ${debut} · ${jours.length} jour${jours.length > 1 ? "s" : ""} de jeu</div>` : ""}
        </div>
      </div>
      <div class="pg-cn-chiffres">
        <div><b>${nombre(rc.n)}</b><span>espèce${rc.n > 1 ? "s" : ""} au carnet</span></div>
        <div><b>${nombre(lieux)}</b><span>lieu${lieux > 1 ? "x" : ""} terminé${lieux > 1 ? "s" : ""}</span></div>
        <div><b>${nombre(territoiresOuverts().length)}</b><span>territoire${territoiresOuverts().length > 1 ? "s" : ""} ouvert${territoiresOuverts().length > 1 ? "s" : ""}</span></div>
      </div>
      ${coeur ? `<div class="pg-cn-coeur">Famille de cœur : <b>${CLASSES[coeur.cle].nom.toLowerCase()}</b></div>`
              : `<div class="pg-cn-coeur">${e ? "" : "Votre photo : votre espèce favorite, à choisir sur la page d'une espèce découverte."}</div>`}
    </section>`;
}
