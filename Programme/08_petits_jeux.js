// 08_petits_jeux.js — Duel, Espèce mystère, les découvertes et Portrait-robot.
// Une partie du programme du jeu, chargée par jeu.html dans l'ordre des numéros.

// ==================================================================
// 11 quater. DEUX AUTRES DÉFIS (étape 42)
//    Ils se lancent comme le défi de rapidité (même écran, mêmes périmètres,
//    même accès), mais ils ne sont pas chronométrés.
//      A. des outils pour comparer ce que le joueur écrit à la réponse attendue
//      B. Duo · Carré · Cash
//      C. Qui est-ce ?
//      D. Plus ou moins (étape 43)
// ==================================================================

// ---- A. Les outils de saisie ----------------------------------------
// On compare des textes "simplifiés" : en minuscules, sans accents, sans ponctuation,
// sans l'article du début. "Le Gypaète" et "gypaete" deviennent tous deux "gypaete".
function simplifier(texte) {
  return String(texte).toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")       // sépare les accents des lettres, puis les retire
    .replace(/œ/g, "oe").replace(/æ/g, "ae")
    .replace(/[^a-z0-9]+/g, " ").trim()                      // tout ce qui n'est ni lettre ni chiffre devient un espace
    .replace(/^(le|la|les|l|un|une|des|du|de|d) /, "");      // l'article du début
}

// Le nombre de fautes de frappe entre deux textes : une lettre en trop, en moins ou changée
// compte pour 1. ("chamoi" / "chamois" → 1 ; "marmote" / "marmotte" → 1)
function ecart(a, b) {
  let ligne = [...Array(b.length + 1).keys()];               // 0, 1, 2… : la ligne de départ du calcul
  for (let i = 1; i <= a.length; i++) {
    const nouvelle = [i];
    for (let j = 1; j <= b.length; j++) {
      nouvelle[j] = Math.min(ligne[j] + 1, nouvelle[j - 1] + 1, ligne[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    ligne = nouvelle;
  }
  return ligne[b.length];
}















// ---- C. Qui est-ce ? ------------------------------------------------
// Une espèce est à retrouver parmi 6 photos (le "plateau"). Les indices s'ajoutent un à un,
// à la demande : ce sont les phrases des fiches ("Il est actif surtout la nuit."). Chaque
// indice permet d'écarter une ou plusieurs photos ; le joueur clique sur l'espèce dès qu'il
// pense l'avoir trouvée. Moins il a fallu d'indices, plus elle rapporte.
// Le jeu ne porte que sur des espèces déjà identifiées (étape 57). Les indices lus entrent
// dans la fiche de l'espèce retrouvée (étape 55).

// Les chiffres qu'on peut estimer en regardant une photo. Les autres (longévité, gestation…)
// ne servent d'indice qu'en dernier recours : ils n'aident pas à écarter une photo.
const CHIFFRES_PARLANTS = ["taille_max_cm", "poids_max_kg", "envergure_max_cm"];
// Même chose pour le niveau d'extinction : presque toujours le même, il ne dit rien de l'animal.
const INDICES_PEU_PARLANTS = ["statut_conservation"];

// Tous les indices qu'on peut donner sur une espèce
function indicesPossibles(espece) {
  const tous = [];
  for (const q of questionsPossibles(espece)) {
    if (q.format && q.format !== "picto") continue;          // pas d'empreinte ni de cri (le portrait, si : étape 70)
    if (q.sansImage) continue;                               // "garde sa queue" : pas un trait qui se voit
    const valeur = q.tirer ? q.tirer(espece) : valeurDe(espece, q);
    if (typeof valeur === "string" && seDevineDuNom(espece, valeur)) continue;   // l'indice soufflerait le nom
    tous.push({ q, valeur, texte: q.explication(espece, valeur),
                parlant: !INDICES_PEU_PARLANTS.includes(q.champ) && (q.type !== "nombre" || CHIFFRES_PARLANTS.includes(q.champ)) });
  }
  return tous;
}

// L'indice est-il vrai AUSSI pour cette autre espèce ? Si oui, il ne permet pas de l'écarter.
function vraiAussiPour(autre, indice) {
  // Indice du portrait physique (étape 70) : le joueur compare avec ce qu'il VOIT sur la photo.
  // On lit donc la valeur telle qu'elle est dans le tableur, même "à confirmer", pour ne pas
  // écarter par erreur une photo qui montre la même chose.
  if (indice.q.format === "picto") {
    if (indice.q.onglets && !indice.q.onglets.includes(autre.onglet)) return false;   // un bec pour un mammifère : écartée
    const vue = indice.q.lecture(autre);
    if (vue === null || vue === undefined) return true;      // case vide : on ne sait pas
    if (String(vue).startsWith("NA")) return false;          // elle n'en a pas (pas de cornes…) : écartée
    const voisines = (indice.q.proches || {})[indice.valeur] || [];   // roux pour brun : trop proche pour écarter
    // Étape 135 : une couleur citée dans sa description ne permet pas non plus de l'écarter
    if (indice.q.champ === "couleur_dominante" && couleursCitees(autre).includes(indice.valeur)) return true;
    if (indice.q.champ === "couleur_dominante" && listeCouleursPlumage(autre).includes(indice.valeur)) return true;   // étape R135
    if (aussiVraiPour(indice.q, autre, indice.valeur)) return true;   // étape 137 : ex. le bec « jaune » du faucon
    // Étape R134 : toute pupille est noire, l'indice « yeux noirs » ne permet donc d'écarter aucun oiseau
    if (indice.q.champ === "yeux_couleur" && ["Noir", "Brun"].includes(indice.valeur)) return true;
    return vue === indice.valeur || voisines.includes(vue);
  }
  const v = valeurDe(autre, indice.q);
  if (v === null || v === undefined) return true;            // case vide : on ne sait pas, on ne l'écarte pas
  if (String(v).startsWith("NA")) return false;              // non applicable : écartée
  // Un chiffre "se ressemble" à 25 % près : 30 cm et 37 cm ne se départagent pas à l'œil
  if (indice.q.type === "nombre") return typeof v === "number" && Math.abs(v - indice.valeur) <= 0.25 * indice.valeur;
  if (piegeInterdit(indice.q, indice.valeur, v)) return true;   // étape 135 : « carnivore » n'écarte pas un insectivore
  if (aussiVraiPour(indice.q, autre, indice.valeur)) return true;  // étape 137 : groupes d'aliments, de prédateurs
  return valeursDe(autre, indice.q).some(x => String(x).toLowerCase() === String(indice.valeur).toLowerCase());
}

// Choisir les indices d'une manche, pour l'espèce à retrouver et les autres photos du plateau.
// Chaque indice doit écarter au moins une photo encore possible. Les premiers en écartent peu
// (répondre tôt est un pari), les suivants resserrent, jusqu'à ne laisser que la bonne.
function choisirIndices(espece, autres) {
  const possibles = indicesPossibles(espece);
  for (const indice of possibles) indice.ecarte = autres.filter(a => !vraiAussiPour(a, indice));
  let restantes = autres.slice();                            // les photos pas encore écartées
  const choisis = [];
  for (let i = 0; i < NB_INDICES; i++) {
    const libres = melanger(possibles.filter(indice => !choisis.includes(indice)));
    // Les indices utiles : ceux qui écartent au moins une photo restante
    let utiles = libres.filter(indice => indice.ecarte.some(a => restantes.includes(a)));
    if (utiles.length === 0) {
      if (choisis.length >= 3 || libres.length === 0) break; // plus rien à départager : on s'arrête là
      utiles = libres;                                       // (au moins trois indices par espèce)
    }
    const parlants = utiles.filter(indice => indice.parlant);
    if (parlants.length) utiles = parlants;
    // Étape 138 (retour du testeur, remplace l'étape 77) : d'abord les indices LARGES (mode de vie),
    // l'apparence en dernier — sinon « a des antennes » désignait l'espèce dès le premier indice.
    const vie = utiles.filter(indice => indice.q.format !== "picto");
    if (vie.length && i < NB_INDICES - 1) utiles = vie;
    const force = indice => indice.ecarte.filter(a => restantes.includes(a)).length;
    // Étape 138 : avant le dernier indice, jamais un indice qui écarte TOUTES les autres photos d'un coup
    if (i < NB_INDICES - 1) {
      const pasDecisifs = utiles.filter(indice => force(indice) < restantes.length);
      if (pasDecisifs.length) utiles = pasDecisifs;
    }
    utiles.sort((a, b) => force(a) - force(b));              // du moins décisif au plus décisif
    // Le dernier indice est le plus décisif. Les autres sont tirés au hasard parmi les moins décisifs
    // (ceux qui écartent le moins de photos, à une photo près) : la manche se resserre peu à peu,
    // et ce n'est pas toujours le même indice qui l'ouvre.
    const moinsDecisifs = utiles.filter(indice => force(indice) <= force(utiles[0]) + 1);
    const choix = (i === NB_INDICES - 1) ? utiles[utiles.length - 1] : auHasard(moinsDecisifs);
    choisis.push(choix);
    restantes = restantes.filter(a => !choix.ecarte.includes(a));
  }
  // Étape 138 : à la fin, une seule espèce doit rester possible. Sinon, on ajoute des indices (3 au plus),
  // les plus décisifs d'abord, jusqu'à ce qu'il ne reste qu'elle.
  for (let extra = 0; restantes.length && extra < 3; extra++) {
    const force = indice => indice.ecarte.filter(a => restantes.includes(a)).length;
    const libres = possibles.filter(indice => !choisis.includes(indice) && force(indice) > 0);
    if (!libres.length) break;
    const choix = libres.sort((a, b) => force(b) - force(a))[0];
    choisis.push(choix);
    restantes = restantes.filter(a => !choix.ecarte.includes(a));
  }
  return choisis;
}

// Les espèces qu'on peut montrer sur un plateau : identifiées, et avec une photo (étape 57)
// Étape 274 : dans « Plus de jeux » (accesTout), toutes les espèces avec une photo, découvertes ou non
function especesPlateau(especes) {
  const tout = accesTout();
  return especes.filter(e => estRenseigne(e.photo) && (tout || estIdentifiee(e)));
}
// Les espèces qu'on peut faire deviner : il faut assez d'espèces identifiées pour faire un plateau
function ciblesIndices(especes) {
  const montrables = especesPlateau(especes);
  return montrables.length < MINIMUM_INDICES ? [] : montrables.filter(e => indicesPossibles(e).length >= 2);
}

function demarrerIndices() {
  defi.candidates = especesPlateau(defi.especes);
  // Les espèces à retrouver : 5
  defi.cibles = melanger(ciblesIndices(defi.especes)).slice(0, MANCHES_INDICES);
  defi.total = defi.cibles.length;
  nouvelleManche();
}

// Combien vaut l'espèce en ce moment : 5 points avec un indice, 4 avec deux… 1 au minimum
function valeurManche() {
  return Math.max(1, NB_INDICES + 1 - defi.montres);
}

function nouvelleManche() {
  const espece = defi.cibles[defi.faites];
  defi.cible = espece;
  // Le plateau : l'espèce à retrouver + 5 autres, de préférence de la même famille
  const autres = melanger(defi.candidates.filter(e => e !== espece));
  const memeFamille = autres.filter(e => e.onglet === espece.onglet);
  const lesAutres   = autres.filter(e => e.onglet !== espece.onglet);
  defi.plateau = [...memeFamille, ...lesAutres].slice(0, PHOTOS_PLATEAU - 1);
  defi.indices = choisirIndices(espece, defi.plateau);
  defi.montres = 0;                                          // combien d'indices sont affichés
  defi.fini = false;
  defi.numero = defi.faites + 1;
  enCours = { espece, champ: IDENTIFICATION, explication: "", q: null, bonne: null };

  // Remise à zéro de la carte : pas de grande photo, pas de nom
  arreterCri();
  document.getElementById("carte-pop").classList.remove("visible");
  const photo = document.getElementById("photo-rencontre");
  photo.classList.add("cache");
  photo.classList.remove("grande", "cadre-empreinte", "cadre-son", "devoile");
  photo.innerHTML = "";
  const famille = document.getElementById("famille");
  famille.textContent = espece.nom_affichage_groupe;
  famille.classList.add("cache");
  document.getElementById("nom").textContent = "Qui est-ce ?";
  document.getElementById("compteur-rencontre").textContent = "";
  document.getElementById("revision").textContent = "";
  document.getElementById("question").textContent = "";
  document.getElementById("affirmation").classList.add("cache");
  document.getElementById("retour").textContent = "";
  document.getElementById("suivant").classList.add("cache");

  const zone = document.getElementById("reponses");
  zone.className = "";
  // Étape 205 (retour du 18/10) : le bouton « Indice suivant » passe AU-DESSUS des photos, en bouton plein
  zone.innerHTML = `<ol class="indices" id="liste-indices"></ol>
    <div class="actions-indices haut">
      <button class="bouton-indice" id="indice-suivant">+ Indice suivant</button>
      <p class="valeur-manche" id="valeur-manche"></p>
    </div>
    <div class="grille-plateau" id="plateau"></div>
    <div class="actions-indices bas">
      <button class="passer" id="bouton-passer">Passer cette espèce</button>
    </div>`;
  // Les 6 photos, mélangées. Un clic sur une photo = "c'est elle".
  const plateau = document.getElementById("plateau");
  for (const e of melanger([espece, ...defi.plateau])) {
    const bouton = document.createElement("button");
    bouton.className = "reponse choix-photo";
    bouton.innerHTML = `<div class="photo">${celluleImage(e, true)}</div><div class="legende">${e.nom_courant}</div>`;
    if (e === espece) bouton.dataset.juste = "oui";
    bouton.onclick = () => proposerEspece(e, bouton);
    plateau.appendChild(bouton);
  }
  document.getElementById("indice-suivant").onclick = montrerIndice;
  document.getElementById("bouton-passer").onclick = () => finirManche(false);
  montrerIndice();
  afficherHud();
}

// Une ligne d'indice : son picto (indices du portrait, étape 77), puis sa phrase
function htmlIndice(indice, classe) {
  const picto = indice.q.format === "picto" && !indice.q.sansImage
    ? `<span class="picto-indice">${dessinReponse(indice.q.colonnePicto, indice.valeur)}</span>` : "";
  return `<li class="${classe}${picto ? " avec-picto" : ""}">${picto}<span>${indice.texte}</span></li>`;
}

// Ajouter l'indice suivant à la liste
function montrerIndice() {
  const indice = defi.indices[defi.montres];
  defi.montres = defi.montres + 1;
  document.getElementById("liste-indices").insertAdjacentHTML("beforeend", htmlIndice(indice, ""));
  const points = valeurManche();
  document.getElementById("valeur-manche").textContent =
    `Trouvée maintenant, cette espèce rapporte ${points} point${points > 1 ? "s" : ""}.`;
  const reste = defi.indices.length - defi.montres;
  const bouton = document.getElementById("indice-suivant");
  bouton.disabled = reste === 0;
  bouton.textContent = reste === 0 ? "Plus d'indice" : `+ Indice suivant (${reste})`;
}

// Le joueur clique sur une photo du plateau
function proposerEspece(espece, bouton) {
  if (defi.fini || bouton.classList.contains("ecartee")) return;
  if (espece === defi.cible) { finirManche(true); return; }
  // Mauvaise photo : elle est écartée, et cela coûte un indice. S'il n'y en a plus, l'espèce est perdue.
  bouton.classList.add("ecartee");
  bouton.classList.remove("choisie");
  if (defi.montres >= defi.indices.length) { finirManche(false); return; }
  document.getElementById("retour").textContent = `Ce n'est pas : ${espece.nom_courant}. Un indice de plus.`;
  montrerIndice();
}

// Fin d'une espèce : trouvée (des points) ou non (0 point, sans rien retirer)
function finirManche(trouvee) {
  defi.fini = true;
  const espece = defi.cible;
  const points = trouvee ? valeurManche() : 0;
  // La bonne photo s'entoure de vert ; le nom et la famille s'affichent en haut
  for (const b of document.querySelectorAll("#plateau .reponse")) {
    b.disabled = true;
    if (b.dataset.juste === "oui") { b.classList.add("juste"); b.classList.remove("ecartee"); }
  }
  document.getElementById("nom").textContent = espece.nom_courant;
  document.getElementById("famille").classList.remove("cache");
  // On retire les boutons ; les indices pas encore donnés s'affichent en pointillés
  for (const element of document.querySelectorAll("#reponses .actions-indices, #valeur-manche")) element.remove();
  for (const indice of defi.indices.slice(defi.montres)) {
    document.getElementById("liste-indices").insertAdjacentHTML("beforeend", htmlIndice(indice, "reste"));
  }

  const retour = document.getElementById("retour");
  if (trouvee) {
    defi.score = defi.score + points;
    defi.xpBase = defi.xpBase + points * XP_POINT_INDICES;
    defi.bonnes = defi.bonnes + 1;
    // La retrouver confirme sa reconnaissance (la case "photo" de sa fiche)
    noterAuBilan(espece, IDENTIFICATION, "retrouvée grâce aux indices");
    acquerir(espece, IDENTIFICATION);
    // Les indices lus entrent dans sa fiche (étape 55) : une case nouvelle est apprise, une case
    // déjà trouvée ne bouge pas (lire un indice n'est pas le retrouver).
    for (const indice of defi.indices.slice(0, defi.montres)) {
      if (nbBonnes(espece, indice.q.champ) >= 1) continue;
      noterAuBilan(espece, indice.q.champ, `${indice.q.libelle} : ${afficherValeur(indice.q, indice.valeur)}`);
      acquerir(espece, indice.q.champ);
    }
    retour.textContent = `Bravo ! +${points} point${points > 1 ? "s" : ""}, avec ${defi.montres} indice${defi.montres > 1 ? "s" : ""}.`;
    jouerSon();
  } else {
    retour.textContent = `C'était : ${espece.nom_courant}.`;
    jouerSon("mauvaise");                               // étape 170 : le hou-hou de chouette
    defi.rates.push({ nom: espece.nom_courant, explication: defi.indices[defi.indices.length - 1].texte });
  }
  defi.faites = defi.faites + 1;
  afficherHud();
  sauvegarder();
  const suivant = document.getElementById("suivant");
  suivant.textContent = defi.faites >= defi.total ? "Voir le résultat →" : "Espèce suivante →";
  suivant.classList.remove("cache");
}


// ==================================================================
// 11 septies. LES DÉCOUVERTES (étape 73)
//    Dans chaque partie, 1 ou 2 espèces inconnues se glissent. On les découvre
//    en les reconnaissant sur leur photo : l'encyclopédie ne contient que ce qui a été trouvé.
//      Rencontre            → déjà le cas (l'Apparition ; avec le chronomètre, defi.nouvelles)
//      Qui est-ce ?, Plus ou moins → une photo à reconnaître, glissée entre deux manches
//    Une espèce ratée n'est pas perdue : elle revient en priorité dans une prochaine partie.
// ==================================================================
const NOUVELLES_PAR_PARTIE = 2;                          // espèces inconnues glissées dans chaque partie
const RYTHME_DECOUVERTE = { plus: 4, indices: 2, portrait: 2, rangement: 1 };   // une découverte toutes les N manches

// Choisir "combien" espèces à découvrir : d'abord celles qui se sont déjà montrées sans être reconnues,
// puis de nouvelles, tirées selon leur rareté (les communes sortent plus souvent)
function especesADecouvrir(especes, combien) {
  const aReconnaitre = especes.filter(e => estRenseigne(e.photo) && !estIdentifiee(e));
  const dejaVues = melanger(aReconnaitre.filter(e => estVue(e)));
  const jamaisVues = aReconnaitre.filter(e => !estVue(e));
  return [...dejaVues, ...tirerSelonRarete(jamaisVues, jamaisVues.length)].slice(0, combien);
}

// Que vient-il après une manche ? La fin, une découverte si c'est son tour, ou la manche suivante.
function suiteDuJeu() {
  if (defi.essaiInsolites) { suiteEssaiInsolites(); return; }   // étape QI3b : l'essai des questions insolites (21)
  if (defi.faites >= defi.total) { terminerDefi(); return; }
  if (defi.aDecouvrir && defi.aDecouvrir.length && defi.faites >= defi.prochaineDecouverte) { poserDecouverte(); return; }
  if (defi.jeu === "plus") nouveauDuel();
  else if (defi.jeu === "indices") nouvelleManche();
  else if (defi.jeu === "portrait") nouveauPortrait();
  else nouvelleRencontre();
}

// Une espèce inconnue apparaît : la reconnaître sur sa photo
function poserDecouverte() {
  const espece = defi.aDecouvrir.shift();               // shift() = on prend la première de la liste et on l'en retire
  defi.prochaineDecouverte = defi.prochaineDecouverte + (defi.rythme || RYTHME_DECOUVERTE[defi.jeu]);
  defi.decouverte = true;                               // la réponse sera traitée par repondreDecouverte
  derniereEspece = espece;
  enCours = { espece, champ: IDENTIFICATION, explication: "", q: null, bonne: null };
  arreterCri();
  document.getElementById("carte-pop").classList.remove("visible");
  document.getElementById("compteur-rencontre").textContent = "";
  document.getElementById("revision").textContent = "Une espèce inconnue…";
  document.getElementById("retour").textContent = "";
  document.getElementById("affirmation").classList.add("cache");
  document.getElementById("suivant").classList.add("cache");
  const zone = document.getElementById("reponses");
  zone.innerHTML = "";
  zone.className = "";
  poserIdentification(espece);                          // la même question que dans la Rencontre (partie 6a)
  afficherHud();
}

function repondreDecouverte(boutonClique, estJuste) {
  const espece = enCours.espece;
  defi.decouverte = false;
  for (const b of document.querySelectorAll(".reponse")) {
    b.disabled = true;
    if (b.dataset.juste === "oui") b.classList.add("juste");
  }
  document.getElementById("nom").textContent = espece.nom_courant;
  document.getElementById("famille").classList.remove("cache");
  marquerVue(espece);                                   // elle s'est montrée : elle reviendra en priorité si elle est ratée
  const retour = document.getElementById("retour");
  if (estJuste) {
    noterAuBilan(espece, IDENTIFICATION);               // dans "Découvert" (AVANT le +1)
    acquerir(espece, IDENTIFICATION);
    annoncerNouvelleEspece(espece, "rejoint l'encyclopédie");      // étape 206
    retour.textContent = "Bravo ! " + enCours.explication;
    jouerSon();
  } else {
    boutonClique.classList.add("fausse");
    jouerSon("mauvaise");                               // étape 170 : le hou-hou de chouette
    aRevoirPlusTard(espece, IDENTIFICATION);
    retour.textContent = enCours.explication + " Elle reviendra.";
  }
  sauvegarder();
  afficherStats();
  const suivant = document.getElementById("suivant");
  suivant.textContent = "Continuer →";
  suivant.classList.remove("cache");
  noterDansHistorique();                           // étape 248
}


// ---- D. Plus ou moins (étape 43) --------------------------------------
// Deux espèces, une question sur un chiffre de leurs fiches : laquelle en a le plus (ou le moins) ?
// Le joueur clique sur une des deux photos ; les deux chiffres s'affichent ensuite.
// Depuis l'étape 55 : toutes les espèces du défi peuvent être comparées, et après une BONNE
// réponse les deux chiffres entrent dans les fiches (appris, ou confirmés s'ils y étaient déjà).
// Étape 56 : une espèce seulement croisée ici reste "inconnue" dans l'encyclopédie.

// Les questions, par caractéristique chiffrée : une phrase pour "le plus", une pour "le moins".
// La taille et le nombre de petits ont des phrases qui dépendent de l'animal (voir phrasesDuel).
const PHRASES_DUEL = {
  longevite_max_annees: { plus: "Lequel vit le plus longtemps ?", moins: "Lequel vit le moins longtemps ?" },
  poids_max_kg:         { plus: "Lequel est le plus lourd ?", moins: "Lequel est le plus léger ?" },
  gestation_jours:      { plus: "Chez lequel la gestation est-elle la plus longue ?", moins: "Chez lequel la gestation est-elle la plus courte ?" },
  incubation_jours:     { plus: "Chez lequel les œufs mettent-ils le plus de temps à éclore ?", moins: "Chez lequel les œufs mettent-ils le moins de temps à éclore ?" },
  envergure_max_cm:     { plus: "Lequel a la plus grande envergure ?", moins: "Lequel a la plus petite envergure ?" },
  // L'altitude se compare entre toutes les familles ; seule la question "le plus" est posée (étape 59)
  altitude_max_m:       { plus: "Lequel vit à l'altitude la plus élevée ?" },
  nb_dents:             { plus: "Lequel a le plus de dents ?", moins: "Lequel a le moins de dents ?" },   // étape 70
  vitesse_max_kmh:      { plus: "Lequel est le plus rapide ?", moins: "Lequel est le moins rapide ?" },   // étape 119
  taille_max_cm:        {},                                  // selon ce qui est mesuré
  nb_petits_max:        {},                                  // selon la famille
};
const PHRASES_TAILLE = {
  garrot:  { plus: "Lequel est le plus haut au garrot ?", moins: "Lequel est le moins haut au garrot ?" },
  corps:   { plus: "Lequel a le corps le plus long, sans la queue ?", moins: "Lequel a le corps le plus court, sans la queue ?" },
  oiseau:  { plus: "Lequel est le plus long, du bec à la queue ?", moins: "Lequel est le plus court, du bec à la queue ?" },
  totale:  { plus: "Lequel est le plus long ?", moins: "Lequel est le plus court ?" },
  insecte: { plus: "Lequel a le corps le plus long ?", moins: "Lequel a le corps le plus court ?" },
};
// Ce que mesure la taille d'une espèce ("garrot", "corps"…) : même règle qu'à l'étape 30
function cleMesure(espece) {
  return MESURE_PAR_ESPECE[espece.nom_courant] || MESURE_PAR_FAMILLE[espece.onglet];
}
function phrasesDuel(champ, espece) {
  if (champ === "taille_max_cm") return PHRASES_TAILLE[cleMesure(espece)];
  if (champ === "nb_petits_max") {
    return espece.onglet === "Oiseaux"
      ? { plus: "Lequel pond le plus d'œufs par couvée ?", moins: "Lequel pond le moins d'œufs par couvée ?" }
      : { plus: "Lequel a le plus de petits par portée ?", moins: "Lequel a le moins de petits par portée ?" };
  }
  return PHRASES_DUEL[champ];
}
// Deux espèces se comparent-elles sur cette caractéristique ? Pour la taille, il faut la même
// mesure (on ne compare pas une hauteur au garrot à une longueur) ; pour les petits, la même famille.
function comparables(champ, a, b) {
  if (champ === "taille_max_cm") return cleMesure(a) === cleMesure(b);
  if (champ === "nb_petits_max") return a.onglet === b.onglet;
  if (champ === "vitesse_max_kmh") return a.onglet === b.onglet;   // étape 119 : on ne compare pas une course à un vol
  return true;
}

// Étape 205 (retour « Vraiment ? » du 18/10) : quand un chiffre est au moins 2 fois plus grand que l'autre,
// une phrase le dit en clair : « L'orvet fragile peut vivre jusqu'à 30 ans, près de 4 fois plus longtemps que le hérisson d'Europe. »
const VERBES_DUEL = {
  longevite_max_annees: ["peut vivre jusqu'à", "plus longtemps"],
  poids_max_kg:         ["peut peser jusqu'à", "plus"],
  vitesse_max_kmh:      ["peut atteindre", "plus vite"],
  altitude_max_m:       ["monte jusqu'à", "plus haut"],
  taille_max_cm:        ["mesure jusqu'à", "plus"],
};
function phraseEtonnante(duel) {
  const v = VERBES_DUEL[duel.champ];
  if (!v || !(duel.va > 0 && duel.vb > 0)) return "";
  const [grand, petit, vg] = duel.va >= duel.vb ? [duel.a, duel.b, duel.va] : [duel.b, duel.a, duel.vb];
  const k = Math.max(duel.va, duel.vb) / Math.min(duel.va, duel.vb);
  if (k < 2) return "";
  const n = Math.round(k);
  const fois = `${k < n - 0.05 ? "près de " : k > n + 0.05 ? "plus de " : ""}${n} fois`;
  const nomG = nomAvecArticle(grand);
  return `${nomG.charAt(0).toUpperCase() + nomG.slice(1)} ${v[0]} ${chiffreDuel(duel.q, grand, vg)}, ${fois} ${v[1]} que ${nomAvecArticle(petit)}.`;
}

// Le chiffre d'une espèce, écrit comme dans sa fiche ("17 ans", "350 g"). Le nombre de petits
// n'a pas d'unité dans la fiche : on l'ajoute ici ("4 petits", "5 œufs").
function chiffreDuel(q, espece, v) {
  if (q.champ !== "nb_petits_max") return q.affichage(v);
  const mot = espece.onglet === "Oiseaux" ? "œuf" : "petit";
  return `${nombre(v)} ${mot}${v > 1 ? "s" : ""}`;
}

// Tous les duels possibles entre les espèces d'un défi
function duelsPossibles(especes, unSeul) {
  const montrables = especes.filter(e => estRenseigne(e.photo));   // celles qui ont une photo, identifiées ou non
  const duels = [];
  for (const champ in PHRASES_DUEL) {
    const q = QUESTIONS.find(q => q.champ === champ);
    const avec = montrables.filter(e => questionsPossibles(e).includes(q));   // celles qui ont ce chiffre
    for (let i = 0; i < avec.length; i++) {
      for (let j = i + 1; j < avec.length; j++) {
        const a = avec[i], b = avec[j];
        if (!comparables(champ, a, b)) continue;
        const va = valeurDe(a, q), vb = valeurDe(b, q);
        const rapport = Math.max(va, vb) / Math.min(va, vb);  // 2 = l'un vaut le double de l'autre
        if (!(rapport >= ECART_MINIMUM)) continue;            // trop proches (ou zéro) : pas de duel
        duels.push({ champ, q, a, b, va, vb, rapport });
        if (unSeul) return duels;
      }
    }
  }
  return duels;
}

function demarrerPlus() {
  // Les espèces à découvrir dans cette partie ne sont pas mises en duel : leur nom et leur photo
  // y seraient montrés avant qu'on demande de les reconnaître (étape 73)
  defi.duels = duelsPossibles(defi.especes).filter(d => !defi.aDecouvrir.includes(d.a) && !defi.aDecouvrir.includes(d.b));
  if (defi.duels.length === 0) defi.duels = duelsPossibles(defi.especes);   // sécurité : trop peu d'espèces
  defi.joues = [];                                           // les duels déjà joués dans cette partie
  defi.total = Infinity;                                     // étape 166 : pas de nombre de duels, on joue jusqu'à la dernière vie
  defi.vies = VIES_DUEL;
  // Étape 168 : les deux records du Duel (à la suite, et sur la partie), tous territoires confondus.
  //   La première fois, le record de partie reprend le meilleur score déjà fait au Duel à vies (étapes 166-167).
  if (!suivi.recordPartieDuel) suivi.recordPartieDuel = Math.max(0, ...Object.entries(records)
    .filter(([k]) => k.startsWith("plus:") && k.endsWith(":vies")).map(([, r]) => r.score || 0));
  defi.recordSerieAvant = suivi.recordSerieDuel || 0;
  defi.recordPartieAvant = suivi.recordPartieDuel || 0;
  nouveauDuel();
}

function nouveauDuel() {
  defi.vientDAvancer = defi.vientDeMonter = defi.vientDeTomber = defi.vientDePerdre = false;   // étapes 165-166 : les animations ne rejouent pas
  // 0. Étape 152 : les duels du cran en cours (l'écart entre les deux chiffres). S'il n'y en a aucun,
  //    on prend le cran le plus proche qui en a (en descendant d'abord : plus facile plutôt que plus dur).
  const cran = defi.cran || 0;
  const duCran = c => defi.duels.filter(d => d.rapport >= CRANS_DUEL[c].min && d.rapport < CRANS_DUEL[c].max);
  let candidats = duCran(cran);
  for (const c of [cran - 1, cran - 2, cran + 1, cran + 2]) {
    if (candidats.length) break;
    if (c >= 0 && c < CRANS_DUEL.length) candidats = duCran(c);
  }
  if (!candidats.length) candidats = defi.duels;            // sécurité
  // 1. Une caractéristique au hasard (pas la même que le duel précédent, si possible)
  let champs = [...new Set(candidats.map(d => d.champ))];
  const autres = champs.filter(c => c !== defi.dernierChamp);
  if (autres.length) champs = autres;
  const champ = auHasard(champs);
  defi.dernierChamp = champ;
  // 2. Un duel sur cette caractéristique, dans le cran, pas encore joué.
  //    (Étape 152 : le choix « 70 % de duels serrés » est remplacé par les crans.)
  let liste = candidats.filter(d => d.champ === champ);
  const neufs = liste.filter(d => !defi.joues.includes(d));
  if (neufs.length) liste = neufs;
  const duel = auHasard(liste);
  defi.joues.push(duel);
  defi.duel = duel;
  // 3. "Le plus" ou "le moins" ? Une fois sur trois, on demande le moins.
  defi.sens = Math.random() < 1 / 3 ? "moins" : "plus";
  if (!phrasesDuel(champ, duel.a).moins) defi.sens = "plus";   // pas de phrase "le moins" (l'altitude) : toujours "le plus"
  const aGagne = defi.sens === "plus" ? duel.va > duel.vb : duel.va < duel.vb;
  defi.gagnante = aGagne ? duel.a : duel.b;
  defi.fini = false;
  defi.numero = defi.faites + 1;

  // Remise à zéro de la carte : pas de grande photo, la question en titre
  arreterCri();
  document.getElementById("carte-pop").classList.remove("visible");
  const photo = document.getElementById("photo-rencontre");
  photo.classList.add("cache");
  photo.classList.remove("grande", "cadre-empreinte", "cadre-son", "devoile");
  photo.innerHTML = "";
  document.getElementById("famille").classList.add("cache");
  document.getElementById("nom").textContent = phrasesDuel(champ, duel.a)[defi.sens];
  document.getElementById("compteur-rencontre").textContent = "";
  document.getElementById("revision").textContent = "";
  document.getElementById("question").textContent = "";
  document.getElementById("affirmation").classList.add("cache");
  document.getElementById("retour").textContent = "";
  document.getElementById("suivant").classList.add("cache");

  // Les deux photos, côte à côte, dans un ordre tiré au hasard
  const zone = document.getElementById("reponses");
  zone.innerHTML = "";
  zone.className = "grille-photos";
  for (const e of melanger([duel.a, duel.b])) {
    const bouton = document.createElement("button");
    bouton.className = "reponse choix-photo";
    bouton.innerHTML = `<div class="photo">${celluleImage(e, true)}</div>
                        <div class="legende">${e.nom_courant}</div><div class="valeur-duel"></div>`;
    if (e === defi.gagnante) bouton.dataset.juste = "oui";
    // On garde sous la main le chiffre de cette espèce, pour l'afficher après la réponse
    bouton.dataset.valeur = chiffreDuel(duel.q, e, e === duel.a ? duel.va : duel.vb);
    bouton.onclick = () => repondrePlus(e, bouton);
    zone.appendChild(bouton);
  }
  afficherHud();
}

function repondrePlus(espece, boutonClique) {
  if (defi.fini) return;
  defi.fini = true;
  const duel = defi.duel;
  const estJuste = espece === defi.gagnante;
  // On bloque les deux photos, on entoure la bonne, et on affiche les deux chiffres
  for (const b of document.querySelectorAll("#reponses .reponse")) {
    b.disabled = true;
    if (b.dataset.juste === "oui") b.classList.add("juste");
    b.querySelector(".valeur-duel").textContent = b.dataset.valeur;
  }
  const retour = document.getElementById("retour");
  defi.vientDAvancer = defi.vientDeMonter = defi.vientDeTomber = defi.vientDePerdre = false;
  if (estJuste) {
    defi.serie = defi.serie + 1;
    defi.meilleureSerie = Math.max(defi.meilleureSerie, defi.serie);
    // Étape 167 : le compteur avance ; certains nombres sont des paliers (animés)
    defi.vientDAvancer = true;
    const monte = estPalierSerie(defi.serie);
    defi.vientDeMonter = monte;
    // Étape 152 : tous les 3 duels gagnés d'affilée, les écarts se resserrent (jusqu'au cran le plus dur)
    const cranAvant = defi.cran || 0;
    if (defi.serie % DUELS_PAR_CRAN === 0 && cranAvant < CRANS_DUEL.length - 1) defi.cran = cranAvant + 1;
    const points = 1;                                          // étape 167 : 1 point par bonne réponse, sans multiplicateur
    defi.score = defi.score + points;
    defi.xpBase = defi.xpBase + points * XP_POINT_PLUS;
    defi.bonnes = defi.bonnes + 1;
    // Les deux chiffres entrent dans les fiches (étape 55)
    for (const [e, v] of [[duel.a, duel.va], [duel.b, duel.vb]]) {
      noterAuBilan(e, duel.champ, `${duel.q.libelle} : ${chiffreDuel(duel.q, e, v)}`);   // AVANT le +1
      acquerir(e, duel.champ);
    }
    retour.textContent = "Bravo !" + (defi.cran > cranAvant ? " Les chiffres seront plus proches." : "");
    jouerNoteSerie(defi.serie);                              // étape 165 : une note un peu plus haute à chaque bonne réponse d'affilée
    if (monte) annoncerPalier(defi.serie);                   // étape 167 : le bandeau du palier (3, 5, 10, 15, 20, 30…)
    // Étape 168 : les deux records du Duel, mis à jour tout de suite (ils restent même si on quitte la partie),
    //   et annoncés une fois chacun quand ils tombent (après le bandeau du palier s'il y en a un)
    if (defi.vies !== undefined) {
      suivi.recordSerieDuel = Math.max(suivi.recordSerieDuel || 0, defi.serie);
      suivi.recordPartieDuel = Math.max(suivi.recordPartieDuel || 0, defi.bonnes);
      let delai = monte ? 2300 : 300;
      if (!defi.annonceSerie && defi.recordSerieAvant > 0 && defi.serie > defi.recordSerieAvant) {
        defi.annonceSerie = true;
        const ancienneSerie = defi.recordSerieAvant;          // gardé tout de suite : la partie peut être quittée avant l'annonce
        setTimeout(() => annoncerBandeau({ etiquette: `Ancien record : ${ancienneSerie} d'affilée`, titre: "Record de série !",
                                          detail: "Et ça continue", couleur: "#c9a227", son: "badge", etoiles: 14 }), delai);
        delai += 2300;
      }
      if (!defi.annoncePartie && defi.recordPartieAvant > 0 && defi.bonnes > defi.recordPartieAvant) {
        defi.annoncePartie = true;
        const anciennePartie = defi.recordPartieAvant;        // gardé tout de suite : la partie peut être quittée avant l'annonce
        setTimeout(() => annoncerBandeau({ etiquette: `Ancien record : ${anciennePartie} bonnes réponses`, titre: "Record de partie !",
                                          detail: "Chaque bonne réponse l'agrandit", couleur: "#c9a227", son: "badge", etoiles: 14 }), delai);
      }
    }
  } else {
    boutonClique.classList.add("fausse");
    defi.serie = 0;                                          // la série d'affilée repart de zéro, sans rien retirer
    jouerSon("mauvaise");                                    // étape 171 : la chouette aussi au Duel (demande du 13/10)
    // Étape 167 : la série repart de zéro (le compteur « se casse ») ; la difficulté, elle, ne recule que d'un cran (étape 152)
    document.getElementById("bandeau-palier")?.classList.remove("on");   // un bandeau de palier ne reste pas affiché
    defi.vientDeTomber = true;
    if ((defi.cran || 0) > 0) defi.cran = defi.cran - 1;
    retour.textContent = "";                                 // les deux chiffres affichés suffisent (étape 76)
    // Étape 166 : une vie en moins ; à la dernière, la partie s'arrête après ce duel
    if (defi.vies !== undefined) {
      defi.vies = defi.vies - 1;
      defi.vientDePerdre = true;
      if (defi.vies <= 0) { defi.total = defi.faites + 1; retour.textContent = "Plus de vies : la partie s'arrête là."; }
      else retour.textContent = `Une vie en moins (encore ${defi.vies}). La série repart de zéro.`;
    }
    defi.rates.push({ nom: `${duel.a.nom_courant} et ${duel.b.nom_courant}`,
                      explication: `${duel.q.libelle} : ${chiffreDuel(duel.q, duel.a, duel.va)} et ${chiffreDuel(duel.q, duel.b, duel.vb)}` });
  }
  const etonnant = phraseEtonnante(duel);                      // étape 205 : « L'orvet fragile vit près de 4 fois plus longtemps… »
  if (etonnant) retour.insertAdjacentHTML("beforeend", `<span class="etonnant-duel">${etonnant}</span>`);
  defi.faites = defi.faites + 1;
  afficherHud();
  sauvegarder();
  const suivant = document.getElementById("suivant");
  suivant.textContent = defi.faites >= defi.total ? "Voir le résultat →" : "Duel suivant →";
  suivant.classList.remove("cache");
}


// ==================================================================
// 11 nonies. LE PORTRAIT ET LE RANGEMENT (étape 78)
//    Deux jeux sur les espèces déjà découvertes.
//      Portrait  : sans la photo, retrouver 3 à 5 traits de l'espèce, chacun parmi 3 dessins ; on valide,
//                  la photo apparaît. 1 point par trait juste.
//      Rangement : 4 à 6 espèces à ranger dans 2 ou 3 cases d'un même thème (régime, moment de la journée…).
//                  On clique une espèce, puis une case ; on valide. 1 point par espèce bien rangée.
//    Dans les deux : ce qui est juste entre dans la fiche, ce qui est faux revient plus tard (« Déjà croisée… »).
// ==================================================================





// ---- La Révision sans chronomètre (étape 79) --------------------------
// Comme une question de Rencontre : la bonne réponse est montrée, l'explication s'affiche,
// on passe à la suite quand on veut. 1 point par bonne réponse.
const XP_REVISION = 10;
function repondreRevision(boutonClique, estJuste, jeNeSaisPas) {
  const { espece, champ, explication } = enCours;
  if (typeof INSOLITE !== "undefined" && champ === INSOLITE) { repondreInsolite(boutonClique, estJuste); return; }   // étape QI3 (21)
  for (const b of document.querySelectorAll(".reponse")) {
    b.disabled = true;
    if (b.dataset.juste === "oui") b.classList.add("juste");
  }
  for (const l of document.querySelectorAll(".legende")) l.classList.remove("cache", "au-survol");   // (au-survol : étape 149)
  if (enCours.q && enCours.q.format === "picto") document.getElementById("photo-rencontre").classList.remove("cache");
  if (champ === IDENTIFICATION) document.getElementById("nom").textContent = espece.nom_courant;
  document.getElementById("famille").classList.remove("cache");
  const retour = document.getElementById("retour");
  if (estJuste) {
    const nouvelle = champ === IDENTIFICATION && !estIdentifiee(espece);   // une espèce découverte (étape 86)
    noterAuBilan(espece, champ);
    acquerir(espece, champ);
    marquerVue(espece);
    if (defi.expedition && defi.expedition.revue && champ === IDENTIFICATION) marquerRevue(defi.expedition.id, espece);   // étape 316 : revue dans cette expédition
    if (defi.expedition && defi.expedition.rattrapage && especeFaite(espece, 1)) marquerRevue(defi.expedition.id, espece);   // étape R132 : rattrapée
    if (nouvelle) annoncerNouvelleEspece(espece, "rejoint l'encyclopédie");   // étape 206
    defi.bonnes = defi.bonnes + 1;
    defi.score = defi.score + 1;
    defi.xpBase = defi.xpBase + XP_REVISION;
    retour.textContent = (defi.reprise || defi.questionReprise ? "Rattrapée ! " : "Bravo ! ") + explication;   // étape 144 (R184 : la reprise de la révision)
    jouerSon();
  } else if (boutonClique && boutonClique.dataset.presque === "oui") {
    // Étape 136 : « Presque » (voir repondre) — Découvert si jamais trouvée, et la question revient plus tard
    boutonClique.classList.add("presque");
    retour.textContent = textePresque(boutonClique, explication);
    if (nbBonnes(espece, champ) === 0) { noterAuBilan(espece, champ); acquerir(espece, champ); defi.xpBase = defi.xpBase + Math.round(XP_REVISION / 2); }
    aRevoirPlusTard(espece, champ);
  } else {
    if (boutonClique) boutonClique.classList.add("fausse");
    if (boutonClique && !jeNeSaisPas) jouerSon("mauvaise");                               // étape 170 : le hou-hou de chouette
    aRevoirPlusTard(espece, champ);
    const texte = explication.replace(`C'est : ${espece.nom_courant}. `, "");
    if (!defi.rates.some(r => r.nom === espece.nom_courant && r.explication === texte)) defi.rates.push({ nom: espece.nom_courant, explication: texte });
    retour.textContent = explication;
    // Étape R184 : dans la révision d'une expédition, la photo ratée revient à la fin ; ratée à la reprise, elle compte quand même ici
    if (champ === IDENTIFICATION && typeof revueARepreendre === "function") {
      if (revueARepreendre(espece)) retour.textContent = `${explication} Elle reviendra à la fin de cette révision.`;
      else if (revuePassee(espece)) retour.textContent = `${explication} Elle compte quand même pour cette expédition ; sa photo reviendra dans vos prochaines parties.`;
    }
  }
  defi.faites = defi.faites + 1;
  if (typeof apresReponseExpedition === "function") apresReponseExpedition(espece);   // étape R102 : bande + bulle « c'est fait »
  afficherHud();
  afficherStats();
  sauvegarder();
  const suivant = document.getElementById("suivant");
  suivant.textContent = defi.faites >= defi.total ? "Voir le résultat →" : "Question suivante →";
  suivant.classList.remove("cache");
  noterDansHistorique();                           // étape 248 : « ← Question précédente » aussi dans Jouer
}

// ---- Le Portrait ----------------------------------------------------
const TRAITS_PORTRAIT = 5;                     // traits au plus par espèce

// Les traits d'une espèce qu'on peut demander : ceux du portrait physique (avec un dessin),
// dans les niveaux ouverts, et qui ont au moins 2 mauvaises réponses possibles
function traitsPortrait(espece) {
  const niveau = accesTout() ? NB_NIVEAUX : niveauOuvert(espece);   // étape 274 : dans « Plus de jeux », tous les traits
  return questionsPossibles(espece).filter(q => q.format === "picto" && !q.sansImage && niveauMedaille(espece, q) <= niveau
    && autresValeurs(q, valeurDe(espece, q), espece).length >= 2);
}
function ciblesPortrait(especes) {
  const tout = accesTout();                                   // étape 274 : « Plus de jeux » prend toutes les espèces
  return especes.filter(e => estRenseigne(e.photo) && (tout || estIdentifiee(e)) && traitsPortrait(e).length >= 3);
}

function demarrerPortrait() {
  // De préférence des espèces qui ont encore des traits jamais trouvés
  const cibles = melanger(ciblesPortrait(defi.especes));
  const aApprendre = cibles.filter(e => traitsPortrait(e).some(q => nbBonnes(e, q.champ) === 0));
  defi.cibles = [...aApprendre, ...cibles.filter(e => !aApprendre.includes(e))];
  defi.total = Math.min(ESPECES_PORTRAIT, defi.cibles.length);
  defi.essais = 0;
  nouveauPortrait();
}

// Remettre la carte à zéro pour un jeu "maison" (Portrait, Rangement) : pas de photo, un titre
function viderCarte(titre, question) {
  arreterCri();
  document.getElementById("carte-pop").classList.remove("visible");
  const photo = document.getElementById("photo-rencontre");
  photo.classList.add("cache");
  photo.classList.remove("grande", "cadre-empreinte", "cadre-son", "devoile");
  photo.innerHTML = "";
  document.getElementById("famille").classList.add("cache");
  document.getElementById("nom").textContent = titre;
  proposerSilhouette(null);                         // étape 111 : pas d'aide par défaut
  document.getElementById("compteur-rencontre").textContent = "";
  document.getElementById("revision").textContent = "";
  document.getElementById("question").textContent = question;
  document.getElementById("affirmation").classList.add("cache");
  document.getElementById("retour").textContent = "";
  document.getElementById("suivant").classList.add("cache");
  const zone = document.getElementById("reponses");
  zone.className = "";
  zone.innerHTML = "";
  return zone;
}

function nouveauPortrait() {
  // L'espèce : la suivante de la liste (avec le chronomètre, on reprend la liste au début)
  const espece = defi.cibles[defi.faites % defi.cibles.length];
  defi.cible = espece;
  defi.numero = defi.faites + 1;
  derniereEspece = espece;
  // Ses traits : la couleur et l'aspect d'abord (les plus parlants), puis les autres au hasard
  const tous = traitsPortrait(espece);
  const enTeteListe = tous.filter(q => q.champ === "couleur_dominante" || q.champ === "robe");
  const traits = [...melanger(enTeteListe), ...melanger(tous.filter(q => !enTeteListe.includes(q)))].slice(0, TRAITS_PORTRAIT);
  defi.lignes = traits.map(q => {
    const bonne = valeurDe(espece, q);
    return { q, bonne, options: melanger([bonne, ...autresValeurs(q, bonne, espece).slice(0, 2)]), choix: null };
  });
  const zone = viderCarte(espece.nom_courant, "Retrouvez son portrait :");
  if (defi.lignes.some(l => silhouetteUtile(l.q, espece))) proposerSilhouette(espece);   // étapes 111-112, 241 : en aide s'il y a au moins un trait de forme
  document.getElementById("question").title = "Au clavier : 1, 2, 3 pour choisir, flèches pour se déplacer, Entrée pour valider";
  document.getElementById("famille").textContent = espece.nom_affichage_groupe;
  defi.lignes.forEach((ligne, rang) => {
    const bloc = document.createElement("div");
    bloc.className = "ligne-trait";
    bloc.innerHTML = `<small>${ligne.q.libelle}</small><div class="options-trait"></div>`;
    for (const v of ligne.options) {
      const bouton = document.createElement("button");
      bouton.className = "option-trait";
      bouton.innerHTML = `<span class="picto">${dessinReponse(ligne.q.colonnePicto, v)}</span>${majuscule(ligne.q.affichageFiche ? ligne.q.affichageFiche(espece, v) : v)}`;
      bouton.dataset.valeur = v;
      bouton.onclick = () => {
        ligne.choix = v;
        for (const b of bloc.querySelectorAll(".option-trait")) b.classList.toggle("choisie", b === bouton);
        document.getElementById("valider-portrait").disabled = defi.lignes.some(l => l.choix === null);
      };
      bloc.querySelector(".options-trait").appendChild(bouton);
    }
    zone.appendChild(bloc);
  });
  zone.insertAdjacentHTML("beforeend", `<button class="bouton-accueil principal valider-jeu" id="valider-portrait" disabled>Valider</button>`);
  document.getElementById("valider-portrait").onclick = validerPortrait;
  afficherHud();
}

function validerPortrait() {
  const espece = defi.cible;
  let justes = 0;
  document.querySelectorAll("#reponses .ligne-trait").forEach((bloc, rang) => {
    const ligne = defi.lignes[rang];
    const estJuste = ligne.choix === ligne.bonne;
    for (const b of bloc.querySelectorAll(".option-trait")) {
      b.disabled = true;
      b.classList.remove("choisie");
      if (b.dataset.valeur === String(ligne.bonne)) b.classList.add("juste");
      else if (b.dataset.valeur === String(ligne.choix)) b.classList.add("fausse");
    }
    enCours = { espece, champ: ligne.q.champ, explication: "", q: ligne.q, bonne: ligne.bonne };   // pour le bilan
    if (estJuste) { justes++; noterAuBilan(espece, ligne.q.champ); acquerir(espece, ligne.q.champ); }
    else aRevoirPlusTard(espece, ligne.q.champ);
  });
  document.getElementById("valider-portrait").remove();
  // La photo apparaît enfin
  const photo = document.getElementById("photo-rencontre");
  photo.innerHTML = celluleImage(espece);
  photo.classList.remove("cache");
  document.getElementById("famille").classList.remove("cache");
  if (justes === defi.lignes.length) { suivi.portraits++; verifierBadgesBientot(); }   // étape 106 : un portrait sans erreur
  defi.essais = defi.essais + defi.lignes.length;
  defi.bonnes = defi.bonnes + justes;
  defi.score = defi.score + justes;
  defi.xpBase = defi.xpBase + justes * XP_POINT_PORTRAIT;
  document.getElementById("retour").textContent = justes === defi.lignes.length
    ? `Bravo ! Portrait complet : +${justes} points.` : `${justes} trait${justes > 1 ? "s" : ""} sur ${defi.lignes.length} : +${justes} point${justes > 1 ? "s" : ""}.`;
  if (justes) jouerSon(); else jouerSon("mauvaise");     // étape 170 : la chouette si rien n'est juste
  defi.faites = defi.faites + 1;
  afficherHud();
  afficherStats();
  sauvegarder();
  const suivant = document.getElementById("suivant");
  suivant.textContent = defi.faites >= defi.total ? "Voir le résultat →" : "Espèce suivante →";
  suivant.classList.remove("cache");
}

const XP_POINT_PORTRAIT = 10;
