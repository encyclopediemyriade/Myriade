// ==================================================================
// Étape R329 (26/11, session 55.01 « Les mêmes espèces au début des lieux », choix d'Aubin du 26/11, 21 h 50 : 1B · 2C · 3A)
//   Critère : en arrivant dans un lieu, la première expédition proposée vous apprend quelque chose de nouveau ou de propre
//   à ce lieu, et une espèce déjà connue ailleurs ne vous retient jamais plus d'un écran.
//
//   1B · UN ORDRE QUI S'ADAPTE AU JOUEUR (ORDRE_ADAPTE)
//     Dans chaque lieu, le chemin (et donc la « prochaine expédition » et les 2 expéditions ouvertes à la fois) suit :
//       1. le plus d'espèces nouvelles pour ce joueur (pas encore « faites » à l'étape 1, dans tout le jeu) ;
//       2. à égalité, la plus propre au lieu : le plus d'espèces présentes dans 3 territoires au plus (d'après EXPEDITIONS) ;
//       3. à égalité encore, l'ordre du classeur (rang, puis ordre).
//     Les expéditions déjà commencées ou finies restent en tête, dans l'ordre où le joueur les a vues.
//     L'ordre est noté dans la sauvegarde (suivi.ordreLieux) et ne bouge pas sous les yeux du joueur : il est recalculé
//     à l'ouverture du lieu (ouvrirLieu) et, une fois par chargement du jeu, pour un lieu pas encore commencé.
//     Exception : le premier lieu d'un territoire, ouvert par un joueur qui n'a encore rien rencontré, garde l'ordre du
//     classeur (départ facile, cohérent avec les 8 espèces offertes, tirées dans ce même lieu) ; commencé ainsi, il le garde
//     jusqu'au bout. (Les espèces sans photo, comptées d'office, ne disent pas que le joueur a joué.)
//   2C · LA RÉVISION DU LIEU (REVISION_LIEU)
//     Les expéditions d'un lieu sans aucune espèce nouvelle pour ce joueur (ni commencées, ni finies) se rangent en fin de
//     lieu dans une seule « Révision du lieu » : une question par espèce (REVISION_LIEU_MAX au plus, les moins bien sues
//     d'abord ; les autres comptent d'office). La finir termine ces expéditions (étape 1 revue, étape 2 notée faite) : leurs
//     empreintes viennent d'un coup. Elle compte pour une des 2 places ouvertes du lieu. Les expéditions restent visibles,
//     ouvrables et rejouables (Leurs liens, Approfondir, Me tester) ; seule la façon de les valider change.
//   2C · VARIER L'ANGLE (REVISION_VARIEE)
//     Dans toute révision (Révision du lieu, et révision de début d'expédition, étape 316 / R173), l'espèce connue revient
//     sous un angle qu'elle a vraiment : son cri, son empreinte, une autre forme photographiée (femelle, hiver…), son nom
//     à retrouver parmi 4 photos, ou sa photo habituelle. Jamais deux fois de suite le même angle (et, si possible, pas
//     celui de sa dernière révision). Mauvaises réponses dans le « monde » de l'espèce (même groupe, même famille, même
//     région ; empreintes : même sorte d'empreinte, jamais un « sosie » d'empreinte). Une erreur est expliquée ; l'espèce
//     compte quand même ici (sa photo n'est pas créditée d'une bonne réponse).
//   Les 3 réglages à false = le jeu d'avant R329.
// ==================================================================
let ORDRE_ADAPTE = true;      // (let : le test compare avec et sans)
let REVISION_LIEU = true;
let REVISION_VARIEE = true;
const REVISION_LIEU_MAX = 12;
const REVISION_EXP_MAX = 3;            // révision de début d'expédition : 3 questions au plus (les moins bien sues), les autres comptent d'office
const TERRITOIRES_PROPRE = 3;          // « propre au lieu » : une espèce présente dans 3 territoires au plus

// ---- 1B · l'ordre du lieu ----
let memoTerrEspece = null;
function nbTerritoiresEspece(nom) {
  if (!memoTerrEspece) {
    memoTerrEspece = new Map();
    for (const x of (typeof EXPEDITIONS !== "undefined" ? EXPEDITIONS : []))
      for (const n of x.especes) { if (!memoTerrEspece.has(n)) memoTerrEspece.set(n, new Set()); memoTerrEspece.get(n).add(x.territoire); }
  }
  return memoTerrEspece.has(nom) ? memoTerrEspece.get(nom).size : 0;
}
function especesPropres(x) { return x.liste.filter(e => nbTerritoiresEspece(e.nom_courant) <= TERRITOIRES_PROPRE).length; }
function especesNouvelles(x) { return x.liste.filter(e => !especeFaite(e, 1)).length; }
// (les espèces sans photo comptent d'office : elles ne disent pas que le joueur a déjà joué)
function rienRencontre() { return !ESPECES.some(e => estRenseigne(e.photo) && estIdentifiee(e) && especeFaite(e, 1)); }
function cleOrdreLieu(t, nom) { return t + "|" + nom; }
function lieuCommenceClasseur(l) { return l.some(x => expLancee(x) || empreintesExp(x) > 0); }
// Une révision est-elle possible pour cette expédition ? (au moins une espèce avec photo pas encore revue ici)
function revisionPossible(x) { return x.liste.some(e => estRenseigne(e.photo) && !estRevue(x, e)); }

let ordreEnCalcul = false;
const ordresVusCeChargement = new Set();
function calculerOrdreLieu(t, nom, data) {
  const k = cleOrdreLieu(t, nom), avant = suivi.ordreLieux && suivi.ordreLieux[k];
  const indexClasseur = new Map(data.map((x, i) => [x.id, i]));
  // le départ facile reste acquis une fois le lieu commencé en débutant ; sinon il se décide maintenant
  let depart = !!(avant && avant.depart && lieuCommenceClasseur(data));
  if (!depart) { const c = chapitreParNom(t, nom); depart = !!c && estLieu(c) && lieuxDe(t)[0] === c && rienRencontre(); }
  let ids, rev = [];
  if (!ORDRE_ADAPTE || depart) ids = data.map(x => x.id);
  else {
    const rangAvant = new Map(((avant && avant.ids) || []).map((id, i) => [id, i]));
    const pos = x => rangAvant.has(x.id) ? rangAvant.get(x.id) : 1000 + indexClasseur.get(x.id);
    const fixes = data.filter(x => expLancee(x) || empreintesExp(x) > 0).sort((a, b) => pos(a) - pos(b));
    const reste = data.filter(x => !fixes.includes(x));
    const n = new Map(reste.map(x => [x.id, especesNouvelles(x)]));
    if (REVISION_LIEU) rev = reste.filter(x => n.get(x.id) === 0 && revisionPossible(x));
    const autres = reste.filter(x => !rev.includes(x)).sort((a, b) =>
      n.get(b.id) - n.get(a.id) || especesPropres(b) - especesPropres(a) || indexClasseur.get(a.id) - indexClasseur.get(b.id));
    rev.sort((a, b) => indexClasseur.get(a.id) - indexClasseur.get(b.id));
    ids = [...fixes, ...autres, ...rev].map(x => x.id);
    rev = rev.map(x => x.id);
  }
  suivi.ordreLieux = suivi.ordreLieux || {};
  suivi.ordreLieux[k] = { ids, rev, depart };
  sauvegarder();
  return suivi.ordreLieux[k];
}
// L'ordre noté du lieu (calculé s'il manque, ou une fois par chargement pour un lieu pas encore commencé)
function ordreLieu(t, nom, data, forcer) {
  if (!suivi || ordreEnCalcul) return null;
  const k = cleOrdreLieu(t, nom);
  let o = suivi.ordreLieux && suivi.ordreLieux[k];
  const complet = o && data.every(x => o.ids.includes(x.id)) && o.ids.length === data.length;
  const premiereFois = !ordresVusCeChargement.has(k);
  if (forcer || !complet || premiereFois) {
    ordresVusCeChargement.add(k);
    ordreEnCalcul = true;
    try { if (forcer || !complet || !lieuCommenceClasseur(data)) o = calculerOrdreLieu(t, nom, data); }
    catch (err) { o = null; }
    finally { ordreEnCalcul = false; }
  }
  return o || null;
}
// Appelé par expeditionsDuChapitre (17) : la liste du classeur, rangée dans l'ordre du joueur
function rangerLieu(t, nom, data) {
  if (!ORDRE_ADAPTE && !REVISION_LIEU) return data;
  const o = ordreLieu(t, nom, data);
  if (!o) return data;
  const i = new Map(o.ids.map((id, j) => [id, j]));
  return data.slice().sort((a, b) => (i.has(a.id) ? i.get(a.id) : 999) - (i.has(b.id) ? i.get(b.id) : 999));
}
// À l'ouverture du lieu : l'ordre est recalculé (rien ne bouge ensuite tant que le joueur y joue)
function recalculerOrdreLieu(t, nom) {
  if ((!ORDRE_ADAPTE && !REVISION_LIEU) || !suivi) return;
  ordreLieu(t, nom, expeditionsDuChapitreClasseur(t, nom), true);
}

// ---- 2C · la Révision du lieu : quelles expéditions ----
function enRevisionLieu(x) {
  if (!REVISION_LIEU || !suivi || !x || !x.chapitre) return false;
  const o = suivi.ordreLieux && suivi.ordreLieux[cleOrdreLieu(x.territoire, x.chapitre)];
  return !!o && (o.rev || []).includes(x.id) && !expLancee(x) && empreintesExp(x) === 0;
}
function membresRevisionLieu(t, c) { return c ? expeditionsDuChapitre(t, c.nom).filter(enRevisionLieu) : []; }
function revisionLieuOuverte(t, c) { const m = membresRevisionLieu(t, c), o = expeditionsOuvertes(t); return m.length > 0 && m.some(x => o.has(x.id)); }
function revisionLieuAJouer(t, c) { return revisionLieuOuverte(t, c) ? membresRevisionLieu(t, c) : null; }
// Les espèces à revoir : une fois chacune, toutes expéditions confondues (avec photo, pas encore revues dans l'une d'elles)
function especesRevisionLieu(membres) {
  const vues = new Set(), l = [];
  for (const x of membres) for (const e of x.liste)
    if (!vues.has(e.nom_courant) && estRenseigne(e.photo) && !estRevue(x, e)) { vues.add(e.nom_courant); l.push(e); }
  return l;
}

// ---- 2C · les angles ----
const ANGLES_REVISION = ["cri", "empreinte", "forme", "nom", "photo"];
const POIDS_ANGLE = { cri: 3, empreinte: 3, forme: 3, nom: 2, photo: 1 };
// Les noms pièges de son monde : l'expédition d'abord (même groupe, puis même famille), puis la même famille dans un
//   territoire commun (groupe, ordre, onglet) ; jamais l'espèce, jamais deux fois le même nom. avecSosie : un sosie avec photo
//   en premier (reconnaître une photo, c'est justement ne pas le confondre). avecPhoto : seulement des espèces avec photo.
function piegesMonde(e, contexte, avecPhoto, avecSosie) {
  const sosies = sosiesDe(e);
  const terr = o => String(o.territoire || "").split(" ; ");
  const t = terr(e), voisin = o => terr(o).some(v => t.includes(v));
  const ok = o => o && o !== e && estRenseigne(o.nom_courant) && o.nom_courant !== e.nom_courant && (!avecPhoto || estRenseigne(o.photo))
    && (avecSosie || !sosies.includes(o));
  const exp = (contexte || []).filter(ok);
  const meme = (o, k) => estRenseigne(e[k]) && o[k] === e[k];
  const res = [];
  const ajouter = l => { for (const o of melanger(l.slice())) if (res.length < 3 && !res.some(r => r.nom_courant === o.nom_courant)) res.push(o); };
  if (avecSosie) ajouter(sosies.filter(ok).slice(0, 1));
  ajouter(exp.filter(o => meme(o, "nom_affichage_groupe")));
  ajouter(exp.filter(o => o.onglet === e.onglet));
  ajouter(ESPECES.filter(o => ok(o) && voisin(o) && meme(o, "nom_affichage_groupe")));
  ajouter(ESPECES.filter(o => ok(o) && voisin(o) && meme(o, "ordre")));
  ajouter(ESPECES.filter(o => ok(o) && voisin(o) && o.onglet === e.onglet));
  return res.length === 3 ? res : null;
}
// Empreintes : même sorte d'empreinte et même famille d'abord ; jamais une empreinte presque identique (même « sosies »)
function piegesEmpreinteMonde(e, contexte) {
  const d = EMPREINTES[cleEmpreinte(e)];
  if (!d) return null;
  const autres = melanger(ESPECES.filter(o => o !== e && fichierEmpreinte(o) !== "NA" && o.nom_courant !== e.nom_courant
    && !(d.sosies && EMPREINTES[cleEmpreinte(o)].sosies === d.sosies)));
  const g = o => EMPREINTES[cleEmpreinte(o)].groupe === d.groupe, f = o => o.onglet === e.onglet;
  const terr = o => String(o.territoire || "").split(" ; "), t = terr(e), v = o => terr(o).some(z => t.includes(z));
  const ici = new Set((contexte || []).map(o => o.nom_courant)), c = o => ici.has(o.nom_courant);
  const l = [...autres.filter(o => c(o) && f(o)), ...autres.filter(o => g(o) && f(o) && v(o)), ...autres.filter(o => f(o) && v(o)), ...autres.filter(o => g(o) && f(o)), ...autres.filter(o => f(o)), ...autres.filter(o => g(o) && v(o))];
  const res = [];
  for (const o of l) if (res.length < 3 && !res.some(r => r.nom_courant === o.nom_courant)) res.push(o);
  return res.length === 3 ? res : null;
}
// La question d'un angle pour une espèce, ou null si elle ne l'a pas
function questionAngle(e, angle, contexte) {
  if (!estRenseigne(e.photo)) return null;
  if (angle === "photo") { const p = piegesMonde(e, contexte, false, true); return p && { angle, e, pieges: p }; }
  if (angle === "nom") { const p = piegesMonde(e, contexte, true, true); return p && { angle, e, pieges: p }; }
  if (angle === "cri") { if (typeof aUnCri !== "function" || !aUnCri(e)) return null; const p = piegesMonde(e, contexte, true, false); return p && { angle, e, pieges: p }; }
  if (angle === "empreinte") { if (fichierEmpreinte(e) === "NA" || typeof dessinsEmpreintes !== "function") return null; const p = piegesEmpreinteMonde(e, contexte); return p && { angle, e, pieges: p }; }
  if (angle === "forme") {
    if (typeof formesDemandables !== "function" || typeof QUESTION_FORME === "undefined" || (typeof QUESTION_FORME_ACTIVE !== "undefined" && !QUESTION_FORME_ACTIVE)) return null;
    const f = formesDemandables(e); if (!f.length) return null;
    const p = piegesMonde(e, contexte, false, false); return p && { angle, e, pieges: p, forme: auHasard(f) };
  }
  return null;
}
function anglesPossibles(e, contexte) { return ANGLES_REVISION.map(a => questionAngle(e, a, contexte)).filter(Boolean); }
// La suite des questions : une par espèce, jamais deux fois de suite le même angle ; le dernier angle de l'espèce évité si possible
function suiteRevision(especes, contexte) {
  const derniers = (suivi && suivi.angleRevision) || {};
  const restes = melanger(especes.map(e => ({ e, qs: anglesPossibles(e, contexte) })).filter(o => o.qs.length));
  const suite = [];
  let avant = null;
  while (restes.length) {
    let i = restes.findIndex(o => o.qs.some(q => q.angle !== avant));
    if (i < 0) i = 0;                                      // (aucune autre possibilité : ne se produit pas avec une photo, qui a « photo » et « nom »)
    const o = restes.splice(i, 1)[0];
    let qs = o.qs.filter(q => q.angle !== avant);
    if (!qs.length) qs = o.qs;
    const sansDernier = qs.filter(q => q.angle !== derniers[o.e.nom_courant]);
    if (sansDernier.length) qs = sansDernier;
    const total = qs.reduce((s, q) => s + POIDS_ANGLE[q.angle], 0);
    let r = Math.random() * total, q = qs[qs.length - 1];
    for (const c of qs) { r -= POIDS_ANGLE[c.angle]; if (r < 0) { q = c; break; } }
    suite.push(q); avant = q.angle;
  }
  return suite;
}

// ---- 2C · l'écran ----
let revLieu = null;   // { mode: "lieu" | "exp", t, nom, x, membres, suite, i, justes, avantGain, avantTerr, avantFinie }
function zoneRevision() {
  let z = document.getElementById("intermede-exp");
  if (!z) { z = document.createElement("div"); z.id = "intermede-exp"; document.getElementById("vue-rencontre").appendChild(z); }
  return z;
}
function preparerEcranRevision() {
  lancementDirect = true; montrer("jouer"); lancementDirect = false;
  for (const id of ["choix-longueur", "carte-rencontre", "fin-defi", "fin-session"]) { const el = document.getElementById(id); if (el) el.classList.add("cache"); }
}
// La Révision du lieu
function ouvrirRevisionLieu(t, nom) {
  const c = chapitreParNom(t, nom), membres = membresRevisionLieu(t, c);
  if (!membres.length) { ouvrirLieu(t, nom); return; }
  const toutes = especesRevisionLieu(membres);
  const choisies = melanger(toutes.slice()).sort((a, b) => nbBonnes(a, IDENTIFICATION) - nbBonnes(b, IDENTIFICATION)).slice(0, REVISION_LIEU_MAX);
  const contexte = [...new Set(membres.flatMap(x => x.liste))];
  revLieu = { mode: "lieu", t, nom, membres, suite: suiteRevision(choisies, contexte), i: 0, justes: 0, plafond: toutes.length > choisies.length,
              avantGain: membres.reduce((s, x) => s + gainExp(x), 0), avantTerr: empreintesTerritoire(t) };
  preparerEcranRevision();
  if (typeof majFilExpedition === "function") majFilExpedition(null);
  if (!revLieu.suite.length) { finirRevisionLieu(); return; }
  dessinerQuestionRevision();
  window.scrollTo(0, 0);
}
// La révision de début d'expédition (étape 316) : appelée par lancerRevueExpedition (17) ; true = c'est pris en charge ici
function revisionVarieeExp(x, reprise) {
  if (REVISION_LIEU && enRevisionLieu(x) && x.chapitre) {   // une expédition de la Révision du lieu : c'est elle qu'on joue
    const c = chapitreParNom(x.territoire, x.chapitre);
    if (revisionLieuOuverte(x.territoire, c)) { ouvrirRevisionLieu(x.territoire, x.chapitre); return true; }
  }
  if (!REVISION_VARIEE) return false;
  const toutes = especesARevoirIci(x).filter(e => estRenseigne(e.photo));
  if (!toutes.length) return false;                       // rien avec photo : l'ancienne suite (lancerExpedition)
  const liste = melanger(toutes.slice()).sort((a, b) => nbBonnes(a, IDENTIFICATION) - nbBonnes(b, IDENTIFICATION)).slice(0, REVISION_EXP_MAX);
  const avantFinie = etapeFinie(x, 1), avantGain = gainExp(x), avantTerr = empreintesTerritoire(x.territoire);
  for (const e of toutes) if (!liste.includes(e)) marquerRevue(x.id, e);   // au-delà de 3 : comptées d'office ici
  revLieu = { mode: "exp", x, t: x.territoire, membres: [x], suite: suiteRevision(liste, x.liste), i: 0, justes: 0, avantFinie, plafond: toutes.length > liste.length,
              avantGain, avantTerr };
  if (!revLieu.suite.length) { revLieu = null; return false; }
  preparerEcranRevision();
  majFilExpedition(x, 1);
  dessinerQuestionRevision();
  window.scrollTo(0, 0);
  return true;
}
function titreQuestionRevision(q) {
  const e = q.e;
  if (q.angle === "photo") return ["Quelle est cette espèce ?", ""];
  if (q.angle === "nom") return [`${pe(e).la === "le" ? "Lequel" : "Laquelle"} est ${nomAvecArticle(e)} ?`, "Touchez sa photo."];
  if (q.angle === "cri") return ["À qui est ce cri ?", "Écoutez, puis touchez la bonne photo."];
  if (q.angle === "empreinte") return ["À qui appartient cette empreinte ?", ""];
  const f = QUESTION_FORME[q.forme.sujet] || ["", "De quelle espèce est-il ?"];
  return [f[1], f[0]];
}
function dessinerQuestionRevision() {
  const R = revLieu, z = zoneRevision();
  if (!R) return;
  const q = R.suite[R.i], e = q.e, n = R.suite.length;
  const [titre, consigne] = titreQuestionRevision(q);
  const suffit = R.plafond ? "quelques questions suffisent ici." : n > 1 ? "une question chacune suffit ici." : "une question suffit ici.";
  const intro = R.i === 0 ? (R.mode === "lieu" ? `Vous connaissez déjà ces espèces d'un autre territoire : ${suffit}`
      : n > 1 || R.plafond ? `Vous connaissez déjà ces espèces ailleurs : ${suffit}` : `Vous connaissez déjà cette espèce ailleurs : ${suffit}`) : "";
  const choix = melanger([e, ...q.pieges]);
  const enPhotos = q.angle === "nom" || q.angle === "cri";
  let stimulus = "";
  if (q.angle === "photo") stimulus = `<div class="rl-stim">${imagePhoto(e.photo, "")}</div>`;
  else if (q.angle === "forme") stimulus = `<div class="rl-stim">${imagePhoto(q.forme.src, "")}</div>`;
  else if (q.angle === "cri") stimulus = `<div class="im-ecoute"><button type="button" class="im-ecouter" id="rl-ecouter" aria-label="Écouter le cri">▶ Écouter</button></div>`;
  else if (q.angle === "empreinte") {
    const larg = Math.max(200, Math.min((z.clientWidth || 340) - 60, 420));
    const [d] = dessinsEmpreintes([e], larg, Math.round(larg * 0.55));
    stimulus = `<div class="rl-stim rl-emp"><div class="emp-carte emp-seule"><span class="emp-dessin">${d.html}</span>${d.legende}${boutonLoupeEmpreinte(e)}</div></div>`;
  }
  const reponses = enPhotos
    ? `<div class="im-photos rl-photos">${choix.map((o, i) => `<button type="button" class="im-photo rl-rep" data-i="${i}">${imgMini(o.photo, "")}<span class="im-etiquette"></span></button>`).join("")}</div>`
    : `<div class="im-noms rl-noms">${choix.map((o, i) => `<button type="button" class="im-nom rl-rep" data-i="${i}">${echapper(o.nom_courant)}</button>`).join("")}</div>`;
  const quitter = R.mode === "lieu" ? `<button class="im-passer" id="rl-quitter" type="button">Revenir au lieu</button>` : "";
  z.innerHTML = `<div class="im-carte rl-carte"><div class="im-tete"><span class="im-lib">${R.mode === "lieu" ? `Révision du lieu · ${R.i + 1} sur ${n}` : `Révision · ${R.i + 1} sur ${n}`}</span>
      <h2>${echapper(titre)}</h2>${intro ? `<p class="rl-intro">${echapper(intro)}</p>` : ""}${consigne ? `<p>${echapper(consigne)}</p>` : ""}</div>
    ${stimulus}${reponses}
    <p class="im-retour rl-retour" id="rl-retour"></p>
    <div class="im-pied rl-pied"><button class="bouton-accueil principal cache" id="rl-suite" type="button">${R.i + 1 < n ? "Suivant ▶" : R.mode === "lieu" ? "Terminer la révision ▶" : "Continuer ▶"}</button>${quitter}</div></div>`;
  if (q.angle === "empreinte" && typeof brancherLoupesEmpreintes === "function") brancherLoupesEmpreintes(z);
  if (q.angle === "cri") {
    const son = new Audio(fichierSon(e)), b = document.getElementById("rl-ecouter");
    R.son = son;
    son.onended = () => { b.textContent = "▶ Réécouter"; };
    b.onclick = () => {
      if (!son.paused) { son.pause(); b.textContent = "▶ Réécouter"; return; }
      son.currentTime = 0; son.play().catch(() => { b.textContent = "Son introuvable"; }); b.textContent = "■ Arrêter";
    };
  }
  const q2 = document.getElementById("rl-quitter");
  if (q2) q2.onclick = () => { const r = revLieu; arreterSonRevision(); revLieu = null; fermerIntermede(); session = null; ouvrirLieu(r.t, r.nom); };
  let repondu = false;
  z.querySelectorAll(".rl-rep").forEach(btn => btn.onclick = () => {
    if (repondu) return;
    repondu = true;
    const o = choix[Number(btn.dataset.i)], juste = o === e;
    z.querySelectorAll(".rl-rep").forEach(b => {
      const c = choix[Number(b.dataset.i)];
      b.disabled = true;
      if (enPhotos) b.querySelector(".im-etiquette").textContent = c.nom_courant;
      if (c === e) b.classList.add(enPhotos ? "juste" : "rl-juste");
    });
    if (!juste) btn.classList.add(enPhotos ? "non" : "rl-fausse");
    try { jouerSon(juste ? "bonne" : "mauvaise"); } catch (err) { /* rien */ }
    document.getElementById("rl-retour").innerHTML = retourRevision(q, juste, o);
    noterReponseRevision(q, juste);
    const s = document.getElementById("rl-suite"); s.classList.remove("cache"); s.focus({ preventScroll: true });
    s.onclick = () => { arreterSonRevision(); if (R.i + 1 < n) { R.i++; dessinerQuestionRevision(); window.scrollTo(0, 0); } else finirRevision(); };
  });
}
function arreterSonRevision() { if (revLieu && revLieu.son) { try { revLieu.son.pause(); } catch (err) { /* rien */ } revLieu.son = null; } }
// Le retour après la réponse : sobre ; une erreur est expliquée (ce qui la distingue, quand le jeu le sait)
function retourRevision(q, juste, o) {
  const e = q.e, nom = echapper(e.nom_courant);
  let plus = "";
  if (q.angle === "cri") { const s = SONS[cleEmpreinte(e)]; if (s && s.texte) plus = echapper(s.texte); }
  else if (q.angle === "empreinte") plus = echapper(texteEmpreinte(e));
  else if (q.angle === "forme") plus = echapper(`${q.forme.etiquette}${q.forme.change ? " : " + q.forme.change : ""}.`).replace(/\.\.$/, ".");
  if (juste) return `<b>Bravo !</b>${plus ? " " + plus : ""}`;
  const conf = (q.angle === "photo" || q.angle === "nom") && typeof phraseConfusion === "function" && sosiesDe(e).includes(o) ? echapper(phraseConfusion(e).trim()) : "";
  const debut = q.angle === "nom" || q.angle === "cri" ? `${echapper(majuscule(nomAvecArticle(e)))} est en vert.` : `C'était : ${nom}.`;
  return `${debut}${conf ? " " + conf : plus ? " " + plus : ""}`;
}
// Une réponse compte toujours pour la révision ici ; une bonne réponse crédite aussi sa photo (comme la révision d'avant)
function noterReponseRevision(q, juste) {
  const R = revLieu, e = q.e;
  if (juste) {
    R.justes++;
    marquerVue(e);
    progression[e.nom_courant].acquis[IDENTIFICATION] = nbBonnes(e, IDENTIFICATION) + 1;
    if (typeof noterRevue === "function") noterRevue(e, IDENTIFICATION);
  }
  for (const x of R.membres) if (x.liste.includes(e)) marquerRevue(x.id, e);
  suivi.angleRevision = suivi.angleRevision || {};
  suivi.angleRevision[e.nom_courant] = q.angle;
  sauvegarder();
  if (R.mode === "exp" && typeof majBandeExpedition === "function") majBandeExpedition(R.x);
}
function finirRevision() { if (revLieu && revLieu.mode === "lieu") finirRevisionLieu(); else finirRevisionExp(); }
function finirRevisionExp() {
  const R = revLieu, x = R.x;
  revLieu = null; fermerIntermede(); session = null;
  const gagnees = Math.max(0, gainExp(x) - R.avantGain);
  if (etapeFinie(x, 1)) {
    ouvrirExpedition(x);
    if (!R.avantFinie) feter({ exp: x, etiquette: `Expédition · ${x.titre}`, titre: etapeReussie(1), detail: `Prochaine étape : leur vie (+${GAIN_FIN_EXPEDITION} empreintes à gagner).`,
                               son: "badge", visuel: `<div class="fete-visuel rang exp-fete">${PAS_SVG}</div>` });
  } else lancerExpedition(x, 1);
  if (gagnees) verifierOuverture();
}
// La fin de la Révision du lieu : chaque expédition dont toutes les espèces sont connues est terminée (étapes 1 et 2)
function terminerMembresRevision(membres) {
  const finies = [];
  for (const x of membres) {
    if (!x.liste.every(e => especeFaite(e, 1))) continue;
    for (const e of x.liste) marquerRevue(x.id, e);
    if (etapeFinie(x, 1) && !etapeFinie(x, 2)) { suivi.ensembleFait = suivi.ensembleFait || {}; suivi.ensembleFait[x.id] = true; }
    suivi.revisionLieuFaite = suivi.revisionLieuFaite || {};
    suivi.revisionLieuFaite[x.id] = Date.now();
    if (empreintesExp(x) >= NB_ETAPES) finies.push(x);
  }
  sauvegarder();
  return finies;
}
function finirRevisionLieu() {
  const R = revLieu, z = zoneRevision();
  const finies = terminerMembresRevision(R.membres);
  const gagnees = Math.max(0, R.membres.reduce((s, x) => s + gainExp(x), 0) - R.avantGain);
  const n = R.suite.length;
  z.innerHTML = `<div class="im-carte rl-carte"><div class="im-tete"><span class="im-lib">Révision du lieu</span>
      <h2>${n && R.justes === n ? "Toutes retrouvées" : "Révision terminée"}</h2>
      <p>${n && R.justes < n ? `${R.justes} sur ${n} retrouvée${R.justes > 1 ? "s" : ""} du premier coup. ` : ""}${finies.length > 1 ? `Ces ${finies.length} expéditions sont terminées :` : "Cette expédition est terminée :"} ${echapper(listeDeNoms(finies.map(x => "« " + x.titre + " »")))}.${gagnees ? ` +${gagnees} empreintes.` : ""}</p></div>
    <div class="im-pied"><button class="bouton-accueil principal" id="rl-fin" type="button">Voir le lieu ▶</button></div></div>`;
  document.getElementById("rl-fin").onclick = () => { revLieu = null; fermerIntermede(); session = null; ouvrirLieu(R.t, R.nom); };
  if (finies.length) feter({ etiquette: `Lieu · ${R.nom}`, titre: "Révision du lieu terminée",
    detail: `${finies.length} expédition${finies.length > 1 ? "s" : ""} terminée${finies.length > 1 ? "s" : ""}${gagnees ? ` · +${gagnees} empreintes` : ""}`,
    son: "badge", visuel: `<div class="fete-visuel rang exp-fete">${PAS_SVG}</div>` });
  if (gagnees) verifierOuverture();
  window.scrollTo(0, 0);
}

// ---- 2C · sur le chemin du lieu : l'arrêt « Révision du lieu » (appelé par cheminDuLieu, 17) ----
function arretRevisionLieu(t, c, membres, ouvertes, num, prochaine) {
  const ouverte = membres.some(x => ouvertes.has(x.id));
  const nb = especesRevisionLieu(membres).length, v = vedetteDe(membres[0]);
  const tag = !ouverte ? `<span class="exp-tag ferm">Plus tard</span>` : `<span class="exp-tag ${prochaine ? "cours" : "nouv"}">${prochaine ? "À suivre" : "Ouverte"}</span>`;
  return `<div class="rl-arret${ouverte ? "" : " fermee"}">
    <button class="chemin-arret ${ouverte ? "nouvelle" : "fermee"}${prochaine ? " prochaine" : ""} rl-arret-bouton" data-revlieu="1" type="button">
      <span class="chemin-num">${num}</span>
      <span class="chemin-rond">${imgMini(membres[0].photo || photoEsp(v), v.nom_courant)}</span>
      <span class="chemin-info"><b>Révision du lieu</b>
        <small><span>${membres.length} expédition${membres.length > 1 ? "s" : ""} · ${Math.min(nb, REVISION_LIEU_MAX)} question${Math.min(nb, REVISION_LIEU_MAX) > 1 ? "s" : ""}</span></small>
        <small class="rl-arret-ligne">Vous connaissez déjà ces espèces d'un autre territoire : ${nb > REVISION_LIEU_MAX ? "quelques questions suffisent ici." : "une question chacune suffit ici."}</small></span>
      <span class="chemin-droite">${tag}</span></button>
    <div class="rl-membres">${membres.map(x => `<button type="button" class="rl-membre" data-exp="${echapper(x.id)}">${echapper(x.titre)}</button>`).join("")}</div></div>`;
}
function brancherRevisionLieu(zone, t, c) {
  const b = zone.querySelector("[data-revlieu]");
  if (b) b.onclick = () => {
    if (revisionLieuOuverte(t, c)) ouvrirRevisionLieu(t, c.nom);
    else afficherBulle("Elle s'ouvrira quand vous aurez commencé une des expéditions proposées");
  };
  zone.querySelectorAll(".rl-membre").forEach(m => m.onclick = () => {
    const x = expeditionParId(m.dataset.exp);
    if (x && expeditionsOuvertes(t).has(x.id)) ouvrirExpedition(x);
    else afficherBulle("Elle s'ouvrira avec la Révision du lieu");
  });
}
