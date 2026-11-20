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
REGLES_ARCADE.coupdoeil = `Une photo, quatre noms : reconnaissez les espèces déjà rencontrées, en trois niveaux (bien différentes, même groupe, sosies et autres formes). ${COUP_PHOTOS} photos par partie.`;   // étape E2-10
REGLES_COURTES.coupdoeil = "Une photo, quatre noms : qui est-ce ?";

// Les espèces jouables : déjà rencontrées (reconnues sur leur photo), avec une photo
// Étape R191b (demande d'Aubin, 13/11 : « un bouton pour débloquer toutes les espèces sur la page des autres jeux ») :
//   l'interrupteur « Toutes les espèces » (suivi.coupToutes) ouvre le jeu à toutes les espèces du choix, sans les marquer
//   comme rencontrées : une espèce pas encore rencontrée bien reconnue ici ne compte pas pour elle (la vraie partie reste intacte).
function coupToutes() { return typeof modeCaddie === "function" ? modeCaddie() : !!(suivi && suivi.coupToutes); }   // étape E2-6 : le Mode Caddie
function especesCoupDoeil(especes) { return especes.filter(e => estRenseigne(e.photo) && (coupToutes() || estReconnue(e) || (typeof estOfferte === "function" && estOfferte(e)))); }   // étape E2-12 : + les espèces offertes
function possibiliteCoupDoeil(especes) {
  const n = especesCoupDoeil(especes).length;
  if (n >= COUP_MINIMUM) return { possible: true };
  const m = COUP_MINIMUM - n;
  return { possible: false, raison: `rencontrez encore ${m} espèce${m > 1 ? "s" : ""} pour y jouer` };
}
function metaCoupDoeil() {
  const c = suivi.coupDoeil || {};
  const n = niveauCoupOuvert(), r = recordNiveauCoup(n);   // étape E2-10
  if (c.record || r) return `Niveau ${n} sur 3${r ? ` · record <b>${r} / ${COUP_PHOTOS}</b>` : ""}`;
  return c.parties ? `${c.parties} partie${c.parties > 1 ? "s" : ""} jouée${c.parties > 1 ? "s" : ""}` : "Pas encore joué";
}

// Les pièges d'une espèce, dans l'ordre : sosies, même groupe, même milieu, même famille ; parmi toutes les espèces
// du choix (rencontrées ou non), jamais deux noms identiques, jamais l'espèce elle-même.
// Étape E2-10 : niveau 1 « Bien différentes » (même famille, jamais le même groupe ni un sosie) ; niveau 2 « Même groupe »
// (le groupe d'abord, sans les sosies) ; niveau 3 « Sosies et autres formes » (l'ordre d'avant). Sans niveau (défi d'une
// expédition, 27) : l'ordre d'avant.
function piegesCoupDoeil(e, pool, niveau) {
  const autres = pool.filter(x => x !== e && x.nom_courant !== e.nom_courant && estRenseigne(x.photo));
  const sosies = typeof sosiesDe === "function" ? sosiesDe(e).filter(x => autres.includes(x)) : [];
  const groupe = autres.filter(x => x.onglet === e.onglet && x.nom_affichage_groupe && x.nom_affichage_groupe === e.nom_affichage_groupe);
  if (niveau === 1 || niveau === 2) {
    const t0 = tailleCoup(e);
    const proche0 = x => { const u = tailleCoup(x); return !t0 || !u || Math.max(t0, u) / Math.min(t0, u) <= 3; };
    const loin = autres.filter(x => !sosies.includes(x) && !groupe.includes(x));
    const listes = niveau === 1
      ? [loin.filter(x => x.onglet === e.onglet && proche0(x)), loin.filter(x => x.onglet === e.onglet), loin]
      : [groupe.filter(x => !sosies.includes(x)), loin.filter(x => x.onglet === e.onglet && estRenseigne(e.milieu_principal) && x.milieu_principal === e.milieu_principal && proche0(x)), loin.filter(x => x.onglet === e.onglet && proche0(x)), autres.filter(x => !sosies.includes(x))];
    const choisis = [];
    for (const l of listes) for (const x of melanger(l)) {
      if (choisis.length < 3 && !choisis.includes(x) && !choisis.some(c => c.nom_courant === x.nom_courant)) choisis.push(x);
    }
    return choisis;
  }
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
// Étape R234 (notes 15 et 16 du 15/11) : après une réponse, la suite. Sur téléphone, le bouton est fixé en bas (style.css) :
//   la page ne bouge que si l'explication est cachée, une seule fois, en douceur, jusqu'à son bas (son haut reste visible).
//   Ailleurs (ordinateur), comme avant : le bouton est ramené à l'écran s'il en sort. Sert aussi à À l'oreille et au défi.
function montrerSuiteJeu(btn, r) {
  if (!btn) return;
  if (typeof recalerPouceMaintenant === "function") { recalerPouceMaintenant(); r = btn.getBoundingClientRect(); }   // R265 : la ligne a pu passer sous les réponses
  if (getComputedStyle(btn).position !== "fixed") {
    r = r || btn.getBoundingClientRect();
    if (r.bottom > window.innerHeight - 80 || r.top < 0) btn.scrollIntoView({ block: "end", behavior: "smooth" });
    return;
  }
  const expl = btn.parentElement, re = expl.getBoundingClientRect(), limite = btn.getBoundingClientRect().top - 12;
  const dy = Math.min(re.bottom + 12 - limite, re.top - 12);
  if (dy > 4) window.scrollBy({ top: dy, behavior: "smooth" });
}
const memoTailleCoup = new WeakMap();   // R275 (43.07) : la taille d'une espèce ne change pas, on ne la recalcule plus à chaque piège
function tailleCoup(e) {
  if (memoTailleCoup.has(e)) return memoTailleCoup.get(e);
  const t = tailleCoupCalculee(e); memoTailleCoup.set(e, t); return t;
}
function tailleCoupCalculee(e) {
  // toutes les colonnes de taille en cm (taille_min_cm, taille_max_cm_male, …) : la plus grande valeur
  const v = Object.keys(e).filter(k => /^taille_.*cm/.test(k)).map(k => parseFloat(e[k])).filter(x => isFinite(x) && x > 0);
  return v.length ? Math.max(...v) : 0;
}
// Une photo de l'espèce : la principale ou une autre forme (avec son étiquette) ; « autre vue » sans étiquette
function photoCoupDoeil(e, dejaVues, niveau) {
  if (niveau === 1 || niveau === 2) return photosDe(e)[0];   // étape E2-10 : niveaux 1 et 2, la photo principale
  if (niveau === 3) {                                        // niveau 3 : une autre forme d'abord (jamais larve ni chenille)
    const formes = photosJeu(e).filter(p => etiquetteForme(p.sujet) && !dejaVues.includes(p.src));   // R234 : photosJeu (jamais têtard, larve ni chenille)
    if (formes.length) return formes[Math.floor(Math.random() * formes.length)];
  }
  const ph = photosJeu(e).filter(p => !dejaVues.includes(p.src));   // R234 (note 6) : plus de têtards en repli au niveau 3
  const liste = ph.length ? ph : photosJeu(e);
  return liste[Math.floor(Math.random() * liste.length)];
}

function lancerCoupDoeil(seules, niveau) {
  if (!seules && !niveau) { ouvrirNiveauxCoupDoeil(); return; }   // étape E2-10 : d'abord le choix du niveau
  niveau = niveau || (coup && coup.niveau) || niveauCoupOuvert();
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
    const p = photoCoupDoeil(e, srcVues, niveau); srcVues.push(p.src);
    const noms = melanger([e, ...piegesCoupDoeil(e, d.especes, niveau)]);
    return { espece: e, photo: p, noms, choix: null };
  });
  coup = { tours, i: 0, bons: 0, serie: 0, serieMax: 0, revoir: !!seules, d, niveau };
  depuisArcade = true;
  montrer("coupdoeil");
  afficherTourCoupDoeil();
}

function enteteCoupDoeil() {
  const pts = coup.tours.map((t, k) => `<i class="${t.choix ? (t.choix === t.espece ? "ok" : "ko") : ""}${k === coup.i && !t.choix ? " cur" : ""}"></i>`).join("");
  return `<div class="cdo-haut"><button class="cdo-quitter" id="cdo-quitter">← Jeux</button>`
    + `<span class="cdo-titre">Coup d'œil · niveau ${coup.niveau} · ${Math.min(coup.i + 1, coup.tours.length)} / ${coup.tours.length}</span><span class="cdo-pts">${pts}</span></div>`;
}
function afficherTourCoupDoeil() {
  const zone = document.getElementById("vue-coupdoeil");
  const t = coup.tours[coup.i];
  const etiquette = etiquetteForme(t.photo.sujet);
  prechargerPhotos(coup.tours.slice(coup.i + 1, coup.i + 3).map(s => s.photo && s.photo.src));   // R264 (39) : les suivantes à l'avance
  zone.innerHTML = `<div class="cdo">${enteteCoupDoeil()}
      <div class="cdo-photo">${imagePhoto(t.photo.src, "Qui est-ce ?", false)}${etiquette ? `<small class="cdo-forme">${etiquette.replace(/^(La|Le|L')\s?/, "").replace(/^./, c => c.toUpperCase())}</small>` : ""}</div>
      <p class="cdo-q">Qui est-ce ?</p>
      <div class="cdo-noms">${t.noms.map((e, k) => `<button class="cdo-nom" data-k="${k}">${echapper(e.nom_courant)}</button>`).join("")}</div>
      <div class="cdo-retour" id="cdo-retour"></div>
    </div>`;
  zone.querySelectorAll(".cdo-nom").forEach(b => b.onclick = () => repondreCoupDoeil(t.noms[+b.dataset.k], b));
  document.getElementById("cdo-quitter").onclick = () => { coup = null; montrer("arcade"); };
  window.scrollTo(0, 0);
  if (typeof calerJeuSousPouce === "function") calerJeuSousPouce(zone);   // étape R265 (40.03)
}
function repondreCoupDoeil(choisie, bouton) {
  const t = coup.tours[coup.i];
  if (t.choix) return;
  t.choix = choisie;
  const juste = choisie === t.espece;
  try { jouerSon(juste ? "bonne" : "mauvaise"); } catch (err) {}   // R239 (36.04)
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
    if (estReconnue(t.espece) || (typeof estARevoirRencontre === "function" && estARevoirRencontre(t.espece))) acquerir(t.espece, IDENTIFICATION);   // choix d'Aubin : une photo bien reconnue compte pour l'espèce (R191b : seulement si déjà rencontrée ; R236 : une espèce rencontrée « à reconnaître » devient Reconnue)
  } else {
    coup.serie = 0;
    if (estReconnue(t.espece)) noterEchec(t.espece, IDENTIFICATION);
  }
  sauvegarder();
  const retour = document.getElementById("cdo-retour");
  const fin = coup.i >= coup.tours.length - 1;
  const suivant = `<button class="cdo-suivant" id="cdo-suivant">${fin ? "Voir le résultat" : "Photo suivante →"}</button>`;
  const oui = typeof verdictHtml === "function" ? `<p class="apf-verdict">${verdictHtml({ juste: true, complement: complementReconnaissance(t.espece, t.photo && t.photo.sujet) })}</p>` : "";   // R265 (40.12)
  if (juste) retour.innerHTML = `${oui}${coup.serie >= 3 ? `<p class="cdo-serie">${coup.serie} d'affilée</p>` : ""}${suivant}`;   // R239 (36.09) : le nom n'est plus répété
  else retour.innerHTML = `<div class="cdo-erreur"><b>C'est ${echapper(nomAvecArticle(t.espece))}.</b>
      <div class="cdo-duo agrandir-groupe"><figure class="agr" data-legende="${echapper(t.espece.nom_courant)}"><span class="agr-cadre">${celluleImage(t.espece, true)}${LOUPE_SVG}</span><figcaption>${echapper(t.espece.nom_courant)}</figcaption></figure>`
    + `<figure class="agr" data-legende="Votre choix · ${echapper(choisie.nom_courant)}"><span class="agr-cadre">${celluleImage(choisie, true)}${LOUPE_SVG}</span><figcaption>${echapper(choisie.nom_courant)}<small>votre choix</small></figcaption></figure></div>`
    + `${repereEntre(t.espece, choisie, t.photo && t.photo.sujet)}</div>${suivant}`;
  // La mise à jour des pastilles du haut
  zone.querySelector(".cdo-pts").outerHTML = enteteCoupDoeil().match(/<span class="cdo-pts">.*<\/span>/)[0];
  document.getElementById("cdo-suivant").onclick = () => { if (fin) finCoupDoeil(); else { coup.i++; afficherTourCoupDoeil(); } };
  // Étape E2-4 (n° 25.6, note d'Aubin du 13/11) : le bouton « Photo suivante » est toujours amené à l'écran (au-dessus de la barre du bas)
  const btn = document.getElementById("cdo-suivant"), r = btn.getBoundingClientRect();
  montrerSuiteJeu(btn, r);   // R234 (notes 15-16) : bouton fixé en bas sur téléphone, un seul défilement doux vers l'explication
  // Toucher la photo passe aussi à la suite (comme dans la Rencontre)
  zone.querySelector(".cdo-photo").onclick = () => document.getElementById("cdo-suivant").click();
}
// Le repère qui sépare deux espèces : celui du groupe « À ne pas confondre » s'ils en font partie tous les deux,
// sinon le premier repère de terrain de la bonne espèce (quand il existe)
// Étape R195 : le repère de terrain vaut pour la forme de la photo montrée (femelle, jeune…)
function repereEntre(bonne, choisie, sujet) {
  if (typeof blocSepare === "function") { const b = blocSepare(bonne, choisie, sujet); if (b) return b; }   // R243 (36.21) : comme le défi, un repère de chaque espèce sur la même partie
  const g = typeof CONFUSIONS !== "undefined" ? CONFUSIONS.find(gr => gr.especes.includes(bonne.nom_courant) && gr.especes.includes(choisie.nom_courant) && gr.critere) : null;
  if (g) return `<p class="cdo-repere"><small>Le repère</small>${echapper(majuscule(g.critere))}</p>`;
  const r = typeof reperesDe === "function" ? reperesDe(bonne) : null;
  const liste = r ? (typeof reperesPourForme === "function" ? reperesPourForme(r, formePourPhoto(r, sujet || "")) : r.reperes) : [];
  if (liste.length) return `<p class="cdo-repere"><small>Pour ${pe(bonne).la} reconnaître</small>${echapper(liste[0].texte)}</p>`;
  return "";
}
function finCoupDoeil() {
  const c = suivi.coupDoeil;
  const n = coup.niveau || 1;
  const ancien = recordNiveauCoup(n), ancienneSerie = c.serieMax || 0;
  const ouvertAvant = niveauCoupOuvert();
  if (!coup.revoir) {
    c.parties = (c.parties || 0) + 1;
    c.record = Math.max(c.record || 0, coup.bons);
    c.serieMax = Math.max(ancienneSerie, coup.serieMax);
    c.niveaux = c.niveaux || {};
    c.niveaux[n] = Math.max(c.niveaux[n] || 0, coup.bons);                       // étape E2-10 : le record de chaque niveau
    if (coup.bons >= COUP_SEUIL_NIVEAU && n < 3) c.ouvert = Math.max(c.ouvert || 1, n + 1);
    c.dernierNiveau = n;
  }
  sauvegarder();
  const vientDOuvrir = !coup.revoir && niveauCoupOuvert() > ouvertAvant ? niveauCoupOuvert() : 0;
  const ratees = coup.tours.filter(t => t.choix !== t.espece);
  const record = !coup.revoir && coup.bons > ancien && ancien > 0;
  const zone = document.getElementById("vue-coupdoeil");
  zone.innerHTML = `<div class="cdo cdo-fin">
      <h2>${coup.bons} sur ${coup.tours.length}</h2>
      <p class="cdo-sous">${coup.revoir ? "Révision des espèces ratées" : `Niveau ${n} · ${NIVEAUX_COUP[n].nom}${record ? " · <b>nouveau record !</b>" : ""} · meilleure série : ${coup.serieMax} d'affilée`}</p>
      ${vientDOuvrir ? `<div class="cdo-ouvre"><small>Le niveau ${vientDOuvrir} s'ouvre</small><b>${NIVEAUX_COUP[vientDOuvrir].nom}</b><span>${NIVEAUX_COUP[vientDOuvrir].texte}</span>
        <button class="cdo-ouvre-btn" id="cdo-niveau-suivant">Essayer le niveau ${vientDOuvrir}</button></div>` : ""}
      <div class="cdo-vign">${coup.tours.map(t => `<span class="${t.choix === t.espece ? "" : "ko"}">${imagePhoto(t.photo.src, t.espece.nom_courant, true)}</span>`).join("")}</div>
      ${ratees.length ? `<div class="cdo-arevoir"><b>À revoir</b><ul>${ratees.map(t => `<li>${echapper(t.espece.nom_courant)}${etiquetteForme(t.photo.sujet) ? ` (${minuscule(etiquetteForme(t.photo.sujet)).replace(/^(la|le|l')\s?/, "")})` : ""}, confondu${pe(t.espece).e} avec ${echapper(nomAvecArticle(t.choix))}</li>`).join("")}</ul></div>` : `<p class="cdo-bravo">Sans faute.</p>`}
      <button class="${vientDOuvrir ? "cdo-second" : "cdo-suivant"}" id="cdo-rejouer">${coup.revoir ? "Rejouer" : `Rejouer au niveau ${n}`}</button>
      ${ratees.length ? `<button class="cdo-second" id="cdo-revoir">Revoir ${ratees.length > 1 ? `les ${ratees.length} espèces ratées` : "l'espèce ratée"}</button>` : ""}
      <button class="cdo-second" id="cdo-jeux">Retour aux jeux</button>
    </div>`;
  const especesRatees = [...new Set(ratees.map(t => t.espece))];
  document.getElementById("cdo-rejouer").onclick = () => lancerCoupDoeil(null, n);
  const ns = document.getElementById("cdo-niveau-suivant");
  if (ns) ns.onclick = () => lancerCoupDoeil(null, vientDOuvrir);
  const rv = document.getElementById("cdo-revoir");
  if (rv) rv.onclick = () => lancerCoupDoeil(especesRatees, n);
  document.getElementById("cdo-jeux").onclick = () => { coup = null; montrer("arcade"); };
  window.scrollTo(0, 0);
}

// ==================================================================
// Étape E2-10 (16/11) : Coup d'œil à 3 niveaux (choix d'Aubin : séries 1 « 4C » et 2 « 4A »)
//   • le joueur choisit son niveau (3 cartes : la meilleure partie de chaque niveau ; un niveau fermé dit comment l'ouvrir) ;
//   • le niveau suivant s'ouvre à 8 sur 10 ; la fin de partie le propose quand il vient de s'ouvrir ; rien n'oblige à monter ;
//   • ancien joueur : son record d'avant compte pour le niveau 1 (8 sur 10 ou plus = le niveau 2 est ouvert).
// Sauvegarde : suivi.coupDoeil.niveaux = { 1: record, 2: …, 3: … }, .ouvert (plus haut niveau ouvert), .dernierNiveau.
// ==================================================================
const COUP_SEUIL_NIVEAU = 8;
const NIVEAUX_COUP = {
  1: { nom: "Bien différentes", texte: "Des espèces de la même famille, mais d'allures bien différentes." },
  2: { nom: "Même groupe", texte: "Des espèces du même groupe : à reconnaître à leurs détails." },
  3: { nom: "Sosies et autres formes", texte: "Des espèces qui se ressemblent, et l'animal en femelle, en jeune ou en hiver." }
};
function niveauCoupOuvert() {
  const c = (suivi && suivi.coupDoeil) || {};
  let n = c.ouvert || 1;
  if (!c.niveaux && (c.record || 0) >= COUP_SEUIL_NIVEAU) n = Math.max(n, 2);   // l'acquis d'avant E2-10
  return Math.min(3, n);
}
function recordNiveauCoup(n) {
  const c = (suivi && suivi.coupDoeil) || {};
  if (c.niveaux && c.niveaux[n]) return c.niveaux[n];
  return n === 1 && !c.niveaux ? (c.record || 0) : 0;
}
// Deux vignettes pour illustrer chaque niveau, prises parmi les espèces jouables
function exemplesNiveauCoup(n, jouables) {
  const avecFormes = jouables.filter(e => photosJeu(e).some(p => etiquetteForme(p.sujet)));
  if (n === 3 && avecFormes.length) { const e = avecFormes[0]; const f = photosJeu(e).find(p => etiquetteForme(p.sujet)); return [photosDe(e)[0].src, f.src]; }
  for (const e of jouables) {
    const g = jouables.find(x => x !== e && (n === 1 ? x.onglet === e.onglet && x.nom_affichage_groupe !== e.nom_affichage_groupe
                                                     : x.nom_affichage_groupe && x.nom_affichage_groupe === e.nom_affichage_groupe && !(typeof sosiesDe === "function" && sosiesDe(e).includes(x))));
    if (g) return [photosDe(e)[0].src, photosDe(g)[0].src];
  }
  return jouables.slice(0, 2).map(e => photosDe(e)[0].src);
}
let niveauCoupChoisi = 0;
function ouvrirNiveauxCoupDoeil() {
  const T = typeof territoiresArcade === "function" ? territoiresArcade() : [territoireActif()];
  const F = typeof famillesArcade === "function" ? famillesArcade(T) : famillesDe(T);
  const d = construireDefi(T, F);
  if (!d) { afficherBulle("Aucune espèce avec ce choix"); return; }
  const jouables = especesCoupDoeil(d.especes);
  if (jouables.length < COUP_MINIMUM) { afficherBulle(conditionJeu("coupdoeil", possibiliteCoupDoeil(d.especes))); return; }
  const ouvert = niveauCoupOuvert();
  const c = suivi.coupDoeil || {};
  if (!niveauCoupChoisi || niveauCoupChoisi > ouvert) niveauCoupChoisi = Math.min(ouvert, c.dernierNiveau || ouvert);
  coup = null;
  depuisArcade = true;
  montrer("coupdoeil");
  const zone = document.getElementById("vue-coupdoeil");
  const carte = n => {
    const ferme = n > ouvert, r = recordNiveauCoup(n);
    const ex = exemplesNiveauCoup(n, jouables).map(src => `<img src="${photoMini(src)}" alt="" loading="lazy">`).join("");
    const bas = ferme ? `S'ouvre à ${COUP_SEUIL_NIVEAU} sur ${COUP_PHOTOS} au niveau ${n - 1}` : r ? `Meilleure partie : ${r} sur ${COUP_PHOTOS}` : "Pas encore joué";
    return `<button class="cdo-niv${ferme ? " ferme" : ""}${n === niveauCoupChoisi ? " choisi" : ""}" data-n="${n}"${ferme ? " disabled" : ""}>
        <span class="cdo-niv-ex">${ex}</span><span class="cdo-niv-txt"><b>${n} · ${NIVEAUX_COUP[n].nom}</b><small>${bas}</small></span>
        ${ferme ? `<svg class="cdo-niv-icone" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`
          : r >= COUP_SEUIL_NIVEAU ? `<svg class="cdo-niv-icone ok" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>` : ""}</button>`;
  };
  zone.innerHTML = `<div class="cdo cdo-niveaux">
      <div class="cdo-haut"><button class="cdo-quitter" id="cdo-quitter">← Jeux</button></div>
      <h2>Coup d'œil</h2>
      <p class="cdo-sous">Une photo, quatre noms. ${COUP_PHOTOS} photos par partie. Choisissez votre niveau.</p>
      <div class="cdo-nivs">${[1, 2, 3].map(carte).join("")}</div>
      <p class="cdo-niv-texte" id="cdo-niv-texte">${NIVEAUX_COUP[niveauCoupChoisi].texte}</p>
      <p class="cdo-avec">Avec les espèces de : ${typeof resumeArcade === "function" ? echapper(resumeArcade(T, F)) : echapper(T.join(", "))}</p>
      <button class="cdo-suivant" id="cdo-jouer">Jouer · niveau ${niveauCoupChoisi}</button>
    </div>`;
  zone.querySelectorAll(".cdo-niv:not(.ferme)").forEach(b => b.onclick = () => {
    niveauCoupChoisi = +b.dataset.n;
    zone.querySelectorAll(".cdo-niv").forEach(x => x.classList.toggle("choisi", x === b));
    document.getElementById("cdo-jouer").textContent = `Jouer · niveau ${niveauCoupChoisi}`;
    document.getElementById("cdo-niv-texte").textContent = NIVEAUX_COUP[niveauCoupChoisi].texte;
  });
  document.getElementById("cdo-jouer").onclick = () => lancerCoupDoeil(null, niveauCoupChoisi);
  document.getElementById("cdo-quitter").onclick = () => { coup = null; montrer("arcade"); };
  window.scrollTo(0, 0);
  if (typeof calerJeuSousPouce === "function") calerJeuSousPouce(zone);   // étape R265 (40.03)
}
