// ==================================================================
// 23. LA CARTE D'IDENTITÉ DES ESPÈCES : LES REPÈRES DE TERRAIN (étape R190, 13/11/2026)
// ==================================================================
// Choix d'Aubin (artefacts « Carte d'identité des espèces », séries 1 et 2) : présentation E, « la partie du corps + sa couleur ».
// Critère : en 10 secondes, 3 à 5 repères propres à l'espèce, comme dans un guide naturaliste ; la même carte au début
// et à la fin de la Rencontre ; ce qu'elle dit, on le redemande. Condition : « bien fait, pour éviter les fausses routes
// et la lourdeur à lire » (règles dans claude/reprise_carte_identite.md).
// Données : reperes.js (Données\reperes_terrain.xlsx + Outils\reperes\contours.py → Outils\reperes\gen_reperes.py).
//   • Le dessin d'une partie : la silhouette du modèle de la famille, la partie désignée en ocre (R190b). Il dit où regarder,
//     jamais quelle forme (les formes restent aux pictos validés et à la photo).
//   • La pastille n'est montrée que pour une couleur franche (colonne couleur ≠ NA).
//   • Seuls les repères « verifie » sont montrés ; « exemple » seulement en mode test (?test ou raccourci de test).
function modeTestReperes() {
  try { return /[?&]test\b/.test(location.search) || !!window.ACCES_TEST_OUVERT; } catch (e) { return false; }
}
function reperesDe(espece) {
  if (!espece || typeof REPERES === "undefined") return null;
  const r = REPERES[espece.nom_courant];
  if (!r || !r.reperes || !r.reperes.length) return null;
  if (r.etat === "verifie" || (r.etat === "exemple" && modeTestReperes())) return r;
  return null;
}
function contourDe(espece, r) {
  const k = (r && r.contour) || (typeof CONTOUR_PAR_FAMILLE !== "undefined" ? CONTOUR_PAR_FAMILLE[espece.onglet] : null);
  return k && k !== "aucun" && typeof CONTOURS_PARTIES !== "undefined" ? CONTOURS_PARTIES[k] || null : null;
}
// Étape R190b (choix d'Aubin : « vraie silhouette de la famille, zones adoucies ») : le dessin d'une partie = la silhouette
//   du modèle (une par grande forme, déposée une seule fois dans la page), et la zone en ocre, adoucie (flou) et découpée
//   dans la silhouette (masque). Il dit où regarder ; la photo de l'espèce, juste au-dessus, montre la forme.
let N_DESSIN_PARTIE = 0;
function deposerSilhouettesModeles() {
  if (typeof CONTOURS_PARTIES === "undefined" || document.getElementById("modeles-parties")) return;
  const defs = Object.entries(CONTOURS_PARTIES).map(([k, c]) => `<g id="mp-${k}">${c.silhouette}</g>`).join("");
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("id", "modeles-parties"); svg.setAttribute("width", "0"); svg.setAttribute("height", "0");
  svg.setAttribute("aria-hidden", "true"); svg.style.position = "absolute";
  svg.innerHTML = `<defs>${defs}</defs>`;
  document.body.appendChild(svg);
}
function dessinPartie(contour, partie) {
  if (!contour || !partie || partie === "NA") return "";
  const p = contour.parts.find(x => x.id === partie);
  if (!p) return "";
  deposerSilhouettesModeles();
  const k = Object.keys(CONTOURS_PARTIES).find(c => CONTOURS_PARTIES[c] === contour);
  const [x, y, w, h] = contour.viewBox.split(" ").map(Number);
  const n = ++N_DESSIN_PARTIE, flou = (Math.max(w, h) / 90).toFixed(1), trait = (Math.max(w, h) / 150).toFixed(1);
  return `<svg class="rp-dessin" viewBox="${contour.viewBox}" role="img" aria-label="${echapper(p.nom)}"><defs>`
    + `<mask id="rpm${n}" maskUnits="userSpaceOnUse" x="${x}" y="${y}" width="${w}" height="${h}"><use href="#mp-${k}" fill="#fff"/></mask>`
    + `<filter id="rpf${n}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${flou}"/></filter></defs>`
    + `<use href="#mp-${k}" class="rp-sil" stroke-width="${trait}"/>`
    + `<g mask="url(#rpm${n})"><g filter="url(#rpf${n})" class="rp-zone">${p.zone}</g></g></svg>`;
}
function pastilleRepere(couleur) {
  if (!couleur || couleur === "NA" || typeof PASTILLES === "undefined") return "";
  const c = PASTILLES[couleur] || { Rose: "#e3a6a0", Violet: "#7a4f8c", Doré: "#c9a227" }[couleur];
  return c ? ` <span class="rp-pastille" style="background:${c}" aria-hidden="true"></span>` : "";
}
// La carte : « Pour la reconnaître · retenez-les », une ligne par repère (dessin de la partie, texte, pastille)
//   opts.fin : la carte de fin (+ une ligne « À ne pas confondre », choix d'Aubin : seulement à la fin)
//   opts.arrivee : délai d'apparition (présentation), en secondes
function blocReperes(espece, opts = {}) {
  const r = reperesDe(espece);
  if (!r) return "";
  const contour = contourDe(espece, r);
  const lignes = r.reperes.map((x, i) => {
    const anim = opts.arrivee != null ? ` class="rp-ligne trait-arrive" style="animation-delay:${(opts.arrivee + 0.18 * i).toFixed(2)}s"` : ` class="rp-ligne"`;
    const dessin = dessinPartie(contour, x.partie);
    return `<li${anim}>${dessin ? `<span class="rp-image">${dessin}</span>` : `<span class="rp-image vide"></span>`}<span class="rp-texte">${echapper(x.texte)}${pastilleRepere(x.couleur)}</span></li>`;
  }).join("");
  let confusion = "";
  if (opts.fin && typeof confusionDe === "function") {
    const g = confusionDe(espece);
    if (g) {
      const autres = g.especes.filter(n => n !== espece.nom_courant);
      confusion = `<p class="rp-confusion"><small>À ne pas confondre avec ${echapper(listeDeNoms(autres))}</small>${echapper(majuscule(g.critere))}</p>`;
    }
  }
  const titre = opts.titre || (opts.fin ? "Ses repères" : "Pour la reconnaître · retenez-les");
  return `<div class="reperes${opts.fin ? " fin" : ""}"><p class="rp-titre">${titre}</p><ul class="rp-liste">${lignes}</ul>${confusion}</div>`;
}
