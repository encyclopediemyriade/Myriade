// 03_questions_reponses.js — Choisir, afficher une question, et traiter la réponse (souris et clavier).
// Une partie du programme du jeu, chargée par jeu.html dans l'ordre des numéros.

// ==================================================================
// 5. CHOISIR LA PROCHAINE QUESTION  → renvoie { espece, champ, estRevision }
//    a) d'abord : une question ratée dont le délai est écoulé
//    b) sinon : une espèce au hasard
//         - pas encore reconnue  → on doit la reconnaître sur photo
//         - déjà reconnue        → une caractéristique, en priorité
//                                  celles qu'on ne sait pas encore
// ==================================================================
let derniereEspece = null;      // pour ne pas tomber deux fois de suite sur la même espèce…
let dernierChamp = null;        // …ni sur la même caractéristique…
let dernierFormat = null;       // …ni sur le même format de question
// Le rythme des révisions (étape 65) : une question ratée revient entre 5 et 7 questions
// plus tard. Pour ralentir ou accélérer, il suffit de changer ces deux chiffres.
const REVISION_AU_PLUS_TOT = 5;
const REVISION_AU_PLUS_TARD = 7;

function choisirQuestion() {
  if (session && session.focus) return choisirQuestionFocus();     // Rencontre à une espèce (étape 74)
  // Chaque nouvelle question fait avancer le "compte à rebours" des révisions
  for (const r of aRevoir) r.dans = r.dans - 1;

  // Les espèces "en jeu" : seulement celles des territoires ET des familles cochés pour cette session
  let enJeu = ESPECES.filter(e => !session ||
    (estDans(e, session.territoires) && session.classes.includes(e.onglet)));

  // a) Une révision est-elle prête ? (seulement si son espèce est en jeu ;
  //    sinon elle attend sagement une prochaine session)
  //    Étape 65 : jamais deux révisions à la suite. "questionEstRevision" dit encore si la
  //    question PRÉCÉDENTE en était une ; si oui, la révision prête attend un tour de plus.
  const prete = aRevoir.find(r => r.dans <= 0 && enJeu.some(e => e.nom_courant === r.nom));
  if (prete && !questionEstRevision) {
    aRevoir = aRevoir.filter(r => r !== prete);          // on la retire de la file
    const espece = enJeu.find(e => e.nom_courant === prete.nom);
    return { espece, champ: prete.champ, estRevision: true };
  }

  // b) Une fois sur deux, on approfondit une espèce déjà reconnue dont la
  //    fiche n'est pas finie ; l'autre fois, on part à la découverte d'une
  //    espèce pas encore reconnue. S'il n'y en a plus : toutes les espèces en jeu.
  const aApprofondir = enJeu.filter(e =>
    estIdentifiee(e) && progression[e.nom_courant] && statut(e) !== "maîtrisée");
  const aDecouvrir = enJeu.filter(e => !estIdentifiee(e));
  let groupe = enJeu;
  if (aApprofondir.length && Math.random() < 0.5) groupe = aApprofondir;
  else if (aDecouvrir.length)                     groupe = aDecouvrir;
  else if (aApprofondir.length)                   groupe = aApprofondir;
  let candidates = groupe.filter(e => e !== derniereEspece);
  if (candidates.length === 0) candidates = enJeu.filter(e => e !== derniereEspece);
  if (candidates.length === 0) candidates = enJeu;
  const espece = auHasard(candidates);

  // Pas encore reconnue : la première question est TOUJOURS la photo
  if (!estIdentifiee(espece)) return { espece, champ: IDENTIFICATION, estRevision: false };

  return { espece, champ: choisirChamp(espece), estRevision: false };
}

// Quelle caractéristique demander sur une espèce déjà reconnue ?
// Jamais trouvé → trouvé 1 fois → le reste.
// On ne pioche que dans les niveaux ouverts pour cette espèce (étape 25).
function choisirChamp(espece) {
  const champs  = champsAInterroger(espece);
  const jamais  = champs.filter(c => nbBonnes(espece, c) === 0);
  const uneFois = champs.filter(c => aConsolider(espece, c));        // étape 101 : pas encore confirmée
  let possibles = jamais.length ? jamais : uneFois.length ? uneFois : champs;
  // On évite de reposer la même caractéristique que la question précédente
  const sansRepetition = possibles.filter(c => c !== dernierChamp);
  if (sansRepetition.length) possibles = sansRepetition;
  return auHasard(possibles);
}


// ==================================================================
// 6. AFFICHER UNE RENCONTRE
//    Selon la question choisie, on utilise l'un des 5 FORMATS :
//      6a. identification → reconnaître l'espèce sur sa photo
//      6b. qcm            → 4 réponses écrites
//      6c. vrai / faux    → une affirmation à juger
//      6d. photos         → choisir la bonne espèce parmi 4 photos
//      6e. estimation     → 4 nombres (caractéristique chiffrée)
//      6h. picto          → 4 dessins ou pastilles de couleur, photo cachée (portrait physique, étape 64)
//    Chaque format prépare le haut de la carte puis fabrique ses boutons.
// ==================================================================
// Étape 289 (25/10, demande de l'utilisateur) : les XP ne s'affichent plus nulle part (une seule monnaie : les empreintes).
// Étape R142 : leur affichage est retiré ; le compteur « xp » reste (sauvegarde, et signal « le carnet a bougé » de possibiliteJeu).
let enCours = null;      // la question affichée : { espece, champ, explication, q, bonne }
let questionEstRevision = false;   // vrai si la question affichée est une « Déjà croisée… » (étape 41)

function nouvelleRencontre() {
  arreterCri();                                          // on coupe le cri de la question précédente
  document.getElementById("carte-pop").classList.remove("visible");   // la carte de la question précédente s'efface (étape 40)
  // En défi, on pioche seulement dans ce que le joueur a déjà trouvé (partie 11 bis)
  const tirage = defi ? choisirQuestionDefi() : choisirQuestion();
  // Étape 51 : avant le premier cri d'une Rencontre, on demande si le son est disponible.
  // La question tirée attend ; elle sera posée (ou remplacée) selon la réponse.
  // Étape 140 : pareil au premier cri d'une partie du Carnet de terrain
  // Étape 164 : dans la Rencontre, les reprises et la question bonus sont annoncées (sinon elles arrivent de nulle part)
  if (session && session.focus && !defi) {
    if (tirage.bonus && !session.bonusAnnonce) { session.bonusAnnonce = true; annoncerBonus(tirage); return; }
    if (tirage.rejeu && !tirage.bonus && !session.reprisesAnnoncees) { session.reprisesAnnoncees = true; annoncerReprises(tirage); return; }
  }
  lancerTirage(tirage);
}
function lancerTirage(tirage) {
  if (tirage.champ === "cri_son" && !sonDemande && (!defi || defi.jeu === "revision")) { demanderSon(tirage); return; }
  poserQuestion(tirage);
}

// ---- Étape 164 : les deux petites annonces de fin de Rencontre ----
// Une carte de transition, comme la question du son : un titre, une phrase, un bouton (Entrée au clavier).
function carteAnnonce(espece, titre, phrase, contenu, texteBouton, tirage, floue) {
  enCours = { espece, champ: "annonce" };
  derniereEspece = espece;
  enTete(espece, true, true);
  if (floue) document.getElementById("photo-rencontre").classList.add("floutee");
  document.getElementById("nom").textContent = titre;
  document.getElementById("nom").classList.remove("revele"); void document.getElementById("nom").offsetWidth;
  document.getElementById("nom").classList.add("revele");
  document.getElementById("compteur-rencontre").textContent = "";
  document.getElementById("revision").textContent = "";
  document.getElementById("question").textContent = phrase;
  document.getElementById("affirmation").classList.add("cache");
  document.getElementById("retour").textContent = "";
  document.getElementById("suivant").classList.add("cache");
  document.getElementById("je-ne-sais-pas").classList.add("cache");
  const zone = document.getElementById("reponses");
  zone.className = "annonce-etape";
  zone.innerHTML = contenu;
  const bouton = document.createElement("button");
  bouton.className = "suivant bouton-annonce";
  bouton.textContent = texteBouton;
  bouton.onclick = () => lancerTirage(tirage);
  zone.appendChild(bouton);
  for (const l of (session.postit || [])) if (l.etat === "encours") l.etat = "";
  if (session.postit) dessinerPostit();
}
function annoncerReprises(tirage) {
  const espece = session.focus;
  const n = session.rejouer.length + 1;                     // (la première reprise est déjà tirée)
  const lignes = [tirage.champ, ...session.rejouer.map(r => r.champ)].map(c => {
    const q = QUESTIONS.find(x => x.champ === c);
    return `<span class="etiquette-reprise">${c === IDENTIFICATION ? "Son nom" : q ? q.libelle : c}</span>`;
  }).join("");
  carteAnnonce(espece, "À revoir",
    `Avant de quitter ${(estIdentifiee(espece) || session.presentee) ? nomAvecArticle(espece) : "cette espèce"}, reprenons ${n > 1 ? `les ${n} questions qui vous ont échappé` : "la question qui vous a échappé"} :`,
    `<div class="liste-reprises">${lignes}</div>`, n > 1 ? "Reprendre →" : "La reprendre →", tirage, false);
}
function annoncerBonus(tirage) {
  const espece = session.focus;
  if (typeof INSOLITE !== "undefined" && tirage.champ === INSOLITE) {   // étape QI4 : le bonus est un fait insolite
    carteAnnonce(espece, "Question bonus", `Pour finir, un fait étonnant sur ${nomAvecArticle(espece)} : vrai ou faux ?`, "", "Tenter le bonus →", tirage, false);
    return;
  }
  carteAnnonce(espece, "Question bonus",
    "Au début, vous avez observé ses traits. Sans la photo, vous en souvenez-vous ?",
    "", "Tenter le bonus →", tirage, true);
}

// Étape 156 : le compteur. Dans la Rencontre, les questions prévues d'un côté (« Question 3 / 8 »),
// les questions ratées reprises à la fin de l'autre (« À revoir · 1 / 2 »).
function texteCompteur(champ) {
  if (!session) return "";
  if (session.focus && session.enBonus) return "Bonus";
  if (session.focus && session.enRejeu) return `À revoir · ${session.faites - session.normalesFaites + 1} / ${session.dejaRejouees.length}`;
  if (session.focus) {
    // Le total annoncé : les questions prévues, ou moins s'il ne reste plus assez de choses à demander
    // (la question en cours + ce qui reste + la photo de la fin si l'espèce a été présentée)
    const photoAVenir = !estIdentifiee(session.focus) && session.presentee && champ !== IDENTIFICATION ? 1 : 0;
    const possible = session.normalesFaites + 1 + champsFocusRestants().length + photoAVenir;
    // la photo de fin (espèce présentée) est toujours la dernière question prévue
    const photoDeFin = session.presentee && champ === IDENTIFICATION;
    const annonce = photoDeFin ? session.normalesFaites + 1 : Math.max(session.normalesFaites + 1, Math.min(session.prevues, possible));
    return `Question ${session.normalesFaites + 1} / ${annonce}`;
  }
  return `Question ${session.faites + 1} / ${session.total}`;
}

// Affiche la question tirée au sort (c'était la suite de nouvelleRencontre jusqu'à l'étape 50)
function poserQuestion({ espece, champ, estRevision, rejeu, bonus }) {
  majBoutonPrecedente();                                   // étape 248 : visible dès qu'une question de la partie a été répondue
  document.getElementById("je-ne-sais-pas").classList.add("cache");
  // Étape R155 : le bouton reprend son texte habituel (il dit « Je ne la connais pas encore » sur la 1re photo d'une espèce)
  { const jn = document.getElementById("je-ne-sais-pas"); jn.textContent = "Je ne sais pas"; jn.classList.remove("presenter"); delete jn.dataset.ouverture; }   // R157 : sans le style « Me la présenter »
  if (session) session.enRejeu = !!rejeu;                // étape 156 : une question ratée reprise à la fin
  if (session) session.enBonus = !!bonus;                // étape 161 : la question bonus
  if (champ === OUVERTURE) { poserOuverture(espece); return; }   // « Connaissez-vous cette espèce ? » (étape 76)
  questionEstRevision = estRevision;
  if (defi) defi.debutQuestion = Date.now();              // pour mesurer la rapidité de la réponse
  if (defi) { defi.numero = defi.faites + 1; afficherHud(); }   // le compteur "Question 3 / 10" avance (étape 80)
  derniereEspece = espece;
  const q = QUESTIONS.find(q => q.champ === champ);      // vide pour l'identification
  // Étape R146 : au 2e rattrapage de l'étape 1, la question n'a que 2 réponses (la bonne et un piège)
  const deuxChoix = typeof questionAidee === "function" && questionAidee(espece);

  // Remise à zéro de la carte
  document.getElementById("compteur-rencontre").textContent = texteCompteur(champ);   // étape 156
  document.getElementById("revision").textContent = bonus ? "Question bonus : de mémoire !" : estRevision ? "Déjà croisée…" : "";
  // Étape 196 : dans « Jouer », une petite étiquette dit pourquoi la question arrive, et la pastille prend sa couleur
  if (defi && defi.jouer) {
    const e = etiquetteJouer(espece, champ, estRevision);
    // Étape M19 : sur téléphone, plus de « À découvrir » sous le nom aux étapes 2 et 3 (prêtait à confusion ; la pastille garde sa couleur)
    const sansEtiquette = e.type === "trait" && defi.expedition && defi.expedition.etape !== 1 && typeof surTelephone === "function" && surTelephone();
    document.getElementById("revision").textContent = sansEtiquette ? "" : e.texte;
    noterPastille(e.type);
  }
  document.getElementById("retour").textContent = "";
  document.getElementById("affirmation").classList.add("cache");
  document.getElementById("suivant").classList.add("cache");
  const zone = document.getElementById("reponses");
  zone.innerHTML = "";
  zone.className = "";
  if (champ === SOSIE) { poserSosie(espece); return; }   // étapes 243 et 245 : l'encart « À ne pas confondre » (pas une question)
  if (typeof INSOLITE !== "undefined" && champ === INSOLITE) { poserInsolite(espece); return; }   // étape QI3 : une question insolite (21)

  // Quel format ?
  let format;
  // La bonne réponse : la valeur de la case, ou UNE valeur tirée au hasard si la case est une liste
  const bonne = !q ? null : q.tirer ? q.tirer(espece) : valeurDe(espece, q);
  if (champ === IDENTIFICATION)      format = "identification";
  else if (q.format === "picto" && casesPossibles(espece, q).bonnes.length >= 2) {   // étape R119 : l'aspect, en pictos ou en cases
    const f = deuxChoix ? ["picto"] : ["picto", "cases"].filter(x => x !== dernierFormat);   // R146 : pas de cases à cocher quand on aide
    format = auHasard(f.length ? f : ["picto", "cases"]);
  }
  else if (q.format)                 format = q.format;         // format imposé (empreintes)
  else if (q.type === "nombre")      format = (typeof formatComparaison === "function" && formatComparaison(espece, q)) || "estimation";   // étape R174 : ou une comparaison
  else {
    let formats = ["qcm"];
    if (autresValeurs(q, bonne, espece).length >= 1)   formats.push("vraifaux");
    // "Lequel… ?" parmi 4 photos : pas dans la Rencontre à une espèce, où la réponse serait toujours
    // l'espèce dont le nom est affiché en haut (étape 75)
    // Étape 149 : il faut au moins 3 autres espèces déjà identifiées pour poser la question en photos
    if (piegesPhotos(espece, q, bonne).length >= 3 && !(session && session.focus)) formats.push("photos");
    // Certaines caractéristiques n'autorisent que certains formats (voir "formats", partie 1)
    if (q.formats) formats = formats.filter(f => q.formats.includes(f));
    // On évite de reprendre le format de la question précédente
    // Étape R103 (Revoir 10, choix de l'utilisateur) : « Plusieurs réponses à cocher » pour l'alimentation et les prédateurs
    if (casesPossibles(espece, q).bonnes.length >= 2) formats.push("cases");
    // Étape R102 (choix A4) : aux étapes 2 et 3 d'une expédition, « Laquelle des deux ? » entre deux de ses espèces
    if (defi && defi.expedition && defi.expedition.etape !== 1 && !defi.expedition.revue && typeof piegesDuo === "function"
        && piegesDuo(espece, q, bonne).length) formats.push("duo");
    if (deuxChoix && formats.some(f => f !== "cases")) formats = formats.filter(f => f !== "cases");   // étape R146
    const autresFormats = formats.filter(f => f !== dernierFormat);
    if (autresFormats.length) formats = autresFormats;
    format = auHasard(formats);
  }
  dernierChamp = champ;
  dernierFormat = format;

  // q et bonne servent au bilan de fin de Rencontre (étape 37)
  enCours = { espece, champ, explication: q ? q.explication(espece, bonne) : "", q, bonne };
  postitQuestion(champ);                                 // étape 151 : la ligne du post-it s'allume

  if (format === "identification") poserIdentification(espece);
  if (format === "qcm")            poserQcm(espece, q, bonne);
  if (format === "vraifaux")       poserVraiFaux(espece, q, bonne);
  if (format === "photos")         poserPhotos(espece, q, bonne);
  if (format === "estimation")     poserEstimation(espece, q);
  if (format === "empreinte-nom")   poserEmpreinteNom(espece, bonne);
  if (format === "empreinte-choix") poserEmpreinteChoix(espece, bonne);
  if (format === "son-nom")         poserSonNom(espece, bonne);
  if (format === "picto")           poserPicto(espece, q, bonne);
  if (format === "duo")             poserDuo(espece, q, bonne);          // étape R102
  if (format === "compare")         poserComparaison(espece, q);         // étape R174
  if (format === "cases")           poserCases(espece, q);               // étape R103
  if (deuxChoix) garderDeuxChoix();                                      // étape R146
  accorderTextes(espece, format);                                        // étape R148 : il / elle selon l'espèce
  if (typeof avantQuestionExpedition === "function") avantQuestionExpedition(espece);   // étape R102 : la bande de l'étape
  if (bonus) proposerSilhouette(null);                   // étape 161 : de mémoire, sans l'aide de la silhouette
  // Étape 162 : pendant la question bonus, la photo reste à sa place mais floutée (comme pour les cris) :
  // la mise en page ne bouge pas, et on ne peut pas lire la réponse dessus. Elle redevient nette après la réponse.
  if (bonus) { const ph = document.getElementById("photo-rencontre"); ph.classList.remove("cache"); ph.classList.add("floutee"); }
  // La photo à reconnaître après la présentation (étape 76) : une autre façon de poser la question
  if (champ === IDENTIFICATION && session && session.focus && session.presentee) {
    document.getElementById("nom").textContent = "La reconnaîtriez-vous maintenant ?";
  }
  // "Je ne sais pas" : dans la Rencontre (pas dans les jeux chronométrés ni pour la photo, où il y a "Pas encore")
  // Étape R158 (08/11, décision d'Aubin : « ça n'apporte rien ») : plus de « Je ne sais pas ».
  // Le bouton ne sert plus qu'à « Me la présenter » sur la 1re photo d'une espèce nouvelle (R155, R157).
  if (JE_NE_SAIS_PAS && ((!defi && session) || (defi && defi.jeu === "revision")) && champ !== IDENTIFICATION) {
    document.getElementById("je-ne-sais-pas").classList.remove("cache");
  }
}

// Étape R148 : la question, l'affirmation (vrai ou faux) et l'explication suivent le genre du nom de l'espèce.
// La question, pas pour « Lequel… ? » en photos ni « Laquelle des deux ? » : la phrase y parle de plusieurs espèces.
function accorderTextes(espece, format) {
  if (typeof accordGenre !== "function") return;
  if (enCours && enCours.explication) enCours.explication = accordGenre(enCours.explication, espece);
  if (format === "photos" || format === "duo" || format === "compare") return;   // R174 : la comparaison parle de deux espèces
  const question = document.getElementById("question"), affirmation = document.getElementById("affirmation");
  if (question.children.length) question.innerHTML = accordGenre(question.innerHTML, espece);
  else question.textContent = accordGenre(question.textContent, espece);
  if (!affirmation.classList.contains("cache")) affirmation.textContent = accordGenre(affirmation.textContent, espece);
}

// Étape R146 (07/11/2026, choix d'Aubin) : ne garde que la bonne réponse et un piège tiré au hasard
function garderDeuxChoix() {
  const zone = document.getElementById("reponses");
  const boutons = [...zone.querySelectorAll("button.reponse")];
  const juste = boutons.find(b => b.dataset.juste === "oui");
  if (!juste || boutons.length <= 2) return;
  const autre = auHasard(boutons.filter(b => b !== juste));
  boutons.forEach(b => { if (b !== juste && b !== autre) b.remove(); });
  zone.classList.add("deux-choix");
}

// Le haut de la carte : photo + étiquette + nom (ou masqués, selon le format)
function enTete(espece, montrerPhoto, montrerNom, titre) {
  const photo = document.getElementById("photo-rencontre");
  photo.classList.toggle("cache", !montrerPhoto);
  photo.classList.toggle("grande", !montrerNom);        // photo plus haute quand il faut reconnaître
  photo.classList.remove("cadre-empreinte");            // (remis seulement par la question sur l'empreinte)
  photo.classList.remove("cadre-son", "devoile", "floutee");   // (remis seulement par la question sur le cri, ou le bonus : étape 162)
  photo.innerHTML = celluleImage(espece);
  const famille = document.getElementById("famille");
  famille.textContent = espece.nom_affichage_groupe;
  // L'étiquette de groupe ("Insectes des forêts") reste cachée pendant TOUTE question :
  // elle soufflait parfois la réponse (étape 26). Elle apparaît après la réponse.
  famille.classList.add("cache");
  document.getElementById("nom").textContent = montrerNom ? espece.nom_courant : titre;
  document.getElementById("nom").classList.remove("revele");   // étape 160 : l'effet de la présentation ne reste pas
  proposerSilhouette(null);                         // étape 111 : pas d'aide par défaut
}

// L'apparition d'un animal sauvage (étape 89) : seulement à la PREMIÈRE question d'une Rencontre.
// On ajoute une classe (« apparition-sauvage ») à la photo et à la carte : le CSS fait l'effet.
// Puis on la retire une fois l'effet fini, pour que les questions suivantes s'affichent normalement.
function apparitionSauvage() {
  if (!session || !session.focus || session.apparitionFaite) return;
  session.apparitionFaite = true;
  // Étape R165 (08/11, choix d'Aubin : piste B) : l'effet seulement pour une espèce encore jamais rencontrée ;
  // une espèce déjà connue s'affiche tout de suite (pas d'attente quand on révise).
  if (typeof estReconnue === "function" && estReconnue(session.focus)) return;
  const photo = document.getElementById("photo-rencontre");
  const carte = document.getElementById("carte-rencontre");
  if (!photo.querySelector("img")) return;                 // pas de photo : pas d'effet
  // (étape 90 : la phrase « Un animal sauvage apparaît ! » est retirée ; seul le fondu reste.
  //  Le style .annonce-apparition reste dans le CSS, au cas où on la remettrait.)
  // Relancer l'animation même si la classe était déjà là (offsetWidth force le navigateur à « repartir de zéro »)
  photo.classList.remove("apparition-sauvage"); carte.classList.remove("apparition-sauvage");
  void photo.offsetWidth;
  photo.classList.add("apparition-sauvage"); carte.classList.add("apparition-sauvage");
  setTimeout(() => {
    photo.classList.remove("apparition-sauvage"); carte.classList.remove("apparition-sauvage");
    const annonce = photo.querySelector(".annonce-apparition");
    if (annonce) annonce.remove();
  }, 1400);   // étape R165 : l'effet dure 1,2 s (2,7 s avant)
}

// Fabrique un bouton de réponse (texte) et le pose dans la zone
function ajouterBouton(texte, estJuste) {
  const bouton = document.createElement("button");
  bouton.className = "reponse";
  bouton.textContent = texte;
  if (estJuste) bouton.dataset.juste = "oui";            // on "marque" la bonne réponse
  bouton.onclick = () => repondre(bouton, estJuste);
  document.getElementById("reponses").appendChild(bouton);
}

// ---- 6a. Reconnaître l'espèce sur sa photo ----------------------
// Étape R145 : le grand milieu d'une espèce (pour garder les pièges de nom dans son monde)
const GRANDS_MILIEUX = { "Mer et océan": "mer", "Estuaires et lagunes": "mer", "Dunes et plages": "mer",
  "Rivières et torrents": "douce", "Mares et étangs": "douce", "Lacs": "douce", "Marais": "douce" };
function grandMilieu(e) { return GRANDS_MILIEUX[e.milieu_principal] || "terre"; }
function poserIdentification(espece) {
  enTete(espece, true, false, "Quelle est cette espèce ?");
  apparitionSauvage();                                          // 1re question d'une Rencontre : l'effet (étape 89)
  document.getElementById("question").textContent = "";       // le titre pose déjà la question : pas de seconde phrase
  // 3 pièges de la même classe (oiseau avec oiseaux, reptile avec reptiles…)
  const memeClasse = ESPECES.filter(e => e !== espece && e.onglet === espece.onglet);
  // Étape 70 : ses sosies d'abord (martre → fouine), puis d'autres espèces de la même classe pour compléter
  const sosies = melanger(sosiesDe(espece));
  // Étape R145 (retour du 07/11 : « limace léopard » pour l'huître creuse) : les autres pièges restent dans son monde —
  // d'abord les espèces du même milieu, puis du même grand milieu (mer, eau douce, terre), et du même territoire.
  const terr = e => String(e.territoire || "").split(" ; ");
  const lesTerr = terr(espece);
  const proximite = e => (e.milieu_principal === espece.milieu_principal ? 4 : grandMilieu(e) === grandMilieu(espece) ? 2 : 0)
                       + (terr(e).some(t => lesTerr.includes(t)) ? 1 : 0);
  const autres = melanger(memeClasse.filter(e => !sosies.includes(e))).sort((a, b) => proximite(b) - proximite(a));
  const pieges = [...sosies, ...autres].slice(0, 3);
  for (const e of melanger([espece, ...pieges])) ajouterBouton(e.nom_courant, e === espece);
  // Après la réponse : le nom, puis comment ne pas la confondre (pas en défi de rapidité, où tout va vite)
  enCours.explication = `C'est : ${espece.nom_courant} (${espece.nom_affichage_groupe.toLowerCase()}).` + (defi ? "" : phraseConfusion(espece));
}

// ---- 6b. QCM : 4 réponses écrites --------------------------------
function poserQcm(espece, q, bonne) {
  // Question du portrait posée en réponses écrites (Duo · Carré · Cash, étape 70) : la photo reste
  // cachée si elle donnerait la réponse, comme dans le format à pictogrammes.
  enTete(espece, !(q.format === "picto" && !q.avecPhoto), true);
  if (q.format === "picto" && !q.avecPhoto && silhouetteUtile(q, espece)) proposerSilhouette(espece);   // étapes 111 et 241 : seulement si elle aide
  document.getElementById("question").textContent = typeof q.question === "function" ? q.question(espece) : q.question;
  let autres = q.piegesQcm ? melanger(q.piegesQcm(espece)) : autresValeurs(q, bonne, espece);   // étape R166 : pièges propres au QCM
  const pieges = autres.slice(0, 3);
  // Étape 246 : « Où vit-il le plus souvent ? » en photos de paysages (une photo par réponse, tirée parmi celles
  // du milieu pour le territoire de l'espèce ; le nom du milieu reste écrit dessous). Si une réponse n'a pas de
  // photo (« Eaux souterraines », seulement comme piège pour les poissons), on garde les pictogrammes.
  // Étape 249 (22/10) : retiré à la demande de l'utilisateur (« les pictos c'est bien ») — on garde le code, désactivé.
  if (q.champ === "milieu_principal" && PAYSAGES_DANS_LA_QUESTION) {
    const reponses = melanger([bonne, ...pieges]);
    const photos = reponses.map(v => paysageAuHasard(v, espece));
    if (photos.every(Boolean)) {
      document.getElementById("reponses").className = "grille-photos paysages";
      reponses.forEach((v, i) => ajouterBoutonPaysage(v, photos[i], v === bonne));
      return;
    }
  }
  // Étape 66 : réponses illustrées pour les questions marquées "pictos" (voir partie 1).
  if (q.pictos) {
    document.getElementById("reponses").className = "grille-photos";      // 2 réponses par ligne
    for (const v of melanger([bonne, ...pieges])) ajouterBoutonPicto(q.champ, v, v === bonne);
    return;
  }
  for (const v of melanger([bonne, ...pieges])) ajouterBouton(majuscule(v), v === bonne);
}

// Fabrique un bouton de réponse illustré : le dessin (ou la pastille), et le mot dessous.
// Sert aux questions du portrait physique (6h) et aux questions marquées "pictos" (étape 66).
function ajouterBoutonPicto(colonne, valeur, estJuste) {
  const bouton = document.createElement("button");
  bouton.className = "reponse choix-photo choix-picto";
  bouton.innerHTML = `<div class="picto">${dessinReponse(colonne, valeur)}</div>
                      <div class="legende">${majuscule(valeur)}</div>`;
  if (estJuste) bouton.dataset.juste = "oui";
  bouton.onclick = () => repondre(bouton, estJuste);
  document.getElementById("reponses").appendChild(bouton);
}

// Étape 246 : un bouton de réponse en photo de paysage, le nom du milieu dessous
function ajouterBoutonPaysage(milieu, paysage, estJuste) {
  const bouton = document.createElement("button");
  bouton.className = "reponse choix-photo choix-paysage";
  bouton.innerHTML = `<div class="photo"><img src="${miniPaysage(paysage)}" alt="" onerror="this.src='${paysage.fichier}'"></div>
                      <div class="legende">${majuscule(milieu)}</div>`;
  if (estJuste) bouton.dataset.juste = "oui";
  bouton.onclick = () => repondre(bouton, estJuste);
  document.getElementById("reponses").appendChild(bouton);
}

// ---- 6c bis. Étape R103 : « Plusieurs réponses à cocher » ----------------
// Pour l'alimentation et les prédateurs (des listes dans les fiches). 2 ou 3 bonnes réponses, tirées parmi les éléments
// de sa liste (les plus précis d'abord), et des pièges choisis comme pour le QCM (jamais à moitié vrais).
// Choix de l'utilisateur (03/11) : la consigne dit seulement qu'il y a plusieurs réponses à cocher, pas combien.
// Résultat : toutes les bonnes sans erreur = juste ; au moins une bonne et aucune erreur = « presque » ; sinon : pas encore.
// Étape R130 (05/11, choix de l'utilisateur) : les médailles quittent l'expédition pour l'instant (elles restent comptées en coulisses)
function enExpedition() { return !!((typeof defi !== "undefined" && defi && defi.expedition) || (typeof session !== "undefined" && session && session.expedition)); }
const CASES_CHAMPS = ["proies", "predateurs", "milieu_principal", "robe", "couleur_dominante"];   // étape R105 : + les milieux ; R119 : + l'aspect (oiseaux) ; R135 : + les couleurs du plumage
const CASES_TOTAL = 5;                     // réponses proposées
const MOTIFS_CASES = ["Bicolore", "Taches", "Points", "Rayures", "Barres", "Marbrures", "Masque", "Bavette", "Plastron"];   // étape R119

// ---- Étape R105 (03/11) : les milieux en « Plusieurs réponses à cocher » ----
// Bonnes réponses : le milieu principal (toujours) + 1 ou 2 milieux secondaires (sourcés dans les fiches).
// Pièges : plus sévères que pour le QCM, car le joueur les regarde tous un par un. On part des pièges du QCM
// (ni les siens, ni leurs voisins, ni l'alpage s'il monte assez haut, ni l'eau pour un animal terrestre…), puis on retire :
//  - tout milieu dont un mot apparaît dans le texte « habitat » de la fiche (le lézard des souches : « dunes ») ;
//  - les falaises et rochers (vieux murs, éboulis, carrières : trop d'espèces y passent sans que la fiche le dise) ;
//  - la garrigue pour une espèce de Méditerranée ou de Corse ;
//  - l'alpage pour une espèce de montagne dont l'altitude n'est pas connue.
// Les défenses et la chasse ne sont pas passées à ce format : pièges trop souvent à moitié vrais (bilan R105).
const MOTS_MILIEU = {
  "Falaises et rochers": /falaise|roche|rocher|paroi|éboulis|pierr|escarp|gorge|carrière|ruine|mur/i,
  "Alpages et pelouses d'altitude": /alpage|pelouse|altitude|montagn|estive/i,
  "Forêt": /forêt|bois|futaie|sous-bois|arbre|taillis|lisière|ripisylve/i,
  "Campagne, haies et jardins": /campagne|haie|jardin|bocage|verger|parc|prairie|champ|culture|village|ville|friche|\bprés?\b/i,
  "Landes et coteaux secs": /lande|coteau|tourbière|friche|talus|bruyère|\bsec/i,
  "Garrigue et maquis": /garrigue|maquis|broussaille/i,
  "Marais": /marais|roseli|zones? humides?|marécage|tourbière|humide/i,
  "Mares et étangs": /\bmares?\b|étang|stagnant|plans? d'eau|bassin/i,
  "Lacs": /\blacs?\b|retenue|plans? d'eau/i,
  "Rivières et torrents": /rivière|torrent|ruisseau|fleuve|cours d'eau|berge/i,
  "Estuaires et lagunes": /estuaire|lagune|vasière|baie|delta|saumâtre|salin|littoral/i,
  "Mer et océan": /\bmers?\b|océan|côte|côtier|littoral|large|marin/i,
  "Dunes et plages": /dune|plage|sable|littoral|côte/i,
  "Eaux souterraines": /souterrain|grotte|source|puits/i,
};
const TERRITOIRES_MONTAGNE = ["Alpes", "Pyrénées", "Massif central", "Jura", "Vosges", "Corse"];
function milieuxSiens(e) {
  const sec = estRenseigne(e.milieux_secondaires) && !String(e.milieux_secondaires).startsWith("NA")
    ? String(e.milieux_secondaires).split(" ; ") : [];
  return [...new Set([e.milieu_principal, ...sec].filter(m => estRenseigne(m) && !String(m).startsWith("NA")))];
}
function piegesMilieuCases(e, q) {
  const texte = String(e.habitat || "");
  const terr = String(e.territoire || "").split(" ; ");
  const siens = milieuxSiens(e);
  return q.pieges(e).filter(m => {
    if (siens.includes(m)) return false;
    if (MOTS_MILIEU[m] && MOTS_MILIEU[m].test(texte)) return false;
    if (m === "Falaises et rochers") return false;
    if (m === "Garrigue et maquis" && terr.some(t => t === "Méditerranée" || t === "Corse")) return false;
    if (m === "Alpages et pelouses d'altitude" && typeof e.altitude_max_m !== "number" && terr.some(t => TERRITOIRES_MONTAGNE.includes(t))) return false;
    return true;
  });
}

function casesPossibles(espece, q) {
  const vide = { bonnes: [], pieges: [] };
  if (!q || !CASES_CHAMPS.includes(q.champ)) return vide;
  if (defi && (defi.chrono || defi.jeu !== "revision")) return vide;          // pas dans les jeux rapides (cocher prend du temps)
  if (q.champ === "milieu_principal") {                                        // étape R105
    const siens = milieuxSiens(espece);
    if (siens.length < 2 || siens[0] !== espece.milieu_principal) return vide;
    const bonnes = [siens[0], ...melanger(siens.slice(1)).slice(0, 2)];
    // Les pièges du même « monde » d'abord : pour un animal qui ne vit pas au bord de la mer, la mer, les dunes
    // et les estuaires (et les eaux souterraines) ne viennent qu'en dernier, sinon ils s'écartent trop facilement.
    const COTIERS = ["Mer et océan", "Estuaires et lagunes", "Dunes et plages", "Eaux souterraines"];
    const auBordDeLaMer = siens.some(m => COTIERS.includes(m));
    const tires = melanger(piegesMilieuCases(espece, q));
    const pieges = auBordDeLaMer ? tires : [...tires.filter(m => !COTIERS.includes(m)), ...tires.filter(m => COTIERS.includes(m))];
    if (pieges.length < 2) return vide;
    // Étape R106 (choix de l'utilisateur, 03/11) : un animal des terres qui n'aurait que des pièges « bord de mer »
    // n'a pas cette question (trop facile) ; il garde le QCM et le vrai / faux.
    if (!auBordDeLaMer && !pieges.some(m => !COTIERS.includes(m))) return vide;
    return { bonnes, pieges };
  }
  if (q.champ === "robe") {                                                    // étape R119 : l'aspect du plumage
    const principal = lireRobe(espece);
    const autres = listeRobeAutres(espece).filter(v => v !== principal);
    if (!MOTIFS_CASES.includes(principal) || !autres.length) return vide;
    const siens = [principal, ...autres];
    const bonnes = [principal, ...melanger(autres).slice(0, 2)];
    // Pièges : seulement les motifs vérifiés « sûrement absents », moins tout ce qui ressemble à un de ses motifs
    // ou que sa description rend vrai (mêmes règles que le QCM).
    const interdits = new Set([...siens, ...siens.flatMap(v => ROBES_PROCHES[v] || []), ...robesAussiVraies(espece)]);
    const pieges = melanger(listeRobeAutres(espece, "motif_robe_absents").filter(v => MOTIFS_CASES.includes(v) && !interdits.has(v)));
    if (pieges.length < 2) return vide;
    return { bonnes, pieges };
  }
  if (q.champ === "couleur_dominante") {                                       // étape R135 : les couleurs du plumage (oiseaux)
    if (espece.onglet !== "Oiseaux") return vide;
    const siennes = listeCouleursPlumage(espece);
    if (siennes.length < 2) return vide;
    const bonnes = melanger(siennes).slice(0, 3);
    // Pièges : seulement les couleurs vérifiées « sûrement absentes », moins les voisines de ses couleurs et ce que
    // sa description cite ; les couleurs crédibles d'abord (jaune, roux, gris…), le vert, le bleu, le violet et le rose ensuite.
    const interdits = new Set([...siennes, ...siennes.flatMap(c => COULEURS_PROCHES[c] || []), ...couleursCitees(espece), espece.couleur_dominante]);
    const tires = melanger(listeCouleursPlumage(espece, "couleurs_plumage_absentes").filter(c => !interdits.has(c) && PASTILLES[c]));
    const LOIN = ["Vert", "Bleu", "Violet", "Rose"];
    const pieges = [...tires.filter(c => !LOIN.includes(c)), ...tires.filter(c => LOIN.includes(c))];
    if (pieges.length < 2) return vide;
    return { bonnes, pieges };
  }
  if (!modeItems(espece, q.champ)) return vide;
  const tous = itemsPosables(espece, q.champ), precis = tous.filter(i => !ITEMS_GENERIQUES.test(i));
  const bonnes = melanger(precis.length >= 2 ? precis : tous).slice(0, 3);
  if (bonnes.length < 2) return vide;
  const pieges = (q.champ === "proies" ? piegesAliment(espece) : piegesPredateur(espece)).filter(p => !bonnes.includes(p));
  if (pieges.length < 2) return vide;
  return { bonnes, pieges };
}
function poserCases(espece, q) {
  const { bonnes, pieges } = casesPossibles(espece, q);
  const choisis = pieges.slice(0, Math.max(2, CASES_TOTAL - bonnes.length));
  enTete(espece, q.champ !== "couleur_dominante", true);   // étape R135 : comme la question de la couleur, photo cachée
  const QUESTION_CASES = { proies: "Lesquels de ces aliments mange-t-il ?", predateurs: "Lesquels de ces animaux sont ses prédateurs ?",
                           milieu_principal: "Dans lesquels de ces milieux vit-il ?",
                           robe: `Lesquels de ces motifs voit-on sur ${NOM_ROBE[espece.onglet]} ?`,   // étape R119
                           couleur_dominante: "Quelles couleurs voit-on sur son plumage ?" };   // étape R135
  if (q.champ === "milieu_principal") {                  // étape R105 : l'explication cite tous ses milieux
    const autres = milieuxSiens(espece).slice(1).map(minuscule);
    enCours.explication = `Il vit le plus souvent ici : ${minuscule(espece.milieu_principal)}. On le croise aussi ici : ${autres.join(", ")}.`;
  }
  if (q.champ === "robe") {                              // étape R119 : l'explication cite tous ses motifs
    const principal = lireRobe(espece), autres = listeRobeAutres(espece).filter(v => v !== principal);
    enCours.explication = `${majuscule(NOM_ROBE[espece.onglet])} : ${direRobe(espece, principal)}, et aussi ${autres.map(v => direRobe(espece, v)).join(", ")}.`;
  }
  if (q.champ === "couleur_dominante") {                 // étape R135 : l'explication cite toutes ses couleurs bien visibles
    const c = listeCouleursPlumage(espece).map(minuscule);
    enCours.explication = `Sur son plumage, on voit bien : ${c.slice(0, -1).join(", ")} et ${c[c.length - 1]}.`;
  }
  document.getElementById("question").innerHTML = `${QUESTION_CASES[q.champ]}`
    + `<small class="consigne-cases">Plusieurs réponses possibles.</small>`;   // étape R124 (avant : « à cocher »)
  const zone = document.getElementById("reponses");
  zone.className = "cases-a-cocher";
  for (const v of melanger([...bonnes, ...choisis])) {
    const b = document.createElement("button");
    b.type = "button"; b.className = "reponse case-choix"; b.textContent = majuscule(v);
    if (q.champ === "couleur_dominante" && PASTILLES[v])   // étape R135 : une pastille de la couleur devant le mot
      b.innerHTML = `<span class="pastille pastille-case" style="background:${PASTILLES[v]}"></span>${majuscule(v)}`;
    b.setAttribute("aria-pressed", "false");
    if (bonnes.includes(v)) b.dataset.juste = "oui";
    b.onclick = () => { if (b.disabled) return; const oui = b.getAttribute("aria-pressed") !== "true";
      b.setAttribute("aria-pressed", String(oui)); b.classList.toggle("coche", oui); valider.disabled = !zone.querySelector(".case-choix.coche"); };
    zone.appendChild(b);
  }
  const valider = document.createElement("button");
  valider.type = "button"; valider.className = "valider-cases"; valider.textContent = "Valider"; valider.disabled = true;
  valider.onclick = () => {
    if (valider.dataset.fait) return;                    // une seule validation
    valider.dataset.fait = "oui"; valider.disabled = true;
    zone.querySelectorAll(".case-choix").forEach(c => c.disabled = true);
    const coches = [...zone.querySelectorAll(".case-choix.coche")];
    const justes = coches.filter(c => c.dataset.juste === "oui").length, fausses = coches.length - justes;
    coches.forEach(c => { if (c.dataset.juste !== "oui") c.classList.add("fausse"); });
    zone.querySelectorAll(".case-choix").forEach(c => { if (c.dataset.juste === "oui" && !c.classList.contains("coche")) c.classList.add("oubliee"); });
    const exact = justes === bonnes.length && fausses === 0;
    if (!exact && justes > 0 && fausses === 0) {
      valider.dataset.presque = "oui";
      valider.dataset.textePresque = `Presque ! ${justes} sur ${bonnes.length} : il en manquait ${bonnes.length - justes}.`;
    }
    valider.textContent = exact ? "Toutes trouvées" : `${justes} sur ${bonnes.length}`;
    repondre(valider, exact);
  };
  zone.appendChild(valider);
}

// ---- 6c. Vrai ou faux ---------------------------------------------
function poserVraiFaux(espece, q, bonne) {
  enTete(espece, true, true);
  document.getElementById("question").textContent = "Vrai ou faux ?";
  const estVraie = Math.random() < 0.5;                  // une fois sur deux, l'affirmation est vraie
  const valeur = estVraie ? bonne : autresValeurs(q, bonne, espece)[0];
  const affirmation = document.getElementById("affirmation");
  affirmation.textContent = "« " + q.affirmation(valeur) + " »";
  affirmation.classList.remove("cache");
  ajouterBouton("Vrai", estVraie);
  ajouterBouton("Faux", !estVraie);
}

// ---- 6d. Choisir parmi 4 photos -----------------------------------
// Les espèces qui peuvent servir de piège : celles dont on SAIT que la
// valeur est différente (ou "NA"). On évite les cases vides, par prudence.
function especesPieges(espece, q, bonne) {
  return ESPECES.filter(e => {
    if (e === espece || !estRenseigne(e.photo)) return false;
    const v = valeurDe(e, q);
    if (v === null || v === undefined) return false;                 // case vide : on ne sait pas
    // Étape R166 (Revoir 13) : « NA » ne veut pas toujours dire « non » (le merle a « NA » pour la naissance, mais il pond ;
    // le pigeon ramier a « NA » pour le nom du groupe, mais il vit en troupe). NA n'est sûr que pour les champs de NA_SURS.
    if (String(v).startsWith("NA")) return NA_SURS.includes(q.champ) || (q.champ === "nom_groupe" && groupeSurementAutre(e, bonne));
    if (!piegeReciproque(q, e, bonne)) return false;                 // étape R166 : la règle de la réciprocité
    if (piegeInterdit(q, bonne, v) && !(JAMAIS_PIEGES[q.champ] || []).includes(v)) return false;   // étape 135 : à moitié vrai pour elle aussi
    if (aussiVraiPour(q, e, bonne)) return false;                    // étape 137 : la réponse vaut aussi pour elle
    return !valeursDe(e, q).some(x => seRessemblent(x, bonne));      // aucune de ses valeurs ne ressemble à la bonne
  });
}

// ---- Étape R166 (Revoir 13, 08/11) : LA RÈGLE DE LA RÉCIPROCITÉ ----
// Quand la réponse est une ESPÈCE (« Lequel… ? » en photos, « Laquelle des deux ? »), une autre espèce ne sert de piège
// que si, dans un QCM posé sur ELLE, la bonne réponse serait une mauvaise réponse permise. Toutes les protections
// déjà écrites pour le QCM (milieux secondaires et voisins, saisons qui se chevauchent, motifs et couleurs vérifiés…)
// valent alors aussi dans l'autre sens. Avant : « Laquelle vit surtout ici : campagne, haies et jardins ? » merle ou pinson,
// alors que le pinson y vit aussi (milieu secondaire).
const NA_SURS = ["pelage_hiver", "cornes_ou_bois", "toile", "pinces", "coquille", "dard", "barbillons", "nombre_bras", "niveau_estran"];
const memoReciproque = new Map();
function piegeReciproque(q, e, bonne) {
  if (q.champ === "nom_groupe") return groupeSurementAutre(e, bonne);
  if (!q.pieges || q.champ === "proies" || q.champ === "predateurs") return true;   // aliments et prédateurs : règles à part (étape 137)
  const v = valeurDe(e, q);
  const cle = q.champ + "|" + e.nom_courant;
  if (!memoReciproque.has(cle)) memoReciproque.set(cle, new Set(autresValeurs(q, v, e)));
  return memoReciproque.get(cle).has(bonne);
}
// Le nom de groupe : une espèce n'est un piège sûr que si elle vit seule ou en couple, ou si son groupe a un autre nom précis
function groupeSurementAutre(e, bonne) {
  if (["Solitaire", "Couple"].includes(e.comportement_social)) return true;
  return estRenseigne(e.nom_groupe) && !String(e.nom_groupe).startsWith("NA") && groupePrecis(e.nom_groupe) && e.nom_groupe !== bonne;
}

// Étape R151 : dans une expédition, les pièges en photos viennent de l'expédition (avant : « Lequel est filtreur ? »
// avec une cétoine, une abeille et un goéland face à l'huître creuse). Ailleurs, comme avant.
function piegesPhotos(espece, q, bonne) {
  const l = especesPieges(espece, q, bonne).filter(estIdentifiee);
  return defi && defi.expedition && defi.especes ? l.filter(e => defi.especes.includes(e)) : l;
}
function poserPhotos(espece, q, bonne) {
  enTete(espece, false, false, q.inverse(bonne));
  document.getElementById("question").textContent = "";       // le titre pose déjà la question
  // On préfère des pièges de la même classe ; on complète avec les autres si besoin
  // Étape 149 : seulement des espèces déjà identifiées (leur nom s'affiche au survol : il ne doit rien dévoiler)
  const tous = melanger(piegesPhotos(espece, q, bonne));
  const memeClasse = tous.filter(e => e.onglet === espece.onglet);
  const autres     = tous.filter(e => e.onglet !== espece.onglet);
  const pieges = [...memeClasse, ...autres].slice(0, 3);

  const zone = document.getElementById("reponses");
  zone.className = "grille-photos";
  for (const e of melanger([espece, ...pieges])) {
    const bouton = document.createElement("button");
    bouton.className = "reponse choix-photo";
    bouton.innerHTML = `<div class="photo">${celluleImage(e, true)}</div>
                        <div class="legende au-survol">${e.nom_courant}</div>`;
    if (e === espece) bouton.dataset.juste = "oui";
    bouton.onclick = () => repondre(bouton, e === espece);
    zone.appendChild(bouton);
  }
  enCours.explication = `C'était : ${espece.nom_courant}. ` + enCours.explication;
}

// ---- 6h. Le portrait physique : réponses à pictogramme (étape 64) -----
// La photo est cachée (elle donnerait la réponse) ; le nom de l'espèce reste affiché.
// Chaque réponse est un bouton : un dessin ou une pastille, et le mot écrit dessous.
function poserPicto(espece, q, bonne) {
  enTete(espece, q.avecPhoto === true, true);          // photo cachée, sauf si elle ne donne pas la réponse
  if (!q.avecPhoto && silhouetteUtile(q, espece)) proposerSilhouette(espece);   // étapes 111 et 241 : l'aide facultative, seulement pour une question de forme
  document.getElementById("question").textContent = typeof q.question === "function" ? q.question(espece) : q.question;
  const pieges = autresValeurs(q, bonne, espece).slice(0, 3);
  const reponses = melanger([bonne, ...pieges]);
  // Réponses écrites seulement (ex : "garde sa queue" / "n'a plus de queue")
  if (q.sansImage) { for (const v of reponses) ajouterBouton(majuscule(v), v === bonne); return; }
  const zone = document.getElementById("reponses");
  zone.className = "grille-photos";                  // la même grille que le choix parmi 4 photos : 2 par ligne
  for (const v of reponses) ajouterBoutonPicto(q.colonnePicto, v, v === bonne);
}

// ---- 6f. Les empreintes (étape 28) ----------------------------------
// Trois autres espèces pour servir de pièges : d'abord celles dont l'empreinte
// RESSEMBLE (même groupe : sabots, 4 doigts, 5 doigts), puis les autres pour compléter.
function piegesEmpreinte(espece) {
  const groupe = EMPREINTES[cleEmpreinte(espece)].groupe;
  // Étape 185 : jamais une empreinte presque identique (même « sosies » : crapauds, palmipèdes, hérons…)
  const sosies = EMPREINTES[cleEmpreinte(espece)].sosies;
  const autres = melanger(ESPECES.filter(e => e !== espece && fichierEmpreinte(e) !== "NA"
                                          && !(sosies && EMPREINTES[cleEmpreinte(e)].sosies === sosies)));
  const proches   = autres.filter(e => EMPREINTES[cleEmpreinte(e)].groupe === groupe);
  const lointains = autres.filter(e => EMPREINTES[cleEmpreinte(e)].groupe !== groupe);
  return [...proches, ...lointains].slice(0, 3);
}

// On montre l'empreinte à la place de la photo ; le nom de l'espèce reste caché.
function poserEmpreinteNom(espece, fichier) {
  if (session && session.focus && !defi) { poserEmpreinteDuo(espece); return; }   // étape 175 : dans la Rencontre
  enTete(espece, true, false, "À qui appartient cette empreinte ?");
  document.getElementById("question").textContent = "";       // le titre pose déjà la question
  const cadre = document.getElementById("photo-rencontre");
  cadre.classList.add("cadre-empreinte");
  cadre.innerHTML = `<img src="${fichier}" alt="Une empreinte">`;
  for (const e of melanger([espece, ...piegesEmpreinte(espece)])) ajouterBouton(e.nom_courant, e === espece);
  enCours.explication = `C'était : ${espece.nom_courant}. ` + enCours.explication;
}

// On montre l'espèce ; il faut retrouver son empreinte parmi quatre dessins.
function poserEmpreinteChoix(espece, fichier) {
  enTete(espece, true, true);
  document.getElementById("question").textContent = "Laquelle de ces empreintes est la sienne ?";
  const zone = document.getElementById("reponses");
  zone.className = "grille-photos";
  for (const e of melanger([espece, ...piegesEmpreinte(espece)])) {
    const bouton = document.createElement("button");
    bouton.className = "reponse choix-photo";
    bouton.innerHTML = `<div class="photo cadre-empreinte"><img src="${fichierEmpreinte(e)}" alt="Une empreinte"></div>
                        <div class="legende cache">${e.nom_courant}</div>`;
    if (e === espece) bouton.dataset.juste = "oui";
    bouton.onclick = () => repondre(bouton, e === espece);
    zone.appendChild(bouton);
  }
}

// ---- Étape 175 (13/10) : l'empreinte dans la Rencontre, « Laquelle de ces deux empreintes est la sienne ? » ----
// Comme pour le cri (étape 173) : l'espèce est déjà connue, « À qui appartient cette empreinte ? » parmi 4 noms était évident.
// On montre donc DEUX dessins côte à côte, le sien et un autre — de préférence une empreinte qui ressemble
// (même groupe : sabots, doigts, oiseaux…), pour qu'il faille vraiment regarder. Les noms apparaissent après la réponse.
function poserEmpreinteDuo(espece) {
  enTete(espece, true, true);
  document.getElementById("question").textContent = "Laquelle de ces deux empreintes est la sienne ?";
  const autre = piegesEmpreinte(espece)[0];
  const zone = document.getElementById("reponses");
  zone.className = "grille-photos";
  for (const e of melanger([espece, autre])) {
    const bouton = document.createElement("button");
    bouton.className = "reponse choix-photo";
    bouton.innerHTML = `<div class="photo cadre-empreinte"><img src="${fichierEmpreinte(e)}" alt="Une empreinte"></div>
                        <div class="legende cache">${e.nom_courant}</div>`;
    if (e === espece) bouton.dataset.juste = "oui";
    bouton.onclick = () => repondre(bouton, e === espece);
    zone.appendChild(bouton);
  }
  enCours.explication = enCours.explication + ` L'autre empreinte était celle de : ${autre.nom_courant}.`;
}

// ---- 6g. Le cri à reconnaître (étape 29) ----------------------------
// "new Audio(fichier)" prépare un lecteur de son invisible ; .play() le lance,
// .pause() l'arrête, .currentTime = 0 le remet au début.
let cri = null;                    // le lecteur du cri en cours (aucun en dehors de cette question)

function arreterCri() {
  if (cri) { cri.pause(); cri = null; }
  for (const a of crisDuo) a.pause();                   // étape 173 : les deux cris de la Rencontre
  crisDuo = [];
  arreterTousLesSons();                                  // étape R176 : et tous les autres sons (intermède, « Par le cri », fiches)
}
// ---- Étape R176 (retour d'Aubin du 09/11 : « un cri continue de jouer quand on change de page ; le son s'arrête
// parfois puis reprend ») ----
// Chaque lecteur de son créé par le jeu (new Audio) est noté dans SONS_JEU. Deux règles :
//   1) un seul son à la fois : quand un son démarre, tous les autres s'arrêtent (avant, deux cris pouvaient se chevaucher) ;
//   2) arreterTousLesSons() coupe tout (lecteurs du jeu et lecteurs des fiches) : appelée à chaque changement d'écran
//      (arreterCri, montrer, nouvelle question, bandeau d'expédition, retour du téléphone, application mise en arrière-plan).
const SONS_JEU = new Set();
(function () {
  const AudioNatif = window.Audio;
  if (!AudioNatif || AudioNatif.estSuivi) return;
  function AudioSuivi(src) {
    const a = src === undefined ? new AudioNatif() : new AudioNatif(src);
    SONS_JEU.add(a);
    a.addEventListener("play", () => unSeulSon(a));
    return a;
  }
  AudioSuivi.prototype = AudioNatif.prototype;
  AudioSuivi.estSuivi = true;
  window.Audio = AudioSuivi;
  // Un son démarre (lecteur du jeu ou lecteur d'une fiche) : les autres se taisent
  document.addEventListener("play", ev => unSeulSon(ev.target), true);   // les lecteurs des fiches (dans la page)
  document.addEventListener("visibilitychange", () => { if (document.hidden) arreterTousLesSons(); });
  window.addEventListener("pagehide", () => arreterTousLesSons());
})();
function unSeulSon(lui) {
  for (const a of SONS_JEU) if (a !== lui && !a.paused) a.pause();
  document.querySelectorAll("audio").forEach(a => { if (a !== lui && !a.paused) a.pause(); });
}
function arreterTousLesSons() {
  for (const a of SONS_JEU) { try { a.pause(); } catch (e) { /* rien */ } }
  SONS_JEU.clear();
  document.querySelectorAll("audio").forEach(a => { if (!a.paused) a.pause(); });
  document.querySelectorAll(".anneau-ecoute.en-lecture").forEach(b => b.classList.remove("en-lecture"));
  if (typeof formeAudio !== "undefined" && formeAudio) { formeAudio = null; }
}
let crisDuo = [];                                       // étape 173 : les deux enregistrements du « lequel des deux ? »

// L'anneau d'écoute : un clic lance le cri depuis le début ; un second clic l'arrête.
// La classe "en-lecture" change l'icône (triangle → carré) ; l'anneau se remplit pendant l'écoute.
function ecouterCri() {
  if (!cri) return;
  const bouton = document.getElementById("bouton-ecouter");
  if (!cri.paused) { cri.pause(); bouton.classList.remove("en-lecture"); return; }
  cri.currentTime = 0;
  cri.play().catch(() => { bouton.classList.remove("en-lecture"); bouton.title = "Son introuvable"; });
  bouton.classList.add("en-lecture");
  suivreCri();
}

// Fait avancer l'arc de l'anneau au rythme du son. requestAnimationFrame = "rappelle-moi
// juste avant la prochaine image de l'écran" : l'arc avance ainsi sans à-coups.
const TOUR_ECOUTE = 2 * Math.PI * 40;           // longueur du cercle (rayon 40)
function suivreCri() {
  const arc = document.getElementById("arc-ecoute");
  if (!cri || !arc) return;
  const part = cri.duration ? cri.currentTime / cri.duration : 0;      // entre 0 et 1
  arc.setAttribute("stroke-dasharray", `${TOUR_ECOUTE * part} ${TOUR_ECOUTE}`);
  if (!cri.paused) requestAnimationFrame(suivreCri);
}

// À la place de la photo nette : la photo de l'espèce TRÈS floue (on ne devine que des
// couleurs), avec l'anneau d'écoute par-dessus. Elle redevient nette après la réponse.
function poserSonNom(espece, fichier) {
  if (session && session.focus && !defi) { poserSonDuo(espece, fichier); return; }   // étape 173 : dans la Rencontre
  enTete(espece, true, false, "Quel animal entend-on ?");
  document.getElementById("question").textContent = "";       // le titre pose déjà la question
  const cadre = document.getElementById("photo-rencontre");
  cadre.classList.add("cadre-son");
  cadre.classList.remove("devoile");
  cadre.innerHTML = celluleImage(espece) + `
    <button id="bouton-ecouter" class="anneau-ecoute" aria-label="Écouter le cri" title="Écouter (barre d'espace)">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle class="piste" cx="50" cy="50" r="40"/>
        <circle class="arc" id="arc-ecoute" cx="50" cy="50" r="40" stroke-dasharray="0 ${TOUR_ECOUTE}" transform="rotate(-90 50 50)"/>
        <circle class="disque" cx="50" cy="50" r="24"/>
        <path class="triangle" d="M44 38 L62 50 L44 62 Z"/>
        <rect class="carre" x="41" y="41" width="18" height="18" rx="3"/>
      </svg>
    </button>`;
  cri = new Audio(fichier);
  cri.onended = () => { const b = document.getElementById("bouton-ecouter"); if (b) b.classList.remove("en-lecture"); };
  document.getElementById("bouton-ecouter").onclick = ecouterCri;

  // 3 pièges parmi les autres espèces qui ont un cri : d'abord de la même famille
  const autres = melanger(ESPECES.filter(e => e !== espece && fichierSon(e) !== "NA"));
  const memeClasse = autres.filter(e => e.onglet === espece.onglet);
  const lesAutres  = autres.filter(e => e.onglet !== espece.onglet);
  const pieges = [...memeClasse, ...lesAutres].slice(0, 3);
  for (const e of melanger([espece, ...pieges])) ajouterBouton(e.nom_courant, e === espece);
  enCours.explication = `C'était : ${espece.nom_courant}. ` + enCours.explication;
}

// ---- Étape 173 (13/10) : le cri dans la Rencontre, « Lequel de ces deux cris est le sien ? » ----
// Dans la Rencontre, l'espèce est déjà connue : demander « Quel animal entend-on ? » parmi 4 noms était évident.
// On fait donc écouter DEUX cris, le sien et celui d'une autre espèce (de la même famille si possible),
// dans un ordre tiré au hasard : A et B. La photo reste nette, le nom affiché.
// Chaque cri a son petit anneau d'écoute (on peut les réécouter autant qu'on veut, même après la réponse),
// et deux boutons de réponse dessous : « Le cri A », « Le cri B » (touches & et é, comme les autres réponses).
function anneauDuo(lettre) {
  return `<button class="anneau-ecoute" data-cri="${lettre}" aria-label="Écouter le cri ${lettre}" title="Écouter le cri ${lettre}">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle class="piste" cx="50" cy="50" r="40"/>
        <circle class="arc" cx="50" cy="50" r="40" stroke-dasharray="0 ${TOUR_ECOUTE}" transform="rotate(-90 50 50)"/>
        <circle class="disque" cx="50" cy="50" r="24"/>
        <path class="triangle" d="M44 38 L62 50 L44 62 Z"/>
        <rect class="carre" x="41" y="41" width="18" height="18" rx="3"/>
      </svg>
    </button>`;
}
function ecouterDuo(i) {
  const audio = crisDuo[i];
  const anneaux = document.querySelectorAll(".cri-duo .anneau-ecoute");
  if (!audio || !anneaux[i]) return;
  if (!audio.paused) { audio.pause(); anneaux[i].classList.remove("en-lecture"); return; }
  crisDuo.forEach((a, k) => { if (k !== i) { a.pause(); anneaux[k].classList.remove("en-lecture"); } });   // un seul cri à la fois
  audio.currentTime = 0;
  audio.play().catch(() => { anneaux[i].classList.remove("en-lecture"); anneaux[i].title = "Son introuvable"; });
  anneaux[i].classList.add("en-lecture");
  const arc = anneaux[i].querySelector(".arc");
  const avancer = () => {
    const part = audio.duration ? audio.currentTime / audio.duration : 0;
    arc.setAttribute("stroke-dasharray", `${TOUR_ECOUTE * part} ${TOUR_ECOUTE}`);
    if (!audio.paused) requestAnimationFrame(avancer);
  };
  avancer();
}
function poserSonDuo(espece, fichier) {
  enTete(espece, true, true);
  document.getElementById("question").textContent = "Lequel de ces deux cris est le sien ?";
  // L'autre cri : une autre espèce qui a un enregistrement, de la même famille si possible
  const autres = melanger(ESPECES.filter(e => e !== espece && fichierSon(e) !== "NA"));
  // Étape R151 : un cri d'une espèce du même territoire (avant : l'accenteur alpin dans le golfe du Morbihan)
  const exp = (defi && defi.expedition) || (session && session.expedition);
  const terr = exp && expeditionParId(exp.id) ? [expeditionParId(exp.id).territoire] : String(espece.territoire || "").split(" ; ");
  const voisine = e => String(e.territoire || "").split(" ; ").some(t => terr.includes(t));
  const autre = autres.find(e => e.onglet === espece.onglet && voisine(e)) || autres.find(voisine) || autres.find(e => e.onglet === espece.onglet) || autres[0];
  const lesDeux = melanger([espece, autre]);              // l'ordre A / B est tiré au hasard
  arreterCri();
  crisDuo = lesDeux.map(e => new Audio(fichierSon(e)));
  const zone = document.getElementById("reponses");
  zone.className = "duo-cris";
  zone.innerHTML = lesDeux.map((e, i) => `<div class="cri-duo">${anneauDuo("AB"[i])}<span>Cri ${"AB"[i]}</span></div>`).join("");
  zone.querySelectorAll(".cri-duo .anneau-ecoute").forEach((b, i) => {
    b.onclick = () => ecouterDuo(i);
    crisDuo[i].onended = () => b.classList.remove("en-lecture");
  });
  lesDeux.forEach((e, i) => ajouterBouton(`Le cri ${"AB"[i]}`, e === espece));
  const lettre = "AB"[lesDeux.indexOf(espece)], autreLettre = "AB"[lesDeux.indexOf(autre)];
  // Étape R176 (retour d'Aubin du 09/11 : le « tiou » flûté du petit-duc semblait être celui de la cisticole) :
  // la description du cri vient tout de suite après le bon cri, et l'autre espèce est nommée en dernier.
  const son = SONS[cleEmpreinte(espece)];
  enCours.explication = `Le cri ${lettre} était bien le sien${son && son.texte ? ` : on entendait ${son.texte}` : ""}. Le cri ${autreLettre} était celui de : ${autre.nom_courant}.`;
}

// La barre d'espace lance (ou arrête) le cri, pour jouer sans la souris.
document.addEventListener("keydown", evenement => {
  const bouton = document.getElementById("bouton-ecouter");
  if (evenement.key !== " " || !bouton || !bouton.offsetParent) return;
  evenement.preventDefault();                 // sinon la barre d'espace fait défiler la page
  ecouterCri();
});

// ---- 6h. "Le son est-il disponible ?" (étape 51) ---------------------
// Posée une fois par Rencontre, juste avant la première question de cri.
// Ce n'est pas une question du jeu : elle ne compte ni dans le score, ni dans les 10 questions.
//   tirage = la question de cri qui attend : { espece, champ, estRevision }
function demanderSon(tirage) {
  enCours = { espece: tirage.espece, champ: tirage.champ };     // la carte reste affichée si l'on change d'onglet
  derniereEspece = tirage.espece;
  if (session) session.enRejeu = !!tirage.rejeu;                 // étape 156 (pour le compteur)
  // La carte, sans photo : un titre, une phrase, deux boutons
  const photo = document.getElementById("photo-rencontre");
  photo.classList.add("cache");
  photo.classList.remove("cadre-empreinte", "cadre-son", "devoile");
  document.getElementById("famille").classList.add("cache");
  document.getElementById("compteur-rencontre").textContent = texteCompteur(tirage.champ);   // étape 156
  document.getElementById("revision").textContent = "";
  document.getElementById("retour").textContent = "";
  document.getElementById("affirmation").classList.add("cache");
  document.getElementById("suivant").classList.add("cache");
  document.getElementById("nom").textContent = "Le son est-il disponible ?";
  document.getElementById("question").textContent =
    "La prochaine question fait écouter le cri d'un animal. Sans le son, elle est remplacée par une autre.";
  const zone = document.getElementById("reponses");
  zone.innerHTML = "";
  zone.className = "";
  // Deux boutons de la même forme que les réponses : ils marchent aussi au clavier (& é, flèches, Entrée)
  for (const [texte, reponse] of [["Oui", true], ["Non", false]]) {
    const bouton = document.createElement("button");
    bouton.className = "reponse";
    bouton.textContent = texte;
    bouton.onclick = () => repondreSon(reponse, tirage);
    zone.appendChild(bouton);
  }
}

function repondreSon(aLeSon, tirage) {
  sonDemande = true;                 // on ne redemandera plus pendant cette Rencontre
  if (suivi) suivi.sonDemandeLe = aujourdhui();   // étape R150 : ni de la journée
  sonActif = aLeSon;
  if (aLeSon) {
    sauvegarder();
    afficherStats();
    poserQuestion(tirage);           // la question de cri qui attendait
    return;
  }
  // Pas de son : on retire les cris qui attendaient d'être reposés…
  aRevoir = aRevoir.filter(r => r.champ !== "cri_son");
  sauvegarder();
  afficherStats();
  // Étape 140 : dans le Carnet, plus aucun cri dans cette partie, et une autre question est tirée à la place
  if (defi) { defi.cris = false; poserQuestion(choisirQuestionDefi()); return; }
  // La question de cri est remplacée par une autre, sur la même espèce
  poserQuestion({ espece: tirage.espece, champ: choisirChamp(tirage.espece), estRevision: false });
}

// ---- 6e. Estimation chiffrée ---------------------------------------
// Étape R151 (07/11, retour en jouant, choix d'Aubin « Ok pour 1 à 4 ») : des nombres ronds, et des pièges sans rapport fixe
// avec la bonne réponse. Avant : pièges = bonne × 0,3 / 0,5 / 0,7 / 1,5 / 2 / 3, avec les mêmes décimales
// (11,9 / 16,7 / 23,8 / 71,4 ans) : la bonne était celle dont les autres étaient des multiples.
// Maintenant : la bonne est arrondie (23,8 → 24 ; 21,5 jours → 22 ; 5,2 cm → 5), les pièges sont tirés au hasard
// autour d'elle (× 0,35 à 0,75 ou × 1,35 à 2,8) puis arrondis de la même façon.
function arrondiJoli(n, entier, pas) {
  if (pas) return Math.round(n / pas) * pas;
  const deuxChiffres = x => { const p = Math.pow(10, Math.floor(Math.log10(x)) - 1); return Math.round(x / p) * p; };
  if (n >= 100) return deuxChiffres(n);
  if (n >= 10 || entier) return Math.round(n);
  if (n >= 1) return Math.round(n * 2) / 2;
  return Number(deuxChiffres(n).toPrecision(2));
}
function poserEstimation(espece, q) {
  enTete(espece, true, true);
  document.getElementById("question").textContent = typeof q.question === "function" ? q.question(espece) : q.question;
  const brute = valeurDe(espece, q);
  const entier = Number.isInteger(brute);
  // (sous 1 — poids en grammes d'une araignée… — la valeur reste telle quelle : l'arrondi l'effacerait à l'écran)
  let bonne = brute < 1 && !q.pas ? brute : Math.max(q.pas || 0, arrondiJoli(brute, entier, q.pas)) || brute;
  if (q.affichage(bonne) !== q.affichage(brute) && brute < 1) bonne = brute;
  const plafond = q.plafond && bonne <= q.plafond ? q.plafond : null;    // (le dauphin a 200 dents : au-delà du plafond habituel)
  const vus = new Set([q.affichage(bonne)]);                             // jamais deux réponses qui s'écrivent pareil
  const acceptable = n => n > 0 && n !== bonne && (!plafond || n <= plafond) && !vus.has(q.affichage(n));
  const loin = (a, b) => Math.abs(a - b) / Math.max(a, b) >= 0.12;              // assez différents pour ne pas hésiter
  const pieges = [];
  const tirer = (de, a) => {                                                      // un piège entre bonne × de et bonne × a
    for (let essai = 0; essai < 40; essai++) {
      const n = arrondiJoli(bonne * (de + Math.random() * (a - de)), entier, q.pas);
      if (acceptable(n) && loin(n, bonne) && pieges.every(p => loin(n, p))) { pieges.push(n); vus.add(q.affichage(n)); return true; }
    }
    return false;
  };
  const nbPetits = entreAuHasard(0, 3);                    // combien de pièges plus petits : la bonne n'est jamais toujours à la même place
  for (let i = 0; i < nbPetits; i++) if (!tirer(0.35, 0.75)) break;
  while (pieges.length < 3 && tirer(1.35, 2.8)) { /* plus grands */ }
  while (pieges.length < 3 && tirer(0.3, 0.8)) { /* encore plus petits */ }
  while (pieges.length < 3 && tirer(1.2, 5)) { /* plus loin au-dessus (tout petits nombres) */ }
  const grain = q.pas || (entier || bonne >= 10 ? 1 : bonne >= 1 ? 0.5 : Math.pow(10, Math.floor(Math.log10(bonne))));
  for (let k = 1; pieges.length < 3 && k < 200; k++) {                           // dernier secours : pas à pas
    for (const n0 of [bonne + k * grain, bonne - k * grain]) {
      const n = Number(n0.toPrecision(6));
      if (pieges.length < 3 && acceptable(n) && !pieges.includes(n)) { pieges.push(n); vus.add(q.affichage(n)); }
    }
  }
  const choix = [bonne, ...pieges.slice(0, 3)].sort((a, b) => a - b);
  // Étape 136 : une mauvaise réponse que l'animal ATTEINT réellement (dans sa fourchette, sous le maximum) est « presque »
  const fourchette = q.fourchette ? q.fourchette(espece) : null;
  for (const n of choix) {
    ajouterBouton(q.affichage(n), n === bonne);
    if (fourchette && n !== bonne && n >= fourchette[0] && n < bonne) document.getElementById("reponses").lastChild.dataset.presque = "oui";
  }
  if (bonne !== brute && enCours) { enCours.explication = q.explication(espece, bonne); enCours.bonne = bonne; }   // l'explication dit le même nombre
}
// Le texte du « Presque » (étape 136) : "175 kg, c'est bien possible, mais ce n'est pas le maximum. Il peut peser jusqu'à 250 kg."
function textePresque(bouton, explication) {
  if (bouton.dataset.textePresque) return `${bouton.dataset.textePresque} ${explication}`;   // étape R103 : plusieurs réponses à cocher
  return `Presque ! ${bouton.textContent}, c'est bien possible, mais ce n'est pas le maximum. ${explication}`;
}


// ==================================================================
// 7. QUAND LE JOUEUR RÉPOND  → on met à jour le carnet
//    Peu importe le format : on sait quelle espèce et quelle "case"
//    étaient en jeu grâce à la variable enCours.
// ==================================================================
const JE_NE_SAIS_PAS = false;   // étape R158 : « Je ne sais pas » retiré (true pour le remettre)
function repondre(boutonClique, estJuste, jeNeSaisPas = false) {
  document.getElementById("je-ne-sais-pas").classList.add("cache");
  delete document.getElementById("je-ne-sais-pas").dataset.ouverture;   // étape R155
  // En défi : règles à part (parties 11 bis et 11 quater)
  if (defi && defi.decouverte) { repondreDecouverte(boutonClique, estJuste); return; }   // une découverte (étape 73)
  if (defi && defi.jeu === "revision") { repondreRevision(boutonClique, estJuste, jeNeSaisPas); return; }   // étape 79
  if (defi) { repondreDefi(boutonClique, estJuste); return; }
  if (typeof INSOLITE !== "undefined" && enCours.champ === INSOLITE) { repondreInsoliteRencontre(boutonClique, estJuste); return; }   // étape QI4 (21)
  const { espece, champ, explication } = enCours;
  const nom = espece.nom_courant;
  // Étape 136 : « Presque » = une valeur vraie pour l'animal, mais pas son maximum (questions chiffrées)
  const presque = !estJuste && boutonClique && boutonClique.dataset.presque === "oui";
  const avant = statut(espece);                        // statut AVANT la réponse
  const niveauAvant = niveauTermine(espece);           // et nombre de niveaux terminés AVANT
  // Le rang de sa famille AVANT la réponse (Curieux, Connaisseur…), pour signaler un changement
  const saFamille = ESPECES.filter(e => estDans(e, territoiresJeu(espece)) && e.onglet === espece.onglet);
  const rangAvant = progresFamille(saFamille).palier;

  // L'espèce a été croisée : elle entre dans le carnet (si ce n'est pas déjà fait)
  marquerVue(espece);

  // On bloque les boutons, on montre la bonne réponse, on dévoile les noms
  for (const b of document.querySelectorAll(".reponse")) {
    b.disabled = true;
    if (b.dataset.juste === "oui") b.classList.add("juste");
  }
  for (const l of document.querySelectorAll(".legende")) l.classList.remove("cache", "au-survol");   // (au-survol : étape 149)
  // Question du portrait physique (étape 64) : la photo, cachée pendant la question, se montre
  if (enCours.q && enCours.q.format === "picto") document.getElementById("photo-rencontre").classList.remove("cache");
  // Question sur le cri : la photo floue redevient nette
  if (champ === "cri_son") document.getElementById("photo-rencontre").classList.add("devoile");
  if (document.getElementById("photo-rencontre").classList.contains("floutee")) document.getElementById("photo-rencontre").classList.add("devoile");   // étape 162
  // Quand le nom était caché (photo ou empreinte à reconnaître), on le dévoile
  if (champ === IDENTIFICATION || champ === "empreinte_nom" || champ === "cri_son") document.getElementById("nom").textContent = nom;
  document.getElementById("famille").classList.remove("cache");     // l'étiquette de groupe se dévoile

  const retour = document.getElementById("retour");
  if (estJuste) {
    noterAuBilan(espece, champ);                 // pour le bilan de fin (étape 37) : AVANT le +1
    // La question est réussie : si elle attendait aussi dans la file "à revoir", on l'en retire
    // (sinon elle revenait une seconde fois, quelques questions plus tard).
    aRevoir = aRevoir.filter(r => !(r.nom === nom && r.champ === champ));
    // Étape 145 : ratée plus tôt dans cette Rencontre puis retrouvée → plus à revoir en fin de partie
    if (session && session.manquees) session.manquees = session.manquees.filter(m => !(m.espece === espece && m.champ === champ));
    // +1 sur cette case de la fiche (+10 au compteur interne)
    noterReussite(espece, champ);                // étape 106 : pour les badges (AVANT le +1)
    progression[nom].acquis[champ] = nbBonnes(espece, champ) + 1;
    noterRevue(espece, champ);                   // étape 150
    xp = xp + 10;
    retour.textContent = (session && session.enBonus ? "Bravo, vous vous en souveniez ! " : "Bravo ! ") + explication;   // étape 161
    jouerSon();
  } else {
    if (presque) {
      // Étape 136 : ça compte à moitié. Jamais trouvée → « Découvert » (+5 XP) ; déjà trouvée → rien ne bouge.
      // Dans les deux cas, la question revient plus tard (plus bas), pour trouver le maximum exact.
      boutonClique.classList.add("presque");
      retour.textContent = textePresque(boutonClique, explication);
      if (nbBonnes(espece, champ) === 0) {
        noterAuBilan(espece, champ);
        progression[nom].acquis[champ] = 1;
        noterRevue(espece, champ);               // étape 150
        xp = xp + 5;
      }
    } else {
    // Étape 76 : un retour neutre, sans "Pas tout à fait" ; la bonne réponse est simplement donnée.
    // "Je ne sais pas" : aucun bouton n'est marqué en rouge.
    if (boutonClique) boutonClique.classList.add("fausse");
    if (boutonClique && !jeNeSaisPas) jouerSon("mauvaise");                               // étape 170 : le hou-hou de chouette
    retour.textContent = explication;
    noterEchec(espece, champ);                   // étape 106 : pour les badges
    }
    // On la programme pour plus tard (sauf si elle y est déjà)
    const dejaPrevue = aRevoir.some(r => r.nom === nom && r.champ === champ);
    if (!dejaPrevue) aRevoir.push({ nom: nom, champ: champ, dans: entreAuHasard(REVISION_AU_PLUS_TOT, REVISION_AU_PLUS_TARD) });
    // Étape 98 : notée aussi dans les questions manquées de la partie (proposées à la fin)
    if (session && champ !== OUVERTURE) {
      session.manquees = session.manquees || [];
      if (!session.manquees.some(m => m.espece === espece && m.champ === champ)) session.manquees.push({ espece, champ });
    }
    // Rencontre à une espèce (étape 74) : la question ratée revient dans la même Rencontre (une seule fois).
    // Étape 156 : elle revient À LA FIN, après toutes les questions prévues, et dans une place en plus :
    // elle ne prend jamais la place d'une autre question. Elle reste aussi dans les « Déjà croisée… »
    // des prochaines parties tant qu'elle n'est pas trouvée.
    // (étape 161 : pas de reprise pour la question bonus, qui ferme la Rencontre)
    // Étape R150 : dans une expédition, la photo ratée n'est pas reposée tout de suite (la réponse venait d'être montrée :
    // un point gratuit) ; elle revient à la fin de l'étape, avec les autres choses manquées (R132, R146).
    if (session && session.focus && !session.enBonus && champ === IDENTIFICATION && session.physique && !session.dejaRejouees.includes(champ)) {
      session.dejaRejouees.push(champ);
    } else if (session && session.focus && !session.enBonus && !session.dejaRejouees.includes(champ)) {
      session.rejouer.push({ champ });
      session.dejaRejouees.push(champ);
      session.total = session.total + 1;
    }
  }

  // Étape 310 : dans une Rencontre, la photo reconnue (ou le nom donné) s'accompagne toujours de la taille, avec son picto chiffré
  // Étape R168 : et le poids, à côté
  if (session && session.focus && champ === IDENTIFICATION && typeof retourMesures === "function") {
    retour.insertAdjacentHTML("beforeend", retourMesures(espece));
  }
  postitReponse(champ, estJuste ? "trouve" : presque ? "presque" : "rate");   // étape 151 : la ligne s'écrit

  // Le statut a-t-il changé ? → une annonce, et une seule.
  // Les moments rares ont droit à la carte illustrée (étape 40), le reste à la bulle.
  // Priorité : rang de famille, espèce maîtrisée, médaille, espèce découverte, puis le courant.
  const apres = statut(espece);
  const niveauApres = niveauTermine(espece);
  const rangApres = progresFamille(saFamille).palier;
  const couleur = classeDe(espece).couleur;
  const photo = celluleImage(espece, true);              // la miniature de l'espèce
  // Étape 142 : ces trois moments ont droit à la fête (la vignette du coin reste en secours, partie chronométrée)
  if (rangApres > rangAvant) {
    // La famille change de rang : l'image est la silhouette de la famille
    const pop = { couleur, image: `<svg viewBox="0 0 48 48">${SILHOUETTES[espece.onglet] || ""}</svg>`,
      etiquette: "Nouveau rang", titre: `${classeDe(espece).nom} : ${RANGS_FAMILLE[rangApres]}`, detail: "" };
    feter({ etiquette: `Nouveau rang · ${classeDe(espece).nom}`, titre: RANGS_FAMILLE[rangApres], detail: "", son: "rang", pop,
            visuel: `<div class="fete-visuel rang" style="color:${couleur}"><svg viewBox="0 0 48 48" style="fill:currentColor">${SILHOUETTES[espece.onglet] || ""}</svg></div>` });
  } else if (apres !== avant && apres === "maîtrisée") {
    const pop = { couleur, image: photo, etiquette: "Espèce maîtrisée", titre: nom, detail: "toute sa fiche est connue" };
    feter({ etiquette: "Espèce maîtrisée", titre: nom, detail: "Toute sa fiche est connue", son: "medaille", pop,
            visuel: visuelEspece(espece, "familiere") });   // étape R144
  } else if (niveauApres > niveauAvant && !enExpedition()) {   // étape R130 : pas de fête de médaille dans une expédition (pour l'instant)
    const medaille = CLASSES_PALIER[niveauApres];      // étape R144 : le palier de l'espèce (plus de médaille)
    const pop = { couleur, image: photo, medaille: dessinMedaille(medaille, niveauApres),
      etiquette: `Espèce ${nomPalier(niveauApres)}`, titre: nom, detail: "" };
    feter({ etiquette: pop.etiquette, titre: nom, detail: SENS_MEDAILLE[niveauApres], son: "medaille", pop,
            visuel: visuelEspece(espece, medaille, dessinMedaille(medaille, niveauApres)) });
  } else if (apres !== avant && apres === "identifiée") {
    annoncerNouvelleEspece(espece, "rejoint l'encyclopédie");   // étape 206
  } else if (apres !== avant) {
    afficherBulle(`✦ ${nom} : ${apres}`);
  }

  afficherStats();
  sauvegarder();                                   // ← on range tout dans le tiroir

  // La session avance d'une question ; le bouton annonce la suite
  const boutonSuivant = document.getElementById("suivant");
  if (session) {
    session.faites = session.faites + 1;
    if (session.focus && !session.enRejeu) session.normalesFaites = session.normalesFaites + 1;   // étape 156
    if (estJuste) session.bonnes = session.bonnes + 1;
    // Étape R101 : le score d'une Rencontre sépare les questions numérotées, les reprises de la fin et le bonus
    if (session.focus && champ !== OUVERTURE && !session.enBonus && !session.enRejeu) {
      session.numerotees = (session.numerotees || 0) + 1;
      if (estJuste) session.bonnesNumerotees = (session.bonnesNumerotees || 0) + 1;
    } else if (session.focus && session.enBonus) {
      session.bonusPose = true; session.bonusJuste = !!estJuste;
    } else if (session.focus && session.enRejeu) {
      session.reprisesPosees = (session.reprisesPosees || 0) + 1;
      if (estJuste) session.reprisesJustes = (session.reprisesJustes || 0) + 1;
    }
    // Rencontre à une espèce (étape 74) : s'il n'y a plus rien à demander, elle s'arrête là
    if (session.focus && session.faites < session.total && !resteAQuestionner()) session.total = session.faites;
    boutonSuivant.textContent = (session.faites >= session.total) ? "Voir le résultat →"
                              : session.focus ? "Question suivante →" : "Rencontre suivante →";
  }
  boutonSuivant.classList.remove("cache");
  noterDansHistorique();                           // étape 247 : pour pouvoir la revoir avec « ← Question précédente »
}


// ==================================================================
// 7 bis. JOUER AU CLAVIER (étape 20)
//    Le navigateur nous prévient à chaque touche enfoncée ("keydown").
//    On ne réagit que pendant une question de la Rencontre.
//      & é " '  (ou 1 2 3 4)  → choisir la réponse n° 1, 2, 3 ou 4
//      flèches                → réponse suivante / précédente
//      Entrée                 → valider le choix ; puis question suivante
// ==================================================================
const TOUCHES_REPONSES = { "&": 0, "é": 1, '"': 2, "'": 3, "1": 0, "2": 1, "3": 2, "4": 3 };

function auClavier(evenement) {
  // Étape 247 : la fenêtre des questions précédentes est ouverte → Échap ou Entrée la ferment, ‹ › naviguent
  if (historiqueOuvert()) {
    if (["Escape", "Enter"].includes(evenement.key)) { evenement.preventDefault(); fermerHistorique(); }
    else if (evenement.key === "ArrowLeft") ouvrirHistorique(indexHistorique - 1);
    else if (evenement.key === "ArrowRight") ouvrirHistorique(indexHistorique + 1);
    return;
  }
  // Étape 142 : une fête est ouverte → Entrée, Échap ou Espace la ferment, et rien d'autre
  if (feteOuverte && ["Enter", "Escape", " "].includes(evenement.key)) { evenement.preventDefault(); fermerFete(); return; }
  // Étape 164 : une annonce de fin de Rencontre → Entrée lance la suite
  const annonce = document.querySelector("#reponses .bouton-annonce");
  if (annonce && evenement.key === "Enter" && !document.getElementById("vue-rencontre").classList.contains("cache")) { evenement.preventDefault(); annonce.click(); return; }
  // La carte de question est-elle à l'écran ? Sinon, on ne fait rien.
  const carte = document.getElementById("carte-rencontre");
  if (document.getElementById("vue-rencontre").classList.contains("cache") || carte.classList.contains("cache")) return;
  if (evenement.ctrlKey || evenement.altKey || evenement.metaKey) return;      // raccourcis du navigateur : on n'y touche pas

  const touche = evenement.key;
  // Étape 95 : le Portrait a ses propres boutons
  if (document.getElementById("valider-portrait")) { clavierPortrait(evenement); return; }
  const boutons = [...document.querySelectorAll("#reponses .reponse")];        // les réponses, dans l'ordre
  // « Je ne sais pas » (étape 95) : atteint avec les flèches, comme une réponse de plus (pas de touche chiffre)
  const jeNeSaisPas = document.getElementById("je-ne-sais-pas");
  if (boutons.length && !boutons[0].disabled && !jeNeSaisPas.classList.contains("cache") && jeNeSaisPas.offsetParent) boutons.push(jeNeSaisPas);
  const dejaRepondu = boutons.length === 0 || boutons[0].disabled;

  // ---- Après la réponse : Entrée = question suivante ----
  if (dejaRepondu) {
    const suivant = document.getElementById("suivant");
    if (touche === "Enter" && !suivant.classList.contains("cache")) { evenement.preventDefault(); suivant.click(); }
    return;
  }

  // ---- Pendant la question ----
  let position = boutons.findIndex(b => b.classList.contains("choisie"));      // -1 = rien de choisi
  // photos : 2 par ligne ; dans la Rencontre (étape 155), les réponses écrites aussi
  const parLigne = (document.getElementById("reponses").classList.contains("grille-photos")
                    || (document.getElementById("carte-rencontre").classList.contains("avec-postit") && innerWidth > 760)) ? 2 : 1;

  if (touche in TOUCHES_REPONSES) {
    if (TOUCHES_REPONSES[touche] >= boutons.filter(b => b.id !== "je-ne-sais-pas").length) return;   // ex : touche 3 sur un vrai / faux
    position = TOUCHES_REPONSES[touche];
  } else if (touche === "ArrowDown" || touche === "ArrowRight") {
    const pas = touche === "ArrowDown" ? parLigne : 1;
    position = position === -1 ? 0 : Math.min(position + pas, boutons.length - 1);
  } else if (touche === "ArrowUp" || touche === "ArrowLeft") {
    const pas = touche === "ArrowUp" ? parLigne : 1;
    position = position === -1 ? boutons.length - 1 : Math.max(position - pas, 0);
  } else if (touche === "Enter") {
    evenement.preventDefault();                      // sinon le navigateur "cliquerait" aussi le bouton actif
    if (position !== -1) boutons[position].click();  // on valide : comme un clic de souris
    return;
  } else {
    return;                                          // toute autre touche : rien
  }

  evenement.preventDefault();                        // les flèches ne font pas défiler la page
  for (const b of boutons) b.classList.remove("choisie");
  boutons[position].classList.add("choisie");
}


// ---- Le Portrait au clavier (étape 95) ----
//   1 2 3 (ou & é ")  → choisir le dessin n° 1, 2 ou 3 du trait en cours, puis passer au trait suivant
//   ← →               → dessin précédent / suivant (et le choisir)
//   ↑ ↓               → trait précédent / suivant
//   Entrée            → valider si tout est choisi ; sinon, aller au premier trait sans réponse
function clavierPortrait(evenement) {
  const touche = evenement.key;
  const lignes = [...document.querySelectorAll("#reponses .ligne-trait")];
  let active = lignes.findIndex(l => l.classList.contains("active"));
  const premiereVide = () => defi.lignes.findIndex(l => l.choix === null);
  const activer = i => { lignes.forEach((l, k) => l.classList.toggle("active", k === i)); active = i; };
  if (active === -1) activer(Math.max(0, premiereVide()));
  const options = () => [...lignes[active].querySelectorAll(".option-trait")];
  const choisir = i => { const o = options(); if (o[i]) o[i].click(); };
  const enCoursChoisie = () => options().findIndex(o => o.classList.contains("choisie"));
  if (touche in TOUCHES_REPONSES) {
    evenement.preventDefault();
    choisir(TOUCHES_REPONSES[touche]);
    const suivante = premiereVide();
    if (suivante !== -1) activer(suivante);                     // le trait suivant encore sans réponse
  } else if (touche === "ArrowRight" || touche === "ArrowLeft") {
    evenement.preventDefault();
    const n = options().length, i = enCoursChoisie();
    choisir(i === -1 ? (touche === "ArrowRight" ? 0 : n - 1) : (i + (touche === "ArrowRight" ? 1 : n - 1)) % n);
  } else if (touche === "ArrowDown" || touche === "ArrowUp") {
    evenement.preventDefault();
    activer(Math.min(lignes.length - 1, Math.max(0, active + (touche === "ArrowDown" ? 1 : -1))));
  } else if (touche === "Enter") {
    evenement.preventDefault();
    const valider = document.getElementById("valider-portrait");
    if (!valider.disabled) valider.click(); else activer(premiereVide());
  }
}
