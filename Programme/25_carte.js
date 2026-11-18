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

// La place des noms sur la carte de France (unités de territoires.js) : x, y, taille, lignes
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
  "Corse": [1100, 985, 36, ["Corse"]],
};
// Le relief : une image par territoire, posée dans son cadre (RELIEF_CARTE, écrit par gen_relief.py dans relief_carte.js)
function reliefTerritoire(t) {
  if (typeof RELIEF_CARTE === "undefined" || !RELIEF_CARTE[t]) return "";
  const r = RELIEF_CARTE[t], forme = CARTE_TERRITOIRES.find(k => k.nom === t);
  if (!forme) return "";
  const id = "at-clip-" + Math.abs([...t].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7));
  return `<defs><clipPath id="${id}"><path d="${forme.contour}"/></clipPath></defs>`
    + `<image href="${r.fichier}" x="${r.cadre[0]}" y="${r.cadre[1]}" width="${r.cadre[2]}" height="${r.cadre[3]}" preserveAspectRatio="none" clip-path="url(#${id})" class="at-relief"/>`;
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
function dessinerAtlasFrance(zone) {
  const ouverts = territoiresOuverts(), fermes = territoiresFermes(), ici = territoireActif();
  const suivant = fermes.length ? prochainTerritoire() : null;
  const couleur = t => (TERRITOIRES[t] || {}).couleur || "#7a736a";
  const pale = c => melangerCouleurs(c, "#f4efe6", 0.30);
  let formes = "", noms = "";
  for (const k of CARTE_TERRITOIRES) {
    const ouvert = ouverts.includes(k.nom), c = ouvert ? couleur(k.nom) : pale(couleur(k.nom));
    formes += `<path d="${k.contour}" class="at-terr${ouvert ? " ouvert" : " ferme"}${k.nom === suivant ? " prochain" : ""}" data-t="${echapper(k.nom)}" style="fill:${c};stroke:${c}"/>`;
    const n = ATLAS_NOMS[k.nom];
    if (n) {
      const [x, y, z, lignes] = n;
      noms += `<text x="${x}" y="${y}" font-size="${z}" class="at-nom${ouvert ? "" : " ferme"}" style="stroke:${c}">`
        + lignes.map((l, i) => `<tspan x="${x}" dy="${i ? Math.round(z * 1.14) : 0}">${echapper(l)}</tspan>`).join("") + `</text>`;
    }
  }
  // le prochain territoire, cerné de pointillés ocre ; « vous êtes ici » : une petite maison
  const contourProchain = suivant ? CARTE_TERRITOIRES.filter(k => k.nom === suivant).map(k => `<path d="${k.contour}" class="at-prochain-trait"/>`).join("") : "";
  const c0 = ici && ATLAS_NOMS[ici];
  const maison = c0 ? (([x, y, z, l]) => { const yy = y - z * 1.55; return `<g class="at-ici" transform="translate(${x} ${yy})"><circle r="22"/><path d="M-11 2 0-9 11 2M-7 -1v11h14v-11"/></g>`; })(c0) : "";
  const ligne = t => {
    const c = carnetDe(especesDe(t));
    return `<li><button class="at-ligne" type="button" data-t="${echapper(t)}">
        <span class="at-pastille" style="background:${couleur(t)}"></span>
        <span class="at-ligne-corps"><b>${echapper(t)}${t === ici ? ` <small>· vous êtes ici</small>` : ""}</b>
          <small>${aDecouvrir(t)} · ${lieuxDe(t).filter(l => lieuTermine(t, l)).length} lieu${lieuxDe(t).filter(l => lieuTermine(t, l)).length > 1 ? "x" : ""} terminé${lieuxDe(t).filter(l => lieuTermine(t, l)).length > 1 ? "s" : ""} sur ${lieuxDe(t).length}</small>
          <i class="at-jauge"><em style="width:${c.pct}%;background:${couleur(t)}"></em></i></span>
        <span class="at-fleche" aria-hidden="true">›</span></button></li>`;
  };
  const autres = fermes.filter(t => t !== suivant);
  zone.innerHTML = `
    <header class="at-tete"><h1>Carte</h1><small>${ouverts.length} territoire${ouverts.length > 1 ? "s" : ""} ouvert${ouverts.length > 1 ? "s" : ""} sur ${tousLesTerritoires().length}</small></header>
    <div class="at-carte-france"><svg viewBox="${CARTE_CADRE}" role="img" aria-label="Carte de France des territoires">${formes}${contourProchain}${noms}${maison}</svg></div>
    <h2 class="at-titre">Vos territoires</h2>
    <ul class="at-liste">${[ici].filter(t => ouverts.includes(t)).concat(ouverts.filter(t => t !== ici)).map(ligne).join("")}</ul>
    ${suivant ? `<button class="at-suivant at-ligne-ferme" type="button" data-t="${echapper(suivant)}"><span class="at-pastille pale" style="background:${pale(couleur(suivant))};border-color:${couleur(suivant)}"></span>
        <span><b>Prochain territoire : ${echapper(suivant)}</b><small>${(m => m === null ? "" : m ? "Encore " + texteManque(m) : "Il s'ouvre maintenant")(avantProchainTerritoire())} · voir l'aperçu</small></span><span class="at-fleche" aria-hidden="true">›</span></button>` : ""}
    ${autres.length ? `<details class="at-plus-tard"><summary>Plus tard · ${autres.length} territoire${autres.length > 1 ? "s" : ""}</summary>
        <ul>${autres.map(t => `<li><button class="at-ligne-ferme" type="button" data-t="${echapper(t)}"><span class="at-pastille pale" style="background:${pale(couleur(t))}"></span><span>${echapper(t)}</span><span class="at-fleche" aria-hidden="true">›</span></button></li>`).join("")}</ul></details>` : ""}`;
  const aller = t => {   // étape K3 : ouvert ou fermé, on y va (un territoire fermé se montre en aperçu)
    if (!t) return;
    atlasTerritoire = t; atlasLieu = null; afficherAtlas();
  };
  zone.querySelectorAll(".at-terr").forEach(p => p.addEventListener("click", () => aller(p.dataset.t)));
  zone.querySelectorAll(".at-ligne, .at-ligne-ferme").forEach(b => b.onclick = () => aller(b.dataset.t));
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
  if (t === suivant) return m === null ? "C'est le prochain territoire." : m ? `C'est le prochain territoire : encore ${texteManque(m)}.` : "C'est le prochain territoire : il s'ouvre maintenant.";
  return `Ce territoire s'ouvrira plus tard.${suivant ? ` Prochain territoire : ${suivant}.` : ""}`;
}
// Les espèces emblématiques du territoire (carte d'identité, IDENTITE) : photo et nom (choix « 2A »), 8 au plus (« 3C »)
function emblemesTerritoire(t) {
  const id = typeof IDENTITE !== "undefined" ? IDENTITE[t] : null;
  const ici = new Set(especesDe(t).map(e => e.nom_courant));
  return ((id && id.emblemes) || []).map(n => especeParNom(n)).filter(e => e && ici.has(e.nom_courant)).slice(0, 8);
}
function portraitTerritoire(t) {
  const id = typeof IDENTITE !== "undefined" ? IDENTITE[t] : null;
  const ph = photoTerritoire(t, id), chiffres = chiffresTerritoire(t, id).slice(0, 3);
  const emb = emblemesTerritoire(t), autres = especesDe(t).length - emb.length;
  const vignette = e => `<button class="at-emb" type="button" data-nom="${echapper(e.nom_courant)}">
      <span class="at-emb-ph">${imgMini(photoEsp(e), e.nom_courant)}${estReconnue(e) ? `<i class="at-emb-ok" aria-label="Reconnue">✓</i>` : ""}</span>
      <span>${echapper(e.nom_courant)}</span></button>`;
  return `<section class="at-portrait">
      <img src="${ph.fichier}" alt="${echapper(ph.legende || t)}" loading="lazy">
      <div class="at-portrait-corps">
        ${ph.legende ? `<small class="at-portrait-leg">${legendeCouv(ph, true)}</small>` : ""}
        ${id && id.phrase ? `<p class="at-phrase">${echapper(id.phrase)}</p>` : ""}
        ${chiffres.length ? `<div class="at-chiffres">${chiffres.map(c => `<div><b>${echapper(c.valeur)}</b><small>${echapper(c.texte)}</small></div>`).join("")}</div>` : ""}
      </div></section>
    ${emb.length ? `<h2 class="at-titre">Ceux qui vous y attendent</h2>
    <div class="at-emblemes">${emb.map(vignette).join("")}</div>
    ${autres > 0 ? `<p class="at-note">et ${nombre(autres)} autres espèces, à découvrir sur place.</p>` : ""}` : ""}`;
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
      <span class="at-emb-ph">${imgMini(photoEsp(e), e.nom_courant)}${estReconnue(e) ? `<i class="at-emb-ok" aria-label="Reconnue">✓</i>` : ""}</span>
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
function dessinerChoixLieu(t, c) {
  const zone = document.getElementById("at-choix");
  if (!zone || !c) return;
  const couleur = (TERRITOIRES[t] || {}).couleur || "#1F3A2E";
  const apercu = territoireEnApercu(t);
  const site = c.type === "remarquable", ouvert = chapitreOuvert(t, c) && !apercu;
  let etat, texte = "", bouton = "", gout = "";
  if (apercu) {
    etat = site ? "Le site remarquable · à venir" : "Lieu à venir";
    gout = site ? `<p class="at-lieu-phrase">${echapper(c.phrase || "Le site remarquable du territoire.")}</p>` : avantGoutLieu(t, c);
  } else if (site) {
    etat = "Le site remarquable";
    texte = ouvert ? "Révision de tout le territoire." : "Il s'ouvre quand tous les lieux du territoire sont terminés.";
    if (ouvert) bouton = "Y aller";
  } else if (!ouvert) {
    etat = prochainLieu(t) === c ? "Le prochain lieu" : "Plus tard";
    texte = lieuPrecedent(t, c) && chapitreOuvert(t, lieuPrecedent(t, c))
      ? `S'ouvre à l'argent ${echapper(deLieu(lieuPrecedent(t, c).nom))} : ${texteManqueLieu(t, c, true).toLowerCase()}.`
      : "S'ouvrira plus tard.";
    gout = avantGoutLieu(t, c);
  } else {
    const e = etatLieu(t, c);
    etat = e === "fini" ? "Lieu terminé" : e === "cours" ? (lieuDernierJoue(t) === c ? "Lieu en cours" : "Lieu commencé") : "Lieu ouvert";
    texte = phraseMedaille(t, c);
    bouton = finaleAJouer(t, c) ? "Jouer la finale" : e === "cours" ? "Reprendre ici" : e === "fini" ? "Revoir ce lieu" : "Partir ici";
  }
  zone.style.setProperty("--couleur-t", couleur);
  zone.innerHTML = `<div class="at-choix-haut">
      <span class="at-choix-ph">${imgMini(c.photo, "")}</span>
      <div><small class="at-etiq">${apercu ? LOCK_SVG : ""}${etat}</small><h2>${echapper(c.nom)}</h2>${c.pays ? `<small class="at-pays">${echapper(c.pays)}</small>` : ""}</div></div>
    ${!site && ouvert ? sentierLieu(t, c, { court: true }) : ""}
    ${texte ? `<p>${texte}</p>` : ""}
    ${gout}
    ${bouton ? `<button class="at-aller" type="button">${bouton} <span aria-hidden="true">→</span></button>` : ""}`;
  const b = zone.querySelector(".at-aller");
  if (b) b.onclick = () => { changerTerritoire(t); if (site) ouvrirSite(t); else ouvrirLieu(t, c.nom); window.scrollTo(0, 0); };
}
