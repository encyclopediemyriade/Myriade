// 09_rencontre.js — La Rencontre (une espèce en profondeur) et la rareté des espèces.
// Une partie du programme du jeu, chargée par jeu.html dans l'ordre des numéros.

// ==================================================================
// 11 octies. LA RENCONTRE À UNE ESPÈCE (étape 74)
//    Une Rencontre = une espèce, tirée au hasard, et jusqu'à QUESTIONS_FOCUS questions sur elle.
//      • Espèce inconnue : la 1re question est toujours sa photo. Ratée, le nom est donné et la
//        Rencontre continue ; la photo revient 2 questions plus tard, pour la reconnaître.
//      • Ensuite : ses caractéristiques des niveaux ouverts, d'abord celles jamais trouvées, puis
//        celles trouvées une fois. Un niveau terminé en cours de route ouvre le suivant tout de suite.
//      • Une question ratée revient 2 questions plus tard (une fois).
//    Quelle espèce ? Les espèces maîtrisées ne sortent plus tant qu'il en reste d'autres à découvrir
//    ou à compléter dans le choix ; quand tout est maîtrisé, la Rencontre devient une révision.
// ==================================================================
// (QUESTIONS_FOCUS, le nombre de questions au plus, est réglé avec les autres jeux, partie 11 bis)
let dernierFocus = null;                      // l'espèce de la Rencontre précédente, pour ne pas la reprendre aussitôt

// Étape 138 (retour du testeur, décision du 12/10) : UNIQUEMENT des espèces nouvelles tant qu'il en reste
// (pas encore reconnues sur photo) ; quand il n'y en a plus, une espèce au hasard.
function choisirEspeceFocus(enJeu) {
  // Pas deux fois de suite la même espèce… sauf si c'est la seule possible
  const sansLaDerniere = liste => { const autres = liste.filter(e => e !== dernierFocus); return autres.length ? autres : liste; };
  const possibles = enJeu.filter(e => estRenseigne(e.photo));
  const inconnues = possibles.filter(e => !estIdentifiee(e));
  if (inconnues.length) return especesADecouvrir(sansLaDerniere(inconnues), 1)[0];
  return auHasard(sansLaDerniere(possibles));
}

// Étape 176 : "imposee" = une espèce choisie depuis sa fiche de l'encyclopédie (bouton « Refaire une Rencontre »).
// Le périmètre de la Rencontre est alors son territoire et sa famille (les choix de l'écran Jouer ne changent pas).
function demarrerFocus(imposee, options = {}) {
  const territoires = imposee ? territoiresJeu(imposee) : territoiresChoisis;
  const classes = imposee ? [imposee.onglet] : classesChoisies;
  const enJeu = ESPECES.filter(e => estDans(e, territoires) && classes.includes(e.onglet));
  const espece = imposee || choisirEspeceFocus(enJeu);
  dernierFocus = espece;
  noterPartie();                                       // étape 106 : le jour et l'heure de jeu (badges)
  session = { focus: espece, total: QUESTIONS_FOCUS, faites: 0, bonnes: 0, numerotees: 0, bonnesNumerotees: 0, reprisesPosees: 0, reprisesJustes: 0,   // étape R101 : le score par sorte de question
              revisite: !!imposee && !options.expedition,          // étape 176 : lancée depuis la fiche
              expedition: options.expedition || null,              // étape 288 : l'étape 1 d'une expédition
              physique: !!options.expedition,                      // étape 288 : seulement les caractéristiques physiques
              photoAvant: photoFin(territoires, territoireDeLaPartie(options)),   // étape M20 : familles du territoire où l'on joue                   // étape 97 : pour l'écran de fin
              bilan: [],
              avant: photoProgression(territoires, classes),
              ficheAvant: champsDe(espece).filter(c => nbBonnes(espece, c) >= 1).length,   // pour l'écran de fin
              revision: statut(espece) === "maîtrisée",
              classes: classes.slice(), territoires: territoires.slice(),
              posees: [],                    // les caractéristiques déjà demandées dans cette Rencontre
              rejouer: [], dejaRejouees: [], // les questions ratées qui reviennent
              ouvertureFaite: false,         // « Connaissez-vous cette espèce ? » déjà posée (étape 76)
              // Étape 138 : la photo d'ouverture (étape 88) n'est que pour une espèce DÉJÀ connue. Une espèce nouvelle
              // a déjà sa photo à reconnaître : sans cela, la même photo était redemandée juste après.
              photoOuverture: !estIdentifiee(espece),
              presentee: false,              // vrai si le joueur a répondu "Pas encore" : l'espèce a été présentée
              presentes: [] };               // les traits montrés dans la présentation
  session.historique = [];                             // étape 247 : les questions déjà répondues, pour les revoir
  session.sosie = sosiePourRencontre(espece);          // étape 243 : la question « sosie », s'il en a un
  session.sosieFait = false;
  // Étape R150 (07/11, retour en jouant : la question revenait à chaque oiseau) : « Le son est-il disponible ? »
  // n'est plus posée qu'une fois par jour ; la réponse du jour vaut pour toutes les Rencontres.
  sonDemande = !!(suivi && suivi.sonDemandeLe === aujourdhui());
  // Étape RF1 : la Rencontre complète d'une expédition — sa vie (vrai ou faux) et un fait étonnant
  session.vie = [];
  session.etonnant = null;
  if (session.physique && typeof RENCONTRE_COMPLETE !== "undefined" && RENCONTRE_COMPLETE) {
    session.vie = vieRencontre(expeditionParId(options.expedition.id), espece);
    session.etonnant = typeof insoliteEtonnant === "function" ? insoliteEtonnant(espece) : null;
  }
  // Le nombre de questions : 8 au plus, moins s'il y a peu de choses à demander sur cette espèce
  const aDemander = session.physique ? champsEtape(espece, 1).filter(c => c !== IDENTIFICATION && nbBonnes(espece, c) === 0).length + 1 + session.vie.length   // étape 288 ; R132 : seulement ce qui manque, + la photo ; RF1 : + sa vie
    : (session.revisite ? [...new Set([...champsAInterroger(espece), ...champsReste(espece)])] : champsAInterroger(espece))   // étape R129
        .filter(c => !estApparence(c)).length + (estIdentifiee(espece) ? 0 : 1);   // (étape 138 : sans l'apparence)
  session.total = Math.max(1, Math.min(QUESTIONS_FOCUS, aDemander));
  session.prevues = session.total;                     // étape 156 : les questions prévues (sans les reprises de la fin)
  if (session.etonnant) { session.bonusPrevu = true; session.total = session.total + 1; }   // étape RF1 : le fait étonnant, à la fin
  session.normalesFaites = 0;                          // et combien ont déjà été posées
  preparerPostit();                                    // étape 151 : la fiche post-it, vide
  document.getElementById("fin-session").classList.add("cache");
  document.getElementById("choix-longueur").classList.add("cache");
  document.getElementById("carte-rencontre").classList.remove("cache");
  nouvelleRencontre();
}

// Étape R129 (05/11, choix de l'utilisateur) : ce qui reste à découvrir d'une espèce — tout ce que la Rencontre peut
// demander et que le joueur n'a jamais trouvé, quel que soit le niveau (les questions que l'expédition n'a pas tirées).
// La Rencontre lancée depuis la fiche de l'espèce (ou le défi du jour) pose d'abord ces questions, tirées au hasard.
function champsReste(espece) {
  const base = typeof champsAvecCri === "function" ? champsAvecCri(espece) : questionsPossibles(espece).map(q => q.champ);
  return base.filter(c => c !== IDENTIFICATION && !estApparence(c) && nbBonnes(espece, c) === 0);
}
// Étape 138 : pas de questions d'apparence (le portrait physique) dans la Rencontre : la photo est là.
// Elles restent dans le Carnet de terrain et les autres jeux.
// (plus quatre questions qui se voient aussi sur la photo, même sans pictogramme de portrait)
const APPARENCE_AUSSI = ["cornes_ou_bois", "nombre_pattes", "pinces", "coquille"];
function estApparence(champ) { return APPARENCE_AUSSI.includes(champ) || (QUESTIONS.find(q => q.champ === champ) || {}).format === "picto"; }
// Étape 138 : l'ordre des questions d'une Rencontre, du plus simple au plus précis (retour du testeur) :
// la famille, le milieu, ce qu'il mange, ses prédateurs, sa durée de vie, sa reproduction, puis le reste.
const ORDRE_RENCONTRE = ["famille_animale", "milieu_principal", "regime_alimentaire_type", "proies", "predateurs",
  "longevite_max_annees",
  "saison_reproduction", "naissance", "nb_petits_max", "nb_oeufs_ordre", "gestation_jours", "incubation_jours",
  "nom_petit", "metamorphose", "vie_larve", "saison_frai", "emplacement_nid", "soin_des_petits", "sexes", "nom_femelle"];
function rangRencontre(champ) {
  if (session && session.physique) {                     // étape 288 : du trait le plus parlant au cri et à l'empreinte
    const j = champsEtape(session.focus, 1).indexOf(champ);
    const v = (session.vie || []).indexOf(champ);        // étape RF1 : sa vie après son allure
    return j >= 0 ? j : v >= 0 ? 100 + v : 999;
  }
  const i = ORDRE_RENCONTRE.indexOf(champ);
  const q = QUESTIONS.find(x => x.champ === champ) || {};
  return i >= 0 ? i : 100 + (q.niveau || 1);          // le reste : après, niveau par niveau
}
// Les caractéristiques encore jamais demandées dans cette Rencontre (sans le cri si le son est coupé : voir champsAInterroger)
function champsFocusRestants() {
  const espece = session.focus;
  if (session.physique) {                                // étape 288 : la Rencontre physique de l'étape 1 d'une expédition
    // étape R132 : une espèce déjà en partie connue (ailleurs) ne repasse que ce qui lui manque
    return [...champsEtape(espece, 1), ...(session.vie || [])].filter(c => c !== IDENTIFICATION && !session.posees.includes(c) && nbBonnes(espece, c) === 0);   // RF1 : + sa vie
  }
  const base = session.revisite ? [...new Set([...champsAInterroger(espece), ...champsReste(espece)])] : champsAInterroger(espece);   // étape R129
  return base.filter(c => c !== IDENTIFICATION && !session.posees.includes(c) && !estApparence(c)
    && !alimentApresRegime(espece, c, x => session.posees.includes(x)));   // étape 262
}
// Étape R150 : les traits possibles pour la question bonus — montrés dans la présentation, jamais déjà posés dans cette Rencontre
function bonusCandidats() {
  return (session.presentes || []).filter(c => QUESTIONS.some(q => q.champ === c) && !session.posees.includes(c));
}
// Plus aucun trait possible : pas de bonus, la place prévue est rendue (une seule fois)
function bonusSansCandidat() {
  if (!session.bonusPrevu || session.bonusFait || bonusCandidats().length) return false;
  if (session.etonnant) return false;                                                     // étape RF1 : le fait étonnant attend
  if (typeof insoliteBonus === "function" && insoliteBonus(session.focus)) return false;   // étape QI4 : un fait physique insolite peut servir de bonus
  session.bonusFait = true; session.total -= 1; if (session.postit) dessinerPostit();
  return true;
}
function resteAQuestionner() {
  bonusSansCandidat();
  // Étape 243 : une photo déjà ratée deux fois (question + reprise) ne revient plus dans cette Rencontre (sinon elle revenait sans fin)
  return session.rejouer.length > 0 || (!estIdentifiee(session.focus) && !session.dejaRejouees.includes(IDENTIFICATION))
      || champsFocusRestants().length > 0
      || (session.bonusPrevu && !session.bonusFait);                 // étape 161 : la question bonus attend
}

function choisirQuestionFocus() {
  const espece = session.focus;
  // a) Espèce inconnue, tout début : « Connaissez-vous cette espèce ? » (étape 76)
  if (!estIdentifiee(espece) && !session.ouvertureFaite) return { espece, champ: OUVERTURE, estRevision: false };
  // a') Étape 88 : une espèce déjà connue s'ouvre aussi sur sa photo (« Quelle est cette espèce ? », les 4 noms).
  //     C'est une révision : elle compte dans les 8 questions, et la Rencontre continue ensuite comme avant.
  if (estIdentifiee(espece) && !session.photoOuverture && estRenseigne(espece.photo)) {
    session.photoOuverture = true;
    return { espece, champ: IDENTIFICATION, estRevision: true };
  }
  // Étape 156 : d'abord toutes les questions prévues ; les questions ratées ne reviennent qu'ensuite (b).
  const phaseNormale = session.normalesFaites < session.prevues;
  // a bis) Présentée ("Pas encore") : la photo est demandée à la DERNIÈRE question prévue, ou quand il n'y a plus rien d'autre
  if (!estIdentifiee(espece) && session.presentee && phaseNormale
      && (session.normalesFaites >= session.prevues - 1 || champsFocusRestants().length === 0)) {
    return { espece, champ: IDENTIFICATION, estRevision: false };
  }
  // a ter) Photo ratée après "Oui" : elle revient (voir b) ; sinon, une espèce inconnue commence par sa photo
  const photoEnAttente = session.rejouer.some(r => r.champ === IDENTIFICATION);
  if (!estIdentifiee(espece) && !photoEnAttente && !session.presentee && !session.dejaRejouees.includes(IDENTIFICATION)) return { espece, champ: IDENTIFICATION, estRevision: false };
  // b) Les questions ratées, à la fin : quand les questions prévues sont toutes posées
  //    (ou qu'il n'y a plus rien de nouveau à demander), dans l'ordre où elles ont été ratées
  const restants = champsFocusRestants();
  // b0) Étapes 243 et 245 : l'encart « À ne pas confondre », une fois par Rencontre, juste après la photo reconnue
  if (phaseNormale && sosieAttend() && session.normalesFaites >= 1) {
    session.sosieFait = true;
    return { espece, champ: SOSIE, estRevision: false };
  }
  // Plus rien de nouveau à demander avant le nombre prévu : les questions prévues s'arrêtent là
  // (le compteur et le carnet le montrent : « Question 6 / 6 », pas de ligne vide en trop)
  if (phaseNormale && restants.length === 0) {
    const ecart = session.prevues - session.normalesFaites;
    session.prevues -= ecart; session.total -= ecart;
    if (session.postit) dessinerPostit();
  }
  if ((!phaseNormale || restants.length === 0) && session.rejouer.length) {
    const r = session.rejouer.shift();
    return { espece, champ: r.champ, estRevision: true, rejeu: true };
  }
  // b') Étape 161 : la question bonus, tout à la fin — un des traits montrés dans la présentation,
  //     de préférence un qui n'est pas encore dans la fiche
  if ((!phaseNormale || restants.length === 0) && session.bonusPrevu && !session.bonusFait && !bonusSansCandidat()) {
    session.bonusFait = true;
    // Étape QI4 (choix d'Aubin du 09/11) : si l'espèce a un fait physique insolite pas encore trouvé, il remplace le bonus (« Vrai ou faux ? »)
    if (session.etonnant) {                              // étape RF1 : « Étonnant » — deux affirmations, une vraie
      session.insoliteEnCours = { espece, type: "deux", item: session.etonnant, bonus: true, etonnant: true };
      return { espece, champ: INSOLITE, estRevision: false, rejeu: true, bonus: true };
    }
    const fait = typeof insoliteBonus === "function" ? insoliteBonus(espece) : null;
    if (fait) { session.insoliteEnCours = { espece, type: "vrai_faux", item: fait, bonus: true }; return { espece, champ: INSOLITE, estRevision: false, rejeu: true, bonus: true }; }
    // Étape R150 : jamais un trait déjà posé dans cette Rencontre (avant : la même question revenait une minute après) ;
    // s'il n'en reste aucun, pas de bonus (la place prévue est rendue)
    const presentes = bonusCandidats();
    const neufs = presentes.filter(c => nbBonnes(espece, c) === 0);
    const champ = auHasard(neufs.length ? neufs : presentes);
    if (champ) return { espece, champ, estRevision: false, rejeu: true, bonus: true };
  }
  // c) Une caractéristique pas encore demandée : jamais trouvée → trouvée une fois → le reste.
  //    Étape 138 : dans chaque groupe, dans l'ordre du plus simple au plus précis (ORDRE_RENCONTRE).
  const jamais = restants.filter(c => nbBonnes(espece, c) === 0);
  const uneFois = restants.filter(c => aConsolider(espece, c));        // étape 101 : pas encore confirmée
  const groupe = jamais.length ? jamais : uneFois.length ? uneFois : restants;
  let champ = groupe.slice().sort((a, b) => rangRencontre(a) - rangRencontre(b))[0];
  // Étape 176 : Rencontre refaite depuis la fiche (tout est déjà trouvé) — l'ordre fixe ramènerait toujours les mêmes
  // questions. On tire au hasard parmi les caractéristiques les moins souvent trouvées.
  if (session.revisite && jamais.length) champ = auHasard(jamais);   // étape R129 : ce qui reste, tiré au hasard (le jeu varie)
  if (session.revisite && !jamais.length) {
    const moins = Math.min(...groupe.map(c => nbBonnes(espece, c)));
    champ = auHasard(groupe.filter(c => nbBonnes(espece, c) === moins));
  }
  session.posees.push(champ);
  return { espece, champ, estRevision: false };
}

// ---- Étape 243 (22/10), revue à l'étape 245 : l'encart « À ne pas confondre » de la Rencontre ----
// Quand l'espèce a un sosie (groupes « À ne pas confondre », CONFUSIONS dans 01_questions.js), la Rencontre montre
// une fois les deux espèces CÔTE À CÔTE : leurs photos, leurs noms et le repère pour les distinguer.
// Étape 245 (retour du 22/10) : ce n'est plus une question. Le jeu n'a qu'une photo par espèce : le joueur venait
// de voir la même photo, « Laquelle est la martre ? » ne testait rien. C'est un temps d'observation : il ne prend
// pas de place parmi les questions, ne compte ni pour les médailles ni dans « À revoir », et n'écrit rien dans la fiche.
// Il arrive juste après la photo reconnue (2e écran de la Rencontre), jamais après une présentation (« Pas encore »).
const SOSIE = "sosie";
function sosiePourRencontre(espece) {
  const candidats = sosiesDe(espece).filter(e => estRenseigne(e.photo));
  if (!candidats.length) return null;
  const connus = candidats.filter(estIdentifiee);         // de préférence un sosie que le joueur connaît déjà
  return auHasard(connus.length ? connus : candidats);
}
function sosieAttend() {
  return !!(session && session.focus && session.sosie && !session.sosieFait && !session.presentee && estIdentifiee(session.focus));
}
function critereSosie(espece, autre) {
  const groupe = CONFUSIONS.find(g => g.especes.includes(espece.nom_courant) && g.especes.includes(autre.nom_courant));
  return groupe ? groupe.critere : "";
}
function poserSosie(espece) {
  const autre = session.sosie;
  derniereEspece = espece;
  const critere = critereSosie(espece, autre);
  enCours = { espece, champ: SOSIE, q: null, bonne: null, sosie: autre, explication: "" };
  enTete(espece, false, true);
  document.getElementById("nom").textContent = "À ne pas confondre";
  document.getElementById("compteur-rencontre").textContent = "Pour bien les distinguer";
  document.getElementById("revision").textContent = "";
  document.getElementById("question").textContent = `${majuscule(nomAvecArticle(espece))} ressemble beaucoup ${aNomAvecArticle(autre)}.`;
  const zone = document.getElementById("reponses");
  zone.className = "grille-photos deux-photos parallele";
  zone.innerHTML = [espece, autre].map(e => `<div class="choix-photo${e === espece ? " vedette" : ""}">`
    + `<div class="photo">${celluleImage(e)}</div><div class="legende">${e.nom_courant}</div></div>`).join("");
  document.getElementById("retour").textContent = critere ? `Le repère : ${critere}.` : "";
  const suivant = document.getElementById("suivant");
  suivant.textContent = "Question suivante →";
  suivant.classList.remove("cache");
}

// ---- Étape 247 (22/10) : revenir en arrière dans la Rencontre ; étape 248 : aussi dans « Jouer » ----
// Le bouton « ← Question précédente » (en bas de la carte, à côté de « Quitter ») ouvre une fenêtre qui montre
// les questions déjà répondues de la partie, telles qu'elles étaient : la question, les réponses (bonne en vert,
// choisie en ocre), l'explication. On peut aller de l'une à l'autre (‹ ›). On ne peut PAS changer sa réponse
// (décision du 12/10) : c'est une copie figée. La question en cours n'est pas touchée ; « Revenir » referme la fenêtre.
// La liste est rangée dans la partie en cours (session de la Rencontre, ou defi de « Jouer ») : elle repart à zéro
// à chaque nouvelle partie. Pas dans les petits jeux (Duel, Espèce mystère, Portrait-robot).
function historiquePartie() {
  if (defi && defi.jouer) return (defi.historique = defi.historique || []);
  if (!defi && session && session.focus) return (session.historique = session.historique || []);
  return null;
}
function noterDansHistorique() {
  const historique = historiquePartie();
  if (!historique) return;
  const photo = document.getElementById("photo-rencontre");
  const reponses = document.getElementById("reponses").cloneNode(true);
  reponses.removeAttribute("id");
  reponses.classList.add("hist-reponses");
  reponses.querySelectorAll("button").forEach(b => { b.disabled = true; b.removeAttribute("id"); });
  reponses.querySelectorAll(".legende").forEach(l => l.classList.remove("cache", "au-survol"));
  const affirmation = document.getElementById("affirmation");
  historique.push({
    compteur: document.getElementById("compteur-rencontre").textContent,
    titre: document.getElementById("nom").textContent,
    question: document.getElementById("question").textContent,
    affirmation: affirmation.classList.contains("cache") ? "" : affirmation.textContent,
    photo: photo.classList.contains("cache") ? "" : (photo.querySelector("img") ? photo.querySelector("img").outerHTML : ""),
    reponses: reponses.outerHTML,
    retour: document.getElementById("retour").textContent,
  });
  majBoutonPrecedente();
}
function majBoutonPrecedente() {
  const b = document.getElementById("revoir-precedente");
  if (!b) return;
  const h = historiquePartie();
  const n = h ? h.length : 0;
  b.classList.toggle("cache", n === 0);
}
let indexHistorique = 0;
function ouvrirHistorique(i) {
  const h = historiquePartie();
  if (!h || !h.length) return;
  indexHistorique = Math.max(0, Math.min(h.length - 1, i));
  const x = h[indexHistorique];
  let fond = document.getElementById("fond-historique");
  if (!fond) {
    fond = document.createElement("div");
    fond.id = "fond-historique";
    fond.onclick = ev => { if (ev.target === fond) fermerHistorique(); };
    document.body.appendChild(fond);
  }
  fond.innerHTML = `<div class="fenetre-historique" role="dialog" aria-label="Questions précédentes">
      <div class="hist-haut"><span>Question déjà répondue · ${indexHistorique + 1} / ${h.length}</span>
        <span class="hist-nav"><button id="hist-prec" ${indexHistorique === 0 ? "disabled" : ""}>‹</button><button id="hist-suiv" ${indexHistorique === h.length - 1 ? "disabled" : ""}>›</button></span></div>
      ${x.photo ? `<div class="hist-photo">${x.photo}</div>` : ""}
      <div class="hist-compteur">${x.compteur}</div>
      <h2>${x.titre}</h2>
      ${x.question ? `<p class="question">${x.question}</p>` : ""}
      ${x.affirmation ? `<p class="affirmation">${x.affirmation}</p>` : ""}
      ${x.reponses}
      <p class="retour">${x.retour}</p>
      <button class="bouton-accueil principal" id="hist-fermer">Revenir à la question en cours</button>
    </div>`;
  fond.classList.add("visible");
  document.getElementById("hist-prec").onclick = () => ouvrirHistorique(indexHistorique - 1);
  document.getElementById("hist-suiv").onclick = () => ouvrirHistorique(indexHistorique + 1);
  document.getElementById("hist-fermer").onclick = fermerHistorique;
}
function fermerHistorique() {
  const fond = document.getElementById("fond-historique");
  if (fond) { fond.classList.remove("visible"); fond.innerHTML = ""; }
}
function historiqueOuvert() {
  const fond = document.getElementById("fond-historique");
  return !!(fond && fond.classList.contains("visible"));
}

// ---- Étape 151 (retour du testeur, variante A) : la fiche « post-it » de la Rencontre ----
//   session.postit = la liste des lignes : { champ, libelle, valeur, etat }
//   etat : "encours" (la question est posée), "trouve", "rate", "presque", ou "" (en attente)
//   Une question ratée qui revient reprend SA ligne : si elle est trouvée cette fois, la ligne passe au vert.
const TITRE_CARNET_INCONNUE = "Espèce à découvrir";   // R158 : avant « Fiche de terrain »   // le titre du carnet tant que l'espèce n'est pas connue (à choisir)
// ---- Étape R158 : la bande du bas (téléphone) et le 2e écran de la fiche ----
const PICTO_CARNET = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
  + '<path d="M2 6c3-1.5 6-1.5 10 0v13c-4-1.5-7-1.5-10 0z"/><path d="M22 6c-3-1.5-6-1.5-10 0v13c4-1.5 7-1.5 10 0z"/></svg>';
function majVersFiche(trouvees, prevues) {
  const b = document.getElementById("vers-fiche");
  if (!b) return;
  const points = prevues <= 10 ? `<span class="vf-points">${"<i class=\"t\"></i>".repeat(trouvees)}${"<i></i>".repeat(Math.max(0, prevues - trouvees))}</span>`
                               : `<span class="vf-nombre">${trouvees} / ${prevues}</span>`;
  // Étape R194 (n° 14, choix d'Aubin : C « un tiroir qui monte du bas ») : la flèche monte, la fiche s'ouvre en tiroir
  b.innerHTML = `<span class="vf-ic">${PICTO_CARNET}</span><span class="vf-txt"><b>Ce que vous savez d'elle</b>${points}</span>`
    + `<span class="vf-voir">Voir<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg></span>`;
  b.setAttribute("aria-label", `Ce que vous savez d'elle : ${trouvees} sur ${prevues}. Ouvrir la fiche`);
  if (!b.onclick) {
    b.onclick = () => { if (tiroirPossible()) ouvrirTiroir(); else document.getElementById("postit-rencontre").scrollIntoView({ behavior: "smooth", block: "start" }); };
    brancherGlisserTiroir(b);
    // la bande se retire quand la fiche est à l'écran
    if (typeof IntersectionObserver === "function") {
      new IntersectionObserver(([en]) => document.getElementById("carte-rencontre").classList.toggle("fiche-vue", en.isIntersecting),
                               { threshold: 0, rootMargin: "0px 0px -45% 0px" }).observe(document.getElementById("postit-rencontre"));
    }
  }
  setTimeout(placerFicheEcran2, 60); setTimeout(placerFicheEcran2, 260);
}
// La fiche commence sous le premier écran (téléphone) : on la pousse juste sous le bas de l'écran de la question
function placerFicheEcran2() {
  const carte = document.getElementById("carte-rencontre"), fiche = document.getElementById("postit-rencontre");
  if (!fiche) return;
  if (!(typeof surTelephone === "function" && surTelephone()) || !carte.classList.contains("avec-postit") || carte.classList.contains("cache")) { fiche.style.marginTop = ""; return; }
  // Étape R177 (retour d'Aubin du 09/11 : « il reste souvent un grand espace vide entre la question et la fiche ») :
  // la fiche suit directement la question, avec un simple écart ; elle n'est plus poussée sous le bas de l'écran.
  // La bande « Ce que vous savez d'elle · Voir ↓ » reste tant que la fiche n'est pas à l'écran.
  fiche.style.marginTop = "";
}
function revenirQuestion() {
  if (tiroirOuvert()) { fermerTiroir(); return; }   // étape R194
  const c = document.getElementById("carte-rencontre");
  window.scrollTo({ top: Math.max(0, c.getBoundingClientRect().top + window.scrollY - 8), behavior: "smooth" });
}
function preparerPostit() {
  const actif = !!(session && session.focus && !defi);           // seulement la Rencontre sans chronomètre
  document.getElementById("carte-rencontre").classList.toggle("avec-postit", actif);
  if (actif) { session.postit = []; dessinerPostit(); }
  placerSuiteRencontre();
}
// ---- Étape R138 (06/11, choix de l'utilisateur, maquette 1 « La fiche raconte », option A) ----
//   Sur ordinateur, dans une Rencontre avec fiche, l'explication (#retour, avec la taille) et le bouton « Question suivante »
//   passent en bas de la colonne « Votre fiche » : tout se lit sans faire défiler. L'explication s'efface à la question
//   suivante ; ce qui est trouvé reste écrit dans la fiche. Sur téléphone (760 px et moins) et hors Rencontre, rien ne change.
function placerSuiteRencontre() {
  const carte = document.getElementById("carte-rencontre"), suite = document.getElementById("postit-suite");
  const retour = document.getElementById("retour"), suivant = document.getElementById("suivant");
  if (!carte || !suite || !retour || !suivant) return;
  const aDroite = carte.classList.contains("avec-postit") && innerWidth > 760;
  if (aDroite && retour.parentNode !== suite) suite.append(retour, suivant);
  else if (!aDroite && retour.parentNode === suite) {
    const bas = carte.querySelector(".contenu .bas-rencontre");
    bas.before(retour, suivant);
  }
  placerQuitterTelephone();
}
// Étape R188 (11/11, note n° 16 d'Aubin) : sur téléphone, dans la Rencontre avec fiche, « Quitter » passe tout en bas
//   de la page, sous la fiche (avant : juste sous « Me la présenter », entre la question et la fiche, on le touchait sans le vouloir).
//   Sur ordinateur et hors Rencontre, il reste à sa place, à côté de « ← Question précédente ».
function placerQuitterTelephone() {
  const carte = document.getElementById("carte-rencontre");
  const quitter = carte && carte.querySelector("[data-quitter]");
  if (!quitter) return;
  const enBas = carte.classList.contains("avec-postit") && innerWidth <= 760;
  let pied = document.getElementById("pied-rencontre");
  if (enBas) {
    if (!pied) { pied = document.createElement("div"); pied.id = "pied-rencontre"; pied.className = "pied-rencontre"; carte.append(pied); }
    if (quitter.parentNode !== pied) pied.append(quitter);
  } else if (pied && quitter.parentNode === pied) {
    carte.querySelector(".contenu .bas-rencontre").append(quitter);
    pied.remove();
  }
}
window.addEventListener("resize", placerSuiteRencontre, { passive: true });
document.addEventListener("DOMContentLoaded", () => {
  const carte = document.getElementById("carte-rencontre");
  if (carte) new MutationObserver(placerSuiteRencontre).observe(carte, { attributes: true, attributeFilter: ["class"] });
});
function lignePostit(champ) {
  let ligne = session.postit.find(l => l.champ === champ);
  if (!ligne) {
    const q = QUESTIONS.find(x => x.champ === champ);
    ligne = { champ, libelle: champ === IDENTIFICATION ? "Nom" : (q ? q.libelle : champ), valeur: "?", etat: "" };
    session.postit.push(ligne);
  }
  return ligne;
}
// Une question est posée : sa ligne apparaît (ou se rallume), avec « ? »
function postitQuestion(champ) {
  if (!session || !session.focus || defi || !session.postit) return;
  for (const l of session.postit) if (l.etat === "encours") l.etat = "";
  const ligne = lignePostit(champ);
  ligne.etat = "encours";
  ligne.ecrit = false;
  dessinerPostit();
}
// Le joueur a répondu : la ligne s'écrit (la bonne réponse, dans les deux cas)
function postitReponse(champ, etat) {
  if (!session || !session.focus || defi || !session.postit) return;
  const ligne = lignePostit(champ);
  ligne.etat = etat;
  ligne.ecrit = true;
  ligne.valeur = valeurPostit(enCours.espece, champ, enCours.q, enCours.bonne, etat);
  ligne.brute = enCours.bonne;                                 // étape 206 : pour le picto
  session.postitDerniere = etat === "trouve" ? champ : null;   // la dernière trouvée est surlignée
  dessinerPostit();
}
// La valeur écrite sur le post-it : comme dans la fiche de l'encyclopédie
function valeurPostit(espece, champ, q, bonne, etat) {
  if (champ === IDENTIFICATION) return espece.nom_courant;
  if (champ === "cri_son") return etat === "trouve" ? "Reconnu" : "À réécouter";
  if (!q || bonne === null || bonne === undefined) return "";
  if (champ === "empreinte_choix") return etat === "trouve" ? "Retrouvée" : "À revoir";
  return q.affichageFiche ? q.affichageFiche(espece, bonne) : afficherValeur(q, bonne);
}
function dessinerPostit() {
  const zone = document.getElementById("postit-fiche");          // étape R138 : la fiche a son propre cadre dans la colonne
  const espece = session.focus;
  // Le nom ne s'écrit en titre qu'une fois connu (sinon il soufflerait la réponse à la photo)
  const titre = (estIdentifiee(espece) || session.presentee) ? espece.nom_courant : TITRE_CARNET_INCONNUE;
  // Étape 163 : pendant la question photo (« La reconnaîtriez-vous maintenant ? »), le nom déjà écrit dans le carnet
  // (titre et ligne Nom) est flouté : il soufflerait la réponse. Il redevient net après la réponse.
  const nomCache = session.postit.some(l => l.champ === IDENTIFICATION && l.etat === "encours");
  // Étape 206 (maquette C2-A) : seules les lignes déjà posées s'écrivent, avec leur picto ; plus de lignes vides.
  const picto = l => {
    const q = QUESTIONS.find(x => x.champ === l.champ);
    if (!q || q.format !== "picto" || q.sansImage || l.brute === undefined || l.brute === null || l.etat === "encours") return "";
    return dessinReponse(q.colonnePicto, l.brute);
  };
  const lignes = session.postit.map(l => `<li class="${l.etat}${l.ecrit ? " ecrit" : ""}${l.champ === session.postitDerniere && l.etat === "trouve" ? " neuve" : ""}${nomCache && l.champ === IDENTIFICATION ? " floute" : ""}">`
    + `<span class="ic">${picto(l)}</span><span class="txt"><span class="lib">${l.libelle}</span>`
    + `<span class="val" title="${String(l.valeur).replace(/<[^>]*>/g, "")}">${l.valeur}</span></span></li>`);
  const prevues = Math.max(session.prevues || session.total, session.postit.length);
  const trouvees = session.postit.filter(l => l.etat === "trouve").length;
  const aRevoirIci = session.postit.filter(l => l.etat === "rate" || l.etat === "presque").length;
  // Étape R189 (note n° 2 d'Aubin, martinet noir : « 0 / 5 trouvée · encore 4 à découvrir ») : une espèce seulement présentée
  //   (« Me la présenter ») a son nom écrit, mais sa photo reste à reconnaître : elle compte encore dans « à découvrir »
  const reste = Math.max(0, prevues - session.postit.filter(l => l.etat && l.etat !== "encours" && l.etat !== "presentee").length);
  const points = session.postit.map(l => `<i class="${l.etat}"></i>`).join("") + "<i></i>".repeat(Math.max(0, prevues - session.postit.length));
  const connu = titre !== TITRE_CARNET_INCONNUE;
  // Étape R158 (08/11, choix d'Aubin) : « Votre fiche » devient « Ce que vous savez d'elle » ; sur téléphone, la fiche
  // est un 2e écran sous la question, ouvert par la bande du bas, avec « ↑ Revenir à la question » à la fin
  majVersFiche(trouvees, prevues);
  zone.innerHTML = `<div class="postit"><div class="tt-postit">Ce que vous savez d'elle</div><h2${nomCache ? ' class="floute"' : ""}>${titre}</h2>`
    + `<p class="sci-postit${nomCache ? " floute" : ""}">${connu ? espece.nom_scientifique || "" : ""}</p><ul>${lignes.join("")}</ul>`
    + `<div class="legende-postit">${trouvees} / ${prevues} trouvée${trouvees > 1 ? "s" : ""}${aRevoirIci ? ` · ${aRevoirIci} à revoir` : ""}${reste ? ` · encore ${reste} à découvrir` : ""}`
    + `<div class="points-postit">${points}</div></div>`
    + `<button type="button" class="retour-question" onclick="revenirQuestion()">↓ Revenir à la question</button></div>`;
  for (const l of session.postit) l.ecrit = false;              // l'animation d'écriture ne joue qu'une fois
}

// ---- L'ouverture d'une Rencontre sur une espèce inconnue (étape 76) ----
//   (Étape R155 : plus de question à part ; « Je ne la connais pas encore » sous les 4 noms remplace « Pas encore ».)
//   Avant : « Connaissez-vous cette espèce ? »  → "Oui"         : les 4 noms (la question photo habituelle)
//                                        → "Pas encore"  : l'espèce est présentée, sans pénalité ;
//                                          la photo sera demandée à la fin (« La reconnaîtriez-vous maintenant ? »)
const OUVERTURE = "ouverture";
const TRAITS_PRESENTES = 6;                   // combien de traits visibles sont montrés dans la présentation, au plus (étape 161 : 6 au lieu de 3)

function poserOuverture(espece) {
  // Étapes R169-R170 (formes d'expédition, 20_formes.js) : « Par le cri » ou « Par les indices » passent d'abord
  if (typeof formeAvantOuverture === "function" && formeAvantOuverture(espece)) return;
  // Étape R155 (08/11, choix d'Aubin) : plus d'écran « Connaissez-vous cette espèce ? » (Oui / Pas encore).
  // On pose tout de suite « Quelle est cette espèce ? » (les 4 noms), avec, sous les réponses,
  // « Je ne la connais pas encore » : l'espèce est alors présentée, sans pénalité, et la photo revient à la fin.
  session.ouvertureFaite = true;
  poserQuestion({ espece, champ: IDENTIFICATION, estRevision: false });
  const b = document.getElementById("je-ne-sais-pas");
  // Étape R157 (08/11, choix d'Aubin : maquette B sans « Pas encore croisée ? ») : un carnet ouvert + « Me la présenter », sous un filet
  b.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '<path d="M2 6c3-1.5 6-1.5 10 0v13c-4-1.5-7-1.5-10 0z"/><path d="M22 6c-3-1.5-6-1.5-10 0v13c4-1.5 7-1.5 10 0z"/></svg><span>Me la présenter</span>';
  b.classList.add("presenter");
  b.dataset.ouverture = "oui";
  b.classList.remove("cache");
}
// Étape R155 : « Je ne la connais pas encore » (R157 : « Me la présenter ») → la présentation (comme l'ancien « Pas encore »)
function pasEncoreConnue() {
  const espece = enCours && enCours.espece;
  if (!espece) return;
  const b = document.getElementById("je-ne-sais-pas");
  b.classList.add("cache");
  enCours = { espece, champ: OUVERTURE, explication: "", q: null, bonne: null };
  document.getElementById("compteur-rencontre").textContent = "";
  document.getElementById("revision").textContent = "";
  document.getElementById("retour").textContent = "";
  document.getElementById("question").textContent = "";
  presenterEspece(espece);
}

// Étape 160 : « le », « la » ou « l' » devant le nom d'une espèce (« C'est la marmotte des Alpes. »).
// On regarde le premier mot du nom : la liste des noms féminins, puis voyelle (ou h muet) → « l' ».
const NOMS_FEMININS = ["Marmotte","Hermine","Martre","Loutre","Fouine","Belette","Chouette","Perdrix","Gélinotte","Niverolle",
  "Chevêchette","Buse","Salamandre","Grenouille","Vipère","Couleuvre","Coronelle","Truite","Perche","Lote","Loche","Miramelle",
  "Fourmi","Coccinelle","Aeschne","Rosalie","Cétoine","Petite","Isabelle","Grande","Abeille","Épeire","Argiope","Thomise",
  "Pisaure","Tégénaire","Tique","Scutigère","Lithobie","Écrevisse","Limace","Moule","Sangsue","Méduse","Œdipode",
  // étape 205 : les noms féminins des autres territoires
  "Barbastelle","Baudroie","Bernache","Bondrée","Bouvière","Bécasse","Caille","Carpe","Castagnole","Chevêche","Cicindèle","Cigale",
  "Cigogne","Cistude","Crossope","Daurade","Diane","Dolomède","Fauvette","Foulque","Genette","Girelle","Gorgebleue","Guifette",
  "Huppe","Lamproie","Limnée","Linotte","Lycose","Magicienne","Malmignatte","Mante","Mouette","Murène","Musaraigne","Mésange",
  "Noctule","Pachyure","Pie","Pipistrelle","Proserpine","Pélagie","Raie","Rainette","Rascasse","Saupe","Scolopendre","Seiche",
  "Sittelle","Sole","Spatule","Sterne","Tanche","Tarente","Taupe","Tortue","Tourterelle","Truxale","Vieille","Zygène",
  // étape M14 (07/11/2026) : les noms féminins ajoutés depuis l'étape 205 (« +1 pour le patelle commune » → « la patelle »)
  "Bacchante","Barge","Belle","Bergeronnette","Blennie","Bouscarle","Brème","Bécassine","Carte","Cisticole","Clausilie","Coque",
  "Corbicule","Cordulie","Corneille","Courtilière","Crevette","Crocidure","Decticelle","Gallinule","Gambusie","Gorgone","Grive","Grue",
  "Grémille","Langouste","Leucorrhine","Libellule","Mangore","Micrommate","Mourgette","Mulette","Mygale","Mégère","Méta","Nette",
  "Pastenague","Patelle","Philoscie","Physalie","Piéride","Processionnaire","Punaise","Pyrale","Rhagie","Rousserolle","Sauterelle",
  "Soucoupe","Souris","Sérotine","Vandoise","Vélelle"];
const H_ASPIRES = ["Hérisson", "Héron", "Hanneton", "Huppe"];   // « le héron », « la huppe » (étape 205)                              // « le hérisson », pas « l'hérisson »
function articleDe(espece) {
  const mot = espece.nom_courant.split(/[ -]/)[0];
  if (/^[AEIOUYÉÈÊÂÎÔŒH]/i.test(mot) && !H_ASPIRES.includes(mot)) return "l'";
  return NOMS_FEMININS.includes(mot) ? "la " : "le ";
}
// « la marmotte des Alpes » : l'article, puis le nom avec sa première lettre en minuscule
function nomAvecArticle(espece) {
  const n = espece.nom_courant;
  return articleDe(espece) + n.charAt(0).toLowerCase() + n.slice(1);
}
// Étape R176 : « à » + le nom (« au pigeon biset », « à la fouine », « à l'hermine » ; avant : « à le pigeon biset »)
function aNomAvecArticle(espece) { const t = nomAvecArticle(espece); return /^le /.test(t) ? "au " + t.slice(3) : /^les /.test(t) ? "aux " + t.slice(4) : "à " + t; }

// ==================================================================
// Étape 310 (27/10/2026, retour de l'utilisateur) : la TAILLE, toujours dite dans la Rencontre — dans la présentation,
// quand la photo est reconnue (ou le nom donné) et sur la fiche de fin —, avec un picto chiffré (la toise et les chiffres).
// Elle précise toujours ce qui est mesuré (« du bec à la queue », « sans la queue »… : MESURES_TAILLE, 01_questions.js).
// ==================================================================
function tailleRencontre(e) {
  const q = QUESTIONS.find(x => x.champ === "taille_max_cm");
  if (!q) return null;
  const v = q.valeur(e);
  if (typeof v !== "number") return null;
  const f = q.fourchette ? q.fourchette(e) : null, mesure = mesureTaille(e).fiche;
  if (f && f[0] < f[1]) return { chiffres: `${nombre(f[0])}–${nombre(f[1])}`, texte: `${nombre(f[0])} à ${nombre(f[1])} cm ${mesure}`, mesure };
  return { chiffres: nombre(v), texte: `jusqu'à ${nombre(v)} cm ${mesure}`, mesure: `au plus, ${mesure}` };
}
// Le picto chiffré : les chiffres au-dessus d'une toise (flèche double avec ses deux butées)
function pictoTaille(t) {
  return `<svg class="toise" viewBox="0 0 120 48" aria-hidden="true">
    <text x="60" y="21" text-anchor="middle" font-size="19" font-weight="700" fill="#1F3A2E" font-family="Work Sans, sans-serif">${t.chiffres}<tspan font-size="13" font-weight="600" dx="3">cm</tspan></text>
    <path d="M8 36H112M8 29V43M112 29V43M8 36L15 32M8 36L15 40M112 36L105 32M112 36L105 40" fill="none" stroke="#2b2a26" stroke-width="2" stroke-linecap="round"/></svg>`;
}
// ---- Étape R168 (08/11, choix d'Aubin : « montrer le poids et la taille », sans les demander à l'étape 1) ----
// Le POIDS rejoint la taille partout où elle est montrée (présentation, photo reconnue, fiche de fin), avec son picto chiffré
// (les chiffres au-dessus d'un poids de balance). Sous 1 kg, en grammes. La question sur le poids reste dans Approfondir.
function poidsRencontre(e) {
  const q = QUESTIONS.find(x => x.champ === "poids_max_kg");
  if (!q) return null;
  const v = q.valeur(e);
  if (typeof v !== "number") return null;
  const f = q.fourchette ? q.fourchette(e) : null;
  const enG = (f && f[0] < f[1] ? f[1] : v) < 1;
  const dire = x => enG ? nombre(Math.round(x * 10000) / 10) : nombre(x), unite = enG ? "g" : "kg";
  if (f && f[0] < f[1]) return { chiffres: `${dire(f[0])}–${dire(f[1])}`, unite, texte: `${dire(f[0])} à ${dire(f[1])} ${unite}`, mesure: "" };
  return { chiffres: dire(v), unite, texte: `jusqu'à ${dire(v)} ${unite}`, mesure: "au plus" };
}
function pictoPoids(p) {
  return `<svg class="toise" viewBox="0 0 120 48" aria-hidden="true">
    <text x="60" y="21" text-anchor="middle" font-size="19" font-weight="700" fill="#1F3A2E" font-family="Work Sans, sans-serif">${p.chiffres}<tspan font-size="13" font-weight="600" dx="3">${p.unite}</tspan></text>
    <path d="M51 44H69L66 33H54Z M57 33V30.5A3 3 0 0 1 63 30.5V33" fill="none" stroke="#2b2a26" stroke-width="2" stroke-linejoin="round"/></svg>`;
}
// La ligne « Taille » d'une liste de traits (présentation, fiche de fin) — étape R168 : suivie de la ligne « Poids »
// Étape R177 (retour d'Aubin du 09/11 : « la valeur est écrite deux fois ») : le chiffre n'est plus écrit qu'avec le dessin ;
// le texte à côté dit seulement ce qui est mesuré (« de long, sans la queue », « du bec au bout de la queue »…).
function ligneTaille(e, attributs = "") {
  const t = tailleRencontre(e), p = poidsRencontre(e);
  const lib = (nom, m) => m ? `<span><small>${nom}</small>${majuscule(m)}</span>` : `<span class="seul"><small>${nom}</small></span>`;
  return (t ? `<li class="trait-taille"${attributs} aria-label="Taille : ${echapper(t.texte)}"><span class="picto picto-taille">${pictoTaille(t)}</span>${lib("Taille", t.mesure)}</li>` : "")
       + (p ? `<li class="trait-taille trait-poids"${attributs} aria-label="Poids : ${echapper(p.texte)}"><span class="picto picto-taille">${pictoPoids(p)}</span>${lib("Poids", p.mesure)}</li>` : "");
}
// La photo reconnue (03) : taille et poids côte à côte
// Étape R182 (10/11, demande d'Aubin : « juste les pictos avec la mesure, l'un à côté de l'autre, on gagne de la place ») :
// plus de libellé « Taille » / « Poids » ; sous la toise, en petit, ce qui est mesuré (règle « la taille précise toujours
// ce qui est mesuré ») ; le poids n'a pas de sous-titre.
function retourMesures(e) {
  const t = tailleRencontre(e), p = poidsRencontre(e);
  const bloc = (picto, lib, m, texte) => `<span class="retour-taille compact" role="img" aria-label="${lib} : ${echapper(texte)}" title="${lib} : ${echapper(texte)}"><span class="picto-taille">${picto}</span>${m ? `<small class="rt-mesure">${echapper(m)}</small>` : ""}</span>`;
  const l = (t ? bloc(pictoTaille(t), "Taille", t.mesure, t.texte) : "") + (p ? bloc(pictoPoids(p), "Poids", "", p.texte) : "");
  return l ? `<span class="retour-mesures">${l}</span>` : "";
}

function presenterEspece(espece) {
  session.presentee = true;
  marquerVue(espece);
  // Étape 151 : le nom est montré, mais pas encore trouvé ; la ligne « Nom » attend la photo de la fin
  if (session.postit) {
    const ligne = lignePostit(IDENTIFICATION);
    ligne.etat = "presentee"; ligne.valeur = espece.nom_courant; ligne.ecrit = true;   // étape 160 : écrit, mais pas encore trouvé
    dessinerPostit();
  }
  sauvegarder();
  enTete(espece, true, true);                                   // la photo et, cette fois, le nom
  // Étape 160 : une vraie transition. Le nom se révèle en douceur (« C'est la marmotte des Alpes. »),
  // puis les traits arrivent un à un, puis le bouton. Le carnet écrit le nom à l'encre grise (présentée, pas trouvée).
  const titre = document.getElementById("nom");
  titre.textContent = `C'est ${nomAvecArticle(espece)}.`;
  titre.classList.remove("revele"); void titre.offsetWidth; titre.classList.add("revele");
  document.getElementById("famille").classList.remove("cache");
  // Les traits visibles de niveau 1 (le portrait physique), pris au hasard
  // Étape 161 : jusqu'à 6 traits. D'abord ceux de niveau 1, puis de niveau 2 s'il en faut, et seulement
  // ceux qui se VOIENT sur la photo (pas la pupille ni les dents : « avecPhoto » = ne se voit pas)
  const visibles = questionsPossibles(espece).filter(q => q.format === "picto" && !q.avecPhoto && q.niveau <= 2);
  let traits = [...melanger(visibles.filter(q => q.niveau === 1)), ...melanger(visibles.filter(q => q.niveau === 2))].slice(0, TRAITS_PRESENTES);
  // Étape R190 (carte d'identité, choix E d'Aubin) : quand l'espèce a ses repères de terrain, la carte garde la taille, le poids
  //   et l'ensemble (couleur, aspect…), puis les repères ; les autres traits laissent la place (pas de lourdeur à lire).
  const blocRp = typeof blocReperes === "function" ? blocReperes(espece, { arrivee: 1.3, titre: "Retenez-les : on vous les redemandera" }) : "";
  if (blocRp && typeof TRAITS_ENSEMBLE !== "undefined") traits = traits.filter(q => TRAITS_ENSEMBLE.includes(q.champ)).slice(0, 2);
  session.presentes = traits.map(q => q.champ);
  const lignes = traits.map(q => {
    const v = valeurDe(espece, q);
    const texte = q.affichageFiche ? q.affichageFiche(espece, v) : majuscule(v);
    const dessin = q.sansImage ? "" : dessinReponse(q.colonnePicto, v);
    return `<li><span class="picto">${dessin}</span><span><small>${q.libelle}</small>${texte}</span></li>`;
  }).map((li, i) => li.replace("<li>", `<li class="trait-arrive" style="animation-delay:${0.88 + 0.18 * i}s">`)).join("");   // étape 160 : un à un
  const taille = ligneTaille(espece, ` style="animation-delay:.7s"`).replaceAll('class="trait-taille', 'class="trait-arrive trait-taille');   // étape 310 : la taille d'abord ; R168 : et le poids
  const zone = document.getElementById("reponses");
  zone.className = "";
  zone.innerHTML = `<div class="presentation"><p class="trait-arrive" style="animation-delay:.5s">Pour la reconnaître :</p><ul class="traits-presentation">${taille}${lignes}</ul>${blocRp}</div>`;
  const suivant = document.getElementById("suivant");
  suivant.textContent = "Observer de plus près →";
  // le bouton n'arrive qu'une fois les traits posés (on ne saute pas la présentation par mégarde)
  suivant.classList.add("cache");
  setTimeout(() => { if (session && session.presentee && enCours && enCours.champ === OUVERTURE) suivant.classList.remove("cache"); },
             (blocRp ? 1.3 + 0.18 * 5 : 0.88 + 0.18 * traits.length) * 1000 + 300);
  // Étape 161 : une question bonus, à la fin de la Rencontre, sur l'un de ces traits (de mémoire, sans la photo)
  if (traits.length && !session.bonusPrevu) { session.bonusPrevu = true; session.total = session.total + 1; }
}

// L'écran de fin : l'espèce, son statut, et sa fiche qui se remplit (ce qui était trouvé + le gain)
function afficherFicheSession(s) {
  const zone = document.getElementById("fiche-session");
  zone.innerHTML = "";
  if (!s.focus) return;
  const espece = s.focus;
  const champs = champsDe(espece);
  const trouvees = champs.filter(c => nbBonnes(espece, c) >= 1).length;
  const gain = trouvees - s.ficheAvant;
  const niveau = niveauTermine(espece);
  const medaille = niveau && !s.expedition ? dessinMedaille(MEDAILLES[niveau], niveau) : "";   // étape R130 : pas de médaille dans une expédition
  const etat = estIdentifiee(espece) ? majuscule(statut(espece)) : "Pas encore reconnue : elle reviendra";
  zone.style.setProperty("--couleur-classe", classeDe(espece).couleur);
  zone.innerHTML = `
    <div class="fiche-session-haut">
      <div class="photo">${celluleImage(espece, true)}</div>
      <div class="fiche-session-texte">
        <strong>${espece.nom_courant}</strong>
        <small>${etat}${s.revision ? " · révision" : ""}</small>
        <small class="compte-fiche">Fiche : ${trouvees} / ${champs.length}${gain > 0 ? ` · <b>${gain} de plus</b>` : ""}</small>
      </div>
      <div class="fiche-session-medaille">${medaille}</div>
    </div>
    ${dessinJaugeGain(s.ficheAvant, gain, champs.length)}
    ${blocFaitInsolite(espece)}${ficheRecap(espece)}`;   // étape R101 (Revoir 10) : le fait insolite avant « Pour reconnaître… » ; étape 159 : le compte passe sous le nom, la barre suit la photo ; étape 310 : la fiche récap
}
// Étape 310 (retour de l'utilisateur, 27/10) : à la fin de la Rencontre, une petite fiche « Pour la reconnaître »,
// avec les pictos : la taille, puis ses traits d'allure les plus parlants (ceux de l'étape 1 des expéditions, traitsAllure),
// ou, à défaut, les traits visibles de la présentation.
const TRAITS_RECAP = 4;
// Étape 335 (Revoir 8, choix E1) : le fait insolite, juste après la rencontre d'une espèce.
//   Il reprend les anecdotes vérifiées (Données\anecdotes.xlsx → ANECDOTES, 2 sources + vérification à l'aveugle) :
//   la plus récente débloquée par la médaille. Il se retrouve ensuite sur la page de l'espèce (« Le saviez-vous ? »).
function blocFaitInsolite(espece) {
  if (!estIdentifiee(espece) || typeof anecdotesGagnees !== "function") return "";
  const a = anecdotesGagnees(espece)[0];
  if (!a) return "";
  return `<div class="fait-insolite"><span class="fi-ico" aria-hidden="true">!</span>
    <div><small>Fait insolite</small><p>${a.texte}</p></div></div>`;
}
function ficheRecap(espece) {
  let champs = typeof traitsAllure === "function" ? traitsAllure(espece) : [];
  if (!champs.length) champs = questionsPossibles(espece).filter(q => q.format === "picto" && !q.avecPhoto && q.niveau <= 2).map(q => q.champ);
  const traits = champs.map(c => QUESTIONS.find(q => q.champ === c)).filter(Boolean).slice(0, TRAITS_RECAP);
  const lignes = traits.map(q => {
    const v = valeurDe(espece, q);
    if (!estRenseigne(v) || v === "NA") return "";
    const texte = q.affichageFiche ? q.affichageFiche(espece, v) : majuscule(v);
    const dessin = q.sansImage || q.format !== "picto" ? "" : dessinReponse(q.colonnePicto, v);
    return `<li><span class="picto">${dessin}</span><span><small>${q.libelle}</small>${texte}</span></li>`;
  }).join("");
  const taille = ligneTaille(espece);
  // Étape R190 : la même carte qu'au début (taille, poids, repères), plus la ligne « À ne pas confondre » (seulement à la fin)
  const blocRp = typeof blocReperes === "function" ? blocReperes(espece, { fin: true }) : "";
  if (blocRp) return `<div class="fiche-recap"><p class="fiche-recap-titre">Pour reconnaître ${nomAvecArticle(espece)}</p>
    <ul class="traits-presentation recap">${taille}</ul>${blocRp}</div>`;
  if (!taille && !lignes) return "";
  return `<div class="fiche-recap"><p class="fiche-recap-titre">Pour reconnaître ${nomAvecArticle(espece)}</p>
    <ul class="traits-presentation recap">${taille}${lignes}</ul></div>`;
}

// ==================================================================
// 11 quinquies. LA RARETÉ DES ESPÈCES (gardée de l'ancienne Apparition, étape 44)
// ==================================================================
// La rareté (colonne rarete_observation du tableur) : son rang (1 à 3), et son
// "poids" dans le tirage. Une espèce commune a 3 fois plus de chances d'apparaître qu'une rare.
const RARETES = { "Commun": { points: 1, poids: 3 }, "Peu commun": { points: 2, poids: 2 }, "Rare": { points: 3, poids: 1 } };

// Tirer "combien" espèces dans une liste, les plus communes ayant plus de chances de sortir
function tirerSelonRarete(liste, combien) {
  const reste = liste.slice(), tirees = [];
  while (tirees.length < combien && reste.length) {
    const poids = reste.map(e => (RARETES[e.rarete_observation] || RARETES["Peu commun"]).poids);
    let alea = Math.random() * poids.reduce((a, b) => a + b, 0);       // un point au hasard sur la "roue"
    let rang = 0;
    while (alea >= poids[rang]) { alea = alea - poids[rang]; rang = rang + 1; }
    tirees.push(reste.splice(rang, 1)[0]);
  }
  return tirees;
}

// La pastille de rareté : le mot seul, "Commun", "Peu commun" ou "Rare" (doré pour une espèce rare).
// Rien si la case du tableur est vide.
// Étape 206 (maquette C3-A, 18/10) : un ruban en haut à gauche de la photo — doré « ★ Rare », gris « Peu commun » ;
//   rien pour une espèce commune (moins de bruit).
function dessinRarete(espece) {
  const r = RARETES[espece.rarete_observation];
  if (!r || r.points === 1) return "";
  return `<span class="rarete ruban${r.points === 3 ? " rare" : ""}">${r.points === 3 ? "★ Rare" : "Peu commun"}</span>`;
}

function estRare(espece) { return espece.rarete_observation === "Rare"; }

// Étape 206 (maquette C3-C) : gagner une espèce RARE est un grand moment (carte au centre) ; sinon, la vignette du coin
function annoncerNouvelleEspece(espece, detail) {
  const pop = { couleur: classeDe(espece).couleur, image: celluleImage(espece, true),
                etiquette: estRare(espece) ? "★ Nouvelle espèce rare" : "Nouvelle espèce", titre: espece.nom_courant, detail, rare: estRare(espece) };
  if (!estRare(espece)) {                              // étape 212 (Revoir 2) : la même fenêtre au centre que les badges
    feter({ etiquette: "Nouvelle espèce", titre: espece.nom_courant, detail: majuscule(detail), son: null, pop,
            visuel: visuelEspece(espece, classeDe(espece).couleur) });
    return;
  }
  feter({ etiquette: "★ Espèce rare !", titre: espece.nom_courant,
          detail: "Une espèce rare à observer dans la nature. Elle rejoint votre encyclopédie.", son: "badge", pop,
          visuel: visuelEspece(espece, "or") });
}

// La même information, en une ligne de texte, pour la fiche détaillée de l'encyclopédie
function ligneRarete(espece) {
  if (!RARETES[espece.rarete_observation]) return "";
  return `<p class="carac"><span>Rareté :</span> ${espece.rarete_observation}</p>`;
}

// Étape M3 (06/11) : sur téléphone, après une réponse, la page remonte juste assez pour montrer
// l'explication et le bouton « Question suivante » (sur ordinateur, rien ne change : R138 les range à droite).
(function suiteVisibleSurTelephone() {
  const suivant = document.getElementById("suivant");
  if (!suivant || !window.matchMedia || typeof MutationObserver === "undefined") return;
  const telephone = window.matchMedia("(max-width: 760px)");
  const montrerSuite = () => {
    if (!telephone.matches || suivant.classList.contains("cache") || !suivant.getClientRects().length) return;   // (offsetParent vaut null pour un bouton fixé)
    // Étape M15 : le bouton « Continuer » est fixé en bas de l'écran ; c'est l'explication qui doit rester visible au-dessus
    const fixe = getComputedStyle(suivant).position === "fixed";
    const retour = document.getElementById("retour");
    const cible = fixe && retour && retour.offsetParent && retour.textContent.trim() ? retour : suivant;
    const limite = fixe ? suivant.getBoundingClientRect().top - 12 : window.innerHeight;
    const bas = cible.getBoundingClientRect().bottom + 12;
    if (bas > limite) window.scrollBy({ top: bas - limite, behavior: "smooth" });
  };
  new MutationObserver(() => { setTimeout(montrerSuite, 60); setTimeout(montrerSuite, 450); })   // M15 : une 2e fois, l'explication peut arriver juste après
    .observe(suivant, { attributes: true, attributeFilter: ["class"] });
})();

// Étape M15 (07/11/2026, choix d'Aubin : « B avec Continuer plutôt que Question suivante ») : sur téléphone, le bouton
// qui mène à la question suivante s'appelle « Continuer » (« Voir le résultat » et les autres annonces gardent leur texte).
(function continuerSurTelephone() {
  const suivant = document.getElementById("suivant");
  if (!suivant || !window.matchMedia || typeof MutationObserver === "undefined") return;
  const telephone = window.matchMedia("(max-width: 760px)");
  const renommer = () => {
    if (telephone.matches && /^(Question|Rencontre|Espèce|Duel) suivante?\s*→?$/.test(suivant.textContent.trim())) suivant.textContent = "Continuer";
  };
  new MutationObserver(renommer).observe(suivant, { childList: true, characterData: true, subtree: true });
  renommer();
})();

// Étape M3 (06/11) : sur téléphone, à chaque nouvelle question, la page se place pour montrer la question et
// toutes ses réponses : en haut de la page si tout tient, sinon décalée juste ce qu'il faut (la question reste visible).
(function questionVisibleSurTelephone() {
  const reponses = document.getElementById("reponses"), suivant = document.getElementById("suivant");
  if (!reponses || !window.matchMedia || typeof MutationObserver === "undefined") return;
  const telephone = window.matchMedia("(max-width: 760px)");
  let attente = null;
  new MutationObserver(() => {
    if (!telephone.matches) return;
    clearTimeout(attente);
    attente = setTimeout(() => {
      if (!reponses.offsetParent || !reponses.children.length) return;
      if (suivant && !suivant.classList.contains("cache")) return;          // la réponse est déjà donnée
      const titre = [document.getElementById("nom"), document.getElementById("question")].find(el => el && el.offsetParent && el.textContent.trim());
      const bande = document.getElementById("vers-fiche");                 // étape R158 : la bande du bas ne doit pas cacher les réponses
      const hBande = bande && getComputedStyle(bande).display !== "none" ? bande.offsetHeight : 0;
      const y = window.scrollY, bas = reponses.getBoundingClientRect().bottom + y + 12 + hBande;
      const plafond = titre ? titre.getBoundingClientRect().top + y - 12 : bas;
      const cible = Math.max(0, Math.min(bas - window.innerHeight, plafond));
      if (Math.abs(cible - y) > 4) window.scrollTo(0, cible);
    }, 80);
  }).observe(reponses, { childList: true });
})();

// ==================================================================
// Étape R162 (08/11/2026, choix d'Aubin : maquette B « deux colonnes ») — sur ordinateur, la fin d'une Rencontre
// ordinaire tient dans un écran de 1366 × 768 : à gauche l'espèce et « Pour la reconnaître », à droite « À revoir »
// et les boutons ; familles, défis du jour et souvenirs repliés dans « Votre progression ». Le cadre « Espèces »
// (qui répétait l'espèce) est retiré. Le téléphone garde sa fin courte (M16), une expédition sa propre fin.
// ==================================================================
function finRencontreOrdinateur(s) {
  const fin = document.getElementById("fin-session"), carnet = document.getElementById("carnet-fin-session");
  if (!fin || !carnet) return;
  const actif = !!s && !s.expedition && !!s.focus && !(typeof surTelephone === "function" && surTelephone());
  fin.classList.toggle("fin-b", actif);
  if (!actif) return;
  const e = s.focus;
  const h1 = document.getElementById("titre-fin-session");
  if (h1) h1.innerHTML = `<small>Rencontre terminée</small>${echapper(e.nom_courant)}`;
  const trois = carnet.querySelector(".trois-fin"), obj = carnet.querySelector(".objectifs-fin");
  if (trois) {
    const blocs = trois.querySelectorAll(".bloc-fin");
    if (blocs[0]) blocs[0].remove();                                   // « Espèces » : l'espèce est déjà à gauche
    const hb = blocs[2] && blocs[2].querySelector("h4"); if (hb) hb.textContent = "Badges";
  }
  // Le résumé d'une ligne de « Votre progression »
  const t = territoireActif(), bouts = [];
  const fam = (typeof especesDe === "function" && t ? especesDe(t) : []).filter(x => x.onglet === e.onglet);
  if (fam.length && CLASSES[e.onglet]) bouts.push(`${CLASSES[e.onglet].nom} ${fam.filter(estReconnue).length} / ${fam.length}`);   // comme le carnet
  const defis = suivi && suivi.defis && t && suivi.defis[t] ? suivi.defis[t].liste : [];
  if (defis.length) bouts.push(`Défis du jour ${defis.filter(d => d.reussi).length} / ${defis.length}`);
  const nb = trois ? trois.querySelectorAll(".badge-fin").length : 0;
  bouts.push(nb ? `${nb} nouveau${nb > 1 ? "x" : ""} badge${nb > 1 ? "s" : ""}` : "Badges");   // étape R166 : « badges », plus « souvenirs »
  const pli = document.createElement("details");
  pli.className = "finb-pli";
  pli.innerHTML = `<summary><b>Votre progression</b>${bouts.map(b => `<span>${b}</span>`).join('<span class="sep" aria-hidden="true">·</span>')}</summary><div class="finb-corps"></div>`;
  const corps = pli.querySelector(".finb-corps");
  if (trois) corps.appendChild(trois);
  if (obj) corps.appendChild(obj);
  carnet.appendChild(pli);
}

// =====================================================================================================
// Étape R194 (14/11/2026, n° 14, choix d'Aubin dans l'artefact « Fiche pendant les questions » : C, « un tiroir qui monte
//   du bas »). Critère : pendant une question, l'écran ne montre que la question ; la fiche s'ouvre d'un geste, en entier,
//   et se referme d'un geste sans perdre sa place. Sur téléphone (760 px et moins), la fiche n'est plus sous la question :
//   la bande du bas l'ouvre (toucher, ou glisser vers le haut) ; elle monte presque jusqu'en haut, la question reste rappelée
//   au-dessus ; on la referme en touchant ce rappel, en la faisant glisser vers le bas, par « Revenir à la question » ou par
//   le retour du téléphone. Sur ordinateur, rien ne change (la fiche reste dans la colonne de droite).
// =====================================================================================================
function tiroirPossible() {
  const c = document.getElementById("carte-rencontre");
  return !!(c && c.classList.contains("avec-postit") && typeof surTelephone === "function" && surTelephone());
}
function tiroirOuvert() { const c = document.getElementById("carte-rencontre"); return !!(c && c.classList.contains("tiroir-ouvert")); }
function rappelTiroir() {
  let r = document.getElementById("tiroir-rappel");
  if (!r) {
    r = document.createElement("button"); r.type = "button"; r.id = "tiroir-rappel"; r.className = "tiroir-rappel";
    r.onclick = fermerTiroir;
    document.getElementById("carte-rencontre").append(r);
  }
  // le rappel de la question : le compteur, puis le titre et la phrase de la question (ce qui est écrit à l'écran)
  const txt = id => { const el = document.getElementById(id); return el && !el.classList.contains("cache") ? el.textContent.replace(/\s+/g, " ").trim() : ""; };
  const compteur = txt("compteur-rencontre"), q = [txt("nom"), txt("question")].filter(Boolean).join(" · ");
  r.innerHTML = `${compteur ? `<small>${echapper(compteur)}</small>` : ""}<b>${echapper(q || "La question")}</b><span class="tr-fermer">Revenir à la question ↓</span>`;
  return r;
}
function ouvrirTiroir() {
  const c = document.getElementById("carte-rencontre"), f = document.getElementById("postit-rencontre");
  if (!tiroirPossible() || !f) return;
  rappelTiroir();
  f.style.transform = "";
  f.scrollTop = 0;
  c.classList.add("tiroir-ouvert");
  document.documentElement.classList.add("tiroir-page");          // la page derrière ne défile plus
}
function fermerTiroir() {
  const c = document.getElementById("carte-rencontre"), f = document.getElementById("postit-rencontre");
  if (!c) return;
  c.classList.remove("tiroir-ouvert");
  if (f) f.style.transform = "";
  document.documentElement.classList.remove("tiroir-page");
}
// Glisser du doigt : vers le haut sur la bande pour ouvrir ; vers le bas sur le tiroir (quand il est en haut de sa liste) pour fermer
function brancherGlisserTiroir(bande) {
  let y0 = null;
  bande.addEventListener("touchstart", ev => { y0 = ev.touches[0].clientY; }, { passive: true });
  bande.addEventListener("touchmove", ev => { if (y0 !== null && y0 - ev.touches[0].clientY > 24) { y0 = null; ouvrirTiroir(); } }, { passive: true });
  const f = document.getElementById("postit-rencontre");
  if (!f || f.dataset.glisser) return;
  f.dataset.glisser = "oui";
  let depart = null, dy = 0;
  f.addEventListener("touchstart", ev => { depart = (tiroirOuvert() && f.scrollTop <= 0) ? ev.touches[0].clientY : null; dy = 0; }, { passive: true });
  f.addEventListener("touchmove", ev => {
    if (depart === null) return;
    dy = ev.touches[0].clientY - depart;
    if (dy > 0) { f.style.transition = "none"; f.style.transform = `translateY(${dy}px)`; }
  }, { passive: true });
  f.addEventListener("touchend", () => {
    if (depart === null) return;
    f.style.transition = "";
    if (dy > 90) fermerTiroir(); else f.style.transform = "";
    depart = null; dy = 0;
  });
}
