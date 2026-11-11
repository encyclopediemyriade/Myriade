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
}

function charger() {
  try {
    const texte = localStorage.getItem(CLE_SAUVEGARDE);
    if (!texte) { suivi.familleOfferte = true; suivi.reglagesRemis129 = true; suivi.famillesRemises131 = true; suivi.medaillesGardees227 = true; return; }   // rien de sauvegardé : première partie (étape 127 : rien à offrir)
    const donnees = JSON.parse(texte);
    Object.assign(progression, donnees.progression);   // on recopie le carnet
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
    if (donnees.suivi && typeof donnees.suivi === "object") Object.assign(suivi, donnees.suivi);
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
  const src = petite ? grande.replace("Images/", "Images/mini/") : grande;
  return `<img src="${src}" alt="${espece.nom_courant}"${petite ? ' loading="lazy" decoding="async"' : ""}
               onerror="if (this.src.includes('/mini/')) this.src='${grande}'; else if (this.parentNode) this.outerHTML='photo à venir';">`;
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
function autresDeLaListe(espece, colonne, colonneSecondaires) {
  const toutes = [...new Set(ESPECES.map(e => e[colonne]).filter(estRenseigne))];
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
    if (q.pieges && !q.format && q.type !== "nombre" && autresValeurs(q, v, espece).length === 0
        && !(q.piegesQcm && piegesDuQcm(q, espece, v).length)) return false;   // étape R187 : sans les pièges interdits
    // Étape R184 (10/11, retour d'Aubin : « Comment sont ses oreilles ? » de la fouine, une seule réponse, « Moyennes ») :
    // la même règle pour les questions en dessins (format « picto »), qui y échappaient
    if (q.format === "picto" && autresValeurs(q, v, espece).length === 0) return false;
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
const SENS_MEDAILLE = ["", "Vous la reconnaissez à sa photo et à son allure", "Vous savez comment elle vit", "Vous la connaissez en profondeur"];   // R144 : explication de chaque palier
// Étape R144 (07/11/2026, choix de l'utilisateur, proposition G revue) : les espèces n'ont plus de « médailles » (le mot est
//   réservé aux lieux, R133) mais trois paliers de relation : Croisée (étape 1), Comprise (étape 2), Familière (Approfondir).
//   Le calcul ne change pas (niveauTermine, medailleMax, colonnes bronze/argent/or des anecdotes) : seuls les mots et l'icône changent.
const PALIERS_ESPECE = ["", "Croisée", "Comprise", "Familière"];
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
function champsDuNiveau(espece, niveau) {
  return listeQuestions(espece).filter(q => niveauMedaille(espece, q) === niveau).map(q => q.champ);
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
const MILIEU_DANS_LE_NOM = ["Ancyle des rivières", "Loche de rivière", "Bécassine des marais", "Cuivré des marais", "Dolomède des marais",
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
const VOISINES = {
  couleur_dominante: COULEURS_VOISINES, bec_couleur: COULEURS_VOISINES, yeux_couleur: COULEURS_VOISINES,
  robe: [["Uni", "Points"], ["Uni", "Marbrures"], ["Uni", "Bicolore"], ["Taches", "Points"], ["Taches", "Ocelles (faux yeux)"],
         ["Taches", "Marbrures"], ["Taches", "Damier"], ["Points", "Ocelles (faux yeux)"], ["Rayures", "Barres"], ["Rayures", "Zigzag"],
         ["Rayures", "Marbrures"], ["Rayures", "Nervures"], ["Barres", "Zigzag"], ["Masque", "Bavette"], ["Masque", "Plastron"],
         ["Bavette", "Plastron"]],
  corps_forme: [["Fuselé", "Allongé"], ["Allongé", "Très allongé"], ["Fuselé", "Très allongé"], ["Fuselé", "Trapu"],
                ["Trapu", "Bossu"], ["Trapu", "Haut et plat"], ["Bossu", "Haut et plat"], ["Trapu", "Allongé"]],
  ailes_repos: [["Repliées", "En toit"]],
};
function sontVoisines(champ, a, b) { return (VOISINES[champ] || []).some(([x, y]) => (x === a && y === b) || (x === b && y === a)); }
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
    const bonnes = espece ? [bonne, ...valeursDe(espece, q)] : [bonne];
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
function aussiVraiPour(q, espece, valeur) {
  // 1. L'onglet Pieges_interdits du tableur (ex : « Jaune » pour le bec du faucon pèlerin)
  const interdit = (typeof PIEGES_INTERDITS === "undefined" ? [] : PIEGES_INTERDITS).some(p =>
    p.nom_courant === espece.nom_courant && (p.colonne === q.champ || p.colonne === q.colonnePicto)
    && String(p.reponse_interdite).toLowerCase() === String(valeur).toLowerCase());
  if (interdit) return true;
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
function groupesDefendus(espece) {
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
    const g = [...groupesDefendus(p)].filter(x => listeGroupes(p.proies_groupes).includes(x) || listeItems(p, "proies").some(i => ALIMENTS[i] === x));
    const vegetarien = g.every(x => GROUPES_PLANTES.includes(x) || x === "Algues et plancton" || x === "Débris et matière morte");
    if (debutsDeMots(p.nom_courant).some(m => m.length >= 4 && texte.includes(m))) return false;   // déjà cité
    if (vegetarien) return true;                                                     // un mangeur de plantes n'est le prédateur de personne
    if (prudent || classes.has(p.onglet) || chasseurGeneraliste(p)) return false;
    if (p.onglet === espece.onglet) return false;            // un poisson, une grenouille, un insecte mangent souvent leurs cousins
    if ([...groupesDefendus(p)].some(x => nourriture.includes(x))) return false;     // il pourrait le manger
    if (/invertébrés|petits animaux|vertébrés|arthropodes|animaux morts|cadavres|déchets/i.test(p.proies || "")) return false;
    return true;
  }).map(p => p.nom_courant);
  const territoires = String(espece.territoire).split(" ; ");
  const score = nom => {
    const p = ESPECES.find(x => x.nom_courant === nom);
    return (typeMilieu(p) === milieu ? 2 : 0) + (String(p.territoire).split(" ; ").some(t => territoires.includes(t)) ? 1 : 0)
         + (["Mammiferes", "Oiseaux", "Reptiles", "Amphibiens", "Poissons"].includes(p.onglet) ? 1 : 0)
         + Math.random() * 2;                                                         // un peu de hasard, pour varier
  };
  return parScore(candidats, score);
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
function texteReponse(v) { return String(v == null ? "" : v).normalize("NFC").replace(/\s+/g, " ").trim().toLowerCase(); }
function sansDoublonsDeTexte(liste, bonne) {
  const vus = new Set([texteReponse(bonne)]);
  return liste.filter(v => { const k = texteReponse(v); if (vus.has(k)) return false; vus.add(k); return true; });
}
// Étape R187 : les pièges propres au QCM (piegesQcm, la saison par exemple) passent eux aussi par l'onglet Pieges_interdits
// (avant : « Du printemps à l'automne » proposé comme faux pour l'agrion de Mercure, « Toute l'année » pour l'hippocampe moucheté)
function piegesDuQcm(q, espece, bonne) {
  return sansDoublonsDeTexte(q.piegesQcm(espece).filter(v => !aussiVraiPour(q, espece, v)), bonne);
}
function autresValeurs(q, bonne, espece) { return sansDoublonsDeTexte(autresValeursBrutes(q, bonne, espece), bonne); }   // étape R187
function autresValeursBrutes(q, bonne, espece) {
  // Étape 227 : un aliment ou un prédateur seul → ses propres mauvaises réponses
  if ((q.champ === "proies" || q.champ === "predateurs") && espece && estItem(espece, q, bonne))
    return q.champ === "proies" ? piegesAliment(espece) : piegesPredateur(espece);
  // Certaines questions fournissent elles-mêmes leurs pièges (voir "pieges", partie 1)
  if (q.pieges) return melanger(q.pieges(espece).filter(v => !piegeInterdit(q, bonne, v, espece) && !aussiVraiPour(q, espece, v)));   // (étapes 135 et 137 ; R185 : l'espèce)
  const valeurs = ESPECES
    .map(autre => valeurDe(autre, q))
    .filter(v => estRenseigne(v))
    .filter(v => !q.accepter || q.accepter(v))          // pas de valeur générique parmi les pièges
    .filter(v => !seRessemblent(v, bonne))
    .filter(v => !piegeInterdit(q, bonne, v, espece))   // étape 135 : rien d'à moitié vrai (R185 : ni voisin)
    .filter(v => !aussiVraiPour(q, espece, v));          // étape 137 : groupes d'aliments, de prédateurs, pièges interdits
  const pieges = melanger([...new Set(valeurs)]);
  // Étape 137 : aliments et prédateurs — d'abord les listes d'espèces de la MÊME famille (plus crédibles :
  // des prédateurs de mammifère pour un mammifère), puis les autres. La difficulté reste celle d'avant.
  if (q.champ === "proies" || q.champ === "predateurs") {
    const deLaFamille = v => ESPECES.some(e => e.onglet === espece.onglet && e[q.champ] === v);
    return [...pieges.filter(deLaFamille), ...pieges.filter(v => !deLaFamille(v))];
  }
  // Étape 275 (« Revoir 5 ») : le cri — d'abord les verbes de la même famille (un oiseau n'« aboie » pas, il « cacabe »)
  if (q.champ === "verbe_cri" && espece) {
    const deLaFamille = v => ESPECES.some(e => e.onglet === espece.onglet && e.verbe_cri === v);
    return [...pieges.filter(deLaFamille), ...pieges.filter(v => !deLaFamille(v))];
  }
  return pieges;
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
const STATUTS = ["inconnue", "identifiée", "fiche partielle", "fiche complète", "maîtrisée"];

function statut(espece) {
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
