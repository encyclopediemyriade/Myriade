// 06_encyclopedie.js — L'encyclopédie, la page d'une espèce et la page « À propos ».
// Une partie du programme du jeu, chargée par jeu.html dans l'ordre des numéros.

// ==================================================================
// 10. L'ENCYCLOPÉDIE (restructurée à l'étape 11)
//       • une couleur de cadre par classe (mammifères, oiseaux…)
//       • des filtres en haut de page : "Toutes" par défaut
//       • un encart simple par espèce : photo, nom, nom ludique, nom scientifique
//       • la fiche détaillée apparaît au survol, dans une petite fenêtre flottante
// ==================================================================

// Les classes : la clé est le nom de l'onglet Excel ; "nom" est ce qu'on affiche.
// Pour changer une couleur, il suffit de modifier son code ici.
const CLASSES = {
  "Mammiferes": { nom: "Mammifères", couleur: "#a0694a" },   // brun-roux
  "Oiseaux":    { nom: "Oiseaux",    couleur: "#4f7fa3" },   // bleu ciel
  "Amphibiens": { nom: "Amphibiens", couleur: "#5f8f5a" },   // vert mousse
  "Reptiles":   { nom: "Reptiles",   couleur: "#a08a34" },   // ocre
  "Poissons":   { nom: "Poissons",   couleur: "#3f8f8f" },   // bleu-vert
  "Insectes":   { nom: "Insectes",   couleur: "#8a5f8f" },   // prune
  // Étape 121 : les 4 familles d'invertébrés (Règle n°12 : 10 familles en tout pour les animaux)
  "Araignees_mille_pattes": { nom: "Araignées et mille-pattes", couleur: "#5d607a" },   // ardoise
  "Crustaces":              { nom: "Crustacés",                 couleur: "#bf6a4c" },   // corail
  "Mollusques":             { nom: "Mollusques",                couleur: "#7c8a4a" },   // olive
  "Vers_meduses_compagnie": { nom: "Vers, méduses et compagnie", couleur: "#b06f80" },  // vieux rose
};
function classeDe(espece) {
  return CLASSES[espece.onglet] || { nom: espece.onglet, couleur: "#7a736a" };   // secours : gris
}

// Le dessin d'une petite médaille (étape 25) : une feuille dans un cercle fin, tracée en SVG.
//   cercle   = le contour rond
//   feuille  = la forme pleine de la feuille
//   nervures = les petits traits clairs à l'intérieur
// "metal" = bronze, argent ou or : le CSS (.medaille.bronze…) lui donne sa couleur.
// Étape R144 : la feuille marque désormais le palier de l'espèce (Croisée, Comprise, Familière), en vert ; "metal" n'est plus lu.
function dessinMedaille(metal, niveau) {
  const nom = `Espèce ${nomPalier(niveau)} : ${SENS_MEDAILLE[niveau] || ""}`;
  return `<svg class="medaille ${CLASSES_PALIER[niveau] || ""}" viewBox="0 0 30 30" role="img" aria-label="${nom}">
            <title>${nom}</title>
            <circle class="cercle" cx="15" cy="15" r="13"/>
            <path class="feuille" d="M15 6 C22 10 22 19 15 24 C8 19 8 10 15 6 Z"/>
            <path class="nervures" d="M15 8.5 V24 M15 13 l3.2 -2.4 M15 13 l-3.2 -2.4 M15 17 l3.6 -2.6 M15 17 l-3.6 -2.6 M15 20.5 l2.6 -1.9 M15 20.5 l-2.6 -1.9"/>
          </svg>`;
}

let bandeauFamilleOuvert = true;  // étape 127 : le bandeau « carte d'identité » de la famille, ouvert au départ
let filtreClasse = "Toutes";      // le filtre choisi ("Toutes" ou un nom d'onglet)
let filtreTerritoire = "Tous";    // étape 207 : « Tous » ou un territoire
const especesDuFiltre = () => filtreTerritoire === "Tous" ? ESPECES : especesDe(filtreTerritoire);
// Étape 100 (J6) : l'option « Découvertes uniquement ». Étape M12 (07/11) : activée par défaut.
let decouvertesSeules = true;

// Le contenu d'UNE carte de l'encyclopédie, et de sa petite fenêtre (details).
// (C'était l'intérieur de la boucle d'afficherEncyclopedie ; sorti tel quel à l'étape 100.)
function carteEncyclopedie(espece, details) {
  const s = statut(espece);
  const couleur = classeDe(espece).couleur;
  // style="--couleur-classe:…" : on donne la couleur à la carte, le CSS s'en sert pour
  // le cadre, le nom ludique et la jauge. tabindex="0" permet d'ouvrir la fiche au clic.
  const debut = `style="--couleur-classe:${couleur}" tabindex="0"`;

  // Les caractéristiques déjà trouvées d'une espèce pas encore identifiée (étape 57) :
  // elles viennent des défis, et se lisent sur sa carte même si l'espèce n'est pas découverte.
  const trouvees = questionsPossibles(espece).filter(q => nbBonnes(espece, q.champ) >= 1);
  const lignesTrouvees = trouvees.map(q => {
    const v = valeurDe(espece, q);
    return `<p class="carac"><span>${q.libelle} :</span> ${q.affichageFiche ? q.affichageFiche(espece, v) : afficherValeur(q, v)}${pointsDonnee(espece, q.champ)}</p>`;
  }).join("");
  const texteTrouvees = `${trouvees.length} caractéristique${trouvees.length > 1 ? "s" : ""} trouvée${trouvees.length > 1 ? "s" : ""}`;

  // Pas encore identifiée : carte verrouillée. Sans rien de trouvé, pas de fiche détaillée ;
  // sinon, la carte dit combien de caractéristiques sont trouvées, et le survol les liste.
  if (s === "inconnue" && typeof estOfferte === "function" && estOfferte(espece)) {   // étape E2-12 : offerte, « à reconnaître »
    return `
      <article class="fiche offerte" ${debut} data-nom="${espece.nom_courant}" data-page="1" title="Ouvrir sa page">
        <div class="photo">${celluleImage(espece, true)}</div>
        <div class="contenu"><h2>${espece.nom_courant}</h2><div class="ludique">À reconnaître</div><div class="scientifique">${estOfferteDepart(espece) ? "Offerte au départ" : "Déjà rencontrée"}</div></div>
      </article>`;
  }
  if (s === "inconnue") {
    if (trouvees.length) details[espece.nom_courant] = `
      <p class="statut">Pas encore identifiée · ${texteTrouvees}</p>
      ${ligneRarete(espece)}
      ${lignesTrouvees}
      <p class="carac inconnu">À identifier pour ouvrir sa fiche.</p>`;
    return `
      <article class="fiche verrouillee" ${debut}${trouvees.length ? ` data-nom="${espece.nom_courant}"` : ""}>
        <div class="photo photo-silhouette"><img src="${fichierSilhouette(espece)}" alt="" loading="lazy" onerror="this.remove()">${dessinRarete(espece)}</div>
        <div class="contenu">
          <div class="ludique">${espece.nom_affichage_groupe}</div>
          <div class="scientifique">${trouvees.length ? texteTrouvees : "Pas encore rencontrée"}</div>
        </div>
      </article>`;
  }

  // Reconnue : encart simple + fiche détaillée (valeur si trouvée, "?" sinon)
  // Les lignes sont rangées par niveau, avec un petit titre pour chacun (étape 25).
  const termine = niveauTermine(espece);      // 0, 1, 2 ou 3 niveaux terminés
  const ouvert  = niveauOuvert(espece);       // le niveau en cours
  let lignes = "";
  for (let niveau = 1; niveau <= NB_NIVEAUX; niveau++) {
    const questions = questionsPossibles(espece).filter(q => niveauMedaille(espece, q) === niveau);
    if (questions.length === 0) continue;     // aucun contenu pour ce niveau : on ne l'affiche pas
    // Chaque partie de la fiche porte le nom de la médaille qu'elle rapporte (étape 36)
    const etat = niveau <= termine ? "✓" : niveau <= ouvert ? "· en cours" : "· à venir";   // étape R144
    lignes += `<p class="titre-niveau">${PALIERS_ESPECE[niveau]} ${etat}</p>`;
    for (const q of questions) {
      if (nbBonnes(espece, q.champ) >= 1) {
        // "affichageFiche" : quand la fiche doit en dire un peu plus que le bouton de réponse (la taille)
        const v = valeurDe(espece, q);
        const texte = q.affichageFiche ? q.affichageFiche(espece, v) : afficherValeur(q, v);
        lignes += `<p class="carac"><span>${q.libelle} :</span> ${texte}${pointsDonnee(espece, q.champ)}</p>`;
      } else {
        lignes += `<p class="carac inconnu"><span>${q.libelle} :</span> ?</p>`;
      }
    }
  }
  // La médaille, posée à droite du nom : aucune tant que le niveau 1 n'est pas terminé.
  const medaille = termine >= 1 ? dessinMedaille(MEDAILLES[termine], termine) : "";
  // La jauge compte toutes les cases de la fiche (photo reconnue comprise)
  const champs = champsDe(espece);
  const trouves = champs.filter(c => nbBonnes(espece, c) >= 1).length;
  const pourcentage = Math.round(100 * trouves / champs.length);
  const champsFiche = champs.filter(c => c !== IDENTIFICATION), trouvesFiche = champsFiche.filter(c => nbBonnes(espece, c) >= 1).length;   // étape M21
  // Le contenu de la petite fenêtre, gardé de côté pour le survol
  // Étape 105 : la petite fenêtre devient un résumé de progression (le détail est sur la page de l'espèce).
  //   médaille et rareté, jauge globale, une mini-jauge par rubrique, puis les trois niveaux des données.
  const par = rubriquesDe(espece);
  const rubriques = RUBRIQUES_ESPECE.filter(r => par[r.cle]).map(r => {
    const qs = par[r.cle], t = qs.filter(q => nbBonnes(espece, q.champ) >= 1).length;
    return `<div class="survol-rub"><span>${r.nom}</span><span class="survol-jauge"><i style="width:${Math.round(100 * t / qs.length)}%"></i></span><small>${t} / ${qs.length}</small></div>`;
  }).join("");
  const niveaux = [1, 2].map(n => champs.filter(c => niveauDonnee(espece, c) === n).length);
  details[espece.nom_courant] = `
    <h3>${espece.nom_courant}</h3>
    <p class="statut">${termine >= 1 ? NOMS_MEDAILLE[termine] : "Pas encore rencontrée"}${estRenseigne(espece.rarete_observation) ? ` · ${espece.rarete_observation}` : ""}</p>
    <div class="survol-global"><span class="survol-jauge"><i style="width:${pourcentage}%"></i></span><small>${trouvesFiche} sur ${champsFiche.length} trouvées</small></div>
    <div class="survol-rubriques">${rubriques}</div>
    <p class="survol-niveaux"><span class="niv">${dessinPoints(1)} Découvert ${niveaux[0]}</span><span class="niv">${dessinPoints(2)} Connu ${niveaux[1]}</span></p>
    <p class="survol-lien">Cliquer pour ouvrir sa page</p>`;
  return `
    <article class="fiche${estRare(espece) ? " est-rare" : ""}" ${debut} data-nom="${espece.nom_courant}" data-page="1" title="Ouvrir sa page">
      <div class="photo">${celluleImage(espece, true)}${dessinRarete(espece)}</div>
      <div class="contenu${medaille ? " avec-medaille" : ""}">
        ${medaille}
        <h2>${espece.nom_courant}</h2>
        <div class="ludique">${espece.nom_affichage_groupe}</div>
        <div class="scientifique">${espece.nom_scientifique}</div>
        <div class="jauge"><div style="width:${pourcentage}%"></div></div>
      </div>
    </article>`;
}

// Étape 100 (J6) : l'encyclopédie est rangée PAR FAMILLE (Mammifères, puis Oiseaux…), chacune sous son titre.
// Dans une famille, les espèces restent dans l'ordre du tableur : une espèce découverte ne remonte plus
// en haut de la page (remplace le tri « découvertes d'abord » de l'étape 60).
// Avec l'option « Découvertes uniquement », on ne garde que les espèces identifiées.
// Étape M5 (06/11/2026, choix de l'utilisateur : maquette « Deux onglets ») — sur téléphone, en haut de l'encyclopédie :
// une recherche (parmi les espèces déjà découvertes seulement, pour ne jamais nommer une espèce inconnue) et deux onglets
// « Les espèces » / « Les planches des lieux » (on revient aux espèces d'un geste). Caché sur ordinateur (style.css, étape M5).
let rechercheEncyclo = "", familleAvantPlanches = "Toutes";
// Étape K3 (16/11/2026, choix d'Aubin « 7B ») : les planches « Tout est lié » ne sont plus dans l'Encyclopédie (téléphone et
//   ordinateur) ; les lieux vivent dans la Carte. Une planche se revoit toujours depuis la page de son lieu (bouton de la finale).
const PLANCHES_DANS_ENCYCLO = false;
function dessinerHautEncyclopedieMobile() {
  const mise = document.querySelector("#vue-encyclopedie .ency-mise");
  if (!mise) return;
  let haut = document.getElementById("ency-haut-mobile");
  if (!haut) {
    haut = document.createElement("div");
    haut.id = "ency-haut-mobile";
    // Étape R260 (4A) : une seule ligne — le titre, le territoire en puce, la recherche derrière une loupe
    haut.innerHTML = `<div class="ency-ligne"><h2 class="ency-titre-m">Encyclopédie</h2><span class="ency-terr-place"></span>
        <button type="button" class="ency-loupe-bouton" id="ency-loupe-bouton" aria-label="Chercher une espèce découverte" aria-expanded="false"><span class="ency-loupe" aria-hidden="true"></span></button></div>
      <label class="ency-recherche"><span class="ency-loupe" aria-hidden="true"></span>
        <input type="search" id="ency-recherche" placeholder="Chercher une espèce découverte" autocomplete="off" aria-label="Chercher une espèce découverte"></label>
      <div class="ency-segments" role="tablist">
        <button type="button" role="tab" id="ency-seg-especes">Les espèces</button>
        <button type="button" role="tab" id="ency-seg-planches">Les planches des lieux</button></div>`;
    mise.insertBefore(haut, mise.firstChild);
    haut.querySelector("#ency-loupe-bouton").onclick = () => {   // R260 : la loupe ouvre (ou referme) le champ
      const ouvert = !haut.classList.contains("recherche-ouverte");
      haut.classList.toggle("recherche-ouverte", ouvert);
      haut.querySelector("#ency-loupe-bouton").setAttribute("aria-expanded", String(ouvert));
      if (ouvert) haut.querySelector("#ency-recherche").focus();
      else if (rechercheEncyclo) { haut.querySelector("#ency-recherche").value = ""; rechercheEncyclo = ""; afficherEncyclopedie(); }
    };
    let attente = null;
    haut.querySelector("#ency-recherche").oninput = ev => {
      clearTimeout(attente);
      attente = setTimeout(() => { rechercheEncyclo = ev.target.value.trim(); if (filtreClasse === "planches") filtreClasse = familleAvantPlanches; afficherEncyclopedie(); }, 180);
    };
    haut.querySelector("#ency-seg-especes").onclick = () => { if (filtreClasse === "planches") { filtreClasse = familleAvantPlanches; afficherEncyclopedie(); } };
    haut.querySelector("#ency-seg-planches").onclick = () => {
      if (filtreClasse !== "planches") { familleAvantPlanches = filtreClasse; filtreClasse = "planches"; afficherEncyclopedie(); }
    };
    if (!PLANCHES_DANS_ENCYCLO) haut.querySelector(".ency-segments").remove();   // étape K3 : plus d'onglet « Les planches des lieux »
  }
  // R260 : le menu des territoires (refait par afficherFiltres) passe dans la ligne du haut, en puce (téléphone)
  const place = haut.querySelector(".ency-terr-place"), bt = document.querySelector("#filtres .filtres-territoire");
  if (place && bt && collectionSurTelephone()) { place.innerHTML = ""; place.appendChild(bt); }
  if (rechercheEncyclo) haut.classList.add("recherche-ouverte");
  if (!PLANCHES_DANS_ENCYCLO && filtreClasse === "planches") filtreClasse = familleAvantPlanches || "Toutes";   // étape K3
  const planches = filtreClasse === "planches", pl = planchesDuFiltre();
  if (!haut.querySelector("#ency-seg-especes")) { haut.querySelector(".ency-recherche").classList.remove("cache"); mise.classList.remove("en-planches"); return; }   // étape K3
  const segE = haut.querySelector("#ency-seg-especes"), segP = haut.querySelector("#ency-seg-planches");
  segE.classList.toggle("actif", !planches); segE.setAttribute("aria-selected", String(!planches));
  segP.classList.toggle("actif", planches); segP.setAttribute("aria-selected", String(planches));
  segP.innerHTML = `Les planches des lieux${pl.total ? ` <small>${pl.faites}/${pl.total}</small>` : ""}`;
  haut.querySelector(".ency-recherche").classList.toggle("cache", planches);
  mise.classList.toggle("en-planches", planches);
}
function afficherEncyclopedie() {
  afficherFiltres();
  dessinerHautEncyclopedieMobile();   // étape M5 (téléphone)
  const grille = document.getElementById("grille");
  fermerFenetre();
  if (filtreClasse === "planches" && !PLANCHES_DANS_ENCYCLO) filtreClasse = "Toutes";   // étape K3
  if (filtreClasse === "planches") { afficherPlanches(grille); return; }   // étape 331
  const cherche = rechercheEncyclo && window.matchMedia && window.matchMedia("(max-width: 760px)").matches ? simplifier(rechercheEncyclo) : "";   // étape M5
  fermerPiste();
  const miseR161 = document.querySelector(".ency-mise");   // étape R161 : la bande des familles cachée sur le sommaire du téléphone
  if (miseR161) miseR161.classList.toggle("en-sommaire", !cherche && collectionSurTelephone() && filtreClasse === "Toutes");
  if (!cherche && collectionSurTelephone()) { afficherCollectionTelephone(grille); return; }   // étape M18 : sommaire et album (téléphone)
  const details = {};      // nom de l'espèce → contenu de sa petite fenêtre
  let html = "";
  for (const cle in CLASSES) {                              // une section par famille, dans l'ordre de CLASSES
    if (filtreClasse !== "Toutes" && cle !== filtreClasse) continue;
    const especes = especesDuFiltre().filter(e => e.onglet === cle);   // étape 207 : selon le territoire choisi
    let visibles = decouvertesSeules ? especes.filter(e => estReconnue(e)) : especes;
    if (cherche) visibles = visibles.filter(e => estReconnue(e) && simplifier(e.nom_courant).includes(cherche));   // étape M5
    if (visibles.length === 0) continue;                    // rien à montrer : pas de titre vide
    const decouvertes = especes.filter(e => estReconnue(e)).length;
    html += `<section class="groupe-famille" style="--couleur-classe:${CLASSES[cle].couleur}">
               <h2 class="titre-famille">${CLASSES[cle].nom}<small>${decouvertes} / ${especes.length}</small></h2>
               ${filtreClasse === cle && FAMILLES_INFO[cle] ? `<details class="bandeau-famille"${bandeauFamilleOuvert ? " open" : ""}>
                   <summary>${FAMILLES_INFO[cle].accroche}</summary>${htmlSignesFamille(cle)}</details>` : ""}
               <div class="grille-famille">${visibles.map(e => carteEncyclopedie(e, details)).join("")}</div>
             </section>`;
  }
  if (html && !cherche && filtreClasse === "Toutes") html = htmlPistesASuivre() + html;   // étape R258 (5B) : aussi sur ordinateur
  grille.innerHTML = html || (cherche ? `<p class="grille-vide">Aucune espèce découverte ne correspond à « ${echapper(rechercheEncyclo)} ».</p>`
                                     : `<p class="grille-vide">Aucune espèce découverte ici pour l'instant.</p>`);
  // Étape 127 : le bandeau de la famille garde sa position (ouvert / fermé) tant que la page n'est pas rechargée
  const bandeau = grille.querySelector(".bandeau-famille");
  if (bandeau) bandeau.ontoggle = () => { bandeauFamilleOuvert = bandeau.open; };
  brancherPistesASuivre(grille);   // étape R258

  // On branche le survol : entrer sur une carte ouvre la fenêtre, en sortir la ferme.
  // (focus / blur = la même chose au clic, pour les écrans sans souris)
  for (const carte of grille.querySelectorAll(".fiche[data-nom]")) {
    carte.onmouseenter = () => ouvrirFenetre(carte, details[carte.dataset.nom]);
    carte.onmouseleave = fermerFenetre;
    carte.onfocus = carte.onmouseenter;
    carte.onblur = fermerFenetre;
  }
  // Étape 103 : un clic sur une espèce identifiée ouvre sa page (la petite fenêtre reste pour le survol)
  for (const carte of grille.querySelectorAll(".fiche[data-page]")) {
    carte.onclick = () => ouvrirPageEspece(ESPECES.find(e => e.nom_courant === carte.dataset.nom));
    carte.onkeydown = ev => { if (ev.key === "Enter") carte.onclick(); };
  }
}

// ==================================================================
// Étape 331 (28/10/2026) : les planches « Tout est lié » dans l'encyclopédie.
//   Un filtre « Planches des lieux » dans la colonne de gauche (selon le territoire choisi) ;
//   une carte par lieu qui a sa finale : la planche s'ouvre si la finale a été jouée, sinon « finale à jouer ».
function planchesDuFiltre() {
  const terrs = filtreTerritoire === "Tous" ? tousLesTerritoires() : [filtreTerritoire];
  const parT = terrs.map(t => ({ t, lieux: (typeof lieuxDe === "function" ? lieuxDe(t) : []).filter(c => finaleDisponible(t, c)) }))
                    .filter(x => x.lieux.length);
  const total = parT.reduce((n, x) => n + x.lieux.length, 0);
  const faites = parT.reduce((n, x) => n + x.lieux.filter(c => finaleFaite(x.t, c.nom)).length, 0);
  return { parT, total, faites };
}
function afficherPlanches(grille) {
  const pl = planchesDuFiltre();
  let html = `<p class="planches-intro">Chaque lieu terminé garde ici la planche des liens de sa finale.</p>`;
  for (const { t, lieux } of pl.parT) {
    const faites = lieux.filter(c => finaleFaite(t, c.nom)).length;
    const coul = TERRITOIRES[t] ? TERRITOIRES[t].couleur : "var(--territoire)";
    const cartes = lieux.map(c => {
      const fait = finaleFaite(t, c.nom), n = liensDuLieu(t, c.nom).length;
      return `<button class="planche-ency${fait ? "" : " a-jouer"}" type="button" data-t="${echapper(t)}" data-nom="${echapper(c.nom)}"${fait ? "" : " disabled"}>
          <span class="pl-ph">${imgMini(c.photo, c.nom)}</span>
          <span class="pl-corps"><b>${echapper(c.nom)}</b><small>${fait ? `${n} liens · revoir la planche` : "Finale à jouer pour l'ouvrir"}</small></span></button>`;
    }).join("");
    html += `<section class="groupe-famille" style="--couleur-classe:${coul}">
        <h2 class="titre-famille">${echapper(t)}<small>${faites} / ${lieux.length}</small></h2>
        <div class="grille-planches">${cartes}</div></section>`;
  }
  if (!pl.total) html = `<p class="grille-vide">Aucune planche pour ce territoire pour l'instant.</p>`;
  grille.innerHTML = html;
  grille.querySelectorAll(".planche-ency:not(.a-jouer)").forEach(b => b.onclick = () => ouvrirPlanche(b.dataset.t, b.dataset.nom, "encyclopedie"));
}

// ==================================================================
// 10 ter. LA PAGE D'UNE ESPÈCE (étape 103, J4 — maquette B validée le 11/10)
//    À gauche : photo, médaille et son nom, identité, puis une jauge par rubrique (cliquable).
//    À droite : des onglets, une rubrique à la fois.
//    Chaque caractéristique est rangée dans une des 5 rubriques ci-dessous. Une colonne absente de la liste
//    va d'office dans « Portrait » si elle se pose en dessins, sinon dans « Mode de vie » : le modèle
//    s'adapte à toutes les espèces, et à toute nouvelle colonne, sans rien changer ici.
//    Une rubrique sans aucune donnée pour l'espèce n'apparaît pas. Pas encore trouvé = « ? ».
// ==================================================================
const RUBRIQUES_ESPECE = [
  { cle: "portrait", nom: "Portrait", champs: ["robe","couleur_dominante","taille_max_cm","poids_max_kg","envergure_max_cm","pattes_type","pattes_aspect","pattes_arriere","queue_forme","queue_adulte","oreilles_forme","oreilles_taille","cornes_ou_bois","cornes_bois_forme","poil_longueur","bec_forme","bec_couleur","yeux_couleur","doigts_disposition","peau_texture","ventre_couleur","pupille_forme","difference_male_femelle","nb_dents","nombre_pattes","pinces","coquille","famille_animale"] },
  { cle: "vie", nom: "Mode de vie", champs: ["milieu_principal","niveau_estran","activite","saison_observation","deplacement_saisonnier","regime_alimentaire_type","proies","emplacement_nid","altitude_max_m","vitesse_max_kmh","longevite_max_annees","pelage_hiver","toile","regeneration"] },
  { cle: "famille", nom: "Naissance et famille", champs: ["saison_reproduction","naissance","gestation_jours","incubation_jours","nb_petits_max","nb_oeufs_ordre","vie_larve","metamorphose","nom_petit","nom_femelle","nom_groupe","sexes","soin_des_petits"] },
  { cle: "liens", nom: "Liens et protection", champs: ["plantes_liees","predateurs","defense_principale","danger_homme","statut_conservation"] },
  { cle: "traces", nom: "Traces et sons", champs: ["verbe_cri","cri_son","empreinte_nom","empreinte_choix","indice_presence"] },
];
const NOMS_MEDAILLE = ["", "Espèce reconnue", "Espèce comprise", "Espèce familière"];   // étape E2-3 (n° 13.1) : « croisée » → « reconnue »   // étape R144
let especeOuverte = null, ongletEspece = "portrait", positionEncyclopedie = 0;

function rubriqueDe(q) {
  const r = RUBRIQUES_ESPECE.find(r => r.champs.includes(q.champ));
  return r ? r.cle : (q.format === "picto" ? "portrait" : "vie");
}
// Les questions de l'espèce, rangées par rubrique (l'« empreinte parmi quatre » est la même empreinte : une seule ligne)
function rubriquesDe(espece) {
  const par = {};
  for (const q of questionsPossibles(espece)) {
    if (q.champ === "empreinte_choix") continue;
    (par[rubriqueDe(q)] = par[rubriqueDe(q)] || []).push(q);
  }
  return par;
}
// La valeur telle qu'on la montre sur la page (l'empreinte en dessin, le cri à écouter)
function valeurPage(espece, q) {
  const cle = cleEmpreinte(espece);
  if (q.champ === "empreinte_nom") return `<img class="pe-empreinte" src="Empreintes/${cle}.svg" alt="son empreinte">`;
  if (q.champ === "cri_son") return `<audio controls preload="none"><source src="Sons/${cle}.mp3"><source src="Sons/${cle}.ogg"></audio>`;
  const v = valeurDe(espece, q);
  return q.affichageFiche ? q.affichageFiche(espece, v) : afficherValeur(q, v);
}
// Le dessin à gauche de la valeur ; une place vide sinon, pour que les valeurs restent alignées
function pictoPage(espece, q) {
  // Étape 246 : le milieu (trouvé) est illustré par une petite photo de son paysage
  if (q.champ === "milieu_principal" && PAYSAGES_DANS_LA_FICHE) {   // étape 249 : désactivé (les pictos restent)
    const p = paysageDuJour(espece);
    if (p) return `<span class="pe-picto pe-paysage"><img src="${miniPaysage(p)}" alt="" title="${p.lieu}"></span>`;
  }
  if (!(q.format === "picto" || q.pictos)) return `<span class="pe-picto"></span>`;
  return `<span class="pe-picto">${dessinReponse(q.colonnePicto || q.champ, valeurDe(espece, q))}</span>`;
}
function lignePage(espece, q) {
  if (nbBonnes(espece, q.champ) < 1) return `<div class="pe-ligne inconnue"><span class="lib">${q.libelle}</span><span class="val"><span class="pe-picto"></span><span class="val-txt">?</span></span></div>`;
  return `<div class="pe-ligne"><span class="lib">${q.libelle}</span><span class="val">${pictoPage(espece, q)}<span class="val-txt">${valeurPage(espece, q)}</span></span>${pointsDonnee(espece, q.champ)}</div>`;   // R260b : val-txt (tuiles du téléphone)
}

// Étape 104 : les territoires du jeu où l'espèce est présente. On lit la colonne « territoire » (plusieurs
// territoires possibles, séparés par « ; ») et, si elle existe un jour, une colonne « territoires_presence ».
// Une espèce présente dans un territoire qui n'est pas encore jouable y est quand même montrée (« à venir »).
// Étape 181 : une espèce peut être dans PLUSIEURS territoires jouables (« Alpes ; Massif armoricain »).
// territoiresJeu(e) = la liste de ses territoires jouables ; estDans(e, liste) = est-elle dans l'un d'eux ?
// (avant, le jeu comparait le texte entier : « Alpes ; Massif armoricain » n'aurait été ni les Alpes ni le Massif.)
// Étape 258 : le résultat est gardé en mémoire (la colonne ne change pas pendant la partie) : c'était
// recalculé des centaines de fois à chaque affichage, d'où un petit temps de latence entre les pages.
const memoTerritoires = new WeakMap();
function territoiresJeu(espece) {
  let t = memoTerritoires.get(espece);
  if (!t) { t = String(espece.territoire || "").split(";").map(t => t.trim()).filter(Boolean); memoTerritoires.set(espece, t); }
  return t;
}
function estDans(espece, liste) {
  return territoiresJeu(espece).some(t => liste.includes(t));
}
function territoiresDe(espece) {
  const texte = [espece.territoire, espece.territoires_presence].filter(estRenseigne).join(";");
  return [...new Set(texte.split(";").map(t => t.trim()).filter(Boolean))];
}
function blocTerritoires(espece) {
  const liste = territoiresDe(espece);
  if (!liste.length) return "";
  const couleur = t => (TERRITOIRES[t] && TERRITOIRES[t].couleur) || classeDe(espece).couleur;
  let carte = "";
  if (typeof CARTE_TERRITOIRES !== "undefined") {
    // Étape 261 : data-nom pour la bulle du survol (photo, nom, pourcentage, présence de l'espèce)
    const formes = CARTE_TERRITOIRES.map(t => liste.includes(t.nom)
      ? `<path data-nom="${t.nom}" d="${t.contour}" style="fill:${couleur(t.nom)};stroke:#fff;stroke-width:6"><title>${t.nom}</title></path>`
      : `<path data-nom="${t.nom}" d="${t.contour}" style="fill:#e3dccd;stroke:#fff;stroke-width:6"><title>${t.nom}</title></path>`).join("");
    carte = `<svg class="pe-carte" viewBox="${CARTE_CADRE}" role="img" aria-label="Carte des territoires où l'espèce est présente">${formes}</svg>`;
  }
  const etiquettes = liste.map(t => `<span class="pe-territoire" style="--c:${couleur(t)}">${t}${especesDe(t).length ? "" : " <small>à venir</small>"}</span>`).join("");
  return `<div class="pe-presence"><div class="pe-titre-presence">Présente dans</div>${carte}<div>${etiquettes}</div></div>`;
}

// Étape PA1 (12/11, choix A1 d'Aubin) : la fiche montre les 2 ou 3 photos de l'espèce.
//   Sous la grande photo, une rangée de vignettes ; toucher une vignette la met en grand, avec son étiquette
//   (« La femelle », « Le jeune »… ; rien pour « autre vue ») ; toucher la grande photo l'agrandit en plein écran.
function galeriePhotos(e) {
  const ph = photosDe(e);
  if (ph.length < 2) return "";
  return `<div class="pe-galerie" role="group" aria-label="Ses photos">${ph.map((p, i) =>
    `<button type="button" class="pe-vignette${i ? "" : " actif"}" data-i="${i}" aria-label="${echapper(etiquetteForme(p.sujet) || (i ? "Autre photo" : "Photo principale"))}">${imagePhoto(p.src, "", true)}${etiquetteForme(p.sujet) ? `<small>${majuscule(p.sujet)}</small>` : ""}</button>`).join("")}</div>`;
}
function brancherGaleriePhotos(zone, e) {
  const ph = photosDe(e), cadre = zone.querySelector(".pe-photo");
  if (!cadre || !ph.length) return;
  let courante = 0;
  const etiquette = cadre.querySelector(".pe-forme");
  cadre.classList.add("agrandissable");
  cadre.onclick = ev => { if (ev.target.closest(".rarete")) return; agrandirPhoto(ph[courante].src, [e.nom_courant, etiquetteForme(ph[courante].sujet)].filter(Boolean).join(" · ")); };
  zone.querySelectorAll(".pe-vignette").forEach(b => b.onclick = () => {
    courante = Number(b.dataset.i);
    const img = cadre.querySelector("img");
    if (img) img.src = srcEcran(ph[courante].src);   // R264
    const lib = etiquetteForme(ph[courante].sujet);
    etiquette.textContent = lib;
    etiquette.classList.toggle("cache", !lib);
    zone.querySelectorAll(".pe-vignette").forEach(v => v.classList.toggle("actif", v === b));
    if (typeof suivrePhotoReperes === "function") suivrePhotoReperes(zone, e, ph[courante].sujet);   // étape R195 : la carte suit la photo
  });
}

function ouvrirPageEspece(espece) {
  if (typeof arreterCri === "function") arreterCri();   // étape R176 : une autre fiche, un autre écran : le son s'arrête
  if (!espece) return;
  if (especeOuverte !== espece) ongletEspece = "portrait";
  if (!ficheParLien) pileFiches = [];   // étape R258 : venue d'ailleurs que d'un lien de fiche
  ficheParLien = false;
  especeOuverte = espece;
  // Étape R236 (note 10 du 15/11) : ouvrir la fiche de l'espèce du jour (déjà reconnue) compte comme sa rencontre du jour
  if (typeof especeDuJour === "function" && typeof validerEspeceDuJour === "function" && estReconnue(espece)) {
    const j = especeDuJour();
    if (j && j.nom_courant === espece.nom_courant && validerEspeceDuJour(espece.nom_courant, 500)) sauvegarder();
  }
  if (!pileFiches.length) positionEncyclopedie = window.scrollY;   // pour revenir au même endroit de l'encyclopédie
  montrer("espece");
}

function afficherPageEspece() {
  const e = especeOuverte, zone = document.getElementById("vue-espece");
  if (!e) { montrer("encyclopedie"); return; }
  const c = classeDe(e), par = rubriquesDe(e);
  const presentes = RUBRIQUES_ESPECE.filter(r => par[r.cle]);
  if (!presentes.some(r => r.cle === ongletEspece)) ongletEspece = presentes[0].cle;
  // Étape M21 (07/11) : la fiche compte sans la photo (elle est forcément reconnue pour ouvrir la fiche) : « 3 sur 15 trouvées »
  //   = la somme des barres des rubriques (Portrait 1/4 + Mode de vie 1/5 + …), et « Encore 12 » = 15 − 3.
  const champs = champsDe(e).filter(x => x !== IDENTIFICATION), trouves = champs.filter(x => nbBonnes(e, x) >= 1).length;
  const termine = niveauTermine(e);
  const medaille = termine >= 1 ? dessinMedaille(MEDAILLES[termine], termine) : `<span class="pe-sans"></span>`;
  const detail = termine >= 1 ? sensMedaille(termine, e) : `Faites connaissance ${pe(e).avecElle} en expédition`;   // R236 : accordé au nom   // étape R144
  const jauges = presentes.map(r => {
    const qs = par[r.cle], t = qs.filter(q => nbBonnes(e, q.champ) >= 1).length;
    return `<button class="pe-rub${r.cle === ongletEspece ? " actif" : ""}" data-onglet="${r.cle}"><span>${r.nom}</span><small>${t} / ${qs.length}</small>`
      + `<span class="pe-jauge"><i style="width:${Math.round(100 * t / qs.length)}%"></i></span></button>`;
  }).join("");
  const onglets = presentes.map(r => `<button class="pe-onglet${r.cle === ongletEspece ? " actif" : ""}" data-onglet="${r.cle}">${r.nom}</button>`).join("");
  zone.innerHTML = `<div class="pe" style="--couleur-classe:${c.couleur}">
      <button class="pe-retour" id="pe-retour">← Retour à l'encyclopédie</button>
      <aside class="pe-cote">
        <div class="pe-photo">${celluleImage(e)}${dessinRarete(e)}<span class="pe-forme cache"></span>${couvertureFiche(e, c)}</div>${galeriePhotos(e)}
        ${etiquettesFiche(e, termine, trouves, champs.length)}${/* étape R260b (2A) : téléphone — le statut en petites étiquettes */ ""}
        <div class="pe-medaille${termine ? "" : " vide"}">${medaille}<span><b>${termine ? NOMS_MEDAILLE[termine] : "Pas encore rencontrée"}</b><small>${detail}</small></span></div>
        <h1>${e.nom_courant}</h1>
        <div class="pe-sci">${e.nom_scientifique}</div>
        ${estReconnue(e) ? `<button class="pe-favori${especeFavorite === e.nom_courant ? " choisie" : ""}" id="pe-favori">${ETOILE}${especeFavorite === e.nom_courant ? "Mon espèce favorite" : "En faire mon espèce favorite"}</button>` : ""}
        <div class="pe-groupe"><span style="color:${c.couleur}">${c.nom}</span> · ${e.nom_affichage_groupe}</div>
        <div class="pe-statut">${majuscule(statut(e))} · ${trouves} sur ${champs.length} trouvées</div>
        ${estReconnue(e) ? boutonFiche(e, champs.length - trouves) : ""}${/* étape R258 (4A) : « Faire une Rencontre » ou « Compléter sa fiche » */ ""}
        <nav>${jauges}</nav>
      </aside>
      <main>
        ${(() => {   // étape R258 (Notion 24, choix 2A) : une page en 4 parties, dans l'ordre de la phrase du jeu
          const reperes = (estReconnue(e) || (typeof estOfferte === "function" && estOfferte(e))) && typeof blocReperes === "function" ? blocReperes(e, { sansTitre: true }) : "";
          const complete = trouves >= champs.length && champs.length > 0;
          return (reperes ? `<section class="pe-partie pe-p-reconnaitre"><h2 class="pe-h">${majuscule(pe(e).la)} reconnaître</h2>${reperes}</section>` : "")
            + `<section class="pe-partie pe-p-savoir"><h2 class="pe-h">Ce que vous savez <small>${trouves} / ${champs.length}${complete ? " · fiche complète" : ""}</small></h2>
                <div class="pe-onglets">${onglets}</div>
                <div class="pe-page">${par[ongletEspece].map(q => lignePage(e, q)).join("")}</div>
                ${blocAnecdotes(e)}</section>`
            + blocLiensFiche(e)
            + `<section class="pe-partie pe-p-lieux"><h2 class="pe-h">Où ${pe(e).la} revoir</h2>${blocTerritoires(e)}${blocLieuxFiche(e)}</section>`;
        })()}
        ${typeof lienSignalerFiche === "function" ? lienSignalerFiche(e) : ""}${/* étape CT1 : « Signaler une erreur sur cette fiche » (1A) */ ""}
      </main>
    </div>`;
  zone.querySelectorAll("[data-onglet]").forEach(b => b.onclick = () => { ongletEspece = b.dataset.onglet; afficherPageEspece(); });
  brancherGaleriePhotos(zone, e);   // étape PA1
  if (typeof brancherSignalerFiche === "function") brancherSignalerFiche(zone, e);   // étape CT1
  // Étape 261 : la bulle au survol de la carte « Présente dans », comme sur la page carte
  const carteP = zone.querySelector(".pe-carte");
  if (carteP) {
    const ici = territoiresDe(e);
    brancherBulleCarte(carteP, carteP.closest(".pe-presence"),
      nom => `<span class="bt-espece${ici.includes(nom) ? " oui" : ""}">${ici.includes(nom) ? "✓ " + e.nom_courant + " vit ici" : "Absente de ce territoire"}</span>`, true);
  }
  // Étape R258 : de fiche en fiche par les liens, « ← » ramène à la fiche d'avant
  const retourPe = document.getElementById("pe-retour");
  if (pileFiches.length) retourPe.textContent = `← ${pileFiches[pileFiches.length - 1].nom_courant}`;
  retourPe.onclick = () => {
    if (pileFiches.length) { const avant = pileFiches.pop(); ficheParLien = true; ouvrirPageEspece(avant); window.scrollTo(0, 0); return; }
    montrer("encyclopedie"); window.scrollTo(0, positionEncyclopedie);
  };
  brancherLiensFiche(zone, e);
  if (document.getElementById("pe-fiche")) document.getElementById("pe-fiche").onclick = () => lancerFicheEspece(e);
  setTimeout(() => verifierFichesCompletes([e]), 400);   // étape R258 (7A)
  // Étape 176 : une espèce entièrement découverte peut être rencontrée à nouveau, depuis sa fiche.
  // Étape 238 (22/10) : dès qu'elle est identifiée (plus besoin d'attendre l'or).
  if (document.getElementById("pe-rencontre")) document.getElementById("pe-rencontre").onclick = () => lancerRencontreAvec(e);
  // Étape 109 : choisir (ou retirer, d'un second clic) l'espèce favorite
  // Étape R260b : sur la photo de couverture (téléphone), « ← » et l'étoile « favorite »
  const retC = zone.querySelector(".pe-couv-retour");
  if (retC) retC.onclick = ev => { ev.stopPropagation(); retourPe.onclick(); };
  const favC = zone.querySelector(".pe-couv-fav");
  if (favC) favC.onclick = ev => { ev.stopPropagation(); document.getElementById("pe-favori").onclick(); };
  if (document.getElementById("pe-favori")) document.getElementById("pe-favori").onclick = () => {
    especeFavorite = especeFavorite === e.nom_courant ? null : e.nom_courant;
    sauvegarder(); afficherStats(); afficherPageEspece();
  };
}

// Étape 239 (22/10) : les anecdotes « Le saviez-vous ? » — une par médaille (Données\anecdotes.xlsx → ANECDOTES).
// Une anecdote se débloque avec sa médaille ; une médaille gagnée n'est jamais reprise (medailleMax, étape 227).
function anecdotesDe(e) { return (typeof ANECDOTES !== "undefined" && ANECDOTES[e.nom_courant]) || null; }
function medailleGagnee(e) {
  const p = progression[e.nom_courant];
  return Math.max(niveauTermine(e), p && Number.isInteger(p.medailleMax) ? p.medailleMax : 0);
}
// Les anecdotes déjà débloquées, de la plus récente (or) à la plus ancienne (bronze)
function anecdotesGagnees(e) {
  const a = anecdotesDe(e), m = medailleGagnee(e);
  if (!a) return [];
  return [3, 2, 1].filter(n => n <= m && a[MEDAILLES[n]]).map(n => ({ niveau: n, texte: a[MEDAILLES[n]] }));
}
function blocAnecdotes(e) {
  const a = anecdotesDe(e);
  if (!a) return "";
  const m = medailleGagnee(e);
  const lignes = [1, 2, 3].filter(n => a[MEDAILLES[n]]).map(n => n <= m
    ? `<li class="pe-anecdote">${dessinMedaille(MEDAILLES[n], n)}<span>${a[MEDAILLES[n]]}</span></li>`
    : `<li class="pe-anecdote verrou">${dessinMedaille(MEDAILLES[n], n)}<span>Se découvre quand l'espèce sera ${nomPalier(n)}.</span></li>`).join("");
  return `<section class="pe-anecdotes"><h3>Le saviez-vous ?</h3><ul>${lignes}</ul></section>`;
}

// Étape 176 (13/10) : lancer une Rencontre sur UNE espèce choisie (depuis sa fiche de l'encyclopédie).
// Une Rencontre en cours non terminée est remplacée par celle-ci.
function lancerRencontreAvec(espece, indicesVus) {
  rencontreDuJour = null;
  session = null;                      // sinon l'écran Jouer reprendrait la Rencontre en cours
  modeLibre = false; depuisArcade = false;   // étape 262 : une Rencontre ne fait pas partie de l'Arcade
  jeuChoisi = "rencontre";
  montrer("jouer");                    // l'onglet Jouer (arrête aussi un défi en cours)
  demarrerFocus(espece);
  // Étape 263 : les traits déjà donnés en indice (carte « Rencontre » de la page du territoire) ne sont pas redemandés ici
  if (indicesVus && indicesVus.length && session) session.posees.push(...indicesVus.filter(c => !session.posees.includes(c)));
  window.scrollTo(0, 0);
}

// ==================================================================
// 10 bis. LA PAGE « À PROPOS » (étape 102)
//    Les crédits viennent du fichier credits.js (généré depuis credits_photos_sons.xlsx).
//    Photos : une liste repliable par famille. Sons : une seule liste.
//    Une espèce sans crédit dans le fichier affiche « Auteur à identifier » (un email de contact sera ajouté plus tard).
// ==================================================================
// Le lien vers le texte d'une licence Creative Commons ("CC BY-SA 4.0" → creativecommons.org/licenses/by-sa/4.0/)
function lienLicence(licence) {
  const m = /^CC (BY(?:-NC)?(?:-SA|-ND)?) (\d\.\d)/i.exec(licence || "");
  if (m) return `https://creativecommons.org/licenses/${m[1].toLowerCase()}/${m[2]}/`;
  if (/^CC0/i.test(licence || "")) return "https://creativecommons.org/publicdomain/zero/1.0/";
  return "";
}
// Une ligne de crédit : vignette (photos seulement), espèce, auteur (lien vers l'original), licence
function ligneCredit(espece, credit, avecVignette) {
  const vignette = avecVignette ? `<td class="vignette"><span>${celluleImage(espece, true)}</span></td>` : "";
  if (!credit || !credit.auteur) {
    return `<tr>${vignette}<td class="espece">${espece.nom_courant}</td><td class="manque" colspan="2">Auteur à identifier</td></tr>`;
  }
  const auteur = credit.source ? `<a href="${credit.source}" target="_blank" rel="noopener">${credit.auteur}</a>` : credit.auteur;
  const url = lienLicence(credit.licence);
  const licence = url ? `<a href="${url}" target="_blank" rel="noopener">${credit.licence}</a>` : credit.licence;
  const origine = credit.origine ? `<br><small>${credit.origine}</small>` : "";
  return `<tr>${vignette}<td class="espece">${espece.nom_courant}</td><td class="auteur">${auteur}${origine}</td><td class="licence">${licence}</td></tr>`;
}
function dessinerActionsAPropos(attente) {
  const vue = document.getElementById("vue-apropos");
  if (!vue) return;
  let bloc = document.getElementById("bloc-debloquer");
  if (!bloc) { bloc = document.createElement("div"); bloc.id = "bloc-debloquer"; bloc.className = "tout-debloquer"; }
  const article = vue.querySelector("article.apropos") || vue, pied = document.getElementById("pied-apropos");
  const reglages = document.getElementById("ap-reglages-corps");   // R238 : dans la rubrique « Réglages »
  if (reglages) { if (bloc.parentNode !== reglages) reglages.appendChild(bloc); }
  else if (pied && pied.parentNode === article) article.insertBefore(bloc, pied); else article.appendChild(bloc);   // en bas de la page, avant la signature
  const oui = typeof toutDebloque === "function" && toutDebloque();
  const actions = [
    { cle: "debloquer", titre: oui ? "Revenir au jeu pas à pas" : "Tout débloquer",
      texte: oui ? "Tout est débloqué : territoires, lieux, expéditions, étapes, finales et toutes les espèces (déjà reconnues sur photo). Leurs caractéristiques et les empreintes se gagnent toujours en jouant ; pas de badge pendant ce mode."
                 : "Le jeu s'ouvre pas à pas. Vous pouvez tout ouvrir d'un coup : territoires, lieux, expéditions, étapes, finales et toutes les espèces.",
      question: oui ? "Revenir au jeu pas à pas ? Les territoires déjà ouverts le restent ; les espèces débloquées d'office quittent le carnet (sauf celles que vous avez reconnues vous-même)."
                    : "Tout débloquer ? Territoires, lieux, expéditions, étapes, finales et toutes les espèces seront ouverts.",
      faire: () => { reglerToutDebloque(!oui); dessinerActionsAPropos(); } },
    { cle: "recommencer", titre: "Recommencer",
      texte: "Effacer toute la progression et repartir de zéro.",
      question: "Effacer toute la progression ? Cela ne peut pas être annulé.",
      faire: effacerPartie },
  ];
  // Étape M11 (07/11, idée de l'utilisateur) : le prénom ou pseudo se règle ici (il n'est plus modifiable dans le Profil)
  const prenom = typeof prenomJoueur === "function" ? prenomJoueur() : "";
  const blocPrenomReglage = `<div class="apropos-action apropos-prenom" data-cle="prenom">${attente === "prenom"
      ? `<form class="pg-prenom-form" id="reglage-prenom"><label class="cache-visuel" for="reglage-prenom-champ">Votre prénom ou pseudo</label>
          <input id="reglage-prenom-champ" type="text" maxlength="24" value="${echapper(prenom)}" placeholder="Votre prénom ou pseudo" autocomplete="nickname">
          <button type="submit">Enregistrer</button><button type="button" class="bouton-apropos annuler" data-non="1">Annuler</button></form>`
      : `<p>Votre prénom ou pseudo : <b>${prenom ? echapper(prenom) : "aucun pour l'instant"}</b><br><small>Il s'affiche dans votre profil et, sur téléphone, sur l'accueil.</small></p>
         <button class="bouton-apropos" type="button" data-action="prenom">${prenom ? "Modifier" : "Choisir"}</button>`}</div>`;
  // Étape ML7 : sauvegarder / reprendre la partie dans un fichier, installer l'application (19_application.js)
  const blocApplication = typeof htmlReglagesApplication === "function" ? htmlReglagesApplication(attente) : "";
  const blocEssai = typeof htmlEssaiInsolites === "function" ? htmlEssaiInsolites() : "";   // étape QI3b : essai des questions insolites (21)
  // Étape R245 (36.12) : « Petits sons : oui / non » (sons de bonne et de mauvaise réponse, de fin, de médaille) ; les cris restent
  const petits = !(suivi && suivi.petitsSons === false);
  const blocPetitsSons = `<div class="apropos-action apropos-petits-sons" data-cle="petits-sons">
      <p>Petits sons : <b>${petits ? "oui" : "non"}</b><br><small>Les petits sons de bonne et de mauvaise réponse et de fin de partie. Les cris des animaux restent.</small></p>
      <span class="apropos-boutons reglage-oui-non" role="group" aria-label="Petits sons">
        <button class="bouton-apropos${petits ? " choisi" : ""}" type="button" data-petits-sons="oui" aria-pressed="${petits}">Oui</button><button class="bouton-apropos${petits ? "" : " choisi"}" type="button" data-petits-sons="non" aria-pressed="${!petits}">Non</button></span></div>`;
  bloc.innerHTML = `<h2>Réglages de la partie</h2>` + blocPetitsSons + blocPrenomReglage + blocApplication + blocEssai + actions.map(x => `<div class="apropos-action" data-cle="${x.cle}">
      <p>${attente === x.cle ? `<b>${x.question}</b>` : x.texte}</p>
      ${attente === x.cle
        ? `<span class="apropos-boutons"><button class="bouton-apropos confirmer" type="button" data-oui="${x.cle}">Oui, ${x.titre.charAt(0).toLowerCase() + x.titre.slice(1)}</button><button class="bouton-apropos annuler" type="button" data-non="1">Annuler</button></span>`
        : `<button class="bouton-apropos" type="button" data-action="${x.cle}">${x.titre}</button>`}
    </div>`).join("");
  bloc.querySelectorAll("[data-action]").forEach(bt => bt.onclick = () => dessinerActionsAPropos(bt.dataset.action));
  bloc.querySelectorAll("[data-petits-sons]").forEach(bt => bt.onclick = () => {
    suivi.petitsSons = bt.dataset.petitsSons === "oui"; sauvegarder(); dessinerActionsAPropos();
    if (suivi.petitsSons) { try { jouerSon("bonne"); } catch (e) {} }   // on l'entend tout de suite
  });
  bloc.querySelectorAll("[data-non]").forEach(bt => bt.onclick = () => dessinerActionsAPropos());
  if (typeof brancherEssaiInsolites === "function") brancherEssaiInsolites();   // étape QI3b
  const formPrenom = document.getElementById("reglage-prenom");
  if (formPrenom) {
    const champ = formPrenom.querySelector("input"); champ.focus();
    formPrenom.onsubmit = ev => { ev.preventDefault(); suivi.prenom = champ.value.trim().slice(0, 24); sauvegarder(); dessinerActionsAPropos(); };
  }
  bloc.querySelectorAll("[data-oui]").forEach(bt => bt.onclick = () => actions.find(x => x.cle === bt.dataset.oui).faire());
  if (typeof brancherReglagesApplication === "function") brancherReglagesApplication();   // étape ML7
}
// Étape R238 (note 5 du 15/11, choix 9A) : les 4 pastilles en haut de la page ; un toucher descend à la rubrique,
//   la pastille de la rubrique lue est allumée (une seule mise en place)
let menuAProposBranche = false;
function brancherMenuAPropos() {
  const menu = document.querySelector("#vue-apropos .ap-menu");
  if (!menu || menuAProposBranche) return;
  menuAProposBranche = true;
  const allumer = id => menu.querySelectorAll(".ap-pastille").forEach(p => p.classList.toggle("actif", p.dataset.cible === id));
  menu.querySelectorAll(".ap-pastille").forEach(p => p.onclick = () => {
    const cible = document.getElementById(p.dataset.cible);
    if (cible) cible.scrollIntoView({ behavior: "smooth", block: "start" });
    allumer(p.dataset.cible);
  });
  allumer("ap-jouer");
  if (typeof IntersectionObserver === "function") {
    const obs = new IntersectionObserver(entrees => {
      const vue = entrees.filter(en => en.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (vue) allumer(vue.target.id);
    }, { rootMargin: "-90px 0px -60% 0px" });
    document.querySelectorAll("#vue-apropos .ap-rubrique").forEach(r => obs.observe(r));
  }
}
function afficherAPropos() {
  brancherMenuAPropos();
  // Étape PR5 (01/11, demande de l'utilisateur) : « Tout débloquer » et « Recommencer » à la fin de la page,
  //   avec le même bouton, et une confirmation dans la page après le clic (Oui / Annuler).
  dessinerActionsAPropos();
  // Étape R188 (11/11, note n° 18 d'Aubin) : « Comment gagner des empreintes ? » (avant : sur la page de chaque lieu)
  const regles = document.getElementById("apropos-empreintes");
  if (regles && typeof texteReglesEmpreintes === "function") regles.innerHTML = `<h2>Comment gagner des empreintes ?</h2><p>${texteReglesEmpreintes()}</p>`;
  const photos = typeof CREDITS_PHOTOS === "object" ? CREDITS_PHOTOS : {};
  const sons = typeof CREDITS_SONS === "object" ? CREDITS_SONS : {};
  // Les photos, famille par famille (repliées : on ouvre celle qu'on veut lire)
  let html = "";
  for (const cle in CLASSES) {
    const especes = ESPECES.filter(e => e.onglet === cle && estRenseigne(e.photo));
    if (!especes.length) continue;
    html += `<details class="credits-famille" style="--couleur-classe:${CLASSES[cle].couleur}">
               <summary>${CLASSES[cle].nom}</summary>
               <table class="table-credits">${especes.map(e => ligneCredit(e, photos[cleEmpreinte(e)], true)).join("")}</table>
             </details>`;
  }
  // Étape 246 : les photos de paysages des milieux
  const paysages = typeof PAYSAGES !== "undefined" ? PAYSAGES : [];
  if (paysages.length) {
    const ligne = p => {
      const auteur = p.source ? `<a href="${p.source}" target="_blank" rel="noopener">${p.auteur}</a>` : p.auteur;
      const url = lienLicence(p.licence), licence = url ? `<a href="${url}" target="_blank" rel="noopener">${p.licence}</a>` : p.licence;
      return `<tr><td class="vignette"><span><img src="${miniPaysage(p)}" alt=""></span></td><td class="espece">${p.milieu}<br><small>${p.lieu}</small></td><td class="auteur">${auteur}</td><td class="licence">${licence}</td></tr>`;
    };
    html += `<details class="credits-famille"><summary>Les paysages des milieux<small>${paysages.length} photos</small></summary>
               <table class="table-credits">${paysages.map(ligne).join("")}</table></details>`;
  }
  // Étape 278 : les photos des couvertures des territoires (hors paysages des milieux, déjà listés)
  const ids = typeof IDENTITE !== "undefined" ? Object.entries(IDENTITE) : [];
  const dejaPaysages = new Set(paysages.map(p => p.fichier));
  const lignes = ids.flatMap(([t, d]) => (d.photos || []).filter(ph => !dejaPaysages.has(ph.photo)).map(ph => {
    const i = ph.credit.lastIndexOf(", "), nom = i > 0 ? ph.credit.slice(0, i) : ph.credit, lic = i > 0 ? ph.credit.slice(i + 2) : "";
    const auteur = ph.source ? `<a href="${ph.source}" target="_blank" rel="noopener">${nom}</a>` : nom;
    const url = lienLicence(lic), licence = url ? `<a href="${url}" target="_blank" rel="noopener">${lic}</a>` : lic;
    return `<tr><td class="vignette"><span><img src="${ph.photo}" alt="" loading="lazy"></span></td><td class="espece">${ph.legende}<br><small>${ph.lieu} · ${t}</small></td><td class="auteur">${auteur}</td><td class="licence">${licence}</td></tr>`;
  }));
  if (lignes.length) html += `<details class="credits-famille"><summary>Les photos des territoires<small>${lignes.length} photos</small></summary>
               <table class="table-credits">${lignes.join("")}</table></details>`;
  // Étape 291 : les photos des vrais lieux (Données\expeditions.xlsx, onglet chapitres, colonnes credit et photo_source)
  // Étape 338 : les sites remarquables aussi (leur crédit n'est plus sur leur page), sauf une photo déjà listée avec les territoires
  const dejaTerr = new Set(ids.flatMap(([, d]) => (d.photos || []).map(ph => ph.photo)));
  const lieux = (typeof CHAPITRES !== "undefined" ? CHAPITRES : []).filter(c => c.type && c.credit && !c.photo.includes("paysage_") && !dejaTerr.has(c.photo));
  if (lieux.length) html += `<details class="credits-famille"><summary>Les photos des lieux<small>${lieux.length} photos</small></summary>
               <table class="table-credits">${lieux.map(c => {
    const i = c.credit.lastIndexOf(", "), nom = i > 0 ? c.credit.slice(0, i) : c.credit, lic = i > 0 ? c.credit.slice(i + 2) : "";
    const auteur = c.photo_source ? `<a href="${c.photo_source}" target="_blank" rel="noopener">${nom}</a>` : nom;
    const url = lienLicence(lic), licence = url ? `<a href="${url}" target="_blank" rel="noopener">${lic}</a>` : lic;
    return `<tr><td class="vignette"><span><img src="${c.photo.replace("Images/Paysages/", "Images/Paysages/mini/")}" alt="" loading="lazy"></span></td><td class="espece">${c.nom}<br><small>${c.pays || ""} · ${c.territoire}</small></td><td class="auteur">${auteur}</td><td class="licence">${licence}</td></tr>`;
  }).join("")}</table></details>`;
  // Étape 305 : les photos des éléments du lieu (finale « Tout est lié » ; Données\expeditions.xlsx, onglet elements)
  const elements = Object.entries(typeof ELEMENTS !== "undefined" ? ELEMENTS : {}).filter(([, el]) => el.photo && el.credit);
  if (elements.length) html += `<details class="credits-famille"><summary>Les photos des éléments du lieu<small>${elements.length} photos</small></summary>
               <table class="table-credits">${elements.map(([nomEl, el]) => {
    const i = el.credit.lastIndexOf(", "), nom = i > 0 ? el.credit.slice(0, i) : el.credit, lic = i > 0 ? el.credit.slice(i + 2) : "";
    const auteur = el.photo_source ? `<a href="${el.photo_source}" target="_blank" rel="noopener">${nom}</a>` : nom;
    const url = lienLicence(lic), licence = url ? `<a href="${url}" target="_blank" rel="noopener">${lic}</a>` : lic;
    return `<tr><td class="vignette"><span><img src="${el.photo.replace("Images/Paysages/", "Images/Paysages/mini/")}" alt="" loading="lazy"></span></td><td class="espece">${nomEl}<br><small>Finale du lieu · élément du lieu</small></td><td class="auteur">${auteur}</td><td class="licence">${licence}</td></tr>`;
  }).join("")}</table></details>`;
  document.getElementById("credits-photos").innerHTML = html;
  // Les sons : seulement les espèces qui ont un cri dans le jeu
  const avecSon = ESPECES.filter(e => sons[cleEmpreinte(e)]);
  document.getElementById("credits-sons").innerHTML = `<details class="credits-famille">
      <summary>Tous les cris<small>${avecSon.length} sons</small></summary>
      <table class="table-credits">${avecSon.map(e => ligneCredit(e, sons[cleEmpreinte(e)], false)).join("")}</table>
    </details>`;
  // Étape ML6 : les crédits des silhouettes (PhyloPic), repliés comme ceux des photos
  const blocSilh = document.getElementById("credits-silhouettes");
  if (blocSilh && typeof CREDITS_SILHOUETTES !== "undefined") {
    const ligneSilh = c => {
      const auteur = c.auteur ? (c.source ? `<a href="${c.source}" target="_blank" rel="noopener">${echapper(c.auteur)}</a>` : echapper(c.auteur))
                              : `<span class="manque">Auteur à identifier</span>`;
      const url = c.lien_licence || lienLicence(c.licence);
      const licence = url ? `<a href="${url}" target="_blank" rel="noopener">${echapper(c.licence)}</a>` : echapper(c.licence);
      const dapres = c.dessin_de ? `<br><small>d'après <i>${echapper(c.dessin_de)}</i></small>` : "";
      return `<tr><td class="vignette"><span class="silh"><img src="Silhouettes/${c.fichier}" alt="" loading="lazy" onerror="this.remove()"></span></td><td class="espece">${echapper(c.nom)}${dapres}</td><td class="auteur">${auteur}</td><td class="licence">${licence}</td></tr>`;
    };
    blocSilh.innerHTML = `<details class="credits-famille"><summary>Toutes les silhouettes<small>${CREDITS_SILHOUETTES.length} silhouettes</small></summary>
      <table class="table-credits">${CREDITS_SILHOUETTES.map(ligneSilh).join("")}</table></details>`;
  }
  // Étape ML3 : les espèces qui attendent encore leur photo, avec un message déjà préparé pour chacune
  const attente = document.getElementById("photos-attendues");
  if (attente) {
    const lieuxAttente = e => { const t = territoiresJeu(e); return t.length <= 2 ? t.join(" · ") : t.length + " territoires"; };
    const sansPhoto = ESPECES.filter(e => !estRenseigne(e.photo)).sort((a, b) => a.nom_courant.localeCompare(b.nom_courant, "fr"));
    const lien = e => "mailto:myriade.encyclopedie@gmail.com?subject=" + encodeURIComponent("Myriade · Une photo pour : " + e.nom_courant)
      + "&body=" + encodeURIComponent("Espèce : " + e.nom_courant + "\nLieu et date de la photo :\nNom à afficher dans les crédits :\nJ'accepte que cette photo soit utilisée dans Myriade, avec mon nom dans les crédits : oui / non\n\n(Joignez la photo à ce message, dans sa taille d'origine.)\n");
    attente.hidden = !sansPhoto.length;
    attente.innerHTML = `<summary>Ces espèces attendent encore leur photo<small>${sansPhoto.length} espèces</small></summary>
      <ul class="participer-liste">${sansPhoto.map(e => `<li><span>${echapper(e.nom_courant)}<small>${echapper(lieuxAttente(e))}</small></span>
        <a href="${lien(e)}">Proposer</a></li>`).join("")}</ul>`;
  }
  document.getElementById("pied-apropos").textContent =
    `Un projet personnel, sans but commercial · ${ESPECES.length} espèces · ${tousLesTerritoires().length} territoires`
    + (typeof texteVersion === "function" && texteVersion() ? ` · ${texteVersion()}` : "");   // étape ML7 : le numéro de version   // étape PR5 (« Alpes » datait du début)
}

// Affiche la petite fenêtre : son coin en haut à gauche part du centre de la photo.
function ouvrirFenetre(carte, contenu) {
  const fenetre = document.getElementById("fenetre");
  fenetre.innerHTML = contenu;
  fenetre.style.setProperty("--couleur-classe", carte.style.getPropertyValue("--couleur-classe"));

  // Où est le CENTRE de la photo à l'écran ?
  const photo = carte.querySelector(".photo").getBoundingClientRect();
  const centreX = photo.left + photo.width / 2;
  const centreY = photo.top + photo.height / 2;
  const largeur = fenetre.offsetWidth, hauteur = fenetre.offsetHeight, marge = 12;

  // Le coin en haut à gauche de la fenêtre se pose sur le centre de la photo.
  let x = centreX, y = centreY;
  // Pas la place à droite ? On retourne la fenêtre : c'est son coin droit qui se pose au centre.
  if (x + largeur > window.innerWidth - marge) x = centreX - largeur;
  // Pas la place en bas ? Même chose vers le haut.
  if (y + hauteur > window.innerHeight - marge) y = centreY - hauteur;
  // Dernière sécurité : ne jamais sortir de l'écran
  if (x < marge) x = marge;
  if (y < marge) y = marge;

  fenetre.style.left = x + "px";
  fenetre.style.top = y + "px";
  fenetre.classList.add("visible");
}
function fermerFenetre() {
  document.getElementById("fenetre").classList.remove("visible");
}

// Les boutons de filtre : "Toutes" + un bouton par classe, avec le nombre
// d'espèces reconnues sur le total (ex : "Oiseaux 4/10").
function afficherFiltres() {
  // Étape 223 (20/10/2026, maquette B) : une colonne à gauche des cartes.
  // En haut, le territoire dans un menu ; dessous, une ligne par famille (point de couleur, nom, compteur) ;
  // en bas, l'option « Découvertes uniquement ».
  const zone = document.getElementById("filtres");
  zone.innerHTML = "";
  const blocT = document.createElement("label");
  blocT.className = "filtres-territoire";
  const couleurT = t => t === "Tous" ? "var(--territoire)" : (TERRITOIRES[t] ? TERRITOIRES[t].couleur : "#7a736a");
  blocT.innerHTML = `<span class="titre-filtre">Territoire</span><span class="menu-territoire"><i></i><select></select></span>`;
  const menu = blocT.querySelector("select");
  for (const t of ["Tous", ...tousLesTerritoires()]) {
    const o = document.createElement("option");
    o.value = t; o.textContent = t === "Tous" ? "Tous les territoires" : t;   // étape R182 (demande d'Aubin)
    if (filtreTerritoire === t) o.selected = true;
    menu.appendChild(o);
  }
  blocT.querySelector("i").style.background = couleurT(filtreTerritoire);
  menu.onchange = () => { filtreTerritoire = menu.value; filtreTerritoireChoisi = true; afficherEncyclopedie(); };   // étape 252
  zone.appendChild(blocT);

  const liste = document.createElement("nav");
  liste.className = "liste-familles";
  liste.innerHTML = `<span class="titre-filtre">Familles</span>`;   // étape 334 : un titre, et plus de points de couleur
  liste.setAttribute("aria-label", "Familles");
  function ajouterFiltre(cle, nom, couleur, especes) {
    const reconnues = especes.filter(estReconnue).length;
    const bouton = document.createElement("button");
    bouton.className = "filtre" + (filtreClasse === cle ? " actif" : "");
    bouton.style.setProperty("--couleur-classe", couleur || "var(--territoire)");
    bouton.innerHTML = `<i></i><span class="nom-filtre">${nom}</span><small>${reconnues} / ${especes.length}</small>`;
    bouton.onclick = () => { filtreClasse = cle; afficherEncyclopedie(); };
    liste.appendChild(bouton);
  }
  ajouterFiltre("Toutes", "Toutes", null, especesDuFiltre());
  for (const cle in CLASSES) {                              // "pour chaque classe de la liste"
    const especes = especesDuFiltre().filter(e => e.onglet === cle);
    if (especes.length) ajouterFiltre(cle, CLASSES[cle].nom, CLASSES[cle].couleur, especes);
  }
  zone.appendChild(liste);
  // Étape R245 (36.26, choix 26C du 17/11) : deux onglets « Toutes · N | Découvertes · N » sous les familles
  //   (remplacent l'interrupteur « Découvertes uniquement ») ; le choix est gardé, sans rien afficher à ce sujet.
  const dansFiltre = especesDuFiltre().filter(e => filtreClasse === "Toutes" || filtreClasse === "planches" || e.onglet === filtreClasse);
  zone.insertAdjacentHTML("beforeend", ongletsDecouvertes(dansFiltre.length, dansFiltre.filter(e => estReconnue(e)).length, decouvertesSeules, "ency-onglets-filtres"));
  zone.querySelectorAll(".ency-onglets-filtres [data-vue]").forEach(b => b.onclick = () => {
    decouvertesSeules = b.dataset.vue === "decouvertes"; sauvegarder(); afficherEncyclopedie();
  });
  // Étape 331 : les planches « Tout est lié » des lieux terminés, gardées dans l'encyclopédie.
  // Étape 334 (Revoir 8) : dans un bloc à part, sous les familles, pour ne plus les confondre avec un filtre.
  const pl = planchesDuFiltre();
  if (PLANCHES_DANS_ENCYCLO && pl.total) {   // étape K3 : retiré (choix « 7B »)
    const bloc = document.createElement("div");
    bloc.className = "bloc-planches";
    bloc.innerHTML = `<span class="titre-filtre">Les finales des lieux</span>`;
    const b = document.createElement("button");
    b.className = "filtre filtre-planches" + (filtreClasse === "planches" ? " actif" : "");
    b.innerHTML = `${typeof PICTO_LIENS !== "undefined" ? PICTO_LIENS : ""}<span class="nom-filtre">Planches des lieux</span><small>${pl.faites} / ${pl.total}</small>`;
    b.onclick = () => { filtreClasse = "planches"; afficherEncyclopedie(); };
    bloc.appendChild(b);
    zone.appendChild(bloc);
  }
}

// ==================================================================
// Étape M18 (07/11/2026, choix de l'utilisateur : maquettes « B + A ») — sur téléphone, la collection avec ses cases vides.
//   • « Toutes » = le sommaire : une ligne par famille (compteur, premières photos puis silhouettes, jauge) ;
//   • une famille = l'album : une case par espèce du territoire. Rencontrée : photo et nom. Pas encore : sa silhouette grisée,
//     sans nom ni photo ; toucher la case ouvre une piste (le lieu et l'expédition où la rencontrer).
//   Règle : une espèce pas encore rencontrée n'est jamais nommée. Ordinateur inchangé ; la recherche garde les cartes habituelles.
// ==================================================================
// Étape R245 (36.26) : les deux onglets « Toutes · N | Découvertes · N » (ordinateur et téléphone)
function ongletsDecouvertes(toutes, decouvertes, seules, classe) {
  return `<div class="ency-onglets ${classe}" role="tablist" aria-label="Espèces montrées">
      <button type="button" role="tab" data-vue="toutes" class="${seules ? "" : "actif"}" aria-selected="${!seules}">Toutes · ${toutes}</button><button type="button" role="tab" data-vue="decouvertes" class="${seules ? "actif" : ""}" aria-selected="${seules}">Découvertes · ${decouvertes}</button></div>`;
}
let bandeauAlbumOuvert = false;   // sur téléphone, la carte d'identité de la famille est repliée au départ (elle prend tout l'écran)
function collectionSurTelephone() { return typeof surTelephone === "function" && surTelephone(); }
const estRencontree = e => estReconnue(e);
function caseSilhouette(e, classe) {
  return `<span class="${classe}"><img src="${fichierSilhouette(e)}" alt="" loading="lazy" onerror="this.remove()"></span>`;
}
function sommaireCollection() {
  let html = "";
  for (const cle in CLASSES) {
    const especes = especesDuFiltre().filter(e => e.onglet === cle);
    if (!especes.length) continue;
    const off = e => typeof estOfferte === "function" && estOfferte(e);   // étape E2-12 : les offertes juste après les rencontrées
    const vues = especes.filter(estRencontree), autres = [...especes.filter(e => !estRencontree(e) && off(e)), ...especes.filter(e => !estRencontree(e) && !off(e))];
    const montrees = [...vues, ...autres].slice(0, 8);
    const ronds = montrees.map(e => estRencontree(e) || (typeof estOfferte === "function" && estOfferte(e))   // étape E2-12 : les offertes en photo
      ? `<span class="som-rond som-photo">${imgMini(e.photo, e.nom_courant)}</span>`
      : caseSilhouette(e, "som-rond som-vide")).join("");
    const reste = especes.length - montrees.length;
    html += `<button type="button" class="som-famille" data-cle="${cle}" style="--couleur-classe:${CLASSES[cle].couleur}">
        <span class="som-haut"><b>${CLASSES[cle].nom}</b><span><b>${vues.length}</b> sur ${especes.length} ›</span></span>
        <span class="som-ronds">${ronds}${reste > 0 ? `<small>+${reste}</small>` : ""}</span>
        <span class="som-jauge"><i style="width:${Math.round(100 * vues.length / especes.length)}%"></i></span></button>`;
  }
  return html ? `<div class="som-collection">${html}</div>` : `<p class="grille-vide">Aucune espèce ici pour l'instant.</p>`;
}
// Étape R180 (retour d'Aubin du 09/11) : plus de « ? ? ? » sous les silhouettes (la silhouette seule suffit) ;
// un petit bouton « Seulement mes espèces découvertes » cache les cases vides (réglage gardé dans le navigateur).
let albumMesEspeces = false;
try { albumMesEspeces = localStorage.getItem("myriade-album-mes-especes") === "oui"; } catch (e) { /* rien */ }
function albumFamille(cle) {
  const especes = especesDuFiltre().filter(e => e.onglet === cle);
  const vues = especes.filter(estRencontree).length;
  const offerte = e => typeof estOfferte === "function" && estOfferte(e);   // étape E2-12
  // Étape R260 (3A) : vos espèces d'abord, puis les « à reconnaître », puis les cases vides
  const montrees = [...especes.filter(estRencontree), ...especes.filter(e => !estRencontree(e) && offerte(e)),
                    ...(albumMesEspeces ? [] : especes.filter(e => !estRencontree(e) && !offerte(e)))];
  const cases = montrees.map(e => estRencontree(e) || offerte(e)
    ? `<button type="button" class="alb-case alb-vue${offerte(e) ? " alb-offerte" : ""}" data-nom="${echapper(e.nom_courant)}">${imgMini(e.photo || fichierSilhouette(e), e.nom_courant)}<span>${e.nom_courant}${offerte(e) ? "<small>À reconnaître</small>" : ""}</span></button>`
    : `<button type="button" class="alb-case alb-vide" data-piste="${echapper(e.nom_courant)}" aria-label="Espèce à découvrir">${caseSilhouette(e, "alb-sil")}</button>`).join("")
    || `<p class="alb-rien">Aucune espèce découverte ici pour l'instant.</p>`;
  const nbDecouvertes = especes.filter(e => estRencontree(e) || offerte(e)).length;
  const bouton = ongletsDecouvertes(especes.length, nbDecouvertes, albumMesEspeces, "alb-onglets");   // étape R245 (36.26)
  return `<section class="groupe-famille album-famille" style="--couleur-classe:${CLASSES[cle].couleur}">
      <button type="button" class="alb-retour">← Toutes les familles</button>
      <h2 class="titre-famille">${CLASSES[cle].nom}<small>${vues} / ${especes.length}</small></h2>
      <div class="alb-jauge"><i style="width:${especes.length ? Math.round(100 * vues / especes.length) : 0}%"></i></div>
      ${bouton}
      ${FAMILLES_INFO[cle] ? `<details class="bandeau-famille"${bandeauAlbumOuvert ? " open" : ""}><summary>${FAMILLES_INFO[cle].accroche}</summary>${htmlSignesFamille(cle)}</details>` : ""}
      <div class="alb-grille">${cases}</div></section>`;
}
// Où rencontrer une espèce : les lieux (et l'expédition) qui la contiennent, les lieux ouverts d'abord.
function pistesEspece(e, tous) {   // étape R258 : tous = chercher dans tous les territoires (liens de la fiche, pistes à suivre)
  const terrs = tous || filtreTerritoire === "Tous" ? [territoireActif(), ...tousLesTerritoires()] : [filtreTerritoire];
  const ouverts = typeof territoiresOuverts === "function" ? territoiresOuverts() : [];
  const vus = new Set(), pistes = [];
  for (const t of terrs) {
    if (vus.has(t)) continue; vus.add(t);
    for (const c of lieuxDe(t)) {
      const x = expeditionsDuChapitre(t, c.nom).find(x => x.liste.some(s => s.nom_courant === e.nom_courant));
      if (x) pistes.push({ t, c, x, ouvert: ouverts.includes(t) && chapitreOuvert(t, c) });
    }
  }
  return pistes.sort((a, b) => (b.ouvert - a.ouvert));
}
function fermerPiste() {
  const p = document.getElementById("ency-piste");
  if (p) p.classList.remove("ouvert");
}
function ouvrirPiste(e, tous) {
  let p = document.getElementById("ency-piste");
  if (!p) {
    p = document.createElement("div");
    p.id = "ency-piste";
    p.innerHTML = `<div class="ep-fond"></div><div class="ep-panneau" role="dialog" aria-modal="true" aria-labelledby="ep-titre"></div>`;
    document.body.appendChild(p);
    p.querySelector(".ep-fond").onclick = fermerPiste;
  }
  const pistes = pistesEspece(e, tous), ouverte = pistes.find(x => x.ouvert), premiere = ouverte || pistes[0];
  const trouvees = questionsPossibles(e).filter(q => nbBonnes(e, q.champ) >= 1).length;
  let ou = "";
  if (premiere) {
    const autres = pistes.filter(x => x !== premiere && x.c.nom !== premiere.c.nom).length;
    ou = `<p class="ep-ou">À rencontrer ${(tous || filtreTerritoire === "Tous") && premiere.t !== territoireActif() ? `(${echapper(premiere.t)}) ` : ""}: <b>${echapper(premiere.c.nom)}</b>,
          dans l'expédition « ${echapper(premiere.x.titre)} »${autres ? `, et dans ${autres} autre${autres > 1 ? "s" : ""} lieu${autres > 1 ? "x" : ""}` : ""}.</p>`
      + (premiere.ouvert ? `<button type="button" class="ep-aller">Aller : ${echapper(premiere.c.nom)} ▶</button>`
                         : `<p class="ep-ferme">Ce lieu s'ouvrira plus tard, au fil de vos expéditions.</p>`);
  }
  p.querySelector(".ep-panneau").innerHTML = `
      <button type="button" id="ency-piste-fermer" class="ep-fermer" aria-label="Fermer">×</button>
      <div class="ep-haut">${caseSilhouette(e, "ep-sil")}
        <div><h3 id="ep-titre">Une espèce à découvrir</h3><p>${echapper(e.nom_affichage_groupe || classeDe(e).nom)}${trouvees ? ` · ${trouvees} caractéristique${trouvees > 1 ? "s" : ""} déjà trouvée${trouvees > 1 ? "s" : ""}` : ""}</p></div></div>
      ${ou}`;
  p.querySelector("#ency-piste-fermer").onclick = fermerPiste;
  const aller = p.querySelector(".ep-aller");
  if (aller) aller.onclick = () => {
    fermerPiste();
    suivrePiste(e, "");   // R259 (2B) : tout droit à l'expédition, avec le bandeau « Vous suivez une piste »
  };
  p.classList.add("ouvert");
  p.querySelector(".ep-fermer").focus();
}
function afficherCollectionTelephone(grille) {
  grille.innerHTML = filtreClasse === "Toutes" ? htmlPistesASuivre() + couverturesFamilles() : albumFamille(filtreClasse);   // étape R258 (5B) ; R260 (2A) : les couvertures
  brancherPistesASuivre(grille);
  for (const b of grille.querySelectorAll(".som-famille")) b.onclick = () => { filtreClasse = b.dataset.cle; afficherEncyclopedie(); window.scrollTo(0, 0); };
  const retour = grille.querySelector(".alb-retour");
  if (retour) retour.onclick = () => { filtreClasse = "Toutes"; afficherEncyclopedie(); window.scrollTo(0, 0); };
  for (const b of grille.querySelectorAll(".alb-vue")) b.onclick = () => ouvrirPageEspece(ESPECES.find(e => e.nom_courant === b.dataset.nom));
  for (const b of grille.querySelectorAll(".alb-vide")) b.onclick = () => ouvrirPiste(ESPECES.find(e => e.nom_courant === b.dataset.piste));
  grille.querySelectorAll(".alb-onglets [data-vue]").forEach(b => b.onclick = () => {   // étape R245 (36.26) : les deux onglets
    albumMesEspeces = b.dataset.vue === "decouvertes";
    try { localStorage.setItem("myriade-album-mes-especes", albumMesEspeces ? "oui" : "non"); } catch (e) { /* rien */ }
    afficherEncyclopedie();
  });
  const bandeau = grille.querySelector(".bandeau-famille");
  if (bandeau) bandeau.ontoggle = () => { bandeauAlbumOuvert = bandeau.open; };
  // Étape R161 (08/11, choix d'Aubin : sommaire en cartes + album B) : dans l'album, la bande des familles sert de titre
  // et de navigation ; la famille choisie est ramenée au milieu de la bande.
  const bande = document.querySelector("#filtres .liste-familles"), active = bande && bande.querySelector(".filtre.actif");
  if (bande && active && filtreClasse !== "Toutes") bande.scrollLeft = Math.max(0, active.offsetLeft - bande.offsetLeft - (bande.clientWidth - active.offsetWidth) / 2);
}

// ==================================================================
// Étape R258 (18/11/2026, Notion 24, choix d'Aubin « 2A · 3A · 4A · 5B · 6A · 7A ») — l'Encyclopédie qui renvoie sur le terrain.
//   Vision : « On découvre sur le terrain, on approfondit dans le carnet, et le carnet renvoie sur le terrain. »
//   • la fiche en 4 parties : La reconnaître · Ce que vous savez · Ses liens · Où la revoir ;
//   • « Ses liens » : ce qu'elle mange, qui la mange, ses sosies, les espèces des mêmes lieux. Déjà rencontrée = sa photo (sa fiche) ;
//     pas encore = sa silhouette et son groupe, sans le nom (la piste : le lieu où la rencontrer) ;
//   • le bouton « Compléter sa fiche » (l'ancien jeu « Compléter le carnet », pour cette espèce seule) ;
//   • la bande « Pistes à suivre » en haut de l'Encyclopédie ; la bulle « Fiche complète ».
//   Ce qu'elle mange et qui la mange ne s'affichent qu'une fois la case de la fiche trouvée (sinon ce serait la réponse).
// ==================================================================
let pileFiches = [], ficheParLien = false;
const estVueFiche = e => estRencontree(e) || (typeof estOfferte === "function" && estOfferte(e));

// Qui mange qui, pour tout le jeu, calculé une fois : d'après les proies de chacune et les prédateurs de chacune.
//   Un nom de la fiche ne compte que s'il désigne une seule espèce du jeu (« Renard » → le renard roux ; « Grenouille » → rien).
let grapheMange = null;
function construireGrapheMange() {
  if (grapheMange) return grapheMange;
  const cache = new Map(), une = it => {
    const k = sansAccent(it);
    if (!cache.has(k)) { const m = especesDuNom(it, ESPECES); cache.set(k, m.length === 1 ? m[0] : null); }
    return cache.get(k);
  };
  const mange = new Map(), par = new Map(), ajoute = (a, b) => {   // a mange b
    if (!a || !b || a === b) return;
    if (!mange.has(a)) mange.set(a, new Set()); mange.get(a).add(b);
    if (!par.has(b)) par.set(b, new Set()); par.get(b).add(a);
  };
  for (const o of ESPECES) {
    for (const it of itemsListe(o, "proies")) ajoute(o, une(it));
    for (const it of itemsListe(o, "predateurs")) ajoute(une(it), o);
  }
  grapheMange = { mange, par };
  return grapheMange;
}
// Les lieux de chaque espèce (et ses voisines d'expédition), calculés une fois
let indexLieux = null;
function construireIndexLieux() {
  if (indexLieux) return indexLieux;
  const lieux = new Map(), voisins = new Map();
  for (const t of tousLesTerritoires()) for (const c of (typeof lieuxDe === "function" ? lieuxDe(t) : [])) for (const x of expeditionsDuChapitre(t, c.nom)) {
    for (const s of x.liste) {
      if (!lieux.has(s)) lieux.set(s, []);
      const l = lieux.get(s), d = l.find(y => y.t === t && y.c === c);
      if (d) { d.n++; d.xs.push(x); } else l.push({ t, c, n: 1, xs: [x] });   // R259 : les expéditions, pour suivre une piste
      if (!voisins.has(s)) voisins.set(s, new Map());
      for (const o of x.liste) if (o !== s) voisins.get(s).set(o, (voisins.get(s).get(o) || 0) + 1);
    }
  }
  indexLieux = { lieux, voisins };
  return indexLieux;
}
function lieuxDeLEspece(e) {
  const ouverts = typeof territoiresOuverts === "function" ? territoiresOuverts() : [];
  return (construireIndexLieux().lieux.get(e) || []).map(l => ({ ...l, ouvert: ouverts.includes(l.t) && chapitreOuvert(l.t, l.c), tOuvert: ouverts.includes(l.t) }));
}
const memoLiensBruts = new Map();   // R259 (lenteur) : la partie fixe des liens, calculée une fois par espèce
function liensBruts(e) {
  if (!memoLiensBruts.has(e)) {
    const g = construireGrapheMange(), v = construireIndexLieux().voisins.get(e) || new Map();
    const mange = [...(g.mange.get(e) || [])], par = [...(g.par.get(e) || [])];
    const sosies = typeof sosiesDe === "function" ? sosiesDe(e) : [];
    const deja = new Set([...mange, ...par, ...sosies]);
    const autour = [...v.entries()].filter(([o]) => !deja.has(o)).sort((a, b) => b[1] - a[1]).map(([o]) => o);
    memoLiensBruts.set(e, { mange, par, sosies, autour });
  }
  return memoLiensBruts.get(e);
}
function liensFiche(e) {
  const tri = l => [...l].sort((a, b) => estVueFiche(b) - estVueFiche(a));
  const r = liensBruts(e), mange = tri(r.mange), par = tri(r.par), sosies = tri(r.sosies), autour = r.autour;
  const inconnues = autour.filter(o => !estVueFiche(o)).slice(0, 3);   // les mêmes lieux : quelques-unes à découvrir, puis les connues
  const voisines = [...autour.filter(estVueFiche).slice(0, 6 - inconnues.length), ...inconnues];
  return { mange, par, sosies, voisines };
}
const caseTrouvee = (e, champ) => nbBonnes(e, champ) >= 1;
function rondLien(o, phrase) {
  if (estVueFiche(o)) return `<button type="button" class="pl-rond pl-vu" data-fiche="${echapper(o.nom_courant)}">${imgMini(o.photo || fichierSilhouette(o), o.nom_courant)}<small>${echapper(o.nom_courant)}</small></button>`;
  return `<button type="button" class="pl-rond pl-sil" data-piste="${echapper(o.nom_courant)}" data-phrase="${echapper(phrase || "")}" aria-label="Espèce à découvrir">${caseSilhouette(o, "pl-silh")}<small>${echapper(minuscule(o.nom_affichage_groupe || classeDe(o).nom))}</small></button>`;
}
function rangLien(lib, liste, cachee, phrase) {
  if (!liste.length) return "";
  const corps = cachee
    ? `<span class="pl-cache"><b>?</b> À découvrir : complétez sa fiche</span>`
    : `<div class="pl-ronds">${liste.slice(0, 8).map(o => rondLien(o, phrase)).join("")}</div>`;
  return `<div class="pl-rang"><span class="pl-lib">${lib}</span>${corps}</div>`;
}
function blocLiensFiche(e) {
  const l = liensFiche(e), p = pe(e);
  const v = votreEspece(e);   // R259 : la phrase du bandeau « Vous suivez une piste »
  const h = rangLien(`${p.Elle} mange`, l.mange, !caseTrouvee(e, "proies"), `${majuscule(v)} la mange.`)
    + rangLien(`Mangé${p.e} par`, l.par, !caseTrouvee(e, "predateurs"), `Elle mange ${v}.`)
    + rangLien("À ne pas confondre", l.sosies, false, `Elle ressemble à ${v}.`)
    + rangLien("Dans les mêmes lieux", l.voisines, false, `Elle vit dans les mêmes lieux que ${v}.`);
  return h ? `<section class="pe-partie pe-p-liens"><h2 class="pe-h">Ses liens</h2>${h}</section>` : "";
}
function blocLieuxFiche(e) {
  const l = lieuxDeLEspece(e);
  if (!l.length) return "";
  const ici = territoireActif();
  const ouverts = l.filter(x => x.ouvert).sort((a, b) => (b.t === ici) - (a.t === ici));
  const fermes = l.filter(x => x.tOuvert && !x.ouvert);
  const terrFermes = [...new Set(l.filter(x => !x.tOuvert).map(x => x.t))];
  const ligne = x => `<button type="button" class="pl-lieu" data-t="${echapper(x.t)}" data-lieu="${echapper(x.c.nom)}"><span><b>${echapper(x.c.nom)}</b>`
    + `<small>${x.t !== ici ? `${echapper(x.t)} · ` : ""}${x.n} expédition${x.n > 1 ? "s" : ""}</small></span><span aria-hidden="true">▶</span></button>`;
  return `<div class="pl-lieux">${ouverts.map(ligne).join("")}`
    + (fermes.length ? `<p class="pl-ferme">${fermes.length > 1 ? "S'ouvriront" : "S'ouvrira"} plus tard : ${fermes.map(x => `<b>${echapper(x.c.nom)}</b>`).join(", ")}</p>` : "")
    + (terrFermes.length ? `<p class="pl-ferme">Territoire${terrFermes.length > 1 ? "s" : ""} pas encore ouvert${terrFermes.length > 1 ? "s" : ""} : ${terrFermes.map(t => `<b>${echapper(t)}</b>`).join(", ")}</p>` : "") + `</div>`;
}
function ouvrirFicheParLien(o) {
  if (especeOuverte) pileFiches.push(especeOuverte);
  ficheParLien = true;
  ouvrirPageEspece(o);
  window.scrollTo(0, 0);
}
function allerAuLieu(t, nom) {
  if (t !== territoireActif()) changerTerritoire(t);
  ouvrirLieu(t, nom);
}
function brancherLiensFiche(zone, e) {
  zone.querySelectorAll(".pl-vu[data-fiche]").forEach(b => b.onclick = () => ouvrirFicheParLien(especeParNom(b.dataset.fiche)));
  zone.querySelectorAll(".pl-sil[data-piste]").forEach(b => b.onclick = () => suivrePiste(especeParNom(b.dataset.piste), b.dataset.phrase));   // R259 (2B)
  zone.querySelectorAll(".pl-lieu[data-lieu]").forEach(b => b.onclick = () => allerAuLieu(b.dataset.t, b.dataset.lieu));
}

// Le bouton du haut de la fiche (4A) : « Compléter sa fiche » tant qu'il reste à découvrir ; sinon « Refaire une Rencontre »
function boutonFiche(e, n) {
  const enRencontre = champsReste(e).length, aDemander = resteCarnet([e]);
  const reste = k => `encore ${k} chose${k > 1 ? "s" : ""} à découvrir`;
  // Doute tranché en codant (à relire) : la Rencontre depuis la fiche posait déjà ce qui restait (R129), sauf l'allure ;
  //   « Compléter sa fiche » pose tout. Un seul bouton tant qu'il reste quelque chose, pour ne pas garder deux portes.
  if (aDemander) return `<button class="pe-rencontre pe-completer" id="pe-fiche">${picto("carnet")}Compléter sa fiche<small>${reste(aDemander)}</small></button>`;
  if (enRencontre) return `<button class="pe-rencontre" id="pe-rencontre">${picto("rencontre")}Faire une Rencontre<small>${majuscule(reste(n))}</small></button>`;
  return `<button class="pe-rencontre" id="pe-rencontre">${picto("rencontre")}Refaire une Rencontre<small>pour revoir ses caractéristiques</small></button>`;
}
// « Compléter sa fiche » : le moteur de « Compléter le carnet » (R167), sur cette seule espèce ; 10 questions au plus
function lancerFicheEspece(e) {
  const reste = resteCarnet([e]);
  if (!reste) { afficherBulle("Rien de plus à découvrir sur cette espèce ici"); return; }
  const d = { cle: "fiche|" + e.nom_courant, nom: e.nom_courant, especes: [e], ouvert: true };
  jeuChoisi = "revision"; revisionsSeules = false; photosSeules = false; questionsClassique = Math.min(QUESTIONS_REVISION, reste);
  territoiresDefi = [territoireActif()]; famillesDefi = [e.onglet];
  depuisArcade = false; modeLibre = false;
  lancementDirect = true;
  montrer("jouer");
  lancementDirect = false;
  document.getElementById("bouton-territoire-defi").textContent = "Retour à la fiche";
  demarrerDefi(d, { jouer: true, carnet: true });
  questionsClassique = QUESTIONS_REVISION;   // la longueur choisie ailleurs ne change pas
  if (defi) defi.ficheEspece = e.nom_courant;
  // R259 : depuis l'Accueil, compléter la fiche de l'espèce du jour compte comme sa rencontre du jour (comme ouvrir sa fiche, R236)
  if (typeof especeDuJour === "function" && typeof validerEspeceDuJour === "function") { const j = especeDuJour(); if (j && j.nom_courant === e.nom_courant && validerEspeceDuJour(e.nom_courant, 500)) sauvegarder(); }
  if (typeof majHautJeu === "function") majHautJeu();   // « ← Fiche »
}

// « Fiche complète » (7A) : toutes les cases d'une espèce reconnue sont trouvées. Une bulle, une fois ; la mention sur sa fiche.
function ficheComplete(e) {
  if (!estReconnue(e)) return false;
  const ch = champsDe(e).filter(x => x !== IDENTIFICATION);
  return ch.length > 0 && ch.every(x => nbBonnes(e, x) >= 1);
}
function verifierFichesCompletes(liste) {
  if (!suivi) return;
  if (!suivi.fichesCompletes || !suivi.fichesCompletesR258) {   // rien ne se fête d'un coup : celles déjà complètes sont notées sans bulle
    suivi.fichesCompletes = suivi.fichesCompletes || {};
    for (const e of ESPECES) if (ficheComplete(e)) suivi.fichesCompletes[e.nom_courant] = true;
    suivi.fichesCompletesR258 = true;
    sauvegarder();
    return;
  }
  const nouv = (liste || ESPECES).filter(e => e && !suivi.fichesCompletes[e.nom_courant] && ficheComplete(e));
  if (!nouv.length) return;
  for (const e of nouv) suivi.fichesCompletes[e.nom_courant] = true;
  sauvegarder();
  const nom = deLEspece;
  afficherBulle(nouv.length === 1 ? `Fiche complète : vous savez tout ce que le carnet dit ${nom(nouv[0])}.`
                                  : `${nouv.length} fiches complètes : vous savez tout ce que le carnet dit de ces espèces.`, 4200);
}

// ---- Étape R259 (18/11, série 2, choix « 2B · 3C ») ----
//   Critère : « Une piste mène jusqu'à l'espèce : le joueur arrive là où il peut la rencontrer, sait laquelle chercher, et la piste
//   se termine par un petit moment quand il la trouve. Compléter une fiche se propose aux moments où le joueur regarde ses espèces,
//   d'un toucher, sans jamais faire « devoir ». »
function deLEspece(n) { const m = minuscule(n.nom_courant); return (deElide(m) === "d'" ? "de l'" : n.genre_nom === "masculin" ? "du " : "de la ") + m; }
function leLEspece(n) { const m = minuscule(n.nom_courant); return (deElide(m) === "d'" ? "l'" : n.genre_nom === "masculin" ? "le " : "la ") + m; }
function votreEspece(k) { return `votre ${minuscule(k.nom_courant)}`; }

// Suivre une piste (2B) : tout droit à l'expédition ouverte qui contient l'espèce ; la piste est notée (suivi.piste) jusqu'à sa rencontre
// L'expédition ouverte où rencontrer l'espèce (le territoire où l'on est d'abord), ou null
function expeditionPourPiste(u) {
  const l = lieuxDeLEspece(u).filter(x => x.ouvert).sort((a, b) => (b.t === territoireActif()) - (a.t === territoireActif()));
  for (const y of l) { const ouv = expeditionsOuvertes(y.t), x = y.xs.find(z => ouv.has(z.id)); if (x) return { t: y.t, c: y.c, x }; }
  return null;
}
function suivrePiste(u, phrase) {
  if (!u) return;
  const cible = expeditionPourPiste(u);
  if (!cible) {   // pas encore d'expédition ouverte qui la contient : on le dit, sans envoyer sur une page sans suite
    const l = lieuxDeLEspece(u), o = l.find(x => x.ouvert) || l[0];
    fermerPiste();
    afficherBulle(o ? `Elle vit à ${o.c.nom} : son expédition s'ouvrira au fil de vos expéditions.` : "Elle vit dans un lieu qui s'ouvrira plus tard.", 4000);
    return;
  }
  suivi.piste = { nom: u.nom_courant, exp: cible.x.id, phrase: phrase || "" };
  sauvegarder();
  fermerPiste();
  if (cible.t !== territoireActif()) changerTerritoire(cible.t);
  ouvrirExpedition(cible.x);
}
function pisteEnCours() { return suivi && suivi.piste ? especeParNom(suivi.piste.nom) : null; }
// La piste se termine quand l'espèce est rencontrée : une bulle sobre. Rend true si la bulle est montrée.
function verifierPiste() {
  const u = pisteEnCours();
  if (!suivi || !suivi.piste) return false;
  if (!u) { delete suivi.piste; sauvegarder(); return false; }
  if (!estVueFiche(u)) return false;
  delete suivi.piste;
  sauvegarder();
  afficherBulle(`Piste trouvée : c'était ${leLEspece(u)}.`, 4000);
  return true;
}
// Le bandeau de la page de l'expédition (17)
function bandeauPiste(x) {
  const u = pisteEnCours();
  if (!u || !suivi.piste || suivi.piste.exp !== x.id || estVueFiche(u) || !x.liste.includes(u)) return "";
  return `<div class="exp-piste"><span class="exp-piste-sil">${caseSilhouette(u, "ps-sil")}</span>
      <span><b>Vous suivez une piste</b>${suivi.piste.phrase ? ` ${echapper(suivi.piste.phrase)}` : ""} Elle est parmi les espèces de cette expédition : son rond est en pointillé.</span>
      <button type="button" class="exp-piste-stop" id="exp-piste-stop">Ne plus suivre</button></div>`;
}
function brancherBandeauPiste() {
  const b = document.getElementById("exp-piste-stop");
  if (b) b.onclick = () => { delete suivi.piste; sauvegarder(); dessinerEcranExpedition(); };
}
// En fin de partie : la piste, puis « Fiche complète » (une bulle après l'autre)
function bullesFinDePartie() {
  const piste = verifierPiste();
  setTimeout(() => verifierFichesCompletes(), piste ? 4300 : 0);
}

// Les fiches les plus près d'être complètes (3C, défi du jour, « Fiche suivante »)
function fichesPresqueCompletes(n, sauf) {
  const l = [];
  for (const e of ESPECES) {
    if (e === sauf || !estReconnue(e) || !estRenseigne(e.photo)) continue;
    const k = resteCarnet([e]);
    if (!k) continue;
    const ch = champsDe(e).filter(x => x !== IDENTIFICATION), t = ch.filter(x => nbBonnes(e, x) >= 1).length;
    l.push({ e, k, part: ch.length ? t / ch.length : 0 });
  }
  return l.sort((a, b) => a.k - b.k || b.part - a.part).slice(0, n);
}

// La bande « À suivre » en haut de l'Encyclopédie (3C) : 2 fiches presque complètes + 1 piste
function pistesASuivre(n = 1) {
  const vues = new Set(), cand = [], memoVue = new Map();
  const vue = u => { if (!memoVue.has(u)) memoVue.set(u, estVueFiche(u)); return memoVue.get(u); };   // R259 (lenteur)
  const ajouter = (u, k, sorte) => { if (vues.has(u) || vue(u)) return; vues.add(u); cand.push({ u, k, sorte }); };
  for (const k of ESPECES) {
    if (!vue(k) || !estReconnue(k)) continue;
    const l = liensBruts(k);
    for (const u of l.sosies) ajouter(u, k, "sosie");
    if (caseTrouvee(k, "predateurs")) for (const u of l.par) ajouter(u, k, "par");
    if (caseTrouvee(k, "proies")) for (const u of l.mange) ajouter(u, k, "mange");
    let nv = 0; for (const u of l.autour) { if (nv >= 3) break; if (!vue(u)) { ajouter(u, k, "voisin"); nv++; } }
  }
  if (!cand.length) return [];
  const jour = typeof jourDefis === "function" ? jourDefis() : "";
  const h = t => { let x = 0; for (const ch of t) x = (x * 31 + ch.charCodeAt(0)) | 0; return x; };
  const rang = { sosie: 0, par: 1, mange: 2, voisin: 3 };
  cand.sort((a, b) => rang[a.sorte] - rang[b.sorte] || h(jour + a.u.nom_courant) - h(jour + b.u.nom_courant));
  // R259 : seulement les pistes qui mènent à une expédition déjà ouverte (sinon on arriverait « sans la suite ») ;
  //   on ne vérifie que ce qu'il faut (le calcul est le plus lent), dans l'ordre
  const res = [];
  for (const c of cand) { if (res.length >= n) break; if (expeditionPourPiste(c.u)) res.push(c); }
  return res;
}
const PHRASES_PISTE = { sosie: c => `Elle ressemble à ${votreEspece(c.k)}.`, par: c => `Elle mange ${votreEspece(c.k)}.`,
                        mange: c => `${majuscule(votreEspece(c.k))} la mange.`, voisin: c => `Elle vit dans les mêmes lieux que ${votreEspece(c.k)}.` };
function htmlPistesASuivre() {
  const fiches = fichesPresqueCompletes(2);
  const p = pistesASuivre()[0];
  if (!fiches.length && !p) return "";
  const lignesF = fiches.map(f => {
    const pct = Math.round(100 * f.part);
    return `<button type="button" class="ps-ligne ps-fiche" data-fiche="${echapper(f.e.nom_courant)}">${imgMini(f.e.photo, f.e.nom_courant, "ps-photo")}`
      + `<span><b>${echapper(f.e.nom_courant)}</b><i class="ps-jauge"><b style="width:${pct}%"></b></i></span>`
      + `<em>encore ${f.k} <span aria-hidden="true">▶</span></em></button>`;
  }).join("");
  const lieu = p ? expeditionPourPiste(p.u) : null;
  const ligneP = p ? `<button type="button" class="ps-ligne ps-piste" data-piste="${echapper(p.u.nom_courant)}" data-phrase="${echapper(PHRASES_PISTE[p.sorte](p))}">${caseSilhouette(p.u, "ps-sil")}`
      + `<span><b>Une espèce à découvrir</b><small>${echapper(PHRASES_PISTE[p.sorte](p))}</small><small class="ps-lieu">${echapper(lieu.c.nom)}</small></span>`
      + `<em><span aria-hidden="true">▶</span></em></button>` : "";
  return `<section class="pistes-suivre"><h2>À suivre</h2>${lignesF}${ligneP}</section>`;
}
function brancherPistesASuivre(zone) {
  zone.querySelectorAll(".ps-fiche[data-fiche]").forEach(b => b.onclick = () => lancerFicheEspece(especeParNom(b.dataset.fiche)));
  zone.querySelectorAll(".ps-piste[data-piste]").forEach(b => b.onclick = () => suivrePiste(especeParNom(b.dataset.piste), b.dataset.phrase));
}

// ==================================================================
// Étape R260 (18/11/2026, « Une Encyclopédie plus avenante », série 1 : « 2A · 3A · 4A ») — téléphone.
//   Critère : « En ouvrant l'Encyclopédie, on a envie de feuilleter : on voit d'abord ses propres animaux, en photos assez grandes
//   pour être belles ; chaque famille se reconnaît d'un coup d'œil ; ce qui manque donne envie sans faire liste de manque. »
//   L'entrée : une couverture par famille = la photo de votre espèce la mieux complétée (votre espèce favorite si elle en est),
//   nom et avancée posés dessus ; une famille encore vide reste sobre, sans rangée de silhouettes.
// ==================================================================
function especeDeCouverture(especes) {
  const vues = especes.filter(e => estRencontree(e) && estRenseigne(e.photo));
  if (!vues.length) return null;
  const fav = vues.find(e => e.nom_courant === especeFavorite);
  if (fav) return fav;
  const part = e => { const ch = champsDe(e).filter(x => x !== IDENTIFICATION); return ch.length ? ch.filter(x => nbBonnes(e, x) >= 1).length / ch.length : 0; };
  return vues.map(e => ({ e, p: part(e) })).sort((a, b) => b.p - a.p || a.e.nom_courant.localeCompare(b.e.nom_courant))[0].e;
}
function couverturesFamilles() {
  let html = "";
  for (const cle in CLASSES) {
    const especes = especesDuFiltre().filter(e => e.onglet === cle);
    if (!especes.length) continue;
    const vues = especes.filter(estRencontree).length, c = especeDeCouverture(especes);
    const pct = Math.round(100 * vues / especes.length);
    html += `<button type="button" class="som-famille couv-famille${c ? "" : " vide"}" data-cle="${cle}" style="--couleur-classe:${CLASSES[cle].couleur}">`
      + (c ? `${imgMini(c.photo, "", "couv-photo")}<span class="couv-voile" aria-hidden="true"></span>` : "")
      + `<span class="couv-texte"><b>${CLASSES[cle].nom}</b><small>${vues ? `${vues} sur ${especes.length}` : `Aucune encore · ${especes.length} à découvrir`}</small></span>`
      + `<span class="couv-jauge"><i style="width:${pct}%"></i></span>${c ? `<span class="couv-legende">${echapper(c.nom_courant)}</span>` : ""}</button>`;
  }
  return html ? `<h3 class="couv-titre">Vos familles</h3><div class="som-collection couv-collection">${html}</div>` : `<p class="grille-vide">Aucune espèce ici pour l'instant.</p>`;
}

// ==================================================================
// Étape R260b (18/11/2026, « La fiche de l'espèce plus avenante », série 1 : « 2A · 3A · 4A ») — téléphone.
//   Critère : « La fiche s'ouvre sur l'animal : une grande photo qui donne envie, le nom bien posé, l'essentiel d'un coup d'œil
//   (son statut, ce qui reste à découvrir, le bouton pour compléter). Le reste se lit sans effort, en parties bien séparées. »
//   La photo en couverture (bord à bord), avec la famille, le nom et le nom scientifique posés dessus, « ← » et l'étoile ;
//   le statut en petites étiquettes ; chaque partie dans sa carte blanche ; « Ce que vous savez » en tuiles à pictogramme.
//   Sur ordinateur, ces éléments sont cachés : rien ne change.
// ==================================================================
function couvertureFiche(e, c) {
  const fav = especeFavorite === e.nom_courant;
  return `<button type="button" class="pe-couv-retour" aria-label="Retour">←</button>`
    + (estReconnue(e) ? `<button type="button" class="pe-couv-fav${fav ? " choisie" : ""}" aria-label="${fav ? "Votre espèce favorite" : "En faire votre espèce favorite"}">${fav ? "★" : "☆"}</button>` : "")
    + `<span class="pe-couv-texte"><span class="pe-couv-fam" style="--c:${c.couleur}">${echapper(c.nom)}${estRenseigne(e.nom_affichage_groupe) ? ` · ${echapper(e.nom_affichage_groupe)}` : ""}</span>`
    + `<b>${echapper(e.nom_courant)}</b><i>${echapper(e.nom_scientifique || "")}</i></span>`;
}
function etiquettesFiche(e, termine, trouves, total) {
  const complete = total > 0 && trouves >= total;
  const palier = termine >= 1 ? NOMS_MEDAILLE[termine].replace(/^Espèce /, "") : majuscule(statut(e));
  return `<div class="pe-etiquettes"><span class="pe-et-statut">✓ ${echapper(majuscule(palier))}</span>`
    + `<span>${complete ? "Fiche complète ✓" : `${trouves} / ${total} sur sa fiche`}</span>`
    + (especeFavorite === e.nom_courant ? `<span class="pe-et-fav">★ Votre favorite</span>` : "") + `</div>`;
}
