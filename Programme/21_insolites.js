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

// Les questions insolites d'une espèce pour une étape (k = 4 : Approfondir)
function insolitesDe(espece, k) {
  const d = donneesInsolites();
  if (!d || !espece) return [];
  const nom = espece.nom_courant, liste = [];
  if (k === 4) {
    for (const f of d.faits) if (f.espece === nom && f.etape === "3") liste.push({ type: f.format, item: f });
    for (const i of d.intrus) if (i.espece === nom) liste.push({ type: "intrus", item: i });
  }
  return liste;
}

// Appelé par choisirQuestionExpedition (17) : une question insolite à la place d'une question ordinaire, ou null
function choisirInsolite(k) {
  if (!INSOLITES_ACTIFS || !defi || !defi.expedition || k !== 4) return null;
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
  const c = defi && defi.insoliteEnCours;
  const zone = document.getElementById("reponses");
  if (!c || c.espece !== espece) { enTete(espece, true, true); document.getElementById("question").textContent = ""; return; }
  const it = c.item;
  // l'étiquette sous le nom dit ce qu'est la question (et non « À découvrir », qui parle des cases de la fiche)
  document.getElementById("revision").textContent = c.type === "intrus" ? "L'intrus" : c.type === "vrai_faux" ? "Fait insolite" : "";
  if (c.type === "lequel") {
    enTete(espece, false, false, "Fait insolite");
    document.getElementById("question").textContent = it.question;
    for (const nom of melanger([espece.nom_courant, ...it.pieges.slice(0, 3)])) ajouterBouton(nom, nom === espece.nom_courant);
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
  } else if (c.type === "intrus") {
    enTete(espece, true, true);
    document.getElementById("question").textContent = "Une de ces phrases est fausse. Laquelle ?";
    zone.classList.add("reponses-phrases");
    for (const t of melanger([...it.vraies, it.fausse])) ajouterBouton(t, t === it.fausse);
    enCours = { espece, champ: INSOLITE, insolite: c, q: null, bonne: null,
                explication: `L'intrus : « ${it.fausse} »${it.explication ? " " + it.explication : ""}` };
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
  document.getElementById("photo-rencontre").classList.remove("cache");
  if (!document.getElementById("photo-rencontre").innerHTML) document.getElementById("photo-rencontre").innerHTML = celluleImage(espece);
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
          ...d.intrus.map(i => ({ espece: espece(i.espece), type: "intrus", item: i }))].filter(c => c.espece);
}
function htmlEssaiInsolites() {
  if (!ESSAI_INSOLITES_VISIBLE || !donneesInsolites()) return "";
  const n = questionsEssaiInsolites().length;
  return `<div class="apropos-action" data-cle="essai-insolites"><p><b>En test · Questions insolites.</b> ${ESSAI_INSOLITES_QUESTIONS} questions tirées parmi les ${n} en préparation (« Lequel de ces animaux », « Vrai ou faux », « L'intrus »). Rien n'est enregistré : votre partie ne change pas.</p>
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
