// ==================================================================
// Étape R334 (27/11/2026, tâche 54.10, choix A d'Aubin du 27/11, 13 h 04)
//   Critère : « chaque question du site apprend quelque chose qu'on n'a pas pu voir dans les lieux ordinaires ».
//   Une halte du tour du site remarquable (et la sortie du jour) mêle désormais, en plus des révisions habituelles :
//     1. 2 ou 3 QUESTIONS PROPRES AU SITE (pourquoi ici, ce qui marche, la menace, son histoire), écrites et sourcées
//        dans Données\expeditions.xlsx, onglet « questions_site » → questions_site.js (Outils\gen_questions_site.py) ;
//        jamais deux fois la même dans une partie ; d'une halte à l'autre, les moins vues d'abord (suivi.siteQVues) ;
//     2. UN LIEN ENTRE ESPÈCES DE LIEUX DIFFÉRENTS du territoire (« De laquelle de ces espèces le circaète se nourrit-il ? ») :
//        les mêmes règles que Leurs liens (le mangeur est le sujet, R320 ; citation par nom dans la fiche ou lien typique de
//        liens_especes.js ; jamais l'inverse ; pièges qu'il ne pourrait pas manger, sans lien rare ni typique) ;
//     3. UNE RECONNAISSANCE UN CRAN AU-DESSUS : plus de « Quelle est cette espèce ? » sur la photo entière au site ; à la
//        place, sa silhouette, son cri ou son empreinte quand elle en a (3 espèces de la halte au plus, jamais deux fois de
//        suite le même angle) ;
//     4. UNE COMPARAISON DE CHIFFRES de PQ2 (« Laquelle de ces espèces peut vivre le plus longtemps ? »), avec des espèces
//        de tout le territoire déjà rencontrées, la bonne réponse étant une espèce de la halte.
//   Le reste de la halte : les révisions d'avant (R321, R326). Au plus 2 questions par espèce (R326) : une question
//   d'angle, de lien ou de chiffres compte pour l'espèce qui en est le sujet (ou la bonne réponse).
//   HALTE_ENRICHIE = false : la halte d'avant R334.
// ==================================================================
let HALTE_ENRICHIE = true;
const SITE_Q = "__site";
const QUESTIONS_SITE_PAR_HALTE = 3;       // 2 quand la halte a moins de 4 espèces
const ANGLES_HALTE_MAX = 3;

function donneesQuestionsSite() { return typeof QUESTIONS_SITE !== "undefined" ? QUESTIONS_SITE : []; }
function questionsDuSiteRemarquable(t) {
  const r = siteRemarquable(t);
  return r ? donneesQuestionsSite().filter(q => q.territoire === t && q.site === r.nom) : [];
}
// Une espèce a-t-elle au moins une question de reconnaissance au site ? (sa silhouette, dès qu'elle a une photo)
function questionsSitePossibles(e) { return HALTE_ENRICHIE && !!e && estRenseigne(e.photo); }

// ---- Les pièges des angles ----
// Silhouette : 3 espèces de même grande famille (onglet), d'un autre ordre (jamais deux silhouettes presque pareilles),
//   d'un territoire commun d'abord ; jamais la même silhouette, jamais un sosie.
function piegesSilhouette(e, pool) {
  const sosies = typeof sosiesDe === "function" ? sosiesDe(e) : [];
  const f = fichierSilhouette(e);
  const ok = o => o && o !== e && o.nom_courant !== e.nom_courant && estRenseigne(o.photo) && o.onglet === e.onglet
    && o.ordre && e.ordre && o.ordre !== e.ordre && fichierSilhouette(o) !== f && !sosies.includes(o);
  // de taille voisine (moitié à double) : la chauve-souris ne se devine pas parmi un lapin et un chevreuil
  const te = typeof tailleNombre === "function" ? tailleNombre(e) : 0;
  const voisine = o => { const to = typeof tailleNombre === "function" ? tailleNombre(o) : 0; return !te || !to || (to >= te / 2 && to <= te * 2); };
  const res = [];
  const ajouter = l => { for (const o of melanger(l.slice())) if (res.length < 3 && !res.some(r => r.ordre === o.ordre)) res.push(o); };
  const terr = o => String(o.territoire || "").split(" ; "), t = terr(e);
  ajouter((pool || []).filter(o => ok(o) && voisine(o)));
  ajouter(ESPECES.filter(o => ok(o) && voisine(o) && terr(o).some(v => t.includes(v))));
  ajouter(ESPECES.filter(o => ok(o) && voisine(o)));
  return res.length === 3 ? res : null;              // pas assez de voisines de taille : pas de silhouette (le cri ou l'empreinte à la place)
}

// ---- 2 · Les liens entre espèces de lieux différents ----
function liensEntreLieux(t, halte, pool) {
  if (typeof itemQuiCite !== "function") return [];
  const lieuDe = lieuDesEspeces(t), res = [];
  const T = new Set(lieuxDe(t).map(c => typeof tresorDuLieu === "function" ? tresorDuLieu(t, c.nom) : null).filter(Boolean).map(z => z.nom));
  for (const a of halte) {
    if (!estRenseigne(a.photo) || T.has(a.nom_courant)) continue;
    for (const b of pool) {
      if (a === b || !estRenseigne(b.photo) || T.has(b.nom_courant) || lieuDe.get(a.nom_courant) === lieuDe.get(b.nom_courant)) continue;
      const parProie = itemQuiCite(a, "proies", b, null), parPred = itemQuiCite(b, "predateurs", a, null);
      const mange = parProie || parPred;
      if (!mange || itemQuiCite(b, "proies", a, null) || itemQuiCite(a, "predateurs", b, null)) continue;   // jamais dans les deux sens
      const lienE = (parProie && parProie.lien) || (parPred && parPred.lien);
      const explication = lienE ? String(lienE.phrase).trim().replace(/([^.!?])$/, "$1.") : `${LeNom(a)} se nourrit notamment ${deNom(b)}.`;
      const pieges = pool.filter(o => o !== a && o !== b && estRenseigne(o.photo) && !T.has(o.nom_courant)
        && !pourraitManger(a, o, null) && !memeTypeQuUneBonne(o, [b]) && !lienBloque(a, o, "mange") && !ontUnLien(a, o));
      if (pieges.length < 2) continue;
      // les pièges du « monde » de la bonne réponse d'abord (même grande famille, puis même milieu de vie)
      const tri = melanger(pieges.slice()).sort((x, y) => (y.onglet === b.onglet) - (x.onglet === b.onglet));
      res.push({ type: "lien", e: a, reponse: b, pieges: tri.slice(0, 2), explication,
                 lieux: [lieuDe.get(a.nom_courant), lieuDe.get(b.nom_courant)] });
    }
  }
  return res;
}

// ---- 4 · Une comparaison de chiffres (PQ2), la bonne réponse étant une espèce de la halte ----
function chiffresDuSite(t, halte, pool) {
  if (typeof questionsChiffres !== "function" || typeof R298 === "undefined" || !R298 || typeof PQ2 === "undefined" || !PQ2) return null;
  const autres = melanger(pool.filter(e => !halte.includes(e) && estRenseigne(e.photo))).slice(0, 30);
  const x = { territoire: t, chapitre: null, titre: "", liste: [...halte.filter(e => estRenseigne(e.photo)), ...autres] };
  const noms = new Set(halte.map(e => e.nom_courant));
  for (const z of questionsChiffres(x, 4, [])) {
    const bonne = z.choix.find(c => c.bonne);
    if (bonne && noms.has(bonne.espece)) return { type: "chiffres", e: especeParNom(bonne.espece), z };
  }
  return null;
}

// ---- Le plan d'une halte : les questions nouvelles et leur place ----
function planHalte(t, especes) {
  if (!HALTE_ENRICHIE) return null;
  const r = siteRemarquable(t);
  if (!r) return null;
  const pool = especesDuSite(t).filter(e => typeof entreAuSite === "function" ? entreAuSite(e) : estIdentifiee(e));
  const speciaux = [];
  // 1 · les questions du site : les moins vues d'abord, jamais deux fois la même dans la partie
  const vues = (suivi && suivi.siteQVues) || {};
  const qs = melanger(questionsDuSiteRemarquable(t).slice()).sort((a, b) => (vues[a.id] || 0) - (vues[b.id] || 0));
  const nSite = especes.length >= 4 ? QUESTIONS_SITE_PAR_HALTE : 2;
  // jamais deux questions sur le même animal dans une halte (l'une soufflerait l'autre : les deux questions du chamois au Hohneck)
  const animaux = new Set();
  for (const q of qs) {
    if (speciaux.length >= nSite) break;
    if (q.espece && animaux.has(q.espece)) continue;
    if (q.espece) animaux.add(q.espece);
    speciaux.push({ type: "site", q, site: r });
  }
  // 2 · un lien entre lieux
  const liens = liensEntreLieux(t, especes, pool);
  if (liens.length) speciaux.push(auHasard(liens));
  // 4 · une comparaison de chiffres
  const ch = chiffresDuSite(t, especes, pool);
  if (ch) speciaux.push(ch);
  // 3 · la reconnaissance : silhouette, cri ou empreinte, pour les espèces les moins bien sues (une par espèce)
  const fois = e => speciaux.filter(s => s.e === e).length;
  const candidats = especes.filter(e => estRenseigne(e.photo)).sort((a, b) => nbBonnes(a, IDENTIFICATION) - nbBonnes(b, IDENTIFICATION));
  const derniers = (suivi && suivi.angleSite) || {};
  let avant = null, nAngles = 0;
  for (const e of candidats) {
    if (nAngles >= ANGLES_HALTE_MAX) break;
    if (fois(e) >= QUESTIONS_PAR_ESPECE_MAX) continue;
    const angles = [];
    if (typeof aUnCri === "function" && aUnCri(e)) angles.push("cri");
    if (fichierEmpreinte(e) !== "NA" && typeof dessinsEmpreintes === "function") angles.push("empreinte");
    if (piegesSilhouette(e, pool)) angles.push("silhouette");
    let l = angles.filter(a => a !== avant);
    if (!l.length) l = angles;
    const sansDernier = l.filter(a => a !== derniers[e.nom_courant]);
    if (sansDernier.length) l = sansDernier;
    if (!l.length) continue;
    const angle = auHasard(l);
    speciaux.push({ type: "angle", angle, e, pieges: angle === "silhouette" ? piegesSilhouette(e, pool) : null });
    avant = angle; nAngles++;
  }
  return { speciaux, pool: pool.map(e => e.nom_courant) };
}
// Combien de questions de révision chaque espèce peut-elle encore donner (sans sa photo entière), sous le plafond de 2 ?
function capaciteRevisionHalte(especes, speciaux) {
  return especes.reduce((s, e) => {
    const deja = speciaux.filter(z => z.e === e).length;
    const cases = casesDuDefi([e], "revision", true).filter(c => c.champ !== IDENTIFICATION).length;
    return s + Math.max(0, Math.min(QUESTIONS_PAR_ESPECE_MAX - deja, cases));
  }, 0);
}
// Les places : la reconnaissance d'abord, puis les questions nouvelles réparties entre les révisions
function placerHalte(plan, total) {
  const sp = plan.speciaux.slice(0, total);
  const premiers = sp.filter(s => s.type === "angle").slice(0, 1);
  const autres = melanger(sp.filter(s => !premiers.includes(s)));
  // jamais deux questions du site de suite quand c'est possible
  for (let i = 1; i < autres.length; i++) if (autres[i].type === "site" && autres[i - 1].type === "site") {
    const j = autres.findIndex((s, k) => k > i && s.type !== "site");
    if (j > 0) [autres[i], autres[j]] = [autres[j], autres[i]];
  }
  const ordre = [...premiers, ...autres], places = new Array(total).fill(null);
  if (!ordre.length) return places;
  places[0] = ordre[0];
  const reste = ordre.slice(1), libres = total - 1;
  reste.forEach((s, i) => {
    let k = 1 + Math.round((i + 1) * libres / (reste.length + 1));
    k = Math.min(total - 1, Math.max(1, k));
    while (places[k] && k < total - 1) k++;
    while (places[k] && k > 1) k--;
    if (!places[k]) places[k] = s;
  });
  return places;
}
// Appelé par lancerSite (17) : le plan et le vrai nombre de questions de la halte
function preparerHalteSite(t, especes) {
  const plan = planHalte(t, especes);
  if (!plan) return null;
  const total = Math.max(1, Math.min(QUESTIONS_HALTE, plan.speciaux.length + capaciteRevisionHalte(especes, plan.speciaux)));
  plan.places = placerHalte(plan, total);
  plan.total = total;
  return plan;
}

// ---- Le tirage (appelé par choisirQuestionDefi, 07) : la question nouvelle de cette place, s'il y en a une ----
function questionSpecialeHalte() {
  const p = defi && defi.site && defi.site.plan;
  if (!p) return null;
  let s = p.places[defi.faites];
  if (!s || s.pose) return null;
  // pas de son : le cri devient la silhouette (ou l'empreinte)
  if (s.type === "angle" && s.angle === "cri" && !defi.cris) {
    const pool = p.pool.map(especeParNom).filter(Boolean);
    const pg = piegesSilhouette(s.e, pool);
    if (pg) { s.angle = "silhouette"; s.pieges = pg; }
    else if (fichierEmpreinte(s.e) !== "NA") s.angle = "empreinte";
    else return null;
  }
  s.pose = true;
  defi.posees = defi.posees || [];
  const sujet = s.type === "site" ? "Site" : s.type === "chiffres" ? s.e.nom_courant : s.e.nom_courant;
  // l'empreinte et le cri passent par les questions habituelles du jeu (« À qui appartient cette empreinte ? », « Quel animal entend-on ? »)
  if (s.type === "angle" && s.angle !== "silhouette") {
    const champ = s.angle === "cri" ? "cri_son" : "empreinte_nom";
    defi.posees.push(s.e.nom_courant + "|" + champ);
    noterAngleSite(s.e, s.angle);
    return { espece: s.e, champ, estRevision: false };
  }
  defi.siteEnCours = s;
  defi.posees.push(sujet + "|" + SITE_Q + ":" + defi.faites);
  if (s.type === "angle") noterAngleSite(s.e, s.angle);
  const espece = s.type === "site" ? (especeParNom(s.q.espece) || defi.especes[0]) : s.e;
  return { espece, champ: SITE_Q, estRevision: false };
}
// Les questions nouvelles encore à venir dans la halte sur cette espèce (pour le plafond de 2 par espèce, R326)
function prevusHalte(nom) {
  const p = defi && defi.site && defi.site.plan;
  return p ? p.places.filter(s => s && !s.pose && s.e && s.e.nom_courant === nom).length : 0;
}
function noterAngleSite(e, angle) { suivi.angleSite = suivi.angleSite || {}; suivi.angleSite[e.nom_courant] = angle; }

// ---- Poser la question (appelé par poserQuestion, 03) ----
function grilleEspeces(zone, liste, bonne, avecNom) {
  zone.className = "grille-photos";
  for (const e of liste) {
    const b = document.createElement("button");
    b.className = "reponse choix-photo";
    b.innerHTML = `<div class="photo">${celluleImage(e, true)}</div><div class="legende${avecNom ? "" : " cache"}">${echapper(e.nom_courant)}</div>`;
    if (e === bonne) b.dataset.juste = "oui";
    b.onclick = () => repondre(b, e === bonne);
    zone.appendChild(b);
  }
}
function poserQuestionSite(espece) {
  const s = defi && defi.siteEnCours;
  const zone = document.getElementById("reponses"), photo = document.getElementById("photo-rencontre");
  const nom = document.getElementById("nom"), famille = document.getElementById("famille"), question = document.getElementById("question");
  if (!s) { enTete(espece, true, true); question.textContent = ""; return; }
  famille.classList.add("cache");
  if (s.type === "site") {
    photo.classList.remove("cache", "grande", "cadre-empreinte", "cadre-son", "devoile");
    photo.innerHTML = imagePhoto(s.site.photo, s.site.nom);
    nom.textContent = s.site.nom;
    document.getElementById("revision").textContent = "Le site";
    question.textContent = s.q.question;
    zone.classList.add("reponses-phrases");
    for (const t of melanger([s.q.bonne, ...s.q.mauvaises])) ajouterBouton(t, t === s.q.bonne);
    enCours = { espece, champ: SITE_Q, site: s, q: null, bonne: null, cacherEspece: true,
                explication: s.q.explication, montre: true, complement: s.q.explication, erreur: "Pas tout à fait : la bonne réponse est en vert." };
  } else if (s.type === "lien") {
    enTete(s.e, true, true);
    document.getElementById("revision").textContent = "D'un lieu à l'autre";
    question.textContent = FORMES_LIENS["Garde-manger"](s.e);
    grilleEspeces(zone, melanger([s.reponse, ...s.pieges]), s.reponse, true);
    const [la, lb] = s.lieux;
    enCours = { espece: s.e, champ: SITE_Q, site: s, q: null, bonne: null,
                explication: `${s.explication}${la && lb ? ` Vous les avez rencontrés à deux endroits du territoire : ${la} et ${lb}.` : ""}` };
  } else if (s.type === "chiffres") {
    photo.classList.add("cache");
    nom.textContent = "Comparer";
    document.getElementById("revision").textContent = "Leurs chiffres";
    question.textContent = s.z.question;
    const l = s.z.choix.map(c => especeParNom(c.espece)).filter(Boolean);
    grilleEspeces(zone, l, s.e, true);
    enCours = { espece: s.e, champ: SITE_Q, site: s, q: null, bonne: null, cacherEspece: true, explication: s.z.explication };
  } else {                                              // la silhouette
    photo.classList.remove("cache", "grande", "cadre-empreinte", "cadre-son", "devoile");
    photo.innerHTML = `<div class="site-silhouette"><img src="${fichierSilhouette(s.e)}" alt="Une silhouette"></div>`;
    nom.textContent = "À qui est cette silhouette ?";
    document.getElementById("revision").textContent = "Sa silhouette";
    question.textContent = "";
    for (const o of melanger([s.e, ...s.pieges])) ajouterBouton(o.nom_courant, o === s.e);
    enCours = { espece: s.e, champ: SITE_Q, site: s, q: null, bonne: null, cacherEspece: true,
                explication: `C'était : ${s.e.nom_courant}.` };
  }
}

// ---- La réponse (appelé par repondreRevision, 08) ----
function repondreSite(boutonClique, estJuste) {
  const { espece, explication, site: s } = enCours;
  for (const b of document.querySelectorAll(".reponse")) { b.disabled = true; if (b.dataset.juste === "oui") b.classList.add("juste"); }
  for (const l of document.querySelectorAll(".legende")) l.classList.remove("cache", "au-survol");
  const retour = document.getElementById("retour");
  if (s.type === "angle") {                             // après la réponse : la photo et le nom
    const photo = document.getElementById("photo-rencontre");
    photo.innerHTML = celluleImage(espece);
    document.getElementById("nom").textContent = espece.nom_courant;
    document.getElementById("famille").classList.remove("cache");
  }
  if (s.type === "site") { suivi.siteQVues = suivi.siteQVues || {}; suivi.siteQVues[s.q.id] = (suivi.siteQVues[s.q.id] || 0) + 1; }
  const texte = s.type === "site" ? (estJuste ? `Bravo ! ${explication}` : `Pas tout à fait. ${explication}`) : (estJuste ? `Bravo ! ${explication}` : explication);
  if (estJuste) {
    defi.bonnes = defi.bonnes + 1; defi.score = defi.score + 1;
    if (s.type === "angle") { marquerVue(espece); }
    jouerSon();
  } else {
    if (boutonClique) { boutonClique.classList.add("fausse"); jouerSon("mauvaise"); }
    const nomR = s.type === "site" ? (s.q.espece && especeParNom(s.q.espece) ? s.q.espece : espece.nom_courant) : espece.nom_courant;
    if (s.type !== "site" && !defi.rates.some(r => r.nom === nomR && r.explication === explication)) defi.rates.push({ nom: nomR, explication });
  }
  retour.textContent = texte;
  defi.faites = defi.faites + 1;
  defi.siteEnCours = null;
  afficherHud();
  afficherStats();
  sauvegarder();
  const suivant = document.getElementById("suivant");
  suivant.textContent = defi.faites >= defi.total ? "Voir le résultat →" : "Question suivante →";
  suivant.classList.remove("cache");
  noterDansHistorique();
}
