// 33_cles.js — Les clés (étapes CL1 à CL3, 25/11/2026 ; fiche reprise_cles.md). Chargé par jeu.html avant 13_demarrage.js.
//
//   • Toutes les empreintes, de tous les territoires, remplissent une seule réserve : une clé toutes les EMPREINTES_PAR_CLE.
//   • 1 clé ouvre en avance un lieu fermé d'un territoire ouvert ; 2 clés ouvrent un territoire fermé au choix.
//   • Le chemin gratuit ne change pas (médaille d'argent → lieu suivant, R133 ; lieux terminés → territoires, R152).
//   • Les empreintes ne baissent jamais : seules les clés se dépensent.
//   Sauvegarde : suivi.cles = { n : clés en poche, reste : empreintes dans la barre « prochaine clé », vu : le plus haut total
//   d'empreintes déjà compté, annonce : true tant que le message d'arrivée (ancien joueur) n'a pas été montré }.
//   « vu » ne baisse jamais : si le total d'empreintes recule un instant (données changées), rien n'est repris ni compté deux fois.
const EMPREINTES_PAR_CLE = 45;       // le réglage à caler en jouant
const PRIX_LIEU = 1, PRIX_TERRITOIRE = 2, CLES_OFFERTES = 2;

const clesTexte = n => `${n} clé${n > 1 ? "s" : ""}`;
const PICTO_CLE = `<svg class="picto-cle" viewBox="0 0 18 18" aria-hidden="true"><circle cx="6" cy="9" r="3.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9.5 9h7M14 9v3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
const ROND_CLE = `<svg class="rond-cle" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="#E9C9A0"/><circle cx="24" cy="32" r="9" fill="none" stroke="#8A4F1C" stroke-width="3.5"/><path d="M33 32h18M45 32v7M50 32v5" stroke="#8A4F1C" stroke-width="3.5" fill="none" stroke-linecap="round"/></svg>`;

function nbCles() { return suivi && suivi.cles ? suivi.cles.n : 0; }
function empreintesAvantCle() { return EMPREINTES_PAR_CLE - Math.min(EMPREINTES_PAR_CLE - 1, (suivi && suivi.cles && suivi.cles.reste) || 0); }
// Les 2 clés offertes, une seule fois par partie. total = les empreintes déjà gagnées (elles ne donnent pas de clés rétroactives)
function offrirCles(total, annonce) {
  if (!suivi || suivi.cles) return false;
  suivi.cles = { n: CLES_OFFERTES, reste: 0, vu: total || 0 };
  if (annonce) suivi.cles.annonce = true;
  sauvegarder();
  return true;
}
// Appelé avec le vrai total d'empreintes, chaque fois que le compteur du haut se met à jour (empreintesBarre, 05)
function suivreCles(total) {
  if (!suivi) return;
  if (!suivi.cles) {
    if (profil && offrirCles(total, !toutDebloque())) planifierAnnonceCles();   // une partie d'avant les clés
    return;
  }
  const k = suivi.cles;
  if (k.annonce && !annoncePlanifiee) planifierAnnonceCles();   // le message attendait encore (page fermée avant)
  if (!(total > k.vu)) return;
  k.reste += total - k.vu; k.vu = total;
  const gagnees = Math.floor(k.reste / EMPREINTES_PAR_CLE);
  k.reste -= gagnees * EMPREINTES_PAR_CLE;
  k.n += gagnees;
  sauvegarder();
  if (gagnees && !toutDebloque()) { clesEnVol += gagnees; clesAFeter += gagnees; planifierFeteCle(1400); }   // (le temps qu'une médaille de lieu s'annonce, R133)
}
function depenserCles(n) {
  if (!suivi || !suivi.cles || suivi.cles.n < n) return false;
  suivi.cles.n -= n;
  sauvegarder();
  return true;
}

// ---- Le compteur du haut (afficherStats, 05) ----
let clesEnVol = 0, clesAFeter = 0;   // les clés gagnées pas encore posées au compteur (il monte à l'arrivée de la clé)
function htmlCompteurCles() {
  if (!suivi || !suivi.cles || toutDebloque()) return "";
  const n = Math.max(0, nbCles() - clesEnVol), m = empreintesAvantCle(), tour = 2 * Math.PI * 7;
  const part = clesEnVol ? 1 : 1 - m / EMPREINTES_PAR_CLE;
  return `<button class="stat pastille-cles" type="button" aria-label="Vos clés : ${n}. Prochaine clé dans ${m} empreinte${m > 1 ? "s" : ""}. Ouvrir la carte" title="Prochaine clé dans ${m} empreinte${m > 1 ? "s" : ""}">`
    + `<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7" fill="none" stroke="#3a5a4b" stroke-width="1.6"/>`
    + (part > 0 ? `<circle cx="8" cy="8" r="7" fill="none" stroke="#E9C9A0" stroke-width="1.6" stroke-dasharray="${(tour * part).toFixed(2)} ${tour.toFixed(2)}" transform="rotate(-90 8 8)" stroke-linecap="round"/>` : "")
    + `<circle cx="6" cy="8" r="2" fill="none" stroke="#FBF8F1" stroke-width="1.4"/><path d="M8 8h4M10.6 8v1.8" fill="none" stroke="#FBF8F1" stroke-width="1.4" stroke-linecap="round"/></svg><strong>${nombre(n)}</strong></button>`;
}
function ouvrirCarteCles() { document.getElementById("onglet-carte").click(); }

// ---- L'envol d'une clé vers le compteur (n clés l'une après l'autre ; rien ne vole si « réduire les animations ») ----
function envolCles(depuis, n, arrivee) {
  const poser = () => { clesEnVol = Math.max(0, clesEnVol - 1); afficherStats(); sonCle();
    const c = document.querySelector("#stats .pastille-cles"); if (c) { c.classList.remove("recu"); void c.offsetWidth; c.classList.add("recu"); } };
  const a = depuis && depuis.getBoundingClientRect ? depuis.getBoundingClientRect() : null;
  if (animationsReduites() || !a) { for (let i = 0; i < n; i++) poser(); if (arrivee) arrivee(); return; }
  const cible = document.querySelector("#stats .pastille-cles"), r = cible && cible.getClientRects().length ? cible.getBoundingClientRect() : null;
  const b = r && r.bottom > 0 ? r : { left: window.innerWidth - 50, top: 14, width: 24, height: 24 };   // barre pas visible : le coin en haut à droite
  for (let i = 0; i < n; i++) setTimeout(() => {
    const el = document.createElement("span");
    el.className = "envol-cle"; el.innerHTML = ROND_CLE;
    const x = a.left + a.width * (n > 1 ? (i + 0.5) / n : 0.5), y = a.top + a.height / 2;
    el.style.left = `${x}px`; el.style.top = `${y}px`;
    document.body.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => { el.style.transform = `translate(calc(-50% + ${b.left + b.width / 2 - x}px), calc(-50% + ${b.top + b.height / 2 - y}px)) scale(.42)`; }));
    setTimeout(() => { el.remove(); poser(); if (i === n - 1 && arrivee) arrivee(); }, 720);
  }, i * 320);
}
function sonCle() {   // un petit son « Bois doux » (coupé par « Petits sons : non »)
  if (sonActif && petitsSonsActifs()) jouerRecette({ timbre: "boisdoux", notes: [523, 784], ecart: 0.08, duree: 0.34, volume: 0.07 });
}
// ---- « Une nouvelle clé » : un cadre, sans bouton, après les autres fêtes ; il ne prend pas les touchers ----
let minuteurCle = null, cleAttendFin = false;
function feteEnCours() {
  return feteOuverte || fileFetes.length > 0 || filePetites.length > 0 || famillesEnAttente.length > 0
    || !!document.querySelector("#carte-fete.on, #presentation-famille.visible, #bandeau-fete.on");
}
function planifierFeteCle(delai) {
  clearTimeout(minuteurCle);
  minuteurCle = setTimeout(() => {
    if (!clesAFeter) return;
    // jamais par-dessus une question : la clé attend l'écran de fin (Rencontre, forme d'expédition)
    const enQuestion = !!document.querySelector("#vue-rencontre:not(.cache) #carte-rencontre:not(.cache)");
    if (enQuestion) { cleAttendFin = true; planifierFeteCle(500); return; }
    if (cleAttendFin) { cleAttendFin = false; planifierFeteCle(1700); return; }   // l'espèce se pose d'abord dans son carnet (R278)
    if (feteEnCours()) { planifierFeteCle(500); return; }
    const n = clesAFeter; clesAFeter = 0;
    let c = document.getElementById("cadre-cle");
    if (!c) { c = document.createElement("div"); c.id = "cadre-cle"; c.setAttribute("role", "status"); c.setAttribute("aria-live", "polite"); document.body.appendChild(c); }
    c.innerHTML = `${ROND_CLE}<b>${n > 1 ? `${n} nouvelles clés` : "Une nouvelle clé"}</b>`;
    c.classList.add("on");
    setTimeout(() => { envolCles(c.querySelector(".rond-cle"), n); c.classList.remove("on"); }, 1500);
  }, delai);
}
// ---- Le message aux joueurs déjà en cours : une seule fois, sur une page calme ----
let annoncePlanifiee = false;
function planifierAnnonceCles() {
  annoncePlanifiee = true;
  const calme = () => ["vue-maison", "vue-accueil", "vue-carte", "vue-atlas"].some(id => { const v = document.getElementById(id); return v && !v.classList.contains("cache"); });
  setTimeout(() => {
    if (!suivi || !suivi.cles || !suivi.cles.annonce) return;
    if (!calme() || feteEnCours()) { planifierAnnonceCles(); return; }
    delete suivi.cles.annonce; sauvegarder();
    feter({ etiquette: "Nouveau", titre: "Les clés", garder: true, son: "badge",
            detail: `Vos empreintes vous donnent des clés pour ouvrir des lieux et des territoires en avance. Voici vos ${CLES_OFFERTES} premières clés.`,
            visuel: `<div class="fete-visuel fete-cle">${ROND_CLE}${ROND_CLE}</div>` });
  }, 900);
}

// ==================================================================
// CL2 · Ouvrir un lieu avec 1 clé, un territoire avec 2 clés
// ==================================================================
function ouvrirLieuAvecCle(t, nom) {
  const c = chapitreParNom(t, nom);
  if (!c || !estLieu(c) || !territoiresOuverts().includes(t) || chapitreOuvert(t, c) || !depenserCles(PRIX_LIEU)) return false;
  suivi.lieuxOuverts = suivi.lieuxOuverts || {};
  (suivi.lieuxOuverts[t] = suivi.lieuxOuverts[t] || []).push(nom);
  sauvegarder();
  feter({ taille: "petite", etiquette: "Nouveau lieu", titre: c.nom, son: "badge",
          pop: { couleur: (TERRITOIRES[t] || {}).couleur || "#1F3A2E", image: PICTO_CLE, etiquette: "Nouveau lieu", titre: c.nom } });
  return true;
}
function ouvrirTerritoireAvecCles(t) {
  if (!territoiresOuvertsListe || !territoiresFermes().includes(t) || !depenserCles(PRIX_TERRITOIRE)) return false;
  territoiresOuvertsListe = territoiresOuverts().concat(t);
  sauvegarder();
  feterNouveauTerritoire(t);
  return true;
}
// « Pour l'ouvrir » : le chemin gratuit, puis « ou tout de suite » (un lieu fermé d'un territoire ouvert)
function blocOuvrirLieu(t, c) {
  const p = lieuPrecedent(t, c), n = nbCles();
  let gratuit = "Il s'ouvrira plus tard.", jauge = "";
  if (p && !chapitreOuvert(t, p)) gratuit = `Il s'ouvre après <b>${echapper(p.nom)}</b>.`;
  else if (p) {
    const but = paliersLieu(t, p)[2] || 1, fait = Math.min(but, empreintesDuLieu(t, p)), m = but - fait;
    gratuit = `Médaille d'argent ${dansLieu(p).replace(p.nom, `<b>${echapper(p.nom)}</b>`)} : encore ${m} empreinte${m > 1 ? "s" : ""}.`;
    jauge = `<i class="cle-jauge"><b style="width:${Math.round(100 * fait / but)}%"></b></i>`;
  }
  return `<div class="cle-bloc"><b class="cle-titre">Pour l'ouvrir</b><p>${gratuit}</p>${jauge}
    ${toutDebloque() ? "" : `<div class="cle-ou"><span>ou tout de suite</span></div>`
      + (n >= PRIX_LIEU ? `<button type="button" class="cle-bouton" data-cle-lieu="${echapper(c.nom)}">${PICTO_CLE}<span>Ouvrir avec 1 clé</span></button>
         <small>Vous avez ${clesTexte(n)}. Le lieu s'ouvre tout de suite et pour toujours.</small>`
        : `<small>1 clé l'ouvre tout de suite (vous n'en avez pas encore)</small>`)}</div>`;
}
function brancherOuvrirLieu(zone, t, apres) {
  zone.querySelectorAll("[data-cle-lieu]").forEach(b => b.onclick = ev => {
    ev.stopPropagation();
    if (ouvrirLieuAvecCle(t, b.dataset.cleLieu) && apres) apres(b.dataset.cleLieu);
  });
}
// Le bouton « 2 clés » d'un territoire fermé ; texte = ce que dit le bouton
function blocOuvrirTerritoire(t, texte) {
  if (toutDebloque() || !territoiresOuvertsListe && !premierChoixEnCours) return "";
  const n = nbCles(), m = PRIX_TERRITOIRE - n;
  return `<div class="cle-terr"><button type="button" class="cle-bouton" data-cle-terr="${echapper(t)}"${m > 0 ? " disabled" : ""}>${PICTO_CLE}<span>${texte || `Ou l'ouvrir maintenant · ${clesTexte(PRIX_TERRITOIRE)}`}</span></button>`
    + (m > 0 ? `<small>Il vous manque ${clesTexte(m)}.</small>` : "") + `</div>`;
}
function brancherOuvrirTerritoire(zone, apres) {
  zone.querySelectorAll("[data-cle-terr]").forEach(b => b.onclick = ev => {
    ev.stopPropagation();
    const t = b.dataset.cleTerr;
    if (premierChoixEnCours) { choisirPremierTerritoire(t); return; }
    if (ouvrirTerritoireAvecCles(t) && apres) apres(t);
  });
}
// Ordinateur : un lieu fermé touché (carrousel ou carte) montre le même encadré, dans un volet
function ouvrirVoletLieu(t, c, apres) {
  fermerVoletLieu();
  const v = document.createElement("div");
  v.id = "volet-lieu"; v.className = "volet-lieu";
  v.innerHTML = `<div class="vl-carte" role="dialog" aria-modal="true" aria-label="${echapper(c.nom)}"><div class="vl-photo">${imgMini(c.photo, "")}<button type="button" class="vl-fermer" aria-label="Fermer">✕</button>
      <div><small>${echapper(c.pays || "")}</small><b>${echapper(c.nom)}</b></div></div>
    <div class="vl-corps">${blocOuvrirLieu(t, c)}${avantGoutLieu(t, c)}</div></div>`;
  document.body.appendChild(v);
  v.onclick = ev => { if (ev.target === v || ev.target.closest(".vl-fermer")) fermerVoletLieu(); };
  document.addEventListener("keydown", echapVoletLieu);
  brancherOuvrirLieu(v, t, () => { fermerVoletLieu(); if (apres) apres(); });
  (v.querySelector(".cle-bouton") || v.querySelector(".vl-fermer")).focus({ preventScroll: true });
}
function echapVoletLieu(ev) { if (ev.key === "Escape") fermerVoletLieu(); }
function fermerVoletLieu() {
  document.removeEventListener("keydown", echapVoletLieu);
  const v = document.getElementById("volet-lieu");
  if (v) v.remove();
}

// ==================================================================
// CL3 · Le premier choix : tant qu'aucun territoire n'est ouvert, la carte, l'aperçu (K3) et un seul bouton
//   premierChoixEnCours : territoiresOuverts() est vide (07). suivi.premiereVisite = l'écran où l'on en est ("jouer" ou "choix"),
//   pour reprendre au même endroit si la page est rechargée ; les 2 clés ne sont données qu'une fois (offrirCles).
// ==================================================================
var premierChoixEnCours = false;
function noterPremiereVisite(ou) {
  suivi.premiereVisite = ou;
  if (brouillon && typeof brouillon.prenom === "string") suivi.prenom = brouillon.prenom.trim().slice(0, 24);
  sauvegarder();
}
function montrerPremierChoix() {
  premierChoixEnCours = true;
  noterPremiereVisite("choix");
  document.getElementById("vue-bienvenue").classList.add("cache");
  document.getElementById("vue-atlas").classList.remove("cache");
  atlasTerritoire = null; atlasLieu = null;
  afficherAtlas();
}
function quitterPremierChoix(versComment) {
  premierChoixEnCours = false;
  document.getElementById("vue-atlas").classList.add("cache");
  if (versComment) { etapeBienvenue = ECRAN_COMMENT; document.getElementById("vue-bienvenue").classList.remove("cache"); noterPremiereVisite("jouer"); afficherBienvenue(); window.scrollTo(0, 0); }
}
function choisirPremierTerritoire(t) {
  if (!premierChoixEnCours || !especesDe(t).length || !depenserCles(PRIX_TERRITOIRE)) return;
  quitterPremierChoix(false);
  document.getElementById("vue-atlas").classList.add("cache");
  const c = lieuxDe(t)[0], n = terminerPremiereVisite(t);
  montrer("accueil"); window.scrollTo(0, 0);
  feter({ etiquette: "Votre premier territoire", titre: `Bienvenue ${dansTerritoire(t)}`, son: "badge", taille: "grande", photo: photoFeteTerritoire(t),
          detail: `${c ? `Votre premier lieu : ${c.nom}.` : ""}${n ? ` Pour bien démarrer, ${n} espèces communes vous sont déjà présentées.` : ""}` });
}
