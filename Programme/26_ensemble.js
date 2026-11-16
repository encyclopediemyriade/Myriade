// ==================================================================
// E2 · L'ÉTAPE 2 « ENSEMBLE, DANS CE LIEU » (14/11, cahier des charges : Claude\Reference\reprise_etape2_ensemble.md)
//   Critère A : l'étape 2 apprend comment les espèces de l'expédition vivent ensemble ici. Chaque question met en jeu
//   au moins deux espèces, ou une espèce et le lieu ; 6 questions au plus, dans l'ordre des 8 types ci-dessous ;
//   jamais de remplissage. Elle remplace « Leurs liens », la planche et « ce qui reste de leur vie ».
//   Ce fichier FABRIQUE les questions (questionsEnsemble, E2-2) et les AFFICHE (étape E2-3, 15/11 : ouvrirEnsembleExp).
//   Réglage : ETAPE2_ENSEMBLE = false → l'ancienne étape 2 (Leurs liens + la planche), pour comparer.
//   Il marche avec les colonnes actuelles ; les colonnes nouvelles (hiver, venue_de, cause_declin) sont lues
//   quand elles sont remplies (étape E2-1).
// ==================================================================
const ETAPE2_ENSEMBLE = true;          // étape E2-2 (false = l'ancienne étape 2)
const ENSEMBLE_MAX = 6;                // toutes les questions possibles, 6 au plus
const LIENS_ENSEMBLE_MAX = 2;          // type 1 : 2 questions au plus, sur 2 paires différentes
const PERIODE_HIVER = "De novembre à février";
// Si une expédition offre plus de 6 questions, on retire d'abord celles-ci (dans cet ordre) ; « Et si… ? » reste toujours, en dernier.
const ENSEMBLE_RETIRER_D_ABORD = ["liens2", "jour_nuit", "calendrier", "place", "chasseur", "liens1"];

// ---- Outils communs ----
const NOMBRES_MOTS = ["zéro", "une", "deux", "trois", "quatre", "cinq", "six", "sept"];
function feminin(e) { return e && e.genre_nom === "féminin"; }
function accordE(e, mot) { return feminin(e) ? mot + "e" : mot; }               // « venu » / « venue »
function leNom(e) { return nomAvecArticle(e); }                                  // « la scutigère véloce »
function LeNom(e) { return majuscule(nomAvecArticle(e)); }
function deNom(e) { return typeof deLEspece === "function" ? deLEspece(e) : "de " + leNom(e); }
function listeEt(t) { return t.length <= 1 ? (t[0] || "") : t.slice(0, -1).join(", ") + " et " + t[t.length - 1]; }
function confirme(e, col) { return !(e.a_confirmer || []).includes(col) && estRenseigne(e[col]) && String(e[col]).trim() !== ""; }
function dansTerritoire(e, t) { return String(e.territoire || "").split(";").map(s => s.trim()).includes(t); }
function itemsDe(e, col) { return confirme(e, col + "_items") ? itemsListe(e, col) : []; }
function choixEspece(e, bonne) { return { texte: e.nom_courant, espece: e.nom_courant, bonne: !!bonne }; }

// ---- Un nom de fiche désigne-t-il une espèce précise, ou un groupe vague ? ----
// « Renard » → Renard roux ; « Chats » → le chat domestique (pas dans le jeu) ; « Rapaces », « Corneilles » → groupe vague.
const CHAT = { nom_courant: "Chat domestique", hors_jeu: true, classe: "Mammifère", genre_nom: "masculin" };
const memoNommes = new Map();
function especeNommee(item) {
  if (memoNommes.has(item)) return memoNommes.get(item);
  const i = sansAccent(item);
  let r = null;
  if (i === "chat" || i === "chat domestique") r = CHAT;
  else { const m = especesDuNom(item, ESPECES); if (m.length === 1) r = m[0]; }
  memoNommes.set(item, r);
  return r;
}
// Un groupe vague (« Rapaces », « Araignées », « Belettes et martres ») peut-il comprendre cette espèce ?
// Un groupe qui ne nomme ni une famille d'animaux connue ni un mot du nom de l'espèce (« Graines », « Fruits et baies ») ne la comprend pas.
const GROUPES_LARGES = [
  [/oiseau|passereau|oisillon/, e => e.classe === "Oiseau"],
  [/rapace|oiseaux de proie/, e => /Accipitri|Falconi|Strigi/.test(e.ordre || "")],
  [/hibou|chouette|rapaces nocturne/, e => /Strigi/.test(e.ordre || "")],
  [/mammifere|carnivore|predateur|rongeur|mustelide/, e => e.classe === "Mammifère"],
  [/poisson/, e => e.classe === "Poisson"],
  [/serpent|couleuvre|reptile|lezard/, e => e.classe === "Reptile"],
  [/amphibien|grenouille|crapaud|triton/, e => e.classe === "Amphibien"],
  [/insecte|guepe|mouche|coleoptere|fourmi|libellule|papillon|chenille|punaise/, e => e.classe === "Insecte"],
  [/araignee/, e => e.classe === "Arachnide"],
  [/crustace|crabe|ecrevisse|crevette/, e => e.classe === "Crustacé"],
  [/escargot|limace|mollusque|coquillage/, e => ["Gastéropode", "Bivalve", "Céphalopode"].includes(e.classe)],
  [/^vers?|lombric|sangsue/, e => e.classe === "Annélide"],
];
function groupeComprend(item, e) {
  if (!e || e.hors_jeu) return false;
  const i = sansAccent(item);
  const n = sansAccent(e.nom_courant);
  // un mot du groupe dans le nom de l'espèce (« Belettes et martres » → la martre des pins)
  if (i.split(/[\s,'-]+/).some(w => w.length >= 4 && w !== "petit" && w !== "grand" && n.split(/[\s'-]+/).includes(w))) return true;
  const larges = GROUPES_LARGES.filter(([r]) => r.test(i));
  return larges.some(([, f]) => f(e));
}
// La fiche de « e » cite-t-elle « o » dans sa colonne (proies ou predateurs), par son nom ou par un groupe ?
function citeParNom(e, col, o) { return itemsDe(e, col).some(it => especeNommee(it) === o); }
function citeOuGroupe(e, col, o) {
  return itemsDe(e, col).some(it => { const n = especeNommee(it); return n ? n === o : groupeComprend(it, o); });
}
// Deux espèces ont-elles un lien quelconque (lien de finale, proie ou prédateur, par nom ou par groupe, dans un sens ou l'autre) ?
function ontUnLien(a, b) {
  if (tousLesLiens().some(l => l.nature_b === "espece" && ((l.a === a.nom_courant && l.b === b.nom_courant) || (l.a === b.nom_courant && l.b === a.nom_courant)))) return true;
  return citeOuGroupe(a, "proies", b) || citeOuGroupe(a, "predateurs", b) || citeOuGroupe(b, "proies", a) || citeOuGroupe(b, "predateurs", a);
}

// ---- Type 1 · Les liens entre elles ----
// Le sens de chaque rôle : qui est le sujet de la question (nommé), qui est la bonne réponse (une espèce de l'expédition).
// Pas de verbe violent : la prédation est tournée côté ressource (« nourrit »).
const FORMES_LIENS = {
  "Garde-manger": (sujet) => `Laquelle de ces espèces nourrit ${leNom(sujet)} ?`,
  "Concurrents": (sujet) => `Laquelle de ces espèces est en concurrence avec ${leNom(sujet)} ?`,
  "Locataire": (sujet) => `Laquelle de ces espèces fournit un logis ${aNomAvecArticle(sujet)} ?`,
  "Passager": (sujet) => accordGenre(`Sur laquelle de ces espèces ${leNom(sujet)} se fixe-t-il ?`, sujet),
  "Compagnons": (sujet) => accordGenre(`Avec laquelle de ces espèces ${leNom(sujet)} se regroupe-t-il souvent ?`, sujet),
};
// « Les gardons nourrissent le brochet » : le mangeur est celui qui est nommé APRÈS « nourri » (le sens des liens varie).
function motsDuNom(e) { return sansAccent(e.nom_courant).split(/[\s'-]+/).filter(w => w.length >= 4 && !["commun", "commune", "europe", "grand", "petit"].includes(w)); }
function nommeDans(phrase, e) { const p = sansAccent(phrase); return motsDuNom(e).some(w => new RegExp("\\b" + w).test(p)) ? p.search(new RegExp("\\b" + motsDuNom(e).find(w => new RegExp("\\b" + w).test(p)))) : -1; }
function sensGardeManger(k, A, B) {
  const p = sansAccent(k.phrase), j = p.search(/\bnourri/);
  if (j < 0) return null;
  const ia = nommeDans(k.phrase, A), ib = nommeDans(k.phrase, B);
  if (ia > j && !(ib > j)) return { mangeur: A, ressource: B };
  if (ib > j && !(ia > j)) return { mangeur: B, ressource: A };
  if (ia >= 0 && ia < j && ib < 0) return { mangeur: B, ressource: A };
  if (ib >= 0 && ib < j && ia < 0) return { mangeur: A, ressource: B };
  return null;
}
function candidatsLiensEnsemble(x) {
  const res = [], noms = new Set(x.liste.map(e => e.nom_courant)), vus = new Set();
  const cle = (a, b) => [a.nom_courant, b.nom_courant].sort().join("|");
  const c = x.chapitre && chapitreParNom(x.territoire, x.chapitre);
  for (const k of (c ? liensDuLieu(x.territoire, c.nom) : [])) {
    if (k.nature_b !== "espece" || !noms.has(k.a) || !noms.has(k.b) || !FORMES_LIENS[k.role]) continue;
    const A = especeParNom(k.a), B = especeParNom(k.b);
    let sujet, reponse;
    if (k.role === "Garde-manger") { const s = sensGardeManger(k, A, B); if (!s) continue; sujet = s.mangeur; reponse = s.ressource; }
    else if (k.role === "Concurrents" || k.role === "Compagnons") { [sujet, reponse] = Math.random() < 0.5 ? [A, B] : [B, A]; }
    else { sujet = A; reponse = B; }                    // Locataire, Passager : a loge chez b, a se fixe sur b
    if (vus.has(cle(A, B))) continue;
    vus.add(cle(A, B));
    res.push({ role: k.role, sujet, reponse, explication: k.phrase });
  }
  // les fiches : A cite B parmi ses proies, ou B cite A parmi ses prédateurs (par son nom, pas par un groupe)
  for (const a of x.liste) for (const b of x.liste) {
    if (a === b || vus.has(cle(a, b))) continue;
    const mange = citeParNom(a, "proies", b) || citeParNom(b, "predateurs", a);
    const inverse = citeParNom(b, "proies", a) || citeParNom(a, "predateurs", b);
    if (!mange || inverse) continue;
    vus.add(cle(a, b));
    res.push({ role: "Garde-manger", sujet: a, reponse: b, explication: `${LeNom(a)} se nourrit notamment ${deNom(b)}.` });
  }
  // les pièges : espèces de l'expédition sans aucun lien avec le sujet
  for (const r of res) r.pieges = x.liste.filter(o => o !== r.sujet && o !== r.reponse && !ontUnLien(r.sujet, o));
  return res.filter(r => r.pieges.length >= 2);
}
function questionLien(r) {
  const choix = melanger([choixEspece(r.reponse, true), ...melanger(r.pieges.slice()).slice(0, 2).map(o => choixEspece(o))]);
  return { type: "liens", question: FORMES_LIENS[r.role](r.sujet), montrees: [r.sujet.nom_courant], choix, plusieurs: false,
           explication: String(r.explication).trim().replace(/([^.!?])$/, "$1."), especes: [r.sujet.nom_courant, r.reponse.nom_courant] };
}

// ---- Type 2 · Le même chasseur ----
function chasseursDe(e) { const s = new Set(); for (const it of itemsDe(e, "predateurs")) { const n = especeNommee(it); if (n) s.add(n); } return s; }
const RE_CHASSEUR = /carniv|piscivo|insectivo|omniv/i;
function candidatChasseur(x, sansChat) {
  const compte = new Map();
  for (const e of x.liste) for (const h of chasseursDe(e)) if (!x.liste.includes(h)) compte.set(h, [...(compte.get(h) || []), e]);
  const min = Math.max(3, Math.ceil(x.liste.length / 2));
  const bons = [...compte].filter(([h, l]) => l.length >= min && !(sansChat && h === CHAT));
  if (!bons.length) return null;
  bons.sort((p, q) => q[1].length - p[1].length || (p[0] === CHAT) - (q[0] === CHAT));
  const [h, proies] = bons[0];
  // les pièges : des chasseurs du territoire, de la même classe, qu'aucune espèce montrée ne cite (ni par nom ni par groupe)
  // et dont la fiche ne cite aucune d'elles parmi ses proies
  // « chasseurs du même milieu » : même régime que le vrai chasseur (un carnivore → des carnivores), le même ordre d'abord
  // (un rapace → des rapaces), puis le même milieu
  const milieu = h.hors_jeu ? null : h.milieu_principal, regime = h.hors_jeu ? "carnivore" : String(h.regime_alimentaire_type || "");
  const pieges = ESPECES.filter(p => p !== h && !x.liste.includes(p) && dansTerritoire(p, x.territoire) && p.classe === h.classe
      && RE_CHASSEUR.test(String(p.regime_alimentaire_type || "")) && (!/carniv|piscivo/.test(regime) || /carniv|piscivo/.test(String(p.regime_alimentaire_type || "")))
      && !proies.some(e => citeOuGroupe(e, "predateurs", p) || citeOuGroupe(p, "proies", e)))
    .map(p => [p, (!h.hors_jeu && p.ordre === h.ordre ? 2 : 0) + (p.milieu_principal === milieu ? 1 : 0) + Math.random() * 0.5])
    .sort((a, b) => b[1] - a[1]).map(a => a[0]);
  if (pieges.length < 2) return null;
  return { chasseur: h, proies, pieges: pieges.slice(0, 3) };
}
// Le chat : une fois par lieu au plus (la première expédition du lieu, dans l'ordre, où il serait le chasseur)
function chatPermis(x) {
  const autres = expeditionsDe(x.territoire).filter(y => y.chapitre === x.chapitre && y.ordre < x.ordre);
  return !autres.some(y => { const c = candidatChasseur(y, false); return c && c.chasseur === CHAT; });
}
function questionChasseur(x) {
  let c = candidatChasseur(x, false);
  if (c && c.chasseur === CHAT && !chatPermis(x)) c = candidatChasseur(x, true);
  if (!c) return null;
  const h = c.chasseur, n = c.proies.length;
  const choix = melanger([h.hors_jeu ? { texte: h.nom_courant, bonne: true } : choixEspece(h, true), ...c.pieges.map(p => choixEspece(p))]);
  const lignes = [`${LeNomOuChat(h)} compte parmi les chasseurs ${listeEt(c.proies.map(deNom))}.`];
  for (const p of c.pieges) { const m = itemsDe(p, "proies"); if (m.length) lignes.push(`Ce que mange ${leNom(p)} : ${m.join(", ").toLowerCase()}.`); }
  return { type: "chasseur", question: `Ces ${NOMBRES_MOTS[n] || n} espèces ont un même chasseur. Lequel ?`, montrees: c.proies.map(e => e.nom_courant),
           choix, plusieurs: false, explication: lignes.join(" "), especes: c.proies.map(e => e.nom_courant) };
}
function LeNomOuChat(h) { return h === CHAT ? "Le chat domestique" : LeNom(h); }

// ---- Type 3 · Le jour et la nuit ----
function activiteNette(e) { if (!confirme(e, "activite")) return null; const v = String(e.activite).trim(); return v === "Surtout le jour" ? "jour" : v === "Surtout la nuit" ? "nuit" : null; }
function questionJourNuit(x) {
  const l = x.liste.filter(activiteNette), nuit = l.filter(e => activiteNette(e) === "nuit"), jour = l.filter(e => activiteNette(e) === "jour");
  if (l.length < 3 || !nuit.length || !jour.length) return null;
  let question, bonnes;
  if (nuit.length === 1) { question = "Une seule de ces espèces est active surtout la nuit. Laquelle ?"; bonnes = nuit; }
  else if (jour.length === 1) { question = "Une seule de ces espèces est active surtout le jour. Laquelle ?"; bonnes = jour; }
  else { question = "Lesquelles de ces espèces sont actives surtout la nuit ?"; bonnes = nuit; }
  const explication = `Surtout la nuit : ${listeEt(nuit.map(leNom))}. Surtout le jour : ${listeEt(jour.map(leNom))}.`;
  return { type: "jour_nuit", question, montrees: [], choix: melanger(l.map(e => choixEspece(e, bonnes.includes(e)))),
           plusieurs: bonnes.length > 1 || (nuit.length > 1 && jour.length > 1), explication, especes: l.map(e => e.nom_courant) };
}

// ---- Type 4 · Le calendrier du lieu (l'hiver seulement) ----
// La colonne hiver d'abord (étape E2-1), quand elle est remplie ; sinon migrateur_resident (valeurs nettes) et hibernation.
const HIVER_VALEURS = { "part de la région": "part", "reste actif": "actif", "s'endort ou ralentit": "endormi", "en partie": null };
const MIGRATEUR_DOUTEUX = /partiel|\bou\b|irrupt|errati|quelques|hivernant|disperse|descend|invasion|selon/i;
function etatHiver(e) {
  if (confirme(e, "hiver")) { const v = String(e.hiver).trim().toLowerCase().replace(/’/g, "'"); return v in HIVER_VALEURS ? HIVER_VALEURS[v] : null; }
  if (confirme(e, "migrateur_resident")) {
    const v = String(e.migrateur_resident).trim();
    if (MIGRATEUR_DOUTEUX.test(v.replace(/\(sédentaire\)/i, ""))) return null;
    if (/^migrat(eur|rice)/i.test(v)) return "part";
    if (/^(sédentaire|résident)/i.test(v) && !/migrat/i.test(v.replace(/^résident \(sédentaire\)/i, ""))) return "actif";
    return null;
  }
  if (confirme(e, "hibernation")) {
    const v = String(e.hibernation).trim(), d = String(e.hibernation_detail || "");
    if (v === "Oui") return "endormi";
    if (v === "Non" && !/léthargi|torpeur|dormance|ralenti/i.test(d)) return "actif";
  }
  return null;
}
function ouHiverne(e) {
  const m = String(e.migrateur_resident || "").match(/hiverne (surtout |au large |sur les côtes )?(en|au|aux|dans|sur)\b([^;),]*)/i);
  return m ? `passe l'hiver ${m[0].replace(/^hiverne\s*/i, "").trim()}` : null;
}
function questionCalendrier(x, dejaMontrees) {
  const l = x.liste.filter(etatHiver);
  if (l.length < 3) return null;
  const part = l.filter(e => etatHiver(e) === "part"), dort = l.filter(e => etatHiver(e) === "endormi");
  if (dejaMontrees && dejaMontrees.length === l.length && l.every(e => dejaMontrees.includes(e.nom_courant))) return null;   // pas les mêmes espèces que « jour et nuit »
  let question, bonnes, sujet;
  if (part.length && part.length < l.length) {
    sujet = "part"; bonnes = part;
    if (part.length === 1) question = `${PERIODE_HIVER}, une seule de ces espèces quitte la région. Laquelle ?`;
    else if (l.length - part.length === 1) { question = `${PERIODE_HIVER}, une seule de ces espèces reste dans la région. Laquelle ?`; bonnes = l.filter(e => !part.includes(e)); }
    else question = `${PERIODE_HIVER}, lesquelles de ces espèces quittent la région ?`;
  } else if (dort.length && dort.length < l.length) {
    sujet = "endormi"; bonnes = dort;
    if (dort.length === 1) question = `${PERIODE_HIVER}, une seule de ces espèces passe l'hiver endormie ou au ralenti. Laquelle ?`;
    else if (l.length - dort.length === 1) { question = `${PERIODE_HIVER}, une seule de ces espèces reste active. Laquelle ?`; bonnes = l.filter(e => !dort.includes(e)); }
    else question = `${PERIODE_HIVER}, lesquelles de ces espèces passent l'hiver endormies ou au ralenti ?`;
  } else return null;
  // l'explication : une phrase par espèce qui part ou s'endort, une seule ligne pour celles qui restent actives
  const lignes = [];
  for (const e of l) {
    const s = etatHiver(e), d = String(e.hibernation_detail || "").trim();
    if (s === "part") lignes.push(`${LeNom(e)} ${ouHiverne(e) || "quitte la région en hiver"}.`);
    if (s === "endormi") lignes.push(`${LeNom(e)} passe l'hiver ${accordE(e, "endormi")}${estRenseigne(e.hibernation_detail) && d ? " : " + d.charAt(0).toLowerCase() + d.slice(1) : ""}.`);
  }
  const actives = l.filter(e => etatHiver(e) === "actif");
  if (actives.length) lignes.push(`${actives.length > 1 ? "Restent actives dans la région" : `Reste ${feminin(actives[0]) ? "active" : "actif"} dans la région`} : ${listeEt(actives.map(leNom))}.`);
  return { type: "calendrier", question, montrees: [], choix: melanger(l.map(e => choixEspece(e, bonnes.includes(e)))),
           plusieurs: !/une seule/.test(question), explication: lignes.join(" "), especes: l.map(e => e.nom_courant), sujet };
}

// ---- Type 5 · Sa place dans le lieu ----
// Les éléments du lieu dits de façon générale (« dans les berges d'un étang », pas « de l'étang »).
const ELEMENTS_GENERAUX = {
  "La roselière": "Dans une roselière", "Les gros arbres": "Dans de gros arbres", "Les toits des maisons": "Sous le toit d'une maison",
  "Les prairies humides": "Dans une prairie humide", "Les plantes flottantes de l'étang": "Parmi les plantes flottantes d'un étang",
  "Les sables nus": "Dans le sable nu", "Les vieilles souches": "Dans une vieille souche", "Les vieux murs": "Dans un vieux mur",
  "La lande": "Dans une lande", "Les berges de l'étang": "Dans les berges d'un étang", "La falaise": "Sur une falaise",
  "Les petits ruisseaux": "Dans un petit ruisseau", "Les arbres morts": "Dans un arbre mort", "Les haies d'épineux": "Dans une haie d'épineux",
  "Les berges abruptes": "Dans une berge abrupte", "Les grèves de sable": "Sur une grève de sable", "Les pins": "Dans les pins",
  "Les champs cultivés": "Dans un champ cultivé", "Les vieux ponts": "Sous un vieux pont", "Les fourmilières": "Dans une fourmilière",
  "Les vasières": "Dans une vasière", "Les fonds de sable": "Sur un fond de sable", "Les saules": "Sur les saules",
  "Les herbiers marins": "Dans un herbier marin", "Les éboulis": "Dans un éboulis", "La neige": "Dans la neige", "Le gui": "Sur le gui",
  "Les vieilles granges": "Dans une vieille grange", "Les galets de la steppe": "Parmi les galets d'une steppe", "Les orties": "Sur les orties",
  "Les arbousiers": "Sur les arbousiers", "Les grottes sous-marines": "Dans une grotte sous-marine", "Les marais salants": "Dans un marais salant",
  "Les laisses de mer": "Dans une laisse de mer", "Les férules": "Sur les férules", "Les sphaignes": "Dans les sphaignes",
  "Les ornières": "Dans une ornière", "Les oseilles": "Sur les oseilles", "Les chardons": "Sur les chardons", "Les ormes": "Sur les ormes",
  "Le chèvrefeuille": "Sur le chèvrefeuille", "Les violettes": "Sur les violettes", "Les patiences": "Sur les patiences", "Les orpins": "Sur les orpins",
};
function elementsDe(nom) { return new Set(tousLesLiens().filter(l => l.nature_b === "element" && l.a === nom).map(l => l.b)); }
function candidatsPlace(x) {
  const noms = new Set(x.liste.map(e => e.nom_courant));
  const c = x.chapitre && chapitreParNom(x.territoire, x.chapitre);
  return (c ? liensDuLieu(x.territoire, c.nom) : []).filter(k => k.nature_b === "element" && noms.has(k.a) && ELEMENTS_GENERAUX[k.b]
    && (k.pieges || []).filter(p => ELEMENTS_GENERAUX[p] && !elementsDe(k.a).has(p)).length >= 2);
}
function questionPlace(x, eviter) {
  const l = candidatsPlace(x);
  if (!l.length) return null;
  const k = melanger(l.slice()).sort((p, q) => eviter.includes(p.a) - eviter.includes(q.a))[0];
  const pieges = k.pieges.filter(p => ELEMENTS_GENERAUX[p] && !elementsDe(k.a).has(p)).slice(0, 2);
  return { type: "place", question: k.question, montrees: [k.a],
           choix: melanger([{ texte: ELEMENTS_GENERAUX[k.b], bonne: true }, ...pieges.map(p => ({ texte: ELEMENTS_GENERAUX[p], bonne: false }))]),
           plusieurs: false, explication: String(k.phrase).trim().replace(/([^.!?])$/, "$1."), especes: [k.a] };
}

// ---- Type 6 · Les nouveaux venus ----
// Jamais les introductions très anciennes ou discutées ; jamais en piège une espèce réintroduite ou introduite ici (« venue d'ailleurs » serait à moitié vrai).
const NOUVEAUX_VENUS_EXCLUS = ["Carpe commune", "Genette commune", "Rat noir", "Surmulot", "Souris grise"];
const ORIGINE_DISCUTEE = ["Bouquetin des Alpes", "Bouquetin ibérique", "Castor d'Europe", "Vautour fauve", "Vautour moine", "Gypaète barbu",
  "Ours brun", "Lynx boréal", "Marmotte des Alpes", "Cigogne blanche", "Faisan de Colchide", "Lapin de garenne", "Daim", "Mouflon de Corse",
  "Perdrix rouge", "Truite arc-en-ciel", "Vautour percnoptère", "Grand tétras"];
function estIntroduite(e) { return confirme(e, "origine") && e.origine === "Introduite" && !NOUVEAUX_VENUS_EXCLUS.includes(e.nom_courant); }
function estDIci(e) { return confirme(e, "origine") && e.origine === "Indigène" && !ORIGINE_DISCUTEE.includes(e.nom_courant); }
function dateArrivee(d) {
  const t = String(d || "").trim();
  if (!estRenseigne(d) || !t) return "";
  if (/^\d/.test(t)) return "en " + t;
  if (/^années/i.test(t)) return "dans les " + t.toLowerCase();
  if (/^moyen/i.test(t)) return "au " + t;
  return t.charAt(0).toLowerCase() + t.slice(1);
}
function questionNouveauxVenus(x) {
  const intro = x.liste.filter(estIntroduite), ici = x.liste.filter(estDIci);
  if (!intro.length || ici.length < 2) return null;
  const e = melanger(intro.slice())[0];
  const lignes = [];
  const quand = dateArrivee(e.introduction_date);
  lignes.push(`${LeNom(e)} est ${accordE(e, "arrivé")} en France${quand ? " " + quand : ""}${confirme(e, "venue_de") ? `, ${accordE(e, "venu")} ${String(e.venue_de).trim()}` : ""}.`);
  const effet = tousLesLiens().find(l => l.role === "Nouveau venu" && l.a === e.nom_courant && l.territoire === x.territoire)
             || tousLesLiens().find(l => l.role === "Nouveau venu" && l.a === e.nom_courant);
  if (effet) lignes.push(effet.phrase.replace(/\.?$/, "."));
  const montrees = melanger(ici.slice()).slice(0, 3);
  return { type: "nouveaux", question: "Laquelle de ces espèces est venue d'ailleurs ?", montrees: [],
           choix: melanger([choixEspece(e, true), ...montrees.map(o => choixEspece(o))]), plusieurs: false,
           explication: lignes.join(" "), especes: [e.nom_courant, ...montrees.map(o => o.nom_courant)] };
}

// ---- Type 7 · Les plus fragiles (une fois par lieu au plus) ----
const STATUTS_MENACES = ["Vulnérable", "En danger", "En danger critique"];
function statutNet(e) { if (!confirme(e, "statut_conservation_france")) return null; const v = String(e.statut_conservation_france).trim(); return STATUTS_MENACES.includes(v) ? "menacee" : v === "Préoccupation mineure" ? "non" : null; }
function fragilesPossible(x) { const l = x.liste.filter(statutNet); return l.length >= 3 && l.some(e => statutNet(e) === "menacee") && l.some(e => statutNet(e) === "non"); }
function fragilesPermis(x) {   // la première expédition du lieu (dans l'ordre) où la question est possible
  const premiere = expeditionsDe(x.territoire).filter(y => y.chapitre === x.chapitre).find(fragilesPossible);
  return !!premiere && premiere.id === x.id;
}
function questionFragiles(x) {
  if (!fragilesPossible(x) || !fragilesPermis(x)) return null;
  const l = x.liste.filter(statutNet), men = l.filter(e => statutNet(e) === "menacee"), non = l.filter(e => statutNet(e) === "non");
  let question, bonnes;
  if (non.length === 1) { question = "À ce jour, une seule de ces espèces n'est pas menacée en France. Laquelle ?"; bonnes = non; }
  else if (men.length === 1) { question = "À ce jour, une seule de ces espèces est menacée en France. Laquelle ?"; bonnes = men; }
  else { question = "À ce jour, lesquelles de ces espèces sont menacées en France ?"; bonnes = men; }
  const lignes = men.map(e => `${LeNom(e)} : ${String(e.statut_conservation_france).toLowerCase()} sur la liste rouge de France${confirme(e, "cause_declin") ? " (" + String(e.cause_declin).trim().replace(/\.$/, "") + ")" : ""}.`);
  lignes.push(`Pas menacée${non.length > 1 ? "s" : ""} à ce jour : ${listeEt(non.map(leNom))}.`);
  return { type: "fragiles", question, montrees: [], choix: melanger(l.map(e => choixEspece(e, bonnes.includes(e)))),
           plusieurs: !/une seule/.test(question), explication: lignes.join(" "), especes: l.map(e => e.nom_courant) };
}

// ---- Type 8 · Et si… ? (toujours la dernière) ----
// Une phrase fixe par lieu de nid (à vérifier une fois, 2 sources, avant la mise en ligne). « exclus » : lieux de nid trop proches
// pour être montrés comme « non » (un nid de bâtiment est souvent dans une cavité…). « milieu » : la bonne réponse doit vivre là.
const ET_SI = {
// Étape R236 (note 17 du 15/11) : « profite à » était à moitié vrai (le rougegorge, qui niche au sol, profite aussi des haies :
//   abri, nourriture). La question dit maintenant ce qu'elle juge : le lieu du nid. Et un nid au sol n'est plus montré comme « non »
//   pour les haies (souvent au pied d'une haie ou d'un buisson).
  "Cavité d'arbre": { question: "Garder les vieux arbres creux offre un lieu de nid à lesquelles de ces espèces ?", exclus: ["Arbre ou buisson", "Bâtiment"] },
  "Bâtiment": { question: "Laisser des accès sous les toits et dans les vieux bâtiments offre un lieu de nid à lesquelles de ces espèces ?", exclus: ["Cavité d'arbre"] },
  "Arbre ou buisson": { question: "Garder les haies, les buissons et les arbres offre un lieu de nid à lesquelles de ces espèces ?", exclus: ["Cavité d'arbre", "Au sol", "Roselière ou végétation dense"] },
  "Roselière ou végétation dense": { question: "Garder les roselières offre un lieu de nid à lesquelles de ces espèces ?", exclus: ["Au sol", "Sur l'eau (nid flottant)"],
    milieu: e => /Marais|Mares|Lacs|Estuaires/.test(e.milieu_principal || "") || /rosea|roseli|marais/i.test(String(e.habitat || "")) },
  "Au sol": { question: "Ne pas faucher les prés avant l'été protège le nid de lesquelles de ces espèces ?", exclus: ["Roselière ou végétation dense"],
    milieu: e => /Campagne/.test(e.milieu_principal || "") || /prair|\bprés?\b|champ/i.test(String(e.habitat || "")) },
};
const NIDS_NETS = ["Cavité d'arbre", "Bâtiment", "Arbre ou buisson", "Roselière ou végétation dense", "Au sol", "Falaise ou paroi rocheuse", "Terrier", "Sur l'eau (nid flottant)"];
const NIDS_DITS = { "Cavité d'arbre": "dans un arbre creux", "Bâtiment": "dans un bâtiment", "Arbre ou buisson": "dans un arbre ou un buisson",
  "Roselière ou végétation dense": "dans une roselière ou une végétation dense", "Au sol": "au sol", "Falaise ou paroi rocheuse": "dans une falaise",
  "Terrier": "dans un terrier", "Sur l'eau (nid flottant)": "sur l'eau, dans un nid flottant" };
function nidNet(e) { return confirme(e, "emplacement_nid") && NIDS_NETS.includes(String(e.emplacement_nid).trim()) ? String(e.emplacement_nid).trim() : null; }
// Étape R237 : les autres endroits où une espèce niche aussi (2 sources : colonne « autres » ; 1 source : Pieges_interdits)
function nidsAussi(e) {
  const interdits = (typeof PIEGES_INTERDITS === "undefined" ? [] : PIEGES_INTERDITS)
    .filter(p => p.nom_courant === e.nom_courant && p.colonne === "emplacement_nid").map(p => String(p.reponse_interdite));
  return [...valeursAutres(e, "emplacement_nid"), ...interdits];
}
function questionEtSi(x) {
  // une espèce dont le lieu dit déjà où elle niche (lien « Sa maison » : le balbuzard sur la falaise de Scandola) n'est pas montrée :
  // sa fiche (« arbre ou buisson ») pourrait contredire ce lieu
  const c = x.chapitre && chapitreParNom(x.territoire, x.chapitre);
  const logees = new Set((c ? liensDuLieu(x.territoire, c.nom) : []).filter(k => k.nature_b === "element" && k.role === "Sa maison").map(k => k.a));
  let mieux = null;
  for (const [cas, r] of Object.entries(ET_SI)) {
    // Étape R237 : une espèce montrée comme « non » ne niche nulle part près de ce cas, même en second (colonne
    // emplacement_nid_autres, ou onglet Pieges_interdits : le rougegorge dans les haies, le moineau dans les arbres)
    const l = x.liste.filter(e => { const n = nidNet(e); return n && !logees.has(e.nom_courant) && !r.exclus.includes(n) && (n !== cas || !r.milieu || r.milieu(e))
      && (n === cas || !nidsAussi(e).some(v => v === cas || r.exclus.includes(v))); });
    const bonnes = l.filter(e => nidNet(e) === cas);
    if (l.length < 3 || !bonnes.length || bonnes.length === l.length) continue;
    if (!mieux || bonnes.length > mieux.bonnes.length) mieux = { cas, r, l, bonnes };
  }
  if (!mieux) return null;
  const { r, l, bonnes } = mieux;
  // Étape R236 (note 17) : l'explication regroupe les espèces par lieu de nid (avant : « Le … niche … » répété pour chacune)
  const groupes = new Map([[mieux.cas, []]]);
  for (const e of l) { const n = nidNet(e); if (!groupes.has(n)) groupes.set(n, []); groupes.get(n).push(e); }
  const explication = majuscule([...groupes].filter(([, g]) => g.length)
    .map(([n, g]) => `${listeEt(g.map(leNom))} ${g.length > 1 ? "nichent" : "niche"} ${NIDS_DITS[n]}`).join(" ; ")) + ".";
  return { type: "etsi", question: r.question, montrees: [], choix: melanger(l.map(e => choixEspece(e, bonnes.includes(e)))),
           plusieurs: true, explication, especes: l.map(e => e.nom_courant) };
}

// ---- L'assemblage ----
// Toutes les questions possibles, dans l'ordre des types ; 6 au plus ; « Et si… ? » toujours en dernier.
// Jamais deux questions de suite à une seule bonne réponse qui porte sur la même espèce.
function questionsEnsemble(x) {
  const q = [];
  const liens = melanger(candidatsLiensEnsemble(x));
  const pris = [];
  for (const passe of [0, 1]) for (const r of liens) {        // 2 paires différentes, des espèces différentes si possible
    if (pris.length >= LIENS_ENSEMBLE_MAX || pris.includes(r)) continue;
    if (pris.some(p => p.sujet === r.sujet && p.reponse === r.reponse || p.sujet === r.reponse && p.reponse === r.sujet)) continue;
    if (passe === 0 && pris.some(p => [p.sujet, p.reponse].some(e => e === r.sujet || e === r.reponse))) continue;
    pris.push(r);
  }
  pris.forEach((r, i) => q.push({ ...questionLien(r), cle: "liens" + (i + 1) }));
  const ch = questionChasseur(x); if (ch) q.push({ ...ch, cle: "chasseur" });
  const jn = questionJourNuit(x); if (jn) q.push({ ...jn, cle: "jour_nuit" });
  const ca = questionCalendrier(x, jn ? jn.especes : null); if (ca) q.push({ ...ca, cle: "calendrier" });
  const pl = questionPlace(x, pris.map(r => r.sujet.nom_courant)); if (pl) q.push({ ...pl, cle: "place" });
  const nv = questionNouveauxVenus(x); if (nv) q.push({ ...nv, cle: "nouveaux" });
  const fr = questionFragiles(x); if (fr) q.push({ ...fr, cle: "fragiles" });
  const es = questionEtSi(x); if (es) q.push({ ...es, cle: "etsi" });
  for (const cle of ENSEMBLE_RETIRER_D_ABORD) { if (q.length <= ENSEMBLE_MAX) break; const i = q.findIndex(z => z.cle === cle); if (i >= 0) q.splice(i, 1); }
  while (q.length > ENSEMBLE_MAX) q.splice(q.length - 2, 1);
  // deux questions de suite à une seule réponse sur la même espèce : on retire la seconde (sauf « Et si… ? »)
  const uneBonne = z => !z.plusieurs ? (z.choix.find(c => c.bonne) || {}).espece : null;
  for (let i = 1; i < q.length; i++) if (uneBonne(q[i]) && uneBonne(q[i]) === uneBonne(q[i - 1])) { q.splice(q[i].cle === "etsi" ? i - 1 : i, 1); i--; }
  return q;
}
// Une expédition qui n'offre qu'une question, ou aucune : pas d'étape 2 (la question unique se pose à la fin des Rencontres).
function aUneEtapeEnsemble(x) { return ETAPE2_ENSEMBLE && questionsEnsemble(x).length >= 2; }


// ==================================================================
// E2-3 · L'AFFICHAGE DE L'ÉTAPE 2 (15/11/2026)
//   - Une expédition avec au moins une question : l'étape 2 = ces questions, une par écran ; une seule réponse (un toucher)
//     ou plusieurs (on coche, puis « Valider »). Une erreur est expliquée tout de suite ; la question revient UNE fois à la fin,
//     puis compte quand même. Jamais d'échec.
//   - Une expédition avec une seule question, ou aucune : pas d'étape 2 (elle se termine avec les Rencontres) ; la question
//     unique est proposée juste après la dernière Rencontre (« Une dernière question »).
//   - Étape 2 finie = les espèces de l'expédition deviennent « comprises » (suivi.comprises). Empreintes inchangées
//     (+ GAIN_FIN_EXPEDITION à la fin, comme avant).
//   - Rien ne recule : une expédition dont l'étape 2 était finie avant E2-3 le reste (suivi.etape2AvantE2).
//   - Les questions d'une expédition restent les mêmes pendant toute la session (pas de nouveau tirage à chaque visite).
// ==================================================================
if (ETAPE2_ENSEMBLE && typeof ETAPES !== "undefined")
  ETAPES[2] = { titre: "Ensemble", texte: "Comment ces espèces vivent ensemble ici : qui chasse qui, le jour et la nuit, l'hiver, ce qui les aide" };
const memoEnsemble = new Map();
function questionsEnsembleExp(x) {
  if (!memoEnsemble.has(x.id)) { let q = []; try { q = questionsEnsemble(x); } catch (err) { q = []; } memoEnsemble.set(x.id, q); }
  return memoEnsemble.get(x.id);
}
function ensembleFait(x) { return !!(suivi && suivi.ensembleFait && suivi.ensembleFait[x.id]); }
function comprisesEnsemble() {
  const l = (suivi && suivi.comprises) || [];
  if (!comprisesEnsemble.cache || comprisesEnsemble.cache.src !== l || comprisesEnsemble.cache.n !== l.length) {
    comprisesEnsemble.cache = new Set(l); comprisesEnsemble.cache.src = l; comprisesEnsemble.cache.n = l.length;
  }
  return comprisesEnsemble.cache;
}
function especeComprise(e) { return ETAPE2_ENSEMBLE && !!suivi && comprisesEnsemble().has(e.nom_courant); }
// Une seule fois : les expéditions dont l'étape 2 était déjà finie (ancienne règle) le restent
function etape2AvantE2() {
  if (!suivi) return new Set();
  if (!suivi.etape2AvantE2) {
    suivi.etape2AvantE2 = EXPEDITIONS.map(y => expeditionParId(y.id)).filter(x => x && etapeFinieAncienne(x, 2)).map(x => x.id);
    sauvegarder();
  }
  if (!etape2AvantE2.cache || etape2AvantE2.cache.src !== suivi.etape2AvantE2) { etape2AvantE2.cache = new Set(suivi.etape2AvantE2); etape2AvantE2.cache.src = suivi.etape2AvantE2; }
  return etape2AvantE2.cache;
}
// L'étape 2 est-elle finie ? (appelé par etapeFinie, 17_expeditions.js, une fois l'étape 1 finie)
function etape2EnsembleFinie(x) {
  return ensembleFait(x) || etape2AvantE2().has(x.id) || questionsEnsembleExp(x).length <= 1;
}
// Une expédition a-t-elle une étape 2 à jouer ? (2 questions au moins)
function aUneEtape2(x) { return !ETAPE2_ENSEMBLE || questionsEnsembleExp(x).length >= 2 || etape2AvantE2().has(x.id); }
// Une expédition à une seule question : elle est proposée après la dernière Rencontre, tant qu'elle n'a pas été vue
function questionFinaleExp(x) { return ETAPE2_ENSEMBLE && questionsEnsembleExp(x).length === 1 && !ensembleFait(x); }

let ensemble = null;
function ouvrirEnsembleExp(x) {
  etape2AvantE2();   // la liste « rien ne recule » est faite avant toute nouvelle espèce comprise
  const qs = questionsEnsembleExp(x);
  if (!qs.length) { marquerEnsemble(x); ouvrirExpedition(x); return; }
  ecranForme(x, 2);
  ensemble = { x, file: qs.map(q => ({ q, reprise: false })), i: 0, total: qs.length, premierCoup: 0, avantGain: gainExp(x), avant: empreintesExp(x) };
  dessinerEnsemble();
}
function marquerEnsemble(x) {
  if (!suivi) return;
  suivi.ensembleFait = suivi.ensembleFait || {};
  suivi.ensembleFait[x.id] = true;
  suivi.comprises = suivi.comprises || [];
  for (const e of x.liste) if (!suivi.comprises.includes(e.nom_courant)) suivi.comprises.push(e.nom_courant);
  sauvegarder();
}
function figureEnsemble(nom) {
  const e = especeParNom(nom);
  if (!e) return "";
  return `<figure><img src="${photoMini(photoEsp(e))}" alt=""><figcaption>${echapper(e.nom_courant)}</figcaption></figure>`;
}
function boutonChoixEnsemble(c, i, plusieurs) {
  const e = c.espece ? especeParNom(c.espece) : null;
  const image = e ? `<img src="${photoMini(photoEsp(e))}" alt="">` : "";
  return `<button type="button" class="fl-rep en-rep${e ? " en-avec-photo" : ""}" data-i="${i}" aria-pressed="${plusieurs ? "false" : ""}">
      ${plusieurs ? `<span class="en-case" aria-hidden="true"></span>` : ""}${image}<span class="en-texte">${echapper(c.texte)}</span></button>`;
}
function dessinerEnsemble() {
  const z = document.getElementById("forme-ecran"), E = ensemble;
  if (!z || !E) return;
  const { q, reprise } = E.file[E.i];
  const n = E.file.filter(f => !f.reprise).length, rang = E.file.slice(0, E.i + 1).filter(f => !f.reprise).length;
  const montrees = (q.montrees || []).map(figureEnsemble).filter(Boolean);
  z.innerHTML = `<div class="fp-carte fl-carte en-carte">
    <div class="fp-tete"><span class="fp-lib">${PICTO_LIENS}Ensemble, dans ce lieu</span><span class="fp-compte">${reprise ? "À revoir" : n === 1 ? "Une dernière question" : `${rang} / ${n}`}</span></div>
    ${montrees.length ? `<div class="en-montrees${montrees.length > 2 ? " nombreuses" : ""}">${montrees.join("")}</div>` : ""}
    <h3 class="fl-question">${echapper(q.question)}</h3>
    ${q.plusieurs ? `<p class="en-consigne">Plusieurs réponses possibles.</p>` : ""}
    <div class="fl-choix en-choix">${q.choix.map((c, i) => boutonChoixEnsemble(c, i, q.plusieurs)).join("")}</div>
    <p class="fp-retour" id="en-retour"></p>
    <div class="fp-pied">${q.plusieurs ? `<button type="button" class="bouton-accueil principal" id="en-valider" disabled>Valider</button>` : ""}
      <button type="button" class="bouton-accueil principal cache" id="en-suite">${E.i + 1 < E.file.length ? "Question suivante" : "Continuer"}</button></div></div>`;
  const boutons = [...z.querySelectorAll(".en-rep")];
  const corriger = choisis => {
    const bonnes = q.choix.map((c, i) => c.bonne ? i : -1).filter(i => i >= 0);
    // Étape R236 (note 17, décision d'Aubin du 15/11) : à plusieurs réponses, la question est validée si le joueur trouve au moins
    //   les 2/3 des bonnes réponses (2 sur 3, 2 sur 2, 3 sur 4…) sans cocher de fausse réponse ; les oubliées restent montrées.
    const trouvees = choisis.filter(i => bonnes.includes(i)).length, fausses = choisis.filter(i => !bonnes.includes(i)).length;
    const juste = fausses === 0 && trouvees >= (q.plusieurs ? Math.ceil(bonnes.length * 2 / 3) : bonnes.length);
    const partiel = juste && trouvees < bonnes.length;
    boutons.forEach(b => {
      const i = Number(b.dataset.i); b.disabled = true; b.classList.remove("coche");
      if (bonnes.includes(i)) b.classList.add(choisis.includes(i) || !q.plusieurs ? "juste" : "juste", ...(q.plusieurs && !choisis.includes(i) ? ["oubliee"] : []));
      else if (choisis.includes(i)) b.classList.add("fausse");
    });
    try { jouerSon(juste ? "bonne" : "mauvaise"); } catch (err) {}
    if (juste && !reprise) E.premierCoup++;
    if (!juste && !reprise) E.file.push({ q: { ...q, choix: melanger(q.choix.slice()) }, reprise: true });   // revient une fois, à la fin
    if (q.type === "liens" && typeof noterLienConnu === "function") noterLienConnu("ens|" + (q.especes || []).join("|"));   // badge « Leurs liens »
    const v = document.getElementById("en-valider"); if (v) v.classList.add("cache");
    const oubli = q.plusieurs && !juste && bonnes.some(i => !choisis.includes(i)) ? " Les bonnes réponses sont encadrées en vert." : "";
    const debut = partiel ? `Validé : ${trouvees} sur ${bonnes.length}. ` : juste ? "Bravo ! " : "";
    document.getElementById("en-retour").innerHTML = `${debut}${echapper(q.explication || "")}${partiel ? `<br><small>${bonnes.length - trouvees > 1 ? "Les autres sont encadrées" : "L'autre est encadrée"} en vert.</small>` : ""}${!juste ? `<br><small>${reprise ? "Elle compte quand même." : "Cette question reviendra une fois à la fin."}${oubli}</small>` : ""}`;
    const s = document.getElementById("en-suite");
    s.textContent = E.i + 1 < E.file.length ? "Question suivante" : "Continuer";
    s.classList.remove("cache"); s.focus();
    s.onclick = () => { if (E.i + 1 < E.file.length) { E.i++; dessinerEnsemble(); window.scrollTo(0, 0); } else finirEnsemble(); };
  };
  if (q.plusieurs) {
    const v = document.getElementById("en-valider");
    boutons.forEach(b => b.onclick = () => {
      const on = b.getAttribute("aria-pressed") !== "true";
      b.setAttribute("aria-pressed", on ? "true" : "false"); b.classList.toggle("coche", on);
      v.disabled = !boutons.some(o => o.getAttribute("aria-pressed") === "true");
    });
    v.onclick = () => corriger(boutons.filter(b => b.getAttribute("aria-pressed") === "true").map(b => Number(b.dataset.i)));
  } else boutons.forEach(b => b.onclick = () => corriger([Number(b.dataset.i)]));
  window.scrollTo(0, 0);
}
function finirEnsemble() {
  const E = ensemble, x = E.x;
  marquerEnsemble(x);
  fermerEcranForme(); ensemble = null;
  const gagnees = Math.max(0, gainExp(x) - E.avantGain);
  session = null;
  ouvrirExpedition(x);
  if (E.avant < NB_ETAPES && etapeFinie(x, 2)) {
    feter({ etiquette: `Expédition · ${x.titre}`, titre: "Expédition terminée !",
            detail: `${E.premierCoup} question${E.premierCoup > 1 ? "s" : ""} sur ${E.total} réussie${E.premierCoup > 1 ? "s" : ""} du premier coup${gagnees ? ` · +${gagnees} empreintes` : ""}`,
            son: "badge", visuel: `<div class="fete-visuel rang exp-fete">${PAS_SVG}</div>` });
    if (gagnees) verifierOuverture();
  }
}
