// 05_accueil.js — Les chiffres de la barre du haut et l'accueil.
// Une partie du programme du jeu, chargée par jeu.html dans l'ordre des numéros.

// ==================================================================
// 9. LES STATS : la progression globale, utilisée par la barre du
//    haut ET par l'écran d'Accueil (une seule formule, deux affichages)
// ==================================================================
function progresGlobal() {
  const identifiees = ESPECES.filter(e => STATUTS.indexOf(statut(e)) >= 1).length;
  return { identifiees, total: ESPECES.length, pourcentage: Math.round(100 * identifiees / ESPECES.length) };
}

// Étape 335 (choix C2) : le détail du carnet par rareté, sous le compteur de la barre du haut
const ETOILE_RARE = `<svg class="etoile-rare" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 21l1.6-7L2 9.2l7.1-.6z"/></svg>`;
function basculerDetailCarnet(forcer) {
  const d = document.getElementById("detail-carnet");
  if (!d) return;
  const ouvrir = forcer !== undefined ? forcer : d.hidden;
  if (!ouvrir) { d.hidden = true; return; }
  const ligne = (nom, classe, liste) => { const vus = liste.filter(estReconnue).length;
    return `<div class="dc-ligne"><span class="dc-rarete ${classe}"><i></i>${nom}</span><b>${nombre(vus)}</b><small>sur ${nombre(liste.length)}</small></div>`; };
  const jeu = ESPECES.filter(e => e.rarete_observation);
  const pas = typeof empreintesTotal === "function" ? empreintesTotal() : 0;
  const rc = infoRangCarnet();   // étape PR2
  d.innerHTML = `<b class="dc-titre">Votre carnet : ${nombre(ESPECES.filter(estReconnue).length)} espèces</b>
    <div class="dc-ligne dc-rang"><span>Rang : <b>${rc.nom}</b></span><small>${rc.suivant ? `${rc.suivant.nom} à ${nombre(rc.suivant.seuil)}` : "le plus haut"}</small></div>
    ${ligne("Communes", "commune", jeu.filter(e => e.rarete_observation === "Commun"))}
    ${ligne("Peu communes", "peu", jeu.filter(e => e.rarete_observation === "Peu commun"))}
    ${ligne("Rares", "rare", jeu.filter(e => e.rarete_observation === "Rare"))}
    <div class="dc-ligne dc-pas"><span>${typeof PAS_SVG !== "undefined" ? PAS_SVG : ""}Empreintes</span><b>${nombre(pas)}</b><small>dans tous les territoires</small></div>
    <button class="dc-profil" type="button">Voir le profil ▶</button>`;
  d.querySelector(".dc-profil").onclick = () => { d.hidden = true; montrer("progression"); };
  d.hidden = false;
  setTimeout(() => document.addEventListener("click", function fermer(ev) {
    if (!ev.target.closest("#stats")) { d.hidden = true; document.removeEventListener("click", fermer); }
  }), 0);
}
function afficherStats() {
  const p = progresGlobal();
  // Une pastille : l'XP (les graines ont été retirées à l'étape 53). Le nombre d'espèces
  // identifiées n'est plus ici : le total à identifier est écrit sur la photo de l'accueil.
  // Étape 97 : le rang de naturaliste remplace l'XP (l'XP n'est plus affichée nulle part)
  const i = rangActuel(), lignes = lignesEcrites();
  const suivant = RANGS_NATURALISTE[i + 1];
  // Étape 139 (retour du testeur) : la progression toujours visible en haut — le rang, une jauge vers
  // le rang suivant, les lignes écrites et le nombre de badges. Un clic ouvre le Profil.
  const bas = seuilRang(i), haut = suivant ? seuilRang(i + 1) : lignes;
  const part = suivant ? Math.max(0, Math.min(100, Math.round(100 * (lignes - bas) / Math.max(1, haut - bas)))) : 100;
  const nbBadges = tousLesBadges().filter(b => palierDe(b) > 0).length;   // étape PR3
  // Étape 196 : plus de rang de naturaliste ni de jauge : le carnet (espèces identifiées) et les médailles d'espèce
  const trouvees = ESPECES.filter(estReconnue);
  const med = [0, 0, 0, 0];
  for (const e of trouvees) med[niveauTermine(e)]++;
  const stats = document.getElementById("stats");
  // Étape 335 (Revoir 8, choix C2) : plus de médailles dans la barre du haut. Le carnet, les espèces rares découvertes
  //   et les empreintes (la monnaie du jeu). Un clic ouvre le détail par rareté, avec un lien vers le Profil.
  const rares = trouvees.filter(e => e.rarete_observation === "Rare").length;
  const pas = typeof empreintesTotal === "function" ? empreintesTotal() : 0;
  // Étape M2 (01/11) : « Carnet : » dans un <span> pour pouvoir le masquer sur téléphone (rien ne change sur ordinateur)
  stats.innerHTML = `<button class="stat pastille-carnet" type="button" aria-haspopup="true" title="Votre carnet en détail"><span class="ph-carnet">Carnet : </span><strong>${nombre(trouvees.length)}</strong> espèce${trouvees.length > 1 ? "s" : ""}`
    + `<span class="ph-rares">${ETOILE_RARE}${nombre(rares)} rare${rares > 1 ? "s" : ""}</span>`
    + `<span class="ph-sep" aria-hidden="true"></span><span class="ph-pas">${typeof PAS_SVG !== "undefined" ? PAS_SVG : ""}${nombre(pas)} empreinte${pas > 1 ? "s" : ""}</span></button>`
    + `<div class="detail-carnet" id="detail-carnet" hidden></div>`;
  stats.onclick = ev => { if (!ev.target.closest(".detail-carnet")) basculerDetailCarnet(); };
  const sousEncyclo = document.getElementById("sous-encyclopedie");
  if (sousEncyclo) sousEncyclo.textContent = `${nombre(p.identifiees)} / ${nombre(p.total)} espèces identifiées`;
  const pj = document.getElementById("picto-jouer-accueil"), pe = document.getElementById("picto-encyclopedie-accueil");
  if (pj && !pj.innerHTML) pj.innerHTML = picto("rencontre");
  if (pe && !pe.innerHTML) pe.innerHTML = picto("revision");
  // Le total d'espèces du jeu, en haut à droite de la photo du bandeau
  const legende = document.getElementById("legende-bandeau");
  if (legende) legende.textContent = `${nombre(p.total)} espèces à identifier`;
}

// Une espèce compte comme "reconnue" à partir du statut "identifiée"
// (c'est-à-dire : au moins reconnue sur sa photo).
function estReconnue(espece) {
  return STATUTS.indexOf(statut(espece)) >= 1;
}

// Le territoire dont l'accueil montre la progression (texte + barres par famille).
// null au départ : on prendra le premier territoire qui a des espèces.
let territoireAccueil = null;

// Les espèces d'un territoire, et sa progression (même calcul que progresGlobal)
function especesDe(nomTerritoire) {
  return ESPECES.filter(e => territoiresJeu(e).includes(nomTerritoire));
}
function progresDe(nomTerritoire) {
  const especes = especesDe(nomTerritoire);
  const identifiees = especes.filter(estReconnue).length;
  return { identifiees, total: especes.length,
           pourcentage: especes.length ? Math.round(100 * identifiees / especes.length) : 0 };
}

// Mélange deux couleurs écrites "#rrggbb" : part = 1 → tout "a", part = 0 → tout "b".
// Sert à éclaircir la couleur d'un territoire en la mêlant à la couleur du papier.
function melangerCouleurs(a, b, part) {
  let resultat = "#";
  for (let i = 1; i < 7; i += 2) {                       // les 3 composantes : rouge, vert, bleu
    const x = parseInt(a.slice(i, i + 2), 16), y = parseInt(b.slice(i, i + 2), 16);
    resultat += Math.round(x * part + y * (1 - part)).toString(16).padStart(2, "0");
  }
  return resultat;
}

// ---- La carte (étape 17) ----
// On fabrique une forme <path> par territoire de territoires.js.
//   • territoire AVEC espèces  → sa couleur (liste TERRITOIRES, partie 11), d'autant plus
//     soutenue que le pourcentage d'espèces identifiées est élevé ; cliquable
//   • territoire SANS espèces  → gris, mention "à venir" au survol
function afficherCarte() {
  const carte = document.getElementById("carte-territoires");
  if (typeof CARTE_TERRITOIRES === "undefined") { carte.classList.add("cache"); return; }   // fichier absent : pas de carte
  carte.setAttribute("viewBox", CARTE_CADRE);
  carte.innerHTML = "";
  const SVG = "http://www.w3.org/2000/svg";       // les formes d'un dessin SVG se créent avec cette "adresse"

  // On dessine d'abord les territoires qui ont des espèces, puis les gris.
  // Chaque territoire est précédé de son liseré clair (voir le CSS) : le liseré
  // d'un territoire recouvre le bord de ceux dessinés avant lui → une frontière.
  // Étape 52 : parmi les gris, ceux que le joueur a débloqués sont dessinés en dernier,
  // pour que leur contour ne soit pas rogné par le liseré d'un voisin.
  const debloques = profil ? profil.territoires : [];
  const rang = t => especesDe(t.nom).length > 0 ? 0 : debloques.includes(t.nom) ? 2 : 1;
  const ordre = CARTE_TERRITOIRES.slice().sort((a, b) => rang(a) - rang(b));
  for (const t of ordre) {
    const lisere = document.createElementNS(SVG, "path");
    lisere.setAttribute("d", t.contour);
    lisere.setAttribute("class", "lisere");
    carte.appendChild(lisere);

    const forme = document.createElementNS(SVG, "path");
    forme.setAttribute("d", t.contour);
    forme.dataset.nom = t.nom;                                     // étape 260 : pour la bulle du survol
    const p = progresDe(t.nom);
    const titre = document.createElementNS(SVG, "title");          // petite étiquette au survol

    if (p.total > 0 && !territoiresOuverts().includes(t.nom)) {        // étape 255 : territoire pas encore ouvert
      forme.setAttribute("class", "gris" + t.gris + " ferme");
      const pale = melangerCouleurs(TERRITOIRES[t.nom] ? TERRITOIRES[t.nom].couleur : "#7a736a", "#f4efe6", 0.22);
      forme.style.fill = pale; forme.style.stroke = pale;
      const m = avantProchainTerritoire();
      titre.textContent = `${t.nom} : ${p.total} espèces — ${m === null ? "bientôt ouvert" : `s'ouvre dans ${texteManque(m)}`}`;
    } else if (p.total > 0) {
      const couleur = TERRITOIRES[t.nom] ? TERRITOIRES[t.nom].couleur : "#7a736a";
      forme.setAttribute("class", "jouable");
      // De 45 % de couleur (rien trouvé) à 100 % (tout identifié)
      const teinte = melangerCouleurs(couleur, "#f4efe6", 0.45 + 0.55 * p.pourcentage / 100);
      forme.style.fill = teinte;
      forme.style.stroke = teinte;                                 // trait de la même couleur : pas de liseré
      titre.textContent = `${t.nom} : ${p.pourcentage} % découvert — cliquer pour y partir`;
      if (t.nom === suivi.territoireActif) forme.classList.add("ici");    // étape 255 : le territoire où l'on est
      // Étape 262 (« Revoir 3 ») : le survol ne change plus les chiffres de gauche (la bulle de l'étape 260 les donne déjà)
      // Clic : on coche ce seul territoire, puis on ouvre la Rencontre
      forme.onclick = () => { changerTerritoire(t.nom); montrer("accueil"); };   // étape 255 : on part dans ce territoire
    } else if (debloques.includes(t.nom)) {
      forme.setAttribute("class", "gris" + t.gris + " debloque");
      titre.textContent = `${t.nom} : débloqué — ses espèces sont à venir`;
    } else {
      forme.setAttribute("class", "gris" + t.gris);
      titre.textContent = `${t.nom} : à venir`;
    }
    forme.appendChild(titre);
    carte.appendChild(forme);
  }
  // Étape 259 : le territoire où l'on est passe au premier plan (soulevé, avec son ombre) ; les autres s'estompent un peu
  const ici = carte.querySelector("path.ici");
  carte.classList.toggle("avec-ici", !!ici);
  if (ici) carte.appendChild(ici);
  if (document.getElementById("vue-carte").contains(carte)) brancherBulleCarte(carte, undefined, null, false, true);   // étape 260 ; étape 269 : le nom seul
}

// Étape 260 (24/10) : au survol d'un territoire, une bulle avec sa photo, son nom et son pourcentage
// Étape 261 : aussi sur la carte de la page espèce (encyclopédie) — « ligneEspece » ajoute si l'espèce vit dans ce territoire
function brancherBulleCarte(carte, zone = carte.closest(".ac-carte"), ligneEspece = null, aCote = false, nomSeul = false) {
  let bulle = zone.querySelector(".bulle-territoire");
  if (!bulle) { bulle = document.createElement("div"); bulle.className = "bulle-territoire"; zone.appendChild(bulle); }
  bulle.classList.toggle("nom-seul", nomSeul);   // étape 269 : sur la page d'accueil, seulement le nom du territoire
  carte.querySelectorAll("path title").forEach(t => t.remove());      // la bulle remplace la petite étiquette du navigateur
  let dernier = null;
  carte.onmousemove = ev => {
    const p = ev.target.closest && ev.target.closest("path[data-nom]");
    if (!p) { bulle.classList.remove("on"); dernier = null; return; }
    const nom = p.dataset.nom;
    if (nom !== dernier && nomSeul) { dernier = nom; bulle.innerHTML = `<div class="bt-texte"><b>${nom}</b></div>`; }
    else if (nom !== dernier) {
      dernier = nom;
      const ouvert = territoiresOuverts().includes(nom), nb = especesDe(nom).length;
      const photo = nb ? photoTerritoire(nom, typeof IDENTITE !== "undefined" ? IDENTITE[nom] : null) : null;
      const m = avantProchainTerritoire();
      const pct = nb ? carnetDe(especesDe(nom)).pctTexte : 0;   // étape 274 : une décimale sous 10 %
      bulle.innerHTML = (photo && photo.fichier ? `<img src="${photo.fichier}" alt="" onerror="this.remove()">` : "")
        + `<div class="bt-texte"><b>${nom}</b>`
        + (!nb ? `<span>à venir</span>`
          : !ouvert ? `<span>${nb} espèces · ${m === null ? "bientôt ouvert" : `s'ouvre dans ${texteManque(m)}`}</span>`
          : `<span class="bt-pct">${pct} %</span><span>de sa nature connue${nom === suivi.territoireActif ? " · vous êtes ici" : ""}</span>`)
        + (ligneEspece ? ligneEspece(nom) : "")
        + `</div>`;
    }
    const r = zone.getBoundingClientRect();
    const x = Math.min(ev.clientX - r.left + 16, Math.max(r.width, 230) - 220);
    const y = ev.clientY - r.top, h = bulle.offsetHeight || (nomSeul ? 34 : 170);
    if (aCote) {                                                       // petite carte : la bulle se met à côté de l'encadré
      bulle.style.left = (r.width + 12) + "px"; bulle.style.top = Math.max(0, Math.min(y - h / 2, r.height - h)) + "px";
      bulle.classList.add("on"); return;
    }
    bulle.style.left = Math.max(0, x) + "px";
    bulle.style.top = (y + 18 + h > r.height ? Math.max(0, y - h - 14) : y + 18) + "px";   // au-dessus de la souris si la place manque
    bulle.classList.add("on");
  };
  carte.onmouseleave = () => { bulle.classList.remove("on"); dernier = null; };
}

// ---- Le texte de progression + une barre par famille, pour le territoire affiché ----
// ---- La progression par famille (étape 27) ------------------------------
// Ce qui compte : le nombre de bonnes réponses dans la famille, quelle que soit l'espèce.
// Chaque case de fiche (photo reconnue comprise) compte UNE fois, la première fois qu'elle
// est trouvée : répéter une question déjà réussie ne fait pas avancer l'anneau.
// Les paliers sont une PART des cases de la famille : ils restent justes pour une petite
// famille comme pour une grande, et suivent tout seuls quand on ajoute des espèces.
const PALIERS_FAMILLE = [0.20, 0.45, 0.80];       // bronze à 20 %, argent à 45 %, or à 80 %
// Le nom de chaque rang, affiché au joueur (étape 36). Les métaux restent la COULEUR de la
// silhouette ; pour une espèce on parle de médaille, pour une famille on parle de rang.
const RANGS_FAMILLE = ["", "Curieux", "Connaisseur", "Spécialiste"];

// Étape 202 (18/10, chantier 3) : la famille se compte en ESPÈCES et en MÉDAILLES, plus en cases trouvées.
//   Chaque espèce vaut 4 points : identifiée = 1, puis + 1 par médaille (bronze, argent, or).
//   Les rangs gardent leurs seuils (PALIERS_FAMILLE). Une découverte ou une médaille fait donc bouger la famille.
function progresFamille(especes) {
  let total = 0, trouvees = 0, especesId = 0, medailles = 0;
  for (const e of especes) {
    total = total + 1 + NB_NIVEAUX;
    // Étape M20 : une espèce compte quand elle est rencontrée (comme dans l'encyclopédie). Avant, une espèce sans photo
    //   (« photo à venir ») comptait d'office : Mammifères 2/58 sur l'accueil et en fin de partie, 0/58 dans l'encyclopédie.
    if (estReconnue(e)) { especesId++; trouvees++; }
    const m = niveauTermine(e);
    medailles += m; trouvees += m;
  }
  const part = total ? trouvees / total : 0;                        // entre 0 et 1
  const palier = PALIERS_FAMILLE.filter(p => part >= p).length;     // 0, 1, 2 ou 3 paliers atteints
  return { total, trouvees, part, palier, especesId, nb: especes.length, medailles };
}
// Étape 202 : la prochaine médaille d'une espèce — son niveau, et combien de traits manquent encore
function prochaineMedaille(espece) {
  if (!estIdentifiee(espece)) return null;
  const niveau = niveauTermine(espece) + 1;
  if (niveau > NB_NIVEAUX) return null;
  const champs = champsDuNiveau(espece, niveau);
  const manque = champs.filter(c => nbBonnes(espece, c) === 0).length;
  return { niveau, manque, total: champs.length };
}

// La silhouette au centre de chaque anneau, tracée en SVG dans un carré de 48 sur 48.
const SILHOUETTES = {
  "Mammiferes": `<path d="M10 24 C13 20 20 20 27 20.5 C30 20.5 32 19 33.5 16 L35 12.5 C36 11 38.5 11 40 12.5 L43.5 16.5 L42.5 18.3 L39.5 18.6 C38.5 22 38 25 36 27.5 L36.5 40.5 L34 40.5 L33 30.5 L31.5 30.8 L31 40.5 L28.5 40.5 L28.3 31 L21 31.2 L20.5 40.5 L18 40.5 L17.2 32 L15.8 32 L14.5 40.5 L12 40.5 L12.2 31 C10 29 9 26.5 10 24 Z"/><path d="M10.5 23.5 L8 21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M37 11.5 C37 6 33 3.5 28.5 5.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>`,   // bouquetin
  "Oiseaux":    `<path d="M3 19 C11 13.5 18.5 15.5 24 22 C29.5 15.5 37 13.5 45 19 C38.5 18.5 32 21 27.5 27.5 L30 35 L24 32 L18 35 L20.5 27.5 C16 21 9.5 18.5 3 19 Z"/><path d="M24 22 L24 17.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`,   // oiseau en vol
  "Amphibiens": `<path d="M24 8 C27 8 28.5 10.5 28 13 C30 17 30 24 27.5 29 C26 33 27 37 31 39 C34 40.5 36 43 34.5 44.5 C31 44 26 42 24.5 37.5 C23 34 22.5 31 21.5 28 C19 23 19 17 20.5 13 C19.5 10.5 21 8 24 8 Z"/><path d="M21 16 L14.5 13 L12.5 9.5 M27.5 16 L34 13 L36 9.5 M21.5 27.5 L15 30.5 L13 35 M27.5 27.5 L33.5 28.5 L37 26" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`,   // salamandre
  "Reptiles":   `<path d="M9 39 C22 40 29 33 20 27.5 C10 21.5 15 11.5 26 13 C33 14 33 21 38 21.5" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><ellipse cx="39.5" cy="21.2" rx="4.6" ry="3.4" transform="rotate(-12 39.5 21.2)"/>`,   // serpent
  "Poissons":   `<path d="M5 24 C11 14.5 26 13 34.5 22 L43.5 15 L41.5 24 L43.5 33 L34.5 26 C26 35 11 33.5 5 24 Z"/><path d="M17 16.2 L24.5 10.5 L27.5 16.6 Z"/><circle cx="12.5" cy="22.5" r="1.5" fill="var(--carte)"/>`,   // poisson
  "Insectes":   `<path d="M24 22 C20 12 9 8 6.5 13 C4.5 18 12 24 22.5 24.5 Z M24 22 C28 12 39 8 41.5 13 C43.5 18 36 24 25.5 24.5 Z M23 26 C15 26 9.5 31 12 36 C14.5 40 21 36 23.5 28 Z M25 26 C33 26 38.5 31 36 36 C33.5 40 27 36 24.5 28 Z"/><path d="M24 16 L24 36" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M24 16 C22.5 12 20.5 10 18.5 9.5 M24 16 C25.5 12 27.5 10 29.5 9.5" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>`,   // papillon
  // Étape 121 : araignée, crabe, escargot, ver (même grille de 48 × 48, traits ronds)
  "Araignees_mille_pattes": `<ellipse cx="24" cy="29.5" rx="6.5" ry="8"/><circle cx="24" cy="18.5" r="4.5"/><path d="M20.5 16.5 L13 10 L9 13.5 M20 19.5 L10 17 L4.5 21.5 M20.5 23 L11.5 27.5 L7.5 34 M21 26.5 L14.5 35 L12.5 42 M27.5 16.5 L35 10 L39 13.5 M28 19.5 L38 17 L43.5 21.5 M27.5 23 L36.5 27.5 L40.5 34 M27 26.5 L33.5 35 L35.5 42" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`,   // araignée
  "Crustaces":              `<ellipse cx="24" cy="29" rx="11" ry="7.5"/><path d="M15 25 C11 21 9.5 18 10 15 M33 25 C37 21 38.5 18 38 15 M14 30 L6.5 31 L4 35 M14.5 33.5 L8 37 L6.5 41 M34 30 L41.5 31 L44 35 M33.5 33.5 L40 37 L41.5 41" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.5 13 C5 8 8.5 5 12 6.5 L10.5 10.5 L14.5 9.5 C15.5 13 13 16.5 9.5 16.5 C7.5 16.5 6 15 5.5 13 Z M42.5 13 C43 8 39.5 5 36 6.5 L37.5 10.5 L33.5 9.5 C32.5 13 35 16.5 38.5 16.5 C40.5 16.5 42 15 42.5 13 Z"/><circle cx="20.5" cy="21" r="1.4"/><circle cx="27.5" cy="21" r="1.4"/>`,   // crabe
  "Mollusques":             `<path d="M4 38.5 C9 34.5 20 34 33 35 C38 35.5 42.5 36 43.5 37.5 C44 39 42.5 40 40 40 L8 40.5 C5 40.5 3.5 39.5 4 38.5 Z"/><path d="M9 36 L6.5 28.5 M11.5 35.5 L11 27.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M27 23 C27 21.5 29 21.2 29.6 22.6 C30.6 25 27.8 27.4 25.2 26.6 C21.6 25.5 21.4 20.6 24.4 18.8 C28.6 16.3 33.8 19.4 33.6 24.2 C33.4 29.6 27.4 32.6 22.4 30.6 C16.2 28.1 15.6 19.4 20.4 15.4 C25.8 10.9 35 12.9 37.4 19.6 C39 24.1 37.6 29 34.4 32" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/>`,   // escargot
  "Vers_meduses_compagnie": `<path d="M6 33 C10 24.5 16.5 24 20.5 30.5 C24.5 37 31 37.5 34.5 29 C36.5 24 40 21.5 43 23.5" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><path d="M13 27.5 L14 31.5 M27 34.5 L28.5 30.5" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity=".35"/>`,   // ver
};

function afficherProgression() {
  // Étape 107 : le grand % = la part du carnet remplie (comme sur la page Progression et l'écran de fin).
  // territoireAccueil vaut null quand plusieurs territoires sont ouverts et qu'aucun n'est survolé : on montre alors toute la France.
  const especesZone = territoireAccueil ? especesDe(territoireAccueil) : ESPECES;
  const carnet = carnetDe(especesZone);
  const lieu = territoireAccueil || `France · ${territoiresOuverts().length} territoire${territoiresOuverts().length > 1 ? "s" : ""} ouvert${territoiresOuverts().length > 1 ? "s" : ""}`;   // étape 255
  const nature = territoireAccueil ? deTerritoire(territoireAccueil) : "de France";
  document.getElementById("pourcentage-accueil").innerHTML =
    `<p class="lieu">${lieu}</p><div class="grand">${carnet.pctTexte}<small> %</small></div>`
    + `<p class="phrase">de la nature ${nature} connue · ${especesZone.filter(estReconnue).length} / ${especesZone.length} espèces</p>`;

  // On parcourt la liste CLASSES (partie 10) ; pour chaque famille on fabrique un anneau (étape 27).
  const zone = document.getElementById("familles-accueil");
  zone.innerHTML = "";
  for (const cle in CLASSES) {
    const especes = especesZone.filter(e => e.onglet === cle);
    if (especes.length === 0) continue;                 // famille absente de ce territoire : on saute
    const reconnues = especes.filter(estReconnue).length;
    const f = progresFamille(especes);                  // bonnes réponses, part trouvée, palier atteint
    const metal = MEDAILLES[f.palier];                  // "", "bronze", "argent" ou "or"

    // L'anneau : un cercle gris, et par-dessus un arc de la couleur de la famille.
    // stroke-dasharray = "longueur dessinée, longueur vide" : on dessine la part trouvée du tour.
    const tour = 2 * Math.PI * 20;                      // longueur du cercle (rayon 20)
    const arc = f.trouvees > 0
      ? `<circle class="arc" cx="26" cy="26" r="20" stroke-dasharray="${tour * f.part} ${tour}" transform="rotate(-90 26 26)"/>`
      : "";

    const bouton = document.createElement("button");
    bouton.className = "anneau-famille " + metal;
    bouton.style.setProperty("--couleur-classe", CLASSES[cle].couleur);
    // Le détail au survol : bonnes réponses, palier atteint, prochain palier
    const prochain = f.palier < PALIERS_FAMILLE.length
      ? ` · prochain rang : ${RANGS_FAMILLE[f.palier + 1]} à ${Math.round(PALIERS_FAMILLE[f.palier] * 100)} %`
      : "";
    bouton.title = `${CLASSES[cle].nom} : ${f.especesId} / ${f.nb} espèces identifiées, ${f.medailles} palier${f.medailles > 1 ? "s" : ""} d'espèce (${Math.round(f.part * 100)} %)`
                 + (metal ? ` · ${RANGS_FAMILLE[f.palier]}` : "") + prochain;
    bouton.innerHTML = `
      <svg viewBox="0 0 52 52" aria-hidden="true">
        <circle class="fond" cx="26" cy="26" r="20"/>
        ${arc}
        <g class="silhouette" transform="translate(13.5 13.5) scale(0.52)">${SILHOUETTES[cle] || ""}</g>
      </svg>
      <span class="texte-famille-accueil">
        <span class="nom-famille-accueil">${CLASSES[cle].nom}</span>
        ${metal ? `<small class="rang">${RANGS_FAMILLE[f.palier]}</small>` : ""}
        <small>${reconnues} / ${especes.length} espèces</small>
        ${territoireAccueil && records[territoireAccueil + "|" + cle] ? dessinEtoiles(records[territoireAccueil + "|" + cle].etoiles) : ""}
      </span>`;   // étape 126 : tout le texte dans un seul bloc, pour pouvoir le placer à droite de l'anneau
    // Un clic sur l'anneau : on règle le filtre de l'Encyclopédie sur cette famille, puis on y va.
    bouton.onclick = () => { filtreClasse = cle; montrer("encyclopedie"); };
    zone.appendChild(bouton);
  }
}

function afficherAccueil() {
  // Un seul territoire à jouer (aujourd'hui, les Alpes) : c'est lui qu'on montre.
  // Plusieurs : on montre toute la France, et le territoire survolé (étape 107).
  const jouables = tousLesTerritoires();
  territoireAccueil = jouables.length === 1 ? jouables[0] : null;
  // Étape 258 : la carte, la progression et les découvertes sont sur la page carte (afficherPageCarte) : plus calculées ici
  dessinerAccueilJouer();             // étape 196 : le terrain, Plus de jeux, Vos familles (étape 252 : avant le reste, il fixe le territoire)
  dessinerCouverture();               // étape 252 : la carte d'identité du territoire (15_territoire.js)
  afficherAccueilVivant();            // étape 178 : espèce du jour, En ce moment, Prochains pas
  afficherStats();                    // la pastille du haut toujours à jour
  if (avantProchainTerritoire() === 0) setTimeout(verifierOuverture, 300);   // étape 254 : palier déjà atteint → le territoire s'ouvre (avec sa fête)
}

// ==================================================================
// 9 ter. L'ACCUEIL « UN SEUL BOUTON » (étape 196, 17/10 — maquette B v2)
//   • « Jouer » lance une partie de 10 questions composée par le jeu (voir lancerJouer) ;
//   • le terrain = les territoires et les familles choisis ; « Changer de terrain » ouvre l'écran de choix ;
//   • « Plus de jeux » : Rencontre, Duel, Espèce mystère, Portrait-robot, lancés directement sur le terrain ;
//   • « Vos familles » : un anneau par famille du terrain (rang Curieux / Connaisseur / Spécialiste).
// ==================================================================
const JEUX_ACCUEIL = ["rencontre", "plus", "indices", "portrait"];
const PHRASES_JEUX = { rencontre: "Une espèce, en profondeur", plus: "Deux espèces, un chiffre à comparer",
                       indices: "Retrouver une espèce par indices", portrait: "Ses traits, sans sa photo" };
let lancementDirect = false;         // vrai pendant qu'un jeu se lance depuis l'accueil (l'écran Jouer n'est alors pas un choix de terrain)
let modeTerrain = false;             // l'écran Jouer sert à choisir le terrain (étape 196)
// Étape 198 (18/10) : tout est sélectionné de base (tous les territoires, toutes les familles),
// tant que le joueur n'a pas validé lui-même un autre terrain avec « Changer… »
var terrainPerso = false;
// Étape 202 : les espèces visées « presque médaillées » pendant la dernière partie Jouer (elles laissent passer une partie)
var derniereCibles = [], ciblesPartiePrecedente = [];

// Le terrain du joueur : ses territoires et ses familles (les mêmes variables que l'ancien écran Jouer)
function terrainDefi() {
  // Étape 252 : un territoire à la fois — les jeux ne posent que des espèces du territoire où l'on est
  // Étape 253 : toutes ses familles (le choix des familles est réservé à l'onglet « Plus de jeux »)
  territoiresDefi = [territoireActif()];
  territoiresChoisis = territoiresDefi.slice();                        // (la Rencontre et les objectifs lisent celui-ci)
  return construireDefi(territoiresDefi, famillesDe(territoiresDefi));
}
// La petite carte du terrain : les territoires choisis à leur couleur, les autres en gris
function dessinMiniCarte(choisis) {
  if (typeof CARTE_TERRITOIRES === "undefined") return "";
  return `<svg viewBox="${CARTE_CADRE}" aria-hidden="true">` + CARTE_TERRITOIRES.map(t => {
    const couleur = choisis.includes(t.nom) ? (TERRITOIRES[t.nom] || {}).couleur || "#7a736a" : especesDe(t.nom).length ? "#d9d0c2" : "#e9e3d8";
    return `<path d="${t.contour}" fill="${couleur}" stroke="#fbf8f2" stroke-width="6"/>`;
  }).join("") + `</svg>`;
}
function dessinerAccueilJouer() {
  const d = terrainDefi();
  const T = territoiresDefi, F = d ? [...new Set(d.especes.map(e => e.onglet))] : [];
  const toutes = famillesDe(T).length === F.length;
  // Le terrain (étape 198) : le nombre de territoires et de familles, et « Changer… »
  const zoneT = document.getElementById("ac-terrain");
  const nbF = F.length;
  zoneT.innerHTML = dessinMiniCarte(T) + `<div><h3>${T.join(", ")}</h3>`   // étape 252 : le territoire où l'on est
    + `<p>${nbF} famille${nbF > 1 ? "s" : ""} · ${d ? d.especes.length : 0} espèces</p>`
    + ((m => m === null ? "" : `<p class="prochain-terr" title="${PHRASE_OUVERTURE}">Prochain territoire : encore ${texteManque(m)}</p>`)(avantProchainTerritoire()))   // étapes 209-210
    + `<button class="lien-terrain" id="changer-terrain">Options</button></div>`;
  document.getElementById("changer-terrain").onclick = () => montrer("jouer");
  // Étape 258 : « Plus de jeux » et « Vos familles » ne sont plus sur l'accueil (étape 253) : on ne les calcule plus
  if (document.getElementById("ac-jeux").closest(".cache")) return;
  // Plus de jeux
  const zoneJ = document.getElementById("ac-jeux");
  zoneJ.innerHTML = JEUX_ACCUEIL.map(cle => {
    const etat = possibiliteJeu(cle, d);
    return `<button class="ac-jeu${etat.possible ? "" : " grise"}" data-jeu="${cle}"><span class="medaillon-jeu">${picto(cle)}</span>`
      + `<b>${JEUX[cle].nom}</b><small>${etat.possible ? PHRASES_JEUX[cle] : conditionJeu(cle, etat)}</small></button>`;
  }).join("");
  zoneJ.querySelectorAll(".ac-jeu").forEach(b => b.onclick = () => { if (!b.classList.contains("grise")) lancerJeuDirect(b.dataset.jeu); });
  // Vos familles
  const zoneF = document.getElementById("ac-familles");
  const dansT = ESPECES.filter(e => estDans(e, T));
  zoneF.innerHTML = famillesDe(T).map(cle => {
    const f = progresFamille(dansT.filter(e => e.onglet === cle));
    return `<button class="ac-famille ${MEDAILLES[f.palier]}" data-famille="${cle}" style="--couleur-classe:${CLASSES[cle].couleur}"`
      + ` title="${CLASSES[cle].nom} · ${Math.round(100 * f.part)} %${f.palier ? ` · ${RANGS_FAMILLE[f.palier]}` : ""}">`
      + `${dessinAnneau(cle, f)}<b class="compte-famille">${f.especesId} / ${f.nb}</b>${CLASSES[cle].nom}</button>`;
  }).join("");
  zoneF.querySelectorAll(".ac-famille").forEach(b => b.onclick = () => { ongletProfil = "familles"; montrer("progression"); });
}
// Lancer un jeu directement, sur le terrain du joueur
function lancerJeuDirect(cle, reglages = {}) {
  depuisArcade = false; modeLibre = false;             // étape 262 : la fin de partie revient à l'accueil
  document.getElementById("bouton-territoire-defi").textContent = "Retour au territoire";   // étape 274
  const d = terrainDefi();
  if (!d) { afficherBulle("Rien à jouer sur ce terrain"); return; }
  jeuChoisi = cle;
  if (cle === "revision") { revisionsSeules = !!reglages.revisionsSeules; photosSeules = false; questionsClassique = QUESTIONS_REVISION; }
  const etat = possibiliteJeu(cle, d);
  if (!etat.possible) { afficherBulle(conditionJeu(cle, etat)); return; }
  lancementDirect = true;
  montrer("jouer");
  lancementDirect = false;
  demarrerDefi(d, reglages.jouer ? { jouer: true } : {});
}
// « Jouer » : le Carnet de terrain, réglé une fois pour toutes (10 questions, ou 60 secondes avec le chronomètre),
// avec 1 ou 2 manches de petit jeu glissées dedans (Duel, Portrait-robot)
function lancerJouer() { lancerJeuDirect("revision", { jouer: true }); }


// ==================================================================
// 9 bis. L'ACCUEIL VIVANT (étape 178, 13/10 — maquette « entre-deux 2 »)
//   Tout est calculé à partir du tableur et de la progression : rien à écrire ni à mettre à jour.
//   • L'espèce du jour : la même toute la journée, une autre le lendemain (tirée à partir de la date).
//     Encore inconnue du joueur : photo floutée, nom caché, « La rencontrer » lance une Rencontre sur elle.
//   • En ce moment : 3 événements de la SAISON en cours (reproduction, hibernation, pelage d'hiver),
//     tirés chaque jour parmi ceux du tableur. Si une colonne « phrase_saison » existe un jour, elle est utilisée.
//   • Prochains pas : 2 objectifs tout proches (une médaille, des réponses à revoir, un badge…).
// ==================================================================
// Un nombre fixe pour la journée : « 2026-10-13 » → 20261013. Le même toute la journée, un autre demain.
function graineDuJour() { return Number(aujourdhui().replaceAll("-", "")); }
// Un tirage « au hasard » mais toujours le même pour une même graine (pour que l'accueil ne change pas à chaque visite)
function hasardFixe(graine) { let x = graine % 2147483647; return () => (x = x * 16807 % 2147483647) / 2147483647; }
function melangerFixe(liste, graine) {
  const h = hasardFixe(graine), copie = liste.slice();
  for (let i = copie.length - 1; i > 0; i--) { const j = Math.floor(h() * (i + 1)); [copie[i], copie[j]] = [copie[j], copie[i]]; }
  return copie;
}
function saisonActuelle() { return saisonDe(aujourdhui()); }        // "printemps", "été", "automne", "hiver"
const estNombre = v => typeof v === "number" && v > 0;
// Deux chiffres marquants, pris dans le tableur (seulement des cases remplies avec un nombre)
function chiffresMarquants(e) {
  const c = [];
  if (estNombre(e.envergure_max_cm)) c.push(`${nombre(Math.round(e.envergure_max_cm) / 100)} m d'envergure`);
  if (estNombre(e.vitesse_max_kmh)) c.push(`jusqu'à ${nombre(e.vitesse_max_kmh)} km/h`);
  if (estNombre(e.saut_longueur_max_m)) c.push(`des bonds de ${nombre(e.saut_longueur_max_m)} m`);
  if (estNombre(e.altitude_vol_max_m)) c.push(`vole jusqu'à ${nombre(e.altitude_vol_max_m)} m d'altitude`);
  if (estNombre(e.longevite_max_annees)) c.push(`jusqu'à ${nombre(e.longevite_max_annees)} ans`);
  return c.slice(0, 2);
}
// La phrase de l'espèce du jour : ses chiffres, puis son atout (première particularité physique)
function phraseDuJour(e) {
  const chiffres = chiffresMarquants(e);
  const atout = estRenseigne(e.adaptations_physiques) ? String(e.adaptations_physiques).split(";")[0].trim() : "";
  return [chiffres.length ? majuscule(chiffres.join(", ")) + "." : "", atout ? `Son atout : ${atout}.` : ""].filter(Boolean).join(" ");
}
function especesJouables() { return ESPECES.filter(e => estRenseigne(e.photo)); }
function especeDuJour() {
  // Étape 265 : l'espèce du jour n'est plus que sur la page d'accueil générale (la carte) : elle vient des territoires ouverts
  //   (étape 252 : elle venait du territoire où l'on est, quand elle était sur sa page)
  const ouverts = territoiresOuverts(), toutes = especesJouables(), ici = toutes.filter(e => territoiresJeu(e).some(x => ouverts.includes(x)));
  const liste = ici.length ? ici : toutes;
  if (!liste.length) return null;
  // Étape 212 : une fois rencontrée (Rencontre finie), l'espèce du jour laisse la place à une autre
  const faites = (suivi.duJour && suivi.duJour.date === aujourdhui()) ? suivi.duJour.faites : [];
  const ordre = melangerFixe(liste, graineDuJour());
  return ordre.find(e => !faites.includes(e.nom_courant)) || ordre[0];
}
function dessinerEspeceDuJour(idZone = "ac-jour") {   // étape M4 : aussi dans l'accueil du téléphone (ac-jour-mobile)
  const zone = document.getElementById(idZone), e = especeDuJour();
  const idR = idZone === "ac-jour" ? "ac-rencontrer" : idZone + "-rencontrer", idF = idZone === "ac-jour" ? "ac-fiche" : idZone + "-fiche";
  if (!zone) return;
  if (!e) { zone.classList.add("cache"); return; }
  const connue = estReconnue(e);
  // Étape 239 : si une anecdote est débloquée (médaille gagnée), elle remplace la phrase de chiffres — la plus récente
  const anecdote = connue && typeof anecdotesGagnees === "function" ? anecdotesGagnees(e)[0] : null;
  const statut = estRenseigne(e.statut_conservation_france) && !/mineure|non évalué|insuffisantes/i.test(e.statut_conservation_france)
    ? `<span class="ac-statut">${e.statut_conservation_france} en France</span>` : "";
  zone.className = "ac-jour" + (connue ? "" : " inconnue");
  const image = connue ? celluleImage(e) : celluleImage(e).replace(`alt="${e.nom_courant}"`, 'alt=""');   // inconnue : son nom ne doit pas apparaître
  zone.innerHTML = `<div class="ph">${image}</div><div class="corps">
      <div class="ac-etiquette">Espèce du jour · ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}</div>
      <h2>${connue ? e.nom_courant : "Une espèce à découvrir"}</h2>${statut}
      ${anecdote ? `<p class="ac-anecdote"><b>Le saviez-vous ?</b> ${anecdote.texte}</p>` : `<p>${phraseDuJour(e) || (connue ? "" : "Elle n'est pas encore dans votre carnet.")}</p>`}
      <div class="ac-boutons"><button class="ac-bouton plein" id="${idR}">${connue ? "La retrouver en Rencontre" : "La rencontrer"}</button>
      ${connue ? `<button class="ac-bouton" id="${idF}">Sa fiche</button>` : ""}</div></div>`;
  document.getElementById(idR).onclick = () => { lancerRencontreAvec(e); rencontreDuJour = e.nom_courant; };
  if (connue) document.getElementById(idF).onclick = () => ouvrirPageEspece(e);
}

// ---- En ce moment ----
// Chaque événement : l'espèce, un titre, une petite ligne. On ne prend que ce que le tableur dit pour la saison en cours.
function evenementsDeSaison(saison) {
  const ev = [];
  const contient = (v, mot) => String(v || "").toLowerCase().includes(mot);
  for (const e of especesJouables()) {
    if (estRenseigne(e.phrase_saison) && contient(e.saison_phrase || e.saison_reproduction, saison)) {   // colonne facultative (plus tard)
      ev.push({ e, titre: e.nom_courant, ligne: e.phrase_saison }); continue;
    }
    if (contient(e.saison_reproduction, saison)) {
      const p = String(e.nom_periode_reproduction || "");
      const nom = /^brame/i.test(p) ? "le brame" : /^rut/i.test(p) ? "le rut" : /^parade/i.test(p) ? "les parades" : "la saison des amours";
      ev.push({ e, titre: `${e.nom_courant} : ${nom}`, ligne: `Sa saison de reproduction : ${minuscule(e.saison_reproduction)}` });
    }
    if (e.hibernation === "Oui" && (saison === "hiver" || saison === "automne")) {
      // le détail du tableur seulement s'il dit combien de temps (« environ 6 mois (octobre-mars) »)
      const detail = estRenseigne(e.hibernation_detail) && /mois|octobre|novembre|avril|mars/i.test(e.hibernation_detail) ? minuscule(e.hibernation_detail) : "";
      ev.push({ e, titre: `${e.nom_courant} : ${saison === "hiver" ? "l'hibernation" : "bientôt l'hibernation"}`, ligne: detail || "un long sommeil d'hiver" });
    }
    if (estRenseigne(e.pelage_saisonnier) && !/^NA/.test(e.pelage_saisonnier) && (saison === "hiver" || saison === "automne")) {
      const hiver = String(e.pelage_saisonnier).split(/[,;]/).find(m => /hiver/i.test(m));
      if (hiver) ev.push({ e, titre: `${e.nom_courant} : ${saison === "hiver" ? "l'habit d'hiver" : "bientôt l'habit d'hiver"}`, ligne: minuscule(hiver.trim()) });
    }
  }
  return ev;
}
// Étape 280 (25/10) : « En ce moment » n'est plus affiché sur la page du territoire (gardé pour une V2,
// comme l'enjeu) : la page doit mettre en avant le jeu. Remettre ce réglage à true pour le faire revenir.
const AFFICHER_EN_CE_MOMENT = false;
function dessinerEnCeMoment() {
  const zone = document.getElementById("ac-saison"), titre = document.getElementById("titre-saison");
  if (!zone) return;
  if (!AFFICHER_EN_CE_MOMENT) { zone.classList.add("cache"); if (titre) titre.classList.add("cache"); return; }
  const saison = saisonActuelle();
  const tous = melangerFixe(evenementsDeSaison(saison), graineDuJour() + 7);
  // 3 événements d'espèces différentes, dont au plus 1 encore inconnue (montrée floutée, sans son nom)
  const choisis = [];
  for (const x of tous) {
    if (choisis.length >= 3) break;
    if (choisis.some(c => c.e === x.e)) continue;
    if (!estReconnue(x.e) && choisis.some(c => !estReconnue(c.e))) continue;
    choisis.push(x);
  }
  titre.textContent = `En ce moment · ${saison}`;
  titre.classList.toggle("cache", !choisis.length);
  zone.classList.toggle("cache", !choisis.length);
  zone.innerHTML = choisis.map((x, i) => {
    const connue = estReconnue(x.e);
    // Inconnue : on garde ce qui se passe (« le rut », « l'habit d'hiver »…) mais pas le nom
    const titreCarte = connue ? x.titre : `Une espèce à découvrir : ${x.titre.split(" : ")[1] || "en jouant"}`;
    return `<button data-i="${i}" class="${connue ? "" : "inconnue"}"><div class="ph">${connue ? celluleImage(x.e, true) : celluleImage(x.e, true).replace(`alt="${x.e.nom_courant}"`, 'alt=""')}</div>
      <div class="corps"><b>${titreCarte}</b><small>${connue ? majuscule(x.ligne) : "À découvrir en jouant."}</small></div></button>`;
  }).join("");
  zone.querySelectorAll("button").forEach(b => b.onclick = () => {
    const e = choisis[b.dataset.i].e;
    if (estReconnue(e)) ouvrirPageEspece(e); else lancerRencontreAvec(e);
  });
}

function badgeProche() {
  let meilleur = null;
  for (const b of tousLesBadges()) {
    const seuil = prochainSeuil(b);
    if (seuil === null) continue;
    if (b.cle === "voyageur" && territoiresOuverts().length < 2) continue;   // étape PR3   // impossible tant qu'un seul territoire est ouvert
    if (b.territoire && !territoiresOuverts().includes(b.territoire)) continue;   // étape 212 : territoire pas encore ouvert
    const part = b.mesure() / seuil;
    if (part >= 0.5 && part < 1 && (!meilleur || part > meilleur.part)) meilleur = { b, part, seuil };
  }
  return meilleur;
}
function afficherAccueilVivant() {
  // (étape 265 : l'espèce du jour est dessinée par la page carte, afficherPageCarte)
  dessinerEnCeMoment();
  dessinerObjectifs();                 // étape 244 : « Vos objectifs » remplace « Prochains pas » (dessinerProchainsPas, gardé)
}

// ---- Étape 244 (22/10) : les objectifs par famille ----
// Trois objectifs à la fois, chacun sur une famille différente, choisis par le jeu dans le terrain du joueur.
// Trois sortes : découvrir de nouvelles espèces, gagner des médailles, trouver des caractéristiques.
// Un objectif note où en était la famille au moment où il est né (depart) : il avance de ce qui est gagné ensuite,
// dans n'importe quel jeu et sur n'importe quel territoire. Pas de limite de temps.
// Un objectif atteint est remplacé par un autre (un mot et une petite bulle en fin de partie, rien de plus).
// Rangés dans la sauvegarde : suivi.objectifs (la liste) et suivi.objectifsAtteints (le nombre).
const NB_OBJECTIFS = 3;
const SORTES_OBJECTIF = {
  decouvrir:  { but: n => Math.min(3, n),
                texte: (f, but) => `découvrez ${but} nouvelle${but > 1 ? "s" : ""} espèce${but > 1 ? "s" : ""}`,
                mesure: f => especesFamille(f).filter(estIdentifiee).length,
                possible: f => especesTerrainFamille(f).filter(e => !estIdentifiee(e)).length },
  medailles:  { but: n => Math.min(2, n),
                texte: (f, but) => `faites franchir ${but} palier${but > 1 ? "s" : ""} à vos espèces`,   // étape R144
                mesure: f => especesFamille(f).reduce((s, e) => s + medailleGagnee(e), 0),
                possible: f => especesTerrainFamille(f).filter(e => estIdentifiee(e) && medailleGagnee(e) < NB_NIVEAUX).length },
  traits:     { but: n => Math.min(8, n),
                texte: (f, but) => `trouvez ${but} caractéristique${but > 1 ? "s" : ""}`,
                mesure: f => especesFamille(f).reduce((s, e) => s + champsDe(e).filter(c => c !== IDENTIFICATION && nbBonnes(e, c) >= 1).length, 0),
                possible: f => especesTerrainFamille(f).filter(estIdentifiee)
                                 .reduce((s, e) => s + champsDe(e).filter(c => c !== IDENTIFICATION && nbBonnes(e, c) === 0 && !estApparence(c)).length, 0) },
};
function especesFamille(f) { return ESPECES.filter(e => e.onglet === f && estRenseigne(e.photo)); }
// Le terrain du joueur : les territoires ouverts (et choisis), les familles choisies
function especesTerrainFamille(f) {
  const ouverts = territoiresOuverts();
  const terr = (territoiresChoisis || []).filter(t => ouverts.includes(t));
  return especesFamille(f).filter(e => estDans(e, terr.length ? terr : ouverts));
}
function famillesDuTerrain() {
  const choisies = classesChoisies && classesChoisies.length ? classesChoisies : Object.keys(CLASSES);
  return choisies.filter(f => especesTerrainFamille(f).length);
}
function nouvelObjectif(dejaLa, eviter = []) {
  // « eviter » : les familles dont l'objectif vient d'être atteint (on change de famille, s'il y a le choix)
  const autres = famillesDuTerrain().filter(f => !dejaLa.some(o => o.famille === f) && !eviter.includes(f));
  if (eviter.length && !autres.length) eviter = [];
  const famillesPrises = [...dejaLa.map(o => o.famille), ...eviter], sortesPrises = dejaLa.map(o => o.sorte);
  const candidats = [];
  for (const f of famillesDuTerrain()) {
    if (famillesPrises.includes(f)) continue;
    for (const sorte in SORTES_OBJECTIF) {
      const s = SORTES_OBJECTIF[sorte], n = s.possible(f);
      if (n < (sorte === "traits" ? 4 : 1)) continue;
      // de préférence une sorte pas encore prise ; découvrir passe d'abord quand il reste beaucoup d'espèces
      const poids = (sortesPrises.includes(sorte) ? 1 : 3) * (sorte === "decouvrir" ? 2 : 1);
      candidats.push({ f, sorte, but: s.but(n), poids });
    }
  }
  if (!candidats.length) return null;
  let alea = Math.random() * candidats.reduce((t, c) => t + c.poids, 0), c = candidats[0];
  for (const x of candidats) { alea -= x.poids; if (alea <= 0) { c = x; break; } }
  return { famille: c.f, sorte: c.sorte, but: c.but, depart: SORTES_OBJECTIF[c.sorte].mesure(c.f), ne: aujourdhui() };
}
function avanceeObjectif(o) {
  const s = SORTES_OBJECTIF[o.sorte];
  return s ? Math.max(0, Math.min(o.but, s.mesure(o.famille) - o.depart)) : 0;
}
function texteObjectif(o) {
  return `${CLASSES[o.famille] ? CLASSES[o.famille].nom : o.famille} : ${SORTES_OBJECTIF[o.sorte].texte(o.famille, o.but)}`;
}
// Remet la liste à jour : retire les objectifs atteints (rendus dans la réponse) et complète jusqu'à 3.
// Un objectif devenu impossible (famille retirée du terrain…) est remplacé aussi, sans être compté comme atteint.
function verifierObjectifs() {
  if (!profil || !suivi) return [];
  suivi.objectifs = (suivi.objectifs || []).filter(o => SORTES_OBJECTIF[o.sorte] && CLASSES[o.famille]);
  const atteints = suivi.objectifs.filter(o => avanceeObjectif(o) >= o.but);
  const familles = famillesDuTerrain();
  suivi.objectifs = suivi.objectifs.filter(o => !atteints.includes(o) && familles.includes(o.famille));
  suivi.objectifsAtteints = (suivi.objectifsAtteints || 0) + atteints.length;
  while (suivi.objectifs.length < NB_OBJECTIFS) {
    const o = nouvelObjectif(suivi.objectifs, atteints.map(x => x.famille)) || nouvelObjectif(suivi.objectifs);
    if (!o) break;
    suivi.objectifs.push(o);
  }
  sauvegarder();
  return atteints;
}
// L'espèce à proposer pour avancer : une Rencontre bien choisie dans la famille
function especePourObjectif(o) {
  const terrain = especesTerrainFamille(o.famille);
  if (o.sorte === "decouvrir") return especesADecouvrir(terrain, 1)[0] || null;
  const connues = terrain.filter(estIdentifiee);
  if (o.sorte === "medailles") {
    const avecMed = connues.map(e => ({ e, pm: prochaineMedaille(e) })).filter(x => x.pm);
    avecMed.sort((a, b) => a.pm.manque - b.pm.manque);
    return avecMed.length ? avecMed[0].e : null;
  }
  const manque = e => champsDe(e).filter(c => c !== IDENTIFICATION && nbBonnes(e, c) === 0 && !estApparence(c)).length;
  const tri = connues.filter(e => manque(e) > 0).sort((a, b) => manque(b) - manque(a));
  return tri.length ? auHasard(tri.slice(0, 5)) : null;
}
// Étape 281 (25/10) : « Vos objectifs » (par famille) n'est plus affiché : les défis du jour du territoire le remplacent
// (15_territoire.js). Le code reste, pour plus tard : remettre ce réglage à true.
const AFFICHER_OBJECTIFS = false;
function dessinerObjectifs() {
  const zone = document.getElementById("ac-pas");
  if (!zone) return;
  if (!AFFICHER_OBJECTIFS) { zone.classList.add("cache"); const ti = document.getElementById("titre-objectifs"); if (ti) ti.classList.add("cache"); return; }
  verifierObjectifs();
  const liste = suivi.objectifs || [];
  const titre = document.getElementById("titre-objectifs");      // (absent de jeu_ancien.html)
  if (titre) titre.classList.toggle("cache", !liste.length);
  zone.innerHTML = liste.map((o, i) => {
    const fait = avanceeObjectif(o), couleur = CLASSES[o.famille] ? CLASSES[o.famille].couleur : "var(--territoire)";
    const reste = o.but - fait;
    return `<div style="--couleur-famille:${couleur}"><span class="rond objectif"><svg viewBox="0 0 48 48">${SILHOUETTES[o.famille] || ""}</svg></span>`
      + `<div>${texteObjectif(o)}<small>${fait} / ${o.but} · encore ${reste}</small>`
      + `<span class="jauge-objectif"><i style="width:${Math.round(100 * fait / o.but)}%"></i></span></div>`
      + `<button class="ac-bouton" data-i="${i}">Y aller</button></div>`;
  }).join("");
  zone.querySelectorAll("button").forEach(bt => bt.onclick = () => {
    const o = liste[bt.dataset.i], e = especePourObjectif(o);
    if (e) lancerRencontreAvec(e); else lancerJouer();
  });
}
// Le rappel de fin de partie : les objectifs, avec ceux qui viennent d'être atteints en tête
function blocObjectifsFin() {
  if (!profil || !suivi) return "";
  if (!AFFICHER_OBJECTIFS) return typeof blocDefisFin === "function" ? blocDefisFin() : "";   // étape 281
  const avant = (suivi.objectifs || []).slice();
  const atteints = verifierObjectifs();
  if (atteints.length) setTimeout(() => afficherBulle(`✓ Objectif atteint${atteints.length > 1 ? ` (${atteints.length})` : ""}`), 900);
  const encours = avant.filter(o => !atteints.includes(o) && (suivi.objectifs || []).includes(o));
  const lignes = [
    ...atteints.map(o => `<span class="obj-fin atteint">✓ ${texteObjectif(o)}</span>`),
    ...encours.map(o => `<span class="obj-fin">${texteObjectif(o)} · ${avanceeObjectif(o)} / ${o.but}</span>`),
  ];
  if (!lignes.length) return "";
  return `<div class="objectifs-fin"><div class="quoi">Vos objectifs</div><div class="liste-objectifs-fin">${lignes.join("")}</div>`
    + (atteints.length ? `<small>${atteints.length > 1 ? "De nouveaux objectifs vous attendent" : "Un nouvel objectif vous attend"} sur l'accueil.</small>` : "") + `</div>`;
}

// ---- Étape 107 : la liste des territoires sous la carte (quand il y en a plusieurs) ----
function afficherListeTerritoires() {
  const zone = document.getElementById("liste-territoires-accueil");
  const jouables = territoiresOuverts();                              // étape 255 : les territoires ouverts
  if (!jouables.length) { zone.innerHTML = ""; return; }
  const lignes = jouables.map(t => ({ t, pct: carnetDe(especesDe(t)).pct })).sort((a, b) => b.pct - a.pct);
  zone.innerHTML = lignes.map(({ t, pct }) => {
    const couleur = TERRITOIRES[t] ? TERRITOIRES[t].couleur : "var(--territoire)";
    return `<div data-territoire="${t}"><span>${t}</span><span>${pct} %</span><i><b style="width:${pct}%;background:${couleur}"></b></i></div>`;
  }).join("");
  zone.querySelectorAll("[data-territoire]").forEach(ligne => {
    // (étape 262 : le survol d'une ligne ne change plus les chiffres du dessus)
    ligne.onclick = () => { changerTerritoire(ligne.dataset.territoire); montrer("accueil"); };   // étape 255
  });
}


// ---- Étape 107 : les dernières espèces découvertes, qui défilent en bas de l'accueil ----
// Le jeu note la date de chaque découverte (progression[nom].decouverteLe) depuis cette étape :
// les espèces découvertes avant n'ont pas de date et n'apparaissent pas ici.
const DEFILE_MAX = 12;
function quandDecouverte(temps) {
  const jour = d => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const ecart = Math.round((jour(new Date()) - jour(new Date(temps))) / 86400000);   // 86 400 000 ms = un jour
  if (ecart <= 0) return "aujourd'hui";
  if (ecart === 1) return "hier";
  return new Date(temps).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}
function afficherDefile() {
  const zone = document.getElementById("defile-accueil");
  const datees = ESPECES.filter(e => progression[e.nom_courant] && progression[e.nom_courant].decouverteLe && estReconnue(e))
    .sort((a, b) => progression[b.nom_courant].decouverteLe - progression[a.nom_courant].decouverteLe)
    .slice(0, DEFILE_MAX);
  zone.classList.toggle("cache", datees.length === 0);
  if (!datees.length) { zone.innerHTML = ""; return; }
  const items = datees.map(e => `<button class="espece-defile" data-nom="${e.nom_courant}" style="--couleur-classe:${classeDe(e).couleur}" title="Ouvrir la page de l'espèce">`
    + `<span class="ph">${celluleImage(e, true)}</span><span>${e.nom_courant}<small>${quandDecouverte(progression[e.nom_courant].decouverteLe)}</small></span></button>`).join("");
  // Avec assez d'espèces, la liste est écrite deux fois à la suite et défile sans fin :
  // quand la première moitié est passée, l'animation repart de zéro sans saut visible.
  const anime = datees.length >= 5;
  zone.innerHTML = `<p class="titre-defile">Dernières espèces découvertes</p>`
    + `<div class="piste${anime ? " anime" : ""}" style="--duree:${datees.length * 4}s">${items}${anime ? items : ""}</div>`;
  zone.querySelectorAll(".espece-defile").forEach(b => b.onclick = () => {
    const espece = ESPECES.find(e => e.nom_courant === b.dataset.nom);
    if (espece) ouvrirPageEspece(espece);
  });
}
