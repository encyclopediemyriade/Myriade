// 25_carte.js — L'espace « Carte » du téléphone (étape K2, 13/11/2026, n° 15 ; choix d'Aubin, artefact « Myriade · Espace carte »).
// Une partie du programme du jeu, chargée par jeu.html juste avant 19_application.js.
//
//   • Un onglet « Carte » dans la barre du bas (téléphone seulement ; l'ordinateur ne change pas).
//   • Il s'ouvre sur la France entière : la carte d'origine des 11 territoires (territoires.js), en aplats de couleur,
//     les noms écrits sur la carte, la liste des territoires en dessous.
//   • Un toucher sur un territoire ouvert : la vraie carte du territoire, les lieux en pastilles sobres (carteDesLieux, 17),
//     la montagne en ombrage doux (Images/Relief/relief_<territoire>.png, gen_relief.py), sans nom de sommet.
//     Un toucher sur un lieu le choisit : sa carte s'affiche dessous, avec le bouton pour y aller.
//   • Étape K3 (16/11/2026, choix d'Aubin « 1B · 2A · 3C · 4B · 5C · 6B · 7B », canvas « Aperçu des territoires ») :
//     TOUS les territoires se touchent, même fermés. Un territoire fermé s'ouvre « en aperçu » sur le même écran qu'un
//     territoire ouvert (rien ne change de place le jour où il s'ouvre) : bandeau « Aperçu » et une ligne sur ce qui l'ouvre,
//     la carte des lieux (tous « plus tard »), le portrait (photo, phrase, chiffres), les 8 espèces emblématiques en photo
//     avec leur nom (IDENTITE), les lieux avec leur espèce vedette ; un lieu touché montre sa fiche (photo, phrase,
//     titres de ses expéditions, son espèce) ; en bas, ce qui l'ouvre et « Continuer dans … ». Pas d'« enjeu » dans l'aperçu.

// La place des noms sur la carte de France (unités de territoires.js) : x, y, taille, lignes (et l'ancrage, « end » = le nom finit à x)
const ATLAS_NOMS = {
  "Massif armoricain": [195, 280, 44, ["Massif", "armoricain"]],
  "Bassin parisien et Val de Loire": [540, 205, 44, ["Bassin parisien", "et Val de Loire"]],
  "Plaines de l'Est et val de Saône": [830, 165, 38, ["Plaines", "de l’Est"]],
  "Vosges": [925, 320, 36, ["Vosges"]],
  "Jura": [838, 488, 38, ["Jura"]],
  "Bassin aquitain": [330, 680, 44, ["Bassin", "aquitain"]],
  "Massif central": [585, 590, 44, ["Massif", "central"]],
  "Alpes": [885, 655, 42, ["Alpes"]],
  "Pyrénées": [395, 925, 40, ["Pyrénées"]],
  "Méditerranée": [720, 812, 38, ["Méditerranée"]],
  "Corse": [1036, 958, 36, ["Corse"], "end"],   // R261 : le nom à côté de l'île, plus dessus
};
// Le relief : une image par territoire, posée dans son cadre (RELIEF_CARTE, écrit par gen_relief.py dans relief_carte.js)
function reliefTerritoire(t, classe) {
  if (typeof RELIEF_CARTE === "undefined" || !RELIEF_CARTE[t]) return "";
  const r = RELIEF_CARTE[t], forme = CARTE_TERRITOIRES.find(k => k.nom === t);
  if (!forme) return "";
  const id = "at-clip-" + Math.abs([...t].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7));
  return `<defs><clipPath id="${id}"><path d="${forme.contour}"/></clipPath></defs>`
    + `<image href="${r.fichier}" x="${r.cadre[0]}" y="${r.cadre[1]}" width="${r.cadre[2]}" height="${r.cadre[3]}" preserveAspectRatio="none" clip-path="url(#${id})" class="at-relief${classe ? " " + classe : ""}"/>`;
}

let atlasTerritoire = null;      // null : la France ; sinon le territoire montré
let atlasLieu = null;            // le lieu choisi sur la carte du territoire

function afficherAtlas() {
  const zone = document.getElementById("vue-atlas");
  if (!zone) return;
  if (atlasTerritoire && !tousLesTerritoires().includes(atlasTerritoire)) atlasTerritoire = null;   // étape K3 : un territoire fermé se montre en aperçu
  if (atlasTerritoire) dessinerAtlasTerritoire(zone, atlasTerritoire); else dessinerAtlasFrance(zone);
  window.scrollTo(0, 0);
  if (typeof noterArriveePage === "function" && !zone.classList.contains("cache")) noterArriveePage("atlas");   // R241 : la France ou un territoire
}
function ouvrirAtlas(t) { atlasTerritoire = t || null; atlasLieu = null; montrer("atlas"); }

// ---- 1. La France ----
// Étape R261 (18/11/2026, choix d'Aubin « 1A · 2A · 3A », artefact « Myriade · Embellir la page Carte ») :
//   • 1A · relief et mer : la mer autour (dégradé doux, quelques traits de houle), un liseré clair le long des côtes,
//     le relief en ombrage sur toute la France (plus léger sur les territoires fermés), les territoires fermés en couleur
//     douce (moitié couleur, moitié papier) au lieu de presque gris ; le prochain territoire cerné d'un halo ocre et d'une
//     étiquette « PROCHAIN » ; « vous êtes ici » = une épingle verte à maison ; le nom de la Corse à côté de l'île.
//   • 2A · vos territoires en cartes postales : la photo du territoire, son nom dessus, « Vous êtes ici » en étiquette,
//     les chiffres, la jauge, et un bouton à sa couleur (« Continuer : <lieu> » s'il y a un lieu à reprendre).
//   • 3A · le prochain territoire en invitation (photo, forme, ce qui l'ouvre) ; les autres en grille de petites formes
//     pâles, touchables (aperçu). Corrige au passage le texte collé « CorseEncore 1 lieu ».
const ATLAS_HOULE = [[40, 560], [70, 640], [30, 720], [180, 1000], [620, 1010], [880, 1040], [60, 140], [200, 90], [1040, 760], [980, 900]];
let atlasBoites = null;   // la boîte de chaque territoire (pour dessiner sa petite forme), mesurée une fois
function boiteTerritoire(t) {
  if (!atlasBoites) {
    atlasBoites = {};
    const ns = "http://www.w3.org/2000/svg", s = document.createElementNS(ns, "svg");
    s.setAttribute("width", "0"); s.setAttribute("height", "0"); s.style.cssText = "position:absolute;visibility:hidden";
    document.body.appendChild(s);
    for (const k of CARTE_TERRITOIRES) {
      const p = document.createElementNS(ns, "path"); p.setAttribute("d", k.contour); s.appendChild(p);
      try { const b = p.getBBox(); atlasBoites[k.nom] = [b.x, b.y, b.width, b.height]; } catch (e) { /* rien */ }
    }
    s.remove();
  }
  return atlasBoites[t];
}
// La petite forme d'un territoire, seule, à sa couleur
function formeTerritoire(t, taille, fond, trait) {
  const k = CARTE_TERRITOIRES.find(z => z.nom === t), b = boiteTerritoire(t);
  if (!k || !b || !b[2]) return `<span class="at-pastille" style="background:${fond}"></span>`;
  const [x, y, w, h] = b, m = Math.max(w, h) * 0.06;
  return `<svg class="at-forme" width="${taille}" height="${taille}" viewBox="${(x - m).toFixed(1)} ${(y - m).toFixed(1)} ${(w + 2 * m).toFixed(1)} ${(h + 2 * m).toFixed(1)}" aria-hidden="true"><path d="${k.contour}" fill="${fond}" stroke="${trait || fond}" stroke-width="${(Math.max(w, h) / 40).toFixed(1)}" stroke-linejoin="round"/></svg>`;
}
function photoDuTerritoire(t) {
  try { const p = photoTerritoire(t, typeof IDENTITE !== "undefined" ? IDENTITE[t] : null); return p && p.fichier ? p.fichier : ""; } catch (e) { return ""; }
}
function dessinerAtlasFrance(zone) {
  const ouverts = territoiresOuverts(), fermes = territoiresFermes(), ici = territoireActif();
  const suivant = fermes.length ? prochainTerritoire() : null;
  const couleur = t => (TERRITOIRES[t] || {}).couleur || "#7a736a";
  const pale = c => melangerCouleurs(c, "#f4efe6", 0.50);
  const [vx, vy, vw, vh] = CARTE_CADRE.split(" ").map(Number);
  // la mer, la houle, le liseré des côtes
  let fond = `<defs><radialGradient id="at-mer" cx="45%" cy="45%" r="75%"><stop offset="0" stop-color="#E9F0EC"/><stop offset="1" stop-color="#CFE0DD"/></radialGradient></defs>`
    + `<rect x="${vx}" y="${vy}" width="${vw}" height="${vh}" fill="url(#at-mer)"/>`
    + ATLAS_HOULE.map(([x, y]) => `<path d="M${x} ${y}q14-9 28 0t28 0" class="at-houle"/>`).join("")
    + CARTE_TERRITOIRES.map(k => `<path d="${k.contour}" class="at-cote"/>`).join("");
  let formes = "", reliefs = "", noms = "";
  for (const k of CARTE_TERRITOIRES) {
    const ouvert = ouverts.includes(k.nom), c = ouvert ? couleur(k.nom) : pale(couleur(k.nom));
    formes += `<path d="${k.contour}" class="at-terr${ouvert ? " ouvert" : " ferme"}${k.nom === suivant ? " prochain" : ""}" data-t="${echapper(k.nom)}" style="fill:${c};stroke:${c}"/>`;
    reliefs += reliefTerritoire(k.nom, ouvert ? "" : "ferme");
    const n = ATLAS_NOMS[k.nom];
    if (n) {
      const [x, y, z, lignes, ancre] = n;
      noms += `<text x="${x}" y="${y}" font-size="${z}" class="at-nom${ouvert ? "" : " ferme"}"${ancre ? ` text-anchor="${ancre}"` : ""} style="stroke:${c}">`
        + lignes.map((l, i) => `<tspan x="${x}" dy="${i ? Math.round(z * 1.14) : 0}">${echapper(l)}</tspan>`).join("") + `</text>`;
    }
  }
  // le prochain territoire : un halo ocre et l'étiquette « PROCHAIN » sous son nom
  let prochain = "";
  if (suivant) {
    prochain = CARTE_TERRITOIRES.filter(k => k.nom === suivant).map(k => `<path d="${k.contour}" class="at-prochain-halo"/>`).join("");
    const n = ATLAS_NOMS[suivant];
    if (n) {
      const [x, y, z, lignes, ancre] = n, yy = y + (lignes.length - 1) * z * 1.14 + z * 0.55, l = 168;
      const x0 = ancre === "end" ? x - l : x - l / 2;
      prochain += `<g class="at-prochain-etiq"><rect x="${x0}" y="${yy}" width="${l}" height="44" rx="22"/><text x="${x0 + l / 2}" y="${yy + 31}" font-size="27" text-anchor="middle">PROCHAIN</text></g>`;
    }
  }
  // Étape R275 (42.04, choix 3A du 19/11 au soir) : le territoire en cours — plus de goutte à maison contre le nom ;
  //   une étiquette « EN COURS » sous le nom, dans le style de « PROCHAIN », et un contour clair plus épais.
  let epingle = "", contourIci = "";
  const c0 = ici && ATLAS_NOMS[ici];
  if (c0) {
    // le contour clair déborde autour du territoire ; sa couleur est reposée par-dessus (elle cache la moitié intérieure du trait)
    contourIci = CARTE_TERRITOIRES.filter(k => k.nom === ici).map(k => `<path d="${k.contour}" class="at-ici-contour"/>`).join("")
      + CARTE_TERRITOIRES.filter(k => k.nom === ici).map(k => `<path d="${k.contour}" class="at-ici-fond" style="fill:${couleur(ici)};stroke:${couleur(ici)}"/>`).join("");
    // Étape R285 (47.01, retours du 21/11 au soir) : plus d'étiquette « EN COURS » ; le territoire ressort par sa couleur et son contour blanc
  }
  // 2A : une carte postale par territoire ouvert
  const nb = (n, mot) => `${n} ${mot}${n > 1 ? (mot.endsWith("u") ? "x" : "s") : ""}`;
  const postale = t => {
    const lieux = lieuxDe(t), finis = lieux.filter(l => lieuTermine(t, l)).length, c = carnetDe(especesDe(t)), ph = photoDuTerritoire(t);
    let lieu = null, commence = false;
    try {
      lieu = lieuAReprendre(t);
      commence = !!lieu && (expeditionsDuChapitre(t, lieu.nom).some(y => expeditionCommencee(y)) || lieux.some(c => etatLieu(t, c) === "fini"));
    } catch (e) { /* rien */ }
    return `<li class="at-postale" style="--couleur-t:${couleur(t)}">
        <button class="at-ligne at-postale-haut" type="button" data-t="${echapper(t)}">
          ${ph ? imgMini(ph, "") : ""}
          ${t === ici ? `<span class="at-ici-etiq"><svg viewBox="-12 -12 24 24" aria-hidden="true"><path d="M-10 1 0-9 10 1M-7-2v10h14v-10"/></svg>Vous êtes ici</span>` : ""}
          <b>${echapper(t)}</b></button>
        <div class="at-postale-bas">
          <small><span>${aDecouvrir(t)}</span><span>${nb(finis, "lieu")} terminé${finis > 1 ? "s" : ""} sur ${lieux.length}</span></small>
          <i class="at-jauge"><em style="width:${c.pct}%;background:${couleur(t)}"></em></i>
          <button class="at-continuer" type="button" data-t="${echapper(t)}"${lieu ? ` data-lieu="${echapper(lieu.nom)}"` : ""}><span>${lieu ? `${commence ? "Continuer" : "Commencer"} : ${echapper(lieu.nom)}` : "Explorer ce territoire"}</span><span aria-hidden="true">›</span></button>
        </div></li>`;
  };
  const autres = fermes.filter(t => t !== suivant);
  const nomCourt = t => t === "Plaines de l'Est et val de Saône" ? "Plaines de l’Est" : t;
  const manque = suivant ? (m => m === null ? "" : m ? "Encore " + texteManque(m) : "Il s'ouvre maintenant")(avantProchainTerritoire()) : "";
  const phS = suivant ? photoDuTerritoire(suivant) : "";
  zone.innerHTML = `
    <header class="at-tete"><h1>Carte</h1><small>${ouverts.length} territoire${ouverts.length > 1 ? "s" : ""} ouvert${ouverts.length > 1 ? "s" : ""} sur ${tousLesTerritoires().length}</small></header>
    <div class="at-carte-france"><svg viewBox="${CARTE_CADRE}" role="img" aria-label="Carte de France des territoires">${fond}${formes}${contourIci}${reliefs}${prochain}${noms}${epingle}</svg></div>
    <h2 class="at-titre">Vos territoires</h2>
    <ul class="at-liste">${[ici].filter(t => ouverts.includes(t)).concat(ouverts.filter(t => t !== ici)).map(postale).join("")}</ul>
    ${suivant ? `<button class="at-suivant at-ligne-ferme" type="button" data-t="${echapper(suivant)}">
        <span class="at-suivant-ph">${phS ? imgMini(phS, "") : ""}</span>
        <span class="at-suivant-corps"><small class="at-suivant-etiq">Prochain territoire</small><b>${echapper(suivant)}</b><small>${manque ? manque + " · " : ""}voir l'aperçu</small></span>
        ${formeTerritoire(suivant, 30, pale(couleur(suivant)), couleur(suivant))}</button>` : ""}
    ${autres.length ? `<h2 class="at-titre">Plus tard · ${autres.length} territoire${autres.length > 1 ? "s" : ""}</h2>
      <div class="at-grille">${autres.map(t => `<button class="at-ligne-ferme at-case" type="button" data-t="${echapper(t)}">${formeTerritoire(t, 54, melangerCouleurs(couleur(t), "#f4efe6", 0.42))}<span>${echapper(nomCourt(t))}</span></button>`).join("")}</div>` : ""}`;
  const aller = t => {   // étape K3 : ouvert ou fermé, on y va (un territoire fermé se montre en aperçu)
    if (!t) return;
    atlasTerritoire = t; atlasLieu = null; afficherAtlas();
  };
  zone.querySelectorAll(".at-terr").forEach(p => p.addEventListener("click", () => aller(p.dataset.t)));
  zone.querySelectorAll(".at-ligne, .at-ligne-ferme").forEach(b => b.onclick = () => aller(b.dataset.t));
  zone.querySelectorAll(".at-continuer").forEach(b => b.onclick = () => {
    const t = b.dataset.t, nom = b.dataset.lieu;
    if (!nom) { aller(t); return; }
    changerTerritoire(t);
    const c = typeof chapitreParNom === "function" ? chapitreParNom(t, nom) : null;
    if (c && c.type === "remarquable") ouvrirSite(t); else ouvrirLieu(t, nom);
    window.scrollTo(0, 0);
  });
}

// ---- 2. Un territoire : la vraie carte, les lieux en pastilles, le lieu choisi dessous ----
// Étape K3 : le même écran pour un territoire fermé, « en aperçu » (rien ne s'y joue).
const LOCK_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`;
function territoireEnApercu(t) { return !territoiresOuverts().includes(t) && !toutDebloque(); }
// « dans le Jura », « en Corse », « dans les Alpes »
function dansTerritoire(t) { const a = articleTerritoire(t); return a === "en" ? `en ${t}` : `dans ${a} ${t}`; }
// Ce qui ouvre un territoire fermé, en une phrase
function phraseOuverture(t) {
  const suivant = prochainTerritoire(), m = avantProchainTerritoire();
  if (t === suivant) return m === null ? "C'est le prochain territoire." : m ? `C'est le prochain territoire, le plus différent des vôtres : encore ${texteManque(m)}, n'importe ${m > 1 ? "lesquels" : "lequel"}.` : "C'est le prochain territoire : il s'ouvre maintenant.";
  return `Ce territoire s'ouvrira plus tard.${suivant ? ` Prochain territoire : ${suivant}.` : ""}`;
}
// Les espèces emblématiques du territoire (carte d'identité, IDENTITE) : photo et nom (choix « 2A »), 8 au plus (« 3C »)
function emblemesTerritoire(t) {
  const id = typeof IDENTITE !== "undefined" ? IDENTITE[t] : null;
  const ici = new Set(especesDe(t).map(e => e.nom_courant));
  return ((id && id.emblemes) || []).map(n => especeParNom(n)).filter(e => e && ici.has(e.nom_courant)).slice(0, 8);
}
// Étape R247 (17/11, 36.25, choix 25B ; cas non prévus 8A, 9A) : la page d'un territoire, dans l'ordre :
//   le titre, le territoire en 2 lignes (sa phrase), la carte (petite France), puis les lieux numérotés comme les pastilles
//   (1 à N dans l'ordre d'ouverture ; le site remarquable = étoile sans numéro, en dernier). Une pastille touchée fait défiler
//   jusqu'à son lieu ; un lieu ouvert touché ouvre sa page ; un lieu fermé se déplie (ce qui l'attend, ce qui l'ouvre).
//   Plus de fiche du lieu choisi sous la carte ; plus de portrait (photo, chiffres) ; les espèces emblématiques restent
//   seulement dans l'aperçu d'un territoire fermé, en bande sous la liste (K3).
function phraseTerritoire(t) {
  const id = typeof IDENTITE !== "undefined" ? IDENTITE[t] : null;
  return id && id.phrase ? id.phrase : "";
}
function emblemesApercu(t) {
  const emb = emblemesTerritoire(t), autres = especesDe(t).length - emb.length;
  if (!emb.length) return "";
  return `<h2 class="at-titre">Ceux qui vous y attendent</h2>
    <div class="at-emblemes">${emb.map(e => `<button class="at-emb" type="button" data-nom="${echapper(e.nom_courant)}">
      <span class="at-emb-ph">${imgMini(photoEsp(e), e.nom_courant)}${estReconnue(e) ? `<i class="at-emb-ok" aria-label="Dans votre carnet">✓</i>` : ""}</span>
      <span>${echapper(e.nom_courant)}</span></button>`).join("")}</div>
    ${autres > 0 ? `<p class="at-note">et ${nombre(autres)} autres espèces, à découvrir sur place.</p>` : ""}`;
}
function dessinerAtlasTerritoire(zone, t) {
  const couleur = (TERRITOIRES[t] || {}).couleur || "#1F3A2E";
  const apercu = territoireEnApercu(t);
  const lieux = lieuxDe(t), site = siteRemarquable(t);
  const tous = site ? [...lieux, site] : lieux;
  const r = rangTerritoire(t);
  if (!atlasLieu && !apercu) { const l = lieuDernierJoue(t); atlasLieu = l ? l.nom : null; }   // son nom reste écrit sur la carte
  const carte = carteDesLieux(t, { largeur: 360, hauteur: 300, point: 0.85, relief: reliefTerritoire(t), apercu, numeros: true });
  const etiq = c => {
    if (c.type === "remarquable") return chapitreOuvert(t, c) && !apercu ? "Site remarquable · révision du territoire" : "Site remarquable · à la fin du territoire";
    if (apercu) return `${c.pays ? echapper(c.pays) + " · " : ""}${expeditionsDuChapitre(t, c.nom).length} expéditions`;
    const e = etatLieu(t, c), m = medailleLieu(t, c);
    if (e === "ferme") return prochainLieu(t) === c ? "Le prochain lieu" : "Plus tard";
    if (e === "fini") return (m ? MEDAILLES_LIEU[m].titre + " · " : "") + "terminé";
    return (m ? MEDAILLES_LIEU[m].titre + " · " : "") + (finaleAJouer(t, c) ? "finale à jouer" : e === "cours" ? "en cours" : "ouvert");
  };
  const numero = c => {
    if (c.type === "remarquable") return `<span class="at-lp site${chapitreOuvert(t, c) && !apercu ? "" : " ferme"}" aria-hidden="true"></span>`;
    const e = apercu ? "ferme" : etatLieu(t, c), enCours = !apercu && lieuDernierJoue(t) === c;
    return `<span class="at-num ${enCours ? "cours" : e === "cours" ? "ouvert" : e}" aria-hidden="true">${lieux.indexOf(c) + 1}</span>`;
  };
  const vedette = c => { const v = c.type === "remarquable" ? null : vedetteLieu(t, c); return v ? `<small class="at-lieu-ici">Ici : ${echapper(v.nom_courant)}</small>` : ""; };
  const ouvertIci = c => !apercu && chapitreOuvert(t, c);
  const ouverture = phraseOuverture(t), phrase = phraseTerritoire(t);
  zone.innerHTML = `
    <header class="at-tete terr">
      <button class="at-retour" type="button" aria-label="Retour à la France"><span aria-hidden="true">←</span></button>
      <div><small>France</small><h1>${echapper(t)}</h1></div>
      ${apercu ? `<span class="at-badge-apercu" style="--couleur-t:${couleur}">${LOCK_SVG}Aperçu</span>` : `<span class="at-emp">${PAS_SVG}<b>${r.empreintes}</b></span>`}
    </header>
    ${phrase ? `<p class="at-deux-lignes">${echapper(phrase)}</p>` : ""}
    ${apercu ? `<p class="at-bandeau-apercu" style="--couleur-t:${couleur}">${echapper(ouverture)} Vous pouvez déjà tout regarder.</p>` : ""}
    <div class="at-carte-terr" style="--couleur-t:${couleur}">${carte}${typeof miniFrance === "function" ? miniFrance(t) : ""}</div>
    <h2 class="at-titre">Les lieux</h2>
    <ul class="at-lieux">${tous.map(c => `<li class="at-li" data-lieu="${echapper(c.nom)}"><button class="at-lieu-ligne${ouvertIci(c) ? " ouvre" : " deplie"}" type="button" data-lieu="${echapper(c.nom)}"${ouvertIci(c) ? "" : ` aria-expanded="false"`}>
        ${numero(c)}<span><b>${echapper(c.nom)}</b><small>${etiq(c)}</small>${vedette(c)}</span>
        <span class="at-fleche" aria-hidden="true">${ouvertIci(c) ? "›" : "⌄"}</span></button><div class="at-depli" hidden></div></li>`).join("")}</ul>
    ${apercu ? `${emblemesApercu(t)}<section class="at-pour-y-aller" style="--couleur-t:${couleur}"><p><b>Pour y aller :</b> ${echapper(ouverture)}</p>
        <button class="at-continuer" type="button">Continuer ${echapper(dansTerritoire(territoireActif()))} <span aria-hidden="true">→</span></button></section>`
      : `<button class="at-page-terr" type="button">La page ${deTerritoire(t)} <span aria-hidden="true">→</span></button>`}`;
  zone.querySelector(".at-retour").onclick = () => { atlasTerritoire = null; afficherAtlas(); };
  const pageT = zone.querySelector(".at-page-terr");
  if (pageT) pageT.onclick = () => { changerTerritoire(t); montrer("accueil"); window.scrollTo(0, 0); };
  const cont = zone.querySelector(".at-continuer");
  if (cont) cont.onclick = () => { montrer("accueil"); window.scrollTo(0, 0); };
  zone.querySelectorAll(".at-emb").forEach(b => b.onclick = () => {
    const e = especeParNom(b.dataset.nom);
    if (e && estReconnue(e)) ouvrirPageEspece(e);
    else afficherBulle(`Vous ${pe(e).la} rencontrerez ${dansTerritoire(t)}`);   // R236 : le nom est affiché (K3)
  });
  const ligneDe = nom => [...zone.querySelectorAll(".at-li")].find(li => li.dataset.lieu === nom);
  // une pastille de la carte : on descend jusqu'à son lieu, qui s'éclaire un instant (et se déplie s'il est fermé)
  const montrerLieu = nom => {
    atlasLieu = nom;
    zone.querySelectorAll(".cl-lieu").forEach(g => g.classList.toggle("choisi", g.dataset.lieu === nom));
    const li = ligneDe(nom); if (!li) return;
    const b = li.querySelector(".at-lieu-ligne");
    if (b.classList.contains("deplie") && b.getAttribute("aria-expanded") !== "true") deplier(li, true);
    li.scrollIntoView({ behavior: "smooth", block: "center" });
    b.classList.remove("eclaire"); void b.offsetWidth; b.classList.add("eclaire");
  };
  const deplier = (li, oui) => {
    const b = li.querySelector(".at-lieu-ligne"), d = li.querySelector(".at-depli"), c = chapitreParNom(t, li.dataset.lieu);
    if (oui && !d.innerHTML) d.innerHTML = texteLieuFerme(t, c);
    d.hidden = !oui; b.setAttribute("aria-expanded", oui ? "true" : "false");
  };
  zone.querySelectorAll(".carte-lieux [data-lieu]").forEach(g => {
    g.addEventListener("click", () => montrerLieu(g.dataset.lieu));
    g.addEventListener("keydown", ev => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); montrerLieu(g.dataset.lieu); } });
  });
  zone.querySelectorAll(".at-lieu-ligne").forEach(b => b.onclick = () => {
    const c = chapitreParNom(t, b.dataset.lieu);
    if (!c) return;
    if (b.classList.contains("ouvre")) { changerTerritoire(t); if (c.type === "remarquable") ouvrirSite(t); else ouvrirLieu(t, c.nom); window.scrollTo(0, 0); return; }
    deplier(b.closest(".at-li"), b.getAttribute("aria-expanded") !== "true");
  });
  if (atlasLieu) zone.querySelectorAll(".cl-lieu").forEach(g => g.classList.toggle("choisi", g.dataset.lieu === atlasLieu));
}
// Étape R247 : ce qu'un lieu fermé (ou d'un territoire en aperçu) montre quand il se déplie : ce qui l'ouvre, puis ce qui l'attend
function texteLieuFerme(t, c) {
  const apercu = territoireEnApercu(t);
  if (c.type === "remarquable") return `<p class="at-lieu-phrase">${echapper(c.phrase || "Le site remarquable du territoire.")}</p>`
    + `<p class="at-ouvre">${apercu ? "Il s'ouvre à la fin du territoire." : "Il s'ouvre quand tous les lieux du territoire sont terminés."}</p>`;
  const ouvre = apercu ? "" : lieuPrecedent(t, c) && chapitreOuvert(t, lieuPrecedent(t, c))
    ? `S'ouvre à l'argent ${echapper(deLieu(lieuPrecedent(t, c).nom))} : ${texteManqueLieu(t, c, true).toLowerCase()}.` : "S'ouvrira plus tard.";
  return (ouvre ? `<p class="at-ouvre">${ouvre}</p>` : "") + avantGoutLieu(t, c);
}
// Étape K3 : un lieu pas encore ouvert (ou d'un territoire en aperçu) montre ce qui l'attend : sa phrase, ses expéditions, son espèce
function avantGoutLieu(t, c) {
  const exps = expeditionsDuChapitre(t, c.nom), v = vedetteLieu(t, c);
  return `${c.phrase ? `<p class="at-lieu-phrase">${echapper(c.phrase)}</p>` : ""}
    ${exps.length ? `<div class="at-exps"><b>${exps.length} expédition${exps.length > 1 ? "s" : ""} vous y attend${exps.length > 1 ? "ent" : ""}</b>
      <ul>${exps.map(x => `<li>${echapper(x.titre)}</li>`).join("")}</ul></div>` : ""}
    ${v ? `<div class="at-vedette">${imgMini(photoEsp(v), v.nom_courant)}<span>L'espèce du lieu<b>${echapper(v.nom_courant)}</b></span></div>` : ""}`;
}
