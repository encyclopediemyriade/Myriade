// ==================================================================
// 32. JOUER AVEC LA RARETÉ — étape R288 (22/11/2026, session 46, étape 3 ; Notion 46)
//   Choix d'Aubin (22/11, séries 1 et 2 de maquettes : « Mélange · 1A · 2A · 3B · 4C · 5D · 6D · P1 » puis « 2C · T2 · R1 · I2 · Critère ✓ ») :
//   « Chaque territoire promet des espèces rares à trouver et chaque lieu garde un trésor. On sait toujours combien il en reste à
//     trouver dans son territoire, rien ne dépend du hasard, et une espèce rare dit pourquoi elle est rare. »
//   • 1A  la marque : un petit mot sous le nom (« Rare », point ocre ; « Trésor du lieu », spirale de points du logo) ; fiche :
//         « Rare · <lieu> ». Le ruban doré sur la photo (étapes 206 et R277) disparaît.
//   • 2C  page du territoire : « Raretés · N / total · Trésors · N / lieux à trésor » sous le rang ; page du lieu : « Des espèces
//         rares vivent ici. » (aucun chiffre) ; à la fin du lieu (toutes ses expéditions faites), la fête « Expédition terminée »
//         de la dernière expédition dit le total des rares et ouvre la piste du trésor (pas de fête en plus).
//   • T2  rien n'annonce le trésor avant la fin du lieu ; ensuite « Ce lieu garde un trésor · Une piste s'est ouverte ».
//   • 4C + P1  la piste plein écran sur la photo du lieu : l'empreinte, le cri (ou la trace), les indices, puis le coin du trésor
//         et sa Rencontre. Aucune question, rien à rater ; un repère manquant est sauté, sans être remplacé.
//   • R1 + I2  dans l'album, les rares ressortent (liseré et fond ocre doux) ; une rare pas encore trouvée ouvre au toucher un
//         volet (son groupe, ses territoires ; jamais son nom ni son lieu).
//   • 5D  une rare entrée au carnet : une carte « article » (« Une rencontre rare », son nom, pourquoi elle est rare) ; le trésor
//         trouvé : une « couverture » plein écran sur la photo du lieu (statut, « Pourquoi il est rare. », « Ici. », « Ce qui marche. »).
//   • 6D  l'encadré « Pourquoi il / elle est rare » en fin de Rencontre et sur la fiche.
//   La piste ne compte pas pour la médaille du lieu ni pour les empreintes (la Rencontre du trésor est une Rencontre hors
//   expédition, R287 : son lieu lui sert de cadre).
// Données : rarete.js (TRESORS, POURQUOI_RARE ; Données\rarete_contenu.xlsx → Outils\gen_rarete.py ; jamais une case rose).
// Sauvegarde : suivi.tresors[« territoire|lieu »] = date ; suivi.finLieuRarete (fête de fin de lieu déjà montrée) ;
//   suivi.gardeR288 / suivi.r288 (la reprise des parties d'avant : rien ne recule).
// RARETE_R288 = false : le jeu d'avant (ruban doré, encart « Une rencontre rare »), sans piste ni trésor.
// ==================================================================
const RARETE_R288 = true;

// ---- Les données ----
function tousLesTresors() { return RARETE_R288 && typeof TRESORS !== "undefined" ? TRESORS : []; }
function cleTresor(T) { return T.territoire + "|" + T.lieu; }
function tresorDuLieu(t, nom) { return tousLesTresors().find(T => T.territoire === t && T.lieu === nom) || null; }
function tresorParCle(k) { return tousLesTresors().find(T => cleTresor(T) === k) || null; }
function tresorsDe(t) { return tousLesTresors().filter(T => T.territoire === t && chapitreParNom(t, T.lieu)); }
function especeDuTresor(T) { return T ? especeParNom(T.nom) : null; }
function tresorTrouve(T) { return !!(T && typeof suivi === "object" && suivi && suivi.tresors && suivi.tresors[cleTresor(T)]); }
function tresorsTrouvesDe(e) { return e ? tousLesTresors().filter(T => T.nom === e.nom_courant && tresorTrouve(T)) : []; }
function estTresorTrouve(e) { return tresorsTrouvesDe(e).length > 0; }
const memoDansExp = new Set();
function dansUneExpedition(e) {
  if (!memoDansExp.size) for (const x of toutesExpeditions()) for (const f of x.liste) memoDansExp.add(f.nom_courant);
  return memoDansExp.has(e.nom_courant);
}
// Un trésor qu'on ne trouve qu'au bout de sa piste (dans aucune expédition) et pas encore au carnet : on ne le montre nulle part avant
function especeReserveeTresor(e) { return !!e && tousLesTresors().some(T => T.nom === e.nom_courant) && !dansUneExpedition(e) && !estReconnue(e); }
// La piste s'ouvre quand toutes les expéditions du lieu sont faites (T2)
function pisteOuverte(T) { const c = T && chapitreParNom(T.territoire, T.lieu); return !!c && chapitreFini(T.territoire, c); }   // (un lieu fini est forcément ouvert)
// Les rares : la valeur « Rare » de la colonne rarete_observation (estRare, 09), dans les expéditions (le trésor n'y est plus)
const memoRaresTerr = new Map();
function raresDuTerritoire(t) {
  if (!memoRaresTerr.has(t)) memoRaresTerr.set(t, [...new Set(expeditionsDe(t).flatMap(x => x.liste))].filter(estRare));
  return memoRaresTerr.get(t);
}
function raresDuLieu(t, c) { return [...new Set(expeditionsDuChapitre(t, c.nom).flatMap(x => x.liste))].filter(estRare); }
function phrasePourquoi(e) { return (e && typeof POURQUOI_RARE !== "undefined" && POURQUOI_RARE[e.nom_courant]) || ""; }
function confirmeR288(e, champ) { return estRenseigne(e[champ]) && e[champ] !== "NA" && !(e.a_confirmer || []).includes(champ); }
function dansLeTerritoire(t) { const a = typeof articleTerritoire === "function" ? articleTerritoire(t) : "le"; return a === "en" ? `en ${t}` : /'$/.test(a) ? `dans ${a}${t}` : `dans ${a} ${t}`; }
function minR288(t) { return t ? t.charAt(0).toLowerCase() + t.slice(1) : ""; }

// ---- 1A · La marque ----
const SPIRALE_R288 = `<svg class="mq-spirale" viewBox="20 20 72 72" aria-hidden="true"><g fill="currentColor"><circle cx="52.9" cy="58.5" r="5"/><circle cx="41.2" cy="61.7" r="5.7"/><circle cx="30.7" cy="49.9" r="6.5"/><circle cx="37.6" cy="31.6" r="7.2"/><circle cx="60.8" cy="28.6" r="8"/><circle cx="76.7" cy="50.5" r="8.7"/><circle cx="63.7" cy="78.4" r="9.4"/><circle cx="29.2" cy="81" r="10.2"/></g></svg>`;
function marqueRarete(e) {
  if (!RARETE_R288 || !e) return "";
  if (estTresorTrouve(e)) return `<span class="mq-rare tresor">${SPIRALE_R288}Trésor du lieu</span>`;
  return estRare(e) ? `<span class="mq-rare"><i class="mq-point" aria-hidden="true"></i>Rare</span>` : "";
}
// Le lieu d'une rare : celui de son trésor trouvé, sinon le lieu de son expédition (dans le territoire où l'on joue d'abord)
function lieuDeLaRare(e) {
  const tr = tresorsTrouvesDe(e), ta = typeof territoireActif === "function" ? territoireActif() : null;
  if (tr.length) return (tr.find(T => T.territoire === ta) || tr[0]).lieu;
  const xs = toutesExpeditions().filter(x => x.chapitre && x.liste.includes(e));
  const x = xs.find(y => y.territoire === ta) || xs[0];
  return x ? x.chapitre : "";
}
// ---- 6D · « Pourquoi il / elle est rare » ----
function encadrePourquoi(e, cl) {
  const p = RARETE_R288 && e && (estRare(e) || estTresorTrouve(e)) ? phrasePourquoi(e) : "";   // R290 : un trésor « Peu commun » (la sittelle corse) a aussi son encadré
  if (!p) return "";
  return `<div class="rr-pourquoi${cl ? " " + cl : ""}"><div class="rrp-titre">Pourquoi ${pe(e).elle} est rare</div><p>${echapper(p)}</p></div>`;
}
// La fiche (06) : « Rare · Vallée d'Aspe » sous le nom scientifique, puis l'encadré
function ficheRarete(e) {
  if (!RARETE_R288 || !e || !(estRare(e) || estTresorTrouve(e))) return "";   // R290 : même pour un trésor « Peu commun »
  const lieu = lieuDeLaRare(e), tr = estTresorTrouve(e);
  return `<div class="mq-rare-fiche${tr ? " tresor" : ""}">${tr ? SPIRALE_R288 : `<i class="mq-point" aria-hidden="true"></i>`}${tr ? "Trésor du lieu" : "Rare"}${lieu ? ` · ${echapper(lieu)}` : ""}</div>`
    + encadrePourquoi(e, "rrp-fiche");
}
// La fin de Rencontre (17) : l'encadré sous le titre (sous la photo de fin)
function poserEncadrePourquoi(s) {
  if (!RARETE_R288 || !s || !s.focus) return;
  const h = encadrePourquoi(s.focus);
  if (!h) return;
  for (const z of document.querySelectorAll("#fin-session > .resume-fin-tel")) {
    if (z.querySelector(".rr-pourquoi")) continue;
    const apres = z.querySelector(".rft-grande") || z.querySelector(".rft-espece");
    if (apres) apres.insertAdjacentHTML("afterend", h);
  }
}

// ---- 2C · Les comptes ----
function ligneRaretesTerritoire(t, cl) {
  if (!RARETE_R288 || !t) return "";
  const r = raresDuTerritoire(t), T = tresorsDe(t);
  if (!r.length && !T.length) return "";
  const n = r.filter(e => estReconnue(e)).length, nt = T.filter(tresorTrouve).length;
  return `<div class="raretes-terr${cl ? " " + cl : ""}">`
    + (r.length ? `<span title="Espèces rares du territoire dans votre carnet"><i class="mq-point" aria-hidden="true"></i>Raretés · <b>${nombre(n)}</b> / ${nombre(r.length)}</span>` : "")
    + (T.length ? `<span title="Trésors des lieux trouvés">${SPIRALE_R288}Trésors · <b>${nombre(nt)}</b> / ${nombre(T.length)}</span>` : "")
    + `</div>`;
}
function motsPiste(T, e) {
  const l = etapesPiste(T, e).filter(k => k !== "coin").map(k => ({ empreinte: "une empreinte", cri: "un cri", trace: "une trace", indices: "des indices" })[k]);
  return l.length > 1 ? l.slice(0, -1).join(", ") + " et " + l[l.length - 1] : l.join("");
}
// La page du lieu (17) : la promesse, puis le trésor à la fin du lieu
function blocRareteLieu(t, c) {
  if (!RARETE_R288 || !c || !estLieu(c)) return "";
  const T = tresorDuLieu(t, c.nom), e = especeDuTresor(T);
  let h = raresDuLieu(t, c).length ? `<p class="rarete-lieu"><i class="mq-point" aria-hidden="true"></i>Des espèces rares vivent ici.</p>` : "";
  if (T && e && tresorTrouve(T))
    h += `<button type="button" class="tresor-trouve" data-nom="${echapper(e.nom_courant)}">${SPIRALE_R288}<span><small>Trésor du lieu</small><b>${echapper(e.nom_courant)}</b></span><span class="tt-fl" aria-hidden="true">›</span></button>`;
  else if (T && e && pisteOuverte(T))
    h += `<section class="tresor-lieu"><small class="tl-kick">Nouveau</small><b class="tl-titre">Ce lieu garde un trésor</b>`
      + `<p>Une piste s'est ouverte : ${motsPiste(T, e)}.</p><button type="button" class="tl-go" id="rarete-piste">Suivre la piste <span aria-hidden="true">▶</span></button></section>`;
  return h ? `<div class="rarete-bloc">${h}</div>` : "";
}
function brancherRareteLieu(zone, t, c) {
  const T = tresorDuLieu(t, c.nom);
  const go = zone.querySelector("#rarete-piste"); if (go && T) go.onclick = () => ouvrirPisteTresor(T);
  const tr = zone.querySelector(".tresor-trouve"); if (tr) tr.onclick = () => { const e = especeParNom(tr.dataset.nom); if (e) ouvrirPageEspece(e); };
}
// La fin du lieu (04, suiteFetes) : la fête « Expédition terminée » de la dernière expédition du lieu le dit, une seule fois
function blocFeteFinLieu(f) {
  if (!RARETE_R288 || !f || !f.exp || !/^Expédition terminée/.test(f.titre || "") || !suivi) return "";
  const x = f.exp, t = x.territoire, c = x.chapitre && chapitreParNom(t, x.chapitre);
  if (!c || !estLieu(c) || !chapitreFini(t, c) || toutDebloque()) return "";
  const k = t + "|" + c.nom;
  suivi.finLieuRarete = suivi.finLieuRarete || {};
  if (suivi.finLieuRarete[k]) return "";
  const rares = raresDuLieu(t, c), T = tresorDuLieu(t, c.nom), piste = !!T && !tresorTrouve(T) && !!especeDuTresor(T);
  if (!rares.length && !piste) return "";
  suivi.finLieuRarete[k] = Date.now(); sauvegarder();
  const vig = rares.slice(0, 10).map(e => `<span class="ffl-vig">${imgMini(photoEsp(e), e.nom_courant)}</span>`).join("");
  return `<div class="fete-fin-lieu"><div class="ffl-kick">${echapper(c.nom)} · expéditions terminées</div>`
    + (rares.length ? `<div class="ffl-titre">${rares.length > 1 ? `Vous avez trouvé ses ${rares.length} espèces rares` : "Vous avez trouvé son espèce rare"}</div>`
                    + `<div class="ffl-grille">${vig}${rares.length > 10 ? `<span class="ffl-plus">+${rares.length - 10}</span>` : ""}</div>` : "")
    + (piste ? `<p class="ffl-tresor">${rares.length ? "Et le lieu garde encore un trésor" : "Le lieu garde un trésor"} : sa piste est ouverte.</p>`
             + `<button type="button" class="ffl-piste" data-tresor="${echapper(cleTresor(T))}">Suivre la piste du trésor</button>` : "")
    + `</div>`;
}
function brancherFeteFinLieu(carte) {
  const b = carte.querySelector(".ffl-piste");
  if (b) b.onclick = ev => { ev.stopPropagation(); const T = tresorParCle(b.dataset.tresor); fermerFete(); if (T) ouvrirPisteTresor(T); };
}

// ---- 4C + P1 · La piste du trésor ----
//   Les repères, dans l'ordre : l'empreinte (un dessin du jeu), le cri (un son du jeu) ou sinon la trace, les indices (milieu,
//   activité, hiver), puis le coin du trésor. Un repère manquant est sauté (jamais remplacé). Le même chemin sur chaque photo.
const POINTS_PISTE = [[34, 318], [96, 268], [158, 290], [212, 228], [256, 178], [288, 118]];
const RANGS_REPERES = ["Premier repère", "Deuxième repère", "Troisième repère", "Quatrième repère"];
let piste = null;
// Étape R289 (22/11, choix « A » d'Aubin, 15 h 09) : avec une empreinte, « empreinte, puis cri (sinon trace), puis indices »
//   (comme R288) ; sans empreinte, le cri et la trace sont deux repères : « cri, puis trace, puis indices ». Un repère manquant
//   est toujours sauté, sans être remplacé ; le coin du trésor reste le dernier, en plus.
function etapesPiste(T, e) {
  const p = (T && T.piste) || {}, l = [];
  const empreinte = !!p.empreinte && fichierEmpreinte(e) !== "NA", cri = !!p.cri && fichierSon(e) !== "NA", trace = !!p.trace;
  if (empreinte) { l.push("empreinte"); if (cri) l.push("cri"); else if (trace) l.push("trace"); }
  else { if (cri) l.push("cri"); if (trace) l.push("trace"); }
  if (p.milieu || p.activite || p.hiver) l.push("indices");
  l.push("coin");
  return l;
}
function ouvrirPisteTresor(T) {
  const e = especeDuTresor(T), c = T && chapitreParNom(T.territoire, T.lieu);
  if (!e || !c) return;
  piste = { T, e, c, etapes: etapesPiste(T, e), i: 0 };
  let z = document.getElementById("piste-tresor");
  if (!z) { z = document.createElement("div"); z.id = "piste-tresor"; z.setAttribute("role", "dialog"); z.setAttribute("aria-modal", "true"); document.body.appendChild(z); }
  z.setAttribute("aria-label", "La piste du trésor");
  z.classList.add("on"); document.documentElement.classList.add("piste-ouverte");
  dessinerPiste();
  document.removeEventListener("keydown", clavierPiste); document.addEventListener("keydown", clavierPiste);
}
function fermerPisteTresor() {
  const z = document.getElementById("piste-tresor");
  if (z) { z.classList.remove("on"); z.innerHTML = ""; }
  document.documentElement.classList.remove("piste-ouverte");
  document.removeEventListener("keydown", clavierPiste);
  if (piste && piste.son) try { piste.son.pause(); } catch (err) { /* rien */ }
  piste = null;
}
function clavierPiste(ev) {
  if (!piste) return;
  if (ev.key === "Escape") { ev.preventDefault(); fermerPisteTresor(); }
  else if (ev.key === "Enter" || ev.key === "ArrowRight") { const b = document.querySelector("#piste-tresor .pt-suite"); if (b && document.activeElement !== b) { ev.preventDefault(); b.click(); } }
}
function lignesIndices(T, e) {
  const p = T.piste || {}, f = e.genre_nom === "féminin";
  const hiver = { "reste actif": `${pe(e).Elle} reste ${f ? "active" : "actif"}`, "s'endort ou ralentit": `${pe(e).Elle} s'endort ou ralentit`,
                  "part de la région": `${pe(e).Elle} quitte la région`, "en partie": "Une partie quitte la région" }[String(p.hiver || "").toLowerCase()];
  return [p.milieu && ["Son milieu", p.milieu], p.activite && ["Quand", p.activite], hiver && ["L'hiver", hiver]].filter(Boolean);
}
function dessinerPiste() {
  const z = document.getElementById("piste-tresor"), P = piste;
  if (!z || !P) return;
  const n = P.etapes.length, k = P.i, quoi = P.etapes[k], coin = quoi === "coin";
  const arrets = P.etapes.map((_, j) => POINTS_PISTE[n === 1 ? 5 : Math.round(j * 5 / (n - 1))]);
  const d = "M" + POINTS_PISTE.map(p => p.join(" ")).join(" L");
  const fait = "M" + POINTS_PISTE.slice(0, (n === 1 ? 5 : Math.round(k * 5 / (n - 1))) + 1).map(p => p.join(" ")).join(" L");
  const ronds = arrets.map(([x, y], j) => j === n - 1 ? "" : `<circle cx="${x}" cy="${y}" r="${j === k ? 11 : 7}" class="pt-arret${j < k ? " fait" : j === k ? " ici" : ""}"/>`).join("");
  const [cx, cy] = arrets[n - 1];
  const rangRep = RANGS_REPERES[P.etapes.slice(0, k).filter(q => q !== "coin").length] || "Repère";
  let corps = "";
  if (quoi === "empreinte") {
    const dessin = typeof dessinEmpreinte === "function" ? dessinEmpreinte(P.e, 92, 92).html : `<img src="${fichierEmpreinte(P.e)}" alt="">`;
    const tx = EMPREINTES[cleEmpreinte(P.e)];
    corps = `<div class="pt-rep pt-avec-dessin"><span class="pt-dessin">${dessin}</span><div><small>${rangRep}</small><p>Une empreinte${tx && tx.texte ? ` : ${echapper(tx.texte)}` : ""}.</p></div></div>`;
  } else if (quoi === "cri") {
    const s = typeof SONS !== "undefined" && SONS[cleEmpreinte(P.e)];
    corps = `<div class="pt-rep"><small>${rangRep}</small><p>Un cri, tout près d'ici.</p>`
      + `<button type="button" class="pt-ecouter" id="pt-ecouter"><span aria-hidden="true">▶</span> Écouter</button>`
      + (s && s.texte ? `<p class="pt-entendu cache" id="pt-entendu">On entend ${echapper(s.texte)}.</p>` : "") + `</div>`;
  } else if (quoi === "trace") {
    corps = `<div class="pt-rep"><small>${rangRep}</small><p>Une trace : ${echapper(minR288(String(P.T.piste.trace).replace(/\.$/, "")))}.</p></div>`;
  } else if (quoi === "indices") {
    corps = `<div class="pt-rep"><small>${rangRep}</small><dl class="pt-indices">${lignesIndices(P.T, P.e).map(([a, b]) => `<div><dt>${a}</dt><dd>${echapper(b)}</dd></div>`).join("")}</dl></div>`;
  } else {
    corps = `<div class="pt-rep pt-coin-texte"><small>Le coin du trésor</small><p class="pt-coin-lieu">${echapper(P.c.nom)}</p><p>Il est là, tout près. Approchez sans bruit.</p></div>`;
  }
  const suivant = P.etapes[k + 1];
  const bouton = coin ? "Faire sa Rencontre" : suivant === "coin" ? "Aller au coin du trésor" : "Repère suivant";
  z.classList.toggle("au-coin", coin);
  z.innerHTML = `<div class="pt-haut"><img class="pt-photo" src="${srcEcran(P.c.photo)}" alt="" onerror="if (this.src.includes('/moy/')) this.src='${P.c.photo}';">
      <div class="pt-voile" aria-hidden="true"></div>
      <svg class="pt-chemin" viewBox="0 0 340 360" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <path d="${d}" class="pt-trace-tout"/><path d="${fait}" class="pt-trace-fait"/>${ronds}
        <circle cx="${cx}" cy="${cy}" r="${coin ? 42 : 16}" class="pt-coin${coin ? " ouvert" : ""}"/>
        ${coin ? `<image href="${fichierSilhouette(P.e)}" x="${cx - 31}" y="${cy - 31}" width="62" height="62" class="pt-sil" preserveAspectRatio="xMidYMid meet"/>` : ""}
      </svg>
      <button type="button" class="pt-retour" id="pt-retour">← Retour au lieu</button>
      <div class="pt-titre"><small>La piste du trésor</small><b>${k + 1} / ${n}</b></div></div>
    <div class="pt-bas">${corps}<button type="button" class="pt-suite" id="pt-suite">${bouton} <span aria-hidden="true">▶</span></button></div>`;
  if (coin) {   // le halo s'ouvre autour du cercle du coin (sa place réelle à l'écran, le chemin étant mis à l'échelle de la photo)
    const hz = z.querySelector(".pt-haut").getBoundingClientRect(), svg = z.querySelector(".pt-chemin"), v = z.querySelector(".pt-voile");
    try {   // le point du coin dans le dessin, ramené à l'écran (pas le cercle lui-même : il grandit pendant son animation)
      const m = svg.getScreenCTM(), pt = svg.createSVGPoint(); pt.x = cx; pt.y = cy;
      const q = pt.matrixTransform(m);
      v.style.setProperty("--cx", `${Math.round(q.x - hz.left)}px`); v.style.setProperty("--cy", `${Math.round(q.y - hz.top)}px`);
    } catch (err) { /* le halo reste à sa place par défaut */ }
  }
  z.querySelector("#pt-retour").onclick = fermerPisteTresor;
  z.querySelector("#pt-suite").onclick = () => {
    if (!piste) return;
    if (coin) { lancerRencontreTresor(piste.T); return; }
    if (piste.son) try { piste.son.pause(); } catch (err) { /* rien */ }
    piste.i++; dessinerPiste();
  };
  const ec = z.querySelector("#pt-ecouter");
  if (ec) ec.onclick = () => {
    try { if (!piste.son) piste.son = new Audio(fichierSon(piste.e)); piste.son.currentTime = 0; const pr = piste.son.play(); if (pr && pr.catch) pr.catch(() => {}); } catch (err) { /* pas de son : tant pis */ }
    const t = z.querySelector("#pt-entendu"); if (t) t.classList.remove("cache");
    ec.classList.add("joue");
  };
  const b = z.querySelector("#pt-suite"); if (b && !("ontouchstart" in window)) b.focus({ preventScroll: true });
}
// La Rencontre du trésor : la Rencontre en trois temps (R287), avec une expédition de son lieu pour cadre (elle ne compte pas pour elle)
let tresorEnCours = null;
function cadreTresor(e) {
  const T = tresorEnCours;
  if (!T || !e || T.nom !== e.nom_courant) return null;
  const l = expeditionsDuChapitre(T.territoire, T.lieu);
  return l.find(x => x.milieu === e.milieu_principal) || l.find(x => x.liste.some(f => f.onglet === e.onglet)) || l[0] || null;
}
function lancerRencontreTresor(T) {
  const e = especeDuTresor(T);
  if (!e) return;
  fermerPisteTresor();
  tresorEnCours = T;
  try { lancerRencontreAvec(e); } finally { tresorEnCours = null; }
  if (typeof session !== "undefined" && session && session.focus === e) session.tresor = cleTresor(T);
}
function retourTresor(s) {
  const T = tresorParCle(s.tresor);
  return { texte: "← Retour au lieu", action: () => { session = null; if (T) { ouvrirLieu(T.territoire, T.lieu); window.scrollTo(0, 0); } else montrer("accueil"); } };
}
// Fin de la Rencontre du trésor (17) : il est trouvé ; la grande fête « couverture » (5D), une seule fois
function finRencontreTresor(s) {
  if (!RARETE_R288 || !s || !s.tresor || s.tresorFete || !suivi) return;
  const T = tresorParCle(s.tresor);
  if (!T) return;
  s.tresorFete = true;
  suivi.tresors = suivi.tresors || {};
  if (suivi.tresors[s.tresor]) return;
  suivi.tresors[s.tresor] = Date.now(); sauvegarder();
  feterTresor(T);
}
function feterTresor(T) {
  const e = especeDuTresor(T), c = chapitreParNom(T.territoire, T.lieu);
  if (!e || !c) return;
  const v = confirmeR288(e, "statut_conservation_france") && !/mineure|non évalué|insuffisantes|non applicable/i.test(e.statut_conservation_france)
    ? `${typeof motStatut === "function" ? motStatut(e.statut_conservation_france) : e.statut_conservation_france} en France` : "";
  const p = phrasePourquoi(e);
  const lignes = [p && `<b>Pourquoi ${pe(e).elle} est rare.</b> ${echapper(p)}`, T.ici && `<b>Ici.</b> ${echapper(T.ici)}`, T.marche && `<b>Ce qui marche.</b> ${echapper(T.marche)}`].filter(Boolean);
  const titre = typeof nomAvecArticle === "function" ? majuscule(nomAvecArticle(e)) : e.nom_courant;
  feter({ taille: "grande", photo: estRenseigne(c.photo) ? srcEcran(c.photo) : "", classe: "fete-r288-revue", son: "badge",
          etiquette: `Trésor ${typeof deLieu === "function" ? deLieu(c.nom) : "de " + c.nom}`, titre,
          detail: (v ? `<div class="rv-statut">${echapper(v)}</div>` : "") + (lignes.length ? `<div class="rv-lignes">${lignes.map(l => `<p>${l}</p>`).join("")}</div>` : ""),
          visuel: `<div class="fete-visuel rv-visuel"><span class="photo-fete">${imgMini(photoEsp(e), e.nom_courant)}</span></div>` });
}
// ---- 5D · La carte « article » d'une rare qui entre au carnet ----
function feterArticleRare(e) {
  if (!e) return;
  const t = typeof territoireActif === "function" ? territoireActif() : null, r = t ? raresDuTerritoire(t) : [];
  const n = r.filter(x => estReconnue(x)).length;
  const p = phrasePourquoi(e) || "Une espèce rare à observer dans la nature.";
  feter({ classe: "fete-r288-article", son: "badge", garder: true, pop: { couleur: classeDe(e).couleur, image: celluleImage(e, true), etiquette: "Une rencontre rare", titre: e.nom_courant },
          visuel: `<div class="art-photo">${estRenseigne(e.photo) ? `<img src="${srcEcran(e.photo)}" alt="" onerror="if (this.src.includes('/moy/')) this.src='${e.photo}';">` : `<img class="art-sil" src="${fichierSilhouette(e)}" alt="">`}</div>`,
          etiquette: "Une rencontre rare", titre: echapper(e.nom_courant),
          detail: `<p class="art-chapo">${echapper(p)}</p>${r.includes(e) ? `<small class="art-compte">Raretés ${deTerritoire(t)} · ${nombre(n)} sur ${nombre(r.length)}</small>` : ""}` });
}

// ---- I2 · Le volet d'une rare pas encore trouvée ----
function territoiresDeLaRare(e) {
  const s = new Set(toutesExpeditions().filter(x => x.liste.includes(e)).map(x => x.territoire));
  for (const T of tousLesTresors()) if (T.nom === e.nom_courant) s.add(T.territoire);
  return [...s];
}
function ouvrirVoletRare(e) {
  if (!e) return;
  const ts = territoiresDeLaRare(e), ta = typeof territoireActif === "function" ? territoireActif() : null;
  const premier = ts.includes(ta) ? ta : ts[0], autres = ts.filter(x => x !== premier).length;
  const ou = premier ? `On la trouve ${dansLeTerritoire(premier)}${autres ? `, et dans ${autres} autre${autres > 1 ? "s" : ""} territoire${autres > 1 ? "s" : ""}` : ""}.` : "";
  const suite = especeReserveeTresor(e) ? "Elle se cache bien : explorez les lieux de son territoire jusqu'au bout." : "Rencontrez-la en expédition pour ouvrir sa fiche.";
  let v = document.getElementById("volet-rare");
  if (!v) { v = document.createElement("div"); v.id = "volet-rare"; document.body.appendChild(v); }
  v.innerHTML = `<div class="vr-carte" role="dialog" aria-modal="true" aria-label="Une espèce rare">
      <div class="vr-tete"><span class="vr-sil" style="--couleur-classe:${classeDe(e).couleur}"><img src="${fichierSilhouette(e)}" alt="" onerror="this.remove()"></span>
        <div><small><i class="mq-point" aria-hidden="true"></i>Une espèce rare</small><b>${echapper(e.nom_affichage_groupe || classeDe(e).nom)}</b></div></div>
      ${ou ? `<p>${echapper(ou)}</p>` : ""}<p class="vr-doux">${suite}</p>
      <button type="button" class="vr-fermer" id="vr-fermer">Fermer</button></div>`;
  v.classList.add("on");
  const fermer = () => { v.classList.remove("on"); document.removeEventListener("keydown", echap); };
  const echap = ev => { if (ev.key === "Escape") fermer(); };
  v.onclick = ev => { if (ev.target === v) fermer(); };
  v.querySelector("#vr-fermer").onclick = fermer;
  document.addEventListener("keydown", echap);
  v.querySelector("#vr-fermer").focus({ preventScroll: true });
}

// ---- Les parties d'avant R288 : rien ne recule ----
//   Le trésor a quitté son expédition (25 expéditions ont pris une autre espèce du lieu à sa place) et 7 rares ont rejoint une
//   expédition. Une expédition déjà faite le reste : l'espèce arrivée y compte comme faite pour les étapes déjà finies
//   (suivi.gardeR288) ; les empreintes que le trésor avait rapportées sont gardées (empreintes en plus du territoire).
const ARRIVEES_R288 = [
  ["Alpes", "Les chasseurs discrets", "Musaraigne carrelet"], ["Alpes", "Grenouilles, crapauds et leur chasseur", "Cigogne noire"],
  ["Alpes", "Les oiseaux des vergers", "Huppe fasciée"], ["Alpes", "Les rapaces des montagnes", "Petit-duc scops"],
  ["Bassin aquitain", "Les mammifères de la rivière", "Noctule commune"], ["Bassin aquitain", "Les pêcheurs du lac", "Héron pourpré"],
  ["Bassin aquitain", "Au fond du ruisseau", "Anguille européenne"], ["Bassin aquitain", "Les chasseurs discrets", "Renard roux"],
  ["Bassin parisien et Val de Loire", "Les grands voyageurs", "Sterne naine"], ["Bassin parisien et Val de Loire", "Les tritons et leurs chasseurs", "Couleuvre vipérine"],
  ["Bassin parisien et Val de Loire", "Près du fond de la mer", "Congre"], ["Corse", "Les oiseaux du large", "Cormoran huppé"],
  ["Corse", "Les grands oiseaux des sommets", "Crave à bec rouge"], ["Corse", "Autour de l'embouchure du Fango", "Daurade royale"],
  ["Corse", "Les oiseaux du jardin", "Pie-grièche à tête rousse"], ["Corse", "Les oiseaux de la vallée", "Pie-grièche à tête rousse"],
  ["Corse", "Les oiseaux du village", "Pie-grièche à tête rousse"], ["Jura", "Les pêcheurs du lac", "Harle bièvre"],
  ["Massif armoricain", "Sur la plage", "Coque commune"], ["Massif central", "Les rapaces des prairies", "Circaète Jean-le-Blanc"],
  ["Méditerranée", "Sur la plage", "Mouette rieuse"], ["Méditerranée", "Les oiseaux des vergers", "Torcol fourmilier"],
  ["Plaines de l'Est et val de Saône", "Les forêts des hautes côtes", "Circaète Jean-le-Blanc"], ["Plaines de l'Est et val de Saône", "Grenouilles, tritons et leur chasseur", "Héron cendré"],
  ["Plaines de l'Est et val de Saône", "Les grandes forêts ardennaises", "Pouillot siffleur"], ["Plaines de l'Est et val de Saône", "Les grands animaux de la forêt", "Chouette hulotte"],
  ["Vosges", "Les poissons des eaux plus calmes", "Vairon"], ["Vosges", "Les petits mammifères du sous-bois", "Grand murin"],
  ["Vosges", "Les montagnards des crêtes", "Merle à plastron"], ["Vosges", "Autour des fermes", "Pic cendré"], ["Vosges", "Les oiseaux des grandes forêts", "Pic cendré"]];
function expeditionsArrivee(t, titre, nom) { return expeditionsDe(t).filter(x => x.titre === titre && x.liste.some(e => e.nom_courant === nom)); }
function gardeR288(x, e, k) {
  const g = typeof suivi === "object" && suivi && suivi.gardeR288 && suivi.gardeR288[x.id];
  return !!(g && g.nom === e.nom_courant && g[k]);
}
//   Appelée par 13_demarrage.js juste après le chargement de la sauvegarde, puis complétée une fois tout le programme chargé
//   (certains traits de l'étape 1 dépendent des repères, 23 : ce second passage ne fait qu'ajouter, jamais retirer).
let migrationR288Faite = false;
function noterGardeR288() {
  const garde = suivi.gardeR288 = suivi.gardeR288 || {};
  let n = 0;
  for (const [t, titre, nom] of ARRIVEES_R288) for (const x of expeditionsArrivee(t, titre, nom)) {
    if (garde[x.id] || !(expLancee(x) || x.liste.some(e => estIdentifiee(e)))) continue;
    const autres = x.liste.filter(e => e.nom_courant !== nom);
    const g1 = autres.length > 0 && autres.every(e => faiteDans(x, e, 1));
    if (!g1) continue;
    garde[x.id] = { nom, 1: true, 2: typeof ensembleFait === "function" && ensembleFait(x), 4: autres.every(e => especeFaite(e, 4)) };
    n++;
  }
  return n;
}
function migrerR288() {
  if (!RARETE_R288 || typeof suivi !== "object" || !suivi || suivi.r288) return;
  suivi.r288 = true; migrationR288Faite = true;
  noterGardeR288();
  // Les empreintes que le trésor avait rapportées dans son ancienne expédition (comme gainExp : 1, et 1 de plus pour Approfondir)
  if (typeof empreintesBonus === "function") empreintesBonus("");    // (la conversion PR1, si elle n'est pas encore faite, avant d'ajouter)
  if (!suivi.empreintesBonus) { suivi.empreintesBonus = {}; suivi.bonusPR1 = true; }
  for (const T of tousLesTresors()) {
    if (T.ajoute) continue;
    const e = especeDuTresor(T);
    if (!e) continue;
    for (const x of expeditionsDuChapitre(T.territoire, T.lieu)) {
      if (!(suivi.expRevues && (suivi.expRevues[x.id] || []).includes(e.nom_courant)) || !especeFaite(e, 1)) continue;
      if (suivi.gardeR288[x.id]) break;   // l'espèce arrivée à sa place compte déjà comme faite : pas d'empreinte en double
      const n = GAIN_ESPECE + (especeFaite(e, 4) ? GAIN_APPROFONDIR : 0);
      suivi.empreintesBonus[T.territoire] = (suivi.empreintesBonus[T.territoire] || 0) + n;
      break;
    }
  }
  sauvegarder();
}
document.addEventListener("DOMContentLoaded", () => {   // le second passage, tout le programme chargé (avant que l'accueil soit redessiné)
  if (migrationR288Faite && suivi && noterGardeR288()) sauvegarder();
});
