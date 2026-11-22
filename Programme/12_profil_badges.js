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
  encycloVue: 0,        // étape R278 (37.03) : l'heure de la dernière visite de l'Encyclopédie (0 = jamais : une partie neuve)
  nouveaux: [],         // étape R278 (37.03) : les espèces marquées « Nouveau » dans l'Encyclopédie, jusqu'à l'ouverture de leur fiche
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

// ---- Étape B1 (13/11/2026, choix d'Aubin : style A4 « couleur du groupe ») ----
// Un seul dessin par badge, partout (page des badges, fête, vitrine du Profil, fin de partie) : un rond à la couleur
// du groupe, un disque papier, le dessin à l'encre ; les paliers en 1 à 3 points en bas (plein = gagné).
// Plus de bronze / argent / or pour les badges : ces mots sont aux médailles des lieux.
const COULEURS_GROUPES_BADGES = { E: "#2F5A45", C: "#A8652A", S: "#3E5F73", R: "#6E4C68" };
const MOTIFS_BADGES = {            // dessins à traits, dans un carré de 48
  expedition: `<path d="M14 43c0-8 20-8 20-16s-14-8-14-16"/><path d="M20 12V3l8 3.5-8 3.5"/>`,
  lieu: `<path d="M5 13l12-4 14 4 12-4v27l-12 4-14-4-12 4z"/><path d="M17 9v27M31 13v12"/><path d="M31 37s-6-6-6-10a6 6 0 0 1 12 0c0 4-6 10-6 10z"/><circle cx="31" cy="27" r="2"/>`,
  toile: `<path d="M24 9L10 21M24 9l14 12M10 21l6 17M38 21l-6 17M16 38h16M24 9v16M10 21l14 4M38 21l-14 4M16 38l8-13M32 38l-8-13"/><circle cx="24" cy="9" r="2.6" fill="#1F3A2E"/><circle cx="10" cy="21" r="2.6" fill="#1F3A2E"/><circle cx="38" cy="21" r="2.6" fill="#1F3A2E"/><circle cx="16" cy="38" r="2.6" fill="#1F3A2E"/><circle cx="32" cy="38" r="2.6" fill="#1F3A2E"/><circle cx="24" cy="25" r="2.6" fill="#1F3A2E"/>`,
  gardien: `<path d="M3 41l14-22 8 12 6-8 14 18z"/><path d="M17 19V7l8 3.5-8 3.5"/>`,
  voyageur: `<circle cx="24" cy="24" r="17"/><path d="M24 11l5 13-5 13-5-13z"/><path d="M19 24h10"/><path d="M24 4v3M24 41v3M4 24h3M41 24h3"/>`,
  planches: `<rect x="6" y="14" width="26" height="28" rx="1.5"/><path d="M14 14V7h28v28h-10"/><path d="M13 35c0-8 5-13 12-13 0 8-5 13-12 13zM13 35l6-6"/>`,
  liens: `<circle cx="12" cy="27" r="7.5"/><circle cx="36" cy="27" r="7.5"/><path d="M15 18c5-6 13-6 18 0"/><path d="M30 15.5l3 2.5-3.5 1.5"/><path d="M9 30c0-4 2-6 6-6 0 4-2 6-6 6z"/><path d="M33 27a3 3 0 1 1 3 3"/><path d="M33 36c-5 5-13 5-18 0"/><path d="M18 38.5l-3-2.5 3.5-1.5"/>`,
  carnet: `<path d="M6 13c6-3 12-3 18 1 6-4 12-4 18-1v24c-6-3-12-3-18 1-6-4-12-4-18-1z"/><path d="M24 14v24"/><path d="M29 31c0-6 4-10 9-10 0 6-4 10-9 10zM29 31l5-5"/><path d="M10 19h9M10 24h9M10 29h7"/>`,
  familles: `<circle cx="24" cy="24" r="5"/><circle cx="39.0" cy="24.0" r="2.6"/><circle cx="36.1" cy="32.8" r="2.6"/><circle cx="28.6" cy="38.3" r="2.6"/><circle cx="19.4" cy="38.3" r="2.6"/><circle cx="11.9" cy="32.8" r="2.6"/><circle cx="9.0" cy="24.0" r="2.6"/><circle cx="11.9" cy="15.2" r="2.6"/><circle cx="19.4" cy="9.7" r="2.6"/><circle cx="28.6" cy="9.7" r="2.6"/><circle cx="36.1" cy="15.2" r="2.6"/>`,
  specialiste: `<circle cx="20" cy="20" r="13"/><path d="M29.5 29.5L42 42"/><path d="M14 27c2-8 6-12 12-13-1 6-5 11-12 13zM14 27l7-7"/>`,
  familiere: `<path d="M9 40C9 21 21 10 41 8c0 19-11 32-32 32z"/><path d="M9 40L33 16M17 32h8M23 26v-8M28 21h6"/>`,
  raretes: `<path d="M3 27s7-11 18-11 18 11 18 11-7 11-18 11S3 27 3 27z"/><circle cx="21" cy="27" r="4.5"/><path d="M38 4l1.6 3.6 3.9.4-2.9 2.6.8 3.9-3.4-2-3.4 2 .8-3.9-2.9-2.6 3.9-.4z"/>`,
  proteger: `<path d="M24 35V22"/><path d="M24 27c-6 0-9-4-9-9 6 0 9 4 9 9zM24 24c0-6 3-10 9-10 0 6-3 10-9 10z"/><path d="M6 30c5 0 9 2 11 5h14c2-3 6-5 11-5"/><path d="M6 30v3c0 5 8 9 18 9s18-4 18-9v-3"/>`,
  etonnant: `<path d="M22 27a2 2 0 1 1 4 0a5 5 0 1 1-10 0a8 8 0 1 1 16 0a11 11 0 1 1-22 0"/><path d="M37 6v7M33.5 9.5h7M42 17v4M40 19h4"/>`,
  oreille: `<path d="M12 31c0-7 5-12 12-12 3 0 5 1 6.5 3l5 1-4 3c0 8-6 13-13 13-3 0-6.5-1-6.5-4z"/><circle cx="28" cy="23" r="1" fill="#1F3A2E"/><path d="M8 41h24M19 37v4M24 37v4"/><path d="M37 11a6 6 0 0 1 0 8M40.5 8a11 11 0 0 1 0 14"/>`,
  traces: `<ellipse cx="16" cy="31" rx="6" ry="8"/><circle cx="9.5" cy="19" r="2.4"/><circle cx="16" cy="15.5" r="2.4"/><circle cx="22.5" cy="19" r="2.4"/><ellipse cx="34" cy="22" rx="5" ry="6.6"/><circle cx="29.5" cy="11.5" r="2"/><circle cx="34.5" cy="9.5" r="2"/><circle cx="39.5" cy="11.5" r="2"/>`,
  lynx: `<path d="M10 40c-2-10 0-18 4-22l-2-12 8 8h8l8-8-2 12c4 4 6 12 4 22-4 3-9 4-14 4s-10-1-14-4z"/><path d="M12 6V2M36 6V2"/><circle cx="19" cy="26" r="1.8" fill="#1F3A2E"/><circle cx="29" cy="26" r="1.8" fill="#1F3A2E"/><path d="M22 32h4l-2 2.5z"/><path d="M11 35l-5 2M37 35l5 2"/>`,
  tenacite: `<path d="M3 44L45 20"/><path d="M23 29a2 2 0 1 1 3-1.5a5 5 0 1 1-9 2a8 8 0 1 1 15-3.5"/><path d="M10 40l26-15 3-6M36 25l5-3"/>`,
  fidele: `<rect x="7" y="10" width="34" height="30" rx="3"/><path d="M7 18h34M16 6v8M32 6v8"/><path d="M17 30l5 4 9-10"/>`,
  saisons: `<circle cx="24" cy="24" r="17"/><path d="M24 7v34M7 24h34"/><circle cx="15.5" cy="15.5" r="2"/><path d="M15.5 11v2M15.5 18v2M11 15.5h2M18 15.5h2"/><circle cx="32.5" cy="15.5" r="3"/><path d="M32.5 10v1.5M38 15.5h-1.5M28.5 11.5l1 1M36.5 11.5l-1 1"/><path d="M12 35c0-5 3-8 8-8 0 5-3 8-8 8zM12 35l4-4"/><path d="M32.5 28v9M28.5 30.5l8 4M28.5 34.5l8-4"/>`,
  levetot: `<path d="M4 37h40"/><path d="M12 37a12 12 0 0 1 24 0"/><path d="M24 16v5M11 22l3.5 3.5M37 22l-3.5 3.5"/><path d="M29 9l3 2 3-2M35 13l2.5 1.6L40 13"/>`,
  nuit: `<path d="M13 41c-3-6-3-18 2-24l-2-8 7 5h6l7-5-2 8c5 6 5 18 2 24-6 3-14 3-20 0z"/><circle cx="19.5" cy="22" r="4"/><circle cx="28.5" cy="22" r="4"/><circle cx="19.5" cy="22" r="1.3" fill="#1F3A2E"/><circle cx="28.5" cy="22" r="1.3" fill="#1F3A2E"/><path d="M24 26l-1.6 3.4h3.2z"/><path d="M45 9a5.5 5.5 0 1 1-6-6 4.5 4.5 0 0 0 6 6z"/>`,
  // Étape R269 (choix d'Aubin du 19/11) : les 16 nouveaux dessins, même trait
  famillecomplete: `<rect x="5" y="9" width="38" height="30" rx="2"/><circle cx="14" cy="18" r="3.4"/><circle cx="24" cy="18" r="3.4"/><circle cx="34" cy="18" r="3.4"/><circle cx="14" cy="30" r="3.4"/><circle cx="24" cy="30" r="3.4"/><circle cx="34" cy="30" r="3.4"/><path d="M32 30l1.6 1.6 3-3.2"/>`,
  ailleurs: `<circle cx="20" cy="26" r="15"/><path d="M5 26h30M20 11c-5 5-5 25 0 30M20 11c5 5 5 25 0 30"/><path d="M33 9c4 0 8 3 9 8"/><path d="M42 11.5l0 5.5-5.2-1.6"/>`,
  declin: `<path d="M6 40h36M6 40V8"/><path d="M10 14l8 6 7-3 7 11 8 6"/><path d="M40 28.5V34h-5.6"/><path d="M14 33c0-4 3-6 6-6 0 4-3 6-6 6zM14 33l3-3"/>`,
  mondenuit: `<path d="M24 21c-3-4-9-5-13-2l-6-3c2 5 1 9-1 12 4-1 8 1 10 4 2-3 5-5 10-5 5 0 8 2 10 5 2-3 6-5 10-4-2-3-3-7-1-12l-6 3c-4-3-10-2-13 2z"/><circle cx="24" cy="23" r="1.4" fill="#1F3A2E"/><path d="M10 8l.8 1.8 1.9.2-1.4 1.3.4 1.9-1.7-1-1.7 1 .4-1.9-1.4-1.3 1.9-.2zM38 6l.6 1.3 1.4.2-1 .9.3 1.4-1.3-.7-1.3.7.3-1.4-1-.9 1.4-.2z"/>`,
  migrateurs: `<path d="M6 34c4-4 8-4 11 0 3-4 7-4 11 0"/><path d="M20 20c3-3 6-3 8 0 2-3 5-3 8 0"/><path d="M30 10c2-2 4-2 5.5 0 1.5-2 3.5-2 5.5 0"/><path d="M5 43c12-2 24-10 34-24" stroke-dasharray="2.5 3"/>`,
  petitesbetes: `<ellipse cx="24" cy="28" rx="11" ry="13"/><path d="M24 15v26"/><circle cx="24" cy="12" r="4"/><path d="M21 9l-4-5M27 9l4-5"/><path d="M13 22l-7-3M13 29H5M14 36l-6 4M35 22l7-3M35 29h8M34 36l6 4"/><circle cx="19" cy="24" r="1.8" fill="#1F3A2E"/><circle cx="29" cy="31" r="1.8" fill="#1F3A2E"/><circle cx="18.5" cy="33" r="1.5" fill="#1F3A2E"/>`,
  fichecomplete: `<path d="M11 5h20l8 8v30H11z"/><path d="M31 5v8h8"/><path d="M16 17h11M16 23h17M16 29h17"/><circle cx="33" cy="37" r="7"/><path d="M29.8 37l2.2 2.2 4-4.4"/>`,
  sosies: `<path d="M8 40c0-10 4-17 10-17s10 7 10 17"/><circle cx="18" cy="15" r="6"/><path d="M20 40c0-10 4-17 10-17s10 7 10 17"/><circle cx="30" cy="15" r="6"/><path d="M14 43h20"/>`,
  expcomplete: `<path d="M8 43c0-8 18-7 18-15S12 21 14 13"/><path d="M33 4l2.6 5.6 6 .7-4.5 4.1 1.2 6-5.3-3-5.3 3 1.2-6-4.5-4.1 6-.7z"/><circle cx="8" cy="43" r="1.6" fill="#1F3A2E"/>`,
  lieuxor: `<path d="M16 4l6 14M32 4l-6 14"/><circle cx="24" cy="30" r="13"/><circle cx="24" cy="30" r="8.5"/><path d="M24 25.5l1.4 3 3.2.4-2.4 2.2.6 3.2-2.8-1.6-2.8 1.6.6-3.2-2.4-2.2 3.2-.4z"/>`,
  emblemes: `<path d="M24 4l16 6v12c0 11-7 18-16 22C15 40 8 33 8 22V10z"/><path d="M14 31l7-10 4 5 3-3 6 8z"/><circle cx="31" cy="15" r="2.5"/>`,
  coupaguerri: `<path d="M3 24s8-12 21-12 21 12 21 12-8 12-21 12S3 24 3 24z"/><circle cx="24" cy="24" r="7"/><circle cx="24" cy="24" r="2.5" fill="#1F3A2E"/><path d="M24 3v5M24 40v5M41 7l-3 3M7 7l3 3"/>`,
  portraitiste: `<rect x="7" y="5" width="34" height="38" rx="2"/><rect x="12" y="10" width="24" height="28" rx="1"/><circle cx="24" cy="20" r="5"/><path d="M15 38c1-6 5-9 9-9s8 3 9 9"/><path d="M38 10l4-4"/>`,
  detective: `<circle cx="20" cy="20" r="13"/><path d="M29.5 29.5L42 42"/><path d="M16 16.5a4 4 0 1 1 5.5 3.7c-1.2.5-1.5 1.3-1.5 2.6"/><circle cx="20" cy="27" r="1.2" fill="#1F3A2E"/>`,
  duJour: `<circle cx="24" cy="15" r="6"/><path d="M24 3v2.5M24 24.5V27M12 15h2.5M33.5 15H36M15.5 6.5l1.8 1.8M32.5 6.5l-1.8 1.8"/><path d="M10 44c0-10 6-16 14-16 0 10-6 16-14 16zM10 44l8-8"/><path d="M38 44c0-9-5-14-12-14 0 9 5 14 12 14z"/>`,
  defisjour: `<rect x="8" y="5" width="32" height="38" rx="3"/><path d="M14 15l2.5 2.5 4.5-5M25 15h10M14 25l2.5 2.5 4.5-5M25 25h10"/><rect x="14" y="31.5" width="6" height="6" rx="1"/><path d="M25 35h10"/>`,
  duel: `<rect x="5" y="12" width="17" height="24" rx="2" transform="rotate(-8 13.5 24)"/><rect x="26" y="12" width="17" height="24" rx="2" transform="rotate(8 34.5 24)"/><circle cx="13.5" cy="21" r="3"/><path d="M8.5 31c1.5-3 8.5-3 10 0"/><circle cx="34.5" cy="21" r="3"/><path d="M29.5 31c1.5-3 8.5-3 10 0"/>`,
};
function dessinBadge(b, palier = palierDe(b)) {
  const coul = COULEURS_GROUPES_BADGES[b.cat] || "#1F3A2E", n = b.paliers ? b.paliers.length : 0;
  const haut = n ? 57 : 60, ecart = 8;
  const points = n ? Array.from({ length: n }, (_, i) => `<circle cx="${60 + (i - (n - 1) / 2) * ecart}" cy="110" r="2.8" fill="${i < palier ? "#FBF8F1" : "none"}" stroke="#FBF8F1" stroke-width="1.3"/>`).join("") : "";
  const motif = MOTIFS_BADGES[b.motif] || MOTIFS_BADGES.carnet;
  return `<span class="rond-badge mb${palier ? "" : " pas-encore"}"><svg viewBox="0 0 120 120" aria-hidden="true">`
    + `<circle cx="60" cy="60" r="56" fill="${coul}"/><circle cx="60" cy="60" r="44" fill="#FBF8F1"/>`
    + `<g transform="translate(32.4 ${haut - 27.6}) scale(1.15)" fill="none" stroke="#1F3A2E" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">${motif}</g>`
    + points + `</svg></span>`;
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
// Étape R269 (choix d'Aubin du 19/11 : « 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 17, 18 · R1A · R2A ») : les mesures
//   des nouveaux badges. Toutes partent de ce que le jeu sait déjà (rien ne recule), sauf « Espèce du jour » (jours notés
//   à partir du 19/11, suivi.joursDuJour, 07).
const PETITES_BETES = ["Insectes", "Araignees_mille_pattes", "Mollusques", "Crustaces", "Vers_meduses_compagnie"];
function famillesCompletes() {   // familles d'au moins 5 espèces dans un territoire, toutes au carnet
  let n = 0;
  for (const t of tousLesTerritoires()) {
    const especes = especesDe(t);
    for (const cle in CLASSES) {
      const f = especes.filter(e => e.onglet === cle);
      if (f.length >= MINI_BADGE_FAMILLE && f.every(estReconnue)) n++;
    }
  }
  return n;
}
function sosiesAuCarnet() {      // groupes de sosies dont au moins deux espèces sont au carnet
  if (typeof CONFUSIONS === "undefined") return 0;
  return CONFUSIONS.filter(g => g.especes.map(especeParNom).filter(e => e && estReconnue(e)).length >= 2).length;
}
const nbFichesCompletes = () => {
  if (typeof verifierFichesCompletes === "function" && suivi && !suivi.fichesCompletesR258) verifierFichesCompletes();
  return Object.keys((suivi && suivi.fichesCompletes) || {}).length;
};
const nbExpCompletes = () => typeof toutesExpeditions === "function" && typeof expeditionComplete === "function" ? toutesExpeditions().filter(expeditionComplete).length : 0;
const lieuxEnOr = () => typeof CHAPITRES === "undefined" || typeof medailleLieu !== "function" ? 0 : CHAPITRES.filter(c => estLieu(c) && medailleLieu(c.territoire, c) >= 3).length;
const emblemesComplets = () => typeof emblemesTerritoire !== "function" ? 0 : tousLesTerritoires().filter(t => { const l = emblemesTerritoire(t); return l.length && l.every(estReconnue); }).length;
// Étape B1 : les liens découverts// Étape B1 : les liens découverts (étape « Leurs liens » et bonnes réponses des finales), une fois chacun
function noterLienConnu(cle) {
  if (!suivi || !cle) return;
  suivi.liensConnus = suivi.liensConnus || {};
  if (suivi.liensConnus[cle]) return;
  suivi.liensConnus[cle] = 1;
  sauvegarder();
  if (typeof verifierBadgesBientot === "function") verifierBadgesBientot();
}
// Rien ne recule : la première fois, on compte les liens des finales faites ou commencées et ceux des expéditions déjà vues
function migrerLiensB1() {
  if (!suivi || suivi.liensB1) return;
  const l = suivi.liensConnus = suivi.liensConnus || {};
  try {
    for (const cle of Object.keys(suivi.finales || {})) {
      if (!suivi.finales[cle]) continue;
      const i = cle.indexOf("|"), t = cle.slice(0, i), nom = cle.slice(i + 1);
      if (typeof liensDuLieu === "function") for (const k of liensDuLieu(t, nom)) l[cleLien(k)] = 1;
    }
    for (const liste of Object.values(suivi.finalesTrouves || {})) for (const k of liste) l[k] = 1;
    for (const id of Object.keys(suivi.liensExp || {})) {
      const x = suivi.liensExp[id] && typeof expeditionParId === "function" ? expeditionParId(id) : null;
      if (x && typeof candidatsLiens === "function") for (const r of candidatsLiens(x).slice(0, LIENS_ETAPE2_MAX)) l[cleLienExp(r)] = 1;
    }
  } catch (e) {}
  suivi.liensB1 = true;
  sauvegarder();
}
function cleLienExp(r) { return r.type === "lien" ? cleLien(r.lien) : "mange|" + r.a.nom_courant + "|" + r.b.nom_courant; }
function nbLiensConnus() { if (!suivi) return 0; migrerLiensB1(); return Object.keys(suivi.liensConnus || {}).length; }
const BADGES_TOUT_LE_JEU = [
  // En chemin : les expéditions, les lieux, les territoires
  { cle: "premiere-expedition", cat: "E", nom: "Première expédition", cond: "Terminer une expédition (ses deux étapes)", icone: "chemin", motif: "expedition", but: 1,
    mesure: nbFinies },
  { cle: "premier-lieu", cat: "E", nom: "Premier lieu exploré", cond: "Terminer toutes les expéditions d'un lieu", icone: "carte", motif: "lieu", but: 1,
    mesure: lieuxFinis },
  { cle: "tout-est-lie", cat: "E", nom: "Tout est lié", cond: "Réussir la finale d'un lieu", icone: "ensemble", motif: "toile", but: 1,   // étape B1 : nom
    mesure: nbFinales },
  { cle: "gardien", cat: "E", nom: "Gardien", cond: "Terminer un territoire : tous ses lieux, puis le tour du site remarquable", icone: "montagne", motif: "gardien", but: 1,
    mesure: nbGardien },
  { cle: "voyageur", cat: "E", nom: "Grand voyageur", cond: "Partir en expédition dans plusieurs territoires", icone: "boussole", motif: "voyageur", paliers: [3, 6, 11],
    mesure: territoiresVisites },
  { cle: "planches", cat: "E", nom: "Planches des lieux", cond: "Réunir les planches des finales des lieux", icone: "cadres", motif: "planches", paliers: [10, 30, 110],
    mesure: nbFinales },
  { cle: "leurs-liens", cat: "E", nom: "Leurs liens", cond: "Découvrir des liens entre les espèces", icone: "ensemble", motif: "liens", paliers: [10, 50, 150],   // étape B1
    mesure: nbLiensConnus },
  // Étape R269 : les nouveaux badges du chemin
  { cle: "exp-completes", cat: "E", nom: "Expéditions complètes", cond: "Rendre des expéditions complètes ★ (avec Approfondir)", motif: "expcomplete", paliers: [1, 10, 50],
    mesure: nbExpCompletes },
  { cle: "lieux-or", cat: "E", nom: "Lieux en or", cond: "Obtenir la médaille d'or de lieux", motif: "lieuxor", paliers: [1, 5, 20],
    mesure: lieuxEnOr },
  { cle: "emblemes", cat: "E", nom: "Ils font le territoire", cond: "Connaître les emblèmes d'un territoire", motif: "emblemes", paliers: [1, 3, 11],
    mesure: emblemesComplets },
  // Le carnet
  { cle: "carnet", cat: "C", nom: "Carnet", cond: "Réunir des espèces dans votre carnet", icone: "fiche", motif: "carnet", paliers: [50, 200, 500],
    mesure: () => nbEspeces(estReconnue) },
  { cle: "toutes-familles", cat: "C", nom: "Toutes les familles", cond: "Avoir au carnet une espèce de chacune des 10 familles", icone: "rose", motif: "familles", but: Object.keys(CLASSES).length,
    mesure: famillesAuCarnet },
  { cle: "specialiste", cat: "C", nom: "Spécialiste", cond: "Atteindre le rang Spécialiste dans une famille d'un territoire", icone: "loupe", motif: "specialiste", but: 1,
    mesure: unSpecialiste },
  { cle: "or", cat: "C", nom: "Espèces familières", cond: "Rendre des espèces familières (étape « Approfondir »)", icone: "medaille", motif: "familiere", paliers: [5, 25, 100],   // étape R144
    mesure: () => nbEspeces(e => niveauTermine(e) === NB_NIVEAUX) },
  { cle: "raretes", cat: "C", nom: "Raretés", cond: "Découvrir des espèces rares", icone: "oeil", motif: "raretes", paliers: [5, 15, 30],
    mesure: () => nbEspeces(e => estReconnue(e) && e.rarete_observation === "Rare") },
  { cle: "proteger", cat: "C", nom: "À protéger", cond: "Connaître des espèces menacées en France", icone: "main", motif: "proteger", paliers: [10, 30, 75],   // R269 (R2A) : avant, but 10
    mesure: () => nbEspeces(e => estReconnue(e) && ["Vulnérable", "En danger", "En danger critique"].includes(e.statut_conservation_france)) },
  { cle: "etonnant", cat: "C", nom: "Étonnant !", cond: "Trouver des faits insolites", icone: "oeil", motif: "etonnant", paliers: [10, 50, 150],   // étape B1
    mesure: () => Object.keys((suivi && suivi.insolites) || {}).length },
  // Étape R269 : les nouveaux badges du carnet
  { cle: "famille-complete", cat: "C", nom: "Une famille au complet", cond: "Réunir au carnet toutes les espèces d'une famille dans un territoire", motif: "famillecomplete", paliers: [1, 5, 15],
    mesure: famillesCompletes },
  { cle: "venues-ailleurs", cat: "C", nom: "Venues d'ailleurs", cond: "Connaître des espèces introduites par l'homme", motif: "ailleurs", paliers: [3, 10, 25],
    mesure: () => nbEspeces(e => estReconnue(e) && e.origine === "Introduite") },
  { cle: "en-declin", cat: "C", nom: "En déclin", cond: "Connaître des oiseaux dont la population diminue en France", motif: "declin", paliers: [5, 15, 40],
    mesure: () => nbEspeces(e => estReconnue(e) && e.tendance_france === "diminue") },
  { cle: "monde-nuit", cat: "C", nom: "Monde de la nuit", cond: "Connaître des espèces surtout actives la nuit", motif: "mondenuit", paliers: [10, 40, 100],
    mesure: () => nbEspeces(e => estReconnue(e) && e.activite === "Surtout la nuit") },
  { cle: "migrateurs", cat: "C", nom: "Grands migrateurs", cond: "Connaître des espèces qui migrent selon la saison", motif: "migrateurs", paliers: [10, 40, 100],
    mesure: () => nbEspeces(e => estReconnue(e) && e.deplacement_saisonnier === "Migre selon la saison") },
  { cle: "petites-betes", cat: "C", nom: "Petites bêtes", cond: "Connaître des insectes, araignées, escargots et autres petites bêtes", motif: "petitesbetes", paliers: [10, 50, 150],
    mesure: () => nbEspeces(e => estReconnue(e) && PETITES_BETES.includes(e.onglet)) },
  { cle: "fiche-complete", cat: "C", nom: "Fiche complète", cond: "Compléter toute la fiche d'une espèce", motif: "fichecomplete", paliers: [1, 10, 50],
    mesure: nbFichesCompletes },
  { cle: "sosies", cat: "C", nom: "Sosies démêlés", cond: "Avoir au carnet une espèce et son sosie", motif: "sosies", paliers: [5, 15, 40],
    mesure: sosiesAuCarnet },
  // L'œil et l'oreille
  { cle: "oreille-fine", cat: "S", nom: "Oreille fine", cond: "Reconnaître des cris", icone: "son", motif: "oreille", paliers: [10, 30, 60],
    mesure: () => nbEspeces(e => nbBonnes(e, "cri_son") >= 1) },
  { cle: "lecteur-traces", cat: "S", nom: "Lecteur de traces", cond: "Reconnaître des empreintes", icone: "traces", motif: "traces", paliers: [10, 25, 50],
    mesure: () => nbEspeces(e => nbBonnes(e, "empreinte_nom") >= 1 || nbBonnes(e, "empreinte_choix") >= 1) },
  { cle: "oeil-lynx", cat: "S", nom: "Œil de lynx", cond: "Reconnaître 10 espèces dès leur première apparition", icone: "cible", motif: "lynx", but: 10,
    mesure: () => suivi.coupsDoeil || 0 },
  { cle: "tenacite", cat: "S", nom: "Ténacité", cond: "Retrouver une réponse ratée trois fois auparavant", icone: "bouclier", motif: "tenacite", but: 1,
    mesure: () => suivi.tenacite ? 1 : 0 },
  // Étape R269 : les petits jeux
  { cle: "coup-aguerri", cat: "S", nom: "Coup d'œil aguerri", cond: "Ouvrir le niveau 3 de Coup d'œil (« Sosies et autres formes »)", motif: "coupaguerri", but: 1,
    mesure: () => typeof niveauCoupOuvert === "function" && niveauCoupOuvert() >= 3 ? 1 : 0 },
  { cle: "portraitiste", cat: "S", nom: "Portraitiste", cond: "Réussir des portraits sans erreur (Portrait-robot)", motif: "portraitiste", paliers: [5, 20, 50],
    mesure: () => (suivi && suivi.portraits) || 0 },
  { cle: "detective", cat: "S", nom: "Détective", cond: "Retrouver des espèces à Espèce mystère", motif: "detective", paliers: [10, 50, 150],
    mesure: () => (typeof statsJeux !== "undefined" && statsJeux.indices && statsJeux.indices.decouvertes) || 0 },
  // Les rendez-vous (aucune série à tenir)
  { cle: "fidele", cat: "R", nom: "Fidèle", cond: "Jouer des jours différents (pas besoin de jours d'affilée)", icone: "calendrier", motif: "fidele", paliers: [7, 30],
    mesure: () => suivi.jours.length },
  { cle: "quatre-saisons", cat: "R", nom: "Quatre saisons", cond: "Jouer au printemps, en été, en automne et en hiver", icone: "saisons", motif: "saisons", but: 4,
    mesure: () => new Set(suivi.jours.map(saisonDe)).size },
  { cle: "leve-tot", cat: "R", nom: "Lève-tôt", cond: "Jouer avant 7 h du matin", icone: "soleil", motif: "levetot", but: 1,
    mesure: () => suivi.leveTot ? 1 : 0 },
  { cle: "oiseau-de-nuit", cat: "R", nom: "Oiseau de nuit", cond: "Jouer après 23 h", icone: "lune", motif: "nuit", but: 1,
    mesure: () => suivi.nuit ? 1 : 0 },
  // Étape R269 (R1A) : « Champion du Duel » ne demande plus une série à la suite, mais des bonnes réponses sur une partie
  //   (3 vies) ; même clé (le badge déjà gagné reste) ; une série déjà faite compte (elle tenait dans une partie)
  { cle: "duel", cat: "R", nom: "Champion du Duel", cond: "Bonnes réponses sur une partie de Duel (Jeux)", icone: "portrait", motif: "duel", paliers: [10, 20, 30],
    mesure: () => Math.max(suivi.recordPartieDuel || 0, suivi.recordSerieDuel || 0) },
  // Étape R269 : les rendez-vous du jour (jamais d'affilée)
  { cle: "espece-du-jour", cat: "R", nom: "Espèce du jour", cond: "Retrouver l'espèce du jour, des jours différents (pas besoin d'affilée)", motif: "duJour", paliers: [7, 30, 100],
    mesure: () => { const j = new Set((suivi && suivi.joursDuJour) || []);
      if (suivi && suivi.duJour && suivi.duJour.date === aujourdhui() && suivi.duJour.faites.length) j.add(aujourdhui());   // aujourd'hui, déjà fait avant R269
      return j.size; } },
  { cle: "defis-jour", cat: "R", nom: "Défis du jour", cond: "Réussir des défis du jour", motif: "defisjour", paliers: [10, 50, 150],
    mesure: () => (suivi && suivi.defisReussis) || 0 },
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
// Étape R238 (note 3 du 15/11, choix 8A) : le palier d'un badge en points (« Étonnant ! ●○○ ») au lieu d'un chiffre romain
//   (« Étonnant ! I » se lisait mal) ; les paliers des badges sont déjà en points (B1).
function pointsPalier(b, palier) { const n = (b.paliers || []).length || 3; return "●".repeat(palier) + "○".repeat(Math.max(0, n - palier)); }
function nomBadge(b, palier = palierDe(b)) { return b.nom + (b.paliers && palier ? "\u00a0" + pointsPalier(b, palier) : ""); }
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
// Étape R262 (lenteurs) : la vérification silencieuse du chargement (tous les badges, donc toutes les expéditions et toutes
//   les espèces) ne bloque plus l'ouverture du jeu : elle est faite juste après, pendant que le joueur lit l'accueil
//   (13_demarrage.js). Si une vérification « avec vignette » arrive avant, la silencieuse passe d'abord : un badge déjà
//   mérité n'est jamais fêté comme nouveau.
let badgesInitiaux = false;
function verifierBadges(annoncer = true) {
  if (!annoncer) badgesInitiaux = true;
  else if (!badgesInitiaux) verifierBadges(false);
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
  feter({ etiquette: "Nouveau rang du carnet", titre: r.nom, son: "badge",
          taille: "grande", photo: typeof photoFeteTerritoire === "function" ? photoFeteTerritoire(territoireActif()) : "",   // R277 (37.02) : plein écran sur la photo du territoire
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
  const pop = { couleur: "#1f3a2e", image: dessinBadge(b, palier), etiquette: "Nouveau badge",
                titre: nomBadge(b, palier), detail: b.cond };
  feter({ etiquette: "Nouveau badge", titre: pop.titre, detail: pop.detail, son: "badge", pop, taille: "petite",   // R277 (37.02) : un bandeau
          souvenir: { titre: pop.titre, image: dessinBadge(b, palier) },   // R153
          visuel: `<div class="fete-visuel badge-b1">${dessinBadge(b, palier)}</div>` });   // étape B1
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
  suivi.heures = suivi.heures || {};                   // étape R183 : « votre heure » dans le Profil
  suivi.heures[momentDe(heure)] = (suivi.heures[momentDe(heure)] || 0) + 1;
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
    + `${dessinBadge(b)}<span class="nom">${court === true && b.court ? b.court + (b.paliers && palier ? "\u00a0" + pointsPalier(b, palier) : "") : nomBadge(b)}</span>${jauge}</button>`;
}
// Le détail d'un badge : sa condition, où l'on en est, et « Porter le titre » s'il en a un
function htmlBadgeDetail(b) {
  const palier = palierDe(b), seuil = prochainSeuil(b), mesure = b.mesure();
  const ou = seuil === null ? (b.paliers ? "Tous les paliers sont obtenus." : "Obtenu.")
    : `${b.paliers && palier ? `Palier ${pointsPalier(b, palier)} obtenu · prochain palier : ` : ""}${Math.min(mesure, seuil)} / ${seuil}${b.unite || ""}`;
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
  // R275 (43.07) : la mesure d'un badge était recalculée à chaque comparaison du tri (des dizaines de fois) : une seule fois par page
  const memoAvance = new Map();
  const avance = b => { if (!memoAvance.has(b.cle)) { const s = prochainSeuil(b); memoAvance.set(b.cle, s === null ? 1 : b.mesure() / s); } return memoAvance.get(b.cle); };
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
        <div class="rang">Rang du carnet : ${rc.nom}</div>
        <div class="pg-rang-carnet"><i class="jauge-jeu"><b style="width:${Math.round(100 * rc.part)}%"></b></i>
          <small>Carnet : ${nombre(rc.n)} espèces${rc.suivant ? ` · prochain rang : ${rc.suivant.nom}, à ${nombre(rc.suivant.seuil)}` : " · toutes les espèces du jeu !"}</small></div>
        <small>${(() => { const m = [0, 0, 0, 0]; for (const e of ESPECES.filter(estReconnue)) m[niveauTermine(e)]++;
          return `Vos espèces : ${m[3]} familière${m[3] > 1 ? "s" : ""} · ${m[2]} comprise${m[2] > 1 ? "s" : ""} · ${m[1]} reconnue${m[1] > 1 ? "s" : ""}`; })()}</small>
      </div>
      <div class="pg-favori">
        <p class="pg-petit-titre">Espèce favorite</p>
        ${favorite()
          ? `<button class="pg-favori-carte" id="pg-favori" title="Ouvrir sa page" style="--couleur-classe:${classeDe(favorite()).couleur}"><span class="ph">${celluleImage(favorite(), true)}</span><span>${favorite().nom_courant}<small>${classeDe(favorite()).nom}</small></span></button>`
          : `<small>À choisir depuis la page d'une espèce de votre carnet.</small><br><button class="porter" id="pg-favori-choisir">Ouvrir l'encyclopédie</button>`}
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
        <p class="pg-carte-aide">${t ? `<button class="pg-lien" id="pg-toute-france">← Tous les territoires</button>` : "Sélectionnez un territoire pour voir sa part."}</p>
      </div>
      <div>
        <div class="pg-chiffres">
          <div class="pg-encart"><b>${especesT.filter(estReconnue).length}</b><span>espèces dans votre carnet, sur ${especesT.length}</span></div>
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
  // Étape R183 (maquette G) : la vitrine remplace la carte de naturaliste et l'ancien profil A ; familles et records restent repliés en bas
  const plisBas = `<div class="pg-a pgv-plis"><details class="pg-encart pg-a-pli"${ongletProfil === "familles" ? " open" : ""}><summary>Vos familles</summary><div class="pg-tuiles" id="tuiles-progression"></div></details>
      <details class="pg-encart pg-a-pli"><summary>Jeux et records</summary>${panneauJeux}</details></div>`;
  // Étape R248 (36.01, choix 1A ; « Vos familles » retiré, choix B du 17/11) : plus de plis en bas — les familles sont dans
  //   l'Encyclopédie, les records sous chaque jeu (onglet Jeux), Réglages et à propos derrière la roue dentée en haut à droite.
  const corpsProfil = telA && ongletProfil !== "badges" ? profilVitrine(rc)
    : telA ? `<button type="button" class="pg-lien pg-a-retour" data-onglet-profil="ensemble">← Votre profil</button><div class="pg-panneau">${panneauBadges}</div>`
    : barreOnglets + `<div class="pg-panneau">${panneau}</div>`;
  document.getElementById("vue-progression").innerHTML = (telA ? "" : enTeteProfil) + corpsProfil;   // R248 : la roue dentée remplace « Réglages et à propos » du bas (M6)
  brancherPrenom();   // étape M6
  brancherVitrine();  // étape R183

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
    tuile.title = `${CLASSES[cle].nom} : ${f.especesId} / ${f.nb} espèces dans votre carnet, ${f.medailles} palier${f.medailles > 1 ? "s" : ""} d'espèce (${Math.round(f.part * 100)} %)`
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
  const avatar = e ? imgMini(photoEsp(e), "Votre espèce favorite : " + e.nom_courant)   // étape R262 : la miniature suffit (cadre de 78 px)
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

// ==================================================================
// Étape R183 (10/11/2026, maquette G « La vitrine et vos chiffres », choix d'Aubin) : le nouveau Profil.
// En tête : l'espèce favorite, sinon la DERNIÈRE ESPÈCE RENCONTRÉE (plus de « ? ») ; puis la vitrine des badges
// (médaillons avec une photo liée au badge), « Presque à vous », « Vos chiffres » (jamais de pourcentage : séries,
// parties, photos reconnues du premier coup, expéditions finies ; une case à zéro ne s'affiche pas), « Ce que disent
// vos chiffres » (territoire de cœur, famille de cœur, votre coriace, votre heure), « Vos contributions » (0 pour
// l'instant : la fonction viendra), les dernières rencontres, et en bas les familles et les records, repliés.
// ==================================================================
const decouverte = e => (progression[e.nom_courant] && progression[e.nom_courant].decouverteLe) || 0;
function especesRencontrees() {           // les espèces du carnet avec une photo, de la plus récente à la plus ancienne
  return ESPECES.filter(e => estReconnue(e) && estRenseigne(e.photo)).sort((a, b) => decouverte(b) - decouverte(a));
}
function derniereRencontree() { const l = especesRencontrees(); return l.length && decouverte(l[0]) ? l[0] : (l[0] || null); }
// L'espèce qui a le plus résisté : le plus d'erreurs, toutes questions confondues (suivi.echecs, depuis l'étape 106)
function especeCoriace() {
  const parEspece = {};
  for (const [cle, n] of Object.entries(suivi.echecs || {})) { const nom = cle.split("|")[0]; parEspece[nom] = (parEspece[nom] || 0) + n; }
  let meilleure = null, max = 1;   // au moins 2 erreurs pour en parler
  for (const e of ESPECES) if (estReconnue(e) && estRenseigne(e.photo) && (parEspece[e.nom_courant] || 0) > max) { max = parEspece[e.nom_courant]; meilleure = e; }
  return meilleure ? { e: meilleure, n: max } : null;
}
// Le territoire de cœur : celui qui a le plus d'empreintes ; et son lieu le plus joué (le plus d'empreintes d'expédition)
function territoireDeCoeur() {
  let t = null, max = 0;
  for (const x of tousLesTerritoires()) { const n = empreintesTerritoire(x); if (n > max) { max = n; t = x; } }
  if (!t) return null;
  let lieu = null, mieux = 0;
  for (const c of lieuxDe(t)) { const n = expeditionsDe(t).filter(x => x.chapitre === c.nom).reduce((s, x) => s + gainExp(x), 0); if (n > mieux) { mieux = n; lieu = c; } }
  return { t, n: max, lieu };
}
// L'heure de jeu : compteur par moment de la journée (suivi.heures, rempli par noterPartie depuis R183)
const MOMENTS = [["matin", "le matin"], ["apresmidi", "l'après-midi"], ["soir", "le soir"], ["nuit", "la nuit"]];
function momentDe(h) { return h >= 5 && h < 12 ? "matin" : h >= 12 && h < 18 ? "apresmidi" : h >= 18 && h < 23 ? "soir" : "nuit"; }
function votreHeure() {
  const c = suivi.heures || {}, total = Object.values(c).reduce((s, n) => s + n, 0);
  if (total < 5) return null;   // trop tôt pour en dire quelque chose
  const [cle, texte] = MOMENTS.reduce((a, m) => (c[m[0]] || 0) > (c[a[0]] || 0) ? m : a);
  return { cle, texte };
}
function medaillonBadge(b, petit) {           // étape B1 : le dessin du badge, toujours le même (plus de photo du carnet)
  return `<span class="pgv-med mb-vitrine${petit ? " petit" : ""}">${dessinBadge(b)}</span>`;
}
// Le badge le plus proche : la plus grande part du chemin déjà faite vers son prochain seuil
function badgePresque() {
  let meilleur = null;
  for (const b of tousLesBadges()) {
    const seuil = prochainSeuil(b); if (seuil == null) continue;
    const m = b.mesure(), palier = palierDe(b), depart = b.paliers && palier ? b.paliers[palier - 1] : 0;
    const part = Math.max(0, Math.min(0.99, (m - depart) / Math.max(1, seuil - depart)));
    if (m > depart && (!meilleur || part > meilleur.part)) meilleur = { b, part, reste: seuil - m, palier: palier + 1 };
  }
  return meilleur;
}
// Étape R238 (note 3 du 15/11, choix « 5A · 6B · 7B · 8A ») : les pictos des chiffres et des préférences du Profil (traits fins)
const PICTOS_PROFIL = {
  serie: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 3L5 13H11L10 21L19 10H13Z" fill="#A8652A"/></svg>',
  partie: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18C7 16 9 13 12 13S17 16 20 18" fill="none" stroke="#1F3A2E" stroke-width="2" stroke-linecap="round"/><path d="M12 13V5L17 7.5L12 10" fill="#1F3A2E"/></svg>',
  oeil: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" fill="none" stroke="#1F3A2E" stroke-width="1.8"/><circle cx="12" cy="12" r="3" fill="#1F3A2E"/></svg>',
  expedition: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4C6 4 5 6 5 8S7 12 8 12 11 10 11 8 10 4 8 4ZM16 10C14 10 13 12 13 14S15 18 16 18 19 16 19 14 18 10 16 10Z" fill="#8A4F1C"/></svg>',
  coeur: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20S3 14 3 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 9 2.5C21 14 12 20 12 20Z" fill="#b5442e"/></svg>',
  famille: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19C5 10 11 4 20 4C20 13 14 19 5 19Z" fill="#3E7B55"/><path d="M5 19L14 10" stroke="#FBF8F1" stroke-width="1.6"/></svg>',
  coriace: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18L12 4L20 18Z" fill="none" stroke="#A8652A" stroke-width="2" stroke-linejoin="round"/><path d="M12 9V13M12 15.5V16" stroke="#A8652A" stroke-width="2" stroke-linecap="round"/></svg>',
  lune: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 3.5a8.5 8.5 0 1 0 5 14 6.5 6.5 0 0 1-5-14Z" fill="#5b6a8a"/></svg>',   // R239 (36.01) : le soir et la nuit
  contrib: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 21V4M6 4h10l-2 3.5 2 3.5H6" fill="none" stroke="#8a4f1c" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',   // R248 (36.01) ; CT1 : le drapeau « Signaler »
  heure: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="#d9a12b"/><path d="M12 2.5V5M12 19V21.5M2.5 12H5M19 12H21.5M5.3 5.3L7 7M17 17L18.7 18.7M5.3 18.7L7 17M17 7L18.7 5.3" stroke="#d9a12b" stroke-width="1.8" stroke-linecap="round"/></svg>',
};
function profilVitrine(rc) {
  const fav = favorite(), derniere = derniereRencontree(), portrait = fav || derniere;
  const t = territoireActif(), rangT = t && typeof rangTerritoire === "function" ? rangTerritoire(t) : null;
  const p = prenomJoueur();
  const badges = tousLesBadges(), obtenus = badges.filter(b => palierDe(b) > 0);
  const recents = (suivi.derniersBadges || []).slice().reverse();
  obtenus.sort((a, b) => { const ia = recents.indexOf(a.cle), ib = recents.indexOf(b.cle); return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib); });
  const presque = badgePresque();
  // Les chiffres (une case à zéro n'est pas montrée)
  const chiffres = [
    [suivi.meilleureSerie || 0, "bonne" + ((suivi.meilleureSerie || 0) > 1 ? "s" : "") + " réponse" + ((suivi.meilleureSerie || 0) > 1 ? "s" : "") + " de suite", "votre record", PICTOS_PROFIL.serie],
    [suivi.parties || 0, "partie" + ((suivi.parties || 0) > 1 ? "s" : "") + " jouée" + ((suivi.parties || 0) > 1 ? "s" : ""), `en ${suivi.jours.length} jour${suivi.jours.length > 1 ? "s" : ""}`, PICTOS_PROFIL.partie],
    [suivi.coupsDoeil || 0, "photo" + ((suivi.coupsDoeil || 0) > 1 ? "s" : "") + " reconnue" + ((suivi.coupsDoeil || 0) > 1 ? "s" : ""), "du premier coup", PICTOS_PROFIL.oeil],
    [nbFinies(), "expédition" + (nbFinies() > 1 ? "s" : "") + " finie" + (nbFinies() > 1 ? "s" : ""), "", PICTOS_PROFIL.expedition],
  ].filter(c => c[0] > 0);
  const coeurT = territoireDeCoeur(), coeurF = familleDeCoeur(), coriace = especeCoriace(), heure = votreHeure();
  const meilleureDe = cle => especesRencontrees().filter(e => e.onglet === cle).sort((a, b) => niveauTermine(b) - niveauTermine(a))[0];
  // Étape R238 (note 3, choix 6B) : une étiquette colorée avec son picto dit la nature de l'info, puis le nom, puis le détail
  const ligneDit = (img, etiq, titre, detail, attr = "") => `<li${attr}${attr ? ` class="pgv-touche" role="button" tabindex="0"` : ""}>${img}<span class="pgv-dit-t">${etiq}<b>${titre}</b>${detail ? `<small>${detail}</small>` : ""}</span>${attr ? `<span class="pgv-fleche" aria-hidden="true">›</span>` : ""}</li>`;   // R239 (36.27) : « › » sur les lignes qui s'ouvrent
  const etiq = (cle, texte, picto) => `<span class="pgv-chip pgv-chip-${cle}">${PICTOS_PROFIL[picto || cle] || ""}${texte}</span>`;
  const vignette = src => src ? `<img class="pgv-vign" src="${src}" alt="">` : `<span class="pgv-vign"></span>`;
  const dits = [
    coeurT ? ligneDit(vignette(coeurT.lieu && estRenseigne(coeurT.lieu.photo) ? photoMini(coeurT.lieu.photo) : null), etiq("coeur", "Territoire de cœur"), echapper(coeurT.t), coeurT.lieu ? `${echapper(coeurT.lieu.nom)}, votre lieu le plus joué` : "", ` data-territoire-coeur="${echapper(coeurT.t)}"`) : "",
    coeurF ? ligneDit(vignette(meilleureDe(coeurF.cle) ? photoMini(meilleureDe(coeurF.cle).photo) : null), etiq("famille", "Famille de cœur"), echapper(CLASSES[coeurF.cle].nom), `${coeurF.n} espèce${coeurF.n > 1 ? "s" : ""} au carnet, plus que toute autre famille`, ` data-famille-coeur="${echapper(coeurF.cle)}"`) : "",
    coriace ? ligneDit(vignette(photoMini(coriace.e.photo)), etiq("coriace", "Votre coriace"), echapper(coriace.e.nom_courant), `${pe(coriace.e).elle} vous a résisté ${coriace.n} fois`, ` data-espece="${echapper(coriace.e.nom_courant)}"`) : "",
    heure ? ligneDit(`<span class="pgv-vign pgv-heure ${heure.cle}" aria-hidden="true"></span>`, etiq("heure", "Votre heure", /soir|nuit/.test(heure.cle) ? "lune" : "heure"), echapper(majuscule(heure.texte)), "") : "",
  ].filter(Boolean);
  const rencontres = especesRencontrees().filter(e => decouverte(e)).slice(0, 5);
  return `<div class="pgv">
    <section class="pgv-tete">
      <button type="button" class="pgv-roue" id="pg-apropos" aria-label="Réglages et à propos" title="Réglages et à propos"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.08 9.86 L21.39 10.02 L21.39 13.98 L19.08 14.14 L18.55 15.44 L18.52 15.49 L20.04 17.25 L17.25 20.04 L15.49 18.52 L14.20 19.07 L14.14 19.08 L13.98 21.39 L10.02 21.39 L9.86 19.08 L8.56 18.55 L8.51 18.52 L6.75 20.04 L3.96 17.25 L5.48 15.49 L4.93 14.20 L4.92 14.14 L2.61 13.98 L2.61 10.02 L4.92 9.86 L5.45 8.56 L5.48 8.51 L3.96 6.75 L6.75 3.96 L8.51 5.48 L9.80 4.93 L9.86 4.92 L10.02 2.61 L13.98 2.61 L14.14 4.92 L15.44 5.45 L15.49 5.48 L17.25 3.96 L20.04 6.75 L18.52 8.51 L19.07 9.80Z" stroke-linejoin="round"/><circle cx="12" cy="12" r="3"/></svg></button>
      <button type="button" class="pgv-portrait" id="pg-avatar" title="${portrait ? `Ouvrir la page : ${echapper(portrait.nom_courant)}` : "Ouvrir l'encyclopédie"}">${portrait ? `<img src="${photoMini(portrait.photo)}" alt="${echapper(portrait.nom_courant)}">` : `<svg viewBox="0 0 26 26" aria-hidden="true" class="pgv-logo"><circle cx="6" cy="6" r="3.4"/><circle cx="15" cy="4.5" r="2.6"/><circle cx="22" cy="10" r="2.4"/><circle cx="11" cy="13" r="2.2" class="o"/><circle cx="5" cy="19" r="3.4"/><circle cx="15" cy="21" r="3"/></svg>`}</button>
      <div class="pgv-qui">
        ${prenomEnEdition ? blocPrenom("pg-cn-prenom") : `<span class="pgv-nom">${p ? echapper(p) : "Naturaliste"}</span>`}
        <span class="pgv-rang">${rc.nom}${rangT ? ` · ${rangT.nom} ${deTerritoire(t)}` : ""}</span>
        ${fav ? `<span class="pgv-sous">Espèce favorite : ${echapper(minuscule(fav.nom_courant))}</span>` : derniere ? `<span class="pgv-sous">Dernière rencontre : ${echapper(minuscule(derniere.nom_courant))}</span>` : ""}
      </div>
    </section>
    <section class="pgv-vitrine">
      <div class="pgv-ligne"><h2>Vos badges</h2><button type="button" class="pgv-lien" data-onglet-profil="badges">${obtenus.length ? `${obtenus.length} sur ${badges.length}` : `Les ${badges.length} badges`} →</button></div>
      ${obtenus.length ? `<div class="pgv-grille">${obtenus.slice(0, 6).map(b => `<button type="button" class="pgv-badge" data-badge-vitrine="${b.cle}">${medaillonBadge(b)}<span>${nomBadge(b)}</span></button>`).join("")}</div>`
        : `<p class="pgv-vide">Le premier badge arrive vite : une expédition terminée suffit.</p>`}
      ${presque ? `<button type="button" class="pgv-presque" data-badge-vitrine="${presque.b.cle}">
          <span class="pgv-anneau" style="--part:${Math.round(presque.part * 100)}%">${medaillonBadge(presque.b, true)}</span>
          <span class="pgv-presque-t"><small>Presque à vous</small><b>${nomBadge(presque.b, presque.palier)}</b> · encore ${nombre(presque.reste)}</span>
          <span class="pgv-voir" aria-hidden="true">Voir</span></button>` : ""}
    </section>
    <section class="pgv-bloc"><h2>Vos chiffres</h2>${!chiffres.length && !((suivi.signalements || 0) > 0)
      ? `<p class="pgv-chiffres-attente">Vos chiffres se rempliront dès votre première partie.</p></section>`   /* R275 (43.03, choix 3B du 20/11) : plus jamais de titre nu */
      : `<ul class="pgv-chiffres-lignes">${chiffres.map(c => `<li><span class="pgv-ch-ic">${c[3]}</span><b>${nombre(c[0])}</b><span>${c[1]}${c[2] ? ` <small>· ${c[2]}</small>` : ""}</span></li>`).join("")}
      ${(suivi.signalements || 0) > 0 ? `<li class="pgv-contrib-ligne"><span class="pgv-ch-ic">${PICTOS_PROFIL.contrib}</span><b>${nombre(suivi.signalements)}</b><span>signalement${suivi.signalements > 1 ? "s" : ""} envoyé${suivi.signalements > 1 ? "s" : ""} <small>· merci</small></span></li>` : ""}</ul></section>`}${/* étape CT1 (5A) : la ligne n'apparaît qu'au premier signalement envoyé */ ""}
    ${dits.length ? `<section class="pgv-bloc"><h2>Vos préférences</h2><div class="pgv-encart"><ul class="pgv-dits">${dits.join("")}</ul></div></section>` : ""}
    ${rencontres.length ? `<section class="pgv-bloc"><h2>Vos dernières rencontres</h2><div class="pgv-rencontres">${rencontres.map(e => `<button type="button" data-espece="${echapper(e.nom_courant)}" title="${echapper(e.nom_courant)}"><img src="${photoMini(e.photo)}" alt="${echapper(e.nom_courant)}"></button>`).join("")}</div></section>` : ""}
  </div>`;
}
function brancherVitrine() {
  const vue = document.getElementById("vue-progression");
  if (!vue) return;
  vue.querySelectorAll("[data-badge-vitrine]").forEach(b => b.onclick = () => {
    badgeOuvert = b.dataset.badgeVitrine; ongletProfil = "badges"; filtreBadges = "tous"; afficherPageProgression(); window.scrollTo(0, 0);
  });
  vue.querySelectorAll(".pgv [data-espece]").forEach(b => b.onclick = () => { const e = ESPECES.find(x => x.nom_courant === b.dataset.espece); if (e) ouvrirPageEspece(e); });
  // R239 (36.27) : le territoire de cœur ouvre sa page (onglet Carte), la famille de cœur l'Encyclopédie sur cette famille
  vue.querySelectorAll(".pgv [data-territoire-coeur]").forEach(b => b.onclick = () => { if (typeof ouvrirAtlas === "function") ouvrirAtlas(b.dataset.territoireCoeur); else montrer("accueil"); window.scrollTo(0, 0); });
  vue.querySelectorAll(".pgv [data-famille-coeur]").forEach(b => b.onclick = () => { filtreClasse = b.dataset.familleCoeur; montrer("encyclopedie"); window.scrollTo(0, 0); });
  vue.querySelectorAll(".pgv .pgv-touche").forEach(b => b.onkeydown = ev => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); b.click(); } });
  const av = document.getElementById("pg-avatar");
  if (av) av.onclick = () => { const e = favorite() || derniereRencontree(); if (e) ouvrirPageEspece(e); else montrer("encyclopedie"); };
}
