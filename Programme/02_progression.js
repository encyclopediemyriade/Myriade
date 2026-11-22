// 02_progression.js — La progression du joueur, la sauvegarde, les petits outils et le statut d'une espèce.
// Une partie du programme du jeu, chargée par jeu.html dans l'ordre des numéros.

// ==================================================================
// 2. LA PROGRESSION DU JOUEUR  (le cœur de cette étape)
//
//    progression = un "carnet" rangé par nom d'espèce. Exemple :
//    {
//      "Chamois": { acquis: { nom_petit: 2, verbe_cri: 1 } },
//      "Hermine": { acquis: {} }          ← croisée mais rien de juste
//    }
//    Le chiffre = nombre de bonnes réponses sur cette caractéristique.
//    Une espèce absente du carnet = jamais croisée = "inconnue".
// ==================================================================
const progression = {};
let xp = 0;


// File des questions à revoir : [{ nom, champ, dans }]
// "dans" = combien de questions attendre avant de la reposer.
let aRevoir = [];

// ==================================================================
// 2 ter. LA SESSION DE RENCONTRE (étape 7)
//    On cadre une Rencontre en 10, 25 ou 50 questions, choisies avant
//    de démarrer. session = null tant qu'aucune session n'est en cours.
//    (Pas sauvegardé : une session se joue en une fois, dans une visite.)
// ==================================================================
let session = null;   // { total, faites, bonnes, classes }

// Le mode Défi (étape 33, partie 11 bis).
//   defi    = le défi en cours (null en dehors) : { cle, nom, especes, fin, score, serie… }
//   records = le meilleur score de chaque défi, gardé d'une visite à l'autre. Exemple :
//             { "Alpes|Mammiferes": { score: 1240, etoiles: 3 } }
let defi = null;
let records = {};

// Les familles cochées pour la Rencontre (étape 12). On retient les noms
// d'onglets ("Mammiferes", "Oiseaux"…). null = pas encore choisi = toutes.
let classesChoisies = null;
// Pareil pour les territoires (étape 13) : on retient les noms de la colonne "territoire".
let territoiresChoisis = null;
// Le joueur a-t-il le son ? true = oui : on pose les questions sur les cris.
// Depuis l'étape 51, c'est le jeu qui le demande, à la première question de cri de chaque Rencontre.
let sonActif = true;
// Le profil du joueur, choisi à la première visite (étape 52, partie 11 sexies).
//   niveau      = 1 (Curieux de Nature), 2 (Naturaliste Aguerri) ou 3 (Expert de Terrain)
//   territoires = le territoire débloqué au départ (une liste, pour pouvoir en ajouter plus tard)
// null = pas encore choisi : le jeu ouvre la première visite au démarrage.
// (Jusqu'à l'étape 59, le profil avait aussi un "rythme" : une ancienne sauvegarde peut en
//  contenir un, il est simplement ignoré.)
let profil = null;
// La question "Le son est-il disponible ?" a-t-elle déjà été posée dans cette Rencontre ?
let sonDemande = false;
// Petit interrupteur interne (voir champsAInterroger, partie 3) : le temps de choisir une
// question, on fait "comme si" le son était là, pour que le jeu puisse reposer la question du son.
let avecCriQuandMeme = false;


// ==================================================================
// 2 bis. SAUVEGARDE (étape 5)
//    Le navigateur possède un petit "tiroir" personnel : localStorage.
//    On y range un texte sous une étiquette (la "clé"), il y reste
//    même si on ferme la page ou l'ordinateur.
//    JSON.stringify = transforme nos objets en texte pour les ranger
//    JSON.parse     = fait l'inverse quand on les ressort
// ==================================================================
const CLE_SAUVEGARDE = "encyclopedie-alpes";

function sauvegarder() {
  const donnees = { progression: progression, xp: xp, aRevoir: aRevoir, records: records,
                    classesChoisies: classesChoisies, territoiresChoisis: territoiresChoisis,
                    sonActif: sonActif, profil: profil,
                    jeuChoisi: jeuChoisi, avecChrono: avecChrono, terrainPerso: terrainPerso, revisionsSeules: revisionsSeules, crisClassique: crisClassique, questionsSimples: questionsSimples, photosSeules: photosSeules, questionsClassique: questionsClassique, statsJeux: statsJeux, rangCarnet: rangAtteint,
                    decouvertesSeules: decouvertesSeules, decouvertesM12: true, typesCarnet: typesCarnet,
                    suivi: suivi, badgesObtenus: badgesObtenus, titreChoisi: titreChoisi,
                    especeFavorite: especeFavorite, territoiresOuverts: territoiresOuvertsListe };   // étape 209   // étape 109   // étape 106 : les badges    // le dernier jeu et le chronomètre (étape 72)
  try {
    localStorage.setItem(CLE_SAUVEGARDE, JSON.stringify(donnees));
  } catch (e) { /* tiroir indisponible (navigation privée…) : le jeu continue sans sauver */ }
  planifierStats();
}
// Étape R294 (Notion 50.01, test de la 1.32.1 : « 2 espèces · 2 empreintes » au lieu de 7 et 9) : le compteur du haut
//   (espèces · empreintes) suit TOUT ce qui se sauvegarde — une espèce ou une empreinte gagnée l'est toujours. Avant, chaque
//   écran devait penser à appeler afficherStats() : Me tester, Leurs liens, la fin d'une Rencontre et l'accueil du téléphone
//   l'oubliaient. Une seule mise à jour pour plusieurs sauvegardes de suite (juste après), jamais pendant que son détail est ouvert.
let statsPlanifiees = false;
function planifierStats() {
  if (statsPlanifiees) return;
  statsPlanifiees = true;
  setTimeout(() => {
    statsPlanifiees = false;
    const d = document.getElementById("detail-carnet");
    if (d && !d.hidden) return;
    try { if (typeof afficherStats === "function" && typeof ESPECES !== "undefined") afficherStats(); } catch (e) { /* rien */ }
  }, 0);
}

// Étape R188e : les espèces renommées (ancien nom → nouveau) ; leur carnet est repris sous le nouveau nom au chargement
const NOMS_CHANGES = { "Goujon": "Goujon occitan",
  "Ancyle des rivières": "Patelline des fleuves" };   // étape R244 (17/11) : nom officiel de TAXREF
// Étape R244 : le même changement dans le suivi (espèces offertes, à reconnaître, reconnues en défi, défis en cours…) :
// toute valeur ou clé qui est exactement un ancien nom prend le nouveau.
function renommerDansSuivi(x) {
  if (Array.isArray(x)) return x.map(renommerDansSuivi);
  if (typeof x === "string") return NOMS_CHANGES[x] || x;
  if (x && typeof x === "object") {
    const r = {};
    for (const [k, v] of Object.entries(x)) r[NOMS_CHANGES[k] || k] = renommerDansSuivi(v);
    return r;
  }
  return x;
}
function charger() {
  try {
    const texte = localStorage.getItem(CLE_SAUVEGARDE);
    if (!texte) { suivi.familleOfferte = true; suivi.reglagesRemis129 = true; suivi.famillesRemises131 = true; suivi.medaillesGardees227 = true; return; }   // rien de sauvegardé : première partie (étape 127 : rien à offrir)
    const donnees = JSON.parse(texte);
    Object.assign(progression, donnees.progression);   // on recopie le carnet
    // Étape R188e (11/11) : « Goujon » s'appelle maintenant « Goujon occitan » : son carnet suit le nouveau nom
    for (const [ancien, nouveau] of Object.entries(NOMS_CHANGES)) {
      if (progression[ancien] && !(donnees.progression || {})[nouveau]) progression[nouveau] = progression[ancien];
      if (ancien in progression && !ESPECES.some(e => e.nom_courant === ancien)) delete progression[ancien];
      if (donnees.especeFavorite === ancien) donnees.especeFavorite = nouveau;
    }
    xp = donnees.xp || 0;
    profil = donnees.profil || null;             // une ancienne sauvegarde n'en a pas : la première visite s'ouvrira
    // La dernière réponse sur le son. "!== false" : une ancienne sauvegarde, qui ne
    // connaît pas ce réglage, donne "avec le son". À lire AVANT les révisions
    // ci-dessous, car il décide si les questions sur les cris existent.
    sonActif = donnees.sonActif !== false;
    // Les records des défis. On ne reprend que ceux faits sur la durée actuelle (60 s) :
    // un record de 30 ou de 90 secondes fausserait la comparaison.
    // (Les records des deux autres jeux, dont le nom contient ":", ne dépendent pas de la durée.)
    for (const cle in (donnees.records || {})) {
      if (cle.includes(":") || donnees.records[cle].duree === DUREE_DEFI) records[cle] = donnees.records[cle];
    }
    classesChoisies = donnees.classesChoisies || null;     // les familles cochées la dernière fois
    territoiresChoisis = donnees.territoiresChoisis || null;
    // Le dernier jeu choisi et le chronomètre (étape 72). Un jeu retiré (Rapidité, Duo · Carré · Cash) → la Rencontre.
    jeuChoisi = JEUX[donnees.jeuChoisi] ? donnees.jeuChoisi : "rencontre";
    if (!ORDRE_JEUX.includes(jeuChoisi)) jeuChoisi = "revision";   // étape 100 : un ancien petit jeu → le Carnet de terrain
    avecChrono = false;                                   // étape 198 : plus de chronomètre (retiré de l'accueil)
    terrainPerso = donnees.terrainPerso === true;         // étape 198 : le terrain a-t-il été choisi par le joueur ?
    territoiresOuvertsListe = Array.isArray(donnees.territoiresOuverts) ? donnees.territoiresOuverts : null;   // étape 209 : ancienne partie = tout ouvert
    revisionsSeules = donnees.revisionsSeules === true;
    crisClassique = typeof donnees.crisClassique === "boolean" ? donnees.crisClassique : !avecChrono;   // étape 94
    questionsSimples = donnees.questionsSimples !== false;                                              // étape 132
    photosSeules = donnees.photosSeules === true;                                                       // étape 133
    questionsClassique = LONGUEURS_CLASSIQUE.includes(donnees.questionsClassique) ? donnees.questionsClassique : QUESTIONS_REVISION;
    statsJeux = (donnees.statsJeux && typeof donnees.statsJeux === "object") ? donnees.statsJeux : {};   // étape 92
    rangAtteint = Number.isInteger(donnees.rangCarnet) ? donnees.rangCarnet : null;                       // étape PR2 : le rang « carnet » (l'ancien rangAtteint n'est plus lu)
    // Étape M12 (07/11, demande de l'utilisateur) : « Découvertes uniquement » activé par défaut, pour tout le monde une première fois,
    // puis le choix du joueur est gardé (marque decouvertesM12 dans la sauvegarde)
    decouvertesSeules = donnees.decouvertesM12 ? donnees.decouvertesSeules === true : true;
    // Étape 100 (J1) : les types de question du Carnet de terrain. Un type absent de la sauvegarde garde sa valeur de base.
    if (donnees.typesCarnet && typeof donnees.typesCarnet === "object") {
      for (const t of TYPES_CARNET) if (typeof donnees.typesCarnet[t] === "boolean") typesCarnet[t] = donnees.typesCarnet[t];
    }
    // Étape 106 : les badges. Object.assign garde les valeurs de base pour ce qu'une ancienne sauvegarde ne connaît pas.
    if (donnees.suivi && typeof donnees.suivi === "object") Object.assign(suivi, renommerDansSuivi(donnees.suivi));   // R244 : anciens noms
    // Étape R278 (37.03) : une partie d'avant la marque « Nouveau » commence à l'heure de la mise à jour — son carnet n'est pas
    //   marqué « Nouveau » d'un coup ; seules les espèces qui y entrent ensuite le seront.
    if (!donnees.suivi || typeof donnees.suivi !== "object" || !("encycloVue" in donnees.suivi)) suivi.encycloVue = Date.now();
    badgesObtenus = (donnees.badgesObtenus && typeof donnees.badgesObtenus === "object") ? donnees.badgesObtenus : {};
    titreChoisi = typeof donnees.titreChoisi === "string" ? donnees.titreChoisi : null;
    especeFavorite = typeof donnees.especeFavorite === "string" ? donnees.especeFavorite : null;   // étape 109
    // Sécurité : on ignore les révisions qui visent une question qu'on ne pose plus
    // sur cette espèce (question retirée du jeu, espèce supprimée, ou valeur devenue
    // "non posable", comme un abri au nom trop générique).
    // Étape 129 : réglages remis d'office une fois (demande du 11/10) : tous les types de question du Carnet
    // activés, cris compris ; « Révisions uniquement » et chronomètre désactivés. Le joueur peut ensuite tout rechanger.
    if (!suivi.reglagesRemis129) {
      for (const t of TYPES_CARNET) typesCarnet[t] = true;
      crisClassique = true;
      revisionsSeules = false;
      avecChrono = false;
      suivi.reglagesRemis129 = true;
    }
    // Étape 131 : « Qui chercher ? » remis une fois sur toutes les familles (null = toutes, voir plus bas).
    if (!suivi.famillesRemises131) { classesChoisies = null; suivi.famillesRemises131 = true; }
    // Étape 127 : la nouvelle question « famille » ajoute une case à chaque espèce. Pour qu'aucune médaille
    // ni aucun statut ne recule, les espèces DÉJÀ identifiées la reçoivent d'office, au même compte que
    // leur identification sur photo (la reconnaître, c'était déjà savoir ce qu'elle est). Fait une seule fois.
    if (!suivi.familleOfferte) {
      for (const e of ESPECES) {
        const p = progression[e.nom_courant];
        if (p && p.acquis && estIdentifiee(e) && !p.acquis.famille_animale) {
          p.acquis.famille_animale = Math.max(1, nbBonnes(e, IDENTIFICATION));
        }
      }
      suivi.familleOfferte = true;
    }
    // Étape 227 : le nom du petit n'est plus demandé quand il est générique (poussin, oisillon…). Avant d'appliquer
    // cette règle, on note une seule fois la médaille de chaque espèce calculée comme avant : elle ne pourra plus reculer.
    if (!suivi.medaillesGardees227) {
      try {
        REGLES_AVANT_227 = true; memoQuestions.clear();
        for (const e of ESPECES) if (progression[e.nom_courant]) niveauTermine(e);
      } catch (err) { /* au pire, les médailles seront recalculées normalement */ }
      REGLES_AVANT_227 = false; memoQuestions.clear();
      suivi.medaillesGardees227 = true;
    }
    aRevoir = (donnees.aRevoir || []).filter(r => {
      const espece = ESPECES.find(e => e.nom_courant === r.nom);
      return espece && champsDe(espece).includes(r.champ);
    });
  } catch (e) { /* sauvegarde illisible : on repart de zéro */ }
}

function recommencer() {
  // confirm() = petite fenêtre "OK / Annuler" du navigateur (la page À propos a sa propre confirmation : effacerPartie)
  if (!confirm("Effacer toute la progression et recommencer à zéro ?")) return;
  effacerPartie();
}
function effacerPartie() {
  localStorage.removeItem(CLE_SAUVEGARDE);
  try { localStorage.removeItem(CLE_SAUVEGARDE + "-empreintes-barre"); } catch (e) { /* rien */ }   // étape R262
  location.reload();                             // recharge la page, vide
}


// ==================================================================
// 3. PETITS OUTILS
// ==================================================================
function estRenseigne(valeur) {
  return valeur !== null && valeur !== undefined && !String(valeur).startsWith("NA");
}
function auHasard(liste) {
  return liste[Math.floor(Math.random() * liste.length)];
}
function melanger(liste) {
  return liste.sort(() => Math.random() - 0.5);
}
function majuscule(texte) {
  return String(texte).charAt(0).toUpperCase() + String(texte).slice(1);
}
// Un nombre entier au hasard entre min et max (ex : 3, 4 ou 5)
function entreAuHasard(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

// Le contenu à mettre dans une case ".photo" : la vraie photo si elle est
// renseignée ET que le fichier existe bien dans le dossier Images, sinon
// le texte "photo à venir". onerror = si l'image ne charge pas (fichier
// manquant), on la remplace par le texte de secours plutôt que d'afficher
// une icône d'image cassée.
// ---- Étape R264 (Notion 39, note 21 du 18/11 : « les photos prennent un peu de temps à chaque écran ») ----
//   Sur téléphone, les grandes photos viennent du dossier Images/moy : 720 px de large au lieu de 960, compressées pour
//   le téléphone (≈ 35 Ko au lieu de ≈ 100 Ko : 2 à 3 fois plus légères ; nettes sur un écran de téléphone). La liste des
//   photos prêtes est dans photos_moyennes.js (écrit par Outils\gen_photos_moyennes.py) : une photo absente de la liste
//   garde la grande version (jamais d'image cassée). Sur ordinateur, ou pour voir une photo en grand : la version 960 px.
const PHOTOS_MOY = typeof PHOTOS_MOYENNES === "undefined" ? new Set() : new Set(PHOTOS_MOYENNES);
const ECRAN_TELEPHONE = typeof matchMedia === "function" ? matchMedia("(max-width: 760px)") : { matches: false };
function srcEcran(src) {
  const s = String(src || "");
  const m = /^Images\/([^\/]+\.jpg)$/i.exec(s);
  return m && ECRAN_TELEPHONE.matches && PHOTOS_MOY.has(m[1]) ? "Images/moy/" + m[1] : s;
}
// Charger à l'avance (pendant qu'on lit ou qu'on répond) les photos qui vont venir : elles s'affichent alors tout de suite.
// ==================================================================
// Étape R281 (21/11/2026, 44.07 suite : « le ralentissement touche toutes les premières apparitions d'image », Aubin, sur la 1.26.0).
//   Mesuré sur une copie (réseau et processeur ralentis) : les chargements d'avance de R280 partaient tous en même temps et
//   passaient DEVANT les images à afficher tout de suite (la photo de la première Rencontre attendait jusqu'à 1,6 s, les
//   silhouettes de la bande plus d'une seconde). Maintenant :
//   • UNE FILE D'ATTENTE : 3 chargements d'avance à la fois, en priorité basse ; ce que l'écran demande passe devant ;
//   • ce qui sert à la Rencontre qui commence passe EN TÊTE de la file (« urgent ») ;
//   • les images chargées d'avance sont GARDÉES en mémoire, déjà décodées : elles s'affichent sans le petit temps de décodage ;
//   • l'ordre à l'ouverture d'une expédition : les silhouettes (toutes petites, montrées dès la première Rencontre), les photos,
//     les petites photos, puis pour chaque espèce ses pictos, son empreinte, ses autres photos, son sosie et ses fausses photos.
// ==================================================================
const dejaPrecharges = new Set();
const filePrecharge = [], imagesGardees = new Map();
let prechargesEnCours = 0;
const PRECHARGES_ENSEMBLE = 3, IMAGES_GARDEES_MAX = 500;
function avancerPrecharges() {
  while (prechargesEnCours < PRECHARGES_ENSEMBLE && filePrecharge.length) {
    const src = filePrecharge.shift();
    prechargesEnCours++;
    const im = new Image();
    im.decoding = "async";
    try { im.fetchPriority = "low"; } catch (err) { /* navigateur ancien */ }
    let fini = false;
    const fin = ok => {
      if (fini) return; fini = true;
      prechargesEnCours--;
      if (ok) {
        imagesGardees.set(src, im);                       // gardée : le navigateur la ressert sans la relire ni la redécoder
        if (imagesGardees.size > IMAGES_GARDEES_MAX) imagesGardees.delete(imagesGardees.keys().next().value);
        if (typeof im.decode === "function" && /\.jpe?g$/i.test(src)) im.decode().catch(() => {});
      }
      avancerPrecharges();
    };
    im.onload = () => fin(true); im.onerror = () => fin(false);
    setTimeout(() => fin(false), 8000);                    // un fichier qui ne répond pas ne bloque pas la file
    im.src = src;
  }
}
// urgent = pour l'écran qui arrive : en tête de la file, dans l'ordre donné
function prechargerFichiers(srcs, urgent) {
  const liste = [...new Set((srcs || []).filter(s => s && typeof s === "string"))];
  if (urgent) {
    const neufs = [];
    for (const src of liste) {
      const i = filePrecharge.indexOf(src);
      if (i >= 0) { filePrecharge.splice(i, 1); neufs.push(src); }          // déjà en attente : il passe devant
      else if (!dejaPrecharges.has(src)) { dejaPrecharges.add(src); neufs.push(src); }
    }
    filePrecharge.unshift(...neufs);
  } else for (const src of liste) { if (dejaPrecharges.has(src)) continue; dejaPrecharges.add(src); filePrecharge.push(src); }
  avancerPrecharges();
}
function prechargerPhotos(srcs, petite, urgent) {
  prechargerFichiers((srcs || []).filter(b => b && estRenseigne(b)).map(brut => petite ? String(brut).replace("Images/", "Images/mini/") : srcEcran(brut)), urgent);
}
function prechargerEspeces(especes, petite, urgent) {
  prechargerPhotos((especes || []).filter(Boolean).map(e => e.photo), petite, urgent);
}
// Étape R280 (44.07) : pour une espèce, sa silhouette, son empreinte et les pictogrammes de ses questions de Rencontre
//   (ceux des réponses proposées et ceux de l'écran « Sa vie »). R281 : + ses autres photos (grandes et petites) et, dans une
//   expédition (x), la petite photo de son sosie et celles des fausses photos de l'entrée « par les indices ».
function mediasRencontre(e, x) {
  const l = [];
  if (!e) return l;
  const mini = src => String(src).replace("Images/", "Images/mini/");
  try {
    if (typeof fichierSilhouette === "function") l.push(fichierSilhouette(e));
    if (estRenseigne(e.photo)) { l.push(srcEcran(e.photo), mini(e.photo)); for (const ph of photosDe(e).slice(1)) l.push(srcEcran(ph.src), mini(ph.src)); }
    const emp = typeof cleEmpreinte === "function" ? cleEmpreinte(e) : null;
    if (emp && typeof EMPREINTES !== "undefined" && EMPREINTES[emp]) l.push(`Empreintes/${emp}.svg`);
    const champs = typeof champsEtape === "function" ? [...champsEtape(e, 1), ...champsEtape(e, 2)] : [];
    for (const c of new Set(champs)) {
      const q = QUESTIONS.find(y => y.champ === c);
      if (!q) continue;
      const v = valeurDe(e, q);
      const avecDessin = q.pictos || q.colonnePicto || q.format === "picto" || c === "regime_alimentaire_type" || c === "chasse_principale";
      const col = q.colonnePicto || c;
      if (!avecDessin || !estRenseigne(v) || v === "NA") continue;
      // sa réponse, et les autres réponses possibles de la question (les mauvaises réponses en sont tirées), 12 au plus
      for (const val of [v, ...valeursQuestion(q).slice(0, 12)])
        if (typeof val === "string" && !PASTILLES[val]) l.push(`Pictos/${col}__${nomDeFichier(val)}.svg`);
    }
    // les pictos de sa carte « Pour le reconnaître » (sa propre valeur pour chaque trait dessiné)
    for (const q of QUESTIONS) {
      if (!q.pictos && !q.colonnePicto && q.format !== "picto") continue;
      let v; try { v = valeurDe(e, q); } catch (err) { continue; }
      if (typeof v === "string" && estRenseigne(v) && v !== "NA" && !PASTILLES[v]) l.push(`Pictos/${q.colonnePicto || q.champ}__${nomDeFichier(v)}.svg`);
    }
    if (x) {
      const sosie = typeof sosiePourEntree === "function" ? sosiePourEntree(e) : null;
      if (sosie && estRenseigne(sosie.photo)) l.push(mini(sosie.photo));
      if (typeof piegesIndicesPrevus === "function" && typeof aDesIndices === "function" && aDesIndices(e))
        for (const o of piegesIndicesPrevus(e, x)) if (o && estRenseigne(o.photo)) l.push(mini(o.photo));
    }
  } catch (err) { /* un chargement d'avance ne doit jamais gêner le jeu */ }
  return l;
}
function prechargerRencontre(especes, x, urgent) {
  const liste = (Array.isArray(especes) ? especes : [especes]).filter(Boolean);
  if (urgent) { prechargerFichiers(liste.flatMap(e => mediasRencontre(e, x)), true); return; }
  const plusTard = window.requestIdleCallback ? f => requestIdleCallback(f, { timeout: 1500 }) : f => setTimeout(f, 200);
  liste.forEach((e, i) => setTimeout(() => plusTard(() => prechargerFichiers(mediasRencontre(e, x))), i * 120));
}
function celluleImage(espece, petite) {
  // Étape 293 : sans photo libre, la silhouette s'affiche à la place, avec la mention « photo à venir »
  if (!estRenseigne(espece.photo)) {
    const silh = typeof fichierSilhouette === "function" ? fichierSilhouette(espece) : "";
    return silh ? `<span class="a-venir"><img src="${silh}" alt="" onerror="this.remove()"><small>photo à venir</small></span>` : "photo à venir";
  }
  // Pour les petits cadres (encyclopédie, choix parmi 4 photos), on utilise
  // une MINIATURE préparée à l'avance (dossier Images/mini, 360 px de large).
  // Pourquoi : quand le navigateur réduit lui-même une grande photo d'un
  // facteur 4, le résultat peut être granuleux. La miniature est déjà à la
  // bonne taille, donc nette. Si elle manque, on retombe sur la grande photo.
  const grande = espece.photo;
  const src = petite ? grande.replace("Images/", "Images/mini/") : srcEcran(grande);   // R264 : version téléphone
  return `<img src="${src}" alt="${espece.nom_courant}"${petite ? ' loading="lazy" decoding="async"' : ' fetchpriority="high"'}
               onerror="if (this.src.includes('/mini/') || this.src.includes('/moy/')) this.src='${grande}'; else if (this.parentNode) this.outerHTML='photo à venir';">`;
}

// ==================================================================
// Étape PA1 (12/11/2026, choix d'Aubin « tout comme conseillé ») : les 2e et 3e photos, MONTRÉES (pas questionnées).
//   • photosDe(e) : la photo principale, puis photo_2 et photo_3 quand elles existent, avec leur sujet
//     (liste fermée : femelle, mâle, jeune, larve, chenille, adulte, plumage d'hiver, plumage d'été, pelage d'hiver,
//     forme de printemps, autre vue). La principale n'a pas de sujet.
//   • « autre vue » ne s'écrit jamais à l'écran (simple 2e photo) ; les autres formes ont une étiquette.
//   • Règles posées d'office : la première rencontre et les questions d'allure restent sur la photo principale.
// ==================================================================
const ETIQUETTES_FORME = {
  "femelle": "La femelle", "mâle": "Le mâle", "jeune": "Le jeune", "larve": "La larve", "chenille": "La chenille",
  "adulte": "L'adulte", "plumage d'hiver": "En plumage d'hiver", "plumage d'été": "En plumage d'été",
  "pelage d'hiver": "En pelage d'hiver", "forme de printemps": "Forme de printemps"
};
function photosDe(e) {
  if (!e || !estRenseigne(e.photo)) return [];
  const liste = [{ src: e.photo, sujet: "" }];
  for (const n of [2, 3]) {
    const src = e["photo_" + n];
    if (estRenseigne(src)) liste.push({ src, sujet: estRenseigne(e[`photo_${n}_sujet`]) ? String(e[`photo_${n}_sujet`]).trim() : "autre vue" });
  }
  return liste;
}
// Étape R234 (note 6 du 15/11) : les photos d'un stade qu'on ne reconnaît pas (têtards, larves, chenilles) ne servent
// jamais dans les jeux de reconnaissance (Coup d'œil, défi d'une expédition) ; elles restent dans l'Encyclopédie.
const SUJETS_NON_RECONNAISSABLES = ["larve", "chenille"];
function photoReconnaissable(e, p) {
  if (SUJETS_NON_RECONNAISSABLES.includes(p.sujet)) return false;
  if (p.sujet === "jeune" && e && e.onglet === "Amphibiens") return false;   // le « jeune » d'un amphibien est un têtard (pélodyte)
  return true;
}
// Les photos d'une espèce utilisables dans un jeu de reconnaissance (la principale, toujours, s'il ne reste rien)
function photosJeu(e) { const l = photosDe(e).filter(p => photoReconnaissable(e, p)); return l.length ? l : photosDe(e).slice(0, 1); }
// L'étiquette d'une photo (« La femelle », « Le jeune »…) ; rien pour la principale ni pour « autre vue »
function etiquetteForme(sujet) { return ETIQUETTES_FORME[sujet] || ""; }
// Les photos d'une AUTRE FORME (pas « autre vue ») : ce qu'on montre dans la Rencontre (A2)
function autresFormes(e) { return photosDe(e).slice(1).filter(p => etiquetteForme(p.sujet)); }
// Une photo d'espèce donnée par son fichier (comme celluleImage, mais pour n'importe laquelle des 3)
function imagePhoto(src, alt, petite, pleine) {   // R264 : « pleine » = la version 960 px (photo vue en grand)
  const s = petite ? src.replace("Images/", "Images/mini/") : pleine ? src : srcEcran(src);
  return `<img src="${s}" alt="${String(alt || "").replace(/"/g, "&quot;")}"${petite ? ' loading="lazy" decoding="async"' : ""} onerror="if (this.src.includes('/mini/') || this.src.includes('/moy/')) this.src='${src}';">`;
}
// Voir une photo en grand (toucher la vignette) : un voile sombre, la photo, sa légende ; toucher n'importe où ferme.
function agrandirPhoto(src, legende) {
  let voile = document.getElementById("photo-agrandie");
  if (!voile) {
    voile = document.createElement("div");
    voile.id = "photo-agrandie";
    voile.setAttribute("role", "dialog");
    voile.onclick = () => voile.classList.remove("ouvert");
    document.addEventListener("keydown", ev => { if (ev.key === "Escape") voile.classList.remove("ouvert"); });
    document.body.appendChild(voile);
  }
  voile.innerHTML = `<figure>${imagePhoto(sourceGrande(src), legende, false, true)}${legende ? `<figcaption>${legende}</figcaption>` : ""}<span class="pa-fermer" aria-label="Fermer">×</span></figure>`;
  voile.classList.add("ouvert");
}
// Étape R239 (17/11, note 16b du 16/11, tâche 36.16) : plusieurs photos à comparer, en grand ; on glisse de l'une à l'autre
//   (ou flèches du clavier), un toucher ferme. Toute photo marquée « .agr » dans un bloc « .agrandir-groupe » s'ouvre ainsi
//   (explication d'une erreur dans le défi, Coup d'œil, À l'oreille ; photos d'une question « trouver parmi 4 photos »).
let galerieAgrandie = null;
function agrandirPhotos(liste, k) {
  if (!liste.length) return;
  galerieAgrandie = { liste, k: Math.max(0, Math.min(k || 0, liste.length - 1)) };
  const montrerK = () => {
    const g = galerieAgrandie, p = g.liste[g.k];
    agrandirPhoto(p.src, p.legende || "");
    const voile = document.getElementById("photo-agrandie");
    voile.classList.toggle("galerie", g.liste.length > 1);
    if (g.liste.length > 1) voile.querySelector("figure").insertAdjacentHTML("beforeend",
      `<span class="pa-points" aria-hidden="true">${g.liste.map((x, i) => `<i class="${i === g.k ? "actif" : ""}"></i>`).join("")}</span>`);
  };
  montrerK();
  const voile = document.getElementById("photo-agrandie");
  if (!voile.dataset.galerie) {
    voile.dataset.galerie = "oui";
    let x0 = null, glisse = false;
    const aller = d => { const g = galerieAgrandie; if (!g || g.liste.length < 2) return; g.k = (g.k + d + g.liste.length) % g.liste.length; montrerKGalerie(); };
    voile.addEventListener("touchstart", ev => { x0 = ev.touches[0].clientX; glisse = false; }, { passive: true });
    voile.addEventListener("touchend", ev => {
      if (x0 === null) return;
      const dx = ev.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) { glisse = true; aller(dx < 0 ? 1 : -1); }
    });
    voile.addEventListener("click", ev => { if (glisse) { ev.stopImmediatePropagation(); glisse = false; voile.classList.add("ouvert"); } }, true);
    document.addEventListener("keydown", ev => {
      if (!voile.classList.contains("ouvert") || !galerieAgrandie) return;
      if (ev.key === "ArrowRight") aller(1); else if (ev.key === "ArrowLeft") aller(-1);
    });
  }
  window.montrerKGalerie = montrerK;
}
function sourceGrande(src) { return String(src || "").replace("Images/mini/", "Images/").replace("Images/moy/", "Images/"); }
document.addEventListener("click", ev => {
  const it = ev.target && ev.target.closest && ev.target.closest(".agrandir-groupe .agr");
  if (!it) return;
  const groupe = it.closest(".agrandir-groupe");
  const items = [...groupe.querySelectorAll(".agr")].filter(i => i.querySelector("img"));
  const liste = items.map(i => ({ src: sourceGrande(i.querySelector("img").getAttribute("src")), legende: i.dataset.legende || "" }));
  const k = items.indexOf(it);
  if (k < 0) return;
  ev.preventDefault(); ev.stopPropagation();
  agrandirPhotos(liste, k);
}, true);
const LOUPE_SVG = `<span class="agr-loupe" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/></svg></span>`;
// Le bloc de la Rencontre (A2) : une ou deux vignettes « La femelle », « Le jeune »… (rien si l'espèce n'a pas d'autre forme)
function blocAutresFormes(e) {
  const formes = autresFormes(e);
  if (!formes.length) return "";
  return `<div class="retour-formes">${formes.map(p => `<button type="button" class="retour-forme" onclick="event.stopPropagation(); agrandirPhoto('${p.src}', '${String(e.nom_courant + " · " + etiquetteForme(p.sujet)).replace(/'/g, "\\'")}')">`
    + `<span class="rf-ph">${imagePhoto(p.src, etiquetteForme(p.sujet), true)}</span><span class="rf-lib">${etiquetteForme(p.sujet)}</span></button>`).join("")}</div>`;
}
// ---- Étape R253 (17/11, Notion 36.34, choix 34C d'Aubin) : les autres formes NETTEMENT différentes, dans la Rencontre ----
//   Données (lot R252) : photo_2_differente / photo_3_differente (oui / non / NA) et photo_2_change / photo_3_change
//   (« ce qui change », 10 mots au plus ; NA = pas de ligne confirmée → la forme est montrée sans phrase).
//   Seules les formes « oui » sont montrées ici (une femelle presque pareille au mâle n'apprend rien) ; deux photos de la même
//   forme (deux femelles) ne font qu'une vignette. Chenille et larve sont montrées, jamais demandées (R254).
function formesNettes(e) {
  if (!e) return [];
  const res = [];
  for (const n of [2, 3]) {
    const src = e["photo_" + n], sujet = e[`photo_${n}_sujet`] ? String(e[`photo_${n}_sujet`]).trim() : "";
    if (!estRenseigne(src) || !etiquetteForme(sujet) || String(e[`photo_${n}_differente`] || "").trim() !== "oui") continue;
    if (res.some(p => p.sujet === sujet)) continue;
    const ch = estRenseigne(e[`photo_${n}_change`]) ? String(e[`photo_${n}_change`]).trim() : "";
    res.push({ src, sujet, n, etiquette: etiquetteForme(sujet), change: ch });
  }
  return res;
}
// La rangée « Ses autres formes » : la vignette, l'étiquette (« La femelle ») et la ligne « ce qui change » ; toucher = en grand
function blocFormesNettes(e, opts = {}) {
  const formes = formesNettes(e);
  if (!formes.length) return "";
  const leg = p => String(e.nom_courant + " · " + p.etiquette + (p.change ? " : " + minuscule(p.change) : "")).replace(/'/g, "\\'").replace(/"/g, "&quot;");
  return `<div class="cb-formes-bloc${opts.classe ? " " + opts.classe : ""}"${opts.style ? ` style="${opts.style}"` : ""}><p class="cb-sous">Ses autres formes</p><div class="cb-formes">`
    + formes.map(p => `<button type="button" class="cb-forme" onclick="event.stopPropagation(); agrandirPhoto('${p.src}', '${leg(p)}')">`
      + `<span class="cbf-ph">${imagePhoto(p.src, p.etiquette, true)}${LOUPE_SVG}</span>`
      + `<span class="cbf-txt"><b>${echapper(p.etiquette)}</b>${p.change ? `<small>${echapper(p.change)}</small>` : ""}</span></button>`).join("")
    + `</div></div>`;
}
// La photo du jour d'une espèce DÉJÀ reconnue (A3) : une de ses photos, la même toute la journée ; inconnue : la principale
function photoDuJourDe(e) {
  const ph = photosDe(e);
  if (ph.length < 2 || !(typeof estReconnue === "function" && estReconnue(e))) return ph[0] || null;
  const graine = typeof graineDuJour === "function" ? graineDuJour() : 0;
  return ph[graine % ph.length];
}

// Mettre une minuscule au début : "Falaises…" → "falaises…" (pour l'insérer dans une phrase)
function minuscule(texte) {
  return String(texte).charAt(0).toLowerCase() + String(texte).slice(1);
}
// Écrire un nombre à la française : 65.9 → "65,9"
function nombre(n) {
  return n.toLocaleString("fr-FR");
}

// La valeur d'une caractéristique pour une espèce.
// En général c'est la colonne "champ" ; sinon la formule "valeur" de la question.
function valeurDe(espece, q) {
  return q.valeur ? q.valeur(espece) : espece[q.champ];
}


// ---- Les outils des questions de l'étape 120 ----
const ORDRES_GRANDEUR = ["Une dizaine au plus", "Quelques dizaines", "Une ou plusieurs centaines", "Un ou plusieurs milliers", "Des dizaines de milliers, ou plus"];
function ordreDeGrandeur(n) { return ORDRES_GRANDEUR[n <= 15 ? 0 : n < 100 ? 1 : n < 1000 ? 2 : n < 10000 ? 3 : 4]; }
// Les espèces qui mettent au monde des petits déjà formés (vipères, orvet, salamandre noire…)
function metAuMonde(e) { return /naissance à des petits/i.test(e.naissance || ""); }
const METAMORPHOSES = ["En passant par une chrysalide ou une nymphe", "Sans chrysalide : la larve grandit peu à peu"];
// "Chêne surtout, hêtre, pommier (bois mort)" → "Chêne, hêtre"
function deuxPremieres(texte) {
  return String(texte).replace(/\([^)]*\)/g, "").split(",").map(t => t.replace(/\bsurtout\b/i, "").trim()).filter(Boolean).slice(0, 2).join(", ");
}
const DUREES_LARVE = ["Moins de deux mois", "Deux à six mois", "Plus d'un an"];
function dureeLarve(ans) { return DUREES_LARVE[ans < 2 / 12 ? 0 : ans <= .5 ? 1 : 2]; }
function motLarve(e) { return /triton|salamandre/i.test(e.nom_courant) ? "larve" : "têtard"; }

// Les autres valeurs d'une colonne à liste fermée, pour servir de mauvaises réponses.
//   colonne            : la colonne de la bonne réponse (ex : "defense_principale")
//   colonneSecondaires : facultatif ; une colonne dont les valeurs, séparées par " ; ",
//                        sont AUSSI vraies pour l'espèce et ne doivent donc pas être proposées
// Étape R239b (36.03, lenteurs) : les valeurs d'une colonne ne dépendent que des données → calculées une seule fois
const memoValeursColonne = new Map();
function valeursColonne(colonne) {
  let v = memoValeursColonne.get(colonne);
  if (!v) { v = [...new Set(ESPECES.map(e => e[colonne]).filter(estRenseigne))]; memoValeursColonne.set(colonne, v); }
  return v;
}
function autresDeLaListe(espece, colonne, colonneSecondaires) {
  const toutes = valeursColonne(colonne);
  const vraies = [espece[colonne]];
  if (colonneSecondaires && estRenseigne(espece[colonneSecondaires])) {
    vraies.push(...String(espece[colonneSecondaires]).split(" ; "));
  }
  return toutes.filter(v => !vraies.includes(v));
}

// Les valeurs d'une case : une seule en général, plusieurs si la question a un "separateur"
function valeursDe(espece, q) {
  const v = valeurDe(espece, q);
  return q.separateur ? String(v).split(q.separateur) : [v];
}

// Étape 135 : la fourchette réelle d'une espèce, lue dans plusieurs colonnes (ex : mâle et femelle).
// Rend [plus petit minimum, plus grand maximum], ou null si un des deux manque.
function fourchetteDe(espece, colonnesMin, colonnesMax) {
  const nombres = colonnes => colonnes.map(c => espece[c]).filter(v => typeof v === "number");
  const mins = nombres(colonnesMin), maxs = nombres(colonnesMax);
  if (!mins.length || !maxs.length) return null;
  return [Math.min(...mins), Math.max(...maxs)];
}

// Les questions qu'on PEUT poser sur une espèce (cases remplies uniquement)
// Étape 207 (lot E, lenteur) : le résultat ne dépend que des données de l'espèce et du son ; on le garde en mémoire
//   (il était recalculé des milliers de fois à chaque retour à l'accueil).
// Étape PR7 (03/11, lenteur avec beaucoup d'espèces au carnet) : une mémoire par réglage du son (avant : une seule,
//   effacée à chaque passage « avec / sans cri », donc tout était recalculé sans cesse), et une version sans copie
//   (listeQuestions) pour les calculs qui ne font que lire la liste.
const memoQuestions = new Map();
function listeQuestions(espece) {               // à lire seulement, jamais à modifier
  const cle = (sonActif ? 1 : 0) + "" + (avecCriQuandMeme ? 1 : 0);
  let m = memoQuestions.get(espece);
  if (!m) { m = {}; memoQuestions.set(espece, m); }
  return m[cle] || (m[cle] = calculerQuestionsPossibles(espece));
}
function questionsPossibles(espece) { return listeQuestions(espece).slice(); }
function calculerQuestionsPossibles(espece) {
  return QUESTIONS.filter(q => {
    if (q.retiree) return false;                                      // question retirée du jeu (étape 157)
    const v = valeurDe(espece, q);
    if (!estRenseigne(v)) return false;
    if (q.type === "nombre" && typeof v !== "number") return false;   // "NA" écrit en texte
    if (q.format === "son-nom" && !sonActif && !avecCriQuandMeme) return false;   // sans le son : pas de cri à reconnaître
    if (q.accepter && !q.accepter(v)) return false;                   // valeur trop générique (voir "accepter", partie 1)
    // Le milieu : pas de question s'il ne reste aucune mauvaise réponse sans ambiguïté (étape 77)
    if (q.champ === "milieu_principal" && q.pieges(espece).length === 0) return false;
    if (q.champ === "robe" && q.pieges(espece).length === 0) return false;    // de même pour l'aspect (étape 88)
    if (q.champ === "robe" && robeUniAmbigue(espece)) return false;           // « Uni » mais un motif décrit (étape 172)
    if (q.champ === "couleur_dominante" && q.pieges(espece).length === 0) return false;   // et pour la couleur (étape 135)
    // Étape R166 : toute question qui fournit ses pièges n'est posée que s'il en reste au moins un (avant : un QCM à une seule
    // réponse était possible, par exemple la saison de reproduction de 13 espèces)
    // Étape R185 : une question d'allure que la photo de l'espèce ne montre pas (ou contredit) n'est pas posée (VERIF_PHOTOS)
    if (verdictPhoto(espece, q.champ) === "pas_posee") return false;
    // Étape R264 (40.14) : les prédateurs ne se demandent plus qu'en « Lequel de ces animaux est un de ses prédateurs ? »
    //   (un vrai prédateur nommé parmi des chasseurs crédibles de son monde qui ne la mangent pas). Les listes des autres
    //   espèces (« Qui sont ses prédateurs ? ») donnaient des pièges faciles (« Guêpes parasites » pour un moineau) ou à
    //   moitié vrais (« Loutre » pour l'ablette) : sans pièges sûrs, la question n'est pas posée.
    if (q.champ === "predateurs" && !modeItems(espece, "predateurs")) return false;
    if (questionDuGroupeTropFacile(q, espece)) return false;   // étape R297 (note 7) : insectes, régime et aliment
    if (q.pieges && !q.format && q.type !== "nombre" && autresValeurs(q, v, espece).length === 0
        && !(q.piegesQcm && piegesDuQcm(q, espece, v).length)) return false;   // étape R187 : sans les pièges interdits
    // Étape R184 (10/11, retour d'Aubin : « Comment sont ses oreilles ? » de la fouine, une seule réponse, « Moyennes ») :
    // la même règle pour les questions en dessins (format « picto »), qui y échappaient
    if (q.format === "picto" && autresValeurs(q, v, espece).length === 0) return false;
    // Étape R237 (note du 12/11 : « si l'espèce niche presque partout, ne pas poser la question ») : le nid n'est demandé que
    // s'il reste au moins 3 endroits où l'espèce ne niche sûrement pas (la bergeronnette grise : il n'en reste que 2)
    if (q.champ === "emplacement_nid" && autresValeurs(q, v, espece).length < 3) return false;
    // Étape R102 (Revoir 10, choix E2) : le bec des mésanges est trop petit et trop sombre pour juger sa couleur sur une photo
    if (q.champ === "bec_couleur" && /^Mésange/.test(espece.nom_courant)) return false;
    if (q.pasDansLeNom && seDevineDuNom(espece, v)) return false;     // réponse soufflée par le nom de l'espèce
    if (q.champ === "milieu_principal" && MILIEU_DANS_LE_NOM.includes(espece.nom_courant)) return false;   // étape R187
    // Particularités : pas de question si TOUTES se devinent dans le nom
    if (q.champ === "adaptations_physiques" && String(v).split(q.separateur).every(p => seDevineDuNom(espece, p))) return false;
    return !(q.ignorer || []).includes(v);
  });
}

// Combien de fois le joueur a trouvé cette caractéristique (0 si jamais)
function nbBonnes(espece, champ) {
  const p = progression[espece.nom_courant];
  if (!p) return 0;
  return p.acquis[champ] || 0;       // "|| 0" : si rien n'est noté, on compte 0
}

// ---- Étape 101 (J2) : les trois niveaux d'une donnée ----
// Chaque case de la fiche (la photo, chaque caractéristique) a son niveau, selon le nombre de fois où elle a été trouvée :
//   1 fois = Découvert · 2 fois = Connu · 3 fois et plus = Confirmé.
// Une espèce est « maîtrisée » quand toutes ses cases sont confirmées (fusion décidée le 11/10).
// Étape 212 (Revoir 2, 18/10) : deux statuts seulement — Découvert (trouvée 1 fois), Connu (2 fois et plus).
//   SEUIL_CONFIRME garde son nom dans le code : c'est le niveau le plus haut (= Connu).
const SEUIL_CONFIRME = 2;
const NIVEAUX_DONNEE = ["", "Découvert", "Connu"];
function niveauDonnee(espece, champ) { return Math.min(SEUIL_CONFIRME, nbBonnes(espece, champ)); }
// Trouvée, mais pas encore confirmée : ce que les questions viennent consolider
function aConsolider(espece, champ) { const n = nbBonnes(espece, champ); return n >= 1 && n < SEUIL_CONFIRME; }

// ---- Étape 150 : laisser reposer ce qui vient d'être trouvé ----
// Une réponse trouvée ne revient pas tout de suite à la partie suivante : on attend quelques parties,
// d'autant plus longtemps qu'elle est solide (le principe des « révisions espacées ») :
//   Découvert (trouvée 1 fois) : 2 parties plus tard · Connu (2 fois) : 3 parties · Confirmé (3 fois et +) : 5 parties.
// C'est une préférence, pas une interdiction : s'il ne reste rien d'autre à demander, la question peut revenir.
// Une question ratée (« à revoir ») n'attend pas.
const REPOS_PARTIES = [0, 2, 4];                       // étape 212 : Découvert 2 parties, Connu 4 parties
function noterRevue(espece, champ) { suivi.revues[espece.nom_courant + "|" + champ] = suivi.parties || 0; }
// Étape 172 (13/10, l'escargot revenu deux parties de suite) : une question ratée, déjà reprise à la fin de sa partie,
// ne revient pas dès la partie suivante ; elle attend une partie (suivi.ratees = le numéro de la partie où elle a été ratée).
function auRepos(espece, champ) {
  const ratee = (suivi.ratees || {})[espece.nom_courant + "|" + champ];
  if (ratee !== undefined && (suivi.parties || 0) - ratee === 1) return true;
  if (aRevoir.some(r => r.nom === espece.nom_courant && r.champ === champ)) return false;
  const derniere = suivi.revues[espece.nom_courant + "|" + champ];
  if (derniere === undefined) return false;           // trouvée avant l'étape 150 : on ne sait pas quand
  return (suivi.parties || 0) - derniere < REPOS_PARTIES[Math.min(SEUIL_CONFIRME, nbBonnes(espece, champ))];
}
// Garde les éléments qui ne sont pas au repos… sauf s'ils le sont tous
function sansRepos(liste, lire = x => x) {
  const prets = liste.filter(x => { const c = lire(x); return !auRepos(c.espece, c.champ); });
  return prets.length ? prets : liste;
}
// Étape 197 (remise à plat, 17/10) : 3 progressions seulement à l'écran — médailles d'espèce, rangs de famille, badges.
//   Les points Découvert / Connu / Confirmé, l'XP, le rang de naturaliste et les étoiles ne s'affichent plus.
const PROGRESSIONS_SIMPLES = true;
// Les trois petits points d'une donnée (●○○ / ●●○ / ●●●), avec le mot au survol
function pointsDonnee(espece, champ) {
  const n = niveauDonnee(espece, champ);
  if (!n || PROGRESSIONS_SIMPLES) return "";            // étape 197 : plus affichés (le calcul reste pour les révisions)
  return `<span class="points-donnee" title="${NIVEAUX_DONNEE[n]}" aria-label="${NIVEAUX_DONNEE[n]}">`
    + [1, 2].map(i => `<i class="${i <= n ? "plein" : ""}"></i>`).join("") + `</span>`;
}

// Toutes les "cases" de la fiche d'une espèce : la reconnaissance sur
// photo (si elle a une photo) + ses caractéristiques questionnables.
function champsDe(espece) {
  const champs = questionsPossibles(espece).map(q => q.champ);
  if (estRenseigne(espece.photo)) champs.unshift(IDENTIFICATION);   // unshift = ajouter au début
  return champs;
}

// L'espèce a-t-elle déjà été reconnue sur sa photo ?
function estIdentifiee(espece) {
  if (!estRenseigne(espece.photo)) return true;      // pas de photo : rien à reconnaître
  return nbBonnes(espece, IDENTIFICATION) >= 1;
}

// ---- Les niveaux (étape 25) -------------------------------------------
// Chaque question porte un "niveau" (1, 2 ou 3 : voir partie 1). Sur une espèce,
// le niveau 2 ne s'ouvre que lorsque TOUTES ses questions de niveau 1 ont été
// trouvées au moins une fois ; pareil pour le niveau 3 après le niveau 2.
const NB_NIVEAUX = 3;
const MEDAILLES = ["", "bronze", "argent", "or"];     // niveau 1 terminé = bronze, 2 = argent, 3 = or
// Étape PR2 (01/11) : ce que dit chaque médaille — bronze = son allure (étape 1), argent = sa vie (étape 2), or = Approfondir
// Étape R102 (Revoir 10, choix D2) : chaque phrase dit ce que le joueur sait faire
const SENS_MEDAILLE = ["", "Vous la reconnaissez à sa photo et à son allure", "Vous savez comment elle vit", "Vous la connaissez en profondeur"];
// Étape R236 (note 8) : la même phrase, accordée au nom de l'espèce (« Vous le reconnaissez… » pour le merle)
function sensMedaille(niveau, e) {
  const p = pe(e);
  return ["", `Vous ${p.la} reconnaissez à sa photo et à son allure`, `Vous savez comment ${p.elle} vit`, `Vous ${p.la} connaissez en profondeur`][niveau] || "";
}   // R144 : explication de chaque palier
// Étape R144 (07/11/2026, choix de l'utilisateur, proposition G revue) : les espèces n'ont plus de « médailles » (le mot est
//   réservé aux lieux, R133) mais trois paliers de relation : Croisée (étape 1), Comprise (étape 2), Familière (Approfondir).
//   Le calcul ne change pas (niveauTermine, medailleMax, colonnes bronze/argent/or des anecdotes) : seuls les mots et l'icône changent.
const PALIERS_ESPECE = ["", "Reconnue", "Comprise", "Familière"];   // étape E2-3 (n° 13.1, choix d'Aubin du 14/11) : « Croisée » → « Reconnue »
const CLASSES_PALIER = ["", "croisee", "comprise", "familiere"];   // classes CSS (couleurs vertes, plus de métal)
function nomPalier(n) { return (PALIERS_ESPECE[n] || "").toLowerCase(); }

// Les caractéristiques d'une espèce pour UN niveau donné
// Étape 215 (19/10) : la médaille de bronze demande 5 caractéristiques au plus.
//   Les caractéristiques sont prises dans l'ordre (niveau 1, puis 2, puis 3, dans l'ordre des questions) :
//   les 5 premières du niveau 1 font le bronze ; toutes les autres sont partagées en deux moitiés,
//   l'argent (la première moitié) et l'or (la seconde). Le niveau des questions (q.niveau) ne change pas
//   ailleurs (présentation des traits) : seule la répartition entre médailles est calculée ici.
const BRONZE_MAX = 5;
const memoMedailles = new WeakMap();
function repartitionMedailles(espece) {
  const liste = listeQuestions(espece);          // étape PR7 : la même liste à chaque appel, donc la mémoire sert vraiment
  let r = memoMedailles.get(liste);
  if (r) return r;
  r = new Map();
  const ordre = [1, 2, 3].flatMap(n => liste.filter(q => q.niveau === n));
  const bronze = liste.filter(q => q.niveau === 1).slice(0, BRONZE_MAX);
  const reste = ordre.filter(q => !bronze.includes(q));
  const moitie = Math.ceil(reste.length / 2);
  bronze.forEach(q => r.set(q.champ, 1));
  reste.forEach((q, i) => r.set(q.champ, i < moitie ? 2 : 3));
  memoMedailles.set(liste, r);
  return r;
}
function niveauMedaille(espece, q) { return repartitionMedailles(espece).get(q.champ) || q.niveau; }
// Étape R262 (lenteurs) : gardé en mémoire avec la liste des questions (même principe que repartitionMedailles)
const memoChampsNiveau = new WeakMap();
function champsDuNiveau(espece, niveau) {
  const liste = listeQuestions(espece);
  let m = memoChampsNiveau.get(liste);
  if (!m) { m = {}; memoChampsNiveau.set(liste, m); }
  if (!m[niveau]) m[niveau] = liste.filter(q => niveauMedaille(espece, q) === niveau).map(q => q.champ);
  return m[niveau].slice();
}

// Combien de niveaux l'espèce a-t-elle TERMINÉS ? (0, 1, 2 ou 3)
// On avance tant que toutes les caractéristiques du niveau suivant sont trouvées.
// Un niveau sans aucune question (ex : niveau 3 de la miramelle) compte comme
// terminé d'office : ".every" répond "vrai" sur une liste vide.
// Étape 227 (20/10) : une médaille gagnée n'est JAMAIS reprise. Quand le contenu change (une question retirée,
// comme « poussin », ou ajoutée), la répartition des caractéristiques entre médailles peut bouger : le calcul
// pourrait alors redonner une médaille plus basse. La meilleure médaille atteinte est donc gardée dans le carnet
// (progression[nom].medailleMax, enregistrée avec la sauvegarde). Les caractéristiques qui manquent restent posées.
function niveauTermine(espece) {
  const carnet = progression[espece.nom_courant];
  if (!carnet || !estIdentifiee(espece)) return 0;
  const garde = Number.isInteger(carnet.medailleMax) ? carnet.medailleMax : 0;
  let niveau = 0;
  // Les niveaux déjà gagnés comptent comme terminés ; au-delà, il faut toutes les caractéristiques du niveau.
  while (niveau < NB_NIVEAUX &&
         (niveau < garde || champsDuNiveau(espece, niveau + 1).every(c => nbBonnes(espece, c) >= 1))) {
    niveau = niveau + 1;
  }
  // Revoir 7 (étape 332) : depuis les expéditions, on ne passe plus par toutes les questions du niveau 1 ; les médailles
  // suivent donc aussi l'expédition : bronze = espèce faite à l'étape 1 (Faire connaissance), argent = étape 2 (Leur vie),
  // or = étape 3 (Approfondir). La règle d'avant reste valable (on garde la meilleure des deux).
  if (typeof especeFaite === "function") {
    try {
      const exp = especeFaite(espece, 1) ? (especeFaite(espece, 2) ? (especeFaite(espece, 4) ? 3 : 2) : 1) : 0;
      if (exp > niveau) niveau = exp;
    } catch (e) {}
  }
  if (niveau > garde) carnet.medailleMax = niveau;
  return niveau;
}

// Le niveau sur lequel on peut poser des questions : celui qui suit le dernier terminé
// Étape 52 : le niveau choisi à la première visite ouvre d'office ses questions et celles
// des niveaux en dessous (Naturaliste Aguerri = 1 et 2, Expert de Terrain = 1, 2 et 3). Math.max garde le plus
// grand des deux : un Curieux de Nature qui termine le niveau 1 passe au niveau 2 comme avant.
// Les médailles ne changent pas : elles récompensent toujours un niveau TERMINÉ.
// Étape R143 (07/11/2026, décision de l'utilisateur) : la règle d'ouverture progressive est retirée.
//   Hors expédition (Rencontre, défis, Portrait-robot), toutes les questions d'une espèce sont ouvertes.
//   Le niveau des questions (q.niveau) reste dans les données : il range toujours les questions de la Rencontre
//   (les simples d'abord) et la répartition des médailles ; il pourra resservir plus tard.
//   Pour revenir à l'ancienne règle : OUVERTURE_PROGRESSIVE = true.
const OUVERTURE_PROGRESSIVE = false;
function niveauOuvert(espece) {
  if (!OUVERTURE_PROGRESSIVE) return NB_NIVEAUX;
  const niveauProfil = profil ? profil.niveau : 1;
  return Math.min(Math.max(niveauTermine(espece) + 1, niveauProfil), NB_NIVEAUX);
}

// Les cases sur lesquelles on a le droit d'interroger : la photo + les
// caractéristiques des niveaux déjà ouverts (les niveaux verrouillés attendent).
function champsOuverts(espece) {
  const ouvert = niveauOuvert(espece);
  const champs = questionsPossibles(espece).filter(q => niveauMedaille(espece, q) <= ouvert || q.toujoursOuverte).map(q => q.champ);   // étape 172 : empreinte et cri
  if (estRenseigne(espece.photo)) champs.unshift(IDENTIFICATION);
  return champs;
}

// Les cases parmi lesquelles on TIRE la prochaine question (étape 51).
// C'est la même liste que champsOuverts, à une exception près : si le joueur a répondu
// "Non" à la question du son lors d'une Rencontre PRÉCÉDENTE, le cri reste candidat tant
// que la question du son n'a pas été reposée dans la Rencontre en cours. Sans cela, le jeu
// ne proposerait plus jamais de cri, et ne redemanderait donc jamais si le son est revenu.
function champsAInterroger(espece) {
  if (sonActif || sonDemande || defi) return champsOuverts(espece);
  avecCriQuandMeme = true;
  const champs = champsOuverts(espece);
  avecCriQuandMeme = false;
  return champs;
}

// Comment écrire une valeur à l'écran (ex : 17 → "17 ans", "herbivore" → "Herbivore")
function afficherValeur(q, valeur) {
  return q.affichage ? q.affichage(valeur) : majuscule(valeur);
}

// Deux réponses se ressemblent-elles trop pour servir de piège l'une à l'autre ?
// Oui si l'une contient l'autre ("Aiglon" / "Aiglon (jeune gypaète)"), ou si elles
// ont un mot en commun ("Graminées, lichens" / "Graminées, fleurs") : un piège
// qui serait à moitié vrai rendrait la question injuste.
// On compare le début des mots (5 lettres) pour rapprocher "forêt" et "forêts".
function debutsDeMots(texte) {
  return String(texte).toLowerCase()
    .split(/[^a-zàâäçéèêëîïôöùûüœ]+/)          // on coupe à tout ce qui n'est pas une lettre
    .filter(mot => mot.length >= 4)              // on ignore les petits mots (et, de, ou…)
    .map(mot => mot.slice(0, 5));
}
function seRessemblent(a, b) {
  const x = String(a).toLowerCase(), y = String(b).toLowerCase();
  if (x.includes(y) || y.includes(x)) return true;
  const motsDeB = debutsDeMots(b);
  return debutsDeMots(a).some(mot => motsDeB.includes(mot));
}

// Une réponse se devine-t-elle dans le nom de l'espèce ? (étape 26)
// Oui si un mot de la réponse commence comme un mot du nom : "Renardeau" / "Renard roux",
// "Fourmilière" / "Fourmi rousse des bois", "Bourdonne" / "Bourdon des Alpes".
// On ignore les mots trop courants ("grand", "petit", "commun"), qui ne soufflent rien.
const MOTS_BANALS = ["grand", "petit", "commu"];
// Étape R187 (11/11, choix d'Aubin, n° 9 : « enlever uniquement pour les milieux ») : le nom donne le milieu → la question
// « Où vit-il le plus souvent ? » n'est pas posée. Liste écrite à la main : la règle des débuts de mots (seDevineDuNom)
// écarterait aussi les campagnols (« Campa… » → « Campagne, haies et jardins »), à tort. Le reste (couleur « cendré »,
// plantes des papillons…) est gardé : le nom aide aussi à retenir.
const MILIEU_DANS_LE_NOM = ["Patelline des fleuves", "Loche de rivière", "Bécassine des marais", "Cuivré des marais", "Dolomède des marais",
  "Escargot des haies", "Escargot des jardins", "Musaraigne des jardins", "Hirondelle de rochers",
  "Monticole de roche"];   // le monticole : même cas, repéré en R187 (le contrôleur ne l'avait pas vu, « roche » au singulier)
function seDevineDuNom(espece, valeur) {
  const motsDuNom = debutsDeMots(espece.nom_courant).filter(mot => !MOTS_BANALS.includes(mot));
  return debutsDeMots(valeur).some(mot => motsDuNom.includes(mot));
}

// ---- Étape 135 : les mauvaises réponses à moitié vraies ----
// PIEGES_A_EVITER : pour une bonne réponse donnée, les réponses à ne JAMAIS proposer à côté,
// parce qu'elles seraient vraies aussi au sens large (un insectivore est aussi un carnivore…).
// Cela vaut pour le QCM, le vrai / faux, le choix parmi 4 photos et l'Espèce mystère.
const PIEGES_A_EVITER = {
  regime_alimentaire_type: { insectivore: ["carnivore"], carnivore: ["insectivore"], granivore: ["herbivore"], herbivore: ["granivore"],
                             piscivore: ["carnivore"],   // étape 183 : un piscivore est aussi un carnivore
                             coprophage: ["détritivore"], "détritivore": ["coprophage"] },   // étape 192 : le géotrupe mange des bouses (matière morte)
  activite: { "À l'aube et au crépuscule": ["Surtout la nuit"] },
  danger_homme: { "Inoffensif": ["Pique ou mord, sans danger"], "Pique ou mord, sans danger": ["Inoffensif"] },
  indice_presence: { "Mue (peau abandonnée)": ["Exuvie (enveloppe de la larve)"], "Exuvie (enveloppe de la larve)": ["Mue (peau abandonnée)"] },
  // Étape AL2 (repéré en AL1 : « Nageoire horizontale » proposée pour la queue du loup gris) : la nageoire des dauphins et
  //   marsouins n'est jamais un piège pour un mammifère terrestre (hors du « monde » de l'espèce).
  // Étape R271 (test du 19/11, n° 7 : rat musqué, queue « Plate », « Longue » compté faux) : la colonne mélange la forme
  //   (plate, touffue) et la longueur (courte, longue). Une queue plate ou touffue peut aussi être longue (rat musqué, écureuil,
  //   renard) ; une queue courte est souvent touffue aussi (lapin, lièvre, blaireau) : ces réponses ne sont plus opposées.
  //   Pour une queue « longue », « touffue » et « plate » restent de vrais pièges (souris, rats, musaraignes : queue nue et ronde) ;
  //   les exceptions (desman, lérot, surmulot, campagnol roussâtre) sont dans l'onglet Pieges_interdits.
  // Étape R271 : un terrier est creusé dans le sol ou dans une berge abrupte (guêpier, martin-pêcheur, hirondelle de rivage) :
  //   « au sol » et « falaise » ne sont pas des pièges pour lui. Dans l'autre sens, « terrier » reste faux pour un aigle ou une alouette.
  emplacement_nid: { Terrier: ["Au sol", "Falaise ou paroi rocheuse"] },
  queue_forme: { Courte: ["Nageoire horizontale", "Touffue"], Touffue: ["Nageoire horizontale", "Longue"], Longue: ["Nageoire horizontale"],
                 Plate: ["Nageoire horizontale", "Longue"] },
};
// JAMAIS_PIEGES : des réponses trop générales pour servir de piège, quelle que soit la bonne réponse
// (« troupe » et « bande » se disent de beaucoup d'animaux ; « non évalué » ne s'apprend pas).
const JAMAIS_PIEGES = { nom_groupe: ["Troupe", "Bande"], statut_conservation: ["Non évalué", "Données insuffisantes", "Non applicable"],   // étape 193
                       verbe_cri: ["Crie", "Siffle"] };   // étape 275 : verbes qui se disent de presque tous les oiseaux
// ---- Étape R185 (10/11, demande d'Aubin : « hyper frustrant de voir la photo et voir le contraire de ce qui est proposé ») ----
// Les questions d'allure (aspect, couleurs, forme du corps, ailes) : deux valeurs VOISINES ne sont jamais proposées ensemble,
// car une photo ne permet pas de les départager (brun / orange, uni / points, rayures / marbrures, allongé / fuselé…).
// Échantillon du 10/11 (`reprise_pictos_aspect.md`) : 45 % de ces questions posaient problème, surtout à cause de pièges voisins.
// Exception : quand la photo de l'espèce tranche franchement, la voisine est rouverte (VERIF_PHOTOS, rempli par la vérification
// sur photo, point 3), pour que la question ne devienne pas trop facile.
const COULEURS_VOISINES = [["Brun", "Beige"], ["Brun", "Roux"], ["Brun", "Orange"], ["Brun", "Gris"], ["Brun", "Noir"],
  ["Beige", "Blanc"], ["Beige", "Jaune"], ["Beige", "Gris"], ["Beige", "Ivoire"], ["Roux", "Orange"], ["Roux", "Rouge"],
  ["Orange", "Jaune"], ["Orange", "Rouge"], ["Rouge", "Rose"], ["Rose", "Violet"], ["Rose", "Orange"], ["Gris", "Noir"],
  ["Gris", "Blanc"], ["Gris", "Argenté"], ["Blanc", "Argenté"], ["Blanc", "Ivoire"], ["Ivoire", "Jaune"], ["Bleu", "Violet"],
  ["Bleu", "Vert"], ["Vert", "Jaune"], ["Noir", "Bleu"], ["Gris clair", "Blanc"], ["Gris clair", "Gris"]];
// Étape R271 (test du 19/11, n° 7) : le bec a ses voisines en plus — un bec rose pâle ou couleur corne se dit aussi « ivoire »
//   (chardonneret, verdier), un bec gris clair aussi (pic mar, grosbec).
const BECS_VOISINS = [...COULEURS_VOISINES, ["Rose", "Ivoire"], ["Ivoire", "Gris"]];
const VOISINES = {
  couleur_dominante: COULEURS_VOISINES, bec_couleur: BECS_VOISINS, yeux_couleur: COULEURS_VOISINES,
  robe: [["Uni", "Points"], ["Uni", "Marbrures"], ["Uni", "Bicolore"], ["Taches", "Points"], ["Taches", "Ocelles (faux yeux)"],
         ["Taches", "Marbrures"], ["Taches", "Damier"], ["Points", "Ocelles (faux yeux)"], ["Rayures", "Barres"], ["Rayures", "Zigzag"],
         ["Rayures", "Marbrures"], ["Rayures", "Nervures"], ["Barres", "Zigzag"], ["Masque", "Bavette"], ["Masque", "Plastron"],
         ["Bavette", "Plastron"]],
  corps_forme: [["Fuselé", "Allongé"], ["Allongé", "Très allongé"], ["Fuselé", "Très allongé"], ["Fuselé", "Trapu"],
                ["Trapu", "Bossu"], ["Trapu", "Haut et plat"], ["Bossu", "Haut et plat"], ["Trapu", "Allongé"]],
  ailes_repos: [["Repliées", "En toit"]],
  // Étape AL2 (Notion 20 rouverte, « problème de liste ») : sur une photo, ces formes de bec se recouvrent (vérification AL1 :
  //   35 becs posaient problème). Elles ne sont jamais proposées ensemble. Les becs bien à part (croisé, en spatule, retroussé,
  //   plat et large) restent des pièges pour tous.
  bec_forme: [["Court et bombé", "Conique"], ["Court et bombé", "Court et courbé"], ["Conique", "Court et courbé"],
              ["Fort et droit", "Droit et pointu"], ["Fort et droit", "Conique"], ["Fort et droit", "Court et bombé"], ["Fort et droit", "Crochu"],
              ["Droit et pointu", "Conique"], ["Fin et courbé", "Long et courbé vers le bas"], ["Fin et courbé", "Court et courbé"],
              ["Crochu", "Court et courbé"]],
  // Étape R189 (notes n° 10 et 16 d'Aubin : moineau « en cavité », bergeronnette grise « Bâtiment » seulement) : les oiseaux qui
  //   nichent dans un trou ou sur une corniche passent souvent de l'un à l'autre ; ces trois endroits ne sont plus opposés.
  //   En attendant la colonne du nid à plusieurs valeurs (3 recherches, plus tard).
  emplacement_nid: [["Bâtiment", "Cavité d'arbre"], ["Bâtiment", "Falaise ou paroi rocheuse"], ["Cavité d'arbre", "Falaise ou paroi rocheuse"],
  //   Étape R237 : un nid flottant est presque toujours amarré dans les roseaux (grèbes, foulque, mouette rieuse) : jamais opposés.
    ["Roselière ou végétation dense", "Sur l'eau (nid flottant)"],
  //   Étape R271 (test du 19/11, n° 7 : « Le merle niche dans une roselière ou une végétation dense » compté faux, alors qu'un
  //   buisson est une végétation dense) : un buisson touffu, un nid au sol caché dans les herbes hautes (canards, busards) et
  //   la « végétation dense » se recouvrent. (Le terrier, creusé dans le sol ou dans une berge abrupte : voir PIEGES_A_EVITER.)
    ["Arbre ou buisson", "Roselière ou végétation dense"], ["Au sol", "Roselière ou végétation dense"]],
};
function sontVoisines(champ, a, b) { return (VOISINES[champ] || []).some(([x, y]) => (x === a && y === b) || (x === b && y === a)); }
// ---- Étape R237 (16/11, notes 10 et 16 d'Aubin : « Où fait-elle son nid ? ») ----
// Une question à une seule bonne réponse peut avoir une colonne « autres » : les autres valeurs, vraies AUSSI pour l'espèce
// (relues dans les sources, 2 sur 3). Elles ne sont jamais des pièges : ni dans le QCM, ni dans le Vrai ou faux, ni chez
// une autre espèce (« Laquelle des deux ? », photos, planche), ni dans l'étape 2 (« Et si… ? »). Leurs voisines non plus.
const COLONNES_AUTRES = { emplacement_nid: "emplacement_nid_autres" };
function valeursAutres(espece, champ) {
  const c = COLONNES_AUTRES[champ];
  return c && espece && estRenseigne(espece[c]) ? String(espece[c]).split(";").map(v => v.trim()).filter(estRenseigne) : [];
}
// VERIF_PHOTOS (fichier facultatif verif_photos.js) : { "spirlin.jpg": { robe: { voisines: ["Uni"] } } } — la photo tranche
function lignePhoto(espece, champ) {
  if (!espece || typeof VERIF_PHOTOS === "undefined") return null;
  return (VERIF_PHOTOS[String(espece.photo || "").split("/").pop()] || {})[champ] || null;
}
function verdictPhoto(espece, champ) { const v = lignePhoto(espece, champ); return v ? v.verdict : null; }   // « ok », « voisines », « pas_posee »
function voisinePermise(espece, champ, valeur) {
  const v = lignePhoto(espece, champ);
  return !!(v && v.verdict === "voisines" && (v.voisines || []).includes(valeur));
}
function piegeInterdit(q, bonne, valeur, espece) {
  if ((JAMAIS_PIEGES[q.champ] || []).includes(valeur)) return true;
  if (VOISINES[q.champ]) {                                     // étape R185
    const bonnes = espece ? [bonne, ...valeursDe(espece, q), ...valeursAutres(espece, q.champ)] : [bonne];   // R237 : + les autres
    if (bonnes.some(b => sontVoisines(q.champ, b, valeur)) && !voisinePermise(espece, q.champ, valeur)) return true;
  }
  return ((PIEGES_A_EVITER[q.champ] || {})[bonne] || []).includes(valeur);
}

// ---- Étape 137 : les groupes d'aliments et de prédateurs (tableur V44) et les pièges interdits ----
// Chaque espèce a deux colonnes cachées, proies_groupes et predateurs_groupes (ex : « Herbes et feuilles ;
// Insectes »). Une liste d'aliments n'est proposée comme mauvaise réponse que si elle n'a AUCUN groupe
// en commun avec ce que l'espèce mange vraiment. Pareil pour les prédateurs.
const GROUPES_PLANTES = ["Herbes et feuilles", "Fruits et graines", "Nectar, pollen et sève", "Bois et écorce", "Lichens, mousses et champignons"];
const GROUPES_ANIMAUX = ["Insectes", "Araignées et petites bêtes", "Vers et mollusques", "Crustacés", "Poissons", "Amphibiens et reptiles",
                         "Oiseaux et œufs", "Petits mammifères", "Grands mammifères", "Charognes et os"];
// "Herbes et feuilles ; Insectes" → ["Herbes et feuilles", "Insectes"]
function listeGroupes(texte) {
  return estRenseigne(texte) ? String(texte).split(";").map(g => g.trim()).filter(Boolean) : [];
}
// Les groupes d'une liste d'aliments (ou de prédateurs) : ceux de l'espèce à qui appartient cette liste
function groupesDuTexte(colonne, texte) {
  const proprietaire = ESPECES.find(e => e[colonne] === texte);
  return proprietaire ? listeGroupes(proprietaire[colonne + "_groupes"]) : [];
}
// Le régime : quand colle-t-il à ce que l'espèce mange ? (pour ne jamais proposer comme faux un régime
// défendable : « omnivore » pour la marmotte, qui mange des herbes, des graines et quelques insectes)
const REGIME_COLLE = {
  herbivore:        g => g.some(x => GROUPES_PLANTES.includes(x)),
  granivore:        g => g.includes("Fruits et graines"),
  insectivore:      g => g.includes("Insectes"),
  carnivore:        g => g.some(x => GROUPES_ANIMAUX.includes(x)),
  omnivore:         g => g.some(x => GROUPES_PLANTES.includes(x)) && g.some(x => GROUPES_ANIMAUX.includes(x)),
  "détritivore":    g => g.includes("Débris et matière morte"),
  "suceur de sang": g => g.includes("Sang"),
  filtreur:         g => g.includes("Algues et plancton"),
  piscivore:        g => g.includes("Poissons"),          // étape 183 : oiseaux marins (cormorans, sternes…)
  coprophage:       g => g.includes("Excréments"),        // étape 192 : géotrupe du fumier
};
// Cette réponse est-elle AUSSI vraie (ou défendable) pour cette espèce ? Si oui, elle ne sert jamais de piège.
// Étape R239b (36.03, lenteurs) : les pièges interdits rangés par espèce (avant : toute la liste relue à chaque réponse possible)
let piegesInterditsParEspece = null;
function piegesInterditsDe(espece) {
  if (!piegesInterditsParEspece) {
    piegesInterditsParEspece = new Map();
    for (const p of (typeof PIEGES_INTERDITS === "undefined" ? [] : PIEGES_INTERDITS)) {
      if (!piegesInterditsParEspece.has(p.nom_courant)) piegesInterditsParEspece.set(p.nom_courant, []);
      piegesInterditsParEspece.get(p.nom_courant).push(p);
    }
  }
  return piegesInterditsParEspece.get(espece.nom_courant) || [];
}
function couleursDuBecAussi(espece) {
  return piegesInterditsDe(espece).filter(p => p.colonne === "bec_couleur" && p.reponse_interdite !== "Multicolore").map(p => String(p.reponse_interdite));
}
function aussiVraiPour(q, espece, valeur) {
  // 1. L'onglet Pieges_interdits du tableur (ex : « Jaune » pour le bec du faucon pèlerin)
  const interdit = piegesInterditsDe(espece).some(p =>
    p.nom_courant === espece.nom_courant && (p.colonne === q.champ || p.colonne === q.colonnePicto)
    && String(p.reponse_interdite).toLowerCase() === String(valeur).toLowerCase());
  if (interdit) return true;
  // 1a. Étape R271 (test du 19/11, n° 7 : bec du pigeon ramier, du moineau, du pinson) : pour la couleur du bec, l'onglet
  //     Pieges_interdits liste les autres couleurs du bec (bout, base, femelle, jeune, hiver). Leurs voisines ne sont pas des
  //     pièges non plus, ni « Multicolore » (un bec noir à pointe jaune est déjà de deux couleurs).
  if (q.champ === "bec_couleur") {
    const autres = couleursDuBecAussi(espece);
    if (autres.length && (valeur === "Multicolore" || autres.some(x => sontVoisines("bec_couleur", x, valeur)))) return true;
  }
  // 1b. Étape R237 : une valeur de la colonne « autres » (le nid : « Bâtiment » ET « Falaise » pour le moineau friquet)
  //     ou une de ses voisines (dans l'autre sens aussi : « Laquelle des deux niche dans un bâtiment ? »)
  if (valeursAutres(espece, q.champ).some(x => x === valeur || sontVoisines(q.champ, x, valeur))) return true;
  // 2. Aliments et prédateurs : un groupe en commun suffit
  if (q.champ === "proies" || q.champ === "predateurs") {
    const siens = listeGroupes(espece[q.champ + "_groupes"]);
    const ceux = groupesDuTexte(q.champ, valeur);
    return siens.some(g => ceux.includes(g));
  }
  // 3. Le régime, d'après les groupes d'aliments
  if (q.champ === "regime_alimentaire_type") {
    const colle = REGIME_COLLE[valeur];
    const groupes = listeGroupes(espece.proies_groupes);
    return !!colle && groupes.length > 0 && colle(groupes);
  }
  return false;
}

// ---- Étape 227 (20/10) : un aliment, un prédateur ------------------------------------------------------------
// Colonnes proies_items et predateurs_items (« Herbes ; Lichens ; Mousses », « Aigle royal ; Renard ») : la case
// proies ou predateurs découpée en éléments courts (relu le 20/10). ALIMENTS (especes.js) donne le groupe de chaque aliment.
function listeItems(espece, colonne) { return listeGroupes(espece[colonne + "_items"]); }
const MILIEUX_MER = ["Mer et océan", "Estuaires et lagunes", "Dunes et plages"];
const MILIEUX_EAU_DOUCE = ["Rivières et torrents", "Mares et étangs", "Lacs", "Marais", "Eaux souterraines"];
function typeMilieu(espece) {
  const m = espece.milieu_principal;
  return MILIEUX_MER.includes(m) ? "mer" : MILIEUX_EAU_DOUCE.includes(m) ? "eau douce" : "terre";
}
// Des réponses que le nom de l'espèce souffle (le guêpier mange des guêpes, le balbuzard pêcheur des poissons)
const ITEMS_SOUFFLES = { "Guêpier d'Europe": ["Abeilles et guêpes"], "Bondrée apivore": ["Abeilles et guêpes"],
  "Huîtrier pie": ["Moules et coquillages"], "Balbuzard pêcheur": ["Poissons"], "Martin-pêcheur d'Europe": ["Poissons"],
  "Circaète Jean-le-Blanc": [], "Busard des roseaux": [], "Faucon pèlerin": ["Pigeons"] };
function itemsPosables(espece, colonne) {
  return listeItems(espece, colonne).filter(i => !seDevineDuNom(espece, i) && !(ITEMS_SOUFFLES[espece.nom_courant] || []).includes(i));
}
// Groupes voisins : quand une espèce mange l'un, l'autre n'est jamais une mauvaise réponse (souvent mangé aussi,
// même si la liste ne le cite pas : un cerf qui broute des feuilles mange aussi des glands et de l'écorce).
const GROUPES_VOISINS = {
  "Herbes et feuilles": ["Fruits et graines", "Bois et écorce", "Lichens, mousses et champignons"],
  "Fruits et graines": ["Herbes et feuilles", "Bois et écorce"],
  "Bois et écorce": ["Herbes et feuilles"],
  "Lichens, mousses et champignons": ["Herbes et feuilles", "Débris et matière morte"],
  "Insectes": ["Araignées et petites bêtes", "Vers et mollusques", "Amphibiens et reptiles"],
  "Araignées et petites bêtes": ["Insectes"],
  "Vers et mollusques": ["Insectes", "Crustacés"],
  "Crustacés": ["Poissons", "Vers et mollusques", "Algues et plancton", "Charognes et os"],
  "Poissons": ["Crustacés", "Charognes et os"],                  // les mangeurs de poissons prennent aussi les poissons morts
  "Petits mammifères": ["Oiseaux et œufs", "Amphibiens et reptiles", "Grands mammifères", "Insectes"],
  "Oiseaux et œufs": ["Petits mammifères"],
  "Amphibiens et reptiles": ["Petits mammifères"],
  "Grands mammifères": ["Charognes et os", "Petits mammifères"],
  "Charognes et os": ["Grands mammifères"],
  "Algues et plancton": ["Débris et matière morte", "Crustacés"],
  "Débris et matière morte": ["Algues et plancton", "Excréments", "Lichens, mousses et champignons"],
  "Excréments": ["Débris et matière morte"],
};
const GROUPES_INVERTEBRES = ["Insectes", "Araignées et petites bêtes", "Vers et mollusques", "Crustacés"];
const GROUPES_VERTEBRES = ["Poissons", "Amphibiens et reptiles", "Oiseaux et œufs", "Petits mammifères", "Grands mammifères"];
// Les groupes qu'une espèce mange (ou peut manger) : ceux du tableur, ceux de ses aliments, leurs voisins,
// et ceux que couvre un mot large de sa liste (« végétaux », « invertébrés », « petits animaux »…).
// Étape R264 : gardé en mémoire (appelé pour chaque chasseur possible de chaque espèce : trop lent sinon)
const memoGroupesDefendus = new Map();
function groupesDefendus(espece) {
  let g = memoGroupesDefendus.get(espece);
  if (!g) { g = calculerGroupesDefendus(espece); memoGroupesDefendus.set(espece, g); }
  return g;
}
function calculerGroupesDefendus(espece) {
  const g = new Set(listeGroupes(espece.proies_groupes));
  for (const i of listeItems(espece, "proies")) if (ALIMENTS[i]) g.add(ALIMENTS[i]);
  for (const x of [...g]) (GROUPES_VOISINS[x] || []).forEach(v => g.add(v));
  // Un mammifère qui chasse les petites bêtes (hérisson, blaireau, musaraigne) prend aussi un œuf ou une grenouille
  if (espece.onglet === "Mammiferes" && g.has("Insectes")) ["Oiseaux et œufs", "Amphibiens et reptiles", "Petits mammifères"].forEach(v => g.add(v));
  const t = String(espece.proies || "").toLowerCase();
  if (/végéta|plantes\b|matière organique|cultures|légumes/.test(t)) [...GROUPES_PLANTES, "Débris et matière morte"].forEach(v => g.add(v));
  if (/invertébrés|petits animaux|arthropodes|larves\b|vers\b/.test(t)) GROUPES_INVERTEBRES.forEach(v => g.add(v));
  if (/vertébrés|petits animaux|animaux morts|cadavres|déchets/.test(t)) [...GROUPES_VERTEBRES, "Charognes et os"].forEach(v => g.add(v));
  return g;
}
// Le monde d'un aliment : les milieux des espèces qui le mangent (calculé une fois)
let mondeAliments = null;
function mondeAliment(aliment) {
  if (!mondeAliments) {
    mondeAliments = {};
    for (const e of ESPECES) for (const i of listeItems(e, "proies")) (mondeAliments[i] = mondeAliments[i] || new Set()).add(typeMilieu(e));
  }
  return mondeAliments[aliment] || new Set();
}
// Les mauvaises réponses pour « Lequel de ces aliments mange-t-il ? », les plus crédibles d'abord :
// même genre de nourriture que lui (plantes pour un herbivore, animaux pour un carnivore), et mangés dans son milieu.
function piegesAliment(espece) {
  if (typeof ALIMENTS === "undefined") return [];
  const defendus = groupesDefendus(espece), siens = listeItems(espece, "proies");
  const g = listeGroupes(espece.proies_groupes);
  const mangePlantes = g.some(x => GROUPES_PLANTES.includes(x)), mangeAnimaux = g.some(x => GROUPES_ANIMAUX.includes(x));
  const milieu = typeMilieu(espece);
  const candidats = Object.keys(ALIMENTS).filter(a => !defendus.has(ALIMENTS[a]) && !siens.includes(a)
    && !seDevineDuNom(espece, a) && a !== "Vers"                       // ni « Chamois » pour le chamois, ni « Vers » trop vague
    && !aussiVraiPour({ champ: "proies_items" }, espece, a));
  const invertebre = !["Mammiferes", "Oiseaux", "Reptiles", "Amphibiens", "Poissons"].includes(espece.onglet);
  const grand = Math.max(espece.poids_max_kg || 0, espece.poids_max_kg_male || 0, espece.poids_max_kg_femelle || 0) >= 10;
  const score = a => {
    const groupe = ALIMENTS[a], plante = GROUPES_PLANTES.includes(groupe);
    return (mangePlantes && !mangeAnimaux ? (plante ? 2 : 0) : mangeAnimaux && !mangePlantes ? (plante ? 0 : 2) : 1)
         + (mondeAliment(a).has(milieu) ? 3 : 0)                                           // mangé dans son milieu
         + (mangeParLaFamille(a, espece.onglet) ? 1 : 0)                                   // mangé par des animaux de sa famille
         - (groupe === "Grands mammifères" && !grand ? 5 : 0)                              // une proie trop grosse pour lui
         - (invertebre && GROUPES_VERTEBRES.includes(groupe) ? 5 : 0)                     // une petite bête ne mange pas de lapin
         + Math.random() * 1.5;                                                            // un peu de hasard, pour varier
  };
  // Des mauvaises réponses variées : d'abord une par groupe (pas « Oiseaux » et « Oiseaux marins » ensemble)
  const ranges = parScore(candidats, score), vus = new Set(), tete = [], reste = [];
  for (const a of ranges) (vus.has(ALIMENTS[a]) ? reste : tete).push(a), vus.add(ALIMENTS[a]);
  const tous = [...tete, ...reste];
  // Étape 262 (« Revoir 3 ») : un herbivore ne se voit proposer que des plantes, un mangeur d'animaux que des animaux,
  // dès qu'il y en a assez (3). Sinon, une fois le régime connu, la bonne réponse sautait aux yeux
  // (« Herbes » au milieu de « Campagnols » et « Crustacés » pour le chamois).
  if (mangePlantes !== mangeAnimaux) {
    const memeGenre = tous.filter(a => GROUPES_PLANTES.includes(ALIMENTS[a]) === mangePlantes);
    if (memeGenre.length >= 3) return memeGenre;
  }
  return tous;
}
// Étape 262 : un régime « strict » (seulement des plantes, ou seulement des animaux)
function regimeStrict(espece) {
  const g = listeGroupes(espece.proies_groupes);
  return g.some(x => GROUPES_PLANTES.includes(x)) !== g.some(x => GROUPES_ANIMAUX.includes(x));
}
// Étape 262 (« Revoir 3 ») : après la question sur le régime (« herbivore »), on ne demande plus, dans la même
// Rencontre ou la même partie, « Lequel de ces aliments mange-t-il ? » : la réponse serait évidente.
// "dejaPosee(champ)" dit si une question a déjà été posée sur cette espèce pendant la partie.
function alimentApresRegime(espece, champ, dejaPosee) {
  return champ === "proies" && regimeStrict(espece) && dejaPosee("regime_alimentaire_type");
}
let familleAliments = null;
function mangeParLaFamille(aliment, onglet) {
  if (!familleAliments) {
    familleAliments = {};
    for (const e of ESPECES) for (const i of listeItems(e, "proies")) (familleAliments[i] = familleAliments[i] || new Set()).add(e.onglet);
  }
  return !!(familleAliments[aliment] && familleAliments[aliment].has(onglet));
}
// Mélanger, puis ranger par score (les meilleurs d'abord) : de la variété à score égal
function parScore(liste, score) {
  return melanger(liste).map(x => ({ x, s: score(x) })).sort((a, b) => b.s - a.s).map(o => o.x);
}

// Les prédateurs. La classe d'un prédateur cité (« Renard » → mammifère) : une mauvaise réponse ne doit jamais
// être de la même classe qu'un de ses vrais prédateurs (« Rapaces » cité → aucun rapace, ni aucun oiseau, proposé).
const CLASSES_PREDATEURS = [
  ["Crustaces", /araignée de mer|crabe|écrevisse|langouste/i],
  ["Oiseaux", /oiseau|rapace|aigle|circaète|faucon|crécerelle|épervier|autour|buse|busard|milan|vautour|pygargue|balbuzard|chouette|hulotte|effraie|chevêche|hibou|grand-duc|harfang|corbeau|corneille|corvidé|\bpies?\b|geai|choucas|freux|goéland|mouette|labbe|sterne|macareux|cormoran|héron|aigrette|cigogne|spatule|ibis|bondrée|guêpier|\bpics?\b|merle|grive|étourneau|bécasse|faisan|volaille|poule|canard|mésange|gobemouche|coucou|tétra|pie-grièche|martin-pêcheur/i],
  ["Mammiferes", /renard|loup|lynx|\bours\b|\bchats?\b|chiens?|martre|fouine|belette|hermine|putois|vison|mustélidé|blaireau|loutre|genette|sanglier|\brats?\b|surmulot|mulot|musaraigne|hérisson|taupe|écureuil|lérot|campagnol|chauve|souris|raton|phoque|orque|dauphin|mammifère|carnivore/i],
  ["Reptiles", /serpent|couleuvre|vipère|coronelle|lézard|reptile/i],
  ["Amphibiens", /grenouille|crapaud|triton|rainette|amphibien/i],
  ["Poissons", /poisson|truite|brochet|perche|sandre|silure|anguille|chabot|chevaine|lote|huchon|requin|morue|congre|thon|\bsars?\b|labre|grondin|rascasse|salmonidé/i],
  ["Insectes", /guêpe|frelon|fourmi|dytique|libellule|coléoptère|carabe|asilide|mouche|insecte|coccinelle|ver luisant/i],
  ["Araignees_mille_pattes", /araignée|scorpion|lithobie|pholque/i],
  ["Mollusques", /poulpe|escargot|limace|coquillage|grand triton/i],
];
function classesDe(item) {
  for (const [classe, motif] of CLASSES_PREDATEURS) if (motif.test(item)) return [classe];
  return null;                                           // inconnue : on restera prudent
}
// Ce que représente une espèce comme nourriture (une chouette ne peut pas être piège pour un campagnol)
const NOURRITURE_DE = { Mammiferes: ["Petits mammifères", "Grands mammifères", "Charognes et os"], Oiseaux: ["Oiseaux et œufs"],
  Amphibiens: ["Amphibiens et reptiles"], Reptiles: ["Amphibiens et reptiles"], Poissons: ["Poissons"], Insectes: ["Insectes"],
  Araignees_mille_pattes: ["Araignées et petites bêtes", "Insectes"], Crustaces: ["Crustacés"], Mollusques: ["Vers et mollusques"],
  Vers_meduses_compagnie: ["Vers et mollusques", "Algues et plancton"] };
// Les grands chasseurs « à tout faire » (renard, rapaces, corvidés, goélands, hérons) mangent bien plus que ce que
// disent les listes : ils ne servent jamais de mauvaise réponse pour un prédateur.
function chasseurGeneraliste(p) {
  return (p.onglet === "Mammiferes" && p.ordre === "Carnivores")
      || (p.onglet === "Oiseaux" && ["Accipitriformes", "Falconiformes", "Strigiformes", "Pélécaniformes", "Ciconiiformes", "Suliformes"].includes(p.ordre))
      || /goéland|mouette|labbe|corbeau|corneille|choucas|pie bavarde|geai|crave|chocard|grand-duc/i.test(p.nom_courant);
}
// Un prédateur cité de façon générale (« Rapaces », « Oiseaux », « Couleuvres ») couvre toute une classe
const PREDATEUR_GENERAL = /^(autres |petits |grands |gros )?(oiseaux|rapaces|chouettes|hiboux|corvidés|corneilles et corbeaux|belettes et martres|belettes|tétras|goélands|mouettes|labbes|faucons|aigles|hérons|mammifères|carnivores|mustélidés|chats|chiens|rats|serpents|couleuvres|lézards|reptiles|amphibiens|poissons|requins|insectes|guêpes|fourmis|araignées|crabes)\b/i;
function piegesPredateur(espece) {
  const siens = listeItems(espece, "predateurs");
  const classes = new Set(); let prudent = false;
  for (const i of siens) {
    const c = classesDe(i);
    if (!c) prudent = true;
    else if (PREDATEUR_GENERAL.test(i)) c.forEach(x => classes.add(x));
  }
  const nourriture = NOURRITURE_DE[espece.onglet] || [];
  const texte = String(espece.predateurs || "").toLowerCase();
  const milieu = typeMilieu(espece);
  const candidats = ESPECES.filter(p => {
    if (p === espece || !estRenseigne(p.proies_groupes)) return false;
    // Étape R264 (40.14, note 14a du 18/11 : « corb, brochet, anodonte » proposés pour un moineau) : une mauvaise réponse
    //   doit être un chasseur crédible de son monde. Avant, un mangeur de plantes servait toujours de piège (« le prédateur
    //   de personne ») : la bonne réponse se devinait. Maintenant : un chasseur (carnivore, insectivore, piscivore) qui mange
    //   des animaux, du même monde (voir mondeProie), pas nettement plus petit qu'elle (60 % de sa taille au moins), un
    //   vertébré pour un vertébré ; et toujours aucun qui pourrait la manger (règles d'avant, plus bas).
    if (!REGIMES_CHASSEURS.includes(String(p.regime_alimentaire_type || "").trim())) return false;   // un tétras ou un grosbec ne chasse pas
    if (ONGLETS_VERTEBRES.includes(espece.onglet) && !ONGLETS_VERTEBRES.includes(p.onglet)) return false;   // une limace ne chasse pas un lézard
    if (p.onglet === espece.onglet) return false;            // un poisson, une grenouille, un insecte mangent souvent leurs cousins
    if (!memeMondeChasse(espece, p)) return false;
    if (tropPetitPourChasser(p, espece)) return false;
    if (!listeGroupes(p.proies_groupes).some(x => GROUPES_ANIMAUX.includes(x) && x !== "Charognes et os")) return false;   // il doit chasser des animaux
    if (prudent || classes.has(p.onglet) || chasseurGeneraliste(p)) return false;
    if (debutsDeMots(p.nom_courant).some(m => m.length >= 4 && texte.includes(m))) return false;   // déjà cité
    if ([...groupesDefendus(p)].some(x => nourriture.includes(x))) return false;     // il pourrait le manger
    if (/invertébrés|petits animaux|vertébrés|arthropodes|animaux morts|cadavres|déchets/i.test(p.proies || "")) return false;
    return true;
  }).map(p => p.nom_courant);
  const territoires = String(espece.territoire).split(" ; ");
  const parNom = nom => especeParNom(nom);   // (15_territoire.js)
  const score = nom => {
    const p = parNom(nom);
    const tp = tailleMax(p), tq = tailleMax(espece);   // R264 : un chasseur au moins aussi grand qu'elle est plus crédible
    return (typeMilieu(p) === milieu ? 2 : 0) + (String(p.territoire).split(" ; ").some(t => territoires.includes(t)) ? 1 : 0)
         + (tp != null && tq != null && tp >= tq ? 1.5 : 0)
         + (["Mammiferes", "Oiseaux", "Reptiles", "Amphibiens", "Poissons"].includes(p.onglet) ? 1 : 0)
         + Math.random() * 2;                                                         // un peu de hasard, pour varier
  };
  // R264 : d'abord des chasseurs de son territoire (pas l'hémidactyle de Méditerranée pour une mésange de Paris), s'il y en a assez
  const chezElle = candidats.filter(nom => String(parNom(nom).territoire).split(" ; ").some(t => territoires.includes(t)));
  return parScore(chezElle.length >= 3 ? chezElle : candidats, score);
}
// Étape R264 (40.14) : le monde de chasse et la taille d'un prédateur crédible
// Le monde où l'on chasse. Comme proie : un oiseau, un mammifère terrestre, un papillon, une sauterelle, une grenouille
//   hors de l'eau vivent sur terre même au bord de l'eau (le canard colvert ne croise pas le sandre, le puffin pas la sole ;
//   une grenouille n'a pas de poisson comme faux prédateur : un gros poisson en mange) ; un poisson, une moule, une
//   écrevisse vivent dans l'eau (douce ou de mer). Comme chasseur : là où il chasse (la sterne en mer, le héron en eau
//   douce, le triton dans la mare, la salamandre tachetée en forêt).
const ORDRES_TOUJOURS_TERRE = ["Lépidoptères", "Orthoptères", "Hyménoptères", "Odonates", "Mantoptères", "Névroptères"];
function mondeProie(e) {
  const t = typeMilieu(e);
  if (e.onglet === "Oiseaux" || e.onglet === "Amphibiens" || ORDRES_TOUJOURS_TERRE.includes(e.ordre)) return "terre";
  if (e.onglet === "Poissons") return t === "terre" ? "eau douce" : t;
  return t;
}
function mondeChasseur(p) {
  if (ORDRES_TOUJOURS_TERRE.includes(p.ordre)) return "terre";
  const t = typeMilieu(p);
  return p.onglet === "Poissons" && t === "terre" ? "eau douce" : t;
}
function memeMondeChasse(proie, p) {
  if (proie.onglet === "Amphibiens" && p.onglet === "Poissons") return false;
  return mondeProie(proie) === mondeChasseur(p);
}
// Les classes de ses vrais prédateurs, d'après les groupes du tableur et les éléments de sa liste
const CLASSES_DES_GROUPES = { "Rapaces": "Oiseaux", "Autres oiseaux": "Oiseaux", "Mammifères carnivores": "Mammiferes", "Autres mammifères": "Mammiferes",
  "Serpents et lézards": "Reptiles", "Poissons": "Poissons", "Insectes et araignées": ["Insectes", "Araignees_mille_pattes"], "Amphibiens": "Amphibiens",
  "Crustacés": "Crustaces", "Mollusques": "Mollusques", "Invertébrés marins": ["Crustaces", "Mollusques"] };
function classesDesPredateurs(e) {
  const c = new Set();
  for (const g of listeGroupes(e.predateurs_groupes)) [].concat(CLASSES_DES_GROUPES[g] || []).forEach(x => c.add(x));
  for (const i of listeItems(e, "predateurs")) (classesDe(i) || []).forEach(x => c.add(x));
  for (const i of String(e.predateurs || "").split(/[,;]| et /)) (classesDe(i.trim()) || []).forEach(x => c.add(x));
  return c;
}
const REGIMES_CHASSEURS = ["carnivore", "insectivore", "piscivore"];
const ONGLETS_VERTEBRES = ["Mammiferes", "Oiseaux", "Reptiles", "Amphibiens", "Poissons"];
function tailleMax(e) {
  const v = [e.taille_max_cm, e.taille_max_cm_male, e.taille_max_cm_femelle].map(Number).filter(x => x > 0);
  return v.length ? Math.max(...v) : null;
}
function poidsMax(e) {
  const v = [e.poids_max_kg, e.poids_max_kg_male, e.poids_max_kg_femelle].map(Number).filter(x => x > 0);
  return v.length ? Math.max(...v) : null;
}
function tropPetitPourChasser(p, proie) {
  const tp = tailleMax(p), tq = tailleMax(proie), pp = poidsMax(p), pq = poidsMax(proie);
  if (tp == null && pp == null && (tq != null || pq != null)) return true;   // sa taille n'est pas connue : prudence
  return (tp != null && tq != null && tp < tq * 0.6)
      || (pp != null && pq != null && pp < pq / 20);   // une fauvette pour un chevreuil (la belette pèse 1/10 du lapin qu'elle chasse)
}
// La question en éléments est-elle possible ? (un élément posable, et au moins 3 mauvaises réponses sûres)
const memoModeItems = new Map();
function modeItems(espece, colonne) {
  const cle = espece.nom_courant + "|" + colonne;
  if (!memoModeItems.has(cle)) {
    const pieges = colonne === "proies" ? piegesAliment(espece) : piegesPredateur(espece);
    memoModeItems.set(cle, itemsPosables(espece, colonne).length > 0 && pieges.length >= 3);
  }
  return memoModeItems.get(cle);
}
// Les éléments génériques (« Oiseaux », « Rapaces », « Insectes ») ne sont tirés que s'il n'y a rien de plus précis
const ITEMS_GENERIQUES = /^(autres |petits |grands )?(oiseaux|rapaces|mammifères|carnivores|poissons|serpents|reptiles|amphibiens|insectes|araignées|crustacés|mollusques|vers|corneilles et corbeaux|belettes et martres|chouettes|hiboux|faucons|aigles|goélands|hérons|chats|chiens|rats|couleuvres|lézards|guêpes)$/i;
function itemAuHasard(espece, colonne) {
  const tous = itemsPosables(espece, colonne);
  const precis = tous.filter(i => !ITEMS_GENERIQUES.test(i));
  return auHasard(precis.length ? precis : tous);
}
function estItem(espece, q, valeur) { return listeItems(espece, q.champ).includes(valeur); }

// Les autres valeurs possibles d'une caractéristique, pour fabriquer des pièges :
// prises chez les autres espèces, sans doublon, et assez différentes de la bonne.
// "espece" = l'espèce sur laquelle porte la question.
// Étape R187 (11/11, contrôleur des questions du jeu) : jamais deux réponses au même texte à l'écran (« Zinzinule » et
// « zinzinule » ; « Aristoloches » pour la proserpine ET pour la diane). On compare le texte affiché, sans majuscules ni espaces en trop.
const memoTexteReponse = new Map();   // R239b (lenteurs)
function texteReponse(v) {
  const k = String(v == null ? "" : v);
  let r = memoTexteReponse.get(k);
  if (r === undefined) { r = k.normalize("NFC").replace(/\s+/g, " ").trim().toLowerCase(); if (memoTexteReponse.size < 50000) memoTexteReponse.set(k, r); }
  return r;
}
function sansDoublonsDeTexte(liste, bonne) {
  const vus = new Set([texteReponse(bonne)]);
  return liste.filter(v => { const k = texteReponse(v); if (vus.has(k)) return false; vus.add(k); return true; });
}
// Étape R187 : les pièges propres au QCM (piegesQcm, la saison par exemple) passent eux aussi par l'onglet Pieges_interdits
// (avant : « Du printemps à l'automne » proposé comme faux pour l'agrion de Mercure, « Toute l'année » pour l'hippocampe moucheté)
function piegesDuQcm(q, espece, bonne) {
  return sansDoublonsDeTexte(q.piegesQcm(espece).filter(v => !aussiVraiPour(q, espece, v)), bonne);
}
// Étape R239b (36.03) : les valeurs distinctes (renseignées, acceptées) d'une question sur toutes les espèces, une fois pour toutes
const memoValeursQuestion = new Map();
function valeursQuestion(q) {
  let v = memoValeursQuestion.get(q);
  if (!v) {
    v = [...new Set(ESPECES.map(autre => valeurDe(autre, q)).filter(x => estRenseigne(x)).filter(x => !q.accepter || q.accepter(x)))];
    memoValeursQuestion.set(q, v);
  }
  return v;
}
function autresValeurs(q, bonne, espece) { return mondeDuGroupe(q, espece, sansDoublonsDeTexte(autresValeursBrutes(q, bonne, espece), bonne)); }   // étape R187
// ---- Étape R297 (note 7 du 22/11 au soir : « Que mange-t-il ? » se devinait sans rien savoir chez les papillons) ----
// Pour un insecte, le régime (« herbivore » contre « piscivore », « suceur de sang »…) et l'aliment (« Nectar » contre
//   « Crustacés », « Araignées ») avaient des fausses réponses impossibles pour son groupe. Règle : pour un insecte, une
//   mauvaise réponse est une valeur qu'a au moins une AUTRE espèce du même ordre (papillons, libellules, criquets…) ;
//   s'il en reste moins de 2, la question n'est pas posée (questionDuGroupeTropFacile). Chez les papillons, il n'en reste
//   pas : la question qui apprend quelque chose est celle des plantes de la chenille (« De quelles plantes dépend-il ? »).
const CHAMPS_MONDE_DU_GROUPE = ["regime_alimentaire_type", "proies"];
const ORDRES_ALIMENT_SUR = ["Orthoptères", "Hémiptères", "Mantoptères"];   // le jeune (larve) mange comme l'adulte
const memoValeursOrdre = new Map();
function valeursDeLOrdre(champ, espece) {
  const cle = champ + "|" + espece.ordre;
  if (!memoValeursOrdre.has(cle)) {
    const s = new Set();
    for (const a of ESPECES) if (a.onglet === "Insectes" && a.ordre === espece.ordre) {
      if (champ === "proies") listeItems(a, "proies").forEach(i => s.add(i));
      else if (estRenseigne(a[champ])) s.add(String(a[champ]));
    }
    memoValeursOrdre.set(cle, s);
  }
  return memoValeursOrdre.get(cle);
}
function mondeDuGroupe(q, espece, pieges) {
  if (!espece || espece.onglet !== "Insectes" || !estRenseigne(espece.ordre) || !CHAMPS_MONDE_DU_GROUPE.includes(q.champ)) return pieges;
  const siens = valeursDeLOrdre(q.champ, espece);
  return pieges.filter(v => siens.has(String(v)));
}
function questionDuGroupeTropFacile(q, espece) {
  if (!espece || espece.onglet !== "Insectes" || !CHAMPS_MONDE_DU_GROUPE.includes(q.champ)) return false;
  // l'aliment : 3 au moins (avec 2, il restait « Bouses et crottins, Fourmis » contre « Nectar » pour l'apollon,
  //   ou « Plancton, Crustacés », vrais pour la larve, contre « Insectes » pour une libellule)
  //   Et seulement pour les groupes où le jeune mange comme l'adulte : chez les papillons, coléoptères, abeilles, guêpes,
  //   fourmis, libellules…, la larve et l'adulte ne mangent pas la même chose, et des pièges du groupe étaient à moitié vrais
  //   (« Pollen » pour la coccinelle, « Trèfles » pour un bourdon, « Fleurs » pour l'azuré, « Sève » pour la rosalie).
  if (q.champ === "proies") return !ORDRES_ALIMENT_SUR.includes(espece.ordre) || !modeItems(espece, "proies") || mondeDuGroupe(q, espece, piegesAliment(espece)).length < 3;
  return autresValeurs(q, valeurDe(espece, q), espece).length < 2;
}
function autresValeursBrutes(q, bonne, espece) {
  // Étape 227 : un aliment ou un prédateur seul → ses propres mauvaises réponses
  if ((q.champ === "proies" || q.champ === "predateurs") && espece && estItem(espece, q, bonne))
    return q.champ === "proies" ? piegesAliment(espece) : piegesPredateur(espece);
  // Certaines questions fournissent elles-mêmes leurs pièges (voir "pieges", partie 1)
  if (q.pieges) {
    let propres = melanger(q.pieges(espece).filter(v => !piegeInterdit(q, bonne, v, espece) && !aussiVraiPour(q, espece, v)));   // (étapes 135 et 137 ; R185 : l'espèce)
    // Étape R280 (44.05, note 5 du 20/11 au soir : « Oseilles » proposé contre « Oseilles sauvages ») : pour les questions à
    //   réponses libres (piegesDistincts : les plantes d'un insecte), aucun piège ne ressemble à la bonne
    //   réponse, ni à un piège déjà gardé (« Graminées » et « Graminées, carex » ne sont jamais proposées ensemble).
    if (q.piegesDistincts) {
      const gardes = [];
      for (const v of propres) if (!seRessemblent(v, bonne) && !gardes.some(g => seRessemblent(g, v))) gardes.push(v);
      propres = gardes;
    }
    return propres;
  }
  const valeurs = valeursQuestion(q)                     // étape R239b (lenteurs) : les valeurs distinctes, calculées une fois par question
    .filter(v => !seRessemblent(v, bonne))
    .filter(v => !piegeInterdit(q, bonne, v, espece))   // étape 135 : rien d'à moitié vrai (R185 : ni voisin)
    .filter(v => !aussiVraiPour(q, espece, v));          // étape 137 : groupes d'aliments, de prédateurs, pièges interdits
  const pieges = melanger([...new Set(valeurs)]);
  // Étape 137 : aliments et prédateurs — d'abord les listes d'espèces de la MÊME famille (plus crédibles :
  // des prédateurs de mammifère pour un mammifère), puis les autres. La difficulté reste celle d'avant.
  if (q.champ === "proies" || q.champ === "predateurs") {
    const deLaFamille = v => ESPECES.some(e => e.onglet === espece.onglet && e[q.champ] === v);
    // Étape R264 (40.14) : des listes de prédateurs de son monde (sur terre, en eau douce, en mer) : pas « Brochet » (le
    //   prédateur d'un poisson) pour un moineau, s'il reste assez de listes ; jamais « Aucun connu » ni « Peu de prédateurs »
    let liste = pieges;
    if (q.champ === "predateurs") {
      const monde = mondeProie(espece);
      liste = liste.filter(v => !/^(aucun|peu de|très peu|pas de prédateur|rares?\b)|humain|homme|menac|chasseur|persécution|pilleur|braconn|pêche|parasit|champignon/i.test(String(v).trim()));
      // … et aucune liste où figure un chasseur de la même classe que ses vrais prédateurs (« Grand corbeau, chouette
      //   hulotte, martre » pour un moineau mangé par les rapaces et les chats : à moitié vrai)
      const siennes = classesDesPredateurs(espece);
      const nourriture = NOURRITURE_DE[espece.onglet] || [], surTerre = monde === "terre";
      liste = liste.filter(v => !String(v).split(/[,;]| et /).some(brut => {
        const i = brut.trim().toLowerCase(); if (!i) return false;
        const c = classesDe(i);
        if (c && c.some(x => siennes.has(x))) return true;
        if (surTerre && c && c.includes("Poissons")) return true;                   // pas de poisson pour un animal de la terre ferme
        const p = ESPECES.find(x => { const n = x.nom_courant.toLowerCase(); return i === n || i.startsWith(n + " "); });
        return !!p && [...groupesDefendus(p)].some(x => nourriture.includes(x));      // une espèce du jeu qui pourrait la manger
      }));
      // un vertébré n'a comme fausses listes que celles d'autres vertébrés (pas « Guêpes parasites » pour un moineau : trop facile)
      if (ONGLETS_VERTEBRES.includes(espece.onglet)) liste = liste.filter(v => ESPECES.some(e => e.predateurs === v && ONGLETS_VERTEBRES.includes(e.onglet)));
      const duMonde = liste.filter(v => ESPECES.some(e => e.predateurs === v && mondeProie(e) === monde));
      if (duMonde.length >= 3) liste = duMonde;
    }
    return [...liste.filter(deLaFamille), ...liste.filter(v => !deLaFamille(v))];
  }
  // Étape 275 (« Revoir 5 ») : le cri — d'abord les verbes de la même famille (un oiseau n'« aboie » pas, il « cacabe »)
  if (q.champ === "verbe_cri" && espece) {
    const deLaFamille = v => ESPECES.some(e => e.onglet === espece.onglet && e.verbe_cri === v);
    return [...pieges.filter(deLaFamille), ...pieges.filter(v => !deLaFamille(v))];
  }
  return pieges;
}
// ---- Étape VF1 (n° 12.3, notes 3 et 5 du 12/11) : une fausse affirmation reste dans le « monde » de l'espèce ----
//   Avant : la valeur fausse d'un vrai ou faux venait de n'importe quelle espèce du jeu (« La grémille est suceuse de sang »,
//   « Elle vit surtout dans les eaux souterraines ») : on la devinait sans rien connaître de l'espèce.
//   Maintenant, une valeur fausse n'est gardée que si une espèce proche l'a vraiment : une espèce du même ordre
//   (classification : les carpes, les rapaces de jour, les lézards et serpents…), ou au moins 2 espèces de la même famille
//   du jeu qui vivent dans le même genre de milieu (sur terre / dans l'eau ; pour le milieu, la valeur fausse doit être
//   du même genre que le sien). Les saisons gardent leur règle (R166 : jamais une saison en commun).
//   Les valeurs du même ordre passent en premier. Sans valeur fausse permise, pas de vrai ou faux sur ce sujet.
const VF_MONDE_LIBRE = ["saison_observation", "saison_reproduction", "saison_frai"];
const VF_MONDE_MIN = 2;
function vitDansLEau(milieu) { return MILIEUX_MER.includes(milieu) || MILIEUX_EAU_DOUCE.includes(milieu); }
const memoPorteurs = new Map();
function porteursDe(q) {   // valeur → les espèces qui l'ont
  let m = memoPorteurs.get(q);
  if (!m) {
    m = new Map();
    for (const x of ESPECES) {
      let vs; try { vs = valeursDe(x, q); } catch (err) { continue; }
      for (const v of vs || []) {
        if (!estRenseigne(v) || String(v).startsWith("NA")) continue;
        if (!m.has(v)) m.set(v, []);
        m.get(v).push(x);
      }
    }
    memoPorteurs.set(q, m);
  }
  return m;
}
function memeOrdre(a, b) { return !!a.ordre && a.ordre === b.ordre; }
function dansSonMonde(q, espece, v) {
  if (!espece || VF_MONDE_LIBRE.includes(q.champ)) return true;
  const porteurs = (porteursDe(q).get(v) || []).filter(x => x !== espece);
  if (porteurs.some(x => memeOrdre(x, espece))) return true;
  const eau = vitDansLEau(espece.milieu_principal);
  if (q.champ === "milieu_principal")
    return vitDansLEau(v) === eau && porteurs.filter(x => x.onglet === espece.onglet).length >= VF_MONDE_MIN;
  return porteurs.filter(x => x.onglet === espece.onglet && vitDansLEau(x.milieu_principal) === eau).length >= VF_MONDE_MIN;
}
// Étape VF2 : des valeurs qui ne servent jamais de fausse affirmation, parce qu'elles sont à moitié vraies pour beaucoup
//   d'espèces : « se réfugie dans un terrier, dans l'eau… » (le ver du fumier se réfugie aussi dans le sol), « se fond dans
//   le décor » (le crapaud commun est aussi camouflé), « cherche à intimider son agresseur », « se défend en mordant »
//   (le carabe mord aussi). La fiche ne donne qu'une défense « principale » : les autres ne sont pas forcément fausses.
const VF_JAMAIS_FAUX = { defense_principale: ["Refuge (terrier, eau, falaise)", "Camouflage", "Intimidation (se gonfle, siffle)", "Morsure, cornes ou serres"],
  indice_presence: ["Pelotes de réjection"] };   // beaucoup d'oiseaux en rejettent (faucons, vautours, goélands…)
//   Et selon l'espèce : « cris nocturnes » n'est faux que pour un animal surtout de jour (ni oiseau ni amphibien : le cerf brame,
//   la caille chante, les grenouilles appellent la nuit) ; « terriers dans les berges », que pour un animal qui ne vit pas au
//   bord de l'eau (le castor, la loutre en creusent) ; chez les araignées, « à l'affût » et « bondit » se mêlent : pas de faux.
function fauxInterdit(q, espece, v) {
  if ((VF_JAMAIS_FAUX[q.champ] || []).includes(v)) return true;
  if (!espece) return false;
  if (q.champ === "indice_presence" && v === "Cris nocturnes")
    return !(espece.activite === "Surtout le jour" && !["Oiseaux", "Amphibiens"].includes(espece.onglet));
  if (q.champ === "indice_presence" && v === "Terriers dans les berges")
    return vitDansLEau(espece.milieu_principal) || /Rivières|Mares|Lacs|Marais|Estuaires/.test(String(espece.milieux_secondaires || ""));
  if (q.champ === "chasse_principale" && espece.ordre === "Aranéides") return true;
  return false;
}
function affirmationVraieDe(q, bonne, espece) { try { return q.affirmation ? q.affirmation(bonne, espece) : ""; } catch (err) { return ""; } }
const memoPiegesVF = new Map();
function piegesVraiFaux(q, bonne, espece) {
  const cle = q.champ + "|" + (espece ? espece.nom_courant : "") + "|" + bonne;
  let l = memoPiegesVF.get(cle);
  if (!l) {
    // VF2 : pas de vrai ou faux si la phrase vraie ne peut pas s'écrire pour cette espèce (refuge sans indice dans la fiche)
    // R297 (note 7) : ni vrai ou faux sur le régime ou l'aliment d'un insecte quand la question se devine dans son groupe
    l = espece && (questionDuGroupeTropFacile(q, espece) || (q.affirmation && !affirmationVraieDe(q, bonne, espece))) ? []
      : autresValeurs(q, bonne, espece).filter(v => dansSonMonde(q, espece, v) && !fauxInterdit(q, espece, v)
          && (!espece || !q.affirmation || affirmationVraieDe(q, v, espece)));   // VF2 : la fausse aussi doit pouvoir s'écrire pour elle
    memoPiegesVF.set(cle, l);
  }
  const proche = v => !!espece && (porteursDe(q).get(v) || []).some(x => x !== espece && memeOrdre(x, espece));
  const m = melanger(l.slice());
  return [...m.filter(proche), ...m.filter(v => !proche(v))];
}


// ==================================================================
// 4. LE STATUT D'UNE ESPÈCE
//    Tant que l'espèce n'est pas reconnue sur sa photo (ou choisie à la fin d'un défi),
//    elle reste "inconnue" : une carte « ? ». La reconnaître = "identifiée".
//    (Le statut intermédiaire "aperçue" a été retiré à l'étape 58.)
//    Nouveauté étape 25 : les statuts suivent les niveaux.
//      identifiée       = reconnue sur photo, niveau 1 en cours
//      fiche partielle  = niveau 1 terminé (médaille de bronze, puis d'argent)
//      fiche complète   = niveau 3 terminé (médaille d'or) = toutes les cases trouvées
//      maîtrisée        = toutes les cases confirmées (trouvées 3 fois, étape 101 ; avant : 2 fois)
// ==================================================================

// Étape R262 (lenteurs) : une mémoire valable le temps de dessiner une page (Profil, Carte, Encyclopédie, accueil…).
//   Une page demandait des centaines de fois le statut des mêmes espèces (jusqu'à 1,6 s sur un téléphone lent).
//   Le dessin d'une page ne change pas la progression : la mémoire est sûre, et elle est jetée dès la page dessinée.
//   avecMemoPage(f) rend une version de f qui ouvre cette mémoire le temps de son appel (13_demarrage.js).
let memoPage = null;
function avecMemoPage(f) {
  const g = function (...args) {
    if (memoPage) return f.apply(this, args);
    memoPage = new Map();
    try { return f.apply(this, args); } finally { memoPage = null; }
  };
  g.avantMemo = f;
  return g;
}
function statut(espece) {
  if (!memoPage) return calculerStatut(espece);
  const cle = "s|" + espece.nom_courant;
  let v = memoPage.get(cle);
  if (v === undefined) { v = calculerStatut(espece); memoPage.set(cle, v); }
  return v;
}
function calculerStatut(espece) {
  // Pas encore reconnue : "inconnue", qu'elle ait déjà été montrée ou non (étape 58).
  // (Le jeu sait quand même si elle s'est déjà montrée : voir estVue, partie 11.)
  if (!progression[espece.nom_courant] || !estIdentifiee(espece)) return "inconnue";

  const champs    = champsDe(espece);
  const confirmes = champs.filter(c => nbBonnes(espece, c) >= SEUIL_CONFIRME).length;
  const niveau    = niveauTermine(espece);

  if (confirmes === champs.length) return "maîtrisée";      // tout confirmé (étape 101)
  if (niveau === NB_NIVEAUX)       return "fiche complète"; // les 3 niveaux terminés
  if (niveau >= 1)                 return "fiche partielle"; // niveau 1 (ou 2) terminé
  return "identifiée";                                       // reconnue sur photo
}

// ---- Étape R264 (Notion 40.15, note 17 du 18/11, choix 8B du 19/11) : « jamais deux fois le même sujet à la suite » ----
//   Une série de questions (Me tester, Approfondir…) : jamais deux fois de suite le même sujet, au plus 2 fois le même
//   sujet par série de 20, et jamais deux fois de suite la même espèce. « besoins » = combien de questions pour chaque
//   espèce (Map espèce → nombre) ; sujetsDe(espèce, rang, déjàPris) = les sujets possibles pour sa question n° rang
//   (un seul quand le sujet est imposé). On essaie plusieurs tirages et on garde le meilleur (le moins de répétitions).
//   « derniere » : une espèce dont la dernière question doit fermer la série (la coriace du défi).
//   Rend une liste de { e, sujet }.
function enchainerVarie(besoins, sujetsDe, { max = 2, fenetre = 20, essais = 40, derniere = null, genre = null } = {}) {
  const especes = [...besoins.keys()];
  let meilleure = null, pireMeilleure = Infinity;
  for (let essai = 0; essai < essais && pireMeilleure > 0; essai++) {
    const reste = new Map(besoins), pris = new Map(especes.map(e => [e, []])), suite = [];
    let fin = null;
    if (derniere && reste.get(derniere) > 0) {
      const k = reste.get(derniere);
      reste.set(derniere, k - 1);
      fin = { e: derniere, rang: k };   // son sujet est choisi à la fin, avec ce qui reste
    }
    const total = [...reste.values()].reduce((a, b) => a + b, 0);
    for (let n = 0; n < total; n++) {
      const prec = suite[suite.length - 1], recents = suite.slice(-(fenetre - 1)).map(z => z.sujet);
      let choixMin = null, pMin = Infinity;
      for (const e of melanger(especes.filter(x => reste.get(x) > 0))) {
        for (const s of melanger(sujetsDe(e, pris.get(e).length + 1, pris.get(e)).slice())) {
          let p = 0;
          if (prec && prec.e === e) p += 1000;
          if (prec && prec.sujet === s) p += 100;
          const vus = recents.filter(x => x === s).length;
          if (vus >= max) p += 10 * (vus - max + 1);
          if (genre && prec && genre(prec.sujet) === genre(s)) p += 1;
          p -= reste.get(e) * 0.5;                     // d'abord les espèces qui ont le plus de questions à venir
          if (p < pMin) { pMin = p; choixMin = { e, sujet: s }; }
        }
      }
      if (!choixMin) break;
      suite.push(choixMin); pris.get(choixMin.e).push(choixMin.sujet); reste.set(choixMin.e, reste.get(choixMin.e) - 1);
    }
    if (fin) {
      const prec = suite[suite.length - 1];
      const options = sujetsDe(fin.e, pris.get(fin.e).length + 1, pris.get(fin.e)).slice();
      const s = options.find(x => !prec || x !== prec.sujet) || options[0];
      if (s !== undefined) suite.push({ e: fin.e, sujet: s });
    }
    // la vraie mesure : répétitions à la suite, et sujets au-delà de « max » dans une fenêtre
    let score = 0;
    for (let i = 1; i < suite.length; i++) {
      if (suite[i].e === suite[i - 1].e) score += 1000;
      if (suite[i].sujet === suite[i - 1].sujet) score += 100;
      const avant = suite.slice(Math.max(0, i - fenetre + 1), i).filter(z => z.sujet === suite[i].sujet).length;
      if (avant >= max) score += 10;
    }
    if (!meilleure || score < pireMeilleure) { meilleure = suite; pireMeilleure = score; }
  }
  return meilleure || [];
}
