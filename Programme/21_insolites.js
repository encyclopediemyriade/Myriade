// ==================================================================
// 21. LES QUESTIONS INSOLITES (chantier QI, 09/11/2026)
//    Contenu : faits_questions.js (QUESTIONS_INSOLITES), généré depuis Données\faits_questions.xlsx.
//    Choix d'Aubin (09/11) : des questions qui sortent de l'ordinaire, posées selon ce qu'elles demandent —
//      étape 3 · Approfondir : « Lequel de ces animaux… ? », « Vrai ou faux ? », « L'intrus » ;
//      (à venir : étape 1 = faits physiques en bonus ; étape 2 = scènes et « qui s'occupe des petits » ;
//       fin d'expédition = « Que se passe-t-il si… ? » et « Reliez »).
//    Règle : ces questions REMPLACENT une question ordinaire dans une partie (jamais en plus) et ne changent
//      ni la fiche, ni les quotas, ni les empreintes : ce qui est trouvé est noté à part (suivi.insolites),
//      pour ne pas reposer une question déjà réussie.
// ==================================================================
const INSOLITE = "__insolite";            // le « champ » d'une question insolite (ce n'est pas une case de la fiche)
const INSOLITES_ACTIFS = true;            // false = le jeu d'avant le chantier QI
const INSOLITES_PAR_PARTIE = 1;           // au plus une question insolite par partie
const INSOLITE_APRES = 2;                 // jamais avant la 3e question d'une partie
const INSOLITE_CHANCE = 0.35;             // à chaque question ensuite, une chance sur trois environ…
const INSOLITE_AU_PLUS_TARD = 6;          // …et au plus tard à la 7e question, s'il y en a une à poser

function donneesInsolites() { return typeof QUESTIONS_INSOLITES !== "undefined" ? QUESTIONS_INSOLITES : null; }
function insoliteTrouve(id) { return !!(suivi && suivi.insolites && suivi.insolites[id]); }
// Étape RF5 (versement des lots QIR, règle du 09/11) : un fait tiré d'une anecdote « Le saviez-vous ? » n'est posé
//   qu'une fois cette anecdote gagnée (médaille de l'espèce) ; les faits neufs se posent toujours.
const NIVEAU_MEDAILLE = { bronze: 1, argent: 2, or: 3 };
function faitDisponible(f) {
  if (!f || !f.apresAnecdote) return true;
  const e = typeof especeParNom === "function" ? especeParNom(f.espece) : ESPECES.find(x => x.nom_courant === f.espece);
  return !!e && typeof medailleGagnee === "function" && medailleGagnee(e) >= (NIVEAU_MEDAILLE[f.medaille] || 1);
}

// Les questions insolites d'une espèce pour une étape (k = 4 : Approfondir)
function insolitesDe(espece, k) {
  const d = donneesInsolites();
  if (!d || !espece) return [];
  const nom = espece.nom_courant, liste = [];
  if (k === 4) {
    for (const f of d.faits) if (f.espece === nom && f.etape === "3" && faitDisponible(f)) liste.push({ type: f.format, item: f });
    for (const i of d.intrus) if (i.espece === nom) liste.push({ type: "intrus", item: i });
  }
  if (k === 2) for (const c of d.scenes) if (c.espece === nom && c.type === "quoi") liste.push({ type: "scene", item: c });   // QI6 : scène « Que fait-il ? »
  return liste;
}

// Appelé par choisirQuestionExpedition (17) : une question insolite à la place d'une question ordinaire, ou null
function choisirInsolite(k) {
  if (!INSOLITES_ACTIFS || !defi || !defi.expedition || (k !== 4 && k !== 2)) return null;   // QI6 : aussi l'étape 2 (scènes)
  defi.posees = defi.posees || [];
  defi.insolitesPosees = defi.insolitesPosees || [];
  if (defi.insolitesPosees.length >= INSOLITES_PAR_PARTIE) return null;
  const n = defi.posees.length;
  if (n < INSOLITE_APRES) return null;
  if (n < INSOLITE_AU_PLUS_TARD && Math.random() >= INSOLITE_CHANCE) return null;
  const candidats = [];
  for (const e of defi.especes || []) {
    if (!estIdentifiee(e)) continue;
    for (const c of insolitesDe(e, k)) if (!insoliteTrouve(c.item.id) && !defi.insolitesPosees.includes(c.item.id)) candidats.push({ espece: e, ...c });
  }
  if (!candidats.length) return null;
  // pas la même espèce qu'à la question d'avant, si possible
  const derniere = n ? defi.posees[n - 1].split("|")[0] : null;
  const autres = candidats.filter(c => c.espece.nom_courant !== derniere);
  const choix = auHasard(autres.length ? autres : candidats);
  defi.insolitesPosees.push(choix.item.id);
  defi.posees.push(choix.espece.nom_courant + "|" + INSOLITE);
  defi.insoliteEnCours = choix;
  return { espece: choix.espece, champ: INSOLITE, estRevision: false };
}

// ---- Poser la question (appelé par poserQuestion, 03) ----
function poserInsolite(espece) {
  const c = (defi && defi.insoliteEnCours) || (!defi && session && session.insoliteEnCours);   // QI4 : aussi le bonus d'une Rencontre
  const zone = document.getElementById("reponses");
  if (!c || c.espece !== espece) { enTete(espece, true, true); document.getElementById("question").textContent = ""; return; }
  const it = c.item;
  // l'étiquette sous le nom dit ce qu'est la question (et non « À découvrir », qui parle des cases de la fiche)
  document.getElementById("revision").textContent = c.etonnant ? "" : c.bonus ? "Question bonus · fait insolite" : c.type === "intrus" ? "L'intrus" : c.type === "vrai_faux" ? "Fait insolite" : c.type === "si" ? "Et si… ?" : c.type === "scene" ? "Sur le terrain" : "";
  if (c.type === "lequel") {
    enTete(espece, false, false, "Fait insolite");
    document.getElementById("question").textContent = it.question;
    // Étape QI3c (09/11, demande d'Aubin) : les espèces proposées en photos, avec leur nom dessous (comme « Lequel… ? » en photos ;
    // ici le nom reste écrit : la question porte sur le fait, pas sur la reconnaissance de l'animal)
    zone.className = "grille-photos";
    const choix = [espece, ...it.pieges.slice(0, 3).map(n => ESPECES.find(e => e.nom_courant === n)).filter(Boolean)];
    for (const e of melanger(choix)) {
      const bouton = document.createElement("button");
      bouton.className = "reponse choix-photo";
      bouton.innerHTML = `<div class="photo">${celluleImage(e, true)}</div><div class="legende">${e.nom_courant}</div>`;
      if (e === espece) bouton.dataset.juste = "oui";
      bouton.onclick = () => repondre(bouton, e === espece);
      zone.appendChild(bouton);
    }
    enCours = { espece, champ: INSOLITE, insolite: c, q: null, bonne: null, cacherEspece: true,   // la bande ne montre pas l'espèce : c'est la réponse
                explication: `C'est ${nomAvecArticle(espece)} : ${minusculeDebut(it.fait)}${it.explication ? " " + it.explication : ""}` };
  } else if (c.type === "vrai_faux") {
    enTete(espece, true, true);
    document.getElementById("question").textContent = "Vrai ou faux ?";
    const vraie = Math.random() < 0.5;
    const affirmation = document.getElementById("affirmation");
    affirmation.textContent = "« " + (vraie ? it.fait : it.faux) + " »";
    affirmation.classList.remove("cache");
    ajouterBouton("Vrai", vraie);
    ajouterBouton("Faux", !vraie);
    enCours = { espece, champ: INSOLITE, insolite: c, q: null, bonne: null,
                explication: (vraie ? it.fait : "C'est faux : " + minusculeDebut(it.fait)) + (it.explication ? " " + it.explication : "") };
  } else if (c.type === "deux") {                      // étape RF1 : « Étonnant » — deux affirmations, une seule vraie
    enTete(espece, true, true);
    document.getElementById("question").textContent = "À votre avis, lequel est vrai ?";
    zone.classList.add("reponses-phrases");
    for (const t of melanger([it.fait, it.faux])) ajouterBouton(t, t === it.fait);
    enCours = { espece, champ: INSOLITE, insolite: c, q: null, bonne: null, explication: it.fait + (it.explication ? " " + it.explication : "") };
  } else if (c.type === "intrus") {
    enTete(espece, true, true);
    document.getElementById("question").textContent = "Une de ces phrases est fausse. Laquelle ?";
    zone.classList.add("reponses-phrases");
    for (const t of melanger([...it.vraies, it.fausse])) ajouterBouton(t, t === it.fausse);
    enCours = { espece, champ: INSOLITE, insolite: c, q: null, bonne: null,
                explication: `L'intrus : « ${it.fausse} »${it.explication ? " " + it.explication : ""}` };
  }
  else if (c.type === "scene") {                       // QI6 : la scène « Que fait-il ? » (étape 2)
    enTete(espece, true, true);
    document.getElementById("question").textContent = `${it.scene} ${it.question}`;
    zone.classList.add("reponses-phrases");
    for (const t of melanger([it.bonne, ...it.mauvaises])) ajouterBouton(t, t === it.bonne);
    enCours = { espece, champ: INSOLITE, insolite: c, q: null, bonne: null, explication: it.bonne + (it.explication ? " " + it.explication : "") };
  }
  else if (c.type === "si") {                          // QI5 : « Que se passe-t-il si… ? » (dans l'essai, et plus tard la finale)
    enTete(espece, true, true);
    document.getElementById("question").textContent = `${it.situation} ${it.question}`;   // la situation d'abord, puis la question
    zone.classList.add("reponses-phrases");
    for (const t of melanger([it.bonne, ...it.mauvaises])) ajouterBouton(t, t === it.bonne);
    enCours = { espece, champ: INSOLITE, insolite: c, q: null, bonne: null, explication: it.bonne + (it.explication ? " " + it.explication : "") };
  }
  if (typeof avantQuestionExpedition === "function") avantQuestionExpedition(espece);   // la bande montre l'espèce de la question
}
function minusculeDebut(t) { return t ? t.charAt(0).toLowerCase() + t.slice(1) : ""; }

// ---- La réponse (appelé par repondreRevision, 08) ----
function repondreInsolite(boutonClique, estJuste) {
  const { espece, explication, insolite } = enCours;
  for (const b of document.querySelectorAll(".reponse")) {
    b.disabled = true;
    if (b.dataset.juste === "oui") b.classList.add("juste");
  }
  document.getElementById("nom").textContent = espece.nom_courant;
  document.getElementById("famille").classList.remove("cache");
  // « Lequel de ces animaux » montre déjà les photos dans la grille : la grande photo resterait en trop (QI3c)
  if (insolite.type !== "lequel") {
    document.getElementById("photo-rencontre").classList.remove("cache");
    if (!document.getElementById("photo-rencontre").innerHTML) document.getElementById("photo-rencontre").innerHTML = celluleImage(espece);
  }
  enCours.cacherEspece = false;                        // après la réponse, la bande peut montrer l'espèce
  const retour = document.getElementById("retour");
  const essai = !!defi.essaiInsolites;                 // étape QI3b : l'essai n'enregistre rien
  if (estJuste) {
    if (!essai) { suivi.insolites = suivi.insolites || {}; suivi.insolites[insolite.item.id] = (suivi.insolites[insolite.item.id] || 0) + 1; }
    noterAuBilan(espece, INSOLITE, "Fait insolite : " + (insolite.type === "intrus" ? "l'intrus repéré" : minusculeDebut(insolite.item.fait)));
    defi.bonnes = defi.bonnes + 1;
    defi.score = defi.score + 1;
    retour.textContent = "Bravo ! " + explication;
    jouerSon();
  } else {
    if (boutonClique) { boutonClique.classList.add("fausse"); jouerSon("mauvaise"); }
    if (!defi.rates.some(r => r.nom === espece.nom_courant && r.explication === explication)) defi.rates.push({ nom: espece.nom_courant, explication });
    retour.textContent = explication;
  }
  defi.faites = defi.faites + 1;
  if (typeof apresReponseExpedition === "function") apresReponseExpedition(espece);
  afficherHud();
  afficherStats();
  if (!essai) sauvegarder();
  const suivant = document.getElementById("suivant");
  suivant.textContent = defi.faites >= defi.total ? "Voir le résultat →" : "Question suivante →";
  suivant.classList.remove("cache");
  noterDansHistorique();
}

// ==================================================================
// Étape QI3b (09/11, demande d'Aubin) : un ESSAI des questions insolites, depuis À propos → Réglages de la partie.
//   10 questions tirées parmi toutes celles qui sont prêtes (toutes étapes confondues), dans le vrai écran de jeu.
//   Rien n'est enregistré (ni fiche, ni questions trouvées, ni empreintes) : la partie du joueur ne change pas.
//   Bouton visible tant que le chantier est en test (ESSAI_INSOLITES_VISIBLE) ; à retirer à la fin du chantier.
// ==================================================================
const ESSAI_INSOLITES_VISIBLE = true;
const ESSAI_INSOLITES_QUESTIONS = 10;
let essaiInsolitesVus = new Set();         // pour faire défiler toutes les questions d'un essai à l'autre (le temps de la visite)

function questionsEssaiInsolites() {
  const d = donneesInsolites();
  if (!d) return [];
  const espece = nom => ESPECES.find(e => e.nom_courant === nom);
  return [...d.faits.map(f => ({ espece: espece(f.espece), type: f.format, item: f })),
          ...d.intrus.map(i => ({ espece: espece(i.espece), type: "intrus", item: i })),
          ...d.si.map(s => ({ espece: espece(s.espece), type: "si", item: s })),                         // QI5 : aussi « Et si… ? »
          ...d.scenes.filter(c => c.type === "quoi").map(c => ({ espece: espece(c.espece), type: "scene", item: c }))].filter(c => c.espece);   // QI6
}
function htmlEssaiInsolites() {
  if (!ESSAI_INSOLITES_VISIBLE || !donneesInsolites()) return "";
  const n = questionsEssaiInsolites().length;
  return `<div class="apropos-action" data-cle="essai-insolites"><p><b>En test · Questions insolites.</b> ${ESSAI_INSOLITES_QUESTIONS} questions tirées parmi les ${n} en préparation (« Lequel de ces animaux », « Vrai ou faux », « L'intrus », « Et si… ? », scènes). Rien n'est enregistré : votre partie ne change pas.</p>
    <button class="bouton-apropos" type="button" id="bouton-essai-insolites">Essayer ▶</button></div>`;
}
function brancherEssaiInsolites() {
  const b = document.getElementById("bouton-essai-insolites");
  if (b) b.onclick = lancerEssaiInsolites;
}
function lancerEssaiInsolites() {
  let toutes = questionsEssaiInsolites();
  if (!toutes.length) return;
  let neuves = toutes.filter(c => !essaiInsolitesVus.has(c.item.id));
  if (neuves.length < ESSAI_INSOLITES_QUESTIONS) { essaiInsolitesVus = new Set(); neuves = toutes; }
  const liste = melanger(neuves).slice(0, ESSAI_INSOLITES_QUESTIONS);
  lancementDirect = true;
  montrer("jouer");
  lancementDirect = false;
  if (typeof majFilExpedition === "function") majFilExpedition(null);
  session = null;
  defi = { jeu: "revision", essaiInsolites: true, jouer: true, pastilles: [], chrono: false,   // jouer : les pastilles de partie, comme dans les expéditions
           faites: 0, total: liste.length, numero: 1,
           cle: "essai-insolites", nom: "Essai · Questions insolites", especes: [...new Set(liste.map(c => c.espece))], source: {},
           xpBase: 0, xpRapidite: 0, bilan: [], score: 0, bonnes: 0, serie: 0, meilleureSerie: 0, rates: [], attente: null,
           expedition: null, liste };
  ["fin-defi", "fin-session", "choix-longueur"].forEach(id => { const el = document.getElementById(id); if (el) el.classList.add("cache"); });
  document.getElementById("carte-rencontre").classList.remove("cache");
  document.getElementById("hud-defi").classList.remove("cache");
  afficherHud();
  questionEssaiInsolite();
  window.scrollTo(0, 0);
}
function questionEssaiInsolite() {
  const c = defi.liste[defi.faites];
  essaiInsolitesVus.add(c.item.id);
  defi.numero = defi.faites + 1;
  defi.insoliteEnCours = c;
  afficherHud();
  poserQuestion({ espece: c.espece, champ: INSOLITE, estRevision: false });
}
// Appelé par suiteDuJeu (08) quand on clique « Question suivante » pendant un essai
function suiteEssaiInsolites() {
  if (defi.faites < defi.total) { questionEssaiInsolite(); return; }
  // la fin : le score, puis « 10 autres questions » ou retour aux réglages
  const bonnes = defi.bonnes, total = defi.total;
  const photo = document.getElementById("photo-rencontre");
  photo.classList.add("cache"); photo.innerHTML = "";
  document.getElementById("famille").classList.add("cache");
  document.getElementById("revision").textContent = "";
  document.getElementById("nom").textContent = "Essai terminé";
  document.getElementById("question").textContent = `${bonnes} bonne${bonnes > 1 ? "s" : ""} réponse${bonnes > 1 ? "s" : ""} sur ${total}. Rien n'a été enregistré.`;
  document.getElementById("affirmation").classList.add("cache");
  document.getElementById("retour").textContent = "";
  document.getElementById("suivant").classList.add("cache");
  const zone = document.getElementById("reponses");
  zone.className = "fin-essai"; zone.innerHTML = "";
  const encore = document.createElement("button"); encore.className = "ac-bouton"; encore.textContent = `${ESSAI_INSOLITES_QUESTIONS} autres questions ▶`;
  encore.onclick = () => { defi = null; lancerEssaiInsolites(); };
  const retour = document.createElement("button"); retour.className = "bouton-apropos"; retour.textContent = "Retour aux réglages";
  retour.onclick = () => { defi = null; montrer("apropos"); };
  zone.append(encore, retour);
}

// ==================================================================
// Étape QI4 (09/11, choix d'Aubin : « faits physiques : étape 1, en question bonus »)
//   Dans une Rencontre (étape 1 d'une expédition, ou depuis la fiche), la question bonus de la fin peut être
//   un fait physique insolite de l'espèce (classeur : etape = 1), en « Vrai ou faux ? », photo visible.
//   Il remplace le bonus habituel (un trait montré) : jamais une question en plus. Pas de reprise s'il est raté.
// ==================================================================
function insoliteBonus(espece) {
  const d = donneesInsolites();
  if (!INSOLITES_ACTIFS || !d || !espece) return null;
  const faits = d.faits.filter(f => f.espece === espece.nom_courant && f.etape === "1" && f.faux && !insoliteTrouve(f.id) && faitDisponible(f));
  return faits.length ? auHasard(faits) : null;
}
// Étape RF1 : le fait « Étonnant » de la Rencontre complète — n'importe quel fait de l'espèce qui a sa fausse
//   affirmation (étape 1, 2 ou 3 du classeur), pas encore trouvé ; posé en « deux affirmations, une vraie ».
function insoliteEtonnant(espece) {
  const d = donneesInsolites();
  if (!INSOLITES_ACTIFS || !d || !espece) return null;
  const faits = d.faits.filter(f => f.espece === espece.nom_courant && f.fait && f.faux && !insoliteTrouve(f.id) && faitDisponible(f));
  const neufs = faits.filter(f => !f.apresAnecdote);   // RF5 : de préférence un fait neuf (pas une anecdote déjà lue)
  return neufs.length ? auHasard(neufs) : faits.length ? auHasard(faits) : null;
}
function repondreInsoliteRencontre(boutonClique, estJuste) {
  const { espece, explication, insolite } = enCours;
  for (const b of document.querySelectorAll(".reponse")) { b.disabled = true; if (b.dataset.juste === "oui") b.classList.add("juste"); }
  document.getElementById("famille").classList.remove("cache");
  const retour = document.getElementById("retour");
  if (estJuste) {
    suivi.insolites = suivi.insolites || {};
    suivi.insolites[insolite.item.id] = (suivi.insolites[insolite.item.id] || 0) + 1;
    noterAuBilan(espece, INSOLITE, "Fait insolite : " + minusculeDebut(insolite.item.fait));
    retour.textContent = "Bravo ! " + explication;
    jouerSon();
  } else {
    if (boutonClique) { boutonClique.classList.add("fausse"); jouerSon("mauvaise"); }
    retour.textContent = explication;
  }
  const boutonSuivant = document.getElementById("suivant");
  if (session) {
    session.faites = session.faites + 1;
    if (estJuste) session.bonnes = session.bonnes + 1;
    if (session.focus) { session.bonusPose = true; session.bonusJuste = !!estJuste; }
    session.insoliteEnCours = null;
    if (session.focus && session.faites < session.total && !resteAQuestionner()) session.total = session.faites;
    boutonSuivant.textContent = (session.faites >= session.total) ? "Voir le résultat →" : session.focus ? "Question suivante →" : "Rencontre suivante →";
  }
  afficherStats();
  sauvegarder();
  boutonSuivant.classList.remove("cache");
  noterDansHistorique();
}

// ==================================================================
// Étape QI5 (09/11, choix d'Aubin : « Que se passe-t-il si » en fin d'expédition, « Reliez » s'il y a de bons candidats)
//   Quand une expédition vient d'être terminée, le bouton principal de la fin propose, l'un après l'autre :
//   « Un lien du lieu » (R172, s'il y en a un), puis « Reliez » (3 faits ↔ 3 espèces de l'expédition, s'il y en a un),
//   puis « Et si… ? » (une question « Que se passe-t-il si » sur une espèce de l'expédition) ; puis le bouton reprend
//   son texte et son action. Rien d'obligatoire, rien de perdu : trouvé = noté (suivi.insolites), raté = expliqué.
// ==================================================================
function siPourExpedition(x) {
  const d = donneesInsolites();
  if (!INSOLITES_ACTIFS || !d || !x) return null;
  const noms = new Set(x.liste.filter(estIdentifiee).map(e => e.nom_courant));
  const c = d.si.filter(s => noms.has(s.espece) && !insoliteTrouve(s.id));
  return c.length ? auHasard(c) : null;
}
function reliezPourExpedition(x) {
  const d = donneesInsolites();
  if (!INSOLITES_ACTIFS || !d || !x) return null;
  const noms = new Set(x.liste.filter(estIdentifiee).map(e => e.nom_courant));
  return d.reliez.find(r => r.paires.length >= 3 && r.paires.every(p => noms.has(p.espece)) && !insoliteTrouve(r.id)) || null;
}
// Appelée par finExpedition (17) JUSTE AVANT proposerLienDuLieu : le lien du lieu, s'il y en a un, passe donc en premier
// (il garde, pour après lui, le bouton tel que nous le laissons ici).
function proposerFinInsolite(x, k, info, apres) {
  if (k !== 2 || !(apres >= NB_ETAPES && info.avant < NB_ETAPES)) return;
  const suites = [];
  const r = reliezPourExpedition(x); if (r) suites.push({ texte: "Reliez faits et espèces ▶", ouvrir: fin => ouvrirReliezFin(r, fin) });
  const s = siPourExpedition(x);     if (s) suites.push({ texte: "Et si… ? ▶", ouvrir: fin => ouvrirSiFin(s, fin) });
  if (!suites.length) return;
  const bouton = document.getElementById("bouton-rejouer-defi");
  const texte = bouton.textContent, action = bouton.onclick;
  const etape = i => {
    if (i >= suites.length) { bouton.textContent = texte; bouton.onclick = action; return; }
    bouton.textContent = suites[i].texte;
    bouton.onclick = () => suites[i].ouvrir(() => {
      etape(i + 1);
      if (typeof dernierResumeFin !== "undefined" && dernierResumeFin && typeof resumeFinTelephone === "function") resumeFinTelephone(dernierResumeFin);
    });
  };
  etape(0);
}
// L'écran commun (celui de « Un lien du lieu ») : il remplace la fin le temps de la question
function ecranFinInsolite() {
  const ancien = document.getElementById("forme-ecran"); if (ancien) ancien.remove();
  const z = document.createElement("div"); z.id = "forme-ecran";
  document.getElementById("fin-defi").classList.add("cache");
  const finTel = document.getElementById("resume-fin-defi"); if (finTel) finTel.classList.add("cache");
  document.getElementById("vue-rencontre").appendChild(z);
  const fermer = apres => () => {
    z.remove();
    document.getElementById("fin-defi").classList.remove("cache");
    if (finTel) finTel.classList.remove("cache");
    apres(); window.scrollTo(0, 0);
  };
  return { z, fermer };
}
function noterInsoliteTrouve(id) { suivi.insolites = suivi.insolites || {}; suivi.insolites[id] = (suivi.insolites[id] || 0) + 1; sauvegarder(); }

// « Et si… ? » : la situation, la photo de l'espèce, la question et 4 réponses de même forme
function ouvrirSiFin(it, apres) {
  const { z, fermer } = ecranFinInsolite();
  const e = especeParNom(it.espece);
  const choix = melanger([it.bonne, ...it.mauvaises]);
  z.innerHTML = `<div class="fp-carte fl-carte qi-si">
    <div class="fp-tete"><span class="fp-lib">Et si… ?</span><h2>${echapper(it.situation)}</h2></div>
    <div class="fl-duo"><figure><img src="${photoMini(e.photo)}" alt=""><figcaption>${echapper(e.nom_courant)}</figcaption></figure></div>
    <h3 class="fl-question">${echapper(it.question)}</h3>
    <div class="fl-choix qi-choix">${choix.map((v, i) => `<button type="button" class="fl-rep" data-i="${i}">${echapper(v)}</button>`).join("")}</div>
    <p class="fp-retour" id="qi-retour"></p>
    <div class="fp-pied"><button type="button" class="bouton-accueil principal cache" id="qi-suite">Continuer</button></div></div>`;
  z.querySelectorAll(".fl-rep").forEach(btn => btn.onclick = () => {
    const juste = choix[Number(btn.dataset.i)] === it.bonne;
    z.querySelectorAll(".fl-rep").forEach(o => { o.disabled = true; if (choix[Number(o.dataset.i)] === it.bonne) o.classList.add("juste"); });
    if (!juste) btn.classList.add("fausse");
    try { jouerSon(juste ? "bonne" : "mauvaise"); } catch (err) {}
    if (juste) noterInsoliteTrouve(it.id);
    document.getElementById("qi-retour").innerHTML = `${juste ? "Bravo ! " : ""}${echapper(it.bonne)}${it.explication ? `<br><small>${echapper(it.explication)}</small>` : ""}`;
    const s = document.getElementById("qi-suite"); s.classList.remove("cache"); s.onclick = fermer(apres); s.focus();
  });
  window.scrollTo(0, 0);
}

// « Reliez » : 3 faits, 3 espèces de l'expédition (comme la planche de l'étape 2 : une phrase, puis l'espèce)
function ouvrirReliezFin(it, apres) {
  const { z, fermer } = ecranFinInsolite();
  const r = { phrases: melanger(it.paires.map(p => ({ texte: p.fait, e: especeParNom(p.espece) }))), especes: melanger(it.paires.map(p => especeParNom(p.espece))),
              places: {}, rates: [], choisie: null, retour: "" };
  const dessiner = () => {
    const n = Object.keys(r.places).length, fini = n >= r.phrases.length;
    z.innerHTML = `<div class="fp-carte qi-reliez">
      <div class="fp-tete"><span class="fp-lib">Reliez</span><h2>Reliez chaque fait à son espèce</h2>
        <p>${fini ? (r.rates.length ? "Tous les faits sont placés." : "Tous les faits sont bien placés.") : "Sélectionnez un fait, puis l'espèce."}</p>
        <span class="fp-compte">${n} / ${r.phrases.length}</span></div>
      <div class="fp-especes">${r.especes.map(e => {
        const i = r.phrases.findIndex((f, j) => r.places[j] && f.e === e), f = i >= 0 ? r.phrases[i] : null;
        return `<button type="button" class="fp-espece${f ? (r.rates.includes(i) ? " revue" : " placee") : ""}" data-nom="${echapper(e.nom_courant)}"${fini ? " disabled" : ""}>
          <img src="${photoMini(e.photo)}" alt=""><span class="fp-nom">${echapper(e.nom_courant)}</span>${f ? `<span class="fp-phrase-posee">${echapper(f.texte)}</span>` : ""}</button>`; }).join("")}</div>
      <div class="fp-phrases">${r.phrases.map((f, i) => r.places[i] ? "" : `<button type="button" class="fp-phrase${r.choisie === i ? " choisie" : ""}" data-i="${i}">${echapper(f.texte)}</button>`).join("")}</div>
      <p class="fp-retour">${r.retour}</p>
      <div class="fp-pied">${fini ? `<button type="button" class="bouton-accueil principal" id="qi-suite">Continuer</button>` : ""}</div></div>`;
    z.querySelectorAll(".fp-phrase").forEach(b => b.onclick = () => { r.choisie = Number(b.dataset.i); r.retour = ""; dessiner(); });
    z.querySelectorAll(".fp-espece").forEach(b => b.onclick = () => {
      if (r.choisie === null) { r.retour = "Sélectionnez d'abord un fait."; dessiner(); return; }
      const i = r.choisie, f = r.phrases[i];
      r.places[i] = true; r.choisie = null;
      if (f.e.nom_courant === b.dataset.nom) { try { jouerSon("bonne"); } catch (err) {} r.retour = `${f.e.nom_courant} : ${minusculeDebut(f.texte)}`; }
      else { r.rates.push(i); try { jouerSon("mauvaise"); } catch (err) {} r.retour = `C'était ${nomAvecArticle(f.e)} : ${minusculeDebut(f.texte)}`; }
      if (Object.keys(r.places).length >= r.phrases.length && !r.rates.length) noterInsoliteTrouve(it.id);
      dessiner();
    });
    const s = document.getElementById("qi-suite"); if (s) { s.onclick = fermer(apres); s.focus(); }
  };
  dessiner();
  window.scrollTo(0, 0);
}

// ==================================================================
// Étape QI6 (09/11, choix d'Aubin : « Go » — cases de fiche, NON exigées)
//   Étape 2 · Leur vie : deux nouvelles caractéristiques, tirées dans la réserve de l'étape 2 comme les autres
//   (elles comptent comme une chose trouvée, mais le nombre de choses exigées ne change pas : 2 par espèce).
//   • « Qui s'occupe de ses petits ? » (QI_SOIN) — seulement quand la réponse surprend (soin_poser) et pas pour les araignées
//     (elles ont déjà « Soin des œufs »).
//   • « Comment passe-t-il l'hiver ? » (QI_HIVER) — pas pour les mammifères qui ont déjà « Hiberne-t-il ? », ni pour les
//     familles où l'on n'a pas de mauvaises réponses sûres (poissons, vers) ; posée en priorité d'octobre à mars.
//   Les mauvaises réponses viennent d'une liste par famille, choisie pour être nettement fausse (pas de demi-vérité).
//   Données : onglet « Colonnes » de Données\faits_questions.xlsx (provisoire, à verser dans les classeurs d'espèces).
// ==================================================================
const QI_SOIN = "qi_soin_petits", QI_HIVER = "qi_hivernage";
const SOIN_TEXTE = { "Aucun soin": "Personne", "La mère": "La mère", "Le père": "Le père", "Les deux parents": "Les deux parents",
                     "Un autre animal": "Un autre animal", "La colonie": "Les ouvrières de la colonie" };
const SOIN_EXPLICATION = {
  "Personne": "Une fois pondus, ses œufs se débrouillent seuls : aucun parent ne s'en occupe.",
  "La mère": "C'est la mère seule qui s'occupe des œufs ou des petits.",
  "Le père": "C'est le père qui s'occupe des œufs ou des petits : un cas assez rare chez les animaux.",
  "Les deux parents": "Les deux parents s'occupent des œufs ou des petits.",
  "Un autre animal": "Ses petits sont élevés par un autre animal, d'une autre espèce.",
  "Les ouvrières de la colonie": "Ce sont les ouvrières de la colonie qui nourrissent et soignent les larves." };
const SOIN_PIEGES = {   // par famille : des réponses nettement fausses pour cette famille
  Oiseaux: ["La mère", "Le père", "Les deux parents", "Un autre animal"],
  Mammiferes: ["La mère", "Le père", "Les deux parents"],
  Insectes: ["Personne", "Le père", "Les deux parents"],                 // (pas « La mère » : la reine du bourdon soigne sa 1re couvée)
  _autres: ["Personne", "La mère", "Le père", "Les deux parents"] };
const HIVER_TEXTE = { "Reste actif": "En restant en activité", "Se déplace s'il gèle": "En se déplaçant s'il gèle",
  "Part vers le sud": "En partant vers le sud", "Hiberne": "En hibernant", "S'engourdit à l'abri": "En s'engourdissant à l'abri",
  "Gagne des eaux plus profondes": "En gagnant des eaux plus profondes", "Passe l'hiver en œuf": "À l'état d'œuf",
  "Passe l'hiver en larve ou chenille": "À l'état de larve ou de chenille", "Passe l'hiver en chrysalide": "À l'état de chrysalide",
  "Seule la jeune reine passe l'hiver": "Seule la jeune reine passe l'hiver" };
// Les mauvaises réponses par famille (valeurs du classeur). Oiseaux sédentaires : pas « part vers le sud » ni « se déplace s'il gèle »
// (beaucoup le font en partie : demi-vérité) ; reptiles et amphibiens : pas « hiberne » (mot courant pour eux, demi-vérité).
function piegesHiver(e, valeurs) {
  const migrateur = valeurs.length === 1 && valeurs[0] === "Part vers le sud";
  const l = { Oiseaux: migrateur ? ["Reste actif", "Hiberne", "S'engourdit à l'abri"] : ["Hiberne", "S'engourdit à l'abri"],
              Mammiferes: ["Hiberne", "Part vers le sud", "S'engourdit à l'abri", "Reste actif"],
              Amphibiens: ["Part vers le sud", "Passe l'hiver en œuf"], Reptiles: ["Part vers le sud", "Passe l'hiver en œuf"],
              Insectes: ["Passe l'hiver en œuf", "Passe l'hiver en larve ou chenille", "Passe l'hiver en chrysalide", "Seule la jeune reine passe l'hiver",
                         ...(valeurs.includes("Reste actif") ? [] : ["S'engourdit à l'abri"])],
              Araignees_mille_pattes: ["Passe l'hiver en œuf", "S'engourdit à l'abri", "Passe l'hiver en chrysalide"],   // (pas « reste actif » : l'argyronète bouge un peu sous l'eau)
              Mollusques: ["Passe l'hiver en œuf", "Part vers le sud"] }[e.onglet];
  return l ? l.filter(v => !valeurs.includes(v)) : [];
}
function colonnesQI(e) { const d = donneesInsolites(); return d && d.colonnes ? d.colonnes[e.nom_courant] : null; }
function soinQI(e) {
  const c = colonnesQI(e);
  if (!INSOLITES_ACTIFS || !c || !c.soin_poser || !c.soin_des_petits || e.onglet === "Araignees_mille_pattes") return "NA";
  return SOIN_TEXTE[c.soin_des_petits] || "NA";
}
function hiverQI(e) {
  const c = colonnesQI(e);
  if (!INSOLITES_ACTIFS || !c || !c.hivernage || !c.hivernage.length) return "NA";
  if (e.onglet === "Mammiferes" && estRenseigne(e.hibernation) && e.hibernation !== "NA") return "NA";   // déjà « Hiberne-t-il ? »
  if (!piegesHiver(e, c.hivernage).length) return "NA";
  return HIVER_TEXTE[c.hivernage[0]] || "NA";
}
if (typeof QUESTIONS !== "undefined") {
  QUESTIONS.push(
    { champ: QI_SOIN, niveau: 2, libelle: "Qui s'occupe des petits", formats: ["qcm"],
      valeur: e => soinQI(e),
      question: "Qui s'occupe de ses œufs ou de ses petits ?",
      pieges: e => { const v = soinQI(e); return (SOIN_PIEGES[e.onglet] || SOIN_PIEGES._autres).filter(p => p !== v); },
      explication: (e, v) => SOIN_EXPLICATION[v] || `${v}.` },
    { champ: QI_HIVER, niveau: 2, libelle: "Passer l'hiver", formats: ["qcm"],
      valeur: e => hiverQI(e),
      question: "Comment passe-t-il l'hiver ?",
      pieges: e => { const c = colonnesQI(e); return c ? piegesHiver(e, c.hivernage).map(v => HIVER_TEXTE[v]).filter(Boolean) : []; },
      explication: (e, v) => `L'hiver : ${minusculeDebut(v)}.` });
  if (typeof CHAMPS_MODE_DE_VIE !== "undefined") CHAMPS_MODE_DE_VIE.push(QI_HIVER);
  if (typeof CHAMPS_REPRODUCTION !== "undefined") CHAMPS_REPRODUCTION.push(QI_SOIN);
}
// « En priorité d'octobre à mars » : appelé par choisirQuestionExpedition (17) au moment de choisir la question d'une espèce
function preferenceSaison(choix) {
  const mois = new Date().getMonth() + 1;
  if (!(mois >= 10 || mois <= 3)) return choix;
  const h = choix.filter(c => c.champ === QI_HIVER);
  return h.length ? h : choix;
}
