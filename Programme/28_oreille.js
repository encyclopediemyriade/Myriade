// ==================================================================
// 28. À L'OREILLE : « un cri, 4 photos » (étape E2-11, 16/11/2026)
// ==================================================================
// La seconde partie (reprise_seconde_partie.md), choix d'Aubin : série 1 « 5A » (4 photos, sans nom ; les noms
// apparaissent après la réponse) et série 2 « 5B » (après une erreur : écouter les deux, la bonne et votre choix,
// chacune avec sa ligne de cri).
//   • les espèces : celles qui ont un cri, déjà rencontrées (ou offertes au départ, E2-12) ; au moins 8 ;
//     en Mode Caddie, toutes (comme Coup d'œil) ;
//   • 10 cris par partie, jamais deux fois de suite le même ; pièges : des espèces qui ont aussi un cri,
//     du même milieu d'abord, puis de la même famille ;
//   • une bonne réponse compte pour l'espèce (« Cri à l'oreille », si elle est déjà rencontrée) ; une erreur n'est jamais punie ;
//   • pas de chronomètre ; on réécoute autant qu'on veut.
// Le jeu a son écran (#vue-oreille) et son état (oreille).
const OREILLE_CRIS = 10;
const OREILLE_MINIMUM = 8;
let oreille = null;            // la partie en cours
let sonOreille = null;         // le lecteur du cri en cours

JEUX.oreille = { nom: "À l'oreille", detail: `${OREILLE_CRIS} cris` };
PICTOS.oreille = '<path d="M7 10 C7 6.5 9.5 4 12.5 4 S18 6.5 18 9.5 C18 12 16 13 15 14.5 S14 18 12 19.5 C10.8 20.4 9.2 20 8.6 18.8"/><path d="M10 10 C10 8.6 11.1 7.5 12.5 7.5 S15 8.6 15 10"/><path d="M3 9 C3.6 7.8 4.2 7.1 5 6.5 M3 13 C3.7 14.2 4.3 14.9 5 15.5"/>';
if (!JEUX_ARCADE.includes("oreille")) JEUX_ARCADE.splice(JEUX_ARCADE.indexOf("coupdoeil") + 1, 0, "oreille");
REGLES_ARCADE.oreille = `Un cri, quatre photos : reconnaissez qui crie ou qui chante. Après une erreur, écoutez les deux. ${OREILLE_CRIS} cris par partie.`;
REGLES_COURTES.oreille = "Un cri, quatre photos : à qui est-il ?";

function especesOreille(especes) {
  const caddie = typeof coupToutes === "function" && coupToutes();
  return especes.filter(e => typeof aUnCri === "function" && aUnCri(e) && (caddie || estReconnue(e) || (typeof estOfferte === "function" && estOfferte(e))));
}
function possibiliteOreille(especes) {
  const n = especesOreille(especes).length;
  if (n >= OREILLE_MINIMUM) return { possible: true };
  const m = OREILLE_MINIMUM - n;
  return { possible: false, raison: `rencontrez encore ${m} espèce${m > 1 ? "s" : ""} qui crie${m > 1 ? "nt" : ""} ou chante${m > 1 ? "nt" : ""}` };
}
function metaOreille() {
  const c = suivi.oreille || {};
  if (c.record) return `Record : <b>${c.record} / ${OREILLE_CRIS}</b>`;
  return c.parties ? `${c.parties} partie${c.parties > 1 ? "s" : ""} jouée${c.parties > 1 ? "s" : ""}` : "Pas encore joué";
}
// Les pièges : des espèces qui ont un cri, du même milieu et de la même famille d'abord, puis de la même famille, puis le reste
function piegesOreille(e, pool) {
  const autres = pool.filter(x => x !== e && x.nom_courant !== e.nom_courant && aUnCri(x));
  const listes = [
    autres.filter(x => x.onglet === e.onglet && estRenseigne(e.milieu_principal) && x.milieu_principal === e.milieu_principal),
    autres.filter(x => x.onglet === e.onglet),
    autres
  ];
  const choisis = [];
  for (const l of listes) for (const x of melanger(l)) {
    if (choisis.length < 3 && !choisis.includes(x) && !choisis.some(c => c.nom_courant === x.nom_courant)) choisis.push(x);
  }
  return choisis;
}
function texteCri(e) { return estRenseigne(e.cri_son) ? majuscule(String(e.cri_son)) : ""; }
function ecouter(e) {
  if (sonOreille) { try { sonOreille.pause(); } catch (err) { /* rien */ } }
  sonOreille = new Audio(fichierSon(e));
  sonOreille.play().catch(() => {});
}

function lancerOreille(seules) {
  const T = typeof territoiresArcade === "function" ? territoiresArcade() : [territoireActif()];
  const F = typeof famillesArcade === "function" ? famillesArcade(T) : famillesDe(T);
  const d = construireDefi(T, F);
  if (!d) { afficherBulle("Aucune espèce avec ce choix"); return; }
  const jouables = especesOreille(d.especes);
  if (!seules && jouables.length < OREILLE_MINIMUM) { afficherBulle(conditionJeu("oreille", possibiliteOreille(d.especes))); return; }
  const vues = (suivi.oreille && suivi.oreille.vues) || {};
  let tirage;
  if (seules && seules.length) tirage = melanger(seules.slice());
  else {
    const ordre = melanger(jouables).sort((a, b) => (vues[a.nom_courant] || 0) - (vues[b.nom_courant] || 0));
    tirage = [];
    while (tirage.length < OREILLE_CRIS) tirage.push(...ordre.slice(0, OREILLE_CRIS - tirage.length));
    tirage = melanger(tirage);
    for (let k = 1; k < tirage.length; k++) if (tirage[k] === tirage[k - 1]) {
      const j = tirage.findIndex((x, m) => m > k && x !== tirage[k - 1] && x !== tirage[m - 1]);
      if (j > 0) [tirage[k], tirage[j]] = [tirage[j], tirage[k]];
    }
  }
  const pool = d.especes.filter(x => typeof aUnCri === "function" && aUnCri(x));
  const tours = tirage.map(e => ({ espece: e, noms: melanger([e, ...piegesOreille(e, pool)]), choix: null }));
  oreille = { tours, i: 0, bons: 0, revoir: !!seules };
  depuisArcade = true;
  montrer("oreille");
  afficherTourOreille();
}

function enteteOreille() {
  const pts = oreille.tours.map((t, k) => `<i class="${t.choix ? (t.choix === t.espece ? "ok" : "ko") : ""}${k === oreille.i && !t.choix ? " cur" : ""}"></i>`).join("");
  return `<div class="cdo-haut"><button class="cdo-quitter" id="ore-quitter">← Jeux</button>`
    + `<span class="cdo-titre">À l'oreille · ${Math.min(oreille.i + 1, oreille.tours.length)} / ${oreille.tours.length}</span><span class="cdo-pts">${pts}</span></div>`;
}
const ONDES_OREILLE = [10, 22, 30, 14, 26, 8, 18, 28, 12, 20, 6];
function afficherTourOreille() {
  const zone = document.getElementById("vue-oreille");
  const t = oreille.tours[oreille.i];
  zone.innerHTML = `<div class="cdo ore">${enteteOreille()}
      <div class="ore-ecoute"><button class="ore-play" id="ore-play" aria-label="Écouter le cri">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg></button>
        <div class="ore-ondes" aria-hidden="true">${ONDES_OREILLE.map(h => `<i style="height:${h}px"></i>`).join("")}</div>
        <p class="cdo-q">À qui est ce cri ?</p></div>
      <div class="ore-photos">${t.noms.map((e, k) => `<button class="ore-photo" data-k="${k}" aria-label="Réponse ${k + 1}">${celluleImage(e, true)}<span class="ore-nom"></span></button>`).join("")}</div>
      <p class="ore-aide" id="ore-aide">Les noms apparaissent après la réponse. Réécoutez autant de fois que vous voulez.</p>
      <div class="cdo-retour" id="ore-retour"></div>
    </div>`;
  document.getElementById("ore-play").onclick = () => ecouter(t.espece);
  zone.querySelectorAll(".ore-photo").forEach(b => b.onclick = () => repondreOreille(t.noms[+b.dataset.k], b));
  document.getElementById("ore-quitter").onclick = () => { oreille = null; montrer("arcade"); };
  window.scrollTo(0, 0);
  ecouter(t.espece);   // le cri se lance tout seul (le navigateur peut l'empêcher : le bouton reste là)
}
function repondreOreille(choisie, bouton) {
  const t = oreille.tours[oreille.i];
  if (t.choix) return;
  t.choix = choisie;
  const juste = choisie === t.espece;
  try { jouerSon(juste ? "bonne" : "mauvaise"); } catch (err) {}   // R239 (36.04)
  const zone = document.getElementById("vue-oreille");
  const grille = zone.querySelector(".ore-photos");
  if (grille) grille.classList.add("repondu", "agrandir-groupe");   // R239 (36.32) : la bonne en grand, les autres dessous ; (16b) toucher = agrandir
  zone.querySelectorAll(".ore-photo").forEach((b, k) => {
    b.setAttribute("aria-disabled", "true");   // (plus « disabled » : la photo doit rester touchable pour l'agrandir)
    b.classList.add("agr"); b.dataset.legende = t.noms[k].nom_courant;
    b.querySelector(".ore-nom").textContent = t.noms[k].nom_courant;
    if (t.noms[k] === t.espece) b.classList.add("bon");
    else if (b === bouton) b.classList.add("faux");
    else b.classList.add("autre");
  });
  suivi.oreille = suivi.oreille || { parties: 0, record: 0, vues: {} };
  suivi.oreille.vues = suivi.oreille.vues || {};
  suivi.oreille.vues[t.espece.nom_courant] = (suivi.oreille.vues[t.espece.nom_courant] || 0) + 1;
  if (juste) { oreille.bons++; if (estReconnue(t.espece)) acquerir(t.espece, "cri_son"); }   // une bonne réponse compte pour l'espèce
  else if (estReconnue(t.espece)) noterEchec(t.espece, "cri_son");
  sauvegarder();
  const aide = document.getElementById("ore-aide");
  if (aide) aide.remove();
  const fin = oreille.i >= oreille.tours.length - 1;
  const suivant = `<button class="cdo-suivant" id="ore-suivant">${fin ? "Voir le résultat" : "Cri suivant"}</button>`;
  const ligne = (e, cls, titre) => `<div class="ore-ligne ${cls}">${celluleImage(e, true)}<span><small>${titre}</small><b>${echapper(e.nom_courant)}</b>${texteCri(e) ? `<em>${echapper(texteCri(e))}</em>` : ""}</span>
      <button class="ore-mini" data-nom="${echapper(e.nom_courant)}" aria-label="Écouter ${echapper(e.nom_courant)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg></button></div>`;
  const retour = document.getElementById("ore-retour");
  if (juste) retour.innerHTML = `${texteCri(t.espece) ? `<p class="ore-cri">${echapper(texteCri(t.espece))}</p>` : ""}${suivant}`;   // R239 (36.09) : le nom est déjà sous la photo
  else retour.innerHTML = `<div class="ore-erreur"><small class="dfx-pas">Pas cette fois</small><b class="dfx-cetait">C'était ${echapper(nomAvecArticle(t.espece))}</b>
      <p class="ore-ecoutez">Écoutez les deux, l'un après l'autre :</p>${ligne(t.espece, "ok", "La bonne réponse")}${aUnCri(choisie) ? ligne(choisie, "ko", "Votre choix") : ""}</div>${suivant}`;
  retour.querySelectorAll(".ore-mini").forEach(b => b.onclick = () => ecouter(ESPECES.find(e => e.nom_courant === b.dataset.nom)));
  zone.querySelector(".cdo-pts").outerHTML = enteteOreille().match(/<span class="cdo-pts">.*<\/span>/)[0];
  document.getElementById("ore-suivant").onclick = () => { if (fin) finOreille(); else { oreille.i++; afficherTourOreille(); } };
  const btn = document.getElementById("ore-suivant"), r = btn.getBoundingClientRect();
  montrerSuiteJeu(btn, r);   // R234 (notes 15-16) : bouton fixé en bas sur téléphone, un seul défilement doux vers l'explication
}
function finOreille() {
  if (sonOreille) { try { sonOreille.pause(); } catch (err) { /* rien */ } }
  const c = suivi.oreille;
  const ancien = c.record || 0;
  if (!oreille.revoir) { c.parties = (c.parties || 0) + 1; c.record = Math.max(ancien, oreille.bons); }
  sauvegarder();
  const ratees = oreille.tours.filter(t => t.choix !== t.espece);
  const record = !oreille.revoir && oreille.bons > ancien && ancien > 0;
  const zone = document.getElementById("vue-oreille");
  zone.innerHTML = `<div class="cdo cdo-fin">
      <h2>${oreille.bons} sur ${oreille.tours.length}</h2>
      <p class="cdo-sous">${oreille.revoir ? "Révision des cris ratés" : `À l'oreille${record ? " · <b>nouveau record !</b>" : ` · record ${Math.max(ancien, oreille.bons)} / ${OREILLE_CRIS}`}`}</p>
      ${ratees.length ? `<div class="cdo-arevoir"><b>À revoir</b><ul>${ratees.map(t => `<li>${echapper(t.espece.nom_courant)}, confondue avec ${echapper(minuscule(t.choix.nom_courant))}</li>`).join("")}</ul></div>` : ""}
      <button class="cdo-suivant" id="ore-rejouer">Rejouer</button>
      ${ratees.length ? `<button class="cdo-second" id="ore-revoir">Réécouter ${ratees.length > 1 ? `les ${ratees.length} cris ratés` : "le cri raté"}</button>` : ""}
      <button class="cdo-second" id="ore-jeux">Retour aux jeux</button>
    </div>`;
  const especesRatees = [...new Set(ratees.map(t => t.espece))];
  document.getElementById("ore-rejouer").onclick = () => lancerOreille();
  const rv = document.getElementById("ore-revoir");
  if (rv) rv.onclick = () => lancerOreille(especesRatees);
  document.getElementById("ore-jeux").onclick = () => { oreille = null; montrer("arcade"); };
  window.scrollTo(0, 0);
}
