// ==================================================================
// 24. COUP D'ŒIL : « une photo, 4 noms » (étape R191, 13/11/2026)
// ==================================================================
// Idée d'Aubin (note 12 du 12/11, n° 25.5) ; choix du 13/11 (artefact « Jeu une photo, 4 noms », série 1) :
//   • critère : un jeu court et vif pour s'entraîner à reconnaître les espèces déjà rencontrées ; des pièges qu'on pourrait
//     vraiment confondre ; les autres formes (femelle, jeune, hiver) ; une erreur n'est jamais punie (on voit la bonne
//     espèce, celle qu'on a choisie et, s'il existe, le repère qui les sépare) ; 2 à 3 minutes ; jamais enfantin ;
//   • écran A (les 4 noms en carré) ; 10 photos, score sur 10, record de série ; pas de chronomètre ;
//   • les espèces déjà rencontrées (au moins 8, sinon le jeu dit combien il en manque) ;
//   • pièges : les sosies (« À ne pas confondre ») d'abord, puis le même groupe, puis le même milieu, puis la même famille ;
//     les pièges peuvent être des espèces pas encore rencontrées du territoire ;
//   • les 2e et 3e photos (femelle, jeune…) avec leur étiquette ;
//   • rapporte : les records, et une photo bien reconnue compte pour l'espèce (acquerir : la photo, comme dans une Rencontre).
// Le jeu a son propre écran (#vue-coupdoeil) et son propre état (coup) : il ne passe pas par les défis (07).
const COUP_PHOTOS = 10;
const COUP_MINIMUM = 8;
let coup = null;   // la partie en cours

JEUX.coupdoeil = { nom: "Coup d'œil", detail: `${COUP_PHOTOS} photos` };
PICTOS.coupdoeil = '<path d="M2.5 12 C5 7.5 8.5 5.5 12 5.5 S19 7.5 21.5 12 C19 16.5 15.5 18.5 12 18.5 S5 16.5 2.5 12 Z"/><circle cx="12" cy="12" r="3.2"/>';
if (!JEUX_ARCADE.includes("coupdoeil")) JEUX_ARCADE.splice(1, 0, "coupdoeil");
REGLES_ARCADE.coupdoeil = `Une photo, quatre noms : reconnaissez les espèces déjà rencontrées, même en femelle ou en jeune. ${COUP_PHOTOS} photos par partie.`;
REGLES_COURTES.coupdoeil = "Une photo, quatre noms : qui est-ce ?";

// Les espèces jouables : déjà rencontrées (reconnues sur leur photo), avec une photo
// Étape R191b (demande d'Aubin, 13/11 : « un bouton pour débloquer toutes les espèces sur la page des autres jeux ») :
//   l'interrupteur « Toutes les espèces » (suivi.coupToutes) ouvre le jeu à toutes les espèces du choix, sans les marquer
//   comme rencontrées : une espèce pas encore rencontrée bien reconnue ici ne compte pas pour elle (la vraie partie reste intacte).
function coupToutes() { return !!(suivi && suivi.coupToutes); }
function especesCoupDoeil(especes) { return especes.filter(e => estRenseigne(e.photo) && (coupToutes() || estReconnue(e))); }
function possibiliteCoupDoeil(especes) {
  const n = especesCoupDoeil(especes).length;
  if (n >= COUP_MINIMUM) return { possible: true };
  const m = COUP_MINIMUM - n;
  return { possible: false, raison: `rencontrez encore ${m} espèce${m > 1 ? "s" : ""} pour y jouer` };
}
function metaCoupDoeil() {
  const c = suivi.coupDoeil || {};
  if (c.record) return `Record : <b>${c.record} / ${COUP_PHOTOS}</b>${c.serieMax ? ` · ${c.serieMax} d'affilée` : ""}`;
  return c.parties ? `${c.parties} partie${c.parties > 1 ? "s" : ""} jouée${c.parties > 1 ? "s" : ""}` : "Pas encore joué";
}

// Les pièges d'une espèce, dans l'ordre : sosies, même groupe, même milieu, même famille ; parmi toutes les espèces
// du choix (rencontrées ou non), jamais deux noms identiques, jamais l'espèce elle-même.
function piegesCoupDoeil(e, pool) {
  const autres = pool.filter(x => x !== e && x.nom_courant !== e.nom_courant && estRenseigne(x.photo));
  const sosies = typeof sosiesDe === "function" ? sosiesDe(e).filter(x => autres.includes(x)) : [];
  const groupe = autres.filter(x => x.onglet === e.onglet && x.nom_affichage_groupe && x.nom_affichage_groupe === e.nom_affichage_groupe);
  // Hors des sosies et du groupe, une taille comparable (au plus 3 fois plus grande ou plus petite) : pas de chauve-souris
  // pour un lynx (les pièges restent dans le « monde » de l'espèce)
  const t = tailleCoup(e);
  const proche = x => { const u = tailleCoup(x); return !t || !u || Math.max(t, u) / Math.min(t, u) <= 3; };
  const milieu = autres.filter(x => x.onglet === e.onglet && estRenseigne(e.milieu_principal) && x.milieu_principal === e.milieu_principal && proche(x));
  const famille = autres.filter(x => x.onglet === e.onglet && proche(x));
  const choisis = [];
  for (const liste of [melanger(sosies), melanger(groupe), melanger(milieu), melanger(famille), melanger(autres.filter(x => x.onglet === e.onglet)), melanger(autres)]) {
    for (const x of liste) {
      if (choisis.length >= 3) break;
      if (!choisis.includes(x) && !choisis.some(c => c.nom_courant === x.nom_courant)) choisis.push(x);
    }
    if (choisis.length >= 3) break;
  }
  return choisis;
}
function tailleCoup(e) {
  // toutes les colonnes de taille en cm (taille_min_cm, taille_max_cm_male, …) : la plus grande valeur
  const v = Object.keys(e).filter(k => /^taille_.*cm/.test(k)).map(k => parseFloat(e[k])).filter(x => isFinite(x) && x > 0);
  return v.length ? Math.max(...v) : 0;
}
// Une photo de l'espèce : la principale ou une autre forme (avec son étiquette) ; « autre vue » sans étiquette
function photoCoupDoeil(e, dejaVues) {
  const ph = photosDe(e).filter(p => !dejaVues.includes(p.src));
  const liste = ph.length ? ph : photosDe(e);
  return liste[Math.floor(Math.random() * liste.length)];
}

function lancerCoupDoeil(seules) {
  const T = typeof territoiresArcade === "function" ? territoiresArcade() : [territoireActif()];
  const F = typeof famillesArcade === "function" ? famillesArcade(T) : famillesDe(T);
  const d = construireDefi(T, F);
  if (!d) { afficherBulle("Aucune espèce avec ce choix"); return; }
  const jouables = especesCoupDoeil(d.especes);
  if (!seules && jouables.length < COUP_MINIMUM) { afficherBulle(conditionJeu("coupdoeil", possibiliteCoupDoeil(d.especes))); return; }
  // Les espèces de la partie : les moins vues dans ce jeu d'abord, puis au hasard ; pas deux fois la même si possible
  const vues = (suivi.coupDoeil && suivi.coupDoeil.vues) || {};
  let tirage;
  if (seules && seules.length) tirage = seules.slice();
  else {
    const ordre = melanger(jouables).sort((a, b) => (vues[a.nom_courant] || 0) - (vues[b.nom_courant] || 0));
    tirage = [];
    while (tirage.length < COUP_PHOTOS) tirage.push(...ordre.slice(0, COUP_PHOTOS - tirage.length));
    tirage = melanger(tirage);
    for (let k = 1; k < tirage.length; k++) if (tirage[k] === tirage[k - 1]) {          // jamais deux fois de suite
      const j = tirage.findIndex((x, m) => m > k && x !== tirage[k - 1] && x !== tirage[m - 1]);
      if (j > 0) [tirage[k], tirage[j]] = [tirage[j], tirage[k]];
    }
  }
  const srcVues = [];
  const tours = tirage.map(e => {
    const p = photoCoupDoeil(e, srcVues); srcVues.push(p.src);
    const noms = melanger([e, ...piegesCoupDoeil(e, d.especes)]);
    return { espece: e, photo: p, noms, choix: null };
  });
  coup = { tours, i: 0, bons: 0, serie: 0, serieMax: 0, revoir: !!seules, d };
  depuisArcade = true;
  montrer("coupdoeil");
  afficherTourCoupDoeil();
}

function enteteCoupDoeil() {
  const pts = coup.tours.map((t, k) => `<i class="${t.choix ? (t.choix === t.espece ? "ok" : "ko") : ""}${k === coup.i && !t.choix ? " cur" : ""}"></i>`).join("");
  return `<div class="cdo-haut"><button class="cdo-quitter" id="cdo-quitter">← Jeux</button>`
    + `<span class="cdo-titre">Coup d'œil · ${Math.min(coup.i + 1, coup.tours.length)} / ${coup.tours.length}</span><span class="cdo-pts">${pts}</span></div>`;
}
function afficherTourCoupDoeil() {
  const zone = document.getElementById("vue-coupdoeil");
  const t = coup.tours[coup.i];
  const etiquette = etiquetteForme(t.photo.sujet);
  zone.innerHTML = `<div class="cdo">${enteteCoupDoeil()}
      <div class="cdo-photo">${imagePhoto(t.photo.src, "Qui est-ce ?", false)}${etiquette ? `<small class="cdo-forme">${etiquette.replace(/^(La|Le|L')\s?/, "").replace(/^./, c => c.toUpperCase())}</small>` : ""}</div>
      <p class="cdo-q">Qui est-ce ?</p>
      <div class="cdo-noms">${t.noms.map((e, k) => `<button class="cdo-nom" data-k="${k}">${echapper(e.nom_courant)}</button>`).join("")}</div>
      <div class="cdo-retour" id="cdo-retour"></div>
    </div>`;
  zone.querySelectorAll(".cdo-nom").forEach(b => b.onclick = () => repondreCoupDoeil(t.noms[+b.dataset.k], b));
  document.getElementById("cdo-quitter").onclick = () => { coup = null; montrer("arcade"); };
  window.scrollTo(0, 0);
}
function repondreCoupDoeil(choisie, bouton) {
  const t = coup.tours[coup.i];
  if (t.choix) return;
  t.choix = choisie;
  const juste = choisie === t.espece;
  const zone = document.getElementById("vue-coupdoeil");
  zone.querySelectorAll(".cdo-nom").forEach((b, k) => {
    b.disabled = true;
    if (t.noms[k] === t.espece) b.classList.add("bon");
    else if (b === bouton) b.classList.add("faux");
  });
  suivi.coupDoeil = suivi.coupDoeil || { parties: 0, record: 0, serieMax: 0, vues: {} };
  suivi.coupDoeil.vues = suivi.coupDoeil.vues || {};
  suivi.coupDoeil.vues[t.espece.nom_courant] = (suivi.coupDoeil.vues[t.espece.nom_courant] || 0) + 1;
  if (juste) {
    coup.bons++; coup.serie++; coup.serieMax = Math.max(coup.serieMax, coup.serie);
    if (estReconnue(t.espece)) acquerir(t.espece, IDENTIFICATION);   // choix d'Aubin : une photo bien reconnue compte pour l'espèce (R191b : seulement si déjà rencontrée)
  } else {
    coup.serie = 0;
    if (estReconnue(t.espece)) noterEchec(t.espece, IDENTIFICATION);
  }
  sauvegarder();
  const retour = document.getElementById("cdo-retour");
  const fin = coup.i >= coup.tours.length - 1;
  const suivant = `<button class="cdo-suivant" id="cdo-suivant">${fin ? "Voir le résultat" : "Photo suivante →"}</button>`;
  if (juste) retour.innerHTML = `<p class="cdo-bravo">${echapper(t.espece.nom_courant)}${coup.serie >= 3 ? ` · ${coup.serie} d'affilée` : ""}</p>${suivant}`;
  else retour.innerHTML = `<div class="cdo-erreur"><b>C'est ${echapper(nomAvecArticle(t.espece))}.</b>
      <div class="cdo-duo"><figure>${celluleImage(t.espece, true)}<figcaption>${echapper(t.espece.nom_courant)}</figcaption></figure>`
    + `<figure>${celluleImage(choisie, true)}<figcaption>${echapper(choisie.nom_courant)}<small>votre choix</small></figcaption></figure></div>`
    + `${repereEntre(t.espece, choisie, t.photo && t.photo.sujet)}</div>${suivant}`;
  // La mise à jour des pastilles du haut
  zone.querySelector(".cdo-pts").outerHTML = enteteCoupDoeil().match(/<span class="cdo-pts">.*<\/span>/)[0];
  document.getElementById("cdo-suivant").onclick = () => { if (fin) finCoupDoeil(); else { coup.i++; afficherTourCoupDoeil(); } };
  // Toucher la photo passe aussi à la suite (comme dans la Rencontre)
  zone.querySelector(".cdo-photo").onclick = () => document.getElementById("cdo-suivant").click();
}
// Le repère qui sépare deux espèces : celui du groupe « À ne pas confondre » s'ils en font partie tous les deux,
// sinon le premier repère de terrain de la bonne espèce (quand il existe)
// Étape R195 : le repère de terrain vaut pour la forme de la photo montrée (femelle, jeune…)
function repereEntre(bonne, choisie, sujet) {
  const g = typeof CONFUSIONS !== "undefined" ? CONFUSIONS.find(gr => gr.especes.includes(bonne.nom_courant) && gr.especes.includes(choisie.nom_courant) && gr.critere) : null;
  if (g) return `<p class="cdo-repere"><small>Le repère</small>${echapper(majuscule(g.critere))}</p>`;
  const r = typeof reperesDe === "function" ? reperesDe(bonne) : null;
  const liste = r ? (typeof reperesPourForme === "function" ? reperesPourForme(r, formePourPhoto(r, sujet || "")) : r.reperes) : [];
  if (liste.length) return `<p class="cdo-repere"><small>Pour la reconnaître</small>${echapper(liste[0].texte)}</p>`;
  return "";
}
function finCoupDoeil() {
  const c = suivi.coupDoeil;
  const ancien = c.record || 0, ancienneSerie = c.serieMax || 0;
  if (!coup.revoir) {
    c.parties = (c.parties || 0) + 1;
    c.record = Math.max(ancien, coup.bons);
    c.serieMax = Math.max(ancienneSerie, coup.serieMax);
  }
  sauvegarder();
  const ratees = coup.tours.filter(t => t.choix !== t.espece);
  const record = !coup.revoir && coup.bons > ancien && ancien > 0;
  const zone = document.getElementById("vue-coupdoeil");
  zone.innerHTML = `<div class="cdo cdo-fin">
      <h2>${coup.bons} sur ${coup.tours.length}</h2>
      <p class="cdo-sous">${coup.revoir ? "Révision des espèces ratées" : `Meilleure série : ${coup.serieMax} d'affilée · record ${Math.max(ancienneSerie, coup.serieMax)}${record ? " · <b>nouveau record !</b>" : ""}`}</p>
      <div class="cdo-vign">${coup.tours.map(t => `<span class="${t.choix === t.espece ? "" : "ko"}">${imagePhoto(t.photo.src, t.espece.nom_courant, true)}</span>`).join("")}</div>
      ${ratees.length ? `<div class="cdo-arevoir"><b>À revoir</b><ul>${ratees.map(t => `<li>${echapper(t.espece.nom_courant)}${etiquetteForme(t.photo.sujet) ? ` (${minuscule(etiquetteForme(t.photo.sujet)).replace(/^(la|le|l')\s?/, "")})` : ""}, confondue avec ${echapper(minuscule(t.choix.nom_courant))}</li>`).join("")}</ul></div>` : `<p class="cdo-bravo">Sans faute.</p>`}
      <button class="cdo-suivant" id="cdo-rejouer">Rejouer</button>
      ${ratees.length ? `<button class="cdo-second" id="cdo-revoir">Revoir ${ratees.length > 1 ? `les ${ratees.length} espèces ratées` : "l'espèce ratée"}</button>` : ""}
      <button class="cdo-second" id="cdo-jeux">Retour aux jeux</button>
    </div>`;
  const especesRatees = [...new Set(ratees.map(t => t.espece))];
  document.getElementById("cdo-rejouer").onclick = () => lancerCoupDoeil();
  const rv = document.getElementById("cdo-revoir");
  if (rv) rv.onclick = () => lancerCoupDoeil(especesRatees);
  document.getElementById("cdo-jeux").onclick = () => { coup = null; montrer("arcade"); };
  window.scrollTo(0, 0);
}
