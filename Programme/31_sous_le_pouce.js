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
const RESERVE_POUCE = { rencontre: 100, jeu: 150 };   // la place du bouton fixé : en bas (Rencontre, étape 2) ; au-dessus des onglets (jeux)
function surTelephone() { return window.innerWidth <= 760; }

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
function recalerUn(premier) {
  const c = premier._pouce;
  if (!c || !premier.isConnected || !c.dernier.isConnected) { calagesPouce.delete(premier); return; }
  if (!SOUS_LE_POUCE || !surTelephone() || !c.dernier.getClientRects().length) { premier.style.marginTop = ""; c.reponses.style.marginTop = ""; return; }
  if (c.dessous) return;                                 // la ligne est déjà sous les réponses : rien ne bouge plus
  premier.style.marginTop = "0px";
  const bas = c.dernier.getBoundingClientRect().bottom + window.scrollY;
  const ecart = Math.floor(window.innerHeight - c.reserve - bas);
  const vide = !premier.textContent.trim() && !premier.querySelector("img, svg");
  if (vide || c.margeVide === null) c.margeVide = Math.max(0, ecart);
  if (ecart >= 0 || vide) { premier.style.marginTop = ecart > 0 ? ecart + "px" : ""; return; }
  // Trop long pour la place libre : la ligne passe sous les réponses, qui gardent leur place
  c.dessous = true;
  premier.style.marginTop = "";
  c.reponses.style.marginTop = c.margeVide ? c.margeVide + "px" : "";
  const apres = c.dernier !== c.reponses && c.dernier.previousElementSibling === c.reponses ? c.reponses : c.dernier;
  apres.after(premier);
  premier.classList.add("pouce-dessous");
  const r = premier.getBoundingClientRect(), limite = window.innerHeight - c.reserve + 8;
  const dy = Math.min(r.bottom + 12 - limite, r.top - 12);
  if (dy > 4) window.scrollBy({ top: dy, behavior: "smooth" });
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
  return `<span class="verdict ${juste ? "vd-ok" : "vd-ko"}"><b class="vd-mot">${echapper(m)}</b>${p ? `<span class="vd-phrase">${echapper(p)}</span>` : ""}</span>`
    + (complement ? `<span class="vd-plus">${echapper(complement)}</span>` : "");
}

// Les cases qui vont avec une question : la première renseignée (et pas réservée pour plus tard) sert de complément
const COMPLEMENTS = {
  regime_alimentaire_type: ["proies", "chasse_principale", "activite"],
  proies: ["chasse_principale", "activite", "saison_observation"],
  type_proie_detaille: ["chasse_principale", "activite"],
  chasse_principale: ["proies", "activite"],
  predateurs: ["defense_principale", "technique_defense"],
  defense_principale: ["predateurs", "activite"],
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
function detailAllure(e, champ) {
  if (!caseSure(e, "adaptations_physiques")) return "";
  const motif = typeof PARTIES_ADAPTATIONS !== "undefined" ? PARTIES_ADAPTATIONS[champ] : null;
  const vus = (typeof session !== "undefined" && session && session.detailsVus) || [];
  const c = String(e.adaptations_physiques).split(";").map(t => t.trim()).filter(Boolean)
    .find(t => !vus.includes(t) && !complementsVus.has(e.nom_courant + "|" + t) && !(motif && motif.test(t.toLowerCase())));
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
