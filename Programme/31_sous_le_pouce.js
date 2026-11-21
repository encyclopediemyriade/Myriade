// 31_sous_le_pouce.js — Étape R265 (19/11, session S3 des retours du 18/11 ; choix d'Aubin du 19/11 « 2A » et « 6A »)
// Une partie du programme du jeu, chargée par jeu.html dans l'ordre (après 30_signaler.js).
//
// 1. « Tout sous le pouce » (Notion 40.03, choix 2A) : sur téléphone, dans tous les écrans de questions, la photo et
//    la question restent en haut ; les réponses sont calées EN BAS, juste au-dessus du bouton fixé, pour que le pouce
//    ne fasse plus tout l'écran entre la réponse et « Question suivante ». La ligne qui suit la réponse s'écrit
//    JUSTE AU-DESSUS des réponses, dans la place libre : les réponses ne bougent pas quand elle apparaît.
//    Comment : calerSousPouce(premier, dernier, reserve) donne au premier élément du bloc du bas (la ligne de retour)
//    la marge qu'il faut pour que le bas du dernier (les réponses) tombe à « reserve » pixels du bas de l'écran.
//    La marge se recalcule toute seule quand le bloc change de taille, quand une photo arrive, quand l'écran tourne.
//    Sur ordinateur (plus de 760 px de large), rien ne change.
//
// 2. Après chaque réponse (Notion 40.12, choix 6A) : plus de fenêtre « Le saviez-vous ? ». Tout de suite, juste ou
//    faux, une ligne « Oui » / « C'était l'autre » (deux choix) / « Pas cette fois » (plus de deux choix), suivie de la
//    phrase qui dit la réponse, puis un complément : une autre case de sa fiche qui va avec la question (ce qu'il mange
//    après son régime, sa couvée après son nid…), jamais une case qui sera demandée plus loin dans la même partie,
//    jamais deux fois la même ; sinon rien.
// ==================================================================

const SOUS_LE_POUCE = true;          // false = les réponses restent sous la question, comme avant R265
const RESERVE_POUCE = { rencontre: 100, jeu: 100 };   // R275 (43.05) : dans les jeux aussi, la barre du bas est cachée pendant qu'on joue (150 avant)
// Étape R275 (43.07, lenteurs) : « window.innerWidth » obligeait le navigateur à recalculer toute la mise en page à chaque appel
//   (jusqu'à 10 ms par question, bien plus sur téléphone) ; la question « écran de 760 px ou moins ? » est gardée par le navigateur.
function surTelephone() { return ECRAN_TELEPHONE.matches; }

// ---- 1. Caler les réponses en bas ----
const calagesPouce = new Set();
const observateurPouce = typeof ResizeObserver === "function" ? new ResizeObserver(() => recalerPouce()) : null;
// reponses : le bloc des réponses (par défaut, le dernier) ; quand la ligne de retour est trop longue pour la place libre
//   (une erreur expliquée côte à côte, la carte « Bravo ! »…), elle passe SOUS les réponses, qui ne bougent pas, et la page
//   descend doucement jusqu'à elle : ce qui est long se lit en dessous, ce qui est court s'écrit au-dessus.
function calerSousPouce(premier, dernier, reserve, reponses) {
  if (!premier || !dernier) return;
  const rep = reponses || dernier;
  if (premier._pouce && premier._pouce.dessous && premier.nextElementSibling !== rep) rep.before(premier);   // nouvelle question : la ligne remonte
  rep.style.marginTop = "";
  premier._pouce = { dernier, reserve, reponses: rep, dessous: false, margeVide: null };
  calagesPouce.add(premier);
  if (observateurPouce) { observateurPouce.observe(premier); observateurPouce.observe(dernier); }
  recalerUn(premier);
}
function decalerPouce(premier) {   // le bloc n'est plus à caler (écran de lecture, annonce…)
  if (!premier) return;
  if (premier._pouce && premier._pouce.reponses) premier._pouce.reponses.style.marginTop = "";
  if (premier._pouce && premier._pouce.dessous && premier.isConnected) { premier._pouce.reponses.before(premier); premier.classList.remove("pouce-dessous"); }
  premier._pouce = null;
  calagesPouce.delete(premier);
  premier.style.marginTop = "";
  if (observateurPouce) observateurPouce.unobserve(premier);
}
// Étape R275 (20/11, Notion 43.01, choix 1C d'Aubin ; ajuste 2A du 19/11) : avec 2 ou 3 réponses écrites, elles restent en bas
//   mais l'une sous l'autre, en cases plus hautes : le vide entre la question et les réponses est réduit (il ne garde que
//   la place de la ligne qui suit la réponse). Rien ne change à partir de 4 réponses, ni pour les réponses en photos.
//   Critère : « les réponses restent faciles à toucher du pouce, et l'écran ne montre jamais un grand vide ».
const PEU_DE_REPONSES = { min: 46, bas: 60, haut: 96, place: 64 };   // hauteur d'une case (de… à…) ; place gardée pour la ligne de retour
function boutonsPeuDeReponses(rep) {
  if (!rep || !rep.children) return null;
  const visibles = [...rep.children].filter(x => x.getClientRects().length);
  const b = visibles.filter(x => x.matches("button.reponse, button.cdo-nom"));
  const ok = surTelephone() && (b.length === 2 || b.length === 3) && b.length === visibles.length
    && !rep.querySelector("audio, canvas, .choix-photo:not(.choix-picto), .anneau-ecoute") && !b.some(x => x.querySelector("img, svg") && !x.classList.contains("choix-picto"))
    && !/duo-cris|empreintes-duo|cases-a-cocher|forme-|annonce-etape|paysages|deux-photos|duo-exp/.test(rep.className)
    && (!/grille-photos/.test(rep.className) || b.every(x => x.classList.contains("choix-picto")));   // les réponses à pictogramme (une couleur, un bec…) comptent ; pas les photos, les cris, les empreintes
  rep.classList.toggle("peu-de-reponses", ok);
  if (!ok) rep.style.removeProperty("--h-rep");
  return ok ? b : null;
}
function recalerUn(premier) {
  const c = premier._pouce;
  if (!c || !premier.isConnected || !c.dernier.isConnected) { calagesPouce.delete(premier); return; }
  if (!SOUS_LE_POUCE || !surTelephone() || !c.dernier.getClientRects().length) { premier.style.marginTop = ""; c.reponses.style.marginTop = ""; boutonsPeuDeReponses(c.reponses); return; }
  if (c.dessous) return;                                 // la ligne est déjà sous les réponses : rien ne bouge plus
  premier.style.marginTop = "0px";
  const vide = !premier.textContent.trim() && !premier.querySelector("img, svg");
  const peu = boutonsPeuDeReponses(c.reponses);
  if (peu && vide) {                                     // la hauteur des cases se règle avant la réponse, puis ne bouge plus
    c.reponses.style.setProperty("--h-rep", PEU_DE_REPONSES.bas + "px");
    const libre = Math.floor(window.innerHeight - c.reserve - (c.dernier.getBoundingClientRect().bottom + window.scrollY));
    const h = Math.max(PEU_DE_REPONSES.bas, Math.min(PEU_DE_REPONSES.haut, PEU_DE_REPONSES.bas + Math.floor((libre - PEU_DE_REPONSES.place) / peu.length)));
    c.reponses.style.setProperty("--h-rep", h + "px");
    c.hRep = h;
  }
  const mesurer = () => Math.floor(window.innerHeight - c.reserve - (c.dernier.getBoundingClientRect().bottom + window.scrollY));
  let ecart = mesurer();
  // la ligne qui suit la réponse ne tient pas dans la place gardée : les cases hautes lui en rendent (leur bas ne bouge pas)
  if (peu && !vide && ecart < 0 && c.hRep > PEU_DE_REPONSES.min) {
    const avant = c.hRep, ecartAvant = ecart;
    c.hRep = Math.max(PEU_DE_REPONSES.min, c.hRep + Math.floor(ecart / peu.length));
    c.reponses.style.setProperty("--h-rep", c.hRep + "px");
    ecart = mesurer();
    if (ecart < 0) { c.hRep = avant; c.reponses.style.setProperty("--h-rep", avant + "px"); ecart = ecartAvant; }   // trop longue quand même : elle passera dessous, les cases ne bougent pas
  }
  if (vide || c.margeVide === null) c.margeVide = Math.max(0, ecart);
  if (ecart >= 0 || vide) { premier.style.marginTop = ecart > 0 ? ecart + "px" : ""; return; }
  // Trop long pour la place libre : la ligne passe sous les réponses, qui gardent leur place
  c.dessous = true;
  premier.style.marginTop = "";
  c.reponses.style.marginTop = c.margeVide ? c.margeVide + "px" : "";
  const apres = c.dernier !== c.reponses && c.dernier.previousElementSibling === c.reponses ? c.reponses : c.dernier;
  apres.after(premier);
  premier.classList.add("pouce-dessous");
  descendreVersVerdict(premier, window.innerHeight - c.reserve + 8);   // R280 (44.01) : un seul mouvement, doux
}
// ==================================================================
// Étape R280 (21/11/2026, 44.01, note 1 du 20/11 au soir : « ça descend vers la caractéristique… par à-coup, pas très élégant »).
//   Critère : « Après une réponse, la page ne bouge qu'une fois, doucement, et le verdict reste sous les yeux. »
//   Avant : deux défilements l'un derrière l'autre (ici, puis 0,35 s plus tard dans 09_rencontre.js), tous deux « jusqu'au bas de
//   l'explication » ; or l'explication contient maintenant toute la carte d'identité (plus de 700 px) : la page descendait de
//   680 px en un tiers de seconde et le verdict finissait caché sous la photo collée en haut.
//   Maintenant : UN mouvement, lent (0,45 à 0,75 s), qui amène le verdict juste sous la photo ; la carte se lit ensuite en
//   faisant défiler soi-même. Rien ne bouge si le verdict est déjà visible en entier. Un toucher arrête le mouvement.
//   La position visée est relue à chaque image : si une photo arrive en retard et change la hauteur de la page, le mouvement
//   suit sans à-coup.
// ==================================================================
let descenteVerdict = null;
function basDeLaPhotoCollee() {
  const ph = document.getElementById("photo-rencontre");
  if (!ph || !ph.getClientRects().length || !/sticky|fixed/.test(getComputedStyle(ph).position)) return 0;
  const hautColle = parseFloat(getComputedStyle(ph).top) || 0;
  return Math.min(hautColle + ph.getBoundingClientRect().height, window.innerHeight * 0.5);
}
function descendreVersVerdict(zone, limiteBas) {
  if (!zone || !zone.getClientRects().length) return;
  if (descenteVerdict) return;                            // un mouvement est déjà en cours : il suit la page, pas besoin d'un second
  const verdict = zone.querySelector(".verdict") || zone;
  const libre = () => basDeLaPhotoCollee() + 10;          // le haut de la place libre, sous la photo collée
  const r = verdict.getBoundingClientRect();
  const bas = Math.min(r.bottom, r.top + 120);            // d'un long texte sans verdict, les premières lignes suffisent
  if (r.top >= libre() - 6 && bas <= (limiteBas || window.innerHeight) + 0.5) return;   // déjà sous les yeux
  const depart = window.scrollY, t0 = performance.now();
  const voulu = () => Math.min(verdict.getBoundingClientRect().top + window.scrollY - libre(), document.documentElement.scrollHeight - window.innerHeight);
  const dy0 = voulu() - depart;
  if (dy0 <= 4) return;                                   // la page ne remonte jamais toute seule
  if (typeof animationsReduites === "function" && animationsReduites()) { window.scrollTo(0, voulu()); return; }
  const duree = Math.max(450, Math.min(750, 350 + dy0 * 0.7));
  const arreter = () => { if (!descenteVerdict) return; cancelAnimationFrame(descenteVerdict.image); descenteVerdict = null;
    window.removeEventListener("touchstart", arreter, true); window.removeEventListener("wheel", arreter, true); };
  window.addEventListener("touchstart", arreter, { capture: true, passive: true });
  window.addEventListener("wheel", arreter, { capture: true, passive: true });
  const image = t => {
    if (!descenteVerdict) return;
    if (!verdict.isConnected || !verdict.getClientRects().length) { arreter(); return; }   // l'écran a changé entre-temps
    const p = Math.min(1, (t - t0) / duree), doux = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    window.scrollTo(0, depart + (voulu() - depart) * doux);
    if (p < 1) descenteVerdict.image = requestAnimationFrame(image); else arreter();
  };
  descenteVerdict = { image: requestAnimationFrame(image) };
}
function recalerPouceMaintenant() { for (const p of [...calagesPouce]) recalerUn(p); }
let recalagePrevu = false;
function recalerPouce() {
  if (recalagePrevu) return;
  recalagePrevu = true;
  requestAnimationFrame(() => { recalagePrevu = false; for (const p of [...calagesPouce]) recalerUn(p); });
}
window.addEventListener("resize", recalerPouce);
document.addEventListener("load", ev => { if (ev.target && ev.target.tagName === "IMG") recalerPouce(); }, true);

// 2 réponses par ligne dès 5 choix (les écrans qui empilent leurs réponses en une colonne)
function classeNombreChoix(n) { return n >= 5 ? " deux-par-ligne" : ""; }

// ---- 2. La ligne après la réponse ----
// juste : la réponse est juste ; deux : la question n'avait que deux choix (vrai ou faux, deux cartes, deux cris…)
// phrase : ce qui dit la réponse (rien quand elle est déjà écrite à l'écran) ; complement : la case de plus (texte simple)
function motVerdict(juste, deux) { return juste ? "Oui" : deux ? "C'était l'autre" : "Pas cette fois"; }
function verdictHtml({ juste, deux, phrase, complement, mot }) {
  const m = mot || motVerdict(juste, deux);
  const p = phrase ? String(phrase).trim() : "";
  // Étape R275 (42.02, choix 1A du 19/11 au soir) : après une bonne réponse, plus de pastille « Oui » — la réponse en vert
  //   suffit ; dessous, seulement la phrase (repère ou complément). Un mot donné exprès (« Validé · 2 sur 3 »…) reste.
  if (juste && !mot) return (p ? `<span class="verdict vd-ok vd-sans-mot"><span class="vd-phrase">${echapper(p)}</span></span>` : "")
    + (complement ? `<span class="vd-plus${p ? "" : " vd-seul"}">${echapper(complement)}</span>` : "");
  return `<span class="verdict ${juste ? "vd-ok" : "vd-ko"}"><b class="vd-mot">${echapper(m)}</b>${p ? `<span class="vd-phrase">${echapper(p)}</span>` : ""}</span>`
    + (complement ? `<span class="vd-plus">${echapper(complement)}</span>` : "");
}

// Les cases qui vont avec une question : la première renseignée (et pas réservée pour plus tard) sert de complément
const COMPLEMENTS = {
  // Étape R270 (test du 19/11, n° 24) : plus de « Il est actif surtout le jour. » après le régime ou les proies (sans rapport)
  regime_alimentaire_type: ["proies", "chasse_principale"],
  proies: ["chasse_principale"],
  type_proie_detaille: ["chasse_principale"],
  chasse_principale: ["proies", "activite"],
  predateurs: ["defense_principale", "technique_defense"],
  defense_principale: ["predateurs"],
  milieu_principal: ["altitude_max_m", "emplacement_nid", "saison_observation"],
  altitude_max_m: ["milieu_principal", "deplacement_saisonnier"],
  saison_observation: ["deplacement_saisonnier", "hibernation", "qi_hivernage"],
  deplacement_saisonnier: ["saison_observation", "hibernation"],
  hibernation: ["qi_hivernage", "saison_observation", "pelage_hiver"],
  qi_hivernage: ["saison_observation", "deplacement_saisonnier"],
  pelage_hiver: ["hibernation", "saison_observation"],
  activite: ["chasse_principale", "proies"],
  emplacement_nid: ["nb_petits_max", "incubation_jours", "saison_reproduction"],
  saison_reproduction: ["nb_petits_max", "emplacement_nid", "incubation_jours", "gestation_jours"],
  periode_reproduction_nom: ["saison_reproduction", "nb_petits_max"],
  nb_petits_max: ["incubation_jours", "gestation_jours", "emplacement_nid", "nom_petit"],
  nb_oeufs_ordre: ["saison_frai", "naissance"],
  incubation_jours: ["nb_petits_max", "nom_petit", "emplacement_nid"],
  gestation_jours: ["nb_petits_max", "nom_petit"],
  naissance: ["nb_petits_max", "nb_oeufs_ordre", "saison_reproduction"],
  nom_petit: ["nb_petits_max", "incubation_jours", "gestation_jours"],
  saison_frai: ["nb_oeufs_ordre", "vie_larve"],
  vie_larve: ["metamorphose", "saison_frai"],
  metamorphose: ["vie_larve"],
  longevite_max_annees: ["taille_max_cm", "poids_max_kg"],
  taille_max_cm: ["poids_max_kg", "envergure_max_cm"],
  poids_max_kg: ["taille_max_cm", "envergure_max_cm"],
  envergure_max_cm: ["taille_max_cm", "poids_max_kg"],
  vitesse_max_kmh: ["chasse_principale", "taille_max_cm"],
  nom_groupe: ["nom_logis"],
  nom_logis: ["emplacement_nid", "nom_groupe"],
  famille_animale: ["milieu_principal"],
  statut_conservation: ["tendance_france"],          // R268 : statut ↔ tendance, l'un complète l'autre
  tendance_france: ["statut_conservation"]
};
// Ce qui a déjà servi de complément dans la partie (jamais deux fois la même phrase) ; vidé à chaque nouvelle partie
const complementsVus = new Set();
function oublierComplements() { complementsVus.clear(); }
function caseSure(e, champ) {
  if (!e || !(champ in e) || (e.a_confirmer || []).includes(champ)) return false;
  const v = e[champ];
  return estRenseigne(v) && String(v).trim() !== "" && v !== "NA" && !String(v).startsWith("NA");
}
function phraseDeCase(e, champ) {
  const q = QUESTIONS.find(z => z.champ === champ);
  if (!q || (q.pour && !q.pour(e))) return "";
  let v, t = "";
  try { v = valeurDe(e, q); } catch (err) { return ""; }
  if (!estRenseigne(v) || v === "NA" || String(v).startsWith("NA")) return "";
  try {
    if (champ === "predateurs" && typeof affPredateurs === "function") t = affPredateurs(e.predateurs, e);
    if (!t && q.explication) t = q.explication(e, v);
  } catch (err) { t = ""; }
  return t ? accordGenre(String(t), e) : "";
}
// Un détail de son allure (colonne adaptations_physiques), sur une AUTRE partie du corps que la question
// (sur la même partie, il pourrait contredire la réponse : « bec rose » / « bec ivoire »)
// Étape R270 (test du 19/11, n° 24 : « Une grande tolérance au sel. », « La capacité de se passer d'eau. » après la couleur du
//   bec) : la colonne mêle ce qui se voit (un bec, une tache, des pattes…) et ce qui ne se voit pas (une ouïe fine, un vol,
//   une capacité, la chenille, le nid…). Après une question d'allure, seul ce qui se voit sur l'animal est ajouté.
const DETAIL_SE_VOIT = new RegExp("bec|huppe|crête|tête|corne|queue|oreille|patte|doigt|serre|corps|nageoire|épine|barbillon|antenne|aile|plumage|pelage|robe|tache|bande|rayure|"
  + "coquille|peau|pustule|pupille|yeux|museau|griffe|dent|incisive|canine|moustache|fourrure|poil|plume|écaille|carapace|gorge|ventre|dessous|dessus|langue|pince|"
  + "mandibule|trompe|collier|masque|sourcil|calotte|joue|sabot|piquant|tentacule|abdomen|élytre|mâchoire|bouche|lèvre|poitrine|croupion|front|nuque|flanc|pied|"
  + "couleur|ocelle|capuchon|rostre|croissant|reflet|marbrure|nervure|dard|aiguillon|narine|groin|(^|[^a-zà-ÿœ])(cou|dos|nez|bois|face|œil|oeil|ligne|barre|cercle)([^a-zà-ÿœ]|$)", "i");
const DETAIL_NE_SE_VOIT_PAS = new RegExp("capacit|tol[ée]rance|r[ée]sistance|r[ée]siste|supporte|vitesse|intelligence|m[ée]moire|ou[ïi]e|odorat|vision|venin|tambourinage|endurance|"
  + "souplesse|agilit|long[ée]vit|digest|m[ée]tabolisme|respir|temp[ée]rature|chaleur|[ée]cholocation|sommeil|flair|[ée]quilibre|orientation|plong[ée]e|apn[ée]e|"
  + "camouflage|mim[ée]tisme|hibernation|salive|mucus|toxi|poison|chenille|larve|colonie|toile|cocon|fiente|migration|reproduction|r[ée]gime|adulte|femelle|"
  + "(^|[^a-zà-ÿœ])(vue|vol|nage|sang|sens|cri|chant|odeur|course|saut|force|nid|œufs?|oeufs?|petits|mâle|vie|vit)([^a-zà-ÿœ]|$)", "i");
function detailSeVoit(t) { return DETAIL_SE_VOIT.test(t) && !DETAIL_NE_SE_VOIT_PAS.test(t); }
function detailAllure(e, champ) {
  if (!caseSure(e, "adaptations_physiques")) return "";
  const motif = typeof PARTIES_ADAPTATIONS !== "undefined" ? PARTIES_ADAPTATIONS[champ] : null;
  const vus = (typeof session !== "undefined" && session && session.detailsVus) || [];
  const c = String(e.adaptations_physiques).split(";").map(t => t.trim()).filter(Boolean)
    .find(t => detailSeVoit(t) && !vus.includes(t) && !complementsVus.has(e.nom_courant + "|" + t) && !(motif && motif.test(t.toLowerCase())));
  if (!c) return "";
  complementsVus.add(e.nom_courant + "|" + c);
  if (typeof session !== "undefined" && session) session.detailsVus = [...vus, c];
  return majuscule(c) + ".";
}
// exclus : les cases qui seront demandées plus loin dans la partie, ou qui viennent d'être lues à l'écran
function complementFiche(e, champ, exclus = []) {
  if (!e) return "";
  const q = QUESTIONS.find(z => z.champ === champ) || {};
  const allure = q.format === "picto" || (typeof PARTIES_ADAPTATIONS !== "undefined" && PARTIES_ADAPTATIONS[champ]);
  if (allure) return detailAllure(e, champ);
  const deja = phraseDeCase(e, champ).toLowerCase();
  for (const c of COMPLEMENTS[champ] || []) {
    const qc = QUESTIONS.find(z => z.champ === c);
    if (!qc || c === champ || exclus.includes(c) || (e.a_confirmer || []).includes(c)) continue;
    if (!qc.valeur && !caseSure(e, c)) continue;      // une case vide, rose ou « NA » ne sert jamais
    const t = phraseDeCase(e, c);
    if (!t || t.length > 170) continue;
    const cle = e.nom_courant + "|" + c;
    if (complementsVus.has(cle) || (deja && (deja.includes(t.toLowerCase()) || t.toLowerCase().includes(deja)))) continue;
    if (/toute l'année/i.test(deja) && /toute l'année/i.test(t)) continue;   // « On peut le croiser toute l'année » / « Il reste sur place toute l'année »
    complementsVus.add(cle);
    return t;
  }
  return "";
}

// ---- Les écrans des jeux (Me tester, Approfondir, Coup d'œil, À l'oreille) : même structure « cdo » ----
//   La ligne de retour (.cdo-retour, avec le bouton fixé) passe juste au-dessus des réponses ; les aides restent dessous.
function calerJeuSousPouce(zone, selecteur) {
  if (!zone) return;
  const choix = zone.querySelector(selecteur || ".cdo-noms, .dfx-photos, .ore-photos"), retour = zone.querySelector(".cdo-retour");
  if (!choix || !retour) return;
  if (!SOUS_LE_POUCE || !surTelephone()) return;
  choix.before(retour);
  retour.classList.add("pouce-retour");
  const aides = choix.nextElementSibling && choix.nextElementSibling.matches(".dfx-aides, .ore-aide") ? choix.nextElementSibling : null;
  calerSousPouce(retour, aides || choix, RESERVE_POUCE.jeu, choix);
}

// ---- Le complément d'une question de reconnaissance (photo, cri) : un repère de terrain de la forme montrée ----
function complementReconnaissance(e, sujet) {
  if (typeof reperesDe !== "function") return "";
  const r = reperesDe(e);
  if (!r) return "";
  const forme = typeof formePourPhoto === "function" ? formePourPhoto(r, sujet) : null;
  const liste = (typeof reperesPourForme === "function" ? reperesPourForme(r, forme) : r.reperes) || [];
  const x = liste.find(z => z && z.texte && !complementsVus.has(e.nom_courant + "|rep|" + z.texte)) || null;
  if (!x) return "";
  complementsVus.add(e.nom_courant + "|rep|" + x.texte);
  return `Le repère : ${minusculeDebut(x.texte).replace(/\.$/, "")}.`;
}

// ---- La Rencontre (et les jeux qui se jouent sur sa carte) : #retour au-dessus de #reponses, calés en bas ----
(function installerPouceRencontre() {
  const rep = document.getElementById("reponses"), retour = document.getElementById("retour");
  if (!rep || !retour || typeof MutationObserver === "undefined") return;
  const aDesReponses = () => !!rep.querySelector("button.reponse, .reponse, .fe-photo, .option-trait")
    && !rep.querySelector(".bouton-annonce") && !document.getElementById("carte-rencontre").classList.contains("cache");
  let prevu = false;
  const caler = () => {
    prevu = false;
    if (!SOUS_LE_POUCE) return;
    const tel = surTelephone();
    // sur téléphone, la ligne de retour juste au-dessus des réponses ; sur ordinateur, elle reprend sa place (dessous)
    const nouvelle = !rep.querySelector(".juste, .fausse, .presque") && !rep.dataset.repondu;   // une question pas encore répondue
    if (tel && nouvelle && retour.parentNode === rep.parentNode && retour.nextElementSibling !== rep) { rep.before(retour); retour.classList.remove("pouce-dessous"); if (retour._pouce) retour._pouce.dessous = false; rep.style.marginTop = ""; }
    if (!tel && retour.parentNode === rep.parentNode && retour.nextElementSibling === rep) {
      const jns = document.getElementById("je-ne-sais-pas"); (jns && jns.parentNode === rep.parentNode ? jns : rep).after(retour);
    }
    if (tel && aDesReponses()) { if (nouvelle || !retour._pouce) calerSousPouce(retour, rep, RESERVE_POUCE.rencontre); else recalerPouce(); }
    else decalerPouce(retour);
  };
  const plus = () => { if (!prevu) { prevu = true; requestAnimationFrame(caler); } };
  new MutationObserver(plus).observe(rep, { childList: true, attributes: true, attributeFilter: ["class"] });
  window.addEventListener("resize", plus);
})();
