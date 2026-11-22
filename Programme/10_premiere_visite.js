// 10_premiere_visite.js — La première visite : territoire (et prénom), explication.
// Une partie du programme du jeu, chargée par jeu.html dans l'ordre des numéros.

// ==================================================================
// 11 sexies. LA PREMIÈRE VISITE (étape 52, revue à l'étape 60, puis à l'étape 275)
//    Quatre écrans : le niveau, un territoire, la façon de découvrir les territoires
//    (au fil du jeu ou tout d'un coup, étape 275), puis une courte explication du jeu.
//    Les réponses sont gardées dans "brouillon" tant que le joueur n'a pas fini ;
//    à la fin, elles deviennent le "profil" (partie 2), sauvegardé avec la partie,
//    et quelques espèces communes sont placées dans l'encyclopédie.
// ==================================================================
const NIVEAUX_PROFIL = [
  { valeur: 1, nom: "Curieux de Nature",   texte: "Pour découvrir : les questions les plus simples sur chaque espèce." },
  { valeur: 2, nom: "Naturaliste Aguerri", texte: "Déjà quelques repères : les questions simples et intermédiaires." },
  { valeur: 3, nom: "Expert de Terrain",   texte: "Une bonne connaissance du terrain : toutes les questions, dès le départ." },
];
const NB_TERRITOIRES_PROFIL = 1;        // combien de territoires le joueur débloque au départ
const ESPECES_OFFERTES = true;           // étape E2-12 (seconde partie, 16/11) : 8 espèces offertes au départ, « à reconnaître » (avant : false depuis R92)
const NB_OFFERTES = 8;                  // étape E2-12 : combien d'espèces offertes
const RARETE_DEPART = "Commun";         // leur rareté (colonne rarete_observation du tableur)
const DERNIER_ECRAN = 3;
// Étape PR4 (01/11, choix de l'utilisateur) : « au fil du jeu » pour tout le monde ; l'écran 2 (la question) n'est plus montré.
//   Tout débloquer et Recommencer sont dans À propos.
// Étape M13 (07/11, choix de l'utilisateur) : l'écran du niveau est retiré (l'expédition, le jeu principal, ne s'en servait pas).
//   Tout nouveau joueur part au niveau 1 (Curieux de Nature) ; les questions s'ouvrent au fil des expéditions, comme avant.
//   Un joueur qui avait déjà choisi un niveau le garde. Le prénom passe sur l'écran du territoire.
const NIVEAU_DEPART = 1;
// Étape M27 (07/11/2026, choix d'Aubin, téléphone ET ordinateur) : le nom a sa propre page, en premier ; puis le territoire ; puis l'explication.
const ECRAN_NOM = 4;
const ECRANS_BIENVENUE = [ECRAN_NOM, 1, 3];       // 0 = niveau (retiré, M13), 1 = territoire, 2 = découverte des territoires, 3 = explication, 4 = nom (M27)
// Étape 275 (« Revoir 5 ») : découvrir les territoires au fil du jeu (ils s'ouvrent avec les points) ou tout d'un coup
const DECOUVERTES_PROFIL = [
  { valeur: "fil",  nom: "Au fil du jeu",  texte: "" },     // texte écrit avec le territoire choisi (afficherBienvenue)
  { valeur: "tout", nom: "Tous les territoires", texte: "" },
  { valeur: "toutjeu", nom: "Tout débloqué", texte: "" },   // Revoir 7 (étape 332) : aussi les lieux, les expéditions, les étapes et les finales
];

let brouillon = null;                   // les réponses en cours : { niveau, territoires, decouverte }, puis { depart, lieuDepart } au dernier écran
let etapeBienvenue = 0;
let nouveauJoueur = false;              // vrai pendant une vraie première visite (faux avec changerProfil)

// Ouvre la première visite. Si un profil existe déjà (commande changerProfil), on repart de ses réponses.
function montrerBienvenue() {
  nouveauJoueur = !profil;
  // (un ancien profil peut contenir un territoire sans espèces : on ne le reprend pas)
  brouillon = profil ? { niveau: profil.niveau || NIVEAU_DEPART, territoires: profil.territoires.filter(t => especesDe(t).length > 0).slice(0, NB_TERRITOIRES_PROFIL),
                         decouverte: (typeof toutDebloque === "function" && toutDebloque()) ? "toutjeu" : territoiresOuvertsListe === null ? "tout" : "fil" }
                     : { niveau: NIVEAU_DEPART, territoires: [], decouverte: "fil" };   // « au fil du jeu » proposé par défaut
  brouillon.prenom = suivi && typeof suivi.prenom === "string" ? suivi.prenom : "";   // étape M6
  etapeBienvenue = ECRANS_BIENVENUE[0];            // étape M13
  for (const vue of ["vue-accueil", "vue-rencontre", "vue-encyclopedie", "vue-apropos", "vue-espece", "barre"]) {
    document.getElementById(vue).classList.add("cache");
  }
  document.getElementById("vue-bienvenue").classList.remove("cache");
  afficherBienvenue();
}

// Affiche l'écran en cours
function afficherBienvenue() {
  const corps = document.getElementById("corps-bienvenue");
  corps.innerHTML = "";
  document.getElementById("etape-bienvenue").textContent = `Bienvenue · ${ECRANS_BIENVENUE.indexOf(etapeBienvenue) + 1} / ${ECRANS_BIENVENUE.length}`;
  document.getElementById("retour-bienvenue").classList.toggle("cache", etapeBienvenue === ECRANS_BIENVENUE[0]);   // étape M13
  document.getElementById("suite-bienvenue").textContent = etapeBienvenue === DERNIER_ECRAN ? "Commencer" : "Continuer";

  if (etapeBienvenue === 0) {
    document.getElementById("titre-bienvenue").textContent = "Quel niveau pour commencer ?";
    document.getElementById("texte-bienvenue").textContent = "Le niveau ouvre ses questions, et celles des niveaux en dessous.";
    poserTuilesProfil(NIVEAUX_PROFIL, "niveau");     // (écran retiré à l'étape M13)
  }
  if (etapeBienvenue === ECRAN_NOM) {               // étape M27 : la page du nom (facultatif : Continuer marche même vide)
    document.getElementById("titre-bienvenue").textContent = "Comment voulez-vous qu\u2019on vous appelle\u00a0?";
    document.getElementById("texte-bienvenue").textContent = "Votre prénom ou un pseudo, si vous le souhaitez. Vous pourrez le changer dans les Réglages (⚙ en haut du Profil).";
    poserPrenom();
    if (nouveauJoueur && typeof poserReprendreBienvenue === "function") poserReprendreBienvenue();   // étape ML7 : partie sauvegardée dans un fichier
  }
  if (etapeBienvenue === 1) {
    document.getElementById("titre-bienvenue").textContent = "Quel territoire pour commencer\u00a0?";
    document.getElementById("texte-bienvenue").textContent = "Touchez-le sur la carte ou dans la liste.";
    poserCarteBienvenue();
  }
  if (etapeBienvenue === 2) {
    // Étape 275 : le joueur choisit comment les territoires s'ouvrent
    const lieu = territoireDeDepart(brouillon.territoires);
    const nb = tousLesTerritoires().length;
    DECOUVERTES_PROFIL[0].texte = `Vous commencez ${dansTerritoire(lieu)}. Les lieux, les expéditions et les autres territoires s'ouvrent à mesure que vous gagnez des empreintes. Conseillé pour débuter.`;
    DECOUVERTES_PROFIL[1].texte = `Les ${nb} territoires sont ouverts dès le départ ; dans chacun, les lieux et les expéditions s'ouvrent en jouant.`;
    DECOUVERTES_PROFIL[2].texte = "Tout est ouvert dès le départ : territoires, lieux, expéditions, étapes et finales. Pour picorer librement.";
    document.getElementById("titre-bienvenue").textContent = "Comment voulez-vous avancer ?";
    document.getElementById("texte-bienvenue").textContent = "Vous pourrez changer d'avis plus tard, depuis la page À propos.";
    poserTuilesProfil(DECOUVERTES_PROFIL, "decouverte");
  }
  if (etapeBienvenue === 3) {
    // Étape 275 : textes remis à jour ; étape 282 : les expéditions et le chemin remplacent Sortie nature et Rencontre
    document.getElementById("titre-bienvenue").textContent = "Comment jouer";
    document.getElementById("texte-bienvenue").textContent = "";              // étape M28 : les trois lignes suffisent
    poserExplication();
  }
  majSuiteBienvenue();
}

// "Continuer" reste grisé tant que la question de l'écran n'a pas sa réponse
// (l'écran d'explication n'en pose aucune : le bouton y est toujours actif)
function majSuiteBienvenue() {
  const pret = etapeBienvenue === 0 ? brouillon.niveau !== null
             : etapeBienvenue === 1 ? brouillon.territoires.length === NB_TERRITOIRES_PROFIL
             : etapeBienvenue === 2 ? !!brouillon.decouverte
             : true;
  document.getElementById("suite-bienvenue").disabled = !pret;
}

// Étape M6 (06/11/2026, choix de l'utilisateur) : sur le premier écran (celui du territoire depuis M13), le prénom ou un pseudo (facultatif),
// gardé dans le brouillon, puis dans suivi.prenom à la fin de la première visite ; modifiable dans le Profil.
function poserPrenom() {
  const bloc = document.createElement("label");
  bloc.className = "prenom-bienvenue";
  bloc.innerHTML = `<input type="text" id="prenom-bienvenue" maxlength="24" autocomplete="nickname" placeholder="Par exemple : Camille" aria-label="Votre prénom ou un pseudo (facultatif)">`;   // étape M27 : le titre suffit
  const champ = bloc.querySelector("input");
  champ.value = brouillon.prenom || "";
  champ.oninput = () => { brouillon.prenom = champ.value; };
  champ.onkeydown = ev => { if (ev.key === "Enter") { ev.preventDefault(); champ.blur(); suiteBienvenue(); } };   // étape M27
  document.getElementById("corps-bienvenue").appendChild(bloc);
}

// Une tuile par réponse possible ; "cle" = la case du brouillon à remplir ("niveau")
function poserTuilesProfil(choix, cle) {
  const zone = document.createElement("div");
  zone.className = "choix-profil";
  for (const c of choix) {
    const tuile = document.createElement("button");
    tuile.className = "tuile-profil" + (brouillon[cle] === c.valeur ? " actif" : "");
    tuile.innerHTML = `${c.nom}<small>${c.texte}</small>`;
    tuile.onclick = () => { brouillon[cle] = c.valeur; afficherBienvenue(); };
    zone.appendChild(tuile);
  }
  document.getElementById("corps-bienvenue").appendChild(zone);
}

// La carte des 11 territoires : un clic choisit un territoire, un second clic le retire.
// Un autre territoire cliqué remplace celui qui était choisi.
// Étape 62 : seuls les territoires qui ont des espèces se cliquent ("jouable").
function poserCarteBienvenue() {
  // Étape R273 (19/11/2026, choix 7A d'Aubin, test du 19/11 n° 15 ; remplace M27 « rien n'est écrit sur la carte ») :
  // la première visite reprend la carte de l'onglet « Carte » (25) : la mer autour, chaque territoire à sa couleur,
  // son nom écrit dessus, et la liste des territoires dessous. On choisit en touchant la carte ou la liste.
  // La carte est dessinée dans son cadre entier (CARTE_CADRE) : la Corse n'est plus rognée au bord de l'écran.
  if (typeof ATLAS_NOMS === "undefined") return poserCarteBienvenueM27();
  const corps = document.getElementById("corps-bienvenue");
  const choisi = brouillon.territoires[0] || "";
  const couleur = t => (TERRITOIRES[t] || {}).couleur || "#7a736a";
  const jouable = t => especesDe(t).length > 0;
  const teinte = t => !jouable(t) ? "#d6ccba" : couleur(t);
  const [vx, vy, vw0, vh] = CARTE_CADRE.split(" ").map(Number), vw = vw0 + 45;   // un peu de mer à droite de la Corse
  let svg = `<defs><radialGradient id="bv-mer" cx="45%" cy="45%" r="75%"><stop offset="0" stop-color="#E9F0EC"/><stop offset="1" stop-color="#CFE0DD"/></radialGradient></defs>`
    + `<rect x="${vx}" y="${vy}" width="${vw}" height="${vh}" fill="url(#bv-mer)"/>`
    + ATLAS_HOULE.map(([x, y]) => `<path d="M${x} ${y}q14-9 28 0t28 0" class="at-houle"/>`).join("")
    + CARTE_TERRITOIRES.map(k => `<path d="${k.contour}" class="at-cote"/>`).join("");
  let noms = "";
  // le territoire choisi est dessiné en dernier : son contour foncé n'est pas rogné par un voisin
  for (const k of CARTE_TERRITOIRES.slice().sort((a, b) => (a.nom === choisi) - (b.nom === choisi))) {
    const c = teinte(k.nom);
    svg += `<path d="${k.contour}" class="at-terr bv-terr${jouable(k.nom) ? " jouable" : ""}${k.nom === choisi ? " choisi" : ""}" data-t="${echapper(k.nom)}" style="fill:${c};stroke:${k.nom === choisi ? "" : c}"/>`;
    const n = ATLAS_NOMS[k.nom];
    if (n) {
      const [x, y, z, lignes, ancre] = n;
      noms += `<text x="${x}" y="${y}" font-size="${z}" class="at-nom${k.nom === choisi ? " bv-nom-choisi" : ""}"${ancre ? ` text-anchor="${ancre}"` : ""} style="stroke:${k.nom === choisi ? couleur(k.nom) : c}">`
        + lignes.map((l, i) => `<tspan x="${x}" dy="${i ? Math.round(z * 1.14) : 0}">${echapper(l)}</tspan>`).join("") + `</text>`;
    }
  }
  // Les petits territoires (bandes étroites ou île) : une zone invisible plus large autour d'eux, pour le doigt
  for (const [nom, marge] of Object.entries(MARGE_DOIGT_BIENVENUE)) {
    const t = CARTE_TERRITOIRES.find(x => x.nom === nom);
    if (t && jouable(nom)) svg += `<path d="${t.contour}" class="zone-doigt" data-t="${echapper(nom)}" style="stroke-width:${marge}"/>`;
  }
  const cadre = document.createElement("div");
  cadre.className = "at-carte-france bv-carte";
  cadre.innerHTML = `<svg id="carte-bienvenue" viewBox="${vx} ${vy} ${vw} ${vh}" role="img" aria-label="Carte de France des territoires">${svg}${noms}</svg>`;
  // Sous la carte : le territoire choisi, en grand, avec la phrase de sa carte d'identité
  const dessous = document.createElement("p");
  dessous.id = "noms-bienvenue";
  if (!choisi) { dessous.className = "vide"; dessous.textContent = "Aucun territoire sélectionné"; }
  else {
    const phrase = typeof IDENTITE !== "undefined" && IDENTITE[choisi] && IDENTITE[choisi].phrase ? IDENTITE[choisi].phrase : "";
    dessous.innerHTML = `<strong style="color:${couleur(choisi)}">${echapper(choisi)}</strong>${phrase ? `<small>${phrase}</small>` : ""}`;
  }
  // La liste des territoires (la petite forme de chacun, à sa couleur, et son nom)
  const liste = document.createElement("div");
  liste.className = "bv-liste";
  liste.setAttribute("role", "list");
  liste.innerHTML = Object.keys(ATLAS_NOMS).concat(tousLesTerritoires().filter(t => !ATLAS_NOMS[t])).filter(jouable).map(t =>
    `<button type="button" role="listitem" class="bv-case${t === choisi ? " choisi" : ""}" data-t="${echapper(t)}" aria-pressed="${t === choisi}" style="--couleur-t:${couleur(t)}">${formeTerritoire(t, 26, couleur(t))}<span>${echapper(t === "Plaines de l'Est et val de Saône" ? "Plaines de l’Est et val de Saône" : t)}</span></button>`).join("");
  const choisir = nom => {
    if (!nom || !jouable(nom)) return;
    brouillon.territoires = brouillon.territoires.includes(nom) ? [] : [nom];   // un second toucher le retire
    afficherBienvenue();
  };
  cadre.querySelectorAll("[data-t]").forEach(p => p.addEventListener("click", () => choisir(p.dataset.t)));
  liste.querySelectorAll("[data-t]").forEach(b => b.onclick = () => choisir(b.dataset.t));
  const bloc = document.createElement("div");   // sur ordinateur : la carte à gauche, le nom choisi et la liste à droite
  bloc.className = "bv-choix";
  const cote = document.createElement("div");
  cote.className = "bv-cote";
  cote.appendChild(dessous); cote.appendChild(liste);
  bloc.appendChild(cadre); bloc.appendChild(cote);
  corps.appendChild(bloc);
}

// L'ancienne carte de la première visite (M27 : rien d'écrit sur la carte), gardée si la carte de l'onglet « Carte » manque
function poserCarteBienvenueM27() {
  const corps = document.getElementById("corps-bienvenue");
  const SVG = "http://www.w3.org/2000/svg";
  const carte = document.createElementNS(SVG, "svg");
  carte.setAttribute("class", "carte-territoires");
  carte.setAttribute("id", "carte-bienvenue");
  carte.setAttribute("viewBox", CARTE_CADRE);
  const noms = document.createElement("p");
  noms.id = "noms-bienvenue";

  // Étape M27 (07/11/2026, choix d'Aubin) : rien n'est écrit sur la carte ; le territoire sélectionné
  // (ou survolé, à la souris) s'affiche dessous, en grand, avec la phrase de sa carte d'identité.
  const ecrireNoms = survole => {
    const t = survole || brouillon.territoires[0];
    if (!t) { noms.className = "vide"; noms.innerHTML = "Aucun territoire sélectionné"; return; }
    const couleur = TERRITOIRES[t] ? TERRITOIRES[t].couleur : "#1F3A2E";
    const phrase = typeof IDENTITE !== "undefined" && IDENTITE[t] && IDENTITE[t].phrase ? IDENTITE[t].phrase : "";
    noms.className = "";
    noms.innerHTML = `<strong style="color:${couleur}">${t}</strong>${phrase ? `<small>${phrase}</small>` : ""}`;
  };

  // Les territoires bien distincts (étape M27) : chacun dans une teinte franche de sa couleur,
  // séparés par un liseré couleur papier ; le territoire sélectionné prend sa couleur pleine et se soulève.
  // Le territoire choisi est dessiné en dernier : sa couleur n'est pas rognée par un voisin.
  const rangDessin = t => (especesDe(t.nom).length > 0 ? 1 : 0) + (brouillon.territoires.includes(t.nom) ? 2 : 0);
  const ordre = CARTE_TERRITOIRES.slice().sort((a, b) => rangDessin(a) - rangDessin(b));
  const choisir = nom => {
    if (brouillon.territoires.includes(nom)) brouillon.territoires = brouillon.territoires.filter(n => n !== nom);
    else {
      brouillon.territoires.push(nom);
      if (brouillon.territoires.length > NB_TERRITOIRES_PROFIL) brouillon.territoires.shift();   // shift = retirer le premier
    }
    afficherBienvenue();
  };
  for (const t of ordre) {
    const lisere = document.createElementNS(SVG, "path");
    lisere.setAttribute("d", t.contour);
    lisere.setAttribute("class", "lisere");
    carte.appendChild(lisere);
    const forme = document.createElementNS(SVG, "path");
    forme.setAttribute("d", t.contour);
    const jouable = especesDe(t.nom).length > 0;
    const choisi = brouillon.territoires.includes(t.nom);
    forme.setAttribute("class", "gris" + t.gris + (jouable ? " jouable" : "") + (choisi ? " choisi" : ""));
    if (jouable) {
      const couleur = TERRITOIRES[t.nom] ? TERRITOIRES[t.nom].couleur : "#7a736a";
      forme.style.fill = choisi ? couleur : melangerCouleurs(couleur, "#f4efe6", 0.62);
      forme.style.stroke = forme.style.fill;       // le trait à la même teinte : pas de lignes à l'intérieur du territoire
    }
    forme.onmouseenter = () => ecrireNoms(t.nom);
    forme.onmouseleave = () => ecrireNoms("");
    if (jouable) forme.onclick = () => choisir(t.nom);
    carte.appendChild(forme);
  }
  // Les petits territoires (bandes étroites ou île) : une zone invisible plus large autour d'eux, pour le doigt
  for (const [nom, marge] of Object.entries(MARGE_DOIGT_BIENVENUE)) {
    const t = CARTE_TERRITOIRES.find(x => x.nom === nom);
    if (!t || especesDe(nom).length === 0) continue;
    const zone = document.createElementNS(SVG, "path");
    zone.setAttribute("d", t.contour);
    zone.setAttribute("class", "zone-doigt");
    zone.style.strokeWidth = marge;
    zone.onmouseenter = () => ecrireNoms(nom);
    zone.onmouseleave = () => ecrireNoms("");
    zone.onclick = () => choisir(nom);
    carte.appendChild(zone);
  }
  corps.appendChild(carte);
  corps.appendChild(noms);
  ecrireNoms("");
}

// Étape M27 : largeur de la zone invisible ajoutée autour des petits territoires (unités de la carte, 1 = 1 km)
const MARGE_DOIGT_BIENVENUE = { "Vosges": 56, "Jura": 56, "Corse": 80 };

// L'écran d'explication (étape 60) : deux encarts, puis ce qui attend déjà le joueur
function poserExplication() {
  const corps = document.getElementById("corps-bienvenue");
  // Étape M28 (07/11/2026, choix d'Aubin : « il y a trop de texte ») : trois lignes courtes avec un picto,
  // puis une phrase qui rassure. Tient sur un écran, se lit en 10 secondes, ne dit que ce qui sert pour démarrer.
  // (Les Rencontres et les autres jeux se découvrent en jouant, par les onglets et la page d'une espèce.)
  const PICTOS = {
    boussole: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M15.2 8.8 L13.2 13.2 L8.8 15.2 L10.8 10.8 Z"/></svg>',
    loupe:    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15 L20.5 20.5"/></svg>',
    pas:      PAS_SVG,
  };
  const LIGNES = [
    ["boussole", "Partez en expédition", `dans de vrais lieux ${deTerritoire(territoireDeDepart(brouillon.territoires))}.`],   // « des Vosges »
    ["loupe",    "Découvrez les espèces en expédition,", "ou testez-vous tout de suite."],   // étape E2-12 (seconde partie)
    ["pas",      "Gagnez des empreintes :", "elles ouvrent de nouveaux lieux, puis de nouveaux territoires."],
  ];
  const zone = document.createElement("ol");
  zone.className = "etapes-jeu";
  zone.innerHTML = LIGNES.map(([picto, fort, suite]) =>
    `<li><span class="ej-picto ej-${picto}">${PICTOS[picto]}</span><span class="ej-texte"><strong>${fort}</strong> ${suite}</span></li>`).join("");
  corps.appendChild(zone);
  const rassure = document.createElement("p");
  rassure.className = "ej-rassure";
  // R274 (test du 19/11, n° 14 ; choix 4A) : la promesse est vraie dans tout le jeu — elle parle des expéditions (le Duel garde ses 3 vies)
  rassure.textContent = "Dans les expéditions, pas de chrono, pas de punition : une erreur est toujours expliquée.";
  corps.appendChild(rassure);
  // Les espèces de départ : seulement pour un nouveau joueur
  if (nouveauJoueur && ESPECES_OFFERTES) {
    const lieu = territoireDeDepart(brouillon.territoires);
    // Le tirage se fait ici, une seule fois : revenir en arrière puis revenir sur cet écran
    // montre les mêmes espèces. Seul un changement de territoire refait le tirage.
    if (!brouillon.depart || brouillon.lieuDepart !== lieu) {
      brouillon.depart = tirerEspecesDeDepart(lieu);
      brouillon.lieuDepart = lieu;
    }
    const note = document.createElement("p");
    note.id = "note-depart";
    // "des Alpes" se dit naturellement ; pour un autre territoire, on garde une tournure qui marche avec tous les noms
    const ou = deTerritoire(lieu);   // étape 190 : « des Alpes », « du Massif armoricain », « du Bassin parisien et Val de Loire »
    note.innerHTML = `Pour bien démarrer, <strong>${brouillon.depart.length} espèces communes</strong> ${ou} vous sont déjà présentées : leur photo et leur carte sont là, et vous pouvez jouer avec tout de suite. Elles entreront dans votre carnet dès votre première rencontre avec elles.`;   // R270 (n° 32) : avant « sont dans votre carnet », alors que le compteur disait « Carnet : 0 espèce »   // étape E2-12
    corps.appendChild(note);
    // Une vignette par espèce : sa miniature dans un cadre à la couleur de sa famille, puis son nom
    const grille = document.createElement("div");
    grille.className = "vignettes-depart";
    for (const espece of brouillon.depart) {
      grille.innerHTML += `
        <figure class="vignette-depart" style="--couleur-classe:${classeDe(espece).couleur}">
          <div class="photo">${celluleImage(espece, true)}</div>
          <figcaption>${espece.nom_courant}</figcaption>
        </figure>`;
    }
    corps.appendChild(grille);
    prechargerAccueilDepart(lieu);
  }
}
// Étape R297 (note 1b du 22/11 au soir : sur l'Accueil d'une partie neuve, la photo de « Votre première expédition » et celle
//   de l'espèce du jour arrivaient avec un temps de retard). Elles n'étaient demandées qu'à l'ouverture de l'Accueil. Elles le
//   sont maintenant dès cet écran (« Comment jouer », le territoire est connu), en tête de la file, et gardées prêtes à
//   s'afficher : l'Accueil les montre tout de suite. Mêmes fichiers que ceux que l'Accueil affichera.
function prechargerAccueilDepart(lieu) {
  try {
    if (typeof prechargerFichiers !== "function") return;
    const l = [];
    const x = typeof expeditionAReprendre === "function" ? expeditionAReprendre(lieu) : null;
    const c = x && x.chapitre && typeof chapitreParNom === "function" ? chapitreParNom(lieu, x.chapitre) : null;
    if (c && estRenseigne(c.photo) && typeof photoMini === "function") l.push(photoMini(c.photo));
    // les territoires qui seront ouverts (même règle que suiteBienvenue) ; l'Accueil montre la photo principale telle quelle
    const tout = brouillon && (brouillon.decouverte === "tout" || brouillon.decouverte === "toutjeu");
    const ouverts = tout ? tousLesTerritoires() : (brouillon ? brouillon.territoires : []).filter(t => especesDe(t).length).slice(0, 1);
    const j = typeof especeDuJour === "function" ? especeDuJour(ouverts.length ? ouverts : tousLesTerritoires()) : null;
    if (j && estRenseigne(j.photo)) l.push(j.photo);
    prechargerFichiers(l, true);
  } catch (err) { /* un chargement d'avance ne doit jamais gêner le jeu */ }
}

// ---- Les espèces de départ (étape 60) ----------------------------------
// Le territoire où les prendre : celui que le joueur a choisi. Depuis l'étape 62, il a
// forcément des espèces ; la seconde moitié de la ligne n'est plus qu'une sécurité.
function territoireDeDepart(choisis) {
  return choisis.find(t => especesDe(t).length > 0) || territoiresJeu(ESPECES[0])[0];
}

// Tire les espèces de départ : pour chaque famille, 2 espèces communes au hasard.
// Si une famille n'a pas 2 espèces communes (les reptiles des Alpes n'en ont qu'une),
// on complète avec des "Peu commun", puis avec ce qui reste.
// Étape E2-12 (seconde partie, 16/11) : 8 espèces très communes du premier lieu du territoire, de familles différentes
// (une par famille d'abord, puis une deuxième dans les familles les plus fournies), toujours avec une photo.
function tirerEspecesDeDepart(lieu) {
  const c = typeof lieuxDe === "function" ? lieuxDe(lieu)[0] : null;
  const duLieu = c && typeof expeditionsDuChapitre === "function" ? [...new Set(expeditionsDuChapitre(lieu, c.nom).flatMap(x => x.liste))] : [];
  const base = (duLieu.length >= NB_OFFERTES ? duLieu : especesDe(lieu)).filter(e => estRenseigne(e.photo));
  const rang = e => rareteDe(e) === RARETE_DEPART ? 0 : rareteDe(e) === "Peu commun" ? 1 : 2;
  const triees = melanger(base.slice()).sort((a, b) => rang(a) - rang(b));
  const tirees = [];
  for (let tour = 0; tirees.length < NB_OFFERTES && tour < 4; tour++) {
    for (const cle of Object.keys(CLASSES)) {
      if (tirees.length >= NB_OFFERTES) break;
      if (tirees.filter(e => e.onglet === cle).length > tour) continue;
      const e = triees.find(x => x.onglet === cle && !tirees.includes(x) && (tour > 0 || rang(x) === 0));
      if (e) tirees.push(e);
    }
  }
  for (const e of triees) if (tirees.length < NB_OFFERTES && !tirees.includes(e)) tirees.push(e);
  return tirees;
}

// Place une espèce dans l'encyclopédie sans question : elle est "identifiée" (photo et nom
// visibles), mais aucune caractéristique n'est trouvée. Même geste qu'à la fin d'un défi.
// Étape E2-12 : une espèce offerte est « à reconnaître » : dans le carnet (photo, nom, carte visibles), jouable dans
// Coup d'œil et À l'oreille, mais pas encore Reconnue ; elle le devient en la réussissant en défi ou en Rencontre
// (sa Rencontre rapporte toujours son empreinte). Sauvegarde : suivi.offertes (noms).
function offrirEspece(espece) {
  suivi.offertes = suivi.offertes || [];
  if (!suivi.offertes.includes(espece.nom_courant)) suivi.offertes.push(espece.nom_courant);
}
// Étape R236 (note 9 du 15/11, choix d'Aubin « BA ») : une espèce rencontrée dont la photo n'a pas été reconnue à la fin de sa
//   Rencontre n'est plus perdue : elle devient « à reconnaître », comme les espèces offertes (carnet, Coup d'œil, À l'oreille).
//   Elle devient Reconnue quand on la réussit (Rencontre, défi, ou Coup d'œil). Sauvegarde : suivi.aReconnaitre (noms).
// Étape R287 (choix « 1B ») : cette liste dit maintenant « Rencontre faite, photo pas encore reconnue » : l'espèce est AU CARNET
//   (estReconnue, 05) et sa photo reviendra. Elle reçoit sa date d'entrée (marque « Nouveau », tri du carnet) et, si c'est la
//   première de sa famille, la présentation de la famille, comme une espèce reconnue sur sa photo.
function mettreAReconnaitre(espece) {
  if (!espece || estReconnue(espece) || !estRenseigne(espece.photo)) return;
  if (typeof noterNouvelleFamille === "function") noterNouvelleFamille(espece);   // avant d'entrer au carnet (elle compte les autres)
  suivi.aReconnaitre = suivi.aReconnaitre || [];
  if (!suivi.aReconnaitre.includes(espece.nom_courant)) suivi.aReconnaitre.push(espece.nom_courant);
  const p = progression[espece.nom_courant];
  if (p && !p.decouverteLe) p.decouverteLe = Date.now();
}
function estOfferteDepart(espece) { return !!(suivi && suivi.offertes && suivi.offertes.includes(espece.nom_courant)) && !estReconnue(espece); }
// Rencontre faite, photo pas encore reconnue (l'espèce est au carnet depuis R287 ; la photo reste à revoir)
function estARevoirRencontre(espece) { return !!(suivi && suivi.aReconnaitre && suivi.aReconnaitre.includes(espece.nom_courant)) && !estIdentifiee(espece); }
// Étape R287 (choix « 2B ») : « Pour bien démarrer » = seulement les espèces offertes au départ, pas encore au carnet.
//   (Avant : « À reconnaître » réunissait les offertes et les espèces rencontrées sans la photo, qui sont au carnet depuis R287.)
function estOfferte(espece) { return estOfferteDepart(espece); }

// "Continuer" : écran suivant ; au dernier, les réponses deviennent le profil et le jeu s'ouvre
function suiteBienvenue() {
  if (etapeBienvenue !== DERNIER_ECRAN) { etapeBienvenue = ECRANS_BIENVENUE[ECRANS_BIENVENUE.indexOf(etapeBienvenue) + 1]; afficherBienvenue(); window.scrollTo(0, 0); return; }   // étape PR4 ; R270 (n° 9) : chaque écran s'ouvre en haut
  profil = { niveau: brouillon.niveau, territoires: brouillon.territoires.slice() };
  // Nouveau joueur : ses espèces de départ. (Pas avec changerProfil : la partie existe déjà.)
  // Ce sont celles montrées sur le dernier écran (brouillon.depart, tirées dans poserExplication).
  if (nouveauJoueur && ESPECES_OFFERTES && brouillon.depart) brouillon.depart.forEach(offrirEspece);   // étape E2-12 : de nouveau, « à reconnaître »
  if (nouveauJoueur) territoiresOuvertsListe = profil.territoires.filter(t => especesDe(t).length).slice(0, 1);   // étape 209
  if (brouillon.decouverte === "tout" || brouillon.decouverte === "toutjeu") territoiresOuvertsListe = null;   // étape 275 : tout d'un coup (null = tout est ouvert)
  if (typeof reglerToutDebloque === "function" && suivi) suivi.toutDebloque = brouillon.decouverte === "toutjeu";   // étape 332
  if (suivi && typeof brouillon.prenom === "string") suivi.prenom = brouillon.prenom.trim().slice(0, 24);   // étape M6
  // (« au fil du jeu » choisi en revoyant la première visite ne referme rien : les territoires ouverts le restent)
  nouveauJoueur = false;
  brouillon = null;
  sauvegarder();
  afficherStats();
  montrer(window.matchMedia && window.matchMedia("(max-width: 760px)").matches ? "maison" : "accueil");   // étape M9 : sur téléphone, la page d'accueil (« Bonjour … »)
}

// Commande de test : revoir la première visite sans rien effacer de la partie
function changerProfil() {
  if (defi) abandonnerDefi();
  montrerBienvenue();
  return "La première visite est affichée (la partie n'est pas modifiée).";
}
