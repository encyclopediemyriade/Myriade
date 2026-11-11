// 07_parties.js — La navigation, l'écran de fin, les parties (« Jouer ») et la découverte des territoires.
// Une partie du programme du jeu, chargée par jeu.html dans l'ordre des numéros.

// ==================================================================
// 11. LES ONGLETS : montrer une vue, cacher les autres
//     (accueil / rencontre / defis / encyclopedie)
//     "rencontre" et "defis" partagent la même zone de la page (vue-rencontre) :
//     c'est modeChoisi qui dit laquelle des deux on y affiche (étape 45).
// ==================================================================
function montrer(vue) {
  arreterCri();                                          // on coupe un cri en cours si l'on change de page
  document.querySelectorAll("audio").forEach(a => a.pause());   // étape 212 : aussi les lecteurs des fiches
  if (defi) abandonnerDefi();                            // quitter la page pendant un défi l'annule, sans rien enregistrer
  if (typeof majFilExpedition === "function") majFilExpedition(null);   // étape 332 : le bandeau d'expédition, remis par les lancements d'expédition
  const jeu = vue === "jouer";                           // l'onglet Jouer (étape 72)
  if (!jeu) modeLibre = false;
  if (!jeu && vue !== "arcade") depuisArcade = false;    // étape 274 : on a quitté « Plus de jeux »
  // Étape 253 : trois usages de cet écran — « Partir ailleurs » (un territoire), « Plus de jeux » (choix libre), lancement direct
  if (jeu) modeTerrain = !lancementDirect && !modeLibre;
  if (jeu && modeTerrain) territoiresDefi = [territoireActif()];   // étape 252 : on part du territoire où l'on est (un seul)
  if (jeu && modeLibre && !lancementDirect) entrerPlusDeJeux();
  if (vue === "encyclopedie" && !filtreTerritoireChoisi) filtreTerritoire = territoireActif();   // étape 252 : filtre réglé sur le territoire
  document.getElementById("vue-bienvenue").classList.add("cache");      // la première visite est finie (étape 52)
  document.getElementById("barre").classList.remove("cache");
  document.getElementById("vue-accueil").classList.toggle("cache", vue !== "accueil");
  document.getElementById("vue-carte").classList.toggle("cache", vue !== "carte");   // étape 255 : la page carte
  const vueMaison = document.getElementById("vue-maison");                              // étape M9 : l'accueil du téléphone
  if (vueMaison) vueMaison.classList.toggle("cache", vue !== "maison");
  if (vue === "maison" && typeof dessinerMaison === "function") dessinerMaison();
  if (vue === "maison") window.scrollTo(0, 0);              // étape M14 : l'accueil s'ouvre toujours en haut (après « Comment jouer », il s'ouvrait au milieu)
  document.getElementById("vue-arcade").classList.toggle("cache", vue !== "arcade");   // étape 262 : l'Arcade
  const vueExp = document.getElementById("vue-expedition");                            // étape 282 : l'écran d'une expédition
  if (vueExp) vueExp.classList.toggle("cache", vue !== "expedition");
  const vueLieu = document.getElementById("vue-lieu");                                  // étape 290 : la page d'un lieu
  if (vueLieu) vueLieu.classList.toggle("cache", vue !== "lieu");
  document.getElementById("vue-rencontre").classList.toggle("cache", !jeu);
  document.getElementById("vue-encyclopedie").classList.toggle("cache", vue !== "encyclopedie");
  document.getElementById("vue-apropos").classList.toggle("cache", vue !== "apropos");   // étape 102
  document.getElementById("vue-espece").classList.toggle("cache", vue !== "espece");     // étape 103
  document.getElementById("vue-progression").classList.toggle("cache", vue !== "progression");   // étape 106
  document.getElementById("onglet-progression").classList.toggle("actif", vue === "progression");
  document.getElementById("onglet-accueil").classList.toggle("actif", vue === "accueil" || vue === "maison" || vue === "carte" || vue === "expedition" || vue === "lieu");
  document.getElementById("onglet-jouer").classList.toggle("actif", vue === "arcade" || (jeu && modeLibre));   // étape 262 : l'Arcade
  document.body.classList.toggle("ecran-jouer", jeu);   // étape 91 : la barre du haut s'élargit comme le carnet
  document.getElementById("onglet-encyclopedie").classList.toggle("actif", vue === "encyclopedie" || vue === "espece");
  fermerFenetre();
  if (vue === "accueil") afficherAccueil();       // stats à jour à chaque retour à l'accueil
  if (vue === "carte") afficherPageCarte();       // étape 255
  if (vue === "arcade") { afficherArcade(); window.scrollTo(0, 0); }   // étape 262
  if (jeu) entrerRencontre();
  if (vue === "encyclopedie") afficherEncyclopedie();
  if (vue === "apropos") { afficherAPropos(); window.scrollTo(0, 0); }
  if (vue === "espece") { afficherPageEspece(); window.scrollTo(0, 0); }
  if (vue === "progression") {                                                    // étape 106
    // Étape 334 (Revoir 8) : la page s'ouvre tout de suite, son contenu se calcule à l'image suivante
    window.scrollTo(0, 0);
    const v = document.getElementById("vue-progression");
    if (v && !v.innerHTML.trim()) v.innerHTML = `<p class="pg-attente">Votre carnet s'ouvre…</p>`;
    requestAnimationFrame(() => setTimeout(() => { if (!v || !v.classList.contains("cache")) afficherPageProgression(); }, 0));
  }
}

// Le bouton Quitter (étape 73) : on arrête la partie en cours et on revient à l'accueil.
// Rien n'est perdu de ce qui a déjà été trouvé : chaque bonne réponse est enregistrée sur le moment.
// (montrer() arrête aussi un jeu en cours ; on l'écrit ici pour que ce soit clair.)
function quitterJeu() {
  arreterCri();
  if (defi) abandonnerDefi();          // les XP déjà gagnés sont gardés
  session = null;                      // la Rencontre en cours ne sera pas reprise
  montrer("accueil");
}

// Entrer dans la Rencontre : reprendre la session en cours, ou
// demander combien de questions si aucune session n'est en cours.
function entrerRencontre() {
  // Une Rencontre commencée (sans chronomètre) se reprend là où elle en était ;
  // sinon, on voit l'écran Jouer (étape 72).
  const enCours = !!session && session.faites < session.total;
  document.getElementById("fin-session").classList.add("cache");
  document.getElementById("fin-defi").classList.add("cache");
  document.getElementById("hud-defi").classList.add("cache");
  document.getElementById("choix-longueur").classList.toggle("cache", enCours);
  if (!enCours) { calculerOrdreJeux(); afficherChoixDefi(); }
  // Session en cours : on reprend là où elle en était (étape 44)
  document.getElementById("carte-rencontre").classList.toggle("cache", !enCours);
}

// Les cases à cocher avant une Rencontre : territoires (étape 13) puis
// familles (étape 12). Tout est coché par défaut.
// Les couleurs des territoires ; un territoire absent de cette liste sera gris.
const TERRITOIRES = {
  "Alpes": { couleur: "#4d6a7d" },
  "Massif armoricain": { couleur: "#4f7a6a" },   // étape 181 : vert d'eau, entre lande et océan
  "Bassin parisien et Val de Loire": { couleur: "#8a6f3c" },   // étape 190 : ocre doré, comme les blés de Beauce
  "Méditerranée": { couleur: "#b0644a" },   // étape 191 : terre cuite, comme les tuiles et la terre rouge des garrigues
  "Pyrénées": { couleur: "#74587a" },   // étape 192 : violet bruyère, comme les landes de bruyère des estives
  "Bassin aquitain": { couleur: "#8b3a4a" },   // étape 237 : bordeaux, comme les vignes du Sud-Ouest
  "Massif central": { couleur: "#64783a" },   // étape 286 : vert d'estive, comme les prairies d'altitude de l'Aubrac et du Cantal (choix de l'utilisateur, 25/10)
  "Corse": { couleur: "#2a7d8e" },   // étape 299 : turquoise profond, comme l'eau des criques et des vasques (choix de l'utilisateur, 26/10)
  "Jura": { couleur: "#3f6b5c" },   // étape 307 : vert sapin bleuté, comme les forêts d'épicéas et les tourbières (choix de l'utilisateur, 26/10 ; à harmoniser plus tard si besoin)
  "Vosges": { couleur: "#a35f63" },   // étape VG2 : grès rose, comme le grès des rochers, des châteaux et du mont Sainte-Odile (choix de l'utilisateur, 31/10)
  "Plaines de l'Est et val de Saône": { couleur: "#2f5a9c" },   // étape GE3 : bleu de Saône, comme la Saône, le Rhin, la Moselle et les étangs (choix de l'utilisateur, 31/10 ; nom technique des fichiers : Grand Est)
};


// Démarrer une Rencontre : elle porte sur UNE espèce, approfondie (étape 74, partie 11 octies).
function demarrerSession() { demarrerFocus(); }

// ---- Le bilan de fin de Rencontre (étape 37) --------------------------
// À chaque BONNE réponse, on ajoute une ligne au journal de la session.
// La ligne est rangée dans une des trois listes selon ce que le joueur
// savait AVANT de répondre :
//   "decouvert" = l'espèce est reconnue sur sa photo pour la première fois
//   "appris"    = la caractéristique est trouvée pour la première fois
//   "confirme"  = elle avait déjà été trouvée : le joueur la retrouve
// Une mauvaise réponse n'écrit rien : la question reviendra d'elle-même.
// Le journal est celui de la Rencontre en cours, ou celui du défi en cours (étape 55).
// "texteImpose" : pour les jeux qui n'ont pas de question classique (Plus ou moins, Qui est-ce ?).
function noterAuBilan(espece, champ, texteImpose) {
  const journal = defi ? defi.bilan : session ? session.bilan : null;
  if (!journal) return;
  // Étape 101 (J2) : la liste dépend du nombre de fois où la case était déjà trouvée
  //   0 → "decouvert" (nouvelle espèce) ou "appris" (affiché « Découvert ») · 1 → "connu" · 2 → "confirme" · 3 et plus → "revu"
  const avant = nbBonnes(espece, champ);
  let liste;
  if (avant === 0)                   liste = champ === IDENTIFICATION ? "decouvert" : "appris";
  else if (avant === 1)              liste = "connu";
  else                               liste = "revu";

  // Le texte à afficher : "Alimentation : Herbes" ; pour la photo, "reconnue sur photo"
  const { q, bonne } = enCours || {};                  // (pas de question classique en Plus ou moins)
  const texte = texteImpose ? texteImpose
              : (champ === IDENTIFICATION) ? "reconnue sur photo"
                                           : `${q.libelle} : ${afficherValeur(q, bonne)}`;
  // Pas de doublon : la même information n'apparaît qu'une fois dans le bilan
  const dejaNotee = journal.some(l => l.nom === espece.nom_courant && l.texte === texte);
  if (!dejaNotee) journal.push({ liste: liste, nom: espece.nom_courant, texte: texte, champ: texteImpose ? null : champ });   // (champ : étape 145)
}

// ---- Déjà montrée, ou seulement croisée en défi ? (étapes 56 et 58) -------
// Une fiche créée par un défi porte la marque "cachee". La marque tombe dès que l'espèce se
// montre en Rencontre (Apparition, question). Dans l'encyclopédie, cela ne change rien : tant
// qu'elle n'est pas identifiée, l'espèce est une carte « ? ». La différence sert en coulisses :
// une espèce déjà montrée revient en priorité dans l'Apparition suivante.
function estVue(espece) {
  const fiche = progression[espece.nom_courant];
  return !!fiche && !fiche.cachee;
}
function marquerVue(espece) {
  const nom = espece.nom_courant;
  if (!progression[nom]) progression[nom] = { acquis: {} };
  delete progression[nom].cachee;                      // delete = retirer une case d'un objet
}
function ficheCachee(espece) {
  const nom = espece.nom_courant;
  if (!progression[nom]) progression[nom] = { acquis: {}, cachee: true };
}

// Noter une case comme trouvée (étape 55) : +1 sur la fiche, en créant la fiche si besoin.
// Si la question attendait dans les « Déjà croisée… », elle en sort.
function acquerir(espece, champ) {
  const nom = espece.nom_courant;
  // Étape 98 : une question manquée puis retrouvée dans la même partie n'est plus « à revoir »
  const partieEnCours = defi || session;
  if (partieEnCours && partieEnCours.manquees) partieEnCours.manquees = partieEnCours.manquees.filter(m => !(m.espece === espece && m.champ === champ));
  // Étape 92 : une espèce reconnue pour la première fois compte comme découverte du jeu en cours
  const jeu = jeuEnCours();
  if (jeu && champ === IDENTIFICATION && nbBonnes(espece, champ) === 0) statsDe(jeu).decouvertes++;
  ficheCachee(espece);                                 // si la fiche n'existe pas : créée, mais cachée (étape 56)
  noterReussite(espece, champ);                        // étape 106 : pour les badges (AVANT le +1)
  const dejaIdentifiee = estIdentifiee(espece);
  progression[nom].acquis[champ] = nbBonnes(espece, champ) + 1;
  noterRevue(espece, champ);                           // étape 150
  aRevoir = aRevoir.filter(r => !(r.nom === nom && r.champ === champ));
  if (!dejaIdentifiee && estIdentifiee(espece)) noterNouvelleFamille(espece);   // étape 127 : 1re espèce d'une famille ?
}
// Une question ratée rejoint les « Déjà croisée… » (sauf si elle y est déjà).
function aRevoirPlusTard(espece, champ) {
  const nom = espece.nom_courant;
  // Étape 98 : la partie en cours garde la liste de ses questions manquées (proposées à la fin)
  const partie = defi || session;
  if (partie && champ !== OUVERTURE) {
    partie.manquees = partie.manquees || [];
    if (!partie.manquees.some(m => m.espece === espece && m.champ === champ)) partie.manquees.push({ espece, champ });
  }
  ficheCachee(espece);
  noterEchec(espece, champ);                           // étape 106 : pour les badges
  if (champ !== OUVERTURE) { suivi.ratees = suivi.ratees || {}; suivi.ratees[nom + "|" + champ] = suivi.parties || 0; }   // étape 172
  if (!aRevoir.some(r => r.nom === nom && r.champ === champ)) aRevoir.push({ nom: nom, champ: champ, dans: entreAuHasard(REVISION_AU_PLUS_TOT, REVISION_AU_PLUS_TARD) });
}

// Dessiner les trois listes sur l'écran de fin. Une liste vide n'est pas affichée.
// "idZone" : où dessiner (la fin de Rencontre par défaut, ou la fin de défi)
function afficherBilan(journal, idZone = "bilan-session") {
  const zone = document.getElementById(idZone);
  zone.innerHTML = "";
  const decouverts = journal.filter(l => l.liste === "decouvert");
  const appris     = journal.filter(l => l.liste === "appris");
  const connus     = journal.filter(l => l.liste === "connu");
  const confirmes  = journal.filter(l => l.liste === "confirme");

  if (journal.length === 0) {
    zone.innerHTML = `<p class="vide">Rien de nouveau cette fois : les espèces croisées reviendront.</p>`;
    return;
  }

  // 1) Découvert : les nouvelles espèces, avec leur petite photo
  if (decouverts.length) {
    const n = decouverts.length;
    zone.insertAdjacentHTML("beforeend",
      `<p class="titre-defis">Nouvelles espèces · ${n}</p><div class="decouvertes"></div>`);
    const rangee = zone.querySelector(".decouvertes");
    for (const l of decouverts) {
      const espece = ESPECES.find(e => e.nom_courant === l.nom);
      rangee.insertAdjacentHTML("beforeend", `<div class="decouverte">${celluleImage(espece, true)}${l.nom}</div>`);
    }
  }

  // 2) Appris et 3) Confirmé : une ligne par espèce, ses caractéristiques à la suite
  const ecrireListe = (titre, lignes) => {
    if (!lignes.length) return;
    zone.insertAdjacentHTML("beforeend", `<p class="titre-defis">${titre} · ${lignes.length}</p>`);
    const noms = [...new Set(lignes.map(l => l.nom))];          // chaque espèce une seule fois, dans l'ordre de jeu
    for (const nom of noms) {
      const textes = lignes.filter(l => l.nom === nom).map(l => l.texte);
      zone.insertAdjacentHTML("beforeend", `<p>${nom} — <span>${textes.join("  ·  ")}</span></p>`);
    }
  };
  ecrireListe("Découvert", appris);              // étape 101 : Nouvelles espèces / Découvert / Connu / Confirmé
  ecrireListe("Connu", connus);
  ecrireListe("Confirmé", confirmes);
}

// ==================================================================
// ÉTAPE 97 — L'ÉCRAN DE FIN : « + N lignes écrites dans votre carnet »
//   • les lignes nouvelles (espèces découvertes, caractéristiques apprises) s'écrivent une à une ;
//   • les réponses confirmées sont résumées en une ligne ;
//   • quelques cases : bonnes réponses, points et record, % du carnet du territoire avant → après ;
//   • les annonces : nouveau rang de naturaliste, nouveau rang d'une famille.
// Plus d'étoiles ni d'XP.
// ==================================================================
// La photo prise avant la partie (et à la fin) : le carnet de chaque territoire, le rang de chaque famille
// Étape M20 (07/11, choix d'Aubin « le territoire partout ») : les familles de l'écran de fin se comptent dans LE territoire
//   où l'on joue (celui de l'expédition, sinon le territoire actif), comme l'encyclopédie — plus sur tous les territoires
//   où vivent les espèces de la partie (Mollusques 6/29 au lieu de 6/20).
function territoireDeLaPartie(options) {
  const x = options && options.expedition && typeof expeditionParId === "function" ? expeditionParId(options.expedition.id) : null;
  return (x && x.territoire) || (typeof territoireActif === "function" ? territoireActif() : null);
}
function photoFin(territoires, terrFamilles) {
  const photo = { rang: rangActuel(), territoires: {}, badges: Object.assign({}, badgesObtenus) };   // étape 106 : les badges avant la partie
  photo.terrFamilles = terrFamilles || territoireDeLaPartie();   // étape M20
  // Étape 196 : la médaille de chaque espèce et la part de chaque famille (sur l'ensemble des territoires en jeu)
  const dans = ESPECES.filter(e => estDans(e, territoires));
  photo.medailles = {};
  for (const e of dans) photo.medailles[e.nom_courant] = niveauTermine(e);
  photo.familles = {};
  const pourFamilles = photo.terrFamilles ? especesDe(photo.terrFamilles) : dans;   // étape M20
  for (const cle of Object.keys(CLASSES)) {
    const f = pourFamilles.filter(e => e.onglet === cle);
    if (f.length) photo.familles[cle] = progresFamille(f);
  }
  for (const t of territoires) {
    const especes = especesDe(t);
    const familles = {};
    for (const cle of Object.keys(CLASSES)) {
      const f = especes.filter(e => e.onglet === cle);
      if (f.length) familles[cle] = progresFamille(f).palier;
    }
    photo.territoires[t] = { carnet: carnetDe(especes), familles };
  }
  return photo;
}
// Étape 98 : une petite partie qui ne pose que les questions manquées (sans chronomètre, sans record)
// Étape 99 : « origine » = l'écran de fin d'où l'on vient ; à la fin de la reprise, on y revient, mis à jour
function reprendreManquees(manquees, origine) {
  const especes = [...new Set(manquees.map(m => m.espece))];
  const d = construireDefi([...new Set(especes.flatMap(territoiresJeu))], [...new Set(especes.map(e => e.onglet))]);
  if (!d) return;
  const jeuAvant = jeuChoisi, chronoAvant = avecChrono;
  jeuChoisi = "revision"; avecChrono = false;
  demarrerDefi(d, { file: manquees.map(m => ({ espece: m.espece, champ: m.champ })), origine });
  jeuChoisi = jeuAvant; avecChrono = chronoAvant;            // les réglages du joueur ne changent pas
}
// Les trois points d'un niveau donné (pour l'écran de fin)
function dessinPoints(n) {
  return `<span class="points-donnee">` + [1, 2].map(i => `<i class="${i <= n ? "plein" : ""}"></i>`).join("") + `</span>`;
}
// Étape 196 (17/10, maquette « fin de partie ») : l'écran de fin ne montre plus que les 3 progressions —
//   les espèces (nouvelles, médailles, traits découverts), les familles (rang et part), les badges.
//   Disparaissent : les lignes Connu / Confirmé, le pourcentage du carnet, le rang de naturaliste.
function afficherCarnetFin(idZone, { journal, avant, cases, manquees: manqueesFin, origine, parfaite }) {
  verifierBadges();                        // étape 106 : les badges de fin de partie (Sans faute, Arpenteur…)
  const zone = document.getElementById(idZone);
  const terr = Object.keys(avant ? avant.territoires : {});
  const apres = photoFin(terr, avant && avant.terrFamilles);   // étape M20 : la même zone qu'avant la partie
  const nomMedaille = n => CLASSES_PALIER[n];          // étape R144 : classe CSS du palier
  const motPalier = n => nomPalier(n);                 // étape R144 : le mot affiché
  const sansMed = typeof enExpedition === "function" && enExpedition();   // étape R130 : pas de médailles dans une expédition
  const scoreTexte = cases.map(([c, t]) => `<b>${c}</b> ${t}`).join(" · ");
  // Étape R101 (Revoir 10) : à la fin d'une Rencontre, le score monte en haut de l'écran, sous le titre
  const scoreHaut = idZone === "carnet-fin-session" ? document.getElementById("score-session") : null;
  if (scoreHaut) scoreHaut.innerHTML = scoreTexte;
  let html = cases.length && !scoreHaut ? `<p class="score-fin3">${scoreTexte}</p>` : "";
  // 0) Étape 98 : les questions qui ont échappé au joueur, à reprendre tout de suite
  //    Étape 275 (« Revoir 5 ») : juste après le score, avant les espèces, familles et badges
  const manquees = (manqueesFin || []).filter(m => m.espece && m.champ);
  if (manquees.length) {
    const k = manquees.length;
    const libelle = m => m.champ === IDENTIFICATION ? "Photo" : ((QUESTIONS.find(q => q.champ === m.champ) || {}).libelle || m.champ);
    const liste = manquees.slice(0, 8).map(m => `<span>${m.espece.nom_courant} — ${libelle(m)}</span>`).join("")
      + (k > 8 ? `<span>… et ${k - 8} autre${k - 8 > 1 ? "s" : ""}</span>` : "");
    html += `<div class="a-revoir-fin haut"><div class="quoi">À revoir</div>`
      + `<div class="liste-a-revoir">${liste}</div>`
      + `<button class="bouton-accueil principal" id="reprendre-manquees">${k === 1 ? "Essayer à nouveau cette question" : "Essayer à nouveau ces questions"}</button></div>`;
  }
  // 1) Les espèces : découvertes, médailles gagnées, traits découverts
  const parEspece = new Map();
  for (const l of journal) {
    if (l.liste !== "decouvert" && l.liste !== "appris") continue;
    const x = parEspece.get(l.nom) || { nouvelle: false, traits: 0 };
    if (l.liste === "decouvert") x.nouvelle = true; else x.traits++;
    parEspece.set(l.nom, x);
  }
  let lignes = [...parEspece.entries()].map(([nom, x]) => {
    const e = ESPECES.find(z => z.nom_courant === nom);
    const m0 = avant && avant.medailles ? (avant.medailles[nom] || 0) : 0, m1 = niveauTermine(e);
    // Étape 202 : la prochaine médaille en vue (« bronze : plus que 3 traits »), avec une petite jauge
    const pm = prochaineMedaille(e);
    const enVue = pm ? `${motPalier(pm.niveau)} : plus que ${pm.manque} trait${pm.manque > 1 ? "s" : ""}` : "";
    const jauge = pm && pm.total ? `<span class="mini-med ${nomMedaille(pm.niveau)}"><i style="width:${Math.round(100 * (pm.total - pm.manque) / pm.total)}%"></i></span>` : "";
    const traitsTexte = `+ ${x.traits} trait${x.traits > 1 ? "s" : ""} découvert${x.traits > 1 ? "s" : ""}`;
    const detail = sansMed ? (x.nouvelle ? "nouvelle espèce" : traitsTexte)   // étape R130 : dans une expédition, sans médaille
      : x.nouvelle ? `nouvelle espèce${m1 ? ` · <i class="pt-med ${nomMedaille(m1)}"></i>${motPalier(m1)}` : enVue ? ` · ${enVue}` : ""}${jauge}`
      : m1 > m0 ? `devient <i class="pt-med ${nomMedaille(m1)}"></i>${motPalier(m1)}`
      : `${enVue || traitsTexte}${jauge}`;
    return { e, detail, poids: (x.nouvelle ? 2 : 0) + (m1 > m0 ? 1 : 0) };
  });
  lignes.sort((a, b) => b.poids - a.poids);
  const reste = lignes.length - 4;
  let blocE = lignes.slice(0, 4).map(l => `<div class="esp-fin"><span class="ph">${celluleImage(l.e, true)}</span><div>${l.e.nom_courant}<small>${l.detail}</small></div></div>`).join("");
  if (reste > 0) blocE += `<small class="vide">… et ${reste} autre${reste > 1 ? "s" : ""} espèce${reste > 1 ? "s" : ""}</small>`;
  if (!lignes.length) blocE = `<p class="vide">Rien de nouveau cette fois : les espèces croisées reviendront.</p>`;
  // 2) Les familles qui ont avancé : rang, part avant + gain, prochain rang
  let blocF = "";
  for (const cle in apres.familles) {
    const a = avant && avant.familles ? avant.familles[cle] : null, b = apres.familles[cle];
    if (!a || b.part <= a.part) continue;
    const pa = Math.round(100 * a.part), pb = Math.round(100 * b.part), suivant = PALIERS_FAMILLE[b.palier];
    blocF += `<div class="fam-fin ${MEDAILLES[b.palier]}">${CLASSES[cle].nom}${b.palier ? ` · ${b.palier > a.palier ? `<b>${RANGS_FAMILLE[b.palier]}</b>` : RANGS_FAMILLE[b.palier]}` : ""}`
      + `<span class="jauge3"><i style="width:${pa}%"></i><i class="gain" style="width:${Math.max(1, pb - pa)}%"></i></span>`
      + `<small>${b.especesId} / ${b.nb} espèces${(() => { const n = b.especesId - (a.especesId || 0), m = b.medailles - (a.medailles || 0), bouts = [];
          if (n > 0) bouts.push(`+ ${n} espèce${n > 1 ? "s" : ""}`); if (m > 0 && !sansMed) bouts.push(`+ ${m} palier${m > 1 ? "s" : ""} d'espèce`);   // étape R144
          return bouts.length ? " · " + bouts.join(", ") : ""; })()}</small></div>`;   // étape 202 : en espèces et en médailles
  }
  if (!blocF) blocF = `<p class="vide">Les familles avancent à chaque nouvelle espèce et chaque fois qu'une espèce devient croisée, comprise ou familière.</p>`;   // étape 202
  // 3) Les badges gagnés pendant la partie, sinon le prochain à portée
  let blocB = "";
  const gagnes = [];
  if (avant && avant.badges) {
    for (const b of tousLesBadges()) {
      const palier = palierDe(b);
      if (palier > (avant.badges[b.cle] || 0)) { gagnes.push(b.nom); blocB += `<div class="badge-fin">${dessinBadge(b)}<div>${nomBadge(b, palier)}<small>${b.cond}</small></div></div>`; }
    }
  }
  const proche = badgeProche();
  if (proche && !gagnes.includes(proche.b.nom)) blocB += `<p class="vide">Prochain : « ${proche.b.nom} », ${Math.min(proche.b.mesure(), proche.seuil)} / ${proche.seuil}${proche.b.unite || ""}</p>`;
  if (!blocB) blocB = `<p class="vide">Les badges se gagnent en jouant : régularité, familles, territoires…</p>`;
  html += `<div class="trois-fin"><div class="bloc-fin"><h4>Espèces</h4>${blocE}</div>`
    + `<div class="bloc-fin"><h4>Familles</h4>${blocF}</div><div class="bloc-fin"><h4>Badges</h4>${blocB}</div></div>`;
  setTimeout(() => jouerSon(parfaite ? "parfaite" : "fin"), 250);   // étape 196 : le son de fin de partie ; étape 205 : un autre pour une partie sans faute
  // 3 bis) Étape 244 : le rappel des objectifs par famille (et ceux qui viennent d'être atteints)
  html += blocObjectifsFin();
  zone.innerHTML = html;
  const bouton = document.getElementById("reprendre-manquees");
  if (bouton) bouton.onclick = () => reprendreManquees(manquees, origine);
  afficherStats();                         // la pastille du haut suit le nouveau rang
}

// ---- La progression gagnée pendant la Rencontre (étape 38) ------------
// photoProgression note, pour les territoires et les familles en jeu :
//   • combien d'espèces du territoire sont identifiées
//   • combien de réponses de chaque famille sont trouvées, et son rang
// On la prend une fois au départ (session.avant), une fois à la fin :
// la différence entre les deux, c'est ce que la Rencontre a rapporté.
function photoProgression(territoires, classes) {
  const photo = {};
  for (const t of territoires) {
    photo[t] = { identifiees: progresDe(t).identifiees, total: progresDe(t).total, familles: {} };
    for (const cle of classes) {
      const especes = especesDe(t).filter(e => e.onglet === cle);
      if (especes.length) photo[t].familles[cle] = progresFamille(especes);
    }
  }
  return photo;
}

// Une jauge en deux morceaux : ce qui était déjà acquis (couleur du territoire) + le gain (vert)
function dessinJaugeGain(avant, gain, total) {
  const pc = n => (total ? 100 * n / total : 0) + "%";
  return `<div class="jauge-gain"><i style="width:${pc(avant)}"></i>`
       + (gain > 0 ? `<i class="gain" style="width:${pc(gain)}"></i>` : "") + `</div>`;
}


// Étape R101 (Revoir 10, « Où est passée la dernière question ? ») : le score d'une Rencontre compte les questions
// NUMÉROTÉES (« Question 3 / 4 ») ; les questions ratées reposées à la fin (« À revoir ») et la question bonus
// ont leur propre case. Avant, le total mélangeait tout (« 3 / 5 » pour 4 questions numérotées).
function casesRencontre(s) {
  if (s.bonnesNumerotees === undefined) return [[`${s.bonnes} / ${s.total}`, "bonnes réponses"]];   // (ancienne Rencontre en cours)
  const cases = [[`${s.bonnesNumerotees} / ${Math.max(s.numerotees, s.bonnesNumerotees)}`, "bonnes réponses"]];
  if (s.reprisesPosees) cases.push([`${s.reprisesJustes} / ${s.reprisesPosees}`, `au 2e essai`]);
  if (s.bonusPose) cases.push([s.bonusJuste ? "✓" : "✗", s.bonusJuste ? "bonus réussi" : "bonus manqué"]);
  return cases;
}

// Fin de session : écran dédié, puis Rejouer / Encyclopédie (étape 8)
let rencontreDuJour = null;                               // étape 212 : la Rencontre lancée depuis « Espèce du jour »
function terminerSession() {
  arreterCri();                                          // étape R176 : l'écran de fin ne garde pas le cri de la dernière question
  const s = session;
  session = null;
  if (s) s.duJour = !!rencontreDuJour;                     // étape R187 : la fin de la Rencontre du jour a sa propre suite
  if (rencontreDuJour) {
    if (!suivi.duJour || suivi.duJour.date !== aujourdhui()) suivi.duJour = { date: aujourdhui(), faites: [] };
    if (!suivi.duJour.faites.includes(rencontreDuJour)) {
      suivi.duJour.faites.push(rencontreDuJour);
      // Étape R183c : la première Rencontre du jour avec l'espèce du jour rapporte 2 empreintes, dans le territoire actif
      //   s'il l'abrite, sinon dans le premier territoire ouvert où elle vit (aucun défi ne la compte : pas de double gain)
      const e = typeof especeParNom === "function" ? especeParNom(rencontreDuJour) : null;
      const ouverts = typeof territoiresOuverts === "function" ? territoiresOuverts() : [];
      const ici = e ? territoiresJeu(e) : [], ta = territoireActif();
      const t = ici.includes(ta) ? ta : ici.find(x => ouverts.includes(x)) || ta;
      if (t && typeof ajouterEmpreinteBonus === "function" && typeof GAIN_ESPECE_DU_JOUR !== "undefined") {
        ajouterEmpreinteBonus(t, GAIN_ESPECE_DU_JOUR);
        setTimeout(() => afficherBulle(`✓ Espèce du jour rencontrée · +${GAIN_ESPECE_DU_JOUR} empreintes`), 900);
        if (typeof verifierOuverture === "function") setTimeout(verifierOuverture, 1600);
      }
    }
    rencontreDuJour = null;
  }
  statsDe("rencontre").parties++;                          // étape 92 : une Rencontre de plus
  // Le score, juste sous le titre (retiré à l'étape 38, remis ensuite à la demande)
  document.getElementById("recap-session").textContent =
    `${s.bonnes} / ${s.total} bonnes réponses`;
  sauvegarder();
  afficherStats();
  afficherFicheSession(s);                                  // la fiche de l'espèce (étape 74)
  // Étape 97 : le carnet remplace les jauges et les trois listes (afficherProgresSession / afficherBilan restent dans le fichier)
  const origine = { ecran: "session", jeu: "rencontre", s, journal: s.bilan, avant: s.photoAvant,
                    cases: casesRencontre(s), rattrapees: 0, reprises: 0 };
  afficherCarnetFin("carnet-fin-session", { journal: s.bilan, avant: s.photoAvant, cases: origine.cases, manquees: s.manquees, origine,
                    parfaite: s.total > 0 && s.bonnes === s.total && !(s.manquees || []).length });   // étape 205
  document.getElementById("choix-longueur").classList.add("cache");
  document.getElementById("carte-rencontre").classList.add("cache");
  document.getElementById("fin-session").classList.remove("cache");
  if (s.expedition) finRencontreExpedition(s); else finRencontreOrdinaire(s);   // étape 288 (R187 : avec la partie)
  if (typeof finRencontreOrdinateur === "function") finRencontreOrdinateur(s);   // étape R162 : sur ordinateur, la fin tient dans l'écran
  if (typeof resumeSessionTelephone === "function") resumeSessionTelephone(s);   // étape M16 : sur téléphone, la fin d'une Rencontre tient sur un écran
}


// ==================================================================
// 11 bis. LE MODE DÉFI (étape 33)
//    Quatre jeux, sur les territoires et les familles choisis. Depuis l'étape 55,
//    ils sont ouverts dès le départ et chacun a son rôle :
//      Rapidité            → réviser (60 secondes, sur ce qui a déjà été trouvé)
//      Duo · Carré · Cash  → apprendre (des caractéristiques nouvelles, sans débloquer l'espèce)
//      Qui est-ce ?        → réviser et apprendre (espèces déjà identifiées ; les indices lus entrent dans les fiches)
//      Plus ou moins       → apprendre (les chiffres comparés entrent dans les fiches)
//    Un défi rapporte un score, des étoiles, un record ; ce qui y est trouvé compte dans les fiches.
// ==================================================================
const DUREE_DEFI     = 60;                   // en secondes (30, puis 90 à l'essai ; fixé à 60 à l'étape 35)
const MINIMUM_RAPIDITE = 6;                  // Rapidité est une révision : il faut au moins tant de réponses à réviser
const MINIMUM_INDICES  = 6;                  // Qui est-ce ? : il faut au moins tant d'espèces identifiées (un plateau complet)
// Étape 73 : Qui est-ce ? reste grisé tant que le joueur n'a pas découvert assez d'espèces, en tout.
// 15 = les 12 espèces offertes au départ ne suffisent pas : il faut en avoir découvert quelques-unes soi-même.
const DECOUVERTES_POUR_INDICES = 15;
function manqueAvantIndices() {
  return Math.max(0, DECOUVERTES_POUR_INDICES - ESPECES.filter(estIdentifiee).length);
}
const SEUILS_ETOILES = [1000, 1800, 2600];   // points pour 1, 2, 3 étoiles en 60 secondes (à régler après quelques parties)
const XP_PAR_ETOILE  = 20;                   // gagnés une seule fois, la première fois qu'une étoile est obtenue
// Les XP d'un défi (étape 41). Trois ingrédients :
//   1. chaque bonne réponse rapporte XP_DEFI_BONNE
//   2. plus un petit bonus de rapidité, jusqu'à XP_DEFI_RAPIDITE, qui fond en 5 secondes
//      (la vitesse compte, mais peu : au mieux +20 %)
//   3. le total est augmenté de BONUS_PAR_ESPECE pour chaque espèce découverte dans le jeu :
//      20 espèces découvertes = +20 %. Découvrir de nouvelles espèces rend donc les défis plus généreux.
// Un défi mené au bout rapporte toujours au moins XP_DEFI_MINIMUM.
const XP_DEFI_BONNE = 15, XP_DEFI_RAPIDITE = 3, XP_DEFI_MINIMUM = 30, BONUS_PAR_ESPECE = 0.01;

// Le multiplicateur du moment : 1 + 1 % par espèce découverte (1,20 pour 20 espèces)
function multiplicateurDecouvertes() {
  return 1 + BONUS_PAR_ESPECE * ESPECES.filter(estReconnue).length;
}

// Les XP d'un défi terminé (ou quitté en route) : on applique le multiplicateur, puis le minimum
function xpDuDefi(d) {
  const multiplicateur = multiplicateurDecouvertes();
  const total = Math.max(XP_DEFI_MINIMUM, Math.round((d.xpBase + d.xpRapidite) * multiplicateur));
  return { total, multiplicateur };
}
// Le score d'une bonne réponse : 100 points
//   + jusqu'à 50 points de rapidité, qui fondent en 5 secondes
//   + 10 points par bonne réponse d'affilée déjà faite, plafonné à 50
const POINTS_BASE = 100, POINTS_RAPIDITE = 50, SECONDES_RAPIDITE = 5, POINTS_SERIE = 10, PLAFOND_SERIE = 50;

const MANCHES_INDICES  = 5;                              // nombre d'espèces à retrouver dans un Qui est-ce ?
const NB_INDICES       = 5;                              // indices par espèce : 5 points au premier, 1 point au dernier
const PHOTOS_PLATEAU   = 6;                              // nombre de photos proposées pour chaque espèce à retrouver
// Étape 166 (demande du 13/10) : le Duel n'a plus de nombre de duels fixé. Les duels s'enchaînent sans fin,
//   avec 3 vies : chaque erreur en coûte une, la partie s'arrête quand il n'en reste plus.
const VIES_DUEL        = 3;
const ECART_MINIMUM    = 1.15;                           // deux chiffres trop proches (moins de 15 % d'écart) ne font pas un duel
// Étape 152 (retour du testeur) : la difficulté monte avec la série. Trois crans, selon l'écart entre les deux chiffres :
//   cran 0 = écart net (l'un vaut au moins 3 fois l'autre), cran 1 = serré (de 1,6 à 3 fois), cran 2 = très serré (moins de 1,6 fois).
//   Tous les 3 duels gagnés d'affilée, on monte d'un cran ; une erreur fait reculer d'un cran (pas de retour au début).
const CRANS_DUEL       = [{ min: 3, max: Infinity, nom: "écarts nets" }, { min: 1.6, max: 3, nom: "écarts serrés" },
                          { min: ECART_MINIMUM, max: 1.6, nom: "écarts très serrés" }];
const DUELS_PAR_CRAN   = 3;                              // bonnes réponses d'affilée pour monter d'un cran
// Étape 167 (demande du 13/10) : LA SÉRIE DU DUEL, SIMPLIFIÉE. Juste un compteur de bonnes réponses d'affilée,
//   qui repart de zéro à la moindre erreur. Certains nombres sont des paliers, fêtés par une animation :
//   3, 5, 10, 15, 20, puis toutes les 10 (30, 40…). Plus de multiplicateur : une bonne réponse = 1 point.
//   (Les noms et multiplicateurs de l'étape 165 sont retirés.) La difficulté monte toujours avec la série (crans de l'étape 152).
const PALIERS_SERIE    = [3, 5, 10, 15, 20];              // au-delà de 20 : toutes les 10 bonnes réponses
const MOTS_PALIER      = { 3: "Bien parti", 5: "Ça chauffe", 10: "Impressionnant", 15: "Œil de lynx", 20: "Vue d'aigle" };
const XP_POINT_PLUS    = 12;                             // XP par point marqué
const XP_POINT_INDICES = 12;                             // XP par point marqué (25 points au mieux)
// Pour chaque jeu : son nom, une précision, le mot du compteur, sa règle en une phrase,
// et les points à atteindre pour 1, 2 et 3 étoiles (à régler après quelques parties).
// Étape 72 : trois jeux. Rapidité (remplacé par le chronomètre) et Duo · Carré · Cash sont retirés
// de la liste ; leur code reste plus bas, au cas où on voudrait les remettre.
// Pour chaque jeu, deux façons de jouer :
//   sans chronomètre → detail, aide, seuils         (un nombre fixe de questions, de duels ou d'espèces)
//   avec chronomètre → duree, aideChrono, seuilsChrono (on joue jusqu'à la fin du temps)
// La Rencontre sans chronomètre n'a ni score ni étoiles : c'est la Rencontre habituelle.
const QUESTIONS_RENCONTRE = 10;                          // l'ancienne Rencontre (5 espèces), gardée de côté
const MANCHES_SURPRISE = 8;                              // Tous azimuts (étape 80) : manches par partie
const QUESTIONS_REVISION = 10;                           // Révision (étape 79) : questions sans chronomètre (longueur par défaut)
const LONGUEURS_CLASSIQUE = [10, 20, 30];               // Classique (étape 87) : les longueurs proposées
const ESPECES_PORTRAIT = 5;                              // Portrait (étape 78) : espèces par partie
const MANCHES_RANGEMENT = 4;                             // Rangement (étape 78) : manches par partie
const QUESTIONS_FOCUS = 8;                               // Rencontre à une espèce (étape 74) : questions au plus, photo comprise
const JEUX = {
  rencontre: { nom: "Rencontre", detail: "une espèce",
               aide: `Une espèce, tirée au hasard, à découvrir en profondeur : la reconnaître sur sa photo, puis jusqu'à ${QUESTIONS_FOCUS} questions sur elle. `
                   + `Une erreur est expliquée, et la question revient un peu plus tard.`,
               seuilsChrono: SEUILS_ETOILES,
               aideChrono: `${DUREE_DEFI} secondes : le plus de bonnes réponses possible. Plus la réponse est rapide, plus elle rapporte de points.` },
  indices:   { nom: "Espèce mystère",   // nom choisi le 10/10 (avant : Qui est-ce ?)
             detail: `${MANCHES_INDICES} espèces`, unite: "Espèce", seuils: [10, 16, 21],
               aide: `${MANCHES_INDICES} espèces à retrouver, parmi celles déjà identifiées. À chaque fois, ${PHOTOS_PLATEAU} photos sont proposées : chaque indice `
                   + `permet d'en écarter. Moins il faut d'indices, plus l'espèce rapporte (de 5 points à 1 point).`,
               duree: 90, seuilsChrono: [8, 15, 22],
               aideChrono: `90 secondes pour retrouver le plus d'espèces possible, avec le moins d'indices possible.` },
  // Étape 86 : la Révision devient le jeu « Classique » (la clé interne reste "revision", pour garder les sauvegardes).
  // Des questions variées sur plusieurs espèces : découvrir, apprendre et réviser. La case « Révisions uniquement »
  // le ramène à l'ancienne Révision (seulement ce qui a déjà été trouvé).
  revision:  { nom: "Sortie nature",   // étape 263 (avant : « Jouer »)
               // étape 197 : « Jouer » (avant : Carnet de terrain, choisi le 10/10 ; avant encore : Classique)
             detail: `${QUESTIONS_REVISION} questions`, unite: "Question", seuils: [6, 8, 10],
               aide: `Des questions variées sur les espèces choisies : en découvrir de nouvelles, apprendre leurs caractéristiques `
                   + `et réviser ce qui est déjà trouvé. Une erreur est expliquée, et la question revient un peu plus tard. `
                   + `Photos à reconnaître, questions et cris des animaux.`,
               aideRevision: `Des questions uniquement sur ce qui a déjà été trouvé, pour s'en souvenir. `
                   + `Les réponses encore fragiles et les questions ratées reviennent en priorité.`,
               seuilsChrono: SEUILS_ETOILES,
               aideChrono: `${DUREE_DEFI} secondes de questions variées : le plus de bonnes réponses possible. Plus la réponse est rapide, plus elle rapporte de points.`,
               aideChronoRevision: `${DUREE_DEFI} secondes pour réviser ce qui a déjà été trouvé : le plus de bonnes réponses possible.`,
               // Étape 133 : « Photos uniquement »
               aidePhotos: `Une photo, quatre noms : reconnaître les espèces choisies, rien d'autre. `
                   + `Quelques espèces encore inconnues se glissent dans la partie. Une erreur est expliquée, et la photo revient un peu plus tard.`,
               aidePhotosRevision: `Une photo, quatre noms : uniquement les espèces déjà identifiées, pour ne plus les confondre.`,
               aideChronoPhotos: `${DUREE_DEFI} secondes de photos à reconnaître : le plus de bonnes réponses possible. Plus la réponse est rapide, plus elle rapporte de points.` },
  // Étape R167 (08/11, choix d'Aubin) : « Compléter le carnet » — ce que les expéditions n'abordent pas (Approfondir ne garde
  // que ce qui ne se voit pas). Le moteur est celui de « Jouer » (clé "revision", options jouer + carnet) ; cette entrée
  // sert au nom, à la page Jeux et au compteur de parties.
  carnet:    { nom: "Compléter le carnet", detail: `${QUESTIONS_REVISION} questions`, unite: "Question", seuils: [6, 8, 10],
               aide: `${QUESTIONS_REVISION} questions sur ce que vous ne savez pas encore des espèces déjà rencontrées : leur allure, leur vie, leurs mesures… `
                   + `Les espèces que vous connaissez le moins passent d'abord. Une erreur est expliquée, et la question revient un peu plus tard.`,
               seuilsChrono: SEUILS_ETOILES, aideChrono: "" },
  portrait:  { nom: "Portrait-robot",   // nom choisi le 10/10
             detail: `${ESPECES_PORTRAIT} espèces`, unite: "Espèce", seuils: [12, 18, 23],
               aide: `${ESPECES_PORTRAIT} espèces déjà découvertes, sans leur photo : retrouver leur portrait, trait par trait, parmi les dessins proposés. `
                   + `La photo apparaît à la validation ; chaque trait juste rapporte 1 point et entre dans la fiche.`,
               duree: 90, seuilsChrono: [8, 15, 22],
               aideChrono: `90 secondes pour reconstituer le plus de portraits possible.` },
  rangement: { nom: "Lesquels ?",   // étape 153 : remplace le Rangement (la clé reste "rangement")
             detail: `${MANCHES_RANGEMENT} manches`, unite: "Manche", seuils: [14, 19, 23],
               aide: `${MANCHES_RANGEMENT} manches : six espèces déjà découvertes et une question (« Lesquels sont carnivores ? »). `
                   + `Sélectionnez toutes celles qui conviennent, puis validez. Chaque espèce bien jugée rapporte 1 point ; celles trouvées entrent dans leur fiche.`,
               duree: 90, seuilsChrono: [10, 18, 26],
               aideChrono: `90 secondes de questions « Lesquels sont… ? », à la suite.` },
  plus:      { nom: "Duel",   // nom choisi le 10/10 (avant : Plus ou moins)
             detail: `${VIES_DUEL} vies`, unite: "Duel", seuils: [10, 20, 35],   // étape 167 : 1 point par bonne réponse (avant : 15 / 35 / 60)
               aide: `Des duels sans fin, et ${VIES_DUEL} vies : deux espèces, une question (« Lequel vit le plus longtemps ? »). Chaque bonne réponse `
                   + `fait entrer les deux chiffres dans les fiches. Le compteur de série grandit à chaque bonne réponse d'affilée `
                   + `(et les chiffres se rapprochent) ; une erreur coûte une vie et remet la série à zéro.`,
               seuilsChrono: [12, 21, 30],
               aideChrono: `${DUREE_DEFI} secondes de duels, à la suite. Tous les 3 duels gagnés d'affilée, un palier : les points comptent double, triple, puis quadruple.` },
  surprise:  { nom: "Tous azimuts", detail: `${MANCHES_SURPRISE} manches`, unite: "Manche", seuils: [8, 14, 20],
               aide: `${MANCHES_SURPRISE} manches tirées au hasard parmi les autres jeux : une question de Rencontre, une révision, un portrait, `
                   + `un duel, une Espèce mystère… Pour jouer sans avoir à choisir.`,
               duree: 90, seuilsChrono: [8, 14, 20],
               aideChrono: `90 secondes de manches variées, à la suite.` },
};
let jeuChoisi = "rencontre";                 // le jeu sélectionné dans l'écran Jouer
const JEUX_PRINCIPAUX = ["rencontre", "revision"];   // la première rangée de l'écran Jouer (étape 86)
// Étape 91 : l'ordre des tuiles est fixe (Qui est-ce ? en avant-dernier), et chaque jeu a une phrase courte
// pour sa tuile et un picto (dessin à traits fins, 24 × 24, tracé en SVG comme les autres pictos du jeu).
// Étape 100 (J1) : plus que deux jeux. Les autres restent dans JEUX (leur code sert aux types de question du Carnet).
// Étape 139 (retour du testeur) : les petits jeux reviennent comme « modes de jeu alternatifs »
// Étape 172 (13/10) : « Lesquels ? » (clé "rangement") est retiré des jeux ; son code reste plus bas, inutilisé.
const ORDRE_JEUX = ["rencontre", "revision", "plus", "indices", "portrait"];
const COURT_JEUX = { rencontre: "Une espèce, à découvrir en profondeur.",
                     revision: "Des questions variées : découvrir, apprendre, réviser." };
const PICTOS = {
  rencontre: '<circle cx="7" cy="15" r="4"/><circle cx="17" cy="15" r="4"/><path d="M4.5 12 L7 5.5 h3 l1 6.5 M19.5 12 L17 5.5 h-3 l-1 6.5 M11 14.5 h2"/>',   // jumelles
  revision:  '<path d="M5 4.5 h11 a2 2 0 0 1 2 2 v13.5 H7 a2 2 0 0 1 -2 -2 Z"/><path d="M5 18 a2 2 0 0 1 2 -2 h11"/><path d="M9 8.5 h6 M9 11.5 h4"/>',   // carnet
  indices:   '<circle cx="10.5" cy="10.5" r="5.5"/><path d="M14.7 14.7 L20 20"/>',                                                    // loupe
  carnet:    '<path d="M4 5.5 c2.5-1 5-1 8 1 c3-2 5.5-2 8-1 v13 c-2.5-1-5-1-8 1 c-3-2-5.5-2-8-1 Z"/><path d="M12 6.5 v13"/><path d="M15 10.5 h3 M16.5 9 v3"/>',   // étape R167 : carnet ouvert et un « + »
  portrait:  '<rect x="5" y="3.5" width="14" height="17" rx="2"/><circle cx="12" cy="10" r="2.8"/><path d="M7.5 17.5 c1-2.8 3-4 4.5-4 s3.5 1.2 4.5 4"/>',   // cadre
  rangement: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/><path d="M15.5 7 l1.3 1.3 2.2-2.6 M5.5 17 l1.3 1.3 2.2-2.6"/>',   // étape 153 : quatre cases, deux cochées
  plus:      '<path d="M12 4 v15.5 M8 19.5 h8 M5 7 h14"/><path d="M5 7 l-2.5 6 h5 Z M19 7 l-2.5 6 h5 Z"/>',                         // balance
  surprise:  '<circle cx="12" cy="12" r="8.5"/><path d="M14.8 9.2 L13 13 L9.2 14.8 L11 11 Z"/><path d="M12 3.5 v1.5 M12 19 v1.5 M3.5 12 h1.5 M19 12 h1.5"/>',   // boussole
  questions: '<path d="M9.5 7 h10 M9.5 12 h10 M9.5 17 h10"/><circle cx="5.2" cy="7" r=".9"/><circle cx="5.2" cy="12" r=".9"/><circle cx="5.2" cy="17" r=".9"/>',
  chrono:    '<circle cx="12" cy="13.5" r="7"/><path d="M12 13.5 V9.8 M10 3.5 h4 M12 3.5 v3 M17.8 7.3 l1.5-1.5"/>',
  promeneur: '<path d="M9 21 l2-6 -3-3 2-6 4 2 2 4 3 1"/><circle cx="12.5" cy="3.6" r="1.6"/><path d="M8 12 l-3 3 M13 15 l1 6"/>',
  randonneur:'<path d="M5 21 L9.5 3"/><path d="M12 20 l1.5-5.5 -2.5-3 2-5 3.5 2 1.5 3.5 2.5 1"/><circle cx="15.6" cy="3.6" r="1.5"/>',
  naturaliste:'<path d="M5 4.5 h11 a2 2 0 0 1 2 2 v13.5 H7 a2 2 0 0 1 -2 -2 Z"/><path d="M5 18 a2 2 0 0 1 2 -2 h11"/><path d="M9.5 11.5 c0-3 2-4.5 4.5-4.5 0 2.6-1.6 4.5-4.5 4.5 Z M9.5 11.5 l2.5-2.5"/>',
  erudit:    '<path d="M12 3 v18 M12 7 c-3-3-7-2-8 0 3 0 5 1 8 3 M12 7 c3-3 7-2 8 0 -3 0-5 1-8 3 M12 13 c-3-2.5-6-2-7 0 2.5 0 4.5 1 7 2.5 M12 13 c3-2.5 6-2 7 0 -2.5 0-4.5 1-7 2.5"/>',
  son:       '<path d="M4 9.5 h3.5 L12 5.5 v13 L7.5 14.5 H4 Z"/><path d="M15.5 9 a4 4 0 0 1 0 6 M18 6.5 a7.5 7.5 0 0 1 0 11"/>',   // haut-parleur
  classique: '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.6 a2.5 2.5 0 1 1 3.4 2.3 c-.7.3-1 .8-1 1.5 v.6"/><circle cx="12" cy="16.6" r=".7"/>',   // étape 132 : un point d'interrogation
  photo:     '<rect x="3.5" y="7" width="17" height="12" rx="2"/><path d="M8.5 7 l1.5 -2.5 h4 l1.5 2.5"/><circle cx="12" cy="13" r="3.3"/>',   // étape 133 : appareil photo
  reviser:   '<path d="M19 12 a7 7 0 1 1 -2.05 -4.95"/><path d="M19.2 4.3 v3.6 h-3.6"/>',
  montagne:  '<path d="M3 19 L9.5 8.5 l3.5 5.5 2-3 6 8 Z"/><path d="M8 11 l1.5 1.2 1.3 -1"/>',
  etoile:    '<path d="M12 4 l2.4 5 5.4 .6 -4 3.7 1.1 5.3 -4.9 -2.8 -4.9 2.8 1.1 -5.3 -4 -3.7 5.4 -.6 Z"/>',
};
const picto = cle => `<svg class="picto" viewBox="0 0 24 24" aria-hidden="true">${PICTOS[cle]}</svg>`;
let avecChrono = false;                      // l'interrupteur du chronomètre (étape 72)
let revisionsSeules = false;                 // la case « Révisions uniquement » du Classique (étape 86)
// Étape 94 : les questions de cri dans le Classique. De base : oui sans chronomètre, non avec
// (écouter un cri prend du temps). Changer le chronomètre remet ce réglage à sa valeur de base.
let crisClassique = true;
let optionsOuvertes = false;                 // étape 139 : les réglages du Carnet, repliés par défaut
const PICTO_OPTIONS = '<svg class="picto" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg>';
let photosSeules = false;                    // étape 133 : « Photos uniquement » — la partie ne demande que de reconnaître les espèces sur photo
const MINIMUM_PHOTOS = 4;                    // en « Révisions uniquement », il faut au moins tant d'espèces identifiées
let questionsSimples = true;                 // étape 132 : les questions classiques dans le Carnet (décochées = seulement les types cochés)
let questionsClassique = QUESTIONS_REVISION; // le nombre de questions choisi pour le Classique (étape 87)
// ---- Étape 100 (J1) : le Carnet de terrain, jeu principal ----
// Il ne reste que deux jeux : la Rencontre et le Carnet de terrain. Les anciens petits jeux deviennent des
// « types de question » du Carnet : quand ils sont cochés, une de leurs manches se glisse de temps en temps
// parmi les questions (un portrait, un rangement, un duel, une espèce mystère). Une manche compte pour une question.
//   PART_AUTRES_TYPES = la chance qu'une question soit remplacée par une de ces manches (jamais deux à la suite).
//   Avec le chronomètre, seulement des questions simples : ces manches prennent trop de temps.
const TYPES_CARNET = ["portrait", "plus", "indices"];                    // étape 172 : sans « Lesquels ? »
const typesCarnet = { portrait: true, plus: true, indices: true };   // de base : tous cochés
// Étape 92 : les statistiques de chaque jeu, pour repérer ses jeux les plus prolifiques.
//   statsJeux = { revision: { parties: 5, decouvertes: 6 }, portrait: {...}, ... }
//   parties     = parties menées jusqu'au bout ;
//   decouvertes = espèces reconnues pour la PREMIÈRE fois pendant ce jeu.
let statsJeux = {};
// ---- Étape 97 : le CARNET et le RANG DE NATURALISTE ----
// Le carnet = toutes les cases des fiches (la reconnaissance sur photo + chaque caractéristique).
// « Lignes écrites » = cases trouvées au moins une fois. Le pourcentage d'un territoire = lignes écrites / toutes ses cases.
// On garde en mémoire la liste des cases de chaque espèce (elle ne change pas pendant le jeu) : le calcul reste rapide.
const CASES_CARNET = new Map();
function casesCarnet(espece) {
  if (!CASES_CARNET.has(espece.nom_courant)) {
    avecCriQuandMeme = true;                          // le cri compte toujours, son activé ou non : le total ne bouge pas
    CASES_CARNET.set(espece.nom_courant, champsDe(espece));
    avecCriQuandMeme = false;
  }
  return CASES_CARNET.get(espece.nom_courant);
}
// Étape 274 (« Revoir 4 » : « 0 % après 4 ou 5 parties, c'est déconcertant ») : le pourcentage de « nature connue »
// est désormais la moyenne, espèce par espèce, de ce qu'on en connaît : la RECONNAÎTRE sur sa photo vaut la moitié
// de l'espèce, ses caractéristiques trouvées l'autre moitié. (Avant : toutes les cases comptaient pareil, la photo
// pesait 1 case sur 23 environ ; 30 espèces reconnues donnaient 0 %.) 100 % = toujours tout le carnet rempli.
// « trouvees » et « total » (les cases) ne changent pas : ils servent aux rangs.
function carnetDe(especes) {
  let trouvees = 0, total = 0, somme = 0;
  for (const e of especes) {
    const cases = casesCarnet(e);
    const faites = cases.filter(c => nbBonnes(e, c) >= 1);
    total += cases.length;
    trouvees += faites.length;
    const avecPhoto = cases.includes(IDENTIFICATION);
    const traits = cases.length - (avecPhoto ? 1 : 0);
    const traitsFaits = faites.length - (avecPhoto && faites.includes(IDENTIFICATION) ? 1 : 0);
    const partTraits = traits ? traitsFaits / traits : 1;
    somme += avecPhoto ? 0.5 * (faites.includes(IDENTIFICATION) ? 1 : 0) + 0.5 * (traits ? partTraits : faites.length) : (traits ? partTraits : 0);
  }
  const exact = especes.length ? 100 * somme / especes.length : 0;
  const pct = trouvees === total && total ? 100 : Math.floor(exact);
  return { trouvees, total, pct, pctTexte: pourcentTexte(exact, pct, trouvees > 0) };
}
// Sous 10 %, le pourcentage s'écrit avec une décimale (« 1,4 »), et jamais « 0 » dès qu'une case est trouvée.
function pourcentTexte(exact, pct, quelqueChose) {
  if (!quelqueChose) return "0";
  if (exact >= 10) return String(pct);
  return String(Math.max(0.1, Math.floor(exact * 10) / 10)).replace(".", ",");
}
// Étape PR2 (01/11/2026, choix de l'utilisateur « Le carnet grossit ») : le rang global, pour toute la France,
// d'après le nombre d'espèces du carnet. Ses mots ne servent nulle part ailleurs (le territoire a Promeneur → Gardien,
// les familles Curieux → Spécialiste). Un rang obtenu ne se perd jamais (rangCarnet, gardé dans la sauvegarde).
// Avant l'étape PR2 : Promeneur, Randonneur, Observateur, Naturaliste, Expert, Érudit, d'après les « lignes écrites ».
const RANGS_NATURALISTE = [
  { nom: "Premières pages",       seuil: 0,      picto: "promeneur" },
  { nom: "Petit carnet",          seuil: 25,     picto: "randonneur" },
  { nom: "Carnet bien rempli",    seuil: 100,    picto: "rencontre" },
  { nom: "Grand carnet",          seuil: 250,    picto: "naturaliste" },
  { nom: "Encyclopédie vivante",  seuil: 500,    picto: "indices" },
  { nom: "Myriade",               seuil: "tout", picto: "erudit" },   // toutes les espèces du jeu
];
let rangAtteint = null;                               // le rang le plus haut obtenu (rang n°) ; null = pas encore calculé
function seuilRang(i) { const s = RANGS_NATURALISTE[i].seuil; return s === "tout" ? ESPECES.length : Math.min(s, ESPECES.length); }
function especesAuCarnet() { return ESPECES.filter(estReconnue).length; }
function lignesEcrites() { return especesAuCarnet(); }   // étape PR2 : le rang compte les espèces du carnet
function rangCalcule(n = especesAuCarnet()) {
  let i = 0;
  while (i + 1 < RANGS_NATURALISTE.length && n >= seuilRang(i + 1)) i++;
  return i;
}
// Le rang affiché : le plus haut entre le rang calculé et celui déjà obtenu
function rangActuel() {
  const calcule = rangCalcule();
  if (typeof toutDebloque === "function" && toutDebloque()) return Math.max(calcule, rangAtteint || 0);   // étape PR6 : affiché, pas gardé
  if (rangAtteint === null || calcule > rangAtteint) rangAtteint = calcule;
  return rangAtteint;
}
// Étape PR2 : la ligne du rang global (Profil, détail du carnet) : nom, jauge, prochain rang
function infoRangCarnet() {
  const i = rangActuel(), n = especesAuCarnet(), suivant = RANGS_NATURALISTE[i + 1];
  const bas = seuilRang(i), haut = suivant ? seuilRang(i + 1) : n;
  return { i, nom: RANGS_NATURALISTE[i].nom, n, suivant: suivant ? { nom: suivant.nom, seuil: haut } : null,
           part: suivant ? Math.max(0, Math.min(1, (n - bas) / Math.max(1, haut - bas))) : 1 };
}
function dessinTampon(i, classe = "") {
  return `<span class="tampon ${classe}">${picto(RANGS_NATURALISTE[i].picto)}</span>`;
}
function statsDe(cle) { return statsJeux[cle] || (statsJeux[cle] = { parties: 0, decouvertes: 0 }); }
// Le jeu en cours : Tous azimuts compte pour lui-même, même quand sa manche emprunte un autre jeu
function jeuEnCours() { return defi ? (defi.origine ? defi.origine.jeu : defi.jeu) : session ? "rencontre" : null; }
// Le nom de rangement d'un record : le jeu, puis le périmètre ("plus:Alpes|Mammiferes").
// Avec le chronomètre, un record à part, précédé de "chrono:" ("chrono:plus:Alpes|Mammiferes").
// (Les anciens records de Rapidité, sans ":", restent dans la sauvegarde mais ne servent plus.)
// Étape 87 : le Classique en 20 ou 30 questions a son propre record (10 questions garde l'ancien, sans suffixe)
// Étape 133 : « Photos uniquement » a son propre record (suffixe ":photos")
function cleRecord(jeu, cle, chrono, longueur, photos) {
  const suffixe = (jeu === "revision" && !chrono && longueur && longueur !== QUESTIONS_REVISION) ? ":" + longueur : "";
  return (chrono ? "chrono:" : "") + jeu + ":" + cle + suffixe + (jeu === "revision" && photos ? ":photos" : "")
       + (jeu === "plus" && !chrono ? ":vies" : "");   // étape 166 : les anciens records sur 12 duels restent de côté
}
// Les seuils d'étoiles de la partie : ceux du chronomètre ou ceux du jeu sans chronomètre
function seuilsDe(jeu, chrono, longueur) {
  if (chrono) return JEUX[jeu].seuilsChrono;
  // Classique plus long : les seuils grandissent dans la même proportion (6/8/10 → 12/16/20 → 18/24/30)
  if (jeu === "revision" && longueur) return JEUX[jeu].seuils.map(x => Math.round(x * longueur / QUESTIONS_REVISION));
  return JEUX[jeu].seuils;
}

// Ce qui est choisi dans l'écran des défis (étape 47). null = "pas encore choisi" :
// au premier affichage, tout ce qui est ouvert est coché, comme pour la Rencontre.
let territoiresDefi = null;
let famillesDefi = null;
// La petite coche dessinée en haut à droite d'une tuile que l'on peut choisir
const COCHE = `<span class="coche"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 8.3 L7 10.7 L11.5 5.6"/></svg></span>`;

// Trois étoiles : dorées pour celles qui sont gagnées
function dessinEtoiles(nombre) {
  let texte = "";
  for (let i = 1; i <= 3; i++) texte += `<span class="${i <= nombre ? "gagnee" : ""}">★</span>`;
  return `<span class="etoiles">${texte}</span>`;
}

// Le dessin d'un anneau de famille (le même que sur l'accueil), pour les tuiles de défi
function dessinAnneau(cle, f) {
  const tour = 2 * Math.PI * 20;
  const arc = f.trouvees > 0
    ? `<circle class="arc" cx="26" cy="26" r="20" stroke-dasharray="${tour * f.part} ${tour}" transform="rotate(-90 26 26)"/>` : "";
  return `<svg viewBox="0 0 52 52" aria-hidden="true"><circle class="fond" cx="26" cy="26" r="20"/>${arc}
            <g class="silhouette" transform="translate(13.5 13.5) scale(0.52)">${SILHOUETTES[cle] || ""}</g></svg>`;
}

// ---- Le défi qui correspond à un choix de territoires et de familles (étape 47) ----
// Son nom de rangement (pour le record) garde la forme d'avant quand c'est possible :
//   "Alpes|Mammiferes"            une famille, un territoire
//   "Alpes|Mammiferes+Oiseaux"    plusieurs familles : un record à part
//   "Alpes|*"                     toutes les familles du territoire
//   "*|Mammiferes"                tous les territoires
// Rend null s'il n'y a rien à jouer.
let memoTousTerritoires = null;          // étape 258 : calculé une seule fois (la liste des espèces ne change pas)
function tousLesTerritoires() { return (memoTousTerritoires || (memoTousTerritoires = [...new Set(ESPECES.flatMap(territoiresJeu))])).slice(); }
// ==================================================================
// Étape 209 (18/10) : LA DÉCOUVERTE DES TERRITOIRES — simple et jamais bloquante.
//   Un nouveau joueur commence avec SON territoire. Toutes les 20 espèces identifiées par lui-même
//   (les 12 espèces offertes au départ ne comptent pas), le territoire le plus proche s'ouvre, avec une fête.
//   Le palier s'adapte : 10 % des espèces déjà ouvertes, entre 5 et 20 (un petit territoire s'ouvre plus vite).
//   territoiresOuvertsListe = null : tout est ouvert (anciennes parties, ou « tout ouvrir » dans Options).
// ==================================================================
var territoiresOuvertsListe = null;
function territoiresOuverts() {
  const tous = tousLesTerritoires();
  if (!territoiresOuvertsListe) return tous;
  const o = tous.filter(t => territoiresOuvertsListe.includes(t));
  return o.length ? o : tous;
}
function territoiresFermes() { return tousLesTerritoires().filter(t => !territoiresOuverts().includes(t)); }
// Étape 210 (18/10) : « Découvrez des espèces ou apprenez à les connaître pour ouvrir d'autres territoires. »
//   1 point par espèce identifiée par le joueur (sans les espèces offertes au départ, ni celles sans photo)
//   + 1 point par médaille gagnée (bronze, argent, or : chacune compte).
// Étape 282 : l'ouverture des territoires compte les EMPREINTES (17_expeditions.js), plus les espèces et médailles.
function especesComptees() {
  if (typeof CHAPITRES !== "undefined" && typeof estLieu === "function") return lieuxTermines();   // étape PR4 : les lieux terminés
  if (typeof empreintesTotal === "function") return empreintesTotal();
  const decouvertes = ESPECES.filter(e => estRenseigne(e.photo) && estIdentifiee(e) && !(progression[e.nom_courant] || {}).offerte).length;
  const medailles = ESPECES.reduce((n, e) => n + niveauTermine(e), 0);
  return decouvertes + medailles + ((typeof suivi !== "undefined" && suivi && suivi.pointsBonus) || 0);   // étape 281 : + les points des défis du jour
}
// Étape PR4 (01/11/2026, choix de l'utilisateur) : un territoire s'ouvre tous les LIEUX_PAR_TERRITOIRE lieux terminés
//   (toutes ses expéditions + sa finale « Tout est lié »), dans les territoires ouverts. Cela pousse à approfondir un territoire
//   avant d'en ouvrir un autre. (Avant : 24 empreintes par territoire ouvert, étape PR1.)
const LIEUX_PAR_TERRITOIRE = 2;
// Étape R152 (07/11/2026, choix d'Aubin « A ») : le PREMIER voyage s'ouvre dès le premier lieu terminé (avant : 2 lieux,
// soit 2 h 30 à 3 h de jeu dans un territoire où tout est nouveau) ; ensuite, toujours un nouveau tous les 2 lieux.
// Lieux terminés pour avoir n + 1 territoires ouverts : 1, 3, 5, 7…
const PREMIER_VOYAGE = 1;
function lieuxPourOuvrir(n) { return n <= 0 ? 0 : PREMIER_VOYAGE + LIEUX_PAR_TERRITOIRE * (n - 1); }
function lieuTermine(t, c) { return chapitreFini(t, c) && (finaleFaite(t, c.nom) || !finaleDisponible(t, c)); }
function lieuxTermines() {
  if (typeof CHAPITRES === "undefined" || typeof estLieu !== "function") return 0;
  const ouverts = territoiresOuverts();
  return CHAPITRES.filter(c => estLieu(c) && ouverts.includes(c.territoire) && lieuTermine(c.territoire, c)).length;
}
const PHRASE_OUVERTURE = `Terminez des lieux (expéditions et finale) pour ouvrir d'autres territoires : le premier dès votre premier lieu terminé, puis un nouveau tous les ${LIEUX_PAR_TERRITOIRE} lieux.`;   // étapes PR4, R152
const texteManque = m => `${m} lieu${m > 1 ? "x" : ""} à terminer`;
function palierOuverture() {
  if (typeof LIEUX_PAR_TERRITOIRE !== "undefined" && typeof CHAPITRES !== "undefined")   // étape PR4 ; R152 : 1 pour le premier voyage
    return territoiresOuverts().length <= 1 ? PREMIER_VOYAGE : LIEUX_PAR_TERRITOIRE;
  const n = ESPECES.filter(e => estDans(e, territoiresOuverts())).length;
  return Math.max(5, Math.min(20, Math.round(n * 0.1)));   // étape 214 : retour à 20 points (2 espèces nouvelles par partie depuis l'étape 212)
}
// Combien d'espèces manquent avant le prochain territoire (null : plus rien à ouvrir)
function avantProchainTerritoire() {
  if (!territoiresFermes().length) return null;
  if (typeof LIEUX_PAR_TERRITOIRE !== "undefined" && typeof CHAPITRES !== "undefined" && typeof estLieu === "function")   // étape R152
    return Math.max(0, lieuxPourOuvrir(territoiresOuverts().length) - lieuxTermines());
  return Math.max(0, palierOuverture() * territoiresOuverts().length - especesComptees());
}
// Le centre approximatif d'un territoire sur la carte (moyenne des points de son contour)
function pointsTerritoire(nom) {
  const t = typeof CARTE_TERRITOIRES !== "undefined" ? CARTE_TERRITOIRES.find(x => x.nom === nom) : null;
  if (!t) return null;
  const pts = []; let x = 0, y = 0;
  for (const m of t.contour.matchAll(/([MLml])([^MLmlZz]*)/g)) {
    const n = m[2].trim().split(/[\s,]+|(?=-)/).filter(Boolean).map(Number);
    for (let i = 0; i + 1 < n.length; i += 2) {
      if (m[1] === "M" || m[1] === "L" || (m[1] === "m" && i === 0 && !pts.length)) { x = n[i]; y = n[i + 1]; } else { x += n[i]; y += n[i + 1]; }
      pts.push([x, y]);
    }
  }
  return pts.length ? pts : null;
}
function centreTerritoire(nom) {
  const pts = pointsTerritoire(nom);
  if (!pts) return null;
  return [pts.reduce((a, p) => a + p[0], 0) / pts.length, pts.reduce((a, p) => a + p[1], 0) / pts.length];
}
function cadreTerritoire(nom) {        // la fenêtre de dessin autour d'un seul territoire (pour la fête)
  const pts = pointsTerritoire(nom);
  if (!pts) return CARTE_CADRE;
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const x0 = Math.min(...xs), y0 = Math.min(...ys), w = Math.max(...xs) - x0, h = Math.max(...ys) - y0, c = Math.max(w, h) * 1.12;
  return `${x0 + w / 2 - c / 2} ${y0 + h / 2 - c / 2} ${c} ${c}`;
}
// Étape PR4 (choix de l'utilisateur) : le territoire suivant est celui qui partage la plus petite PART de ses espèces avec les
//   territoires déjà ouverts : beaucoup de découvertes au début, davantage de révision à la fin. À égalité : le plus proche.
let memoProchain = null;
function prochainTerritoire() {
  const fermes = territoiresFermes();
  if (!fermes.length) return undefined;
  const cle = territoiresOuverts().join("|");
  if (memoProchain && memoProchain.cle === cle) return memoProchain.t;
  const connues = new Set(ESPECES.filter(e => estDans(e, territoiresOuverts())).map(e => e.nom_courant));
  const part = t => { const l = especesDe(t); return l.length ? l.filter(e => connues.has(e.nom_courant)).length / l.length : 1; };
  const ouverts = territoiresOuverts().map(centreTerritoire).filter(Boolean);
  const dist = t => { const c = centreTerritoire(t); return c && ouverts.length ? Math.min(...ouverts.map(o => Math.hypot(o[0] - c[0], o[1] - c[1]))) : 0; };
  const t = fermes.map(t => ({ t, p: part(t), d: dist(t) })).sort((a, b) => (a.p - b.p) || (a.d - b.d))[0].t;
  memoProchain = { cle, t };
  return t;
}
function verifierOuverture() {
  if (typeof verifierMedaillesLieux === "function" && typeof territoiresOuverts === "function")   // étape R133 : médailles des lieux
    for (const t of territoiresOuverts()) verifierMedaillesLieux(t);
  if (!territoiresOuvertsListe || avantProchainTerritoire() !== 0) return;
  const t = prochainTerritoire();
  if (!t) return;
  territoiresOuvertsListe = territoiresOuverts().concat(t);
  sauvegarder();                                         // étape 252 : il ne rejoint plus le terrain (un territoire à la fois) ; on peut partir l'explorer
  const nb = especesDe(t).filter(e => !estIdentifiee(e)).length, couleur = TERRITOIRES[t] ? TERRITOIRES[t].couleur : "#7a736a";
  const forme = typeof CARTE_TERRITOIRES !== "undefined" ? CARTE_TERRITOIRES.find(x => x.nom === t) : null;
  const visuel = forme ? `<div class="fete-visuel rang" style="color:${couleur}"><svg viewBox="${cadreTerritoire(t)}" style="width:64px;height:64px">`
    + `<path d="${forme.contour}" fill="${couleur}" stroke="${couleur}" stroke-width="6" fill-rule="evenodd"/></svg></div>` : "";
  feter({ etiquette: "Nouveau territoire", titre: t, detail: `${nb} espèces nouvelles à découvrir. Vous pouvez partir l'explorer depuis l'accueil.`,
          son: "badge", visuel, pop: { couleur, image: "", etiquette: "Nouveau territoire", titre: t, detail: `${nb} espèces nouvelles à découvrir` } });
  setTimeout(verifierOuverture, 500);                    // (au cas où un second palier serait déjà atteint)
}
function famillesDe(territoires) {
  return Object.keys(CLASSES).filter(cle => ESPECES.some(e => e.onglet === cle && estDans(e, territoires)));
}
function construireDefi(territoires, familles) {
  const tous = territoiresOuverts();                                   // étape 209 : seulement les territoires ouverts
  const T = tous.filter(t => territoires.includes(t));                 // dans l'ordre habituel, sans intrus
  const presentes = famillesDe(T);
  const F = presentes.filter(cle => familles.includes(cle));
  if (T.length === 0 || F.length === 0) return null;
  const dansT = ESPECES.filter(e => estDans(e, T));
  const partout = T.length > 1 && T.length === tous.length;
  const toutes = F.length === presentes.length;
  const lieu = T.length === 1 ? T[0] : partout ? "tous territoires" : T.join(" + ");
  const noms = F.map(cle => CLASSES[cle].nom);
  return {
    cle: (T.length === 1 ? T[0] : partout ? "*" : T.join("+")) + "|" + (toutes ? "*" : F.join("+")),
    nom: toutes ? `${lieu} · toutes familles` : `${F.length > 3 ? F.length + " familles" : noms.join(" + ")} · ${lieu}`,
    especes: dansT.filter(e => F.includes(e.onglet)),
    ouvert: true,                // plus de rang exigé (étape 55) : tout défi qui a des espèces est jouable
  };
}

// Retrouver un défi à partir de son nom de rangement (pour "Rejouer ce défi")
function retrouverDefi(cle) {
  const [lieu, familles] = cle.split("|");                             // "Alpes|Mammiferes+Oiseaux" → "Alpes" et "Mammiferes+Oiseaux"
  const T = lieu === "*" ? tousLesTerritoires() : lieu.split("+");
  const d = construireDefi(T, familles === "*" ? famillesDe(T) : familles.split("+"));
  return d && d.ouvert ? d : null;
}


// Selon l'onglet ouvert : l'écran Rencontre habituel ou la liste des défis
// ---- Chaque jeu est-il possible avec les cases cochées ? (étape 59) ----
// Rend { possible: true } ou { possible: false, raison: "encore 4 espèces à identifier" }.
// Sans aucune famille cochée, on ne grise rien : il n'y a encore rien à juger.
// Étape 258 : Espèce mystère et Portrait-robot demandent un long calcul (jusqu'à 1 s) : le résultat est gardé
// tant que rien n'a bougé (même choix d'espèces, même carnet, même expérience).
const memoPossibilite = new Map();
function possibiliteJeu(jeu, choisi) {
  if (!choisi || (jeu !== "indices" && jeu !== "portrait")) return possibiliteJeuCalcul(jeu, choisi);
  const cle = `${jeu}|${choisi.cle}|${choisi.especes.length}|${xp}|${Object.keys(progression).length}|${accesTout()}`;   // étape 274 : + accès à tout
  if (!memoPossibilite.has(cle)) { if (memoPossibilite.size > 50) memoPossibilite.clear(); memoPossibilite.set(cle, possibiliteJeuCalcul(jeu, choisi)); }
  return memoPossibilite.get(cle);
}
function possibiliteJeuCalcul(jeu, choisi) {
  if (!choisi) return { possible: true };
  const especes = choisi.especes;
  // La Rencontre est toujours possible dès qu'il y a des espèces : c'est le jeu de base
  if (jeu === "rencontre") return especes.length ? { possible: true } : { possible: false, raison: "aucune espèce ici" };
  const pluriel = (n, mot) => `${n} ${mot}${n > 1 ? "s" : ""}`;
  if (jeu === "indices") {
    const manqueTotal = accesTout() ? 0 : manqueAvantIndices();   // étape 274 : pas de seuil dans « Plus de jeux »
    if (manqueTotal > 0) return { possible: false, raison: `encore ${pluriel(manqueTotal, "espèce")} à découvrir` };
    // Étape 258 : il suffit d'UNE espèce à faire deviner (avant : on les cherchait toutes, jusqu'à 1 s de calcul)
    const montrables = especesPlateau(especes);
    if (montrables.length >= MINIMUM_INDICES && montrables.some(e => indicesPossibles(e).length >= 2)) return { possible: true };
    const manque = MINIMUM_INDICES - especesPlateau(especes).length;
    return { possible: false, raison: manque > 0 ? `encore ${pluriel(manque, "espèce")} à identifier` : "pas assez d'indices" };
  }
  if (jeu === "plus")  return duelsPossibles(especes, true).length ? { possible: true } : { possible: false, raison: "pas assez d'espèces ici" };
  if (jeu === "carnet") {                                 // étape R167
    if (!especes.some(e => estIdentifiee(e) && estRenseigne(e.photo))) return { possible: false, raison: "aucune espèce rencontrée ici pour l'instant" };
    return resteCarnet(especes) ? { possible: true } : { possible: false, raison: "vous savez déjà tout de ces espèces" };
  }   // étape 207 : on s'arrête au premier duel trouvé
  if (jeu === "revision" && !revisionsSeules) {
    // Le Classique ouvert : il suffit d'espèces avec une photo (on peut toujours en découvrir) (étape 86)
    return especes.some(e => estRenseigne(e.photo)) ? { possible: true } : { possible: false, raison: "aucune espèce ici" };
  }
  if (jeu === "revision") {
    const manque = MINIMUM_RAPIDITE - casesDuDefi(especes, "revision").length;
    return manque > 0 ? { possible: false, raison: `encore ${pluriel(manque, "réponse")} à trouver` } : { possible: true };
  }
  if (jeu === "portrait")  return ciblesPortrait(especes).length ? { possible: true } : { possible: false, raison: "aucune espèce découverte ici" };
  return { possible: true };
}

// L'ordre des tuiles de jeu : les jeux possibles d'abord, dans leur ordre habituel, puis les autres.
// Il est calculé une seule fois, à l'ouverture de l'écran : une tuile ne change pas de place
// pendant qu'on coche des cases (elle se grise ou se dégrise seulement).
let ordreJeux = null;
function calculerOrdreJeux() {
  const choisi = construireDefi(territoiresDefi || tousLesTerritoires(), famillesDefi || famillesDe(tousLesTerritoires()));
  // Étape 91 : l'ordre est désormais fixe (ORDRE_JEUX) ; un jeu impossible reste à sa place, grisé.
  ordreJeux = ORDRE_JEUX.filter(c => JEUX[c]);
  // Le jeu sélectionné est impossible ? On prend le premier jeu possible.
  if (!possibiliteJeu(jeuChoisi, choisi).possible) jeuChoisi = ordreJeux.find(c => possibiliteJeu(c, choisi).possible) || ordreJeux[0];
}

// (étape 72 : afficherMode, qui choisissait entre l'écran Rencontre et l'écran Défis, n'existe plus :
//  il n'y a plus qu'un écran, l'écran Jouer)

// L'écran des défis (étape 47), bâti comme celui de la Rencontre :
// le jeu, les territoires, les familles en tuiles à anneau, puis les boutons.
// Étape 91 : la phrase sous une tuile grisée. Pour Qui est-ce ?, le nombre d'espèces qu'il reste à découvrir.
function conditionJeu(cle, etat) {
  const m = /encore (\d+) espèces? à découvrir/.exec(etat.raison || "");
  if (cle === "indices" && m) return `Découvrez au moins ${m[1]} espèce${m[1] > 1 ? "s" : ""} de plus pour y jouer.`;
  return majuscule(etat.raison || "pas encore possible") + ".";
}
// La longueur de la partie, telle qu'elle s'écrit sous le nom du jeu dans la note de droite
function longueurJeu(cle) {
  if (cle === "revision") return `${questionsClassique} questions`;
  if (cle === "rencontre") return `une espèce · jusqu'à ${QUESTIONS_FOCUS} questions`;
  return JEUX[cle].detail;
}

// ---- La carte de l'écran Jouer (étape 91) ----
// La même carte que sur l'accueil (territoires.js). Un territoire qui a des espèces se clique pour
// le choisir ou le retirer : en couleur pleine s'il est choisi, en couleur pâle sinon. Les autres sont gris.
function dessinerCarteChoix() {
  const carte = document.getElementById("carte-choix");
  const zone = carte.closest(".zone-carte");
  if (typeof CARTE_TERRITOIRES === "undefined") { zone.classList.add("sans-carte"); carte.classList.add("cache"); return; }
  carte.setAttribute("viewBox", CARTE_CADRE);
  // Étape 206 (maquette C1-B, 18/10) : la carte seule. Les territoires jouables sont « en relief »
  //   (bord blanc et ombre, dessinés par le filtre #relief-choix) : couleur pleine = choisi, couleur pâle = retiré.
  //   Les territoires à venir restent à plat, couleur papier. Le nom apparaît dans une bulle au survol.
  const pale = c => melangerCouleurs(c, "#f4efe6", 0.30);              // 30 % de la couleur, 70 % de papier
  const rang = t => especesDe(t.nom).length > 0 ? 1 : 0;              // les territoires jouables en dernier (par-dessus)
  let formes = `<defs><filter id="relief-choix" x="-10%" y="-10%" width="120%" height="125%">
      <feMorphology in="SourceAlpha" operator="dilate" radius="5" result="gros"/>
      <feGaussianBlur in="gros" stdDeviation="6" result="flou"/><feOffset in="flou" dy="6" result="ombre"/>
      <feComponentTransfer in="ombre" result="ombre2"><feFuncA type="linear" slope=".3"/></feComponentTransfer>
      <feFlood flood-color="#fff"/><feComposite in2="gros" operator="in" result="blanc"/>
      <feMerge><feMergeNode in="ombre2"/><feMergeNode in="blanc"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
  for (const t of CARTE_TERRITOIRES.slice().sort((a, b) => rang(a) - rang(b))) {
    formes += `<path class="lisere" d="${t.contour}"/>`;
    const nb = especesDe(t.nom).length;
    if (!nb) { formes += `<path class="a-venir" data-nom="${t.nom}" d="${t.contour}"/>`; continue; }
    if (!territoiresOuverts().includes(t.nom)) { formes += `<path class="a-venir ferme" data-nom="${t.nom}" data-ferme="1" d="${t.contour}"/>`; continue; }   // étape 209
    const couleur = TERRITOIRES[t.nom] ? TERRITOIRES[t.nom].couleur : "#7a736a";
    const choisi = territoiresDefi.includes(t.nom);
    const teinte = choisi ? couleur : pale(couleur);
    formes += `<path class="jouable${choisi ? " choisi" : ""}" data-territoire="${t.nom}" data-nom="${t.nom}" data-nb="${nb}" d="${t.contour}" style="fill:${teinte};stroke:${teinte}"/>`;
  }
  carte.innerHTML = formes;
  // La bulle du survol : le nom, puis le nombre d'espèces et ce que fait un clic
  const zoneBulle = carte.closest(".zone-carte");
  let bulle = zoneBulle.querySelector(".bulle-carte");
  if (!bulle) { bulle = document.createElement("div"); bulle.className = "bulle-carte"; zoneBulle.appendChild(bulle); }
  carte.onmousemove = ev => {
    const p = ev.target.closest && ev.target.closest("path[data-nom]");
    if (!p) { bulle.classList.remove("on"); return; }
    const nom = p.dataset.nom, choisi = territoiresDefi.includes(nom);
    bulle.innerHTML = p.dataset.territoire
      ? `${nom}<small>${p.dataset.nb} espèces · ${modeTerrain ? (choisi ? "vous êtes ici" : "cliquer pour partir ici") : (choisi ? "choisi — cliquer pour le retirer" : "cliquer pour l'ajouter")}</small>`   // étapes 252-253
      : p.dataset.ferme ? `${nom}<small>${(m => m === null ? "" : `s'ouvre dans ${texteManque(m)}`)(avantProchainTerritoire())}</small>`   // étape 209
      : `${nom}<small>à venir</small>`;
    const r = zoneBulle.getBoundingClientRect();
    bulle.style.left = (ev.clientX - r.left + 14) + "px"; bulle.style.top = (ev.clientY - r.top + 16) + "px";
    bulle.classList.add("on");
  };
  carte.onmouseleave = () => bulle.classList.remove("on");
  // Sous la carte : le résumé du choix
  const resume = document.getElementById("resume-carte");
  if (resume) {
    const nbEsp = ESPECES.filter(e => territoiresJeu(e).some(x => territoiresDefi.includes(x))).length;
    // Étape 252 : « Partir ailleurs » = un territoire ; étape 253 : « Plus de jeux » garde « tout choisir »
    resume.innerHTML = territoiresDefi.length
      ? `<b>${modeTerrain ? territoiresDefi.join(", ") : `${territoiresDefi.length} territoire${territoiresDefi.length > 1 ? "s" : ""}`}</b> · ${nombre(nbEsp)} espèces`
        + (!modeTerrain && territoiresDefi.length < territoiresOuverts().length ? ` · <button class="lien-tout" id="tout-territoires">tout choisir</button>` : "")
      : `<span class="aucun">Aucun territoire : sélectionnez-en un sur la carte.</span>`;
    const tout = document.getElementById("tout-territoires");
    if (tout) tout.onclick = () => { territoiresDefi = territoiresOuverts().slice(); afficherChoixDefi(); };
    // Étape 209 : jamais bloquant — on peut tout ouvrir d'un clic
    const manque = avantProchainTerritoire();
    if (manque !== null) {
      resume.insertAdjacentHTML("beforeend", `<br><small class="ouverture">${PHRASE_OUVERTURE}<br>Prochain territoire : encore ${texteManque(manque)} · tout débloquer : page À propos</small>`);   // étape PR4
    }
  }
  // Un clic sur un territoire jouable : on l'ajoute ou on le retire du choix, puis on redessine l'écran
  carte.onclick = ev => {
    const t = ev.target.dataset && ev.target.dataset.territoire;
    if (!t) return;
    if (modeTerrain) territoiresDefi = [t];              // étape 252 : « Partir ailleurs » = un seul territoire
    else territoiresDefi = territoiresDefi.includes(t) ? territoiresDefi.filter(x => x !== t) : territoiresDefi.concat(t);   // étape 253 : « Plus de jeux », choix libre
    afficherChoixDefi();
  };
  // La légende des couleurs (avec la couleur du premier territoire jouable)
  const premier = tousLesTerritoires()[0];
  const c = TERRITOIRES[premier] ? TERRITOIRES[premier].couleur : "#7a736a";
  document.getElementById("cles-carte").innerHTML =
    `<li><span class="pastille-cle" style="background:${c}"></span>choisi</li>`
    + `<li><span class="pastille-cle" style="background:${pale(c)}"></span>disponible</li>`
    + `<li><span class="pastille-cle" style="background:#c4b8a2"></span>à venir</li>`;
}

// L'écran Jouer (étapes 47, 72, 86, 87 ; refait en carnet à l'étape 91) :
// à gauche le jeu et la carte, à droite les familles, la note du jeu choisi, ses réglages et le bouton.
function afficherChoixDefi() {
  // Étape 72 : un seul choix de territoires et de familles pour tous les jeux.
  // À la première ouverture, on reprend celui gardé dans la sauvegarde.
  if (!territoiresDefi && territoiresChoisis) territoiresDefi = territoiresChoisis.slice();
  if (!famillesDefi && classesChoisies) famillesDefi = classesChoisies.slice();
  const tous = territoiresOuverts();                                   // étape 209
  if (!territoiresDefi) territoiresDefi = tous.slice();                  // première fois : tout coché
  territoiresDefi = territoiresDefi.filter(t => tous.includes(t));

  // ---- 1. Les tuiles de jeu : les deux grands en haut, les petits en dessous (ordre fixe) ----
  const zoneJeux = document.getElementById("choix-jeux");
  const zonePrincipaux = document.getElementById("choix-jeux-principaux");
  zoneJeux.innerHTML = "";
  zonePrincipaux.innerHTML = "";
  const choisiPourJeux = construireDefi(territoiresDefi, famillesDefi || famillesDe(tous));
  for (const cle of (ordreJeux || ORDRE_JEUX)) {
    const etat = possibiliteJeu(cle, choisiPourJeux);
    const grand = JEUX_PRINCIPAUX.includes(cle);
    const tuile = document.createElement("button");
    tuile.className = "tuile-jeu" + (grand ? " grand" : "") + (cle === jeuChoisi ? " actif" : "");
    tuile.disabled = !etat.possible;                                     // impossible pour l'instant : grisé (étape 59)
    tuile.innerHTML = grand
      ? `<span class="tete"><span class="rond">${picto(cle)}</span>${JEUX[cle].nom}</span>`
        + `<span class="court">${etat.possible ? COURT_JEUX[cle] : conditionJeu(cle, etat)}</span>`
      : `${picto(cle)}<span>${JEUX[cle].nom}</span>` + (etat.possible ? "" : `<small class="condition">${conditionJeu(cle, etat)}</small>`);
    if (!grand && !etat.possible) tuile.title = conditionJeu(cle, etat);   // étape 141 : la raison, au survol
    tuile.onclick = () => { jeuChoisi = cle; sauvegarder(); afficherChoixDefi(); };
    (grand ? zonePrincipaux : zoneJeux).appendChild(tuile);
  }

  // ---- 2. La carte et, à côté, les territoires choisis ----
  dessinerCarteChoix();
  // Étape 139 : un seul territoire ouvert → pas de carte, une simple étiquette, et un seul titre « Où et qui chercher ? »
  const unSeul = tous.length <= 1;
  document.getElementById("choix-defi").classList.remove("un-territoire");   // étape 212 (Revoir 2) : la carte est toujours là
  document.getElementById("titre-ou").innerHTML = `<span class="num">2</span>Où chercher ?`;
  const zoneT = document.getElementById("territoires-defi");
  zoneT.innerHTML = territoiresDefi.length
    ? territoiresDefi.map(t => {
        const nb = especesDe(t).length;
        return `<span class="etiquette-territoire">${picto("montagne")}${t}<small>${nb} espèce${nb > 1 ? "s" : ""}</small></span>`;
      }).join("")
    : `<span class="aucun">Aucun territoire choisi</span>`;

  // ---- 3. Les familles : une tuile à anneau par famille, dans les territoires choisis ----
  const dansT = ESPECES.filter(e => estDans(e, territoiresDefi));
  const familles = famillesDe(territoiresDefi).map(cle => {
    const especes = dansT.filter(e => e.onglet === cle);
    return { cle, especes, progres: progresFamille(especes) };
  });
  const ouvertes = familles.map(f => f.cle);
  if (!famillesDefi) famillesDefi = ouvertes.slice();                    // première fois : toutes
  // Une famille absente des territoires choisis ne peut pas rester choisie (sans territoire, on garde le choix en mémoire)
  if (territoiresDefi.length) famillesDefi = famillesDefi.filter(cle => ouvertes.includes(cle));

  // « Tout sélectionner » / « Tout désélectionner » : un simple lien à droite du titre
  const tout = document.getElementById("tout-defi");
  const toutes = ouvertes.length > 0 && famillesDefi.length === ouvertes.length;
  tout.textContent = toutes ? "Tout désélectionner" : "Tout sélectionner";
  tout.disabled = ouvertes.length === 0;
  tout.onclick = () => { famillesDefi = toutes ? [] : ouvertes.slice(); afficherChoixDefi(); };

  const grille = document.getElementById("tuiles-familles-defi");
  grille.innerHTML = "";
  for (const f of familles) {
    const choisie = famillesDefi.includes(f.cle);
    const reconnues = f.especes.filter(estReconnue).length;
    const bouton = document.createElement("button");
    bouton.className = "tuile-defi " + MEDAILLES[f.progres.palier] + (choisie ? " choisie" : "");
    bouton.setAttribute("aria-pressed", choisie);
    bouton.style.setProperty("--couleur-classe", CLASSES[f.cle].couleur);
    bouton.innerHTML = `${COCHE}${dessinAnneau(f.cle, f.progres)}<span class="nom-famille">${CLASSES[f.cle].nom}</span>`
      + (f.progres.palier ? `<small class="rang">${RANGS_FAMILLE[f.progres.palier]}</small>` : "")
      + `<small>${reconnues} / ${f.especes.length}</small>`;
    bouton.onclick = () => {
      famillesDefi = choisie ? famillesDefi.filter(c => c !== f.cle) : famillesDefi.concat(f.cle);
      afficherChoixDefi();
    };
    grille.appendChild(bouton);
  }

  // Le choix est gardé dans la sauvegarde, pour la prochaine visite (étape 72)
  territoiresChoisis = territoiresDefi.slice();
  if (!modeTerrain) classesChoisies = famillesDefi.slice();          // étape 253 : « Partir ailleurs » ne touche pas aux familles
  if (modeLibre) suivi.territoiresLibres = territoiresDefi.slice();  // étape 253 : le choix de « Plus de jeux », gardé à part
  sauvegarder();

  // ---- Votre partie : la note du jeu choisi ----
  const estClassique = jeuChoisi === "revision";
  const jeu = JEUX[jeuChoisi];
  document.getElementById("picto-note").innerHTML = picto(jeuChoisi);
  document.getElementById("nom-note").textContent = jeu.nom;
  document.getElementById("detail-note").textContent = longueurJeu(jeuChoisi);
  document.getElementById("aide-defi").innerHTML = estClassique && photosSeules   // étape 133
    ? (revisionsSeules ? jeu.aidePhotosRevision : jeu.aidePhotos)
    : estClassique && revisionsSeules
    ? jeu.aideRevision
    : jeu.aide;
  // Étape 92 : les statistiques du jeu — record (pour ce choix de territoires et de familles), parties jouées,
  // espèces découvertes avec ce jeu. La Rencontre n'a pas de score : pas de record.
  const choisi = construireDefi(territoiresDefi, famillesDefi);
  const record = choisi && jeuChoisi !== "rencontre" ? records[cleRecord(jeuChoisi, choisi.cle, false, questionsClassique, estClassique && photosSeules)] : null;
  const st = statsJeux[jeuChoisi] || { parties: 0, decouvertes: 0 };
  const pluriel = (n, mot) => `${mot}${n > 1 ? "s" : ""}`;
  const caseStat = (chiffre, texte, plus = "") => `<div class="stat-jeu"><b>${chiffre}</b><span>${texte}</span>${plus}</div>`;
  document.getElementById("stats-jeu").innerHTML = (!st.parties && !record)
    ? `<div class="stat-vide">${picto("etoile")}<span>Pas encore joué : à vous de commencer.</span></div>`
    : (jeuChoisi === "rencontre" ? "" : caseStat(record ? nombre(record.score) : "–", "record", dessinEtoiles(record ? record.etoiles : 0)))
      + caseStat(st.parties, `${pluriel(st.parties, "partie")} ${pluriel(st.parties, "jouée")}`)
      + caseStat(st.decouvertes, `${pluriel(st.decouvertes, "espèce")} ${pluriel(st.decouvertes, "découverte")} avec ce jeu`);

  // ---- Les réglages du Classique (étapes 86-87) ----
  // Étape 139 : repliés derrière le bouton « Options », qui en résume l'état
  const boutonOptions = document.getElementById("bouton-options");
  boutonOptions.classList.toggle("cache", !estClassique);
  const resume = [avecChrono ? "avec chronomètre" : `${questionsClassique} questions · sans chronomètre`];
  if (revisionsSeules) resume.push("révisions uniquement");
  resume.push(photosSeules ? "photos uniquement" : "questions variées");
  boutonOptions.innerHTML = `${PICTO_OPTIONS}<span>Options<small>${resume.join(" · ")}</small></span><span class="chevron">${optionsOuvertes ? "▴" : "▾"}</span>`;
  boutonOptions.onclick = () => { optionsOuvertes = !optionsOuvertes; afficherChoixDefi(); };
  document.getElementById("options-classique").classList.toggle("cache", !estClassique || !optionsOuvertes);
  document.getElementById("picto-questions").innerHTML = picto("questions");
  document.getElementById("picto-chrono").innerHTML = picto("chrono");
  document.getElementById("picto-revision").innerHTML = picto("reviser");
  document.getElementById("picto-cris").innerHTML = picto("son");
  // Le nombre de questions : avec le chronomètre, la partie dure un temps fixe, on cache ce choix.
  document.getElementById("choix-nombre").classList.toggle("cache", avecChrono);
  const segments = document.getElementById("segments-nombre");
  segments.innerHTML = "";
  for (const n of LONGUEURS_CLASSIQUE) {
    const b = document.createElement("button");
    b.className = n === questionsClassique ? "actif" : "";
    b.textContent = n;
    b.onclick = () => { questionsClassique = n; sauvegarder(); afficherChoixDefi(); };
    segments.appendChild(b);
  }
  const caseChrono = document.getElementById("case-chrono");
  caseChrono.checked = avecChrono;
  caseChrono.onchange = () => {
    avecChrono = caseChrono.checked;
    crisClassique = !avecChrono;                 // étape 94 : les cris reviennent à leur réglage de base
    calculerOrdreJeux(); sauvegarder(); afficherChoixDefi();
  };
  // Étape 132 : les questions classiques. Toujours là avec le chronomètre (la partie n'est faite que d'elles).
  // Étape 133 : « Photos uniquement ». Coché, les autres types de question sont grisés (leur réglage est gardé pour plus tard).
  document.getElementById("picto-photos").innerHTML = picto("photo");
  const casePhotos = document.getElementById("case-photos");
  casePhotos.checked = photosSeules;
  document.getElementById("texte-photos").innerHTML = "Photos uniquement<small>Reconnaître les espèces, rien d'autre</small>";
  casePhotos.onchange = () => { photosSeules = casePhotos.checked; sauvegarder(); afficherChoixDefi(); };
  const sansPhotos = "<small>Pas avec « Photos uniquement »</small>";
  document.getElementById("picto-simples").innerHTML = picto("classique");
  const caseSimples = document.getElementById("case-simples");
  caseSimples.checked = !photosSeules && (avecChrono || questionsSimples);
  caseSimples.disabled = avecChrono || photosSeules;
  document.getElementById("interrupteur-simples").classList.toggle("inactif", avecChrono || photosSeules);
  document.getElementById("texte-simples").innerHTML = "Questions classiques"
    + (photosSeules ? sansPhotos : avecChrono ? "<small>Toujours avec le chronomètre</small>" : "");
  caseSimples.onchange = () => { questionsSimples = caseSimples.checked; sauvegarder(); afficherChoixDefi(); };
  // Les cris sont des questions classiques : sans elles, pas de cris
  const crisPossibles = !photosSeules && (avecChrono || questionsSimples);
  const caseCris = document.getElementById("case-cris");
  caseCris.checked = crisClassique && !photosSeules;
  caseCris.disabled = !crisPossibles;
  document.getElementById("interrupteur-cris").classList.toggle("inactif", !crisPossibles);
  document.getElementById("texte-cris").innerHTML = "Cris des animaux"
    + (photosSeules ? sansPhotos : crisPossibles ? "" : "<small>Avec les questions classiques</small>");
  caseCris.onchange = () => { crisClassique = caseCris.checked; sauvegarder(); afficherChoixDefi(); };
  document.getElementById("texte-chrono").textContent =
    avecChrono ? `Chronomètre · ${dureeDuJeu(jeuChoisi)} secondes` : "Chronomètre";
  // Étape 100 (J1) : les quatre types de question, sous les cris. Un type impossible avec le choix en cours
  // (ou avec le chronomètre) est grisé, avec la raison en petit ; sa case garde sa position pour plus tard.
  const zoneTypes = document.getElementById("types-carnet");
  zoneTypes.innerHTML = "";
  for (const t of TYPES_CARNET) {
    const etat = photosSeules ? { possible: false, raison: "pas avec « Photos uniquement »" }
      : avecChrono ? { possible: false, raison: "pas avec le chronomètre" } : possibiliteJeu(t, choisi);
    const ligne = document.createElement("label");
    ligne.className = "interrupteur-chrono reglage" + (etat.possible ? "" : " inactif");
    ligne.innerHTML = `<span class="picto-reglage">${picto(t)}</span>`
      + `<span class="nom-type">${JEUX[t].nom}${etat.possible ? "" : `<small>${majuscule(etat.raison || "pas encore possible")}</small>`}</span>`
      + `<input type="checkbox"${typesCarnet[t] && !photosSeules ? " checked" : ""}${etat.possible ? "" : " disabled"}><span class="glissiere" aria-hidden="true"></span>`;
    ligne.querySelector("input").onchange = ev => { typesCarnet[t] = ev.target.checked; sauvegarder(); afficherChoixDefi(); };
    zoneTypes.appendChild(ligne);
  }
  const caseRevision = document.getElementById("case-revision");
  caseRevision.checked = revisionsSeules;
  caseRevision.onchange = () => { revisionsSeules = caseRevision.checked; calculerOrdreJeux(); sauvegarder(); afficherChoixDefi(); };

  // ---- En bas : le lieu, puis le bouton « Jouer » ----
  const n = choisi ? choisi.especes.length : 0;
  const nbF = famillesDefi.length;
  document.getElementById("resume-defi").innerHTML = !territoiresDefi.length ? "Choisir au moins un territoire sur la carte."
    : !choisi ? "Choisir au moins une famille."
    : `${picto("montagne")}<span>${territoiresDefi.join(", ")} · ${nbF === ouvertes.length ? "toutes les familles" : `${nbF} famille${nbF > 1 ? "s" : ""}`} · ${n} espèce${n > 1 ? "s" : ""}</span>`;
  const lancer = document.getElementById("lancer-defi");
  // Étape 132 : Carnet sans questions classiques → il faut au moins un type coché et possible ici
  const sansType = jeuChoisi === "revision" && choisi && !avecChrono && !questionsSimples && !photosSeules
    && !TYPES_CARNET.some(t => typesCarnet[t] && possibiliteJeu(t, choisi).possible);
  if (sansType) document.getElementById("resume-defi").innerHTML = "Choisir au moins un type de question.";
  // Étape 133 : « Photos uniquement » + « Révisions uniquement » → il faut assez d'espèces déjà identifiées ici
  const manquePhotos = (jeuChoisi === "revision" && choisi && photosSeules && revisionsSeules)
    ? MINIMUM_PHOTOS - choisi.especes.filter(e => estRenseigne(e.photo) && estIdentifiee(e)).length : 0;
  if (manquePhotos > 0) document.getElementById("resume-defi").innerHTML =
    `Encore ${manquePhotos} espèce${manquePhotos > 1 ? "s" : ""} à identifier ici pour réviser les photos.`;
  const possible = (jeuChoisi === "revision" && photosSeules)
    ? choisi && choisi.especes.some(e => estRenseigne(e.photo)) && manquePhotos <= 0
    : choisi && possibiliteJeu(jeuChoisi, choisi).possible;
  lancer.disabled = !choisi || sansType || !possible;    // grisé si le jeu est devenu impossible
  lancer.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5 L19 12 L8 18.5 Z"/></svg>Jouer`;
  lancer.onclick = () => demarrerDefi(choisi);
  // Étape 196 : le mode « terrain » — on ne choisit plus de jeu ici, seulement les territoires et les familles
  document.getElementById("choix-defi").classList.toggle("mode-terrain", modeTerrain);
  document.querySelector("#titre-ou .num").textContent = modeTerrain ? "1" : "2";
  document.getElementById("titre-ou").lastChild.textContent = modeTerrain ? "Où partir ?" : "Où chercher ?";   // étape 253
  document.querySelector("#titre-qui .num").textContent = modeTerrain ? "2" : "3";
  if (modeTerrain) {
    lancer.disabled = !choisi;
    lancer.textContent = "Partir ici";                   // étape 253
    lancer.onclick = () => { modeTerrain = false; terrainPerso = true; changerTerritoire(territoiresDefi[0]); montrer("accueil"); };   // étape 252
  }
}

// Les questions permises dans un défi (étape 55). On écarte toujours les empreintes et les cris.
//   Rapidité (réviser) : les cases DÉJÀ trouvées des espèces identifiées, plus celles qui
//     attendent dans les « Déjà croisée… » ; pas de chiffres (trop longs à lire en 60 secondes).
//   Duo · Carré · Cash (apprendre) : les caractéristiques des niveaux ouverts, trouvées ou non,
//     pour TOUTES les espèces, identifiées ou non (étape 56). La photo n'est demandée que pour
//     une espèce déjà identifiée : ici, la reconnaître ne la débloque pas.
//     Réponses courtes seulement, pour que le Cash reste possible.
function casesDuDefi(especes, jeu) {
  const cases = [];
  for (const espece of especes) {
    const identifiee = estIdentifiee(espece);
    const attend = champ => aRevoir.some(r => r.nom === espece.nom_courant && r.champ === champ);
    if (estRenseigne(espece.photo) && identifiee) cases.push({ espece, champ: IDENTIFICATION });
    if (!identifiee) continue;                                         // seulement les espèces identifiées
    const ouvert = niveauOuvert(espece);
    for (const q of questionsPossibles(espece)) {
      // empreintes et cris : jamais en défi (le portrait, si : étape 70) — sauf le cri dans un Classique qui le permet (étape 94)
      if (q.format && q.format !== "picto" && !(q.champ === "cri_son" && jeu === "revision" && defi && defi.cris)) continue;
      // Les chiffres sont trop longs à lire avec le chronomètre ; sans lui (Révision, étape 79), on les garde
      if (q.type === "nombre" && !(jeu === "revision" && defi)) continue;
      if (nbBonnes(espece, q.champ) >= 1 || attend(q.champ)) cases.push({ espece, champ: q.champ });
    }
  }
  return cases;
}

// Étape 138 : parmi des questions possibles ({ espece, champ }), garder celles qui ne reprennent ni l'espèce
// ni la caractéristique de la question précédente ; à défaut, au moins pas la même espèce ; à défaut, toutes.
function varier(liste) {
  const niEspeceNiChamp = liste.filter(x => x.espece !== derniereEspece && x.champ !== dernierChamp);
  if (niEspeceNiChamp.length) return niEspeceNiChamp;
  const pasMemeEspece = liste.filter(x => x.espece !== derniereEspece);
  return pasMemeEspece.length ? pasMemeEspece : liste;
}

// Choisir la question suivante d'un défi
function choisirQuestionDefi() {
  if (defi.file && defi.file.length) {                     // étape 98 : une question manquée à reprendre
    const m = varier(defi.file)[0];                        // étape 138 : pas la même espèce ni la même question qu'à l'instant
    defi.file = defi.file.filter(x => x !== m);
    return { espece: m.espece, champ: m.champ, estRevision: true };
  }
  if (defi.expedition) { const q = choisirQuestionExpedition(); if (q) return q; }   // étape 282
  if (defi.jeu === "revision" && defi.photos) return choisirQuestionPhoto();   // étape 133
  if (defi.jeu === "revision" && !defi.revisionsSeules) {
    const q = choisirQuestionClassique();
    if (q) return q;                                      // (sinon, rien à apprendre : on révise)
  }
  let cases = casesDuDefi(defi.especes, defi.jeu);
  if (defi.site) {                                        // étape 292 : au site remarquable, chaque espèce de la halte passe au moins une fois
    const vues = new Set((defi.posees || []).map(p => p.split("|")[0]));
    const reste = cases.filter(c => !vues.has(c.espece.nom_courant) && (c.champ !== "cri_son" || defi.cris));
    if (reste.length) cases = reste;
  }
  let choix;
  {
    // Révision (étape 79), comme l'ancienne Rapidité : d'abord les questions ratées qui attendent,
    // sinon le plus souvent une case encore fragile (trouvée une seule fois). Jamais deux fois la même dans une partie.
    defi.posees = defi.posees || [];
    if (!defi.cris) cases = cases.filter(c => c.champ !== "cri_son");   // pas de cri si la partie ne les permet pas (étapes 86, 94)
    const neuves = cases.filter(c => !defi.posees.includes(c.espece.nom_courant + "|" + c.champ)
      && !alimentApresRegime(c.espece, c.champ, x => defi.posees.includes(c.espece.nom_courant + "|" + x)));   // étape 262
    if (neuves.length) cases = neuves;
    cases = sansRepos(cases);                             // étape 150 : pas ce qui vient d'être trouvé
    const enAttente = cases.filter(c => aRevoir.some(r => r.nom === c.espece.nom_courant && r.champ === c.champ));
    if (enAttente.length && Math.random() < 0.5) cases = enAttente;
    let possibles = cases.filter(c => c.espece !== derniereEspece);
    if (possibles.length === 0) possibles = cases;
    const sansRepetition = possibles.filter(c => c.champ !== dernierChamp);
    if (sansRepetition.length) possibles = sansRepetition;
    const fragiles = possibles.filter(c => nbBonnes(c.espece, c.champ) < SEUIL_CONFIRME);   // étape 101 : pas encore confirmée
    if (fragiles.length && Math.random() < 0.7) possibles = fragiles;
    choix = auHasard(possibles);
    defi.posees.push(choix.espece.nom_courant + "|" + choix.champ);
  }
  return { espece: choix.espece, champ: choix.champ, estRevision: false };
}

// ---- « Photos uniquement » (étape 133) -----------------------------------
// Toutes les questions sont « Quelle est cette espèce ? » : une photo, quatre noms.
//   découvrir : les espèces inconnues glissées dans la partie (environ une question sur quatre,
//               et forcément avant la fin pour qu'aucune ne soit oubliée) ;
//   réviser   : les espèces déjà identifiées, en priorité celles ratées ou pas encore confirmées.
// Pas deux fois de suite la même espèce, et pas deux fois la même dans une partie tant qu'il en reste d'autres.
const PART_DECOUVRIR_PHOTO = 0.25;
function choisirQuestionPhoto() {
  defi.posees = defi.posees || [];
  const dejaPosee = e => defi.posees.includes(e.nom_courant + "|" + IDENTIFICATION);
  const garder = e => { defi.posees.push(e.nom_courant + "|" + IDENTIFICATION); return { espece: e, champ: IDENTIFICATION, estRevision: false }; };
  const aDecouvrir = defi.nouvelles.filter(e => !estIdentifiee(e) && !dejaPosee(e));
  const connues = defi.especes.filter(e => estRenseigne(e.photo) && estIdentifiee(e));
  const restantes = defi.total - defi.faites;              // Infinity avec le chronomètre
  if (aDecouvrir.length && (Math.random() < PART_DECOUVRIR_PHOTO || restantes <= aDecouvrir.length || !connues.length)) {
    return garder(auHasard(aDecouvrir));
  }
  let possibles = connues.filter(e => !dejaPosee(e));
  if (!possibles.length) possibles = connues;
  possibles = sansRepos(possibles, e => ({ espece: e, champ: IDENTIFICATION }));   // étape 150               // toutes déjà vues dans cette partie : on recommence
  if (!possibles.length) possibles = defi.especes.filter(e => estRenseigne(e.photo));   // sécurité
  const autres = possibles.filter(e => e !== derniereEspece);
  if (autres.length) possibles = autres;
  const ratees = possibles.filter(e => aRevoir.some(r => r.nom === e.nom_courant && r.champ === IDENTIFICATION));
  if (ratees.length && Math.random() < 0.5) possibles = ratees;
  const fragiles = possibles.filter(e => nbBonnes(e, IDENTIFICATION) < SEUIL_CONFIRME);
  if (fragiles.length && Math.random() < 0.7) possibles = fragiles;
  return garder(auHasard(possibles));
}

// ---- Le Classique (étape 86) --------------------------------------------
// Une question tirée parmi trois sortes, à peu près dans ces proportions :
//   découvrir (20 %) : reconnaître sur sa photo une des espèces inconnues glissées dans la partie ;
//   apprendre (45 %) : une caractéristique jamais trouvée d'une espèce déjà découverte ;
//   réviser   (35 %) : ce qui a déjà été trouvé, ou une question ratée qui attend.
// Si une sorte n'a rien à proposer, on passe à la suivante. Jamais deux fois la même question dans une partie.
// Pas de cris (il faudrait demander si le son est disponible) ; avec le chronomètre, pas de chiffres ni d'empreintes.
// Étape 274 (« Revoir 4 » : encore un peu trop de révisions) : apprendre passe de 45 à 62 % ; réviser, de 35 à 18 % environ.
const PART_DECOUVRIR = 0.20, PART_APPRENDRE = 0.62;
function questionClassique(q) {
  if (!q) return false;
  if (q.champ === "cri_son") return !!defi.cris;            // étape 94 : selon le réglage « Cris des animaux »
  return true;
}
function choisirQuestionClassique() {
  defi.posees = defi.posees || [];
  const dejaPosee = (e, c) => defi.posees.includes(e.nom_courant + "|" + c);
  const garder = choix => { defi.posees.push(choix.espece.nom_courant + "|" + choix.champ); return { espece: choix.espece, champ: choix.champ, estRevision: false }; };
  if (defi.carnet) return questionCarnet(dejaPosee, garder);   // étape R167 : « Compléter le carnet »
  // découvrir : les espèces glissées dans la partie et pas encore reconnues
  let aDecouvrir = defi.nouvelles.filter(e => !estIdentifiee(e) && !dejaPosee(e, IDENTIFICATION));
  // apprendre : les caractéristiques jamais trouvées des espèces découvertes (pas encore maîtrisées)
  let aApprendre = [];
  for (const e of defi.especes) {
    if (!estRenseigne(e.photo) || !estIdentifiee(e)) continue;
    for (const c of champsAInterroger(e)) {
      if (c === IDENTIFICATION || nbBonnes(e, c) > 0 || dejaPosee(e, c)) continue;
      if (alimentApresRegime(e, c, x => dejaPosee(e, x))) continue;   // étape 262
      if (questionClassique(QUESTIONS.find(q => q.champ === c))) aApprendre.push({ espece: e, champ: c });
    }
  }
  // Étape 172 : ce qui a été raté à la partie précédente attend une partie (s'il reste autre chose à demander)
  aDecouvrir = sansRepos(aDecouvrir, e => ({ espece: e, champ: IDENTIFICATION }));
  aApprendre = sansRepos(aApprendre);
  const tirage = Math.random();
  // Étape 138 : pas deux photos à reconnaître de suite, s'il y a autre chose à demander
  const photoJusteAvant = dernierChamp === IDENTIFICATION && aApprendre.length > 0;
  // Étape 212 : avec des places fixes, la découverte arrive à sa place (ou plus tard, si elle a été repoussée)
  const placeArrivee = defi.placesDecouverte && defi.placesDecouverte.length && defi.faites >= defi.placesDecouverte[0];
  if (aDecouvrir.length && (defi.placesDecouverte ? (placeArrivee || aApprendre.length === 0) : (!photoJusteAvant && (tirage < PART_DECOUVRIR || aApprendre.length === 0)))) {
    if (placeArrivee) defi.placesDecouverte.shift();
    return garder(auHasard(varier(aDecouvrir.map(e => ({ espece: e, champ: IDENTIFICATION })))));
  }
  // Étape 202 : une question sur trois environ vise une espèce à qui il manque 3 traits ou moins pour sa médaille.
  //   Garde-fous (pour que ce ne soient pas toujours les mêmes) : 3 questions au plus par espèce visée dans une partie,
  //   une seule espèce visée par partie, une espèce visée à la partie précédente laisse passer une partie, et l'espèce est tirée au hasard parmi les proches.
  // (une espèce déjà visée et pas encore médaillée est reprise dès que possible, pour finir sa médaille dans la même partie)
  const cibleOuverte = defi.jouer && defi.ciblees.some(n => { const e = ESPECES.find(z => z.nom_courant === n);
    const pm = e && prochaineMedaille(e); return pm && pm.manque > 0 && e !== derniereEspece && defi.ciblees.filter(x => x === n).length < 3; });
  if (defi.jouer && aApprendre.length && (cibleOuverte || Math.random() < 1 / 3)) {
    const dejaVisee = e => defi.ciblees.filter(n => n === e.nom_courant).length;
    const proches = aApprendre.filter(x => {
      const pm = prochaineMedaille(x.espece);
      return pm && pm.manque <= 3 && champsDuNiveau(x.espece, pm.niveau).includes(x.champ)
        && dejaVisee(x.espece) < 3 && !ciblesPartiePrecedente.includes(x.espece.nom_courant);
    });
    if (proches.length) {
      // une espèce déjà visée dans cette partie passe d'abord : on la mène jusqu'à sa médaille (3 questions au plus)
      const enCoursDeCible = proches.filter(x => defi.ciblees.includes(x.espece.nom_courant) && x.espece !== derniereEspece);
      // une seule espèce visée par partie : les autres questions restent variées
      if (!enCoursDeCible.length && defi.ciblees.length) return garder(auHasard(varier(aApprendre)));
      const espece = enCoursDeCible.length ? enCoursDeCible[0].espece : auHasard([...new Set(proches.map(x => x.espece))]);
      defi.ciblees.push(espece.nom_courant);
      return garder(auHasard(proches.filter(x => x.espece === espece)));
    }
  }
  if (aApprendre.length && tirage < PART_DECOUVRIR + PART_APPRENDRE) {
    // On tire d'abord l'espèce (sinon les fiches les plus longues sortiraient toujours), puis la caractéristique.
    // Étape 138 : ni la même espèce ni la même caractéristique que la question précédente.
    const varies = varier(aApprendre);
    const espece = auHasard([...new Set(varies.map(x => x.espece))]);
    return garder(auHasard(varies.filter(x => x.espece === espece)));
  }
  // réviser : la règle de l'ancienne Révision (partie plus bas) ; s'il n'y a rien à réviser, on apprend
  let aReviser = casesDuDefi(defi.especes, "revision").filter(c => !dejaPosee(c.espece, c.champ) && (c.champ === IDENTIFICATION || questionClassique(QUESTIONS.find(q => q.champ === c.champ))));
  // Étape 150 : si tout ce qu'il y aurait à réviser vient d'être trouvé et qu'il reste à apprendre, on apprend
  if (aApprendre.length && aReviser.every(c => auRepos(c.espece, c.champ))) aReviser = [];
  // Étape 138 : si réviser ferait reprendre la même caractéristique (souvent : photo après photo en début de jeu),
  // on apprend plutôt quelque chose de nouveau
  if (aReviser.length && (aReviser.some(c => c.champ !== dernierChamp) || !aApprendre.length)) return null;
  if (aApprendre.length) return garder(auHasard(varier(aApprendre)));                     // (étape 138 : varier)
  if (aDecouvrir.length) return garder(auHasard(varier(aDecouvrir.map(e => ({ espece: e, champ: IDENTIFICATION })))));
  return null;
}


// ---- Étape R167 : « Compléter le carnet » ----
// Seulement « apprendre » : une caractéristique jamais trouvée d'une espèce déjà rencontrée (pas de nouvelle espèce, pas de
// révision). Les espèces les moins connues d'abord : on tire parmi les 3 dont la fiche est la moins remplie.
function aDecouvrirCarnet(especes, dejaPosee = () => false) {
  const l = [];
  for (const e of especes) {
    if (!estRenseigne(e.photo) || !estIdentifiee(e)) continue;
    for (const c of champsAInterroger(e)) {
      if (c === IDENTIFICATION || nbBonnes(e, c) > 0 || dejaPosee(e, c)) continue;
      if (alimentApresRegime(e, c, x => dejaPosee(e, x))) continue;
      if (c === "cri_son" || questionClassique(QUESTIONS.find(q => q.champ === c))) l.push({ espece: e, champ: c });
    }
  }
  return l;
}
function resteCarnet(especes) {   // combien de choses restent à découvrir sur ces espèces (pour la page Jeux et le défi)
  return aDecouvrirCarnet(especes).length;
}
function questionCarnet(dejaPosee, garder) {
  let cases = sansRepos(aDecouvrirCarnet(defi.especes, dejaPosee));
  if (!defi.cris) cases = cases.filter(c => c.champ !== "cri_son");
  if (!cases.length) return null;                         // tout est connu : la partie finit en révisant
  const remplie = e => { const t = champsAInterroger(e).filter(c => c !== IDENTIFICATION); return t.length ? t.filter(c => nbBonnes(e, c) > 0).length / t.length : 1; };
  const varies = varier(cases);
  const parEspece = [...new Set(varies.map(x => x.espece))].sort((a, b) => remplie(a) - remplie(b));
  const espece = auHasard(parEspece.slice(0, 3));
  return garder(auHasard(varies.filter(x => x.espece === espece)));
}

// Le jeu choisi est-il chronométré ? (étape 72) Le chronomètre est un choix du joueur, valable pour tous les jeux.
function dureeDuJeu(jeu) { return JEUX[jeu].duree || DUREE_DEFI; }

function demarrerDefi(d, options = {}) {
  document.getElementById("je-ne-sais-pas").classList.add("cache");
  // La Rencontre sans chronomètre reste la Rencontre habituelle : 10 questions, ouvertes par l'Apparition (étape 72)
  if (jeuChoisi === "rencontre") {                     // (étape 87 : plus de Rencontre chronométrée)
    territoiresChoisis = d.especes.length ? [...new Set(d.especes.flatMap(territoiresJeu))].filter(t => !territoiresDefi || territoiresDefi.includes(t)) : territoiresDefi.slice();
    classesChoisies = [...new Set(d.especes.map(e => e.onglet))];
    sauvegarder();
    demarrerSession(QUESTIONS_RENCONTRE);
    return;
  }
  // Qui est-ce ? ne porte que sur des espèces identifiées : il en faut assez pour un plateau (étape 57)
  if (jeuChoisi === "indices" && ciblesIndices(d.especes).length === 0) {
    const manque = MINIMUM_INDICES - especesPlateau(d.especes).length;
    afficherBulle(manque > 0
      ? `Espèce mystère s'ouvre avec ${MINIMUM_INDICES} espèces identifiées dans ce choix : encore ${manque}`
      : "Pas assez d'indices sur ces espèces pour ce jeu");
    return;
  }
  // Plus ou moins a besoin d'au moins un duel possible entre deux espèces
  if (jeuChoisi === "plus" && duelsPossibles(d.especes).length === 0) {
    afficherBulle("Pas assez d'espèces dans ce choix pour ce jeu");
    return;
  }
  defi = { jeu: jeuChoisi,                                // "rencontre", "indices" ou "plus" (étape 72)
           chrono: false,                                 // plus de chronomètre (retiré le 18/10) ; gardé pour les records
           faites: 0, total: 0, numero: 1,                // sans chronomètre : l'avancement
           cle: d.cle, nom: d.nom, especes: d.especes, source: d,
           xpBase: 0, xpRapidite: 0,                      // les XP en cours de récolte (étape 41)
           bilan: [],                                     // le journal découvert / appris / confirmé (étape 55)
           score: 0, bonnes: 0, serie: 0, meilleureSerie: 0, rates: [], attente: null };
  defi.expedition = options.expedition || null;            // étape 282 : une étape d'expédition
  defi.site = options.site || null;                        // étape 292 : une halte du site remarquable, ou la sortie du jour
  defi.photoAvant = photoFin([...new Set(d.especes.flatMap(territoiresJeu))], territoireDeLaPartie(options));   // étape M20   // étape 97 : pour l'écran de fin
  if (!options.reprise && !d.reprise) noterPartie();   // étape 106 : le jour et l'heure de jeu (badges)
  session = null;
  preparerPostit();                                    // étape 151 : pas de post-it dans les autres jeux
  document.getElementById("fin-defi").classList.add("cache");
  document.getElementById("fin-session").classList.add("cache");
  document.getElementById("choix-longueur").classList.add("cache");
  document.getElementById("carte-rencontre").classList.remove("cache");
  document.getElementById("hud-defi").classList.remove("cache");
  // Les espèces inconnues glissées dans la partie (étape 73)
  if (options.file) {
    // Étape 98 : « Reprendre ces questions » — seulement les questions manquées, dans l'ordre, sans nouvelle espèce
    defi.file = options.file.slice();
    defi.reprise = true;
    defi.origine = options.origine || null;        // étape 99 : l'écran de fin où revenir
    defi.total = defi.file.length;
    defi.revisionsSeules = true;
    defi.cris = true;
    defi.nouvelles = [];
    defi.aDecouvrir = [];
    afficherHud();
    nouvelleRencontre();
    return;
  }
  if (defi.jeu === "revision") {
    // Classique (étape 86) : 10 questions (ou le chronomètre). Avec « Révisions uniquement », seulement ce qui
    // a déjà été trouvé ; sinon, 2 espèces inconnues à découvrir se glissent parmi les questions.
    defi.total = questionsClassique;                      // 10, 20 ou 30 questions (étape 87)
    defi.longueur = questionsClassique;
    defi.aDecouvrir = [];
    defi.revisionsSeules = revisionsSeules;
    defi.photos = photosSeules;                       // étape 133 : seulement des photos à reconnaître ?
    // Étape 140 : questions classiques toujours (photos comprises) ; cris toujours, sauf en « Photos uniquement ».
    // Le son sera demandé au premier cri de la partie (comme dans la Rencontre) : « Non » retire les cris de la partie.
    defi.simples = true;
    defi.cris = !defi.photos;
    if (defi.cris) { sonActif = true; sonDemande = false; }
    // Plus la partie est longue, plus il y a d'espèces à découvrir : 2 pour 10 questions, 4 pour 20, 6 pour 30
    // Étape 212 (Revoir 2) : 2 au plus, quelle que soit la longueur de la partie
    const nbNouvelles = NOUVELLES_PAR_PARTIE;
    defi.nouvelles = (revisionsSeules || !defi.simples) ? [] : especesADecouvrir(d.especes, nbNouvelles);   // sans questions classiques : rien à découvrir sur photo
    // Étape 212 : les découvertes arrivent à des places fixes (questions 3 et 8 sur 10), pour qu'elles aient toujours lieu
    defi.placesDecouverte = defi.total === Infinity ? null
      : defi.nouvelles.map((x, i) => Math.floor(defi.total * (i + 0.5) / defi.nouvelles.length));
    // Étape 100 (J1) : les types de question cochés (sans chronomètre seulement)
    defi.types = [];                                  // étape 140 : plus de types de question mêlés au Carnet
    // Étape 196 : la partie « Jouer » glisse 1 ou 2 manches de petit jeu (Duel, Portrait-robot) parmi ses questions
    defi.jouer = !!options.jouer;
    defi.carnet = !!options.carnet;                     // étape R167 : « Compléter le carnet » — pas d'espèce nouvelle glissée
    if (defi.carnet) { defi.nouvelles = []; defi.placesDecouverte = null; }
    if (defi.jouer) { ciblesPartiePrecedente = derniereCibles; defi.ciblees = []; derniereCibles = defi.ciblees; }   // étape 202
    defi.pastilles = [];
    // étape 203 (18/10) : plus de Portrait-robot dans « Jouer » (il reste dans Plus de jeux) ; seul le Duel s'y glisse
    // étape 212 (Revoir 2, 18/10) : plus de Duel non plus — « Jouer » ne pose que des questions classiques
    if (defi.expedition) {                                // étape 282 : pas d'espèce glissée en plus ; l'étape 1 découvre les siennes
      defi.nouvelles = defi.expedition.etape === 1 ? d.especes.filter(e => !estIdentifiee(e)) : [];
      defi.placesDecouverte = null;
    }
  } else if (defi.jeu === "plus") {
    defi.aDecouvrir = [];                                 // étape 174 (13/10) : plus d'espèce à découvrir au Duel
  } else {
    // Étape 274 : depuis « Plus de jeux », toutes les espèces sont déjà en jeu : pas de découverte glissée en plus
    defi.aDecouvrir = accesTout() ? [] : especesADecouvrir(d.especes, NOUVELLES_PAR_PARTIE);
    defi.prochaineDecouverte = RYTHME_DECOUVERTE[defi.jeu];
  }
  if (defi.jeu === "indices") { demarrerIndices(); return; }
  if (defi.jeu === "plus") { demarrerPlus(); return; }
  if (defi.jeu === "portrait") { demarrerPortrait(); return; }
  afficherHud();
  nouvelleRencontre();
}

// Étape 196 : l'étiquette d'une question de « Jouer », et sa couleur de pastille
function etiquetteJouer(espece, champ, estRevision) {
  if (champ === IDENTIFICATION && !estIdentifiee(espece)) return { texte: "Nouvelle espèce", type: "nouv" };
  if (defi && defi.expedition && defi.expedition.revue && defi.questionReprise) return { texte: "Vous arrivez à la reconnaître maintenant ?", type: "rev" };   // étape R184
  if (defi && defi.expedition && defi.expedition.revue) return { texte: "Déjà rencontrée ailleurs · reconnaissez-la pour qu'elle compte ici", type: "rev" };   // étape 317 (R184 : dit pourquoi)
  if (estRevision) return { texte: "Déjà croisée…", type: "rev" };
  if (nbBonnes(espece, champ) === 0) return { texte: "À découvrir", type: "trait" };
  return { texte: "Révision", type: "rev" };
}
function noterPastille(type) {
  if (!defi || !defi.jouer) return;
  defi.pastilles[defi.faites] = type;
  afficherHud();
}
function dessinPastilles() {
  let h = "";
  const p = defi.pastilles || [];                        // étape R176 : une reprise n'a pas de pastilles notées
  for (let i = 0; i < defi.total; i++) h += `<i class="${p[i] || ""}${i === defi.faites ? " ici" : ""}"></i>`;
  return `<span class="pastilles-jouer">${h}<small>${Math.min(defi.faites + 1, defi.total)} / ${defi.total}</small></span>`;
}

function afficherHud() {
  // Sans chronomètre (étape 42) : la jauge montre l'avancement, le texte "Question 3 / 10"
  // Étape 166 : le Duel à vies. Pas de jauge (pas de fin connue) : le numéro du duel et les vies.
  document.getElementById("hud-defi").classList.toggle("avec-vies", defi.vies !== undefined && defi.jeu === "plus");
  if (defi.vies !== undefined && defi.jeu === "plus") {
    const temps = document.getElementById("temps-defi"), h = `Duel ${defi.numero}` + dessinVies();
    if (temps.dataset.h !== h) { temps.innerHTML = h; temps.dataset.h = h; }
    majSerieDuel();
    // Étape 168 : à droite, les bonnes réponses de la partie (plus de points) et le record de partie
    document.getElementById("score-defi").textContent = nombre(defi.bonnes);
    const battu = defi.bonnes > defi.recordPartieAvant && defi.recordPartieAvant > 0;
    const unite = `bonne${defi.bonnes > 1 ? "s" : ""}<small class="${battu ? "battu" : ""}">${battu ? "nouveau record" : `record : ${nombre(Math.max(defi.recordPartieAvant, defi.bonnes))}`}</small>`;
    const u = document.getElementById("unite-score");
    if (u.dataset.h !== unite) { u.innerHTML = unite; u.dataset.h = unite; }
    return;
  }
  // Étape 196 : « Jouer » sans chronomètre — 10 pastilles, ni jauge ni points
  // Étape R176 (retour d'Aubin du 09/11, souris grise : « Question 1 / 1 », « 0 pts », un écran d'une autre allure) :
  // la reprise des questions manquées prend l'allure d'une partie (pastilles, ni jauge ni points).
  const avecPastilles = !!(defi.jouer || defi.reprise);
  document.getElementById("hud-defi").classList.toggle("hud-jouer", avecPastilles);
  if (avecPastilles) {
    const t = document.getElementById("temps-defi"), h = dessinPastilles();
    if (t.dataset.h !== h) { t.innerHTML = h; t.dataset.h = h; }
    document.getElementById("serie-defi").textContent = "";
    if (typeof majPartieBande === "function") majPartieBande();   // étape M19
    return;
  }
  delete document.getElementById("temps-defi").dataset.h;
  if (document.getElementById("unite-score").dataset.h) { document.getElementById("unite-score").textContent = "pts"; delete document.getElementById("unite-score").dataset.h; }
  document.getElementById("jauge-defi").style.width = (100 * defi.faites / defi.total) + "%";
  document.getElementById("temps-defi").textContent = `${JEUX[defi.jeu].unite} ${defi.numero} / ${defi.total}`;
  // Plus ou moins : la série en cours est affichée, car elle double les points
  // Étape 152 : au Duel, le cran en cours (●○○ écarts nets, ●●○ serrés, ●●● très serrés)
  // Étape 165 : au Duel, la série en paliers remplace le cran écrit
  if (defi.jeu === "plus") majSerieDuel();
  else { document.getElementById("serie-defi").textContent = ""; delete document.getElementById("serie-defi").dataset.h; }
  document.getElementById("score-defi").textContent = nombre(defi.score);
}
// Étape 168 : la série du Duel dans le bandeau, style C (maquette du 13/10) : le nombre de bonnes réponses d'affilée
//   au centre d'un anneau qui se remplit jusqu'au palier suivant (3, 5, 10, 15, 20, puis toutes les 10).
//   À côté : « d'affilée » et le record de série. Couleur par palier (niveau 0 à 5).
function estPalierSerie(n) { return PALIERS_SERIE.includes(n) || (n > 20 && n % 10 === 0); }
function niveauSerie(n) { return PALIERS_SERIE.filter(x => n >= x).length; }
function palierAvant(n) { return n >= 20 ? 20 + Math.floor((n - 20) / 10) * 10 : [0, ...PALIERS_SERIE].filter(x => x <= n).pop(); }
function palierApres(n) { return n >= 20 ? palierAvant(n) + 10 : PALIERS_SERIE.find(x => x > n); }
function dessinSerieDuel() {
  const n = defi.serie || 0;
  const anim = defi.vientDeMonter ? " palier" : defi.vientDAvancer ? " plus" : defi.vientDeTomber ? " casse" : "";
  const de = palierAvant(n), a = palierApres(n);
  const part = defi.vientDeMonter ? 1 : (n - de) / (a - de);       // juste au palier : l'anneau plein ; au duel suivant, il repart
  const r = 19, tour = 2 * Math.PI * r;
  const avant = defi.recordSerieAvant || 0, battu = avant > 0 && n > avant;
  const record = battu ? "nouveau record" : `record : ${Math.max(avant, defi.meilleureSerie || 0)}`;
  return `<span class="anneau-serie niveau-${niveauSerie(n)}${anim}"><span class="anneau"><svg viewBox="0 0 46 46">`
       + `<circle class="fond" cx="23" cy="23" r="${r}"/><circle class="plein" cx="23" cy="23" r="${r}" stroke-dasharray="${tour.toFixed(1)}" stroke-dashoffset="${(tour * (1 - part)).toFixed(1)}"/>`
       + `</svg><b>${n}</b></span><span class="mot">d'affilée<small class="${battu ? "battu" : ""}">${record}</small></span></span>`;
}
// Étape 166 : les vies du Duel, en petits cœurs à trait fin (pleins = restantes ; celle qu'on vient de perdre s'efface)
const COEUR = '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>';
function dessinVies() {
  let h = "";
  for (let i = 0; i < VIES_DUEL; i++) h += `<i class="${i < defi.vies ? "pleine" : ""}${i === defi.vies && defi.vientDePerdre ? " perdue" : ""}">${COEUR}</i>`;
  return `<span class="vies-duel">${h}</span>`;
}
// On ne redessine la série que si elle a changé (sinon, avec le chronomètre, les animations repartiraient à chaque seconde)
function majSerieDuel() {
  const el = document.getElementById("serie-defi"), h = dessinSerieDuel();
  if (el.dataset.h !== h) { el.innerHTML = h; el.dataset.h = h; }
}

// Une réponse pendant le défi : pas d'explication, la question suivante arrive seule.
function repondreDefi(boutonClique, estJuste) {
  const { espece, champ, explication } = enCours;
  for (const b of document.querySelectorAll(".reponse")) {
    b.disabled = true;
    if (b.dataset.juste === "oui") b.classList.add("juste");
  }
  if (estJuste) {
    const secondes = (Date.now() - defi.debutQuestion) / 1000;
    const rapidite = Math.round(POINTS_RAPIDITE * Math.max(0, 1 - secondes / SECONDES_RAPIDITE) / 10) * 10;   // arrondi à la dizaine
    const bonusSerie = Math.min(PLAFOND_SERIE, POINTS_SERIE * defi.serie);     // la série AVANT cette réponse
    const points = POINTS_BASE + rapidite + bonusSerie;
    defi.score = defi.score + points;
    // Les XP (étape 41) : la part fixe, et la petite part de rapidité (même fonte en 5 secondes que le score)
    defi.xpBase = defi.xpBase + XP_DEFI_BONNE;
    defi.xpRapidite = defi.xpRapidite + Math.round(XP_DEFI_RAPIDITE * Math.max(0, 1 - secondes / SECONDES_RAPIDITE));
    defi.bonnes = defi.bonnes + 1;
    defi.serie = defi.serie + 1;
    defi.meilleureSerie = Math.max(defi.meilleureSerie, defi.serie);
    // Une bonne réponse en défi compte dans la fiche (le plus souvent : une confirmation)
    noterAuBilan(espece, champ);                           // AVANT le +1
    acquerir(espece, champ);
    if (defi.jeu === "rencontre" || defi.jeu === "revision") marquerVue(espece);   // l'espèce s'est montrée (étapes 72 et 86)
    if (!boutonClique.classList.contains("choix-photo")) boutonClique.insertAdjacentHTML("beforeend", ` &nbsp; +${points}`);
  } else {
    boutonClique.classList.add("fausse");
    jouerSon("mauvaise");                               // étape 170 : le hou-hou de chouette
    defi.serie = 0;                                        // la série repart de zéro, sans rien retirer
    aRevoirPlusTard(espece, champ);                        // elle reviendra dans les « Déjà croisée… » (étape 55)
    // On note la question ratée pour l'écran de fin (une seule fois, et sans le "C'était : …" des photos)
    const texte = explication.replace(`C'était : ${espece.nom_courant}. `, "");
    if (!defi.rates.some(r => r.nom === espece.nom_courant && r.explication === texte)) {
      defi.rates.push({ nom: espece.nom_courant, explication: texte });
    }
  }
  afficherHud();
  // La suite arrive seule : vite après une bonne réponse, un peu moins vite après une erreur
  // (le temps de voir la bonne réponse en vert).
  defi.attente = setTimeout(() => { if (defi) nouvelleRencontre(); }, estJuste ? 450 : 1100);
}

function arreterDefi() {
  if (defi && defi.attente) clearTimeout(defi.attente);
  document.getElementById("hud-defi").classList.add("cache");
}

// Quitter la page en plein défi : on l'annule (les confirmations déjà gagnées sont gardées)
function abandonnerDefi() {
  arreterDefi();
  // Les XP déjà mérités sont crédités, mais sans le minimum garanti,
  // réservé aux défis menés jusqu'au bout.
  if (defi) xp = xp + Math.round((defi.xpBase + defi.xpRapidite) * multiplicateurDecouvertes());
  defi = null;
  afficherStats();
  document.getElementById("carte-rencontre").classList.add("cache");
  sauvegarder();
}


// La rareté d'une espèce ; une case vide dans le tableur compte comme "Peu commun"
function rareteDe(espece) {
  return RARETES[espece.rarete_observation] ? espece.rarete_observation : "Peu commun";
}




// Fin du temps : étoiles, record, XP des nouvelles étoiles, puis l'écran de fin
function terminerDefi() {
  arreterCri();                                          // étape R176
  arreterDefi();
  setTimeout(presenterFamillesEnAttente, 900);              // étape 127 : une famille découverte pendant le chrono attendait la fin
  if (!defi.reprise) statsDe(defi.carnet ? "carnet" : defi.jeu).parties++;   // étape R167 : « Compléter le carnet » compte à part          // étape 92 : une partie de plus pour ce jeu (pas pour une reprise)
  // Étape 106 : la meilleure série, et le badge « Sans faute » (Carnet de 20 questions ou plus, sans chronomètre, aucune erreur)
  suivi.meilleureSerie = Math.max(suivi.meilleureSerie, defi.meilleureSerie || 0);
  if (defi.jeu === "revision" && !defi.reprise && defi.total >= 10 && defi.faites >= defi.total && !defi.erreurs) suivi.sansFaute = true;   // étape 197 : une partie Jouer (10 questions)
  const d = defi;
  defi = null;
  if (d.reprise && d.origine) { finDeReprise(d); return; }   // étape 99 : retour à l'écran de fin d'origine
  const jeu = JEUX[d.jeu];                                                // chaque jeu a ses seuils d'étoiles et ses records
  const cle = d.reprise ? "reprise" : d.carnet ? "carnet:" + d.cle : cleRecord(d.jeu, d.cle, d.chrono, d.longueur, d.photos);   // R167   // étape 98 : une reprise n'a pas de record
  const etoiles = seuilsDe(d.jeu, d.chrono, d.longueur).filter(seuil => d.score >= seuil).length;
  const ancien = records[cle] || { score: 0, etoiles: 0 };
  const nouveauRecord = d.score > ancien.score;
  const etoilesGagnees = Math.max(0, etoiles - ancien.etoiles);          // seulement les étoiles jamais obtenues
  const gainXp = xpDuDefi(d);                                             // les XP du défi (étape 41)
  xp = xp + gainXp.total + XP_PAR_ETOILE * etoilesGagnees;
  // On note aussi la durée du défi : un record fait sur une autre durée ne serait pas comparable
  records[cle] = { score: Math.max(d.score, ancien.score), etoiles: Math.max(etoiles, ancien.etoiles), duree: DUREE_DEFI };
  sauvegarder();
  afficherStats();

  // Étape 97 : le carnet, les cases et les annonces (les anciennes lignes score / étoiles / XP sont cachées)
  const casesJeu = d.jeu === "rencontre" ? [] : [[nombre(d.score), `point${d.score > 1 ? "s" : ""} · ${nouveauRecord ? "nouveau record" : `record : ${nombre(ancien.score)}`}`]];
  if (d.bonnes !== undefined && d.jeu !== "indices" && d.jeu !== "portrait")
    casesJeu.unshift([`${d.bonnes} / ${d.vies !== undefined ? d.faites : d.total}`, "bonnes réponses"]);   // étape 166 : le Duel à vies compte les duels joués
  if (d.reprise) casesJeu.splice(1);                      // une reprise : seulement les bonnes réponses
  // Étape 168 : le Duel à vies ne compte que les bonnes réponses ; ses deux records
  const duelVies = d.jeu === "plus" && d.vies !== undefined;
  if (duelVies) {
    casesJeu.length = 0;
    casesJeu.push([`${d.bonnes}`, `bonne${d.bonnes > 1 ? "s" : ""} réponse${d.bonnes > 1 ? "s" : ""} · `
                    + (d.recordPartieAvant > 0 && d.bonnes > d.recordPartieAvant ? "nouveau record" : `record : ${suivi.recordPartieDuel}`)]);
    casesJeu.push([`${d.meilleureSerie}`, "d'affilée au mieux · "
                    + (d.recordSerieAvant > 0 && d.meilleureSerie > d.recordSerieAvant ? "nouveau record" : `record : ${suivi.recordSerieDuel}`)]);
  }
  if (d.jouer) { casesJeu.length = 0; casesJeu.push([`${d.bonnes} / ${d.faites}`, "bonnes réponses"]); }   // étape 196
  const nomFin = d.carnet ? `Compléter le carnet · ${d.nom}` : d.jouer ? "Sortie terminée" : d.reprise ? `Questions à revoir · ${d.nom}` :
    `${jeu.nom}${d.longueur ? ` · ${d.longueur} questions` : ""} · ${d.nom}`;
  const origine = d.reprise ? null : { ecran: "defi", jeu: d.jeu, nomFin, journal: d.bilan, avant: d.photoAvant,
                                      cases: casesJeu, rattrapees: 0, reprises: 0, rejouer: null };
  // Étape 205 : partie sans faute = toutes les questions posées, aucune erreur (pas pour le Duel à vies ni une reprise)
  const parfaite = !d.reprise && d.vies === undefined && !d.erreurs && d.faites >= d.total && d.total > 0 && !(d.manquees || []).length;
  afficherCarnetFin("carnet-fin-defi", { journal: d.bilan, avant: d.photoAvant, cases: casesJeu, manquees: d.manquees, origine, parfaite });
  document.getElementById("nom-fin-defi").textContent = nomFin;
  document.getElementById("nom-fin-defi").classList.toggle("titre-fin-jouer", !!d.jouer);   // étape 196
  document.getElementById("score-fin-defi").textContent = nombre(duelVies ? d.bonnes : d.score);
  document.getElementById("record-fin-defi").textContent = duelVies ? casesJeu[0][1] :
    `point${d.score > 1 ? "s" : ""} · ` + (nouveauRecord ? "nouveau record" : `record : ${nombre(ancien.score)}`);
  document.getElementById("etoiles-fin-defi").innerHTML = dessinEtoiles(etoiles);
  // Le détail de la partie, propre à chaque jeu
  const bonnesReponses = `${d.bonnes} bonne${d.bonnes > 1 ? "s" : ""} réponse${d.bonnes > 1 ? "s" : ""}`;
  let detail = `${bonnesReponses} · meilleure série : ${d.meilleureSerie}`;
  // "sur 12" n'a de sens que sans chronomètre ; avec, on compte ce qui a été joué (étape 72)
  const surCombien = (d.jeu === "plus" && d.vies !== undefined) ? d.faites : d.total;   // étape 166
  if (d.jeu === "plus") detail = `${bonnesReponses} sur ${surCombien} · meilleure série : ${d.meilleureSerie}`;
  if (d.jeu === "indices") {
    detail = `${d.bonnes} espèce${d.bonnes > 1 ? "s" : ""} retrouvée${d.bonnes > 1 ? "s" : ""} sur ${surCombien}`;
  }
  if (d.jeu === "revision") detail = `${bonnesReponses} sur ${d.faites}`;
  if (d.jeu === "portrait")  detail = `${d.bonnes} trait${d.bonnes > 1 ? "s" : ""} juste${d.bonnes > 1 ? "s" : ""} sur ${d.essais || 0}`;
  document.getElementById("detail-fin-defi").textContent = detail;
  // Étape R142 : l'affichage des XP gagnés (caché depuis l'étape 289) est retiré.
  document.getElementById("bouton-rejouer-defi").textContent = "Rejouer";
  document.getElementById("bouton-territoire-defi").textContent = depuisArcade ? "Retour aux jeux" : "Retour au territoire";   // étape 274
  const zone = document.getElementById("rates-fin-defi");
  zone.innerHTML = d.rates.length ? `<p class="titre-defis">À revoir</p>` : "";
  for (const r of d.rates) zone.insertAdjacentHTML("beforeend", `<p>${r.nom} — <span>${r.explication}</span></p>`);

  afficherBilan(d.bilan, "bilan-defi");                                   // découvert / appris / confirmé (étape 55)
  // Étape 73 : plus d'espèce à choisir en fin de partie. Les espèces nouvelles arrivent PENDANT la partie,
  // en les reconnaissant sur leur photo (voir "Les découvertes", plus bas). proposerRecompense reste au cas où.
  document.getElementById("titre-recompense").textContent = "";
  document.getElementById("choix-recompense").innerHTML = "";
  document.getElementById("texte-recompense").textContent = "";
  document.getElementById("boutons-fin-defi").classList.remove("cache");
  dessinerPasserelle(d);                                                  // étape 263 : « Le rencontrer pour de bon ? »

  document.getElementById("carte-rencontre").classList.add("cache");
  document.getElementById("choix-longueur").classList.add("cache");
  document.getElementById("fin-defi").classList.remove("cache");
  // "Rejouer ce défi" relance le même périmètre (recalculé : la progression a pu changer)
  document.getElementById("bouton-rejouer-defi").onclick = () => {
    if (d.carnet) { lancerCarnet(d.depuisJeux); return; }                 // étape R167
    if (d.jouer) { lancerJouer(); return; }                               // étape 196 : « Jouer », sur le terrain du moment
    const meme = retrouverDefi(d.cle);                                    // y compris un défi à plusieurs familles
    jeuChoisi = d.jeu;                                                    // le même jeu, sur le même périmètre
    if (d.jeu === "revision") {                                           // et de la même façon (étapes 72 et 87)
      if (d.longueur) questionsClassique = d.longueur;
    }
    if (meme && meme.ouvert) demarrerDefi(meme); else entrerRencontre();
  };
  if (typeof retirerResumeFin === "function") retirerResumeFin();       // étape M15 : le résumé du téléphone, refait par finExpedition
  if (d.expedition) finExpedition(d);                                    // étape 282 : l'étape et ses empreintes
  if (d.site) finSite(d);                                                // étape 292 : le tour du lac, la sortie du jour
  if (typeof resumeJeuTelephone === "function") resumeJeuTelephone(d);   // étape M16 : sur téléphone, la fin d'un petit jeu tient sur un écran
  if (origine) origine.rejouer = document.getElementById("bouton-rejouer-defi").onclick;   // étape 99 : gardé pour le retour
}

// Étape 99 : la reprise est finie → on revient sur l'écran de fin de la partie d'origine, mis à jour :
// les lignes gagnées pendant la reprise rejoignent le carnet (les découvertes toujours en tête),
// une case compte les réponses rattrapées, et « À revoir » ne garde que ce qui a encore échappé.
function finDeReprise(d) {
  const o = d.origine;
  xp = xp + xpDuDefi(d).total;                           // (les XP internes, en attendant leur retrait)
  sauvegarder();
  o.journal = o.journal.concat(d.bilan);
  o.rattrapees += d.bonnes;
  o.reprises += d.total;
  const cases = o.cases.concat([[`${o.rattrapees} / ${o.reprises}`, `réponse${o.rattrapees > 1 ? "s" : ""} rattrapée${o.rattrapees > 1 ? "s" : ""}`]]);
  const zone = o.ecran === "session" ? "carnet-fin-session" : "carnet-fin-defi";
  afficherCarnetFin(zone, { journal: o.journal, avant: o.avant, cases, manquees: d.manquees || [], origine: o });
  document.getElementById("hud-defi").classList.add("cache");
  document.getElementById("carte-rencontre").classList.add("cache");
  document.getElementById("choix-longueur").classList.add("cache");
  if (o.ecran === "session") {
    afficherFicheSession(o.s);                           // la fiche de l'espèce, avec ce qui vient d'être rattrapé
    // Étape R176 (retour d'Aubin du 09/11, chevêche d'Athéna : « Fait ! » sans bouton pour l'espèce suivante) : l'écran de fin
    // doit être visible AVANT le résumé du téléphone, qui ne recopie que les boutons visibles (avant : après « Revoir la question
    // manquée », le bouton « Espèce suivante » était encore caché et le résumé n'avait que « ← Expédition »).
    document.getElementById("fin-defi").classList.add("cache");
    document.getElementById("fin-session").classList.remove("cache");
    if (typeof resumeSessionTelephone === "function") resumeSessionTelephone(o.s);   // étape M16 : le résumé suit la reprise
  } else {
    document.getElementById("nom-fin-defi").textContent = o.nomFin;
    document.getElementById("bouton-rejouer-defi").onclick = o.rejouer;
    document.getElementById("fin-session").classList.add("cache");
    document.getElementById("fin-defi").classList.remove("cache");
    if (typeof dernierResumeFin !== "undefined" && dernierResumeFin) resumeFinTelephone(dernierResumeFin);   // étape M15 : le résumé suit la reprise
    else if (typeof dernierResumeJeu !== "undefined" && dernierResumeJeu) resumeJeuTelephone(dernierResumeJeu);   // étape M16
  }
  window.scrollTo(0, 0);
}


// ---- Étape 253 (24/10) : l'onglet « Plus de jeux » ----
// Tous les jeux, sur un choix LIBRE de territoires (plusieurs possibles) et de familles, gardé à part
// (suivi.territoiresLibres, classesChoisies) : il ne change ni le territoire où l'on est, ni l'accueil, ni « Jouer ».
var modeLibre = false;
function ouvrirPlusDeJeux() { montrer("arcade"); }   // étape 262 : l'Arcade (avant : l'écran des jeux en carnet, en mode libre)
function entrerPlusDeJeux() {
  const ouverts = territoiresOuverts();
  const libres = (suivi.territoiresLibres || []).filter(t => ouverts.includes(t));
  territoiresDefi = libres.length ? libres : [territoireActif()];
  famillesDefi = classesChoisies && classesChoisies.length ? classesChoisies.slice() : null;
  if (!JEUX[jeuChoisi] || jeuChoisi === "revision") jeuChoisi = "rencontre";
}
