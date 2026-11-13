// 25_carte.js — L'espace « Carte » du téléphone (étape K2, 13/11/2026, n° 15 ; choix d'Aubin, artefact « Myriade · Espace carte »).
// Une partie du programme du jeu, chargée par jeu.html juste avant 19_application.js.
//
//   • Un onglet « Carte » dans la barre du bas (téléphone seulement ; l'ordinateur ne change pas).
//   • Il s'ouvre sur la France entière : la carte d'origine des 11 territoires (territoires.js), en aplats de couleur,
//     les noms écrits sur la carte, la liste des territoires en dessous.
//   • Un toucher sur un territoire ouvert : la vraie carte du territoire, les lieux en pastilles sobres (carteDesLieux, 17),
//     la montagne en ombrage doux (Images/Relief/relief_<territoire>.png, gen_relief.py), sans nom de sommet.
//     Un toucher sur un lieu le choisit : sa carte s'affiche dessous, avec le bouton pour y aller.

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
  if (atlasTerritoire && !territoiresOuverts().includes(atlasTerritoire)) atlasTerritoire = null;
  if (atlasTerritoire) dessinerAtlasTerritoire(zone, atlasTerritoire); else dessinerAtlasFrance(zone);
  window.scrollTo(0, 0);
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
    ${suivant ? `<div class="at-suivant"><span class="at-pastille pale" style="background:${pale(couleur(suivant))};border-color:${couleur(suivant)}"></span>
        <span><b>Prochain territoire : ${echapper(suivant)}</b><small>${(m => m === null ? "" : m ? "Encore " + texteManque(m) : "Il s'ouvre maintenant")(avantProchainTerritoire())}</small></span></div>` : ""}
    ${autres.length ? `<details class="at-plus-tard"><summary>Plus tard · ${autres.length} territoire${autres.length > 1 ? "s" : ""}</summary>
        <ul>${autres.map(t => `<li><span class="at-pastille pale" style="background:${pale(couleur(t))}"></span>${echapper(t)}</li>`).join("")}</ul></details>` : ""}`;
  const aller = t => {
    if (!t) return;
    if (!ouverts.includes(t)) {
      const m = avantProchainTerritoire();
      afficherBulle(t === suivant && m !== null ? `${t} s'ouvre avec encore ${texteManque(m)}` : `${t} s'ouvrira plus tard`);
      return;
    }
    atlasTerritoire = t; atlasLieu = null; afficherAtlas();
  };
  zone.querySelectorAll(".at-terr").forEach(p => p.addEventListener("click", () => aller(p.dataset.t)));
  zone.querySelectorAll(".at-ligne").forEach(b => b.onclick = () => aller(b.dataset.t));
}

// ---- 2. Un territoire : la vraie carte, les lieux en pastilles, le lieu choisi dessous ----
function dessinerAtlasTerritoire(zone, t) {
  const couleur = (TERRITOIRES[t] || {}).couleur || "#1F3A2E";
  const lieux = chapitresDe(t).filter(c => estLieu(c) || c.type === "remarquable");
  if (!atlasLieu || !lieux.some(c => c.nom === atlasLieu)) {
    const l = lieuDernierJoue(t) || lieux[0];
    atlasLieu = l ? l.nom : null;
  }
  const r = rangTerritoire(t);
  const carte = carteDesLieux(t, { largeur: 360, hauteur: 300, point: 0.85, relief: reliefTerritoire(t) });
  const etiq = c => {
    if (c.type === "remarquable") return chapitreOuvert(t, c) ? "Site remarquable" : "Site remarquable · à la fin du territoire";
    const e = etatLieu(t, c), m = medailleLieu(t, c);
    if (e === "ferme") return prochainLieu(t) === c ? "Le prochain lieu" : "Plus tard";
    if (e === "fini") return "Terminé";
    return (m ? MEDAILLES_LIEU[m].titre + " · " : "") + (finaleAJouer(t, c) ? "finale à jouer" : e === "cours" ? "en cours" : "ouvert");
  };
  const pastille = c => {
    if (c.type === "remarquable") return `<span class="at-lp site${chapitreOuvert(t, c) ? "" : " ferme"}"></span>`;
    const e = etatLieu(t, c), m = medailleLieu(t, c);
    return e !== "ferme" && m ? `<span class="at-lp med">${medailleSvg(m)}</span>` : `<span class="at-lp ${e}"></span>`;
  };
  zone.innerHTML = `
    <header class="at-tete terr">
      <button class="at-retour" type="button" aria-label="Retour à la France"><span aria-hidden="true">←</span></button>
      <div><small>France</small><h1>${echapper(t)}</h1></div>
      <span class="at-emp">${PAS_SVG}<b>${r.empreintes}</b></span>
    </header>
    <div class="at-carte-terr" style="--couleur-t:${couleur}">${carte}</div>
    <section class="at-choix" id="at-choix"></section>
    <h2 class="at-titre">Les lieux</h2>
    <ul class="at-lieux">${lieux.map(c => `<li><button class="at-lieu-ligne${c.nom === atlasLieu ? " choisi" : ""}" type="button" data-lieu="${echapper(c.nom)}">
        ${pastille(c)}<span><b>${echapper(c.nom)}</b><small>${etiq(c)}</small></span></button></li>`).join("")}</ul>
    <button class="at-page-terr" type="button">La page ${deTerritoire(t)} <span aria-hidden="true">→</span></button>`;
  zone.querySelector(".at-retour").onclick = () => { atlasTerritoire = null; afficherAtlas(); };
  zone.querySelector(".at-page-terr").onclick = () => { changerTerritoire(t); montrer("accueil"); window.scrollTo(0, 0); };
  const choisir = nom => {
    atlasLieu = nom;
    zone.querySelectorAll(".cl-lieu").forEach(g => g.classList.toggle("choisi", g.dataset.lieu === nom));
    zone.querySelectorAll(".at-lieu-ligne").forEach(b => b.classList.toggle("choisi", b.dataset.lieu === nom));
    dessinerChoixLieu(t, chapitreParNom(t, nom));
  };
  zone.querySelectorAll(".carte-lieux [data-lieu]").forEach(g => {
    g.addEventListener("click", () => choisir(g.dataset.lieu));
    g.addEventListener("keydown", ev => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); choisir(g.dataset.lieu); } });
  });
  zone.querySelectorAll(".at-lieu-ligne").forEach(b => b.onclick = () => {
    choisir(b.dataset.lieu);
    document.getElementById("at-choix").scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
  if (atlasLieu) choisir(atlasLieu);
}
function dessinerChoixLieu(t, c) {
  const zone = document.getElementById("at-choix");
  if (!zone || !c) return;
  const couleur = (TERRITOIRES[t] || {}).couleur || "#1F3A2E";
  const site = c.type === "remarquable", ouvert = chapitreOuvert(t, c);
  let etat, texte, bouton = "";
  if (site) {
    etat = "Le site remarquable";
    texte = ouvert ? "Révision de tout le territoire." : "Il s'ouvre quand tous les lieux du territoire sont terminés.";
    if (ouvert) bouton = "Y aller";
  } else if (!ouvert) {
    etat = prochainLieu(t) === c ? "Le prochain lieu" : "Plus tard";
    texte = lieuPrecedent(t, c) && chapitreOuvert(t, lieuPrecedent(t, c))
      ? `S'ouvre à l'argent ${echapper(deLieu(lieuPrecedent(t, c).nom))} : ${texteManqueLieu(t, c, true).toLowerCase()}.`
      : "S'ouvrira plus tard.";
  } else {
    const e = etatLieu(t, c);
    etat = e === "fini" ? "Lieu terminé" : e === "cours" ? (lieuDernierJoue(t) === c ? "Lieu en cours" : "Lieu commencé") : "Lieu ouvert";
    texte = phraseMedaille(t, c);
    bouton = finaleAJouer(t, c) ? "Jouer la finale" : e === "cours" ? "Reprendre ici" : e === "fini" ? "Revoir ce lieu" : "Partir ici";
  }
  zone.style.setProperty("--couleur-t", couleur);
  zone.innerHTML = `<div class="at-choix-haut">
      <span class="at-choix-ph">${imgMini(c.photo, "")}</span>
      <div><small class="at-etiq">${etat}</small><h2>${echapper(c.nom)}</h2>${c.pays ? `<small class="at-pays">${echapper(c.pays)}</small>` : ""}</div></div>
    ${!site && ouvert ? sentierLieu(t, c, { court: true }) : ""}
    <p>${texte}</p>
    ${bouton ? `<button class="at-aller" type="button">${bouton} <span aria-hidden="true">→</span></button>` : ""}`;
  const b = zone.querySelector(".at-aller");
  if (b) b.onclick = () => { changerTerritoire(t); if (site) ouvrirSite(t); else ouvrirLieu(t, c.nom); window.scrollTo(0, 0); };
}
