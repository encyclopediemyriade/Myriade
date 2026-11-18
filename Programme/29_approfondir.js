// ==================================================================
// 29. APPROFONDIR À DEUX PORTES : « Découvrir » / « Me tester » (étape R250, 17/11/2026)
// ==================================================================
// Tâche Notion 36.07, choix d'Aubin du 17/11 à 13 h 48 : « 1A · 2B · 3B · 4A · 5A » (remplace « Aller plus loin » 7A).
//   • Deux portes égales pour tous, sur la carte d'Approfondir de l'expédition ; on change en route sans rien perdre
//     (chaque bonne réponse est gardée tout de suite ; un test quitté est mis de côté et se reprend).
//   • DÉCOUVRIR = lire d'abord : pour chaque espèce, un écran court « De plus près » (3 lignes à pictos), puis 2 ou 3 questions
//     sur ces lignes (comme « Sa vie ») ; la ligne de cases de l'espèce se remplit comme avant (ce qui est trouvé compte).
//   • ME TESTER = 3 questions par espèce, 20 au plus, 3 erreurs permises pour 20 (erreursPermisesDefi, 27) ; mêmes sujets
//     qu'Approfondir (mesures, nourriture, prédateurs, noms, statut…) mais plus difficile : pièges plus proches, espèces
//     mêlées, pas de lecture avant ; une erreur montre côte à côte votre réponse, la bonne, et la ligne de la fiche ;
//     la partie va au bout ; repêchage commun avec le défi de l'étape 1 (R249) ; une seule aide (« Retirer deux réponses ») ;
//     mis de côté et repris comme le défi de l'étape 1.
//   • Même récompense pour les deux portes : réussi = toutes « connues par cœur » (1 empreinte par espèce) ;
//     pas réussi = celles dont toutes les questions sont justes.
//   • Pas de question de comparaison entre deux espèces (réservées à l'étape 2, choix 18C).
// Écran : celui du défi (#vue-defiexp, mêmes styles « cdo » / « dfx »), état propre : apf.
// Sauvegarde : suivi.approfondiesDefi (espèces connues par cœur par un test : especeFaite(e, 4), 17),
//              suivi.approfTests[id] = { joues, reussi, meilleur, dernier: { bons, total } },
//              suivi.approfTestsEnCours[id] = le test mis de côté (questions, réponses, aide, repêchage).
const APPROF_DEUX_PORTES = true;     // false = l'ancien Approfondir (parties de 10 questions)
const APPROF_LIGNES = 3;             // lignes de « De plus près »
const APPROF_TEST_PAR_ESPECE = 3, APPROF_TEST_MAX = 20;
let apf = null;                      // la partie en cours (Découvrir ou Me tester)

// ---- Les sujets d'Approfondir d'une espèce : ce qui ne se voit pas (mesures, liens, noms, statut…) ----
const memoSujetsApprof = new Map();
function sujetsApprof(e) {
  if (memoSujetsApprof.has(e.nom_courant)) return memoSujetsApprof.get(e.nom_courant);
  const possibles = typeof champsPossibles === "function" ? champsPossibles(e) : [];
  const ordre = [...CHIFFRES_APPROFONDIR, ...CHAMPS_LIENS, ...CHAMPS_APPROFONDIR_PLUS];
  const l = ordre.filter(c => possibles.includes(c) && questionApprofSure(e, c, false) && questionApprofSure(e, c, true));
  memoSujetsApprof.set(e.nom_courant, l);
  return l;
}
function genreSujet(c) {
  if (CHIFFRES_APPROFONDIR.includes(c) || ["vitesse_max_kmh", "altitude_max_m"].includes(c)) return "mesure";
  return CHAMPS_LIENS.includes(c) ? "lien" : "plus";
}
// Des sujets variés : une mesure, un lien, un « plus », puis on recommence ; « d'abord » passe devant (ce qui reste à trouver)
function choisirSujets(e, n, dabord = [], sauf = []) {
  const tous = sujetsApprof(e).filter(c => !sauf.includes(c));
  const groupes = l => { const g = { mesure: [], lien: [], plus: [] }; for (const c of melanger(l.slice())) g[genreSujet(c)].push(c); return g; };
  const pris = [];
  for (const lot of [tous.filter(c => dabord.includes(c)), tous.filter(c => !dabord.includes(c))]) {
    const g = groupes(lot);
    while (pris.length < n && (g.mesure.length || g.lien.length || g.plus.length))
      for (const k of melanger(["mesure", "lien", "plus"])) if (pris.length < n && g[k].length) pris.push(g[k].shift());
  }
  return pris;
}

// ---- Une question d'Approfondir, sans passer par l'écran classique (03) : { espece, champ, texte, bonne, choix, ligne } ----
// dur = Me tester : pièges plus proches (chiffres plus serrés, valeurs que portent d'autres espèces de la même famille).
// Jamais une mauvaise réponse à moitié vraie : un chiffre que l'animal atteint réellement (dans sa fourchette) n'est pas un piège.
function interditsApprof(e, champ) {
  return (typeof PIEGES_INTERDITS === "undefined" ? [] : PIEGES_INTERDITS)
    .filter(p => p.nom_courant === e.nom_courant && p.colonne === champ).map(p => String(p.reponse_interdite).toLowerCase());
}
// Les pièges des chiffres sont tirés au hasard : on réessaie quelques fois avant de renoncer (altitude : seulement au-dessus)
function questionApprofSure(e, champ, dur) {
  for (let essai = 0; essai < 20; essai++) { const q = questionApprof(e, champ, dur); if (q) return q; }
  return null;
}
function questionApprof(e, champ, dur) {
  const q = QUESTIONS.find(z => z.champ === champ);
  if (!q || q.format || (q.pour && !q.pour(e))) return null;   // (empreinte, cri… : pas des sujets d'Approfondir)
  let texte;
  try { texte = typeof q.question === "function" ? q.question(e) : q.question; } catch (err) { return null; }
  if (!texte) return null;
  texte = accordGenre(texte, e);
  if (q.type === "nombre") {
    const brute = Number(valeurDe(e, q));
    if (!(brute > 0)) return null;
    const r = chiffresApprof(e, q, brute, dur);
    if (!r) return null;
    return { espece: e, champ, texte, bonne: q.affichage(r.bonne), choix: r.choix.map(n => q.affichage(n)), ligne: ligneApprof(e, champ, r.bonne) };
  }
  let bonne;
  try { bonne = q.tirer ? q.tirer(e) : valeurDe(e, q); } catch (err) { return null; }
  if (!estRenseigne(bonne) || bonne === "NA" || String(bonne).startsWith("NA")) return null;
  let pieges;
  try { pieges = q.piegesQcm ? piegesDuQcm(q, e, bonne) : autresValeurs(q, bonne, e); } catch (err) { return null; }
  const interdits = interditsApprof(e, champ), vus = new Set([String(bonne).toLowerCase()]);
  pieges = pieges.filter(v => estRenseigne(v) && !interdits.includes(String(v).toLowerCase()) && !vus.has(String(v).toLowerCase()) && vus.add(String(v).toLowerCase()));
  pieges = dur ? piegesProches(e, q, pieges) : melanger(pieges.slice());
  pieges = pieges.slice(0, 3);
  if (pieges.length < 2) return null;
  const choix = melanger([bonne, ...pieges]).map(v => majuscule(String(v)));
  if (new Set(choix.map(t => t.toLowerCase())).size < choix.length) return null;
  return { espece: e, champ, texte, bonne: majuscule(String(bonne)), choix, ligne: ligneApprof(e, champ, bonne) };
}
// Pièges « plus proches » : d'abord les valeurs que portent d'autres espèces de la même famille (le même « monde »)
function piegesProches(e, q, pieges) {
  const voisines = ESPECES.filter(o => o !== e && o.onglet === e.onglet);
  const score = v => { const t = String(v).toLowerCase(); return voisines.filter(o => String(o[q.champ] || "").toLowerCase().includes(t)).length; };
  return melanger(pieges.slice()).sort((a, b) => score(b) - score(a));
}
// Les chiffres : la bonne réponse arrondie comme ailleurs (arrondiJoli, 03), et 3 pièges ; plus serrés quand dur
function chiffresApprof(e, q, brute, dur) {
  const entier = Number.isInteger(brute);
  let bonne = brute < 1 && !q.pas ? brute : Math.max(q.pas || 0, arrondiJoli(brute, entier, q.pas)) || brute;
  if (q.affichage(bonne) !== q.affichage(brute) && brute < 1) bonne = brute;
  const f = q.fourchette ? q.fourchette(e) : null;
  const plafond = q.plafond && bonne <= q.plafond ? q.plafond : null;
  const vus = new Set([q.affichage(bonne)]);
  const loin = (a, b) => Math.abs(a - b) / Math.max(a, b) >= 0.15;
  const acceptable = n => n > 0 && n !== bonne && (!plafond || n <= plafond) && !vus.has(q.affichage(n))
    && !(f && n >= f[0] && n < bonne);                                    // jamais un chiffre que l'animal atteint (à moitié vrai)
  const pieges = [];
  const tirer = (de, a) => {
    for (let essai = 0; essai < 40; essai++) {
      const n = arrondiJoli(bonne * (de + Math.random() * (a - de)), entier, q.pas);
      if (acceptable(n) && loin(n, bonne) && pieges.every(p => loin(n, p))) { pieges.push(n); vus.add(q.affichage(n)); return true; }
    }
    return false;
  };
  const petits = Math.floor(Math.random() * 3);
  const [pDe, pA, gDe, gA] = dur ? [0.55, 0.82, 1.22, 1.8] : [0.35, 0.75, 1.35, 2.8];
  for (let i = 0; i < petits; i++) if (!tirer(pDe, pA)) break;
  while (pieges.length < 3 && tirer(gDe, gA)) { /* plus grands */ }
  while (pieges.length < 3 && tirer(dur ? 0.45 : 0.3, dur ? 0.85 : 0.8)) { /* plus petits */ }
  while (pieges.length < 3 && tirer(1.2, 5)) { /* plus loin au-dessus */ }
  // Dernier secours, pas à pas : au-dessus de la bonne, puis sous le bas de sa fourchette (altitude : 3 000 m, plafond 4 800 m)
  for (let m = 1; pieges.length < 3 && m <= 30; m++) for (const n0 of [bonne * (1 + 0.15 * m), f && f[0] > 0 ? f[0] * (1 - 0.12 * m) : -1]) {
    const n = n0 > 0 ? arrondiJoli(n0, entier, q.pas) : -1;
    if (pieges.length < 3 && n > 0 && acceptable(n) && loin(n, bonne) && pieges.every(p => loin(n, p))) { pieges.push(n); vus.add(q.affichage(n)); }
  }
  if (pieges.length < 2) return null;
  return { bonne, choix: [bonne, ...pieges.slice(0, 3)].sort((a, b) => a - b) };
}
// La ligne de la fiche : la phrase qui dit la réponse (les prédateurs en phrase depuis VF5)
function ligneApprof(e, champ, valeur) {
  const q = QUESTIONS.find(z => z.champ === champ);
  let t = "";
  try {
    if (champ === "predateurs" && typeof affPredateurs === "function") t = affPredateurs(e.predateurs, e);
    if (!t) t = q.explication(e, valeur);
  } catch (err) { t = ""; }
  return t ? accordGenre(t, e) : "";
}
// Les pictos des lignes : ceux de « Sa vie » (E2-7) pour ce qu'elle mange et ses prédateurs, des dessins à part pour les mesures
const PICTOS_APPROF = {
  taille_max_cm: '<path d="M3 15l12-12 6 6-12 12z"/><path d="M7 11l2 2M10 8l2 2M13 5l2 2"/>',
  envergure_max_cm: '<path d="M12 12c-3-4-6-5-9-5 1 3 3 5 9 5zM12 12c3-4 6-5 9-5-1 3-3 5-9 5zM12 12v5"/>',
  poids_max_kg: '<path d="M7 9h10l2 11H5z"/><circle cx="12" cy="6" r="2.5"/>',
  longevite_max_annees: '<path d="M7 3h10M7 21h10M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9"/>',
  vitesse_max_kmh: '<path d="M3 12h11M3 7h7M3 17h7M14 7l5 5-5 5"/>',
  altitude_max_m: '<path d="M3 20l6-10 4 6 3-4 5 8z"/>',
  statut_conservation: '<path d="M12 3l8 4v5c0 4-3 7.5-8 9-5-1.5-8-5-8-9V7z"/><path d="M12 8v5M12 16v.5"/>',
  noms: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
  cri: '<path d="M4 10v4M8 7v10M12 4v16M16 7v10M20 10v4"/>',
  plantes_liees: '<path d="M12 21V11M12 11c-5 0-7-3-7-7 5 0 7 3 7 7zM12 14c4 0 6-2.5 6-6-4 0-6 2.5-6 6z"/>'
};
function pictoApprof(champ, valeur) {
  if (champ === "proies" || champ === "predateurs") return pictoVie(champ, valeur);
  const cle = PICTOS_APPROF[champ] ? champ : /^nom_|periode_reproduction_nom/.test(champ) ? "noms" : champ === "verbe_cri" ? "cri" : null;
  if (!cle) return pictoVie(champ, valeur);
  return `<span class="sv-picto" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${PICTOS_APPROF[cle]}</svg></span>`;
}
function ligneDePlusPres(q) { return `<div class="sv-ligne">${pictoApprof(q.champ)}<span class="sv-texte">${echapper(q.ligne)}</span></div>`; }

// ---- La carte d'Approfondir sur la page de l'expédition : deux portes égales ----
function minutesDecouvrirApprof(x) { return Math.max(3, Math.round(x.liste.filter(e => sujetsApprof(e).length).length * 1.2)); }
function nbQuestionsTestApprof(x) { return [...nbTestParEspece(x).values()].reduce((a, b) => a + b, 0); }
function nbTestParEspece(x) {
  const nb = new Map(x.liste.filter(e => sujetsApprof(e).length).map(e => [e, Math.min(APPROF_TEST_PAR_ESPECE, sujetsApprof(e).length)]));
  let total = [...nb.values()].reduce((a, b) => a + b, 0);
  for (const e of melanger([...nb.keys()])) { if (total <= APPROF_TEST_MAX) break; if (nb.get(e) > 2) { nb.set(e, nb.get(e) - 1); total--; } }
  for (const e of melanger([...nb.keys()])) { if (total <= APPROF_TEST_MAX) break; if (nb.get(e) > 1) { nb.set(e, nb.get(e) - 1); total--; } }
  return nb;
}
function testApprofEnPause(x) {
  const s = suivi && suivi.approfTestsEnCours && suivi.approfTestsEnCours[x.id];
  return !!(s && s.questions && (s.questions.some(q => q.c === null) || (s.rep && s.rep.questions.some(q => q.c === null))));
}
function portesApprofondir(x, num) {
  const n = x.liste.length, faites = x.liste.filter(e => especeFaite(e, 4)).length, toutes = faites >= n;
  const st = suivi && suivi.approfTests && suivi.approfTests[x.id];
  const nq = nbQuestionsTestApprof(x), perm = erreursPermisesDefi(nq);
  let tester;
  if (testApprofEnPause(x)) {
    const s = suivi.approfTestsEnCours[x.id], total = s.questions.length, rep = s.questions.filter(q => q.c !== null).length;
    tester = porteTester("Me tester · en cours", `Reprendre où vous en étiez : ${rep} sur ${total}.`, "Reprendre le test").replace('data-porte="tester"', 'data-apf="reprendre"');
  } else tester = porteTester("Me tester", `${nq} questions, ${perm} erreurs permises. Chaque erreur est expliquée.`, `Environ ${minutesDefi(nq)} min · 1 aide`).replace('data-porte="tester"', 'data-apf="tester"');
  const decouvrir = porteDecouvrir(toutes ? "Revoir de plus près" : "Découvrir", "Chaque espèce de plus près : trois lignes à lire, puis deux ou trois questions.",
    toutes ? "Sans empreintes en double" : `Environ ${minutesDecouvrirApprof(x)} min`).replace('data-porte="decouvrir"', 'data-apf="decouvrir"');
  const bandeau = toutes ? `<p class="dfx-bandeau">Les ${n} espèces sont connues par cœur.</p>`
    : st && st.dernier && !st.reussi ? `<p class="dfx-bandeau">Dernier test : <b>${st.dernier.bons} sur ${st.dernier.total}</b>.${faites ? ` ${faites} espèce${faites > 1 ? "s" : ""} déjà connue${faites > 1 ? "s" : ""} par cœur.` : ""} Continuez comme vous préférez.</p>`
    : faites ? `<p class="dfx-bandeau">${faites} espèce${faites > 1 ? "s" : ""} sur ${n} connue${faites > 1 ? "s" : ""} par cœur. Continuez comme vous préférez.</p>`
    : `<p class="dfx-phrase">Ce qui ne se voit pas : leurs mesures, ce qu'elles mangent, qui les mange, leurs noms, leur statut. Deux façons d'y aller ; vous pourrez changer en route.</p>`;
  return `<div class="dfx-portes apf-portes${toutes ? " finie" : ""}"><div class="etiq-jeu">Étape ${num} · Approfondir <em class="exp-facultatif">Facultatif</em></div>
      ${bandeau}
      <div class="dfx-deux-portes">${decouvrir}${tester}</div>
      <small class="dfx-gain">+${gainEtape(x, 4)} ${PAS_SVG} · 1 par espèce connue par cœur, par l'une ou l'autre porte</small></div>`;
}
function brancherPortesApprof(zone, x) {
  zone.querySelectorAll("[data-apf]").forEach(b => b.onclick = () => {
    const p = b.dataset.apf;
    if (p === "decouvrir") lancerDecouvrirApprof(x);
    else if (p === "reprendre") reprendreTestApprof(x);
    else lancerTestApprof(x);
  });
}
// Ailleurs dans le jeu, « Approfondir » mène à cette carte (les deux portes), sans choisir à la place du joueur
function ouvrirCarteApprofondir(x) {
  ouvrirExpedition(x);
  setTimeout(() => { const c = document.querySelector("#vue-expedition .apf-portes"); if (c) { c.scrollIntoView({ block: "center" }); c.classList.add("eclaire"); } }, 60);
}
function lancementApprof(x) {
  suivi.derniereExpedition = suivi.derniereExpedition || {};
  suivi.derniereExpedition[x.territoire] = x.id;
  sauvegarder();
}
function retourExpApprof(x) { apf = null; arreterSonDefi(); ouvrirExpedition(x); }
function ronds(x, ici) {   // la bande des espèces : l'anneau se remplit (cases trouvées), ✓ quand elle est connue par cœur
  return `<div class="apf-ronds">${x.liste.map(e => { const but = butEspece(e, 4), part = but ? Math.min(100, Math.round(100 * trouvesEspece(e, 4) / but)) : 100;
    return `<span class="be-rond ${especeFaite(e, 4) ? "trouve" : "prog"}${e === ici ? " ici" : ""}${estRenseigne(e.photo) ? "" : " silh"}" style="--p:${part}" title="${echapper(e.nom_courant)}"><img src="${photoEsp(e)}" alt=""></span>`; }).join("")}</div>`;
}

// ==================================================================
// DÉCOUVRIR : « De plus près », puis 2 ou 3 questions, espèce par espèce
// ==================================================================
function lancerDecouvrirApprof(x) {
  if (!x) return;
  lancementApprof(x);
  const avec = x.liste.filter(e => sujetsApprof(e).length);
  const reste = avec.filter(e => !especeFaite(e, 4));
  const ordre = (reste.length ? reste : avec).slice().sort((a, b) => trouvesEspece(a, 4) / Math.max(1, butEspece(a, 4)) - trouvesEspece(b, 4) / Math.max(1, butEspece(b, 4)));
  if (!ordre.length) { afficherBulle("Rien de plus à découvrir ici pour l'instant"); return; }
  apf = { mode: "decouvrir", x, especes: ordre, k: 0, revoir: !reste.length, avantTrouves: Object.fromEntries(x.liste.map(e => [e.nom_courant, trouvesEspece(e, 4)])),
          avantGain: gainExp(x), avantApprofondie: approfondie(x), bons: 0, poses: 0 };
  montrer("defiexp");
  preparerEspeceDecouvrir();
}
function preparerEspeceDecouvrir() {
  const a = apf, e = a.especes[a.k];
  const manque = sujetsApprof(e).filter(c => nbBonnes(e, c) === 0);
  const sujets = choisirSujets(e, APPROF_LIGNES, manque);
  a.questions = sujets.map(c => questionApprofSure(e, c, false)).filter(Boolean);
  // 2 ou 3 questions sur ces lignes : celles qui restent à trouver d'abord ; au moins 2 quand il y a 2 lignes
  const aPoser = a.questions.filter(q => nbBonnes(e, q.champ) === 0);
  a.aPoser = (aPoser.length >= 2 ? aPoser : [...aPoser, ...a.questions.filter(q => !aPoser.includes(q))].slice(0, Math.min(2, a.questions.length))).slice(0, 3);
  a.aPoser = melanger(a.aPoser.slice());
  a.j = -1;
  afficherDePlusPres();
}
function enteteDecouvrir(e) {
  const a = apf;
  return `<div class="dfx-haut"><button class="cdo-quitter dfx-sortir" id="dfx-quitter" aria-label="Revenir à l'expédition (rien n'est perdu)">←</button>
      <span class="cdo-titre">Approfondir · Découvrir</span><span class="dfx-compte">${a.k + 1} / ${a.especes.length}</span></div>
    ${ronds(a.x, e)}`;
}
function afficherDePlusPres() {
  const a = apf, e = a.especes[a.k], zone = document.getElementById("vue-defiexp");
  zone.innerHTML = `<div class="cdo dfx apf">${enteteDecouvrir(e)}
      <div class="apf-espece"><span class="apf-ph">${celluleImage(e, true)}</span><span><small>De plus près</small><b>${echapper(e.nom_courant)}</b></span></div>
      <div class="sa-vie apf-lignes">${a.questions.map(ligneDePlusPres).join("")}</div>
      <p class="apf-annonce">Puis ${a.aPoser.length > 2 ? "trois questions" : a.aPoser.length > 1 ? "deux questions" : "une question"} sur ces lignes.</p>
      <div class="cdo-retour"><button class="cdo-suivant" id="dfx-suivant">Continuer</button></div></div>`;
  document.getElementById("dfx-quitter").onclick = () => retourExpApprof(a.x);
  document.getElementById("dfx-suivant").onclick = () => { a.j = 0; afficherQuestionApprof(); };
  window.scrollTo(0, 0);
}
// L'écran d'une question (Découvrir ou Me tester)
function afficherQuestionApprof() {
  const a = apf, test = a.mode === "tester", q = test ? qCouranteApprof(a) : a.aPoser[a.j], e = q.espece, zone = document.getElementById("vue-defiexp");
  const enRep = test && a.rep && a.rep.lance;
  const haut = test ? enteteTestApprof() : enteteDecouvrir(e);
  zone.innerHTML = `<div class="cdo dfx apf">${haut}
      <div class="apf-espece petite"><span class="apf-ph">${celluleImage(e, true)}</span><span><small>${test ? (enRep ? "Repêchage" : "Me tester") : `Question ${a.j + 1} sur ${a.aPoser.length}`}</small><b>${echapper(e.nom_courant)}</b></span></div>
      <p class="cdo-q apf-q">${echapper(q.texte)}</p>
      <div class="cdo-noms apf-choix">${q.choix.map((t, k) => `<button class="cdo-nom${(q.retires || []).includes(t) ? " retire" : ""}" data-k="${k}"${(q.retires || []).includes(t) ? " disabled" : ""}><span>${echapper(t)}</span></button>`).join("")}</div>
      <div class="cdo-retour" id="dfx-retour"></div>
      ${test && !enRep ? `<div class="dfx-aides" id="dfx-aides"><small>Votre aide</small><button class="cdo-second" id="dfx-retirer"${a.aide ? "" : " disabled"}>Retirer deux réponses</button></div>` : ""}
    </div>`;
  zone.querySelectorAll(".apf-choix .cdo-nom").forEach(b => b.onclick = () => repondreApprof(q.choix[+b.dataset.k], b));
  document.getElementById("dfx-quitter").onclick = () => test ? mettreTestApprofDeCote() : retourExpApprof(a.x);
  const ret = document.getElementById("dfx-retirer");
  if (ret) ret.onclick = () => { if (!a.aide || q.choisi !== null) return; a.aide = false;
    q.retires = melanger(q.choix.filter(t => t !== q.bonne)).slice(0, Math.max(1, Math.min(2, q.choix.length - 2))); sauverTestApprof(); afficherQuestionApprof(); };
  window.scrollTo(0, 0);
}
function repondreApprof(choisie, bouton) {
  const a = apf, test = a.mode === "tester", q = test ? qCouranteApprof(a) : a.aPoser[a.j];
  if (!a || (test && q.choisi !== null) || (!test && q.repondu)) return;
  const enRep = test && a.rep && a.rep.lance;
  const juste = choisie === q.bonne, e = q.espece;
  if (test) q.choisi = choisie; else q.repondu = true;
  try { jouerSon(juste ? "bonne" : "mauvaise"); } catch (err) { /* sans son */ }
  if (juste) { acquerir(e, q.champ); sauvegarder(); }                        // ce qui est trouvé compte tout de suite, par l'une ou l'autre porte
  else if (!test && typeof noterEchec === "function") noterEchec(e, q.champ);
  if (!test) { a.poses++; if (juste) a.bons++; }
  const zone = document.getElementById("vue-defiexp");
  zone.querySelectorAll(".apf-choix .cdo-nom").forEach((b, k) => { b.disabled = true;
    if (q.choix[k] === q.bonne) b.classList.add("bon"); else if (b === bouton) b.classList.add("faux"); });
  const aides = document.getElementById("dfx-aides"); if (aides) aides.remove();
  if (test) sauverTestApprof();
  let fin, texteSuite;
  if (test) {
    fin = enRep ? (a.rep.i >= a.rep.questions.length - 1 || erreursTestApprof(a) <= erreursPermisesDefi(a.questions.length)) : a.i >= a.questions.length - 1;
    texteSuite = fin ? "Voir le résultat" : "Question suivante";
  } else {
    fin = a.j >= a.aPoser.length - 1;
    texteSuite = !fin ? "Question suivante" : a.k >= a.especes.length - 1 ? "Voir le bilan" : "Espèce suivante";
  }
  const suivant = `<button class="cdo-suivant" id="dfx-suivant">${texteSuite}</button>`;
  const retour = document.getElementById("dfx-retour");
  if (juste) retour.innerHTML = `${enRep ? `<p class="dfx-efface">Une erreur effacée.</p>` : ""}${!test && trouvesEspece(e, 4) > (a.avantTrouves[e.nom_courant] || 0) && nbBonnes(e, q.champ) === 1 ? `<p class="apf-plus">+1 pour ${echapper(nomAvecArticle(e))}</p>` : ""}${suivant}`;
  else if (test) retour.innerHTML = `<div class="dfx-erreur apf-erreur"><small class="dfx-pas">Pas cette fois</small>
      <div class="apf-duo"><div class="ko"><small>Votre réponse</small><b>${echapper(choisie)}</b></div><div class="ok"><small>La bonne réponse</small><b>${echapper(q.bonne)}</b></div></div>
      ${q.ligne ? `<div class="sv-rappel"><div class="sv-rappel-titre">Sur sa fiche</div>${ligneDePlusPres(q)}</div>` : ""}</div>${suivant}`;
  else retour.innerHTML = `${q.ligne ? `<div class="sv-rappel"><div class="sv-rappel-titre">De plus près</div>${ligneDePlusPres(q)}</div>` : ""}${suivant}`;
  if (test) { const barre = zone.querySelector(".dfx-barre"); if (barre) barre.outerHTML = enteteTestApprof().match(/<div class="dfx-barre[^"]*"[^>]*>.*<\/div>$/s)[0]; }
  else { const r = zone.querySelector(".apf-ronds"); if (r) r.outerHTML = ronds(a.x, e); }
  document.getElementById("dfx-suivant").onclick = () => {
    if (test) { if (fin) finTestApprof(); else { if (enRep) a.rep.i++; else a.i++; sauverTestApprof(); afficherQuestionApprof(); } return; }
    if (!fin) { a.j++; afficherQuestionApprof(); }
    else if (a.k < a.especes.length - 1) { a.k++; preparerEspeceDecouvrir(); }
    else finDecouvrirApprof();
  };
  const btn = document.getElementById("dfx-suivant");
  if (typeof montrerSuiteJeu === "function") montrerSuiteJeu(btn, btn.getBoundingClientRect());
}
function finDecouvrirApprof() {
  const a = apf, x = a.x, zone = document.getElementById("vue-defiexp");
  const { av, lignes, n } = lignesGagnees(x, { avantTrouves: a.avantTrouves }, 4);
  const empreintes = Math.max(0, gainExp(x) - a.avantGain), toutes = approfondie(x);
  const reste = x.liste.filter(e => sujetsApprof(e).length && !especeFaite(e, 4)).length;
  zone.innerHTML = `<div class="cdo dfx dfx-fin apf-fin">
      <div class="dfx-haut"><button class="cdo-quitter dfx-sortir" id="dfx-quitter" aria-label="Revenir à l'expédition">←</button><span class="cdo-titre">Approfondir · Découvrir</span></div>
      <h2>${toutes && !a.avantApprofondie ? "Toutes connues par cœur" : n ? `+${n} chose${n > 1 ? "s" : ""} découverte${n > 1 ? "s" : ""}` : "Partie terminée"}</h2>
      <p class="cdo-sous">${a.bons} bonne${a.bons > 1 ? "s" : ""} réponse${a.bons > 1 ? "s" : ""} sur ${a.poses}</p>
      ${lignes.length ? `<div class="fiches-exp">${lignes.map(e => ligneFiche(e, av[e.nom_courant], 4, x)).join("")}</div><small class="fiche-aide">En ocre : ce que vous venez de trouver.</small>` : ""}
      <ul class="dfx-lignes">
        <li>${toutes ? `Les ${x.liste.length} espèces sont <b>connues par cœur</b>.` : `${x.liste.length - reste} espèce${x.liste.length - reste > 1 ? "s" : ""} sur ${x.liste.length} connue${x.liste.length - reste > 1 ? "s" : ""} par cœur · ${minuscule(texteResteApprofondir(x))}.`}</li>
        ${empreintes ? `<li>+${empreintes} empreinte${empreintes > 1 ? "s" : ""} : 1 par espèce connue par cœur.</li>` : ""}
      </ul>
      ${toutes ? "" : `<div class="dfx-boutons"><button class="cdo-second" id="apf-tester">Me tester plutôt</button><button class="cdo-suivant" id="apf-encore">Continuer à découvrir</button></div>`}
      <button class="${toutes ? "cdo-suivant" : "dfx-lien"}" id="dfx-voir">${toutes ? "Revenir à l'expédition" : "Plus tard · revenir à l'expédition"}</button></div>`;
  document.getElementById("dfx-quitter").onclick = document.getElementById("dfx-voir").onclick = () => retourExpApprof(x);
  const encore = document.getElementById("apf-encore"); if (encore) encore.onclick = () => lancerDecouvrirApprof(x);
  const tester = document.getElementById("apf-tester"); if (tester) tester.onclick = () => testApprofEnPause(x) ? reprendreTestApprof(x) : lancerTestApprof(x);
  window.scrollTo(0, 0);
  feterApprof(x, empreintes, a.avantApprofondie);
}
function feterApprof(x, empreintes, avantApprofondie) {
  if (!avantApprofondie && approfondie(x))
    feter({ etiquette: `Expédition · ${x.titre}`, titre: "Approfondir terminé", detail: empreintes ? `+${empreintes} empreinte${empreintes > 1 ? "s" : ""}` : "", son: "badge",
            visuel: `<div class="fete-visuel rang exp-fete">${PAS_SVG}</div>` });
  else if (empreintes) setTimeout(() => afficherBulle(`+${empreintes} empreinte${empreintes > 1 ? "s" : ""}`), 600);
  if (empreintes && typeof verifierOuverture === "function") verifierOuverture();
  if (typeof verifierBadgesBientot === "function") verifierBadgesBientot();
}

// ==================================================================
// ME TESTER : 3 questions par espèce, 20 au plus, 3 erreurs permises pour 20, repêchage, une aide
// ==================================================================
function ordreTestApprof(nb) {
  const tours = [];
  for (let k = 0; k < APPROF_TEST_PAR_ESPECE; k++) tours.push(...melanger([...nb.keys()].filter(e => nb.get(e) > k)));
  for (let k = 1; k < tours.length; k++) if (tours[k] === tours[k - 1]) {
    const j = tours.findIndex((e, m) => m !== k && e !== tours[k - 1] && (m === 0 || tours[m - 1] !== tours[k]) && (m + 1 >= tours.length || tours[m + 1] !== tours[k]));
    if (j >= 0) [tours[k], tours[j]] = [tours[j], tours[k]];
  }
  return tours;
}
function lancerTestApprof(x) {
  if (!x) return;
  if (suivi.approfTestsEnCours) delete suivi.approfTestsEnCours[x.id];   // un nouveau test remplace celui mis de côté
  lancementApprof(x);
  const nb = nbTestParEspece(x), sujets = new Map([...nb.keys()].map(e => [e, choisirSujets(e, nb.get(e))]));
  const questions = ordreTestApprof(nb).map(e => questionApprofSure(e, sujets.get(e).shift(), true)).filter(Boolean);
  questions.forEach(q => { q.choisi = null; q.retires = []; });
  if (!questions.length) { afficherBulle("Rien à tester ici pour l'instant"); return; }
  apf = { mode: "tester", x, questions, i: 0, aide: true, rep: null, avantGain: gainExp(x), avantApprofondie: approfondie(x) };
  sauverTestApprof();
  montrer("defiexp");
  afficherQuestionApprof();
}
function qCouranteApprof(a) { return a.rep && a.rep.lance ? a.rep.questions[a.rep.i] : a.questions[a.i]; }
function erreursTestApprof(a) {
  return a.questions.filter(q => q.choisi !== null && q.choisi !== q.bonne).length
    - (a.rep ? a.rep.questions.filter(q => q.choisi !== null && q.choisi === q.bonne).length : 0);
}
function enteteTestApprof() {
  const a = apf;
  if (a.rep && a.rep.lance) return enteteRepechage(`Approfondir · ${a.x.titre}`, a.rep.questions.map(q => ({ repondu: q.choisi !== null, juste: q.choisi === q.bonne })), a.rep.i);
  const cases = a.questions.map((q, k) => `<i class="${q.choisi !== null ? (q.choisi === q.bonne ? "ok" : "ko") : k === a.i ? "cur" : ""}"></i>`).join("");
  return `<div class="dfx-haut"><button class="cdo-quitter dfx-sortir" id="dfx-quitter" aria-label="Revenir à l'expédition (le test est gardé)">←</button>
      <span class="cdo-titre">Me tester · Approfondir</span><span class="dfx-compte">${Math.min(a.i + 1, a.questions.length)} / ${a.questions.length}</span></div>
    <div class="dfx-barre" style="grid-template-columns:repeat(${a.questions.length},1fr)">${cases}</div>`;
}
// Le test est gardé à chaque réponse ; « ← » (ou la touche retour) le met de côté, « Reprendre » repart de la même question
function plateQ(q) { return { e: q.espece.nom_courant, h: q.champ, t: q.texte, b: q.bonne, ch: q.choix, l: q.ligne, c: q.choisi, r: q.retires || [] }; }
function relireQ(o) { const e = especeParNom(o.e); return e ? { espece: e, champ: o.h, texte: o.t, bonne: o.b, choix: o.ch, ligne: o.l, choisi: o.c, retires: o.r || [] } : null; }
function sauverTestApprof() {
  const a = apf;
  if (!a || a.mode !== "tester" || !suivi) return;
  suivi.approfTestsEnCours = suivi.approfTestsEnCours || {};
  suivi.approfTestsEnCours[a.x.id] = { i: a.i, aide: a.aide, questions: a.questions.map(plateQ),
    rep: a.rep ? { i: a.rep.i, lance: !!a.rep.lance, questions: a.rep.questions.map(plateQ) } : null };
  sauvegarder();
}
function mettreTestApprofDeCote() {
  const a = apf; if (!a) return;
  sauverTestApprof();
  const x = a.x;
  retourExpApprof(x);
  setTimeout(() => afficherBulle("Test mis de côté · vous pourrez le reprendre"), 250);
}
function reprendreTestApprof(x) {
  const s = suivi && suivi.approfTestsEnCours && suivi.approfTestsEnCours[x.id];
  if (!s) { lancerTestApprof(x); return; }
  const questions = s.questions.map(relireQ), repQ = s.rep ? s.rep.questions.map(relireQ) : null;
  if (questions.some(q => !q) || (repQ && repQ.some(q => !q))) { delete suivi.approfTestsEnCours[x.id]; lancerTestApprof(x); return; }   // données changées
  const i = questions.findIndex(q => q.choisi === null);
  apf = { mode: "tester", x, questions, i: i < 0 ? questions.length - 1 : i, aide: s.aide !== false, rep: null, avantGain: gainExp(x), avantApprofondie: approfondie(x) };
  if (repQ) { const j = repQ.findIndex(q => q.choisi === null); apf.rep = { questions: repQ, i: j < 0 ? repQ.length - 1 : j, lance: !!s.rep.lance }; }
  montrer("defiexp");
  if (apf.rep && !apf.rep.lance) { annonceRepechageApprof(); return; }
  if (i < 0 && !apf.rep) { finTestApprof(); return; }
  afficherQuestionApprof();
}
// R249 : le repêchage, « par un autre chemin » = un autre sujet de la même espèce (sinon le même sujet, d'autres réponses)
function lancerRepechageApprof(a) {
  const especes = especesRepechage(a.questions.map(q => ({ espece: q.espece, juste: q.choisi === q.bonne })));
  const rq = especes.map(e => {
    const deja = a.questions.filter(q => q.espece === e).map(q => q.champ);
    const autre = choisirSujets(e, 1, [], deja)[0];
    const manquee = a.questions.filter(q => q.espece === e && q.choisi !== q.bonne).pop();
    return questionApprofSure(e, autre || (manquee && manquee.champ), true);
  }).filter(Boolean);
  rq.forEach(q => { q.choisi = null; q.retires = []; });
  a.rep = { questions: rq, i: 0, lance: false };
  sauverTestApprof();
  if (!rq.length) { finTestApprof(); return; }
  annonceRepechageApprof();
}
function annonceRepechageApprof() {
  const a = apf, zone = document.getElementById("vue-defiexp");
  zone.innerHTML = ecranRepechage(`Approfondir · ${a.x.titre}`, erreursTestApprof(a), erreursPermisesDefi(a.questions.length), a.rep.questions.length);
  document.getElementById("dfx-quitter").onclick = mettreTestApprofDeCote;
  document.getElementById("dfx-rep-go").onclick = () => { a.rep.lance = true; sauverTestApprof(); afficherQuestionApprof(); };
  document.getElementById("dfx-rep-passer").onclick = () => { a.rep.passe = true; finTestApprof(); };
  window.scrollTo(0, 0);
}
function finTestApprof() {
  const a = apf, x = a.x, total = a.questions.length;
  const bons = a.questions.filter(q => q.choisi === q.bonne).length, perm = erreursPermisesDefi(total);
  if (!a.rep && repechageNecessaire(total - bons, perm)) { lancerRepechageApprof(a); return; }
  const reussi = erreursTestApprof(a) <= perm;
  const repeche = !!(a.rep && a.rep.questions.some(q => q.choisi === q.bonne));
  // Par espèce : toutes ses questions justes (une bonne réponse au repêchage efface une erreur de son espèce)
  const c = new Map();
  for (const q of a.questions) { const k = c.get(q.espece) || { poses: 0, bons: 0 }; k.poses++; if (q.choisi === q.bonne) k.bons++; c.set(q.espece, k); }
  if (a.rep) for (const q of a.rep.questions) if (q.choisi === q.bonne && c.get(q.espece)) { const k = c.get(q.espece); k.bons = Math.min(k.poses, k.bons + 1); }
  const gagnees = [...c.keys()].filter(e => reussi || c.get(e).bons === c.get(e).poses);
  suivi.approfondiesDefi = suivi.approfondiesDefi || [];
  for (const e of gagnees) if (!suivi.approfondiesDefi.includes(e.nom_courant)) suivi.approfondiesDefi.push(e.nom_courant);
  if (suivi.approfTestsEnCours) delete suivi.approfTestsEnCours[x.id];
  suivi.approfTests = suivi.approfTests || {};
  const st = suivi.approfTests[x.id] = suivi.approfTests[x.id] || { joues: 0, reussi: false, meilleur: 0 };
  st.joues++; st.reussi = st.reussi || reussi; st.meilleur = Math.max(st.meilleur || 0, bons); st.dernier = { bons, total };
  sauvegarder();
  const empreintes = Math.max(0, gainExp(x) - a.avantGain);
  const zone = document.getElementById("vue-defiexp");
  const vignette = e => `<img src="${photoMini(photoEsp(e))}" alt="${echapper(e.nom_courant)}">`;
  const haut = `<div class="dfx-haut"><button class="cdo-quitter dfx-sortir" id="dfx-quitter" aria-label="Revenir à l'expédition">←</button><span class="cdo-titre">Me tester · Approfondir</span></div>`;
  if (reussi) {
    zone.innerHTML = `<div class="cdo dfx dfx-fin apf-fin">${haut}
        <div class="dfx-medaille" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>
        <h2>Test réussi</h2>
        <p class="cdo-sous">${bons} bonnes réponses sur ${total}${repeche ? " · repêché" : ""}</p>
        <div class="dfx-ronds">${x.liste.map(vignette).join("")}</div>
        <ul class="dfx-lignes">
          <li>Les ${x.liste.length} espèces sont <b>connues par cœur</b>.</li>
          <li>${empreintes ? `+${empreintes} empreinte${empreintes > 1 ? "s" : ""} : 1 par espèce connue par cœur.` : "Vos empreintes d'Approfondir étaient déjà gagnées."}</li>
        </ul>
        <button class="cdo-suivant" id="dfx-voir">Revenir à l'expédition</button></div>`;
  } else {
    const gardees = x.liste.filter(e => especeFaite(e, 4));
    const aRevoir = x.liste.filter(e => !especeFaite(e, 4) && c.has(e));
    const ligneRevoir = e => { const q = a.questions.filter(z => z.espece === e && z.choisi !== z.bonne).pop(); return q && q.ligne ? q.ligne : ""; };
    zone.innerHTML = `<div class="cdo dfx dfx-fin apf-fin">${haut}
        <h2>${erreursTestApprof(a) <= perm + 2 ? "Presque" : "Pas encore"}</h2>
        <p class="cdo-sous">${bons} bonnes réponses sur ${total} · il en faut ${total - perm}</p>
        ${gardees.length ? `<div class="dfx-groupe ok"><small>Connues par cœur · gardées</small><div class="dfx-pastilles">${gardees.map(e => `<span>${vignette(e)}${echapper(e.nom_courant)}</span>`).join("")}</div></div>` : ""}
        ${aRevoir.length ? `<div class="dfx-groupe"><small>À revoir</small><ul class="dfx-revoir">${aRevoir.map(e => `<li>${vignette(e)}<span><b>${echapper(e.nom_courant)}</b>${ligneRevoir(e) ? `<small>${echapper(ligneRevoir(e))}</small>` : ""}</span></li>`).join("")}</ul></div>` : ""}
        ${empreintes ? `<p class="dfx-deux">+${empreintes} empreinte${empreintes > 1 ? "s" : ""} : 1 par espèce connue par cœur.</p>` : ""}
        <p class="dfx-deux">Deux façons de continuer :</p>
        <div class="dfx-boutons"><button class="cdo-second" id="apf-decouvrir">Découvrir de plus près</button><button class="cdo-suivant" id="apf-rejouer">Rejouer le test</button></div>
        <button class="dfx-lien" id="dfx-voir">Plus tard · revenir à l'expédition</button></div>`;
    document.getElementById("apf-decouvrir").onclick = () => lancerDecouvrirApprof(x);
    document.getElementById("apf-rejouer").onclick = () => lancerTestApprof(x);
  }
  document.getElementById("dfx-quitter").onclick = document.getElementById("dfx-voir").onclick = () => retourExpApprof(x);
  window.scrollTo(0, 0);
  feterApprof(x, empreintes, a.avantApprofondie);
}
